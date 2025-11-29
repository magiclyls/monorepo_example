<script setup lang='ts'>
import type { ISportEventList } from '@tg/types'
import { IconEmpty1 } from '@tg/icons';
import type { IOutrightDataGroupedByLeague, ISportDataGroupedByLeague } from '~/types'
import { ApiSportEventList, ApiSportOutrightList } from '@tg/apis'

defineOptions({
  name: 'AppSportsPageLobby',
})
const { t } = useI18n()
const sportsStore = useSportsStore()
const {
  lobbyCurrentEventType,
  currentLobbySiNav,
  currentLobbyBetType,
  sportsEventTypeList,
  hotEventNavs,
  todayEventNavs,
  sportLiveNavs,
  earlyEventNavs,
  chuanEventNavs,
  outrightNavs,
} = storeToRefs(sportsStore)
const { isZhcn } = storeToRefs(useLanguageStore())
const { isMobile } = storeToRefs(useWindowStore())
/** 标准盘模式 -- 样式 */
const { bool: isStandard } = useBoolean(true)
const {
  VITE_SPORT_EVENT_PAGE_SIZE,
  VITE_SPORT_EVENT_PAGE_SIZE_MAX,
} = getEnv()
/** 定时更新count */
const {
  startTimer: startCount,
  stopTimer: stopCount,
} = useSportsDataUpdate(sportsStore.runSportsCount, 60, true)
const {
  bool: switchLoading,
  setTrue: switchLoadingTrue,
  setFalse: switchLoadingFalse,
} = useBoolean(false)
const {
  bool: moreLoading,
  setTrue: moreLoadingTrue,
  setFalse: moreLoadingFalse,
} = useBoolean(false)

let timer: any = null
const marketNum = ref(1)
const page = ref(1)
const pageSize = ref(+VITE_SPORT_EVENT_PAGE_SIZE)
const total = ref(0)
const curTotal = ref(0)
const list = ref<ISportDataGroupedByLeague>([])
const outrightList = ref<IOutrightDataGroupedByLeague>([])

// 根据球种的盘口类别列表
const baseTypeOptions = computed(() => {
  return sportsStore.getSportsBetTypeListBySi(currentLobbySiNav.value)
})
const isToday = computed(() => lobbyCurrentEventType.value === EnumSportsEventType.TODAY)
const isHot = computed(() => lobbyCurrentEventType.value === EnumSportsEventType.HOT)
const isLive = computed(() => lobbyCurrentEventType.value === EnumSportsEventType.LIVE)
const isEarly = computed(() => lobbyCurrentEventType.value === EnumSportsEventType.EARLY)
const isChuan = computed(() => lobbyCurrentEventType.value === EnumSportsEventType.CHUAN)
const isOutright = computed(() =>
  lobbyCurrentEventType.value === EnumSportsEventType.OUTRIGHT)
// 当前赛事类型的球种导航
const siNavs = computed(() => {
  if (isHot.value)
    return hotEventNavs.value
  if (isToday.value)
    return todayEventNavs.value
  if (isLive.value)
    return sportLiveNavs.value
  if (isEarly.value)
    return earlyEventNavs.value
  if (isChuan.value)
    return chuanEventNavs.value
  if (isOutright.value)
    return outrightNavs.value
  return []
})
const params = computed(() => {
  const obj = sportsEventTypeList.value?.find(a => a.lfid === lobbyCurrentEventType.value)
  return {
    si: currentLobbySiNav.value,
    hot: obj?.hot ?? 0,
    m: obj?.m ?? 0,
    ivs: obj?.ivs ?? 0,
    ic: obj?.ic ?? 0,
    page: page.value,
    page_size: pageSize.value,
  }
})

const { run, runAsync } = useRequest(ApiSportEventList, {
  onSuccess(res) {
    if (res.d) {
      // 赛事数量与nav不符时刷新count接口
      const siObj = siNavs.value.find(a => a.si === currentLobbySiNav.value)
      if (siObj && siObj.count !== res.t)
        startCount()

      total.value = res.t
      curTotal.value = curTotal.value + res.d.length

      if (page.value === 1)
        return list.value = sportsDataGroupByLeague(res.d)

      list.value = sportsDataGroupByLeagueLoadMore(list.value, res.d)
    }
  },
  onAfter() {
    switchLoadingFalse()
    moreLoadingFalse()
  },
})
// 冠军数据
const paramsOutright = computed(() => {
  return {
    si: currentLobbySiNav.value,
    page: page.value,
    page_size: pageSize.value,
  }
})
const {
  run: runOutrightList,
  runAsync: runAsyncOutrightList,
} = useRequest(ApiSportOutrightList, {
  onSuccess(res) {
    if (res.d) {
      total.value = res.t
      curTotal.value = curTotal.value + res.d.length

      if (page.value === 1)
        return outrightList.value = outrightDataGroupByLeague(res.d)

      outrightList.value = outrightDataGroupByLeagueLoadMore(outrightList.value, res.d)
    }
  },
  onAfter() {
    switchLoadingFalse()
    moreLoadingFalse()
  },
})

/** 判断当前展示的数据是否至少有一条可以展示 */
const isHaveDataToShow = computed(() => {
  return list.value.some(a => a.list.length > 0)
})

/** 👷 分页、定时器、监听更新数据 start 👷 */
function startLive() {
  if (timer)
    stopLive()

  timer = setInterval(() => {
    page.value = 1
    if (isOutright.value)
      runOutrightList({ ...paramsOutright.value, page_size: curTotal.value > +VITE_SPORT_EVENT_PAGE_SIZE ? curTotal.value : +VITE_SPORT_EVENT_PAGE_SIZE })

    else
      run({ ...params.value, page_size: curTotal.value > +VITE_SPORT_EVENT_PAGE_SIZE ? curTotal.value : +VITE_SPORT_EVENT_PAGE_SIZE })

    curTotal.value = 0
  }, 60000)
}
function stopLive() {
  clearInterval(timer)
  timer = null
}
function getData() {
  if (isOutright.value)
    runOutrightList(paramsOutright.value)

  else
    run(params.value)
}
function loadMore() {
  if (curTotal.value >= +VITE_SPORT_EVENT_PAGE_SIZE_MAX) {
    curTotal.value = 0
    page.value = 1
    pageSize.value = +VITE_SPORT_EVENT_PAGE_SIZE_MAX
    scrollMainContentToTop()
  }
  else {
    page.value++
    pageSize.value = +VITE_SPORT_EVENT_PAGE_SIZE
  }
  moreLoadingTrue()
  getData()
}
function reset() {
  page.value = 1
  pageSize.value = +VITE_SPORT_EVENT_PAGE_SIZE
  total.value = 0
  curTotal.value = 0
  list.value = []
  outrightList.value = []
}
function updateDataByMqtt(data: ISportEventList[]) {
  if (!isOutright.value)
    list.value = sportsDataGroupedByLeagueUpdateByMqtt(list.value, data)
}
/** 🚧 分页、定时器、监听更新数据 end 🚧 */

// 切换赛事类型
function onEventTypeChange() {
  currentLobbySiNav.value = 0
  nextTick(() => {
    currentLobbySiNav.value = siNavs.value[0]?.si ?? 0
  })
}
// 切换球种
function onSportsSiChange(item: { count: number }) {
  marketNum.value = item.count > +VITE_SPORT_EVENT_PAGE_SIZE ? +VITE_SPORT_EVENT_PAGE_SIZE : item.count
}

// 初始化数据
function initData() {
  return new Promise((resolve) => {
    let a = 0
    const t = setInterval(() => {
      a++
      if (currentLobbySiNav.value > 0) {
        clearInterval(t)
        if (isOutright.value) {
          runAsyncOutrightList(paramsOutright.value).finally(() => {
            startLive()
            resolve(true)
          })
        }
        else {
          runAsync(params.value).finally(() => {
            startLive()
            resolve(true)
          })
        }
      }
      else if (a > 300 || currentLobbySiNav.value === 0) {
        clearInterval(t)
        resolve(true)
      }
    }, 50)
  })
}

/** 切换球种 */
watch(currentLobbySiNav, (a, b) => {
  if (b !== -1) {
    currentLobbyBetType.value = baseTypeOptions.value[0].value
    switchLoadingTrue()
    reset()
    if (a <= 0) {
      switchLoadingFalse()
    }
    else {
      getData()
      startLive()
    }
  }
})

onMounted(() => {
  startCount()
  appEventBus.on(EventBusNames.SPORTS_DATA_CHANGE_BUS, updateDataByMqtt)
})
onBeforeUnmount(() => {
  stopLive()
  stopCount()
  appEventBus.off(EventBusNames.SPORTS_DATA_CHANGE_BUS, updateDataByMqtt)
})

await application.allSettled([initData()])
</script>

<template>
  <div class="lobby">
    <!-- 球种列表 -->
    <AppSportsTab v-show="siNavs.length > 0" v-model="currentLobbySiNav" :list="siNavs" @change="onSportsSiChange" />
    <div class="theme-modify h-[25px] w-full flex items-center justify-between @md:h-[42px]"
      :class="isZhcn ? 'mb-[12px] ' : 'my-[24px]'">
      <!-- 赛事类型 -->
      <AppSportsEventTypeTab v-model="lobbyCurrentEventType" :list="sportsEventTypeList ?? []"
        @change="onEventTypeChange" />
      <!-- 盘口类型 -->
      <AppSportsMarketTypeSelect v-show="!isOutright" v-model="currentLobbyBetType" v-model:is-standard="isStandard"
        :base-type-options="baseTypeOptions" />
    </div>

    <!-- 冠军 -->
    <div v-if="isOutright" class="market-wrapper">
      <AppSportsOutrightPerviewSkeleton v-if="switchLoading" :num="marketNum" />
      <template v-else>
        <AppOutrightPreview v-for="league, i in outrightList" :key="league.ci" :auto-show="i === 0" :data="league" />
        <AppSportsOutrightPerviewSkeleton v-if="moreLoading" :num="10" />
        <div class="w-full flex flex-col items-center">
          <AppPercentage is-sports :total="total" :percentage="curTotal" />
          <BaseButton v-show="curTotal < total" class="mt-[9px]" size="md" type="text" @click="loadMore">
            {{ t('load_more') }}
          </BaseButton>
        </div>
      </template>
    </div>
    <!-- 其他 -->
    <div v-else class="market-wrapper">
      <AppSportsMarketSkeleton v-if="switchLoading" :num="marketNum" :si="currentLobbySiNav" />
      <template v-else>
        <template v-if="isHaveDataToShow">
          <AppSportsMarket v-for="item in list" :key="item.ci + item.list.length" :is-standard="isStandard"
            :league-name="item.cn" :event-count="item.list.length" :event-list="item.list"
            :base-type="currentLobbyBetType"
            :style="isZhcn && isMobile ? '--tg-secondaryAccordion-header-padding-x:10px;' : ''" />
          <AppSportsMarketSkeleton v-if="moreLoading" :num="10" :si="currentLobbySiNav" />
          <BaseButton v-show="curTotal < total" size="none" type="text" @click="loadMore">
            {{ t('sports_table_header_load_more') }}
          </BaseButton>
        </template>
        <div v-else class="empty">
          <BaseEmpty icon="empty-1" :description="t('empty_cap')">
            <template #icon>
              <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
            </template>
          </BaseEmpty>
        </div>
      </template>
    </div>
    <!-- 热门赛事 -->
    <!-- <AppSportsHotEvent /> -->
    <!-- 今日赛事 -->
    <AppSportsTodayEventLobby />
  </div>
</template>

<style lang='scss' scoped>
.theme-modify {
  @include webTheme('green') {
    --tg-popper-hover-color-default: #5ecea6;
  }
}

.lobby {
  width: 100%;

  .market-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // gap: var(--tg-spacing-12);
    margin-bottom: var(--tg-spacing-24);

    >*:not(:last-child) {
      margin-bottom: var(--tg-spacing-12);
    }
  }

  .empty {
    width: 100%;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

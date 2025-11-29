<script setup lang='ts'>
import { IconSptEventJin, IconEmpty1 } from '@tg/icons'

import type { ISportEventList } from '@tg/types'

import type { ISportDataGroupedByLeague } from '~/types'
import { ApiSportEventList } from '@tg/apis'

defineOptions({
  name: 'AppSportsTodayEventLobby',
})
const {
  VITE_SPORT_EVENT_PAGE_SIZE,
  VITE_SPORT_EVENT_PAGE_SIZE_MAX,
} = getEnv()
const { t } = useI18n()
const {
  bool: moreLoading,
  setTrue: moreLoadingTrue,
  setFalse: moreLoadingFalse,
} = useBoolean(false)
const { currentLobbySiNav } = storeToRefs(useSportsStore())
const {
  bool: switchLoading,
  setTrue: switchLoadingTrue,
  setFalse: switchLoadingFalse,
} = useBoolean(false)

let timer: any = null
const scrollDom = ref()
const page = ref(1)
const pageSize = ref(+VITE_SPORT_EVENT_PAGE_SIZE)
const total = ref(0)
const curTotal = ref(0)
const list = ref<ISportDataGroupedByLeague>([])
const params = computed(() => {
  return {
    si: currentLobbySiNav.value,
    m: 2,
    ic: 0,
    page: page.value,
    page_size: pageSize.value,
  }
})

const { runAsync, run } = useRequest(ApiSportEventList, {
  onSuccess(res) {
    if (res.d) {
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

/** 判断当前展示的数据是否至少有一条可以展示 */
const isHaveDataToShow = computed(() => {
  return list.value.some(a => a.list.length > 0)
})

/** 👷 分页、定时器、监听更新数据 start 👷 */
function startTimer() {
  if (timer)
    stopTimer()

  timer = setInterval(() => {
    page.value = 1
    run({ ...params.value, page_size: curTotal.value > +VITE_SPORT_EVENT_PAGE_SIZE ? curTotal.value : +VITE_SPORT_EVENT_PAGE_SIZE })
    curTotal.value = 0
  }, 60000)
}
function stopTimer() {
  clearInterval(timer)
  timer = null
}
function getData() {
  run(params.value)
}
function loadMore() {
  if (curTotal.value >= +VITE_SPORT_EVENT_PAGE_SIZE_MAX) {
    curTotal.value = 0
    page.value = 1
    pageSize.value = +VITE_SPORT_EVENT_PAGE_SIZE_MAX
    scrollDom.value.scrollTo({ top: 0 })
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
}
function updateDataByMqtt(data: ISportEventList[]) {
  list.value = sportsDataGroupedByLeagueUpdateByMqtt(list.value, data)
}
/** 🚧 分页、定时器、监听更新数据 end 🚧 */

watch(currentLobbySiNav, (a, b) => {
  if (b !== -1) {
    switchLoadingTrue()
    reset()
    if (a <= 0) {
      switchLoadingFalse()
    }
    else {
      getData()
      startTimer()
    }
  }
})

onMounted(() => {
  startTimer()
  appEventBus.on(EventBusNames.SPORTS_DATA_CHANGE_BUS, updateDataByMqtt)
})
onBeforeUnmount(() => {
  stopTimer()
  appEventBus.off(EventBusNames.SPORTS_DATA_CHANGE_BUS, updateDataByMqtt)
})

await application.allSettled([runAsync(params.value)])
</script>

<template>
  <div class="sports-hot-event">
    <div class="sports-page-title">
      <div class="left">
        <IconSptEventJin />
        <h6>{{ t('sports_today_event') }}</h6>
      </div>
    </div>

    <div class="market-wrapper">
      <AppSportsMarketSkeleton v-if="switchLoading" :num="10" :si="currentLobbySiNav" />
      <template v-else>
        <template v-if="isHaveDataToShow">
          <AppSportsMarket v-for="item, idx in list" :key="item.ci + item.list.length + item.cn" :league-name="item.cn"
            :event-count="item.list.length" :event-list="item.list" base-type="3@@1" is-standard
            :class="[idx < list.length - 1 ? 'mb-[12px]' : (moreLoading || curTotal < total ? 'mb-[12px]' : '')]" />
          <AppSportsMarketSkeleton v-if="moreLoading" :class="[curTotal < total ? 'mb-[12px]' : '']" :num="10" />
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
  </div>
</template>

<style lang='scss' scoped>
.market-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // gap: var(--tg-spacing-12);
  margin-bottom: var(--tg-spacing-24);
  margin-top: var(--tg-spacing-12);

  .empty {
    width: 100%;
    min-height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

<script setup lang='ts'>
import type { ISportDataGroupedByLeague, ISportEventList } from '@tg/types'
import { ApiSportEventList } from '@tg/apis'
import { BaseImage, SSBaseButton, SSBaseEmpty } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { EventBusNames } from '@tg/types'
import { appEventBus, application, getEnv, scrollToTop, sportsDataGroupByLeague, sportsDataGroupByLeagueLoadMore, sportsDataGroupedByLeagueUpdateByMqtt } from '@tg/utils'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'
import AppSportsMarket from './AppSportsMarket.vue'
import AppSportsMarketSkeleton from './AppSportsMarketSkeleton.vue'

interface Props {
  isStandard: boolean
  baseType: string
}
defineOptions({
  name: 'AppSportsLevel2LiveUpcoming',
})
defineProps<Props>()

const { t } = useI18n()
const { route, projectName } = useSportsConfig()
const sport = route.params.sport ? +route.params.sport : 0
const region = ref(route.params.region ? route.params.region.toString() : '')
const {
  VITE_SPORT_EVENT_PAGE_SIZE,
  VITE_SPORT_EVENT_PAGE_SIZE_MAX,
} = getEnv()
const {
  bool: moreLoading,
  setTrue: moreLoadingTrue,
  setFalse: moreLoadingFalse,
} = useBoolean(false)

let timer: any = null
const page = ref(1)
const pageSize = ref(+VITE_SPORT_EVENT_PAGE_SIZE)
const total = ref(0)
const curTotal = ref(0)
const list = ref<ISportDataGroupedByLeague>([])
const params = computed(() => {
  return {
    m: 5,
    ic: 0,
    ivs: 0,
    si: sport,
    pgid: region.value,
    page: page.value,
    page_size: pageSize.value,
  }
})
const { run, runAsync } = useRequest(ApiSportEventList, {
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
    moreLoadingFalse()
  },
})

/** 👷 分页、定时器、监听更新数据 start 👷 */
function startTimer() {
  if (timer)
    stopTimer()

  timer = setInterval(() => {
    page.value = 1
    run({ ...params.value, page_size: curTotal.value > +VITE_SPORT_EVENT_PAGE_SIZE ? curTotal.value : +VITE_SPORT_EVENT_PAGE_SIZE })
    curTotal.value = 0
  }, 120000)
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
    scrollToTop()
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

watch(route, (r) => {
  if (r.name === 'sports-platId-sport-region') {
    region.value = r.params.region ? r.params.region.toString() : ''
    reset()
    getData()
    startTimer()
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
  <div class="sub-wrapper">
    <div v-if="list.length === 0" class="empty">
      <SSBaseEmpty :description="t('暂无可用盘口')">
        <template #icon>
          <div class="w-[80rem]">
            <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
          </div>
        </template>
      </SSBaseEmpty>
    </div>
    <AppSportsMarket
      v-for="league, i in list" :key="league.ci" :is-standard="isStandard"
      :league-name="league.cn" :event-count="league.list.length"
      :base-type="baseType" group-by-date
      :event-list="league.list" :auto-show="i === 0"
    />
    <AppSportsMarketSkeleton
      v-if="moreLoading"
      :num="total - curTotal > 10 ? 10 : total - curTotal "
      :si="sport"
    />
    <SSBaseButton
      v-show="curTotal < total && !moreLoading"
      size="none" type="text" @click="loadMore"
    >
      {{ t('加载更多') }}
    </SSBaseButton>
  </div>
</template>

<style lang='scss' scoped>
.sub-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  > * {
    margin-bottom: 12rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
.empty {
  width: 100%;
  min-height: 150rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script setup lang='ts'>
import type { ISportEventInfo, ISportEventList } from '@tg/types'
import { ApiSportEventList } from '@tg/apis'
import { BaseImage, SSBaseButton, SSBaseEmpty } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { EventBusNames } from '@tg/types'
import { appEventBus, application, getEnv, scrollToTop, sportsEventInfoListUpdateByMqtt } from '@tg/utils'
import { cloneDeep } from 'lodash'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'
import AppSportsMarket from './AppSportsMarket.vue'

interface Props {
  isStandard: boolean
  baseType: string
}
defineOptions({
  name: 'AppSportsLevel3LiveUpcoming',
})
defineProps<Props>()

const { t } = useI18n()
const { route, projectName } = useSportsConfig()
const navObj = application.urlParamsToObject(route.fullPath.split('?')[1])
const sport = route.params.sport ? +route.params.sport : 0
const league = route.params.league ? route.params.league.toString() : ''
const {
  bool: moreLoading,
  setTrue: moreLoadingTrue,
  setFalse: moreLoadingFalse,
} = useBoolean(false)
const {
  VITE_SPORT_EVENT_PAGE_SIZE,
  VITE_SPORT_EVENT_PAGE_SIZE_MAX,
} = getEnv()

let timer: any = null
const si = ref(sport)
const ci = ref(league)
const page = ref(1)
const pageSize = ref(+VITE_SPORT_EVENT_PAGE_SIZE)
const total = ref(0)
const list = ref<ISportEventInfo[]>([])
const params = computed(() => {
  return {
    m: 5,
    ic: 0,
    ivs: 0,
    si: si.value,
    ci: ci.value,
    page: page.value,
    page_size: pageSize.value,
  }
})
const { run, runAsync } = useRequest(ApiSportEventList, {
  onSuccess(res) {
    if (res.d) {
      total.value = res.t
      if (page.value === 1)
        return list.value = res.d

      list.value = [...cloneDeep(list.value), ...res.d]
    }
  },
  onAfter() {
    moreLoadingFalse()
  },
})
const curTotal = computed(() => list.value.length)

/** 👷 分页、定时器、监听更新数据 start 👷 */
function startTimer() {
  if (timer)
    stopTimer()

  timer = setInterval(() => {
    page.value = 1
    run({ ...params.value, page_size: curTotal.value > +VITE_SPORT_EVENT_PAGE_SIZE ? curTotal.value : +VITE_SPORT_EVENT_PAGE_SIZE })
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
  list.value = []
}
function updateDataByMqtt(data: ISportEventList[]) {
  list.value = sportsEventInfoListUpdateByMqtt(list.value, data)
}
/** 🚧 分页、定时器、监听更新数据 end 🚧 */

watch(route, (r) => {
  if (r.name === 'sports-platId-sport-region-league') {
    si.value = r.params.sport ? +r.params.sport : 0
    ci.value = r.params.league ? r.params.league.toString() : ''
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
      v-else
      :is-standard="isStandard"
      :league-name="navObj.cn" :event-count="total" :base-type="baseType"
      :event-list="list" :loading-more="moreLoading" group-by-date auto-show
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
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

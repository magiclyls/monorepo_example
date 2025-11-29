import type { ISportsMyBetSlipItem } from '@tg/types'
import { ApiSportBetList, ApiSportBetListByTime } from '@tg/apis'

/**
 * 获取体育投注记录
 */
export function useApiSportBetList(
  settle: Ref<number>,
  period?: Ref<string>,
  isFetch?: boolean,
  noWatch?: boolean,
  afterCb?: () => void,
) {
  if (isFetch === void 0)
    isFetch = true

  if (noWatch === void 0)
    noWatch = false

  const { currentGlobalCurrency } = storeToRefs(useAppStore())

  const {
    list: _list,
    runAsync: runGetSportBetList,
    loading,
    total,
    page,
    page_size,
    next,
    prev,
  } = useList(period && period.value ? ApiSportBetListByTime : ApiSportBetList, {
    onBefore() {
      _list.value = []
    },
    onAfter() {
      afterCb && afterCb()
    },
  }, {
    page_size: 20,
  })

  const currentGlobalCurCode = computed(() => {
    return getCurrencyConfig(currentGlobalCurrency.value).cur
  })

  const sportBetList = computed<ISportsMyBetSlipItem[]>(() => {
    if (_list.value.length === 0)
      return []

    return _list.value
  })

  /** 未结算total */
  const totalUnsettled = computed(() => {
    if (_list.value.length === 0 || settle.value === 1)
      return 0

    return total.value
  })

  /** 开始时间 */
  const startTime = computed(() => {
    if (period && period.value === 'today')
      return getTodayTimeRange().start
    if (period && period.value === 'week')
      return getCurrentWeekTimeRange().start
    if (period && period.value === 'month')
      return getCurrentMonthTimeRange().start
    return 0
  })
  /** 结束时间 */
  const endTime = computed(() => {
    if (period && period.value === 'today')
      return getTodayTimeRange().end
    if (period && period.value === 'week')
      return getCurrentWeekTimeRange().end
    if (period && period.value === 'month')
      return getCurrentMonthTimeRange().end
    return 0
  })

  function fetch() {
    if (period && period.value) {
      return new Promise((resolve) => {
        runGetSportBetList({
          cur: currentGlobalCurCode.value,
          settle: settle.value,
          start_time: startTime.value.toString(),
          end_time: endTime.value.toString(),
        }).finally(() => {
          resolve(true)
        })
      })
    }
    return new Promise((resolve) => {
      runGetSportBetList({
        cur: currentGlobalCurCode.value,
        settle: settle.value,
        start_time: '',
        end_time: '',
      }).finally(() => {
        resolve(true)
      })
    })
  }

  if (isFetch)
    fetch()

  if (!noWatch) {
    watch([currentGlobalCurrency, settle, period], () => {
      fetch()
    })
  }

  return {
    sportBetList,
    loading,
    total,
    page,
    page_size,
    totalUnsettled,
    runGetSportBetList,
    next,
    prev,
    fetch,
  }
}

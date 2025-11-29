import type { CurrencyCode } from '@tg/types'
import { ApiCpNav, ApiCpOdds, ApiCpTrend } from '@tg/apis'
import { useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import {
  appEventBus,
} from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useK3Store } from '../stores/useK3Store'
import { calcTime, isLogin as getLogin } from '../utils/tool'

type LotteryTypeValue = 'k3' // ....
interface WinGoData {
  flag: 'Win' | 'Lose'
  lottery_name: string
  issue_id: string
  settle_amount: string
  balls: string
  bet_balls: string
  currency_id: CurrencyCode
  result: number[]
}
const configs = {
  k3: {
    lottery_id: 3002,
    type: 3,
    eventName: EventBusNames.LOTTERY_K3,
  },
}

export default function useLottery(type: LotteryTypeValue) {
  const isLogin = getLogin()
  const currencyStore = useCurrency()
  const k3Store = useK3Store()
  const { showBetPop } = storeToRefs(k3Store)

  const currentConfig = configs[type]

  const currentTab = ref()
  const tabArr = ref<any[]>([])
  const isShowMask = ref(false)
  const timeMask = ref(0)
  const lotteryResultArr = ref<any[]>([])
  const time = ref(0)
  const randomId = ref<number>(1)
  const animatingIndexes = ref<number[]>([])

  const animationTimer = ref<NodeJS.Timeout | null> (null)
  const { runAsync: runAsyncCpOdds, data } = useRequest(() => ApiCpOdds({ lottery_id: currentTab.value }), {
    onSuccess: (res) => {
      const issue = res?.issue
      if (issue) {
        const t = calcTime(issue.end_time)
        time.value = t
        timeMask.value = t > 5 ? 0 : t
        randomId.value = Date.now()
      }
    },
  })
  const curPeriod = computed(() => data.value?.issue.id || '0')

  const { runAsync: runAsyncCpNav } = useRequest(() => ApiCpNav({ lottery_id: currentConfig.lottery_id }))

  const { runAsync: runAsyncLotteryRes } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: 1 }), {
  })

  function timeToShowMask(val: number) {
    if (showBetPop.value) {
      k3Store.closePop()
    }
    timeMask.value = val
  }

  function randomNum(n: number) {
    return Math.ceil(Math.random() * n)
  }
  const showResults = computed(() => {
    return animationTimer.value ? animatingIndexes.value : lotteryResultArr.value[0]?.result.split(',')
  })
  function startRandomAnimation(): Promise<void> {
    return new Promise((resolve) => {
      if (animationTimer.value) {
        clearInterval(animationTimer.value)
        animationTimer.value = null
      }

      animationTimer.value = setInterval(() => {
        const randomIndex1 = randomNum(6)
        const randomIndex2 = randomNum(6)
        const randomIndex3 = randomNum(6)

        animatingIndexes.value = [randomIndex1, randomIndex2, randomIndex3]
      }, 150)

      setTimeout(() => {
        if (animationTimer.value) {
          clearInterval(animationTimer.value)
          animationTimer.value = null
        }
        animatingIndexes.value = []
        resolve()
      }, 2000)
    })
  }
  async function init() {
    if (isLogin) {
      await currencyStore.initCurrencyList()
    }

    const res = await runAsyncCpNav()
    const nav = res.map((item) => {
      return {
        label: item.lottery_name,
        value: item.lottery_id,
      }
    })

    tabArr.value = nav
    currentTab.value = nav[0].value
    // winGoStore.setWinGoTabArr(nav)

    await runAsyncCpOdds()
  }
  async function getLotteryRes(needAnimate = false) {
    return runAsyncLotteryRes().then((res) => {
      const list = res?.d?.list || []
      lotteryResultArr.value = list
      if (needAnimate) {
        startRandomAnimation()
      }
    })
  }
  async function dealMqtt(value: any) {
    if (currentTab.value) {
      const { payload, topic } = value.message.parsed
      if (payload.startsWith('start') && topic.endsWith(currentTab.value)) {
        isShowMask.value = false
        runAsyncCpOdds()
      }
      if (payload.startsWith('end') && topic.endsWith(currentTab.value)) {
        isShowMask.value = true
      }
      if (payload.startsWith('settle') && topic.endsWith(currentTab.value)) {
      // 调用game history接口拿结果数据
        getHistory(true)
      }
    }
  }
  watch(currentTab, reload, { immediate: true })

  function getHistory(tag?: boolean) {
    getLotteryRes(tag)
    appEventBus.emit(EventBusNames.LOTTERY_K3_HISTORY, {})
  }
  function reload() {
    if (currentTab.value) {
      isShowMask.value = false
      runAsyncCpOdds()
      getHistory()
    }
  }

  const isShowWinLose = ref(false)
  const winLoseData = ref<WinGoData>({
    flag: 'Win',
    lottery_name: '',
    issue_id: '',
    settle_amount: '',
    balls: '',
    bet_balls: '[]',
    currency_id: '701',
    result: [],
  })
  function dealWinLose(values: any) {
    if (Number(values.type) !== currentConfig.type)
      return
    if (isShowWinLose.value)
      return
    winLoseData.value = values
    isShowWinLose.value = true
  }
  onMounted(() => {
    appEventBus.on(currentConfig.eventName, dealMqtt)
    appEventBus.on(EventBusNames.APP_GLOBAL_VISIBILITY, reload)
    appEventBus.on(EventBusNames.LOTTERY_SETTLE_DIALOG, dealWinLose)
  })
  onBeforeUnmount(() => {
    appEventBus.off(currentConfig.eventName, dealMqtt)
    appEventBus.off(EventBusNames.APP_GLOBAL_VISIBILITY, reload)
    appEventBus.off(EventBusNames.LOTTERY_SETTLE_DIALOG, dealWinLose)
  })

  init()
  return {
    currentTab,
    tabArr,
    curPeriod,
    time,
    timeMask,
    isShowMask,
    timeToShowMask,
    data,
    randomId,
    lotteryResultArr,
    showResults,
    isShowWinLose,
    winLoseData,
  }
}

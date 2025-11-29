<script lang="ts" setup>
import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { ApiExchangeRateFromTo, ApiGameOriginalCrash, ApiGameOriginCrashIssueRanking, ApiGameOriginCrashIssueRecord } from '@tg/apis'
import { BaseAspectRatio, PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseDialog, PhBaseInput, PhBaseLabel, PhBaseTabs } from '@tg/bccomponents'
import { useBoolean, useList } from '@tg/hooks'
import { IconChessFrame1, IconUniArrowLeft, IconUniGameInfo, IconUniHidden, IconUniKeyboard, IconUniUsers } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames, KeyboardKeyEnum } from '@tg/types'
import { add, appEventBus, crashCallback, currencyMap, formatAmountFunc, formatWithSubstring, getCurrencyConfig, getEnv, Local, mul, scientificToString, scrollToTop, socketClient, STORAGE_MINI_CRASH_RENDER_FRAME, toFixed } from '@tg/utils'
import { useDocumentVisibility, useElementSize } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { ceil, floor, uniqBy } from 'lodash'
import { storeToRefs } from 'pinia'
import { DropShadowFilter } from 'pixi-filters'
import { Assets, Container, Graphics, LINE_CAP, Sprite, Text } from 'pixi.js'
import { computed, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { onBeforeRouteLeave } from 'vue-router'
import { Message } from '~/utils'
import {
  AppDialogCrashPointRecord,
  AppMiniGameCrashResultAndRanking,
  AppMiniGamePartMinesGameInfo,
  AppMiniGamePartMinesHotKeys,
  AppMiniGamePublicAutoDouble,
  AppMiniGamePublicBetAmount,
  AppMiniGamePublicBetButton,
  AppMiniGamePublicBetTimes,
  AppMiniGamePublicLayout,
  AppNumberCount,
} from '../_components'
import {
  useKeyboard,
  useMiniGameAutoBetNotifications,
  useMiniGameGlobalStateHotKeys,
  useMiniGameGlobalStatePlayerResult,
  useMiniGameLockCurrency,
  useMiniGamePublicPlayMp3,
} from '../composables'
import { globalPixi, loadCrashAssets, tickerAxis } from './mini-crash'

type StatusType = '' | 'starting_before' | 'starting' | 'pending' | 'start' | 'in_progress' | 'crash' | 'auto_cash_out' | 'manual_cash_out'
type ManualBetButtonType = 'bet_next_round' | 'bet_current_round' | 'bet_cancel' | 'cash_out' | 'api' | 'pending'
type AutoBetButtonType = 'start_auto_bet' | 'stop_auto_bet' | 'bet_cancel' | 'cash_out' | 'api' | 'finishing_bet'
defineOptions({
  name: 'AppMiniGameMainCrash',
})
let timerId1: any
let timerId2: any
let timerId3: any
let timerId4: any

const cancelAnimationFrame
  = window.cancelAnimationFrame || window.mozCancelAnimationFrame
let myReq: any

interface MsgBodyType {
  /** 期数 */
  issue_id: string
  /** 开始时间 */
  start_at: number
  /** 爆炸时间 */
  crash_at: number
  /** 爆炸点数 */
  crash_point: string
  /** 状态：1=进行中,2=已爆炸 */
  status: 1 | 2
  /** 实时点数 */
  point: string
  /** 下一期开盘下注时间(当前期数爆炸后才会显示值) */
  next_start_bet_at: number
  /** 币种 */
  currency_id: CurrencyCode
  /** 下注金额 */
  bet_amount: string
  /** 输赢金额 */
  net_amount: string
  /** 赔付乘数 */
  payout_multiplier: string
  /** 赔付金额 */
  payout: string
  /** 兑换点数 */
  cash_out_at: string
  /** 下注点数 */
  bet_point: string
  /** 会员id */
  uid: string
  /** 会员名 */
  username: string
  /** 进行中状态已经过去的秒数 */
  second: string | number
}
interface MsgType {
  /** 推送类型(start:游戏开始,point:实时点数,cashedIn:下注消息,cashedOut:结算消息) */
  type: '' | 'start' | 'point' | 'cashedIn' | 'cashedOut'
  /** 推送时间 */
  push_at: number
  body: MsgBodyType
}

const onLoaded = inject('onLoaded', () => { })

const designRate = 4.5

const { VITE_SOCKET_PREFIX } = getEnv()

const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playWinMusic } = useMiniGamePublicPlayMp3('/audio/limbo.win.mp3')
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()

const topic = 'games/crash/pub'
const topicSite = `games/crash/${VITE_SOCKET_PREFIX}`

const showGameInfoDialog = ref(false)
const showHotKeysDialog = ref(false)
const showCrashPointRecordDialog = ref(false)
const showCrashResultDialog = ref(false)
const issueId = ref('')
const { t } = useI18n()
const isMobile = ref(true)
const appStore = useAppStore()
const { isLogin, userInfo, balanceData } = storeToRefs(appStore)
const theme = ref<'default'>('default')
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const currentGlobalCurrency = computed(() => currentGlobalCurrencyMap.value.type)

const { autoBetStartNotify, autoBetStopNotify, autoBetEndNotify, autoBetStopWinNotify, autoBetStopLoseNotify } = useMiniGameAutoBetNotifications()

const { showPlayerResult } = useMiniGameGlobalStatePlayerResult()

const visibility = useDocumentVisibility()

const crashPointMaxLen = computed(() => isMobile.value ? 3 : 5)

const {
  list,
  runAsync: runGetRecordAsync,
} = useList(ApiGameOriginCrashIssueRecord, {}, { page_size: crashPointMaxLen.value })

const { data: rankData, loading: rankingLoading, runAsync: runGetRanking } = useRequest(ApiGameOriginCrashIssueRanking)

interface RenderFrame {
  /** 期号 */
  issue_id: string
  /** 推送 消息类型 */
  type: '' | 'start' | 'point' | 'cashedIn' | 'cashedOut'
  /** point 状态 1 进行中点 2 爆炸点 */
  status: '' | 1 | 2
  /** ui 本轮流程状态 */
  current_status: StatusType
  /** 本轮下注金额 */
  bet_amount: string
  /** 下注点数 */
  bet_point: string
  /** 下注订单号 */
  order_id: string
  /** 下注币种 */
  currency: '' | CurrencyCode
  currencyType: '' | EnumCurrencyKey
  /** 下一期开盘下注时间(当前期数爆炸后才会显示值) */
  next_start_bet_at: number
  /** 爆炸点的 推送时间 push_at  */
  crash_point_push_at: number
  /** 状态 starting 显示 orange 背景按钮到时间范围  */
  crash_to_start_range: number
  /** 状态 starting 的开始时间 */
  next_starting_in_at: number
  /** y 轴 倍数最大值 */
  y_axis_end: number
  /** y 轴刻度 */
  y_axis_values: Array<number | string>
  /** x 轴 时间最大值 */
  x_axis_end: number
  /** x 轴刻度 */
  x_axis_values: Array<number | string>
  /** 进行中的 当前总秒数 */
  x_total_seconds: number
  /** 曲线终点位置数组 */
  x_y_points: Array<{ x: number, y: number, m: number, s: number }>
  /** 当前打点位置索引 */
  last_point_index: number
  /** 当前打点倍数索引 */
  last_mult_index: number
  /** x 轴 step */
  x_axis_step: number
  /** 当前用户兑现点数 */
  user_cash_out_at: string
  /** 当前用户兑现输赢金额 */
  user_cash_out_net_amount: string
  /** 灰色状态按钮宽度 */
  statusButtonGreyWidth: number
  /** 灰色状态按钮背景图片 */
  statusButtonGreyBg: any
  /** 黄色背景图 */
  statusButtonOrangeBg: any
  /** 是否已播放爆炸动画 */
  boomed: boolean
  /** 币种图标 */
  currencyImageTexture: any
  /** 获胜利润 */
  profit: string
  [k: string]: any
}
const initFrame: RenderFrame = {
  type: '',
  status: '',
  issue_id: '',
  order_id: '',
  current_status: 'in_progress',
  crash_point: '',
  next_start_bet_at: 0,
  crash_point_push_at: 0,
  crash_to_start_range: 0,
  next_starting_in_at: 0,
  y_axis_end: 1.8,
  y_axis_values: [1.0, 1.2, 1.3, 1.5, 1.7, 1.8],
  x_axis_end: 10,
  x_axis_values: [2, 4, 6, 8, 0],
  x_total_seconds: 0,
  x_y_points: [{ m: 1.0, s: 0, x: 0, y: 0 }],
  last_point_index: 0,
  last_mult_index: 0,
  x_axis_step: 1,
  user_cash_out_at: '',
  statusButtonGreyWidth: 0,
  statusButtonGreyBg: null,
  statusButtonOrangeBg: null,
  currencyImageTexture: null,
  user_cash_out_net_amount: '',
  boomed: false,
  bet_amount: '',
  bet_point: '',
  currency: '',
  currencyType: '',
  profit: '',
}
const renderFrame = ref(initFrame)

// 中间动态倍数文本
function getText(v: string) {
  return new Text(v, {
    fontFamily: 'Proxima Nova',
    fontSize: 28 * designRate,
    fill: 0x0D2245,
    align: 'center',
    fontWeight: '700',
    dropShadow: false, // 去掉阴影
    // dropShadow: {
    dropShadowBlur: 8,
    dropShadowAlpha: 0.44,
    dropShadowColor: 0x000000,
    dropShadowAngle: -30,
    dropShadowDistance: 12,
    // },
  })
}

const { bool: willBet, setBool: setWillBet } = useBoolean(false)
const { bool: roundBetted, setBool: setRoundBetted } = useBoolean(false)
const currentId = ref()
// const { bool: roundCashedout, setBool: setRoundCashedout } = useBoolean(false)
const { data: originData, runAsync: runDoBet, loading: originLoading } = useRequest(ApiGameOriginalCrash, {
  ready: isLogin,
  manual: true,
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess: (res) => {
  },
  onError: () => {
  },
})

const {
  rate,
  orderCurrencyCode: currentCurrencyCode,
  toFixedByLockCurrency,
  getLockCurrencyPrefix,
} = useMiniGameLockCurrency(getCurrencyConfig(currentGlobalCurrency.value).cur)
const currentCurrency = computed(() => getCurrencyConfig(currentCurrencyCode.value))
const currentBalance = computed(() => currentGlobalCurrencyMap.value.balance)
/// todo  ...
const restCurrencyCodes = computed(() => Object.keys(currencyMap).map(ty => (currencyMap as any)[ty].cur).join(','))

const { data: allRateData, runAsync: runGetRateFromTo } = useRequest(() => ApiExchangeRateFromTo({ from: restCurrencyCodes.value, to: currentCurrencyCode.value }), {
  manual: true,
  refreshDeps: [restCurrencyCodes, currentCurrencyCode],
  refreshDepsAction() {
    runGetRateFromTo()
  },
  onSuccess(res) {
  },
})
runGetRateFromTo()
/**
 * 下注列表
 * start
 */
const cashInList = ref<Array<{
  name: string
  currency: CurrencyCode
  amount: string
  cashOutAt: string
  hidden: boolean
  uid: string
  issue_id: string
  currentCurrencyAmount: number
  bet_point: string
}>>([])
const totalCashInAmount = computed(() => {
  if (allRateData.value && currentCurrencyCode.value) {
    return cashInList.value.reduce((acc, cur) => {
      const rate = cur.currency === currentCurrencyCode.value ? 1 : (allRateData.value?.[cur.currency] ?? 0)
      const amount = +cur.amount || 0
      const rateValue = +rate || 0
      const result = acc + (amount * rateValue)
      return Number.isNaN(result) ? acc : result
    }, 0)
  }
  return 0
})
// 排序
const sortedCashInList = computed(() => {
  // .filter(c => c.issue_id === renderFrame.value.issue_id)
  const arr = cashInList.value.map((c) => {
    if (allRateData.value && currentCurrencyCode.value) {
      const rate = c.currency === currentCurrencyCode.value ? 1 : (allRateData.value?.[c.currency] ?? 0)
      const amount = +c.amount || 0
      const rateValue = +rate || 0
      const currentCurrencyAmount = amount * rateValue
      return { ...c, currentCurrencyAmount: Number.isNaN(currentCurrencyAmount) ? 0 : currentCurrencyAmount }
    }
    else {
      return { ...c, currentCurrencyAmount: 0 }
    }
  })
  const rest = arr.filter(a => a.uid !== userInfo.value?.uid).sort((a, b) => b.currentCurrencyAmount - a.currentCurrencyAmount)
  if (isLogin.value && userInfo.value?.uid) {
    const temp = arr.filter(a => a.uid === userInfo.value?.uid)
    return temp.concat(rest)
  }
  else {
    return rest
  }
})
const uniqSortedCashInList = computed(() => uniqBy(sortedCashInList.value, 'uid'))
/** 下注列表 end */

/**
 * 兑现列表 代码
 * start
 */
const cashOutList = ref<Array<{
  name: string
  currency: CurrencyCode
  amount: string
  cashOutAt: string
  hidden: boolean
  uid: string
  issue_id: string
  payout: string
}>>([
  // { name: 'haha123', currency: '709', amount: '873281.01001', hidden: false },
])
/** 兑现列表 代码 end */

/**
 * 爆点记录 start
 */
const crashPointList = ref<{
  issue_id: string
  crash_point: string
  cashOutAt: string
}[]>([])
/** 爆点记录 end */

/**
 * 游戏左边 slot 相关代码
 * start
 */
const { bool: gameGoing, setBool: setGameGoing } = useBoolean(false)
const autoBetCount = ref(0)
const tab = ref('manual')
const userAutoCashOutProfit = ref<any[]>([])
const userAutoTotalProfit = computed(() => userAutoCashOutProfit.value.reduce((p, c) => {
  return add((+p), (+c.net_amount))
}, 0))
/** 手动投注按钮 */
// const currentStatus = ref<StatusType>('in_progress')
const amount = ref('0.00')
const initAmount = ref('0.00')
const betAmountRef = ref()
const currentPointMult = ref(1.0)
const ManualBetButtonStatus = computed<{ type: ManualBetButtonType, text?: string, disabled?: boolean, loading?: boolean, icon?: string, status?: boolean }[]>(() => {
  return [
    { type: 'api', icon: 'chess-frame1', disabled: !gameGoing.value, loading: originLoading.value, status: ['starting', 'in_progress'].includes(renderFrame.value.current_status) && originLoading.value },
    { type: 'bet_next_round', text: t('下注_下一轮'), disabled: !gameGoing.value || betAmountRef.value?.betAmountError || +amount.value > +currentBalance.value, status: ['in_progress', 'crash', 'starting_before'].includes(renderFrame.value.current_status) && !willBet.value && !roundBetted.value },
    { type: 'bet_current_round', text: t('投注'), disabled: roundBetted.value || !gameGoing.value || betAmountRef.value?.betAmountError || +amount.value > +currentBalance.value, status: ['starting'].includes(renderFrame.value.current_status) && !willBet.value },
    { type: 'bet_cancel', text: t('取消'), disabled: !gameGoing.value, status: ['in_progress', 'crash', 'starting_before'].includes(renderFrame.value.current_status) && willBet.value },
    { type: 'cash_out', text: t('兑现'), disabled: !gameGoing.value || !(+currentPointMult.value > 1.01) || renderFrame.value.current_status !== 'in_progress', status: ['start', 'in_progress'].includes(renderFrame.value.current_status) && roundBetted.value },
    { type: 'pending', text: t('正开始......'), disabled: true, status: ['pending', 'start'].includes(renderFrame.value.current_status) },
  ]
})
const { bool: autoActive, setBool: setAutoActive } = useBoolean(false)
const AutoBetButtonStatus = computed<{ type: AutoBetButtonType, text?: string, disabled?: boolean, loading?: boolean, icon?: string, status?: boolean }[]>(() => {
  return [
    { type: 'api', icon: 'chess-frame1', disabled: !gameGoing.value, loading: originLoading.value, status: ['starting', 'in_progress'].includes(renderFrame.value.current_status) && originLoading.value },
    { type: 'cash_out', text: t('兑现'), disabled: !gameGoing.value || !(+currentPointMult.value > 1.01) || renderFrame.value.current_status !== 'in_progress', status: ['start', 'in_progress'].includes(renderFrame.value.current_status) && roundBetted.value },
    { type: 'finishing_bet', text: t('正在完成投注'), icon: 'chess-frame1', disabled: true, status: ['in_progress', 'crash', 'pending', 'starting', 'starting_before', 'start'].includes(renderFrame.value.current_status) && autoBetCount.value > 0 && !autoActive.value },
    { type: 'start_auto_bet', text: t('开始自动投注'), status: autoActive.value !== true, disabled: renderFrame.value.current_status === 'pending' || !gameGoing.value || betAmountRef.value?.betAmountError || +amount.value > +currentBalance.value },
    { type: 'stop_auto_bet', text: t('停止自动投注'), icon: 'chess-frame1', disabled: !gameGoing.value, status: ['start', 'in_progress', 'crash', 'starting_before', 'starting', 'pending'].includes(renderFrame.value.current_status) && autoActive.value && autoBetCount.value > 0 },
    { type: 'bet_cancel', text: t('取消'), disabled: !gameGoing.value, status: ['start', 'starting', 'in_progress', 'crash', 'starting_before', 'pending'].includes(renderFrame.value.current_status) && autoActive.value && autoBetCount.value === 0 },
  ]
})
/** 自动投注按钮 */
const currentButton = computed(() => tab.value === 'manual' ? ManualBetButtonStatus.value.filter(i => i.status)[0] : AutoBetButtonStatus.value.filter(i => i.status)[0])

/** 投注货币前缀 */
const currencyPrefix = computed(() => getLockCurrencyPrefix(currentCurrency.value?.name))
/** 投注额，转换 */
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+amount.value, +rate.value))))
const cashOutAtRef = ref()
const cashOutAt = ref('2.00')
const totalProfit = computed(() => (!isLogin.value || betAmountRef.value?.betAmountError || !roundBetted.value) ? '0.00' : toFixedByLockCurrency(mul(+amount.value, renderFrame.value.current_status === 'in_progress' ? currentPointMult.value : 1), currentCurrency.value?.name))
/** 剩余自动投注次数 */
const betTimes = ref(0)
const restBetTimes = ref(0)
/** 若赢增加 */
const percentIfWin = ref('0')
/** 若输增加 */
const percentIfLose = ref('0')
/** 止赢 */
const stopIfWinAmount = ref(toFixedByLockCurrency('0', currentCurrency.value?.name))
/** 止损 */
const stopIfLoseAmount = ref(toFixedByLockCurrency('0', currentCurrency.value?.name))
const stopIfWinAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfWinAmount.value, +rate.value))))
const stopIfLoseAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfLoseAmount.value, +rate.value))))
/** 自动投注本轮是否可以下注 */
const roundAllowBet = computed(() => {
  if (autoActive.value) {
    if (+betTimes.value > 0) {
      if (autoBetCount.value < +betTimes.value)
        return true
      else
        return false
    }
    else if (+betTimes.value === 0) {
      return true
    }
  }
  return false
})

const tabList = [
  { label: t('手动投注'), value: 'manual' },
  { label: t('自动投注'), value: 'auto' },
]
const viewTab = ref('ctrl')
const viewList = computed(() => [
  { label: t('控制'), value: 'ctrl' },
  { label: t('排行榜'), value: 'rank' },
])
const tabModelValue = ref('ctrl')

function onStopIfWinAmountBlur() {
  stopIfWinAmount.value = toFixedByLockCurrency(stopIfWinAmount.value, currentCurrency.value?.name)
}
function onStopIfLoseAmount() {
  stopIfLoseAmount.value = toFixedByLockCurrency(stopIfLoseAmount.value, currentCurrency.value?.name)
}
function openCrashIssueResult(issue_id: string) {
  issueId.value = issue_id
  showCrashResultDialog.value = true
}

function clickBetButton() {
  if (!isLogin.value) {
    Message.info(t('请先登录'))
    return
  }
  if (userInfo.value?.exclude === 1) {
    Message.info('自我排除打开了')
    return
  }
  if (tab.value === 'manual') {
    switch (currentButton.value?.type) {
      case 'bet_next_round':
        if (!balanceJudge())
          return
        setWillBet(true)
        playBetMusic()
        scrollToTop()
        break
      case 'bet_cancel':
        setWillBet(false)
        break
      case 'bet_current_round':
        if (!balanceJudge())
          return
        betNextRound()
        playBetMusic()
        break
      case 'cash_out':
        runDoBet({ id: currentId.value, type: 2, bet_amount: amount.value, currency_id: currentCurrencyCode.value, multiplier: cashOutAt.value }).then((res) => {
          setRoundBetted(false)
          setWillBet(false)
        })
        break
    }
  }
  else {
    switch (currentButton.value?.type) {
      case 'start_auto_bet':
        if (!balanceJudge())
          return
        autoBetCount.value = 0
        setAutoActive(true)
        initAmount.value = amount.value
        restBetTimes.value = betTimes.value
        userAutoCashOutProfit.value = []
        if (renderFrame.value.current_status === 'starting') {
          autoBetStartNotify()
          betNextRound()
        }

        playBetMusic()
        scrollToTop()
        break
      case 'bet_cancel':
        setAutoActive(false)
        break
      case 'cash_out':
        runDoBet({ id: currentId.value, type: 2, bet_amount: amount.value, currency_id: currentCurrencyCode.value, multiplier: cashOutAt.value }).then((res) => {
          setRoundBetted(false)
        })
        break
      case 'stop_auto_bet':
        renderFrame.value.user_cash_out_at = ''
        renderFrame.value.user_cash_out_net_amount = ''
        userAutoCashOutProfit.value = []
        setAutoActive(false)
        playBetMusic()
        break
    }
  }
}

function balanceJudge() {
  betAmountRef.value?.valiAmountBetLimit()
  if (betAmountRef.value.betAmountError) {
    setAutoActive(false)
    betTimes.value = (betTimes.value - autoBetCount.value) >= 0 ? (betTimes.value - autoBetCount.value) : 0
    restBetTimes.value = betTimes.value
    renderFrame.value.user_cash_out_at = ''
    renderFrame.value.user_cash_out_net_amount = ''
    userAutoCashOutProfit.value = []
    setWillBet(false)
    return false
  }
  return true
}

function stopIfWinLoseJudge() {
  if (tab.value === 'auto' && autoActive.value) {
    if (+stopIfWinAmount.value > 0) {
      if (userAutoTotalProfit.value >= +stopIfWinAmount.value) {
        setAutoActive(false)
        betTimes.value = (betTimes.value - autoBetCount.value) >= 0 ? (betTimes.value - autoBetCount.value) : 0
        restBetTimes.value = betTimes.value
        // renderFrame.value.user_cash_out_at = ''
        // renderFrame.value.user_cash_out_net_amount = ''
        userAutoCashOutProfit.value = []
        autoBetStopWinNotify()
        return false
      }
    }
    if (+stopIfLoseAmount.value > 0) {
      if (userAutoTotalProfit.value < 0 && Math.abs(userAutoTotalProfit.value) >= +stopIfLoseAmount.value) {
        setAutoActive(false)
        betTimes.value = (betTimes.value - autoBetCount.value) >= 0 ? (betTimes.value - autoBetCount.value) : 0
        restBetTimes.value = betTimes.value
        // renderFrame.value.user_cash_out_at = ''
        // renderFrame.value.user_cash_out_net_amount = ''
        userAutoCashOutProfit.value = []
        autoBetStopLoseNotify()
        return false
      }
    }
  }
  return true
}

async function betNextRound() {
  if (!balanceJudge())
    return
  if (!stopIfWinLoseJudge())
    return
  if (+renderFrame.value.user_cash_out_at >= 1.01 && +renderFrame.value.user_cash_out_net_amount > 0) {
    if (+percentIfWin.value > 0)
      amount.value = toFixedByLockCurrency(scientificToString(+amount.value * (1 + (+percentIfWin.value) / 100)), currentCurrency.value.name)
    else if (+percentIfLose.value > 0)
      amount.value = initAmount.value
  }
  else if (+renderFrame.value.user_cash_out_net_amount < 0) {
    if (+percentIfLose.value > 0)
      amount.value = toFixedByLockCurrency(scientificToString(+amount.value * (1 + (+percentIfLose.value) / 100)), currentCurrency.value.name)
    else if (+percentIfWin.value > 0)
      amount.value = initAmount.value
  }
  runDoBet({ type: 1, bet_amount: amount.value, currency_id: currentCurrencyCode.value, multiplier: cashOutAt.value }).then((res) => {
    setRoundBetted(true)
    setWillBet(false)
    if (res) {
      currentId.value = res.id
      renderFrame.value.order_id = res.id
      renderFrame.value.bet_amount = res.amount
      renderFrame.value.bet_point = res.state.bet_point
      renderFrame.value.currency = res.currency
      renderFrame.value.currencyType = getCurrencyConfig(res.currency).name
      Assets.load(`/pixi/${res.currency}.webp`).then((tx) => {
        renderFrame.value.currencyImageTexture = tx
      })
      if (autoActive.value)
        autoBetCount.value += 1
    }
    clearTimeout(timerId4)
    timerId4 = setTimeout(() => {
      currencyStore.initCurrencyList().then(() => {
        // balanceJudge()
      })
    }, 300)
  }).catch(() => {
    setAutoActive(false)
    renderFrame.value.user_cash_out_at = ''
    renderFrame.value.user_cash_out_net_amount = ''
    userAutoCashOutProfit.value = []
    setWillBet(false)
  })
}

const orderTab = ref('order-1')
const orderBetAmount = ref('order-1')
const orderMidArea = ref('order-1')
const orderBetProfit = ref('order-1')
const orderBetButton = ref('order-1')
const orderRanking = ref('order-1')

watchEffect(() => {
  if (isMobile.value) {
    orderTab.value = 'order-1'
    orderBetAmount.value = 'order-4'
    orderMidArea.value = 'order-3'
    orderBetProfit.value = 'order-5'
    orderBetButton.value = 'order-6'
    orderRanking.value = 'order-2'
    if (tab.value === 'auto') {
      orderTab.value = 'order-1'
      orderBetAmount.value = 'order-4'
      orderMidArea.value = 'order-3'
      orderBetProfit.value = 'order-2'
      orderBetButton.value = 'order-5'
      orderRanking.value = 'order-6'
      if (viewTab.value === 'rank') {
        orderTab.value = 'order-1'
        orderBetAmount.value = 'order-4'
        orderMidArea.value = 'order-3'
        orderBetProfit.value = 'order-2'
        orderBetButton.value = 'order-6'
        orderRanking.value = 'order-5'
      }
    }
  }
  else {
    orderTab.value = 'order-1'
    orderBetAmount.value = 'order-2'
    orderMidArea.value = 'order-3'
    orderBetProfit.value = 'order-4'
    orderBetButton.value = 'order-5'
    orderRanking.value = 'order-6'
    if (tab.value === 'auto' && viewTab.value === 'rank') {
      orderTab.value = 'order-1'
      orderBetAmount.value = 'order-2'
      orderMidArea.value = 'order-3'
      orderBetProfit.value = 'order-5'
      orderBetButton.value = 'order-6'
      orderRanking.value = 'order-4'
    }
  }
})
/** 游戏左边 slot 相关代码 end */

/**
 * 游戏右边绘制代码 start
 */

const canvasWidth = 1800
const canvasHeight = 1200

const bezierCtrlPointA = reactive({ x: 33 * designRate, y: 7 * designRate })
const bezierCtrlPointB = reactive({ x: 33 * designRate, y: 7 * designRate }) // { x: 320 * designRate, y: 230 * designRate }
const bezierCtrlStartPoint = reactive({ x: 33 * designRate, y: 7 * designRate })
const bezierEndPoint = reactive({ x: 320 * designRate, y: 230 * designRate }) // { x: 320 * designRate, y: 230 * designRate }
const bezierStartPoint = reactive({ x: 33 * designRate, y: 7 * designRate })

const yAxisStart = 1.0 // y: 7 * designRate
const yAxisEnd = ref(1.8)
const xAxisStart = 0 // x: 33 * designRate
const xAxisEnd = ref(10)
// const lastXYPoints = ref<{ m: number;s: number; x: number; y: number }[]>([
//   { m: 1.0, s: 0, x: 0, y: 0 },
// ])

// y 大于 4/5 x 大于 4/5 开始更新坐标系

const xAxisPercent = ref(0)
const yAxisPercent = ref(0)
const rateA = ref(0.03) // 0 到 0.5
const rateB = ref(0.001) // 1 到 0
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.CRASH,
})

/** 把倍数时间转换成坐标点数 */
// function transferXYPoints(arr: { m: number;s: number;x: number;y: number }[]) {
//   const last = arr.slice(-1)[0]
//   if (last)
//     return [{ x: 0, y: 0 }, { x: last.x, y: last.y }]
//   else
//     return [{ x: 0, y: 0 }]
// }

const crashAppContainer = ref()
const gameCrashWrap = ref()
const crashApp = ref()

const { width: WrapWidth } = useElementSize(gameCrashWrap)
// const { width: containerWidth, height: containerHeight } = useElementSize(crashAppContainer)

// const scaleRate = computed(() => containerWidth.value / canvasWidth)
const minHeightGameRoot = computed(() => {
  if (WrapWidth.value > 900)
    return 630
  else if (WrapWidth.value <= 400)
    return 280
  else
    return 280 + (630 - 280) * (WrapWidth.value - 400) / (900 - 400)
})

// const renderer = ref()
// const explosionTextures: any[] = []
// let boomAni: any
async function initCrash() {
  // 清理现有的canvas和资源
  if (crashApp.value) {
    // 停止所有动画
    tickerAxis.stop()

    // 清理舞台上的所有显示对象
    crashApp.value.stage?.removeChildren()
    crashApp.value.stage?.children.forEach((child: any) => {
      child?.destroy(true)
    })

    // 清理DOM中的canvas元素
    if (crashAppContainer.value)
      crashAppContainer.value.innerHTML = ''
  }

  await loadCrashAssets(theme.value)

  // globalPixi.app?.stage?.removeChildren()
  // globalPixi.app?.stage?.children.forEach((child: any) => {
  //   child?.destroy(true)
  // })
  renderFrame.value.statusButtonGreyBg = globalPixi.image_greybg // await Assets.load('/pixi/crash_grey_base.png')
  renderFrame.value.currencyImageTexture = globalPixi.image_currency //  await Assets.load('/webp/currency/701.webp')
  // renderFrame.value.statusButtonOrangeBg = await Assets.load('/pixi/crash_orange.png')
  // await Assets.load('/pixi/boom.json')
  // await app.init()
  /** 千万注意：app.init 之后才可以赋值给 crashApp */
  crashApp.value = globalPixi.app
  crashAppContainer.value?.appendChild(globalPixi.app.view)
  // renderer.value = autoDetectRenderer(crashApp.value.canvas)

  await nextTick()
  drawNetworkStatus()
  drawNetworkDot()

  const statusArea = drawStatusButton()
  const axisArea = drawAxisArea()

  crashApp.value.stage.addChild(axisArea, statusArea)

  // for (let i = 1; i < 8; i++) {
  //   const framekey = `crash_boom${i}.png`
  //   const texture = Texture.from(framekey)
  //   // const time = spritesheet.data.frames[framekey].duration;
  //   explosionTextures.push({ texture, time: 150 })
  // }
  // boomAni = new AnimatedSprite(explosionTextures)
  // boomAni.loop = false
  // boomAni.animationSpeed = 1
  // boomAni.scale.set(1)
  // boomAni.anchor.set(0.5)
  // boomAni.pivot.set(0.5)
  // boomAni.onComplete = function () {
  //   // if (crashApp.value !== null && crashApp.value !== undefined)
  //   //   crashApp.value.render()
  // }
  // crashApp.value.stage.addChild(boomAni)
  globalPixi.app.stage.addChild(globalPixi.boomAni)
  tickerAxis.update()
}

/** 网络状态 文字 */
function drawNetworkStatus() {
  const text = new Text('Network Status', {
    fontFamily: 'Proxima Nova',
    fontSize: 32,
    fill: 0x00000,
    align: 'center',
    fontWeight: '700',
  })
  text.x = 1500
  text.y = isMobile.value ? 34 : 34
  text.anchor.set(0.5, 0.5)
  text.pivot.set(0.5, 0.5)
  text.scale = { x: 1, y: -1 }

  crashApp.value.stage.addChild(text)
}

const doNet = ref(0)
/** 网络状态 绿点 红点 */
function drawNetworkDot() {
  const dot = new Graphics()
  const anidot = new Graphics()
  dot.pivot.set(0.5, 0.5)
  anidot.pivot.set(0.5, 0.5)
  dot.scale = { x: 1, y: -1 }
  anidot.scale = { x: 1, y: -1 }
  dot.y = isMobile.value ? 52 : 52
  anidot.y = isMobile.value ? 52 : 52
  let i = 0
  let j = 0
  const opacitys = [0.9, 0.7, 0.5, 0.3, 0.15, 0.1, 0.05, 0]
  const anidotwidth = [12, 14, 16, 20, 22, 24, 28, 10]
  dot.clear()
  dot.beginFill(0x01E449, 1)
  dot.drawCircle(1670, 20, 10)
  dot.endFill()
  tickerAxis.add(() => {
    if (crashApp.value !== null && crashApp.value !== undefined) {
      anidot.clear()
      if (doNet.value === 0)
        return

      if (i > 9) {
        doNet.value = 0
        i = 0
      }

      j = i % 9
      anidot.clear()
      anidot.beginFill(0x01E449, opacitys[j])
      anidot.drawCircle(1670, 20, anidotwidth[j])
      anidot.endFill()
      i++
    }
  })
  crashApp.value.stage.addChild(dot, anidot)
}

const y_axis_rect_width = [24 * designRate, 29 * designRate, 34 * designRate, 39 * designRate]
/** 纵坐标方块 */
const yAxisColor = {
  default: {
    bg: 0x9DABC9,
    text: 0xFFFFFF,
    line: 0xEBEBEB,
  },
}

function drawYAxisRect(y: number, val: string, index: number) {
  const container = new Container()
  container.width = 24 * designRate
  container.x = 0
  container.y = y
  container.height = 16.5 * designRate
  const graphics = new Graphics()
  graphics.clear()
  graphics.beginFill(yAxisColor.default.bg)
  graphics.drawRoundedRect(
    0,
    0,
    22 * designRate,
    16.5 * designRate,
    2 * designRate,
  )
  graphics.endFill()

  container.addChild(graphics)

  const text = new Text(
    '',
    {
      fontFamily: 'Arial',
      fontSize: 32,
      fill: yAxisColor.default.text,
      align: 'center',
      fontWeight: '500',
    },
  )
  text.anchor.set(0.5, 0.5)
  text.scale = { x: 1, y: -1 }
  text.x = 11 * designRate
  text.y = 8.25 * designRate
  let str = ''
  tickerAxis.add(() => {
    str = `${floor(+renderFrame.value.y_axis_values[index], 1).toFixed(1)}x`
    text.text = str
    graphics.width = y_axis_rect_width[str.length - 4] ?? y_axis_rect_width[3]
    graphics.x = 12 * designRate - graphics.width / 2
  })
  container.addChild(text)

  return container
}

/** 纵坐标 线条 */
function drawYAxisLine() {
  const line = new Graphics()
  line.clear()
  line.beginFill(yAxisColor.default.line)
  line.drawRoundedRect(
    9 * designRate,
    8.25 * designRate,
    5 * designRate,
    208 * designRate,
    0,
  )
  line.endFill()
  return line
}

/** 纵坐标 */
function drawYAxis() {
  const container = new Container()
  container.x = 0
  container.y = 0
  container.width = 22 * designRate
  container.height = 230 * designRate
  const line = drawYAxisLine()

  container.addChild(line)
  let rect
  for (let i = 0; i < 6; i++) {
    rect = drawYAxisRect(41.6 * i * designRate, '', i)
    container.addChild(rect)
  }
  return container
}

/** 横坐标 */
function drawXAxis() {
  const fillColor = 0x0D2245 // 横坐标颜色值
  const container = new Container()
  container.x = 0
  container.y = 0
  container.width = 352 * designRate
  container.height = 8 * designRate

  for (let i = 0; i < renderFrame.value.x_axis_values.length; i++) {
    const text = new Text('', {
      fontFamily: 'Arial',
      fontSize: 7 * designRate,
      fill: fillColor,
      align: 'center',
      fontWeight: '500',
    })
    text.scale = { x: 1, y: -1 }
    text.anchor.set(0.5, 0.5)
    text.y = 0
    tickerAxis.add(() => {
      text.text = i === renderFrame.value.x_axis_values.length - 1 ? `Total ${renderFrame.value.x_total_seconds}s` : `${renderFrame.value.x_axis_values[i]}s`
      text.x = 352 * designRate - 63 * designRate * (renderFrame.value.x_axis_values.length - 1 - i)
    })
    container.addChild(text)
  }
  return container
}

const arcCapColor = {
  default: 0x9DABC9, // 曲线端点颜色值
  green: 0xFFFFFF, // 曲线端点颜色值
  white: 0x484848, // 曲线端点颜色值
}
const arcCapColor2 = {
  default: 0x9DABC9, // 曲线端点颜色值
  white: 0x484848, // 曲线端点颜色值
}
/** 曲线端点 */
function drawArcCap() {
  const dot = new Graphics()
  let obj
  // let temp
  let lineColor
  let x = 0
  let y = 0
  tickerAxis.add(() => {
    obj = renderFrame.value.x_y_points[renderFrame.value.last_point_index]
    // 根据游戏状态和当前点位置设置曲线端点颜色
    // status === 2 表示游戏已崩溃(crashed)状态，last_point_index > 0 确保有绘制点
    // 崩溃状态使用 arcCapColor 颜色配置，否则使用 arcCapColor2 颜色配置
    // 如果主题颜色未定义则使用默认白色 0xFFFFFF
    lineColor = (+renderFrame.value.status === 2 && renderFrame.value.last_point_index > 0) ? arcCapColor[theme.value] || 0xFFFFFF : arcCapColor2[theme.value] || 0xFFFFFF
    if (renderFrame.value.x_y_points && renderFrame.value.x_y_points.length && obj) {
      dot.clear()
      // temp = transferXYPoints([obj])
      const lastPoint = obj // temp[temp.length - 1]
      x = lastPoint.x + bezierStartPoint.x
      y = lastPoint.y + 32
      dot.beginFill(lineColor)
      dot.drawCircle(x, y, 22)
      globalPixi.boomAni?.position.set(x + 6 * designRate, y + 18 * designRate)
      if (!renderFrame.value.boomed && renderFrame.value.current_status === 'starting_before') {
        playBoom()
        renderFrame.value.boomed = true
      }
    }
  })
  return dot
}

/** 端点爆炸效果 */
function playBoom() {
  globalPixi.boomAni.gotoAndPlay(0)
}

/** 包含纵坐标 横坐标 的绘制曲线区域 */
function drawAxisArea() {
  const container = new Container()
  container.x = 6 * designRate
  container.y = 18 * designRate
  container.width = 352 * designRate
  container.height = 235 * designRate
  const yAxis = drawYAxis()
  const xAxis = drawXAxis()
  const cap = drawArcCap()
  const curve = drawMathCurve()
  container.addChild(yAxis, xAxis, curve, cap)
  return container
}

const mathCurveColor = {
  default: {
    fill: 0xF88D22,
    line: 0x9DABC9,
  },
  green: {
    fill: 0xF88D22,
    line: 0x9DABC9,
  },

}
const mathCurveColor2 = {
  default: {
    fill: 0x9DABC9,
    line: 0x9DABC9,
  },
  white: {
    fill: 0x9DABC9,
    line: 0x9DABC9,
  },
}
/** 绘制曲线 */
function drawMathCurve() {
  const container = new Container()
  container.x = 33 * designRate
  container.y = 7 * designRate
  const downGraphic = new Graphics()
  const curve = new Graphics()
  const curveShadow = new Graphics()
  const shadow = new DropShadowFilter(globalPixi.shadowParam)

  curveShadow.filters = [shadow]
  // 最开始 是 10 秒代表 (320 * designRate - 33 * designRate) 0.8 代表 (230 * designRate - 7 * designRate)
  // 当前倍数
  let obj: any
  let fillColor
  let lineColor
  let newidx
  let yPoints
  // let stamp: number
  tickerAxis.add(() => {
    // if (+renderFrame.value.next_start_bet_at > 0 && +renderFrame.value.next_starting_in_at > 0) {
    //   stamp = Date.now()
    //   if (stamp > renderFrame.value.next_starting_in_at) {
    //     container.removeChildren()
    //     tickerAxis.stop()
    //     return
    //   }
    // }

    // 在此处可以修改曲线下方背景颜色
    // 根据游戏状态设置曲线填充颜色：status === 2 表示游戏已崩溃(crashed)状态
    // 崩溃状态使用 mathCurveColor 配置，非崩溃状态使用 mathCurveColor2 配置
    fillColor = +renderFrame.value.status === 2 ? mathCurveColor[theme.value]?.fill || 0xFF9D02 : mathCurveColor2[theme.value]?.fill || 0xFF9D02
    // 根据游戏状态设置曲线线条颜色：status === 2 表示游戏已崩溃(crashed)状态
    // 崩溃状态使用 mathCurveColor 配置，非崩溃状态使用 mathCurveColor2 配置
    lineColor = +renderFrame.value.status === 2 ? mathCurveColor[theme.value]?.line || 0xFFFFFF : mathCurveColor2[theme.value]?.line || 0xFFFFFF
    obj = renderFrame.value.x_y_points[renderFrame.value.last_point_index] // count.value * 20 +
    if (obj) {
      // if (count.value > 0 && count.value * splitLen.value > renderFrame.value.last_point_index)
      //   renderFrame.value.last_point_index += 1
      // else

      if (renderFrame.value.last_point_index < renderFrame.value.x_y_points.length - 1) {
        newidx = renderFrame.value.last_point_index + renderFrame.value.x_axis_step
        if (newidx >= renderFrame.value.x_y_points.length - 1)
          renderFrame.value.last_point_index = renderFrame.value.x_y_points.length - 1
        else
          renderFrame.value.last_point_index = newidx
      }
      // renderFrame.value.last_point_index += renderFrame.value.x_axis_step
    }
    else { return }

    // yPoints = // transferXYPoints([obj]) // renderFrame.value.x_y_points
    if (obj) {
      const endPoint = obj // yPoints[yPoints.length - 1]
      downGraphic.clear()
      curve.clear()
      curveShadow.clear()
      downGraphic.beginFill(fillColor)

      curve.lineStyle({ width: 4.5 * designRate, color: lineColor, cap: LINE_CAP.ROUND }) // , cap: 'round'
      curveShadow.lineStyle({ width: 4 * designRate, color: lineColor, cap: LINE_CAP.ROUND }) // , cap: 'round'

      downGraphic.moveTo(0, 0)
      curve.moveTo(0, 0)
      curveShadow.moveTo(0, 0)

      // A 点从两点中间慢慢往 (endPoint.x, 0) 运动
      // A 到达指定点后，B 慢慢往 (endPoint.x, 0) 运动
      // const p: any = [endPoint.x * (0.5 + rateA.value), endPoint.y * (0.5 - rateA.value), endPoint.x, endPoint.y * (1 - rateB.value), endPoint.x, endPoint.y]
      const ax = endPoint.x * (0.5 + rateA.value)
      const ay = endPoint.y * (0.5 - rateA.value)
      const bx = endPoint.x
      const by = endPoint.y * (1 - rateB.value)
      const ex = endPoint.x
      const ey = endPoint.y
      curve.bezierCurveTo(ax, ay, bx, by, ex, ey)
      curveShadow.bezierCurveTo(ax, ay, bx, by, ex, ey)
      downGraphic.bezierCurveTo(ax, ay, bx, by, ex, ey)

      downGraphic.lineTo(endPoint.x, 0)
      downGraphic.lineTo(0, 0)
      downGraphic.endFill()

      // curve.position.x = 0
      // curve.position.y = 0
    }
  })

  container.addChild(downGraphic, curveShadow, curve)
  return container
}

const centerMultColor = {
  default: 0xF10160,
  green: 0xFFFFFF,
}
/** 中间当前倍数 */
function drawCenterMult() {
  const container = new Container()
  const innerContainer = new Container()
  container.width = 700
  let color = 0x0D2245 // 中间动态倍数颜色值
  let mm
  let mstr
  let w
  let totalWidth
  let isnotdot
  const textArr: any[] = []
  // 9999999.99x
  for (let f = 0; f < 11; f++) {
    textArr.push(getText(''))
    textArr[f].scale.set(1, -1)
    innerContainer.addChild(textArr[f])
  }

  tickerAxis.add(() => {
    if (renderFrame.value.x_y_points && renderFrame.value.x_y_points.length) {
      if (['crash', 'starting_before'].includes(renderFrame.value.current_status))
        color = centerMultColor[theme.value] || centerMultColor.default
      else
        color = 0x0D2245 // 中间动态倍数颜色值

      mm = renderFrame.value.x_y_points[renderFrame.value.last_mult_index]?.m ?? 0
      if (+mm >= 1.0 && renderFrame.value.last_mult_index <= renderFrame.value.x_y_points.length - 1) {
        renderFrame.value.last_mult_index += 1

        mstr = `${floor(+mm, 2).toFixed(2)}×`
        totalWidth = 0
        for (let i = 0; i < 11; i++) {
          textArr[i].text = `${mstr[i] ?? ''}`
          isnotdot = mstr[i] !== '.'
          w = isnotdot ? 18 * designRate : 10 * designRate// (+mm >= 2 ? 8 * designRate : 8 * designRate)
          if (mstr[i] === undefined)
            w = 0
          textArr[i].width = w
          totalWidth += w
          textArr[i].x = totalWidth
          textArr[i].anchor.set(isnotdot ? 0.5 : 0, 0.5)
          textArr[i].style.fill = color
          textArr[i].scale.set(1, -1)
          innerContainer.x = 700 / 2 - innerContainer.width / 2 - 45
        }
      }
    }
  })
  innerContainer.pivot = { x: 0.5, y: 0.5 }
  container.pivot = { x: 0.5, y: 0.5 }
  container.addChild(innerContainer)
  container.y = 53 * designRate
  container.x = 0
  return container
}

const { bool: stopAnimate, setBool: setStopAnimate } = useBoolean(false)
async function animate(time: number) {
  if (stopAnimate.value) {
    cancelAnimationFrame(myReq)
    return
  }
  tickerAxis.update(time)
  myReq = requestAnimationFrame(animate)
}

function drawGraphicBase() {
  const graphics = new Sprite(renderFrame.value.statusButtonGreyBg)
  graphics.anchor.set(0, 1)
  graphics.scale.set(1, -1)
  graphics.x = 0
  graphics.y = -16
  graphics.width = 700
  return graphics
}

function drawCurrencyIcon() {
  const graphics = new Sprite(renderFrame.value.currencyImageTexture)
  graphics.anchor.set(0, 1)
  graphics.scale.set(1, -1)
  graphics.x = 0
  graphics.y = -16
  graphics.width = 56
  graphics.height = 56
  return graphics
}

function drawOrangeRect() {
  // const graphics = new Sprite(renderFrame.value.statusButtonOrangeBg)
  // graphics.anchor.set(0, 1)
  // graphics.scale.set(1, -1)
  // graphics.x = 0
  // graphics.y = -16
  // graphics.width = 560
  // return graphics
  const graphics = new Graphics()
  graphics.clear()
  graphics.beginFill(0xFF9D02)
  graphics.drawRoundedRect(
    0,
    0,
    560,
    26 * designRate,
    2 * designRate,
  )
  graphics.endFill()
  graphics.pivot.set(0.5)
  graphics.x = 9
  graphics.y = 2
  return graphics
}

function drawStatusButton() {
  const container = new Container()
  const centerMult = drawCenterMult()
  container.pivot = { x: 0.5, y: 0.5 }
  container.width = 700
  const baseWidth = 700
  let orangeWidth = 0
  const orangeRect = drawOrangeRect()
  const currencyIcon = drawCurrencyIcon()
  let rate: number
  let stamp: number
  let words: string | undefined
  let multText: string | undefined
  const graphicsBase = drawGraphicBase()
  const buttonText = new Text('', {
    fontFamily: 'Proxima Nova',
    fontSize: 12 * designRate,
    fill: 0xFFFFFF,
    align: 'center',
    fontWeight: '500',
    lineHeight: 90,
  })
  const cashOutPointText = new Text('', {
    fontFamily: 'Proxima Nova',
    fontSize: 12 * designRate,
    fill: 0x1BE449,
    align: 'center',
    fontWeight: '500',
  })
  cashOutPointText.anchor.set(0.5, 0.5)
  cashOutPointText.scale = { x: 1, y: -1 }
  buttonText.anchor.set(0.5, 0.5)
  buttonText.scale = { x: 1, y: -1 }
  let showCurrency = false
  let mm = 0
  tickerAxis.add(() => {
    // textContainer.removeChildren()
    // container.removeChildren()
    if (+renderFrame.value.next_start_bet_at > 0) {
      // renderFrame.value.user_cash_out_at = ''
      stamp = Date.now()
      // renderFrame.value.current_status = 'starting_before'
      rate = (stamp - renderFrame.value.next_starting_in_at) / renderFrame.value.crash_to_start_range
      orangeWidth = stamp > renderFrame.value.next_starting_in_at ? floor((1 - rate) * 500) : 0
      // if (renderFrame.value.current_status === 'starting_before' && stamp >= renderFrame.value.next_starting_in_at)
      //   renderFrame.value.current_status = 'starting'

      // if (stamp >= renderFrame.value.next_start_bet_at)
      //   renderFrame.value.current_status = 'pending'
    }

    showCurrency = false
    mm = renderFrame.value.x_y_points[renderFrame.value.last_mult_index]?.m ?? 0
    switch (renderFrame.value.current_status) {
      case 'starting':
        graphicsBase.width = baseWidth
        // graphicsBase.x = -8
        words = 'Starting in'
        orangeRect.width = orangeWidth >= 0 ? orangeWidth : 0
        multText = undefined
        break
      case 'start':
      case 'in_progress':
      case 'crash':
      case 'starting_before':
        orangeRect.width = 0
        if (+renderFrame.value.user_cash_out_at > 0 && +renderFrame.value.user_cash_out_net_amount > 0 && +renderFrame.value.x_y_points[renderFrame.value.x_y_points.length - 1].m > +renderFrame.value.user_cash_out_at) {
          words = t('已兑现')
          buttonText.text = words
          multText = `${renderFrame.value.user_cash_out_at}x`
          graphicsBase.width = 500
          // graphicsBase.x = 116
        }
        else if (+renderFrame.value.status === 2) {
          words = 'Crashed'
          multText = undefined
          graphicsBase.width = 324
          // graphicsBase.x = 188
        }
        else if (renderFrame.value.currencyType !== '' && +renderFrame.value.bet_amount > 0 && +renderFrame.value.bet_point >= 1.01) {
          showCurrency = true
          words = 'Return'
          if (mm > 0)
            multText = formatAmountFunc(`${+renderFrame.value.bet_amount * +mm}`, renderFrame.value.currencyType)
          graphicsBase.width = 700
          // graphicsBase.x = 0
          currencyIcon.texture = renderFrame.value.currencyImageTexture
        }
        else {
          words = undefined
          multText = undefined
          graphicsBase.width = 0
        }
        break
      case 'pending':
        orangeRect.width = 0
        words = undefined
        multText = undefined
        graphicsBase.width = 0
        break
      default:
        break
    }

    if (words)
      buttonText.text = words
    else
      buttonText.text = ''

    if (multText)
      cashOutPointText.text = multText
    else
      cashOutPointText.text = ''

    buttonText.y = 13 * designRate
    cashOutPointText.y = 13 * designRate
    currencyIcon.y = 13 * designRate - 28
    if (showCurrency) {
      container.addChild(currencyIcon)
      buttonText.x = 170
      currencyIcon.x = buttonText.x + buttonText.width / 2 + 20
      cashOutPointText.anchor.set(0, 0.5)
      cashOutPointText.x = buttonText.x + buttonText.width / 2 + 96
    }
    else {
      container.removeChild(currencyIcon)
      buttonText.x = multText ? (700 / 2 - cashOutPointText.width / 2) : 700 / 2
      cashOutPointText.anchor.set(0.5, 0.5)
      cashOutPointText.x = buttonText.x + buttonText.width / 2 + cashOutPointText.width / 2 + 18
    }
    graphicsBase.x = 350 - graphicsBase.width / 2
  })
  container.addChild(centerMult, graphicsBase, orangeRect, buttonText, cashOutPointText)
  container.x = 550 // 111 * designRate
  container.y = 80 * designRate
  return container
}

const bufferPoints = ref<any[]>([])

function initState() {
  // renderFrame.value = { ...initFrame }
  renderFrame.value.x_y_points = [{ m: 1.0, s: 0, x: 0, y: 0 }]
  renderFrame.value.x_axis_values = [2, 4, 6, 8, 0]
  renderFrame.value.x_total_seconds = 0
  renderFrame.value.y_axis_values = [1, 1.2, 1.3, 1.5, 1.7, 1.8]
  renderFrame.value.last_point_index = 0
  renderFrame.value.last_mult_index = 0
  renderFrame.value.crash_point_push_at = 0
  renderFrame.value.type = ''
  renderFrame.value.status = ''
  renderFrame.value.next_start_bet_at = 0
  renderFrame.value.crash_to_start_range = 0
  renderFrame.value.next_starting_in_at = 0
  renderFrame.value.y_axis_end = 1.8
  renderFrame.value.x_axis_end = 10
  renderFrame.value.x_axis_step = 1
  renderFrame.value.user_cash_out_at = ''
  renderFrame.value.user_cash_out_net_amount = ''
  renderFrame.value.statusButtonGreyWidth = 0
  renderFrame.value.boomed = false

  // renderFrame.value.bet_amount = ''
  // renderFrame.value.bet_point = ''
  // renderFrame.value.currency = ''

  // bufferMults.value = []
  bufferPoints.value = []
  xAxisPercent.value = 0
  yAxisPercent.value = 0
  rateA.value = 0.03
  rateB.value = 0.001
  xAxisEnd.value = 10
  yAxisEnd.value = 1.8
}

const { bool: isDomMounted, setBool: setIsDomMounted } = useBoolean(false)
const theVeryFirstPoint = ref(false)
// const msgBuffer = ref<Array<MsgType>>([])
// 处理消息
async function dealMsg(data: MsgType) {
  doNet.value = data.push_at
  const bodyMsg = data.body
  renderFrame.value.issue_id = bodyMsg.issue_id
  if (!gameGoing.value) {
    // initState()
    initLastState()
    animate(performance.now())
    if (data.type === 'start' || data.type === 'point')
      refreshRankingList()

    if (data.type === 'cashedIn')
      renderFrame.value.current_status = 'starting'
  }
  setGameGoing(true)

  renderFrame.value.type = data.type
  switch (data.type) {
    case 'point':
      if (+bodyMsg.point >= +bodyMsg.bet_point)
        setRoundBetted(false)

      renderFrame.value.status = bodyMsg.status
      renderFrame.value.current_status = 'in_progress'

      bufferPoints.value.push(data)
      currentPointMult.value = +bodyMsg.point
      renderFrame.value.x_total_seconds = +bodyMsg.second || 0
      if (+bodyMsg.crash_at > 0) {
        renderFrame.value.boomed = false
        renderFrame.value.current_status = 'crash'
        renderFrame.value.last_point_index = renderFrame.value.x_y_points.length - 1
        renderFrame.value.last_mult_index = renderFrame.value.x_y_points.length - 1
        renderFrame.value.crash_point_push_at = data.push_at
        renderFrame.value.next_start_bet_at = bodyMsg.next_start_bet_at
        renderFrame.value.next_starting_in_at = renderFrame.value.crash_point_push_at + 3000 // renderFrame.value.crash_to_start_range * 0.3
        renderFrame.value.crash_to_start_range = renderFrame.value.next_start_bet_at - renderFrame.value.next_starting_in_at // crash_point_push_at

        renderFrame.value.current_status = 'starting_before'
        clearTimeout(timerId1)
        new Promise((resolve, reject) => {
          timerId1 = setTimeout(() => {
            if (!autoActive.value)
              autoBetCount.value = 0
            cashOutList.value = []
            cashInList.value = []
            renderFrame.value.bet_amount = ''
            renderFrame.value.bet_point = ''
            renderFrame.value.currency = ''
            renderFrame.value.currencyType = ''
            renderFrame.value.current_status = 'starting'
            resolve(true)
          }, 3000)
        }).then(() => {
          clearTimeout(timerId2)
          timerId2 = setTimeout(() => {
            renderFrame.value.current_status = 'pending'
          }, renderFrame.value.crash_to_start_range)
        })

        if (+betTimes.value > 0 && +autoBetCount.value >= +betTimes.value) {
          setAutoActive(false)
          renderFrame.value.user_cash_out_at = ''
          renderFrame.value.user_cash_out_net_amount = ''
          userAutoCashOutProfit.value = []
        }

        if (!autoActive.value) {
          if (+autoBetCount.value > 0) {
            if (+betTimes.value > 0 && betTimes.value - autoBetCount.value <= 0)
              autoBetEndNotify()
            else
              autoBetStopNotify()
          }

          betTimes.value = (betTimes.value - autoBetCount.value) >= 0 ? (betTimes.value - autoBetCount.value) : 0
          autoBetCount.value = 0
        }

        if (crashPointList.value.length >= crashPointMaxLen.value)
          crashPointList.value.pop()
        crashPointList.value.unshift({ issue_id: bodyMsg.issue_id, crash_point: bodyMsg.crash_point, cashOutAt: +renderFrame.value.user_cash_out_at > 0 ? floor(+renderFrame.value.user_cash_out_at, 2).toFixed(2) : '' })
      }
      if (+bodyMsg.crash_at > 0 || +bodyMsg.cash_out_at > 0) {
        // if (roundBetted.value && +betTimes.value > 0)
        //   betTimes.value = betTimes.value - 1
        setRoundBetted(false)
        if (autoActive.value)
          restBetTimes.value = (betTimes.value - autoBetCount.value) >= 0 ? (betTimes.value - autoBetCount.value) : 0
      }

      dealData(data)
      break
    case 'start':
      theVeryFirstPoint.value = true
      initState()
      renderFrame.value.current_status = 'start'
      setWillBet(false)
      break
    case 'cashedOut':
      if (bodyMsg.uid === userInfo.value?.uid) {
        setRoundBetted(false)
        renderFrame.value.user_cash_out_at = floor(+bodyMsg.cash_out_at, 2).toFixed(2)
        renderFrame.value.user_cash_out_net_amount = bodyMsg.net_amount
        if (autoActive.value && autoBetCount.value > 0)
          userAutoCashOutProfit.value.push(bodyMsg)

        if (+bodyMsg.net_amount >= 0)
          playWinMusic()

        stopIfWinLoseJudge()
        setTimeout(() => {
          currencyStore.initCurrencyList().then(() => {
            balanceJudge()
          })
        }, 300)
      }

      if (cashOutList.value.filter(c => c.uid === bodyMsg.uid).length === 0)
        cashOutList.value.unshift({ name: bodyMsg.username, currency: bodyMsg.currency_id, amount: bodyMsg.bet_amount, hidden: !bodyMsg.username, cashOutAt: String(floor(+bodyMsg.cash_out_at, 2)), uid: bodyMsg.uid, issue_id: bodyMsg.issue_id, payout: bodyMsg.payout })
      if (cashOutList.value && cashOutList.value.length && cashOutList.value.length >= 5)
        cashOutList.value.pop()
      for (let i = 0; i < cashInList.value.length; i++) {
        const item = cashInList.value[i]
        if (item.uid === bodyMsg.uid && +bodyMsg.net_amount > 0) {
          item.cashOutAt = floor(+bodyMsg.cash_out_at, 2).toFixed(2)
          break
        }
      }
      break
    case 'cashedIn':
      cashOutList.value = []
      cashInList.value.push({ name: bodyMsg.username, currency: bodyMsg.currency_id, amount: bodyMsg.bet_amount, hidden: !bodyMsg.username, cashOutAt: '', uid: bodyMsg.uid, issue_id: bodyMsg.issue_id, currentCurrencyAmount: 0, bet_point: bodyMsg.bet_point })
      break
  }
}
// 刷新排行榜
function refreshRankingList() {
  if (renderFrame.value.issue_id) {
    runGetRanking({ issue: renderFrame.value.issue_id }).then((res) => {
      cashInList.value = res.map(item => ({ name: item.username, currency: item.currency_id, amount: item.bet_amount, cashOutAt: floor(+item.payout_multiplier, 2).toFixed(2), uid: item.uid, issue_id: renderFrame.value.issue_id, currentCurrencyAmount: 0, bet_point: '', hidden: !item.username }))
    })
  }
}

const sliceStep = computed(() => isMobile.value ? 28 : 28)
async function dealData(data: MsgType) {
  const bodyMsg = data.body
  const seconds = (data.push_at - bodyMsg.start_at) / 1000
  const mult = +bodyMsg.point
  const endP = renderFrame.value.x_y_points[renderFrame.value.x_y_points.length - 1]
  // const lastMult = bufferMults.value[bufferMults.value.length - 2] ?? 1.0
  // for (let j = +lastMult > 0 ? lastMult : 1.0; j <= mult; j += 0.01) {
  //   if (j <= mult) {
  //     curMult.value = j
  //     multArr.value.push(j)
  //   }
  // }

  // const one = (mult - endP.m) / 0.01
  let slen = +bodyMsg.status === 2 ? 1 : sliceStep.value
  // 第一个点不用切分
  if (bufferPoints.value.length === 1 && !theVeryFirstPoint.value) {
    slen = 1
    rateA.value = 0.03 + mult / 800
  }
  theVeryFirstPoint.value = true

  for (let i = 1; i <= slen; i++) {
    const txend = xAxisEnd.value
    const tyend = yAxisEnd.value
    const temp = { m: (mult - endP.m) / slen * i + endP.m, s: (seconds - endP.s) / slen * i + endP.s, x: 0, y: 0 }
    const lastXPercent = xAxisPercent.value
    const lastYPercent = yAxisPercent.value
    yAxisPercent.value = (temp.m - yAxisStart) / (tyend - yAxisStart)
    xAxisPercent.value = (temp.s - xAxisStart) / (txend - xAxisStart)
    if (bufferPoints.value.length === 1 && i === 1) {
      if (yAxisPercent.value >= 1)
        yAxisPercent.value = 0.8

      if (xAxisPercent.value >= 1)
        xAxisPercent.value = 0.8
    }
    if (yAxisPercent.value > 0.8 || xAxisPercent.value > 0.8) {
      yAxisPercent.value = (yAxisPercent.value > 0.8 || xAxisPercent.value > 0.8) ? ((lastYPercent === 0 ? 0.8 : lastYPercent) + (yAxisPercent.value > 0.8 ? 0.00005 : 0.0007)) : yAxisPercent.value
      xAxisPercent.value = (xAxisPercent.value > 0.8 || yAxisPercent.value > 0.8) ? ((lastXPercent === 0 ? 0.8 : lastXPercent) + 0.00005) : xAxisPercent.value

      if (yAxisPercent.value >= 1)
        yAxisPercent.value = 1

      if (xAxisPercent.value >= 1)
        xAxisPercent.value = 1

      // if (yAxisPercent.value > 0.8)
      yAxisEnd.value = (temp.m - yAxisStart) / yAxisPercent.value + yAxisStart
      // if (xAxisPercent.value >= 0.8)
      xAxisEnd.value = (temp.s - xAxisStart) / xAxisPercent.value + xAxisStart
    }

    rateA.value += 0.00004
    rateA.value = rateA.value <= 0.5 ? rateA.value : 0.5
    rateB.value = rateA.value === 0.5 ? (rateB.value <= 1 ? (rateB.value + 0.00008) : 1) : 0
    // if (yAxisEnd.value <= 1.8) {
    //   yAxisEnd.value = 1.8
    // }

    // if (xAxisEnd.value <= 10) {
    //   xAxisEnd.value = 10
    // }

    renderFrame.value.x_y_points.push({ ...temp, x: xAxisPercent.value * 320 * designRate, y: yAxisPercent.value * 230 * designRate })
    if (renderFrame.value.x_y_points.length - slen - 1 > renderFrame.value.last_point_index)
      renderFrame.value.last_point_index = renderFrame.value.x_y_points.length - slen - 1
    // renderFrame.value.x_axis_step = 2

    // if (renderFrame.value.last_point_index >= renderFrame.value.x_y_points.length - 1) {
    //   renderFrame.value.last_point_index = renderFrame.value.x_y_points.length - 1
    //   renderFrame.value.x_axis_step = 1
    // }
    if (renderFrame.value.x_y_points.length - slen - 1 > renderFrame.value.last_mult_index)
      renderFrame.value.last_mult_index = renderFrame.value.x_y_points.length - slen - 1
  }
  renderFrame.value.y_axis_end = yAxisEnd.value
  renderFrame.value.x_axis_end = xAxisEnd.value
  if (renderFrame.value.y_axis_end > 1.8) {
    const gap = (renderFrame.value.y_axis_end - 1) / 5
    renderFrame.value.y_axis_values = [1, floor(1 + gap, 1).toFixed(1), floor(1 + gap * 2, 1).toFixed(1), floor(1 + gap * 3, 1).toFixed(1), floor(1 + gap * 4, 1).toFixed(1), floor(renderFrame.value.y_axis_end, 1).toFixed(1)]
  }
  if (renderFrame.value.x_axis_end > 10) {
    const gap = renderFrame.value.x_axis_end / 5
    renderFrame.value.x_axis_values = [ceil(gap), ceil(gap * 2), ceil(gap * 3), ceil(gap * 4), renderFrame.value.type === 'point' ? ceil(renderFrame.value.x_total_seconds) : 0]
  }

  if (tickerAxis.deltaMS > 25)
    renderFrame.value.x_axis_step = 2

  else renderFrame.value.x_axis_step = 1
}

watch(() => renderFrame.value.current_status, (val) => {
  switch (val) {
    case 'starting':
      // cashOutList.value = []
      // cashInList.value = []
      renderFrame.value.last_point_index = 0
      renderFrame.value.last_mult_index = 0
      renderFrame.value.x_total_seconds = 0
      renderFrame.value.x_y_points = [{ m: 1.0, s: 0, x: 0, y: 0 }]
      renderFrame.value.x_axis_values = [2, 4, 6, 8, 0]
      renderFrame.value.y_axis_values = [1, 1.2, 1.3, 1.5, 1.7, 1.8]
      if (autoActive.value) {
        if (autoBetCount.value === 0)
          autoBetStartNotify()
      }
      clearTimeout(timerId3)
      timerId3 = setTimeout(() => {
        if (roundAllowBet.value)
          setWillBet(true)

        if (willBet.value) {
          betNextRound()
          playBetMusic()
        }
      }, 0)
      break
    case 'crash':
      if (!autoActive.value)
        autoBetCount.value = 0
      break
  }
})

watch(visibility, (val, old) => {
  if (val === 'visible' && old === 'hidden' && crashApp.value && crashApp.value.stage) {
    refreshRankingList()
    setStopAnimate(true)
    tickerAxis.stop()

    // if (renderFrame.value.x_y_points.length - 30 - 1 > renderFrame.value.last_point_index)
    //   renderFrame.value.last_point_index = renderFrame.value.x_y_points.length - 30 - 1

    // if (renderFrame.value.x_y_points.length - 30 - 1 > renderFrame.value.last_mult_index)
    //   renderFrame.value.last_mult_index = renderFrame.value.x_y_points.length - 30 - 1

    setStopAnimate(false)
    animate(performance.now())
  }
  if (val === 'hidden') {
    setAutoActive(false)
    setStopAnimate(true)
    tickerAxis.stop()
  }
})

async function receiveMsg(data?: { type: '' | 'point' | 'start' | 'cashedIn' | 'cashedOut', push_at: number, body: string }) {
  if (data) {
    try {
      const _body: MsgBodyType = JSON.parse(data.body)
      // msgBuffer.value.unshift({ type: data.type, push_at: data.push_at, body: _body })
      if (isDomMounted.value)
        dealMsg({ type: data.type, push_at: data.push_at, body: _body })
      // msgBuffer.value.pop()
    }
    catch {}
  }
}

function initLastState() {
  const timestamp = Date.now()
  const lastFrame = Local.get<any>('STORAGE_MINI_CRASH_RENDER_FRAME')?.value
  if (lastFrame && lastFrame.issue_id === renderFrame.value.issue_id) {
    if (timestamp < lastFrame.next_start_bet_at) {
      renderFrame.value.current_status = 'starting'
      renderFrame.value.next_start_bet_at = lastFrame.next_start_bet_at
      renderFrame.value.next_starting_in_at = lastFrame.next_starting_in_at
      renderFrame.value.crash_to_start_range = lastFrame.crash_to_start_range
    }
    setRoundBetted(!!lastFrame.roundBetted)
    if (lastFrame.betAmount && +lastFrame.betAmount > 0)
      amount.value = lastFrame.betAmount
    if (lastFrame.betPoint && +lastFrame.betPoint >= 1.01)
      cashOutAt.value = lastFrame.betPoint

    renderFrame.value.order_id = lastFrame.order_id ?? ''
    currentId.value = lastFrame.order_id ?? ''
  }
}

function onTabChange(v: string) {
  tabModelValue.value = v
}

/** 游戏右边绘制代码 end */
onMounted(async () => {
  cancelAnimationFrame(myReq)
  await initCrash()
  appEventBus.on(EventBusNames.MINI_CRASH_BUS, receiveMsg)
  appEventBus.on(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, onMqttConnectSuc)

  runGetRecordAsync({ page: 1, page_size: crashPointMaxLen.value, issue: '' }).then(() => {
    if (list.value && list.value.length <= crashPointMaxLen.value && crashPointList.value.length === 0)
      crashPointList.value = list.value.slice(0, crashPointMaxLen.value).map(item => ({ issue_id: item.issue_id, crash_point: item.crash_point, cashOutAt: '' }))
  }).finally(() => {
    setIsDomMounted(true)
    setTimeout(() => {
      onMqttConnectSuc()
    }, 1000)
  })
  onLoaded()
})

window.addEventListener('beforeunload', () => {
  cancelAnimationFrame(myReq)
  document.querySelector('.mini-game-crash-outer')?.classList.add('hidden-local')
  crashApp.value?.stage?.removeChildren()
})

onBeforeRouteLeave(() => {
  renderFrame.value.x_y_points = renderFrame.value.x_y_points.slice(-1)
  setStopAnimate(true)
  cancelAnimationFrame(myReq)
  socketClient.removeSubscribe(topic)
  socketClient.removeSubscribe(topicSite)
  document.querySelector('.mini-game-crash-outer')?.classList.add('hidden-local')
  setIsDomMounted(false)
  tickerAxis.stop()
  crashApp.value?.stage?.removeChildren()
  crashApp.value?.stage?.children.forEach((child: any) => {
    child?.destroy(true)
  })
  appEventBus.off(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, onMqttConnectSuc)
  appEventBus.off(EventBusNames.MINI_CRASH_BUS, receiveMsg)
  // Local.set(STORAGE_MINI_CRASH_RENDER_FRAME, JSON.stringify({ ...renderFrame.value, roundBetted: roundBetted.value }))
  const { next_start_bet_at, next_starting_in_at, crash_to_start_range, issue_id, order_id } = renderFrame.value
  Local.set(STORAGE_MINI_CRASH_RENDER_FRAME, {
    tab: tab.value,
    issue_id,
    next_start_bet_at,
    next_starting_in_at,
    crash_to_start_range,
    roundBetted: roundBetted.value,
    betAmount: amount.value,
    betPoint: cashOutAt.value,
    order_id,
  })
  tickerAxis.destroy()
  clearTimeout(timerId1)
  clearTimeout(timerId2)
  clearTimeout(timerId3)
  clearTimeout(timerId4)
  // crashApp.value?.stop()
  // crashApp.value?.destroy()
  if (crashAppContainer.value)
    crashAppContainer.value.innerHTML = ''
  if (autoActive.value)
    autoBetStopNotify()
})

onBeforeUnmount(() => {
  // initState()
})

function onMqttConnectSuc() {
  socketClient.removeSubscribe(topic)
  socketClient.removeSubscribe(topicSite)
  socketClient.addSubscribe(topic, { callback: crashCallback })
  socketClient.addSubscribe(topicSite, { callback: crashCallback })
}

const tabDisabled = computed(() => !gameGoing.value || autoActive.value || willBet.value || roundBetted.value || autoBetCount.value > 0)

useKeyboard((k) => {
  if (isHotKeysEnabled.value) {
    switch (k) {
      // 投注
      case KeyboardKeyEnum.SPACE:
        clickBetButton()
        break
      // 加倍投注额
      case KeyboardKeyEnum.S:
        if (tabDisabled.value)
          return
        betAmountRef.value?.double()
        break
      // 减半投注额
      case KeyboardKeyEnum.A:
        if (tabDisabled.value)
          return
        betAmountRef.value?.half()
        break
      // 零数投注额
      case KeyboardKeyEnum.D:
        if (tabDisabled.value)
          return
        amount.value = '0'
        break
      // 取消 / 兑现
      case KeyboardKeyEnum.Q:
        if (currentButton.value?.type === 'bet_cancel' || currentButton.value?.type === 'cash_out')
          clickBetButton()
        break
    }
  }
})

watch(currentGlobalCurrency, (val) => {
  if (!tabDisabled.value)
    currentCurrencyCode.value = currencyMap[val].cur
})

let timerIdRankScroll: any
function rankTableScroll() {
  if (window.innerWidth > 900) {
    clearTimeout(timerIdRankScroll)
    timerIdRankScroll = setTimeout(() => {
      document.documentElement.scrollTop = 0
    }, 2000)
  }
}
</script>

<template>
  <AppMiniGamePublicLayout
    :game="GAMES_LIST_ENUM.CRASH"
    :game-type="GAMES_LIST_ENUM.CRASH"
    :game-data="gameData"
    @open-game-info="showGameInfoDialog = true"
    @open-hot-keys="showHotKeysDialog = true"
  >
    <template #left>
      <div class="game-crash-sidebar h-full w-full flex flex-col-reverse @md:flex-col" :class="[isMobile && 'crash-mobile-sidebar']">
        <!-- {{ autoBetCount }} / {{ restBetTimes }} / {{ betTimes }} -->
        <PhBaseTabs v-model="tab" class="set-gap" :list="tabList" full :class="[orderTab]" :disabled="tabDisabled" :disable-click="tabDisabled" :type="6" />
        <PhBaseTabs v-if="tab === 'auto'" v-model="viewTab" :list="viewList" shape="square" full class="view-tab" :class="[orderTab, tabModelValue === viewTab && 'tab-active']" :type="5" @change="onTabChange" />
        <div v-show="tab === 'manual' ? true : viewTab !== 'rank'" class="w-full flex flex-col" :class="[orderBetAmount]">
          <PhBaseLabel :label="$t('投注额')" :right-text="currencyPrefix + betAmountMulRate" class="set-label-color">
            <div class="bg-[#ffffff] rounded-[4rem] border border-[#ebebeb] border-solid p-[4rem]">
              <AppMiniGamePublicBetAmount
                ref="betAmountRef"
                v-model="amount" :disabled="tabDisabled"
                need-emit
                :currency="currentCurrencyCode"
              />
            </div>
          </PhBaseLabel>
          <div class="mt-[12rem] w-full flex items-end" :class="[tab === 'auto' && !isMobile ? 'max-w-[276rem]' : '']">
            <PhBaseLabel :label="t('兑现于')" right-text="" class="w-full set-label-color">
              <AppNumberCount
                ref="cashOutAtRef"
                v-model="cashOutAt"
                :min="1.01" :disabled="tabDisabled"
              />
            </PhBaseLabel>
            <template v-if="tab === 'auto'">
              <PhBaseLabel v-if="tabDisabled" :label="t('投注次数')" class="ml-[8rem] @md:max-w-[110rem] set-label-color">
                <AppMiniGamePublicBetTimes :model-value="restBetTimes" :disabled="tabDisabled" />
              </PhBaseLabel>
              <PhBaseLabel v-else :label="t('投注次数')" class="ml-[8rem] @md:max-w-[110rem] set-label-color">
                <AppMiniGamePublicBetTimes v-model.number="betTimes" :disabled="tabDisabled" />
              </PhBaseLabel>
            </template>
          </div>
        </div>
        <div v-if="tab === 'auto' && viewTab !== 'rank'" class="w-full flex flex-col" :class="[orderMidArea]">
          <PhBaseLabel :label="t('若赢')" class="mb-[12rem] set-label-color">
            <div class="bg-[#EBEBEB] rounded-[4rem] py-[2rem] pl-[2rem] pr-[40rem]">
              <AppMiniGamePublicAutoDouble v-model="percentIfWin" :disabled="tabDisabled" />
            </div>
          </PhBaseLabel>
          <PhBaseLabel :label="t('若输')" class="mb-[12rem] set-label-color">
            <div class="bg-[#EBEBEB] rounded-[4rem] py-[2rem] pl-[2rem] pr-[40rem]">
              <AppMiniGamePublicAutoDouble v-model="percentIfLose" :disabled="tabDisabled" />
            </div>
          </PhBaseLabel>
          <PhBaseLabel
            :label="t('止盈')"
            :right-text="currencyPrefix + stopIfWinAmountMulRate"
            class="mb-[12rem] set-label-color"
          >
            <PhBaseInput
              v-model="stopIfWinAmount" type="number" input-mode="decimal" :disabled="tabDisabled"
              style="--tg-base-input-style-pad-x:7rem;--tg-base-input-style-pad-y:7rem;--tg-base-input-line-height:1.5;"
              @blur="onStopIfWinAmountBlur"
            >
              <template #right>
                <PhBaseCurrencyIcon :currency-type="currentCurrency?.name" />
              </template>
            </PhBaseInput>
          </PhBaseLabel>
          <PhBaseLabel
            :label="t('止损')"
            :right-text="currencyPrefix + stopIfLoseAmountMulRate"
            class="set-label-color"
          >
            <PhBaseInput
              v-model="stopIfLoseAmount" type="number" input-mode="decimal" :disabled="tabDisabled"
              style="--tg-base-input-style-pad-x:7rem;--tg-base-input-style-pad-y:7rem;--tg-base-input-line-height:1.5;"
              @blur="onStopIfLoseAmount"
            >
              <template #right>
                <PhBaseCurrencyIcon :currency-type="currentCurrency?.name" />
              </template>
            </PhBaseInput>
          </PhBaseLabel>
        </div>

        <PhBaseLabel v-if="isMobile ? tab === 'auto' : true" :label="t('获胜利润')" :right-text="currencyPrefix + betAmountMulRate" class="set-label-color">
          <PhBaseInput
            v-model="totalProfit" readonly
            style="--tg-base-input-style-pad-x:7rem;--tg-base-input-style-pad-y:7rem;--tg-base-input-line-height:1.5;"
          >
            <template #right>
              <PhBaseCurrencyIcon style="--tg-app-currency-icon-size:16px;" :currency-type="currentCurrency?.name" />
            </template>
          </PhBaseInput>
        </PhBaseLabel>
        <div class="bet-button w-full" :class="[orderBetButton]">
          <AppMiniGamePublicBetButton class="h-[52rem] w-full" :loading="currentButton?.loading" :disabled="currentButton?.disabled || currentButton?.loading" :game="GAMES_LIST_ENUM.CRASH" @bet-btn-click="clickBetButton">
            <div class="flex items-center text-[16rem]">
              <div>{{ currentButton?.text }}</div>
              <div v-if="currentButton?.icon" class="wobble ml-[8rem] flex items-center text-[16rem]">
                <component :is="currentButton.icon" />
              </div>
            </div>
          </AppMiniGamePublicBetButton>
        </div>
        <div v-if="tab === 'manual' || (tab === 'auto' && viewTab === 'rank')" class="w-full flex grow flex-col" :class="[orderRanking]">
          <div class="ranking text-[#6D7693] mb-[12rem] flex items-center justify-between text-[14rem] font-semibold">
            <div class="flex items-center">
              <IconUniUsers /><span class="ml-[8rem] mr-[16rem]">{{ cashInList.length }}</span>
            </div>
            <div>
              <PhBaseAmount reverse :amount="totalCashInAmount" :currency-code="currentCurrency?.cur" />
            </div>
          </div>
          <div class="ranking-table bg-tg-secondary-dark h-[230rem] w-full grow overflow-hidden rounded">
            <div class="scroll-y scroll-wrapper h-full w-full overflow-x-hidden pb-[8rem]" @scroll="rankTableScroll">
              <table class="h-min min-w-[250rem] w-full">
                <template v-for="(item, idx) in uniqSortedCashInList" :key="item.uid">
                  <tr v-if="idx < 30" class="text-tg-secondary-light text-[14rem] font-semibold" :class="[`uid_${item.uid}`]">
                    <td class="w-[40%] pl-[12rem]">
                      <div v-if="item.hidden" class="hoverable">
                        <VTooltip placement="top" :triggers="['click', 'hover']">
                          <div class="ghost hidden-user flex items-center text-[14rem] font-semibold">
                            <IconUniHidden />
                            <span class="ml-[4rem]">{{ t('隐身') }}</span>
                          </div>
                          <template #popper>
                            <div class="tiny-menu-item-title">
                              {{ t('此玩家启用了私密功能') }}
                            </div>
                          </template>
                        </VTooltip>
                      </div>
                      <div v-else class="overflow-hidden pr-[4rem] hoverable">
                        <div class="max-w-[96rem] overflow-hidden text-ellipsis whitespace-nowrap">
                          {{ item.name }}
                        </div>
                      </div>
                    </td>
                    <td class="text-[#6D7693] width-[20%]">
                      <span v-if="+item.cashOutAt > 0">{{ item.cashOutAt }}x</span>
                      <span v-else>-</span>
                    </td>
                    <td class="text-[#6D7693] width-[40%] pr-[8rem]">
                      <VTooltip placement="top" :triggers="['click', 'hover']">
                        <PhBaseAmount class="set-color" :amount="+item.cashOutAt > 0 ? (+item.amount) * (+item.cashOutAt) : item.amount" :currency-code="item.currency" reverse show-prefix :show-color="+item.cashOutAt > 0" />
                        <template #popper>
                          <div class="tiny-menu-item-title">
                            <PhBaseAmount show-prefix :amount="+item.cashOutAt > 0 ? (+item.amount) * (+item.cashOutAt) : item.amount" :currency-code="item.currency" />
                          </div>
                        </template>
                      </VTooltip>
                    </td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #right>
      <div ref="gameCrashWrap" class="mini-game-crash-outer relative w-full flex grow grow flex-col justify-center" :style="{ minHeight: `${minHeightGameRoot}rem` }">
        <div class="relative right-[16rem] top-[16rem] z-[1] flex flex-row-reverse">
          <div class="side-btns ml-[8rem] flex flex-col justify-between">
            <PhBaseButton size="xs" round class="bg-dark" @click="showCrashPointRecordDialog = true">
              <IconChessFrame1 class="text-color-whites text-[10rem]" />
            </PhBaseButton>
            <span class="text-tg-secondary-light cur-user mt-[4rem] flex items-center text-[10rem]">
              <IconUniArrowLeft class="text-color-black" />
              <span class="color-black">{{ t('您') }}</span>
            </span>
          </div>
          <div class="past-bets w-full flex flex-row-reverse">
            <template v-for="(item, idx) in crashPointList" :key="item.issue_id + item.crash_point">
              <div v-if="idx <= 5" class="wrap flex flex-col items-center">
                <PhBaseButton class="button-number" :class="+item.crash_point >= 2 ? '' : 'button-lose'" round @click="() => openCrashIssueResult(item.issue_id)">
                  {{ floor(+item.crash_point, 2).toFixed(2) }}x
                </PhBaseButton>
                <span v-if="+item.cashOutAt > 0" class="text-tg-text-green mt-[4rem] text-center text-[10rem] leading-[18rem]">
                  <span>{{ item.cashOutAt }}x</span>
                </span>
              </div>
            </template>
          </div>
        </div>
        <div class="mini-game-crash h-full w-full flex grow flex-col items-center justify-between">
          <BaseAspectRatio ratio="3/2">
            <div ref="crashAppContainer" class="wrapper h-full w-full flex items-center justify-center" />
          </BaseAspectRatio>
          <div class="fake" />
        </div>
        <div v-if="showPlayerResult" class="cashout-wrapper absolute right-[1rem] top-[45%] flex origin-right scale-50 gap-[8rem] transition-opacity duration-500 @md:scale-100" :class="[['starting', 'pending', 'start'].includes(renderFrame.current_status) || cashOutList.length === 0 ? 'opacity-0' : 'opacity-100', isMobile ? 'bottom-[8rem]' : '']">
          <div class="cashout-listing height-[15rem] flex flex-col items-end">
            <div v-for="(item, idx) in cashOutList" :key="idx" class="wrap text-[#b1bad3] index text-[14rem] font-semibold" :class="[idx < cashOutList.length - 1 ? 'mb-[8rem]' : '']">
              <div v-if="item.hidden" class="hoverable">
                <div class="ghost hidden-user-2 flex items-center">
                  <IconUniHidden />
                  <span class="ml-[4rem] text-[14rem]">{{ t('隐身') }}</span>
                </div>
              </div>
              <div v-else>
                <div class="text-[14rem] hoverable">
                  {{ item.name }}
                </div>
              </div>
              <VTooltip placement="top" :triggers="['click', 'hover']">
                <PhBaseAmount class="set-color" :amount="item.payout" :currency-code="item.currency" reverse show-prefix show-color />
                <template #popper>
                  <div class="tiny-menu-item-title">
                    <PhBaseAmount :amount="item.payout" :currency-code="item.currency" show-prefix />
                  </div>
                </template>
              </VTooltip>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
  <PhBaseDialog v-model="showGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesGameInfo :game-type="GAMES_LIST_ENUM.CRASH" />
  </PhBaseDialog>
  <PhBaseDialog v-model="showHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesHotKeys :game-type="GAMES_LIST_ENUM.CRASH" />
  </PhBaseDialog>
  <PhBaseDialog v-if="showCrashPointRecordDialog" v-model="showCrashPointRecordDialog" :title="t('历史记录')">
    <AppDialogCrashPointRecord />
  </PhBaseDialog>
  <PhBaseDialog v-if="showCrashResultDialog" v-model="showCrashResultDialog" :title="t('详情')">
    <AppMiniGameCrashResultAndRanking :issue-id="issueId" />
  </PhBaseDialog>
</template>

<style lang="scss" scoped>
.cashout-wrapper {
  transition: opacity 0.5s;
  transform-origin: center right;
}
.cashout-listing {
  .wrap.index {
    padding: 8rem 16rem;
    display: inline-flex;
    justify-content: center;
    color: #d5dceb;
    background: #213743;
    border-radius: 100rem;
    align-items: center;
    transition: opacity 0.5s;
    border: 2rem solid #2f4553;
    opacity: var(--opacity);
    > *:not(:first-child) {
      margin-left: 4rem;
    }
  }
  .wrap.index:nth-of-type(1),
  .wrap.index:nth-of-type(2) {
    --opacity: 1;
  }
  .wrap.index:nth-of-type(3) {
    --opacity: 0.8;
  }
  .wrap.index:nth-of-type(4) {
    --opacity: 0.5;
  }
}
.set-color {
  --ph-base-amount-positive-color: #f23038;
}
.set-gap {
  --tabs-item-gap: 0;
}
.set-label-color {
  --ph-base-label-color: #6d7693;
}
.bg-dark {
  --ph-base-button-primary-background-color: #6d7693;
  --ph-base-button-border-radius: 27rem;
}
.text-color-whites {
  --tg-base-icon-color: #ffffff;
}
.text-color-black {
  --tg-base-icon-color: #0d2245;
}
.color-black {
  color: #0d2245;
}
.hoverable {
  color: #6d7693;
}
.button-number {
  width: 59rem;
  height: 31rem;
  font-size: 12rem;
  border-radius: 20rem;
}
.button-lose {
  background-color: #6d7693;
}
.cur-user {
  color: #0d2245;
}
.ranking {
  --tg-app-currency-icon-size: 16px;
}
.side-btns {
  --tg-spacing-button-padding-horizontal-xs: 11px;
  --tg-spacing-button-padding-vertical-xs: 11px;
}
.past-bets {
  --tg-spacing-button-padding-vertical-xs: 10px;
  --tg-base-button-font-size: 12px;
  > * {
    font-variant-numeric: tabular-nums;
    will-change: transform;
    animation-fill-mode: forwards;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
  }
  > * + * {
    margin-right: 4rem;
  }
  > *:nth-child(odd) {
    animation-name: slideOdd;
  }
  > *:nth-child(2n) {
    animation-name: slideEven;
  }
}
.game-crash-sidebar {
  --tg-tab-style-inner-padding-y: 13px;
  > * {
    margin-bottom: 12rem;
  }
  > :first-child {
    margin-bottom: 12rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
  &.crash-mobile-sidebar {
    > :first-child {
      margin-bottom: 0;
    }
    > :last-child {
      margin-bottom: 12rem;
    }
  }
}
.default-btn {
  color: #fff;
}
.view-tab {
  --ph-tab-style-box-padding: 0;
  --tg-tab-style-active-bg: #0f212e;
  --tg-tab-style-wrap-bg-color: #2f4553;
  --tabs-item-rounded: 0;
  --tabs-wrap-padding-x: 0;
  --tabs-item-gap: 0;
  border-radius: 4rem !important;
  overflow: hidden;
  :deep(.tab) {
    border-radius: 0 !important;
  }
  :deep(.tab:hover) {
    background-color: #2f4553;
  }
  :deep(.tab.active:hover) {
    background-color: #0f212e;
  }
  :deep(.base-tab-wrap .tab-wrap .tab-padding-box) {
    padding: 0;
  }
  :deep(.base-tab-wrap .tab-wrap .tab-padding-box:first-of-type) {
    padding-left: 0;
  }
  :deep(.base-tab-wrap .tab-wrap .tab-padding-box:last-of-type) {
    padding-right: 0;
  }
}
@keyframes slideOdd {
  0% {
    transform: translate(100%);
  }
}

@keyframes slideEven {
  0% {
    transform: translate(100%);
  }
}
</style>

<style lang="scss">
.mini-game-crash canvas {
  width: 100%;
  transform-origin: 50% 50%;
  transform: scale(1, -1);
  background: #0f212e;
  position: relative;
  z-index: 0;
}

.mini-game-crash .fake {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0f212e;
  opacity: 0;
}

.mini-game-crash-outer.hidden-local .fake {
  opacity: 1;
  z-index: 1;
}

.mini-game-crash-outer.hidden-local canvas {
  visibility: hidden;
  opacity: 0;
  z-index: -2;
  width: 0 !important;
  height: 0 !important;
}
</style>

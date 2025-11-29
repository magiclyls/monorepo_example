<script setup lang='ts'>
import { ApiGameOriginaWheel } from '@tg/apis'
import { BaseAspectRatio, PhBaseCurrencyIcon, PhBaseDialog, PhBaseInput, PhBaseLabel, PhBaseSelect, PhBaseTabs } from '@tg/bccomponents'
import { IconUniGameInfo, IconUniKeyboard } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { KeyboardKeyEnum } from '@tg/types'
import { add, application, div, formatWithSubstring, getCurrencyConfig, mul, scrollToTop, sub, toFixed } from '@tg/utils'
import { useDocumentVisibility, useElementSize } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { storeToRefs } from 'pinia'
import * as PIXI from 'pixi.js'
import { computed, inject, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'
import {
  AppMiniGamePartMinesGameInfo,
  AppMiniGamePartMinesHotKeys,
  AppMiniGamePublicAutoDouble,
  AppMiniGamePublicBetAmount,
  AppMiniGamePublicBetButton,
  AppMiniGamePublicBetTimes,
} from '../_components'
import AppMiniGamePublicLayout from '../_components/AppMiniGamePublicLayout.vue'
import { useKeyboard, useMiniGameAutoBetNotifications, useMiniGameGlobalStateHotKeys, useMiniGameGlobalStateLiveBetting, useMiniGameLockCurrency, useMiniGamePublicPlayMp3 } from '../composables'

type RiskType = 'low' | 'middle' | 'high'
type SegmentsType = 10 | 20 | 30 | 40 | 50
interface GameStatusType {
  result: number
  segments: SegmentsType
  risk: RiskType
  switch: boolean
  textShow: boolean
  textAniamtion: boolean
  giveRotate: boolean
  /** 记录上次转盘位置 */
  rotateContainerRotation: number
  payouts: Array<number>
}
interface autoStatusType {
  betTimes: number
  originalBetTimes: number
  incOnWin: string
  incOnLoss: string
  stopOnProfit: string
  stopOnLoss: string
  nowWinning: number
  originalBetAmount: string
}
interface GameFooterListType {
  color: string
  odds: number
  oddsString: string
}
defineOptions({
  name: 'AppMiniGameMainWheel',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const appStore = useAppStore()
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(currencyStore)
const currentGlobalCurrency = computed(() => currentGlobalCurrencyMap.value.type)
const decimalNum = computed(() => currentGlobalCurrencyMap.value.decimal)

const { isLogin, userInfo } = storeToRefs(appStore)
const visibility = useDocumentVisibility()
const { autoBetStartNotify, autoBetStopNotify, autoBetEndNotify, autoBetStopWinNotify, autoBetStopLoseNotify } = useMiniGameAutoBetNotifications()
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
/** 即时下注 */
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()

const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playWinMusic } = useMiniGamePublicPlayMp3('/audio/limbo.win.mp3')
/** 是否开启动画 */
const animateEnabled = ref(true)
/** 正在完成投注 */
const isFinishingBetting = ref(false)
/** 自动 - 游戏开始 */
const isAutoStart = ref(false)
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.WHEEI,
})
/** 初始化配置 */
const wheelPayouts = [
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 10,
  },
  {
    payouts: [
      0,
      1.9,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
    ],
    risk: 'middle',
    rows: 10,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      9.9,
    ],
    risk: 'high',
    rows: 10,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 20,
  },
  {
    payouts: [
      1.5,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.8,
      0,
      2,
      0,
      2,
      0,
      2,
      0,
    ],
    risk: 'middle',
    rows: 20,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      19.8,
    ],
    risk: 'high',
    rows: 20,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 30,
  },
  {
    payouts: [
      1.5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.7,
      0,
      4,
      0,
      1.5,
      0,
      2,
      0,
    ],
    risk: 'middle',
    rows: 30,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      29.7,
    ],
    risk: 'high',
    rows: 30,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 40,
  },
  {
    payouts: [
      2,
      0,
      3,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.6,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
    ],
    risk: 'middle',
    rows: 40,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      39.6,
    ],
    risk: 'high',
    rows: 40,
  },
  {
    payouts: [
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
      1.5,
      1.2,
      1.2,
      1.2,
      0,
      1.2,
      1.2,
      1.2,
      1.2,
      0,
    ],
    risk: 'low',
    rows: 50,
  },
  {
    payouts: [
      2,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      2,
      0,
      2,
      0,
      1.5,
      0,
      3,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
      1.5,
      0,
      5,
      0,
      1.5,
      0,
      2,
      0,
      1.5,
      0,
    ],
    risk: 'middle',
    rows: 50,
  },
  {
    payouts: [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      49.5,
    ],
    risk: 'high',
    rows: 50,
  },
]
const tabList = [
  { label: t('手动投注'), value: 'manual' },
  { label: t('自动投注'), value: 'auto' },
]
const riskList = [
  { label: t('低等'), value: 'low' },
  { label: t('中等'), value: 'middle' },
  { label: t('高等'), value: 'high' },
]
const segmentsList = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 },
]
const colorsEnum: { [t: string]: string } = {
  0: '#406c82',
  1.2: '#d5e8f2',
  1.5: '#00e403',
  1.6: '#d5e8f2',
  1.7: '#d5e8f2',
  1.8: '#d5e8f2',
  1.9: '#d5e8f2',
  2: '#fde905',
  3: '#7f46fd',
  4: '#fca32f',
  5: '#007bff',
  9.9: '#ff0000',
  19.8: '#ff0000',
  29.7: '#ff0000',
  39.6: '#ff0000',
  49.5: '#ff0000',
}
/** 游戏状态 */
const gameStatus = reactive<GameStatusType>({
  result: 0,
  segments: 30,
  risk: 'middle',
  switch: false,
  textShow: false,
  textAniamtion: false,
  /** 赋值优化动画结束 */
  giveRotate: false,
  /** 记录已经的旋转 */
  rotateContainerRotation: 0,
  payouts: [],
})
/** 自动投注配置 */
const autoBetConfig = reactive<autoStatusType>({
  betTimes: 0,
  originalBetTimes: 0,
  incOnWin: '0',
  incOnLoss: '0',
  stopOnProfit: toFixed(0, decimalNum.value),
  stopOnLoss: toFixed(0, decimalNum.value),
  /** 当次自动投注盈利 */
  nowWinning: 0,
  originalBetAmount: '',
})
/** 订单币种 */
const globalCurrencyCode = computed(() => currentGlobalCurrencyMap.value.cur ?? '701')
const {
  rate,
  orderCurrencyCode,
  toFixedByLockCurrency,
  getLockCurrencyPrefix,
} = useMiniGameLockCurrency(globalCurrencyCode.value)
const orderCurrencyType = computed(() => getCurrencyConfig(orderCurrencyCode.value).name)
const currencyPrefix = computed(() => getLockCurrencyPrefix(orderCurrencyType.value))
const tab = ref('manual')
const betAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
const betAmountRef = ref()
const gameRef = ref()
const wheelBoxRef = ref()
const stopOnProfitErrorMsg = ref('')
const stopOnLossErrorMsg = ref('')
const showGameInfoDialog = ref(false)
const showHotKeysDialog = ref(false)
const gameFooterList = ref<GameFooterListType[]>([])
const gameFooterListActiveIndex = ref(-1)
const gameFooterListresIndex = ref(-1)
const oddsStatistics = ref<null | Record<string, number>>(null)
const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
const autoBetBtnText = computed(() => isAutoStart.value ? t('停止自动投注') : (isFinishingBetting.value ? t('正在完成投注') : t('开始自动投注')))
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))
const stopOnProfitMulRate = computed(() => formatWithSubstring(toFixed(+mul(+autoBetConfig.stopOnProfit, +rate.value))))
const stopOnLossMulRate = computed(() => formatWithSubstring(toFixed(+mul(+autoBetConfig.stopOnLoss, +rate.value))))

/* 轮盘size */
const { width: wheelBoxWidth } = useElementSize(wheelBoxRef)
/* 获胜利润 */
const winningProfit = computed(() => toFixedByLockCurrency(mul(+sub(gameFooterList.value[gameFooterListActiveIndex.value]?.odds, 1), +betAmount.value), orderCurrencyType.value))
/* 胜算 */
const winningChance = computed(() => `${oddsStatistics.value?.[gameFooterList.value[gameFooterListActiveIndex.value]?.odds]} / ${gameStatus.segments}`)
const disableAutoOptions = computed(() => isAutoStart.value || isFinishingBetting.value)
/* 计算响应样式 */
const wheelBoxMinHeight = computed(() => {
  if (wheelBoxWidth.value > 900)
    return 630
  else if (wheelBoxWidth.value <= 400)
    return 280
  else
    return 280 + (630 - 280) * (wheelBoxWidth.value - 400) / (900 - 400)
})
const wheelBoxFs = computed(() => {
  if (wheelBoxWidth.value > 900)
    return 1
  else if (wheelBoxWidth.value <= 400)
    return 0.5
  else
    return (0.5 + 0.5 * (wheelBoxWidth.value - 400) / (900 - 400)).toFixed(6)
})
/* 计算弹框箭头位置 */
const arrowPosition = computed(() => {
  const average = 100 / gameFooterList.value.length * gameFooterListActiveIndex.value
  switch (gameFooterList.value.length) {
    case 2:
      return `${average + 25}%`
    case 3:
      return `${average + 16.666666}%`
    case 5:
      return `${average + 10}%`
    case 6:
      return `${average + 8.3333333}%`
    default:
      return `${0}%`
  }
})

/* 初始化canvas */
const { app: wheelApp, creatARC, handleVisibilityChange } = initWheel()
/** 建立订单 */
const { runAsync: runMakeOrder, loading: orderLoading } = useRequest(() => ApiGameOriginaWheel({
  bet_amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  risk: gameStatus.risk,
  segments: gameStatus.segments,
}))
/**  离开止盈输入框 */
function changeStopProfit() {
  if (+autoBetConfig.stopOnProfit < 0) {
    stopOnProfitErrorMsg.value = t('必须大于或等于0')
  }
  else if (+autoBetConfig.stopOnProfit === 0) {
    autoBetConfig.stopOnProfit = '0.00'
    stopOnProfitErrorMsg.value = ''
  }
  else {
    autoBetConfig.stopOnProfit = toFixed(+autoBetConfig.stopOnProfit, decimalNum.value)
    stopOnProfitErrorMsg.value = ''
  }
}
/** 离开止损输入框 */
function changeStopLoss() {
  if (+autoBetConfig.stopOnLoss < 0) {
    stopOnLossErrorMsg.value = t('必须大于或等于0')
  }
  else if (+autoBetConfig.stopOnLoss === 0) {
    autoBetConfig.stopOnLoss = '0.00'
    stopOnLossErrorMsg.value = ''
  }
  else {
    autoBetConfig.stopOnLoss = toFixed(+autoBetConfig.stopOnLoss, decimalNum.value)
    stopOnLossErrorMsg.value = ''
  }
}

/** 点击手动投注 */
function makeOrder() {
  if (!isLogin.value)
    return Message.info(t('请先登录'))
  if (userInfo.value?.exclude === 1)
    return Message.error(t('请先解除自我排除'))

  if (gameStatus.switch)
    return
  betAmountRef.value?.valiAmountBetLimit()
  if (betAmountRef.value.betAmountError)
    return
  playBetMusic()
  playWinMusic(0)
  runMakeOrder().then((data) => {
    scrollToTop()
    currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
    gameStatus.switch = true
    gameStatus.textAniamtion = false
    gameStatus.result = data.state.result
  })
}
/** 点击自动投注 */
function startAutoBet() {
  if (!isLogin.value)
    return Message.info(t('请先登录'))
  if (userInfo.value?.exclude === 1)
    return Message.error(t('请先解除自我排除'))

  if (isAutoStart.value)
    return stopAutoBet()
  if (gameStatus.switch)
    return
  betAmountRef.value?.valiAmountBetLimit()
  if (betAmountRef.value.betAmountError)
    return
  autoBetConfig.originalBetTimes = autoBetConfig.betTimes
  autoBetConfig.nowWinning = 0
  autoBetConfig.originalBetAmount = betAmount.value
  isAutoStart.value = true
  exeAutoBet(true)
  autoBetStartNotify()
  scrollToTop()
  playBetMusic()
  playWinMusic(0)
}
/** 执行自动投注 */
function exeAutoBet(isFirst: boolean) {
  if (!isFirst) {
    // 传入上一次的结果
    updateAutoBetConfig(gameStatus.result)
    nextTick(() => {
      if (willStopAutoBet())
        return
      runMakeOrder().then((data) => {
        // 动画优化
        if (isLiveBetting.value) {
          gameFooterListresIndex.value = -1
          setTimeout(() => {
            currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
            gameStatus.switch = true
            gameStatus.textAniamtion = false
          }, 400)
        }
        else {
          currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
          gameStatus.switch = true
          gameStatus.textAniamtion = false
        }
        gameStatus.result = data.state.result
        countNowWinning(gameStatus.result)
      }).catch(() => {
        isAutoStart.value = false
      })
    })
  }
  else {
    runMakeOrder().then((data) => {
      currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
      gameStatus.switch = true
      gameStatus.textAniamtion = false
      gameStatus.result = data.state.result
      countNowWinning(gameStatus.result)
    }).catch(() => {
      isAutoStart.value = false
    })
  }
}
/** 自动投注配置调整 */
function updateAutoBetConfig(result: number) {
  if (gameStatus.payouts[result] !== 0) {
    if (+autoBetConfig.incOnWin > 0)
      betAmount.value = application.formatNumDecimal(mul(+betAmount.value, +add(+div(+autoBetConfig.incOnWin, 100), 1)), decimalNum.value)
    else
      betAmount.value = autoBetConfig.originalBetAmount
  }
  else {
    if (+autoBetConfig.incOnLoss > 0)
      betAmount.value = application.formatNumDecimal(mul(+betAmount.value, +add(+div(+autoBetConfig.incOnLoss, 100), 1)), decimalNum.value)
    else
      betAmount.value = autoBetConfig.originalBetAmount
  }
}
/** 是否停止自动投注 */
function willStopAutoBet() {
  // 正在停止投注 直接终止
  if (isFinishingBetting.value) {
    isFinishingBetting.value = false
    autoBetStopNotify()
    return true
  }
  betAmountRef.value?.valiAmountBetLimit()
  if (betAmountRef.value.betAmountError) {
    autoBetEndNotify()
    isAutoStart.value = false
    return true
  }
  // 手动停止不减自动投注次数
  if (autoBetConfig.betTimes > 0 && isAutoStart.value) {
    autoBetConfig.betTimes -= 1
    if (autoBetConfig.betTimes === 0) {
      autoBetEndNotify()
      isAutoStart.value = false
    }
  }
  if ((autoBetConfig.originalBetTimes !== 0 && autoBetConfig.betTimes === 0) || !isAutoStart.value) {
    isAutoStart.value = false
    return true
  }
  if (autoBetConfig.nowWinning >= +autoBetConfig.stopOnProfit && +autoBetConfig.stopOnProfit !== 0) {
    autoBetStopWinNotify()
    isAutoStart.value = false
    return true
  }
  if (+autoBetConfig.stopOnLoss === 0 || autoBetConfig.nowWinning >= 0) {
    return false
  }
  else if (Math.abs(autoBetConfig.nowWinning) >= +autoBetConfig.stopOnLoss) {
    autoBetStopLoseNotify()
    isAutoStart.value = false
    return true
  }
}
/** 手动停止自动投注 */
function stopAutoBet() {
  isAutoStart.value = false
  isFinishingBetting.value = true
}
/** 计算当前盈利金额 */
function countNowWinning(result: number) {
  autoBetConfig.nowWinning = +sub(autoBetConfig.nowWinning, +betAmount.value)
  if (gameStatus.payouts[result] === 0)
    return
  autoBetConfig.nowWinning = +add(autoBetConfig.nowWinning, +mul(gameStatus.payouts[result], +betAmount.value))
}
/** 初始化转盘 */
function initWheel() {
  const Ratio = window.devicePixelRatio
  const app = new PIXI.Application({
    // background: '#000',
    backgroundAlpha: 0,
    // resizeTo: window,
    antialias: true, // default: false 反锯齿
    resolution: Ratio, // default: 1 分辨率
    width: 1100 / Ratio,
    height: 1100 / Ratio,
  });

  (app.view as HTMLCanvasElement).setAttribute('style', 'position: absolute; inset: 0px; width: 100%; height: 100%;')
  const appXcenter = 1100 / 2 / Ratio
  const appYcenter = (1100 + 20) / 2 / Ratio
  const roundBorder = appXcenter / 14

  app.ticker.add(() => {
    // delta is 1 if running at 100% performance
    ARCAnimation()
    textAnimation()
    textShow()
  })

  const rotateContainer = new PIXI.Container()
  app.stage.addChild(rotateContainer)
  rotateContainer.x = appXcenter
  rotateContainer.y = appYcenter

  const textContainer = new PIXI.Container()
  app.stage.addChild(textContainer)
  textContainer.x = appXcenter
  textContainer.y = appYcenter

  const round1 = new PIXI.Graphics()
  const round1Color = getCanvasColor(1)
  round1.lineStyle(roundBorder, round1Color, 1)
  round1.drawCircle(appXcenter, appYcenter, appXcenter - appXcenter / 10)
  round1.endFill()
  app.stage.addChild(round1)

  const round3 = new PIXI.Graphics()
  const round3Color = getCanvasColor(3)
  round3.lineStyle(2, round3Color, 1)
  round3.drawCircle(appXcenter, appYcenter, appXcenter / 3.2)
  round3.endFill()
  app.stage.addChild(round3)

  // draw a pointer
  const graphics = new PIXI.Graphics()
  graphics.beginFill('#e76374')
  graphics.moveTo(appXcenter, appXcenter / 5)
  graphics.lineTo(appXcenter + appXcenter / 23, appXcenter / 18)
  graphics.lineTo(appXcenter - appXcenter / 23, appXcenter / 18)

  graphics.closePath()
  graphics.endFill()
  app.stage.addChild(graphics)

  const pointerRound = new PIXI.Graphics()
  pointerRound.beginFill('#c35463')
  pointerRound.lineStyle(appXcenter / 80, '#e76374', 1)
  pointerRound.drawCircle(appXcenter, appXcenter / 20, appXcenter / 28)
  pointerRound.endFill()
  app.stage.addChild(pointerRound)

  function creatARC() {
    rotateContainer.removeChildren()
    // 角度没有负值
    const eachAngle = 2 * Math.PI / gameStatus.payouts.length
    const startAngle = Math.PI + Math.PI / 2 - eachAngle / 2

    for (let i = 0; i < gameStatus.payouts.length; i++) {
      const arc = new PIXI.Graphics()
      arc.lineStyle(roundBorder, colorsEnum[gameStatus.payouts[i]], 1)
      arc.arc(0, 0, appXcenter - appXcenter / 10 - roundBorder, eachAngle * i + startAngle, startAngle + eachAngle * (i + 1))
      rotateContainer.addChild(arc)
    }
    // 修复锯齿
    const borderDeg = 2 * Math.PI / 4000
    for (let i = 0; i < gameStatus.payouts.length; i++) {
      const arc = new PIXI.Graphics()
      arc.lineStyle(roundBorder, colorsEnum[gameStatus.payouts[i]], 1)
      arc.arc(0, 0, appXcenter - appXcenter / 10 - roundBorder, eachAngle * i + startAngle - borderDeg, eachAngle * i + startAngle + borderDeg)
      rotateContainer.addChild(arc)
    }
    // 分段20或者以上才有段阴影
    if (gameStatus.payouts.length >= 20) {
      for (let i = 0; i < gameStatus.payouts.length; i++) {
        const arc = new PIXI.Graphics()
        arc.lineStyle(roundBorder, '#000000', 0.02)
        arc.arc(0, 0, appXcenter - appXcenter / 10 - roundBorder, eachAngle * i + startAngle - borderDeg, eachAngle * i + startAngle + borderDeg)
        rotateContainer.addChild(arc)
      }
    }
    // 生成圆弧阴影
    const round4 = new PIXI.Graphics()
    round4.lineStyle(roundBorder / 5, '#000000', 0.1)
    round4.drawCircle(0, 0, appXcenter - appXcenter / 10 - roundBorder / 1.66)
    round4.endFill()
    rotateContainer.addChild(round4)
  }

  function creatText() {
    textContainer.removeChildren()
    const style = new PIXI.TextStyle({
      fontFamily: 'proxima-nova',
      fontWeight: '500',
      fontSize: 74 / Ratio,
      fill: colorsEnum[gameStatus.payouts[gameStatus.result]],
    })

    const message = new PIXI.Text(`${gameStatus.payouts[gameStatus.result].toFixed(2)}×`, style)
    message.x = -100 / Ratio
    message.y = -40 / Ratio
    textContainer.addChild(message)
  }

  function ARCAnimation(pageActive = false) {
    if (!gameStatus.switch || gameStatus.textAniamtion)
      return
    textContainer.alpha = 0
    textContainer.scale.set(0, 0)
    // 2 * Math.PI 是一圈                                                          取余恢复到0度      toFixed                                         转盘是0度时候应该到达的位置
    const totoalRotate = gameStatus.rotateContainerRotation + 6 * Math.PI - gameStatus.rotateContainerRotation % (2 * Math.PI) - 2 * Math.PI / gameStatus.segments * (gameStatus.result)
    const leftRotate = totoalRotate - rotateContainer.rotation
    if (rotateContainer.rotation >= totoalRotate || isLiveBetting.value || pageActive) {
      if (isLiveBetting.value || pageActive)
        rotateContainer.rotation = totoalRotate
      gameStatus.textAniamtion = true
      gameStatus.textShow = true
      gameStatus.switch = false
      gameStatus.rotateContainerRotation = rotateContainer.rotation
      creatText()
    }
    else if (gameStatus.risk === 'high') {
      const regiveRotate = Math.PI * 2 / 50 * 6
      if (leftRotate <= regiveRotate) {
        if (gameStatus.giveRotate === false) {
          rotateContainer.rotation = totoalRotate - regiveRotate
          gameStatus.giveRotate = true
        }
        rotateContainer.rotation += Math.PI / 80
      }
      else {
        rotateContainer.rotation += Math.PI / 4
      }
    }
    else if (gameStatus.risk === 'middle') {
      const regiveRotate = Math.PI * 2 / 50 * 6
      if (gameStatus.segments === 20) {
        if (leftRotate <= regiveRotate) {
          if (gameStatus.giveRotate === false) {
            rotateContainer.rotation = totoalRotate - regiveRotate
            gameStatus.giveRotate = true
          }
          rotateContainer.rotation += Math.PI / 80
        }
        else {
          rotateContainer.rotation += Math.PI / 4
        }
      }
      else if (gameStatus.segments === 40) {
        if (leftRotate <= regiveRotate) {
          if (gameStatus.giveRotate === false) {
            rotateContainer.rotation = totoalRotate - regiveRotate
            gameStatus.giveRotate = true
          }
          rotateContainer.rotation += Math.PI / 80
        }
        else {
          rotateContainer.rotation += Math.PI / 8
        }
      }
      else {
        if (leftRotate <= regiveRotate) {
          if (gameStatus.giveRotate === false) {
            rotateContainer.rotation = totoalRotate - regiveRotate
            gameStatus.giveRotate = true
          }
          rotateContainer.rotation += Math.PI / 80
        }
        // else if (leftRotate <= Math.PI) {
        //   rotateContainer.rotation += Math.PI / 20
        // }
        else {
          rotateContainer.rotation += Math.PI / 6
        }
      }
    }
    else if (gameStatus.risk === 'low') {
      const regiveRotate = Math.PI * 2 / 50 * 6
      if (leftRotate <= regiveRotate) {
        if (gameStatus.giveRotate === false) {
          rotateContainer.rotation = totoalRotate - regiveRotate
          gameStatus.giveRotate = true
        }
        rotateContainer.rotation += Math.PI / 80
      }
      else if (leftRotate <= Math.PI) {
        rotateContainer.rotation += Math.PI / 20
      }
      else {
        rotateContainer.rotation += Math.PI / 4
      }
    }
  }
  // 函数执行完一局游戏完成
  function textAnimation(pageActive = false) {
    if (gameStatus.textAniamtion) {
      textContainer.scale.set(textContainer.scale._x += 0.1, textContainer.scale._x += 0.1)
      textContainer.alpha += 0.1
    }
    if ((textContainer.scale._x >= 1 || pageActive) && gameStatus.textAniamtion) {
      if (pageActive) {
        textContainer.scale.set(1, 1)
        textContainer.alpha = 1
      }
      gameStatus.textAniamtion = false
    }
  }

  function textShow() {
    if (!gameStatus.textShow)
      textContainer.visible = false
    else
      textContainer.visible = true
  }
  function handleVisibilityChange() {
    if (document.hidden) {
      const intervalId = setTimeout(() => {
        if (!document.hidden) {
          clearInterval(intervalId)
          return
        }
        ARCAnimation(true)
        textAnimation(true)
        textShow()
        isAutoStart.value = false
      }, 800)
    }
  }
  return { app, creatARC, handleVisibilityChange }
}
/* 重置游戏 */
function initNewGame() {
  gameStatus.payouts = wheelPayouts.filter(item => gameStatus.risk === item.risk && gameStatus.segments === item.rows)[0]?.payouts || []
  creatARC()
  gameFooterListresIndex.value = -1
  gameFooterListActiveIndex.value = -1
  gameStatus.textShow = false
  gameFooterList.value = bubbleSort([...new Set(gameStatus.payouts)]).map((item) => {
    return {
      color: colorsEnum[item],
      odds: item,
      oddsString: `${item.toFixed(2)}x`,
    }
  })
  oddsStatistics.value = countOccurrences(gameStatus.payouts)
}
/** 冒泡排序 */
function bubbleSort(arr: number[]) {
  const newArr = [...arr]
  const len = newArr.length
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (newArr[j] > newArr[j + 1]) {
        const temp = newArr[j]
        newArr[j] = newArr[j + 1]
        newArr[j + 1] = temp
      }
    }
  }
  return newArr
}
/** 统计数组元素出现次数 */
function countOccurrences(arr: number[]) {
  const count: { [t: string]: number } = {}
  arr.forEach((item) => {
    count[item] = (count[item] || 0) + 1
  })
  return count
}
/** 根据主题获取颜色 */
function getCanvasColor(round: number) {
  if (round === 1) {
    return '#213743'
  }
  else if (round === 3) {
    return '#555555'
  }
  else { return '' }
}

/** 快捷键 */
useKeyboard((k) => {
  const disabled = gameStatus.switch || orderLoading.value || disableAutoOptions.value
  if (isHotKeysEnabled.value) {
    switch (k) {
      // 投注
      case KeyboardKeyEnum.SPACE:
        if (isManual.value && !gameStatus.switch && !orderLoading.value)
          makeOrder()
        else if (isAutoBet.value && !isFinishingBetting.value)
          startAutoBet()
        break
      // 加倍投注额
      case KeyboardKeyEnum.S:
        if (disabled)
          return
        betAmountRef.value?.double()
        break
      // 减半投注额
      case KeyboardKeyEnum.A:
        if (disabled)
          return
        betAmountRef.value?.half()
        break
      // 零数投注额
      case KeyboardKeyEnum.D:
        if (disabled)
          return
        betAmount.value = toFixedByLockCurrency('0', orderCurrencyType.value)
        break
    }
  }
})

watch([() => gameStatus.risk, () => gameStatus.segments], () => initNewGame())
watch(() => gameStatus.switch, () => {
  if (!gameStatus.switch) {
    gameStatus.giveRotate = false
    const payouts = wheelPayouts.filter(item => gameStatus.risk === item.risk && gameStatus.segments === item.rows)[0]?.payouts || []
    const odds = payouts[gameStatus.result]
    gameFooterListresIndex.value = gameFooterList.value.findIndex(item => item.odds === odds)
    if (odds !== 0)
      playWinMusic()
    if (!isAutoStart.value)
      orderCurrencyCode.value = globalCurrencyCode.value
    currencyStore.initCurrencyList().then(() => {
      if (isAutoStart.value || isFinishingBetting.value)
        exeAutoBet(false)
    })
  }
  else {
    gameFooterListresIndex.value = -1
  }
})
watch(globalCurrencyCode, (a) => {
  if (!gameStatus.switch)
    orderCurrencyCode.value = a
  if (isAutoStart.value)
    stopAutoBet()
})
watch(visibility, () => handleVisibilityChange())

onMounted(() => {
  initNewGame()
  onLoaded()
  gameRef.value.appendChild(wheelApp.view)
})
window.addEventListener('beforeunload', () => {
  gameRef.value.style.display = 'none'
  wheelApp.stage.removeChildren()
})
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled"
    :game="GAMES_LIST_ENUM.WHEEI" :game-type="GAMES_LIST_ENUM.WHEEI"
    :game-data="gameData"
    @open-game-info="showGameInfoDialog = true"
    @open-hot-keys="showHotKeysDialog = true"
  >
    <template #left>
      <div class="grid w-full gap-y-12">
        <PhBaseLabel class="order-first mb-[10rem] set-label-color" :label="t('投注额')" :right-text="currencyPrefix + betAmountMulRate" style="--ph-base-label-margin-bottom: 2rem;">
          <div class="bg-[#ffffff] rounded-[4rem] border border-[#ebebeb] border-solid p-[4rem]">
            <AppMiniGamePublicBetAmount
              ref="betAmountRef"
              v-model="betAmount" style="--ph-base-button-border-radius:4rem" :currency="orderCurrencyCode"
              :disabled="gameStatus.switch || orderLoading || disableAutoOptions"
            />
          </div>
        </PhBaseLabel>
        <div class="order-4 mt-[10rem] flex gap-12 @[800px]:flex-col">
          <PhBaseLabel class="flex-1 @[800px]:order-2 set-label-color" :label="t('风险')" style="--ph-base-label-margin-bottom: 2rem;--ph-base-select-background-color:#fff;">
            <PhBaseSelect
              v-model="gameStatus.risk" class="theme-select"
              :disabled="gameStatus.switch || orderLoading || disableAutoOptions" small :options="riskList"
            />
          </PhBaseLabel>
          <PhBaseLabel class="flex-1 @[800px]:order-3 set-label-color" :label="t('分段')" style="--ph-base-label-margin-bottom: 2rem;--ph-base-select-background-color:#fff;">
            <PhBaseSelect
              v-model.number="gameStatus.segments" class="theme-select"
              :disabled="gameStatus.switch || orderLoading || disableAutoOptions" small :options="segmentsList"
            />
          </PhBaseLabel>
        </div>
        <PhBaseTabs
          v-model="tab" :disabled="gameStatus.switch || orderLoading || disableAutoOptions"
          :disable-click="gameStatus.switch || orderLoading || disableAutoOptions"
          :type="6"
          class="order-last mt-[10rem] @[800px]:order-1" :list="tabList" full
          style="--tg-tab-style-inner-padding-y:13px;--tg-tab-style-inner-padding-x:16px;"
        />
        <!-- 自动投注 -->
        <div v-show="isAutoBet" class="order-6 mt-[10rem] grid gap-y-12">
          <PhBaseLabel :label="t('投注次数')" class="mt-[10rem] set-label-color" style="--ph-base-label-margin-bottom: 2rem;">
            <AppMiniGamePublicBetTimes v-model.number="autoBetConfig.betTimes" :disabled="disableAutoOptions" />
          </PhBaseLabel>
          <PhBaseLabel :label="t('若赢')" class="mt-[10rem] set-label-color" style="--ph-base-label-margin-bottom: 2rem;">
            <AppMiniGamePublicAutoDouble v-model="autoBetConfig.incOnWin" :disabled="disableAutoOptions" />
          </PhBaseLabel>
          <PhBaseLabel :label="t('若输')" class="mt-[10rem] set-label-color" style="--ph-base-label-margin-bottom: 2rem;">
            <AppMiniGamePublicAutoDouble v-model="autoBetConfig.incOnLoss" :disabled="disableAutoOptions" />
          </PhBaseLabel>
          <PhBaseLabel :label="t('止盈')" class="mt-[10rem] set-label-color" :right-text="currencyPrefix + stopOnProfitMulRate" style="--ph-base-label-margin-bottom: 2rem;">
            <PhBaseInput
              v-model="autoBetConfig.stopOnProfit" :step="0.01" type="number" input-mode="decimal"
              class="theme-input" :disabled="disableAutoOptions" :msg="stopOnProfitErrorMsg" @blur="changeStopProfit"
            >
              <template #right>
                <PhBaseCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
              </template>
            </PhBaseInput>
          </PhBaseLabel>
          <PhBaseLabel :label="t('止损')" class="mt-[10rem] set-label-color" :right-text="currencyPrefix + stopOnLossMulRate" style="--ph-base-label-margin-bottom: 2rem;">
            <PhBaseInput
              v-model="autoBetConfig.stopOnLoss" :step="0.01" type="number" input-mode="decimal"
              class="theme-input" :disabled="disableAutoOptions" :msg="stopOnLossErrorMsg" @blur="changeStopLoss"
            >
              <template #right>
                <PhBaseCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
              </template>
            </PhBaseInput>
          </PhBaseLabel>
        </div>
        <AppMiniGamePublicBetButton
          v-if="isManual" class="order-2 @[800px]:order-last"
          :disabled="gameStatus.switch || orderLoading" :game="GAMES_LIST_ENUM.WHEEI" :loading="orderLoading"
          @bet-btn-click="makeOrder"
        >
          {{ t('投注') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet" :disabled="isFinishingBetting"
          :loading="isAutoStart || isFinishingBetting || orderLoading" is-auto class="order-1 @[800px]:order-last"
          :game="GAMES_LIST_ENUM.WHEEI" @bet-btn-click="startAutoBet"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div ref="wheelBoxRef" class="bg flex flex-1 flex-col" :style="{ minHeight: `${wheelBoxMinHeight}px` }">
        <div
          class="mx-auto max-w-[750px] w-full flex flex-1 flex-col items-center justify-center p-[10rem]"
          :style="{ fontSize: `${wheelBoxFs}em` }"
        >
          <div class="w-full flex flex-col items-center justify-center">
            <BaseAspectRatio class="max-w-[325rem] @[400px]:max-w-550">
              <div ref="gameRef" class="relative h-full w-full" />
            </BaseAspectRatio>
          </div>
          <div class="relative grid w-full gap-[1em]">
            <div
              v-for="item, index in gameFooterList" :key="item.color" :style="{ '--border-color': item.color }"
              :class="{ active: index === gameFooterListActiveIndex || index === gameFooterListresIndex }"
              class="btn-box footer-text-box shadow-tg-box-shadow text-[#fff] bg-[var(--wheel-secondary)] relative row-start-1 row-end-auto flex cursor-help items-center justify-center overflow-hidden rounded-[8px] font-semibold text-shadow-lg"
              @click="gameFooterListActiveIndex = index" @mouseenter="gameFooterListActiveIndex = index"
              @mouseleave="gameFooterListActiveIndex = -1"
            >
              <span class="relative leading-[1.5] text-[14px]"><span>{{ item.oddsString
              }}</span></span>
            </div>
            <!-- 提示框 -->
            <div
              v-if="gameFooterListActiveIndex !== -1"
              class="footer-tips-box flex-row-1em bg-[var(--wheel-secondary)] -grey absolute right-0 w-full flex justify-between rounded-[4px] p-[1em]"
              style="animation: 300ms linear 0ms 1 normal both gameFooterTips; bottom:calc(100% + 1em)"
              :style="{ '--arrow-position': arrowPosition, '--column-count': gameFooterList.length }"
            >
              <PhBaseLabel class="order-2 flex-1 set-label-color" :label="t('获胜利润')" style="--ph-base-label-margin-bottom: 2rem;--ph-base-label-color:#fff">
                <div
                  class="bg-[#3d5564]  shadow-tg-box-shadow flex items-center justify-between rounded-[4px]"
                >
                  <div
                    class="text-[#fff] flex flex-1 text-[12rem] items-center justify-between p-[0.5em] font-semibold leading-[1.5]"
                  >
                    <span>{{ winningProfit }}</span>
                    <PhBaseCurrencyIcon style="--tg-app-currency-icon-size:16px" :currency-type="orderCurrencyType" />
                  </div>
                </div>
              </PhBaseLabel>
              <PhBaseLabel class="order-2 flex-1 set-label-color" :label="t('胜算')" style="--ph-base-label-margin-bottom: 2rem;--ph-base-label-color:#fff">
                <div
                  class="bg-[#3d5564] text-[12rem]  shadow-tg-box-shadow flex items-center justify-between rounded-[4px]"
                >
                  <div
                    class="text-[#fff] tg-secondary flex flex-1 items-center justify-between p-[0.5em] font-semibold leading-[1.5]"
                  >
                    <span>{{ winningChance }}</span>
                  </div>
                </div>
              </PhBaseLabel>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
  <PhBaseDialog v-model="showGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesGameInfo :game-type="GAMES_LIST_ENUM.WHEEI" />
  </PhBaseDialog>
  <PhBaseDialog v-model="showHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesHotKeys :game-type="GAMES_LIST_ENUM.WHEEI" />
  </PhBaseDialog>
</template>

<style lang='scss'>
  :root {
  --wheel-secondary: #2f4553;
}
</style>

<style lang='scss' scoped>
  .flex-row-1em {
  > *:not(:first-child) {
    margin-left: 1em;
  }
}
.set-label-color {
  --ph-base-label-color: #6d7693;
}
.footer-text-box {
  padding: 0.75em 0.5em calc(0.75em + 3px);

  &::before {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    transform: translateY(calc(100% - 6px));
    background: var(--border-color);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
    transition-duration: 0.2s;
    transition-timing-function: ease-out;
    transition-property: transform;
  }

  &.active::before {
    transform: translateY(0);
  }
}

.footer-tips-box {
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: var(--arrow-position);
    width: 0;
    height: 0;
    font-weight: 500;
    border-style: solid;
    border-width: 0.5em 0.5em 0;
    border-color: #213743 transparent transparent transparent;
    transform: translate(-50%);
  }
}

.shadow-tg-box-shadow {
  box-shadow:
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.2) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.12) 0px 1px 2px 0px;
}
</style>

<style>
@keyframes gameFooterTips {
  0% {
    transform: translate(0px, -15px);
    opacity: 0;
  }

  5.55533% {
    transform: translate(0px, -12.6364px);
    opacity: 0.157573;
  }

  11.1107% {
    transform: translate(0px, -10.5351px);
    opacity: 0.297658;
  }

  16.666% {
    transform: translate(0px, -8.68076px);
    opacity: 0.421282;
  }

  22.2213% {
    transform: translate(0px, -7.05786px);
    opacity: 0.529476;
  }

  27.7767% {
    transform: translate(0px, -5.65098px);
    opacity: 0.623268;
  }

  33.332% {
    transform: translate(0px, -4.44471px);
    opacity: 0.703686;
  }

  38.8873% {
    transform: translate(0px, -3.42362px);
    opacity: 0.771759;
  }

  44.4427% {
    transform: translate(0px, -2.57226px);
    opacity: 0.828516;
  }

  49.998% {
    transform: translate(0px, -1.87523px);
    opacity: 0.874985;
  }

  55.5533% {
    transform: translate(0px, -1.31707px);
    opacity: 0.912195;
  }

  61.1087% {
    transform: translate(0px, -0.882368px);
    opacity: 0.941175;
  }

  66.664% {
    transform: translate(0px, -0.555689px);
    opacity: 0.962954;
  }

  72.2193% {
    transform: translate(0px, -0.321602px);
    opacity: 0.97856;
  }

  77.7747% {
    transform: translate(0px, -0.164678px);
    opacity: 0.989021;
  }

  83.33% {
    transform: translate(0px, -0.0694861px);
    opacity: 0.995368;
  }

  88.8853% {
    transform: translate(0px, -0.0205959px);
    opacity: 0.998627;
  }

  94.4407% {
    transform: translate(0px, -0.00257727px);
    opacity: 0.999828;
  }

  99.996% {
    transform: translate(0px, -9.59233e-13px);
    opacity: 1;
  }

  100% {
    transform: translate(0px, 0px);
    opacity: 1;
  }
}
</style>

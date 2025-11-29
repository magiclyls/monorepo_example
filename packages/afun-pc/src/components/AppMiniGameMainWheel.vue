<script setup lang='ts'>
import { ApiGameOriginaWheel } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'
import * as PIXI from 'pixi.js'

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
const onLoaded = inject('onLoaded', () => {})
const { t } = useI18n()
const gameStore = useGameStore()
const appStore = useAppStore()
/** 金额小数位数 */
const { decimalNum } = storeToRefs(gameStore)
const { currentGlobalCurrency, isLogin, theme, userInfo } = storeToRefs(appStore)
const visibility = useDocumentVisibility()
const { openRegisterDialog } = useRegisterDialog()
const { autoBetStartNotify, autoBetStopNotify, autoBetEndNotify, autoBetStopWinNotify, autoBetStopLoseNotify } = useMiniGameAutoBetNotifications()
const { openMiniGameInfoInsertDialog } = useMiniGameInsertDialogMinesGameInfo({ gameType: GAMES_LIST_ENUM.WHEEI })
const { openMiniGameHotKeysInsertDialog } = useMiniGameInsertDialogHotKeys({ gameType: GAMES_LIST_ENUM.WHEEI })
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
/** 即时下注 */
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()

const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playWinMusic } = useMiniGamePublicPlayMp3('/audio/limbo.win.mp3')
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 正在完成投注 */
const { bool: isFinishingBetting } = useBoolean(false)
/** 自动 - 游戏开始 */
const { bool: isAutoStart } = useBoolean(false)

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
  { label: t('mini_manual_bet'), value: 'manual' },
  { label: t('mini_auto_bet'), value: 'auto' },
]
const riskList = [
  { label: t('keno_risk_low'), value: 'low' },
  { label: t('keno_risk_medium'), value: 'middle' },
  { label: t('keno_risk_high'), value: 'high' },
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
const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')
const {
  rate,
  orderCurrencyCode,
  toFixedByLockCurrency,
  getLockCurrencyPrefix,
} = useMiniGameLockCurrency(globalCurrencyCode.value)
const orderCurrencyType = computed(() => getCurrencyConfigByCode(orderCurrencyCode.value).name)
const currencyPrefix = computed(() => getLockCurrencyPrefix(orderCurrencyType.value))
const tab = ref('manual')
const betAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
const betAmountRef = ref()
const gameRef = ref()
const wheelBoxRef = ref()
const stopOnProfitErrorMsg = ref('')
const stopOnLossErrorMsg = ref('')
const gameFooterList = ref<GameFooterListType[]>([])
const gameFooterListActiveIndex = ref(-1)
const gameFooterListresIndex = ref(-1)
const oddsStatistics = ref<null | Record<string, number>>(null)
const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
const autoBetBtnText = computed(() => isAutoStart.value ? t('mini_stop_auto_bet') : (isFinishingBetting.value ? t('mini_auto_bet_finish') : t('mini_start_auto_bet')))
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
    stopOnProfitErrorMsg.value = t('mini_must_than_zero')
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
    stopOnLossErrorMsg.value = t('mini_must_than_zero')
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
const { openNotify } = useNotify()
/** 点击手动投注 */
function makeOrder() {
  if (!isLogin.value)
    return openRegisterDialog()
  if (userInfo.value?.exclude === 1)
    return openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })

  if (gameStatus.switch)
    return
  betAmountRef.value?.valiAmountBetLimit()
  if (betAmountRef.value.betAmountError)
    return
  playBetMusic()
  playWinMusic(0)
  runMakeOrder().then((data) => {
    scrollMainContentToTop()
    appStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
    gameStatus.switch = true
    gameStatus.textAniamtion = false
    gameStatus.result = data.state.result
  })
}
/** 点击自动投注 */
function startAutoBet() {
  if (!isLogin.value)
    return openRegisterDialog()
  if (userInfo.value?.exclude === 1)
    return openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })

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
  scrollMainContentToTop()
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
            appStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
            gameStatus.switch = true
            gameStatus.textAniamtion = false
          }, 400)
        }
        else {
          appStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
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
      appStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
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
      fontWeight: '600',
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
    if (theme.value === 'greenblack' || theme.value === 'white')
      return '#555555'
    else if (theme.value === 'green')
      return '#215d41'
    else
      return '#213743'
  }
  else if (round === 3) {
    if (theme.value === 'greenblack')
      return '#282828'
    else if (theme.value === 'white')
      return '#555555'
    else if (theme.value === 'green')
      return '#0E6746'
    else
      return '#293741'
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
        betAmount.value = '0'
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
    appStore.getBalanceData().then(() => {
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
    v-model:animate-enabled="animateEnabled" :game-type="GAMES_LIST_ENUM.WHEEI"
    @open-game-info="openMiniGameInfoInsertDialog"
    @open-hot-keys="openMiniGameHotKeysInsertDialog"
  >
    <template #left>
      <div class="w-full flex flex-col gap-[12px]">
        <BaseLabel class="order-3" :label="t('bet_amount')" :right-text="currencyPrefix + betAmountMulRate">
          <AppMiniGamePublicBetAmount
            ref="betAmountRef" v-model="betAmount" :currency="orderCurrencyCode"
            :disabled="gameStatus.switch || orderLoading || disableAutoOptions"
          />
        </BaseLabel>
        <div class="order-4 flex gap-[12px] @[800px]:flex-col">
          <BaseLabel class="flex-1 @[800px]:order-2" :label="t('plinko_risk')">
            <BaseSelect
              v-model="gameStatus.risk"
              class="theme-select" :disabled="gameStatus.switch || orderLoading || disableAutoOptions" small
              :options="riskList"
            />
          </BaseLabel>
          <BaseLabel class="flex-1 @[800px]:order-3" :label="t('segments')">
            <BaseSelect
              v-model.number="gameStatus.segments"
              class="theme-select" :disabled="gameStatus.switch || orderLoading || disableAutoOptions" small
              :options="segmentsList"
            />
          </BaseLabel>
        </div>
        <BaseTab
          v-model="tab" :disabled="gameStatus.switch || orderLoading || disableAutoOptions" :disable-click="gameStatus.switch || orderLoading || disableAutoOptions"
          class="order-last @[800px]:order-1" :list="tabList" full
          style="--tg-tab-style-inner-padding-y:13px;--tg-tab-style-inner-padding-x:16px;"
        />
        <!-- 自动投注 -->
        <div v-show="isAutoBet" class="order-6 flex flex-col gap-[12px]">
          <BaseLabel :label="t('mini_bet_frequency')">
            <AppMiniGamePublicBetTimes v-model.number="autoBetConfig.betTimes" :disabled="disableAutoOptions" />
          </BaseLabel>
          <BaseLabel :label="t('mini_if_win')">
            <AppMiniGamePublicAutoDouble v-model="autoBetConfig.incOnWin" :disabled="disableAutoOptions" />
          </BaseLabel>
          <BaseLabel :label="t('mini_if_lose')">
            <AppMiniGamePublicAutoDouble v-model="autoBetConfig.incOnLoss" :disabled="disableAutoOptions" />
          </BaseLabel>
          <BaseLabel :label="t('mini_take_profit')" :right-text="currencyPrefix + stopOnProfitMulRate">
            <BaseInput
              v-model="autoBetConfig.stopOnProfit" :step="0.01" type="number" input-mode="decimal" class="theme-input"
              :disabled="disableAutoOptions" :msg="stopOnProfitErrorMsg" @blur="changeStopProfit"
            >
              <template #right-icon>
                <AppCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
              </template>
            </BaseInput>
          </BaseLabel>
          <BaseLabel :label="t('mini_stop_lose')" :right-text="currencyPrefix + stopOnLossMulRate">
            <BaseInput
              v-model="autoBetConfig.stopOnLoss" :step="0.01" type="number" input-mode="decimal" class="theme-input"
              :disabled="disableAutoOptions" :msg="stopOnLossErrorMsg" @blur="changeStopLoss"
            >
              <template #right-icon>
                <AppCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
              </template>
            </BaseInput>
          </BaseLabel>
        </div>
        <AppMiniGamePublicBetButton
          v-if="isManual" class="order-2 @[800px]:order-last" :disabled="gameStatus.switch || orderLoading"
          :game="GAMES_LIST_ENUM.WHEEI" :loading="orderLoading" @bet-btn-click="makeOrder"
        >
          {{ t('mini_touzhu') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet" :disabled="isFinishingBetting" :loading="isAutoStart || isFinishingBetting || orderLoading" is-auto
          class="order-1 @[800px]:order-last" :game="GAMES_LIST_ENUM.WHEEI" @bet-btn-click="startAutoBet"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div ref="wheelBoxRef" class="bg flex flex-1 flex-col" :style="{ minHeight: `${wheelBoxMinHeight}px` }">
        <div
          class="mx-auto max-w-[750px] w-full flex flex-1 flex-col items-center justify-center p-[1em]"
          :style="{ fontSize: `${wheelBoxFs}em` }"
        >
          <div class="w-full flex flex-col items-center justify-center">
            <BaseAspectRatio class="max-w-[325px] @[400px]:max-w-[550px]">
              <div ref="gameRef" class="relative h-full w-full" />
            </BaseAspectRatio>
          </div>
          <div class="relative grid w-full gap-[1em]">
            <div
              v-for="item, index in gameFooterList" :key="item.color" :style="{ '--border-color': item.color }"
              :class="{ active: index === gameFooterListActiveIndex || index === gameFooterListresIndex }"
              class="btn-box footer-text-box shadow-tg-box-shadow text-tg-text-white bg-tg-secondary relative row-start-1 row-end-auto flex cursor-help items-center justify-center overflow-hidden rounded-[8px] font-semibold text-shadow-lg"
              @click="gameFooterListActiveIndex = index" @mouseenter="gameFooterListActiveIndex = index"
              @mouseleave="gameFooterListActiveIndex = -1"
            >
              <span class="relative leading-[1.5]" style="font-size: var(--tg-font-size-default);"><span>{{ item.oddsString
              }}</span></span>
            </div>
            <!-- 提示框 -->
            <div
              v-if="gameFooterListActiveIndex !== -1"
              class="footer-tips-box flex-row-1em bg-tg-secondary-grey absolute right-0 w-full flex justify-between rounded-[4px] p-[1em]"
              style="animation: 300ms linear 0ms 1 normal both gameFooterTips; bottom:calc(100% + 1em)"
              :style="{ '--arrow-position': arrowPosition, '--column-count': gameFooterList.length }"
            >
              <BaseLabel class="order-2 flex-1" :label="t('mini_win_profit')">
                <div class="bg-tg-secondary shadow-tg-box-shadow flex items-center justify-between rounded-[4px]">
                  <div class="text-tg-text-white flex flex-1 items-center justify-between p-[0.5em] font-semibold leading-[1.5]">
                    <span>{{ winningProfit }}</span>
                    <AppCurrencyIcon style="--tg-app-currency-icon-size:16px" :currency-type="orderCurrencyType" />
                  </div>
                </div>
              </BaseLabel>
              <BaseLabel class="order-2 flex-1" :label="t('win_chance')">
                <div class="bg-tg-secondary shadow-tg-box-shadow flex items-center justify-between rounded-[4px]">
                  <div
                    class="text-tg-text-white tg-secondary flex flex-1 items-center justify-between p-[0.5em] font-semibold leading-[1.5]"
                  >
                    <span>{{ winningChance }}</span>
                  </div>
                </div>
              </BaseLabel>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
</template>

<style lang='scss' scoped>
.theme-select {
  @include webTheme('white') {
    --tg-base-select-bg-theme-white: #fff;
    --tg-base-select-border: 1px solid #fff;
  }
}
.theme-input {
  @include webTheme('green') {
    --tg-base-input-style-border: 1px solid #197b59;
    --tg-base-input-style-bg: #02432d;
  }
  @include webTheme('white') {
    --tg-base-input-style-bg: #fff;
  }
}
.bg {
  @include webTheme('white') {
    background: #e3e3e3;
  }
  @include webTheme('green') {
    background: #02432d;
  }
}
.flex-row-1em {
  > *:not(:first-child) {
    margin-left: 1em;
  }
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
    box-shadow: var(--tg-box-shadow);
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
    font-weight: 600;
    border-style: solid;
    border-width: 0.5em 0.5em 0;
    border-color: var(--tg-secondary-grey) transparent transparent transparent;
    transform: translate(-50%);
  }
}
.btn-box {
  @include webTheme('green') {
    background-color: #076237;
  }
  @include webTheme('white') {
    background-color: #304554;
    color: #fff;
  }
}
</style>

<script setup lang='ts'>
import type { OriginalGameDragonTile } from '~/shims'
import { ApiBettingGameOriginalDragon, ApiGameOriginalDragonMultiple } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { globalDragon, tickerDragonAxis } from '~/utils/mini-dragon-test'

defineOptions({
  name: 'AppMiniGameMainDragonTower',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const { openRegisterDialog } = useRegisterDialog()
const { isMobile } = storeToRefs(useWindowStore())
const {
  autoBetStartNotify,
  autoBetStopNotify,
  autoBetEndNotify,
  autoBetStopWinNotify,
  autoBetStopLoseNotify,
} = useMiniGameAutoBetNotifications()
const { openMiniGameInfoInsertDialog } = useMiniGameInsertDialogMinesGameInfo({ gameType: GAMES_LIST_ENUM.DRAGONTOWER })
const { openMiniGameHotKeysInsertDialog } = useMiniGameInsertDialogHotKeys({ gameType: GAMES_LIST_ENUM.DRAGONTOWER })
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()
const { play: playBgmMusic } = useMiniGamePublicPlayMp3('/audio/dragon_bgm.mp3')
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playLoseFireMusic } = useMiniGamePublicPlayMp3('/audio/dragon_lose_fire.mp3')
const { play: playLoseMusic } = useMiniGamePublicPlayMp3('/audio/dragon_lose.mp3')
const { play: playSelectedMusic } = useMiniGamePublicPlayMp3('/audio/dragon_selected.mp3')
const { play: playWinEggMusic } = useMiniGamePublicPlayMp3('/audio/dragon_win_egg.mp3')
const { play: playWinFinalMusic } = useMiniGamePublicPlayMp3('/audio/dragon_win_final.mp3')
const { play: playWinMusic } = useMiniGamePublicPlayMp3('/audio/dragon_win.mp3')
const appStore = useAppStore()
const { currentGlobalCurrency, isLogin, userInfo } = storeToRefs(appStore)
const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')
const {
  rate,
  orderCurrencyCode,
  toFixedByLockCurrency,
  getLockCurrencyPrefix,
} = useMiniGameLockCurrency(globalCurrencyCode.value)
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 加载 - 游戏资源 */
const { bool: loading, setTrue: setTrueLoading, setFalse: setFlaseLoading } = useBoolean(false)
/** 手动 - 游戏开始 */
const { bool: isManualStart, setTrue: setManualStart } = useBoolean(false)
/** 自动 - 游戏开始 */
const { bool: isAutoStart, setTrue: setAutoStart } = useBoolean(false)
/** 自动 - 打开全部游戏结果 */
const { bool: isOpenAll, setTrue: setOpenAll, setFalse: resOpenAll } = useBoolean(false)
/** 是否全赢 */
const { bool: isWinAll, setTrue: setWinAll, setFalse: resWinAll } = useBoolean(false)
/** 是否无限自动投注 */
const { bool: isInfiniteBet, setTrue: setInfiniteBet } = useBoolean(false)
/** 正在完成投注 */
const { bool: isFinishingBetting } = useBoolean(false)

/** 定义dragon相关参数 */
const dragonHeadRef = ref<HTMLElement | null>(null)
const dragonBodyRef = ref<HTMLElement | null>(null)
const boardRef = ref<HTMLDivElement | null>(null)
const dragonBodyApp = ref<any>(null)
const dragonHeadApp = ref<any>(null)
const dragonBodyAni = ref()
const dragonHeadAni = ref()

/** 默认难易程度及配置 */
const difficult = ref('medium')
const fire = ref('Fire 02 reveal')
const egg = ref('egg2-animated')
const skull = ref('skull2-animated')
/** 行数 */
const row = ref(9)
/** 当前活动的行数 */
const activeRow = ref(-1)
/** 列数 */
const column = ref(3)
/** 当前被点击的列数 */
const activeCol = ref(0)
const difficultOptions = [
  { value: 'easy', label: t('difficulty_easy'), colNum: 4, fire: 'Fire 01 reveal', egg: 'egg1-animated', skull: 'skull1-animated' },
  { value: 'medium', label: t('difficulty_medium'), colNum: 3, fire: 'Fire 02 reveal', egg: 'egg2-animated', skull: 'skull2-animated' },
  { value: 'hard', label: t('difficulty_hard'), colNum: 2, fire: 'Fire 03 reveal', egg: 'egg3-animated', skull: 'skull3-animated' },
  { value: 'expert', label: t('difficulty_expert'), colNum: 3, fire: 'Fire 04 reveal', egg: 'egg4-animated', skull: 'skull4-animated' },
  { value: 'master', label: t('difficulty_master'), colNum: 4, fire: 'Fire 05 reveal', egg: 'egg5-animated', skull: 'skull5-animated' },
]
const multipliers = {
  easy: [1.31, 1.74, 2.32, 3.1, 4.13, 5.51, 7.34, 9.79, 13.05],
  medium: [1.47, 2.21, 3.31, 4.96, 7.44, 11.16, 16.74, 25.11, 37.67],
  hard: [1.96, 3.92, 7.84, 15.68, 31.36, 62.72, 125.44, 250.88, 501.76],
  expert: [2.94, 8.82, 26.46, 79.38, 238.14, 714.42, 2143.26, 6429.78, 19289.34],
  master: [3.92, 15.68, 62.72, 250.88, 1003.52, 4014.08, 16056.32, 64225.28, 256901.12],
}
/** 当前游戏倍数 */
const multiplier = ref([1.47, 2.21, 3.31, 4.96, 7.44, 11.16, 16.74, 25.11, 37.67])

const betAmountRef = ref()
const tab = ref('manual')
const tabList = [
  { label: t('mini_manual_bet'), value: 'manual' },
  { label: t('mini_auto_bet'), value: 'auto' },
]
const baseTile = { result: '', openByPlayer: false, chosen: false }
const tilesList = ref<OriginalGameDragonTile[][]>(iniTileList())
/** 回合数 */
const betRounds = ref(0)
/** 订单id */
const orderId = ref('')
/** 订单币种 */
const orderCurrencyType = computed(() => getCurrencyConfigByCode(orderCurrencyCode.value).name)
/** 投注金额 */
const betAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
/** 开始自动投注时的基础金额 */
const _betAmountBaseOnAuto = ref('')
/** 总利润 */
const payoutMultiplier = ref('1.00')
/** 结算奖金 */
const settleAmount = ref('')
/** 自动投注次数 */
const betTimes = ref(0)
/** 若赢增加 */
const percentIfWin = ref('0')
/** 若输增加 */
const percentIfLose = ref('0')
/** 止赢 */
const stopIfWinAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
/** 止损 */
const stopIfLoseAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
const isHaveWinLine = computed(() => +stopIfWinAmount.value !== 0)
const isHaveLoseLine = computed(() => +stopIfLoseAmount.value !== 0)
/** 当前输赢 */
const currentTotalWin = ref(0)
let rebetTimer: any = null

/** 查询未完成的订单 type=4 */
const { loading: initLoading } = useRequest(() => ApiBettingGameOriginalDragon({
  id: '',
  type: 4,
  bet_amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  difficulty: difficult.value,
  position: activeCol.value,
}), {
  manual: false,
  ready: isLogin,
  onSuccess(res: any) {
    if ((res as any).id) {
      // 有未完成的游戏
      setManualStart()
      orderId.value = (res as any).id
      betAmount.value = toFixedByLockCurrency((res as any).amount, orderCurrencyType.value)
      orderCurrencyCode.value = (res as any).currency
      const playedRounds = res.state.played_rounds
      const rounds = res.state.rounds
      const tilesSelected = res.state.tiles_selected
      betRounds.value = rounds ? rounds.length : 0
      payoutMultiplier.value = (res as any).payout_multiplier
      activeRow.value = res.state.current_round
      if (playedRounds) {
        tilesSelected.forEach((pos: number, index: number) => tilesList.value[index][pos].openByPlayer = true)
        for (let i = 0; i < playedRounds.length; i++) {
          playedRounds[i].forEach((pos: string | number) => {
            if (tilesList.value[i][pos as number].openByPlayer)
              tilesList.value[i][pos as number].result = 'egg'
          })
        }
      }
    }
  },
  onAfter() {
    onLoaded()
  },
})
/** 创建订单 type=3 */
const { run: runMakeOrder, loading: orderLoading } = useRequest(() => ApiBettingGameOriginalDragon({
  id: '',
  type: 3,
  bet_amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  difficulty: difficult.value,
  position: activeCol.value,
}), {
  onSuccess(res) {
    appStore.getBalanceData()
    setManualStart()
    orderId.value = res.id
    activeRow.value = activeRow.value + 1
  },
})
/** 翻开龙蛋 type=1 */
const { runAsync: runOpenTile, loading: openTileLoading } = useRequest(() => ApiBettingGameOriginalDragon({
  type: 1,
  id: orderId.value,
  bet_amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  difficulty: difficult.value,
  position: activeCol.value,
}), {
  onSuccess(res) {
    const playedRounds = res.state.played_rounds
    const lastTilePos = playedRounds.length - 1
    const rounds = res.state.rounds
    const tilesSelected = res.state.tiles_selected
    activeRow.value = res.state.current_round
    payoutMultiplier.value = res.payout_multiplier
    if (playedRounds) {
      const index = playedRounds[lastTilePos].findIndex(item => item === tilesSelected[lastTilePos])
      if (index === -1) {
        // 输掉: 头部掉落
        updateDragonAni(dragonHeadApp, dragonHeadAni, 0.6, 'lose head start', 'lose head loop')
        updateDragonAni(dragonBodyApp, dragonBodyAni, 0.6, 'lose wings open', 'lose wings loop')
        playLoseMusic()
        setOpenAll()
      }
      tilesList.value[lastTilePos][activeCol.value] = {
        result: (index === -1) ? 'skull' : ((tilesSelected[lastTilePos] === activeCol.value) ? 'egg' : ''),
        openByPlayer: (tilesSelected[lastTilePos] === activeCol.value),
        chosen: false,
      }
      if (activeRow.value === row.value && tilesList.value[lastTilePos][activeCol.value].result === 'egg') {
        // 通关：全赢
        setWinAll()
        onCashOutClick()
        updateDragonAni(dragonBodyApp, dragonBodyAni, 0.6, 'win wings open', 'win wings loop')
        updateDragonAni(dragonHeadApp, dragonHeadAni, 0.6, 'win head start', 'win head loop')
        playWinFinalMusic()
      }
      else if (activeRow.value < row.value && tilesList.value[lastTilePos][activeCol.value].result === 'egg') {
        playWinEggMusic()
      }
      else if (tilesList.value[lastTilePos][activeCol.value].result === 'skull') {
        playLoseFireMusic()
      }
    }
    if (rounds) {
      tilesSelected.forEach((pos, index) => tilesList.value[index][pos].openByPlayer = true)
      for (let i = 0; i < rounds.length; i++) {
        rounds[i].forEach((pos) => {
          tilesList.value[i][pos].result = 'egg'
        })
      }
      activeRow.value = -1
      isManualStart.value = false
      setOpenAll()
    }
  },
  onError(err) {
    console.log('翻开龙蛋失败:', err)
    resetAllTile()
  },
})
/** 兑现 type=2 */
const { run: runCashOut, loading: cashOutLoading } = useRequest(() => ApiBettingGameOriginalDragon({
  type: 2,
  id: orderId.value,
  bet_amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  difficulty: difficult.value,
  position: activeCol.value,
}), {
  onSuccess(res) {
    settleAmount.value = res.settle_amount
    const rounds = res.state.rounds
    const tilesSelected = res.state.tiles_selected
    if (rounds) {
      tilesSelected.forEach((pos, index) => tilesList.value[index][pos].openByPlayer = true)
      for (let i = 0; i < rounds.length; i++) {
        rounds[i].forEach((pos) => {
          tilesList.value[i][pos].result = 'egg'
        })
      }
      activeRow.value = -1
      isManualStart.value = false
      setOpenAll()
      updateDragonAni(dragonHeadApp, dragonHeadAni, 0.6, 'win head start', 'win head loop')
      updateDragonAni(dragonBodyApp, dragonBodyAni, 0.6, 'win wings open', 'win wings loop')
      playWinMusic()
    }
    appStore.getBalanceData()
  },
})
/** 自动投注 */
// 已选位置
const chosenPositions = computed(() => {
  const positions = []
  for (let i = 0; i < row.value; i++) {
    for (let j = 0; j < column.value; j++) {
      if (tilesList.value[i][j].chosen)
        positions.push(j)
    }
  }
  return positions
})
const { run: runAutoBet } = useRequest(() => ApiGameOriginalDragonMultiple({
  bet_amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  difficulty: difficult.value,
  position: chosenPositions.value.join(','),
}), {
  onSuccess(res) {
    appStore.getBalanceData()
    // 渲染结果
    const playedRounds = res.state.played_rounds
    const rounds = res.state.rounds
    const tilesSelected = res.state.tiles_selected
    const lastSelPost = tilesSelected.length - 1
    if (rounds) {
      chosenPositions.value.forEach((pos, index) => tilesList.value[index][pos].openByPlayer = true)
      for (let i = 0; i < rounds.length; i++) {
        rounds[i].forEach((pos) => {
          tilesList.value[i][pos].result = 'egg'
          if (i > lastSelPost && i < chosenPositions.value.length) {
            const noindex = rounds[i].findIndex(item => item === chosenPositions.value[i])
            if (noindex === -1)
              tilesList.value[i][chosenPositions.value[i]].result = 'skull-hidden'
          }
        })
      }
      const noindex = playedRounds[lastSelPost].findIndex(item => item === tilesSelected[lastSelPost])
      if (noindex === -1)
        tilesList.value[lastSelPost][tilesSelected[lastSelPost]].result = 'skull'
    }
    setOpenAll()
    // 若赢
    if (+res.payout_multiplier > 0) {
      setTimeout(() => {
        settleAmount.value = res.settle_amount
        payoutMultiplier.value = res.payout_multiplier
        updateDragonAni(dragonHeadApp, dragonHeadAni, 0.6, 'win head start', 'win head loop')
        updateDragonAni(dragonBodyApp, dragonBodyAni, 0.6, 'win wings open', 'win wings loop')
        playWinMusic()
        betAmount.value = +percentIfWin.value === 0
          ? _betAmountBaseOnAuto.value
          : toFixedByLockCurrency(scientificToString(+betAmount.value * (1 + (+percentIfWin.value / 100))), orderCurrencyType.value)
        cumulativeWinsAndLosses('win', res.settle_amount, res.amount)
      }, animateEnabled ? 300 : 0)
    }
    // 若输
    else {
      betAmount.value = +percentIfLose.value === 0
        ? _betAmountBaseOnAuto.value
        : toFixedByLockCurrency(scientificToString(+betAmount.value * (1 + (+percentIfLose.value / 100))), orderCurrencyType.value)
      updateDragonAni(dragonHeadApp, dragonHeadAni, 0.6, 'lose head start', 'lose head loop')
      updateDragonAni(dragonBodyApp, dragonBodyAni, 0.6, 'lose wings open', 'lose wings loop')
      cumulativeWinsAndLosses('lose', res.settle_amount, res.amount)
    }
    // 局结束，重置状态
    setTimeout(() => {
      settleAmount.value = ''
      payoutMultiplier.value = '1.00'
      clearAllTileResult()
      clearAllCanvas()
      resOpenAll()

      // 如果切换了货币，停止自动投注
      if (orderCurrencyCode.value !== globalCurrencyCode.value) {
        orderCurrencyCode.value = globalCurrencyCode.value
        stopAutoBet('stop')
      }

      // 达到输赢线，停止自动投注
      if (isHaveWinLine.value && currentTotalWin.value >= Number.parseFloat(stopIfWinAmount.value)) {
        stopAutoBet('win')
        return
      }
      if (isHaveLoseLine.value && currentTotalWin.value < 0 && Math.abs(currentTotalWin.value) >= Number.parseFloat(stopIfLoseAmount.value)) {
        stopAutoBet('lose')
        return
      }

      if (isInfiniteBet.value && isAutoStart.value) {
        autoBetReBet()
        return
      }

      if (betTimes.value !== 0 && isAutoStart.value) {
        betTimes.value = betTimes.value - 1
        if (betTimes.value !== 0)
          autoBetReBet()

        else
          stopAutoBet('end')
      }
    }, isLiveBetting.value ? 1600 : 1800)
  },
  onError() {
    stopAutoBet('end')
  },
})

const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))
const stopIfWinAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfWinAmount.value, +rate.value))))
const stopIfLoseAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfLoseAmount.value, +rate.value))))
const currencyPrefix = computed(() => getLockCurrencyPrefix(orderCurrencyType.value))
const autoBetBtnText = computed(() => isAutoStart.value ? t('mini_stop_auto_bet') : isFinishingBetting.value ? t('mini_auto_bet_finish') : t('mini_start_auto_bet'))
const gameStart = computed(() => isManualStart.value || isAutoStart.value)
const payoutMultiplierFixed = computed(() => toFixed(+payoutMultiplier.value))
const totalProfit = computed(() => toFixedByLockCurrency(mul(+betAmount.value, +payoutMultiplierFixed.value - 1), orderCurrencyType.value))
const disabledCashOut = computed(() => !gameStart.value || openTileLoading.value || cashOutLoading.value || activeRow.value === -1 || activeRow.value === 0)
// 自动投注时选择的个数
const chosenTotal = computed(() => {
  let total = 0
  for (let i = 0; i < row.value; i++) {
    for (let j = 0; j < column.value; j++) {
      if (tilesList.value[i][j].chosen)
        total++
    }
  }
  return total
})
/** 当前被激活的行数 */
function activeRowList(index: number, activerow: number) {
  return index === activerow
}
/** 初始化二维数组 */
function iniTileList() {
  const arrRow = []
  let arrCol = []
  for (let rowindex = 0; rowindex < row.value; rowindex++) {
    arrCol = []
    for (let colindex = 0; colindex < column.value; colindex++) {
      const item = cloneDeep(baseTile)
      arrCol.push(item)
    }
    arrRow.push(arrCol)
  }
  return arrRow
}
// 创建一个函数，通过传入的 value 值查找对应的数组
function findMultiplierArray(value: any) {
  return multipliers[value as keyof typeof multipliers]
}
/** 切换难容程度 */
function selDifficultOption(value: any) {
  multiplier.value = findMultiplierArray(value)
  column.value = difficultOptions.filter(item => item.value === value)[0].colNum
  difficult.value = difficultOptions.filter(item => item.value === value)[0].value
  fire.value = difficultOptions.filter(item => item.value === value)[0].fire
  egg.value = difficultOptions.filter(item => item.value === value)[0].egg
  skull.value = difficultOptions.filter(item => item.value === value)[0].skull
  clearAllCanvas()
  resetGame()
}
/** 清除所有瓷砖的选中状态 */
function clearAllTileChosen() {
  tilesList.value.forEach((row) => {
    row.forEach((item) => {
      item.chosen = false
    })
  })
}
/** 清除所有瓷砖的结果状态 */
function clearAllTileResult() {
  tilesList.value.forEach((row) => {
    row.forEach((item) => {
      item.result = ''
      item.openByPlayer = false
    })
  })
}
/** 还原所有瓷砖初始状态  */
function resetAllTile() {
  tilesList.value = iniTileList()
}
/** 还原所有瓷砖初始状态 */
function resetGame() {
  betRounds.value = 0
  settleAmount.value = ''
  payoutMultiplier.value = '1.00'
  orderId.value = ''
  resOpenAll()
  resWinAll()
  resetAllTile()
  tabChange()
}
/** 清除board下所有的canvas */
function clearAllCanvas() {
  resetDragon(dragonHeadApp, dragonHeadAni, 'default head')
  resetDragon(dragonBodyApp, dragonBodyAni, 'default wings')
  const canvasList = boardRef.value?.querySelectorAll('canvas')
  canvasList?.forEach((item) => {
    item.remove()
  })
}
const { openNotify } = useNotify()
/** 下单 */
function makeOrder() {
  if (!isLogin.value)
    return openRegisterDialog()
  if (userInfo.value?.exclude === 1) {
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
    return
  }
  betAmountRef.value?.valiAmountBetLimit()
  if (!betAmountRef.value.betAmountError) {
    resetGame()
    clearAllCanvas()
    runMakeOrder()
    playBgmMusic()
    playBetMusic()
  }
}
/** 翻开瓷砖 */
function openTile(rowindex: number, colindex: number) {
  // 手动游戏翻开瓷砖
  if (isManual.value && isManualStart.value) {
    activeCol.value = colindex
    runOpenTile()
  }

  // 自动游戏预选瓷砖
  else if (isAutoBet.value && !isAutoStart.value) {
    if (tilesList.value[rowindex][colindex].chosen) {
      tilesList.value[rowindex][colindex].chosen = false
    }
    else {
      // 可选到达上限
      if (rowindex === row.value || rowindex > chosenTotal.value)
        return
      tilesList.value[rowindex].forEach((item) => {
        if (item.chosen)
          item.chosen = false
      })
      tilesList.value[rowindex][colindex].chosen = true
      playSelectedMusic()
    }
  }
}
/** 随机翻开瓷砖 */
function openTileRandom() {
  const randomCol = Math.floor(Math.random() * column.value)
  openTile(activeRow.value, randomCol)
}
/** 点击兑换 */
function onCashOutClick() {
  if (openTileLoading.value || cashOutLoading.value)
    return
  runCashOut()
}
/** 点击开始自动投注 */
function startAutoBet() {
  if (!isLogin.value)
    return openRegisterDialog()
  if (userInfo.value?.exclude === 1) {
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
    return
  }
  if (!isAutoStart.value) {
    betAmountRef.value?.valiAmountBetLimit()
    if (!betAmountRef.value.betAmountError) {
      if (betTimes.value === 0)
        setInfiniteBet()
      else
        isInfiniteBet.value = false

      _betAmountBaseOnAuto.value = betAmount.value
      currentTotalWin.value = 0
      setAutoStart()
      autoBetStartNotify()
      runAutoBet()
    }
  }
  else {
    stopAutoBet('stop')
    isFinishingBetting.value = true
    setTimeout(() => {
      isFinishingBetting.value = false
    }, 300)
  }
}
// 自动投注重新下注
function autoBetReBet() {
  betAmountRef.value?.valiAmountBetLimit()
  if (!betAmountRef.value.betAmountError) {
    rebetTimer = setTimeout(() => {
      runAutoBet()
    }, 1600)
  }
  else {
    stopAutoBet('end')
  }
}
// 停止自动投注
function stopAutoBet(notifyType: 'stop' | 'end' | 'win' | 'lose' = 'stop') {
  isAutoStart.value = false
  switch (notifyType) {
    case 'stop':
      resOpenAll()
      // clearAllTileChosen()
      autoBetStopNotify()
      break
    case 'end':
      resOpenAll()
      // clearAllTileChosen()
      autoBetEndNotify()
      break
    case 'win':
      resOpenAll()
      // clearAllTileChosen()
      autoBetStopWinNotify()
      break
    case 'lose':
      resOpenAll()
      // clearAllTileChosen()
      autoBetStopLoseNotify()
      break
    default:
      break
  }
}
// 清除自动下注定时器
function clearReBetTimer() {
  clearTimeout(rebetTimer)
}
// 累计输赢数据
function cumulativeWinsAndLosses(type: 'win' | 'lose', settle_amount: string, amount: string) {
  if (isHaveWinLine.value || isHaveLoseLine.value) {
    switch (type) {
      case 'win':
        currentTotalWin.value = currentTotalWin.value + Number.parseFloat(settle_amount) - Number.parseFloat(amount)
        break
      case 'lose':
        currentTotalWin.value = currentTotalWin.value + Number.parseFloat(settle_amount)
        break

      default:
        break
    }
  }
}

function onStopIfWinAmountBlur() {
  stopIfWinAmount.value = toFixedByLockCurrency(stopIfWinAmount.value, orderCurrencyType.value)
}
function onStopIfLoseAmount() {
  stopIfLoseAmount.value = toFixedByLockCurrency(stopIfLoseAmount.value, orderCurrencyType.value)
}

watch(betTimes, (a, b) => {
  if (+b > 0 && !a)
    betTimes.value = 0
})
watch(globalCurrencyCode, (a) => {
  if (!gameStart.value)
    orderCurrencyCode.value = a
})
watch(orderCurrencyType, (a) => {
  stopIfWinAmount.value = toFixedByLockCurrency(stopIfWinAmount.value, a)
  stopIfLoseAmount.value = toFixedByLockCurrency(stopIfLoseAmount.value, a)
})
// 快捷键回调
function onKeySPACE() {
  // 下注
  if (!gameStart.value) {
    if (isManual.value)
      makeOrder()

    else if (isAutoBet.value && chosenPositions.value.length > 0 && !isFinishingBetting)
      startAutoBet()
  }
}
function onKeyS() {
  // 加倍投注额
  if (!gameStart.value)
    betAmountRef.value?.double()
}
function onKeyA() {
  // 减半投注额
  if (!gameStart.value)
    betAmountRef.value?.half()
}
function onKeyD() {
  // 清零投注额
  if (!gameStart.value)
    betAmount.value = toFixedByLockCurrency('0', orderCurrencyType.value)
}
function onKeyQ() {
  // 随机翻开瓷砖
  if (isManual.value && isManualStart.value && !openTileLoading.value)
    openTileRandom()
}
function onKeyW() {
  // 兑现
  if (isManual.value && isManualStart.value && !openTileLoading.value && !disabledCashOut.value && !cashOutLoading.value)
    onCashOutClick()
}
function tabChange() {
  if (isMobile.value) {
    nextTick(() => {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          document.querySelector('#tgTopForScroll')?.scrollIntoView({ behavior: 'smooth' })
          // document.getElementById('tgOuterWrapMain')!.scrollTop = 0 // document.getElementById('tgOuterWrapMain')!.scrollHeight
        }, 0)
      })
    })
  }
}
async function initDragonTest() {
  await loadDragonAssets()
  dragonHeadApp.value = globalDragon.app
  dragonHeadRef.value?.appendChild(globalDragon.app.view)
  globalDragon.app.stage.addChild(globalDragon.boomAni)
  tickerDragonAxis.update()
}
// 快捷键
useKeyboard((k) => {
  if (isHotKeysEnabled.value) {
    if (k === KeyboardKeyEnum.SPACE)
      onKeySPACE()

    else if (k === KeyboardKeyEnum.S)
      onKeyS()

    else if (k === KeyboardKeyEnum.A)
      onKeyA()

    else if (k === KeyboardKeyEnum.D)
      onKeyD()

    else if (k === KeyboardKeyEnum.Q)
      onKeyQ()

    else if (k === KeyboardKeyEnum.W)
      onKeyW()
  }
})
onMounted(async () => {
  onLoaded()
  setTrueLoading()
  initDragon(dragonHeadRef, dragonHeadApp, dragonHeadAni, 0.6, 'default head')
  initDragon(dragonBodyRef, dragonBodyApp, dragonBodyAni, 0.6, 'default wings')
  setFlaseLoading()
  // initDragonTest(dragonHeadRef, 0.6, 'default head')
  // initDragonTest()
})
onBeforeUnmount(() => {
  clearReBetTimer()
  dragonBodyAni.value.destroy()
  dragonHeadAni.value.destroy()
  dragonBodyApp.value.destroy()
  dragonHeadApp.value.destroy()
})
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled"
    :game-type="GAMES_LIST_ENUM.DRAGONTOWER" @open-game-info="openMiniGameInfoInsertDialog"
    @open-hot-keys="openMiniGameHotKeysInsertDialog"
  >
    <template #left>
      <div class="flex-col-12 w-full flex flex-col">
        <BaseTab
          v-model="tab" :disabled="gameStart || orderLoading || initLoading" :disable-click="gameStart"
          class="order-last @[800px]:order-1" :list="tabList" full
          style="--tg-tab-style-inner-padding-y:13px;--tg-tab-style-inner-padding-x:16px;" @change="resetGame"
        />
        <!-- <div class="order-2 min-h-[117px]"> -->
        <BaseLabel class="order-2" :label="t('bet_amount')" :right-text="currencyPrefix + betAmountMulRate">
          <AppMiniGamePublicBetAmount
            ref="betAmountRef" v-model="betAmount" :currency="orderCurrencyCode"
            :disabled="gameStart || orderLoading || initLoading"
          />
        </BaseLabel>
        <div class="flex-col-12 order-2 min-h-[59px] flex flex-col">
          <div class="flex-col-12 order-2 flex flex-col">
            <BaseLabel class="order-2" :label="t('difficulty')">
              <BaseSelect v-model="difficult" :options="difficultOptions" :disabled="gameStart || orderLoading || initLoading" style="--tg-base-select-style-padding-y:7px;" @select="selDifficultOption" />
            </BaseLabel>
          </div>
          <div v-show="isManualStart" class="flex-col-12 order-2 flex flex-col">
            <BaseButton
              :disabled="openTileLoading" class="order-2 hidden @[800px]:block" shadow size="sm"
              @click="openTileRandom"
            >
              {{ t('mini_pick_random_tile') }}
            </BaseButton>
            <!-- 手动下注游戏开始 -->
            <BaseLabel class="order-2" :label="t('mini_total_profitx', { profit: payoutMultiplierFixed })">
              <BaseInput
                v-model="totalProfit" readonly
                style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              >
                <template #right-icon>
                  <AppCurrencyIcon style="--tg-app-currency-icon-size:16px;" :currency-type="orderCurrencyType" />
                </template>
              </BaseInput>
            </BaseLabel>
          </div>
        </div>

        <!-- 自动投注 -->
        <div v-show="isAutoBet" class="flex-col-12 order-2 flex flex-col">
          <BaseLabel class="order-2" :label="t('mini_bet_frequency')">
            <AppMiniGamePublicBetTimes v-model.number="betTimes" />
          </BaseLabel>
          <BaseLabel class="order-2" :label="t('mini_if_win')">
            <AppMiniGamePublicAutoDouble v-model="percentIfWin" :disabled="gameStart" />
          </BaseLabel>
          <BaseLabel class="order-2" :label="t('mini_if_lose')">
            <AppMiniGamePublicAutoDouble v-model="percentIfLose" :disabled="gameStart" />
          </BaseLabel>
          <BaseLabel
            class="order-2" :label="t('mini_take_profit')"
            :right-text="currencyPrefix + stopIfWinAmountMulRate"
          >
            <BaseInput
              v-model="stopIfWinAmount" type="number" input-mode="decimal" :disabled="gameStart"
              style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              @blur="onStopIfWinAmountBlur"
            >
              <template #right-icon>
                <AppCurrencyIcon :currency-type="orderCurrencyType" />
              </template>
            </BaseInput>
          </BaseLabel>
          <BaseLabel
            class="order-2" :label="t('mini_stop_lose')"
            :right-text="currencyPrefix + stopIfLoseAmountMulRate"
          >
            <BaseInput
              v-model="stopIfLoseAmount" type="number" input-mode="decimal" :disabled="gameStart"
              style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              @blur="onStopIfLoseAmount"
            >
              <template #right-icon>
                <AppCurrencyIcon :currency-type="orderCurrencyType" />
              </template>
            </BaseInput>
          </BaseLabel>
        </div>

        <AppMiniGamePublicBetButton
          v-if="isManual && !isManualStart"
          class="order-1 @[800px]:order-2" :disabled="orderLoading || initLoading"
          :game="GAMES_LIST_ENUM.DRAGONTOWER" :loading="orderLoading || initLoading" @bet-btn-click="makeOrder"
        >
          {{ t('mini_touzhu') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-if="isManual && isManualStart"
          class="order-1 @[800px]:order-2"
          :disabled="disabledCashOut" :game="GAMES_LIST_ENUM.DRAGONTOWER" :loading="openTileLoading || cashOutLoading"
          @bet-btn-click="onCashOutClick"
        >
          {{ t('mini_cash_out') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet"
          is-auto class="order-1 @[800px]:order-2"
          :auto-start="isAutoStart" :game="GAMES_LIST_ENUM.DRAGONTOWER"
          :disabled="isLogin ? chosenTotal === 0 || isFinishingBetting : false" @bet-btn-click="startAutoBet"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div class="dragon-tower-game text-[0.5em] @[800px]:text-[1em]">
        <div v-if="loading" class="flex items-center justify-center @[800px]:min-h-[630px]">
          <div class="h-[60px] w-[56px]">
            <img src="/afun-pc/webp/casino/loading.webp">
          </div>
        </div>
        <div v-else class="unselectable board-wrapper dragon @[800px]:min-h-[630px]">
          <!-- 游戏显示区 -->
          <div class="dragon-wrap animations-enabled">
            <div ref="dragonBodyRef" class="dragon-body-sprite" />
            <img class="castle" :src="isWinAll ? '/afun-pc/img/game/castle-top-win.svg' : '/img/game/castle-top.svg'" alt="castle">
            <div id="fireEggContainer" ref="dragonHeadRef" class="dragon-head-sprite" />
          </div>
          <!-- 投注区 -->
          <div ref="boardRef" class="board">
            <div v-for="(rowItem, rowIndex) in tilesList" :key="rowIndex" class="row" :data-dragon-tower-tile-row="rowIndex">
              <AppMiniGamePartDragonTile
                v-for="(colItem, colIndex) in rowItem" :key="`${rowIndex}-${colIndex}`" :index="colIndex" :is-auto="isAutoBet"
                :is-open-all="isOpenAll"
                :difficult="difficult"
                :fire="fire"
                :egg="egg"
                :skull="skull"
                :data="colItem" :animate-enabled="animateEnabled" :active-row="activeRowList(rowIndex, activeRow)" @click="openTile(rowIndex, colIndex)"
              />
            </div>
          </div>
          <!-- 底部区 -->
          <div class="castle-bottom-wrap">
            <img class="castle-bottom" src="/afun-pc/img/game/castle-top.svg" alt="castle">
          </div>
        </div>
        <!-- 兑换结果 -->
        <transition v-if="settleAmount" name="fade">
          <AppMiniGamePartDragonResultWrap :payout-multiplier="payoutMultiplierFixed" :amount="settleAmount" />
        </transition>
      </div>
    </template>
  </AppMiniGamePublicLayout>
</template>

<style>
:root {
  --dragon-tower-background-image: url(/png/casino/background-dragon-tower.png);
  --draggon-tower-border-color: #56687a;
  --dragon-tower-bg-color: #182433;
  --dragon-tower-max-width: 500px;
  --dragon-tower-dragonScale: 0.6;
  --dragon-tower-space-1: 0.25rem;
  --dragon-tower-space-2: 0.5rem;
  --dragon-tower-duration: 300ms;
  --dragon-tower-grey-500: #213743;
  --dragon-tower-grey-300: #557086;
}
</style>

<style lang='scss'>
.flex-col-12 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-12);
  }
}

@keyframes revealCss {
  0% {
    opacity: 1;
    border-color: var(--dragon-tower-grey-500);
  }

  to {
    opacity: 0.4;
    border-color: var(--dragon-tower-grey-300);
    background-color: #1a2c38;
  }
}
@keyframes reveal {
  0% {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fetching {
  0%,
  to {
    transform: scale(1);
  }

  50% {
    transform: scale(1.03);
  }
}
.dragon-tower-game {
  width: 100%;
  height: 100%;
  /** font-size: 1em; PC版为1em,手机版为0.5em */
  position: relative;
}
/** 投注区 */
.board {
  position: relative;
  display: flex;
  max-width: var(--dragon-tower-max-width);
  width: 100%;
  margin: 0 auto;
  flex-direction: column-reverse;
  z-index: 3;
  padding: var(--dragon-tower-space-1);
  background-color: var(--dragon-tower-bg-color);
  border-left: var(--dragon-tower-space-2) solid var(--draggon-tower-border-color);
  border-right: var(--dragon-tower-space-2) solid var(--draggon-tower-border-color);
  border-bottom-right-radius: var(--dragon-tower-space-2);
  border-bottom-left-radius: var(--dragon-tower-space-2);
}
.row {
  display: flex;
  position: relative;
  padding: var(--dragon-tower-space-1);
  border-radius: var(--dragon-tower-space-1);
  border-top-right-radius: 0;
  border: 2px solid transparent;
  transition: all 0.3s;
}
.row > * + * {
  margin-left: calc(var(--dragon-tower-space-2) + 4px);
}
.board-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: var(--dragon-tower-background-image);
  padding: 4em 2em 2em;
  background-size: cover;
}
.board-wrapper.dragon {
  padding-top: clamp(100px, 12em, 140px);
}
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
}
/** 龙头动画部分 */
.dragon-wrap {
  position: relative;
  max-width: var(--dragon-tower-max-width);
  width: 100%;
  margin: 0 auto;
}
.castle {
  position: relative;
  z-index: 2;
  top: -30px;
  margin-bottom: -30px;
}
.dragon-head {
  position: absolute;
  bottom: 8%;
  left: 50%;
  width: 20%;
  z-index: 4;
  transform: scale(0.9) translate(-60%);
}
.dragon-body {
  position: absolute;
  bottom: 0;
  z-index: 1;
  transform: scale(1.8) translateY(5%);
  pointer-events: none;
}
.dragon-body-sprite,
.dragon-head-sprite {
  width: 100%;
}
.dragon-head-sprite {
  & > * {
    z-index: 4;
  }
}
.dragon-body-sprite {
  & > * {
    z-index: 0;
  }
}
.dragon-body-sprite,
.dragon-head-sprite {
  & > * {
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translate(-50%, -50%) scale(var(--dragon-tower-dragonScale));
    pointer-events: none;
  }
}
.sprite-sheet {
  pointer-events: none;
}
/** 底部区 */
.castle-bottom-wrap {
  max-width: var(--dragon-tower-max-width);
  width: 100%;
  margin: 0 auto;
}
.castle-bottom {
  width: 100%;
  max-width: var(--dragon-tower-max-width);
  border-bottom-right-radius: var(--dragon-tower-space-2);
  border-bottom-left-radius: var(--dragon-tower-space-2);
  z-index: 0;
  position: relative;
  margin-top: -10%;
}
.fade-enter-active,
.fade-leave-active {
  transition: all var(--dragon-tower-duration) ease;
  transform-origin: center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>

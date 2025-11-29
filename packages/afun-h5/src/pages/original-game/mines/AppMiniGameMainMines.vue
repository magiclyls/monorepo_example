<script setup lang='ts'>
import type { OriginalGameMinesTile } from '@tg/types'
import { ApiGameOriginalMines, ApiGameOriginalMinesMultiple } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseDialog, AfunBaseInput, AfunBaseLabel, AfunBaseSelect, AfunBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniGameInfo, IconUniKeyboard } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { KeyboardKeyEnum } from '@tg/types'
import { apiRequestQueue, formatWithSubstring, getCurrencyConfig, mul, scientificToString, scrollToTop, toFixed } from '@tg/utils'
import { useDocumentVisibility } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { storeToRefs } from 'pinia'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'
import {
  AppMiniGamePartMinesGameInfo,
  AppMiniGamePartMinesHotKeys,
  AppMiniGamePublicAutoDouble,
  AppMiniGamePublicBetAmount,
  AppMiniGamePublicBetButton,
  AppMiniGamePublicBetTimes,
  AppMiniGamePublicLayout,
} from '../_components'
import {
  useKeyboard,
  useMiniGameAutoBetNotifications,
  useMiniGameGlobalStateHotKeys,
  useMiniGameGlobalStateLiveBetting,
  useMiniGameLockCurrency,
  useMiniGamePublicPlayMp3,
} from '../composables'
import AppMiniGamePartMinesTile from './AppMiniGamePartMinesTile.vue'

defineOptions({
  name: 'AppMiniGameMainMines',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const { push } = useRouter()
const {
  autoBetStartNotify,
  autoBetStopNotify,
  autoBetEndNotify,
  autoBetStopWinNotify,
  autoBetStopLoseNotify,
} = useMiniGameAutoBetNotifications()
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playGemMusic } = useMiniGamePublicPlayMp3('/audio/mines.gem0.mp3')
const { play: playBombMusic } = useMiniGamePublicPlayMp3('/audio/mines.bomb.mp3')
const { play: playWinMusic } = useMiniGamePublicPlayMp3('/audio/mines.win.mp3')
const { play: playSelectedMusic } = useMiniGamePublicPlayMp3('/audio/mines.selected.mp3')
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const globalCurrencyCode = computed(() => currentGlobalCurrencyMap.value.cur)
const {
  orderCurrencyCode,
  rate,
  toFixedByLockCurrency,
  getLockCurrencyPrefix,
} = useMiniGameLockCurrency(globalCurrencyCode.value)
const visibility = useDocumentVisibility()
const showMinesGameInfoDialog = ref(false)
const showMinesHotKeysDialog = ref(false)
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.MINES,
})
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 手动 - 游戏开始 */
const { bool: isManualStart, setTrue: setManualStart } = useBoolean(false)
/** 自动 - 游戏开始 */
const { bool: isAutoStart, setTrue: setAutoStart } = useBoolean(false)
/** 是否无限自动投注 */
const { bool: isInfiniteBet, setTrue: setInfiniteBet } = useBoolean(false)
/** 正在完成投注 */
const { bool: isFinishingBetting } = useBoolean(false)

const betAmountRef = ref()
const tab = ref('manual')
const tabList = [
  { label: t('手动投注'), value: 'manual' },
  { label: t('自动投注'), value: 'auto' },
]
const tilesList = ref<OriginalGameMinesTile[]>([
  { position: 0, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 1, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 2, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 3, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 4, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 5, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 6, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 7, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 8, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 9, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 10, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 11, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 12, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 13, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 14, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 15, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 16, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 17, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 18, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 19, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 20, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 21, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 22, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 23, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 24, result: '', openByPlayer: false, fetching: false, chosen: false },
])
/** 回合数 */
const betRounds = ref(0)
/** 订单id */
const orderId = ref('')
/** 订单币种 */
const orderCurrencyType = computed(() => getCurrencyConfig(orderCurrencyCode.value).name)
/** 投注金额 */
const betAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
/** 开始自动投注时的基础金额 */
const _betAmountBaseOnAuto = ref('')
/** 总利润 */
const payoutMultiplier = ref('1.00')
/** 结算奖金 */
const settleAmount = ref('')
/** 地雷数量 */
const mines = ref(3)
const minesList = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
  { label: '12', value: 12 },
  { label: '13', value: 13 },
  { label: '14', value: 14 },
  { label: '15', value: 15 },
  { label: '16', value: 16 },
  { label: '17', value: 17 },
  { label: '18', value: 18 },
  { label: '19', value: 19 },
  { label: '20', value: 20 },
  { label: '21', value: 21 },
  { label: '22', value: 22 },
  { label: '23', value: 23 },
  { label: '24', value: 24 },
]
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

/** 查询未完成的订单 */
const { runAsync: runCheckOrder, loading: initLoading } = useRequest(() => ApiGameOriginalMines({
  type: 4,
  amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
}), {
  // manual: false,
  ready: isLogin,
  onSuccess(res) {
    if (res.id) {
      // 有未完成的游戏
      setManualStart()
      orderId.value = res.id
      betAmount.value = toFixedByLockCurrency(res.amount, orderCurrencyType.value)
      orderCurrencyCode.value = res.currency
      const rounds = res.state.rounds
      betRounds.value = rounds ? rounds.length : 0
      payoutMultiplier.value = rounds[rounds.length - 1].payout_multiplier

      for (let i = 0; i < rounds.length; i++) {
        const index = tilesList.value.findIndex(a => a.position === +rounds[i].field)
        tilesList.value[index].result = 'gem'
        tilesList.value[index].openByPlayer = true
      }
    }
  },
  onAfter() {
    onLoaded()
  },
})
/** 建立订单 */
const { run: runMakeOrder, loading: orderLoading } = useRequest(() => ApiGameOriginalMines({
  type: 1,
  mines_count: mines.value,
  amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  noNotify: true,
}), {
  onSuccess(res) {
    currencyStore.initCurrencyList()
    setManualStart()
    orderId.value = res.id
  },
})
/** 翻开宝石 */
const openTileParams = computed(() => ({
  type: 2,
  id: orderId.value,
  amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
}))
const { runAsync: runOpenTile, loading: openTileLoading } = useRequest(ApiGameOriginalMines, {
  onSuccess(res, params) {
    const lastTilePos = params[0].position
    const index = tilesList.value.findIndex(a => a.position === lastTilePos)
    const resMines = res.state.mines
    const rounds = res.state.rounds
    tilesList.value[index].fetching = false

    if (resMines) {
      // 踩雷
      tilesList.value[index].result = 'mine'
      tilesList.value[index].openByPlayer = true
      payoutMultiplier.value = '1'
      playBombMusic()

      // 游戏结束，渲染其他位置
      setTimeout(() => {
        for (let i = 0; i < tilesList.value.length; i++) {
          if (resMines.includes(tilesList.value[i].position) && !tilesList.value[i].result)
            tilesList.value[i].result = 'mine'
          else if (!tilesList.value[i].result)
            tilesList.value[i].result = 'gem'
        }

        isManualStart.value = false
      }, animateEnabled.value ? 600 : 0)
    }
    else {
      // 宝石
      tilesList.value[index].result = 'gem'
      tilesList.value[index].openByPlayer = true
      payoutMultiplier.value = rounds[rounds.length - 1].payout_multiplier
      betRounds.value = rounds.length
      playGemMusic()
      // 已打开所有宝石，自动兑换
      if (rounds.length === 25 - mines.value)
        onCashOutClick()
    }
  },
  onError(err) {
    console.log('🦺🦺🦺 ~ onError ~ err:', err)
    clearAllTileFetching()
  },
})
/** 兑现 */
const { run: runCashOut, loading: cashOutLoading } = useRequest(() => ApiGameOriginalMines({
  type: 3,
  id: orderId.value,
  amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
  noNotify: true,
}), {
  onSuccess(res) {
    settleAmount.value = res.settle_amount
    const mines = res.state.mines

    if (mines) {
      for (let i = 0; i < tilesList.value.length; i++) {
        if (mines.includes(tilesList.value[i].position) && !tilesList.value[i].result)
          tilesList.value[i].result = 'mine'
        else if (!tilesList.value[i].result)
          tilesList.value[i].result = 'gem'
      }
      isManualStart.value = false
    }
    currencyStore.initCurrencyList()
    playWinMusic()
  },
})
/** 自动投注 */
// 已选位置
const chosenPositions = computed(() => tilesList.value.filter(a => a.chosen).map(a => a.position))
// 可选总数
const chosenLimit = computed(() => 25 - mines.value)
const { run: runAutoBet } = useRequest(() => ApiGameOriginalMinesMultiple({
  position: chosenPositions.value.join(','),
  mines_count: mines.value,
  amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
}), {
  onSuccess(res) {
    currencyStore.initCurrencyList()
    // 渲染结果
    const mines = res.state.mines
    if (mines) {
      for (let i = 0; i < tilesList.value.length; i++) {
        if (mines.includes(tilesList.value[i].position) && !tilesList.value[i].result)
          tilesList.value[i].result = 'mine'
        else if (!tilesList.value[i].result)
          tilesList.value[i].result = 'gem'
      }
    }
    // 若赢
    if (+res.payout_multiplier > 0) {
      setTimeout(() => {
        settleAmount.value = res.settle_amount
        payoutMultiplier.value = res.payout_multiplier
        playWinMusic()
        betAmount.value = +percentIfWin.value === 0
          ? _betAmountBaseOnAuto.value
          : toFixedByLockCurrency(scientificToString(+betAmount.value * (1 + (+percentIfWin.value / 100))), orderCurrencyType.value)
        cumulativeWinsAndLosses('win', res.settle_amount, res.amount)
      }, animateEnabled.value ? 300 : 0)
    }
    // 若输
    else {
      betAmount.value = +percentIfLose.value === 0
        ? _betAmountBaseOnAuto.value
        : toFixedByLockCurrency(scientificToString(+betAmount.value * (1 + (+percentIfLose.value / 100))), orderCurrencyType.value)
      cumulativeWinsAndLosses('lose', res.settle_amount, res.amount)
    }

    // 局结束，重置状态
    setTimeout(() => {
      settleAmount.value = ''
      payoutMultiplier.value = '1.00'
      resetAllTile()

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
    }, isLiveBetting.value ? 800 : 1300)
  },
  onError() {
    stopAutoBet('end')
  },
})

const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
const diamonds = computed(() => 25 - mines.value - betRounds.value)
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))
const stopIfWinAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfWinAmount.value, +rate.value))))
const stopIfLoseAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfLoseAmount.value, +rate.value))))
const currencyPrefix = computed(() => getLockCurrencyPrefix(orderCurrencyType.value))
const autoBetBtnText = computed(() => isAutoStart.value ? t('停止自动投注') : isFinishingBetting.value ? t('正在完成投注') : t('开始自动投注'))
const gameStart = computed(() => isManualStart.value || isAutoStart.value)
const payoutMultiplierFixed = computed(() => toFixed(+payoutMultiplier.value))
const totalProfit = computed(() => toFixedByLockCurrency(mul(+betAmount.value, +payoutMultiplierFixed.value - 1), orderCurrencyType.value))
const disabledCashOut = computed(() => mines.value + diamonds.value === 25)
const noResultTiles = computed(() => tilesList.value.filter(a => !a.result))

/** 清除所有瓷砖请求状态 */
function clearAllTileFetching() {
  for (let i = 0; i < tilesList.value.length; i++)
    tilesList.value[i].fetching = false
}
/** 清除所有瓷砖的选中状态 */
function clearAllTileChosen() {
  for (let i = 0; i < tilesList.value.length; i++)
    tilesList.value[i].chosen = false
}
/** 还原所有瓷砖初始状态  */
function resetAllTile() {
  for (let i = 0; i < tilesList.value.length; i++) {
    tilesList.value[i].result = ''
    tilesList.value[i].openByPlayer = false
    tilesList.value[i].fetching = false
  }
}
/** 还原所有瓷砖初始状态 */
function resetGame() {
  betRounds.value = 0
  settleAmount.value = ''
  payoutMultiplier.value = '1.00'
  orderId.value = ''
  resetAllTile()
  tabChange()
}
// const { openNotify } = useNotify()
/** 下单 */
function makeOrder() {
  scrollToTop()
  if (!isLogin.value)
    return push('/register')
  if (userInfo.value?.exclude === 1) {
    Message.error(t('请先解除自我排除'))
    return
  }

  betAmountRef.value?.valiAmountBetLimit()
  if (!betAmountRef.value.betAmountError) {
    resetGame()
    runMakeOrder()
    playBetMusic()
  }
}
/** 翻开瓷砖 */
function openTile(position: number) {
  // 手动游戏翻开瓷砖
  if (isManual.value && isManualStart.value) {
    tilesList.value[position].fetching = true
    apiRequestQueue.addRequest(() => runOpenTile({ ...openTileParams.value, position, noNotify: true }))
  }

  // 自动游戏预选瓷砖
  else if (isAutoBet.value && !isAutoStart.value) {
    if (tilesList.value[position].chosen) {
      tilesList.value[position].chosen = false
      playSelectedMusic()
    }
    else {
      // 可选到达上限
      if (chosenPositions.value.length >= chosenLimit.value)
        return
      tilesList.value[position].chosen = true
      playSelectedMusic()
    }
  }
}
/** 随机翻开瓷砖 */
function openTileRandom() {
  const randomIndex = Math.floor(Math.random() * noResultTiles.value.length)
  openTile(noResultTiles.value[randomIndex].position)
}
/** 点击兑换 */
function onCashOutClick() {
  if (openTileLoading.value || cashOutLoading.value)
    return
  runCashOut()
}
/** 点击开始自动投注 */
function startAutoBet() {
  scrollToTop()
  if (!isLogin.value)
    return push('/register')
  if (userInfo.value?.exclude === 1) {
    Message.error(t('请先解除自我排除'))
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
    }, 200)
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
      autoBetStopNotify()
      break
    case 'end':
      autoBetEndNotify()
      break
    case 'win':
      autoBetStopWinNotify()
      break
    case 'lose':
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
watch(mines, () => {
  if (chosenPositions.value.length > chosenLimit.value) {
    playSelectedMusic()
    clearAllTileChosen()
  }
})
watch(visibility, (a) => {
  if (a === 'hidden') {
    isAutoStart.value = false
    clearReBetTimer()
  }
})
// 快捷键回调
function onKeySPACE() {
  // 下注
  if (!gameStart.value) {
    if (isManual.value)
      makeOrder()

    else if (isAutoBet.value && chosenPositions.value.length > 0 && !isFinishingBetting.value)
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
onMounted(() => {
  if (isLogin.value)
    runCheckOrder()
  else
    onLoaded()
})
onBeforeUnmount(() => {
  clearReBetTimer()
})

function tabChange() {
  scrollToTop()
}
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled"
    :game="GAMES_LIST_ENUM.MINES" :game-type="GAMES_LIST_ENUM.MINES"
    :game-data="gameData"
    @open-game-info="showMinesGameInfoDialog = true" @open-hot-keys="showMinesHotKeysDialog = true"
  >
    <template #left>
      <div class="grid w-full gap-y-[12px]">
        <AfunBaseTabs
          v-model="tab" :disabled="gameStart || orderLoading || initLoading" :disable-click="gameStart"
          class="order-last @[800px]:order-1 set-gap" :list="tabList" full :type="6" @change="resetGame"
        />
        <AfunBaseLabel class="order-first set-label-color" :label="t('投注额')" :right-text="currencyPrefix + betAmountMulRate">
          <div class="bg-[#13212d] rounded-[4px] border border-[#2f4553] border-solid p-[4px]">
            <AppMiniGamePublicBetAmount
              ref="betAmountRef" v-model="betAmount" :currency="orderCurrencyCode"
              :disabled="gameStart || orderLoading || initLoading"
            />
          </div>
        </AfunBaseLabel>
        <div class="flex-col-12 order-2 min-h-[59px] flex flex-col">
          <AfunBaseLabel v-show="!isManualStart" class="order-2 set-label-color" :label="t('Mines')">
            <AfunBaseSelect
              v-model.number="mines" class="theme-select"
              :disabled="gameStart || orderLoading || initLoading" :options="minesList"
              style="--tg-base-select-style-padding-y:8.5px;"
            />
          </AfunBaseLabel>
          <div v-show="isManualStart" class="flex-col-12 order-2 flex flex-col">
            <!-- 手动下注游戏开始 -->
            <div class="flex-row-8 order-2 w-full flex items-center">
              <AfunBaseLabel class="order-2 grow set-label-color" :label="t('Mines')">
                <AfunBaseInput
                  v-model="mines" readonly
                  style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
                />
              </AfunBaseLabel>
              <AfunBaseLabel class="order-2 grow set-label-color" :label="t('宝石')">
                <AfunBaseInput
                  v-model="diamonds" readonly
                  style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
                />
              </AfunBaseLabel>
            </div>
            <AfunBaseLabel class="order-2 set-label-color" :label="t('总利润', { profit: payoutMultiplierFixed })">
              <AfunBaseInput
                v-model="totalProfit" readonly
                style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              >
                <template #right>
                  <AfunBaseCurrencyIcon style="--tg-app-currency-icon-size:16px;" :currency-type="orderCurrencyType" />
                </template>
              </AfunBaseInput>
            </AfunBaseLabel>
            <AfunBaseButton
              :disabled="openTileLoading" class="order-2 hidden @[800px]:block" shadow size="sm"
              @click="openTileRandom"
            >
              {{ t('随机翻开瓷砖') }}
            </AfunBaseButton>
          </div>
        </div>

        <!-- 自动投注 -->
        <div v-show="isAutoBet" class="order-2 grid gap-y-[12px]">
          <AfunBaseLabel class="order-2 set-label-color" :label="t('投注次数')">
            <AppMiniGamePublicBetTimes v-model.number="betTimes" />
          </AfunBaseLabel>
          <AfunBaseLabel class="order-2 set-label-color" :label="t('若赢')">
            <div class="bg-[#2f4553] rounded-[4px] py-[2px] pl-[2px] pr-[40px]">
              <AppMiniGamePublicAutoDouble v-model="percentIfWin" :disabled="gameStart" />
            </div>
          </AfunBaseLabel>
          <AfunBaseLabel class="order-2 set-label-color" :label="t('若输')">
            <div class="bg-[#2f4553] rounded-[4px] py-[2px] pl-[2px] pr-[40px]">
              <AppMiniGamePublicAutoDouble v-model="percentIfLose" :disabled="gameStart" />
            </div>
          </AfunBaseLabel>
          <AfunBaseLabel
            class="order-2 set-label-color" :label="t('止盈')"
            :right-text="currencyPrefix + stopIfWinAmountMulRate"
          >
            <AfunBaseInput
              v-model="stopIfWinAmount" class="theme-input" type="number" input-mode="decimal"
              :disabled="gameStart"
              style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              @blur="onStopIfWinAmountBlur"
            >
              <template #right>
                <AfunBaseCurrencyIcon :currency-type="orderCurrencyType" />
              </template>
            </AfunBaseInput>
          </AfunBaseLabel>
          <AfunBaseLabel
            class="order-2 set-label-color" :label="t('止损')"
            :right-text="currencyPrefix + stopIfLoseAmountMulRate"
          >
            <AfunBaseInput
              v-model="stopIfLoseAmount" class="theme-input" type="number" input-mode="decimal"
              :disabled="gameStart"
              style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              @blur="onStopIfLoseAmount"
            >
              <template #right>
                <AfunBaseCurrencyIcon :currency-type="orderCurrencyType" />
              </template>
            </AfunBaseInput>
          </AfunBaseLabel>
        </div>
        <!-- </div> -->

        <AppMiniGamePublicBetButton
          v-if="isManual && !isManualStart" class="order-1 @[800px]:order-2"
          :disabled="orderLoading || initLoading" :game="GAMES_LIST_ENUM.MINES" :loading="orderLoading || initLoading"
          @bet-btn-click="makeOrder"
        >
          {{ t('投注') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-if="isManual && isManualStart" class="order-1 @[800px]:order-2"
          :disabled="disabledCashOut" :game="GAMES_LIST_ENUM.MINES" :loading="openTileLoading || cashOutLoading"
          @bet-btn-click="onCashOutClick"
        >
          {{ t('兑现') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet" is-auto class="order-1 @[800px]:order-2"
          :auto-start="isAutoStart" :game="GAMES_LIST_ENUM.MINES"
          :disabled="isLogin ? chosenPositions.length === 0 || isFinishingBetting : false"
          @bet-btn-click="startAutoBet"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div
        class="bg relative grid grid-cols-5 m-auto max-w-[630px] w-full gap-x-[0.75em] gap-y-[1em] px-[0.75em] pb-[1em] pt-[0.75em] text-[0.5em] @[800px]:text-[1em]"
        :style="{
          '--duration': animateEnabled ? '300ms' : '0',
        }"
      >
        <AppMiniGamePartMinesTile
          v-for="tile, i in tilesList" :key="tile.position" :index="i" :is-auto="isAutoBet"
          :data="tile" :animate-enabled="animateEnabled" @click="openTile(tile.position)"
        />

        <!-- 兑换结果 -->
        <transition name="fade">
          <div v-if="settleAmount" class="absolute h-full w-full flex items-center justify-center">
            <div
              class="shadow-tg-box-shadow-lg tg-settle-amount-theme max-w-[100%] min-w-[150px] border-[3px] rounded-[6px] border-solid text-center text-[14px] font-extrabold"
            >
              <div class="w-full flex flex-col items-center px-[1em] py-[0.75em] text-center">
                <span class="text-[2em] font-bold leading-[1.5]" style="font-family: proxima-nova,sans-serif;">{{
                  payoutMultiplierFixed }}×</span>
                <div class="tg-just-a-line mb-[8px] mt-[4px] h-[3px] w-[30%]" />
                <AfunBaseAmount
                  style="font-family: proxima-nova,sans-serif;" class="leading-[1.5]" show-color
                  :amount="settleAmount" :currency-type="orderCurrencyType"
                />
              </div>
            </div>
          </div>
        </transition>
      </div>
    </template>
  </AppMiniGamePublicLayout>
  <AfunBaseDialog v-model="showMinesGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')">
    <AppMiniGamePartMinesGameInfo :game-type="GAMES_LIST_ENUM.MINES" />
  </AfunBaseDialog>
  <AfunBaseDialog v-model="showMinesHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')">
    <AppMiniGamePartMinesHotKeys :game-type="GAMES_LIST_ENUM.MINES" />
  </AfunBaseDialog>
</template>

<style lang='scss' scoped>
.tg-settle-amount-theme {
  border-color: #24ee89;
  color: #24ee89;
  background-color: #1a2c38;
  --afun-base-amount-positive-color: #24ee89;
}

.tg-just-a-line {
  background-color: #2f4553;
}

.bg {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all var(--duration) ease;
  transform-origin: center;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0);
}

.flex-col-12 {
  > *:not(:first-child) {
    margin-top: 12px;
  }
}

.flex-row-8 {
  > *:not(:first-child) {
    margin-left: 8px;
  }
}
.set-gap {
  --afun-tabs-item-gap: 0;
}
.set-label-color {
  --afun-base-label-color: #b1bad3;
}
</style>

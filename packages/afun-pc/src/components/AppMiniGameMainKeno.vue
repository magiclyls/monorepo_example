<script setup lang='ts'>
import type { OriginalGameKenoTile } from '~/shims'
import { ApiGameOriginalKenoBet } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'

defineOptions({
  name: 'AppMiniGameMainKeno',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const { openRegisterDialog } = useRegisterDialog()
const { openMiniGameInfoInsertDialog } = useMiniGameInsertDialogMinesGameInfo({ gameType: GAMES_LIST_ENUM.KENO })
const { openMiniGameHotKeysInsertDialog } = useMiniGameInsertDialogHotKeys({ gameType: GAMES_LIST_ENUM.KENO })
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()
const appStore = useAppStore()
const { currentGlobalCurrency, isLogin, userInfo, theme } = storeToRefs(appStore)
const { isMobile } = storeToRefs(useWindowStore())
const {
  autoBetStartNotify,
  autoBetStopNotify,
  autoBetEndNotify,
  autoBetStopWinNotify,
  autoBetStopLoseNotify,
} = useMiniGameAutoBetNotifications()
const gameBoardRightRef = ref()
const { width: rightWidth } = useElementSize(gameBoardRightRef, undefined, { box: 'border-box' })
const gameBoardRightFontSize = computed(() => {
  const a = (rightWidth.value / 900).toFixed(6)
  return +a > 0.5 ? +a : 0.5
})
const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')
const {
  kenoOddsData,
  winChanceList,
  tilesList,
  chosenNumberCount,
  gemCount,
  gameSettled,
  getRandomTenNumbers,
  clearTileResult,
  clearTileChosen,
} = useMiniGameKenoData()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playRevealedMusic } = useMiniGamePublicPlayMp3('/audio/keno.revealed.mp3')
const { play: playMatchMusic } = useMiniGamePublicPlayMp3('/audio/keno.match.mp3')
const { play: playWinMusic } = useMiniGamePublicPlayMp3('/audio/mines.win.mp3')
const { play: playSelectedMusic } = useMiniGamePublicPlayMp3('/audio/mines.selected.mp3')
const visibility = useDocumentVisibility()

/** 展示胜算悬浮窗 */
const { bool: showHitOddsTable } = useBoolean(false)
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 正在进行自动挑选 */
const { bool: isTileStatusRendering, setTrue: setTileRendering, setFalse: setTileRenderFinish } = useBoolean(false)
/** 手动 - 游戏开始 */
const { bool: isManualStart, setTrue: setManualStart } = useBoolean(false)
/** 自动 - 游戏开始 */
const { bool: isAutoStart, setTrue: setAutoStart } = useBoolean(false)
/** 是否无限自动投注 */
const { bool: isInfiniteBet, setTrue: setInfiniteBet } = useBoolean(false)

const {
  rate,
  orderCurrencyCode,
  toFixedByLockCurrency,
  getLockCurrencyPrefix,
} = useMiniGameLockCurrency(globalCurrencyCode.value)

const betAmountRef = ref()
const tab = ref('manual')
const tabList = [
  { label: t('mini_manual_bet'), value: 'manual' },
  { label: t('mini_auto_bet'), value: 'auto' },
]
// 风险
const riskOptions = [
  { label: t('keno_risk_classic'), value: 'classic' },
  { label: t('keno_risk_low'), value: 'low' },
  { label: t('keno_risk_medium'), value: 'medium' },
  { label: t('keno_risk_high'), value: 'high' },
]

/** 订单币种 */
const orderCurrencyType = computed(() => getCurrencyConfigByCode(orderCurrencyCode.value).name)
/** 投注金额 */
const betAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
/** 开始自动投注时的基础金额 */
const _betAmountBaseOnAuto = ref('')
/** 总利润倍数 */
const payoutMultiplier = ref('1.00')
/** 输赢金额 */
const settleAmount = ref('')
/** 结算金额 */
const payOutAmount = ref('')
/** 结算金额货币 */
const payCurrencyType = ref(orderCurrencyType.value)
// 展示胜算
const hitOddsTableWinChance = ref('')
/** 风险 */
const risk = ref('medium')
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
let renderNumbersTimer: any = null

// 选中的号码
const chosenNumber = computed(() => {
  return tilesList.value.filter(a => a.chosen).map(b => b.position)
})

/** 展示赔率、胜算 */
const winChanceAndOddsListToShow = computed(() => {
  const winChanceListToShow = winChanceList[chosenNumberCount.value]

  return kenoOddsData[risk.value][chosenNumberCount.value].map((odd, index) => {
    return {
      odd,
      winChance: winChanceListToShow[index],
    }
  })
})
const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))
const stopIfWinAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfWinAmount.value, +rate.value))))
const stopIfLoseAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfLoseAmount.value, +rate.value))))
const currencyPrefix = computed(() => getLockCurrencyPrefix(orderCurrencyType.value))
const autoBetBtnText = computed(() => isAutoStart.value ? t('mini_stop_auto_bet') : isTileStatusRendering.value ? t('mini_auto_bet_finish') : t('mini_start_auto_bet'))
const gameStart = computed(() => isManualStart.value || isAutoStart.value)
const payoutMultiplierFixed = computed(() => toFixed(+payoutMultiplier.value))

// 展示支付额
const hitOddsTablePayAmount = ref('')
// 展示获胜利润
const hitOddsTableWinAmount = computed(() => {
  if (hitOddsTablePayAmount.value && betAmount.value)
    return toFixedByLockCurrency(mul((+hitOddsTablePayAmount.value - 1), +betAmount.value), orderCurrencyType.value)

  return toFixedByLockCurrency('0', orderCurrencyType.value)
})
const hitOddsTableWinAmountMulRate = computed(() => {
  if (+hitOddsTableWinAmount.value >= 0)
    return currencyPrefix.value + formatWithSubstring(hitOddsTableWinAmount.value)

  else
    return `-${currencyPrefix.value}${formatWithSubstring(-hitOddsTableWinAmount.value)}`
})

/** 下注接口 */
const { run: runBet, loading: betLoading } = useRequest(() => ApiGameOriginalKenoBet({
  numbers: chosenNumber.value,
  risk: risk.value,
  bet_amount: betAmount.value,
  currency_id: orderCurrencyCode.value,
}), {
  onSuccess(res) {
    appStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
    // 奖金倍数
    payoutMultiplier.value = res.payout_multiplier
    // 结算金额
    payOutAmount.value = +res.payout > 0 ? res.payout : ''
    payCurrencyType.value = getCurrencyConfigByCode(res.currency).name
    // 输赢金额（盈利 - 本金）
    settleAmount.value = res.settle_amount

    // 渲染开奖结果
    drawnNumbers(res.state.drawn_numbers).then(() => {
      appStore.getBalanceData()
      if (+res.settle_amount > 0)
        playWinMusic()

      /** 自动投注 */
      if (isAutoBet.value) {
        // 若赢
        if (+res.settle_amount > 0) {
          betAmount.value = +percentIfWin.value === 0
            ? _betAmountBaseOnAuto.value
            : toFixedByLockCurrency(scientificToString(+betAmount.value * (1 + (+percentIfWin.value / 100))), orderCurrencyType.value)
          cumulativeWinsAndLosses('win', res.settle_amount, res.amount)
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
          payOutAmount.value = ''

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
        }, isLiveBetting.value ? 400 : 1300) // 即时下注缩短中奖结果的展示时间
      }
      else {
        isManualStart.value = false
      }
    })
  },
  onError() {
    if (isAutoBet.value)
      stopAutoBet('end')
    else
      isManualStart.value = false
  },
})

// 止盈金额失焦
function onStopIfWinAmountBlur() {
  stopIfWinAmount.value = toFixedByLockCurrency(stopIfWinAmount.value, orderCurrencyType.value)
}
// 止损金额失焦
function onStopIfLoseAmount() {
  stopIfLoseAmount.value = toFixedByLockCurrency(stopIfLoseAmount.value, orderCurrencyType.value)
}
/** 还原所有瓷砖初始状态 */
function resetGame() {
  settleAmount.value = ''
  payoutMultiplier.value = '1.00'
  payOutAmount.value = ''
  clearTileResult()
  tabChange()
}
const { openNotify } = useNotify()
/** 点击下注按钮 */
function onBetClick() {
  scrollMainContentToTop()
  if (!isLogin.value)
    return openRegisterDialog()
  if (userInfo.value?.exclude === 1) {
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
    return
  }
  betAmountRef.value?.valiAmountBetLimit()
  if (!betAmountRef.value.betAmountError) {
    setManualStart()
    resetGame()
    runBet()
    playBetMusic()
  }
}
/** 渲染开奖结果 */
function drawnNumbers(numbers: number[]) {
  return new Promise((resolve) => {
    if (renderNumbersTimer)
      clearRenderNumbersTimer()

    setTileRendering()
    // 未开启即时下注
    if (!isLiveBetting.value) {
      renderNumbersTimer = setInterval(() => {
        const index = numbers.shift()
        if (index !== undefined) {
          tilesList.value[index].result = 'hello world'
          if (tilesList.value[index].chosen) {
            // 选中的方块
            playMatchMusic()
          }
          else {
            playRevealedMusic()
          }
        }

        else {
          clearRenderNumbersTimer()
          resolve(true)
        }
      }, animateEnabled.value ? 150 : 100)
    }
    else {
      numbers.forEach((index) => {
        tilesList.value[index].result = 'hello world'
      })
      if (gemCount.value > 0) {
        // 选中的方块
        playMatchMusic()
      }
      else {
        playRevealedMusic()
      }
      setTimeout(() => {
        clearRenderNumbersTimer()
        resolve(true)
      }, 300)
    }
  })
}
/** 点击开始自动游戏按钮 */
function onStartAutoBetClick() {
  scrollMainContentToTop()
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
      clearTileResult()
      runBet()
    }
  }
  else {
    stopAutoBet('stop')
  }
}
// 自动投注重新下注
function autoBetReBet() {
  betAmountRef.value?.valiAmountBetLimit()
  if (!betAmountRef.value.betAmountError) {
    rebetTimer = setTimeout(() => {
      clearTileResult()
      runBet()
    }, 0)
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
/** 自动挑选 */
function randomChoose() {
  setTileRendering()
  if (renderNumbersTimer)
    clearRenderNumbersTimer()

  // 如果已选10个
  if (chosenNumberCount.value === 10)
    cleanTable()
  else
    resetGame()

  const numArr = getRandomTenNumbers()
  if (numArr) {
    renderNumbersTimer = setInterval(() => {
      const index = numArr.shift()
      if (index !== undefined) {
        tilesList.value[index].chosen = true
        playSelectedMusic()
      }
      else {
        clearRenderNumbersTimer()
      }
    }, animateEnabled.value ? 100 : 50)
  }
}
/** 清除获取随机数定时器 */
function clearRenderNumbersTimer() {
  clearInterval(renderNumbersTimer)
  renderNumbersTimer = null
  setTileRenderFinish()
}
/** 清空桌面 */
function cleanTable() {
  resetGame()
  clearTileChosen()
}
/** 点击方块 */
function onKenoTileClick(tile: OriginalGameKenoTile) {
  if (tile.chosen) {
    tile.chosen = false
  }
  else {
    tile.chosen = true
    playSelectedMusic()
  }
  resetGame()
}
/** 底部中奖个数鼠标移入 */
function onHitOddsMouseEnter(item: { odd: string, winChance: string }) {
  if (rightWidth.value < 500)
    return
  showHitOddsTable.value = true
  hitOddsTablePayAmount.value = item.odd
  hitOddsTableWinChance.value = item.winChance
}
/** 底部中奖个数鼠标移出 */
function onHitOddsMouseLeave() {
  showHitOddsTable.value = false
}
/** 底部赔率背景颜色 */
function getHitOddsBgColor(item: { odd: string, winChance: string }, index: number) {
  if (gameSettled.value) {
    if (gemCount.value === index) {
      if (+item.odd > 0 && index > 0)
        return 'var(--tg-third-grey)'

      return 'var(--tg-primary-main)'
    }
  }
  return ''
}
function tabChange() {
  if (isMobile.value) {
    nextTick(() => {
      window.requestAnimationFrame(() => {
        setTimeout(() => {
          document.querySelector('#tgTopForScroll')?.scrollIntoView({ behavior: 'smooth' })
        }, 0)
      })
    })
  }
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
watch(visibility, (a) => {
  if (a === 'hidden') {
    isAutoStart.value = false
    clearReBetTimer()
  }
})

// 快捷键回调
function onKeySPACE() {
  // 下注
  if (isManual.value && !gameStart.value)
    onBetClick()

  else if (isAutoBet.value && chosenNumberCount.value > 0 && !(isTileStatusRendering.value && !isAutoStart.value))
    onStartAutoBetClick()
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
  // 自动挑选
  if (!gameStart.value && !isTileStatusRendering.value)
    randomChoose()
}
function onKeyW() {
  // 清空桌面
  if (!gameStart.value && !isTileStatusRendering.value)
    cleanTable()
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
  resetGame()
  onLoaded()
})
onBeforeUnmount(() => {
  clearReBetTimer()
})
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled" :game-type="GAMES_LIST_ENUM.KENO"
    @open-game-info="openMiniGameInfoInsertDialog"
    @open-hot-keys="openMiniGameHotKeysInsertDialog"
  >
    <template #left>
      <div class="w-full flex flex-col gap-[12px]">
        <BaseTab
          v-model="tab" :disable-click="gameStart || isTileStatusRendering" :disabled="gameStart || isTileStatusRendering"
          class="order-last @[800px]:order-1" :list="tabList" full
          style="--tg-tab-style-inner-padding-y:13px;--tg-tab-style-inner-padding-x:16px;" @change="resetGame"
        />
        <BaseLabel class="order-1" :label="t('bet_amount')" :right-text="currencyPrefix + betAmountMulRate">
          <AppMiniGamePublicBetAmount
            ref="betAmountRef" v-model="betAmount" :currency="orderCurrencyCode"
            :disabled="gameStart || isTileStatusRendering"
          />
        </BaseLabel>
        <BaseLabel class="order-2" :label="t('plinko_risk')">
          <BaseSelect
            v-model="risk"
            class="theme-select" :options="riskOptions" :disabled="gameStart || isTileStatusRendering"
            style="--tg-base-select-style-padding-y:8.5px;" @select="resetGame"
          />
        </BaseLabel>
        <!-- 自动投注 -->
        <div v-show="isAutoBet" class="order-2 flex flex-col gap-[12px]">
          <BaseLabel class="order-2" :label="t('mini_bet_frequency')">
            <AppMiniGamePublicBetTimes v-model.number="betTimes" :disabled="isAutoStart" />
          </BaseLabel>
          <BaseLabel class="order-2" :label="t('mini_if_win')">
            <AppMiniGamePublicAutoDouble v-model="percentIfWin" :disabled="isAutoStart" />
          </BaseLabel>
          <BaseLabel class="order-2" :label="t('mini_if_lose')">
            <AppMiniGamePublicAutoDouble v-model="percentIfLose" :disabled="isAutoStart" />
          </BaseLabel>
          <BaseLabel
            class="order-2" :label="t('mini_take_profit')"
            :right-text="currencyPrefix + stopIfWinAmountMulRate"
          >
            <BaseInput
              v-model="stopIfWinAmount"
              class="theme-input" type="number" input-mode="decimal" :disabled="isAutoStart"
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
              v-model="stopIfLoseAmount"
              class="theme-input" type="number" input-mode="decimal" :disabled="isAutoStart"
              style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              @blur="onStopIfLoseAmount"
            >
              <template #right-icon>
                <AppCurrencyIcon :currency-type="orderCurrencyType" />
              </template>
            </BaseInput>
          </BaseLabel>
        </div>

        <BaseButton
          v-if="isManual" class="theme-btn order-2 hidden h-[40px] @[800px]:block" :disabled="isManualStart || isTileStatusRendering"
          @click="randomChoose"
        >
          {{ t('keno_auto_pick') }}
        </BaseButton>
        <BaseButton
          v-if="isManual" class="theme-btn order-2 hidden h-[40px] @[800px]:block" :disabled="isManualStart || isTileStatusRendering"
          @click="cleanTable"
        >
          {{ t('keno_clear_table') }}
        </BaseButton>

        <AppMiniGamePublicBetButton
          v-if="isManual "
          :disabled="isManualStart || isTileStatusRendering || chosenNumberCount === 0 " class="order-0 @[800px]:order-2"
          :loading="betLoading" :game="GAMES_LIST_ENUM.KENO" @bet-btn-click="onBetClick"
        >
          {{ t('mini_touzhu') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet" :disabled="(isTileStatusRendering && !isAutoStart) || chosenNumberCount === 0"
          is-auto class="order-first @[800px]:order-2" :auto-start="isAutoStart" :game="GAMES_LIST_ENUM.KENO"
          @bet-btn-click="onStartAutoBetClick"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div
        ref="gameBoardRightRef" class="theme-bg h-full flex flex-col items-center justify-between p-[16px]"
        :style="{ 'fontSize': `${gameBoardRightFontSize}em`, '--duration': animateEnabled ? '300ms' : '0' }"
      >
        <!-- 方块 -->
        <div class="relative grid grid-cols-8 mx-auto max-w-[780px] w-full gap-[0.75em]">
          <!-- 预加载 -->
          <object class="absolute z-[-10] h-[0px] w-[0px]" type="image/svg+xml" data="/img/game/keno_gem_animate.svg" />
          <AppMiniGamePartKenoTile
            v-for="tile in tilesList" :key="tile.num" :disabled="isTileStatusRendering || gameStart"
            :animate-enabled="animateEnabled" :data="tile" @click="onKenoTileClick(tile)"
          />
          <!-- 奖金 -->
          <div
            v-if="payOutAmount && !isTileStatusRendering"
            :class="[+settleAmount > 0 ? 'theme-settle-amount-active' : 'theme-settle-amount-default']"
            class="settleAmount-layer shadow-tg-box-shadow-lg max-w-[100%] min-w-[150px] border-[3px] rounded-[8px] border-solid text-center text-[14px] font-extrabold"
          >
            <div
              class="w-full flex flex-col items-center px-[1em] py-[0.75em] text-center"
              :class="[+settleAmount > 0 ? 'theme-settle-amount-active' : 'theme-settle-amount-default']"
            >
              <span class="text-[2em] font-bold leading-[1.5]" style="font-family: proxima-nova,sans-serif;">
                {{ payoutMultiplierFixed }}×
              </span>
              <div class="tg-just-a-line mb-[8px] mt-[4px] h-[3px] w-[30%]" />
              <AppAmount
                style="font-family: proxima-nova,sans-serif;--tg-app-amount-font-weight:700;"
                class="leading-[1.5]" :amount="payOutAmount" :currency-type="payCurrencyType"
              />
            </div>
          </div>
        </div>

        <!-- footer -->
        <div
          class="relative grid auto-rows-auto mt-[1em] min-h-[7em] w-full gap-[0.75em]"
          :style="{ '--keno-choose-count': winChanceAndOddsListToShow.length }"
        >
          <!-- payouts -->
          <div class="grid w-full gap-[0.75em]" style="grid-template-columns: repeat(var(--keno-choose-count), 1fr);">
            <div
              v-for="item, i in winChanceAndOddsListToShow" :key="item.odd + i"
              style="font-family: proxima-nova, sans-serif;"
              class="bg-tg-secondary flex items-center justify-center rounded-[4px]"
              :class="[theme === 'white' ? '' : 'shadow-tg-header-shadow']"
            >
              <span class="text-tg-text-white whitespace-nowrap text-[1em] font-semibold leading-[1.5] tabular-nums">
                {{ formatWithSubstring(item.odd) }}×
              </span>
            </div>
          </div>
          <!-- hit odds -->
          <div
            class="bg-tg-secondary footer-bottom relative grid w-full gap-[1em] rounded-[4px] px-[4px]"
            style="grid-template-columns: repeat(var(--keno-choose-count), 1fr);" :class="[theme === 'white' ? '' : 'shadow-tg-header-shadow']"
          >
            <!-- 悬浮窗 -->
            <div
              v-if="showHitOddsTable"
              class="theme-hit-odds absolute grid grid-cols-3 w-full gap-[16px] rounded-[4px] p-[16px]"
              style="bottom:calc(100% + 16px)"
            >
              <BaseLabel :label="t('h5_bet_bottom_menu_bar_slip_table_header_payout')">
                <BaseInput
                  readonly style="--tg-base-input-height:39px;--tg-base-input-style-placeholder-opacity:1;"
                  :placeholder="hitOddsTablePayAmount"
                />
              </BaseLabel>

              <BaseLabel :label="t('get_money')" :right-text="hitOddsTableWinAmountMulRate">
                <BaseInput
                  readonly style="--tg-base-input-height:39px;--tg-base-input-style-placeholder-opacity:1;"
                  :placeholder="hitOddsTableWinAmount"
                >
                  <template #right-icon>
                    <div class="flex items-center">
                      <AppCurrencyIcon style="--tg-app-currency-icon-size:16px" :currency-type="orderCurrencyType" />
                    </div>
                  </template>
                </BaseInput>
              </BaseLabel>
              <BaseLabel :label="t('win_chance')">
                <BaseInput
                  readonly style="--tg-base-input-height:39px;--tg-base-input-style-placeholder-opacity:1;"
                  :placeholder="hitOddsTableWinChance"
                />
              </BaseLabel>
            </div>
            <!-- 未选择任何号码 -->
            <div
              v-if="winChanceAndOddsListToShow.length === 0"
              class="flex grow items-center justify-center text-[12px] font-semibold text-[#d5dceb]"
            >
              {{ t('select_numbers_to_start') }}
            </div>
            <div
              v-for="item, i in winChanceAndOddsListToShow" v-else :key="item.winChance + i"
              class="bottom-box flex cursor-help items-center justify-center leading-[1]"
              :style="{ backgroundColor: getHitOddsBgColor(item, i) }" @mouseenter="onHitOddsMouseEnter(item)"
              @mouseleave="onHitOddsMouseLeave"
            >
              <span class="whitespace-nowrap text-[1em] font-semibold leading-[16px] tabular-nums">
                {{ i }}×
              </span>
              <img
                :class="gameSettled && gemCount === i ? '' : 'grayscale'" class="h-[1.2em] w-[1.2em] pl-[4px]"
                src="/afun-pc/img/game/keno_gem.svg" alt=""
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
</template>

<style lang='scss' scoped>
.theme-input {
  @include webTheme('green') {
    --tg-base-input-style-border: 1px solid #197b59;
    --tg-base-input-style-bg: #02432d;
  }
  @include webTheme('white') {
    --tg-base-input-style-bg: #fff;
  }
}
.theme-hit-odds {
  background-color: var(--tg-primary-main);
  @include webTheme('white') {
    background-color: #d8d8d8;
    --tg-base-input-style-placeholder-color: #111;
  }
  @include webTheme('green') {
    --tg-base-input-style-placeholder-color: #ffffff;
  }
}
.theme-btn {
  @include webTheme('white') {
    --tg-base-button-color: #e8e8e8;
    --tg-base-button-style-bg-hover: #585858;
  }
}
.theme-select {
  @include webTheme('white') {
    --tg-base-select-box-shadow: none;
    --tg-base-select-border: 1px solid #fff;
    --tg-base-Select-arrow-icon-color-on-white: #555;
    --tg-base-select-bg-theme-white: #fff;
  }
  @include webTheme('green') {
    --tg-base-select-box-shadow: none;
    --tg-base-select-border: 1px solid #197b59;
    --tg-base-select-select-warp-background-color: #02432d;
  }
}
.settleAmount-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: settleAmount-layer-fade-in var(--duration) ease forwards;
  background-color: var(--tg-primary-main);
  border-color: var(--tg-third-grey);
  @include webTheme('white') {
    background-color: #373737;
    border-color: #f2ca5c;
  }
  @include webTheme('green') {
    background-color: #055434;
    border-color: #ffefb0;
  }
}
.theme-settle-amount-default {
  color: var(--tg-third-grey);
  @include webTheme('white') {
    --tg-app-amount-green-color: #c1c1c1;
    color: #c1c1c1;
  }
  @include webTheme('green') {
    --tg-app-amount-green-color: #197b59;
    color: #197b59;
  }
}
.theme-settle-amount-active {
  color: var(--tg-text-green);
  @include webTheme('green') {
    --tg-app-amount-green-color: #ff9724;
    color: #ff9724;
  }
  @include webTheme('white') {
    --tg-app-amount-green-color: #24e6a8;
    color: #24e6a8;
  }
}
.tg-just-a-line {
  background-color: var(--tg-secondary-main);
  @include webTheme('green') {
    background-color: #197b59;
  }
  @include webTheme('white') {
    background-color: #454545;
  }
}
.theme-bg {
  @include webTheme('white') {
    background-color: #e3e3e3;
    --tg-third-grey: #f2ca5c;
    --tg-secondary-main: #e6aa05;
    --tg-secondary-grey: #f2ca5c;
    .footer-bottom {
      background: #585858;
    }
  }
  .bottom-box {
    color: var(--tg-text-white);
    @include webTheme('green') {
      --tg-third-grey: #5ecea6;
      --tg-primary-main: #02432d;
    }
    @include webTheme('white') {
      color: #fff;
      --tg-third-grey: #8f8f8f;
      --tg-primary-main: #373737;
    }
  }
}

@keyframes settleAmount-layer-fade-in {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-50%) scale(0);
  }

  80% {
    opacity: 1;
    transform: translateX(-50%) translateY(-50%) scale(1.1);
  }

  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(-50%) scale(1);
  }
}
</style>

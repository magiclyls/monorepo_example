<script setup lang='ts'>
import { ApiBettingGameOriginalDice } from '@tg/apis'

import { IconUniMultiplier, IconUniPersent, IconUniRefresh } from '@tg/icons'
import { GAMES_LIST_ENUM } from 'feie-ui'

defineOptions({
  name: 'AppMiniGameMainDice',
})
const onLoaded = inject('onLoaded', () => {})
const { t } = useI18n()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/bet.mp3')
const { play: playRollingAudio } = useMiniGamePublicPlayMp3('/audio/rolling.mp3')
const { play: playTickAudio } = useMiniGamePublicPlayMp3('/audio/tick.mp3')
const { play: playWinAudio } = useMiniGamePublicPlayMp3('/audio/win.mp3')
const { openMiniGameInfoInsertDialog } = useMiniGameInsertDialogDiceGameInfo()
const { openDialogBetSlipOriginalGame } = useDialogBetSlipOriginalGame()
const { openMiniGameHotKeysInsertDialog } = useMiniGameInsertDialogDiceHotKeys()
const appStore = useAppStore()
const { isLogin, currentGlobalCurrency, userInfo } = storeToRefs(appStore)
const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')
const {
  rate,
  orderCurrencyCode,
} = useMiniGameLockCurrency(globalCurrencyCode.value)
const gameStore = useGameStore()
const { isMobile } = storeToRefs(useWindowStore())
const { autoBetStartNotify, autoBetStopNotify, autoBetEndNotify, autoBetNetworkNotify } = useMiniGameAutoBetNotifications()
const visibility = useDocumentVisibility()
const isOpenNotify = ref(false)
const isHideDise = ref(true)
const { openNotify } = useNotify()
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 金额小数位数、投注额汇率换算前缀、 最小投注额、最大投注额 */
const { decimalNum, currencyPrefix } = storeToRefs(gameStore)
/** 注册对话框 */
const { openRegisterDialog } = useRegisterDialog()
/** 手动 - 游戏开始 */
const { bool: isManualStart } = useBoolean(false)
/** 自动 - 游戏开始 */
const { bool: isAutoStart } = useBoolean(false)
/** 是否翻卷 */
const { bool: roll, setBool: setRoll } = useBoolean(true)
/** 是否赢 */
const { bool: isWill, setBool: setWill } = useBoolean(false)
/** 正在完成投注 */
const { bool: isFinishingBetting } = useBoolean(false)
/** 连续输赢的局数 */
const willNumber = ref(0)
const lossNumber = ref(0)
/** 投注是否停止 */
const stopBet = ref(false)
const condition = computed(() => {
  if (roll.value)
    return 'above'
  else return 'below'
})
// 创建按钮列表的响应式数据
interface Button {
  id: number
  billId: string
  iswill: boolean
}
const buttons = ref<Button[]>([])

const tab = ref('manual')
const tabList = [
  { label: t('mini_manual_bet'), value: 'manual' },
  { label: t('mini_auto_bet'), value: 'auto' },
]
/** 投注金额 */
const betAmount = ref(toFixed(0, decimalNum.value))
/** 投注金额初始值 */
const initBetAmount = ref(toFixed(0, decimalNum.value))
/** 投注次数 */
const betTimes = ref(0)
/** 若赢增加 */
const incOnWin = ref('0')
/** 若输增加 */
const incOnLoss = ref('0')
/** 设置止赢金额 */
const stopOnProfit = ref(toFixed(0, decimalNum.value))
const stopOnProfitErrorMsg = ref('')
/** 设置止损金额 */
const stopOnLoss = ref(toFixed(0, decimalNum.value))
const stopOnLossErrorMsg = ref('')
/** 盈的钱数 */
const profit = ref(0)
/** 亏的钱数 */
const loss = ref(0)
/** 当前钱包 */
const currentWallet = ref(0)
/** dice游戏参数 */
const multiplier = ref((2).toFixed(4)) // 乘数
const betAmountRef = ref()
const winChance = ref((49.50).toFixed(4)) // 获胜机率
const rollValue = ref((50.50).toFixed(2)) // 掷大于
const randomNumber = ref(0) // 后端返回的随机数
let idleTimeoutID: any // 投注超时setTimeoutID
let distTimeoutID: any
const isAmountHasError = ref(false)
const reversedButtons = computed(() => buttons.value)
const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
/** 投注额 */
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))
const stopOnProfitMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopOnProfit.value, +rate.value))))
/** 获胜利润 */
const profitMulRate = computed(() => {
  return toFixed(+mul(+betAmount.value, (+multiplier.value - 1)), decimalNum.value)
})
/** 获胜利润转换 */
const profitMulRateTrans = computed(() => formatWithSubstring(toFixed(+mul(+mul(+betAmount.value, (+multiplier.value - 1)), +rate.value))))

const stopOnLossMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopOnLoss.value, +rate.value))))
const autoBetBtnText = computed(() => isAutoStart.value ? t('mini_stop_auto_bet') : (isFinishingBetting.value ? t('mini_auto_bet_finish') : t('mini_start_auto_bet')))
const gameStart = computed(() => isManualStart.value || isAutoStart.value)
// 后端返回随机数
const { loading: reqLoading, runAsync: runAsyncBetDice } = useRequest(ApiBettingGameOriginalDice)
/** 校验参数是否在有效范围 */
const amountError = computed(() => {
  if (betTimes.value > 999999999 || betTimes.value < 0 || +multiplier.value > 9900 || +multiplier.value < 1.0102 || +winChance.value > 98 || +winChance.value < 0.01)
    return true
  else
    return false
})
/** 判断输赢 */
const isWin = computed(() => {
  const _rollValue: number = +rollValue.value
  if (condition.value == 'above') {
    if (_rollValue < randomNumber.value)
      return true
    else return false
  }
  else if (condition.value == 'below') {
    if (_rollValue > randomNumber.value)
      return true
    else return false
  }
  else { return false }
})

/** 打开投注记录弹窗 */
function onOpenDialogBetRecord(data: { id: string, game: string }) {
  openDialogBetSlipOriginalGame({ ...data, uid: userInfo.value.uid })
}

// 添加按钮的方法
function addButton(value: number, billid: string) {
  buttons.value.push({ id: value, billId: billid, iswill: isWill.value })
  if (isMobile.value) {
    if (buttons.value.length > 3)
      buttons.value.shift()
  }
  else {
    if (buttons.value.length > 5)
      buttons.value.shift()
  }
}

function changeBetAmount(value: number) {
  const _betAmount = Number.isNaN(value) ? 0 : value
  betAmount.value = Number.parseFloat(_betAmount.toString()).toFixed(2)
  initBetAmount.value = Number.parseFloat(_betAmount.toString()).toFixed(2)
}

/** 手动投注 */
function startManualBet() {
  if (isLogin.value) {
    if (userInfo.value?.exclude === 1) {
      openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
      return
    }
    if (isManualStart.value) {
      stopManuaBet()
    }
    else {
      betAmountRef.value?.valiAmountBetLimit()
      if (!betAmountRef.value.betAmountError) {
        playAudio('bet')
        exeManuaBet()
      }
    }
  }
  else { openRegisterDialog() }
}

/** 执行手动投注 */
function exeManuaBet() {
  isManualStart.value = true
  isHideDise.value = false
  clearTimeout(distTimeoutID)
  runAsyncBetDice({
    point: rollValue.value,
    amount: betAmount.value,
    currency_id: orderCurrencyCode.value,
    condition: condition.value,
  }).then((data) => {
    appStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
    playAudio('rolling')
    randomNumber.value = +data.state.result
    if (isWin.value) {
      playAudio('win')
      setWill(true)
    }
    else {
      setWill(false)
    }
    addButton(randomNumber.value, data.id)
    appStore.getBalanceData()
    clearTimeout(idleTimeoutID)
    idleTimeoutID = setTimeout(() => {
      isManualStart.value = false
    }, 800)
    clearTimeout(distTimeoutID)
    distTimeoutID = setTimeout(() => {
      isHideDise.value = true
    }, 3000)
  })
}

/** 自动投注 */
function startAutoBet() {
  scrollMainContentToTop()
  if (isLogin.value) {
    if (userInfo.value?.exclude === 1) {
      openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
      return
    }

    if (isAutoStart.value) {
      stopAutoBet()
    }
    else {
      betAmountRef.value?.valiAmountBetLimit()
      if (!betAmountRef.value.betAmountError) {
        playAudio('bet')
        stopBet.value = false
        initBetAmount.value = Number.parseFloat(betAmount.value).toFixed(2)
        autoBetStartNotify()
        exeAutoBet(+betTimes.value)
      }
    }
  }

  else { openRegisterDialog() }
}

/** 执行自动投注 */
function exeAutoBet(betimes: number) {
  if (isAmountHasError.value)
    return
  if (betimes < 0)
    return
  if (!stopBet.value) {
    betimes--
    isAutoStart.value = true
    isHideDise.value = false
    betAmountRef.value?.valiAmountBetLimit()
    if (betAmountRef.value.betAmountError) {
      autoBetEndNotify()
      isAutoStart.value = false
      isHideDise.value = true
    }
    else {
      runAsyncBetDice({
        point: rollValue.value,
        amount: betAmount.value,
        currency_id: orderCurrencyCode.value,
        condition: condition.value,
      }).then((data) => {
        appStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
        playAudio('rolling')
        randomNumber.value = Number.parseFloat(data.state.result)
        if (isWin.value) {
          playAudio('win')
          setWill(true)
          willNumber.value++
          lossNumber.value = 0
        }
        else {
          setWill(false)
          lossNumber.value++
          willNumber.value = 0
        }
        addButton(randomNumber.value, data.id)
        updateWalletProfit(+betAmount.value, +data.payout)
        autoBetControl(isWin.value)
        appStore.getBalanceData()
      }).catch(() => {
        autoBetNetworkNotify()
        stopAutoBet()
      })
      clearTimeout(idleTimeoutID)
      idleTimeoutID = setTimeout(() => exeAutoBet(betimes), 2000)
      if (betimes == -1) {
        betTimes.value = 0
        betimes = 0
      }
      else if (betimes === 0) {
        betTimes.value = 0
        stopBet.value = true
      }
      else {
        betTimes.value = betimes
      }
    }
  }
  else {
    clearTimeout(idleTimeoutID)
    idleTimeoutID = setTimeout(() => {
      isAutoStart.value = false
      stopBet.value = false
      isHideDise.value = true
      if (!isOpenNotify.value)
        autoBetEndNotify()
    }, 4000)
  }
}

/** 自动投注控制 */
function autoBetControl(isWin: boolean) {
  if ((+incOnWin.value === 0 && willNumber.value === 1) || (+incOnLoss.value === 0 && lossNumber.value === 1))
    betAmount.value = initBetAmount.value
  if (isWin && +incOnWin.value > 0)
    betAmount.value = application.formatNumDecimal(+betAmount.value * (+incOnWin.value / 100 + 1), decimalNum.value)
  if (!isWin && +incOnLoss.value > 0)
    betAmount.value = application.formatNumDecimal(+betAmount.value * (+incOnLoss.value / 100 + 1), decimalNum.value)
  // stopOnProfit设置的止盈数据
  if (isWin && +stopOnProfit.value > 0 && currentWallet.value >= +stopOnProfit.value) { // 止盈满足条件,
    stopAutoBet()
  }
  // stopOnLoss设置的止损数据
  if (!isWin && +stopOnLoss.value > 0 && Math.abs(currentWallet.value) >= +stopOnLoss.value) { // 止损满足条件
    stopAutoBet()
  }
}

/** 自动投注停止 */
function stopAutoBet() {
  stopBet.value = true
  isAutoStart.value = false
  updateProfitBalance(0)
  autoBetStopNotify()
  isOpenNotify.value = true
  isFinishingBetting.value = true
  setTimeout(() => {
    isFinishingBetting.value = false
  }, 300)
}

/** 手动投注停止 */
function stopManuaBet() {
  isManualStart.value = false
}

/** 更新盈利 */
function updateWalletProfit(amount: number, payout: number) {
  if (payout > 0) {
    const profit = payout - amount
    updateProfitBalance(profit)
  }
  else {
    const loss = amount
    updateLossBalance(loss)
  }
}

/** 更新止盈数据 */
function updateProfitBalance(value: number) {
  profit.value += value
  currentWallet.value = value === 0 ? 0 : currentWallet.value + value
}

/** 更新止损数据 */
function updateLossBalance(value: number) {
  loss.value += value
  currentWallet.value = value === 0 ? 0 : currentWallet.value - value
}

/** 乘数切换事件 */
function changeMultiplier(value: number) {
  const multiVal = Number.isNaN(value) ? 0 : value
  multiplier.value = multiVal as any
  updateStatus(multiVal, 'multiplier')
}

/** 离开乘数事件 */
function onBlurMultiplier(value: any) {
  multiplier.value = Number.parseFloat(value).toFixed(4)
}
/** 离开获胜机率事件 */
function onBlurWinChance(value: any) {
  winChance.value = Number.parseFloat(value).toFixed(4)
}

/** 获胜机率切换事件 */
function changeWinChance(value: number) { // 获胜机率 切换事件，最小值0.01，最大值98
  const winChanVal = value
  winChance.value = winChanVal as any
  updateStatus(winChanVal, 'winchance')
}

function updateStatus(value: number, type: string) {
  let rollVal
  let winChan
  let multip
  if (type == 'multiplier') { // 更新乘数数据
    value = Number.isNaN(value) ? 1.0102 : value
    winChan = Math.round((99 / value) * 100) / 100
    multip = Math.round((99 / winChan) * 10000) / 10000
    winChance.value = winChan.toFixed(4)
  }
  else {
    value = Number.isNaN(value) ? 0.01 : value
    winChan = Math.round(value * 100) / 100
    multip = Math.round((99 / winChan) * 10000) / 10000
    multiplier.value = multip.toFixed(4)
  }
  if (roll.value)
    rollVal = 100 - winChan
  else
    rollVal = winChan

  rollValue.value = rollVal.toFixed(2)
}
/** 移动滑条 */
function changeRollValue(event: any) {
  const rollVal = event.target.value
  let winChan
  if (roll.value)
    winChan = 100 - rollVal
  else winChan = rollVal
  const multip = Math.round((99 / winChan) * 10000) / 10000
  multiplier.value = multip.toFixed(4)
  winChance.value = Number.parseFloat(winChan).toFixed(4)
  rollValue.value = Number.parseFloat(rollVal).toFixed(2)
}
/** 切换掷大小于 */
function changeRollOver() {
  if (roll.value)
    setRoll(false)
  else
    setRoll(true)
  const winChan = 100 - +rollValue.value
  rollValue.value = winChan.toFixed(2)
}

/**  离开止盈输入框 */
function changeStopProfit() {
  if (+stopOnProfit.value < 0) {
    stopOnProfitErrorMsg.value = t('mini_must_than_zero')
  }
  else if (+stopOnProfit.value === 0) {
    stopOnProfit.value = '0.00'
    stopOnProfitErrorMsg.value = ''
  }
  else {
    stopOnProfit.value = toFixed(+stopOnProfit.value, decimalNum.value)
    stopOnProfitErrorMsg.value = ''
  }
}

/** 改变止损函数 */
function changeStopLoss() {
  if (+stopOnLoss.value < 0) {
    stopOnLossErrorMsg.value = t('mini_must_than_zero')
  }
  else if (+stopOnLoss.value === 0) {
    stopOnLoss.value = '0.00'
    stopOnLossErrorMsg.value = ''
  }
  else {
    stopOnLoss.value = toFixed(+stopOnLoss.value, decimalNum.value)
    stopOnLossErrorMsg.value = ''
  }
}

/** 播放音乐 */
function playAudio(audio: string) {
  if (audio == 'bet')
    playBetMusic()

  else if (audio == 'rolling')
    playRollingAudio()

  else if (audio == 'tick')
    playTickAudio()

  else
    playFromStart()
}

/** 从头开始播放 */
function playFromStart() {
  playWinAudio()
  /* winAudio.currentTime = 0
  winAudio.play() */
}

watch(decimalNum, (a) => {
  betAmount.value = toFixed(+betAmount.value, a)
})
watch(betTimes, (a, b) => {
  if (+b > 0 && !a)
    betTimes.value = 0
})
watch(visibility, (a) => {
  if (a === 'hidden') {
    isAutoStart.value = false
    clearTimeout(idleTimeoutID)
    clearTimeout(distTimeoutID)
  }
})
watch(globalCurrencyCode, (a) => {
  orderCurrencyCode.value = a
})

onMounted(() => {
  onLoaded()
})
onBeforeUnmount(() => {
  clearTimeout(idleTimeoutID)
  clearTimeout(distTimeoutID)
})

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
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled"
    :game-type="GAMES_LIST_ENUM.DICE"
    @open-game-info="openMiniGameInfoInsertDialog"
    @open-hot-keys="openMiniGameHotKeysInsertDialog"
  >
    <template #left>
      <div class="unselectable w-full flex flex-col gap-[12px]">
        <BaseTab
          v-model="tab" :disabled="gameStart || reqLoading" :disable-click="gameStart"
          class="tab-bg-color order-last @[800px]:order-1" :list="tabList" full
          style="--tg-tab-style-inner-padding-y:13px;--tg-tab-style-inner-padding-x:16px;"
          @change="tabChange"
        />
        <BaseLabel class="text-theme-color order-2" :label="t('bet_amount')" :right-text="currencyPrefix + betAmountMulRate">
          <AppMiniGamePublicBetAmount ref="betAmountRef" v-model="betAmount" :disabled="gameStart || reqLoading" :currency="globalCurrencyCode" @input="changeBetAmount" />
        </BaseLabel>
        <div class="flex-col-12 order-2 min-h-[59px] flex flex-col">
          <!-- 手动下注游戏开始 -->
          <div v-show="isManual" class="flex-col-12 order-2 flex flex-col">
            <BaseLabel class="text-theme-color order-2" :label="t('mini_win_profit')" :right-text="currencyPrefix + profitMulRateTrans">
              <BaseInput
                v-model="profitMulRate" readonly
                class="border-theme-color"
                style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              >
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
                </template>
              </BaseInput>
            </BaseLabel>
          </div>
          <!-- 自动投注 -->
          <div v-show="isAutoBet" class="order-2 flex flex-col gap-[12px]">
            <BaseLabel class="text-theme-color order-2" :label="t('mini_bet_frequency')">
              <AppMiniGamePublicBetTimes v-model.number="betTimes" />
            </BaseLabel>
            <BaseLabel class="text-theme-color order-2" :label="t('mini_if_win')">
              <AppMiniGamePublicAutoDouble v-model="incOnWin" :disabled="gameStart || reqLoading" />
            </BaseLabel>
            <BaseLabel class="text-theme-color order-2" :label="t('mini_if_lose')">
              <AppMiniGamePublicAutoDouble v-model="incOnLoss" :disabled="gameStart || reqLoading" />
            </BaseLabel>
            <BaseLabel class="text-theme-color order-2" :label="t('mini_take_profit')" :right-text="currencyPrefix + stopOnProfitMulRate">
              <BaseInput v-model="stopOnProfit" class="border-theme-color" :step="0.01" type="number" input-mode="decimal" :disabled="gameStart || reqLoading" :msg="stopOnProfitErrorMsg" @blur="changeStopProfit">
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
                </template>
              </BaseInput>
            </BaseLabel>
            <BaseLabel class="text-theme-color order-2" :label="t('mini_stop_lose')" :right-text="currencyPrefix + stopOnLossMulRate">
              <BaseInput v-model="stopOnLoss" class="border-theme-color" :step="0.01" type="number" input-mode="decimal" :disabled="gameStart || reqLoading" :msg="stopOnLossErrorMsg" @blur="changeStopLoss">
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
                </template>
              </BaseInput>
            </BaseLabel>
          </div>
        </div>

        <AppMiniGamePublicBetButton v-if="isManual" :disabled="gameStart || reqLoading || amountError" :loading="gameStart || reqLoading" class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.DICE" @bet-btn-click="startManualBet">
          {{ t('mini_touzhu') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton v-else-if="isAutoBet" :auto-start="gameStart" :disabled="isFinishingBetting || amountError" :loading="gameStart || reqLoading || isFinishingBetting" is-auto class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.DICE" @bet-btn-click="startAutoBet">
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div class="unselectable main-game px-[16px] pb-[16px] pt-[48px] @[800px]:min-h-[630px]">
        <!-- 游戏历史数据 -->
        <div class="dice-btn-line absolute right-[16px] top-[16px] w-full flex justify-end overflow-hidden container">
          <div class="relative flex">
            <TransitionGroup name="list">
              <BaseButton
                v-for="button in reversedButtons" :key="button.billId" :bg-style="button.iswill ? (appStore?.theme === 'white' ? 'secondary-white' : 'secondary') : 'default-btn'"
                class="button-number mr-[4px]"
                round custom-padding
                @click="onOpenDialogBetRecord({ id: button.billId, game: GAMES_LIST_ENUM.DICE })"
              >
                {{ (button.id).toFixed(2) }}
              </BaseButton>
            </TransitionGroup>
          </div>
        </div>
        <!-- 游戏显示区 -->
        <div class="content svelte">
          <div
            class="svelte wrap" :data-test-dice-condition="[roll ? 'above' : 'below']" style="--slider-height:8px;--drag-size:36px;--max-game-board-width: 730px;
        --lines-asset: url(/img/game/lines.svg);"
          >
            <div class="wrap svelte-jyarsh">
              <div class="content svelte-jyarsh" style="left: 0%;">
                <div class="svelte-jyarsh value">
                  0
                </div>
              </div>
              <div class="content svelte-jyarsh" style="left: 25%;">
                <div class="value svelte-jyarsh">
                  25
                </div>
              </div>
              <div class="content svelte-jyarsh" style="left: 50%;">
                <div class="value svelte-jyarsh">
                  50
                </div>
              </div>
              <div class="content svelte-jyarsh" style="left: 75%;">
                <div class="value svelte-jyarsh">
                  75
                </div>
              </div>
              <div class="content svelte-jyarsh" style="left: 100%;">
                <div class="value svelte-jyarsh">
                  100
                </div>
              </div>
            </div>

            <div class="svelte translate">
              <div class="svelte translate-x" :style="{ transform: `translate(${randomNumber}%, 0px)` }">
                <div class="svelte hide-show" :class="[isWill ? 'positive' : 'negative', isHideDise ? 'is-hidden' : '']">
                  <img class="svelte dice" src="/afun-pc/img/game/classic-dice.svg" alt="Dice">
                  <div class="svelte result" :class="[isWill ? 'positive' : 'negative']">
                    {{ randomNumber.toFixed(2) }}
                  </div>
                </div>
              </div>
              <div class="svelte range">
                <div :class="[roll ? 'lower above svelte' : 'lower below svelte']" /> <div :class="[roll ? 'higher above svelte' : 'higher below svelte']" :style="{ width: `${rollValue}%` }" />
              </div>
              <input min="2.00" step="1.00" max="98.00" :value="rollValue" type="range" class="svelte classic-slider" data-test="dice-slider" @input="changeRollValue">
            </div>
          </div>
        </div>
        <!-- 底部参数 -->
        <div class="multiplier-pop bg-tg-secondary-grey grid grid-cols-3 items-center gap-[8px] p-[16px]">
          <BaseLabel :label="t('dice_bet_score_pop_up_multiplier')" class="text-theme-color">
            <AppMiniGamePublicNumber :model-value="multiplier" :min="1.0102" :max="9900" :disabled="gameStart" :currency="globalCurrencyCode" @input="changeMultiplier" @blur="onBlurMultiplier">
              <template #right-icon>
                <IconUniMultiplier class="icon-theme-color" />
              </template>
            </AppMiniGamePublicNumber>
          </BaseLabel>
          <BaseLabel class="text-theme-color" :label="roll ? t('dice_bet_score_pop_up_roll_over') : t('dice_bet_score_pop_up_roll_under')" @click="changeRollOver">
            <div class="base-input">
              <div class="input-wrap">
                <div class="readonly input-box">
                  <input min="2" step="0.01" max="98" type="number" :value="rollValue" inputmode="decimal" readonly class="readonly p-r-0" autocomplete="new-number">
                  <div class="right-icon" style="font-size:16px">
                    <IconUniRefresh class="icon-theme-color" />
                  </div>
                </div>
              </div>
            </div>
          </BaseLabel>
          <BaseLabel class="text-theme-color" :label="t('dice_bet_score_pop_up_win_chance')">
            <AppMiniGamePublicNumber :disabled="gameStart" :min="0.01" :max="98.0000" :model-value="winChance" @input="changeWinChance" @blur="onBlurWinChance">
              <template #right-icon>
                <IconUniPersent class="icon-theme-color" />
              </template>
            </AppMiniGamePublicNumber>
          </BaseLabel>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
</template>

<style>
:root {
  --slider-height: 8px;
  --lines-asset: url(/img/game/lines.svg);
  --radius-base: 0.25rem;
  --spacingEm-1-5: 1.5em;
  --grey-400: var(--tg-secondary-main);
  --shadows-md: 0 4px 6px -1px rgba(27, 23, 23, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12);
  --dice-scale-transition: 500ms;
  --drag-size: 36px;
  --max-game-board-width: 730px;
  --blue-400: #4391e7;
  --green-500: #00e701;
  --green-600: #00b801;
  --red-500: #e9113c;
  --grey-200: #b1bad3;
  --dice-slide-transition: 300ms;
  --dice-result-transition: 100ms;
}
</style>

<style lang='scss' scoped>
.flex-col-12 {
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-12);
  }
}

.main-game {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include webTheme('white') {
    background: #e3e3e3;
    --tg-secondary-main: #585858;
  }
}
.unselectable {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE 10+ */
  user-select: none; /* Standard syntax */
  @include webTheme('green') {
    --tg-base-input-style-bg: var(--tg-base-input-style-background-color);
    --tg-base-input-readonly-bg-color: var(--tg-base-input-style-background-color);
  }
  @include webTheme('white') {
    --tg-base-input-style-bg: #ffffff;
    --tg-base-input-readonly-bg-color: #ffffff;
  }
  .dice-btn-line {
    @include webTheme('white') {
      --tg-base-button-style-bg-special: #24e6a8;
      --tg-secondary-text-color-theme-white: #111111;
    }
  }
}
.button-number {
  width: 59px;
  height: 31px;
  font-size: 12px;
}
.default-btn {
  color: #fff;
  @include webTheme('white') {
    background-color: #585858;
    color: #ffffff;
  }
  @include webTheme('new-default') {
    color: #ffffff;
    background-color: #304554;
  }
  @include webTheme('green') {
    background-color: #197b59;
  }
}
// 白色高亮样式
.secondary-white {
  background-color: #ffaa09;
  color: #111111;
}
.multiplier-pop {
  @include webTheme('white') {
    background: #d8d8d8;
  }
}
.base-input {
  width: 100%;
  font-size: var(--tg-font-size-default);

  label {
    color: var(--tg-text-lightgrey);
    font-weight: var(--tg-font-weight-semibold);

    span {
      color: var(--tg-text-error);
    }
  }

  .msg {
    font-size: var(--tg-font-size-md);
    display: flex;
    align-items: center;
    padding-top: 8px;
    padding-bottom: 4px;
    --tg-icon-color: var(--tg-text-error-sub);

    .error-icon {
      font-size: var(--tg-font-size-xs);
    }

    span {
      font-size: var(--tg-font-size-xs);
      color: var(--tg-text-error-sub);
      margin-left: var(--tg-spacing-4);
    }
  }

  .vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    label {
      margin-bottom: var(--tg-spacing-4);
    }
  }

  .horizontal {
    display: flex;
    align-items: center;

    label {
      width: 100px;
      margin-right: var(--tg-spacing-10);
    }
  }

  .input-wrap {
    width: 100%;
    position: relative;
    display: flex;
    // align-items: center;
    box-shadow: var(--tg-box-shadow);
    border-radius: var(--tg-radius-default);
    overflow: hidden;
    .right {
      cursor: pointer;
    }

    .right-button {
      padding: var(--tg-base-input-right-button-padding);
      cursor: pointer;
      display: flex;
      border-left: none;
      border-right: none;
      white-space: nowrap;
      line-height: 1;
      color: var(--tg-base-input-right-button-color);
      font-weight: var(--tg-font-weight-semibold);
      font-size: var(--tg-font-size-default);
      background-color: var(--tg-base-input-right-button-bg);
      transition: all ease 0.25s;
      min-width: var(--tg-base-input-right-button-min-width);
      max-width: var(--tg-base-input-right-button-max-width);
      align-items: center;
      justify-content: center;

      &:active {
        .content {
          transform: scale(0.96);
        }
      }

      &:hover:not(:active) {
        background-color: var(--tg-base-input-right-button-hover-bg);
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }
  .input-box {
    width: 100%;
    border-radius: var(--tg-radius-default);
    background: var(--tg-secondary-dark);
    border: var(--tg-base-input-style-border);
    position: relative;
    transition: all ease 0.25s;
    display: flex;
    align-items: center;
    @include webTheme('green') {
      border: 1px solid #055434;
    }

    &:hover:not(.error) {
      border-color: var(--tg-border-color-deep-grey);
    }

    &.readonly {
      background-color: var(--tg-secondary-dark);
      @include webTheme('white') {
        background: #ffffff;
      }
    }

    input {
      line-height: var(--tg-base-input-line-height);
      width: 100%;
      background-color: var(--tg-base-input-style-background-color);
      color: var(--tg-text-white);
      border: none;
      outline: none;
      padding: var(--tg-base-input-style-pad-y) var(--tg-base-input-style-pad-x);
      padding-left: var(--tg-base-input-style-pad-left);
      font-weight: var(--tg-base-input-style-font-weight);
      cursor: text;
      @include webTheme('green') {
        background-color: transparent;
      }

      &::placeholder {
        color: var(--tg-base-input-style-placeholder-color);
        opacity: var(--tg-base-input-style-placeholder-opacity);
      }

      &.textCenter {
        text-align: center;
      }

      &.hideSpinBtn {
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
      }
      &:disabled {
        cursor: not-allowed;
      }
    }

    .p-l-0 {
      padding-left: 0;
    }

    .p-r-0 {
      padding-right: 0;
    }

    .textCenter {
      text-align: center;
    }

    .eye {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: var(--tg-font-size-md);
      cursor: pointer;
      display: flex;
      padding: var(--tg-spacing-10) var(--tg-spacing-16);
    }

    .left-icon {
      padding: var(--tg-spacing-8);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-icon {
      padding: var(--tg-base-input-style-right-icon-pad-v) var(--tg-spacing-8);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: var(--tg-radius-default) 0 0 var(--tg-radius-default);
  }

  .active {
    border-color: var(--tg-border-color-deep-grey);
  }

  .error {
    border-color: var(--tg-text-error);
  }
}
.container {
  display: flex;
  flex-wrap: wrap;
}

@keyframes svelte-expand {
  50% {
    transform: scale(1.1) translate(-50%);
  }
}

.content.svelte {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  font-size: 16px;
  width: 100%;
  padding-bottom: 16px;
}
.content.svelte-jyarsh::after {
  content: '';
  bottom: 0;
  position: absolute;
  transform: translate(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid var(--tg-secondary-main);
  @include webTheme('white') {
    border-bottom: 6px solid #c1c1c1;
  }
}
.translate-x.svelte {
  position: absolute;
  display: flex;
  bottom: 50%;
  left: 0;
  right: 0;
  z-index: 5;
  pointer-events: none;
  transition: transform var(--dice-slide-transition);
  will-change: transform;
}
.wrap {
  font-size: 16px;
}

.svelte.wrap {
  position: relative;
  width: 100%;
  max-width: 730px;
  border-radius: 100px;
  padding: 24px;
  background: var(--tg-secondary-main);
  text-align: left;
  margin: 64px 0;
  @include webTheme('white') {
    background: #c1c1c1;
  }
}
.svelte.translate {
  position: relative;
  height: 8px;
}
.wrap.svelte-jyarsh {
  position: absolute;
  bottom: calc(100% - 1px);
  left: calc(1.5em + 4px);
  right: calc(1.5em + 4px);
}
.content.svelte-jyarsh {
  color: white;
  position: absolute;
  text-align: center;
  transform: translate(-50%);
  @include webTheme('white') {
    color: #111;
  }
}
.value.svelte-jyarsh {
  position: absolute;
  font-weight: 600;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
  @include webTheme('white') {
    color: #111111;
  }
}
.hide-show.svelte {
  position: relative;
  transform: translate(-50%);
  transition: all var(--dice-scale-transition);
  transform-origin: center bottom;
}
.hide-show.positive.svelte,
.hide-show.negative.svelte {
  animation: svelte-expand var(--dice-scale-transition);
}
.hide-show.svelte.is-hidden {
  transform: translate(-50%) scale(0.8);
  opacity: 0;
}
.dice.svelte {
  width: 7ch;
  height: auto;
  filter: drop-shadow(0 0 3px rgba(25, 25, 25, 0.1));
}
.result.svelte {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-shadow: 0 1px 0 #fff;
  font-weight: 600;
  transition: var(--dice-result-transition);
}
.result.neutral.svelte {
  color: var(--grey-200);
}
.result.positive.svelte {
  color: var(--green-600);
  @include webTheme('white') {
    color: #e9103d;
  }
}
.result.negative.svelte {
  color: var(--red-500);
  @include webTheme('white') {
    color: #00e700;
  }
}
.classic-slider.svelte {
  appearance: none;
  width: 100%;
  position: absolute;
  z-index: 10;
  background: #0000;
  top: 0;
  left: 0;
  height: 16px;
  pointer-events: none;
}
.classic-slider.svelte::-webkit-slider-thumb {
  height: var(--drag-size);
  width: var(--drag-size);
  border: none;
  background-color: #4391e7;
  background-image: var(--lines-asset);
  background-position: center;
  background-repeat: no-repeat;
  background-size: 40%;
  cursor: grab;
  -webkit-appearance: none;
  border-radius: var(--radius-base);
  box-shadow: var(--shadows-md);
  transform: translateY(calc(var(--slider-height) * -1));
  pointer-events: auto;
}

.range.svelte {
  pointer-events: none;
  height: 8px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 100px;
  box-shadow: 0 0 0 10px #0f212e;
  transition: opacity 0.3s;
  overflow: hidden;
  @include webTheme('green') {
    box-shadow: 0 0 0 10px #055434;
  }
  @include webTheme('white') {
    box-shadow: 0 0 0 10px #a4a4a4;
  }
}
.lower.svelte {
  position: absolute;
  height: 8px;
  width: 100%;
  right: 0;
  top: 0;
  border-radius: 100px;
}
.lower.above.svelte {
  background: var(--green-500);
  @include webTheme('white') {
    background: #e9103d;
  }
}
.lower.below.svelte {
  background: var(--red-500);
}
.higher.svelte {
  position: absolute;
  height: var(--slider-height);
  top: 0;
  left: 0;
  border-radius: 100px;
}
.higher.above.svelte {
  background: var(--red-500);
  @include webTheme('white') {
    background: #00e700;
  }
}
.higher.below.svelte {
  background: var(--green-500);
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  transform: translateX(100%);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.icon-theme-color {
  @include webTheme('green') {
    --tg-icon-color: #3cb389;
  }
}
.text-theme-color {
  @include webTheme('green') {
    --tg-base-label-title-color: #3cb389;
    --tg-text-lightgrey: #3cb389;
  }
}
.tab-bg-color {
  @include webTheme('green') {
    --tg-tab-style-wrap-bg-color: #02432d;
    --tg-tab-active-text-color: #ffffff;
  }
}
.border-theme-color {
  @include webTheme('green') {
    --tg-base-input-style-border: 2px solid #055434;
  }
}
</style>

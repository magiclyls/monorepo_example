<script setup lang='ts'>
import { ApiBettingGameOriginalLimbo } from '@tg/apis'

import { GAMES_LIST_ENUM } from 'feie-ui'
import gsap from 'gsap'
import { IconUniMultiplier, IconUniPersent } from '@tg/icons'

defineOptions({
  name: 'AppMiniGameMainLimbo',
})
const onLoaded = inject('onLoaded', () => {})
const { t } = useI18n()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/bet.mp3')
const { play: playRollingAudio } = useMiniGamePublicPlayMp3('/audio/rolling.mp3')
const { play: playTickAudio } = useMiniGamePublicPlayMp3('/audio/limbo.tick.mp3')
const { play: playWinAudio } = useMiniGamePublicPlayMp3('/audio/limbo.win.mp3')
const { openMiniGameInfoInsertDialog } = useMiniGameInsertDialogLimboGameInfo()
const { openDialogBetSlipOriginalGame } = useDialogBetSlipOriginalGame()
const { openMiniGameHotKeysInsertDialog } = useMiniGameInsertDialogLimboHotKeys()
const appStore = useAppStore()
const { isLogin, currentGlobalCurrency, userInfo } = storeToRefs(appStore)

const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')
const {
  rate,
  orderCurrencyCode,
} = useMiniGameLockCurrency(globalCurrencyCode.value)
const gameStore = useGameStore()
const { isMobile } = storeToRefs(useWindowStore())
const { autoBetStartNotify, autoBetStopNotify, autoBetEndNotify } = useMiniGameAutoBetNotifications()
const visibility = useDocumentVisibility()
const isOpenNotify = ref(false)
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
/** 是否赢 */
const { bool: isWill, setBool: setWill } = useBoolean(false)
/** 正在完成投注 */
const { bool: isFinishingBetting } = useBoolean(false)
/** 连续输赢的局数 */
const willNumber = ref(0)
const lossNumber = ref(0)
/** 投注是否停止 */
const stopBet = ref(false)
/** 即时下注 */
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()

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
/** Limbo游戏参数 */
const multiplier = ref((2).toFixed(2)) // 乘数
const betAmountRef = ref()
const winChance = ref((49.50).toFixed(8)) // 获胜机率
const randomNumber = ref(0) // 后端返回的随机数
let idleTimeoutID: any // 投注超时setTimeoutID
const isAmountHasError = ref(false)
const reversedButtons = computed(() => buttons.value)
const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))
/** 获胜利润 */
const profitMulRate = computed(() => {
  return toFixed(+mul(+betAmount.value, (+multiplier.value - 1)), decimalNum.value)
})
/** 获胜利润转换 */
const profitMulRateTrans = computed(() => formatWithSubstring(toFixed(+mul(+mul(+betAmount.value, (+multiplier.value - 1)), +rate.value))))

const stopOnProfitMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopOnProfit.value, +rate.value))))
const stopOnLossMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopOnLoss.value, +rate.value))))
const autoBetBtnText = computed(() => isAutoStart.value ? t('mini_stop_auto_bet') : (isFinishingBetting.value ? t('mini_auto_bet_finish') : t('mini_start_auto_bet')))
const gameStart = computed(() => isManualStart.value || isAutoStart.value)
/** 后端返回随机数 */
const { loading: reqLoading, runAsync: runAsyncBetLimbo } = useRequest(ApiBettingGameOriginalLimbo)
/** 投注的初始值 */
const result = reactive({
  limboNumber: 1.00, // 投注结果数值
})
/** 校验参数是否在有效范围 */
const amountError = computed(() => {
  if (betTimes.value > 999999999 || betTimes.value < 0 || +multiplier.value > 1000000 || +multiplier.value < 1.01 || +winChance.value > 98 || +winChance.value < 0.000099)
    return true
  else
    return false
})
/** 判断输赢 */
const isWin = computed(() => {
  const referNumber = mul(1.00, +multiplier.value)
  if (randomNumber.value > +referNumber)
    return true
  else return false
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
const { openNotify } = useNotify()
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
  result.limboNumber = 1.00
  runAsyncBetLimbo({
    amount: betAmount.value,
    currency_id: orderCurrencyCode.value,
    multiplier: multiplier.value,
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
    if (isLiveBetting.value)
      result.limboNumber = randomNumber.value

    else
      gsap.to(result, { duration: 1, limboNumber: randomNumber.value })
    addButton(randomNumber.value, data.id)
    appStore.getBalanceData()
    clearTimeout(idleTimeoutID)
    idleTimeoutID = setTimeout(() => {
      isManualStart.value = false
    }, 1000)
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
    result.limboNumber = 1.00
    betAmountRef.value?.valiAmountBetLimit()
    if (betAmountRef.value.betAmountError) {
      autoBetEndNotify()
      isAutoStart.value = false
    }
    else {
      runAsyncBetLimbo({
        amount: betAmount.value,
        currency_id: orderCurrencyCode.value,
        multiplier: multiplier.value,
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
        if (isLiveBetting.value)
          result.limboNumber = randomNumber.value

        else
          gsap.to(result, { duration: 1, limboNumber: randomNumber.value })

        addButton(randomNumber.value, data.id)
        updateWalletProfit(+betAmount.value, +data.payout)
        autoBetControl(isWin.value)
        appStore.getBalanceData()
      }).catch(() => {
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

/** 离开乘数控件 */
function onBlurMultiplier(value: any) {
  multiplier.value = Number.parseFloat(value).toFixed(2)
}

/** 获胜机率切换事件 */
function changeWinChance(value: number) { // 获胜机率 切换事件，最小值0.01，最大值98
  const winChanVal = value
  winChance.value = winChanVal as any
  updateStatus(winChanVal, 'winchance')
}
/** 离开获胜机率控件 */
function onBlurWinChance(value: string) {
  winChance.value = toFixed(value, 8)
}

function updateStatus(value: number, type: string) {
  let winChan
  let multip
  if (type == 'multiplier') { // 更新乘数数据
    value = Number.isNaN(value) ? 1.0102 : value
    winChan = Math.round((99 / value) * 1000000) / 1000000
    multip = Math.round((99 / winChan) * 10000) / 10000
    winChance.value = winChan.toFixed(8)
  }
  else {
    value = Number.isNaN(value) ? 0.01 : value
    winChan = Math.round(value * 1000000) / 1000000
    multip = Math.round((99 / winChan) * 10000) / 10000
    multiplier.value = multip.toFixed(2)
  }
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
    :game-type="GAMES_LIST_ENUM.LIMBO"
    @open-game-info="openMiniGameInfoInsertDialog"
    @open-hot-keys="openMiniGameHotKeysInsertDialog"
  >
    <template #left>
      <div class="unselectable w-full flex flex-col gap-[12px]">
        <BaseTab
          v-model="tab" :disabled="gameStart || reqLoading" :disable-click="gameStart"
          class="order-last @[800px]:order-1" :list="tabList" full
          style="--tg-tab-style-inner-padding-y:13px;--tg-tab-style-inner-padding-x:16px;"
          @change="tabChange"
        />
        <BaseLabel class="order-2" :label="t('bet_amount')" :right-text="currencyPrefix + betAmountMulRate">
          <AppMiniGamePublicBetAmount ref="betAmountRef" v-model="betAmount" :disabled="gameStart || reqLoading" :currency="globalCurrencyCode" @input="changeBetAmount" />
        </BaseLabel>
        <div class="order-2 min-h-[59px]">
          <!-- 手动下注游戏开始 -->
          <div v-show="isManual" class="order-2 flex flex-col gap-[12px]">
            <BaseLabel class="order-2" :label="t('mini_win_profit')" :right-text="currencyPrefix + profitMulRateTrans">
              <BaseInput
                v-model="profitMulRate" readonly
                style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              >
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" />
                </template>
              </BaseInput>
            </BaseLabel>
          </div>
          <!-- 自动投注 -->
          <div v-show="isAutoBet" class="order-2 flex flex-col gap-[12px]">
            <BaseLabel class="order-2" :label="t('mini_bet_frequency')">
              <AppMiniGamePublicBetTimes v-model.number="betTimes" @input="changeBetTimes" />
            </BaseLabel>
            <BaseLabel class="order-2" :label="t('mini_if_win')">
              <AppMiniGamePublicAutoDouble v-model="incOnWin" :disabled="gameStart || reqLoading" />
            </BaseLabel>
            <BaseLabel class="order-2" :label="t('mini_if_lose')">
              <AppMiniGamePublicAutoDouble v-model="incOnLoss" :disabled="gameStart || reqLoading" />
            </BaseLabel>
            <BaseLabel class="order-2" :label="t('mini_take_profit')" :right-text="currencyPrefix + stopOnProfitMulRate">
              <BaseInput v-model="stopOnProfit" :step="0.01" type="number" input-mode="decimal" :disabled="gameStart || reqLoading" :msg="stopOnProfitErrorMsg" @blur="changeStopProfit">
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
                </template>
              </BaseInput>
            </BaseLabel>
            <BaseLabel class="order-2" :label="t('mini_stop_lose')" :right-text="currencyPrefix + stopOnLossMulRate">
              <BaseInput v-model="stopOnLoss" :step="0.01" type="number" input-mode="decimal" :disabled="gameStart || reqLoading" :msg="stopOnLossErrorMsg" @blur="changeStopLoss">
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" style="--tg-app-currency-icon-size:16px" />
                </template>
              </BaseInput>
            </BaseLabel>
          </div>
        </div>
        <AppMiniGamePublicBetButton v-if="isManual" :disabled="gameStart || reqLoading || amountError" :loading="reqLoading" class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.LIMBO" @bet-btn-click="startManualBet">
          {{ t('mini_touzhu') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton v-else-if="isAutoBet" :auto-start="gameStart" :disabled="isFinishingBetting || amountError" :loading="reqLoading || isFinishingBetting" is-auto class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.LIMBO" @bet-btn-click="startAutoBet">
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div class="unselectable main-game px-[16px] pb-[16px] pt-[48px] @[800px]:min-h-[630px]">
        <!-- 游戏历史数据 -->
        <div class="absolute right-[16px] top-[16px] w-full flex justify-end overflow-hidden container">
          <div class="relative flex">
            <TransitionGroup name="list">
              <div
                v-for="button in reversedButtons" :key="button.billId"
                :class="[button.iswill ? 'theme-result-btn-color-will' : 'theme-result-btn-color-default']"
                class="mr-[4px] cursor-pointer rounded-[100px] px-[12px] py-[10px] text-[12px] font-semibold"
                @click="onOpenDialogBetRecord({ id: button.billId, game: GAMES_LIST_ENUM.LIMBO })"
              >
                {{ (button.id).toFixed(2) }}×
              </div>
            </TransitionGroup>
          </div>
        </div>
        <!-- 游戏显示区 -->
        <div class="flex flex-1 items-center justify-center py-[32px] text-center text-[4em] font-[var(--tg-font-weight-semibold)] @[800px]:text-[8em]">
          <span class="text-color" :class="[isWill ? 'win-color' : 'red-color', result.limboNumber === 1.00 ? 'white' : '']" style="font-variant-numeric: tabular-nums;">{{ `${result.limboNumber.toFixed(2)}` }}×</span>
        </div>
        <!-- 底部参数 -->
        <div class="multiple-count bg-tg-secondary-grey grid grid-cols-2 items-center gap-[8px] p-[16px]">
          <BaseLabel :label="t('target_multiple_count')">
            <AppMiniGamePublicNumber :model-value="multiplier" :min="1.01" :max="1000000.00" :disabled="gameStart" @input="changeMultiplier" @blur="onBlurMultiplier">
              <template #right-icon>
                <IconUniMultiplier />
              </template>
            </AppMiniGamePublicNumber>
          </BaseLabel>
          <BaseLabel :label="t('dice_bet_score_pop_up_win_chance')">
            <AppMiniGamePublicNumber :model-value="winChance" :min="0.000099" :max="98.0000" :disabled="gameStart" @input="changeWinChance" @blur="onBlurWinChance">
              <template #right-icon>
                <IconUniPersent />
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
.theme-result-btn-color-default {
  color: var(--tg-text-white);
  background-color: var(--tg-secondary-main);
  &:hover {
    background-color: var(--tg-text-grey);
  }
  @include webTheme('green') {
    background-color: #197b59;
    &:hover {
      background-color: #bcbc80;
    }
  }
  @include webTheme('greenblack') {
    &:hover {
      background-color: #1f9a75;
    }
  }
  @include webTheme('white') {
    background-color: #585858;
    color: #fff;
    &:hover {
      filter: brightness(1.5);
    }
  }
}
.theme-result-btn-color-will {
  color: var(--tg-text-dark);
  background-color: var(--tg-text-green);
  &:hover {
    background-color: var(--tg-primary-success);
  }
  @include webTheme('green') {
    background-color: #f6d14a;
    color: #05080a;
    &:hover {
      background-color: #ffc049;
    }
  }
  @include webTheme('greenblack') {
    background-color: #26ffbe;
    &:hover {
      background-color: #1f9a75;
    }
  }
  @include webTheme('white') {
    color: #05080a;
    background-color: #ffaa09;
    &:hover {
      background-color: #ffaa09;
    }
  }
}
.multiple-count {
  @include webTheme('white') {
    background-color: #d8d8d8;
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
  }
}
.win-color {
  color: var(--tg-primary-active);
}
.text-color.red-color {
  color: var(--tg-dot-state-bg);
  @include webTheme('white') {
    color: #e9113c;
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
}
.button-number {
  padding: 10px 12px !important;
  font-size: 12px;
}
.container {
  display: flex;
  flex-wrap: wrap;
}
.animate-enter,
.animate-leave-to {
  animation: slideInLeft 0.5s forwards;
}

.animate-leave,
.animate-enter-to {
  animation: slideOutLeft 0.5s forwards;
}
.text-color {
  @include webTheme('white') {
    color: #ffaa09;
  }
}
.green {
  color: var(--green-500);
}
.red {
  color: var(--red-500);
}
.white {
  color: var(--tg-text-white);
}
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutLeft {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
  }
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
</style>

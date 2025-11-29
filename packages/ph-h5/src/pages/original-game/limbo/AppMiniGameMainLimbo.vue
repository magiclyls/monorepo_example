<script setup lang='ts'>
import { ApiBettingGameOriginalLimbo } from '@tg/apis'
import { PhBaseButton, PhBaseCurrencyIcon, PhBaseDialog, PhBaseInput, PhBaseLabel, PhBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniGameInfo, IconUniKeyboard, IconUniMultiplier, IconUniPersent, IconUniRebate } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { application, formatWithSubstring, mul, scrollToTop, toFixed } from '@tg/utils'
import { useDocumentVisibility } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import gsap from 'gsap'
import { storeToRefs } from 'pinia'
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppDialogBetSlipCasino from '~/components/AppDialogBetSlipCasino.vue'
import { Message } from '~/utils'
import {
  AppMiniGamePartLimboGameInfo,
  AppMiniGamePartLimboHotKeys,
  AppMiniGamePublicAutoDouble,
  AppMiniGamePublicBetAmount,
  AppMiniGamePublicBetButton,
  AppMiniGamePublicBetTimes,
  AppMiniGamePublicLayout,
  AppMiniGamePublicNumber,
} from '../_components'
import {
  useMiniGameAutoBetNotifications,
  useMiniGameGlobalStateLiveBetting,
  useMiniGameLockCurrency,
  useMiniGamePublicPlayMp3,
} from '../composables'

defineOptions({
  name: 'AppMiniGameMainLimbo',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const { push } = useRouter()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/bet.mp3')
const { play: playRollingAudio } = useMiniGamePublicPlayMp3('/audio/rolling.mp3')
const { play: playTickAudio } = useMiniGamePublicPlayMp3('/audio/limbo.tick.mp3')
const { play: playWinAudio } = useMiniGamePublicPlayMp3('/audio/limbo.win.mp3')
const selectedItem = ref()
const showDetailDialog = ref(false)
const showLimboGameInfoDialog = ref(false)
const showLimboHotKeysDialog = ref(false)
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

const {
  rate,
  orderCurrencyCode,
} = useMiniGameLockCurrency(currentGlobalCurrencyMap.value.cur)
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.LIMBO,
})
const { autoBetStartNotify, autoBetStopNotify, autoBetEndNotify } = useMiniGameAutoBetNotifications()
const visibility = useDocumentVisibility()
const isOpenNotify = ref(false)
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 金额小数位数、投注额汇率换算前缀、 最小投注额、最大投注额 */
const decimalNum = computed(() => currentGlobalCurrencyMap.value.decimal)
const currencyPrefix = computed(() => currentGlobalCurrencyMap.value.prefix)
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
  { label: t('手动投注'), value: 'manual' },
  { label: t('自动投注'), value: 'auto' },
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
const autoBetBtnText = computed(() => isAutoStart.value ? t('停止自动投注') : (isFinishingBetting.value ? t('正在完成投注') : t('开始自动投注')))
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

function openMiniGameInfoDialog() {
  showLimboGameInfoDialog.value = true
}

function openMiniGameHotKeysDialog() {
  showLimboHotKeysDialog.value = true
}
/** 打开投注记录弹窗 */
function onOpenDialogBetRecord(data: { id: string, game_name: string }) {
  const _data = {
    ...data,
    bill_no: data.id,
    username: userInfo.value?.username,
    game_class: '8',
    game_name: data.game_name,
    uid: userInfo.value?.uid,
  }
  selectedItem.value = { type: 'casino', data: _data }
  showDetailDialog.value = true
}

// 添加按钮的方法
function addButton(value: number, billid: string) {
  buttons.value.push({ id: value, billId: billid, iswill: isWill.value })
  if (buttons.value.length > 3)
    buttons.value.shift()
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
      Message.error(t('请先解除自我排除'))
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
  else {
    push('/register')
  }
}

/** 执行手动投注 */
function exeManuaBet() {
  scrollToTop()
  isManualStart.value = true
  result.limboNumber = 1.00
  runAsyncBetLimbo({
    amount: betAmount.value,
    currency_id: orderCurrencyCode.value,
    multiplier: multiplier.value,
  }).then((data) => {
    currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
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
    currencyStore.initCurrencyList()
    clearTimeout(idleTimeoutID)
    idleTimeoutID = setTimeout(() => {
      isManualStart.value = false
    }, 1000)
  })
}

/** 自动投注 */
function startAutoBet() {
  scrollToTop()
  if (isLogin.value) {
    if (userInfo.value?.exclude === 1) {
      Message.error(t('请先解除自我排除'))
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

  else {
    push('/register')
  }
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
        currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
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
        currencyStore.initCurrencyList()
      }).catch(() => {
        stopAutoBet()
      })
      clearTimeout(idleTimeoutID)
      idleTimeoutID = setTimeout(() => exeAutoBet(betimes), 2000)
      if (betimes === -1) {
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
  if (type === 'multiplier') { // 更新乘数数据
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
    stopOnProfitErrorMsg.value = t('必须大于或等于0')
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
    stopOnLossErrorMsg.value = t('必须大于或等于0')
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
  if (audio === 'bet')
    playBetMusic()

  else if (audio === 'rolling')
    playRollingAudio()

  else if (audio === 'tick')
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
watch(currentGlobalCurrencyMap, (a) => {
  orderCurrencyCode.value = a.cur
})
onMounted(() => {
  onLoaded()
})
onBeforeUnmount(() => {
  clearTimeout(idleTimeoutID)
})

function tabChange() {
  scrollToTop()
}
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled"
    :game="GAMES_LIST_ENUM.LIMBO" :game-type="GAMES_LIST_ENUM.LIMBO"
    :game-data="gameData"
    @open-game-info="openMiniGameInfoDialog" @open-hot-keys="openMiniGameHotKeysDialog"
  >
    <template #left>
      <div class="unselectable grid w-full gap-y-[12rem]">
        <PhBaseTabs
          v-model="tab" :type="6" :disabled="gameStart || reqLoading" :disable-click="gameStart"
          class="order-last @[800px]:order-1 set-gap" :list="tabList" full @change="tabChange"
        />
        <PhBaseLabel class="order-first set-label-color" :label="t('投注额')" :right-text="currencyPrefix + betAmountMulRate">
          <div class="bg-[#ffffff] rounded-[4rem] border border-[#ebebeb] border-solid p-[4rem]">
            <AppMiniGamePublicBetAmount
              ref="betAmountRef" v-model="betAmount" :disabled="gameStart || reqLoading"
              :currency="currentGlobalCurrencyMap.cur" @input="changeBetAmount"
            />
          </div>
        </PhBaseLabel>
        <div class="order-2 min-h-[59px]">
          <!-- 手动下注游戏开始 -->
          <div v-show="isManual" class="order-2 flex flex-col gap-[12rem]">
            <PhBaseLabel
              class="order-2 set-label-color" :label="t('获胜利润')"
              :right-text="currencyPrefix + profitMulRateTrans"
            >
              <PhBaseInput
                v-model="profitMulRate" readonly
                style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              >
                <template #right>
                  <PhBaseCurrencyIcon :currency-type="currentGlobalCurrencyMap.type" />
                </template>
              </PhBaseInput>
            </PhBaseLabel>
          </div>
          <!-- 自动投注 -->
          <div v-show="isAutoBet" class="order-2 grid gap-y-[12rem]">
            <PhBaseLabel class="order-2 set-label-color" :label="t('投注次数')">
              <AppMiniGamePublicBetTimes v-model.number="betTimes" />
            </PhBaseLabel>
            <PhBaseLabel class="order-2 set-label-color" :label="t('若赢')">
              <div class="bg-[#EBEBEB] rounded-[4rem] py-[2rem] pl-[2rem] pr-[40rem]">
                <AppMiniGamePublicAutoDouble v-model="incOnWin" :disabled="gameStart || reqLoading" />
              </div>
            </PhBaseLabel>
            <PhBaseLabel class="order-2 set-label-color" :label="t('若输')">
              <div class="bg-[#EBEBEB] rounded-[4rem] py-[2rem] pl-[2rem] pr-[40rem]">
                <AppMiniGamePublicAutoDouble v-model="incOnLoss" :disabled="gameStart || reqLoading" />
              </div>
            </PhBaseLabel>
            <PhBaseLabel
              class="order-2 set-label-color" :label="t('止盈')"
              :right-text="currencyPrefix + stopOnProfitMulRate"
            >
              <PhBaseInput
                v-model="stopOnProfit" :step="0.01" type="number" input-mode="decimal"
                :disabled="gameStart || reqLoading" :msg="stopOnProfitErrorMsg" @blur="changeStopProfit"
              >
                <template #right>
                  <PhBaseCurrencyIcon :currency-type="currentGlobalCurrencyMap.type" style="--tg-app-currency-icon-size:16px" />
                </template>
              </PhBaseInput>
            </PhBaseLabel>
            <PhBaseLabel class="order-2 set-label-color" :label="t('止损')" :right-text="currencyPrefix + stopOnLossMulRate">
              <PhBaseInput
                v-model="stopOnLoss" :step="0.01" type="number" input-mode="decimal"
                :disabled="gameStart || reqLoading" :msg="stopOnLossErrorMsg" @blur="changeStopLoss"
              >
                <template #right>
                  <PhBaseCurrencyIcon :currency-type="currentGlobalCurrencyMap.type" style="--tg-app-currency-icon-size:16px" />
                </template>
              </PhBaseInput>
            </PhBaseLabel>
          </div>
        </div>
        <AppMiniGamePublicBetButton
          v-if="isManual" :disabled="gameStart || reqLoading || amountError"
          :loading="reqLoading" class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.LIMBO"
          @bet-btn-click="startManualBet"
        >
          {{ t('投注') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet" :auto-start="gameStart"
          :disabled="isFinishingBetting || amountError" :loading="reqLoading || isFinishingBetting" is-auto
          class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.LIMBO" @bet-btn-click="startAutoBet"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div class="unselectable main-game px-[16rem] pb-[16rem] pt-[48rem] @[800px]:min-h-[630rem]">
        <!-- 游戏历史数据 -->
        <div class="absolute right-[16rem] top-[16rem] w-full flex justify-end overflow-hidden">
          <div class="relative flex">
            <TransitionGroup name="list">
              <PhBaseButton
                v-for="button in reversedButtons" :key="button.billId" class="button-number mr-[4rem]" :class="[button.iswill ? '' : 'button-lose']" round
                custom-padding @click="onOpenDialogBetRecord({ id: button.billId, game_name: GAMES_LIST_ENUM.LIMBO })"
              >
                {{ (button.id).toFixed(2) }}
              </PhBaseButton>
            </TransitionGroup>
          </div>
        </div>
        <!-- 游戏显示区 -->
        <div
          class="flex flex-1 items-center justify-center py-[32rem] text-center text-[4em] font-semibold @[800px]:text-[8em]"
        >
          <span
            class="text-color"
            :class="[isWill ? 'win-color' : 'red-color', result.limboNumber === 1.00 ? 'default-color' : '']"
            style="font-variant-numeric: tabular-nums;"
          >{{ `${result.limboNumber.toFixed(2)}` }}×</span>
        </div>
        <!-- 底部参数 -->
        <div class="theme-grey-bg grid grid-cols-2 items-center gap-[8rem] p-[16rem]">
          <PhBaseLabel :label="t('目标乘数')" class="set-label-color">
            <AppMiniGamePublicNumber
              :model-value="multiplier" :min="1.01" :max="1000000.00" :disabled="gameStart"
              @input="changeMultiplier" @blur="onBlurMultiplier"
            >
              <template #right>
                <IconUniMultiplier />
              </template>
            </AppMiniGamePublicNumber>
          </PhBaseLabel>
          <PhBaseLabel :label="t('获胜机率')" class="set-label-color">
            <AppMiniGamePublicNumber
              :model-value="winChance" :min="0.000099" :max="98.0000" :disabled="gameStart"
              @input="changeWinChance" @blur="onBlurWinChance"
            >
              <template #right>
                <IconUniPersent />
              </template>
            </AppMiniGamePublicNumber>
          </PhBaseLabel>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
  <PhBaseDialog v-if="selectedItem" v-model="showDetailDialog" :icon="IconUniRebate" :title="t('投注')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppDialogBetSlipCasino v-if="showDetailDialog" :casino-data="selectedItem.data" />
  </PhBaseDialog>
  <PhBaseDialog v-model="showLimboGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartLimboGameInfo />
  </PhBaseDialog>
  <PhBaseDialog v-model="showLimboHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartLimboHotKeys />
  </PhBaseDialog>
</template>

<style>
:root {
  --slider-height: 8rem;
  --lines-asset: url(/ph-h5/svg/lines.svg);
  --radius-base: 4rem;
  --spacingEm-1-5: 1.5em;
  --grey-400: #2f4553;
  --shadows-md: 0 4px 6px -1px rgba(27, 23, 23, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.12);
  --dice-scale-transition: 500ms;
  --drag-size: 36rem;
  --max-game-board-width: 730rem;
  --blue-400: #4391e7;
  --green-500: #00e701;
  --green-600: #00b801;
  --red-500: #e9113c;
  --grey-200: #b1bad3;
  --tg-primary-active: #f23038;
  --tg-dot-state-bg: #f88d22;
  --dice-slide-transition: 300ms;
  --dice-result-transition: 100ms;
}
</style>

<style lang='scss' scoped>
.theme-result-btn-color-default {
  color: #fff;
  background-color: #2f4553;

  &:hover {
    background-color: var(--tg-text-grey);
  }
}

.theme-result-btn-color-will {
  color: var(--tg-text-dark);
  background-color: #00e701;

  &:hover {
    background-color: var(--tg-primary-success);
  }
}
.theme-grey-bg {
  background: #f6f7f8;
}
.main-game {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.button-lose {
  background-color: #6d7693;
}
.button-win {
  background-color: #f23038;
}
.win-color {
  color: #f23038;
}

.text-color.red-color {
  color: var(--tg-dot-state-bg);
}
.text-color.default-color {
  color: #0d2245;
}

.unselectable {
  -webkit-user-select: none;
  /* Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE 10+ */
  user-select: none;
  /* Standard syntax */
}

.button-number {
  width: 59rem;
  height: 31rem;
  font-size: 12rem;
  border-radius: 20rem;
}

.animate-enter,
.animate-leave-to {
  animation: slideInLeft 0.5s forwards;
}

.animate-leave,
.animate-enter-to {
  animation: slideOutLeft 0.5s forwards;
}

.green {
  color: var(--green-500);
}

.red {
  color: var(--red-500);
}

.white {
  color: #fff;
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

.list-move,
/* 对移动中的元素应用的过渡 */
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
.set-gap {
  --tabs-item-gap: 0;
}
.set-label-color {
  --ph-base-label-color: #6d7693;
}
</style>

<script setup lang='ts'>
import { ApiBettingGameOriginalDice } from '@tg/apis'
import { PhBaseButton, PhBaseCurrencyIcon, PhBaseDialog, PhBaseInput, PhBaseLabel, PhBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniGameInfo, IconUniKeyboard, IconUniMultiplier, IconUniPersent, IconUniRefresh } from '@tg/icons'
import IconUniRebate from '@tg/icons/components/IconUniRebate.vue'
import { useAppStore, useCurrency } from '@tg/stores'
import { application, formatWithSubstring, mul, scrollToTop, toFixed } from '@tg/utils'
import { useDocumentVisibility } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import { storeToRefs } from 'pinia'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppDialogBetSlipCasino from '~/components/AppDialogBetSlipCasino.vue'
import { Message } from '~/utils'
import {
  AppMiniGamePartDiceGameInfo,
  AppMiniGamePartDiceHotKeys,
  AppMiniGamePublicAutoDouble,
  AppMiniGamePublicBetAmount,
  AppMiniGamePublicBetButton,
  AppMiniGamePublicBetTimes,
  AppMiniGamePublicLayout,
  AppMiniGamePublicNumber,
} from '../_components'
import {
  useMiniGameAutoBetNotifications,
  useMiniGameLockCurrency,
  useMiniGamePublicPlayMp3,
} from '../composables'

defineOptions({
  name: 'AppMiniGameMainDice',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const { push } = useRouter()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/bet.mp3')
const { play: playRollingAudio } = useMiniGamePublicPlayMp3('/audio/rolling.mp3')
const { play: playTickAudio } = useMiniGamePublicPlayMp3('/audio/tick.mp3')
const { play: playWinAudio } = useMiniGamePublicPlayMp3('/audio/win.mp3')
const selectedItem = ref()
const showDetailDialog = ref(false)
const showDiceGameInfoDialog = ref(false)
const showDiceHotKeysDialog = ref(false)
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const globalCurrencyCode = computed(() => currentGlobalCurrencyMap.value.cur)
const {
  rate,
  orderCurrencyCode,
} = useMiniGameLockCurrency(globalCurrencyCode.value)
const { autoBetStartNotify, autoBetStopNotify, autoBetEndNotify, autoBetNetworkNotify } = useMiniGameAutoBetNotifications()
const visibility = useDocumentVisibility()
const isOpenNotify = ref(false)
const isHideDise = ref(true)
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 金额小数位数、投注额汇率换算前缀、 最小投注额、最大投注额 */
const decimalNum = computed(() => currentGlobalCurrencyMap.value.decimal)
const currencyPrefix = computed(() => currentGlobalCurrencyMap.value.prefix)
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
  { label: t('手动投注'), value: 'manual' },
  { label: t('自动投注'), value: 'auto' },
]
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.DICE,
})
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
const autoBetBtnText = computed(() => isAutoStart.value ? t('停止自动投注') : (isFinishingBetting.value ? t('正在完成投注') : t('开始自动投注')))
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
  if (condition.value === 'above') {
    if (_rollValue < randomNumber.value)
      return true
    else return false
  }
  else if (condition.value === 'below') {
    if (_rollValue > randomNumber.value)
      return true
    else return false
  }
  else { return false }
})

// 打开游戏规则弹窗
function openMiniGameInfoDialog() {
  showDiceGameInfoDialog.value = true
}

function openMiniGameHotKeysDialog() {
  showDiceHotKeysDialog.value = true
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
  isManualStart.value = true
  isHideDise.value = false
  clearTimeout(distTimeoutID)
  scrollToTop()
  runAsyncBetDice({
    point: rollValue.value,
    amount: betAmount.value,
    currency_id: orderCurrencyCode.value,
    condition: condition.value,
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
    addButton(randomNumber.value, data.id)
    currencyStore.initCurrencyList()
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

  else { push('/register') }
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
        addButton(randomNumber.value, data.id)
        updateWalletProfit(+betAmount.value, +data.payout)
        autoBetControl(isWin.value)
        currencyStore.initCurrencyList()
      }).catch(() => {
        autoBetNetworkNotify()
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
  if (type === 'multiplier') { // 更新乘数数据
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
  scrollToTop()
}
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled"
    :game="GAMES_LIST_ENUM.DICE" :game-type="GAMES_LIST_ENUM.DICE"
    :game-data="gameData"
    @open-game-info="openMiniGameInfoDialog" @open-hot-keys="openMiniGameHotKeysDialog"
  >
    <template #left>
      <div class="unselectable grid w-full gap-y-[12rem]">
        <PhBaseTabs
          v-model="tab" :disabled="gameStart || reqLoading" :disable-click="gameStart" :type="6"
          class="order-last @[800px]:order-1 set-gap" :list="tabList" full @change="tabChange"
        />
        <PhBaseLabel class="order-1 set-label-color" :label="t('投注额')" :right-text="currencyPrefix + betAmountMulRate">
          <div class="bg-[#ffffff] rounded-[4rem] border border-[#ebebeb] border-solid p-[4rem]">
            <AppMiniGamePublicBetAmount
              ref="betAmountRef" v-model="betAmount" :disabled="gameStart || reqLoading"
              :currency="globalCurrencyCode" @input="changeBetAmount"
            />
          </div>
        </PhBaseLabel>
        <div class="flex-col-12 order-2 min-h-[59px] flex flex-col">
          <!-- 手动下注游戏开始 -->
          <div v-show="isManual" class="flex-col-12 order-2 flex flex-col">
            <PhBaseLabel class="order-2 set-label-color" :label="t('获胜利润')" :right-text="currencyPrefix + profitMulRateTrans">
              <PhBaseInput
                v-model="profitMulRate" readonly
                style="--tg-base-input-style-pad-x:7px;--tg-base-input-style-pad-y:7px;--tg-base-input-line-height:1.5;"
              >
                <template #right>
                  <PhBaseCurrencyIcon
                    :currency-type="currentGlobalCurrencyMap.type"
                    style="--tg-app-currency-icon-size:16rem"
                  />
                </template>
              </PhBaseInput>
            </PhBaseLabel>
          </div>
          <!-- 自动投注 -->
          <div v-show="isAutoBet" class="order-2 flex flex-col gap-[12rem]">
            <PhBaseLabel class="order-2 set-label-color" :label="t('投注次数')">
              <AppMiniGamePublicBetTimes v-model.number="betTimes" />
            </PhBaseLabel>
            <PhBaseLabel class=" order-2 set-label-color" :label="t('若赢')">
              <div class="bg-[#EBEBEB] rounded-[4rem] py-[2rem] pl-[2rem] pr-[40rem]">
                <AppMiniGamePublicAutoDouble v-model="incOnWin" :disabled="gameStart || reqLoading" />
              </div>
            </PhBaseLabel>
            <PhBaseLabel class=" order-2 set-label-color" :label="t('若输')">
              <div class="bg-[#EBEBEB] rounded-[4rem] py-[2rem] pl-[2rem] pr-[40rem]">
                <AppMiniGamePublicAutoDouble v-model="incOnLoss" :disabled="gameStart || reqLoading" />
              </div>
            </PhBaseLabel>
            <PhBaseLabel class=" order-2 set-label-color" :label="t('止盈')" :right-text="currencyPrefix + stopOnProfitMulRate">
              <PhBaseInput
                v-model="stopOnProfit" :step="0.01" type="number" input-mode="decimal"
                :disabled="gameStart || reqLoading" :msg="stopOnProfitErrorMsg" @blur="changeStopProfit"
              >
                <template #right>
                  <PhBaseCurrencyIcon
                    :currency-type="currentGlobalCurrencyMap.type"
                    style="--tg-app-currency-icon-size:16rem"
                  />
                </template>
              </PhBaseInput>
            </PhBaseLabel>
            <PhBaseLabel class=" order-2 set-label-color" :label="t('止损')" :right-text="currencyPrefix + stopOnLossMulRate">
              <PhBaseInput
                v-model="stopOnLoss" :step="0.01" type="number" input-mode="decimal"
                :disabled="gameStart || reqLoading" :msg="stopOnLossErrorMsg" @blur="changeStopLoss"
              >
                <template #right>
                  <PhBaseCurrencyIcon
                    :currency-type="currentGlobalCurrencyMap.type"
                    style="--tg-app-currency-icon-size:16rem"
                  />
                </template>
              </PhBaseInput>
            </PhBaseLabel>
          </div>
        </div>

        <AppMiniGamePublicBetButton
          v-if="isManual" :disabled="gameStart || reqLoading || amountError"
          :loading="gameStart || reqLoading" class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.DICE"
          @bet-btn-click="startManualBet"
        >
          {{ t('投注') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet" :auto-start="gameStart"
          :disabled="isFinishingBetting || amountError" :loading="gameStart || reqLoading || isFinishingBetting" is-auto
          class="order-1 @[800px]:order-2" :game="GAMES_LIST_ENUM.DICE" @bet-btn-click="startAutoBet"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div class="unselectable main-game px-[16rem] pb-[16rem] pt-[48rem] @[800px]:min-h-[630rem]">
        <!-- 游戏历史数据 -->
        <div class=" absolute right-[16rem] top-[16rem] flex justify-end overflow-hidden ">
          <div class="relative flex">
            <TransitionGroup name="list">
              <PhBaseButton
                v-for="button in reversedButtons" :key="button.billId" class="button-number mr-[4rem]" :class="[button.iswill ? '' : 'button-lose']" round
                custom-padding @click="onOpenDialogBetRecord({ id: button.billId, game_name: GAMES_LIST_ENUM.DICE })"
              >
                {{ (button.id).toFixed(2) }}
              </PhBaseButton>
            </TransitionGroup>
          </div>
        </div>
        <!-- 游戏显示区 -->
        <div class="content svelte">
          <div
            class="svelte wrap" :data-test-dice-condition="[roll ? 'above' : 'below']"
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
                <div
                  class="svelte hide-show"
                  :class="[isWill ? 'positive' : 'negative', isHideDise ? 'is-hidden' : '']"
                >
                  <img class="svelte dice" src="/ph-h5/svg/classic-dice.svg" alt="Dice">
                  <div class="svelte result" :class="[isWill ? 'positive' : 'negative']">
                    {{ randomNumber.toFixed(2) }}
                  </div>
                </div>
              </div>
              <div class="svelte range">
                <div :class="[roll ? 'lower above svelte' : 'lower below svelte']" />
                <div
                  :class="[roll ? 'higher above svelte' : 'higher below svelte']"
                  :style="{ width: `${rollValue}%` }"
                />
              </div>
              <input
                min="2.00" step="1.00" max="98.00" :value="rollValue" type="range" class="svelte classic-slider"
                data-test="dice-slider" @input="changeRollValue"
              >
            </div>
          </div>
        </div>
        <!-- 底部参数 -->
        <div class="theme-grey-bg grid grid-cols-3 items-center rounded-[4rem] gap-[8rem] p-[16rem]">
          <PhBaseLabel :label="t('乘数')" class="set-label-color">
            <AppMiniGamePublicNumber
              :model-value="multiplier" :min="1.0102" :max="9900" :disabled="gameStart"
              :currency="globalCurrencyCode" @input="changeMultiplier" @blur="onBlurMultiplier"
            >
              <template #right>
                <IconUniMultiplier />
              </template>
            </AppMiniGamePublicNumber>
          </PhBaseLabel>
          <PhBaseLabel :label="roll ? t('掷大于') : t('掷小于')" class="set-label-color" @click="changeRollOver">
            <div class="base-input">
              <div class="input-wrap">
                <div class="readonly input-box">
                  <input
                    min="2" step="0.01" max="98" type="number" :value="rollValue" inputmode="decimal" readonly
                    class="readonly p-r-0" autocomplete="new-number"
                  >
                  <div class="right-icon">
                    <IconUniRefresh class="text-[16rem]" />
                  </div>
                </div>
              </div>
            </div>
          </PhBaseLabel>
          <PhBaseLabel :label="t('获胜机率')" class="set-label-color">
            <AppMiniGamePublicNumber
              :disabled="gameStart" :min="0.01" :max="98.0000" :model-value="winChance"
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
  <PhBaseDialog v-model="showDiceGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')" :show-close="true" :show-close-icon="true">
    <AppMiniGamePartDiceGameInfo />
  </PhBaseDialog>
  <PhBaseDialog v-model="showDiceHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')" :show-close="true" :show-close-icon="true">
    <AppMiniGamePartDiceHotKeys />
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
  --green-500: #00e700;
  --green-600: #00b801;
  --red-500: #e9103d;
  --grey-200: #b1bad3;
  --dice-slide-transition: 300ms;
  --dice-result-transition: 100ms;
}
</style>

<style lang='scss' scoped>
.theme-grey-bg {
  background: #f6f7f8;
}
.flex-col-12 {
  > *:not(:first-child) {
    margin-top: 12rem;
  }
}

.main-game {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.unselectable {
  -webkit-user-select: none;
  /* Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE 10+ */
  user-select: none;
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
.button-win {
  background-color: #f23038;
}
.default-btn {
  color: #fff;
}
.set-label-color {
  --ph-base-label-color: #6d7693;
}
// 白色高亮样式
.secondary-white {
  background-color: #ffaa09;
  color: #111111;
}

.base-input {
  width: 100%;
  font-size: 14rem;

  label {
    color: #b1bad3;
    font-weight: 500;

    span {
      color: #ed4163;
    }
  }

  .msg {
    font-size: 18rem;
    display: flex;
    align-items: center;
    padding-top: 8rem;
    padding-bottom: 4rem;
    color: #f2708a;

    .error-icon {
      font-size: 12rem;
    }

    span {
      font-size: 12rem;
      color: #f2708a;
      margin-left: 4rem;
    }
  }

  .vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    label {
      margin-bottom: 4rem;
    }
  }

  .horizontal {
    display: flex;
    align-items: center;

    label {
      width: 100rem;
      margin-right: 10rem;
    }
  }

  .input-wrap {
    width: 100%;
    position: relative;
    display: flex;
    // align-items: center;
    box-shadow: var(--tg-box-shadow);
    border-radius: 4rem;
    overflow: hidden;

    .right {
      cursor: pointer;
    }

    .right-button {
      padding: 13rem 16rem;
      cursor: pointer;
      display: flex;
      border-left: none;
      border-right: none;
      white-space: nowrap;
      line-height: 1;
      color: #fff;
      font-weight: 500;
      font-size: 14rem;
      background-color: #2f4553;
      transition: all ease 0.25s;
      min-width: auto;
      max-width: auto;
      align-items: center;
      justify-content: center;

      &:active {
        .content {
          transform: scale(0.96);
        }
      }

      &:hover:not(:active) {
        background-color: #557086;
      }
    }
  }

  .mb0 {
    margin-bottom: 0;
  }

  .input-box {
    width: 100%;
    border-radius: 4rem;
    background: #ffffff;
    border: 1px solid #ebebeb;
    position: relative;
    transition: all ease 0.25s;
    display: flex;
    align-items: center;

    &:hover:not(.error) {
      border-color: #557086;
    }

    &.readonly {
      background-color: #ffffff;
    }

    input {
      line-height: 1.5;
      width: 100%;
      background-color: transparent;
      color: #0d2245;
      border: none;
      outline: none;
      padding: 8rem 10rem;
      padding-left: 8rem;
      font-weight: 500;
      cursor: text;

      &::placeholder {
        color: #0d2245;
        opacity: 0.3;
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
      font-size: 18rem;
      cursor: pointer;
      display: flex;
      padding: 10rem 16rem;
    }

    .left-icon {
      padding: 8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .right-icon {
      padding: 8rem 8rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .radio-r-o {
    border-radius: 4rem 0 0 4rem;
  }

  .active {
    border-color: #557086;
  }

  .error {
    border-color: #ed4163;
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
  font-size: 16rem;
  width: 100%;
  padding-bottom: 16rem;
}

.content.svelte-jyarsh::after {
  content: '';
  bottom: 0;
  position: absolute;
  transform: translate(-50%);
  width: 0;
  height: 0;
  border-left: 6rem solid transparent;
  border-right: 6rem solid transparent;
  border-bottom: 6rem solid #c3d5e8;
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
  font-size: 16rem;
}

.svelte.wrap {
  position: relative;
  width: 100%;
  max-width: 730rem;
  border-radius: 100rem;
  padding: 24rem;
  background: #c3d5e8;
  text-align: left;
  margin: 64rem 0;
}

.svelte.translate {
  position: relative;
  height: 8rem;
}

.wrap.svelte-jyarsh {
  position: absolute;
  bottom: calc(100% - 1rem);
  left: calc(1.5em + 4rem);
  right: calc(1.5em + 4rem);
}

.content.svelte-jyarsh {
  color: #0d2245;
  position: absolute;
  text-align: center;
  transform: translate(-50%);
}

.value.svelte-jyarsh {
  position: absolute;
  font-weight: 500;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
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
  text-shadow: 0 1rem 0 #fff;
  font-weight: 500;
  transition: var(--dice-result-transition);
}

.result.neutral.svelte {
  color: var(--grey-200);
}

.result.positive.svelte {
  color: var(--green-600);
}

.result.negative.svelte {
  color: var(--red-500);
}

.classic-slider.svelte {
  appearance: none;
  width: 100%;
  position: absolute;
  z-index: 10;
  background: #0000;
  top: 0;
  left: 0;
  height: 16rem;
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
  height: 8rem;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border-radius: 100px;
  box-shadow: 0 0 0 10px #9dadbf;
  transition: opacity 0.3s;
  overflow: hidden;
}

.lower.svelte {
  position: absolute;
  height: 8rem;
  width: 100%;
  right: 0;
  top: 0;
  border-radius: 100px;
}

.lower.above.svelte {
  background: var(--green-500);
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
}

.higher.below.svelte {
  background: var(--green-500);
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
</style>

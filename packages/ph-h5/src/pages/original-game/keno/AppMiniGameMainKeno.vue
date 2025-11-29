<script setup lang='ts'>
import type { OriginalGameKenoTile } from '@tg/types'
import { ApiGameOriginalKenoBet } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseDialog, PhBaseInput, PhBaseLabel, PhBaseSelect, PhBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniGameInfo, IconUniKeyboard } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { KeyboardKeyEnum } from '@tg/types'
import { formatWithSubstring, getCurrencyConfig, mul, scientificToString, scrollToTop, toFixed } from '@tg/utils'
import { useDocumentVisibility, useElementSize } from '@vueuse/core'
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
  useMiniGameKenoData,
  useMiniGameLockCurrency,
  useMiniGamePublicPlayMp3,
} from '../composables'
import AppMiniGamePartKenoTile from './AppMiniGamePartKenoTile.vue'

defineOptions({
  name: 'AppMiniGameMainKeno',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const { push } = useRouter()
const showGameInfoDialog = ref(false)
const showHotKeysDialog = ref(false)
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
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
const globalCurrencyCode = computed(() => currentGlobalCurrencyMap.value.cur)
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
  { label: t('手动投注'), value: 'manual' },
  { label: t('自动投注'), value: 'auto' },
]
// 风险
const riskOptions = [
  { label: t('典型'), value: 'classic' },
  { label: t('低等'), value: 'low' },
  { label: t('中等'), value: 'medium' },
  { label: t('高等'), value: 'high' },
]
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.KENO,
})
/** 订单币种 */
const orderCurrencyType = computed(() => getCurrencyConfig(orderCurrencyCode.value).name)
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
const autoBetBtnText = computed(() => isAutoStart.value ? t('停止自动投注') : isTileStatusRendering.value ? t('正在完成投注') : t('开始自动投注'))
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
    currencyStore.deductCurrentGlobalCurrencyBalance(+betAmount.value)
    // 奖金倍数
    payoutMultiplier.value = res.payout_multiplier
    // 结算金额
    payOutAmount.value = +res.payout > 0 ? res.payout : ''
    payCurrencyType.value = getCurrencyConfig(res.currency).name
    // 输赢金额（盈利 - 本金）
    settleAmount.value = res.settle_amount

    // 渲染开奖结果
    drawnNumbers(res.state.drawn_numbers).then(() => {
      currencyStore.initCurrencyList()
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

/** 点击下注按钮 */
function onBetClick() {
  scrollToTop()
  if (!isLogin.value)
    return push('/register')
  if (userInfo.value?.exclude === 1) {
    Message.error(t('请先解除自我排除'))
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
        return '#373737'
        // return '#F2CA5C'

      return '#1a2c38'
    }
  }
  return ''
}
function tabChange() {
  scrollToTop()
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
    v-model:animate-enabled="animateEnabled"
    :game="GAMES_LIST_ENUM.KENO" :game-type="GAMES_LIST_ENUM.KENO"
    :game-data="gameData"
    @open-game-info="showGameInfoDialog = true" @open-hot-keys="showHotKeysDialog = true"
  >
    <template #left>
      <div class="grid w-full gap-y-[12rem]">
        <PhBaseTabs
          v-model="tab" :disable-click="gameStart || isTileStatusRendering" :type="6" full
          :disabled="gameStart || isTileStatusRendering" class="order-last @[800px]:order-1" :list="tabList"
          @change="resetGame"
        />
        <PhBaseLabel class="order-first set-label-color" :label="t('投注额')" :right-text="currencyPrefix + betAmountMulRate" style="--ph-base-label-margin-bottom: 2rem;">
          <div class="bg-[#ffffff] rounded-[4rem] border border-[#ebebeb] border-solid p-[4rem]">
            <AppMiniGamePublicBetAmount
              ref="betAmountRef"
              v-model="betAmount" style="--ph-base-button-border-radius:4rem" :currency="orderCurrencyCode"
              :disabled="gameStart || isTileStatusRendering"
            />
          </div>
        </PhBaseLabel>
        <PhBaseLabel class="order-2 set-label-color" :label="t('风险')" style="--ph-base-label-margin-bottom: 2rem;--ph-base-select-background-color:#fff;">
          <PhBaseSelect
            v-model="risk" class="theme-select" :options="riskOptions"
            :disabled="gameStart || isTileStatusRendering"
            @change="resetGame"
          />
        </PhBaseLabel>
        <!-- 自动投注 -->
        <div v-show="isAutoBet" class="order-2 grid gap-y-[12rem]">
          <PhBaseLabel class="order-2 set-label-color" :label="t('投注次数')" style="--ph-base-label-margin-bottom: 2rem;">
            <AppMiniGamePublicBetTimes v-model.number="betTimes" :disabled="isAutoStart" />
          </PhBaseLabel>
          <PhBaseLabel class="order-2 set-label-color" :label="t('若赢')" style="--ph-base-label-margin-bottom: 2rem;">
            <AppMiniGamePublicAutoDouble v-model="percentIfWin" :disabled="isAutoStart" />
          </PhBaseLabel>
          <PhBaseLabel class="order-2 set-label-color" :label="t('若输')" style="--ph-base-label-margin-bottom: 2rem;">
            <AppMiniGamePublicAutoDouble v-model="percentIfLose" :disabled="isAutoStart" />
          </PhBaseLabel>
          <PhBaseLabel
            class="order-2 set-label-color" :label="t('止盈')"
            :right-text="currencyPrefix + stopIfWinAmountMulRate"
            style="--ph-base-label-margin-bottom: 2rem;"
          >
            <PhBaseInput
              v-model="stopIfWinAmount" class="theme-input" type="number" input-mode="decimal"
              :disabled="isAutoStart"
              @blur="onStopIfWinAmountBlur"
            >
              <template #right>
                <PhBaseCurrencyIcon :currency-type="orderCurrencyType" />
              </template>
            </PhBaseInput>
          </PhBaseLabel>
          <PhBaseLabel
            class="order-2 set-label-color" :label="t('止损')"
            :right-text="currencyPrefix + stopIfLoseAmountMulRate"
            style="--ph-base-label-margin-bottom: 2rem;"
          >
            <PhBaseInput
              v-model="stopIfLoseAmount" class="theme-input" type="number" input-mode="decimal"
              :disabled="isAutoStart"
              @blur="onStopIfLoseAmount"
            >
              <template #right>
                <PhBaseCurrencyIcon :currency-type="orderCurrencyType" />
              </template>
            </PhBaseInput>
          </PhBaseLabel>
        </div>

        <PhBaseButton
          v-if="isManual" class="theme-btn order-2 hidden h-[40rem] @[800px]:block"
          :disabled="isManualStart || isTileStatusRendering" @click="randomChoose"
        >
          {{ t('自动挑选') }}
        </PhBaseButton>
        <PhBaseButton
          v-if="isManual" class="theme-btn order-2 hidden h-[40rem] @[800px]:block"
          :disabled="isManualStart || isTileStatusRendering" @click="cleanTable"
        >
          {{ t('清空桌面') }}
        </PhBaseButton>

        <AppMiniGamePublicBetButton
          v-if="isManual"
          :disabled="isManualStart || isTileStatusRendering || chosenNumberCount === 0"
          class="order-0 @[800px]:order-2" :loading="betLoading" :game="GAMES_LIST_ENUM.KENO"
          @bet-btn-click="onBetClick"
        >
          {{ t('投注') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet"
          :disabled="(isTileStatusRendering && !isAutoStart) || chosenNumberCount === 0" is-auto
          class="order-first @[800px]:order-2" :auto-start="isAutoStart" :game="GAMES_LIST_ENUM.KENO"
          @bet-btn-click="onStartAutoBetClick"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div
        ref="gameBoardRightRef" class="theme-bg h-full flex flex-col items-center justify-between p-[16rem]"
        :style="{ 'fontSize': `${gameBoardRightFontSize}em`, '--duration': animateEnabled ? '300ms' : '0' }"
      >
        <!-- 方块 -->
        <div class="relative grid grid-cols-8 mx-auto max-w-[780rem] w-full gap-[0.75em]">
          <!-- 预加载 -->
          <object class="absolute z-[-10] h-0 w-0" type="image/svg+xml" data="/ph-h5/svg/keno_gem_animate.svg" />
          <AppMiniGamePartKenoTile
            v-for="tile in tilesList" :key="tile.num"
            :disabled="isTileStatusRendering || gameStart" :animate-enabled="animateEnabled" :data="tile"
            @click="onKenoTileClick(tile)"
          />
          <!-- 奖金 -->
          <div
            v-if="payOutAmount && !isTileStatusRendering"
            :class="[+settleAmount > 0 ? 'theme-settle-amount-active' : 'theme-settle-amount-default']"
            class="settleAmount-layer  max-w-[100%] min-w-[150rem] border-[3rem] rounded-[8rem] border-solid text-center text-[14rem] font-extrabold"
          >
            <div
              class="w-full flex flex-col items-center px-[1em] py-[0.75em] text-center"
              :class="[+settleAmount > 0 ? 'theme-settle-amount-active' : 'theme-settle-amount-default']"
            >
              <span class="text-[2em] font-bold leading-[1.5]" style="font-family: proxima-nova,sans-serif;">
                {{ payoutMultiplierFixed }}×
              </span>
              <div class="tg-just-a-line mb-[8rem] mt-[4rem] h-[3rem] w-[30%]" />
              <PhBaseAmount
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
              class="bg-tg-secondary flex items-center justify-center rounded-[4rem] shadow-tg-header-shadow"
            >
              <span class="text-tg-text-white whitespace-nowrap text-[1em] font-semibold leading-[1.5] tabular-nums">
                {{ formatWithSubstring(item.odd) }}×
              </span>
            </div>
          </div>
          <!-- hit odds -->
          <div
            class="bg-tg-secondary footer-bottom relative grid w-full gap-[1em] rounded-[4rem] px-[4rem] shadow-tg-header-shadow"
            style="grid-template-columns: repeat(var(--keno-choose-count), 1fr);"
          >
            <!-- 悬浮窗 -->
            <div
              v-if="showHitOddsTable"
              class="theme-hit-odds absolute grid grid-cols-3 w-full gap-[16rem] rounded-[4rem] p-[16rem]"
              style="bottom:calc(100% + 16px)"
            >
              <PhBaseLabel :label="t('支付额')" style="--ph-base-label-margin-bottom: 2rem;">
                <PhBaseInput
                  readonly style="--tg-base-input-height:39px;--tg-base-input-style-placeholder-opacity:1;"
                  :placeholder="hitOddsTablePayAmount"
                />
              </PhBaseLabel>

              <PhBaseLabel :label="t('获胜利润')" :right-text="hitOddsTableWinAmountMulRate" style="--ph-base-label-margin-bottom: 2rem;">
                <PhBaseInput
                  readonly style="--tg-base-input-height:39px;--tg-base-input-style-placeholder-opacity:1;"
                  :placeholder="hitOddsTableWinAmount"
                >
                  <template #right>
                    <div class="flex items-center">
                      <PhBaseCurrencyIcon style="--tg-app-currency-icon-size:16px" :currency-type="orderCurrencyType" />
                    </div>
                  </template>
                </PhBaseInput>
              </PhBaseLabel>
              <PhBaseLabel :label="t('胜算')" style="--ph-base-label-margin-bottom: 2rem;">
                <PhBaseInput
                  readonly style="--tg-base-input-height:39px;--tg-base-input-style-placeholder-opacity:1;"
                  :placeholder="hitOddsTableWinChance"
                />
              </PhBaseLabel>
            </div>
            <!-- 未选择任何号码 -->
            <div
              v-if="winChanceAndOddsListToShow.length === 0"
              class="flex grow items-center justify-center text-[12rem] font-semibold text-[#d5dceb]"
            >
              {{ t('请选择数字以开始游戏') }}
            </div>
            <div
              v-for="item, i in winChanceAndOddsListToShow" v-else :key="item.winChance + i"
              class="bottom-box flex cursor-help items-center justify-center leading-[1]"
              :style="{ backgroundColor: getHitOddsBgColor(item, i) }" @mouseenter="onHitOddsMouseEnter(item)"
              @mouseleave="onHitOddsMouseLeave"
            >
              <span class="whitespace-nowrap text-[1em] font-semibold leading-[16rem] tabular-nums">
                {{ i }}×
              </span>
              <img
                :class="gameSettled && gemCount === i ? '' : 'grayscale'" class="h-[1.2em] w-[1.2em] pl-[4rem]"
                src="/ph-h5/svg/keno_gem.svg" alt=""
              >
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
  <PhBaseDialog v-model="showGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesGameInfo :game-type="GAMES_LIST_ENUM.KENO" />
  </PhBaseDialog>
  <PhBaseDialog v-model="showHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesHotKeys :game-type="GAMES_LIST_ENUM.KENO" />
  </PhBaseDialog>
</template>

<style lang='scss' scoped>
.theme-hit-odds {
  background-color: #373737;
}
.settleAmount-layer {
  position: absolute;
  top: 50%;
  left: 50%;
  animation: settleAmount-layer-fade-in var(--duration) ease forwards;
  background-color: #373737;
  border-color: #2ba471;
}

.theme-settle-amount-default {
  color: #c1c1c1;
}

.theme-settle-amount-active {
  color: #2ba471;
}

.tg-just-a-line {
  background-color: #454545;
}

.theme-bg {
  .bottom-box {
    color: #fff;
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
.footer-bottom,
.bg-tg-secondary {
  background: #6e7281;
  color: #fff;
}
.set-label-color {
  --ph-base-label-color: #6d7693;
}
</style>

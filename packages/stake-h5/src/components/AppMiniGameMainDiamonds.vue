<script setup lang='ts'>
import { IconUniPersent } from '@tg/icons'
import { GAMES_LIST_ENUM } from 'feie-ui'
import type { IDiamondsPayoutConfigItem } from '~/composables/useMiniGameDiamondsData'

defineOptions({
  name: 'AppMiniGameMainDiamonds',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const { openRegisterDialog } = useRegisterDialog()
const { openMiniGameInfoInsertDialog } = useMiniGameInsertDialogMinesGameInfo({ gameType: GAMES_LIST_ENUM.DIAMONDS })
const { openMiniGameHotKeysInsertDialog } = useMiniGameInsertDialogHotKeys({ gameType: GAMES_LIST_ENUM.DIAMONDS })
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { isLiveBetting } = useMiniGameGlobalStateLiveBetting()
const appStore = useAppStore()
const { currentGlobalCurrency, isLogin } = storeToRefs(appStore)
const { isMobile } = storeToRefs(useWindowStore())
const {
  autoBetStartNotify,
  autoBetStopNotify,
  autoBetEndNotify,
  autoBetStopWinNotify,
  autoBetStopLoseNotify,
} = useMiniGameAutoBetNotifications()
const {
  payoutConfig,
  activeColor1,
  activeColor2,
  result,
  clearResult,
  activeRowIdAuto,
  activeRowIdManual,
} = useMiniGameDiamondsData()
const { play: playBetMusic } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playRevealedMusic } = useMiniGamePublicPlayMp3('/audio/diamonds.revealed.mp3')
const { play: playMatchMusic } = useMiniGamePublicPlayMp3('/audio/diamonds.match.mp3')
const { play: playWinMusic } = useMiniGamePublicPlayMp3('/audio/mines.win.mp3')
const gameBoardRightRef = ref()
const { width: rightWidth } = useElementSize(gameBoardRightRef, undefined, { box: 'border-box' })
const gameBoardRightMinHeight = computed(() => rightWidth.value > 500 ? Math.ceil((rightWidth.value / 900) * 630) : 280)
const visibility = useDocumentVisibility()
const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')

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
/** 正在渲染开奖结果 */
const { bool: renderingResult, setTrue: setResultrendering, setFalse: setResultRenderFinish } = useBoolean(false)
/** 展示利润 */
const { bool: isShowProfit } = useBoolean(false)
/** 是否有开奖结果 */
const { bool: isHasResult } = useBoolean(false)
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

/** 订单币种 */
const orderCurrencyType = computed(() => getCurrencyConfigByCode(orderCurrencyCode.value).name)
/** 投注金额 */
const betAmount = ref(toFixedByLockCurrency('0', orderCurrencyType.value))
/** 开始自动投注时的基础金额 */
const _betAmountBaseOnAuto = ref('')
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

const rebetTimer: any = null
let switchTimer: any = null
let renderNumbersTimer: any = null

const isAutoBet = computed(() => tab.value === 'auto')
const isManual = computed(() => tab.value === 'manual')
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+betAmount.value, +rate.value))))
const stopIfWinAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfWinAmount.value, +rate.value))))
const stopIfLoseAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+stopIfLoseAmount.value, +rate.value))))
const currencyPrefix = computed(() => getLockCurrencyPrefix(orderCurrencyType.value))
const autoBetBtnText = computed(() => isAutoStart.value ? t('mini_stop_auto_bet') : isFinishingBetting.value ? t('mini_auto_bet_finish') : t('mini_start_auto_bet'))
const gameStart = computed(() => isManualStart.value || isAutoStart.value)
/** 当前需要高丽的行id */
const activeRowId = computed(() => {
  if (isShowProfit.value)
    return activeRowIdManual.value
  return activeRowIdAuto.value
})
const profit = computed(() => {
  const showPayoutMultiplier = payoutConfig.find(a => a.id === activeRowId.value)?.payoutMultiplier ?? 0
  if (showPayoutMultiplier < 1)
    return toFixedByLockCurrency('0', orderCurrencyType.value)
  return toFixedByLockCurrency(mul((+showPayoutMultiplier - 1), +betAmount.value), orderCurrencyType.value)
})

/** 初始状态 */
function resetGame() {
  tabChange()
}
/** 点击下注 */
const baseArr = ['orange', 'red', 'purple', 'yellow', 'cyan', 'green', 'blue']
function onBetClick() {
  playBetMusic()
  clearResult()
  setTimeout(() => {
    const arr: string[] = []
    for (let i = 0; i < 5; i++)
      arr.push(baseArr[Math.floor(Math.random() * 7)])

    drawnResults(arr)
  }, 600)
}
/** 点击自动下注 */
function onStartAutoBetClick() { }
/** 渲染开奖结果 */
function drawnResults(resultData: string[]) {
  return new Promise((resolve) => {
    if (renderNumbersTimer)
      clearRenderNumbersTimer()

    setResultrendering()
    // 未开启即时下注
    if (!isLiveBetting.value) {
      let count = 0
      renderNumbersTimer = setInterval(() => {
        if (count < 5) {
          if (result.value.find(a => a === resultData[count]))
            playMatchMusic()

          else
            playRevealedMusic()

          result.value[count] = resultData[count]
          count += 1
        }
        else {
          clearRenderNumbersTimer()
          resolve(true)
        }
      }, 300)
    }
    else {
      result.value = resultData
      setTimeout(() => {
        clearRenderNumbersTimer()
        resolve(true)
      }, 300)
    }
  })
}
function clearRenderNumbersTimer() {
  clearInterval(renderNumbersTimer)
  renderNumbersTimer = null
  setResultRenderFinish()
}

// 止盈金额失焦
function onStopIfWinAmountBlur() {
  stopIfWinAmount.value = toFixedByLockCurrency(stopIfWinAmount.value, orderCurrencyType.value)
}
// 止损金额失焦
function onStopIfLoseAmount() {
  stopIfLoseAmount.value = toFixedByLockCurrency(stopIfLoseAmount.value, orderCurrencyType.value)
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
/** 鼠标移入 */
const isMouseIn = ref(false)
function onPayoutRowMouseIn(item: IDiamondsPayoutConfigItem) {
  isShowProfit.value = true
  isMouseIn.value = true
  activeRowIdManual.value = item.id
}
/** 鼠标移出 */
function onPayoutRowMouseOut() {
  isMouseIn.value = false

  if (switchTimer) {
    clearTimeout(switchTimer)
    switchTimer = null
  }

  switchTimer = setTimeout(() => {
    if (!isMouseIn.value)
      isShowProfit.value = false

    clearTimeout(switchTimer)
    switchTimer = null
  }, 300)
}

function onKeySPACE() {
  // 下注
  if (isManual.value && !gameStart.value)
    onBetClick()

  else if (isAutoBet.value && !(renderingResult.value && !isAutoStart.value))
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
  }
})

onMounted(() => {
  onLoaded()
})
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled" use-font-size
    :game-type="GAMES_LIST_ENUM.DIAMONDS"
    @open-game-info="openMiniGameInfoInsertDialog" @open-hot-keys="openMiniGameHotKeysInsertDialog"
  >
    <template #left>
      <div class="flex-col-12 w-full flex flex-col">
        <BaseTab
          v-model="tab" :disable-click="gameStart" :disabled="gameStart" class="order-last @[800px]:order-1"
          :list="tabList" full style="--tg-tab-style-inner-padding-y:13px;--tg-tab-style-inner-padding-x:16px;"
          @change="resetGame"
        />
        <BaseLabel class="order-1" :label="t('bet_amount')" :right-text="currencyPrefix + betAmountMulRate">
          <AppMiniGamePublicBetAmount
            ref="betAmountRef" v-model="betAmount" :currency="orderCurrencyCode"
            :disabled="gameStart"
          />
        </BaseLabel>

        <!-- 自动投注 -->
        <div v-show="isAutoBet" class="flex-col-12 order-2 flex flex-col">
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
              v-model="stopIfWinAmount" type="number" input-mode="decimal" :disabled="isAutoStart"
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
              v-model="stopIfLoseAmount" type="number" input-mode="decimal" :disabled="isAutoStart"
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
          v-if="isManual" :disabled="isManualStart" class="order-1 @[800px]:order-2"
          :game="GAMES_LIST_ENUM.DIAMONDS" @bet-btn-click="onBetClick"
        >
          {{ t('mini_touzhu') }}
        </AppMiniGamePublicBetButton>
        <AppMiniGamePublicBetButton
          v-else-if="isAutoBet" :disabled="isFinishingBetting" is-auto
          class="order-first @[800px]:order-2" :auto-start="isAutoStart" :game="GAMES_LIST_ENUM.DIAMONDS"
          @bet-btn-click="onStartAutoBetClick"
        >
          {{ autoBetBtnText }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>

    <template #right>
      <div
        ref="gameBoardRightRef" class="flex-col-075em w-full flex grow flex-col p-[1em]"
        :style="{ minHeight: `${gameBoardRightMinHeight}px` }"
      >
        <div class="flex-col-4 w-full flex flex-col @[800px]:max-w-[40%]">
          <div
            v-for="row in payoutConfig" :key="row.id" class="flex items-center justify-between rounded-[4px] px-[12px]"
            :style="{ backgroundColor: activeRowId === row.id ? 'var(--app-mini-game-diamonds-list-bg-active)' : 'var(--app-mini-game-diamonds-list-bg)' }" @mouseenter="onPayoutRowMouseIn(row)"
            @mouseleave="onPayoutRowMouseOut"
          >
            <!-- icon -->
            <div class="flex-row-16 h-[32px] flex items-center">
              <div
                v-for="diamond, i in row.diamonds" :key="diamond + i" class="text-[12px] @[800px]:text-[1em]" :style="{
                  '--fill': diamond === 'match-1' ? row.id === activeRowId ? activeColor1 : 'var(--app-mini-game-diamonds-list-icon-full-fill)' : 'var(--app-mini-game-diamonds-list-icon-empty-fill)',
                  '--stroke': diamond === 'match-1' ? row.id === activeRowId ? activeColor1 : 'var(--app-mini-game-diamonds-list-icon-full-fill)' : diamond === 'match-2' ? row.id === activeRowId ? activeColor2 : 'var(--app-mini-game-diamonds-list-icon-full-fill)' : 'var(--app-mini-game-diamonds-list-icon-empty-fill)',
                }"
              >
                <svg
                  fill="currentColor" viewBox="0 0 96 96" class="svg-icon"
                  style="stroke-width: 10%;fill: var(--fill); stroke: var(--stroke);width: 1em;height: 1em;"
                >
                  <title />
                  <path
                    d="m94.856 33.295-18.26-21.98a11.646 11.646 0 0 0-7.477-4.103l-.057-.006-19.63-2.534a11.989 11.989 0 0 0-1.45-.087c-.512 0-1.013.03-1.51.092l.06-.005-19.537 2.534a11.75 11.75 0 0 0-7.541 4.09l-.014.02-18.26 21.98A4.936 4.936 0 0 0 0 36.501a4.93 4.93 0 0 0 1.185 3.215l-.006-.009L44.274 89.72a4.898 4.898 0 0 0 3.708 1.694 4.898 4.898 0 0 0 3.706-1.689l.005-.005 43.095-50.013A4.93 4.93 0 0 0 96 36.461a4.931 4.931 0 0 0-1.152-3.174l.005.008h.003Z"
                  />
                </svg>
              </div>
            </div>
            <!-- 倍数 -->
            <div class="h-[32px] flex items-center justify-center">
              <span class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]">
                {{ row.payoutMultiplier.toFixed(2) }}×
              </span>
              <div v-if="row.id === activeRowId && !isMobile" class="payout-table" :class="row.id">
                <BaseLabel :label="t('profit')">
                  <BaseInput
                    readonly style="--tg-base-input-height:39px;--tg-base-input-style-placeholder-opacity:1;"
                    :placeholder="profit"
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
                    :placeholder="row.winChance"
                  >
                    <template #right-icon>
                      <div class="text-[16px]">
                        <IconUniPersent />
                      </div>
                    </template>
                  </BaseInput>
                </BaseLabel>
              </div>
            </div>
          </div>
        </div>
        <AppMiniGamePartDiamondsGameResult :result="result" :animate-enabled="animateEnabled" />
      </div>
    </template>
  </AppMiniGamePublicLayout>
</template>

<style>
:root{
  --app-mini-game-diamonds-list-bg:var(--tg-primary-main);
  --app-mini-game-diamonds-list-bg-active:var(--tg-secondary-main);
  --app-mini-game-diamonds-list-icon-full-fill:#3f515f;
  --app-mini-game-diamonds-list-icon-empty-fill:#0e1d27;
}
[theme="green"] {
  --app-mini-game-diamonds-list-bg:#076237;
  --app-mini-game-diamonds-list-bg-active:#3CB389;
  --app-mini-game-diamonds-list-icon-full-fill:#76F0C5;
  --app-mini-game-diamonds-list-icon-empty-fill:#02432D;
}
</style>

<style lang='scss' scoped>
.payout-table {
  font-size: 1rem;
  position: absolute;
  padding: 12px;
  right: 1em;
  width: calc(60% - 2em);
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr 1fr;
  overflow: visible;
  box-shadow: var(--tg-box-shadow);
  background: var(--tg-primary-main);
  border-radius: 4px;

  &::after {
    content: "";
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 8px solid var(--tg-primary-main);
  }

  &.row-1 {
    transform: translateY(31%);
    &::after{
      top: 20%;
    }
  }

  &.row-7 {
    transform: translateY(calc(.5em - 40%));
    &::after{
      top: 80%;
    }
  }

}

.flex-col-4{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-4);
  }
}
.flex-col-12{
  > *:not(:first-child) {
    margin-top: var(--tg-spacing-12);
  }
}
.flex-col-075em{
  > *:not(:first-child) {
    margin-top: 0.75em;
  }
}

.flex-row-16{
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-16);
  }
}
</style>

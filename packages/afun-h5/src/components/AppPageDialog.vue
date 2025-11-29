<script setup lang='ts'>
import { BasePageDialog, BasePullRefresh } from '@tg/bccomponents'
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import CasinoGameDetailPage from '~/pages/games/index.vue' // 这个不要懒加载,影响体验

const OriginalGameBlackjackPage = defineAsyncComponent(() => import('~/pages/original-game/blackjack/index.vue'))
const OriginalGamePlinkoPage = defineAsyncComponent(() => import('~/pages/original-game/plinko/index.vue'))
const OriginalGameDicePage = defineAsyncComponent(() => import('~/pages/original-game/dice/index.vue'))
const OriginalGameKenoPage = defineAsyncComponent(() => import('~/pages/original-game/keno/index.vue'))
const OriginalGameLimboPage = defineAsyncComponent(() => import('~/pages/original-game/limbo/index.vue'))
const OriginalGameMinesPage = defineAsyncComponent(() => import('~/pages/original-game/mines/index.vue'))
const OriginalGameWheelPage = defineAsyncComponent(() => import('~/pages/original-game/wheel/index.vue'))
const OriginalGameHiloPage = defineAsyncComponent(() => import('~/pages/original-game/hilo/index.vue'))
const OriginalGameCrashPage = defineAsyncComponent(() => import('~/pages/original-game/crash/index.vue'))
const OriginalLotteryWinGoPage = defineAsyncComponent(() => import('~/pages/lottery/win-go/index.vue'))
const OriginalLotteryRacingPage = defineAsyncComponent(() => import('~/pages/lottery/racing/index.vue'))
const OriginalLotteryK3Page = defineAsyncComponent(() => import('~/pages/lottery/k3/index.vue'))
const OriginalLottery5DPage = defineAsyncComponent(() => import('~/pages/lottery/5d/index.vue'))
const OriginalLotteryTrxWinGoPage = defineAsyncComponent(() => import('~/pages/lottery/trx-win-go/index.vue'))

const route = useRoute()
const pageDialog = computed(() => route.query.page_dialog?.toString())
const showPageDialog = ref(false)
// 娱乐场游戏详情
const casinoGameDialog = computed(() => pageDialog.value === 'game-detail')
// 小游戏
const originalGameBlackjackDialog = computed(() => pageDialog.value === 'original-game-blackjack')
const originalGamePlinkoDialog = computed(() => pageDialog.value === 'original-game-plinko')
const originalGameDiceDialog = computed(() => pageDialog.value === 'original-game-dice')
const originalGameKenoDialog = computed(() => pageDialog.value === 'original-game-keno')
const originalGameLimboDialog = computed(() => pageDialog.value === 'original-game-limbo')
const originalGameMinesDialog = computed(() => pageDialog.value === 'original-game-mines')
const originalGameWheelDialog = computed(() => pageDialog.value === 'original-game-wheel')
const originalGameHiloDialog = computed(() => pageDialog.value === 'original-game-hilo')
const originalGameCrashDialog = computed(() => pageDialog.value === 'original-game-crash')
// 彩票
const originalLotteryWinGoDialog = computed(() => pageDialog.value === 'original-lottery-win-go')
const originalLotteryRacingDialog = computed(() => pageDialog.value === 'original-lottery-racing')
const originalLotteryK3Dialog = computed(() => pageDialog.value === 'original-lottery-k3')
const originalLottery5DDialog = computed(() => pageDialog.value === 'original-lottery-5d')
const originalLotteryTrxWinGoDialog = computed(() => pageDialog.value === 'original-lottery-trx-win-go')

const component = computed(() => {
  if (casinoGameDialog.value) {
    return CasinoGameDetailPage
  }
  if (originalGameBlackjackDialog.value) {
    return OriginalGameBlackjackPage
  }
  if (originalGamePlinkoDialog.value) {
    return OriginalGamePlinkoPage
  }
  if (originalGameDiceDialog.value) {
    return OriginalGameDicePage
  }
  if (originalGameKenoDialog.value) {
    return OriginalGameKenoPage
  }
  if (originalGameLimboDialog.value) {
    return OriginalGameLimboPage
  }
  if (originalGameMinesDialog.value) {
    return OriginalGameMinesPage
  }
  if (originalGameWheelDialog.value) {
    return OriginalGameWheelPage
  }
  if (originalGameHiloDialog.value) {
    return OriginalGameHiloPage
  }
  if (originalGameCrashDialog.value) {
    return OriginalGameCrashPage
  }
  if (originalLotteryWinGoDialog.value) {
    return OriginalLotteryWinGoPage
  }
  if (originalLotteryRacingDialog.value) {
    return OriginalLotteryRacingPage
  }
  if (originalLotteryK3Dialog.value) {
    return OriginalLotteryK3Page
  }
  if (originalLottery5DDialog.value) {
    return OriginalLottery5DPage
  }
  if (originalLotteryTrxWinGoDialog.value) {
    return OriginalLotteryTrxWinGoPage
  }
  return null
})

const watchArray = computed(() => [
  { state: casinoGameDialog, page_dialog_name: 'game-detail' },
  { state: originalGameBlackjackDialog, page_dialog_name: 'original-game-blackjack' },
  { state: originalGamePlinkoDialog, page_dialog_name: 'original-game-plinko' },
  { state: originalGameDiceDialog, page_dialog_name: 'original-game-dice' },
  { state: originalGameKenoDialog, page_dialog_name: 'original-game-keno' },
  { state: originalGameLimboDialog, page_dialog_name: 'original-game-limbo' },
  { state: originalGameMinesDialog, page_dialog_name: 'original-game-mines' },
  { state: originalGameWheelDialog, page_dialog_name: 'original-game-wheel' },
  { state: originalGameHiloDialog, page_dialog_name: 'original-game-hilo' },
  { state: originalGameCrashDialog, page_dialog_name: 'original-game-crash' },
  { state: originalLotteryWinGoDialog, page_dialog_name: 'original-lottery-win-go' },
  { state: originalLotteryRacingDialog, page_dialog_name: 'original-lottery-racing' },
  { state: originalLotteryK3Dialog, page_dialog_name: 'original-lottery-k3' },
  { state: originalLottery5DDialog, page_dialog_name: 'original-lottery-5d' },
  { state: originalLotteryTrxWinGoDialog, page_dialog_name: 'original-lottery-trx-win-go' },
])

watch(watchArray, () => {
  if (watchArray.value.some(item => item.state.value)) {
    document.body.classList.add('lock-scroll')
    showPageDialog.value = true
  }
  else {
    document.body.classList.remove('lock-scroll')
    showPageDialog.value = false
  }
}, { immediate: true, deep: true })
</script>

<template>
  <div>
    <BasePageDialog :model-value="showPageDialog" background-color="#1a2c38">
      <BasePullRefresh class="hide-scroll-bar">
        <Suspense timeout="0">
          <component :is="component" />
          <template #fallback>
            <AppLoading style="padding-top: 70px;" />
          </template>
        </Suspense>
      </BasePullRefresh>
    </basepagedialog>
  </div>
</template>

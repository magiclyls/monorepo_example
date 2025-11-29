<script setup lang='ts'>
import { ApiGameOriginalBetLimit } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'
import gsap from 'gsap'
import WujieVue from 'wujie-vue3'
import { getEnv } from '@tg/utils';


defineOptions({
  name: 'AppMiniGameMainPlinko',
})
const { t } = useI18n()
const { bus, destroyApp } = WujieVue

bus.$on('loaded', moveIframe)

const { isMobile } = storeToRefs(useWindowStore())
const { isTheatre } = useMiniGameGlobalStateTheatre()
const { currentGlobalCurrencyBalance, logoAndIcoAndLoading, currentGlobalCurrency, isLogin } = storeToRefs(useAppStore())
const { bool: gameLoading } = useBoolean(true)
const { bool: showDes } = useBoolean(false)
const { gameUrl, gameProps, showProvablyFair, onIframeLoaded } = useMiniGame('plinko')
const attrs = { src: `${location.origin}/empty` }
const { back } = useLocalRouter()
const { VITE_OFFICIAL_NAME } = getEnv()

const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')
/** 获取投注限额 */
const { data: betLimitData } = useRequest(() => ApiGameOriginalBetLimit(globalCurrencyCode.value), {
  manual: false,
  ready: isLogin,
  refreshDeps: globalCurrencyCode,
})

const betLimitMin = computed(() => betLimitData.value ? betLimitData.value[0] : 0)
const betLimitMax = computed(() => betLimitData.value ? betLimitData.value[1] : 0)

function moveIframe() {
  gameLoading.value = false
  const t = setTimeout(() => {
    gsap.to('.padding-top-transition', {
      translateY: 0,
      opacity: 1,
      duration: 0.35,
    }).then(() => {
      showDes.value = true
      bus.$emit('channelMessageWujie', {
        balance: currentGlobalCurrencyBalance.value,
        logoUrl: logoAndIcoAndLoading.value.logo_white,
        betLimitMax: betLimitMax.value,
        betLimitMin: betLimitMin.value,
      })
      onIframeLoaded()
    })
    clearTimeout(t)
  }, 200)
}

function destroyMicroApp() {
  destroyApp('Plinko') // 传入微应用的 name
  console.log('微应用 Plinko 已被销毁')
}

function goBack() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.CASINO_HOME)
  else
    back()
}

watch([betLimitMin, betLimitMax], () => {
  bus.$emit('channelMessageWujie', {
    betLimitMin: betLimitMin.value,
    betLimitMax: betLimitMax.value,
  })
})

onBeforeUnmount(() => {
  bus.$emit('onBeforeUnmount')
})

onBeforeRouteLeave(() => {
  destroyMicroApp()
})
</script>

<template>
  <div class="w-full flex flex-col items-center" :class="isFlutterApp() ? 'h-full overflow-auto' : ''">
    <AppLoading v-if="gameLoading" full-screen />
    <div
      :class="[isTheatre ? '' : 'mt-[12px] @[930px]:mt-[40px]']"
      class="padding-top-transition relative w-full translate-y-[20px] opacity-0"
      :style="{ height: gameLoading ? 0 : 'auto' }"
    >
      <div
        id="tg-original-game-public-wrap" class="relative mx-auto w-full"
        :class="[isTheatre ? 'max-w-[148vh]' : 'max-w-[1200px]']"
      >
        <WujieVue id="haahawujie" :alive="true" width="100%" height="100%" name="Plinko" :attrs="attrs" :url="gameUrl" :props="gameProps" />
        <AppDialogMiniGameProvablyFair
          v-if="showProvablyFair" :game="GAMES_LIST_ENUM.PLINKO"
          @close="showProvablyFair = false"
        />
      </div>
    </div>

    <section v-if="showDes" class="page-content">
      <AppDesc
        is-original-game :name="GAMES_LIST_ENUM.PLINKO" :game-id="GAMES_LIST_ENUM.PLINKO" game-type="8"
        :plat-name="t('casino_game', { site: VITE_OFFICIAL_NAME })" :show-content="false"
      />
      <div class="home-container mx-auto mt-[64px]">
        <div v-if="!isMobile" class="layout-spacing">
          <!-- <AppBetData mode="casino" /> -->
        </div>
      </div>
    </section>
  </div>
</template>

<style lang='scss' scoped></style>

<script setup lang='ts'>
import gsap from 'gsap'
import type { GAMES_LIST_ENUM } from 'feie-ui'
import { getEnv } from '@tg/utils';


interface Props {
  game: GAMES_LIST_ENUM
}
defineOptions({
  name: 'AppMiniGamePublicWrap',
})
const props = defineProps<Props>()
const route = useRoute()

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { bool: gameLoading } = useBoolean(true)
const { bool: showDes } = useBoolean(false)
const { bool: showProvablyFair } = useBoolean(false)
const { isTheatre } = useMiniGameGlobalStateTheatre()

const { VITE_OFFICIAL_NAME } = getEnv()

function moveIframe() {
  gameLoading.value = false
  const t = setTimeout(() => {
    gsap.to('.padding-top-transition', {
      translateY: 0,
      opacity: 1,
      duration: 0.35,
    }).then(() => {
      showDes.value = true
    })
    clearTimeout(t)
  }, 200)
}
function openProvablyFair() {
  showProvablyFair.value = true
}

provide('onLoaded', moveIframe)
provide('openProvablyFair', openProvablyFair)
provide('initGameName', props.game)
</script>

<template>
  <div class="w-full flex flex-col items-center" :class="isFlutterApp() ? 'h-full overflow-auto' : ''">
    <AppLoading v-if="gameLoading" full-screen />
    <div
      :class="[
        isTheatre ? '' : '@[930px]:mt-[40px]',
        isMobile ? 'px-[0px] mt-[12px]' : 'px-[3vw] mt-[3vw]',
      ]"
      class="padding-top-transition relative w-full translate-y-[20px] opacity-0"
      :style="{ height: gameLoading ? 0 : 'auto' }"
    >
      <div
        id="tg-original-game-public-wrap" class="relative mx-auto w-full @container"
        :class="[isTheatre ? 'max-w-[148vh]' : 'max-w-[1200px]']"
      >
        <slot />
        <AppDialogMiniGameProvablyFair v-if="showProvablyFair" @close="showProvablyFair = false" />
      </div>
    </div>

    <section v-if="showDes" class="page-content">
      <AppDesc
        is-original-game :name="game" :plat-name="t('casino_game', { site: VITE_OFFICIAL_NAME })"
        :show-content="false" :game-id="game" game-type="8"
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

<script setup lang='ts'>
import { PhBaseButton, PhBaseDialog } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconChessOriginalGame, IconIconUniScales, IconUniAnimate, IconUniEditAmount, IconUniFlash, IconUniGameInfo, IconUniKeyboard, IconUniSet, IconUniTheatreOpen, IconUniUsers } from '@tg/icons'
import IconChessStar from '@tg/icons/components/IconChessStar.vue'
import IconUniFavorites from '@tg/icons/components/IconUniFavorites.vue'
import { SendFlutterAppMessage } from '@tg/types'
import { getEnv, isFlutterApp, Local, sendMsgToFlutterApp } from '@tg/utils'
import { useElementSize } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import gsap from 'gsap'
import { computed, inject, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppMiniGameProvablyFair from '~/components/AppMiniGameProvablyFair.vue'
import { useWindowHeightRem } from '~/hooks'
import { useMiniGameGlobalStateHotKeys, useMiniGameGlobalStateLiveBetting, useMiniGameGlobalStateMaxBetAmount, useMiniGameGlobalStateMp3Volume, useMiniGameGlobalStatePlayerResult, useMiniGameGlobalStateTheatre } from '../composables'
import AppDesc from './AppDesc.vue'
import AppMiniGamePartMaxBetAmountDIalog from './AppMiniGamePartMaxBetAmountDIalog.vue'
import BallRange from './BallRange.vue'

interface Props {
  animateEnabled?: boolean
  gameType?: GAMES_LIST_ENUM
  useFontSize?: boolean
  gameData?: {
    [k: string]: any
  }
  game: GAMES_LIST_ENUM
}
defineOptions({
  name: 'AppMiniGamePublicLayout',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:animateEnabled', 'openGameInfo', 'openHotKeys'])

const showSeedDialog = ref(false)
const { heightRem } = useWindowHeightRem()
const openProvablyFair = inject('openProvablyFair', () => {
  showSeedDialog.value = true
})

const { VITE_OFFICIAL_NAME } = getEnv()

const { t } = useI18n()
const isMobile = ref(true)
const { bool: showDes } = useBoolean(false)
const { bool: gameLoading } = useBoolean(true)
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { isMaxBetAmount } = useMiniGameGlobalStateMaxBetAmount()
const { volume, isSoundsEnabled, toggleSoundsEnabled, setSoundsEnabled } = useMiniGameGlobalStateMp3Volume()
const { isTheatre, toggleIsTheatre } = useMiniGameGlobalStateTheatre()
const { back } = useRouter()
/** 即时下注 */
const { isLiveBetting, toggleLiveBetting } = useMiniGameGlobalStateLiveBetting()
/** 收藏 */
const { bool: isFavorite, toggle: toggleFav } = useBoolean(false)
const isMaxBetAmountDialogVisible = ref(false)
/** 显示玩家结果 */
const { showPlayerResult, togglePlayerResult } = useMiniGameGlobalStatePlayerResult()

const gameBoardRightRef = ref()
const { width: rightWidth } = useElementSize(gameBoardRightRef, undefined, { box: 'border-box' })
const gameBoardRightFontSize = computed(() => {
  const a = (rightWidth.value / 900).toFixed(6)
  return +a > 0.5 ? +a : 0.5
})

/** 音量调节 */
function onVolumeInput(val: string) {
  Local.set('STORAGE_MINI_GAME_SOUNDS_VOLUME', val)
  setSoundsEnabled()
}

/** 动画开关 */
function toggleAnimate() {
  emit('update:animateEnabled', !props.animateEnabled)
}

/** 开关最大投注额 */
function switchMaxBetAmount(hide: () => void) {
  if (isMaxBetAmount.value) {
    Local.set('STORAGE_MINIGAME_MAX_BET', false)
    return isMaxBetAmount.value = false
  }

  isMaxBetAmountDialogVisible.value = true
  hide()
}

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
/** 打开游戏信息弹窗 */
function showGameInfo() {
  emit('openGameInfo')
}
/** 打开快捷键弹窗 */
function showHotKeys() {
  emit('openHotKeys')
}
function setShowPlayerResult() {
  togglePlayerResult()
}
function onClickFavorite() {
  toggleFav()
}
function goBack() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.CASINO_HOME)
  else
    back()
}
provide('onLoaded', moveIframe)
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div
      class="relative min-w-[300rem] w-full flex flex-col"
      :class="{
        'max-w-400': !isMobile,
      }"
      :style="isTheatre ? { height: `${heightRem - 50}rem` } : {}"
    >
      <div
        class="bg1 w-full flex grow flex-col-reverse rounded-t-[8px] "
      >
        <div class="bg-[#ffffff] px-[11rem]">
          <div class="bg min-w-[300rem] p-[12rem]  rounded-tr-[8rem] rounded-tl-[8rem]">
            <slot name="left" />
          </div>
        </div>
        <div
          ref="gameBoardRightRef" :style="{ fontSize: useFontSize ? `${gameBoardRightFontSize}em` : '' }"
          class="relative w-full flex grow flex-col justify-center overflow-hidden text-[16rem]"
        >
          <slot name="right" />
        </div>
      </div>
      <div class="bg-[#ffffff] px-[11rem] pb-[16rem]">
        <div class="h-[63rem] w-full flex items-center justify-between rounded-b-[8px] bg-[#EBEBEB] p-[8rem]">
          <!-- 左 -->
          <div class="theme-border1 flex items-center pr-[8rem]">
            <!-- 游戏设置 -->
            <VDropdown :triggers="['click']">
              <VTooltip placement="top" :triggers="['hover']">
                <PhBaseButton size="sm" class="theme-button-bg">
                  <IconUniSet class="icon-theme-color" />
                </PhBaseButton>
                <template #popper>
                  <div class="tiny-menu-item-title">
                    {{ t('游戏设置') }}
                  </div>
                </template>
              </VTooltip>

              <template #popper="{ hide }">
                <div class="dropdown-popper">
                  <div
                    class="flex-row-8 flex items-center px-[12rem] py-[8rem]"
                    :class="[isSoundsEnabled ? 'theme-icon-color-active' : 'theme-icon-color']"
                  >
                    <div class="flex cursor-pointer items-center" @click="toggleSoundsEnabled">
                      <component :is="isSoundsEnabled ? 'IconUniVoice' : 'IconUniVoiceNo'" />
                    </div>
                    <BallRange v-model="volume" @input="onVolumeInput" />
                  </div>
                  <div
                    v-if="gameType !== GAMES_LIST_ENUM.CRASH && gameType !== GAMES_LIST_ENUM.PLINKO"
                    class="group cursor-pointer px-[12rem] py-[12rem]"
                    :class="[isLiveBetting ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                    @click="toggleLiveBetting"
                  >
                    <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                      <IconUniFlash />
                      <span>{{ t('即时下注') }}</span>
                    </div>
                  </div>

                  <div
                    v-if="gameType !== GAMES_LIST_ENUM.CRASH && gameType !== GAMES_LIST_ENUM.PLINKO"
                    class="group cursor-pointer px-[12rem] py-[12rem]"
                    :class="[animateEnabled ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                    @click="toggleAnimate"
                  >
                    <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                      <IconUniAnimate />
                      <span>{{ t('动画') }}</span>
                    </div>
                  </div>

                  <div
                    class="group cursor-pointer px-[12rem] py-[12rem]"
                    :class="[isMaxBetAmount ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                    @click="switchMaxBetAmount(hide)"
                  >
                    <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                      <IconChessOriginalGame />
                      <span>{{ t('最大投注额') }}</span>
                    </div>
                  </div>

                  <div
                    v-if="gameType === GAMES_LIST_ENUM.CRASH"
                    class="group cursor-pointer px-[12rem] py-[12rem]"
                    :class="[showPlayerResult ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                    @click="setShowPlayerResult"
                  >
                    <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                      <IconUniUsers />
                      <span>{{ t('显示玩家结果') }}</span>
                    </div>
                  </div>

                  <div
                    class="group hover:bg-tg-popper-hover-bg cursor-pointer px-[12rem] py-[12rem]"
                    style="color:var(--app-mini-game-public-layout-icon);"
                    @click="showGameInfo();hide()"
                  >
                    <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                      <IconUniGameInfo />
                      <span>{{ t('游戏信息') }}</span>
                    </div>
                  </div>

                  <div
                    class="group cursor-pointer px-[12rem] py-[12rem]"
                    :class="[isHotKeysEnabled ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                    @click="showHotKeys();hide()"
                  >
                    <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                      <IconUniKeyboard />
                      <span>{{ t('快捷键') }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </VDropdown>
            <!-- 启用剧院模式 -->
            <VTooltip v-if="!isMobile" placement="top" :triggers="['hover']">
              <PhBaseButton size="sm" class="theme-button-bg" @click="toggleIsTheatre">
                <IconUniTheatreOpen class="icon-theme-color" :style="isTheatre ? 'color:#fff;' : ''" />
              </PhBaseButton>

              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ isTheatre ? t('禁用剧院模式') : t('启用剧院模式') }}
                </div>
              </template>
            </VTooltip>

            <!-- 收藏 -->
            <VTooltip placement="top" :triggers="['hover']">
              <PhBaseButton size="sm" class="theme-button-bg" @click="onClickFavorite">
                <component :is="isFavorite ? IconUniFavorites : IconChessStar" class="icon-theme-color" />
              </PhBaseButton>

              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ t('收藏') }}
                </div>
              </template>
            </VTooltip>
          </div>
          <!-- 中 -->
          <!-- <BaseLogo v-if="!isMobile" /> -->
          <!-- 右 -->
          <div>
            <PhBaseButton size="none" class="theme-button-bg" @click="openProvablyFair">
              <div class="text-theme-color px-[10rem]">
                {{ t('公平性') }}
              </div>
            </PhBaseButton>
          </div>
        </div>
      </div>
      <section class="page-content">
        <AppDesc
          is-original-game :name="game" :plat-name="t('小游戏', { site: VITE_OFFICIAL_NAME })"
          :show-content="false" :game-id="game" game-type="8"
        />
        <div class="home-container mx-auto mt-64">
          <div v-if="!isMobile" class="layout-spacing">
            <!-- <AppBetData mode="casino" /> -->
          </div>
        </div>
      </section>
    </div>
  </div>
  <PhBaseDialog v-model="isMaxBetAmountDialogVisible" :title="t('最大投注额')" :icon="IconUniEditAmount" :show-close="true" :show-close-icon="true">
    <AppMiniGamePartMaxBetAmountDIalog />
  </PhBaseDialog>
  <PhBaseDialog v-model="showSeedDialog" :title="t('公平性')" style="--ph-base-dialog-background-color: #F6F7F8; ">
    <AppMiniGameProvablyFair v-if="showSeedDialog" :game-data="props.gameData" />
    <template #icon>
      <IconIconUniScales class="text-[#9DABC8] mr-[8rem]" />
    </template>
  </PhBaseDialog>
</template>

<style>
:root {
  --app-mini-game-public-layout-bg: #ffffff;
  --app-mini-game-public-layout-active-icon: #f23038;
  --app-mini-game-public-layout-icon: #2f4553;
}
</style>

<style lang='scss' scoped>
.theme-border1 {
  border-right: 1px solid #9dabc9;
}
.bg {
  background: #f6f7f8;
}
.bg1 {
  background-color: var(--app-mini-game-public-layout-bg);
  border-color: #213743;
}
.theme-button-bg {
  --ph-base-button-primary-text-color: #0d2245;
  --ph-base-button-primary-background-color: #ebebeb;
}
.theme-icon-color {
  color: var(--app-mini-game-public-layout-icon);
}
.icon-theme-color {
  color: #f23038;
}
.theme-icon-color-active {
  color: var(--app-mini-game-public-layout-active-icon);
}

.flex-row-8 {
  > *:not(:first-child) {
    margin-left: 8rem;
  }
}

.dropdown-popper {
  color: #2f4553;
  font-size: 14rem;
  font-weight: 500;
}
</style>

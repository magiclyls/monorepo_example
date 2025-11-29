<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
import { IconUniSet, IconUniVoice, IconUniVoiceNo, IconUniFlash, IconUniAnimate, IconUniGameInfo, IconUniKeyboard, IconUniTheatreOpen, IconUniUsers, IconChessOriginalGame, IconUniFavorites, IconChessStar } from '@tg/icons'

interface Props {
  animateEnabled?: boolean
  gameType?: GAMES_LIST_ENUM
  useFontSize?: boolean
}
defineOptions({
  name: 'AppMiniGamePublicLayout',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:animateEnabled', 'openGameInfo', 'openHotKeys'])

const openProvablyFair = inject('openProvablyFair', () => { })

const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { isMaxBetAmount } = useMiniGameGlobalStateMaxBetAmount()
const { openMiniGameInsertMaxBetAmountDialog } = useMiniGameInsertDialogMaxBetAmount()
const { volume, isSoundsEnabled, toggleSoundsEnabled, setSoundsEnabled } = useMiniGameGlobalStateMp3Volume()
const { isTheatre, toggleIsTheatre } = useMiniGameGlobalStateTheatre()
const { back } = useLocalRouter()
/** 即时下注 */
const { isLiveBetting, toggleLiveBetting } = useMiniGameGlobalStateLiveBetting()
/** 收藏 */
const { bool: isFavorite, toggle: toggleFav } = useBoolean(false)

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
  Local.set(STORAGE_MINI_GAME_SOUNDS_VOLUME, val)
  setSoundsEnabled()
}

/** 动画开关 */
function toggleAnimate() {
  emit('update:animateEnabled', !props.animateEnabled)
}

/** 开关最大投注额 */
function switchMaxBetAmount(hide: () => void) {
  if (isMaxBetAmount.value) {
    Local.set(STORAGE_MINIGAME_MAX_BET, true)
    return isMaxBetAmount.value = false
  }

  openMiniGameInsertMaxBetAmountDialog()
  hide()
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
</script>

<template>
  <div class="w-full flex flex-col items-center">
    <div
      class="relative min-w-[300px] w-full flex flex-col @[800px]:max-w-[1300px]"
      :class="{
        't-iframe-wrapper': isTheatre,
        'max-w-[400px]': !isMobile,
      }"
    >
      <div
        class="bg1 w-full flex grow flex-col-reverse border-b-[3px] rounded-t-[8px] border-solid @[800px]:flex-row"
      >
        <div class="bg min-w-[300px] p-[12px] @[800px]:rounded-tl-[8px]">
          <slot name="left" />
        </div>
        <div
          ref="gameBoardRightRef" :style="{ fontSize: useFontSize ? `${gameBoardRightFontSize}em` : '' }"
          class="relative w-full flex grow flex-col justify-center overflow-hidden text-[16px] @[800px]:rounded-tr-[8px]"
        >
          <slot name="right" />
        </div>
      </div>

      <div class="h-[63px] w-full flex items-center justify-between rounded-b-[8px] bg-[var(--app-mini-game-public-layout-bg)] p-[8px]">
        <!-- 左 -->
        <div class="theme-border1 flex items-center pr-[8px]">
          <!-- 游戏设置 -->
          <VDropdown :triggers="['click']">
            <VTooltip placement="top" :triggers="['hover']">
              <BaseButton size="sm" type="text">
                <IconUniSet class="icon-theme-color" />
              </BaseButton>
              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ t('mini_game_set') }}
                </div>
              </template>
            </VTooltip>

            <template #popper="{ hide }">
              <div class="dropdown-popper">
                <div
                  class="flex-row-8 flex items-center px-[12px] py-[8px]"
                  :class="[isSoundsEnabled ? 'theme-icon-color-active' : 'theme-icon-color']"
                >
                  <div class="flex cursor-pointer items-center" @click="toggleSoundsEnabled">
                    <component :is="isSoundsEnabled ? 'IconUniVoice' : 'IconUniVoiceNo'" />
                  </div>
                  <AppBallRange v-model="volume" @input="onVolumeInput" />
                </div>

                <div
                  v-if="gameType !== GAMES_LIST_ENUM.CRASH"
                  class="group cursor-pointer px-[12px] py-[12px]"
                  :class="[isLiveBetting ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                  @click="toggleLiveBetting"
                >
                  <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                    <IconUniFlash name="uni-flash" />
                    <span>{{ t('mini_bet_on_time') }}</span>
                  </div>
                </div>

                <div
                  v-if="gameType !== GAMES_LIST_ENUM.CRASH"
                  class="group cursor-pointer px-[12px] py-[12px]"
                  :class="[animateEnabled ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                  @click="toggleAnimate"
                >
                  <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                    <IconUniAnimate name="uni-animate" />
                    <span>{{ t('mini_animate') }}</span>
                  </div>
                </div>

                <div
                  class="group cursor-pointer px-[12px] py-[12px]"
                  :class="[isMaxBetAmount ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                  @click="switchMaxBetAmount(hide)"
                >
                  <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                    <IconChessOriginalGame name="chess-original-game" />
                    <span>{{ t('mini_max_bet_amount') }}</span>
                  </div>
                </div>

                <div
                  v-if="gameType === GAMES_LIST_ENUM.CRASH"
                  class="group cursor-pointer px-[12px] py-[12px]"
                  :class="[showPlayerResult ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                  @click="setShowPlayerResult"
                >
                  <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                    <IconUniUsers name="uni-users" />
                    <span>{{ t('mini_show_user_result') }}</span>
                  </div>
                </div>

                <div
                  class="group hover:bg-tg-popper-hover-bg cursor-pointer px-[12px] py-[12px]"
                  style="--tg-icon-color:var(--app-mini-game-public-layout-icon);"
                  @click="showGameInfo();hide()"
                >
                  <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                    <IconUniGameInfo name="uni-game-info" />
                    <span>{{ t('mini_game_info') }}</span>
                  </div>
                </div>

                <div
                  class="group cursor-pointer px-[12px] py-[12px]"
                  :class="[isHotKeysEnabled ? 'text-tg-text-blue theme-icon-color-active' : 'hover:bg-tg-popper-hover-bg theme-icon-color']"
                  @click="showHotKeys();hide()"
                >
                  <div class="flex-row-8 w-full flex items-center group-active:scale-[0.96]">
                    <IconUniKeyboard name="uni-keyboard" />
                    <span>{{ t('mini_short_cuts') }}</span>
                  </div>
                </div>
              </div>
            </template>
          </VDropdown>
          <!-- 启用剧院模式 -->
          <VTooltip v-if="!isMobile" placement="top" :triggers="['hover']">
            <BaseButton size="sm" type="text" @click="toggleIsTheatre">
              <IconUniTheatreOpen class="icon-theme-color" :style="isTheatre ? '--tg-icon-color:#fff;' : ''" name="uni-theatre-open" />
            </BaseButton>

            <template #popper>
              <div class="tiny-menu-item-title">
                {{ isTheatre ? t('casino_game_close_theatre') : t('casino_game_open_theatre') }}
              </div>
            </template>
          </VTooltip>
          <!-- 收藏 -->
          <VTooltip placement="top" :triggers="['hover']">
            <BaseButton size="sm" type="text" @click="onClickFavorite">
              <component :is="`${isFavorite ? 'IconUniFavorites' : 'IconChessStar'}`" class="icon-theme-color" />
            </BaseButton>

            <template #popper>
              <div class="tiny-menu-item-title">
                {{ t('sports_title_favourites') }}
              </div>
            </template>
          </VTooltip>
        </div>
        <!-- 中 -->
        <BaseLogo v-if="!isMobile" />
        <!-- 右 -->
        <div>
          <BaseButton type="text" size="none" @click="openProvablyFair">
            <div class="text-theme-color px-[10px]">
              {{ t('fairness') }}
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --app-mini-game-public-layout-bg: var(--tg-secondary-dark);
  --app-mini-game-public-layout-active-icon: var(--tg-text-blue);
  --app-mini-game-public-layout-icon: var(--tg-secondary-main);
}

/* 将嵌套的主题样式移到外层 */
:root[theme="white"] {
  --app-mini-game-public-layout-bg: #E8E8E8;
}

[theme="greenblack"] {
  --app-mini-game-public-layout-active-icon: var(--tg-text-greenblack-main);
  --app-mini-game-public-layout-icon: var(--tg-svg-default-color);
}
[theme="green"] {
  --app-mini-game-public-layout-bg: #02432D;
  --app-mini-game-public-layout-active-icon: #FF9724;
  --app-mini-game-public-layout-icon: #02432D;
  --tg-text-blue:#FF9724;
  --tg-popper-color-default:#02432D;
}
[theme="white"] {
  --app-mini-game-public-layout-active-icon: #f2ca5c;
  --app-mini-game-public-layout-icon: #484848;
  --tg-text-blue:#f2ca5c;
}
</style>

<style lang='scss' scoped>
.theme-border1{
  border-right: 1px solid var(--tg-secondary-main);
  @include webTheme('white') {
    border-right: 1px solid #555;
  }
  @include webTheme('green') {
    border-right: 1px solid #197B59;
  }
  .text{
    @include webTheme('white') {
      --tg-icon-color: #FF9E36;
      &:hover{
        --tg-icon-color: #D48025;
      }
    }
  }

}
.bg{
  background: var(--tg-secondary-grey);
  @include webTheme('white') {
    background:#f5f5f5;
  }
  @include webTheme('green') {
    background: #055434;
  }
}
.bg1{
  background-color: var(--app-mini-game-public-layout-bg);
  border-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background:#e8e8e8;
    border-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #02432D;
    border-color: #055434;
  }
}
.theme-icon-color{
  --tg-icon-color:var(--app-mini-game-public-layout-icon);
}
.theme-icon-color-active{
  --tg-icon-color:var(--app-mini-game-public-layout-active-icon);
}
.border-tg-secondary-grey {
  @include webTheme('green') {
    border-color: #0E6746;
  }
}
.flex-row-8{
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
}
 .t-iframe-wrapper {
    height: calc(100vh - var(--tg-header-height));
  }

.dropdown-popper {
  color: var(--tg-popper-color-default);
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);
}
.bg-theme-green {
  @include webTheme('green') {
    background-color: #055434;
  }
}
.text-theme-color {
  @include webTheme('green') {
    color: #3CB389;
  }
}
.icon-theme-color {
  @include webTheme('green') {
    --tg-icon-color:#5ECEA6;
  }
}
</style>

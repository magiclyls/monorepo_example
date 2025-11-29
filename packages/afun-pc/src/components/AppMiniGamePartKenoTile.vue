<script setup lang='ts'>
interface Props {
  data: OriginalGameKenoTile
  /** 是否禁用 */
  disabled?: boolean
  animateEnabled: boolean
}
defineOptions({
  name: 'AppMiniGamePartKenoTile',
})
const props = defineProps<Props>()

const { chosenNumberCount } = useMiniGameKenoData()

/** 选中 */
const isChosen = computed(() => props.data.chosen)
/** 应用禁用的样式 */
const isDisabled = computed(() => (props.disabled || chosenNumberCount.value >= 10) && !isChosen.value)
/** 开奖 */
const isRevealed = computed(() => !!props.data.result)
/** 中奖 */
const isMatch = computed(() => isChosen.value && isRevealed.value)
</script>

<template>
  <button
    class="keno-tile" :style="{
      '--keno-tile-shadow-inset': '-0.15em',
      '--keno-shadow': '0.3em',
      '--keno-tile-shadow-lg': '0.44999999999999996em',
      '--keno-duration': animateEnabled ? '300ms' : '0ms',
    }" :class="{
      'is-revealed': isRevealed && !isMatch,
      'is-match': isMatch,
      'disabled': isDisabled,
    }" :disabled="disabled"
  >
    <!-- 宝石 -->
    <div v-if="isMatch" class="absolute h-full w-full flex items-center justify-center">
      <div class="gem">
        <AppMiniGamePartKenoGem />
      </div>
    </div>

    <span class="tile-number">{{ data.num }}</span>
    <div
      class="cover" :class="{
        'is-selected': isChosen && !isRevealed,
        'is-hidden': !isChosen && !isRevealed,
        'is-revealed': isRevealed && !isMatch,
        'is-match': isMatch,
      }"
    >
      <span class="tile-number">{{ data.num }}</span>
    </div>
  </button>
</template>

<style>
:root {
  --tg-keno-reveal-bg :#071824;
  --tg-keno-reveal-sd :#001017;
}

[theme="green"] {
  --tg-keno-reveal-bg :#033F26;
  --tg-keno-reveal-sd :#13251e;
}
[theme="white"] {
  --tg-keno-reveal-bg :#555;
  --tg-keno-reveal-sd :#00000025;
}
</style>

<style lang='scss' scoped>
.keno-tile {
  position: relative;
  font-size: 1.5em;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 3px 2px rgba(0, 0, 0, .1);
  border-radius: 8px;
  transition-duration: var(--keno-duration);
  transition-property: background-color, box-shadow, opacity;
  line-height: 1;

  &.disabled {
    opacity: .5;
    cursor: not-allowed;
    pointer-events: none;
  }
  &:disabled{
    cursor: not-allowed;
    pointer-events: none;
  }

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }

  &.is-revealed {
    background-color: var(--tg-keno-reveal-bg);
    box-shadow: inset 0 var(--keno-shadow) var(--tg-keno-reveal-sd);
    color: #e9113c;
    @include webTheme('white'){
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
    }
    @include webTheme('green'){
      box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;
    }
  }

  &.is-match {
    background-color: var(--tg-keno-reveal-bg);
    box-shadow: 0 var(--keno-shadow) #7100c7, 0 0 0 .3em #962eff inset;
    color: #008a01;
    text-shadow: 0 1px 1px #fff;
  }

  .tile-number {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .cover {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    animation-fill-mode: forwards;
    border-radius: 8px;
    transition-duration: var(--keno-duration);
    transition-property: background-color, box-shadow, transform;

    &.is-hidden {
      background: var(--tg-secondary-main);
      box-shadow: 0 var(--keno-shadow) var(--tg-secondary-grey);
      animation-name: keno-tile-hide;
      animation-duration: var(--keno-duration);
      animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);
      @include webTheme('white') {
        background: #E6AA05;
        box-shadow: 0 var(--keno-shadow) #FFD256;
      }
      @include webTheme('green') {
        box-shadow: 0 var(--keno-shadow) #24764F;
      }
      &:hover {
        background: var(--tg-third-grey);
        box-shadow: 0 var(--keno-tile-shadow-lg) var(--tg-secondary-main);
        transform: translateY(var(--keno-tile-shadow-inset));
      }
    }

    &.is-selected {
      background-color: #962eff;
      box-shadow: 0 var(--keno-shadow) #7100c7;
      animation-name: keno-tile-hide;
      animation-duration: var(--keno-duration);
      animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);

      &:hover {
        background-color: #b061ff;
        box-shadow: 0 var(--keno-tile-shadow-lg) #9000ff;
        transform: translateY(var(--keno-tile-shadow-inset));
      }
    }

    &.is-revealed {
      background: #1fff20;
      box-shadow: 0 var(--keno-shadow) var(--tg-secondary-grey);
      opacity: 0;
      animation-name: keno-tile-reveal;
      animation-duration: var(--keno-duration);
    }

    &.is-match {
      background-color: #962eff;
      box-shadow: 0 var(--keno-shadow) #7100c7;
      opacity: 0;
      animation-name: keno-tile-reveal;
      animation-duration: var(--keno-duration);
    }
  }

  .gem {
    display: flex;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    width: 90%;
    // transform: translate(-50%, -50%);
    animation-name: keno-gem-reveal;
    animation-duration: 500ms;
    animation-fill-mode: forwards;
    animation-timing-function: cubic-bezier(.87, -.41, .19, 1.44);
  }
}

@keyframes keno-tile-hide {
  0% {
    opacity: 0;
    transform: scale(0);
  }
}

@keyframes keno-tile-reveal {
  0% {
    opacity: 1;
  }

  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes keno-gem-reveal {
  0% {
    transform:  scale(0) rotate(-45deg);
  }

  90% {
    transform:  scale(1.17) rotate(5deg);
  }

  100% {
    transform:  scale(1) rotate(0);
  }
}
</style>

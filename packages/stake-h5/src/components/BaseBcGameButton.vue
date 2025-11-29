<script setup lang="ts">
import { IconSptSoccer, IconChessFrame2 } from '@tg/icons';

interface Props {
  round?: boolean
  type?: 'default' | 'text' | 'line' | 'round-line-left' | 'round-line-right' | 'square-line'
  bgStyle?: 'primary' | 'secondary' | 'dark' | 'grey' | 'brand'
  disabled?: boolean
  loading?: boolean
  size?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  shadow?: boolean
  customPadding?: boolean
  originType?: 'button' | 'submit' | 'reset'
  sportsLoading?: boolean
  disabledClickTransition?: boolean
}
defineOptions({
  name: 'BaseBcGameButton',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'xs',
  originType: 'button',
  bgStyle: 'brand',
})

const { isMobile } = storeToRefs(useWindowStore())

function onClick(e: any) {
  if (props.disabled)
    e.stopPropagation()
}
</script>

<template>
  <button :type="originType" :disabled="disabled" :class="[type, bgStyle, size, {
    round,
    shadow,
    loading,
    isMobile,
    'custom-padding': customPadding,
    disabledClickTransition,
  }]">
    <div v-if="loading" class="loading-icon">
      <IconSptSoccer v-if="sportsLoading" style="--tg-icon-color:var(--tg-text-white);" name="spt-soccer"
        class="ani-scaleAndRotate" />
      <IconChessFrame2 v-else name="chess-frame2" class="ani-roll" />
    </div>
    <div v-else class="content" @click="onClick">
      <slot />
    </div>
    <slot name="loadingText" />
  </button>
</template>

<style lang="scss">
:root {
  --tg-base-bcgame-button-style-bg: var(--tg-secondary-main);
  --tg-base-bcgame-button-style-bg-hover: var(--tg-text-grey);
  --tg-base-bcgame-button-text-default-color: var(--tg-text-lightgrey);
  --tg-base-bcgame-button-font-size: var(--tg-font-size-default);
  --tg-base-bcgame-button-font-weight: var(--tg-font-weight-semibold);
  --tg-base-bcgame-button-padding-y: var(--tg-spacing-button-padding-vertical-xs);
  --tg-base-bcgame-button-padding-x: var(--tg-spacing-button-padding-horizontal-xs);
  --tg-base-bcgame-button-disabled-opacity: 0.5;
  --tg-base-bcgame-button-loading-opacity: 0.5;
  --tg-base-bcgame-button-line-border-color: var(--tg-border-color-white);
  --tg-base-bcgame-button-justify-content: center;
  --tg-base-bcgame-button-line-hover-color: var(--tg-button-default-bg);
  --tg-base-bcgame-button-line-active-color: var(--tg-button-default-bg);
  --tg-base-bcgame-button-min-width: auto;
  --tg-base-bcgame-button-max-width: auto;
  --tg-base-bcgame-button-border-radius: var(--tg-radius-default);
  --tg-base-bcgame-button-secondary-icon-hover-color: var(--tg-sub-info);
  --tg-base-bcgame-button-square-line-border-color: var(--tg-text-lightgrey);
  --tg-base-bcgame-button-color: var(--tg-text-white);
  --tg-base-bcgame-button-default-fake-active-bg: var(--tg-secondary-dark);
}

[theme="green"] {
  --tg-base-bcgame-button-style-bg: #42BC91;
  --tg-base-bcgame-button-style-bg-hover: #428f74;
}

[theme="greenblack"] {
  --tg-base-bcgame-button-text-default-color: var(--tg-text-white);
  --tg-base-bcgame-button-line-border-color: var(--tg-primary-active);
  --tg-base-bcgame-button-style-bg-hover: #1F9A75;
}
</style>

<style lang="scss" scoped>
button {
  color: var(--tg-base-bcgame-button-color);
  font-size: var(--tg-base-bcgame-button-font-size);
  border-radius: var(--tg-base-bcgame-button-border-radius);
  font-weight: var(--tg-base-bcgame-button-font-weight);
  transition: var(--tg-transition);
  min-width: var(--tg-base-bcgame-button-min-width);
  max-width: var(--tg-base-bcgame-button-max-width);
  line-height: 1;
  max-width: 100%;

  &.none {
    padding: 0;
  }

  &.xs {
    padding: var(--tg-spacing-button-padding-vertical-xs) var(--tg-spacing-button-padding-horizontal-xs);
  }

  &.sm {
    padding: var(--tg-spacing-button-padding-vertical-sm) var(--tg-spacing-button-padding-horizontal-sm);
  }

  &.md {
    padding: var(--tg-spacing-button-padding-vertical-md) var(--tg-spacing-button-padding-horizontal-md);
  }

  &.lg {
    padding: var(--tg-spacing-button-padding-vertical-lg) var(--tg-spacing-button-padding-horizontal-lg);
  }

  &.xl {
    padding: var(--tg-spacing-button-padding-vertical-xl) var(--tg-spacing-button-padding-horizontal-xl);
  }

  &.custom-padding {
    padding: var(--tg-base-bcgame-button-padding-y) var(--tg-base-bcgame-button-padding-x);
  }

  .loading-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--tg-font-size-base);
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: var(--tg-base-bcgame-button-justify-content);
  }

  &.loading {
    opacity: var(--tg-base-bcgame-button-loading-opacity);
    pointer-events: none;
  }

  &:disabled {
    opacity: var(--tg-base-bcgame-button-disabled-opacity);
    cursor: not-allowed;

    &:active {
      .content {
        transform: none;
      }
    }
  }
}

.default {
  background-color: var(--tg-base-bcgame-button-style-bg);

  &:active {
    .content {
      transform: scale(0.96);
    }
  }

  &.isMobile {
    &:active {
      background-color: var(--tg-base-bcgame-button-default-fake-active-bg);
    }
  }

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-bcgame-button-style-bg-hover);
    --tg-icon-color: var(--tg-text-white);
  }
}

.text {
  color: var(--tg-base-bcgame-button-text-default-color);

  &:active:not(.disabledClickTransition) {
    color: var(--tg-text-white);

    .content {
      transform: scale(0.96);
    }
  }

  &:hover:not(:disabled) {
    color: var(--tg-text-white);
    --tg-icon-color: var(--tg-text-white);

    @include webTheme('green') {
      --tg-icon-color: inherit;
    }

    @include webTheme('greenblack') {
      --tg-icon-color: inherit;
    }
  }
}

.line {
  border: 1px solid var(--tg-base-bcgame-button-line-border-color);

  &:active {
    background-color: var(--tg-base-bcgame-button-line-active-color);

    .content {
      transform: scale(0.96);
    }
  }

  &:hover:not(:disabled):not(:active) {
    background-color: var(--tg-base-bcgame-button-line-hover-color);
  }

  @include webTheme('green') {
    //不能给白色文字变量换色  只有这里白色换黄色
    color: var(--tg-base-bcgame-button-line-border-color);
  }
}

.square-line {
  border: 1px solid var(--tg-base-bcgame-button-square-line-border-color);
  border-radius: 4px;

  &:active {
    .content {
      transform: scale(0.96);
    }
  }

  &:hover:not(:disabled):not(:active) {
    .content {
      transform: scale(1.05);
    }
  }
}

.round-line-left {
  border: 1px solid var(--tg-secondary-light);
  border-radius: 100px 0 0 100px;

  &:active {
    .content {
      transform: scale(0.96);
    }
  }

  &:hover:not(:disabled):not(:active) {
    .content {
      transform: scale(1.05);
    }
  }
}

.round-line-right {
  border: 1px solid var(--tg-secondary-light);
  border-radius: 0 100px 100px 0;

  &:active {
    .content {
      transform: scale(0.96);
    }
  }

  &:hover:not(:disabled):not(:active) {
    .content {
      transform: scale(1.05);
    }
  }
}

.shadow {
  box-shadow: var(--tg-box-shadow);
}

.round {
  border-radius: 100px;
}

.primary {
  --tg-base-bcgame-button-style-bg: var(--tg-primary-active);
  --tg-base-bcgame-button-style-bg-hover: var(--tg-sub-deepblue);
  background-color: var(--tg-base-bcgame-button-style-bg);

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-bcgame-button-style-bg-hover);
  }

  @include webTheme('green') {
    color: var(--tg-text-green-btn);

    &:hover:not(:disabled):not(.isMobile) {
      background-color: #bcbc80;
    }
  }

  @include webTheme('greenblack') {
    --tg-base-bcgame-button-style-bg: #00AE85;

    &:hover:not(:disabled):not(.isMobile) {
      background-color: #00AE85;
    }
  }
}

.secondary {
  --tg-base-bcgame-button-style-bg: var(--tg-text-green);
  --tg-base-bcgame-button-style-bg-hover: var(--tg-primary-success);
  background-color: var(--tg-base-bcgame-button-style-bg);
  color: var(--tg-text-dark);
  --tg-icon-color: #000;

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-bcgame-button-style-bg-hover);
    --tg-icon-color: var(--tg-base-bcgame-button-secondary-icon-hover-color);
  }

  @include webTheme('green') {
    color: var(--tg-text-white);
    --tg-base-bcgame-button-style-bg: #ffaa09;

    &:hover:not(:disabled):not(.isMobile) {
      background-color: #ffc049;
    }
  }

  @include webTheme('greenblack') {
    --tg-base-bcgame-button-style-bg: #26FFBE;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-bcgame-button-style-bg-hover: #1F9A75;
    }
  }
}

.dark {
  --tg-base-bcgame-button-style-bg: var(--tg-secondary-dark);
  --tg-base-bcgame-button-style-bg-hover: var(--tg-secondary-grey);
  background-color: var(--tg-base-bcgame-button-style-bg);

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-bcgame-button-style-bg-hover);
  }

  @include webTheme('green') {
    --tg-base-bcgame-button-style-bg: #02432D;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-bcgame-button-style-bg-hover: #139468;
    }
  }

  @include webTheme('greenblack') {
    --tg-base-bcgame-button-style-bg: #00654D;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-bcgame-button-style-bg-hover: #139468;
    }
  }
}

.grey {
  --tg-base-bcgame-button-style-bg: var(--tg-text-grey-third);
  --tg-base-bcgame-button-style-bg-hover: var(--tg-secondary-grey);
  background-color: var(--tg-base-bcgame-button-style-bg);

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-bcgame-button-style-bg-hover);
  }

  @include webTheme('greenblack') {
    --tg-base-bcgame-button-style-bg: #008F64;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-bcgame-button-style-bg-hover: #008F64;
    }
  }
}

.brand {
  color: #000;
  font-weight: 800;
  background-image: linear-gradient(90deg, rgb(36, 238, 137), rgb(159, 232, 113));
  box-shadow: rgba(35, 238, 136, 0.3) 0px 0px 12px, rgb(29, 202, 106) 0px -2px inset;

  &:hover {
    filter: brightness(1.1);
  }
}
</style>

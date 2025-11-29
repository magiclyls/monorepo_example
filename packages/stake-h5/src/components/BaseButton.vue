<script setup lang="ts">
import { IconSptSoccer, IconChessFrame2 } from '@tg/icons';

interface Props {
  round?: boolean
  type?: 'default' | 'text' | 'line' | 'round-line-left' | 'round-line-right' | 'square-line'
  /* red , default-yellow, empty 为白色主题专有，为默认按钮分叉出来
  */
  bgStyle?: 'primary' | 'secondary' | 'dark' | 'grey' | 'red' | 'default-yellow' | 'empty'
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
  name: 'BaseButton',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'xs',
  originType: 'button',
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
  --tg-base-button-style-bg: var(--tg-secondary-main);
  --tg-base-button-style-bg-hover: var(--tg-text-grey);
  --tg-base-button-text-default-color: var(--tg-text-lightgrey);
  --tg-base-button-font-size: var(--tg-font-size-default);
  --tg-base-button-font-weight: var(--tg-font-weight-semibold);
  --tg-base-button-padding-y: var(--tg-spacing-button-padding-vertical-xs);
  --tg-base-button-padding-x: var(--tg-spacing-button-padding-horizontal-xs);
  --tg-base-button-disabled-opacity: 0.5;
  --tg-base-button-loading-opacity: 0.5;
  --tg-base-button-line-border-color: var(--tg-border-color-white);
  --tg-base-button-justify-content: center;
  --tg-base-button-line-hover-color: var(--tg-button-default-bg);
  --tg-base-button-line-active-color: var(--tg-button-default-bg);
  --tg-base-button-min-width: auto;
  --tg-base-button-max-width: auto;
  --tg-base-button-border-radius: var(--tg-radius-default);
  --tg-base-button-secondary-icon-hover-color: var(--tg-sub-info);
  --tg-base-button-square-line-border-color: var(--tg-text-lightgrey);
  --tg-base-button-color: var(--tg-text-white);
  --tg-base-button-default-fake-active-bg: var(--tg-secondary-dark);
}

[theme="green"] {
  --tg-base-button-color: #3CB389;
  --tg-base-button-style-bg: #055434;
  --tg-base-button-style-bg-hover: #FFDE66;
  --tg-base-button-primary-hover: #F6D14A;
  --tg-base-button-secondary-bg: #F6D14A;
  --tg-base-button-style-bg-dark: #02432D;
  --tg-base-button-default-fake-active-bg: #FFDE66;
  --tg-secondary-text-color-theme-green: #02432D;
}

[theme="greenblack"] {
  --tg-base-button-text-default-color: var(--tg-text-white);
  --tg-base-button-line-border-color: var(--tg-primary-active);
  --tg-base-button-style-bg-hover: #1F9A75;
  --tg-text-lightgrey: #fff !important;
  --tg-border-color-grey-light: #DDDDDD !important;
}

[theme="white"] {
  --tg-base-button-color: #111;
  --tg-base-button-style-bg: #585858;
  --tg-base-button-line-border-color: #585858;
  --tg-base-button-style-bg-hover: #cbcbcb;
  --tg-base-button-style-bg-special: #F2CA5C;
  --tg-base-button-style-bg-special-hover: #B28406;
  --tg-secondary-text-color-theme-white: #111111;
  --tg-base-button-red-white-bg-color: #F2CA5C;
}
</style>

<style lang="scss" scoped>
button {
  color: var(--tg-base-button-color);
  font-size: var(--tg-base-button-font-size);
  border-radius: var(--tg-base-button-border-radius);
  font-weight: var(--tg-base-button-font-weight);
  transition: var(--tg-transition);
  min-width: var(--tg-base-button-min-width);
  max-width: var(--tg-base-button-max-width);
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
    padding: var(--tg-base-button-padding-y) var(--tg-base-button-padding-x);
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
    justify-content: var(--tg-base-button-justify-content);
  }

  &.loading {
    opacity: var(--tg-base-button-loading-opacity);
    pointer-events: none;
  }

  &:disabled {
    opacity: var(--tg-base-button-disabled-opacity);
    cursor: not-allowed;

    &:active {
      .content {
        transform: none;
      }
    }
  }

  &.disabled-btn {
    --tg-base-button-style-bg: #4D5D6F;

    @include webTheme('greenblack') {
      --tg-base-button-style-bg-hover: #1F9A75 !important;
    }

    @include webTheme('green') {
      --tg-base-button-style-bg: #0E6746;
      --tg-base-button-color: #3CB389;
      opacity: 1;
    }

    @include webTheme('white') {
      --tg-base-button-style-bg: #c1c1c1;
      color: white;
      opacity: 1;
    }

  }
}

.default {
  background-color: var(--tg-base-button-style-bg);

  &:active {
    .content {
      transform: scale(0.96);
    }
  }

  &.isMobile {
    &:active {
      // background-color: var(--tg-base-button-default-fake-active-bg);
    }
  }

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-button-style-bg-hover);
    --tg-icon-color: var(--tg-text-white);
  }
}

.text {
  color: var(--tg-base-button-text-default-color);

  &:active:not(.disabledClickTransition) {
    // color: var(--tg-text-white);

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
  border: 1px solid var(--tg-base-button-line-border-color);

  &:active {
    // background-color: var(--tg-base-button-line-active-color);

    .content {
      transform: scale(0.96);
    }
  }

  &:hover:not(:disabled):not(:active) {
    background-color: var(--tg-base-button-line-hover-color);
  }

  @include webTheme('green') {
    color: var(--tg-base-button-line-border-color);
  }

  @include webTheme('white') {
    color: var(--tg-base-button-line-border-color);
  }
}

.square-line {
  border: 1px solid var(--tg-base-button-square-line-border-color);
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
  --tg-base-button-style-bg: var(--tg-primary-active);
  --tg-base-button-style-bg-hover: var(--tg-sub-deepblue);
  background-color: var(--tg-base-button-style-bg);

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-button-style-bg-hover);
  }

  @include webTheme('green') {
    --tg-primary-active: #F6D14A;
    color: #02432D;

    &:hover:not(:disabled):not(.isMobile) {
      background-color: var(--tg-base-button-primary-hover);
    }
  }

  @include webTheme('greenblack') {
    --tg-base-button-style-bg: #00AE85;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #1F9A75;
    }
  }

  @include webTheme('white') {
    --tg-base-button-style-bg: #F2CA5C;
    --tg-base-button-color: var(--tg-text-white);

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #B28406;
    }

  }
}

.red {
  @include webTheme('white') {
    color: #111;
    background-color: var(--tg-base-button-red-white-bg-color);

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #CB980B;
    }
  }
}

.default-yellow {
  @include webTheme('white') {
    --tg-base-button-color: var(--tg-text-white);
    --tg-base-button-style-bg: #F5C132;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #B28406;
    }

  }
}

.empty {
  @include webTheme('white') {
    --tg-base-button-color: var(--tg-text-white);
    --tg-base-button-style-bg: white;
    --tg-base-button-style-bg-hover: white;
    border: 1px solid #484848;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-color: #A9A9A9;
      border: 1px solid #A9A9A9;
    }
  }
}

.secondary {
  --tg-base-button-style-bg: var(--tg-text-green);
  --tg-base-button-style-bg-hover: var(--tg-primary-success);
  background-color: var(--tg-base-button-style-bg);
  color: var(--tg-text-dark);
  --tg-icon-color: #000;

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-button-style-bg-hover);
    --tg-icon-color: var(--tg-base-button-secondary-icon-hover-color);
  }

  @include webTheme('green') {
    color: var(--tg-secondary-text-color-theme-green);
    --tg-base-button-style-bg: var(--tg-base-button-secondary-bg);

    &:hover:not(:disabled):not(.isMobile) {
      background-color: #ffc049;
    }
  }

  @include webTheme('greenblack') {
    --tg-base-button-style-bg: #26FFBE;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #1F9A75;
    }
  }

  @include webTheme('white') {
    color: var(--tg-secondary-text-color-theme-white);
    --tg-base-button-style-bg: var(--tg-base-button-style-bg-special);

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: var(--tg-base-button-style-bg-special-hover);
    }
  }
}

.dark {
  --tg-base-button-style-bg: var(--tg-secondary-dark);
  --tg-base-button-style-bg-hover: var(--tg-secondary-grey);
  background-color: var(--tg-base-button-style-bg);

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-button-style-bg-hover);
  }

  @include webTheme('green') {
    --tg-base-button-style-bg: var(--tg-base-button-style-bg-dark);

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #139468;
    }
  }

  @include webTheme('greenblack') {
    --tg-base-button-style-bg: #00654D;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #139468;
    }
  }

  @include webTheme('white') {
    --tg-base-button-style-bg: #F5C132;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #B28406;
    }
  }
}

.grey {
  --tg-base-button-style-bg: var(--tg-text-grey-third);
  --tg-base-button-style-bg-hover: var(--tg-secondary-grey);
  background-color: var(--tg-base-button-style-bg);

  &:hover:not(:disabled):not(.isMobile) {
    background-color: var(--tg-base-button-style-bg-hover);
  }

  @include webTheme('greenblack') {
    --tg-base-button-style-bg: #008F64;

    &:hover:not(:disabled):not(.isMobile) {
      --tg-base-button-style-bg-hover: #1F9A75;
    }
  }

  @include webTheme('white') {
    --tg-base-button-style-bg: #c1c1c1;
    color: #E3E3E3;
    opacity: 1;
  }

  &:disabled {
    @include webTheme('green') {
      --tg-base-button-style-bg: #0E6746;
    }
  }
}
</style>

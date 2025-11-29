<script setup lang="ts">
import { IconChessFrame2, IconSptSoccer } from '@tg/icons'

interface Props {
  type?: 'default' | 'text'
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
  name: 'SSBaseButton',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'xs',
  originType: 'button',
})

function onClick(e: any) {
  if (props.disabled)
    e.stopPropagation()
}
</script>

<template>
  <button
    :type="originType" :disabled="disabled" :class="[type, size, {
      shadow,
      loading,
      'custom-padding': customPadding,
      disabledClickTransition,
    }]"
  >
    <div v-if="loading" class="loading-icon">
      <IconSptSoccer v-if="sportsLoading" class="text-[var(--ss-base-button-color)] ani-scaleAndRotate" />
      <IconChessFrame2 v-else class="ani-roll text-[var(--ss-base-button-color)]" />
    </div>
    <div v-else class="content" @click="onClick">
      <slot />
    </div>
    <slot name="loadingText" />
  </button>
</template>

<style lang="scss">
:root {
  --ss-base-button-style-bg: #f23038;
  --ss-base-button-text-default-color: #0d2245;
  --ss-base-button-font-size: 14rem;
  --ss-base-button-font-weight: 600;
  --ss-base-button-padding-y: 12rem;
  --ss-base-button-padding-x: 12rem;
  --ss-base-button-disabled-opacity: 0.5;
  --ss-base-button-loading-opacity: 0.5;
  --ss-base-button-line-border-color: #0d2245;
  --ss-base-button-justify-content: center;
  --ss-base-button-min-width: auto;
  --ss-base-button-max-width: auto;
  --ss-base-button-border-radius: 4rem;
  --ss-base-button-secondary-icon-hover-color: #0d2245;
  --ss-base-button-square-line-border-color: #0d2245;
  --ss-base-button-color: #fff;
  --ss-base-button-default-fake-active-bg: #0f212e;
  --ss-base-button-border-color: var(--ss-base-button-style-bg);
}
</style>

<style lang="scss" scoped>
button {
  color: var(--ss-base-button-color);
  font-size: var(--ss-base-button-font-size);
  border-radius: var(--ss-base-button-border-radius);
  font-weight: var(--ss-base-button-font-weight);
  transition: all ease 0.25s;
  min-width: var(--ss-base-button-min-width);
  max-width: var(--ss-base-button-max-width);
  line-height: 1;
  max-width: 100%;

  &.none {
    padding: 0;
  }

  &.xs {
    padding: 12rem 12rem;
  }

  &.sm {
    padding: 13rem 16rem;
  }

  &.md {
    padding: 14rem 20rem;
  }

  &.lg {
    padding: 16rem 24rem;
  }

  &.xl {
    padding: 18rem 28rem;
  }

  &.custom-padding {
    padding: var(--ss-base-button-padding-y) var(--ss-base-button-padding-x);
  }

  .loading-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16rem;
  }

  .content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: var(--ss-base-button-justify-content);
  }

  &.loading {
    opacity: var(--ss-base-button-loading-opacity);
    pointer-events: none;
  }

  &:disabled {
    opacity: var(--ss-base-button-disabled-opacity);
    cursor: not-allowed;

    &:active {
      .content {
        transform: none;
      }
    }
  }
}

.default {
  background: var(--ss-base-button-style-bg);
  border: 1px solid var(--ss-base-button-border-color);

  &:active {
    .content {
      transform: scale(0.96);
    }
  }
}

.text {
  color: var(--ss-base-button-text-default-color);

  &:active:not(.disabledClickTransition):not(:disabled) {
    .content {
      transform: scale(0.96);
    }
  }
}

.round {
  border-radius: 100rem;
}

// 按钮loading动画
.ani-roll {
  transform-origin: center;
  animation-name: tg-roll;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes tg-roll {
  0%,
  5% {
    transform: rotate(0) translate(0);
  }

  15% {
    transform: rotate(45deg) translate(-10%, -10%);
  }

  20%,
  30% {
    transform: rotate(90deg) translate(0);
  }

  37.5% {
    transform: rotate(135deg) translate(-10%, 10%);
  }

  45%,
  55% {
    transform: rotate(180deg) translate(0);
  }

  62.5% {
    transform: rotate(225deg) translate(10%, 10%);
  }

  70%,
  80% {
    transform: rotate(270deg) translate(0);
  }

  87.5% {
    transform: rotate(315deg) translate(10%, -10%);
  }

  95%,
  to {
    transform: rotate(360deg) translate(0);
  }
}

// 体育下注按钮loading动画
.ani-scaleAndRotate {
  animation-name: tg-scaleAndRotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: cubic-bezier(0.87, -0.41, 0.19, 1.44);
}

@keyframes tg-scaleAndRotate {
  25% {
    transform: scale(1.3);
  }

  50% {
    transform: scale(1.3) rotate(-10deg);
  }

  75% {
    transform: scale(1.3) rotate(10deg);
  }
}
</style>

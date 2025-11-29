<script setup lang='ts'>
import { ref } from 'vue'

interface Props {
  /** 按钮类型 */
  type?: 'primary' | 'secondary' | 'default' | 'none'
  /** 加载状态 */
  loading?: boolean
  /** 禁用状态 */
  disabled?: boolean
  htmlType?: 'submit'
  animal?: boolean
  /** 显示阴影 */
  showShadow?: boolean
}

defineOptions({ name: 'AfunBaseButton' })
const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
  animal: true,
})
const btnRef = ref(null)

function handleClick() {
  addAnimal()
}
function addAnimal() {
  if (!props.animal)
    return
  const el = btnRef.value as HTMLButtonElement | null
  if (!el)
    return
  const div = document.createElement('div')
  div.className = 'btn-click-origin-animating'
  el.appendChild(div)

  setTimeout(() => {
    div.remove()
  }, 800)
}
</script>

<template>
  <button
    ref="btnRef" :type="htmlType" :class="[type, { loading, showShadow }]" :disabled="disabled" @click="handleClick"
  >
    <svg v-if="loading" class="loading-warp" style="width: 22px;" viewBox="0 0 32 32">
      <circle class="circle-path" cx="16" cy="16" r="8" fill="none" />
    </svg>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<style>
:root {
  --afun-base-button-font-size: 16px;
  --afun-base-button-font-weight: 600;
  --afun-base-button-border-radius: 4px;
  --afun-base-button-padding-y: 10px;
  --afun-base-button-padding-x: 10px;
  --afun-base-button-line-height: 1.42857143;
  --afun-base-button-primary-text-color: #05080a;
  --afun-base-button-primary-background-color: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  --afun-base-button-border-color: transparent;
  --afun-base-button-secondary-text-color: #fff;
  --afun-base-button-secondary-background-color: #1475e1;
  --afun-base-button-default-text-color: #fff;
  --afun-base-button-default-background-color: #0f212e;
  --afun-base-button-disabled-opacity: 0.65;
}
</style>

<style lang='scss' scoped>
button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: var(--afun-base-button-line-height);
  font-size: var(--afun-base-button-font-size);
  font-weight: var(--afun-base-button-font-weight);
  border-radius: var(--afun-base-button-border-radius);
  padding: var(--afun-base-button-padding-y) var(--afun-base-button-padding-x);
  // border: 1px solid;
  // border-color: var(--afun-base-button-border-color);
  cursor: pointer;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }
  &:disabled {
    opacity: var(--afun-base-button-disabled-opacity);
    pointer-events: none;
  }
}
.loading {
  opacity: var(--afun-base-button-disabled-opacity);
}
.primary {
  color: var(--afun-base-button-primary-text-color);
  background: var(--afun-base-button-primary-background-color);
  border-radius: var(--afun-base-button-border-radius);

  &.showShadow {
    box-shadow: 0px 2px 0px 0px rgba(5, 145, 255, 0.1);
  }
}
.secondary {
  color: var(--afun-base-button-secondary-text-color);
  background: var(--afun-base-button-secondary-background-color);
}
.default {
  color: var(--afun-base-button-default-text-color);
  background: var(--afun-base-button-default-background-color);
}
.none {
  padding: 0;
}

.loading-warp {
  animation: rotate 1s linear infinite;
  transform-origin: center;
}

.circle-path {
  stroke: #05080a;
  stroke-width: 1.5px;
  stroke-linecap: round;
  stroke-dasharray: 16 35;
  stroke-dashoffset: 16;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>

<style>
.btn-click-origin-animating {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: 0 0 0 0 var(--afun-base-button-primary-background-color);
  opacity: 0.3;
  animation-fill-mode: forwards;
  display: block;
  pointer-events: none;
}
@keyframes waveEffect {
  100% {
    box-shadow: var(--afun-base-button-primary-background-color) 0 0 0 8px;
  }
}
@keyframes fadeEffect {
  100% {
    opacity: 0;
  }
}
</style>

<script setup lang='ts'>
import { ref } from 'vue'

interface Props {
  /** 按钮类型 */
  type?: 'primary' | 'secondary' | 'none'
  /** 加载状态 */
  loading?: boolean
  /** 禁用状态 */
  disabled?: boolean
  htmlType?: 'submit'
  animal?: boolean
  /** 显示阴影 */
  showShadow?: boolean
}

defineOptions({ name: 'PhBaseButton' })
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
    <svg v-if="loading" class="loading-warp" style="width: 22rem;" viewBox="0 0 32 32">
      <circle class="circle-path" cx="16" cy="16" r="8" fill="none" />
    </svg>
    <template v-else>
      <slot />
    </template>
  </button>
</template>

<style>
:root {
  --ph-base-button-font-size: 16rem;
  --ph-base-button-font-weight: 600;
  --ph-base-button-border-radius: 8rem;
  --ph-base-button-padding-y: 10rem;
  --ph-base-button-padding-x: 10rem;
  --ph-base-button-line-height: 22rem;
  --ph-base-button-primary-text-color: #fff;
  --ph-base-button-primary-background-color: #f23038;
  --ph-base-button-border-color: transparent;
  --ph-base-button-secondary-text-color: #293140;
  --ph-base-button-secondary-background-color: #f0f1f5;
  --ph-base-button-disabled-opacity: 0.65;
}
</style>

<style lang='scss' scoped>
button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  line-height: var(--ph-base-button-line-height);
  font-size: var(--ph-base-button-font-size);
  font-weight: var(--ph-base-button-font-weight);
  border-radius: var(--ph-base-button-border-radius);
  padding: var(--ph-base-button-padding-y) var(--ph-base-button-padding-x);
  border: 1px solid;
  border-color: var(--ph-base-button-border-color);
  cursor: pointer;
  white-space: nowrap;

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      opacity: 0.8;
    }
  }
  &:disabled {
    opacity: var(--ph-base-button-disabled-opacity);
    pointer-events: none;
  }
}
.loading {
  opacity: var(--ph-base-button-disabled-opacity);
}
.primary {
  color: var(--ph-base-button-primary-text-color);
  background-color: var(--ph-base-button-primary-background-color);

  &.showShadow {
    box-shadow: 0px 2px 0px 0px rgba(5, 145, 255, 0.1);
  }
}
.secondary {
  color: var(--ph-base-button-secondary-text-color);
  background-color: var(--ph-base-button-secondary-background-color);
}
.none {
  padding: 0;
}

.loading-warp {
  animation: rotate 1s linear infinite;
  transform-origin: center;
}

.circle-path {
  stroke: #fff;
  stroke-width: 1.5rem;
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
  box-shadow: 0 0 0 0 var(--ph-base-button-primary-background-color);
  opacity: 0.3;
  animation-fill-mode: forwards;
  display: block;
  pointer-events: none;
}
@keyframes waveEffect {
  100% {
    box-shadow: var(--ph-base-button-primary-background-color) 0 0 0 8rem;
  }
}
@keyframes fadeEffect {
  100% {
    opacity: 0;
  }
}
</style>

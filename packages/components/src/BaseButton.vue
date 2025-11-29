<script setup lang="ts">
interface Props {
  /** 按钮类型 */
  type?: 'primary' | 'secondary' | 'none'
  /** 加载状态 */
  loading?: boolean
  /** 禁用状态 */
  disabled?: boolean
  htmlType?: 'submit'
}

defineOptions({ name: 'BaseButton' })

const props = withDefaults(defineProps<Props>(), {
  type: 'primary',
})

const emit = defineEmits<{
  /** 点击事件 */
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button class="h-10 rounded-lg text-base" :type="htmlType" :class="[type]" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }
}

.primary {
  color: #000;
  background-image: linear-gradient(90deg, #24ee89, #9fe871);
  box-shadow:
    0 0 12px #23ee884d,
    0 -2px #1dca6a inset;
}
.secondary {
  color: #fff;
  border-radius: 8px;
  background: #3a4142;
}
</style>

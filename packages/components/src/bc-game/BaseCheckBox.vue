<script setup lang="ts">
interface Props {
  modelValue?: boolean // 复选框的值
  disabled?: boolean // 是否禁用
}

// 定义组件属性
withDefaults(defineProps<Props>(), {
  modelValue: false,
  disabled: false,
})

// 定义事件
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'change': [value: boolean]
}>()

// 处理复选框变化
function handleChange(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
  emit('change', target.checked)
}
</script>

<template>
  <label class="base-checkbox" :class="{ 'is-disabled': disabled }">
    <input type="checkbox" :checked="modelValue" :disabled="disabled" @change="handleChange">
    <span class="checkbox-inner" />
  </label>
</template>

<style scoped lang="scss">
.base-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  input[type='checkbox'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .checkbox-inner {
    position: relative;
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 0.125rem solid #3a4142;
    border-radius: 0.25rem;
    background-color: #232626;
    transition: all 0.3s;

    &::after {
      position: absolute;
      content: '';
      top: 0.125rem;
      left: 0.25rem;
      width: 0.3125rem;
      height: 0.5rem;
      border: 0.1875rem solid #232626;
      border-left: 0;
      border-top: 0;
      transform: rotate(45deg) scaleY(0);
      transition: transform 0.15s ease-in;
    }
  }

  input[type='checkbox']:checked + .checkbox-inner {
    background-color: #24ee89;
    border-color: #24ee89;

    &::after {
      transform: rotate(45deg) scaleY(1);
    }
  }

  .checkbox-label {
    padding-left: 0.5rem;
    font-size: 0.875rem;
    line-height: 1;
  }
}
</style>

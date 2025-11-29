<script setup lang="ts">
interface Props {
  modelValue: boolean
  disabled?: boolean
}
defineOptions({
  name: 'BaseSwitch',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])

function onClick() {
  if (props.disabled)
    return
  emit('update:modelValue', !props.modelValue)
  emit('change', !props.modelValue)
}
</script>

<template>
  <div class="base-switch" :class="{ active: modelValue, disabled }" @click="onClick">
    <div class="circle" />
  </div>
</template>

<style>
:root{
  --tg-base-switch-style-bg: linear-gradient(90deg, #24ee89, #9fe871);
}
</style>

<style scoped lang="scss">
.base-switch {
  width: var(--tg-spacing-40);
  height: var(--tg-spacing-24);
  background-color: var(--tg-secondary-main);
  padding: var(--tg-spacing-2);
  border-radius: 100px;
  cursor: pointer;
  @include webTheme('white') {
    background-color: #484848;
  }

  .circle {
    width: var(--tg-spacing-20);
    height: var(--tg-spacing-20);
    background-color: var(--tg-text-white);
    border-radius: 50%;
    transition: all ease-out .3s;
    @include webTheme('white') {
      background-color: white;
    }
  }
}

.active {
  background: var(--tg-base-switch-style-bg);
  @include webTheme('white') {
    background-color: #F5C132;
  }

  .circle {
    transform: translateX(var(--tg-spacing-16));
  }
}
.disabled{
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

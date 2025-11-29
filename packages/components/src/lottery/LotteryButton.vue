<script setup lang="ts" name="LotteryButton">
interface Props {
  type?: 'default'
  htmlType?: 'submit'
  disabled?: boolean
  loading?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
})
</script>

<template>
  <button class="cursor-pointer" :class="`btn-${type}`" :disabled="disabled">
    <slot />
  </button>
</template>

<style>
:root {
  --lot-base-btn-border-radius: 6rem;
  --lot-base-btn-box-shadow: none;
  --lot-base-btn-default-color: #0d2245;
  --lot-base-btn-default-bg-color: #ebebeb;
}
</style>

<style scoped lang="scss">
button {
  text-align: center;
  font-size: 14rem;
  font-weight: 600;
  border-radius: var(--lot-base-btn-border-radius);
  box-shadow: var(--lot-base-btn-box-shadow);

  &:disabled {
    pointer-events: none;
    opacity: 0.6;
  }
}
</style>

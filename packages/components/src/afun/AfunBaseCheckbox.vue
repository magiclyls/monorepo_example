<script lang="ts" setup>
import { IconPasswordHook1 } from '@tg/icons'

interface Props {
  modelValue: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
const emit = defineEmits(['update:modelValue', 'change'])
function onClick() {
  emit('update:modelValue', !props.modelValue)
  emit('change', !props.modelValue)
}
</script>

<template>
  <div class="flex items-center gap-x-[4px]" :class="{ disabled }" @click="onClick">
    <div
      class="size-[var(--afun-base-checkbox-size)] rounded-[4px] border-[2px] flex justify-center items-center  cursor-pointer"
      :style="{
        'border-color': props.modelValue ? 'var(--afun-base-checked-border)' : 'var(--afun-base-check-border)',
        'background': props.modelValue ? 'var(--afun-base-checked-bg)' : 'var(--afun-base-check-bg)',
      }"
    >
      <IconPasswordHook1 v-if="modelValue" style="font-size: calc(var(--afun-base-checkbox-size) / 2)" class="text-(--afun-base-checked-color)" />
    </div>
    <span class="label">
      <slot />
    </span>
  </div>
</template>

<style>
:root {
  /* 未点击 */
  --afun-base-check-border: #2f4552;
  --afun-base-check-bg: #0f212e;
  /* 已点击 */
  --afun-base-checked-border: transparent;
  --afun-base-checked-bg: #24ee89;
  --afun-base-checked-color: #05080a;
  --afun-base-checkbox-size: 16px;
  --afun-base-checkbox-label-color: #fff;
  --afun-base-checkbox-label-font-size: 12px;
  --afun-base-checkbox-label-font-weight: 600;
}
</style>

<style lang='scss' scoped>
.label {
  color: var(--afun-base-checkbox-label-color);
  font-size: var(--afun-base-checkbox-label-font-size);
  font-weight: var(--afun-base-checkbox-label-font-weight);
}
</style>

<script lang="ts" setup>
import { IconCheck2 } from '@tg/icons'

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
  <div class="flex items-center gap-x-[4rem]" :class="{ disabled }" @click="onClick">
    <div
      class="size-[var(--tg-base-checkbox-size)] rounded-[4rem] border-[1rem] border-[var(--tg-base-checked-border)] bg-[var(--tg-base-checked-bg)] flex justify-center items-center  cursor-pointer"
    >
      <IconCheck2 v-if="modelValue" style="font-size: calc(var(--tg-base-checkbox-size) / 2)" class="text-(--tg-base-checked-color)" />
    </div>
    <span class="label">
      <slot />
    </span>
  </div>
</template>

<style>
:root {
  --tg-base-checked-border: #ebebeb;
  --tg-base-checked-bg: #fff;
  --tg-base-checked-color: red;
  --tg-base-checkbox-size: 16rem;
  --tg-base-checkbox-label-color: #fff;
  --tg-base-checkbox-label-font-size: 12rem;
  --tg-base-checkbox-label-font-weight: 500;
}
</style>

<style lang='scss' scoped>
.label {
  color: var(--tg-base-checkbox-label-color);
  font-size: var(--tg-base-checkbox-label-font-size);
  font-weight: var(--tg-base-checkbox-label-font-weight);
}
</style>

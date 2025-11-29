<script setup lang="ts" name="LotteryCheckBox">
import { IconLotChecked } from '@tg/icons'

interface Props {
  modelValue: boolean
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue'])
function toggle() {
  emits('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div class="checkbox" :class="{ checked: modelValue }" @click="toggle">
    <IconLotChecked class="text-[12rem] check-icon" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  modelValue?: boolean
  disabled?: boolean
}

defineOptions({
  name: 'BaseSwitch',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  modelValue: false,
})
const emit = defineEmits(['update:modelValue'])
const popperClass = computed(() => {
  return {
    'switch': true,
    'bg-switch-bright': !props.modelValue,
    'bg-switch-checked': props.modelValue,
  }
})

function switchClick() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <div :class="popperClass" @click="switchClick">
    <div />
  </div>
</template>

<style lang="scss" scoped>
.switch {
  background: linear-gradient(0deg, #0000000d, 0%, #0000000d 100%), rgb(58, 65, 66);
  cursor: pointer;
  border-radius: 9999px;
  padding: 0.25rem;
  transition-property: all;
  transition-duration: 0.15s;
  width: 4rem;
  height: 2.25rem;
  div {
    width: 1.75rem;
    height: 1.75rem;
    margin-left: 0px;
    background: linear-gradient(0deg, #ffffff33 0%, #ffffff33 100%), rgb(74, 83, 84);
    border-radius: 9999px;
    --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
    --tw-shadow-color: rgb(0 0 0 / 0.2);
    --tw-shadow: var(--tw-shadow-colored);
    transition-property: all;
    transition-duration: 0.15s;
  }
}
.bg-switch-checked {
  background: rgb(36, 238, 137);
  div {
    margin-left: 1.75rem;
    background-color: #fff;
  }
}
.bg-switch-bright {
  background-color: rgb(41, 45, 46);
}
.switch-xs {
  width: 2.75rem;
  height: 1.5rem;
}
</style>

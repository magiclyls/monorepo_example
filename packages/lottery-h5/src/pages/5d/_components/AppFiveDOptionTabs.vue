<script setup lang='ts'>
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  list: {
    label: string
    value: string | number
  }[]
}
defineOptions({ name: 'AppFiveDOptionTabs' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])
const _list = computed(() => props.list.map((a) => {
  return {
    ...a,
    active: a.value === props.modelValue,
  }
}))

function onClick(v: string | number) {
  emit('update:modelValue', v)
  emit('change', v)
}
</script>

<template>
  <div class="wrap">
    <div
      v-for="item, i in _list" :key="item.value" class="tab" :class="{ active: item.active, last: i === _list.length - 1 }"
      @click="onClick(item.value)"
    >
      <div class="label">
        {{ item.label }}
      </div>
      <div class="dot" />
    </div>
  </div>
</template>

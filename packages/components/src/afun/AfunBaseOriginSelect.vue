<script setup lang='ts'>
import { IconUniStakeArrowDown } from '@tg/icons'

defineOptions({
  name: 'AfunBaseOriginSelect',
})
defineProps<Props>()
const emits = defineEmits(['update:modelValue'])
interface Props {
  modelValue: string
  options: { label: string, value: string }[]
}

function onChange(e: Event) {
  const target = e.target as HTMLSelectElement | null
  if (target) {
    emits('update:modelValue', target.value)
  }
}
</script>

<template>
  <div class="relative pr-[14px]">
    <select :value="modelValue" :style="{ width: `${modelValue?.length * 11}px` }" class="appearance-none leading-[20px] text-center box-border px-[4px] w-full" @click.stop @change="onChange">
      <option
        v-for="(o, i) in options"
        :key="i"
        :value="o.value"
      >
        {{ o.label }}
      </option>
    </select>
    <div class="absolute top-[50%] right-0 center pointer-events-none" style="transform: translate(0,-50%);">
      <IconUniStakeArrowDown class="text-[14px] text-[#fff]" />
    </div>
  </div>
</template>

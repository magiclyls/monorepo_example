<script setup lang='ts'>
import { IconLoginFlagArrow } from '@tg/icons'

defineOptions({
  name: 'PhBaseOriginSelect',
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
  <div class="relative pr-[14rem]">
    <select :value="modelValue" :style="{ width: `${modelValue?.length * 11}rem` }" class="appearance-none leading-[20rem] text-center box-border px-[4rem] w-full" @click.stop @change="onChange">
      <option
        v-for="(o, i) in options"
        :key="i"
        :value="o.value"
      >
        {{ o.label }}
      </option>
    </select>
    <div class="absolute top-[50%] -translate-y-[50%] right-0 pointer-events-none">
      <IconLoginFlagArrow class="text-[14rem] text-[#9dabc9]" />
    </div>
  </div>
</template>

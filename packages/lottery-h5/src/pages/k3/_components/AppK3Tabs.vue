<script lang="ts" setup name="LotteryKindTabs">
export interface Tabs {
  label: string
  value: any
}
interface Props {
  tabs: Tabs[]
  modelValue: any
}
const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue', 'change'])

function onChange(value: any) {
  emits('change', value)
  emits('update:modelValue', value)
}
</script>

<template>
  <div class="center gap-[1.67rem]">
    <div v-for="item of tabs" :key="item.value" :class="{ active: modelValue === item.value }" class="item center flex-1" @click="onChange(item.value)">
      <span class="">
        {{ item.label }}
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
</style>

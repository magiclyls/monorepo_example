<script lang="ts" setup name="LotteryKindTabs">
import { computed } from 'vue'
import LotteryImage from './LotteryImage.vue'

export interface Tabs {
  label: string
  value: number
}
interface Props {
  tabs: Tabs[]
  modelValue: number
  col?: number
  project?: string
}
const props = withDefaults(defineProps<Props>(), {
  col: 5,
  project: 'ph-h5',
})
const emits = defineEmits(['update:modelValue', 'change'])

const activeUrl = computed(() => `/lottery/png/${props.project}-watch-active.png`)

function onChange(value: number) {
  emits('change', value)
  emits('update:modelValue', value)
}
</script>

<template>
  <div>
    <div class="h-[90rem] lottery-kind-tabs-bg1 rounded-[8rem] grid items-center text-[12rem] leading-[14rem] font-[500]" :style="{ gridTemplateColumns: `repeat(${col}, 1fr)` }">
      <div v-for="item of tabs" :key="item.value" :class="{ 'watch-active': modelValue === item.value }" class="h-full cursor-pointer w-full pt-[6rem]" @click="onChange(item.value)">
        <div class="center">
          <LotteryImage v-show="modelValue !== item.value" url="/lottery/png/watch.png" class="size-[52rem]" />
          <LotteryImage v-show="modelValue === item.value" :url="activeUrl" class="size-[52rem]" />
        </div>
        <div class="text-center">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <style scoped lang="scss">
.watch-active {
  color: #f23038;
  border-radius: 8rem;
  background: linear-gradient(0deg, #fff9fa 0%, #f23038 100%);
  box-shadow: 0 -1rem 4rem 0 #ffdfdb inset;
}
</style> -->

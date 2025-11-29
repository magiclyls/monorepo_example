<script setup lang='ts'>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  total?: number
  percentage?: number
  isSports?: boolean
}
defineOptions({
  name: 'SSAppPercentage',
})
const props = withDefaults(defineProps<Props>(), {
  total: 0,
  percentage: 0,
})

const { t } = useI18n()

const componentPercent = computed<number>(() => {
  return Number(((props.percentage / props.total) * 100).toFixed(2))
})
</script>

<template>
  <div class="w-full flex flex-col  items-center">
    <div class="w-[180rem] my-[11rem] h-[2rem] bg-[var(--ss-app-percentage-bg1)] overflow-hidden">
      <div class="h-full bg-[var(--ss-app-percentage-bg2)]" :style="{ width: `${componentPercent}%` }" />
    </div>
    <span class="text-[14rem] text-[var(--ss-app-percentage-color1)] leading-[20rem]">
      {{ t('正显示赛事比例', { total: props.total, percentage: props.percentage }) }}
    </span>
  </div>
</template>

<style lang='scss'>
:root {
  --ss-app-percentage-bg1: #b1bad3;
  --ss-app-percentage-bg2: #1475e1;
  --ss-app-percentage-color1: #b1bad3;
}
</style>

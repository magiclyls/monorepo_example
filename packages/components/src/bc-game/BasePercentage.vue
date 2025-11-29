<script setup lang='ts'>
import { computed } from 'vue'
import BaseProgress from '../src/BaseProgress.vue'

interface Props {
  total?: number
  percentage?: number
  isSports?: boolean
}
defineOptions({
  name: 'BasePercentage',
})
const props = withDefaults(defineProps<Props>(), {
  total: 0,
  percentage: 0,
})

const componentPercent = computed<number>(() => {
  return Number(((props.percentage / props.total) * 100).toFixed(2))
})
</script>

<template>
  <div class="app-percentage">
    <BaseProgress :value="componentPercent" bar-color="#24ee89" background-color="#323738" height="8px" />
  </div>
</template>

<style lang='scss' scoped>
.app-percentage {
  text-align: center;
  &-bar {
    margin: 0 auto;
  }
}
</style>

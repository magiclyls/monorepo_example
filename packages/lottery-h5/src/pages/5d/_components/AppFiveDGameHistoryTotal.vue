<script setup lang='ts'>
import type { LotteryApiCpTrend5DHistoryItem } from '@tg/types'

interface Props {
  row: LotteryApiCpTrend5DHistoryItem
}

defineOptions({ name: 'AppFiveDGameHistoryTotal' })
defineProps<Props>()
</script>

<template>
  <div class="w-full min-w-[75rem] flex items-center justify-center">
    <div class="w-[19rem] h-[19rem] bg-[#1D864C] text-[#fff] text-[11rem] rounded-[50%] flex items-center justify-center">
      {{ row.sum }}
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

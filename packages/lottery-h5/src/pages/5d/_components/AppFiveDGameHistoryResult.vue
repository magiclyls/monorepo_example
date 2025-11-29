<script setup lang='ts'>
import type { LotteryApiCpTrend5DHistoryItem } from '@tg/types'
import { computed } from 'vue'

interface Props {
  row: LotteryApiCpTrend5DHistoryItem
}

defineOptions({ name: 'AppFiveDGameHistoryResult' })
const props = defineProps<Props>()

const result = computed(() => props.row.result.split(','))
</script>

<template>
  <div class="flex items-center justify-center">
    <span v-for="num, i in result" :key="`${row.issue}-${num}-${i}`" class="result-num">{{ num }}</span>
  </div>
</template>

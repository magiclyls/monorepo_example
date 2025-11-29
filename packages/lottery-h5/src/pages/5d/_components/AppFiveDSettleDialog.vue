<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { computed } from 'vue'
import AppWinLoseSettle from '../../../components/AppWinLoseSettle.vue'

interface Props {
  data: {
    type: 'Win' | 'Lose'
    name: string
    period: string
    amount: string
    currencyId: CurrencyCode
    balls: string
  }
}

defineOptions({ name: 'AppFiveDSettleDialog' })
const props = defineProps<Props>()
const emits = defineEmits(['close'])
const tabs = ['A', 'B', 'C', 'D', 'E', 'SUM']
const result = computed(() => {
  const arr = props.data.balls.split(',')
  const sum = arr.reduce((pre, cur) => {
    return Number(pre) + Number(cur)
  }, 0)

  return [...arr, sum]
})
</script>

<template>
  <AppWinLoseSettle v-bind="data" @close="emits('close')">
    <div class="flex flex-col items-center">
      <div class="text-[11rem] text-[#fff] leading-[15rem]">
        Lottery results
      </div>
      <div class="flex">
        <div v-for="item, i in tabs" :key="item" class="flex flex-col items-center">
          <div class="flex items-end mb-[3rem]">
            <div
              class="w-[25rem] h-[25rem]  text-[#fff] bg-[#FDAC32] rounded-t-full flex items-center justify-center"
              :class="i === tabs.length - 1 ? 'text-[11rem]' : 'text-[15rem]'"
            >
              {{ item }}
            </div>
            <div class="w-[4rem] h-[4rem] bg-[#FDAC32]" />
          </div>
          <div
            class="w-[22rem] text-[11rem] text-[#fff] h-[22rem] rounded-full border-solid border-[1rem] border-[#fff] flex items-center justify-center"
          >
            {{ result[i] }}
          </div>
        </div>
      </div>
    </div>
  </AppWinLoseSettle>
</template>

<style lang='scss' scoped></style>

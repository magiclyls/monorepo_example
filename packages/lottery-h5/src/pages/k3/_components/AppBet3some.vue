<script lang="ts" setup>
import type { LotteryBetItem } from '@tg/types'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useK3Store } from '../../../stores/useK3Store'
import { k3IdToKindMap } from '../../../utils/lotteryMaps'
import AppBetItem from './AppBetItem.vue'

interface Props {
  data: any
}
const props = defineProps<Props>()
const { $$t } = useLocale()
const k3Store = useK3Store()
const { K3BetData } = storeToRefs(k3Store)

const betArr1 = ref<LotteryBetItem[]>([])
const betArr2 = ref<LotteryBetItem[]>([])

const odds307 = computed(() => {
  return props.data?.odds.find((i: any) => i.play_id === 307)?.odds
})
const odds308 = computed(() => {
  return props.data?.odds.find((i: any) => i.play_id === 308)?.odds
})
const totalBetData = computed(() => {
  return {
    betArr1: [...betArr1.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 307,
        odds: odds307.value,
      }
    }),
    betArr2: [...betArr2.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 308,
        odds: odds308.value,
      }
    }),

  }
})
const isStartBet = computed(() => {
  return betArr1.value.length > 0 || (betArr2.value.length > 0)
})
const balls = [
  {
    label: '111',
    balls: [1, 1, 1],
  },
  {
    label: '222',
    balls: [2, 2, 2],
  },
  {
    label: '333',
    balls: [3, 3, 3],
  },
  {
    label: '444',
    balls: [4, 4, 4],
  },
  {
    label: '555',
    balls: [5, 5, 5],
  },
  {
    label: '666',
    balls: [6, 6, 6],
  },

]

const greeballs = [
  {
    label: k3IdToKindMap(308, $$t).label,
    balls: [],
  },
]

function toggleBet(item: LotteryBetItem, type: number) {
  // type: 1,2
  const currentArr = [betArr1, betArr2][type - 1]
  const found = currentArr.value.find((i: LotteryBetItem) => (i.label === item.label))
  if (found) {
    currentArr.value = currentArr.value.filter((i: LotteryBetItem) => i.label !== item.label)
  }
  else {
    currentArr.value = [...currentArr.value, item]
  }
}

watch(K3BetData, (b) => {
  if (!b) {
    // onclose清空
    betArr1.value = []
    betArr2.value = []
  }
})
watch([totalBetData, isStartBet], ([v, s]) => {
  if (s) {
    k3Store.startBet(v, 3)
  }
  else {
    k3Store.closePop()
  }
})
</script>

<template>
  <div class="pt-[8rem] flex flex-col gap-[14rem]">
    <AppBetItem
      :title="`${k3IdToKindMap(307, $$t).label}: ${$$t('赔率', { n: odds307 })}`"
      :rule-type="3"

      :data="balls"
      :betted-arr="betArr1"
      :type="1"
      @toggle="(item) => {
        toggleBet(item, 1)
      }"
    />
    <AppBetItem
      :title="`${k3IdToKindMap(308, $$t).label}: ${$$t('赔率', { n: odds308 })}`"
      :rule-type="4"

      :data="greeballs"
      :betted-arr="betArr2"
      :type="3"
      @toggle="(item) => {
        toggleBet(item, 2)
      }"
    />
  </div>
</template>

<style scoped lang="scss">

</style>

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
const betArr3 = ref<LotteryBetItem[]>([])

const odds309 = computed(() => {
  return props.data?.odds.find((i: any) => i.play_id === 309)?.odds
})
const odds310 = computed(() => {
  return props.data?.odds.find((i: any) => i.play_id === 310)?.odds
})
const odds311 = computed(() => {
  return props.data?.odds.find((i: any) => i.play_id === 311)?.odds
})
const totalBetData = computed(() => {
  return {
    betArr1: [...betArr1.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 309,
        odds: odds309.value,
      }
    }),
    betArr2: [...betArr2.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 310,
        odds: odds310.value,
      }
    }),
    betArr3: [...betArr3.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 311,
        odds: odds311.value,
      }
    }),
  }
})
const isStartBet = computed(() => {
  return betArr1.value.length > 2 || betArr2.value.length > 0 || betArr3.value.length > 1
})

const singleBalls = [
  {
    label: '1',
    balls: [1],
  },
  {
    label: '2',
    balls: [2],
  },
  {
    label: '3',
    balls: [3],
  },
  {
    label: '4',
    balls: [4],
  },
  {
    label: '5',
    balls: [5],
  },
  {
    label: '6',
    balls: [6],
  },

]
const greenBalls = [
  {
    label: k3IdToKindMap(310, $$t).label,
  },
]
function toggleBet(item: LotteryBetItem, type: number) {
  // type: 1,2,3
  const currentArr = [betArr1, betArr2, betArr3][type - 1]
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
    betArr3.value = []
  }
})
watch([totalBetData, isStartBet], ([v, s]) => {
  if (s) {
    k3Store.startBet(v, 4)
  }
  else {
    k3Store.closePop()
  }
})
</script>

<template>
  <div class="pt-[8rem] flex flex-col gap-[14rem]">
    <AppBetItem
      :title="`${k3IdToKindMap(309, $$t).label}: ${$$t('赔率', { n: odds309 })}`"
      :rule-type="5"

      :data="singleBalls"
      :betted-arr="betArr1"
      :type="1"
      @toggle="(item) => {
        toggleBet(item, 1)
      }"
    />
    <AppBetItem
      :title="`${k3IdToKindMap(310, $$t).label}: ${$$t('赔率', { n: odds310 })}`"
      :rule-type="6"

      :data="greenBalls"
      :betted-arr="betArr2"
      :type="3"
      @toggle="(item) => {
        toggleBet(item, 2)
      }"
    />
    <AppBetItem
      :title="`${k3IdToKindMap(311, $$t).label}: ${$$t('赔率', { n: odds311 })}`"
      :rule-type="7"

      :data="singleBalls"
      :betted-arr="betArr3"
      :type="1"
      @toggle="(item) => {
        toggleBet(item, 3)
      }"
    />
  </div>
</template>

<style scoped lang="scss">

</style>

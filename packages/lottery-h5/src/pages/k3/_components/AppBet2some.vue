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

const odds305 = computed(() => {
  return props.data?.odds.find((i: any) => i.play_id === 305)?.odds
})
const odds306 = computed(() => {
  return props.data?.odds.find((i: any) => i.play_id === 306)?.odds
})

const totalBetData = computed(() => {
  return {
    betArr1: [...betArr1.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 305,
        odds: odds305.value,
      }
    }),
    betArr2: [...betArr2.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 306,
        odds: odds306.value,
      }
    }),
    betArr3: [...betArr3.value].sort((a, b) => Number(a.label) - Number(b.label)).map((item) => {
      return {
        ...item,
        play_id: 306,
        odds: odds306.value,
      }
    }),
  }
})
const isStartBet = computed(() => {
  return betArr1.value.length > 0 || (betArr2.value.length > 0 && betArr3.value.length > 0)
})
const balls = [
  {
    label: '11',
    balls: [1, 1],
  },
  {
    label: '22',
    balls: [2, 2],
  },
  {
    label: '33',
    balls: [3, 3],
  },
  {
    label: '44',
    balls: [4, 4],
  },
  {
    label: '55',
    balls: [5, 5],
  },
  {
    label: '66',
    balls: [6, 6],
  },

]
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

function toggleBet(item: LotteryBetItem, type: number) {
  // type: 1,2,3
  const currentArr = [betArr1, betArr2, betArr3][type - 1]
  const found = currentArr.value.find((i: LotteryBetItem) => (i.label === item.label))
  if (found) {
    currentArr.value = currentArr.value.filter((i: LotteryBetItem) => i.label !== item.label)
  }
  else {
    // 处理互斥逻辑
    if (type === 2) {
      // 如果选择的是betArr2，需要从betArr3中移除相同标签
      betArr3.value = betArr3.value.filter((i: LotteryBetItem) => !item.label.includes(i.label))
    }
    else if (type === 3) {
      // 如果选择的是betArr3，需要从betArr2中移除相同标签
      betArr2.value = betArr2.value.filter((i: LotteryBetItem) => !i.label.includes(item.label))
    }

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
    k3Store.startBet(v, 2)
  }
  else {
    k3Store.closePop()
  }
})
</script>

<template>
  <div class="pt-[8rem] flex flex-col gap-[14rem]">
    <AppBetItem
      :title="`${k3IdToKindMap(305, $$t).label}: ${$$t('赔率', { n: odds305 })}`"
      :rule-type="1"
      :data="balls"
      :betted-arr="betArr1"
      :type="1"
      @toggle="(item) => {
        toggleBet(item, 1)
      }"
    />
    <AppBetItem
      :title="`${k3IdToKindMap(306, $$t).label}: ${$$t('赔率', { n: odds306 })}`"
      :rule-type="2"
      :data="balls"
      :betted-arr="betArr2"
      :type="2"

      :extra="singleBalls"
      :extra-betted-arr="betArr3"
      :extra-type="3"
      @toggle="(item, tag) => {
        toggleBet(item, tag ? 3 : 2)
      }"
    />
  </div>
</template>

<style scoped lang="scss">

</style>

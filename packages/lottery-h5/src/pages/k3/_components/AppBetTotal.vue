<script lang="ts" setup>
import type { LotteryBetItem } from '@tg/types'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useK3Store } from '../../../stores/useK3Store'

interface Props {
  data: any
}
const props = defineProps<Props>()
const { $$t } = useLocale()
const k3Store = useK3Store()
const { K3BetData } = storeToRefs(k3Store)
const totalBetData = ref<LotteryBetItem[]>([])
const balls: LotteryBetItem[] = [
  {
    label: '3',
    balls: [3],
    play_id: 312,
  },
  {
    label: '4',
    balls: [4],
    play_id: 313,
    even: true,
  },
  {
    label: '5',
    balls: [5],
    play_id: 314,
  },
  {
    label: '6',
    balls: [6],
    play_id: 315,
    even: true,
  },
  {
    label: '7',
    balls: [7],
    play_id: 316,
  },
  {
    label: '8',
    balls: [8],
    play_id: 317,
    even: true,
  },
  {
    label: '9',
    balls: [9],
    play_id: 318,
  },
  {
    label: '10',
    balls: [10],
    play_id: 319,
    even: true,
  },
  {
    label: '11',
    balls: [11],
    play_id: 319,
  },
  {
    label: '12',
    balls: [12],
    play_id: 318,
    even: true,
  },
  {
    label: '13',
    balls: [13],
    play_id: 317,
  },
  {
    label: '14',
    balls: [14],
    play_id: 316,
    even: true,
  },
  {
    label: '15',
    balls: [15],
    play_id: 315,
  },
  {
    label: '16',
    balls: [16],
    play_id: 314,
    even: true,
  },
  {
    label: '17',
    balls: [17],
    play_id: 313,
  },
  {
    label: '18',
    balls: [18],
    play_id: 312,
    even: true,
  },
]
const ballsWithOdds = computed(() => {
  return balls.map((item) => {
    return { ...item, odds: props.data?.odds.find((i: any) => i.play_id === item.play_id)?.odds }
  })
})
const bottomBtns: LotteryBetItem[] = [
  {
    label: $$t('大'),
    play_id: 301,
    bg: '#FFA82E',
  },
  {
    label: $$t('小'),
    play_id: 302,
    bg: '#6DA7F4',
  },
  {
    label: $$t('单'),
    play_id: 303,
    bg: '#1D864C',
  },
  {
    label: $$t('双'),
    play_id: 304,
    bg: '#40AD72',
  },
]
const bottomBtnsWithOdds = computed(() => {
  return bottomBtns.map((item) => {
    return { ...item, odds: props.data?.odds.find((i: LotteryBetItem) => i.play_id === item.play_id)?.odds }
  })
})
const isStartBet = computed(() => {
  return totalBetData.value.length > 0
})
function toggleBet(item: LotteryBetItem) {
  const found = totalBetData.value.find((i: LotteryBetItem) => (i.label === item.label))
  if (found) {
    totalBetData.value = totalBetData.value.filter((i: LotteryBetItem) => i.label !== item.label)
  }
  else {
    // 处理互斥逻辑
    let result: LotteryBetItem[] = totalBetData.value
    if (item.play_id === 301) {
      result = totalBetData.value.filter((i: LotteryBetItem) => i.play_id !== 302)
    }
    else if (item.play_id === 302) {
      result = totalBetData.value.filter((i: LotteryBetItem) => i.play_id !== 301)
    }
    else if (item.play_id === 303) {
      result = totalBetData.value.filter((i: LotteryBetItem) => i.play_id !== 304)
    }
    else if (item.play_id === 304) {
      result = totalBetData.value.filter((i: LotteryBetItem) => i.play_id !== 303)
    }
    totalBetData.value = [...result, item]
  }
}
watch(K3BetData, (b) => {
  if (!b) {
    // onclose清空
    totalBetData.value = []
  }
})
watch([totalBetData, isStartBet], ([v, s]) => {
  if (s) {
    k3Store.startBet(v, 1)
  }
  else {
    k3Store.closePop()
  }
})
</script>

<template>
  <div class="grid grid-cols-4 gap-x-[7.3rem] gap-y-[8rem] pt-[8rem]">
    <div
      v-for="(item, i) in ballsWithOdds" :key="item.play_id"
      class="center flex-col"
    >
      <div
        v-bg-image="i % 2 === 1 ? '/lottery/png/ball-green.png' : '/lottery/png/ball-red.png'"
        class="k3-ball center w-[44rem] h-[44rem]"
        @click="toggleBet(item)"
      >
        <span
          class="txt"
          :class="[
            i % 2 === 1 ? 'even' : 'odd',
          ]"
        >
          {{ item.label }}
        </span>
      </div>
      <div class="text-[11rem] k3-bet-total-text">
        {{ item.odds }}X
      </div>
    </div>
    <div
      v-for="(item, i) in bottomBtnsWithOdds"
      :key="item.play_id"
      class="center flex-col text-[#fff] rounded-[5rem] py-[4rem]"
      :style="{
        background: item.bg,
      }"
      @click="toggleBet(item)"
    >
      <div class="text-[16rem]">
        {{ item.label }}
      </div>
      <div class="text-[11rem] leading-[12rem]">
        {{ item.odds }}X
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.k3-ball {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  .txt {
    font-size: 20rem;
    font-weight: 700;
  }
  .odd {
    background: linear-gradient(180deg, #f6625d 16.3%, #e93333 80.43%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .even {
    background: linear-gradient(180deg, #46c57f 13.04%, #2a995e 83.7%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>

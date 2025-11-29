<script setup lang='ts'>
import type { ILotteryOddsItem } from '@tg/types'
import { LotteryFiveDBetPos } from '@tg/types'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { use5DStore } from '../../../stores/use5DStore'
import AppFiveDOptionTabs from './AppFiveDOptionTabs.vue'

interface Props {
  data: ILotteryOddsItem[]
  isInPop?: boolean
}
defineOptions({ name: 'AppFiveDBetPanel' })
const props = defineProps<Props>()
const emit = defineEmits(['openPop'])

const { $$t } = useLocale()

const totalOptions = {
  [LotteryFiveDBetPos.A]: {
    ball: 401,
    bsoe: [
      { label: $$t('大'), play_id: 402, value: 'Big' },
      { label: $$t('小'), play_id: 403, value: 'Small' },
      { label: $$t('单'), play_id: 404, value: 'Odd' },
      { label: $$t('双'), play_id: 405, value: 'Even' },
    ],
  },
  [LotteryFiveDBetPos.B]: {
    ball: 406,
    bsoe: [
      { label: $$t('大'), play_id: 407, value: 'Big' },
      { label: $$t('小'), play_id: 408, value: 'Small' },
      { label: $$t('单'), play_id: 409, value: 'Odd' },
      { label: $$t('双'), play_id: 410, value: 'Even' },
    ],
  },
  [LotteryFiveDBetPos.C]: {
    ball: 411,
    bsoe: [
      { label: $$t('大'), play_id: 412, value: 'Big' },
      { label: $$t('小'), play_id: 413, value: 'Small' },
      { label: $$t('单'), play_id: 414, value: 'Odd' },
      { label: $$t('双'), play_id: 415, value: 'Even' },
    ],
  },
  [LotteryFiveDBetPos.D]: {
    ball: 416,
    bsoe: [
      { label: $$t('大'), play_id: 417, value: 'Big' },
      { label: $$t('小'), play_id: 418, value: 'Small' },
      { label: $$t('单'), play_id: 419, value: 'Odd' },
      { label: $$t('双'), play_id: 420, value: 'Even' },
    ],
  },
  [LotteryFiveDBetPos.E]: {
    ball: 421,
    bsoe: [
      { label: $$t('大'), play_id: 422, value: 'Big' },
      { label: $$t('小'), play_id: 423, value: 'Small' },
      { label: $$t('单'), play_id: 424, value: 'Odd' },
      { label: $$t('双'), play_id: 425, value: 'Even' },
    ],
  },
  [LotteryFiveDBetPos.SUM]: {
    ball: null,
    bsoe: [
      { label: $$t('大'), play_id: 426, value: 'Big' },
      { label: $$t('小'), play_id: 427, value: 'Small' },
      { label: $$t('单'), play_id: 428, value: 'Odd' },
      { label: $$t('双'), play_id: 429, value: 'Even' },
    ],
  },
}

const fiveDStore = use5DStore()
const { selectedPos, selectedBSOE, selectedNumArr } = storeToRefs(fiveDStore)

// 位置
const posTabList = [
  { label: 'A', value: LotteryFiveDBetPos.A },
  { label: 'B', value: LotteryFiveDBetPos.B },
  { label: 'C', value: LotteryFiveDBetPos.C },
  { label: 'D', value: LotteryFiveDBetPos.D },
  { label: 'E', value: LotteryFiveDBetPos.E },
  { label: $$t('总和'), value: LotteryFiveDBetPos.SUM },
]

/** 大小单双 */
const bigSmallOddEvenList = computed(() => {
  return totalOptions[selectedPos.value].bsoe.map((a) => {
    return {
      ...a,
      odd: props.data.find(b => b.play_id === a.play_id)?.odds,
      id: props.data.find(b => b.play_id === a.play_id)?.id,
    }
  })
})
/** 号码 */
const numberList = computed(() => {
  const _playId = totalOptions[selectedPos.value].ball

  if (_playId) {
    const _list = [
      { label: '0', value: '0' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
    ].map((a) => {
      return {
        ...a,
        play_id: _playId,
      }
    })
    return _list.map((a) => {
      return {
        ...a,
        odd: Number(props.data.find(b => b.play_id === a.play_id)?.odds ?? 0).toFixed(),
        id: props.data.find(b => b.play_id === a.play_id)?.id,
      }
    })
  }

  return []
})
/** 是否总和 */
const isSum = computed(() => selectedPos.value === LotteryFiveDBetPos.SUM)
/** 当前选中的大小单双的数据 */
const selectBSOEObj = computed(() => {
  return bigSmallOddEvenList.value.find(a => a.value === selectedBSOE.value)
})
/** 当前选中的号码的数据 */
const selectNumObjArr = computed(() => {
  return numberList.value.filter(a => checkSelectedNum(a.value))
})

// 检查是否已选中号码
function checkSelectedNum(v: string) {
  return selectedNumArr.value.includes(v)
}

// 选择大小单双
function onBSOEClick(item: {
  odd: string | undefined
  id: number | undefined
  label: string
  play_id: number
  value: string
}) {
  fiveDStore.clearSelectedNumArr()

  if (item.value === selectedBSOE.value) {
    fiveDStore.clearSelectedBSOE()
  }
  else {
    selectedBSOE.value = item.value
  }

  emitPopup()
}
// 选择号码
function onNumClick(item: {
  odd: string
  id: number | undefined
  play_id: number
  label: string
  value: string
}) {
  fiveDStore.clearSelectedBSOE()

  // 如果已选中则取消选中
  const _index = selectedNumArr.value.findIndex(a => a === item.value)
  if (_index > -1) {
    selectedNumArr.value.splice(_index, 1)
  }
  else {
    selectedNumArr.value.push(item.value)
  }

  emitPopup()
}
function onOptionTabsChange(v: string) {
  if (v === LotteryFiveDBetPos.SUM) {
    fiveDStore.clearSelectedNumArr()
  }
}
function emitPopup() {
  if (!props.isInPop) {
    setTimeout(() => {
      emit('openPop')
    }, 100)
  }
}

defineExpose({
  selectBSOEObj,
  selectNumObjArr,
})
</script>

<template>
  <div>
    <AppFiveDOptionTabs v-model="selectedPos" :list="posTabList" class="mb-[12rem]" @change="onOptionTabsChange" />
    <!-- 大小单双 -->
    <div class="w-full flex justify-between mb-[13rem]">
      <div
        v-for="item in bigSmallOddEvenList" :key="item.id"
        class="bsoe-btn h-[33rem] w-[76rem] flex items-center text-[14rem] justify-center  rounded-[5rem]"
        :class="item.value === selectedBSOE ? `${item.value}-active` : 'bsoe-btn-default'" @click="onBSOEClick(item)"
      >
        {{ item.label }}{{ item.odd }}x
      </div>
    </div>
    <!-- 号码 -->
    <div class="h-[112rem]">
      <div v-show="!isSum" class="grid grid-cols-5 gap-x-[1rem]">
        <div
          v-for="item in numberList" :key="item.label" class="h-[56rem] w-full items-center flex flex-col"
          @click="onNumClick(item)"
        >
          <div
            class="ball-btn w-[33rem] flex items-center justify-center text-[14rem] h-[33rem] rounded-[50%] border-solid border-[1rem]"
            :class="checkSelectedNum(item.label) ? 'ball-btn-active' : ''"
          >
            {{ item.label }}
          </div>
          <span class="ball-odd text-[12rem] leading-[12rem]">{{ item.odd }}x</span>
        </div>
      </div>
    </div>
  </div>
</template>

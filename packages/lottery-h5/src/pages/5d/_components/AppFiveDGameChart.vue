<script setup lang="ts">
import { ApiCpTrend5D } from '@tg/apis'
import { LotteryPagination } from '@tg/bccomponents'
import { application } from '@tg/utils'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import AppTableWithLines from '../../../components/AppTableWithLines.vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import AppFiveDOptionTabs from './AppFiveDOptionTabs.vue'

interface Props {
  currentTab: number
}

defineOptions({ name: 'AppFiveDGameChart' })
const props = defineProps<Props>()

const { $$t } = useLocale()

// 位置
const currentPos = ref(0)
const posTabList = [
  { label: 'A', value: 0 },
  { label: 'B', value: 1 },
  { label: 'C', value: 2 },
  { label: 'D', value: 3 },
  { label: 'E', value: 4 },
]

const tableRef = ref(null)
const page = ref(1)
const total = ref(1)

const columns = [
  { title: $$t('期号'), dataIndex: 'period' },
  { title: $$t('号码'), dataIndex: 'number' },
]

const { run, runAsync, data } = useRequest(() => ApiCpTrend5D({ lottery_id: props.currentTab, page: page.value }), {
  onSuccess(res) {
    if (page.value === 1)
      total.value = res.t
  },
})

const lastPeriodData = computed(() => {
  if (data.value && data.value.d && data.value.d.chart && data.value.d.chart.length > 0) {
    const _chart = data.value.d.chart[currentPos.value].summary

    return [
      { label: $$t('遗漏'), value: _chart.missing },
      { label: $$t('平均遗漏'), value: _chart.agv_missing },
      { label: $$t('出现次数'), value: _chart.frequency },
      { label: $$t('最大连开'), value: _chart.max_consecutive },
    ]
  }
  return []
})
const issueId = computed(() => {
  if (data.value && data.value.d && data.value.d.chart && data.value.d.chart.length > 0) {
    return data.value.d.chart[0].list[0].issue
  }
  return ''
})
const row = computed(() => {
  if (data.value && data.value.d && data.value.d.chart && data.value.d.chart.length > 0) {
    const _list = data.value.d.chart[currentPos.value].list

    return _list.map((item) => {
      return {
        id: item.issue,
        activeIndex: (item.result),
      }
    })
  }
  return []
})

function refresh() {
  page.value = 1
  run()
}
function last() {
  page.value = page.value - 1
  run()
}
function next() {
  page.value = page.value + 1
  run()
}

function getBSOEColor(v: number, type: 'bs' | 'oe') {
  switch (type) {
    case 'bs':
      return Number(v) > 4 ? 'big' : 'small'
    case 'oe':
      return Number(v) % 2 === 0 ? 'even' : 'odd'
    default:
      return undefined
  }
}
function getBSOEText(v: number, type: 'bs' | 'oe') {
  switch (type) {
    case 'bs':
      return Number(v) > 4 ? 'H' : 'L'
    case 'oe':
      return Number(v) % 2 === 0 ? 'E' : 'O'
    default:
      return undefined
  }
}

defineExpose({ refresh })

await application.allSettled([runAsync()])
</script>

<template>
  <div>
    <div class=" overflow-hidden rounded-t-[6rem]">
      <div class="chart-bg p-[12rem] rounded-[10rem] mb-[12rem]">
        <AppFiveDOptionTabs v-model="currentPos" :list="posTabList" class="mb-[12rem]" />
        <div class="chart-text flex flex-col text-[12rem] ">
          <span class="leading-[18rem] mb-[8.5rem]">{{ $$t('近期统计') }}</span>
          <div class="flex items-center justify-between mb-[10rem]">
            <span class="leading-[18rem]">{{ $$t('开奖号码') }}</span>
            <div class="flex items-center">
              <span
                v-for="i in 10" :key="i"
                class="chart-ball w-[18rem] h-[18rem] ml-[2rem] rounded-[50%] flex items-center justify-center"
              >
                {{ i - 1 }}
              </span>
            </div>
          </div>
          <div
            v-for="item in lastPeriodData" :key="item.label"
            class="flex justify-between not-last-of-type:mb-[10rem]"
          >
            <span class="leading-[18rem]">{{ item.label }}</span>
            <div class="flex items-center">
              <span
                v-for="num, i in item.value" :key="`${issueId}-${currentPos}-${num}-${i}`"
                class="text-[13rem] text-[#9DA7B3] leading-[18rem] ml-[2rem] w-[18rem] h-[18rem] flex items-center justify-center"
              >
                {{ num }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-t-[6rem] overflow-hidden mb-[18rem]">
        <AppTableWithLines
          ref="tableRef" :columns="columns" :source-data="row" class="mb-[18rem]"
          number-key="activeIndex" static-color
        >
          <template #default="{ record }">
            <div class="flex items-center ml-[10rem]">
              <span
                :class="getBSOEColor(Number(record), 'bs')"
                class="w-[14rem] h-[14rem] flex items-center rounded-[50%] justify-center text-[#fff] text-[12rem]"
              >
                {{ getBSOEText(Number(record), 'bs') }}
              </span>
              <span
                :class="getBSOEColor(Number(record), 'oe')"
                class="w-[14rem] h-[14rem] ml-[3rem] flex items-center rounded-[50%] justify-center text-[#fff] text-[12rem]"
              >
                {{ getBSOEText(Number(record), 'oe') }}
              </span>
            </div>
          </template>
        </AppTableWithLines>
      </div>
    </div>
    <LotteryPagination :total="total" :cur-page="page" @last="last" @next="next" />
  </div>
</template>

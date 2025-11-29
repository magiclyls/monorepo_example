<script setup lang="tsx" name="AppK3GameHistory">
import type { LotteryColumns } from '@tg/types'
import { ApiCpTrend } from '@tg/apis'
import { LotteryImage, LotteryPagination, LotteryTable } from '@tg/bccomponents'
import { EventBusNames } from '@tg/types'
import {
  appEventBus,
} from '@tg/utils'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'

const { $$t } = useLocale()
const currentTab = inject('currentTab', ref(1001))
const page = ref(1)
const total = ref(1)

const { runAsync, data: sourceData } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: page.value }), {})

function getBigSmall(id: string) {
  return id === '301' ? $$t('大') : $$t('小')
}
function getEvenOdd(id: string) {
  return id === '303' ? $$t('单') : $$t('双')
}
const columns: LotteryColumns[] = [
  {
    title: $$t('期号'),
    dataIndex: 'issue',
    renderCol: (props, cur) => (
      <div class="flex justify-center gap-[13rem]">
        <div class="d">{props.issue}</div>
        <div class="d">{props.sum}</div>
      </div>
    ),
  },
  {
    title: $$t('总和'),
    dataIndex: 'result',
    renderCol: (props, cur) => (
      <div class="flex  justify-center  gap-[20rem]">
        <div class="d">{getBigSmall(props.big_small)}</div>
        <div class="d">{getEvenOdd(props.odd_even)}</div>
      </div>
    ),
  },

  {
    title: $$t('结果'),
    dataIndex: 'result',
    renderCol: (props, cur) => {
      const results = props.result.split(',')
      return (
        <div class="center gap-[10rem]">
          {
            results.map((num: string, i: number) => {
              return <LotteryImage url={`/lottery/png/dice-solo-${num}.png`} class="w-[20rem]" />
            })
          }
        </div>
      )
    },
  },
]
const data = computed(() => {
  if (!sourceData.value)
    return []
  return sourceData.value.d.list
})
async function init() {
  await runAsync().then((res) => {
    if (page.value === 1)
      total.value = res.t
  })
}
function refresh() {
  if (page.value !== 1) {
    page.value = 1
    return
  }
  init()
}

watch(page, () => {
  init()
})

watch(currentTab, refresh)

onMounted(() => {
  appEventBus.on(EventBusNames.LOTTERY_K3_HISTORY, refresh)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.LOTTERY_K3_HISTORY, refresh)
})
init()
</script>

<template>
  <div>
    <div class="rounded-t-[6rem] overflow-hidden mb-[16rem]">
      <LotteryTable :columns="columns" :source-data="data" />
    </div>
    <LotteryPagination :total="total" :cur-page="page" @last="page--" @next="page++" />
  </div>
</template>

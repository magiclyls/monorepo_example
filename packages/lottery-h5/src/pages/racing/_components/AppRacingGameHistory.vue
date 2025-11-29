<script setup lang="ts" name="AppRaceGameHistory">
import type { LotteryColumns } from '@tg/types'
import { ApiCpTrend } from '@tg/apis'
import { LotteryColorfulBalls, LotteryPagination, LotteryTable } from '@tg/bccomponents'
import { computed, h, inject, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'

const { $$t } = useLocale()
const currentTab = inject('currentTab', ref(2001))
const page = ref(1)
const total = ref(1)
const { runAsync, data: sourceData } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: page.value }), {
  onSuccess: (res) => {
    if (res?.t === 0) {
      page.value = 1
      return
    }
    if (page.value === 1) {
      total.value = res?.t || 1
    }
  },
})
const list = computed(() => {
  if (!sourceData.value)
    return []
  return sourceData.value.d.list
})

function RenderBigOrSmall(value: string) {
  const arr = value.split(',')
  const b = h('div', { class: 'bg-linear-[90deg,#FF9000_0%,#FFD000_100%] size-[17rem] rounded-[4rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)]' }, $$t('racing大'))
  const s = h('div', { class: 'bg-linear-[90deg,#00BDFF_0%,#5BCDFF_100%] size-[17rem] rounded-[4rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)]' }, $$t('racing小'))
  const res = arr.map((item) => {
    if (Number(item) > 5)
      return b
    else
      return s
  })
  return h('div', { class: 'flex justify-center' }, [h('div', { class: 'grid grid-cols-3 text-[12rem] items-center font-[700] text-white gap-x-[4rem]' }, res)])
}
function RenderOddOrEven(value: string) {
  const arr = value.split(',')
  const o = h('div', { class: 'bg-linear-[90deg,#FD0261_0%,#FF8A96_100%] size-[17rem] rounded-[4rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)]' }, $$t('racing单'))
  const e = h('div', { class: 'bg-linear-[90deg,#00BE50_0%,#9BDF00_100%] size-[17rem] rounded-[4rem] shadow-[0_0_10rem_0_rgba(0,0,0,0.15)]' }, $$t('racing双'))
  const res = arr.map((item) => {
    if (Number(item) % 2 === 0)
      return e
    else
      return o
  })
  return h('div', { class: 'flex justify-center' }, [h('div', { class: 'grid grid-cols-3 text-[12rem] items-center font-[700] text-white gap-x-[4rem]' }, res)])
}

const columns: LotteryColumns[] = [
  { title: $$t('期号'), dataIndex: 'issue', renderTitle: props => h('div', props.title) },
  { title: $$t('结果'), dataIndex: 'result', renderCol: (props, cur) => h('div', { class: 'flex justify-center' }, [String(props[cur]).split(',').map(item => h(LotteryColorfulBalls, { number: Number(item), type: 'race', class: 'w-[20rem] h-[22rem]' }))]) },
  { title: `${$$t('racing大')}/${$$t('racing小')}`, dataIndex: 'big_small', renderCol: (props, cur) => RenderBigOrSmall(props.result) },
  { title: `${$$t('racing单')}/${$$t('racing双')}`, dataIndex: 'oe', renderCol: (props, cur) => RenderOddOrEven(props.result) },
]
function refresh() {
  if (page.value !== 1) {
    page.value = 1
    return
  }
  runAsync()
}
watch(page, () => {
  runAsync()
})
defineExpose({
  refresh,
})
await runAsync()
</script>

<template>
  <div>
    <div class="rounded-t-[6rem] overflow-hidden mb-[18rem]">
      <LotteryTable :columns="columns" :source-data="list" class="custom-table" />
    </div>
    <LotteryPagination :total="total" :cur-page="page" @last="page--" @next="page++" />
  </div>
</template>

<style>

</style>

<style scoped lang="scss">
.custom-table {
  --lot-tg-font-weight: 500;
  --lot-td-font-size: 12rem;
}
</style>

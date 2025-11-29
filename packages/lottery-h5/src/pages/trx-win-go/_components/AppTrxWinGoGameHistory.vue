<script setup lang="ts" name="AppTrxWinGoGameHistory.vue">
import type { LotteryColumns } from '@tg/types'
import { ApiCpTrend } from '@tg/apis'
import { LotteryImage, LotteryPagination, LotteryTable } from '@tg/bccomponents'
import dayjs from 'dayjs'
import { computed, h, inject, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'

const emits = defineEmits(['open'])
const { $$t } = useLocale()
const currentTab = inject('currentTab', ref(1001))
const page = ref(1)
const total = ref(1)

const { runAsync, data: sourceData } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: page.value }), {})

const columns: LotteryColumns[] = [
  { title: $$t('期号'), dataIndex: 'issue', renderCol: (props, cur) => h('div', { class: 'w-[74rem]' }, `${props[cur].slice(0, 3)}**${props[cur].slice(-4)}`), titleStyle: { width: '74rem' } },
  { title: $$t('区块高度'), dataIndex: 'block_heigh', renderCol: (props, cur) => RenderHeight(props[cur]) },
  { title: $$t('区块时间'), dataIndex: 'block_time', renderCol: (props, cur) => h('div', { class: 'leading-[50rem]' }, dayjs.unix(props[cur]).tz('Asia/Kolkata').format('HH:mm:ss')) },
  { title: $$t('哈希值'), dataIndex: 'hash_value' },
  { title: $$t('结果1'), dataIndex: 'result', renderCol: (props, cur) => h(RenderRes, { value: props[cur] }), titleStyle: { width: '50rem' } },
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
function RenderHeight(value: string) {
  const question = h('div', { class: 'absolute -top-[14rem] left-1/2 -translate-x-1/2 cursor-pointer', onClick: () => goToThird(value) }, [h(LotteryImage, { url: '/lottery/png/trx-win-go-question.png', class: 'w-[16rem] h-[15rem]' })])
  return h('div', { class: 'relative' }, [question, h('div', null, value)])
}
function RenderRes({ value }: { value: string }) {
  const numVal = Number(value)
  const baseCircle = 'center size-[18rem] text-[12rem] mr-[5rem] rounded-[9rem] text-white'
  const baseText = 'text-[12rem] font-[400] leading-[18rem]'

  const parityEl = h('div', { class: `${baseCircle} ${numVal % 2 === 0 ? 'bg-[#FB5B5B]' : 'bg-[#18B660]'}` }, value)
  const sizeEl = h('div', { class: `${baseText} ${numVal >= 5 ? 'text-[#FEAA57]' : 'text-[#6EA8F4]'}` }, numVal >= 5 ? $$t('racing大') : $$t('racing小'))

  return h('div', { class: 'center w-[50rem]' }, [parityEl, sizeEl])
}
function goToThird(value: string) {
  emits('open', value)
}
watch(page, () => {
  init()
})

defineExpose({
  refresh,
})
await init()
</script>

<template>
  <div>
    <div class="rounded-t-[6rem] overflow-hidden mb-[18rem]">
      <LotteryTable :columns="columns" :source-data="data" style="--lot-td-font-weight: 400;--lot-td-font-size:12rem;--lot-tg-font-weight: 600" />
    </div>
    <LotteryPagination :total="total" :cur-page="page" @last="page--" @next="page++" />
  </div>
</template>

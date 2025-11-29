<script setup lang="ts" name="AppWinGoGameHistory">
import type { LotteryColumns } from '@tg/types'
import { ApiCpTrend } from '@tg/apis'
import { LotteryPagination, LotteryTable } from '@tg/bccomponents'
import { computed, h, inject, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'
import AppColorfulNumbers from './AppColorfulNumbers.vue'
import AppColorfulSmallBalls from './AppColorfulSmallBalls.vue'

const { $$t } = useLocale()
const currentTab = inject('currentTab', ref(1001))

const page = ref(1)
const total = ref(1)

const { runAsync, data: sourceData } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: page.value }), {})

const columns: LotteryColumns[] = [
  { title: $$t('期号'), dataIndex: 'issue', renderCol: (props, cur) => h('div', { class: 'w-[140rem] center' }, [h('div', null, props[cur])]), titleStyle: { width: '140rem' } },
  { title: $$t('号码'), dataIndex: 'result', renderCol: (props, cur) => h(AppColorfulNumbers, { number: Number(props[cur]) }) },
  { title: `${$$t('大')} ${$$t('小')}`, dataIndex: 'bigOrSmall', renderCol: (props, cur) => h('div', null, Number(props.result) < 5 ? $$t('小') : $$t('大')) },
  { title: $$t('颜色'), dataIndex: 'color', renderCol: (props, cur) => h('div', { class: 'center' }, [h(AppColorfulSmallBalls, { number: Number(props.result), class: 'center w-[60rem]' })]) },
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

defineExpose({
  refresh,
})
await init()
</script>

<template>
  <div>
    <div class="rounded-t-[6rem] overflow-hidden mb-[18rem]">
      <LotteryTable :columns="columns" :source-data="data" />
    </div>
    <LotteryPagination :total="total" :cur-page="page" @last="page--" @next="page++" />
  </div>
</template>

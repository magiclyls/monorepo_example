<script setup lang="ts" name="AppWinGoGameHistory">
import type { LotteryColumns } from '@tg/types'
import { ApiCpTrend5D } from '@tg/apis'
import { LotteryPagination, LotteryTable } from '@tg/bccomponents'
import { application } from '@tg/utils'
import { computed, h, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useLocale } from '../../../components/LotteryConfigProvider'
import AppFiveDGameHistoryResult from './AppFiveDGameHistoryResult.vue'
import AppFiveDGameHistoryTotal from './AppFiveDGameHistoryTotal.vue'

interface Props {
  currentTab: number
}

defineOptions({ name: 'AppFiveDGameHistory' })
const props = defineProps<Props>()

const { $$t } = useLocale()

const columns: LotteryColumns[] = [
  { title: $$t('期号'), dataIndex: 'issue', renderTitle: props => h('div', props.title) },
  {
    title: $$t('结果1'),
    dataIndex: 'result',
    renderCol: (row: any) => {
      return h(AppFiveDGameHistoryResult, { row })
    },
  },
  {
    title: $$t('总和1'),
    dataIndex: 'sum',
    renderCol: (row: any) => {
      return h(AppFiveDGameHistoryTotal, { row })
    },
  },
]

const page = ref(1)
const total = ref(0)

const { run, runAsync, data: cpTrendData } = useRequest(() => ApiCpTrend5D({ lottery_id: props.currentTab, page: page.value }), {
  onSuccess(res) {
    if (page.value === 1)
      total.value = res.t
  },
})
const data = computed(() => {
  if (cpTrendData.value && cpTrendData.value.d.history && cpTrendData.value.d.history.length > 0) {
    return cpTrendData.value.d.history
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

defineExpose({ refresh })

await application.allSettled([runAsync()])
</script>

<template>
  <div>
    <div class="rounded-t-[6rem] overflow-hidden mb-[18rem]">
      <LotteryTable :columns="columns" :source-data="data" />
    </div>
    <LotteryPagination :total="131" :cur-page="page" @last="last" @next="next" />
  </div>
</template>

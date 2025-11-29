<script setup lang="ts" name="AppTrxWinGoGameChart">
import { ApiCpTrend } from '@tg/apis'
import { LotteryPagination } from '@tg/bccomponents'
import { computed, inject, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import AppTableWithLines from '../../../components/AppTableWithLines.vue'
import { useLocale } from '../../../components/LotteryConfigProvider'

const { $$t } = useLocale()
const currentTab = inject('currentTab', ref(5002))
const tableRef = ref(null)
const page = ref(1)
const total = ref(1)
const columns = [

  { title: $$t('期号'), dataIndex: 'period' },
  { title: $$t('号码'), dataIndex: 'number' },
]

const { runAsync, data: sourceData } = useRequest(() => ApiCpTrend({ lottery_id: currentTab.value, page: page.value }), {})

const lastPeriodData = computed(() => {
  if (!sourceData.value)
    return []
  const data = sourceData.value?.d.summary
  return [
    { label: $$t('遗漏'), value: data.missing },
    { label: $$t('平均遗漏'), value: data.agv_missing },
    { label: $$t('出现次数'), value: data.frequency },
    { label: $$t('最大连开'), value: data.max_consecutive },
  ]
})

const row = computed(() => {
  if (!sourceData.value)
    return []
  return sourceData.value.d.list.map((item) => {
    return {
      id: item.issue,
      activeIndex: (item.result),
    }
  })
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
    <div class=" overflow-hidden rounded-t-[6rem]">
      <AppTableWithLines ref="tableRef" :columns="columns" :source-data="row" class="mb-[18rem]" number-key="activeIndex" :last-period="lastPeriodData" />
    </div>
    <LotteryPagination :total="total" :cur-page="page" @last="page--" @next="page++" />
  </div>
</template>

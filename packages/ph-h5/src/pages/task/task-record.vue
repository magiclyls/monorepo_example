<script setup lang="ts">
import type { Column, TaskRecord } from '@tg/types'
import { ApiJobReceiveRecord } from '@tg/apis'
import { PhBaseAmount, PhBaseTable } from '@tg/bccomponents'
import { getLangConfig, getLangForBackend, timeToZoneDayFormat2 } from '@tg/vue-i18n'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'

interface Props {
  id: string
}
defineOptions({
  name: 'TaskRecord',
})
const props = defineProps<Props>()
const { t } = useI18n()
const currentLang = getLangForBackend()
const currentLangZone = ref(getLangConfig()?.zone)

const path = window.location.search
const search = new URLSearchParams(path)
const id = search.get('id') || props.id || ''
const dataSource = ref<TaskRecord[]>([])
const { runAsync: getTaskRecord, loading: isLoading } = useRequest(ApiJobReceiveRecord, {
  onSuccess: (res: TaskRecord[]) => {
    dataSource.value = res
  },
})
const columns: Column[] = [
  {
    title: t('时间'),
    dataIndex: 'receive_at',
    align: 'center',
    thPaddingX: '20rem',
    slot: 'time',
  },
  {
    title: t('任务名称'),
    dataIndex: 'taskName',
    align: 'center',
    slot: 'name',
  },
  {
    title: t('奖励'),
    dataIndex: 'award',
    align: 'center',
    slot: 'award',
  },
]
function dealName(value: TaskRecord) {
  const names = JSON.parse(value.job_names)
  return names[currentLang]
}
getTaskRecord({ task_id: id })
</script>

<template>
  <AppPageLayout :title="t('领取记录')">
    <div class=" task-record">
      <PhBaseTable
        :columns="columns" :data-source="dataSource" :loading="isLoading" :show-out-load="true"
        :loading-full-screen="false"
        style="
          --tg-table-th-padding-bottom:16rem;
          --tg-table-th-height: 40rem;
          --tg-table-th-font-weight: 500;
          --tg-table-td-font-weight: 500;
        "
      >
        <template #time="{ record }">
          <div class="text-center">
            {{ timeToZoneDayFormat2(record.receive_at, currentLangZone) }}
          </div>
        </template>
        <template #name="{ record }">
          <div class="text-center">
            {{ dealName(record) }}
          </div>
        </template>
        <template #award="{ record }">
          <div class="center">
            <PhBaseAmount :amount="record.apply_amount" :currency-code="record.currency_id" :no-format="false" />
          </div>
        </template>
      </PhBaseTable>
    </div>
  </AppPageLayout>
</template>

<style scoped>
.task-record {
  --tg-table-th-color: #0d2245;
}
</style>

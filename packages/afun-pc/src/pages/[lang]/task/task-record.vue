<script setup lang="ts">
import type { TaskRecord } from '@tg/types'

import { ApiJobReceiveRecord } from '@tg/apis'

interface Props {
  id: string
}
defineOptions({
  name: 'TaskRecord',
})
const props = defineProps<Props>()
const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const currentLang = getCurrentLanguageForBackend()
const { globalPageTitle } = useGlobalStatePageTitle()
const { currentLangZone } = storeToRefs(useLanguageStore())

globalPageTitle.value = t('receive_record_label')

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
    title: t('time'),
    dataIndex: 'receive_at',
    align: 'center',
    // thPaddingX: '0px',
    slot: 'time',
    headerTextColor: 'var(--tg-text-white)',
  },
  {
    title: t('task_name'),
    dataIndex: 'taskName',
    align: 'center',
    slot: 'name',
    headerTextColor: 'var(--tg-text-white)',
  },
  {
    title: t('bonus_label'),
    dataIndex: 'award',
    align: 'center',
    slot: 'award',
    headerTextColor: 'var(--tg-text-white)',
  },
]
function dealName(value: TaskRecord) {
  const names = JSON.parse(value.job_names)
  return names[currentLang]
}
getTaskRecord({ task_id: id })
</script>

<template>
  <div :class="[isMobile ? 'pt-[16px]' : 'px-[16px] pb-[16px]']">
    <BaseTable
      :columns="columns" :data-source="dataSource" :loading="isLoading" :show-out-load="true"
      style="--tg-table-th-padding-bottom:16px;"
      :loading-full-screen="false"
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
          <AppAmount :amount="record.apply_amount" :currency-code="record.currency_id" :no-format="false" />
        </div>
      </template>
    </BaseTable>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

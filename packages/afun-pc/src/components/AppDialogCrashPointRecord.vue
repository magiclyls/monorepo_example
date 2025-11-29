<script lang="ts" setup>
import { ApiGameOriginCrashIssueRecord } from '@tg/apis'

defineOptions({
  name: 'AppDialogCrashPointRecord',
})
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()

const column = computed<Column[]>(() => [
  { title: t('time'), dataIndex: '', align: 'left', slot: 'start_at', width: '46%' },
  { title: t('multiple_count'), dataIndex: '', align: 'center', slot: 'crash_point', width: '29%' },
  { title: t('detail'), dataIndex: '', align: 'right', slot: 'detail', width: '25%' },
])

const { openCrashIssueResult } = useDialogCrashIssueResult()

const {
  list,
  runAsync: runGetRecordAsync,
  page,
  page_size,
  total,
  prev,
  next,
  loading,
} = useList(ApiGameOriginCrashIssueRecord, {}, { page_size: 10 })

function onPrevious() {
  prev()
}

function onNext() {
  next()
}

function showDetail(issue_id: string) {
  closeDialog()
  openCrashIssueResult(issue_id)
}

runGetRecordAsync({ page_size: 10, issue: '', page: 1 })
</script>

<template>
  <div class="tg-crash-point-record px-[16px] py-[16px]">
    <BaseTable :columns="column" :data-source="list" :loading="loading">
      <template #start_at="{ record }">
        <div class="text-sm">
          {{ timeToCustomizeFormat(record.start_at) }}
        </div>
      </template>
      <template #crash_point="{ record }">
        <div class="text-sm font-semibold" :class="[+record.crash_point >= 2 ? 'text-[#00E701]' : 'text-tg-secondary-light']">
          {{ floor(+record.crash_point, 2).toFixed(2) }}x
        </div>
      </template>
      <template #detail="{ record }">
        <div class="view_label text-sm font-semibold" @click="showDetail(record.issue_id)">
          {{ t('view_label') }}
        </div>
      </template>
    </BaseTable>
    <div class="pages mt-[16px]">
      <AppStack
        :pagination-data="{ page, pageSize: page_size, total }"
        @previous="onPrevious"
        @next="onNext"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.view_label {
  :hover {
    color: white;
  }
  @include webTheme('white') {
    :hover {
      color: black;
    }
  }
}
</style>

<script lang="ts" setup>
import type { Column } from '@tg/types'
import { ApiGameOriginCrashIssueRecord } from '@tg/apis'
import { AfunBaseDialog, AfunBasePagination, AfunBaseTable } from '@tg/bccomponents'
import { useList } from '@tg/hooks'
import { i18n, timeToCustomizeFormat } from '@tg/vue-i18n'
import { floor } from 'lodash'
import { computed, ref } from 'vue'
import AppMiniGameCrashResultAndRanking from './AppMiniGameCrashResultAndRanking.vue'

defineOptions({
  name: 'AppDialogCrashPointRecord',
})
// const closeDialog = inject('closeDialog', () => { })

const { t } = i18n.global

const column = computed<Column[]>(() => [
  { title: t('时间'), dataIndex: '', align: 'left', slot: 'start_at', width: '46%' },
  { title: t('乘数'), dataIndex: '', align: 'center', slot: 'crash_point', width: '29%' },
  { title: t('详情'), dataIndex: '', align: 'right', slot: 'detail', width: '25%' },
])

const showDetailDialog = ref(false)
const issueId = ref('')

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
  issueId.value = issue_id
  showDetailDialog.value = true
}

runGetRecordAsync({ page_size: 10, issue: '', page: 1 })
</script>

<template>
  <div class="tg-crash-point-record px-[16px] py-[16px]">
    <AfunBaseTable :columns="column" :data-source="list" :loading="loading">
      <template #start_at="{ record }">
        <div class="text-[14px]">
          {{ timeToCustomizeFormat(record.start_at) }}
        </div>
      </template>
      <template #crash_point="{ record }">
        <div class="text-[14px] font-semibold" :class="[+record.crash_point >= 2 ? 'text-[#24EE89]' : 'text-tg-secondary-light']">
          {{ floor(+record.crash_point, 2).toFixed(2) }}x
        </div>
      </template>
      <template #detail="{ record }">
        <div class="view_label text-[14px] font-semibold" @click="showDetail(record.issue_id)">
          {{ t('查看') }}
        </div>
      </template>
    </AfunBaseTable>
    <div class="pages mt-[16px]">
      <AfunBasePagination
        :page="page"
        :page-size="page_size"
        :total="total"
        @previous="onPrevious"
        @next="onNext"
      />
    </div>
  </div>
  <AfunBaseDialog v-if="showDetailDialog" v-model="showDetailDialog" :title="t('详情')">
    <AppMiniGameCrashResultAndRanking :issue-id="issueId" />
  </AfunBaseDialog>
</template>

<style lang="scss" scoped>
.view_label {
  :hover {
    color: white;
  }
}
</style>

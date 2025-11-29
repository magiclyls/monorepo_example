<script lang="ts" setup>
import { IconUniDoc } from '@tg/icons'
import { ApiAgencyCommissionRecords, ApiAgencyCommissionRecordsClass } from '@tg/apis'

defineOptions({
  name: 'AppAgentCommissionRecordDialog',
})
const { t } = useI18n()

const {
  list,
  page,
  page_size,
  loading,
  total,
  runAsync,
  prev,
  next,
  resetPage,
} = useList(ApiAgencyCommissionRecords, {}, { page_size: 10, isWatchPageOrPageSize: false })
const date = ref([])
const platformId = ref('')
const { isMobile } = storeToRefs(useWindowStore())
const {
  data: recordsClass,
  runAsync: getRecordsClass,
  loading: reLoading,
} = useRequest(ApiAgencyCommissionRecordsClass, {
  onSuccess() {
    const params = computed(() => {
      return {
        start_time: date.value[0],
        end_time: date.value[1],
        page_size: page_size.value,
        page: page.value,
        cash_type: platformId.value,
      }
    })
    useListSearch(params, runAsync, resetPage)
  },
})
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const columns = reactive<Column[]>([
  {
    title: t('label_type'),
    dataIndex: 'cash_type_name',
    slot: 'cash_type_name',
    align: 'center',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('amount'),
    dataIndex: 'amount',
    isAmount: true,
    align: 'center',
    color: 'var(--tg-table-amount-color)',
  },
  {
    title: t('time'),
    dataIndex: 'apply_at',
    slot: 'apply_at',
    align: 'center',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('order_id'),
    dataIndex: 'bill_no',
    slot: 'bill_no',
    align: 'center',
    color: 'var(--tg-table-text-color)',
  },
])

const getOptions = computed(() => {
  return [{
    label: t('label_all_type'),
    value: '',
  }].concat(recordsClass.value?.map((item) => {
    return {
      label: item.CashTypeName,
      value: item.CashType,
    }
  }) ?? [])
})
const getPaginationData = computed(() => {
  return {
    pageSize: page_size.value,
    page: page.value,
    total: total.value,
  }
})

// onMounted(() => {
// getRecordsClass()
// })
await application.allSettled(
  [
    getRecordsClass(),
  ],
)
</script>

<template>
  <div class="app-agent-commission-record my-record-filter-wrap">
    <div class="grid-box" :class="{ 'is-mobile': isMobile }">
      <div class="column-item">
        <span class="theme-text">{{ $t('time') }}</span>
        <BaseDatePicker v-model="date" class="my-affiliate-picker" :min="startTime" :max="endTime" />
      </div>
      <div class="column-item">
        <span class="theme-text col-label">{{ $t('label_type') }}</span>
        <BaseSelect
          v-model.lazy="platformId"
          class="my-affiliate-select"
          :options="getOptions"
        />
      </div>
    </div>
    <BaseTable
      :columns="columns" :data-source="list" :loading="reLoading" :skeleton-row="4" is-amount-popper
      show-out-load :out-load-height="194"
    >
      <template #apply_at="{ record }">
        {{ `${timeToFormatByBoss(record.apply_at)} ${timeToCustomizeFormat(record.apply_at, 'HH:mm')}` }}
      </template>
      <template #bill_no="{ record }">
        <div class="center" style="gap: 4px">
          <span style="color: var(--tg-table-text-color);">{{ record.bill_no }}</span>
          <AppTooltip :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']">
            <template #content>
              <div class="flex items-center" @click="application.copy(record.bill_no)">
                <IconUniDoc class="text-[16px]" />
              </div>
            </template>
          </AppTooltip>
        </div>
      </template>
    </BaseTable>
    <AppStack v-if="total > 10" :pagination-data="getPaginationData" @previous="prev" @next="next" />
  </div>
</template>

<style lang="scss" scoped>
.to-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.app-agent-commission-record {
  padding: 0 var(--tg-spacing-16) var(--tg-spacing-16);
  --tg-base-date-picker-bother: none;
  --tg-base-date-picker-font-size: var(--tg-font-size-xs);
  --tg-base-date-picker-padding: var(--tg-spacing-10) var(--tg-spacing-10);
  --tg-base-date-picker-font-weight: 500;
  --tg-base-select-border: none;
  --tg-base-select-box-shadow: none;
  --tg-base-select-style-padding-y: var(--tg-spacing-10);
  --tg-base-date-picker-color: var(--tg-text-white);
  --tg-base-select-popper-font-weight: var(--tg-font-weight-normal);
  --tg-table-margin-top-empty: 0;

  @include webTheme('green') {
    --tg-table-odd-background: #076237;
  }

  .grid-box {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--tg-spacing-10);
    --tg-base-date-picker-width: auto;
    .column-item {
      display: flex;
      flex-direction: column;
      color: var(--tg-text-lightgrey);
      .theme-text {
        @include webTheme('green') {
          font-weight: 600;
        }
      }
      .col-label {
        white-space: nowrap;
      }
      span:first-of-type {
        margin-bottom: var(--tg-spacing-4);
      }
    }
  }
  .is-mobile {
    grid-template-columns: auto;
    --tg-base-date-picker-width: 50%;
  }
}
.my-record-filter-wrap {
  @include webTheme('green') {
    --tg-popper-hover-color-default: var(--tg-icon-color-grey);
    .my-affiliate-picker {
      --tg-base-date-picker-bg: var(--tg-green-dark);
      --tg-border-color-deep-grey: var(--tg-base-green-border);
    }
    .my-affiliate-select {
      --tg-icon-arrow-color: var(--tg-icon-color-grey);
      --tg-border-color-deep-grey: var(--tg-base-green-border);
      --tg-base-select-select-warp-background-color: #02432d;
    }
  }
}
</style>

<script lang="ts" setup>
import { ApiAgencyCommissionModelsList, ApiAgencyCommissionRecordsClass, ApiAgencyCommissionRecordsNew } from '@tg/apis'
import dayjs from 'dayjs'

const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { bonus_currency } = storeToRefs(useAffiliate())
const { isZhcn } = storeToRefs(useLanguageStore())
const currency_id = ref('')
const platformIdList = ref([
  {
    label: t('label_all_type'),
    value: '',
  },
])
// const {
//   selected: currency_id,
//   list: currencyList,
// } = useSelect([
//   {
//     label: t('label_all_type'),
//     value: '',
//   },
//   {
//     label: t('agency_rebate'),
//     value: '',
//   },
//   {
//     label: t('transfer_of_deposit'),
//     value: '',
//   },
// ])

const date = ref([])

const {
  list,
  page,
  page_size,
  loading,
  total,
  prev,
  next,
  runAsync,
  resetPage,
} = useList(ApiAgencyCommissionRecordsNew, {}, { page_size: 5, isWatchPageOrPageSize: true })
useRequest(ApiAgencyCommissionModelsList, {
  manual: false,
  onSuccess(data) {
    platformIdList.value = platformIdList.value.concat(data.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    }))
  },
})

const {
  data: recordsClass,
  runAsync: getRecordsClass,
  loading: reLoading,
} = useRequest(ApiAgencyCommissionRecordsClass, {
  ready: isLogin,
  onSuccess() {
    const params = computed(() => {
      return {
        cash_type: currency_id.value,
        start_time: date.value[0],
        end_time: date.value[1],
        page_size: page_size.value,
        page: page.value,
      }
    })
    const runFn = throttle(async (val) => {
      runAsync(val)
    }, 500, { leading: true, trailing: false })

    useListSearch(params, runFn, resetPage)
  },
})

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
const columns: Column[] = [
  {
    title: t('label_type'),
    dataIndex: 'cash_type_name',
    align: 'center',
    slot: 'label_type',
    skeWidth: '100px',
  },
  {
    title: t('time'),
    dataIndex: 'apply_at',
    align: 'center',
    slot: 'time',
  },
  {
    title: t('amount'),
    dataIndex: 'amount',
    align: 'center',
    slot: 'amount',
    isAmount: true,
    showColor: true,
  },
]
function formatTimestamp12H(timestamp: number) {
  // 将秒级时间戳转换为毫秒级，并使用24小时制格式
  return dayjs(timestamp * 1000).format('MM/DD HH:mm:ss')
}

onMounted(async () => {
  await application.allSettled(
    [
      getRecordsClass(),
    ],
  )
})
</script>

<template>
  <div class="all-data-page" :class="{ 'pc-mode': !isMobile, 'mobile-mode': isMobile }">
    <div class="my-commission-filter-wrap">
      <AppTimeSearch v-model="date" class="mb-[8px]" />
      <template v-if="isMobile">
        <BaseDatePicker
          :key="`${date[0] + date[1]}`" v-model="date"
          :style="isZhcn ? '--tg-base-date-picker-font-weight:500;' : '--tg-base-date-picker-font-weight:600;'"
          class="my-affiliate-picker mb-[8px]" :init-start-date="date[0]" :init-end-date="date[1]" :min="startTime"
          :max="endTime" :is-utc="false"
        />
        <div class="flex">
          <BaseSelect
            v-model.lazy="currency_id" class="my-affiliate-select flex-1" :options="getOptions"
            :style="isZhcn ? '--tg-base-select-popper-font-weight:500' : '--tg-base-select-popper-font-weight:600'"
            :popper="true" :same-hide="true"
          />
        </div>
      </template>
      <div v-else class="mb-[8px] flex items-center gap-[8px]">
        <BaseDatePicker
          :key="`${date[0] + date[1]}`" v-model="date"
          :style="isZhcn ? '--tg-base-date-picker-font-weight:500;' : '--tg-base-date-picker-font-weight:600;'"
          class="my-affiliate-picker" :init-start-date="date[0]" :init-end-date="date[1]" :min="startTime"
          :max="endTime" :is-utc="false"
        />
        <BaseSelect
          v-model.lazy="currency_id" class="my-affiliate-select w-[220px]" :options="getOptions"
          :style="isZhcn ? '--tg-base-select-popper-font-weight:500' : '--tg-base-select-popper-font-weight:600'"
          :popper="true" :same-hide="true"
        />
      </div>
    </div>
    <BaseTable
      class="page-all-data page-direct-finance my-affiliate-table" :columns="columns" :data-source="list"
      :loading="reLoading" :skeleton-row="5" is-amount-popper show-out-load :out-load-height="218"
      :style="isZhcn ? '--tg-table-td-font-weight:500;' : ''"
    >
      <template #amount="{ record }">
        <span class="text-color">
          <AppAmount
            class="retention-item-amount" :amount="record.amount"
            :currency-type="getCurrencyConfigByCode(bonus_currency)?.name"
          />
        </span>
      </template>
      <template #time="{ record }">
        <span>{{ formatTimestamp12H(record.apply_at) }}</span>
      </template>
    </BaseTable>
    <template v-if="isMobile">
      <AppStackPage
        v-if="total > page_size"
        class="mt-[16px]" :pagination-data="{
          pageSize: page_size,
          page,
          total,
        }" @previous="() => page-- " @next="() => page++" @size-change="(pageSize) => page_size = pageSize"
      />
    </template>
    <template v-else>
      <BasePagination
        v-if="total > page_size" v-model:current-page="page" v-model:page-size="page_size"
        :total="total"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.all-data-page {
  --tg-badge-size: 10px;
  --tg-base-select-style-padding-right: var(--tg-spacing-28);
  --tg-base-select-popper-style-padding-y: 11px;
  --tg-base-select-popper-style-padding-x: 13.5px;
  --tg-spacing-16: 22px;
  --tg-base-select-popper-label-hover-bg-color: var(--tg-base-date-picker-bg);
  --tg-base-date-picker-outer-height: 40px;

  &.mobile-mode[lang='zh'] {
    :deep(.time-button) {
      min-width: initial !important;
      width: auto !important;
      flex: 1 !important;
    }
  }

  @include webTheme('green') {
    --tg-table-odd-background: #055434;
  }

  @include webTheme('white') {
    --tg-base-select-popper-label-hover-bg-color: #f5f5f5;
  }
}

.my-affiliate-input {
  --tg-base-input-style-border: none;
}

.hint {
  color: var(--tg-text-grey-lighter);
  margin-top: 4px;
}

.page-all-data {
  --tg-app-amount-font-weight: var(--tg-font-weight-normal);
}

.all-data-page {
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #f5f5f5;
    --tg-base-date-picker-bother: transparent;
    --tg-app-amount-green-color: #ff9e36;
  }

  .my-commission-filter-wrap {
    --tg-base-date-picker-bother: none;

    .my-affiliate-picker {
      --tg-base-date-picker-color: #fff;
      --tg-base-date-picker-outer-margin-right: 8px;
    }

    @include webTheme('green') {
      --tg-popper-hover-color-default: var(--tg-icon-color-grey);
      --tg-base-input-style-bg: #02432d;

      .my-affiliate-picker {
        --tg-base-date-picker-bg: #02432d;
        --tg-base-date-picker-bother: 1px solid #02432d;
        --tg-border-color-deep-grey: var(--tg-base-green-border);
      }

      .my-affiliate-select {
        --tg-icon-arrow-color: var(--tg-icon-color-grey);
        --tg-base-select-border: 1px solid #02432d;
        --tg-border-color-deep-grey: var(--tg-base-green-border);
        --tg-base-select-popper-bg-color: #02432d;
        --tg-base-select-popper-label-hover-bg-color: #02432d;
      }
    }

    @include webTheme('white') {
      --tg-base-input-style-bg: #f5f5f5;
      --tg-base-input-style-background-color: #f5f5f5;

      .my-affiliate-picker {
        --tg-base-date-picker-color: #111111;
      }
    }
  }

  .my-affiliate-table {
    @include webTheme('green') {
      --tg-icon-color: var(--tg-icon-color-grey);
      --tg-text-white: var(--tg-text-placeholder);
      --tg-table-even-background: transparent;
      --tg-table-odd-background: #055434;
    }
  }

  .operate {
    @include webTheme('white') {
      color: #111111;
    }
  }
}

:deep(.time-range-container) {
  display: flex;
  gap: 8px; // 按钮间距
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.time-button) {
  white-space: nowrap;
  min-width: fit-content;
  min-width: 96px;
  width: auto;
  padding: 8px 13px;
  flex-shrink: 0; // 防止被压缩
}

.pc-mode {
  padding: calc(27px - 12px) calc(20px - 12px);

  :deep(.time-button) {
    background: #071824;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }

    &.active {
      @include webTheme('white') {
        background: #f2ca5c !important;
      }

      @include webTheme('new-default') {
        background-color: #2f4554 !important;
      }

      @include webTheme('green') {
        background-color: #197b59 !important;
      }
    }
  }

  :deep(.label-box) {
    background: #071824;
    border-radius: 4px;

    @include webTheme('white') {
      background-color: #e8e8e8 !important;
    }

    @include webTheme('green') {
      background-color: #055434 !important;
    }
  }

  .my-affiliate-select,
  .my-affiliate-input {
    background: #071824 !important;
    border-radius: 4px;

    :deep(.popper-label) {
      background: #071824;

      @include webTheme('white') {
        background-color: #e8e8e8 !important;
      }

      @include webTheme('green') {
        background-color: #055434 !important;
      }
    }
  }
}

.page-all-data {
  :deep(.m-td) {
    span {
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: center;
    }
  }
}

.retention-item-amount {
  :deep(.app-amount) {
    justify-content: center;

    span {
      font-family: PingFang SC;
      font-weight: 500;
      font-size: 14px;
      line-height: 100%;
      letter-spacing: 0%;
      text-align: center;
    }
  }
}

.mobile-mode {
  .my-commission-filter-wrap {
    margin-bottom: 8px;
  }

  :deep(.time-button),
  :deep(.label-box),
  :deep(.popper-label),
  :deep(.input-box) {
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.date-picker-outer) {
    justify-content: space-between;
    gap: 19px;

    & > div {
      flex: 1;
      margin-right: 0 !important;
    }
  }
}
</style>

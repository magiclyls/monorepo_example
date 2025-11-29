<script lang="ts" setup>
import { ApiAgencyReportFinance } from '@tg/apis'

import { IconUniSearch } from '@tg/icons'

const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { CurrencyOptions } = useCurrencyData()
const {
  selected: currency_id,
  list: currencyList,
} = useSelect([
  {
    label: t('all_currencies'),
    value: '',
  },
  ...CurrencyOptions.value,
])

const {
  list,
  page,
  page_size,
  loading,
  total,
  runAsync,
  resetPage,
} = useList(ApiAgencyReportFinance, {}, { page_size: 5, isWatchPageOrPageSize: false })

const date = ref([])
const searchValue = useDebouncedRef({ value: '', delay: 1000 })

const columns: Column[] = [
  {
    title: t('time'),
    dataIndex: 'time',
    align: 'center',
    slot: 'time',
    skeWidth: '100px',
  },
  {
    title: t('gamer'),
    dataIndex: 'username',
    align: 'center',
    slot: 'username',
  },

  {
    title: t('deposit_amount_label'),
    dataIndex: 'deposit_amount',
    align: 'center',
    isAmount: true,
  },
  {
    title: t('withdraw_amount'),
    dataIndex: 'withdraw_amount',
    align: 'center',
    isAmount: true,
  },
  {
    title: t('cash_profit'),
    dataIndex: 'deposit_withdraw_amount',
    align: 'center',
    isAmount: true,
  },
  {
    title: t('balance'),
    dataIndex: 'balance',
    align: 'center',
    isAmount: true,
  },
]

const params = computed(() => {
  return {
    username: searchValue.value,
    currency_id: currency_id.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
  }
})

onMounted(() => {
  watch(() => isLogin.value, (newValue) => {
    newValue && useListSearch(params, runAsync, resetPage)
  }, { immediate: true })
})
</script>

<template>
  <div class="all-data-page">
    <div class="table-filter my-finance-filter-wrap">
      <BaseDatePicker
        v-model="date"
        class="my-affiliate-picker"
        :min="startTime"
        :max="endTime"
        :is-utc="false"
      />
      <BaseSelect
        v-model.lazy="currency_id"
        class="my-affiliate-select"
        :options="currencyList"
        :popper="true"
        :same-hide="true"
      />
      <div class="search-box">
        <BaseInput v-model="searchValue" :placeholder="t('player_id')" clearable>
          <template #left-icon>
            <div class="center" style="padding-right: var(--tg-spacing-4);">
              <IconUniSearch  />
            </div>
          </template>
        </BaseInput>
      </div>
    </div>

    <BaseTable
      class="page-all-data page-direct-finance my-affiliate-table"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :skeleton-row="5"
      is-amount-popper
      show-out-load
      :out-load-height="218"
    >
      <template #username="{ record }">
        <AppReportUserName :username="record.username" :level="`${record.vip}`" />
      </template>
      <template #time="{ record }">
        <span>
          {{ timeToCustomizeFormat(record.time, 'MM/DD HH:mm') }}
        </span>
      </template>
    </BaseTable>
    <template v-if="isMobile">
      <AppStack
        v-if="total > page_size"
        class="mt-[16px]" :pagination-data="{
          pageSize: page_size,
          page,
          total,
        }" @previous="() => page-- " @next="() => page++"
      />
    </template>
    <template v-else>
      <BasePagination
        v-if="total > page_size"
        v-model:current-page="page"
        v-model:page-size="page_size"
        :total="total"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
.all-data-page {
  --tg-badge-size: 10px;
  --tg-base-select-style-padding-right: var(--tg-spacing-28);
  --tg-base-select-popper-style-padding-y: 11.5px;
  --tg-base-select-popper-style-padding-x: 13.5px;
  --tg-base-select-popper-label-hover-bg-color: var(--tg-base-date-picker-bg);
  --tg-spacing-16: 22px;
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #f5f5f5;
    --tg-base-select-popper-label-hover-bg-color: #f5f5f5;
    --tg-base-input-style-bg: #f5f5f5;
    --tg-base-input-style-background-color: #f5f5f5;
    --tg-base-date-picker-bother: transparent;
  }
}

.page-all-data {
  --tg-app-amount-font-weight: var(--tg-font-weight-normal);
  @include webTheme('green') {
    --tg-table-odd-background: #055434;
    --tg-table-even-background: #076237;
  }
  @include webTheme('white') {
    --tg-table-odd-background: #f5f5f5;
    --tg-table-even-background: #fff;
  }
}
.search-box {
  @include webTheme('green') {
    --tg-box-shadow: none;
    --tg-base-input-style-placeholder-color: #fff;
    --tg-icon-color: #fff;
    --tg-base-input-style-background-color: var(--tg-base-square-tab-bg-green);
  }
}
.my-finance-filter-wrap {
  @include webTheme('green') {
    --tg-popper-hover-color-default: var(--tg-icon-color-grey);
    .my-affiliate-picker {
      --tg-base-date-picker-bg: #055434;
      --tg-base-date-picker-bother: 1px solid #055434;
      --tg-border-color-deep-grey: var(--tg-base-green-border);
    }
    .my-affiliate-select {
      --tg-icon-arrow-color: var(--tg-icon-color-grey);
      --tg-base-select-border: 1px solid #055434;
      --tg-border-color-deep-grey: var(--tg-base-green-border);
    }
  }
}
.my-affiliate-table {
  @include webTheme('green') {
    --tg-icon-color: var(--tg-icon-color-grey);
    --tg-text-white: var(--tg-text-placeholder);
  }
}
</style>

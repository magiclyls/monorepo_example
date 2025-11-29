<script lang="ts" setup>
import { ApiAgencyReportAll } from '@tg/apis'

import { IconUniSearch } from '@tg/icons'

const { isMobile } = storeToRefs(useWindowStore())
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { CurrencyOptions } = useCurrencyData()
const {
  selected: currency_id,
  list: currencyList,
} = useSelect([
  {
    label: t('all_data_all_currencies'),
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
  data: allData,
} = useList(ApiAgencyReportAll, {}, { page_size: 10, isWatchPageOrPageSize: false })

const date = ref([])
const searchValue = useDebouncedRef({ value: '', delay: 1000 })
const { sortMap, setSortMap } = useTableSort()

const columns: Column[] = [
  {
    title: t('statistical_time'),
    dataIndex: 'created_at',
    align: 'center',
    slot: 'created_at',
    skeWidth: '100px',
  },
  {
    title: t('user_account'),
    dataIndex: 'username',
    align: 'center',
    slot: 'username',
  },
  {
    title: t('deposit'),
    dataIndex: 'deposit_amount',
    align: 'center',
    isAmount: true,
    sort: true,
    sumSlot: 'deposit_num',
  },
  {
    title: t('effective_bet'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    isAmount: true,
    sort: true,
    sumSlot: 'valid_bet_num',
  },
  {
    title: t('total_win_lose'),
    dataIndex: 'net_amount',
    align: 'center',
    isAmount: true,
    sort: true,
    showColor: true,
  },
]

const sumData = computed(() => {
  if (allData.value && allData.value.total)
    return [t('sum_label'), `${allData.value.total.num} ${t('people')}`, allData.value.total.deposit_amount, allData.value.total.valid_bet_amount, allData.value.total.net_amount]
  return []
})
const params = computed(() => {
  return {
    username: searchValue.value,
    currency_id: currency_id.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
    ...sortMap.value,
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
    <div class="table-filter my-all-data-filter">
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
      class="page-all-data my-affiliate-table"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :skeleton-row="5"
      is-amount-popper
      show-out-load
      :out-load-height="218"
      :currency-id="currency_id"
      :sum-data="sumData"
      show-summary
      @sort="setSortMap"
    >
      <template #created_at="{ record }">
        {{ timeToCustomizeFormat(record.created_at, 'MM/DD HH:mm') }}
      </template>
      <template #username="{ record }">
        <AppReportUserName :username="record.username" :level="`${record.vip}`" />
      </template>
      <template #deposit_num>
        <div>
          <AppTooltip icon-name="uni-doc" :auto-hide="false" :triggers="['click', 'hover']">
            <template #content>
              <AppAmount
                style="display: inline-block;"
                :amount="allData?.total?.deposit_amount"
                :currency-type="currency_id ? getCurrencyConfigByCode(currency_id)?.name : 'USDT'"
              />
              <span v-if="allData && allData.total && +allData?.total?.deposit_num > 0" class="ml-[4px]">/<span class="ml-[4px] mr-[4px]">{{ allData?.total?.deposit_num }}</span>{{ t('people') }}</span>
            </template>
            <template #popper>
              <AppAmount
                style="display: inline-block;"
                is-popper
                :amount="allData?.total?.deposit_amount"
                :currency-type="currency_id ? getCurrencyConfigByCode(currency_id)?.name : 'USDT'"
              />
              <span v-if="allData && allData.total && +allData?.total?.deposit_num > 0" class="ml-[4px]">/<span class="ml-[4px] mr-[4px]">{{ allData?.total?.deposit_num }}</span>{{ t('people') }}</span>
            </template>
          </AppTooltip>
        </div>
      </template>
      <template #valid_bet_num>
        <div>
          <AppTooltip icon-name="uni-doc" :auto-hide="false" :triggers="['click', 'hover']">
            <template #content>
              <AppAmount
                style="display: inline-block;"
                :amount="allData?.total?.valid_bet_amount"
                :currency-type="currency_id ? getCurrencyConfigByCode(currency_id)?.name : 'USDT'"
              />
              <span v-if="allData && allData.total && +allData?.total?.valid_bet_num > 0" class="ml-[4px]">/<span class="ml-[4px] mr-[4px]">{{ allData?.total?.valid_bet_num }}</span>{{ t('people') }}</span>
            </template>
            <template #popper>
              <AppAmount
                style="display: inline-block;"
                :amount="allData?.total?.valid_bet_amount"
                :currency-type="currency_id ? getCurrencyConfigByCode(currency_id)?.name : 'USDT'"
              />
              <span v-if="allData && allData.total && +allData?.total?.valid_bet_num > 0" class="ml-[4px]">/<span class="ml-[4px] mr-[4px]">{{ allData?.total?.valid_bet_num }}</span>{{ t('people') }}</span>
            </template>
          </AppTooltip>
        </div>
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
  --tg-spacing-16: 22px;
  --tg-base-select-popper-label-hover-bg-color: var(--tg-base-date-picker-bg);
  @include webTheme('white') {
    --tg-base-input-style-bg: #f5f5f5;
    --tg-base-select-popper-label-hover-bg-color: #f5f5f5;
    --tg-base-select-popper-bg-color: #f5f5f5;
    --tg-base-input-style-background-color: #f5f5f5;
    --tg-base-date-picker-bother: transparent;
    --tg-app-amount-green-color: #00a501;
    --tg-app-amount-red-color: #ff0101;
  }
}
.page-all-data {
  --tg-app-amount-font-weight: var(--tg-font-weight-normal);
}
.search-box {
  @include webTheme('green') {
    --tg-box-shadow: none;
    --tg-base-input-style-placeholder-color: #fff;
    --tg-icon-color: #fff;
    --tg-base-input-style-background-color: var(--tg-base-square-tab-bg-green);
  }
}
.my-all-data-filter {
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

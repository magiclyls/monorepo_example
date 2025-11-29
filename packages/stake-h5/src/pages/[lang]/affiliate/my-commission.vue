<script lang="ts" setup>
import { ApiAgencyCommission, ApiAgencyCommissionModelsList } from '@tg/apis'

const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const { isMobile } = storeToRefs(useWindowStore())
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { CurrencyOptions } = useCurrencyData()
const router = useLocalRouter()
const platformId = ref('')
const platformIdList = ref([
  {
    label: t('label_all_type'),
    value: '',
  },
])
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
} = useList(ApiAgencyCommission, {}, { page_size: 5, isWatchPageOrPageSize: false })
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

const date = ref([])
const searchValue = useDebouncedRef({ value: '', delay: 1000 })

const columns: Column[] = [
  {
    title: t('settle_time'),
    dataIndex: 'send_time',
    align: 'center',
    slot: 'time',
    skeWidth: '100px',
  },
  {
    title: t('label_type'),
    dataIndex: 'model_name',
    align: 'center',
    slot: 'model_name',
  },
  {
    title: t('performance'),
    dataIndex: 'valid_bet_amount_total',
    align: 'center',
    isAmount: true,
    showColor: true,
  },
  {
    title: t('label_contribute_count'),
    dataIndex: 'sub_user_count',
    align: 'center',
  },
  {
    title: t('finance_funds_transfer_sort_commission'),
    dataIndex: 'commission_amount_total',
    align: 'center',
    isAmount: true,
  },
  {
    title: t('detail'),
    dataIndex: '',
    align: 'center',
    slot: 'operate',
  },
]

const params = computed(() => {
  return {
    username: searchValue.value,
    currency_id: currency_id.value,
    model_id: platformId.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
  }
})

function goPerformance() {
  const st = dayjs.utc(date.value[0]).valueOf()
  const et = dayjs.utc(date.value[1]).valueOf()
  router.push(`/affiliate/my-performance?st=${st}&et=${et}`)
}

onMounted(() => {
  watch(() => isLogin.value, (newValue) => {
    newValue && useListSearch(params, runAsync, resetPage)
  }, { immediate: true })
})
</script>

<template>
  <div class="all-data-page">
    <div class="table-filter my-commission-filter-wrap">
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
      <BaseSelect
        v-model.lazy="platformId"
        class="my-affiliate-select"
        :options="platformIdList"
        :popper="true"
        :same-hide="true"
      />
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
      <template #time="{ record }">
        {{ `${timeToFormatByBoss(record.send_time)} ${timeToCustomizeFormat(
          record.send_time, 'HH:mm')}` }}
      </template>
      <template #model_name="{ record }">
        <span>{{ platformIdList.find(
          item => item.value === record.model_id)?.label ?? '-' }}</span>
      </template>
      <template #operate>
        <BaseButton
          size="none" type="text"
          class="operate"
          style="--tg-base-button-text-default-color: white;"
          @click="goPerformance"
        >
          {{ $t('view_label') }}
        </BaseButton>
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
  @include webTheme('green') {
    --tg-table-odd-background: #055434;
  }
  @include webTheme('white') {
    --tg-base-select-popper-label-hover-bg-color: #f5f5f5;
  }
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
</style>

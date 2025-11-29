<script lang="ts" setup>
import { ApiAgencyReportReceive } from '@tg/apis'

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
    label: t('Directly_subordinate_to_collect_all_currencies'),
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
} = useList(ApiAgencyReportReceive, {}, { page_size: 5, isWatchPageOrPageSize: false })

const date = ref([])
const searchValue = useDebouncedRef({ value: '', delay: 1000 })

const columns: Column[] = [
  {
    title: t('statistical_date'),
    dataIndex: 'time',
    align: 'center',
    slot: 'time',
    skeWidth: '100px',
  },
  {
    title: t('user_account'),
    dataIndex: 'username',
    align: 'center',
    slot: 'username',
  },
  {
    title: t('receive_amount'),
    dataIndex: 'total_receive',
    align: 'center',
    isAmount: true,
  },
  {
    title: t('activity'),
    dataIndex: 'gift_amount',
    align: 'center',
    isAmount: true,
  },
  {
    title: t('agent_commission'),
    dataIndex: 'commission_amount',
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
    <div class="table-filter">
      <BaseDatePicker
        v-model="date"
        :min="startTime"
        :max="endTime"
      />
      <BaseSelect
        v-model.lazy="currency_id"
        :options="currencyList"
      />
      <div>
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
      class="page-all-data page-direct-finance"
      :columns="columns"
      :data-source="list"
      :loading="loading"
      :skeleton-row="5"
      is-amount-popper
    >
      <template #username="{ record }">
        <AppReportUserName :username="record.username" :level="`${record.vip}`" />
      </template>
      <template #time="{ record }">
        {{ timeToDateFormat(record.time) }}
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
}

.hint {
  color: var(--tg-text-grey-lighter);
  margin-top: 4px;
}
.page-all-data {
  --tg-app-amount-font-weight: var(--tg-font-weight-normal);
}
</style>

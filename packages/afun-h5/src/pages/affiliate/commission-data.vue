<script lang="ts" setup>
import type { Column } from '@tg/types'
import { ApiAgencyCommissionModelsList, ApiAgencyCommissionRecordsClass, ApiAgencyCommissionRecordsNew } from '@tg/apis'
import { AfunBaseAmount, AfunBaseSelect, AfunBaseTable } from '@tg/bccomponents'
import { useList, useListSearch } from '@tg/hooks'
import { useAffiliate, useAppStore } from '@tg/stores'
import { getCurrencyConfig } from '@tg/utils'
import { getDaIntervalMap } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppAlliancePagination from '~/components/AppAlliancePagination.vue'
import BaseDatePicker from '~/components/BaseDatePicker.vue'

const currency_id = ref('')

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { bonus_currency, mode } = storeToRefs(useAffiliate())
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const date = ref([])

const platformIdList = ref([
  {
    label: t('全部类型'),
    value: '',
  },
])

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
    label: t('全部类型'),
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
    title: t('类型'),
    dataIndex: 'cash_type_name',
    align: 'center',
    slot: 'label_type',
    skeWidth: '100px',
  },
  {
    title: t('时间'),
    dataIndex: 'apply_at',
    align: 'center',
    slot: 'time',
  },
  {
    title: t('金额'),
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
  getRecordsClass()
})
</script>

<template>
  <div>
    <BaseDatePicker
      v-model="date"
      :min="startTime"
      :max="endTime"
      :is-utc="false"
      show-tab
    />
    <div class="flex my-[8px]">
      <AfunBaseSelect v-model="currency_id" :options="getOptions" active-color="#00AD01" class="flex-1" style="--afun-base-select-border-color: #0F212E" />
    </div>
    <AfunBaseTable
      class="mb-[16px]"
      :class="list.length === 0 ? 'min-h-300' : ''"
      style="--afun-table-th-height:48px;--afun-table-td-height:48px;--afun-table-td-font-weight:500;" :loading="loading"
      :columns="columns" :data-source="list" show-out-load
    >
      <template #amount="{ record }">
        <span class="text-color">
          <AfunBaseAmount
            class="retention-item-amount" :amount="record.amount"
            :currency-type="getCurrencyConfig(bonus_currency)?.name"
          />
        </span>
      </template>
      <template #time="{ record }">
        <span>{{ formatTimestamp12H(record.apply_at) }}</span>
      </template>
    </AfunBaseTable>
    <div v-if="total > 0" class="flex justify-end">
      <AppAlliancePagination v-model:page-size="page_size" v-model:current-page="page" :total="total" />
    </div>
  </div>
</template>

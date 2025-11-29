<script setup lang='ts'>
import type { Column } from '@tg/types'
import { ApiMemberVipBonusRecord } from '@tg/apis'
import { PhBaseAmount, PhBasePagination, PhBaseTable } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { application, getCurrencyConfig } from '@tg/utils'
import { timeToCustomizeFormat } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'AppRebateCenterRecord' })

const { t } = useI18n()
const today = dayjs()
const { isLogin } = storeToRefs(useAppStore())

const dayOptions = [
  { label: t('今日'), value: '0' },
  { label: t('近7日', { delta: 7 }), value: '6' },
  { label: t('近30日', { delta: 30 }), value: '29' },
  { label: t('近90日', { delta: 90 }), value: '89' },
]
const columns: Column[] = [
  {
    title: t('领取时间'),
    dataIndex: 'created_at',
    slot: 'created_at',
    align: 'center',
    width: '50%',
  },
  {
    title: t('领取金额'),
    dataIndex: 'receive_amount',
    slot: 'receive_amount',
    align: 'center',
    width: '50%',
  },
]
const dayType = ref('0')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const params = computed(() => ({
  page: page.value,
  page_size: pageSize.value,
  start_time: today.subtract(+dayType.value, 'day').startOf('day').unix(),
  end_time: today.endOf('day').unix(),
  cash_type: '814',
}))

const { loading, data, runAsync: runAsyncGetRecordAsync, run } = useRequest(ApiMemberVipBonusRecord, {
  onSuccess(res) {
    if (page.value === 1 && res.d && res.d.length > 0 && res.t)
      total.value = res.t
  },
})
const records = computed(() => {
  if (data.value && data.value.d && data.value.d.length > 0)
    return data.value.d
  return []
})
// const _records = [
//   { created_at: '1752071174263', receive_amount: '100', receive_currency_id: '701' },
//   { created_at: '1752071174263', receive_amount: '100', receive_currency_id: '701' },
//   { created_at: '1752071174263', receive_amount: '100', receive_currency_id: '701' },
//   { created_at: '1752071174263', receive_amount: '100', receive_currency_id: '701' },
//   { created_at: '1752071174263', receive_amount: '100', receive_currency_id: '701' },
//   { created_at: '1752071174263', receive_amount: '100', receive_currency_id: '701' },
// ]

function changeDayType(item: IBaseSelectItem) {
  if (dayType.value === item.value)
    return

  dayType.value = item.value
  reset()
  getData()
}
function onPrevious() {
  page.value = page.value - 1
  getData()
}
function onNext() {
  page.value = page.value + 1
  getData()
}
function getData() {
  run(params.value)
}
function reset() {
  page.value = 1
  total.value = 0
}

if (isLogin.value)
  application.allSettled([runAsyncGetRecordAsync(params.value)])
</script>

<template>
  <AppPageLayout :title="t('返水记录')">
    <div class="tabs">
      <div
        v-for="item in dayOptions" :key="item.value" class="theme-tab-btn"
        :class="{ active: dayType === item.value }" @click="changeDayType(item)"
      >
        <span>{{ item.label }}</span>
      </div>
    </div>
    <PhBaseTable
      class="theme-table" :loading="loading" :columns="columns" :data-source="records" show-out-load
      :out-load-height="218"
    >
      <template #created_at="{ record }">
        {{ timeToCustomizeFormat(record.created_at, 'YYYY/MM/DD HH:mm:ss') }}
      </template>
      <template #receive_amount="{ record }">
        <div class="center">
          <PhBaseAmount
            :amount="record.receive_amount"
            :currency-type="getCurrencyConfig(record.receive_currency_id).name"
          />
        </div>
      </template>
    </PhBaseTable>
    <div v-if="total > pageSize" class="my-[16rem]">
      <PhBasePagination :total="total" :page="page" :page-size="pageSize" @previous="onPrevious" @next="onNext" />
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 5rem;
  width: 100%;
  column-gap: 16rem;

  .theme-tab-btn {
    color: #0d2245;
    font-size: 14rem;
    font-weight: 500;
    height: 40rem;
    border-radius: 6rem;
    background: #fff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 5rem;
    border: 1px solid #ebebeb;

    &.active {
      background: #f23038;
      color: #fff;
      border-color: #f23038;
    }
  }
}
</style>

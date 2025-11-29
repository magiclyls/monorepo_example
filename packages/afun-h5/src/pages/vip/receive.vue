<script lang="ts" setup>
import type { Column } from '@tg/types'
import { ApiMemberVipBonusRecord } from '@tg/apis'
import { AfunBaseAmount, AfunBasePagination, AfunBaseSelect, AfunBaseTable } from '@tg/bccomponents'
import { useAppStore, useVipStore } from '@tg/stores'
import { application, getCurrencyConfig } from '@tg/utils'
import { timeToFormatDiffOnChinese } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppVipRuleDesc from '~/components/AppVipRuleDesc.vue'

defineOptions({ name: 'AppVipReceive' })

const today = dayjs()
const { t } = useI18n()
const {
  isLogin,

} = storeToRefs(useAppStore())
const { isVipUpgradeBonusOpen, isVipDayBonusOpen, isVipWeekBonusOpen, isVipMonthBonusOpen } = storeToRefs(useVipStore())

const dayOptions = [
  { label: t('今日'), value: '0' },
  { label: t('近几日', { delta: 7 }), value: '6' },
  { label: t('近几日', { delta: 30 }), value: '29' },
  { label: t('近几日', { delta: 90 }), value: '89' },
]
const columns = reactive<Column[]>([
  {
    title: t('时间'),
    dataIndex: 'updated_at',
    slot: 'updated_at',
    align: 'center',
    width: '33%',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('类型'),
    dataIndex: 'cash_type',
    slot: 'cash_type',
    align: 'center',
    width: '33%',
    color: 'var(--afun-table-text-color)',
  },
  {
    title: t('金额'),
    dataIndex: 'receive_amount',
    slot: 'receive_amount',
    align: 'center',
    width: '33%',
    color: 'var(--afun-table-amount-color)',
  },
])
const dayType = ref('0')
const bonusType = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

const params = computed(() => ({
  page: page.value,
  page_size: pageSize.value,
  start_time: today.subtract(+dayType.value, 'day').startOf('day').unix(),
  end_time: today.endOf('day').unix(),
  cash_type: bonusType.value,
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

const typeOptions = computed(() => {
  return [
    { label: t('全部'), value: '' },
    isVipUpgradeBonusOpen.value ? { label: t('晋级'), value: '818' } : undefined,
    isVipDayBonusOpen.value ? { label: t('日奖金'), value: '819' } : undefined,
    isVipWeekBonusOpen.value ? { label: t('周奖金'), value: '820' } : undefined,
    isVipMonthBonusOpen.value ? { label: t('月奖金'), value: '821' } : undefined,
  ].filter(a => a !== void 0)
})

function getCashType(cashType: string) {
  return [
    { label: t('晋级'), value: '818' },
    { label: t('日奖金'), value: '819' },
    { label: t('周奖金'), value: '820' },
    { label: t('月奖金'), value: '821' },
  ].find(item => item.value === cashType.toString())?.label ?? '-'
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

watch([dayType, bonusType], () => {
  reset()
  getData()
})

watch(isLogin, (val) => {
  if (val) {
    runAsyncGetRecordAsync(params.value)
  }
})

if (isLogin.value) {
  application.allSettled(
    [runAsyncGetRecordAsync(params.value)],
  )
}
</script>

<template>
  <div class="mt-[16px] w-full flex flex-col overflow-hidden">
    <div class="grid grid-cols-2 gap-[16px]">
      <AfunBaseSelect v-model="dayType" :options="dayOptions" style="--afun-base-select-border-color: #0f212e;--afun-base-select-border-color-focus: #0f212e;" />
      <AfunBaseSelect v-model="bonusType" :options="typeOptions" style="--afun-base-select-border-color: #0f212e;--afun-base-select-border-color-focus: #0f212e;" />
    </div>
    <AfunBaseTable
      :class="records.length === 0 ? 'min-h-300' : ''"
      style="--afun-table-th-height:48px;--afun-table-td-height:48px;--afun-table-td-font-weight:500;" :loading="loading"
      :columns="columns" :data-source="records" show-out-load
    >
      <template #updated_at="{ record }">
        {{ timeToFormatDiffOnChinese(record.created_at, 'MM/DD') }}
      </template>
      <template #cash_type="{ record }">
        {{ $t('VIP奖金类型', { vip: record.vip, type: getCashType(record.cash_type) }) }}
      </template>
      <template #receive_amount="{ record }">
        <div class="center">
          <AfunBaseAmount
            :amount="record.receive_amount"
            :currency-type="getCurrencyConfig(record.receive_currency_id).name"
            style="--afun-app-amount-font-weight:500;--afun-base-amount-font-size: 14px;"
          />
        </div>
      </template>
    </AfunBaseTable>
    <div v-if="total > 10" class="pages">
      <AfunBasePagination :page="page" :page-size="pageSize" :total="total" @previous="onPrevious" @next="onNext" />
    </div>
    <AppVipRuleDesc class="mt-[16px]" />
  </div>
</template>

<style lang="scss" scoped></style>

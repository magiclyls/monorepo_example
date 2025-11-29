<script lang="ts" setup>
import type { Column } from '@tg/types'
import { ApiAgencyCommissionDetail } from '@tg/apis'
import { PhBaseAmount, PhBaseSelect, PhBaseTable } from '@tg/bccomponents'
import { useList, useListSearch, useSelect } from '@tg/hooks'
import { useAffiliate, useAppStore } from '@tg/stores'
import { getCurrencyConfig } from '@tg/utils'
import { getDaIntervalMap } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AppAlliancePagination from '~/components/AppAlliancePagination.vue'
import BaseDatePicker from '~/components/BaseDatePicker.vue'

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { bonus_currency, mode } = storeToRefs(useAffiliate())
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const detail = ref<{
  username?: string
  valid_bet_amount?: string
  commission_amount?: string
}>({})
const {
  selected: currency_id,
  list: currencyList,
} = useSelect([
  {
    label: t('直属佣金'),
    value: 1,
  },
  {
    label: t('团队佣金'),
    value: 2,
  },
])

const {
  list,
  page,
  page_size,
  loading,
  total,
  runAsync,
  resetPage,
} = useList(ApiAgencyCommissionDetail, {
  onSuccess: (res) => {
    detail.value = res.c
  },

}, { page_size: 5, isWatchPageOrPageSize: false })

const date = ref([
  dayjs(new Date().getTime() + window.serverTimeDiff).subtract(1, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  dayjs(new Date().getTime() + window.serverTimeDiff).subtract(1, 'day').endOf('day').format('YYYY-MM-DD HH:mm:ss'),
])

const columns = computed<Column[]>(() =>
  [
    {
      title: (currency_id.value === 1 ? t('直属') : t('团队')) + t('玩家'),
      dataIndex: 'username',
      align: 'center',
      slot: 'label_type',
      skeWidth: '100px',
    },
    {
      title: t('投注'),
      dataIndex: 'valid_bet_amount',
      align: 'center',
      slot: 'hilo_bet',
    },
    {
      title: t('佣金'),
      dataIndex: 'commission_amount',
      align: 'center',
      slot: 'amount',
      isAmount: true,
      showColor: true,
    },
  ])

const params = computed(() => {
  return {
    user_type: currency_id.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
  }
})
const runFn = throttle(async (val) => {
  runAsync(val)
}, 500, { leading: true, trailing: false })

onMounted(() => {
  watch(() => isLogin.value, (newValue) => {
    newValue && useListSearch(params, runFn, resetPage)
  }, { immediate: true })
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
    <div class="flex my-[8rem]">
      <PhBaseSelect v-model="currency_id" :options="currencyList" active-color="#F23038" class="flex-1" style="--ph-base-select-background-color: #fff" />
    </div>
    <div class="flex flex-col gap-[1rem] rounded-[6rem] overflow-hidden mb-[8rem]">
      <div class="bg-[#fff] px-[16rem] flex justify-between h-[53rem] items-center">
        <div class="font-500 leading-normal text-[#6D7693] text-[14rem]">
          {{ t('有效投注') }}
        </div>
        <PhBaseAmount
          class="font-[600] leading-normal text-[#0D2245] text-[14rem] text-center" :amount="detail.valid_bet_amount || '0'"
          :currency-type="getCurrencyConfig(bonus_currency)?.name"
        />
      </div>
      <div class="bg-[#fff] px-[16rem] flex justify-between h-[53rem] items-center">
        <div class="font-500 leading-normal text-[#6D7693] text-[14rem]">
          {{ t('已领佣金') }}
        </div>
        <PhBaseAmount
          class="font-[600] leading-normal text-[#0D2245] text-[14rem] text-center" :amount="detail.commission_amount || '0'"
          :currency-type="getCurrencyConfig(bonus_currency)?.name"
        />
      </div>
    </div>
    <PhBaseTable
      class="mb-[16rem]"
      :class="list.length === 0 ? 'min-h-300' : ''"
      style="--tg-table-th-height:48rem;--tg-table-td-height:48rem;--tg-table-td-font-weight:500;" :loading="loading"
      :columns="columns" :data-source="list" show-out-load
    />
    <div v-if="total > 0" class="flex justify-end">
      <AppAlliancePagination v-model:page-size="page_size" v-model:current-page="page" :total="total" />
    </div>
  </div>
</template>

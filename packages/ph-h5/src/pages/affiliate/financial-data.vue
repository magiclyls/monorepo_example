<script lang="ts" setup>
import type { Column } from '@tg/types'
import { ApiAgencyCommissionFinance, ApiAgencyCommissionModelsList } from '@tg/apis'
import { PhBaseCurrencyIcon, PhBaseInput, PhBaseSelect, PhBaseTable } from '@tg/bccomponents'
import { useList, useListSearch, useSelect } from '@tg/hooks'
import { useAffiliate, useAppStore } from '@tg/stores'
import { getCurrencyConfig } from '@tg/utils'
import { getDaIntervalMap } from '@tg/vue-i18n'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppAlliancePagination from '~/components/AppAlliancePagination.vue'
import BaseDatePicker from '~/components/BaseDatePicker.vue'

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { bonus_currency, mode } = storeToRefs(useAffiliate())
const { startTime, endTime } = getDaIntervalMap(new Date().getTime(), 30)
const date = ref([])
const detail = ref([])
const lock = ref(false)
const searchValue = ref('')

const platformIdList = ref([
  {
    label: t('全部'),
    value: '',
  },
])
const {
  selected: currency_id,
  list: currencyList,
} = useSelect([
  {
    label: t('全部'),
    value: 0,
  },
  {
    label: t('直属'),
    value: 1,
  },
  {
    label: t('团队'),
    value: 2,
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
} = useList(ApiAgencyCommissionFinance, {
  onSuccess: (res) => {
    detail.value = res.c
  },
}, { page_size: 25, isWatchPageOrPageSize: true })

const columns = computed<Column[]>(() => {
  const width = '31vw'
  const isThLineClamp2 = false

  return [
    {
      title: t('玩家'),
      dataIndex: 'username',
      align: 'center',
      slot: 'time',
      skeWidth: '100px',
      isThLineClamp2,
      width,
    },
    {
      title: t('投注'),
      dataIndex: 'valid_bet_amount',
      align: 'center',
      slot: 'settings_bets',
      isThLineClamp2,
      width,
    },
    {
      title: t('输赢'),
      dataIndex: 'net_amount',
      align: 'center',
      slot: 'win_lose',
      isThLineClamp2,
      width,
    },
    {
      title: t('存款'),
      dataIndex: 'deposit_amount',
      align: 'center',
      slot: 'settings_deposits',
      isThLineClamp2,
      width,
    },
    {
      title: t('取款'),
      dataIndex: 'withdraw_amount',
      align: 'center',
      slot: 'withdraw',
      isThLineClamp2,
      width,
    },
    {
      title: t('现金利润'),
      dataIndex: 'cash_profit',
      align: 'center',
      slot: 'cash_profit',
      sumSlot: 'sum_cash_profit',
      isThLineClamp2,
      width,
    },
  ]
})

const sumData = computed(() => {
  if (detail.value && detail.value[0]) {
    const allData = detail.value[0]
    return [t('sum_label'), allData.valid_bet_amount, allData.net_amount, allData.deposit_amount, allData.withdraw_amount, allData.cash_profit]
  }
  return []
})

const params = computed(() => {
  return {
    username: searchValue.value,
    user_type: currency_id.value,
    start_time: date.value[0],
    end_time: date.value[1],
    page_size: page_size.value,
    page: page.value,
  }
})

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

const runFn = throttle(async (val) => {
  runAsync(val)
}, 500, { leading: true, trailing: false })

onMounted(() => {
  if (mode.value === 1) {
    currency_id.value = 1
    lock.value = true
  }
  else if (mode.value === 2) {
    currency_id.value = 0
    lock.value = true
  }
  else if (mode.value === 3) {
    currency_id.value = 0
  }

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
    <div class="flex gap-[20rem] my-[8rem]">
      <PhBaseSelect v-model="currency_id" :options="currencyList" active-color="#F23038" class="flex-1" style="--ph-base-select-background-color: #fff" />
      <PhBaseInput
        ref="newPwd"
        v-model="searchValue"
        type="text"
        class="flex-1"
        search
        style="--ph-base-input-padding-y:9rem;"
        :placeholder="t('搜索账号')"
      />
    </div>
    <PhBaseTable
      class="mb-[16rem]"
      :class="list.length === 0 ? 'min-h-300' : ''"
      style="--tg-table-th-height:48rem;--tg-table-td-height:48rem;--tg-table-td-font-weight:500;" :loading="loading"
      :columns="columns" :data-source="list" show-out-load :sum-data="sumData" :show-summary="true"
    >
      <template #th-settings_bets>
        <div class="center" style="margin-left: 3px">
          <PhBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency).name" />
        </div>
      </template>
      <template #th-win_lose>
        <div class="center" style="margin-left: 3px">
          <PhBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" />
        </div>
      </template>
      <template #th-settings_deposits>
        <div class="center" style="margin-left: 3px">
          <PhBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" />
        </div>
      </template>
      <template #th-withdraw>
        <div class="center" style="margin-left: 3px">
          <PhBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" />
        </div>
      </template>
      <template #th-cash_profit>
        <div class="center" style="margin-left: 3px">
          <PhBaseCurrencyIcon :currency-type="getCurrencyConfig(bonus_currency)?.name" />
        </div>
      </template>
      <template #net_amount="{ record }">
        <span>
          {{ record.net_amount > 0 ? '+' : '-' }}{{ record.net_amount }}
        </span>
      </template>
      <template #cash_profit="{ record }">
        <span :style="{ color: record.cash_profit > 0 ? '#2BA471' : '#FF4D4F' }">
          {{ record.cash_profit > 0 ? '+' : '-' }}{{ record.cash_profit }}
        </span>
      </template>
      <template #sum_cash_profit="{ sums, n }">
        <span :style="{ color: sums[n] > 0 ? '#2BA471' : '#FF4D4F' }">
          {{ sums[n] > 0 ? '+' : '-' }}{{ sums[n] }}
        </span>
      </template>
    </PhBaseTable>
    <div v-if="total > 0" class="flex justify-end">
      <AppAlliancePagination v-model:page-size="page_size" v-model:current-page="page" :total="total" />
    </div>
  </div>
</template>

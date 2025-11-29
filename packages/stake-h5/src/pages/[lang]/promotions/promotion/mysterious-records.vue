<script setup lang="ts">
import type { CurrencyCode } from '~/composables/useCurrencyData'

import { ApiMemberPromoMineClaimList } from '@tg/apis'
/* 神秘矿井产品说不要了 */
import dayjs from 'dayjs'
import { isMobile } from 'pixi.js'
import { computed } from 'vue'

const { t } = useI18n()

const searchs = {
  all: t('finance_other_tab_all'),
  now: t('today'),
  7: t('last_7_days'),
  30: t('last_30_days'),
} as { [key: string]: any }

const searchKey = ref(['all', 'now', 7, 30])
const route = useRoute()
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const page_size = ref(10)
const pid = computed(() => Number(route.query.pid))
const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
const sum_amount = ref('0')
const currentLangCurrency = computed(() => {
  return currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
})

const activeType = ref('all')
const globalCurrencyCode = computed(() => {
  if (isLogin.value)
    return application.isVirtualCurrency(currentGlobalCurrency.value) ? currencyConfig.USDT.cur : currencyConfig[currentGlobalCurrency.value].cur

  return currentLangCurrency.value
})
const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone)
const columns = computed<Column[]>(() => [
  {
    title: t('time_period'),
    dataIndex: 'time',
    align: 'left',
  },
  {
    title: t('receive_bonus_amount'),
    dataIndex: 'amount',
    align: 'right',
    slot: 'amount',
  },
])
function formatMoney(value?: string) {
  // 转换为数字
  const num = Number(value)

  // 检查是否为有效数字
  if (Number.isNaN(num)) {
    console.warn('formatMoney: 输入值不是有效数字', value)
    return '0.00'
  }

  // 四舍五入并保留两位小数
  return num.toFixed(2)
}

// 领取记录
const {
  list,
  prev,
  next,
  total,
  page,
  runAsync,
  loading,
} = useList(ApiMemberPromoMineClaimList, {
  onSuccess: (data) => {
    sum_amount.value = data.sum_amount
  },

}, {
  page_size: page_size.value,
})
const getPaginationData = computed(() => {
  return {
    page: page.value,
    total: total.value,
    pageSize: page_size.value,
  }
})
function getTimeRange(timezone = 'Asia/Shanghai') {
  // 参数检查
  const type = activeType.value

  const normalizedType = String(type).toLowerCase()

  if (normalizedType === 'all')
    return { start: '', end: '' }

  const now = dayjs().tz(timezone)
  let startDate

  switch (normalizedType) {
    case 'now':
      return {
        start: Math.floor(now.startOf('day').valueOf() / 1000),
        end: Math.floor(now.endOf('day').valueOf() / 1000),
      }

    case '7':
    case '30':
      // 关键修复：保持时区计算
      startDate = now.subtract(normalizedType, 'day')
        .tz(timezone) // 重新确认时区
        .startOf('day')
      return {
        start: Math.floor(startDate.valueOf() / 1000),
        end: Math.floor(now.valueOf() / 1000), // 结束时间保持当前时刻
      }

    default:
      throw new Error('Invalid type. Allowed values: "now", 7, 30, "all"')
  }
}
function getList() {
  const params = {
    pid,
    currency_id: usedCurrencyCode.value,
    page: 1,
    page_size: page_size.value,
    start_at: getTimeRange(currentDollarZone.value).start,
    end_at: getTimeRange(currentDollarZone.value).end,
  }
  runAsync(params)
}
function resetType(item: string) {
  activeType.value = item
  getList()
}

onMounted(() => {
  getList()
})
</script>

<template>
  <div class="fixed-container main-box text-tg-text-lightgrey m-auto mt-[16px] max-w-[650px] pb-[25px]">
    <div class="search-line">
      <div v-for="(item, index) in searchKey" :key="index" class="search-item" :class="{ active: activeType == item }" @click="resetType(item)">
        {{ searchs[item] }}
      </div>
    </div>
    <div class="mb-[4px] mt-[15px] text-center text-sm">
      <span>{{ t("aggregate_income") }}：</span>
      <span>{{ formatMoney(sum_amount) }}</span>
    </div>
    <div style="min-height: 320px">
      <AppLoading v-if="loading" style="height: 100%" />
      <BaseTable
        v-else
        class="records page-direct-finance"
        :columns="columns"
        :data-source="list"
        :loading="loading"
        :skeleton-row="5"
        is-amount-popper
      >
        <template #amount="{ record: { amount, currency_id } }">
          <div style="display: flex;justify-content: end">
            <AppAmount
              :amount="amount" :show-icon="true" :currency-type="getCurrencyConfigByCode(currency_id)?.name"
              style="--tg-app-amount-font-weight:var(--tg-font-weight-normal);"
            />
          </div>
        </template>
      </BaseTable>
    </div>

    <template v-if="isMobile">
      <AppStack
        v-show="total > 10"
        class="mt-[16px]"
        :pagination-data="getPaginationData"
        scroll
        @previous="prev" @next="next"
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

<style scoped lang="scss">
.main-box {
  font-family: 'PingFang SC';
  .search-line {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .search-item {
      word-break: break-all;
      font-size: 14px;
      padding: 12px;
      white-space: nowrap;
      cursor: pointer;
      background-color: var(--tg-secondary-dark);
      color: #ffffff;
      border-radius: 4px;
      margin-right: 8px;
      &:nth-child(n + 4) {
        margin-right: 0;
      }
      @include webTheme('green') {
        background-color: #02432d;
      }
      @include webTheme('white') {
        background-color: #f5f5f5;
        color: #111111;
      }
      &.active {
        background-color: var(--tg-secondary-main);
        @include webTheme('green') {
          background-color: #197b59;
        }
        @include webTheme('white') {
          background-color: #cbcbcb;
        }
      }
    }
  }
  .records {
    --tg-table-th-color: #ffffff;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

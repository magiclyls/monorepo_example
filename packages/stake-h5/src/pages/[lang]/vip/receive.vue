<script lang="ts" setup>
import { ApiMemberVipBonusRecord } from '@tg/apis'

const today = dayjs()
const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const {
  isLogin,
  isVipUpgradeBonusOpen,
  isVipDayBonusOpen,
  isVipWeekBonusOpen,
  isVipMonthBonusOpen,
} = storeToRefs(useAppStore())
const {
  list: records,
  runAsync: runAsyncGetRecordAsync,
  page,
  page_size,
  total,
  prev,
  next,
  loading,
  resetPage,
} = useList(ApiMemberVipBonusRecord, {
  ready: isLogin,
}, { page_size: 10 })

const typeOptions = computed(() => {
  return [
    { label: t('finance_other_tab_all'), value: '' },
    isVipUpgradeBonusOpen.value ? { label: t('vip_promotion'), value: '818' } : undefined,
    isVipDayBonusOpen.value ? { label: t('vip_day_salary_bonus'), value: '819' } : undefined,
    isVipWeekBonusOpen.value ? { label: t('vip_week_salary_bonus'), value: '820' } : undefined,
    isVipMonthBonusOpen.value ? { label: t('vip_month_salary_bonus'), value: '821' } : undefined,
  ].filter(a => a !== void 0)
})

// const { runAsync: runAsyncVipPrizeConfig } = useRequest(ApiMemberVipPrizeConfig, {
// onSuccess(data) {
//   if (data) {
//     const nav = data.nav
//     const _options: {
//       [t: string]: { label: string; value: string }
//     } = {
//       819: { label: t('vip_day_salary_bonus'), value: '819' },
//       820: { label: t('vip_week_salary_bonus'), value: '820' },
//       821: { label: t('vip_month_salary_bonus'), value: '821' },
//     }
//     for (const key in nav) {
//       if (nav[key] && _options[key])
//         typeOptions.value.push(_options[key])
//     }
//   }
// },
// })

const dayOptions = [
  { label: t('today'), value: '0' },
  { label: t('last_days_mid', { delta: 7 }), value: '6' },
  { label: t('last_days_mid', { delta: 30 }), value: '29' },
  { label: t('last_days_mid', { delta: 90 }), value: '89' },
]
const columns = reactive<Column[]>([
  {
    title: t('time'),
    dataIndex: 'updated_at',
    slot: 'updated_at',
    align: 'center',
    width: '33%',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('label_type'),
    dataIndex: 'cash_type',
    slot: 'cash_type',
    align: 'center',
    width: '33%',
    color: 'var(--tg-table-text-color)',
  },
  {
    title: t('amount'),
    dataIndex: 'receive_amount',
    slot: 'receive_amount',
    align: 'center',
    width: '33%',
    color: 'var(--tg-table-amount-color)',
  },
])
const dayType = ref('0')
const bonusType = ref('')

const params = computed(() => ({
  page: page.value,
  page_size: page_size.value,
  start_time: today.subtract(+dayType.value, 'day').startOf('day').unix(),
  end_time: today.endOf('day').unix(),
  cash_type: bonusType.value,
}))

function getCashType(cashType: string) {
  return [
    { label: t('vip_promotion'), value: '818' },
    { label: t('vip_day_salary_bonus'), value: '819' },
    { label: t('vip_week_salary_bonus'), value: '820' },
    { label: t('vip_month_salary_bonus'), value: '821' },
  ].find(item => item.value === cashType.toString())?.label ?? '-'
}
function onPrevious() {
  prev()
}

function onNext() {
  next()
}

watch(isLogin, (val) => {
  if (val) {
    // runAsyncVipPrizeConfig({ cur: '706' })
    runAsyncGetRecordAsync(params.value)
  }
})

onMounted(() => {
  // runAsyncVipPrizeConfig({ cur: '706' })
})

useListSearch(params, runAsyncGetRecordAsync, resetPage)
if (isLogin.value) {
  application.allSettled(
    [runAsyncGetRecordAsync(params.value)], // runAsyncVipPrizeConfig({ cur: '706' }),
  )
}
</script>

<template>
  <div class="app-vip-bonus-record" :class="{ 'is-mobile': isMobile }">
    <div class="filters justify-start" :class="{ 'is-mobile': isMobile }">
      <div class="w-full">
        <BaseSelect v-model="dayType" popper :options="dayOptions">
          <template #option="{ data: { parentWidth, item } }">
            <div :style="{ width: `${parentWidth}px` }">
              {{ item.label }}
            </div>
          </template>
        </BaseSelect>
      </div>
      <div class="w-full">
        <BaseSelect v-model="bonusType" popper :options="typeOptions" over-ellipsis>
          <template #option="{ data: { parentWidth, item } }">
            <div :style="{ width: `${parentWidth}px` }">
              {{ item.label }}
            </div>
          </template>
        </BaseSelect>
      </div>
    </div>
    <BaseTable :class="records.length === 0 ? 'min-h-[300px]' : ''" :loading="loading" :columns="columns" :data-source="records" show-out-load :out-load-height="218">
      <template #updated_at="{ record }">
        {{ timeToFormatByBoss(record.created_at) }}
      </template>
      <template #cash_type="{ record }">
        {{ $t('vip_cash_type', { vip: record.vip, type: getCashType(record.cash_type) }) }}
        <!-- {{ `${record.cash_type === 818 ? (`VIP${record.vip}`) : ''}${getCashType(record.cash_type)}` }} -->
      </template>
      <template #receive_amount="{ record }">
        <div class="center">
          <AppAmount
            :amount="record.receive_amount"
            :currency-type="getCurrencyConfigByCode(record.receive_currency_id).name"
          />
        </div>
      </template>
    </BaseTable>
    <div v-if="total > 10" class="pages">
      <AppStack :pagination-data="{ page, pageSize: page_size, total }" @previous="onPrevious" @next="onNext" />
    </div>
    <AppVipRuleDesc class="mt-[16px]" />
  </div>
</template>

<style lang="scss" scoped>
.app-vip-bonus-record {
  width: 100%;
  overflow: hidden;
  background: var(--tg-secondary-dark);
  padding: 12px 12px;
  border-radius: var(--tg-radius-default);
  --tg-base-select-style-padding-y: 8px;
  @include webTheme('green') {
    --tg-table-even-background: #076237;
    --tg-table-odd-background: #055434;
    --tg-table-th-background: #076237;
    --tg-table-amount-color: #3cb389;
    --tg-table-text-color: #3cb389;
    margin-top: 5px;
    --tg-base-select-border: 1px solid #197b59;
    --tg-base-select-box-shadow: none;
  }
  @include webTheme('white') {
    --tg-base-select-bg-theme-white: #f5f5f5;
  }
  &.is-mobile {
    background: none;
    padding: 0 0;
    border: none !important;
    --tg-base-select-border: none;
    --tg-base-select-style-padding-y: 10px;
    .filters {
      margin-bottom: 0;
      grid-template-columns: 1fr 1fr;
    }
  }
}
.filters {
  --tg-base-select-style-padding-right: 20px;
  // max-width: 425px;
  display: grid;
  grid-template-columns: 170px 170px;
  align-items: center;
  gap: 20px;
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);
  margin-bottom: 16px;
  --tg-base-select-popper-bg-color: #071824;
  @include webTheme('green') {
    --tg-base-select-popper-bg-color: #076237;
  }
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #fff;
  }
  &.is-mobile {
    --tg-base-select-popper-bg-color: #0f212e;
    @include webTheme('white') {
      --tg-base-select-popper-bg-color: #f5f5f5;
    }
    @include webTheme('green') {
      --tg-base-select-popper-bg-color: #02432d;
    }
  }
}

.pages {
  margin-top: var(--tg-spacing-16);
}
</style>

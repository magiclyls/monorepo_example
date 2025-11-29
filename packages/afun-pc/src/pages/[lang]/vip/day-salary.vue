<script lang="ts" setup>
import { ApiMemberVipPrizeConfig } from '@tg/apis'

const { t } = useI18n()
const appStore = useAppStore()
const {
  isLogin,
  currentGlobalCurrency,
  isVipDayBonusOpen,
  isVipWeekBonusOpen,
  isVipMonthBonusOpen,
} = storeToRefs(appStore)
const { getVipConfigLoading } = storeToRefs(appStore)
const { isZeroShowOther, currencyModeCur } = useVipInfo()
const { isMobile } = storeToRefs(useWindowStore())

const vipPrizeConfig = ref<{
  [t: string]: string | number
  level: number
  dailyGift: string
  weeklyGift: string
  monthlyGift: string
}[]>([])
const currencyName = ref(isLogin.value ? currentGlobalCurrency.value : languageConfig[getCurrentLanguageForFrontend()].currency)
// 接口返回的币种
const memberCurrency = ref(currencyName.value)

const { runAsync: runAsyncVipPrizeConfig } = useRequest(ApiMemberVipPrizeConfig, {
  onSuccess(data) {
    if (data) {
      const _data = Object.values(data.data ?? []).sort((a, b) => a[0].level - b[0].level)
      memberCurrency.value = getCurrencyConfigByCode(_data[0][0].currency_id).name
      const _vipPrizeConfig = []
      for (const key in _data) {
        const amountArr = _data[key].map((item) => {
          return item.amount
        })
        _vipPrizeConfig.push({
          level: _vipPrizeConfig.length,
          dailyGift: amountArr[1],
          weeklyGift: amountArr[2],
          monthlyGift: amountArr[3],
        })
      }
      vipPrizeConfig.value = _vipPrizeConfig
    }
  },
})

const columnConfig: { [t: string]: Column } = {
  VIP: {
    title: `${t('grade', { vip: 'VIP' })}`,
    dataIndex: 'level',
    align: 'center',
    slot: 'level',
  },
  DAY: {
    title: t('vip_Cumulative_bonus_day_salary_bonus'),
    dataIndex: 'dailyGift',
    align: 'center',
    slot: 'daily_gift',
    color: 'var(--tg-table-amount-color)',
  },
  WEEK: {
    title: t('vip_Cumulative_bonus_week_salary_bonus'),
    dataIndex: 'weeklyGift',
    align: 'center',
    slot: 'weekly_gift',
    color: 'var(--tg-table-amount-color)',
  },
  MONTH: {
    title: t('vip_Cumulative_bonus_month_salary_bonus'),
    dataIndex: 'monthlyGift',
    align: 'center',
    slot: 'monthly_gift',
    color: 'var(--tg-table-amount-color)',
  },
}

const getBonusConfig = computed(() => {
  return vipPrizeConfig.value.filter(item => item.level !== 0)
})
const getShowColumn = computed(() => {
  const arr: Column[] = []
  for (const key in columnConfig) {
    const item = columnConfig[key]
    if (key === 'VIP') {
      arr.push(item)
      continue
    }
    if (key === 'DAY' && !isVipDayBonusOpen.value)
      continue
    if (key === 'WEEK' && !isVipWeekBonusOpen.value)
      continue
    if (key === 'MONTH' && !isVipMonthBonusOpen.value)
      continue

    if (!isArrKeyZero(item.dataIndex))
      arr.push(item)
  }
  return arr.length === 1 ? [] : arr // 如果只有vip等级，则全部不展示
})
// 判断展示哪种货币，防止钱包选择的货币，后端不支持
// const activeCurrency = computed(() => {
//   return (currencyName.value === memberCurrency.value) ? currencyName.value : memberCurrency.value
// })

/** 判断数组某个字段是否都有值 */
function isArrKeyZero(key: string) {
  return getBonusConfig.value.every(item => isZeroShowOther(item[key].toString()))
}

// watch(() => currentGlobalCurrency.value, (newVal) => {
//   runAsyncVipPrizeConfig({
//     cur: currencyConfig[newVal].cur,
//   }).then(() => {
//     currencyName.value = newVal
//   })
// })

// 初始化数据
function initData() {
  return new Promise((resolve) => {
    let a = 0
    const t = setInterval(() => {
      a++
      if (currencyModeCur.value) {
        clearInterval(t)
        runAsyncVipPrizeConfig({ cur: currencyConfig[currencyModeCur.value].cur }).finally(() => {
          resolve(true)
        })
      }
      else if (a > 300) {
        clearInterval(t)
        resolve(true)
      }
    }, 50)
  })
}

await initData()
</script>

<template>
  <div class="vip-day-salary" :class="{ 'is-mobile': isMobile }">
    <div class="tabs">
      <BaseTable
        :columns="getShowColumn" :data-source="getShowColumn.length ? getBonusConfig : []"
        :loading="getVipConfigLoading" :show-out-load="true" :out-load-height="isMobile ? 360 : 636"
      >
        <template #level="{ record }">
          <div class="center">
            <BaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
          </div>
        </template>
        <template #daily_gift="{ record: { dailyGift } }">
          <div v-if="isZeroShowOther(dailyGift)">
            -
          </div>
          <div v-else class="center">
            <AppAmount :amount="dailyGift" :currency-type="currencyModeCur" />
          </div>
        </template>
        <template #weekly_gift="{ record: { weeklyGift } }">
          <div v-if="isZeroShowOther(weeklyGift)">
            -
          </div>
          <div v-else class="center">
            <AppAmount :amount="weeklyGift" :currency-type="currencyModeCur" />
          </div>
        </template>
        <template #monthly_gift="{ record: { monthlyGift } }">
          <div v-if="isZeroShowOther(monthlyGift)">
            -
          </div>
          <div v-else class="center">
            <AppAmount :amount="monthlyGift" :currency-type="currencyModeCur" />
          </div>
        </template>
      </BaseTable>
    </div>
    <AppVipRuleDesc />
  </div>
</template>

<style lang="scss" scoped>
.vip-day-salary {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: var(--tg-spacing-14);
  &.is-mobile {
    .tabs {
      background: none;
      padding: 0 0;
      position: relative;
      border: none !important;
    }
  }
  .tabs {
    background: var(--tg-secondary-dark);
    padding: 12px 12px;
    border-radius: var(--tg-radius-default);
    @include webTheme('green') {
      --tg-table-even-background: #055434;
      --tg-table-odd-background: #076237;
      --tg-table-th-background: #055434;
      --tg-table-amount-color: #3cb389;
      --tg-table-text-color: #3cb389;
    }
  }
  @include webTheme('white') {
    --tg-table-th-color: #111111;
    --tg-table-td-font-weight: 500;
    --tg-app-amount-font-weight: 500;
    --tg-table-even-background: #f5f5f5;
    --tg-table-odd-background: #fff;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

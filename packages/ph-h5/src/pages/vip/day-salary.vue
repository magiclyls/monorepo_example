<script lang="ts" setup>
import type { Column } from '@tg/types'
import { ApiMemberVipPrizeConfig } from '@tg/apis'
import { PhBaseAmount, PhBaseImage, PhBaseTable } from '@tg/bccomponents'
import { useAppStore, useCurrency, useVipStore } from '@tg/stores'
import { languageConfig } from '@tg/types'
import { getCurrencyConfig } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppVipRuleDesc from '~/components/AppVipRuleDesc.vue'

defineOptions({ name: 'AppDaySalary' })

const { t } = useI18n()
const appStore = useAppStore()
const vipStore = useVipStore()
const { isVipDayBonusOpen, currencyModeCur, isVipWeekBonusOpen, isVipMonthBonusOpen, getVipConfigLoading } = storeToRefs(vipStore)
const { isLogin } = storeToRefs(appStore)
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

const vipPrizeConfig = ref<{
  [t: string]: string | number
  level: number
  dailyGift: string
  weeklyGift: string
  monthlyGift: string
}[]>([])
const currencyName = ref(isLogin.value ? currentGlobalCurrencyMap.value.type : languageConfig[getLang()].currency)
// 接口返回的币种
const memberCurrency = ref(currencyName.value)

const { runAsync: runAsyncVipPrizeConfig } = useRequest(ApiMemberVipPrizeConfig, {
  onSuccess(data) {
    if (data) {
      const _data = Object.values(data.data ?? []).sort((a, b) => a[0].level - b[0].level)
      memberCurrency.value = getCurrencyConfig(_data[0][0].currency_id).name
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
    title: `${t('vip等级', { vip: 'VIP' })}`,
    dataIndex: 'level',
    align: 'center',
    slot: 'level',
  },
  DAY: {
    title: t('日奖金'),
    dataIndex: 'dailyGift',
    align: 'center',
    slot: 'daily_gift',
    color: 'var(--tg-table-amount-color)',
  },
  WEEK: {
    title: t('周奖金'),
    dataIndex: 'weeklyGift',
    align: 'center',
    slot: 'weekly_gift',
    color: 'var(--tg-table-amount-color)',
  },
  MONTH: {
    title: t('月奖金'),
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

/** 判断数组某个字段是否都有值 */
function isArrKeyZero(key: string) {
  return getBonusConfig.value.every(item => vipStore.isZeroShowOther(item[key].toString()))
}

// 初始化数据
function initData() {
  return new Promise((resolve) => {
    let a = 0
    const t = setInterval(() => {
      a++
      if (currencyModeCur.value) {
        clearInterval(t)
        runAsyncVipPrizeConfig({ cur: getCurrencyConfig(currencyModeCur.value).cur }).finally(() => {
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
  <div class="w-full flex flex-col overflow-hidden">
    <PhBaseTable
      :columns="getShowColumn" :data-source="getShowColumn.length ? getBonusConfig : []"
      :loading="getVipConfigLoading" :show-out-load="true"
      style="--tg-table-th-height:48rem;--tg-table-td-height:48rem;--tg-table-td-font-weight:500;"
    >
      <template #level="{ record }">
        <div class="center">
          <PhBaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
        </div>
      </template>
      <template #daily_gift="{ record: { dailyGift } }">
        <div v-if="vipStore.isZeroShowOther(dailyGift)">
          -
        </div>
        <div v-else class="center">
          <PhBaseAmount :amount="dailyGift" :currency-type="currencyModeCur" />
        </div>
      </template>
      <template #weekly_gift="{ record: { weeklyGift } }">
        <div v-if="vipStore.isZeroShowOther(weeklyGift)">
          -
        </div>
        <div v-else class="center">
          <PhBaseAmount :amount="weeklyGift" :currency-type="currencyModeCur" />
        </div>
      </template>
      <template #monthly_gift="{ record: { monthlyGift } }">
        <div v-if="vipStore.isZeroShowOther(monthlyGift)">
          -
        </div>
        <div v-else class="center">
          <PhBaseAmount :amount="monthlyGift" :currency-type="currencyModeCur" />
        </div>
      </template>
    </PhBaseTable>
    <AppVipRuleDesc class="mt-[16rem]" />
  </div>
</template>

<style lang="scss" scoped>

</style>

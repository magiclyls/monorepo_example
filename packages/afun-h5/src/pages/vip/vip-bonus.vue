<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberVipPrizeConfig } from '@tg/apis'
import { AfunBaseAmount, AfunBaseImage, AfunBaseTable } from '@tg/bccomponents'
import { useAppStore, useVipStore } from '@tg/stores'
import { getCurrencyConfig } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppVipRuleDesc from '~/components/AppVipRuleDesc.vue'

interface PrizeConfig {
  level: number
  cash_type: number
  currency_id: CurrencyCode
  amount: string
}

defineOptions({ name: 'AppVipBonus' })

const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const vipStore = useVipStore()
const { vipConfigArray, isVipPointMode, currencyModeCur, isVipUpgradeBonusOpen } = storeToRefs(vipStore)

// cash_type = 818 //晋级奖金
// cash_type = 819 //日奖金
// cash_type = 820 //周奖金
// cash_type = 821 //月奖金
const vipPrizeConfig = ref<{ [t: string]: PrizeConfig | null }>({})
const { runAsync: runAsyncVipPrizeConfig } = useRequest(ApiMemberVipPrizeConfig, {
  onSuccess(data) {
    const _data = data.data ?? []
    for (const key in _data)
      vipPrizeConfig.value[key] = _data[key].find(item => item.cash_type === 818) ?? null
  },
})

const columnConfig: { [t: string]: Column } = {
  VIP: {
    title: `${t('vip等级', { data: 'VIP' })}`,
    dataIndex: 'level',
    align: 'center',
    slot: 'level',
  },
  DM: {
    title: isVipPointMode.value ? t('积分') : t('有效流水'),
    dataIndex: 'upgrade',
    align: 'center',
    slot: 'score',
    color: 'var(--afun-table-text-color)',
  },
  UP: {
    title: t('晋级奖金'),
    dataIndex: 'amount',
    align: 'center',
    slot: 'up_gift',
    width: '100px',
    isThLineClamp2: true,
    thPaddingX: 10,
    color: 'var(--afun-table-amount-color)',
  },
}

const getBonusConfig = computed(() => {
  const _vipConfigArray = vipConfigArray.value.filter(item => item.level !== 0)
  return _vipConfigArray.map((item, index) => {
    return {
      level: item.level,
      upgrade: item.upgrade,
      retain: item.retain,
      ...vipPrizeConfig.value[`v${index + 1}`],
    }
  })
})
const getShowColumn = computed(() => {
  const arr: Column[] = []
  for (const key in columnConfig) {
    const item = columnConfig[key]
    if (key === 'VIP') {
      arr.push(item)
      continue
    }
    if (key === 'UP' && !isVipUpgradeBonusOpen.value)
      continue

    if (!isArrKeyZero(item.dataIndex))
      arr.push(item)
  }
  return arr.length === 1 ? [] : arr // 如果只有vip等级，则全部不展示
})

/** 判断数组某个字段是否都有值 */
function isArrKeyZero(key: string) {
  return getBonusConfig.value.every(item => vipStore.isZeroShowOther(item[key]))
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
  <div class="flex flex-col w-full overflow-hidden">
    <AfunBaseTable
      :columns="getShowColumn" :data-source="getShowColumn.length ? getBonusConfig : []" :skeleton-width="50"
      :show-out-load="true" style="--afun-table-th-height:48px;--afun-table-td-height:48px;--afun-table-td-font-weight:500;"
    >
      <template #level="{ record }">
        <div class="center">
          <AfunBaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
        </div>
      </template>
      <template #score="{ record: { upgrade } }">
        <div v-if="vipStore.isZeroShowOther(upgrade)">
          -
        </div>
        <div v-else class="center">
          {{ parseInt(upgrade) }}
        </div>
      </template>
      <template #up_gift="{ record: { amount, currency_id } }">
        <div v-if="vipStore.isZeroShowOther(amount) || !(+currency_id > 0) ">
          -
        </div>
        <div v-else class="center">
          <AfunBaseAmount :amount="amount" :currency-type="getCurrencyConfig(currency_id).name" style="--afun-app-amount-font-weight:500;--afun-base-amount-font-size: 14px;" />
        </div>
      </template>
    </AfunBaseTable>
    <AppVipRuleDesc class="mt-[16px]" />
  </div>
</template>

<style lang="scss" scoped>

</style>

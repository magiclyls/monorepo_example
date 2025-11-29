<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'

import { ApiMemberVipPrizeConfig } from '@tg/apis'

interface PrizeConfig {
  level: number
  cash_type: number
  currency_id: CurrencyCode
  amount: string
}

const { t } = useI18n()
const { isLogin, currentGlobalCurrency, isVipUpgradeBonusOpen } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { vipConfigArray, isZeroShowOther, isVipPointMode, currencyModeCur } = useVipInfo()

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
    title: `${t('grade', { vip: 'VIP' })}`,
    dataIndex: 'level',
    align: 'center',
    slot: 'level',
  },
  // CZ: {
  //   title: t('vip_recharge_money'),
  //   dataIndex: 'recharge',
  //   align: 'center',
  //   slot: 'recharge',
  // },
  DM: {
    title: isVipPointMode.value ? t('integral') : t('vip_add_mosaic'),
    dataIndex: 'upgrade',
    align: 'center',
    slot: 'score',
    color: 'var(--tg-table-text-color)',
  },
  UP: {
    title: t('vip_promotion_bonus'),
    dataIndex: 'amount',
    align: 'center',
    slot: 'up_gift',
    width: '100px',
    isThLineClamp2: true,
    thPaddingX: 10,
    color: 'var(--tg-table-amount-color)',
  },
  // BD: {
  //   title: t('vip_birthday_bonus'),
  //   dataIndex: 'birthday',
  //   align: 'center',
  //   slot: 'birthday',
  // },
  // {
  //   title: t('keep_integral'),
  //   dataIndex: 'retain_score',
  //   align: 'center',
  //   slot: 'retain_score',
  //   width: '30%',
  // },
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
  return getBonusConfig.value.every(item => isZeroShowOther(item[key]))
}

// watch(() => currentGlobalCurrency.value, (newVal) => {
//   runAsyncVipPrizeConfig({
//     cur: currencyConfig[newVal].cur,
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
        // 积分模式
        if (isVipPointMode.value) {
          runAsyncVipPrizeConfig({ cur: currencyConfig[isLogin.value ?  currentGlobalCurrency.value : languageConfig[getCurrentLanguageForFrontend()].currency].cur }).finally(() => {
            resolve(true)
          })
        }
        // 币种模式
        else {
          runAsyncVipPrizeConfig({ cur: currencyConfig[currencyModeCur.value].cur }).finally(() => {
            resolve(true)
          })
        }
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
  <div class="vip-vip-bonus" :class="{ 'is-mobile': isMobile }">
    <div class="tabs">
      <BaseTable :columns="getShowColumn" :data-source="getShowColumn.length ? getBonusConfig : []" :skeleton-width="50"
        :show-out-load="true" :out-load-height="isMobile ? 200 : 636">
        <template #level="{ record }">
          <div class="center">
            <BaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
          </div>
        </template>
        <template #score="{ record: { upgrade } }">
          <div v-if="isZeroShowOther(upgrade)" class="font-semibold">
            -
          </div>
          <div v-else class="center font-semibold">
            {{ parseInt(upgrade) }}
          </div>
        </template>
        <template #up_gift="{ record: { amount, currency_id } }">
          <div v-if="isZeroShowOther(amount) || !(+currency_id > 0)">
            -
          </div>
          <div v-else class="center">
            <AppAmount :amount="amount" :currency-type="getCurrencyConfigByCode(currency_id).name" />
          </div>
        </template>
      </BaseTable>
    </div>
    <AppVipRuleDesc />
  </div>
</template>

<style lang="scss" scoped>
.vip-vip-bonus {
  width: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  gap: var(--tg-spacing-14);

  //--tg-table-layout: fixed;
  //--tg-table-th-padding-x: 8px;
  // --tg-table-th-word-wrap: break-word;
  //--tg-table-th-white-space: normal;
  &.is-mobile {
    .tabs {
      background: none;
      padding: 0 0;
      position: relative;
      border: none !important;

      @include webTheme('white') {
        --tg-tab-style-color: #111111;
        --tg-tab-style-wrap-bg-color: #f5f5f5;
      }
    }
  }

  .tabs {
    width: 100%;
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

<script lang="ts" setup>
import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { useAppStore } from '@tg/stores'
import { application, currencyMap, extractNonNumericStart } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import AfunBaseCurrencyIcon from './AfunBaseCurrencyIcon.vue'

interface Props {
  amount: number | string
  currencyType?: EnumCurrencyKey
  currencyCode?: CurrencyCode
  noFormat?: boolean
  reverse?: boolean
  /**
   * 是否显示颜色
   *
   * 大于等于0 显示红色
   *
   * 小于0 显示绿色
   */
  showColor?: boolean
  /** 是否展示法币货币符号 */
  showPrefix?: boolean
  showName?: boolean
  /** 是否展示图标 */
  showIcon?: boolean
  /** 显示正负号 */
  showSymbol?: boolean
}
defineOptions({
  name: 'AfunBaseAmount',
})

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
})

const { isLogin } = storeToRefs(useAppStore())
const _currencyType = computed<EnumCurrencyKey | undefined>(() => props.currencyType ? props.currencyType : codeToType(props.currencyCode))
const _prefix = computed(() => _currencyType.value ? currencyMap[_currencyType.value]?.prefix : '')
const isOfficial = computed(() => _currencyType.value && ['CNY', 'BRL', 'INR', 'VND', 'KVND', 'THB', 'EUR', 'JPY', 'PHP'].includes(_currencyType.value))

const formatAmount = computed(() => {
  const amount = props.amount?.toString() ?? ''
  if (_currencyType.value && amount && currencyMap[_currencyType.value] && !props.noFormat) {
    const match = extractNonNumericStart(amount)
    const _amount = amount.replace(match, '')
    return match + application.formatNumDecimal(_amount, currencyMap[_currencyType.value].decimal)
  }
  else {
    return amount
  }
})
const colorClass = computed(() => {
  if (!props.showColor)
    return ''

  const amount = Number(props.amount)
  return amount > 0 ? 'positive-amount' : (amount < 0 ? 'negative-amount' : '')
})

const symbol = computed(() => {
  const amount = Number(props.amount)
  return amount > 0 ? '+' : (amount < 0 ? '' : '')
})

function codeToType(code?: CurrencyCode): EnumCurrencyKey | undefined {
  if (code)
    return Object.entries(currencyMap).map(([k, v]) => ({ type: k as EnumCurrencyKey, ...v })).filter(item => item.cur === code)[0]?.type
}
</script>

<template>
  <div class="ph-base-amount" :class="{ reverse }">
    <div class="amount flex items-center" :class="[colorClass, { reverse }]">
      <template v-if="showPrefix && isOfficial">
        {{ _prefix }}
      </template>
      <span v-if="props.showSymbol" class="symbol">{{ symbol }}</span>
      <span>{{ formatAmount }}</span>
    </div>
    <template v-if="isLogin">
      <AfunBaseCurrencyIcon v-if="_currencyType && showIcon" class="theme-icon" :show-name="showName" :currency-type="_currencyType" />
    </template>
  </div>
</template>

<style>
:root {
  --afun-base-amount-font-size: 14px;
  --afun-base-amount-positive-color: #2ba471;
  --afun-base-amount-negative-color: #f23038;
  --afun-app-amount-width: auto;
  --afun-app-amount-max-width: 18ch;
  --afun-app-amount-amount-margin: 4px;
  --afun-app-amount-font-weight: 600;
  --afun-app-currency-icon-size: 14px;
}
</style>

<style lang="scss" scoped>
.ph-base-amount {
  display: flex;
  align-items: center;
  &.reverse {
    flex-flow: row-reverse;
  }
}
.amount {
  color: inherit;
  font-size: var(--afun-base-amount-font-size);
  width: var(--afun-app-amount-width);
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
  text-decoration: inherit;
  max-width: var(--afun-app-amount-max-width);
  font-weight: var(--afun-app-amount-font-weight);
  margin-right: var(--afun-app-amount-amount-margin);
  margin-left: 0;
  .symbol {
    transform: translateY(-1.5px);
    display: inline-block;
  }

  &.reverse {
    margin-right: 0;
    margin-left: var(--afun-app-amount-amount-margin);
  }
}

.positive-amount {
  color: var(--afun-base-amount-positive-color);
}

.negative-amount {
  color: var(--afun-base-amount-negative-color);
}
.theme-icon {
  font-size: var(--afun-app-currency-icon-size);
}
</style>

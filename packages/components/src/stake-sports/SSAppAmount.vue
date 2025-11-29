<script lang="ts" setup>
import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { application, currencyMap, extractNonNumericStart } from '@tg/utils'
import { computed } from 'vue'
import SSBaseCurrencyIcon from './SSBaseCurrencyIcon.vue'

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
}
defineOptions({
  name: 'PhBaseAmount',
})

const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
})

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

function codeToType(code?: CurrencyCode): EnumCurrencyKey | undefined {
  if (code)
    return Object.entries(currencyMap).map(([k, v]) => ({ type: k as EnumCurrencyKey, ...v })).filter(item => item.cur === code)[0]?.type
}
</script>

<template>
  <div class="ph-base-amount" :class="{ reverse }">
    <span class="amount" :class="[colorClass, { reverse }]">
      <template v-if="showPrefix && isOfficial">{{ _prefix }}</template>{{ formatAmount }}
    </span>
    <SSBaseCurrencyIcon v-if="_currencyType && showIcon" :show-name="showName" :currency-type="_currencyType" />
  </div>
</template>

<style>
:root {
  --ss-base-amount-font-size: 14rem;
  --ss-base-amount-positive-color: green;
  --ss-base-amount-negative-color: red;
  --ss-app-amount-width: auto;
  --ss-app-amount-max-width: 14ch;
  --ss-app-amount-amount-margin: 5rem;
  --ss-app-amount-font-weight: 600;
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
  font-size: var(--ss-base-amount-font-size);
  width: var(--ss-app-amount-width);
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
  max-width: var(--ss-app-amount-max-width);
  font-weight: var(--ss-app-amount-font-weight);
  margin-right: var(--ss-app-amount-amount-margin);
  margin-left: 0;

  &.reverse {
    margin-right: 0;
    margin-left: var(--ss-app-amount-amount-margin);
  }
}

.positive-amount {
  color: var(--ss-base-amount-positive-color);
}

.negative-amount {
  color: var(--ss-base-amount-negative-color);
}
</style>

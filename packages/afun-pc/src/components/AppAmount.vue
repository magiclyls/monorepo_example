<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'

interface Props {
  amount: string | number
  currencyType?: EnumCurrencyKey
  currencyCode?: CurrencyCode
  showName?: boolean
  /**
   * 是否显示颜色
   *
   * 大于等于0 显示红色
   *
   * 小于0 显示绿色
   */
  showColor?: boolean
  /** 是否需要显示popper */
  isPopper?: boolean
  reverse?: boolean
  showPrefix?: boolean
  showIcon?: boolean
  /** 弹出类名 */
  popperClazz?: string
  noFormat?: boolean
  memberAmount?: boolean
  isShowIcon?: boolean
  /** 显示符号 */
  showSymbol?: boolean
}
defineOptions({
  name: 'AppAmount',
})
const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
})

const _currencyType = computed<EnumCurrencyKey | undefined>(() => props.currencyType ? props.currencyType : codeToType(props.currencyCode))
const _prefix = computed(() => _currencyType.value ? currencyConfig[_currencyType.value]?.prefix : '')
const isOfficial = computed(() => _currencyType.value && ['CNY', 'BRL', 'INR', 'VND', 'KVND', 'THB', 'EUR', 'JPY'].includes(_currencyType.value))

function codeToType(code?: CurrencyCode): EnumCurrencyKey | undefined {
  if (code)
    return Object.entries(currencyConfig).map(([k, v]) => ({ type: k as EnumCurrencyKey, ...v })).filter(item => item.cur === code)[0]?.type
}

/** 获取字符串开头非数字部分 */
function extractNonNumericStart(str: string) {
  const match = str.match(/^\D+/)
  return match ? match[0] : ''
}

const colorClass = computed(() => {
  if (!props.showColor)
    return ''

  const amount = Number(props.amount)
  return amount > 0 ? 'green' : (amount < 0 ? 'red' : '')
})

const symbol = computed(() => {
  const amount = Number(props.amount)
  return amount > 0 ? '+' : (amount < 0 ? '-' : '')
})

const formatAmount = computed(() => {
  const amount = props.amount?.toString() ?? ''
  if (_currencyType.value && amount && currencyConfig[_currencyType.value] && !props.noFormat) {
    const match = extractNonNumericStart(amount)
    const _amount = amount.replace(match, '')
    return match + application.formatNumDecimal(_amount, currencyConfig[_currencyType.value].decimal)
  }
  else {
    return amount
  }
})
// 处理负数符号字体
function checkIsSmallThanZero(amount: string | number) {
  return amount.toString().includes('-')
}
</script>

<template>
  <div>
    <template v-if="isPopper">
      <AppTooltip :popper-clazz="popperClazz" icon-name="uni-doc" :auto-hide="false" :triggers="['click', 'hover']">
        <template #content>
          <div class="app-amount" :class="{ 'flex-row-reverse': reverse }">
            <span class="amount" :class="colorClass">
              <template v-if="showPrefix && isOfficial">{{ _prefix }}</template>
              {{ formatAmount }}
            </span>
            <AppCurrencyIcon v-if="_currencyType && showIcon" :show-name="showName" :currency-type="_currencyType" />
          </div>
        </template>

        <template #popper>
          <div class="app-amount" :class="{ 'flex-row-reverse': reverse }">
            <span class="amount" :class="colorClass">
              <template v-if="showPrefix && isOfficial">{{ _prefix }}</template>{{ formatAmount }}
            </span>
            <AppCurrencyIcon v-if="_currencyType && showIcon" :show-name="showName" :currency-type="_currencyType" />
          </div>
        </template>
      </AppTooltip>
    </template>
    <div v-else class="app-amount" :class="{ 'flex-row-reverse': reverse }">
      <template v-if="memberAmount">
        <AppCurrencyIcon v-if="_currencyType && showIcon" :show-name="showName" :currency-type="_currencyType" />
        <span class="amount memberAmount" :class="colorClass">
          <template v-if="showPrefix && isOfficial">{{ _prefix }}</template>
          <span v-if="checkIsSmallThanZero(formatAmount)" style="font-family: proxima-nova, sans-serif;">-</span>
          <span>{{ formatAmount.toString().replace('-', '') }}</span>
        </span>
      </template>
      <template v-else>
        <span class="amount" :class="colorClass">
          <template v-if="showPrefix && isOfficial">{{ _prefix }}</template>
          <span v-if="checkIsSmallThanZero(formatAmount)" style="font-family: proxima-nova, sans-serif;">-</span>
          <span v-else class="symbol">{{ props.showSymbol ? symbol : ''}}</span>
          <span>{{ formatAmount.toString().replace('-', '') }}</span>
        </span>
        <AppCurrencyIcon v-if="_currencyType && showIcon" :show-name="showName" :currency-type="_currencyType" />
      </template>
    </div>
  </div>
</template>

<style>
:root {
  --tg-app-amount-width: auto;
  --tg-app-amount-color: inherit;
  --tg-app-amount-max-width: 14ch;
  --tg-app-amount-font-weight: var(--tg-font-weight-semibold);
  --tg-app-amount-font-size: var(--tg-font-size-default);
  --tg-app-amount-red-color: var(--tg-primary-fail);
  --tg-app-amount-green-color: var(--tg-primary-success);
}
</style>

<style lang='scss' scoped>
.app-amount {
  font-size: inherit;
  color: var(--tg-app-amount-color);
  display: flex;
  align-items: center;
  &.flex-row-reverse {
    .amount {
      margin-left: var(--tg-spacing-4);
    }
  }
  .symbol{
    transform: translateY(-1.5px);
    display: inline-block;
  }
}

.amount {
  width: var(--tg-app-amount-width);
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-variant-numeric: tabular-nums;
  margin-right: var(--tg-spacing-4);
  max-width: var(--tg-app-amount-max-width);
  font-size: var(--tg-app-amount-font-size);
  font-weight: var(--tg-app-amount-font-weight);

  &.red {
    color: var(--tg-app-amount-red-color);
  }

  &.green {
    color: var(--tg-app-amount-green-color);
  }
}
.memberAmount{
  margin-left: var(--tg-spacing-4);
}
</style>

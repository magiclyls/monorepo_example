<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { PhBaseCurrencyIcon } from '@tg/bccomponents'
import { i18n, isZhcn } from '@tg/vue-i18n'
import { computed } from 'vue'

interface Props {
  currency: EnumCurrencyKey
  // 存款金额
  depositAmount: string
  // 超出金额
  deductAmount: string
  // 释放金额
  amount: string
  // 限额周期 每日、每周、每月
  cfgType: string
  // 预扣释放 存款成功
  type: 'release' | 'deposit'
}

defineOptions({
  name: 'AppDepositLimitNotificationsMessage',
})
const props = defineProps<Props>()

const { t } = i18n.global

const cfgTypeText = computed(() => {
  switch (props.cfgType) {
    case '1': return t('每天')
    case '2': return t('每周')
    case '3': return t('每月')
    default: return ''
  }
})
</script>

<template>
  <i18n-t v-if="type === 'release'" keypath="预扣释放消息" tag="div" class="flex flex-wrap items-center leading-[1.5]">
    <span>&nbsp;{{ amount }}&nbsp;</span>
    <span class="inline-flex items-center">
      <PhBaseCurrencyIcon :currency-type="currency" />&nbsp;
    </span>
  </i18n-t>
  <i18n-t v-else-if="type === 'deposit'" keypath="存款预扣消息" tag="div" class="flex justify-center flex-wrap items-center leading-[1.5]">
    <span>&nbsp;{{ depositAmount }}&nbsp;</span>
    <span class="inline-flex items-center">
      <PhBaseCurrencyIcon :currency-type="currency" />&nbsp;
    </span>
    <span>&nbsp;{{ deductAmount }}&nbsp;</span>
    <span class="inline-flex items-center">
      <PhBaseCurrencyIcon :currency-type="currency" />
    </span>
    <span v-if="isZhcn()">{{ cfgTypeText }}</span>
    <span v-else>&nbsp;{{ cfgTypeText }}&nbsp;</span>
  </i18n-t>
</template>

<style lang='scss' scoped>

</style>

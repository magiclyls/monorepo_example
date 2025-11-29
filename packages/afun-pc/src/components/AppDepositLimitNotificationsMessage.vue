<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

interface Props {
  currency: EnumCurrencyKey
  // 存款金额
  deposit_amount: string
  // 超出金额
  deduct_amount: string
  // 释放金额
  amount: string
  // 限额周期 每日、每周、每月
  cfg_type: string
  // 预扣释放 存款成功
  type:'release'|'deposit'
}

defineOptions({
  name: 'AppDepositLimitNotificationsMessage',
})
const props = defineProps<Props>()

const { t } = useI18n()
const typeList = [
  { label: t('every_day1'), value: '1' },
  { label: t('every_week1'), value: '2' },
  { label: t('every_month1'), value: '3' },
]

const cfgTypeText = computed(()=> typeList.find(a=>a.value === props.cfg_type)?.label ??'')
</script>

<template>
  <i18n-t v-if="type === 'release'" keypath="withholding_release_message" tag="div" class="flex flex-wrap items-center leading-[1.5]">
    <span class="mx-[5px]">{{ amount }}</span>
    <AppCurrencyIcon class="mx-[5px]" :currency-type="currency" />
  </i18n-t>
  <i18n-t v-else-if="type === 'deposit'" keypath="withholding_deposit_message" tag="div" class="flex flex-wrap items-center leading-[1.5]">
    <span class="mx-[5px]">{{ deposit_amount }}</span>
    <AppCurrencyIcon class="mx-[5px]" :currency-type="currency" />
    <span class="mx-[5px]" >{{ deduct_amount }}</span>
    <AppCurrencyIcon class="mx-[5px]" :currency-type="currency" />
    <span>{{ cfgTypeText }}</span>
  </i18n-t>
</template>

<style lang='scss' scoped>

</style>

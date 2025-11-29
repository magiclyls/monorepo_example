<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

defineOptions({ name: 'AppMessageReceivedCoupon' })

defineProps<{
  amount: string
  currencyType: EnumCurrencyKey
}>()
</script>

<template>
  <i18n-t keypath="receive_coupon_amount" tag="div" class="flex flex-wrap items-center leading-[1.5]">
    <span class="mr-[4px] pl-[4px]">{{ amount }}</span><AppCurrencyIcon :currency-type="currencyType" />
  </i18n-t>
</template>

<style lang='scss' scoped>

</style>

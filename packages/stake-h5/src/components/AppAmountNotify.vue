<script lang="ts" setup>
import type { EnumCurrencyKey } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'

interface props {
  data: Array<{
    currency: CurrencyCode
    amount: string | number
    currencyName: EnumCurrencyKey
    hideAmountTitle?: boolean
    noFormat?: boolean
  }>
}
defineOptions({
  name: 'AppAmountNotify',
})
defineProps<props>()
</script>

<template>
  <div class="flex flex-col gap-[2px]">
    <div v-for="(item, idx) in data" :key="idx" class="flex gap-[5px] leading-[22px]">
      <span v-if="!item.hideAmountTitle">{{ $t('amount') }}</span><AppAmount :no-format="item.noFormat" :currency-code="item.currency" :currency-type="item.currencyName" :amount="item.amount" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

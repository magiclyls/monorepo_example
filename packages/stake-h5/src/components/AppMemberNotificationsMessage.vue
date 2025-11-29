<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

defineOptions({
  name: 'AppMemberNotificationsMessage',
})
defineProps<{
  amount: string
  currencyType: EnumCurrencyKey
  keypath: string
}>()
</script>

<template>
  <i18n-t :keypath="keypath" tag="div" class="flex flex-wrap items-center leading-[1.5]">
    <span>{{ amount }}</span><AppCurrencyIcon :currency-type="currencyType" />
  </i18n-t>
</template>

<style lang='scss' scoped>
.flex-wrap {
  flex-wrap: wrap;
  white-space: pre;
  > *:not(:first-child) {
    margin-left: 5px;
    margin-right: 3px;
  }
}
</style>

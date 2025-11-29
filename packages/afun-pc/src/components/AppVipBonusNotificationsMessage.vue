<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'

interface Props {
  amount: string
  currencyType: EnumCurrencyKey
  content: string
}
defineOptions({
  name: 'AppVipBonusNotificationsMessage',
})
defineProps<Props>()

const { t } = useI18n()
</script>

<template>
  <div class="flex flex-wrap items-center leading-[1.5]">
    <span class="mr-[5px]">{{ t('amount') }}</span>
    <span class="mr-[5px]">{{ amount }}</span>
    <AppCurrencyIcon :currency-type="currencyType" />
  </div>
</template>

<style lang='scss' scoped>

</style>

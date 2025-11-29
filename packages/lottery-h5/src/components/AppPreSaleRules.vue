<script setup lang='ts'>
import { useLocale } from './LotteryConfigProvider'

defineOptions({ name: 'AppPreSaleRules' })

const { $$t } = useLocale()
</script>

<template>
  <div class="sale-rules p-[15rem] text-[12rem] leading-[30rem] max-h-[300rem] overflow-y-auto">
    {{ $$t('预售规则详细') }}
  </div>
</template>

<style lang='scss' scoped></style>

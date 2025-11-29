<script setup lang="ts">
import { Local, STORAGE_WALLET_ROUTE } from '@tg/utils'

import AppFiatDepositSubmit from './_components/fiat-deposit-submit.vue'
import AppVirDepositSubmit from './_components/vir-deposit-submit.vue'

defineOptions({
  name: 'AppDepositFiatSubmitWrap',
})

const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const currencyType = routeData.currencyType
</script>

<template>
  <AppVirDepositSubmit v-if="currencyType === 'virtual'" />
  <AppFiatDepositSubmit v-else />
</template>

<style lang='scss' scoped>

</style>

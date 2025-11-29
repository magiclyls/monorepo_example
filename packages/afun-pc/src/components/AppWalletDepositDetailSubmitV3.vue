<script setup lang="ts">
import { IconUniBack } from '@tg/icons'

defineOptions({
  name: 'AppWalletDepositDetailSubmitV3',
})
const { t } = useI18n()
const router = useRouter() 
const route = useRoute()
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const currencyType = routeData?.currencyType as any
</script>

<template>
  <div class="app-wallet-dialog">
    <div class="header">
      <h2 @click="router.back()">
        <IconUniBack /><span>{{ t('deposit') }}</span>
      </h2>
    </div>
    <!-- 内容区-start -->
    <AppWalletDepositWalletDetailSubmitV3 v-if="currencyType === 'wallet'" />
    <AppWalletDepositFiatDetailSubmitV3 v-else-if="currencyType === 'fiat'" />
    <AppWalletDepositVirDetailSubmitV3 v-else-if="currencyType === 'virtual'" />
    <!-- 内容区-end -->
  </div>
</template>

<style lang='scss' scoped>
.app-wallet-dialog {
  padding: 0 16px 16px;
  font-size: var(--tg-font-size-default);
  color: var(--tg-text-lightgrey);
  @include webTheme('white'){
    background-color: #f5f5f5;
  }
}
.header {
  padding: var(--tg-spacing-16) var(--tg-spacing-16) var(--tg-spacing-16) 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tg-spacing-12);
  font-size: var(--tg-font-size-lg);
  touch-action: none;
  h2 {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--tg-spacing-8);
    font-size: var(--tg-font-size-base);
    line-height: 24px;
    > span {
      font-weight: var(--tg-font-weight-semibold);
    }
  }
}
</style>

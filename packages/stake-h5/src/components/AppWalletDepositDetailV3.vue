<script setup lang="ts">
import { IconUniBack } from '@tg/icons'

import type { EnumCurrencyKey } from '@tg/types'

defineOptions({
  name: 'AppWalletDepositDetailV3',
})
const { t } = useI18n()
const customRouter = useCustomRouter()
const initCurrency = ref<EnumCurrencyKey>()
const activeSubTab = ref<string>()
onActivated(() => {
  initCurrency.value = customRouter.query.currencyName as unknown as EnumCurrencyKey
  activeSubTab.value = customRouter.query.currencyType
})
</script>

<template>
  <div class="app-wallet-dialog theme-white-diff app-wallet-dialog-white-diff">
    <div class="header">
      <h2 @click="customRouter.back({ activeSubTab, initCurrency })">
        <IconUniBack /><span class="text-tg-text-white">{{ t('deposit') }}</span>
      </h2>
    </div>
    <AppWalletDepositWalletDetailV3 v-if="customRouter.query.currencyType === 'wallet'" />
    <AppWalletDepositFiatDetailV3 v-else-if="customRouter.query.currencyType === 'fiat'" />
    <AppWalletDepositVirDetailV3 v-else-if="customRouter.query.currencyType === 'virtual'" />
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

      >span {
        font-weight: var(--tg-font-weight-semibold);
      }
    }
  }

  [theme="white"] .app-wallet-dialog-white-diff {
    :deep(.theme-white-diff) {
      color: #111;
    }

    :deep(.right-button) {
      color: #111;
    }

    --tg-text-lightgrey: #111;
  }
</style>

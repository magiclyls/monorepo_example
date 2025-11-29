<script setup lang="ts">
import { IconUniBack } from '@tg/icons'

import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'

defineOptions({
  name: 'AppWalletWithDrawBeBankV3',
})
const { t } = useI18n()
const router = useLocalRouter()
/** 首次加载不展示子组件loading */
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const currencyType = ref(routeData.currencyType as string)
const withdrawType = ref(routeData.withdrawType as unknown as number)
const initCurrency = ref<CurrencyCode>()
const activeSubTab = ref<string>()
const customTitle = ref<string>('')

const dialogTitle = computed(() => {
  if (currencyType.value === 'fiat' || currencyType.value === 'wallet') {
    if (withdrawType.value === 1)
      return t('bind_bank_card')
    else if (withdrawType.value === 2)
      return t('bind_alipay')
    else if (withdrawType.value === 3)
      return t('bind_wallet')
    return ''
  }
  else if (currencyType.value === 'virtual') {
    return t('bind_vir_currency')
  }
  else if (currencyType.value === 'pix') {
    return t('bind_pix_account')
  }
  return ''
})

function setCustomTitle(title: string) {
  customTitle.value = title
}

provide('setCustomTitle', setCustomTitle)

onActivated(() => {
  initCurrency.value = routeData.currency as unknown as CurrencyCode
  activeSubTab.value = routeData.subtab === 'virtual' ? 'virtual' : 'fiat'
  if (routeData.subtab === 'wallet')
    activeSubTab.value = 'fiat'
})
</script>

<template>
  <div class="app-wallet-dialog">
    <div class="header">
      <h2 @click="router.back()">
        <IconUniBack />
        <span>{{ customTitle || dialogTitle }}</span>
      </h2>
    </div>
     <AppWalletWithDrawFiatBeBankV3 v-if="currencyType === 'fiat'" />
      <AppWalletWithDrawVirtBeBankV3 v-else-if="currencyType === 'virtual'" />
      <AppWalletWithDrawPixBeBankV3 v-else-if="currencyType === 'pix'" />


  </div>
</template>

<style lang='scss' scoped>
.app-wallet-dialog {
  padding: 0 16px 16px;
  font-size: var(--tg-font-size-default);
  color: var(--tg-text-lightgrey);
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

<script setup lang="ts">
import { IconUniBack } from '@tg/icons'

import type { EnumCurrencyKey } from '@tg/types'

defineOptions({
  name: 'AppWalletWithDrawBeBankV3',
})
const { t } = useI18n()
const customRouter = useCustomRouter()
/** 首次加载不展示子组件loading */
const { bool: loadFirst, setFalse: setLoadFirstFalse } = useBoolean(true)
const currencyType = ref(customRouter.query.currencyType as string)
const withdrawTypeList = ref(customRouter.query.withdrawTypeList)
const currentWithdrawId = ref(customRouter.query.withdrawId)
const withdrawType = computed(() => {
  return withdrawTypeList.value.find((item: any) => item.id === currentWithdrawId.value)?.type
})
const initCurrency = ref<EnumCurrencyKey>()
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
  initCurrency.value = customRouter.query.currencyName as unknown as EnumCurrencyKey
  activeSubTab.value = customRouter.query.currencyType === 'virtual' ? 'virtual' : 'fiat'
  if (customRouter.query.currencyType === 'wallet')
    activeSubTab.value = 'fiat'
  setLoadFirstFalse()
})
</script>

<template>
  <div class="app-wallet-dialog">
    <div class="header">
      <h2 @click="customRouter.back({ activeTab: 'withdraw', activeSubTab: customRouter.query.currencyType === 'wallet' ? 'wallet' : activeSubTab, initCurrency })">
        <IconUniBack />
        <span>{{ customTitle || dialogTitle }}</span>
      </h2>
    </div>
    <template v-if="loadFirst">
      <AppWalletWithDrawFiatBeBankV3 v-if="customRouter.query.currencyType === 'fiat' || customRouter.query.currencyType === 'wallet'" />
      <AppWalletWithDrawVirtBeBankV3 v-else-if="customRouter.query.currencyType === 'virtual'" />
      <AppWalletWithDrawPixBeBankV3 v-else-if="customRouter.query.currencyType === 'pix'" />
    </template>
    <template v-else>
      <Suspense timeout="0">
        <AppWalletWithDrawFiatBeBankV3 v-if="customRouter.query.currencyType === 'fiat' || customRouter.query.currencyType === 'wallet'" />
        <AppWalletWithDrawVirtBeBankV3 v-else-if="customRouter.query.currencyType === 'virtual'" />
        <AppWalletWithDrawPixBeBankV3 v-else-if="customRouter.query.currencyType === 'pix'" />
        <template #fallback>
          <div class="center dialog-loading-height">
            <BaseLoading />
          </div>
        </template>
      </Suspense>
    </template>
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

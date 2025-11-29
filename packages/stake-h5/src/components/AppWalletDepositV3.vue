<script setup lang="ts">
import type { EnumCurrencyKey } from '@tg/types'

import { ApiFinanceMethodComboListV2 } from '@tg/apis'

interface Props {
  activeSubTab?: string
  initCurrency: EnumCurrencyKey
}
defineOptions({
  name: 'AppWalletDepositV3',
})
const props = defineProps<Props>()
const { t } = useI18n()
const customRouter = useCustomRouter()
const appStore = useAppStore()
const { isCompleteKYC } = storeToRefs(appStore)
const { isZhcn } = storeToRefs(useLanguageStore())
const { depositCurrencyList } = useCurrencyData()
const currency = ref(props.initCurrency)
const isVirtual = ref(application.isVirtualCurrency(props.initCurrency))
const currentSubTab = ref('fiat')
const subTabList = ref<ISelectOptionString[]>([])
const walletCurrencyList = ref<any[]>([])
const promoStore = usePromoStore()
const { depositDetail } = storeToRefs(promoStore)
const { isOpenFastDeposit, isKYCVerifyOpen } = storeToRefs(useBrandStore())
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()
const { userInfo } = storeToRefs(appStore)
const { openNotify } = useNotify()
const { brandConfig } = storeToRefs(useBrandStore())

/** 钱包支付列表 */
const {
  runAsync: runAsyncWalletCurrencyList,
} = useRequest(ApiFinanceMethodComboListV2, {
  onSuccess(res, p) {
    if (p && p[0] && p[0].currency_id === '701')
      appStore.setComboList(res)
  },
})
/** 支付方式&协议V2列表 */
const {
  runAsync: runAsyncPaymentMethodList,
} = useRequest(ApiFinanceMethodComboListV2, {
  onSuccess(res, p) {
    setSubTabList()
    if (p && p[0] && p[0].currency_id === '701')
      appStore.setComboList(res)
  },
})
/** 法币列表 */
const fiatCurrencyList = computed(() => {
  if (depositCurrencyList.value.length)
    return depositCurrencyList.value.filter(a => !application.isVirtualCurrency(a.currency_name))

  return []
})
/** 虚拟币列表 */
const virtualCurrencyList = computed(() => {
  if (depositCurrencyList.value.length)
    return depositCurrencyList.value.filter(a => application.isVirtualCurrency(a.currency_name))

  return []
})
/** 钱包支付列表 */
/* const walletCurrencyList = computed(() => {
  if (walletCurrencyDataList.value?.method && walletCurrencyDataList.value.method.length > 0)
    return walletCurrencyDataList.value.method.filter(a => a.alias === 'qb')
  else
    return []
}) */
function setSubTabList() {
  subTabList.value = []
  if (isZhcn.value) {
    runAsyncWalletCurrencyList({ currency_id: '701' }).then((data) => {
      if (data.method && data.method.length > 0)
        walletCurrencyList.value = data.method.filter(a => a.alias === 'qb')

      if (walletCurrencyList.value.length > 0)
        subTabList.value.push({ label: t('wallet_payment'), value: 'wallet' })

      if (fiatCurrencyList.value.length > 0)
        subTabList.value.push({ label: t('online_payment'), value: 'fiat' })

      if (virtualCurrencyList.value.length > 0)
        subTabList.value.push({ label: t('currency_byte_coin'), value: 'virtual' })

      currentSubTab.value = getCurTab()
    })
  }
  else {
    if (fiatCurrencyList.value.length > 0)
      subTabList.value.push({ label: t('fiat_currency'), value: 'fiat' })
    if (virtualCurrencyList.value.length > 0)
      subTabList.value.push({ label: t('currency_byte_coin'), value: 'virtual' })
    currentSubTab.value = getCurTab()
  }
}

function onTabChange(tab: string) {
  if (isOpenFastDeposit.value && tab === 'virtual' && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  if (userInfo.value?.exclude === 1 && tab === 'virtual' && isOpenFastDeposit.value) {
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
    return
  }
  currentSubTab.value = tab
}
function getCurTab() {
  console.log(isOpenFastDeposit, 'isOpenFastDeposit')
  if (userInfo.value?.exclude === 1 && isOpenFastDeposit.value)
    return 'wallet'

  if (props.activeSubTab)
    return props.activeSubTab
  if (depositDetail.value?.subTab)
    return depositDetail.value?.subTab
  else if ((isZhcn.value && currency.value === 'CNY' && walletCurrencyList.value.length > 0 && fiatCurrencyList.value.length > 0))
    return 'wallet'
  else if (!isVirtual.value && fiatCurrencyList.value.length > 0)
    return 'fiat'
  else if (customRouter.backQuery.activeSubTab)
    return customRouter.backQuery.activeSubTab
  else
    return 'virtual'
}

/** 切换币种 */
/* function changeCurrency(currencyName: EnumCurrencyKey) {
  currency.value = currencyName
  if (currencyName !== 'CNY')
    isVirtual.value = application.isVirtualCurrency(currencyName)

  runAsyncPaymentMethodList({ currency_id: getCurrencyConfig(currency.value).cur })
} */
onActivated(() => {
  if (customRouter.backQuery.currencyType || customRouter.backQuery.activeSubTab)
    currentSubTab.value = customRouter.backQuery.currencyType as string || customRouter.backQuery.activeSubTab as string
  if (customRouter.backQuery.initCurrency)
    currency.value = customRouter.backQuery.initCurrency as EnumCurrencyKey

  // runAsyncPaymentMethodList({ currency_id: getCurrencyConfig(currency.value).cur })
})
await application.allSettled([
  runAsyncPaymentMethodList({ currency_id: getCurrencyConfig(currency.value).cur }),
])
</script>

<template>
  <div v-if="subTabList.length > 1" class="wallet-pay-tab mb-[16px] h-[25px] flex flex-row">
    <div
      v-for="item in subTabList" :key="item.value"
      class="text-tg-text-lightgrey grow cursor-pointer border-b-[1px] border-solid pb-[4px] text-center text-[14px] font-semibold leading-[19.6px]"
      :class="[item.value === currentSubTab ? 'border-active text-tg-text-white' : 'border-b-tg-secondary theme-border']"
      @click="onTabChange(item.value)"
    >
      {{ item.label }}
    </div>
  </div>
  <div class="app-wallet-dialog-white-diff">
    <Suspense timeout="0" suspensible>
      <AppWalletDepositWalletV3
        v-if="currentSubTab === 'wallet' && isZhcn && walletCurrencyList.length > 0 && fiatCurrencyList.length > 0"
        :key="currency"
      />
      <AppWalletDepositFiatV3
        v-else-if="currentSubTab === 'fiat' && fiatCurrencyList.length > 0"
        :init-fiat-currency="currency"
      />
      <AppWalletDepositVirV3
        v-else-if="currentSubTab === 'virtual' && virtualCurrencyList.length > 0"
        :init-vir-currency="currency"
      />
      <template #fallback>
        <div class="center dialog-loading-height">
          <BaseLoading />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
  .border-active {
  border-bottom-color: var(--tg-primary-active);

  @include webTheme('white') {
    border-bottom-color: #f2ca5c;
  }
}

.theme-border {
  @include webTheme('green') {
    border-bottom-color: #055434;
  }
}

[theme='white'] {
  .app-wallet-dialog-white-diff {
    :deep(.color-secondary) {
      color: #555;
    }
  }
}
.wallet-pay-tab {
  @include webTheme('green') {
    --tg-primary-active: var(--tg-tab-item-active);
    border-bottom: 1px solid var(--tg-base-button-style-bg-dark);
  }
}
</style>

<style>
  /* [theme="white"] #WalletDeposit .text-tg-text-secondary {
    color: #111;
  }

  [theme="white"] #WalletDeposit .search-icon.app-svg-icon {
    color: #C1C1C1;
  }

  [theme="white"] #WalletDeposit input{
      color: #555555;
      border-color: #C1C1C1;
  }

  [theme="white"] #WalletDeposit input ::placeholder {
        color: #C1C1C1;
  } */
</style>

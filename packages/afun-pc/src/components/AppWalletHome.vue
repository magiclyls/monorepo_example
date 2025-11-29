<!-- 钱包:存款首页 -->
<script setup lang='ts'>
import { IconNavbarWallet } from '@tg/icons'

import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'

defineOptions({
  name: 'AppWalletHome',
})
const props = withDefaults(defineProps<Props>(), {
  activeTab: 'deposit',
})

interface Props {
  activeTab?: string
}
const route = useRoute()
const _init_currency = route?.query.currency
const subtab = route?.query.subtab as string || undefined 

const { t } = useI18n()
const appStore = useAppStore()
const brandStore = useBrandStore()
const { brandBase } = storeToRefs(brandStore)
const { renderCurrencyList } = useCurrencyData()
const { currentGlobalCurrency, hasOpenUpayRoad } = storeToRefs(appStore)
const { setIsWalletDialogOpenTrue, setIsWalletDialogOpenFalse } = useGlobalStateWalletState()

const currentMainTab = ref(getCurrTab())
/** 当前选择的币种 */
const currency = ref(getCurrency())
const mainTabList = computed(() => {
  const arr = [
    { label: t('pop_up_wallet_tap_card_deposit'), value: 'deposit' },
    { label: t('menu_title_settings_withdrawals'), value: 'withdraw' },
  ]
  // 法币数据
  const fiatArr = renderCurrencyList.value.filter(a => !application.isVirtualCurrency(a.type))
  // 虚拟币数据
  const virArr = renderCurrencyList.value.filter(a => application.isVirtualCurrency(a.type))
  if (Number(brandBase.value?.currency_exchange) > 0 && fiatArr.length > 0 && virArr.length > 0)
    arr.push({ label: t('currency_exchange'), value: 'exchange' })
  return arr
})


function getCurrency() {
  if (_init_currency)
    return _init_currency as CurrencyCode
  else
    return currentGlobalCurrency.value
}
function getCurrTab() {
  if (subtab)
    return subtab
  else
    return 'withdraw'
}


watch(hasOpenUpayRoad, (val, old) => {
  if (val === true && old === false) {
    setTimeout(() => {
      appStore.runGetUpayBalance()
    }, 0)
  }
})

onMounted(() => {
  console.log('🚸🚸🚸 ~ onMounted 钱包打开👛')
  setIsWalletDialogOpenTrue()
})
onUnmounted(() => {
  console.log('🚸🚸🚸 ~ onUnmounted ~ 钱包关闭👛')
  setIsWalletDialogOpenFalse()
})
  currentMainTab.value = getCurrTab()
  currency.value = getCurrency()
  appStore.runAsyncCnyPayCombo()

  if (hasOpenUpayRoad.value)
    appStore.runGetUpayBalance()
await application.allSettled([brandStore.runAsyncBrandBaseDetail()])
</script>

<template>
  <div class="app-wallet-dialog">
    <div class="header">
      <h2><IconNavbarWallet /><span>{{ t('wallet') }}</span></h2>
    </div>
    <div class="px-[16px] pb-[16px]" @touchstart.stop @touchmove.stop>
      <BaseTab v-model="currentMainTab" class="theme-tab wallet-tab-wrap mb-[16px]" full :list="mainTabList" />
      <Suspense timeout="0" suspensible>
        <AppWalletDepositV3 v-if="currentMainTab === 'deposit'" :key="currency" :active-sub-tab="subtab" />
        <AppWalletWithDrawV3 v-else-if="currentMainTab === 'withdraw'" :key="currentMainTab"  />
        <AppWalletChangeV3 v-else-if="currentMainTab === 'exchange'" />
        <template #fallback>
          <div class="center dialog-loading-height">
            <BaseLoading />
          </div>
        </template>
      </Suspense>
      <AppAuthWarp />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-wallet-dialog {
  font-size: var(--tg-font-size-default);
  color: var(--tg-text-lightgrey);
  @include webTheme('green'){
    // --tg-text-green-sub: #fff;
    --tg-text-blue: #fff;
    --tg-primary-main: transparent;
  }
  @include webTheme('white'){
   background-color: #F5F5F5;
   --tg-text-lightgrey: #111;
  }
  .theme-tab{
    @include webTheme('white'){
      --tg-tab-style-wrap-bg-color: white;
    }
  }
}
.header {
  padding: var(--tg-spacing-16) var(--tg-spacing-16) var(--tg-spacing-16) var(--tg-spacing-16);
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
.wallet-tab-wrap{
  @include webTheme('green'){
   --tg-tab-style-wrap-bg-color:var(--tg-green-dark);
    --tg-icon-color:var(--tg-svg-default-color);
    --tg-text-green-sub:var(--tg-text-white);
    --tg-tab-active-text-color:var(--tg-text-white);
  }
}
</style>

<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'

import { ApiFinanceMethodComboListV2 } from '@tg/apis'
import AppWalletDepositWalletV3 from '~/components/AppWalletDepositWalletV3.vue'
import AppWalletDepositFiatV3 from '~/components/AppWalletDepositFiatV3.vue'
import AppWalletDepositVirV3 from '~/components/AppWalletDepositVirV3.vue'

type TabValue = 'wallet' | 'fiat' | 'virtual'
interface Props {
 
}
defineOptions({
  name: 'AppWalletDepositV3',
})
const props = defineProps<Props>()
const { t } = useI18n()
const router = useLocalRouter()
const route = useRoute()
const appStore = useAppStore()
const { isCompleteKYC, currentGlobalCurrency,comboList,comboCnyLoading } = storeToRefs(appStore)
const { isZhcn } = storeToRefs(useLanguageStore())
const { depositCurrencyList } = useCurrencyData()
const currency = ref(route.query.currency as CurrencyCode || getCurrencyConfig(currentGlobalCurrency.value).cur)
const currencyName = getCurrencyConfigByCode(currency.value)?.name
const isVirtual = ref(application.isVirtualCurrency(currencyName))
const currentSubTab = ref(route.query.subtab || 'fiat')
const walletCurrencyList = ref<any[]>([])
const { isOpenFastDeposit, isKYCVerifyOpen } = storeToRefs(useBrandStore())
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()
const { userInfo } = storeToRefs(appStore)
const { openNotify } = useNotify()



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
const subTabList = computed(() => {
    const result = []
  if (isZhcn.value) {
    //runAsyncWalletCurrencyList({ currency_id: '701' }).then((data) => {
      const data = comboList.value

      if (data && data.method && data.method.length > 0)
        walletCurrencyList.value = data.method.filter(a => a.alias === 'qb')

      if (walletCurrencyList.value.length > 0)
        result.push({ label: t('wallet_payment'), value: 'wallet' })
   // })
  }
  if (fiatCurrencyList.value.length > 0)
    result.push({ label: t('online_payment'), value: 'fiat' })
  if (virtualCurrencyList.value.length > 0)
    result.push({ label: t('currency_byte_coin'), value: 'virtual' })
  return result
})
const defaultTab = computed(() => {
  let tab
  if (route.query.subtab) {
    tab = route.query.subtab as string
  }else if (userInfo.value?.exclude === 1 && isOpenFastDeposit.value)
    tab = 'wallet'
  else if ((isZhcn.value && currency.value === '701' && walletCurrencyList.value.length > 0 && fiatCurrencyList.value.length > 0))
    tab = 'wallet'
  else if (!isVirtual.value && fiatCurrencyList.value.length > 0)
     tab = 'fiat'
  else
     tab = 'virtual'

  if(subTabList.value.length > 0){
     const found = subTabList.value.find(item=>item.value === tab)
     if(!found){
        tab = subTabList.value[0].value
     }
  }
  return tab
})


const loaded = ref(false)
const showLoading = computed(() => {
  return comboCnyLoading.value || (!loaded.value)
})
function onLoad() {
  loaded.value = true
}
function getComponent() {
  const components = {
    wallet: AppWalletDepositWalletV3,
    fiat: AppWalletDepositFiatV3,
    virtual: AppWalletDepositVirV3,
  }
  const key = currentSubTab.value  as TabValue
  return components[key] || AppWalletDepositFiatV3
}
const currentComponent = ref(getComponent())
watch(defaultTab, (t) => {
  onTabChange(t  , false)
}, { immediate: true })


async  function onTabChange(tab: string, replace = true) {
  if(currentSubTab.value !== tab){
    if (isOpenFastDeposit.value && tab === 'virtual' && isKYCVerifyOpen.value && !isCompleteKYC.value)
      return openKYCDialog()

    if (userInfo.value?.exclude === 1 && tab === 'virtual' && isOpenFastDeposit.value) {
      openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
      return
    }
    // 先隐藏组件
    currentSubTab.value = tab
    if (replace) {
      await router.replace(`/center/deposit?${qs.stringify({subtab: tab})}`)
    }
    loaded.value = false
    // 路由更新后再更新组件
    currentComponent.value = getComponent()
  }
}

/** 切换币种 */
/* function changeCurrency(currencyName: EnumCurrencyKey) {
  currency.value = currencyName
  if (currencyName !== 'CNY')
    isVirtual.value = application.isVirtualCurrency(currencyName)

  runAsyncPaymentMethodList({ currency_id: getCurrencyConfig(currency.value).cur })
} */
onActivated(() => {
  // runAsyncPaymentMethodList({ currency_id: getCurrencyConfig(currency.value).cur })
})
/* await application.allSettled([]) */
appStore.runAsyncCnyPayCombo()
</script>
<template>
  <div class="p-[24px]">
      <div v-if="subTabList.length > 0" class="">
          <div v-if="subTabList.length > 1" class="wallet-pay-tab mb-[16px] h-[30px] flex flex-row">
            <div
              v-for="item in subTabList" :key="item.value"
              class="text-tg-text-lightgrey grow cursor-pointer border-b-[1px] border-solid pb-[8px] text-center text-[16px] font-semibold leading-[22px]"
              :class="[item.value === currentSubTab ? 'border-active text-tg-text-white' : 'border-b-tg-secondary theme-border']"
              @click="onTabChange(item.value)"
            >
              {{ item.label }}
            </div>
          </div>
          <div class="app-wallet-dialog-white-diff">
              <AppLoading v-if="showLoading" />
              <component :is="currentComponent"  :key="currentSubTab.toString" @loaded="onLoad" />
          </div>
     </div>
       <BaseEmpty v-else style="font-size: var(--tg-empty-icon-size);padding-bottom: 0;" icon="empty-1">
          <template #icon>
            <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
          </template>
          <template #description>
            <div class="mb-[-7px] mt-[12px]">
              {{ t('暂无通道') }}
            </div>
          </template>
        </BaseEmpty>
</div>
</template>

<style lang="scss" scoped>
  .border-active {
  border-bottom-color: #24EE89;

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

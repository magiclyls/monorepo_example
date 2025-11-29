<!-- 提款V3.0-首页 -->
<script setup lang="ts">
import type { EnumCurrencyKey } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'

interface Props {
  initCurrency: EnumCurrencyKey
}
defineOptions({
  name: 'AppWalletWithDrawV3',
})
const props = defineProps<Props>()
const { t } = useI18n()
const appStore = useAppStore()
const brandStore = useBrandStore()
const { runMemberAuthConfig } = useAuthConfig()
const { getComponent } = useUserVerify()
/** 首次加载不展示子组件loading */
const { bool: loadFirst, setFalse: setLoadFirstFalse } = useBoolean(true)
const { currentCurrency, currentCurrencyCode, withdrawCurrencyList, runGetFinanceWithdrawCurrencyData } = useCurrencyData()
const depositChangeNum = ref(0)

const tab = ref(application.isVirtualCurrency(props.initCurrency) ? 'virtual' : 'fiat')
/** 法币列表 */
const fiatCurrencyList = computed(() => {
  if (withdrawCurrencyList.value.length)
    return withdrawCurrencyList.value.filter(a => !application.isVirtualCurrency(a.currency_name))

  return []
})
/** 虚拟币列表 */
const virtualCurrencyList = computed(() => {
  if (withdrawCurrencyList.value.length) {
    return withdrawCurrencyList.value.filter(a => application.isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name as EnumCurrencyKey,
        value: b.currency_id as CurrencyCode,
      }
    })
  }
  return []
})
const tabList = computed(() => {
  const arr: ISelectOptionString[] = []
  if (fiatCurrencyList.value.length > 0)
    arr.push({ label: t('fiat_currency'), value: 'fiat' })
  if (virtualCurrencyList.value.length > 0)
    arr.push({ label: t('currency_byte_coin'), value: 'virtual' })
  return arr
})
const isFiat = computed(() => tab.value === 'fiat')
const isVirtual = computed(() => tab.value === 'virtual')
/** 初始化的币种 */
const currency = ref(props.initCurrency)
const currency_code = ref(currencyConfig[props.initCurrency]?.cur)
/** 默认法币 */
const initFiatCurrency = ref()
/** 默认加密货币 */
const initVirCurrency = ref()
/*
初始化默认选中货币
根据tab的值 如果是法币 用传过来的货币初始化 法币默认值 , 虚拟币的默认值则用全局的值
*/
function initAllCurrency() {
  if (isFiat.value) {
    initFiatCurrency.value = application.isVirtualCurrency(currency.value) ? withdrawCurrencyList.value!.filter(a => !application.isVirtualCurrency(a.currency_name))[0] : withdrawCurrencyList.value!.find(item => item.currency_id === currency_code.value)
    initVirCurrency.value = application.isVirtualCurrency(currentCurrency.value)
      ? withdrawCurrencyList.value!.find(item => item.currency_id === currentCurrencyCode.value)
      : withdrawCurrencyList.value!.filter(a => application.isVirtualCurrency(a.currency_name))[0]
  }
  else {
    initVirCurrency.value = application.isVirtualCurrency(currency.value) ? withdrawCurrencyList.value!.find(item => item.currency_id === currency_code.value) : withdrawCurrencyList.value!.filter(a => application.isVirtualCurrency(a.currency_name))[0]
    initFiatCurrency.value = application.isVirtualCurrency(currentCurrency.value)
      ? withdrawCurrencyList.value!.filter(a => !application.isVirtualCurrency(a.currency_name))[0]
      : withdrawCurrencyList.value!.find(item => item.currency_id === currentCurrencyCode.value)
  }
}
function onTabChange(v: string) {
  if (tab.value !== v) {
    setLoadFirstFalse()
    tab.value = v
  }
}
function handleDepositChange() {
  setTimeout(() => {
    setLoadFirstFalse()
    depositChangeNum.value++
  }, 500)
}
watch(withdrawCurrencyList, () => {
  initAllCurrency()
}, {
  immediate: true,
})
onMounted(() => {
  // appEventBus.on(EventBusNames.DEPOSIT_CHANGE_FIAT_OR_VIRT, handleDepositChange)
})

onUnmounted(() => {
  // appEventBus.off(EventBusNames.DEPOSIT_CHANGE_FIAT_OR_VIRT, handleDepositChange)
})
/** 刷新账号数据和获取可取款货币列表 */
await application.allSettled([
  appStore.updateUserInfo(),
  brandStore.runAsyncBrandBaseDetail(),
  runGetFinanceWithdrawCurrencyData(),
  runMemberAuthConfig(),
])
// console.log('首页传过来的货币', currency, '当前全局的货币', currentCurrency, '可以取款的货币', withdrawCurrencyList)
</script>

<template>
  <div class="grid grid-cols-[100%] mb-[16px] gap-y-[16px]">
    <template v-if="!getComponent">
      <div v-if="tabList.length > 1" class="wallet-pay-tab flex items-center">
        <div
          v-for="item in tabList" :key="item.value"
          class="grow cursor-pointer border-b-[1px] border-solid pb-[4px] text-center text-[14px] font-semibold leading-[19.6px]"
          :class="[item.value === tab ? 'border-active text-tg-text-white' : 'border-b-default theme-border']" @click="onTabChange(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <Suspense timeout="0" suspensible>
        <!-- 法币 -->
        <AppWalletWithDrawFiatV3 v-if="isFiat" :key="initFiatCurrency" :init-fiat-currency="initFiatCurrency" />
        <!-- 加密货币 -->
        <AppWalletWithDrawVirV3 v-else-if="isVirtual" :key="initVirCurrency" :init-vir-currency="initVirCurrency" :init-vir-currency-list="virtualCurrencyList" />
        <template #fallback>
          <div class="center dialog-loading-height">
            <BaseLoading />
          </div>
        </template>
      </Suspense>
    </template>
    <template v-else>
      <Suspense timeout="0" suspensible>
        <component :is="getComponent" :key="brandStore.brandChangeNum" :tip-text="$t('menu_title_settings_withdrawals')" />
        <template #fallback>
          <div class="center dialog-loading-height">
            <BaseLoading />
          </div>
        </template>
      </Suspense>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.border-b-default{
  border-bottom-color: var(--tg-secondary-main);
  color: var(--tg-text-lightgrey);
  @include webTheme('white') {
    border-bottom-color: #c1c1c1;
    color: #555;
  }
}
.border-active{
    border-bottom-color: var(--tg-primary-active);
    @include webTheme('white') {
      border-bottom-color: #F2CA5C;
      color: #111;
    }
  }
.theme-border{
  @include webTheme('green'){
    border-bottom-color: #055434;
  }
}
.wallet-pay-tab{
  @include webTheme('green') {
    --tg-primary-active:var(--tg-tab-item-active);
    border-bottom: 1px solid var(--tg-base-button-style-bg-dark);
  }
}
</style>

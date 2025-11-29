<!-- 提款V3.0-首页 -->
<script setup lang="ts">
import type { EnumCurrencyKey } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import AppWalletWithDrawFiatV3 from '~/components/AppWalletWithDrawFiatV3.vue'
import AppWalletWithDrawVirV3 from '~/components/AppWalletWithDrawVirV3.vue'

type TabValue = 'fiat' | 'virtual'
interface Props {
}
defineOptions({
  name: 'AppWalletWithDrawV3',
})
const props = defineProps<Props>()
const { t } = useI18n()
const appStore = useAppStore()
const {  currentGlobalCurrency } = storeToRefs(appStore)
const brandStore = useBrandStore()
const router = useLocalRouter()
const route = useRoute()
const { runMemberAuthConfig } = useAuthConfig()
const { getComponent } = useUserVerify()
const currency = ref(route.query.currency as CurrencyCode || getCurrencyConfig(currentGlobalCurrency.value).cur)
const currencyName = getCurrencyConfigByCode(currency.value)?.name
/** 首次加载不展示子组件loading */
const { bool: loadFirst, setFalse: setLoadFirstFalse } = useBoolean(true)
const { currentCurrency, currentCurrencyCode, withdrawCurrencyList, runGetFinanceWithdrawCurrencyData,widthdrawCurrencyLoading } = useCurrencyData()

const tab = ref(route.query.subtab || 'fiat')
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
  const arr = []
  if (fiatCurrencyList.value.length > 0)
    arr.push({ label: t('fiat_currency'), value: 'fiat' })
  if (virtualCurrencyList.value.length > 0)
    arr.push({ label: t('currency_byte_coin'), value: 'virtual' })
  return arr
})
const isFiat = computed(() => tab.value === 'fiat')
const isVirtual = computed(() => tab.value === 'virtual')
/** 初始化的币种 */
/** 默认法币 */
const initFiatCurrency = ref()
/** 默认加密货币 */
const initVirCurrency = ref()
/*
初始化默认选中货币
根据tab的值 如果是法币 用传过来的货币初始化 法币默认值 , 虚拟币的默认值则用全局的值
*/
const currentComponent = ref(getMyComponent())
function getMyComponent() {
  const components = {
    fiat: AppWalletWithDrawFiatV3,
    virtual: AppWalletWithDrawVirV3,
  }
  const key = tab.value as TabValue
  return components[key] || AppWalletWithDrawFiatV3
}
const loaded = ref(false)
const showLoading = computed(() => {
  return widthdrawCurrencyLoading.value || (!loaded.value && !getComponent.value)
})
function onLoad() {
  loaded.value = true
}
async function onTabChange(t: TabValue) {
  if(tab.value !== t){
    tab.value = t
    await  router.replace(`/center/withdraw?${qs.stringify({subtab: t})}`)

    loaded.value = false
    // 路由更新后再更新组件
    currentComponent.value = getMyComponent()
 }
}

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
  runMemberAuthConfig(),
  runGetFinanceWithdrawCurrencyData()
])
// console.log('首页传过来的货币', currency, '当前全局的货币', currentCurrency, '可以取款的货币', withdrawCurrencyList)
</script>

<template>

  <div class="grid grid-cols-[100%] p-[24px] mb-[16px] gap-y-[16px]">
    <component v-if="getComponent" :is="getComponent"  :tip-text="$t('menu_title_settings_withdrawals')" />
    <template v-else>
      <div v-if="tabList.length > 1" class="wallet-pay-tab flex items-center">
        <div
          v-for="item in tabList" :key="item.value"
          class="grow cursor-pointer border-b-[1px] border-solid pb-[8px] text-center text-[16px] font-semibold leading-[22px]"
          :class="[item.value === tab ? 'border-active text-tg-text-white' : 'border-b-default theme-border']" @click="onTabChange(item.value as TabValue)"
        >
          {{ item.label }}
        </div>
      </div>
        <!-- 法币 -->
        <AppLoading v-if="showLoading" class="h-[1000px]" />
        <component
          :is="currentComponent"
          :vir-currency-list="virtualCurrencyList"
          :fiat-currency-list="fiatCurrencyList"
          @loaded="onLoad"
        />
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
    border-bottom-color: #24EE89;
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

<script setup lang="ts">
import type { EnumCurrencyKey } from '@tg/types'
import { AfunBaseEmpty, AfunBaseImage, AfunBaseTabs } from '@tg/bccomponents'
import { useAppStore, useBrandStore, useCurrency } from '@tg/stores'
import { application, isVirtualCurrency } from '@tg/utils'
import { isZhcn } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppAuthWrap from '~/components/AppAuthWrap.vue'
import AppLoading from '~/components/AppLoading.vue'
import { Message } from '~/utils'
import FiatDeposite from './fiat-deposite.vue'
import VirtualDeposite from './virtual-deposite.vue'
import WalletDeposite from './wallet-deposite.vue'

type TabValue = 'wallet' | 'fiat' | 'virtual'
interface Props {
  initCurrency?: EnumCurrencyKey
}
defineOptions({
  name: 'AppDeposit',
})
const props = withDefaults(defineProps<Props>(), {
  initCurrency: 'CNY',
})

const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const { comboCnyLoading, comboCnyList } = storeToRefs(appStore)
const { depositCurrencyList, currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const currency = ref(props.initCurrency)
const isVirtual = computed(() => isVirtualCurrency(currentGlobalCurrencyMap.value.type))

const initRouteTab = ref(route.query.subtab)
const currentSubTab = ref<any>(route.query.subtab)

const { isOpenFastDeposit, isKYCVerifyOpen } = storeToRefs(useBrandStore())
/** KYC弹窗 */
/* const { openKYCDialog } = useDialogKYCVerify() */
const { userInfo } = storeToRefs(appStore)

/** 法币列表 */
const fiatCurrencyList = computed(() => {
  if (depositCurrencyList.value.length)
    return depositCurrencyList.value.filter(a => !isVirtualCurrency(a.currency_name))

  return []
})
/** 虚拟币列表 */
const virtualCurrencyList = computed(() => {
  if (depositCurrencyList.value.length)
    return depositCurrencyList.value.filter(a => isVirtualCurrency(a.currency_name))

  return []
})

const paymentMethodList = computed(() => {
  if (comboCnyList.value?.method && comboCnyList.value.method.length > 0)
    return comboCnyList.value.method.filter(a => a.alias === 'qb')
  else
    return []
})
const subTabList = computed(() => {
  const result = []
  if (fiatCurrencyList.value.length > 0)
    result.push({ label: t('法币'), value: 'fiat'/*  icon: '/m/afun-h5/png/fiat.png' */ })
  if (virtualCurrencyList.value.length > 0)
    result.push({ label: t('加密货币'), value: 'virtual'/*  icon: '/m/afun-h5/png/virtual.png'  */ })
  if (isZhcn() && paymentMethodList.value.length > 0) {
    result.unshift({ label: t('钱包支付'), value: 'wallet'/*  icon: '/m/afun-h5/png/wallet.png' */ })
  }
  return result
})

const defaultTab = computed(() => {
  if (initRouteTab.value) {
    return initRouteTab.value
  }
  else if (userInfo.value?.exclude === 1 && isOpenFastDeposit.value) {
    return 'wallet'
  }
  else if ((isZhcn() && currency.value === 'CNY' && paymentMethodList.value.length > 0 && fiatCurrencyList.value.length > 0)) {
    return 'wallet'
  }
  else if (!isVirtual.value && fiatCurrencyList.value.length > 0) {
    return 'fiat'
  }
  else {
    return 'virtual'
  }
})
function getComponent() {
  const components = {
    wallet: WalletDeposite,
    fiat: FiatDeposite,
    virtual: VirtualDeposite,
  }
  const key = currentSubTab.value as TabValue
  return components[key] || FiatDeposite
}
const currentComponent = ref(getComponent())
const loaded = ref(false)
const showLoading = computed(() => {
  return comboCnyLoading.value || (!loaded.value)
})
function onLoad() {
  loaded.value = true
}

/** 切换币种 */
/* function changeCurrency(currencyName: EnumCurrencyKey) {
  currency.value = currencyName
  if (currencyName !== 'CNY')
    isVirtual.value = application.isVirtualCurrency(currencyName)

  runAsyncPaymentMethodList({ currency_id: getCurrencyConfig(currency.value).cur })
} */
watch(defaultTab, (t) => {
  onChangeTab(t as TabValue, false)
}, { immediate: true })

async function onChangeTab(tab: TabValue, replace = true) {
  /*  if (isOpenFastDeposit.value && tab === 'virtual' && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog() */

  if (userInfo.value?.exclude === 1 && tab === 'virtual' && isOpenFastDeposit.value) {
    return Message.error(t('请先解除自我排除'))
  }
  currentSubTab.value = tab
  if (replace) {
    // 路由更新后再更新组件
    await router.replace({
      query: {
        tab: route.query.tab,
        subtab: tab,
      },
    })
  }
  loaded.value = false
  currentComponent.value = getComponent()
}

await application.allSettled([appStore.runAsyncCnyPayCombo()])
</script>

<template>
  <div v-if="subTabList.length > 0" class="">
    <div v-if="subTabList.length > 1" class="mt-[16px]">
      <AfunBaseTabs v-model="currentSubTab" :type="6" :full="true" :list="subTabList" @change="onChangeTab" />
    </div>
    <AppLoading v-if="showLoading" class="h-[1000px]" />
    <component :is="currentComponent" @loaded="onLoad" />
    <AppAuthWrap />
  </div>
  <AfunBaseEmpty v-else class="mt-[24px]" :description="t('暂无通道')">
    <template #icon>
      <AfunBaseImage class="w-[80px]" url="/m/afun-h5/png/uni-table-empty.png" />
    </template>
  </AfunBaseEmpty>
</template>

<style lang="scss" scoped>
</style>

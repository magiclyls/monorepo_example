<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey, IAvailableCurrency, ISortedListItem } from '@tg/types'
import { ApiFinanceWithdrawCurrency } from '@tg/apis'
import { PhBaseTabs } from '@tg/bccomponents'
import { sortCurrencyList, useAppStore, useBrandStore, useCurrency } from '@tg/stores'

import { application, isVirtualCurrency } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppAuthWrap from '~/components/AppAuthWrap.vue'
import AppLoading from '~/components/AppLoading.vue'
import { useUserVerify } from '~/hooks'
import FiatWithdraw from './fiat-withdraw.vue'
import VirWithdraw from './vir-withdraw.vue'

type TWithdrawCurrencyList = IAvailableCurrency & ISortedListItem
type TabValue = 'fiat' | 'virtual'

defineOptions({
  name: 'AppWalletWithDraw',
})
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const brandStore = useBrandStore()
const currencyStore = useCurrency()
const { getComponent, toggleEmail } = useUserVerify()
/** 首次加载不展示子组件loading */
const { sortList } = storeToRefs(currencyStore)
const { isLogin } = storeToRefs(appStore)

const subtab = route.query.subtab as TabValue

const tab = ref<TabValue>(subtab || 'fiat')
const {
  data: financeWithdrawCurrencyData,
  loading: isDataLoading,
  runAsync: getFinanceWithdrawData,
} = useRequest(ApiFinanceWithdrawCurrency)
const withdrawCurrencyList = computed(() => {
  if (financeWithdrawCurrencyData.value && sortList.value) {
    return sortCurrencyList<TWithdrawCurrencyList>(sortList.value, financeWithdrawCurrencyData.value.map((a) => {
      return {
        ...a,
        cur: a.currency_id,
      }
    }))
  }
  return []
})
/** 法币列表 */
const fiatCurrencyList = computed(() => {
  if (withdrawCurrencyList.value.length)
    return withdrawCurrencyList.value.filter(a => !isVirtualCurrency(a.currency_name))

  return []
})
/** 虚拟币列表 */
const virtualCurrencyList = computed(() => {
  if (withdrawCurrencyList.value.length) {
    return withdrawCurrencyList.value.filter((a: any) => isVirtualCurrency(a.currency_name)).map((b: any) => {
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
    arr.push({ label: t('法币'), value: 'fiat', icon: '/ph-h5/png/fiat.png' })
  if (virtualCurrencyList.value.length > 0)
    arr.push({ label: t('加密货币'), value: 'virtual', icon: '/ph-h5/png/virtual.png' })
  return arr
})

const currentComponent = ref(getMyComponent())
function getMyComponent() {
  const components = {
    fiat: FiatWithdraw,
    virtual: VirWithdraw,
  }
  const key = tab.value as TabValue
  return components[key] || FiatWithdraw
}
const loaded = ref(false)
const showLoading = computed(() => {
  return isDataLoading.value || (!loaded.value && !getComponent.value)
})
function onLoad() {
  loaded.value = true
}
async function onChangeTab(t: TabValue) {
  await router.replace({
    query: {
      tab: route.query.tab,
      subtab: t,
    },
  })
  loaded.value = false
  // 路由更新后再更新组件
  currentComponent.value = getMyComponent()
}

onMounted(() => {
  appStore.updateUserInfo()
  brandStore.runAsyncBrandBaseDetail()
})

await application.allSettled([getFinanceWithdrawData()])
</script>

<template>
  <div class="d">
    <div v-if="getComponent" class="my-[16rem] flex flex-col gap-[16rem] p-[12rem] rounded-[8rem]  bg-white">
      <component :is="getComponent" :key="brandStore.brandChangeNum" :is-component="true" :tip-text="$t('提款')" @toggle="toggleEmail" />
    </div>
    <template v-else>
      <div class="pt-[10rem] px-[12rem] bg-white rounded-b-[8rem]">
        <PhBaseTabs v-if="tabList.length > 1" v-model="tab" :type="3" :full="true" style="--tabs-wrap-padding-x:0;--tabs-icon-size:24rem; --tabs-item-gap:0;--tabs-item-pb:12rem;--tabs-item-border-width:62rem;" :list="tabList" class="subtab" @change="onChangeTab" />
      </div>
      <div class="my-[16rem] flex flex-col gap-[16rem] p-[12rem] rounded-[8rem]  bg-white">
        <AppLoading v-if="showLoading" class="h-[1000px]" />
        <component
          :is="currentComponent"
          :vir-currency-list="virtualCurrencyList"
          :fiat-currency-list="fiatCurrencyList"
          @loaded="onLoad"
        />
      </div>
    </template>
    <AppAuthWrap />
  </div>
</template>

<style lang="scss" scoped>

</style>

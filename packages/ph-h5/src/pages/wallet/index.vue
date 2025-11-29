<script setup lang="ts">
import { PhBaseTabs } from '@tg/bccomponents'
import { sendMsgToAdjust } from '@tg/hooks'
import { useBrandStore, useCurrency } from '@tg/stores'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import { isVirtualCurrency, sendMsgToFlutterThirdPartyApp } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onActivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'
import Exchange from './_components/currency-exchange.vue'
import Deposite from './_components/deposite.vue'
import WithDraw from './_components/withdraw.vue'

type TabValue = 'deposit' | 'withdraw' | 'exchange'

defineOptions({ name: 'KeepAliveAppWallet' })

const { currencyList } = storeToRefs(useCurrency())
const { brandBase } = storeToRefs(useBrandStore())

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const mainTabs = computed(() => {
  const arr = [
    { label: t('存款'), value: 'deposit' },
    { label: t('提款'), value: 'withdraw' },
  ]
  // 法币数据
  const fiatArr = currencyList.value.filter(a => isVirtualCurrency(a.type))
  // 虚拟币数据
  const virArr = currencyList.value.filter(a => isVirtualCurrency(a.type))
  if (Number(brandBase.value?.currency_exchange) > 0 && fiatArr.length > 0 && virArr.length > 0)
    arr.push({ label: t('货币兑换'), value: 'exchange' })
  return arr
})

const activeTab = ref<TabValue>((route.query.tab || 'deposit') as TabValue)

const currentComponent = ref(getComponent())
function getComponent() {
  const components = {
    deposit: Deposite,
    withdraw: WithDraw,
    exchange: Exchange,
  }
  const key = activeTab.value as TabValue
  return components[key]
}

/* watch(activeTab, (t) => {

}, { immediate: true }) */
async function onChangeTab(t: TabValue, replace = true) {
  activeTab.value = t
  if (replace) {
    await router.replace({
      query: {
        tab: t,
      },
    })
  }
  // 路由更新后再更新组件
  currentComponent.value = getComponent()
}

onActivated(() => {
  const tab = (route.query.tab || 'deposit') as TabValue
  if (tab === 'deposit') {
    sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.RECHARGECLICK)
    sendMsgToAdjust(SendFlutterThirdPartyAppMessage.RECHARGECLICK)
  }
  onChangeTab(tab, false)
})
</script>

<template>
  <AppPageLayout :title="$t('钱包中心')">
    <template #right>
      <span class="text-[#6D7693] text-[14rem] font-[400]" @click="router.push('/transaction-record')">{{ $t('记录') }}</span>
    </template>
    <div class="d">
      <PhBaseTabs v-model="activeTab" :type="4" :list="mainTabs" :full="mainTabs.length < 3" style="--tabs-item-rounded-bottom:0;" @change="onChangeTab" />
      <Suspense timeout="0">
        <template #default>
          <component :is="currentComponent" />
        </template>
        <template #fallback>
          <AppLoading />
        </template>
      </Suspense>
    </div>
  </AppPageLayout>
</template>

<style scoped lang="scss">

</style>

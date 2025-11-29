<script lang="ts" setup>
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppGlobalWatch',
})
const route = useRoute()
const menuStore = useMenuStore()
const { VITE_SOCKET_PREFIX } = getEnv()
const appStore = useAppStore()
const promoStore = usePromoStore()
const { mqttIsConnected, isLogin, balanceData, currentGlobalCurrency, userInfo } = storeToRefs(appStore)
const brandStore = useBrandStore()
const { runGetFinanceDepositCurrencyData, runGetFinanceWithdrawCurrencyData } = useCurrencyData()
const { renderCurrencyList } = useCurrencyData()
const { globalPageTitle } = useGlobalStatePageTitle()

function handleAdminRegConfigChange() {
  console.error('注册修改了')
  brandStore.runAsyncBrandBaseDetail()
}

function handleDepositChange() {
  console.error('存取款通道等有变动')
  if (isLogin.value && appStore.getToken()) {
    runGetFinanceDepositCurrencyData()
    runGetFinanceWithdrawCurrencyData()
    appStore.getBalanceData()
  }
}
function handleAjust(type: SendFlutterThirdPartyAppMessage) {
  sendMsgToAdjust(type)
}

watch(() => route.fullPath, (val, old) => {
  if (val.includes('/casino') && !val.includes('/my-bets')) {
    menuStore.setFooterBarCasinoRoute(val)
    menuStore.setLastLogoShouldGo('casino')
  }
  else if (val.includes('/sports') && !val.includes('/my-bets')) {
    menuStore.setFooterBarSportsRoute(val)
    menuStore.setLastLogoShouldGo('sports')
  }
  else if (old && old.includes('/casino') && !old.includes('/my-bets')) {
    menuStore.setLastLogoShouldGo('casino')
  }
  else if (old && old.includes('/sports') && !old.includes('/my-bets')) {
    menuStore.setLastLogoShouldGo('sports')
  }

  if (val.includes('/settings'))
    appStore.updateUserInfo()
})

watch(mqttIsConnected, (val, oldValue) => {
  if (val !== oldValue && val) {
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/member/brand/detail`, { callback: memberBrandCallback })
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/deposit/flush`, { callback: depositFlushCallback })
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/deposit/virtual`, { callback: depositVirtualCallback })
    /** 订阅脸部识别通知 */
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/kyc/facialrecognition`, { callback: kycFacialRecognitionMsgCallBack })
  }
})

// 监听余额变化，动态设置全局选中货币
watch(() => balanceData.value, (val) => {
  nextTick(() => {
    const firstCurrency = renderCurrencyList.value[0]
    // 如果第一个货币存在，并且当前全局货币不存在，则设置第一个货币为全局货币
    if (firstCurrency && val && !val[currentGlobalCurrency.value])
      appStore.changeGlobalCurrency(firstCurrency.type)
    else if (!firstCurrency && val && !val[currentGlobalCurrency.value])
      // 如果第一个货币不存在，并且当前全局货币不存在，则设置USDT为全局货币
      appStore.changeGlobalCurrency('USDT')
  })
})

watch([isLogin, userInfo], ([_isLogin, _userInfo], [oldIsLogin, oldUserInfo]) => {
  if (_isLogin && _userInfo?.uid) {
    const _newUid = _userInfo?.uid
    const _lastUid = Local.get(STORAGE_USER_UID)?.value
    const _lastBonusData = Local.get(STORAGE_REDRAIN_LAST_BONUS)?.value
    if (_lastUid !== _newUid) {
      // 与上次不一样的用户登录
      promoStore.setLastBonusData(undefined)
    }
    else {
      promoStore.setLastBonusData(_lastBonusData)
    }
    Local.set(STORAGE_USER_UID, _newUid)
  }
})

watchEffect(() => {
  document.title = globalPageTitle.value
})
onMounted(() => {
  appEventBus.on(EventBusNames.BRAND_WEB_REG_CONFIG_CHANGE, handleAdminRegConfigChange)
  appEventBus.on(EventBusNames.DEPOSIT_CHANGE_FIAT_OR_VIRT, handleDepositChange)
   appEventBus.on(EventBusNames.ADJUST, handleAjust)
  // appEventBus.on(EventBusNames.PROMO_DEPOSIT_DIALOG, handlePromoDepositDialog)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.BRAND_WEB_REG_CONFIG_CHANGE, handleAdminRegConfigChange)
  appEventBus.off(EventBusNames.DEPOSIT_CHANGE_FIAT_OR_VIRT, handleDepositChange)
    appEventBus.off(EventBusNames.ADJUST, handleAjust)
  // appEventBus.off(EventBusNames.PROMO_DEPOSIT_DIALOG, handlePromoDepositDialog)
})
</script>

<template>
  <div
    class="hidden"
  />
</template>

<script setup lang="ts">
import type { SendFlutterThirdPartyAppMessage } from '@tg/types'
import { sendMsgToAdjust, useAdjust } from '@tg/hooks'
import { SportsNotify } from '@tg/sports-stake/core'
import { useAffiliate, useAppStore, useBrandStore, useCurrency, useSportsStore, useVipStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import {
  appEventBus,
  balanceMsgCallback,
  getEnv,
  kycFacialRecognitionMsgCallBack,
  kycVerifyMsgCallBack,
  maintainCallBack,
  memberCallback,
  notificationMsgCallback,
  promoFixedDepositCallback,
  socketClient,
} from '@tg/utils'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { VITE_SOCKET_PREFIX, VITE_SITE_NAME } = getEnv()

const appStore = useAppStore()
const currencyStore = useCurrency()
const vipStore = useVipStore()
const affiliateStore = useAffiliate()
const { isLogin, userInfo, mqttIsConnected } = storeToRefs(appStore)
const sportsStore = useSportsStore()
const { isSportsLogin, isRequestSportsLogin } = storeToRefs(sportsStore)
const router = useRouter()
const route = useRoute()
const brandStore = useBrandStore()
const sportsNotify = new SportsNotify(socketClient)

function handleAdminRegConfigChange() {
  console.error('注册修改了')
  brandStore.runAsyncBrandBaseDetail()
}

function handleDepositChange() {
  console.error('存取款通道等有变动')
  if (isLogin.value && appStore.getToken()) {
    currencyStore.getFinanceDepositCurrency()
    currencyStore.getFinanceWithdrawCurrency()
    currencyStore.runGetMemberBalance()
    // appStore.getBalanceData()
  }
}
function handleAjust(type: SendFlutterThirdPartyAppMessage) {
  sendMsgToAdjust(type)
}
watch(isLogin, (_isLogin) => {
  if (_isLogin) {
    currencyStore.initCurrencyList()
    currencyStore.getFinanceDepositCurrency()
    currencyStore.getFinanceWithdrawCurrency()
    vipStore.runGetMemberVipBonusRecord()
    affiliateStore.runAsyncAffiliateCfg()
    appStore.updateAllContractList({ level: '018' })
  }
}, { immediate: true })

/** 体育相关 */
watchEffect(() => {
  const isSportPath = route.path.includes('/sports') || route.name === 'BetsRecord'
  let status = false
  if (isSportsLogin.value)
    status = false

  if (isLogin.value && isSportPath && !isSportsLogin.value) {
    status = true
    sportsStore.setSportLogin(true)
  }

  isRequestSportsLogin.value = status
})
watch(router.currentRoute, (a) => {
  if (isRequestSportsLogin.value)
    sportsStore.runAsyncSportsLogin()
})

/** mqtt */
const stop = watch([isLogin, userInfo], ([_isLogin, _userInfo], [oLogin]) => {
  if (_isLogin && _userInfo?.uid) {
    socketClient.connect('登录连接', _userInfo.uid)
    stop()
  }
})

watch(isLogin, (_isLogin) => {
  if (!_isLogin) {
    socketClient.connect('没登录连接')
  }
}, { immediate: true })

watch([isLogin, userInfo, mqttIsConnected], ([_isLogin, _userInfo, _mqttIsConnected], [oldIsLogin, oldUserInfo, oldMqttIsConnected]) => {
  if (
    _isLogin && _userInfo?.uid && _mqttIsConnected
    && (_isLogin !== oldIsLogin || _userInfo?.uid !== oldUserInfo?.uid || _mqttIsConnected !== oldMqttIsConnected)
  ) {
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/balance/${_userInfo?.uid}`, { callback: balanceMsgCallback })
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/member/${_userInfo?.uid}`, { callback: memberCallback })
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/member/notifications/${_userInfo?.uid}`, { callback: notificationMsgCallback })
    socketClient.addSubscribe('/zk/currency/status', { callback: balanceMsgCallback })
    // socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/promo/deposit/${_userInfo?.uid}`, { callback: promoDepositCallback })
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/promo/fixed/deposit`, { callback: promoFixedDepositCallback })
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/kyc/${_userInfo?.uid}`, { callback: kycVerifyMsgCallBack })
    /** 订阅脸部识别通知 */
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/kyc/facialrecognition`, { callback: kycFacialRecognitionMsgCallBack })
  }
  if (_mqttIsConnected && (_mqttIsConnected !== oldMqttIsConnected))
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/siteMaintain`, { callback: maintainCallBack })
})

// 同时监听 route.path和mqttIsConnected
watch(
  [() => route.path, mqttIsConnected],
  ([newPath, newMqttIsConnected]) => {
    if (newMqttIsConnected) {
      if (newPath.includes('/sports')) {
        sportsNotify.startCountdown()
        if (!sportsNotify.isSubscribed)
          sportsNotify.subscribe()
      }
      else {
        sportsNotify.stopCountdown()
        if (sportsNotify.isSubscribed)
          sportsNotify.unsubscribe()
      }
    }
  },
  { immediate: true },
)
useAdjust()
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
  <div />
</template>

<style scoped lang="scss">

</style>

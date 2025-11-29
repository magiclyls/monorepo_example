<script setup lang="ts">
import type { FlutterAppMsgType,EnumLanguageKey } from './types'
import type { EnumCurrencyKey } from './apis/types'
import { ApiMemberSiteMaintain,ApiMemberBrandKefuSign } from '@tg/apis'
import {apiStatusFalse} from "~/http";
import {
  ChatConfigProvider,
  enUS,
  hiIN,
  koKR,
  ptBR,
  tlPH,
  viVN,
  zhCN,
} from '@tg/chat-h5/core'
import { getCurrentLanguageForFrontend } from './utils/i18n'

const { VITE_SOCKET_PREFIX, VITE_SITE_NAME } = getEnv()
const appStore = useAppStore()
const { closeRightSidebar } = useRightSidebar()
const router = useLocalRouter()
const { openNotify } = useNotify()
const { t } = useI18n()
const { runAsyncAffiliateCfg } = useAffiliate()
const { openLoginPwaDialog } = useDialogLoginPwa()

// router.afterEach((to) => {
//   const iframe = document.getElementById('mobile-iframe') as HTMLIFrameElement
//   const isParent = window.self === window.top
//   if (isParent) {
//     // post to iframe
//     iframe && iframe.contentWindow && iframe.contentWindow.postMessage(
//       { type: 'routeChange', path: to.path },
//       '*',
//     )
//   }
//   else {
//     parent.postMessage(
//       { type: 'routeChange', path: to.path },
//       '*',
//     )
//   }
//
//   // post to parent
// })
const { isLogin, userInfo, mqttIsConnected, isAppFirstLoadFinish, currentGlobalCurrency } = storeToRefs(appStore)
const { isMobile } = storeToRefs(useWindowStore())
const { openLoginDialog } = useLoginDialog()
const route = useRoute()
const {
  isWalletDialogOpen,
  isHaveWaitingPWADialog,
  setIsHaveWaitingPWADialogTrue,
  setIsHaveWaitingPWADialogFalse,
} = useGlobalStateWalletState()
const { isDepositPWAOpen, timeOutSet,brandConfig,brandKf } = storeToRefs(useBrandStore())
const { openPwaDialog } = useDialogPwa()

const { data: sign } = useRequest(ApiMemberBrandKefuSign, {
  ready: isLogin,
  manual: false,
})

function getChatProviderLang(lang: EnumLanguageKey) {
  const langMap: Partial<Record<EnumLanguageKey, any>> = {
    'en-US': enUS,
    'hi-IN': hiIN,
    'ko-KR': koKR,
    'pt-BR': ptBR,
    'tl-PH': tlPH,
    'vi-VN': viVN,
    'zh-CN': zhCN,
  }
  return langMap[lang] || zhCN
}

const isRouteSports = computed(() => route.name?.toString().includes('sports') || route.name?.toString().includes('limit-ip') || route.name?.toString().includes('minigame-result'))
const isHome = computed(() => route.name === 'casino-home' || route.path === '/')
const isPromoRed = computed(() => route.path.includes('promotions/promotion/dollar-waves'))
const howLongTimeExit = computed(() => (timeOutSet.value && Number(timeOutSet.value) * 60 * 1000) || 0)

const kefuUrl = computed(() => {
  const kefuItem = brandKf.value?.find((item: any) => +item.state === 1 || item.state === true)
  return kefuItem?.url || ''
})

function startRunTime(time: number) {
  console.log('🚀 ~ startRunTime ~ time:', time)
  if (time) {
    const idleTimeout = new IdleTimeout(time, () => {
      console.log('自信了吗')
      router.push('/')
      Local.remove(STORAGE_PROMO_AD_POP_UNLOGIN)
      appStore.removeToken()
      appStore.removeUserInfo()
      appStore.setMqttConnectedFalse()
      closeRightSidebar()
      socketClient.connect('退出 重新连接')
    })
    idleTimeout.start()
  }
}

const {
  run: runMemberSiteMaintain,
  loading: memberSiteMaintainLoading,
} = useRequest(ApiMemberSiteMaintain, {
  onSuccess(data) {
    data.direct = true
    appEventBus.emit(EventBusNames.SITE_MAINTAIN, data)
  },
})

const stop = watch([isLogin, userInfo], ([_isLogin, _userInfo], [oLogin]) => {
  if (_isLogin && _userInfo?.uid) {
    socketClient.connect('登录连接')
    appStore.runGetVipConfig()
    appStore.runGetMemberVipBonusRecord()
    const globalCurrencyCode = currencyConfig[currentGlobalCurrency.value]?.cur ?? '701'
    const currency_id = supportedCur.includes(globalCurrencyCode) ? globalCurrencyCode : '706'
    appStore.runAsyncRebateAutomatic(currency_id)
    stop()
  }
})

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
  }
  if (_mqttIsConnected && (_mqttIsConnected !== oldMqttIsConnected))
    socketClient.addSubscribe(`${VITE_SOCKET_PREFIX}/siteMaintain`, { callback: maintainCallBack })
})
watch([isLogin, userInfo], ([_isLogin]) => {
  runAsyncAffiliateCfg()
}, { immediate: true })
watchEffect(() => isLogin.value && startRunTime(howLongTimeExit.value))
watch(isAppFirstLoadFinish, (a) => {
  if (a) {
    if (!isLogin.value)
      socketClient.connect('没登录连接')
  }
}, { immediate: true })

// watchEffect(() => {
//   if (VITE_SITE_NAME !== 'x02') {
//     if (isLogin.value) {
//       idleTimeout.start()
//     }
//     else {
//       if (idleTimeout.isRunning)
//         idleTimeout.stop()
//     }
//   }
// })
/**
 * 监听钱包开关、如果有未打开的pwa弹窗时打开
 */
watch(isWalletDialogOpen, (a) => {
  if (!a && isDepositPWAOpen.value && isHaveWaitingPWADialog.value && !isPwa()) {
    openPwaDialog()
    setIsHaveWaitingPWADialogFalse()
  }
})

onMounted(() => {
  updateServerTime()
  runMemberSiteMaintain()
  appEventBus.on(EventBusNames.SITE_MAINTAIN, (data) => {
    const { maintain, state, direct, content } = data
    if (!direct)
      data.content = content[getCurrentLanguageForBackend()]

    // state 1 正常, 2 站点限制, 3 站点冻结
    // maintain 1 开放 2 维护
    if (state === '3' || maintain === '2') {
      appStore.setMaintainData(data)
      router.replace('/maintenance')
    }
    else if (route.path.includes('/maintenance')) {
      router.replace('/')
    }
  })
  appEventBus.on(EventBusNames.NEED_LOGiN_MSG, () => {
    openLoginDialog()
  })
  appEventBus.on(EventBusNames.REFRESH_BALANCE_BUS, () => {
    appStore.getBalanceData()
  })
  appEventBus.on(EventBusNames.REFRESH_MEMBER_BUS, () => {
    appStore.updateUserInfo()
  })

  appEventBus.on(EventBusNames.RECEIVE_FLUTTER_APP_MSG, (p: FlutterAppMsgType) => {
    const currencyType = p.msg.currency
    switch (p.type) {
      case ReceiveFlutterAppMessage.CURRENCY_CHANGE:
        if (currencyType) {
          appStore.changeGlobalCurrency(currencyType)
          sessionStorage.setItem('current_global_currency', currencyType)
        }
        break
    }
  })

  /** 监听kyc验证成功通知 */
  appEventBus.on(EventBusNames.KYC_VERIFY_SUCCESS, () => {
    openNotify({
      title: t('success_verify'),
      message: t('kyc_is_good'),
    })
    appStore.runGetMemberKYCInfo()
  })

  /** 监听存款成功通知，并在没有钱包弹窗时、后台打开PWA时打开PWA弹窗 */
  // 存款pwa弹窗逻辑和该逻辑冲突，注释
  // appEventBus.on(EventBusNames.FINANCE_DEPOSIT_SUCCESS, () => {
  //   if (isDepositPWAOpen.value) {
  //     // 钱包弹窗是关闭状态
  //     if (!isWalletDialogOpen.value && !isPwa())
  //       openPwaDialog()

  //     // 钱包弹窗是打开状态
  //     else
  //       setIsHaveWaitingPWADialogTrue()
  //   }
  // })
  // 存款pwa弹窗
  appEventBus.on(EventBusNames.DEPOSIT_PWA, (msg) => {
    if (msg.target === 'PWAPopUp') {
      openLoginPwaDialog()
    }
    else {
      const list = (msg?.content || '')?.split(',')
      if (list.length >= 2) {
        openNotify({
          title: t('receive_success'),
          message: t('deposit_pwa_bonus', [application.formatNumDecimal(Number(list[0]), currencyConfig[list[1] as EnumCurrencyKey].decimal), list[1]]),
        })
      }
    }
  })

  // 字体
  document.body.className = `${document.body.className} font-${getCurrentUrlLanguage()}`
  watchEffect(() => {
    const app = document.getElementById('app')
    if (app)
      app.className = globalInitMap.isPcRenderH5 ? 'auto' : ''
  })

  // window.addEventListener('message', (event) => {
  //   const { type, path } = event.data
  //   console.log('receive:', event.data)
  //   if (type === 'routeChange')
  //     router.push(path)
  // })

  // if (isSafari)
  //   domClassAddRemove('mobile-100dvh-layout', 'add')
})

// onUnmounted(() => {
//   if (idleTimeout.isRunning)
//     idleTimeout.stop()
// })

onMounted(() => {
  window.addEventListener("apis-http-status-is-false", (e: Event) => {
    const custom = e as CustomEvent
    if (custom?.detail?.response) {
      apiStatusFalse(custom.detail.response)
    }
  })

})
</script>

<template>
  <ChatConfigProvider
    project-name="afun-pc"
    :locale="getChatProviderLang(getCurrentLanguageForFrontend())"
    :kefu-url="kefuUrl"
    :url="brandConfig?.api_domain?.h5_url"
    :user-name="appStore.userInfo?.username ?? ''"
    :lang="getCurrentUrlLanguage()"
    :sign="sign"
  >
    <AppModal />
    <AppGlobalStatistics />
    <AppGlobalWatch />
    <AppGlobalSetInterval />
    <AppGlobalMounted />
    <AppGlobalAutoRefresh />
    <AppGlobalLimited />
    <RouterView v-slot="{ Component }">
      <!--  <AppAnimateRoute> -->
      <KeepAlive include="HomeLayout">
        <component
          :is="Component"
        />
      </KeepAlive>
      <!-- </AppAnimateRoute> -->
    </RouterView>
    <AppPromoHotGate v-if="!isFlutterApp() && isHome && (isMobile ? true : !isRouteSports) && isAppFirstLoadFinish" />
    <AppDollarRainCountdown v-if="!isFlutterApp() && (isHome || isPromoRed)" />
    <AppFloatButton />
    <AppConnectRefresh />

    <!-- 图片预加载 -->
    <AppPreloadImage />
    <!-- IndexedDB -->
    <AppIndexedDB />
  </ChatConfigProvider>
</template>

<style  lang="scss">
body {
  &.font-zh {
    font-family: PingFang SC;
  }
}
</style>

<script setup lang="ts">
import type { EnumLanguageKey } from '@tg/types'
import { ActivityConfigProvider, ptBR as BR, zhCN as CN, hiIN as IN, koKR as KR, tlPH as PH, enUS as US, viVN as VN } from '@tg/activity/core'
import { ApiMemberBrandKefuSign } from '@tg/apis'
import { BaseKeepAlive } from '@tg/bccomponents'
import {
  ChatConfigProvider,
  enUS as chatEnUS,
  hiIN as chatHiIN,
  koKR as chatKoKR,
  ptBR as chatPtBR,
  tlPH as chatTlPH,
  viVN as chatViVN,
  zhCN as chatZhCN,
} from '@tg/chat-h5/core'
import { useHideKeyboard, useKeyboardViewportFix } from '@tg/hooks'
import {
  enUS,
  hiIN,
  koKR,
  LotteryConfigProvider,
  ptBR,
  tlPH,
  viVN,
  zhCN,
} from '@tg/lottery-h5/core'
import { AppSportsFloatingBetSlip, AppSportsFloatingBetSlipCh, SportsConfigProvider } from '@tg/sports-stake/core'
import { useAppStore, useBrandStore } from '@tg/stores'
import { isFlutterApp } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { computed, nextTick, onMounted } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppConnectRefresh from './components/AppConnectRefresh.vue'
import AppFooter from './components/AppFooter.vue'
import AppGlobalDialog from './components/AppGlobalDialog.vue'
import AppGlobalEventBus from './components/AppGlobalEventBus.vue'
import AppGlobalOnMounted from './components/AppGlobalOnMounted.vue'
import AppGlobalWatch from './components/AppGlobalWatch.vue'
import AppGlobalWatchVisible from './components/AppGlobalWatchVisible.vue'
import AppPageDialog from './components/AppPageDialog.vue'
import AppService from './components/AppService.vue'
import { useActivityConfig } from './hooks/useActivityConfig'

const brandStore = useBrandStore()
const appStore = useAppStore()
const route = useRoute()
const { isLogin, callback, globalCurrencyCode } = useActivityConfig()
brandStore.runAsyncBrandBaseDetail()

const showSportsFloatingBetSlip = computed(() => {
  return route.path?.toString().includes('/sports')
})

const { data: sign } = useRequest(ApiMemberBrandKefuSign, {
  ready: isLogin,
  manual: false,
})
brandStore.runAsyncBrandBaseDetail()

const kefuUrl = computed(() => {
  const kefuItem = brandStore.brandKf?.find((item: any) => +item.state === 1 || item.state === true)
  return kefuItem?.url || ''
})

function getProviderLang(lang: EnumLanguageKey, type: 'activity' | 'lottery' | 'chat') {
  const langMap: Partial<Record<EnumLanguageKey, any>> = {
    'en-US': enUS,
    'hi-IN': hiIN,
    'ko-KR': koKR,
    'pt-BR': ptBR,
    'tl-PH': tlPH,
    'vi-VN': viVN,
    'zh-CN': zhCN,
  }
  const activityLangMap: Partial<Record<EnumLanguageKey, any>> = {
    'en-US': US,
    'hi-IN': IN,
    'ko-KR': KR,
    'pt-BR': BR,
    'tl-PH': PH,
    'vi-VN': VN,
    'zh-CN': CN,
  }
  const chatLangMap: Partial<Record<EnumLanguageKey, any>> = {
    'en-US': chatEnUS,
    'hi-IN': chatHiIN,
    'ko-KR': chatKoKR,
    'pt-BR': chatPtBR,
    'tl-PH': chatTlPH,
    'vi-VN': chatViVN,
    'zh-CN': chatZhCN,
  }

  return type === 'activity' ? activityLangMap[lang] : type === 'chat' ? chatLangMap[lang] : langMap[lang]
}

useKeyboardViewportFix()
useHideKeyboard()

// App 真正渲染完成后再移除原生 Splash
onMounted(() => {
  // 延迟一小帧，确保首屏内容已经绘制完毕
  nextTick(() => {
    if (typeof window.__REMOVE_NATIVE_SPLASH__ === 'function') {
      window.__REMOVE_NATIVE_SPLASH__()
    }
  })
})
</script>

<template>
  <ActivityConfigProvider
    :is-login="isLogin"
    :callback="callback"
    :global-currency-code="globalCurrencyCode"
    :locale="getProviderLang(getLang(), 'activity')"
  >
    <LotteryConfigProvider :locale="getProviderLang(getLang(), 'lottery')" project-name="afun-h5">
      <ChatConfigProvider
        :locale="getProviderLang(getLang(), 'chat')"
        project-name="afun-h5"
        :kefu-url="kefuUrl"
        :url="brandStore.brandConfig?.api_domain?.h5_url"
        :user-name="appStore.userInfo?.username ?? ''"
        :lang="getLang()"
        :sign="sign"
      >
        <SportsConfigProvider :route="route" sport-directory="sports" project-name="afun-h5">
          <div class="w-[var(--pc-max-width)] m-auto relative hide-scroll-bar">
            <RouterView v-slot="{ Component, route }">
              <transition :name="($route.meta.transitionName as string)">
                <BaseKeepAlive :is="Component" :route="route" :include="['Ksd']" />
              </transition>
            </RouterView>
            <AppFooter v-if="!isFlutterApp()" />
            <Teleport to="body">
              <AppService />
              <!-- 体育悬浮球投注单 -->
              <AppSportsFloatingBetSlip v-if="showSportsFloatingBetSlip && getLang() !== 'zh-CN'" />
              <AppSportsFloatingBetSlipCh v-else-if="showSportsFloatingBetSlip" />
            <!-- <AppCookie /> -->
            </Teleport>

            <AppPageDialog />
            <AppGlobalWatch />
            <AppGlobalWatchVisible />
            <AppGlobalEventBus />
            <AppGlobalDialog />
            <AppConnectRefresh />
            <AppGlobalOnMounted />
          </div>
        </SportsConfigProvider>
      </ChatConfigProvider>
    </LotteryConfigProvider>
  </ActivityConfigProvider>
</template>

<style lang="scss">
.slide-left-enter-active,
.slide-right-enter-active {
  transition: all 0.3s ease;
  width: 100%;
}

.slide-left-leave-active,
.slide-right-leave-active {
  transition: all 0.3s ease;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-leave-to {
  opacity: 0;
}
</style>

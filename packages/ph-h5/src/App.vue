<script setup lang="ts">
import type { EnumLanguageKey } from '@tg/types'
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
import { useKeyboardViewportFix } from '@tg/hooks'

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
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppConnectRefresh from './components/AppConnectRefresh.vue'
import AppGlobalDialog from './components/AppGlobalDialog.vue'
import AppGlobalEventBus from './components/AppGlobalEventBus.vue'
import AppGlobalOnMounted from './components/AppGlobalOnMounted.vue'
import AppGlobalWatch from './components/AppGlobalWatch.vue'
import AppGlobalWatchVisible from './components/AppGlobalWatchVisible.vue'

const brandStore = useBrandStore()
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const route = useRoute()

const showSportsFloatingBetSlip = computed(() => {
  return route.path?.toString().includes('/sports')
})

const { data: sign } = useRequest(ApiMemberBrandKefuSign, {
  ready: isLogin,
  manual: false,
})

brandStore.runAsyncBrandBaseDetail()
const isHome = computed(() => route.name === 'Home' || route.path === '/')
const kefuUrl = computed(() => {
  const kefuItem = brandStore.brandKf?.find((item: any) => +item.state === 1 || item.state === true)
  return kefuItem?.url || ''
})
function getProviderLang(lang: EnumLanguageKey, type: 'lottery' | 'chat') {
  const langMap: Partial<Record<EnumLanguageKey, any>> = {
    'en-US': enUS,
    'hi-IN': hiIN,
    'ko-KR': koKR,
    'pt-BR': ptBR,
    'tl-PH': tlPH,
    'vi-VN': viVN,
    'zh-CN': zhCN,
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

  return type === 'chat' ? chatLangMap[lang] : langMap[lang]
}

useKeyboardViewportFix()
</script>

<template>
  <LotteryConfigProvider :locale="getProviderLang(getLang(), 'lottery')">
    <ChatConfigProvider
      :locale="getProviderLang(getLang(), 'chat')"
      project-name="ph-h5"
      :kefu-url="kefuUrl"
      :url="brandStore.brandConfig?.api_domain?.h5_url"
      :user-name="appStore.userInfo?.username ?? ''"
      :lang="getLang()"
      :sign="sign"
    >
      <SportsConfigProvider :route="route" sport-directory="sports-ph" project-name="ph-h5">
        <div class="w-[var(--pc-max-width)] min-h-[100dvh] m-auto relative hide-scroll-bar">
          <RouterView v-slot="{ Component, route }">
            <BaseKeepAlive :is="Component" :route="route" :include="['Ksd']" />
          </RouterView>
          <Teleport to="body">
            <!-- 体育悬浮球投注单 -->
            <AppSportsFloatingBetSlip v-if="showSportsFloatingBetSlip && getLang() !== 'zh-CN'" />
            <AppSportsFloatingBetSlipCh v-else-if="showSportsFloatingBetSlip" />
            <!-- <AppCookie /> -->
          </Teleport>

          <AppGlobalWatch />
          <AppGlobalWatchVisible />
          <AppGlobalEventBus />
          <AppGlobalDialog />
          <AppConnectRefresh />
          <AppGlobalOnMounted />
        </div>
      </SportsConfigProvider>
    </chatconfigprovider>
  </LotteryConfigProvider>
</template>

<style lang="scss">
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active,
.slide-up-enter-active,
.slide-up-enter-active {
  transition: transform 0.3s ease;
  width: 100%;
  top: 0;
  left: 0;
}

.slide-left-enter-from {
  transform: translateX(100%);
}
.slide-left-enter-to {
  transform: translateX(0%);
}
.slide-left-leave-from {
  transform: translateX(0%);
}
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}
.slide-right-enter-to {
  transform: translateX(0%);
}
.slide-right-leave-from {
  transform: translateX(0%);
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>

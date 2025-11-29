<script setup lang="ts">
import type { EnumLanguageKey } from '@tg/types'
import { getParamsQuery, setToken } from '@tg/utils'
import { changeLanguage, getLang } from '@tg/vue-i18n'
import { enUS, hiIN, koKR, ptBR, tlPH, viVN, zhCN } from '../core'
import AppGlobalMqtt from './components/AppGlobalMqtt.vue'
import AppGlobalWatchVisible from './components/AppGlobalWatchVisible.vue'
import { LotteryConfigProvider } from './components/LotteryConfigProvider'

declare global {
  interface Window {
    isFrameLottery?: boolean
  }
}

window.isFrameLottery = true

const token: string = getParamsQuery('t')
const lang: EnumLanguageKey = getParamsQuery('lang')
setToken(token)
changeLanguage(lang)

function getProviderLang(lang: EnumLanguageKey) {
  const langMap = {
    'en-US': enUS,
    'hi-IN': hiIN,
    'ho-KR': koKR,
    'pt-BR': ptBR,
    'tl-PH': tlPH,
    'vi-VN': viVN,
    'zh-CN': zhCN,
  }

  return langMap[lang]
}
</script>

<template>
  <LotteryConfigProvider :locale="getProviderLang(getLang())">
    <div class="w-[var(--pc-max-width)] m-auto relative overflow-x-hidden hide-scroll-bar">
      <RouterView v-slot="{ Component, route }">
        <transition :name="($route.meta.transitionName as string)">
          <component :is="Component" />
        </transition>
      </RouterView>
      <AppGlobalMqtt />
      <AppGlobalWatchVisible />
    </div>
  </LotteryConfigProvider>
</template>

<style lang="scss">
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s ease;
  position: absolute;
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

<script setup lang="ts">
import type { EnumLanguageKey } from '@tg/types'
import { getParamsQuery } from '@tg/utils'
import { changeLanguage, getLang } from '@tg/vue-i18n'
import { enUS, hiIN, koKR, ptBR, tlPH, viVN, zhCN } from '../core'
import { ChatConfigProvider } from './components/ChatConfigProvider'
// import ChatToast from './components/ChatToast.vue'
import ChatHomePage from './pages/index.vue'

declare global {
  interface Window {
    isFrameChat?: boolean
  }
}

window.isFrameChat = true

const lang: EnumLanguageKey = getParamsQuery('lang')
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
  <ChatConfigProvider :locale="getProviderLang(getLang())">
    <div class="w-[var(--pc-max-width)] m-auto relative overflow-x-hidden hide-scroll-bar">
      <ChatHomePage />
    </div>
    <!-- <ChatToast /> -->
  </ChatConfigProvider>
</template>

<style lang="scss">
</style>

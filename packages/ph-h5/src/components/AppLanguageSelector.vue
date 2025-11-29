<script lang="ts" setup>
import type { EnumLanguageKey } from '@tg/types'
import { PhBaseButton, PhBaseImage } from '@tg/bccomponents'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { usePreferredLanguage } from '~/hooks'

const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const { validLangList, selectedLang, initLanguage, setLanguage } = usePreferredLanguage()

async function selectLanguage(lang: EnumLanguageKey) {
  await setLanguage(lang)
  window.location.reload()
}

// 点击外部关闭
function handleClickOutside(e: MouseEvent) {
  if (!dropdownRef.value)
    return
  if (!dropdownRef.value.contains(e.target as Node)) {
    showDropdown.value = false
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

onMounted(() => {
  initLanguage()
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block text-left">
    <!-- 当前语言按钮 -->
    <PhBaseButton
      type="primary"
      style="--ph-base-button-border-radius:32rem; --ph-base-button-border-color:#EBEBEB; --ph-base-button-padding-x: 8rem; --ph-base-button-padding-y: 5rem; --ph-base-button-primary-background-color: #fff; --ph-base-button-primary-text-color: #0D2245; --ph-base-button-font-size: 12rem; --ph-base-button-font-weight: 500"
      @click="toggleDropdown"
    >
      <PhBaseImage class="w-[24rem] shrink-0" :url="`/flag/${selectedLang?.icon}.webp`" />
      <span class="ml-[4rem]">{{ selectedLang?.title }}</span>
    </PhBaseButton>

    <!-- 下拉菜单 -->
    <div
      v-if="showDropdown && validLangList.length"
      class="absolute z-10 mt-[11rem] w-auto bg-[#fff] border border-[#EBEBEB] rounded-[8rem]"
    >
      <ul class="flex flex-col px-[4rem] py-[7rem]">
        <li
          v-for="lang in validLangList"
          :key="lang.value"
          class="flex items-center gap-[12rem] cursor-pointer text-[#6D7693] h-[36rem] rounded-[6rem] px-[12rem]"
          :class="selectedLang?.title === lang.title && 'bg-[linear-gradient(273deg,#FF2B34_3.6%,#FF4F4F_97.54%)] text-[#fff]'"
          @click="selectLanguage(lang.value)"
        >
          <PhBaseImage class="w-[24rem] shrink-0" :url="`/flag/${lang?.icon}.webp`" />
          <span class="text-[12rem] font-[500] whitespace-nowrap">{{ lang.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

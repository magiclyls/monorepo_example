<script lang="ts" setup>
import type { EnumLanguageKey } from '@tg/types'
import { AfunBaseButton, AfunBaseImage } from '@tg/bccomponents'
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
    <AfunBaseButton
      type="primary"
      style="--afun-base-button-border-radius:32px; --afun-base-button-border-color:#EBEBEB; --afun-base-button-padding-x: 8px; --afun-base-button-padding-y: 5px; --afun-base-button-primary-background-color: #fff; --afun-base-button-primary-text-color: #0D2245; --afun-base-button-font-size: 12px; --afun-base-button-font-weight: 500"
      @click="toggleDropdown"
    >
      <AfunBaseImage class="w-[24px] shrink-0" :url="`/flag/${selectedLang?.icon}.webp`" />
      <span class="ml-[4px]">{{ selectedLang?.title }}</span>
    </AfunBaseButton>

    <!-- 下拉菜单 -->
    <div
      v-if="showDropdown && validLangList.length"
      class="absolute z-10 mt-[11px] w-auto bg-[#fff] border border-[#EBEBEB] rounded-[8px]"
    >
      <ul class="flex flex-col px-[4px] py-[7px]">
        <li
          v-for="lang in validLangList"
          :key="lang.value"
          class="flex items-center gap-[12px] cursor-pointer text-[#6D7693] h-[36px] rounded-[6px] px-[12px]"
          :class="selectedLang?.title === lang.title && 'bg-[linear-gradient(273deg,#FF2B34_3.6%,#FF4F4F_97.54%)] text-[#fff]'"
          @click="selectLanguage(lang.value)"
        >
          <AfunBaseImage class="w-[24px] shrink-0" :url="`/flag/${lang?.icon}.webp`" />
          <span class="text-[12px] font-[600] whitespace-nowrap">{{ lang.title }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

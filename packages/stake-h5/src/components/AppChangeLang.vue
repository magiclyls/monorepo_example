<script lang="ts" setup>
import { type EnumLanguageKeys } from '@tg/types'
import { loadLanguageAsync } from '@tg/vue-i18n'

const { t, locale } = useI18n()
const { AllLanguages, userLanguage } = storeToRefs(useLanguageStore())

const consoleWarn = console.warn

function changeLangKey(lang: EnumLanguageKeys) {
  loadLanguageAsync(lang)
  if (lang === 'aa-AA') {
    console.warn = () => {}
    setTimeout(() => {
      Array.from(document.querySelectorAll('body *'))
        .forEach((element) => {
          if (element.querySelector('*') === null)
            element.title = element.textContent
        })
    }, 1500)
  }
  else {
    console.warn = consoleWarn
  }
}
</script>

<template>
  <div class="bg-tg-primary flex flex-col gap-[5px] rounded-[5px] p-[6px] text-white">
    <BaseButton v-for="item in AllLanguages" :key="item.title" @click="changeLangKey(item.value)">
      <span
        :class="{
          'text-indigo-300': locale === item.value,
        }"
        :title="item.value"
      >
        {{ item.title }}
      </span>
    </BaseButton>
    <BaseButton @click="changeLangKey('aa-AA')">
      <span
        :class="{
          'text-indigo-300': locale === 'aa-AA',
        }"
      >
        显示Key
      </span>
    </BaseButton>
  </div>
</template>

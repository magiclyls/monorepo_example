<script setup lang='ts'>
import type { EnumLanguageKey } from '@tg/types'
import { PhBaseImage } from '@tg/bccomponents'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { usePreferredLanguage } from '~/hooks'

defineOptions({ name: 'AppUserLanguage' })

const { t } = useI18n()

const { validLangList, selectedLang, initLanguage, setLanguage } = usePreferredLanguage()

async function selectLanguage(lang: EnumLanguageKey) {
  await setLanguage(lang)
  window.location.reload()
}

onMounted(initLanguage)
</script>

<template>
  <AppPageLayout :title="t('语言')">
    <div class="w-full bg-[#fff] rounded-[8rem] px-[12rem]">
      <div
        v-for="item, i in validLangList" :key="item.value"
        class="flex items-center justify-between  h-[46rem] text-[14rem] font-[500] text-[#0D2245]"
        :class="{ 'have-border': i !== validLangList.length - 1 }"
        @click="selectLanguage(item.value)"
      >
        <div class="flex items-center ">
          <div class="flex-none w-[18rem] h-[18rem] mr-[8rem]">
            <PhBaseImage :url="`/flag/${item.icon}.webp`" />
          </div>
          <span>{{ item.title }}</span>
        </div>

        <div class="dot">
          <div :class="{ active: item.value === selectedLang?.value }" />
        </div>
      </div>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.have-border {
  border-bottom: 1px solid #ebebeb;
}
.dot {
  width: 20rem;
  height: 20rem;
  border-radius: 50%;
  border: 2rem solid #ebebeb;
  display: flex;
  justify-content: center;
  align-items: center;
  .active {
    width: 10rem;
    height: 10rem;
    background-color: #f23038;
    border-radius: 50%;
  }
}
</style>

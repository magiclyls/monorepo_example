<script setup lang='ts'>
import type { EnumLanguageKey } from '@tg/types'
import { AfunBaseImage } from '@tg/bccomponents'
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppPageLayout from '~/components/AppPageLayout.vue'
import BaseRadio from '~/components/BaseRadio.vue'
import BaseRadioGroup from '~/components/BaseRadioGroup.vue'
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
    <div class="w-full bg-[#233846] rounded-[4px] px-[12px]">
      <BaseRadioGroup :model-value="selectedLang?.value" :columns="1" class="radio-group">
        <div
          v-for="item, i in validLangList" :key="item.value"
          class="flex items-center justify-between  h-[46px] text-[14px] font-[600] text-[#fff]"
          :class="{ 'have-border': i !== validLangList.length - 1 }"
          @click="selectLanguage(item.value)"
        >
          <!-- <div class="flex items-center ">
            <div class="flex-none w-[18px] h-[18px] mr-[8px]">
              <AfunBaseImage :url="`/flag/${item.icon}.webp`" />
            </div>
            <span>{{ item.title }}</span>
          </div>

          <div class="dot">
            <div :class="{ active: item.value === selectedLang?.value }" />
          </div> -->

          <BaseRadio :value="item.value" class="w-full justify-between h-[46px] ">
            <div class="flex items-center ">
              <div class="flex-none w-[18px] h-[18px] mr-[8px]">
                <AfunBaseImage :url="`/flag/${item.icon}.webp`" />
              </div>
              <span>{{ item.title }}</span>
            </div>
          </BaseRadio>
        </div>
      </BaseRadioGroup>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.radio-group {
  --tg-radio-group-style-gap-vertical: 0;
  --tg-base-radio-style-flex-direction: row-reverse;
  --tg-base-radio-style-just-content: space-between;
}
.have-border {
  border-bottom: 1px solid #2f4553;
}
.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #557086;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
  .active {
    width: 10px;
    height: 10px;
    background-color: #1475e1;
    border-radius: 50%;
  }
}
</style>

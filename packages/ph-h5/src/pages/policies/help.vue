<script setup lang='ts'>
import type { EnumLanguageKey } from '@tg/types'
import { PhBaseArrow, PhBaseCell, PhBasePopup } from '@tg/bccomponents'
import { IconPhClose } from '@tg/icons'
import { faqs, hotFaqCategory } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { computed, inject, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

interface IFaqItem {
  title: Partial<Record<EnumLanguageKey, string>>
  content?: Partial<Record<EnumLanguageKey, string>>
  type: string
  expand?: boolean
}

defineOptions({ name: 'Help' })

const setTitle = inject('setTitle', (v: string) => {})

const { t } = useI18n()

const showPopup = ref(false)

const selectedFaqType = ref('')

const validLangs = ['zh-CN', 'pt-BR', 'en-US']

const faqList = reactive<IFaqItem[]>(faqs)

const selectedFaqTitle = ref(t('热门问题'))

const faqCategory = reactive<IFaqItem[]>(hotFaqCategory)

const isValidLang = computed(() => validLangs.includes(getLang()))

const selectedFaqs = computed<IFaqItem[]>(() => faqList.filter((item) => {
  if (!selectedFaqType.value || selectedFaqType.value === 'hot') {
    return faqList
  }
  else {
    return item.type.includes(selectedFaqType.value)
  }
}))

function chooseType(item: IFaqItem) {
  faqList.map(item => item.expand = false)
  selectedFaqType.value = item.type
  showPopup.value = false
  selectedFaqTitle.value = item.title[isValidLang.value ? getLang() : 'en-US'] || ''
}

onMounted(() => {
  setTitle(isValidLang.value ? t('帮助') : 'Help')
})
</script>

<template>
  <div class="px-[10rem]">
    <PhBaseCell class="mb-[16rem] mt-[8rem]" @click="showPopup = true">
      <template #title>
        <span class="font-[700]">{{ selectedFaqTitle }}</span>
      </template>
      <template #right>
        <div>
          <PhBaseArrow direction="right" />
        </div>
      </template>
    </PhBaseCell>
    <div class="bg-[#fff] rounded-[8rem]">
      <PhBaseCell v-for="(item, index) in selectedFaqs" :key="index" @click="item.expand = !item.expand">
        <template #title>
          {{ t(item?.title?.[isValidLang ? getLang() : 'en-US'] || '') }}
        </template>
        <template #right>
          <div>
            <PhBaseArrow :direction="item.expand ? 'bottom' : 'right'" />
          </div>
        </template>
        <div>
          <div class="h-[1rem] mx-[10rem] bg-[#EBEBEB]" />
          <div v-show="item.expand" class="px-[12rem] text-[#6D7693] pb-[12rem] pt-[10rem]">
            <span class="title-text whitespace-pre-line">{{ item?.content?.[isValidLang ? getLang() : 'en-US'] }}</span>
          </div>
        </div>
      </PhBaseCell>
    </div>
    <PhBasePopup v-model="showPopup">
      <template #default="{ close }">
        <div class="bg-[#fff] rounded-tl-[8rem] rounded-tr-[8rem] pb-[8rem]">
          <div class="text-left px-[10rem] relative  pt-[12rem] rounded-tl-[8rem] rounded-tr-[8rem] text-[#0D2245] pb-[10rem] font-semibold">
            {{ isValidLang ? t('请选择') : 'Please select' }}
            <div class="absolute top-[50%] -translate-y-1/2 right-[12rem] cursor-pointer" @click="close">
              <IconPhClose class="text-[12rem] text-[#9DABC8]" />
            </div>
          </div>
          <PhBaseCell v-for="hot in faqCategory" :key="hot.type" arrow @click="chooseType(hot)">
            <template #title>
              {{ t(hot.title[isValidLang ? getLang() : 'en-US'] || '') }}
            </template>
            <div class="h-[1rem] mx-[10rem] bg-[#EBEBEB]" />
          </PhBaseCell>
        </div>
      </template>
    </PhBasePopup>
  </div>
</template>

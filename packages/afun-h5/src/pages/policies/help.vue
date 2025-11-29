<script setup lang='ts'>
import type { EnumLanguageKey } from '@tg/types'
import { AfunBaseArrow, AfunBaseCell, AfunBasePopup } from '@tg/bccomponents'
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
  setTitle(t('帮助'))
})
</script>

<template>
  <div>
    <AfunBaseCell class="mb-[16px]" @click="showPopup = true">
      <template #title>
        <span class="font-[700]">{{ selectedFaqTitle }}</span>
      </template>
      <template #right>
        <div>
          <AfunBaseArrow direction="bottom" />
        </div>
      </template>
    </AfunBaseCell>
    <AfunBaseCell v-for="(item, index) in selectedFaqs" :key="index" class="mb-[8px]" @click="item.expand = !item.expand">
      <template #title>
        {{ t(item?.title?.[isValidLang ? getLang() : 'en-US'] || '') }}
      </template>
      <template #right>
        <div>
          <AfunBaseArrow :direction="item.expand ? 'top' : 'bottom'" />
        </div>
      </template>
      <div>
        <div v-if="item.expand" class="divider1" />
        <div v-show="item.expand" class="px-[12px] text-[#B1BAD3] pb-[12px]">
          <span class="title-text whitespace-pre-line">{{ item?.content?.[isValidLang ? getLang() : 'en-US'] }}</span>
        </div>
      </div>
    </AfunBaseCell>
    <AfunBasePopup v-model="showPopup">
      <template #default="{ close }">
        <div class="bg-[#1A2C38] rounded-tl-[8px] rounded-tr-[8px]">
          <div class="text-left px-[10px] relative  pt-[12px] rounded-tl-[8px] rounded-tr-[8px] text-[#fff] pb-[10px] font-semibold">
            {{ t('请选择') }}
            <div class="absolute top-[50%] -translate-y-1/2 right-[12px] cursor-pointer" @click="close">
              <IconPhClose class="text-[12px] text-[#9dabc8]" />
            </div>
          </div>
          <AfunBaseCell v-for="hot in faqCategory" :key="hot.type" arrow style="--afun-app-cell-background: transparent; box-shadow: none;margin-bottom: 10px;--afun-app-cell-min-height: 40px;--afun-app-cell-padding-x: 22px" @click="chooseType(hot)">
            <template #title>
              <div class="whitespace-pre-line">
                {{ hot.title[isValidLang ? getLang() : 'en-US'] || '' }}
              </div>
            </template>
          </AfunBaseCell>
        </div>
      </template>
    </AfunBasePopup>
  </div>
</template>

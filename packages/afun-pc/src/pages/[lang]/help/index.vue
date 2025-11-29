<script setup lang='ts'>
import type { EnumLanguageKey } from '@tg/types'
import { IconPhClose } from '@tg/icons'
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

usePageTitle({ prefix: 'betmax_casino_online_title',isT:true})
</script>

<template>
  <div class="flex gap-[20px] px-[30vw py-[30px]">
    <BaseMenu v-model="selectedFaqType" :data="faqCategory.map(item => ({title: item.title[isValidLang ? getLang() : 'en-US'], value: item.type, path: ''}))" />
    <div class="flex-1 help">
      <BaseCell v-for="(item, index) in selectedFaqs" :key="index" class="mb-[8px]" @click="item.expand = !item.expand">
        <template #title>
          {{ t(item?.title?.[isValidLang ? getLang() : 'en-US'] || '') }}
        </template>
        <template #right>
          <div>
            <BaseArrow :direction="item.expand ? 'top' : 'bottom'" />
          </div>
        </template>
        <div>
          <div v-if="item.expand" class="divider1" />
          <div v-show="item.expand" class="px-[12px] text-[#B1BAD3] pb-[12px] text-[14px]">
            <span class="title-text whitespace-pre-line">{{ item?.content?.[isValidLang ? getLang() : 'en-US'] }}</span>
          </div>
        </div>
      </BaseCell>
    </div>
  </div>
</template>

<style lang="scss">
.help{
  background-color: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);
  overflow: hidden;
  padding: 10px;
}
</style>
<route lang="yaml">
  meta:
    layout: home
  </route>

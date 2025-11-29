<script setup lang="ts">
import { IconUniArrowDown1 } from '@tg/icons'
import { inject, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

defineOptions({ name: 'PoliciesList' })

const { t } = useI18n()

const setTitle = inject('setTitle', (v: string) => {})

const { push } = useRouter()

const list = [
  { title: t('关于我们'), path: '/about-us' },
  // { title: t('投注站'), path: '/betting-station' },
  { title: t('常见问题'), path: '/faqs' },
  { title: t('负责任博彩'), path: '/responsible-gaming' },
  { title: t('使用条款'), path: '/terms-of-use' },
  { title: t('隐私政策'), path: '/privacy-policy' },
]

function onClickHandler(item: { title: string, path: string }) {
  setTitle(item.title)
  push(`/policies${item.path}`)
}

onMounted(() => {
  setTitle(t('政策'))
})
</script>

<template>
  <div>
    <div
      v-for="item in list" :key="item.path"
      class="w-full flex items-center cursor-pointer justify-between border-b-[1px] border-solid border-[#f5f5f5] h-[50rem] py-[8rem] pr-[8rem] pl-[12rem] font-[500] text-[#0d2245] bg-[#fff]"
      @click="onClickHandler(item)"
    >
      <span class="pl-[8rem]">
        {{ item.title }}
      </span>
      <IconUniArrowDown1 class="rotate-[-90deg] text-[#9dabc9]" />
    </div>
  </div>
</template>

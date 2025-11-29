<script setup lang="ts">
import { AfunBaseCell } from '@tg/bccomponents'
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
  { title: t('帮助'), path: '/help' },
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
  <AfunBaseCell v-for="item in list" :key="item.path" arrow class="mb-[8px]" @click="onClickHandler(item)">
    <template #title>
      <span class="font-[500]">{{ item.title }}</span>
    </template>
  </AfunBaseCell>
</template>

<style lang="scss" scoped>
.item:last-child {
  border: none;
}
</style>

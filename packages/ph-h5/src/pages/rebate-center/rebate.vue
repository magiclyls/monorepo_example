<script setup lang='ts'>
import { useI18n } from 'vue-i18n'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppRebateCenterContent from './AppRebateCenterContent.vue'

defineOptions({ name: 'AppRebateCenterRebate' })

const { t } = useI18n()
</script>

<template>
  <AppPageLayout :title="t('返水中心')">
    <AppRebateCenterContent />
  </AppPageLayout>
</template>

<style lang='scss' scoped></style>

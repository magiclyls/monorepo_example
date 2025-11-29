<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppEmail from '~/components/AppEmail.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'EmailSetting' })
const { t } = useI18n()
</script>

<template>
  <AppPageLayout :title="t('邮箱地址')">
    <AppEmail />
  </AppPageLayout>
</template>

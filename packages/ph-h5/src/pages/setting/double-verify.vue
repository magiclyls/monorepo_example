<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppDoubleVerify from '~/components/AppDoubleVerify.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'DoubleVerify' })
const { t } = useI18n()
</script>

<template>
  <AppPageLayout :title="t('双重验证')">
    <AppDoubleVerify />
  </AppPageLayout>
</template>

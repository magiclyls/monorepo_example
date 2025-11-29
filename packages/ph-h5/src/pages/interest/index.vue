<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppInterest from '~/components/AppInterest.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'Interest' })
const { t } = useI18n()
</script>

<template>
  <AppPageLayout :title="t('利息宝')">
    <AppInterest />
  </AppPageLayout>
</template>

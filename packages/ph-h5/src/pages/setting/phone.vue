<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppPhone from '~/components/AppPhone.vue'

defineOptions({ name: 'PhoneSetting' })
const { t } = useI18n()
</script>

<template>
  <AppPageLayout :title="t('手机号码')">
    <AppPhone />
  </AppPageLayout>
</template>

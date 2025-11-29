<script lang="ts" setup>
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppWalletPassword from '~/components/AppWalletPassword.vue'

defineOptions({ name: 'WalletPasswordSetting' })
const { t } = useI18n()
const { isSetPayPwd } = storeToRefs(useAppStore())
</script>

<template>
  <AppPageLayout :title="isSetPayPwd ? t('修改资金密码') : t('资金密码')">
    <AppWalletPassword />
  </AppPageLayout>
</template>

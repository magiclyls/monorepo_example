<script lang="ts" setup>
import { AfunBaseCell } from '@tg/bccomponents'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'

defineOptions({ name: 'Settings' })

const { t } = useI18n()
const settings = ref([
  { label: t('登入密码'), path: '/login-password' },
  { label: t('资金密码'), path: '/wallet-password' },
  { label: t('双重验证'), path: '/double-verify' },
  { label: t('手机号码'), path: '/phone' },
  { label: t('邮箱地址'), path: '/email' },
  { label: t('社交账号'), path: '/social-media' },
  { label: t('登入日志'), path: '/login-history' },
  { label: t('关闭账户'), path: '/close-account' },
])

const router = useRouter()
</script>

<template>
  <AppPageLayout :title="t('设置')">
    <AfunBaseCell v-for="(set, index) in settings" :key="set.label" class="mb-[8px]" arrow @click="router.push(set.path)">
      <template #title>
        <span class="text-[14px] font-[500]">{{ set.label }}</span>
      </template>
    </AfunBaseCell>
  </AppPageLayout>
</template>

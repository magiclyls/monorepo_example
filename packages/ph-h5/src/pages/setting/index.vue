<script lang="ts" setup>
import { IconArrowRight } from '@tg/icons'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
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
</script>

<template>
  <AppPageLayout :title="t('设置')">
    <div class="px-[12rem] rounded-[8rem] bg-white">
      <div v-for="(set, index) in settings" :key="set.label" class="h-[46rem] text-[14rem] text-[#0D2245] font-[500]  border-b border-b-[#EBEBEB]" :class="[index === settings.length - 1 && 'border-b-[transparent]']">
        <RouterLink :to="set.path" class="w-full h-full flex justify-between items-center">
          <span>{{ set.label }}</span>
          <div class="flex items-center gap-[4rem]">
            {{ set.path === '/login-history' ? t('查看') : t('设置') }}
            <IconArrowRight class="shrink-0 text-[14rem] text-[#9DABC9]" />
          </div>
        </RouterLink>
      </div>
    </div>
  </AppPageLayout>
</template>

<template>
  <div class="space-y-4">

    <!-- 顶部标签 -->
    <div class="flex flex-wrap gap-[12px] mb-[24px]">
      <BaseButton
        v-for="(s, i) in settings"
        :key="s.key"
        :bg-style="'secondary'"
        class="px-4 py-2 rounded-md border transition"
        :style="{
          '--tg-text-green': i === active ? '#24EE89' : '#1A2C38',
          '--tg-text-dark': i === active ? '#000' : '#fff',
          border: 'none',
          '--tg-base-button-style-bg-hover': '#24EE89',
          '--tg-base-button-text-hover-dark': '#000'
        }"
        @click="active = i"
      >
        {{ s.label }}
      </BaseButton>
    </div>

    <!-- 异步渲染所选组件 -->
    <Suspense>
      <component
        @bind="active = 4"
        :is="settings[active].component"
        v-bind="{ type: settings[active].key }"
      />
      <template #fallback>
        <div class="center dialog-loading-height">
          <BaseLoading />
        </div>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { t } = useI18n()

/**
 * 从 pages/[lang]/center/settings/ 下异步加载组件：
 * - 登录密码：security-login-pwd.vue
 * - 资金密码：security-safe-pwd.vue
 * - 双重验证：security-safe-check.vue
 * - 手机号码：security-extend.vue
 * - 邮箱地址：verify.vue
 * - 社交账号：security.vue
 * - 登录日志：sessions.vue
 */
const settings = ref([
  {
    key: 'login_pwd',
    label: t('login_pwd'),
    component: defineAsyncComponent(() => import('../settings/security-login-pwd.vue')),
  },
  {
    key: 'fund_pwd',
    label: t('menu_title_settings_update_safepwd'),
    component: defineAsyncComponent(() => import('../settings/security-safe-pwd.vue')),
  },
  {
    key: 'two_factor',
    label: t('two_step_verification'),
    component: defineAsyncComponent(() => import('../settings/security-safe-check.vue')),
  },
  {
    key: 'phone',
    label: t('phone'),
    component: defineAsyncComponent(() => import('../settings/general.vue')),
  },
  {
    key: 'email',
    label: t('email_address'),
    component: defineAsyncComponent(() => import('../settings/general.vue')),
  },
  {
    key: 'social',
    label: t('social_account'),
    component: defineAsyncComponent(() => import('../settings/general.vue')),
  },
  {
    key: 'login_log',
    label: t('login_log'),
    component: defineAsyncComponent(() => import('../settings/sessions.vue')),
  },
  {
    key: 'close_account',
    label: t('menu_title_settings_delete_account'),
    component: defineAsyncComponent(() => import('../settings/security-delete-account.vue')),
  },
])

// 默认选中第一个
const active = ref(0)
</script>

<route lang="yaml">
meta:
  layout: center
</route>

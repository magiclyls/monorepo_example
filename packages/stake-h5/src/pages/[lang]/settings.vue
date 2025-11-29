<script lang="ts">
export default {
  beforeRouteEnter(to: any) {
    const site = import.meta.env.VITE_SITE_NAME
    const menu = to.meta?.withMenuMenu
    if (Array.isArray(menu)) {
      to.meta.withMenuMenu = menu.filter((i: any) => !i.hideOnSite || !i.hideOnSite.includes(site))
    }
  },
}
</script>

<script lang="ts" setup>
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
usePageTitle({ prefix: 'setting', isT: true })

// 兜底：进来后再改一遍（热更新/返回本页）
const route = useRoute()
function patch(meta: any) {
  const site = import.meta.env.VITE_SITE_NAME
  if (Array.isArray(meta?.withMenuMenu)) {
    meta.withMenuMenu = meta.withMenuMenu.filter((i: any) => !i.hideOnSite || !i.hideOnSite.includes(site))
  }
}
patch(route.meta)
onBeforeRouteUpdate((to) => patch(to.meta))
</script>


<template>
  <Suspense timeout="0">
    <RouterView />
    <template #fallback>
      <div class="center dialog-loading-height">
        <BaseLoading />
      </div>
    </template>
  </Suspense>
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  layout: with-menu
  withMenuTitle: setting
  withMenuIcon: IconUniSet
  withMenuMenu:
    - title: menu_title_settings_contact
      path: /settings/general
      isT: true
    - title: menu_title_settings_update_loginpwd
      path: /settings/security-login-pwd
      isT: true
    - title: menu_title_settings_update_safecheck
      path: /settings/security-safe-check
      isT: true
    - title: menu_title_settings_extend
      path: /settings/security-extend
      isT: true
      hideOnSite: [x02]
    # - title: menu_title_settings_update_safepwd
    #   path: /settings/security-safe-pwd
    #   isT: true
    # - title: menu_title_settings_private
    #   path: /settings/preferences
    #   isT: true
    # - {title: menu_title_settings_api, path: /settings/api}
    - title: menu_title_settings_loginsession
      path: /settings/sessions
      isT: true
    # - title: menu_title_settings_ignoredusers
    #   path: /settings/ignored-users
    #   isT: true
    # - {title: menu_title_settings_verify, path: /settings/verify}
    # - {title: menu_title_settings_offers,path: /settings/offers}
    - title: menu_title_settings_KYC
      path: /settings/kyc
      isT: true
    - title: menu_title_settings_delete_account
      path: /settings/security-delete-account
      isT: true
</route>

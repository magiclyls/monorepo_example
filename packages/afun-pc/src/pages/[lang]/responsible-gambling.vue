<script lang="ts" setup>
import { IconSptSecure } from '@tg/icons'
usePageTitle({ prefix: 'responsible_casino', isT: true })
</script>

<template>
  <RouterView />
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  layout: with-menu
  withMenuTitle: responsible_casino
  withMenuIcon: IconSptSecure
  withMenuMobileType: tabs
  withMenuMenu:
    - title: stake_safety
      path: /responsible-gambling/safe
      token: false
      isT: false
  </route>

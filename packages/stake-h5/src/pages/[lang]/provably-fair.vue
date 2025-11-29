<script lang="ts" setup>
import { IconUniScales } from '@tg/icons'
usePageTitle({ prefix: 'provable_fairness', isT: true })
</script>

<template>
  <RouterView />
</template>

<style lang="scss" scoped></style>

<route lang="yaml">
meta:
  layout: with-menu
  withMenuTitle: provable_fair
  withMenuIcon: IconUniScales
  withMenuMobileType: tabs
  withMenuMenu:
    - title: provably_fair_overview
      path: /provably-fair/overview
      token: false
      isT: true
    - title: provably_fair_implementation
      path: /provably-fair/implementation
      token: false
      isT: true
    - title: provably_fair_conversions
      path: /provably-fair/conversions
      token: false
      isT: true
    - title: provably_fair_game_events
      path: /provably-fair/game-events
      token: false
      isT: true
    - title: provably_fair_server_seed_unhash
      path: /provably-fair/server-seed-unhash
      token: false
      isT: true
    - title: provably_fair_calculation
      path: /provably-fair/calculation
      token: false
      isT: true
  </route>

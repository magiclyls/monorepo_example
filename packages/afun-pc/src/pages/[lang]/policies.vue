<script lang="ts" setup>
import { IconUniPolicies } from '@tg/icons'
usePageTitle({ prefix: 'Policies', isT: true })
</script>

<template>
  <RouterView />
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  layout: with-menu
  withMenuTitle: policies
  withMenuIcon: IconUniPolicies
  withMenuMenu:
    - {title: about_us, path: /policies/about-us, token: false, isT: true}
    - {title: footer_terms_of_service, path: /policies/terms, token: false, isT: true}
    - {title: wager_requirements, path: /policies/wager-requirements, token: false, isT: true}
    - {title: anti_money_laundering_rule, path: /policies/anti-money-laundering, token: false, isT: true}
    - {title: privacy, path: /policies/privacy, token: false, isT: true}
    - {title: coin_mixing, path: /policies/coin-mixing, token: false, isT: true}
    - {title: h5_pop_up_menu_meibo_exclusives_casino_game_provider, path: /policies/providers, token: false, isT: true}
    - {title: 一般规则, path: /policies/rules, token: false, isT: true}
    - {title: sportsbook, path: /policies/spt-book, token: false, isT: true}
    - {title: cookie_policy, path: /policies/cookies, token: false, isT: true}
    # - {title: Self-Exclusion, path: /policies/self-exclusion, token: false}
</route>

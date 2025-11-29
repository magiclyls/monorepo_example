<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

usePageTitle({
  prefix: 'BlackJack',
})
</script>

<template>
  <AppMiniGamePublicWrap :game="GAMES_LIST_ENUM.BLACKJACK">
    <AppMiniGameMainBlackJack />
  </AppMiniGamePublicWrap>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: home
</route>

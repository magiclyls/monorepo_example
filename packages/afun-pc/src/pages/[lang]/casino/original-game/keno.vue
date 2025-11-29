<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

usePageTitle({
  prefix: 'Heno',
})
</script>

<template>
  <AppMiniGamePublicWrap :game="GAMES_LIST_ENUM.KENO">
    <AppMiniGameMainKeno />
  </AppMiniGamePublicWrap>
</template>

<style lang='scss' scoped></style>

<route lang="yaml">
meta:
  layout: home
</route>

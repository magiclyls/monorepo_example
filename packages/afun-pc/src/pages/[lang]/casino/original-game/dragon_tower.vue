<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

usePageTitle({
  prefix: 'DragonTower',
})
</script>

<template>
  <AppMiniGamePublicWrap :game="GAMES_LIST_ENUM.DRAGONTOWER">
    <AppMiniGameMainDragonTower />
  </AppMiniGamePublicWrap>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: home
</route>

<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'
</script>

<template>
  <AppMiniGamePublicWrap :game="GAMES_LIST_ENUM.DICE">
    <AppMiniGameMainDice />
  </AppMiniGamePublicWrap>
</template>

<style lang='scss' scoped>

</style>

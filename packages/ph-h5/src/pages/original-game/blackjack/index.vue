<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniBlackJackDice from './AppMiniBlackJackDice.vue'

defineOptions({ name: 'OriginalGameDice' })
</script>

<template>
  <AppMiniGameLoading>
    <AppMiniBlackJackDice />
  </AppMiniGameLoading>
</template>

<style lang='scss' scoped>

</style>

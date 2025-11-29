<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainDice from './AppMiniGameMainDice.vue'

defineOptions({ name: 'OriginalGameDice' })
</script>

<template>
  <AppMiniGameLoading>
    <AppMiniGameMainDice />
  </AppMiniGameLoading>
</template>

<style lang='scss' scoped>

</style>

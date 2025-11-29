<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainDice from './AppMiniGameMainDice.vue'

defineOptions({ name: 'OriginalGameDice' })
</script>

<template>
  <div>
    <AppMiniGameLoading>
      <AppMiniGameMainDice />
    </AppMiniGameLoading>
  </div>
</template>

<style lang='scss' scoped>

</style>

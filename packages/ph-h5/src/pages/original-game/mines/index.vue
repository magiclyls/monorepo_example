<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainMines from './AppMiniGameMainMines.vue'

defineOptions({ name: 'OriginalGameMines' })
</script>

<template>
  <AppMiniGameLoading>
    <AppMiniGameMainMines />
  </AppMiniGameLoading>
</template>

<style lang='scss' scoped>

</style>

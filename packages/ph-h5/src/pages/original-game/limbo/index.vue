<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainLimbo from './AppMiniGameMainLimbo.vue'

defineOptions({ name: 'OriginalGameLimbo' })
</script>

<template>
  <AppMiniGameLoading>
    <AppMiniGameMainLimbo />
  </AppMiniGameLoading>
</template>

<style lang='scss' scoped>

</style>

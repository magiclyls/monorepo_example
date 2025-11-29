<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainKeno from './AppMiniGameMainKeno.vue'

defineOptions({ name: 'OriginalGameKeno' })
</script>

<template>
  <AppMiniGameLoading>
    <AppMiniGameMainKeno />
  </AppMiniGameLoading>
</template>

<style lang='scss' scoped>

</style>

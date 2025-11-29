<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainCrash from './AppMiniGameMainCrash.vue'

defineOptions({ name: 'OriginalGameCrash' })
</script>

<template>
  <AppMiniGameLoading>
    <AppMiniGameMainCrash />
  </AppMiniGameLoading>
</template>

<style lang='scss' scoped>

</style>

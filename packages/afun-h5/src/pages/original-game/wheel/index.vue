<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainWheel from './AppMiniGameMainWheel.vue'

defineOptions({ name: 'OriginalGameWheel' })
</script>

<template>
  <div>
    <AppMiniGameLoading>
      <AppMiniGameMainWheel />
    </AppMiniGameLoading>
  </div>
</template>

<style lang='scss' scoped>

</style>

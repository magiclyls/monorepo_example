<script setup lang='ts'>
import AppMiniGameLoading from '../_components/AppMiniGameLoading.vue'
import AppMiniGameMainHilo from './AppMiniGameMainHilo.vue'

defineOptions({
  name: 'AppMiniGameMainHilo',
})
</script>

<template>
  <div>
    <AppMiniGameLoading>
      <AppMiniGameMainHilo />
    </AppMiniGameLoading>
  </div>
</template>

<style lang='scss' scoped>

</style>

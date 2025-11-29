<script setup lang='ts'>
// 123
const appStore = useAppStore()

usePageTitle({
  prefix: 'Plinko',
})

onUnmounted(() => {
  appStore.setGameStartBool(false)
})
</script>

<template>
  <AppMiniGameMainPlinko />
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: wujielay
</route>

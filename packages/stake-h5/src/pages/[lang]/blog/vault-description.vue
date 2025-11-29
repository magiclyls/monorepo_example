<script setup lang='ts'>
const windowStore = useWindowStore()

onMounted(() => {
  windowStore.isInterestTreasure = true
})

onActivated(() => {
  windowStore.isInterestTreasure = true
})

onDeactivated(() => {
  windowStore.isInterestTreasure = false
})
onUnmounted(() => {
  windowStore.isInterestTreasure = false
})
</script>

<template>
  <AppVaultDescription />
</template>

<style lang='scss' scoped>
</style>

<route lang="yaml">
name: vault-desc
meta:
  layout: home
  auth: true
  showHomeHeader: true
  homeHeaderBack: true
  </route>

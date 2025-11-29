<script setup lang='ts'>
defineOptions({
  name: 'KeepAliveCasino',
})
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
</script>

<template>
  <!-- 默认黑色 -->
  <AppHomeStake />
  <template v-if="!isAdmin() && !isFlutterApp()">
    <AppReloadDialog v-if="isLogin" />
    <AppReloadNotLoginDialog v-else />
  </template>
<!--  <AppMysteriousDialog type="home" /> -->
</template>

<style lang='scss' scoped>
</style>

<route lang="yaml">
name: casino-home
meta:
  layout: home
  showHomeHeader: true
  homeHeaderBack: false
  needScrollingXHidden: true
  depth: 0
</route>

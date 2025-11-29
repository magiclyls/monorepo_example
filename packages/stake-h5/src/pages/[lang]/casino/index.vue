<script setup lang='ts'>
defineOptions({
  name: 'KeepAliveCasino',
})
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
</script>

<template>
  <!-- 默认黑色 -->
  <AppHomeStake v-if="globalInitMap.currentTemplate === 1 || globalInitMap.currentTemplate === 6 || globalInitMap.currentTemplate === 2 " />
  <!-- 新黑色  -->
  <!-- <AppHomeNewStake v-if="globalInitMap.currentTemplate === 6" /> -->
  <AppHomeBcGame v-if="globalInitMap.currentTemplate === 3" />
  <!-- 白色 -->
  <AppHome4 v-if="globalInitMap.currentTemplate === 4" />
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

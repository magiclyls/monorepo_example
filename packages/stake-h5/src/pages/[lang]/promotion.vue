<script lang="ts" setup>
defineOptions({
  name: 'KeepAlivePromotionList',
})

usePageTitle({ prefix: 'promo_activity', isT: true })

onBeforeRouteLeave(() => {
  window.saveScrollPositionHeight = document.documentElement.scrollTop || document.body.scrollTop || document.getElementById('tgOuterWrapMain')?.scrollTop
})
</script>

<template>
  <AppPromotionWarp category="0" />
</template>

<style lang="scss" scoped></style>

<route lang="yaml">
meta:
  layout: home
  saveScrollPosition: true
  showHomeHeader: true
  homeHeaderBack: true
</route>

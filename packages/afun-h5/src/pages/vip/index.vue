<script setup lang='ts'>
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppVipContent from './AppVipContent.vue'

defineOptions({ name: 'AppVip' })
</script>

<template>
  <AppPageLayout title="VIP">
    <AppVipContent />
  </AppPageLayout>
</template>

<style lang='scss' scoped>

</style>

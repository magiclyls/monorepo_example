<script setup lang='ts'>
defineOptions({
  name: 'AppDialogRegisterCenterV1',
})

const { isMobile } = storeToRefs(useWindowStore())
const { theme } = storeToRefs(useAppStore())

/**
 * 要改应用模板需要同时改useDialogRegister.ts AppReloadNotLoginDialog.vue
 */
const isFullScreenRegister = computed(() => ['white', 'green'].includes(theme.value))
</script>

<template>
  <AppDialogRegisterFullScreenWithBannerV1 v-if="isMobile || isFullScreenRegister" />
  <AppDialogRegisterV3 v-else />
  <!-- <AppNewRegisterPcOnly /> -->
</template>

<style lang='scss' scoped>
</style>

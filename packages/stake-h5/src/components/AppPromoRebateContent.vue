<script lang="ts" setup>
provide('isInPromoRebate', true)
provide('isInPromoVip', false)

const { bool: isListMounted, setBool: setListMountedBool } = useBoolean(false)

onMounted(() => {
  setTimeout(() => {
    setListMountedBool(true)
  }, 600)
})
</script>

<template>
  <AppLoading v-if="!isListMounted" full-screen />
  <div v-show="isListMounted" class="pb-[16px]">
    <div class="my-[16px]">
      <AppVipInfoBar2 />
    </div>
    <AppVipContent />
  </div>
</template>

<style lang="scss" scoped>
</style>

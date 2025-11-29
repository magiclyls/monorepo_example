<script lang="ts" setup>
const url = Local.get<string | undefined>(STORAGE_FIAT_CURRENCY_DEPOSIT_URL)?.value
Local.remove(STORAGE_FIAT_CURRENCY_DEPOSIT_URL)
</script>

<template>
  <div class="h-[100vh] w-[100%] bg-[#fff]">
    <iframe :src="url" frameborder="0" width="100%" height="100%" />
  </div>
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
</route>

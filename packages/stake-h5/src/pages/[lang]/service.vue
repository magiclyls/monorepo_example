<script setup lang='ts'>
const show = ref(true)
</script>

<template>
  <div class="w-full">
    <AppService v-model="show" />
  </div>
</template>

<style lang='scss' scoped></style>

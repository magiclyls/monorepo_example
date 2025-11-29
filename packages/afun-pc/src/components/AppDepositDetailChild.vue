<script setup lang="ts">
defineOptions({
  name: 'AppDepositDetailChild',
})
const customRouter = useCustomRouter()
</script>

<template>
  <div class="bg-amber-700 p-[10px]">
    <div class="text-white">
      第三页:
      <br>
      <p>详情</p>
    </div>
    <p @click="customRouter.back()">
      返回
    </p>
  </div>
</template>

<style lang="scss" scoped>
</style>

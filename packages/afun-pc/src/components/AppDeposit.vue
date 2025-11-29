<script setup lang="ts">
defineOptions({
  name: 'AppDeposit',
})
const customRouter = useCustomRouter()
</script>

<template>
  <div class="text-tg-text-white bg-red-500 p-[10px]">
    <h1>第一页</h1>
    <p @click="customRouter.push('/detail', { id: '1' })">
      存款列表1
    </p>
    <p @click="customRouter.push('/detail', { id: 444 })">
      存款列表2
    </p>
  </div>
</template>

<style lang="scss" scoped>
</style>

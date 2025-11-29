<script setup lang="ts">
defineOptions({
  name: 'AppDepositDetail',
})
const aaa = ref()
const customRouter = useCustomRouter()
</script>

<template>
  <div class="text-tg-text-white bg-green-500 p-[10px]">
    <input v-model="aaa" type="text" class="text-black">
    <br>
    第二页
    <br>
    第一页列表传来的参数： {{ customRouter.query }}
    <br>
    <button @click="customRouter.push('/child')">
      跳转到第三页
    </button>
    <p @click="customRouter.back()">
      返回
    </p>
  </div>
</template>

<style lang="scss" scoped>
</style>

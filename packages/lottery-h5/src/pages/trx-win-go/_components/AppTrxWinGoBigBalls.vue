<script setup lang="ts">
defineProps<{
  value: string
  isYellow: boolean
}>()

// 公共渐变色定义
const gradients = {
  red: 'linear-gradient(180deg, #FB706A 3.13%, #E93333 95%)',
  yellow: 'linear-gradient(180deg, #FFC807 2.5%, #E07101 95%)',
}
</script>

<template>
  <div v-bg-image="'/lottery/png/trx-win-go-big-ball.png'" class="trx-win-go-big-ball-bg">
    <div
      class="font-[700] flex justify-center w-[55rem] h-[55rem] text-[26rem] items-center"
      :style="{
        background: isYellow ? gradients.yellow : gradients.red,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }"
    >
      {{ value }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.trx-win-go-big-ball-bg {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: 50%;
}
</style>

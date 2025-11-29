<script setup lang="ts" name="LotteryCountDownMask">
interface Props {
  time: number
}
const props = defineProps<Props>()
</script>

<template>
  <div class="count-down absolute top-0 left-0 size-full bg-[rgba(0,0,0,.6)] rounded-[8rem] text-white font-[700] text-[140rem] center">
    <div class="num mr-[30rem]">
      0
    </div>
    <div class="num">
      {{ time }}
    </div>
  </div>
</template>

<script setup lang="ts" name="AppColorfulSmallBalls">
import { computed } from 'vue'

interface Props {
  number: number
}
const props = defineProps<Props>()

const colorName = computed(() => {
  const num = Number(props.number)
  if (num === 0 || num === 5)
    return 'double'
  else if (num % 2 === 0)
    return 'red'
  else
    return 'green'
})
</script>

<template>
  <div>
    <template v-if="colorName !== 'double'">
      <div class="size-[10rem] rounded-[100rem]" :class="colorName" />
    </template>
    <div v-else class="center">
      <div class="size-[10rem] rounded-[100rem] red mr-[10rem]" />
      <div class="size-[10rem] rounded-[100rem] purple" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.green {
  background-color: #47ba7c;
}
.red {
  background-color: #fd565c;
}
.purple {
  background-color: #ec4cdf;
}
</style>

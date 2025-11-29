<script setup lang="ts" name="AppColorfulNumbers">
import { computed } from 'vue'

interface Props {
  number: number
}
const props = defineProps<Props>()

const colorName = computed(() => {
  const num = props.number
  if (num === 0 || num === 5)
    return 'double'
  else if (num % 2 === 0)
    return 'red'
  else
    return 'green'
})
</script>

<template>
  <div class="text-[25rem] font-[700]" :class="colorName">
    {{ number }}
  </div>
</template>

<style scoped lang="scss">
.green {
  color: #40ad72;
}
.red {
  color: #fd565c;
}
.double {
  background: linear-gradient(180deg, #fd565c 50.96%, #b659fe 50.97%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>

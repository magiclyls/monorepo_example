<script setup lang="ts" name="AppWinGoResAnimal">
import { LotteryColorfulBalls } from '@tg/bccomponents'
import { ref } from 'vue'

interface Props {
  target: number | string
  type?: 'infinite' | 'forwards'
}
const props = withDefaults(defineProps<Props>(), {
  type: 'forwards',
})
const emits = defineEmits(['end'])
const container = ref<HTMLElement | null>(null)
function endAnimation() {
  emits('end')
}
// watch(() => props.target, (newVal, oldVal) => {
//   count.value++
//   console.log('[AppWinGoResAnimal] watch triggered:', oldVal, '→', newVal)
//   if (!container.value)
//     return
//   container.value.style.setProperty('--y-to', `-${props.target}0%`)
//   container.value.style.setProperty('--animal-type', props.type)
//   container.value.style.setProperty('--animal-duration', props.type === 'infinite' ? '1s' : '0.5s')
// })
</script>

<template>
  <div ref="container" class="balls-animal" @animationend="endAnimation">
    <template v-for="_, index in 10" :key="index">
      <LotteryColorfulBalls :number="index" class="w-[25rem]" />
    </template>
  </div>
</template>

<style scoped lang="scss">
.balls-animal {
  --y-to: -0%;
  --animal-type: forwards;
  --animal-duration: 1s;
  animation: inOut var(--animal-duration) linear var(--animal-type);
  will-change: transform;
}
@keyframes inOut {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(var(--y-to));
  }
}
</style>

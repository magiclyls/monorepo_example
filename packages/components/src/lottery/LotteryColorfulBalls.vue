<script setup lang="ts" name="LotteryColorfulBalls">
import { computed } from 'vue'
import LotteryImage from './LotteryImage.vue'

interface Props {
  number: number
  type?: 'win-go' | 'race' | 'race-sec' | 'k3'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'win-go',
})

const url = computed(() => {
  if (props.type === 'win-go')
    return `/lottery/png/ball-${props.number}.png`
  if (props.type === 'race')
    return `/lottery/png/race-ball-${props.number}.png`
  if (props.type === 'race-sec')
    return `/lottery/png/race-sec-ball-${props.number}.png`
})
</script>

<template>
  <LotteryImage :url="url" />
</template>

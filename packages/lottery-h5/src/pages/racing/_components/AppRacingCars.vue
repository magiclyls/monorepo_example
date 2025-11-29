<script lang="ts" setup name="AppRaceCars">
import { LotteryImage } from '@tg/bccomponents'
import { computed } from 'vue'

interface Props {
  number: number
  type?: 'race' | 'win'
}
const props = withDefaults(defineProps<Props>(), {
  type: 'race',
})

const url = computed(() => {
  if (props.type === 'win') {
    return `/lottery/png/race-win-car-${props.number}.png`
  }
  return `/lottery/png/car-${props.number}.png`
})
</script>

<template>
  <div>
    <LotteryImage :url="url" alt="" />
  </div>
</template>

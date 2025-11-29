<script lang="ts" setup>
import { IconLoginFlagArrow } from '@tg/icons'
import { computed } from 'vue'

interface Props {
  direction?: 'left' | 'right' | 'top' | 'bottom'
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'right',
})

const arrowClass = computed(() => {
  switch (props.direction) {
    case 'left':
      return 'rotate-90'
    case 'top':
      return 'rotate-180' // 等价于 -90deg
    case 'bottom':
      return 'rotate-0'
    case 'right':
    default:
      return '-rotate-90'
  }
})
</script>

<template>
  <div class="w-[12rem] h-[12rem] rounded-full center arrow text-[#9DABC8]">
    <IconLoginFlagArrow :class="arrowClass" class="transition-transform duration-300 ease-in-out" />
  </div>
</template>

<style>
:root {
  --ph-base-arrow-font-size: 12rem;
}
</style>

<style scoped>
.arrow {
  font-size: var(--ph-base-arrow-font-size);
}
</style>

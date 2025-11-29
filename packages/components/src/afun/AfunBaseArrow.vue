<script lang="ts" setup>
import { IconUniArrowRight } from '@tg/icons'
import { computed } from 'vue'

interface Props {
  direction?: 'left' | 'right' | 'top' | 'bottom'
  shadow?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  direction: 'right',
  shadow: true,
})

const arrowClass = computed(() => {
  switch (props.direction) {
    case 'left':
      return 'rotate-180'
    case 'top':
      return 'rotate-270' // 等价于 -90deg
    case 'bottom':
      return 'rotate-90'
    case 'right':
    default:
      return 'rotate-0'
  }
})
</script>

<template>
  <div class="w-[20px] h-[20px] rounded-full center arrow" :class="[shadow && 'bg-[#2F4553']">
    <IconUniArrowRight :class="arrowClass" class="transition-transform duration-300 ease-in-out" />
  </div>
</template>

<style>
:root {
  --afun-base-arrow-font-size: 16px;
}
</style>

<style scoped>
.arrow {
  font-size: var(--afun-base-arrow-font-size);
}
</style>

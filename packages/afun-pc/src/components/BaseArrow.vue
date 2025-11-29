<script lang="ts" setup>
import { IconUniArrowRight } from '@tg/icons'
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
  <div class="w-[20px] h-[20px] bg-[#2F4553] rounded-full center arrow">
    <IconUniArrowRight :class="arrowClass" class="transition-transform duration-300 ease-in-out" />
  </div>
</template>

<style>
:root {
  --base-arrow-font-size: 16px;
}
</style>

<style scoped>
.arrow {
  font-size: var(--base-arrow-font-size);
}
</style>

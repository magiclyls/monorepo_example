<script setup lang='ts'>
import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

defineOptions({ name: 'BaseSportsScrollbar' })

const emit = defineEmits(['scroll'])

function onScroll(e: Event) {
  emit('scroll', e)
}
</script>

<template>
  <simplebar @scroll="onScroll">
    <slot />
  </simplebar>
</template>

<style lang='scss'>
/* 滚动条配置 */
.simplebar-track.simplebar-vertical {
  width: 8px;
}
</style>

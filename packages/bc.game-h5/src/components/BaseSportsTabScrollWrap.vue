<script setup lang='ts'>
import { useScroll } from '@vueuse/core'
import { computed, toRefs, useTemplateRef } from 'vue'

defineOptions({ name: 'BaseSportsTabScrollWrap' })

const tabWrapperRef = useTemplateRef<HTMLElement>('tabWrapperRef')
const { arrivedState } = useScroll(tabWrapperRef, { behavior: 'smooth' })

const { left: isArrivedLeft, right: isArrivedRight } = toRefs(arrivedState)

const hasScroll = computed(() => {
  const el = tabWrapperRef.value
  if (!el)
    return false

  return el.scrollWidth > el.clientWidth
})
</script>

<template>
  <div class="h-[32px] w-full overflow-hidden relative">
    <div ref="tabWrapperRef" class="w-full overflow-x-auto overflow-y-hidden pb-[50px]">
      <slot />
    </div>
    <div v-show="!isArrivedLeft && hasScroll" class="mask-left" />
    <div v-show="!isArrivedRight && hasScroll" class="mask-right" />
  </div>
</template>

<style lang='scss' scoped>
.mask-left {
  z-index: 3;
  pointer-events: none;
  position: absolute;
  inset: 0px auto auto 0px;
  width: 40px;
  height: 100%;
  background: linear-gradient(to right, rgb(35, 38, 38), rgba(35, 38, 38, 0));
}

.mask-right {
  z-index: 3;
  pointer-events: none;
  position: absolute;
  inset: 0px 0px auto auto;
  width: 40px;
  height: 100%;
  background: linear-gradient(to left, rgb(35, 38, 38), rgba(35, 38, 38, 0));
}
</style>

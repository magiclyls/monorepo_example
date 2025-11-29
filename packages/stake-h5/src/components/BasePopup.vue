<script setup lang='ts'>
defineOptions({
  name: 'BasePopup',
})
const emit = defineEmits(['close'])
const { theme } = storeToRefs(useAppStore())
const { isMobile, bodyWidth } = storeToRefs(useWindowStore())
const { bool: isShow } = useBoolean(false)

// 加了皮肤之后的mask宽度
const _width = computed(() => {
  if (theme.value === '')
    return '100%'
  return `${bodyWidth.value}px`
})

function onCloseClick() {
  isShow.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

provide('onCloseClick', onCloseClick)

onMounted(() => {
  isShow.value = true
})
</script>

<template>
  <div
    class="fixed top-0 z-20 h-full flex items-end justify-center bg-[#0e1224b3] @md:z-[1001]"
    :style="[isMobile ? 'padding-bottom: var(--tg-footerbar-height);' : '', { width: _width }]"
    @click.stop="onCloseClick"
  >
    <Transition>
      <div v-show="isShow" class="relative w-full">
        <Suspense timeout="0">
          <slot />
          <template #fallback>
            <AppLoading />
          </template>
        </Suspense>
      </div>
    </Transition>
  </div>
</template>

<style lang='scss' scoped>
.v-enter-active,
.v-leave-active {
  transition: all .3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

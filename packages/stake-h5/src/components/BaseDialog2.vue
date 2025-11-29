<script lang="ts" setup>
import gsap from 'gsap'

defineOptions({
  name: 'BaseDialog2',
})
const dialogContainer = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.to(dialogContainer.value, {
    opacity: 1,
    marginTop: 0,
    duration: 0.3,
  })
})
</script>

<template>
  <div ref="dialogContainer" class="mt-[20px] bg-white opacity-0">
    <slot />
  </div>
</template>

<style scoped lang="scss">
</style>

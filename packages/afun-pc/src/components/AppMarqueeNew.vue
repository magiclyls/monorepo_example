<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

// Refs
const marqueeContainer = ref<HTMLElement | null>(null)
const marqueeContent = ref<HTMLElement | null>(null)
const offset = ref(0)
const speed = ref(1.3) // Scrolling speed (distance per frame)
const transitioning = ref(true)

let animationFrame: number | null = null
let contentWidth = 0
let lastTime = 0

function animate(time: number) {
  if (lastTime) {
    // 计算从上一次帧到这一次的时间差
    const deltaTime = time - lastTime

    // 根据固定的速度来更新 offset
    offset.value -= speed.value * deltaTime / 16.6667 // 16.6667 ms 是 60 FPS 时的每帧时间

    // 确保内容无限循环
    if (Math.abs(offset.value) >= contentWidth)
      offset.value = 0
  }

  lastTime = time
  animationFrame = requestAnimationFrame(animate)
}

function resume() {
  if (animationFrame === null)
    animationFrame = requestAnimationFrame(animate)
}

// Set content width and start the animation
onMounted(() => {
  nextTick(() => {
    if (marqueeContent.value) {
      contentWidth = marqueeContent.value.scrollWidth / 2 // The content's width is used to determine scroll
      resume()
    }
  })
})

// Clean up the animation when component unmounts
onUnmounted(() => {
  if (animationFrame !== null)
    cancelAnimationFrame(animationFrame)
})
</script>

<template>
  <div ref="marqueeContainer" class="marquee-container">
    <div
      ref="marqueeContent"
      class="marquee-content"
      :style="{ transform: `translateX(${offset}px)`, transition: transitioning ? 'transform 0s linear' : 'none' }"
    >
      <slot />
      <slot /> <!-- Duplicate content for seamless scrolling -->
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  height: 100%;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
}

.marquee-content {
  display: flex;
  white-space: nowrap;
  will-change: transform;
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'ChatDateTag',
})
defineProps<{
  date: string
  shouldHide?: boolean
}>()

const dateTagRef = ref<HTMLDivElement | null>(null)
const isSticky = ref(false)
const hideDueToIdle = ref(false)
let idleTimer: number | null = null

onMounted(() => {
  if (!dateTagRef.value)
    return

  // 找到滾動容器
  const scrollContainer = dateTagRef.value.closest('.chat-message') as HTMLElement
  if (!scrollContainer)
    return

  // 使用 IntersectionObserver 檢測元素位置
  const observer = new IntersectionObserver(
    ([entry]) => {
      const rect = entry.boundingClientRect
      const containerRect = scrollContainer.getBoundingClientRect()

      // 檢查元素是否黏在容器頂部
      // 如果元素的 top 等於容器的 top (考慮 padding),表示在 sticky 狀態
      const isAtTop = Math.abs(rect.top - containerRect.top) < 1

      // 如果元素完全在視窗內且在頂部,就是 sticky
      isSticky.value = entry.isIntersecting && isAtTop
      if (isSticky.value)
        scheduleIdleHide()
    },
    {
      root: scrollContainer,
      threshold: [0, 0.1, 0.5, 1], // 多個閾值確保觸發
      rootMargin: '0px',
    },
  )

  observer.observe(dateTagRef.value)

  // 額外監聽滾動事件來更新狀態
  const handleScroll = () => {
    if (!dateTagRef.value)
      return

    hideDueToIdle.value = false
    clearIdleTimer()

    const rect = dateTagRef.value.getBoundingClientRect()
    const containerRect = scrollContainer.getBoundingClientRect()

    // 元素在容器頂部 (考慮 padding 12px)
    const isAtTop = rect.top <= containerRect.top + 12 && rect.top >= containerRect.top

    isSticky.value = isAtTop

    if (isSticky.value)
      scheduleIdleHide()
  }

  scrollContainer.addEventListener('scroll', handleScroll, { passive: true })

  // 初始檢查
  handleScroll()

  onUnmounted(() => {
    observer.disconnect()
    scrollContainer.removeEventListener('scroll', handleScroll)
    clearIdleTimer()
  })
})

function scheduleIdleHide() {
  clearIdleTimer()
  idleTimer = window.setTimeout(() => {
    if (isSticky.value)
      hideDueToIdle.value = true
  }, 2000)
}

function clearIdleTimer() {
  if (idleTimer) {
    clearTimeout(idleTimer)
    idleTimer = null
  }
}
</script>

<template>
  <div
    ref="dateTagRef"
    class="chat-date-tag"
    :class="{ 'is-hidden': shouldHide || (hideDueToIdle && isSticky) }"
  >
    {{ date }}
  </div>
</template>

<style scoped lang="scss">
.chat-date-tag {
  position: sticky;
  top: 0px;
  align-self: center;
  padding: 6px 16px;
  border-radius: 20px;
  background: rgba(33, 55, 67, 0.85);
  color: #e8faff;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  z-index: 10;
  backdrop-filter: blur(6px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &.is-hidden {
    opacity: 0;
  }
}
</style>

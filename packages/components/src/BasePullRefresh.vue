<script setup lang="ts">
import { usePopupEleScroll } from '@tg/hooks'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

defineOptions({
  name: 'BasePullRefresh',
})
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  pullDistance: 120,
  maxPullDistance: 150,
  loading: false,
  pullText: '',
  releaseText: '',
  refreshingText: '',
})
const emit = defineEmits<{
  (event: 'refresh'): void
  (event: 'update:loading', value: boolean): void
}>()

interface Props {
  /** 是否禁用下拉刷新 */
  disabled?: boolean
  /** 触发刷新的下拉距离阈值（px） */
  pullDistance?: number
  /** 最大下拉距离（px） */
  maxPullDistance?: number
  /** 是否正在刷新 */
  loading?: boolean
  /** 下拉提示文本 */
  pullText?: string
  /** 释放刷新提示文本 */
  releaseText?: string
  /** 刷新中提示文本 */
  refreshingText?: string
}

const containerRef = ref<HTMLElement | undefined>()
const contentRef = ref<HTMLElement | undefined>()
const pullIndicatorRef = ref<HTMLElement | undefined>()
// 处理ios滚动穿透
usePopupEleScroll(containerRef)
// 触摸状态
let touchStartY = 0
let touchStartX = 0
let touchCurrentY = 0
let touchCurrentX = 0
let isTouching = false
let startScrollTop = 0
let isHorizontalSwipe = false // 是否是水平滑动

// 下拉状态
const currentPullDistance = ref(0)
const isPulling = ref(false)
const isReleasing = ref(false)

// 刷新状态
const isLoading = computed(() => props.loading)

// 下拉进度（0-1）
const pullProgress = computed(() => {
  if (props.pullDistance <= 0)
    return 0
  return Math.min(currentPullDistance.value / props.pullDistance, 1)
})

// 显示的横线数量（0-8）
const visibleLines = computed(() => {
  if (isLoading.value)
    return 8 // 刷新时显示全部
  return Math.floor(pullProgress.value * 8)
})

// 是否可以触发刷新
const canRefresh = computed(() => {
  return currentPullDistance.value >= props.pullDistance && !isLoading.value
})

// 处理触摸开始
function handleTouchStart(e: TouchEvent) {
  if (props.disabled || isLoading.value)
    return

  const container = containerRef.value
  if (!container)
    return

  // 检查是否在顶部
  startScrollTop = container.scrollTop
  if (startScrollTop > 0)
    return

  isTouching = true
  isHorizontalSwipe = false
  touchStartY = e.touches[0].clientY
  touchStartX = e.touches[0].clientX
  touchCurrentY = touchStartY
  touchCurrentX = touchStartX
}

// 处理触摸移动
function handleTouchMove(e: TouchEvent) {
  if (!isTouching || props.disabled || isLoading.value)
    return

  const container = containerRef.value
  if (!container)
    return

  // 如果不在顶部，取消下拉
  if (container.scrollTop > 0) {
    resetPullState()
    return
  }

  touchCurrentY = e.touches[0].clientY
  touchCurrentX = e.touches[0].clientX
  const deltaY = touchCurrentY - touchStartY
  const deltaX = touchCurrentX - touchStartX

  // 检测滑动方向：如果水平移动距离大于垂直移动距离，认为是水平滑动
  const absDeltaX = Math.abs(deltaX)
  const absDeltaY = Math.abs(deltaY)

  // 如果水平滑动距离大于垂直滑动距离，或者是明显的右滑（从左侧边缘开始），取消下拉刷新
  if (absDeltaX > absDeltaY || (deltaX > 0 && touchStartX < 20)) {
    isHorizontalSwipe = true
    resetPullState()
    return
  }

  // 只处理向下滑动
  if (deltaY > 0 && !isHorizontalSwipe) {
    e.preventDefault()
    e.stopPropagation()

    // 计算下拉距离（带阻尼效果）
    const distance = Math.min(
      deltaY * 0.5, // 阻尼系数
      props.maxPullDistance,
    )

    currentPullDistance.value = distance
    isPulling.value = true
    isReleasing.value = distance >= props.pullDistance

    // 更新内容位置
    if (contentRef.value) {
      contentRef.value.style.transform = `translateY(${distance}px)`
      contentRef.value.style.transition = 'none'
    }

    // 不需要旋转，根据进度显示横线数量
  }
}

// 处理触摸结束
function handleTouchEnd() {
  if (!isPulling.value)
    return

  if (canRefresh.value) {
    // 触发刷新
    triggerRefresh()
  }
  else {
    // 回弹
    resetPullState()
  }
}

// 触发刷新
function triggerRefresh() {
  if (!isLoading.value) {
    emit('update:loading', true)
  }
  emit('refresh')
  window.location.reload()
  // 保持下拉状态直到刷新完成
  if (contentRef.value) {
    contentRef.value.style.transition = 'transform 0.3s ease-out'
    contentRef.value.style.transform = `translateY(${props.pullDistance}px)`
  }

  // 监听加载完成
  const unwatch = watch(() => props.loading, (newVal: boolean) => {
    if (!newVal) {
      nextTick(() => {
        resetPullState()
        unwatch()
      })
    }
  })
}

// 重置下拉状态
function resetPullState() {
  isTouching = false
  isPulling.value = false
  isReleasing.value = false
  isHorizontalSwipe = false

  if (contentRef.value) {
    contentRef.value.style.transition = 'transform 0.3s ease-out'
    contentRef.value.style.transform = 'translateY(0)'
  }

  // 不需要重置旋转

  // 延迟重置距离，等待动画完成
  setTimeout(() => {
    currentPullDistance.value = 0
  }, 300)
}

// 监听加载状态变化
watch(() => props.loading, (newVal: boolean) => {
  if (!newVal && isPulling.value) {
    nextTick(() => {
      resetPullState()
    })
  }
})

onMounted(() => {
  const container = containerRef.value
  if (!container)
    return

  container.addEventListener('touchstart', handleTouchStart, { passive: true })
  container.addEventListener('touchmove', handleTouchMove, { passive: false })
  container.addEventListener('touchend', handleTouchEnd, { passive: true })
  container.addEventListener('touchcancel', handleTouchEnd, { passive: true })
})

onBeforeUnmount(() => {
  const container = containerRef.value
  if (!container)
    return

  container.removeEventListener('touchstart', handleTouchStart)
  container.removeEventListener('touchmove', handleTouchMove)
  container.removeEventListener('touchend', handleTouchEnd)
  container.removeEventListener('touchcancel', handleTouchEnd)
})
</script>

<template>
  <div ref="containerRef" class="base-pull-refresh">
    <!-- 下拉指示器 -->
    <div
      v-if="isPulling || isLoading"
      class="pull-indicator"
      :style="{ height: `${Math.max(currentPullDistance, props.pullDistance)}px` }"
    >
      <div class="indicator-content">
        <div
          ref="pullIndicatorRef"
          class="indicator-icon"
          :class="{ 'is-loading': isLoading, 'can-refresh': canRefresh && !isLoading }"
        >
          <div class="ios-loader">
            <div
              v-for="i in 8"
              :key="i"
              class="loader-line"
              :class="{ 'line-visible': i <= visibleLines }"
              :style="{ transform: `rotate(${(i - 1) * 45}deg)` }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div ref="contentRef" class="pull-refresh-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-pull-refresh {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.pull-indicator {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: hidden;
  padding-top: 10px;
  z-index: 1;
}

.indicator-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 8px;
  min-height: 60px;
}

.indicator-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);

  .ios-loader {
    position: relative;
    width: 30px;
    height: 30px;
    transform-origin: center;

    .loader-line {
      position: absolute;
      left: 50%;
      top: 0;
      width: 3px;
      height: 10px;
      margin-left: -1px;
      background-color: currentColor;
      border-radius: 1px;
      opacity: 0.3;
      transition: opacity 0.2s ease-out;
      transform-origin: center 15px;

      &.line-visible {
        opacity: 1;
      }
    }
  }

  &.is-loading,
  &.can-refresh {
    .ios-loader {
      animation: spin 1.6s linear infinite;
    }
  }
}

.pull-refresh-content {
  position: relative;
  will-change: transform;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

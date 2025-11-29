<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Props {
  /** 目标数字 0-9 */
  digit: number
  index: number
  /** 动画时长（秒） */
  duration?: number
  /** 每次变化额外多滚的整圈数（建议 2-6） */
  cycles?: number
  /** 缓动曲线（默认逐渐减速） */
  easing?: string
  /** 该位延迟（秒），用来实现多位数阶梯滚动 */
  delay?: number
  itemGap?: number
  direction?: 'up' | 'down'
}

defineOptions({ name: 'AppDigitReel' })
const props = withDefaults(defineProps<Props>(), {
  duration: 1.4,
  cycles: 3,
  easing: 'cubic-bezier(0.17, 0.67, 0.2, 1.02)',
  delay: 0,
  itemGap: 4,
  direction: 'down',
})

// 新增
type Mode = 'idle' | 'free' | 'stopping'
const mode = ref<Mode>('idle')

// 当前这一次动画使用的参数（与 props 解耦）
const curDuration = ref(props.duration)
const curEasing = ref(props.easing)

// 循环模式下，每次滚动的步进（整 10 个高度 = 一整圈）
const loopStep = 10

const reelRef = ref<HTMLDivElement | null>(null)
const itemHeight = ref<number>(55)

// 基础 0-9
const baseDigits = Array.from({ length: 10 }, (_, i) => i)
// 构造一个较长的池：前缀(10) + 主体(10 * (cycles + 2)) + 后缀(10)
const digitsPool = computed(() => {
  const totalCycles = Math.max(2, props.cycles + 2)
  return [
    ...baseDigits, // 前缀
    ...Array.from({ length: 10 * totalCycles }, (_, i) => i % 10),
    ...baseDigits, // 后缀
  ]
})

const bufferCycles = computed(() => Math.max(2, props.cycles + 2))
// up: 10   (紧接前缀，向上还有主体可滚)
// down: 10 + 10 * bufferCycles (主体中后段，向下有足够缓冲)
const anchorBase = computed(() =>
  props.direction === 'down'
    ? 10 + 10 * (bufferCycles.value - 1)
    : 10,
)
// 内部索引，表示当前在 pool 中的第几项
const internalIndex = ref(anchorBase.value + (props.digit % 10))
const transitionEnabled = ref(false)

const stride = computed(() => itemHeight.value + (props.itemGap ?? 0))
const dir = computed(() => (props.direction === 'down' ? -1 : 1))

function measureItemHeight() {
  // 动态测量：创建一个隐藏节点测量行高
  const el = document.createElement('div')
  el.className = 'digit hidden-measure'
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style.pointerEvents = 'none'
  el.style.whiteSpace = 'nowrap'
  el.style.lineHeight = 'normal'
  el.textContent = '0'
  document.body.appendChild(el)
  itemHeight.value = 55
  document.body.removeChild(el)
}

function normalizeAfterSpin(targetDigit: number) {
  // 归一化：把索引重置回中段同一数字，避免无限增大
  transitionEnabled.value = false
  internalIndex.value = anchorBase.value + (targetDigit % 10)
}

// 确保在开播前把索引锚到“安全中段”（避免刚开播就越界）
function anchorIfNeeded() {
  const d = ((internalIndex.value % 10) + 10) % 10
  const target = anchorBase.value + d
  if (internalIndex.value !== target) {
    transitionEnabled.value = false
    internalIndex.value = target
    // 下一帧再恢复过渡，避免可见跳动
    requestAnimationFrame(() => {
      transitionEnabled.value = true
    })
  }
}

function onTransitionEnd(e: TransitionEvent) {
  if (e.propertyName !== 'transform')
    return

  if (mode.value === 'free') {
    // 循环模式：每次结束就再滚一圈，形成无缝循环
    internalIndex.value = internalIndex.value + dir.value * loopStep
    return
  }

  if (mode.value === 'stopping') {
    // 停止模式：落地后做归一化并回到 idle
    normalizeAfterSpin(props.digit)
    mode.value = 'idle'
    return
  }

  // 旧的行为（autoplay 时由 props.digit 触发）
  normalizeAfterSpin(props.digit)
}

function play(opts?: { duration?: number, easing?: string }) {
  // 同时开播：用线性匀速或你想要的快节奏
  curDuration.value = opts?.duration ?? 0.6 // 循环匀速每圈时长
  curEasing.value = opts?.easing ?? 'linear'
  mode.value = 'free'
  transitionEnabled.value = true
  anchorIfNeeded()

  // 启动第一圈：向下滚 loopStep（10 个数字 = 1 圈）
  const cur = internalIndex.value
  internalIndex.value = cur + dir.value * loopStep
}

function stop(targetDigit: number, opts?: { minCycles?: number, duration?: number, easing?: string }) {
  // 切换到“收尾停下”模式
  const minCycles = Math.max(1, opts?.minCycles ?? props.cycles ?? 3)
  curDuration.value = opts?.duration ?? props.duration
  curEasing.value = opts?.easing ?? props.easing
  mode.value = 'stopping'

  // 计算落点：在当前基数上再多滚 minCycles 圈 + 目标位
  const curMod = internalIndex.value % 10
  const base = internalIndex.value - curMod
  const nextIndex = base + dir.value * 10 * minCycles + (targetDigit % 10)
  internalIndex.value = nextIndex
}

onMounted(() => {
  measureItemHeight()
  // 初始短延时开启过渡，避免首帧抖动
  requestAnimationFrame(() => {
    transitionEnabled.value = true
  })
})

defineExpose({
  play,
  stop,
})
</script>

<template>
  <div class="w-full h-full overflow-hidden bg-[#333] rounded-[4rem] pt-[15rem]">
    <div
      class="digit-reel relative inline-block align-middle" :style="{
        'width': '55rem',
        'height': `${itemHeight}rem`,
        '--reel-duration': `${duration}s`,
        '--reel-ease': easing,
        '--reel-delay': `${delay}s`,
        'fontVariantNumeric': 'tabular-nums',
      }" @transitionend="onTransitionEnd"
    >
      <!-- 列表容器：用 transformY 实现滚动 -->
      <div
        ref="reelRef" class="reel will-change-transform flex flex-col" :style="{
          rowGap: `${props.itemGap}rem`, // 间距
          transform: `translate3d(0, ${-internalIndex * stride}rem, 0)`, // 用步长滚动
          transition: transitionEnabled
            ? `transform ${curDuration}s ${curEasing} var(--reel-delay)`
            : 'none',
        }"
      >
        <!-- 预留一段前缀 + 主体 + 后缀，用于无缝循环 -->
        <div
          v-for="(d, i) in digitsPool" :key="i"
          class="digit select-none w-[55rem] h-[55rem] rounded-[50%] flex items-center justify-center  text-[30rem] font-[600]"
          :style="{ height: `${itemHeight}rem` }" :class="index === 0 ? 'bg-[#00E065] text-[#fff]' : 'bg-[#E1E1EC] text-[#00000066]'"
        >
          {{ d }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.digit-reel {
  /* 让数字居中对齐占位 */
  display: inline-block;
}

.reel {
  /* 性能优化 */
  backface-visibility: hidden;
}

.digit {
  min-width: 1ch;
  font-variant-numeric: tabular-nums;
  /* 等宽数字 */
}

.hidden-measure {
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .reel {
    transition: none !important;
  }
}
</style>

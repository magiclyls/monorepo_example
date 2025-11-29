<script setup lang="ts">
import { BaseImage } from '@tg/bccomponents'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useActivityConfig } from '../../../config'
/** ======= 组件入参 ======= */
const props = defineProps<{
  size?: number // 直径
  spinDuration?: number // 旋转动画时长（秒）
  minTurns?: number // 最少圈数
  tickets: number
}>()
const emit = defineEmits<{
  (e: 'done'): void
}>()
const { t } = useI18n()
const { isLogin, callback } = useActivityConfig()
/** ======= 类型定义（按你的接口改 key 即可） ======= */
export interface Prize {
  id: string | number
  title: string // 展示文案，如 “500”、“字母A”
  bgColor?: string // 扇形背景色，可选
  icon: string
  color?: string
  iconSize?: number
}
const router = useRouter()
const size = props.size ?? 300
const spinDuration = props.spinDuration ?? 3.8
const minTurns = props.minTurns ?? 6

/** ======= 状态 ======= */
const prizes = ref<Prize[]>([])
const loading = ref(false)
const spinning = ref(false)
const rotationDeg = ref(0) // 累计旋转角度（deg）

/** ======= 几何计算 ======= */
const center = size / 2
const outerR = center - 6
const ringWidth = Math.max(10, size * 0.05)
const wheelR = outerR - ringWidth
const centerBtnR = size * 0.14

const sectorColors = ['#FFE69B', '#FFD1A3', '#FFEEA8', '#FFC99B', '#FFE69B', '#FFD1A3']

const sectorAngle = computed(() => (prizes.value.length ? 360 / prizes.value.length : 0))

/** 计算扇形 path（SVG 弧） */
function sectorPath(idx: number) {
  const startDeg = -90 + idx * sectorAngle.value
  const endDeg = startDeg + sectorAngle.value
  return describeSector(center, center, wheelR, startDeg, endDeg)
}

function describeSector(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polarToCartesian(cx, cy, r, endDeg)
  const end = polarToCartesian(cx, cy, r, startDeg)
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`,
    'Z',
  ].join(' ')
}
function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** 文本放置：扇形中心角的 60% 半径处，文本竖直朝上 */
function labelTransform(idx: number) {
  const per = 360 / prizes.value.length
  const start = -90 + idx * per
  const mid = start + per / 2

  const rad = (mid * Math.PI) / 180
  // 半径 *0.65 控制距离中心的远近
  const rx = center + (wheelR * 0.65) * Math.cos(rad)
  const ry = center + (wheelR * 0.65) * Math.sin(rad)

  // 关键：旋转角度 +90，使文字朝向中心
  const rotate = mid + 90
  return `translate(${rx}, ${ry}) rotate(${rotate} ${0} ${0})`
}

/** 金额格式（按需替换） */
function formatAmount(n: number) {
  if (n >= 1000)
    return `${n}` // 示例：不加千分位
  return String(n)
}

/** ======= 旋转到“中奖索引” ======= */
/**
 * 目标：指针固定在 12 点（-90°），我们旋转“盘面”。
 * 给定中奖索引 winIndex，求该扇形中心角 midAngle，让其最终停在 12 点。
 */
function rotateToIndex(winIndex: number) {
  const per = sectorAngle.value
  const start = -90 + winIndex * per
  const mid = start + per / 2 // 该扇形中心角
  // 让 mid 到 -90（指针）所需的盘面旋转 = (-90 - mid)
  const target = -90 - mid
  // 增加整数圈数，制造动画感
  const base = rotationDeg.value % 360
  // 计算从当前 base 旋转到 target 的 delta，并加上若干圈
  let delta = target - base
  // 规范化 delta 到 [-180, 180)，再加上若干圈
  delta = ((delta + 540) % 360) - 180
  const turns = 360 * Math.max(minTurns, 5)
  const final = rotationDeg.value + delta + turns
  rotationDeg.value = final
}

/** ======= 交互：点击 GO ======= */
async function onGo() {
  if (!isLogin) {
    callback('login')
    return
  }
  if (loading.value || spinning.value || prizes.value.length === 0)
    return
  try {
    spinning.value = true
    // 2) 调抽奖接口，返回要落在哪一项（索引或 id）
    const res = await apiDraw() // { winIndex: number } 或 { winId }
    const winIndex = resolveWinIndex(res)
    rotateToIndex(winIndex)
  }
  catch (err) {
    spinning.value = false
    console.error(err)
  }
}

function onSpinEnd() {
  // 旋转动画结束（可在此弹窗、刷新次数等）
  spinning.value = false
  emit('done') // 如需对外暴露
}

/** -------- 接口区（按你真实 API 替换） -------- */
async function apiFetchConfig(): Promise<{ list: Prize[] }> {
  // TODO: 替换为真实请求
  // 示例：从后端拿到扇形配置（内容与数量）
  return {
    list: [
      { id: 1, icon: 'Y', title: '字母', color: '#2CABFF' },
      { id: 2, icon: 'coins', title: '300', iconSize: 30 },
      { id: 3, icon: 'H', title: '字母', color: '#C900FF' },
      { id: 4, icon: 'cry-face', title: '谢谢参与', iconSize: 26 },
      { id: 5, icon: 'A', title: '字母', color: '#FF4949' },
      { id: 6, icon: 'coupon', title: '抽奖券', iconSize: 27 },
      { id: 7, icon: 'P', title: '字母', color: '#FFA100' },
      { id: 8, icon: 'coins', title: '1200', iconSize: 30 },
      { id: 9, icon: 'P', title: '字母', color: '#FF3AF6' },
      { id: 10, icon: 'coins', title: '1200', iconSize: 30 },
      { id: 11, icon: 'coupon', title: '抽奖券', color: 'false', iconSize: 27 },
      { id: 12, icon: 'coins', title: '1200', iconSize: 30 },
    ],
  }
}

async function apiDraw(): Promise<{ winIndex: number } | { winId: string | number }> {
  // TODO: 替换为真实请求
  // 示例：后端返回要停到第 X 个
  const winIndex = Math.floor(Math.random() * prizes.value.length)
  return { winIndex }
}

function resolveWinIndex(res: { winIndex?: number, winId?: string | number }) {
  if (typeof res.winIndex === 'number')
    return res.winIndex
  const idx = prizes.value.findIndex(p => p.id === res.winId)
  if (idx < 0)
    throw new Error('Invalid win result')
  return idx
}

/** ======= 初始化：拉取配置 ======= */
onMounted(async () => {
  loading.value = true
  try {
    const { list } = await apiFetchConfig()
    if (!list?.length)
      throw new Error('Empty prize list')
    prizes.value = list
    // 初始对齐到第 0 个（可选）
    rotateToIndex(0)
    rotationDeg.value = rotationDeg.value % 360 // 去掉多余圈数
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="wheel-wrapper">
    <!-- 指针（固定不转） -->
    <BaseImage url="/activity/png/word-collection/pointer.png" class="absolute top-[82px] z-[3] mx-auto w-[100px]" />
    <div class="go" @click="onGo">
      GO
    </div>
    <!-- 转盘本体（旋转） -->
    <div
      class="wheel z-[2]"
      :style="{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotationDeg}deg)`,
        transition: spinning ? `transform ${spinDuration}s cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
      }"
      @transitionend="onSpinEnd"
    >
      <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
        <!-- 外圈装饰 -->

        <defs>
          <radialGradient id="rimGradient">
            <stop offset="0%" stop-color="#ff5bd7" />
            <stop offset="100%" stop-color="#7a33ff" />
          </radialGradient>
        </defs>

        <!-- 扇形 -->
        <g v-for="(item, idx) in prizes" :key="item.id">
          <path
            :d="sectorPath(idx)"
            :fill="item.color ? '#fff' : '#FCCC02'"
            stroke="#D8A6FF"
            :stroke-width="1"
          />
          <!-- 文本/金额，沿扇形中心角摆放，朝向中心 -->
          <g :transform="labelTransform(idx)">
            <text
              text-anchor="middle"
              dominant-baseline="middle"
              font-size="10px"
              :font-weight="600"
              :fill="item.color ? '#C900FF' : '#FF4000'"
              y="-20"
            >
              {{ item.title }}
            </text>
            <text
              v-if="item.color && item.color !== 'false'"
              y="-10"
              text-anchor="middle"
              dominant-baseline="hanging"
              :font-size="34"
              :fill="item.color"
              font-weight="700"
              font-family="Saira"
            >
              {{ item.icon }}
            </text>
            <image
              v-else
              :href="`/activity/png/word-collection/${item.icon}.png`"
              :x="-item.iconSize! / 2" :y="-item.iconSize! / 2"
              :width="item.iconSize" :height="item.iconSize"
              preserveAspectRatio="xMidYMid meet"
            />
            <BaseImage class="m-[5px] mx-auto h-[70px] w-[70px]" :url="`/activity/png/word-collection/${item.icon}.png`" />
          </g>
        </g>
      </svg>
    </div>

    <!-- 次数/状态栏（可按需改） -->
    <div class="status">
      <slot name="status" :loading="loading" :spinning="spinning" :prizes="prizes" />
    </div>
    <div class="absolute bottom-0 left-[50%] z-[1] w-[258px] -translate-x-[50%]">
      <BaseImage url="/activity/png/word-collection/wheel_base.png" />
    </div>
    <div class="pointer-events-none absolute left-[50%] top-0 z-[3] mx-auto w-[314px] -translate-x-[50%]">
      <BaseImage url="/activity/png/word-collection/layer-light.png" />
    </div>
    <div class="pointer-events-none absolute left-[50%] top-0 z-[3] mx-auto w-[310px] -translate-x-[50%]">
      <BaseImage url="/activity/png/word-collection/light-small.png" class="light light-small" />
    </div>
    <div class="pointer-events-none absolute left-[50%] z-[3] mx-auto w-[314px] -top-1 -translate-x-[50%]">
      <BaseImage url="/activity/png/word-collection/light-large.png" class="light light-large" />
    </div>
    <div class="text-tg-text-white absolute bottom-[15px] left-0 z-[2] w-full text-center text-[14px] font-semibold">
      {{ t('券') }}: {{ props.tickets }}
    </div>
  </div>
</template>

<style scoped>
.wheel-wrapper {
  position: relative;
  display: inline-block;
  margin: 0 auto;
  height: 374px;
  width: 314px;
}
.wheel {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  will-change: transform;
}
.pointer {
  position: absolute;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  z-index: 3;
}
.pointer-tip {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 24px solid #fff;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
}
.status {
  margin-top: calc(8px + 24px); /* 给指针挪个位置 */
  text-align: center;
  font-weight: 600;
}
.go {
  text-align: center;
  font-family: 'SF Pro';
  font-size: 33.885px;
  font-style: normal;
  font-weight: 1000;
  line-height: normal;
  padding: 10px;
  background: linear-gradient(0deg, #6b36b5 0%, #a667ff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: absolute;
  z-index: 3;
  text-align: center;
  top: 122px;
  left: 50%;
  transform: translateX(-50%);
}

/* 公共：基于自身中心旋转 */
.light {
  transform-origin: 50% 50%;
  will-change: transform, filter, opacity;
}
/* 可选：再叠一个“明暗交替”，强调闪烁（两层相反相位） */
@keyframes glow {
  0%,
  49% {
    filter: brightness(1) saturate(1);
    opacity: 1;
  }
  50%,
  100% {
    filter: brightness(0.75) saturate(0.9);
    opacity: 0.75;
  }
}
.light-small {
  animation-name: glow;
  animation-duration: 2s;
  animation-timing-function: linear, steps(1);
  animation-iteration-count: infinite, infinite;
}
.light-large {
  animation-name: glow;
  animation-duration: 2s;
  animation-timing-function: linear, steps(1);
  animation-iteration-count: infinite, infinite;
  animation-direction: reverse, reverse;
}

/* 抽奖时需要暂停闪烁：给容器加 .pause-lights */
.pause-lights .light {
  animation-play-state: paused;
}

/* 无动画用户尊重系统设置 */
@media (prefers-reduced-motion: reduce) {
  .light {
    animation: none !important;
  }
}
</style>

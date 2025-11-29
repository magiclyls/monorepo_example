<script setup lang="ts" name="AppRaceCarAnimate">
import { LotteryColorfulBalls, LotteryImage } from '@tg/bccomponents'
import { storeToRefs } from 'pinia'
import { computed, inject, onMounted, ref } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useRaceStore } from '../../../stores/useRaceStore'
import AppRaceCars from './AppRacingCars.vue'

interface Props {
  endTime: number
  curPeriod: string
}
interface AnimateEntryResult {
  containerAnim: Animation
  rankAnim: Animation
}

const props = defineProps<Props>()
const { $$t } = useLocale()
const { raceTabArr } = storeToRefs(useRaceStore())

/**
 * @description: 赛车动画组件
 * @param ROADLEFT 路的左边距
 * @param LINELEFT 赛道的左边距
 * @param FINISHPOSITION 终点位置
 */
const ROADLEFT = 370
const LINELEFT = 260
const FINISHPOSITION = 40

const currentTab = inject('currentTab', ref(2001))
const carsList = ref<Array<HTMLElement | null>>([])
const result = ref<number[]>([])
const sortCars = ref<number[]>([])
const winFirRef = ref<HTMLElement | null>(null)
const winSecRef = ref<HTMLElement | null>(null)
const winThirdRef = ref<HTMLElement | null>(null)
const isShowWinner = ref(false)
const isShowLight = ref(true)
let skyTween: Animation | null | undefined = null
let roadTween: Animation | null | undefined = null
let firFinishedTween: Animation | null | undefined = null
let secFinishedTween: Animation | null | undefined = null
let allCarAnimate: (Animation | undefined)[] = []
let allCarEndAnimate: (Animation | undefined)[] = []
const winnerAnimateArr: Animation[] = []
let sortCarsAnimate: number = 0

const curTabTitle = computed(() => raceTabArr.value.find(item => item.value === currentTab.value)?.label || 'Racing')
function start() {
  isShowLight.value = false
  skyAnimate()
  roadAnimate()
  carAndLineAnimate()
  getSortedCars()
}
function skyAnimate() {
  const sky = document.querySelector('.sky')
  skyTween = sky?.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(50%)' }, // 左移一半宽度
  ], {
    duration: 6000,
    iterations: Infinity,
    easing: 'linear',
    fill: 'forwards',
  })
}
function roadAnimate() {
  const road = document.querySelector('.road')
  roadTween = road?.animate([
    { left: `-${ROADLEFT}rem` },
    { left: '0rem' },
  ], {
    duration: 1000,
    iterations: Infinity,
    delay: 0,
    direction: 'normal',
    easing: 'linear',
    fill: 'forwards',
  })
}

function getSortedCars() {
  if (carsList.value.length === 0)
    return []

  const carsWithLeft = carsList.value.map((el, idx) => ({
    idx,
    left: Number.parseFloat(getComputedStyle(el!).left) || 0,
  }))
  carsWithLeft.sort((a, b) => a.left - b.left)
  sortCars.value = carsWithLeft.map(item => item.idx + 1)
  sortCarsAnimate = requestAnimationFrame(getSortedCars)
}
function carAndLineAnimate() {
  const finished = document.querySelector('.race-finished')
  const carData = dealCarList()

  carData.forEach(({ el, position }, carIndex) => {
    const car = el?.animate(
      position.map((x, i) => ({
        left: `${x}rem`,
      })),
      {
        duration: 3000, // 动画总时长（毫秒）
        iterations: 1, // 循环次数，Infinity 表示无限循环
        direction: 'alternate', // 动画方向: normal, reverse, alternate
        easing: 'linear', // 缓动曲线
        fill: 'forwards', // 动画结束后保留最后状态: none, forwards, backwards, both
      },
    )
    allCarAnimate.push(car)
    const children = el.children[0] as HTMLElement
    const opacityFrames = position.map((x, i) => {
      const start = el.style.left
      const target = `${x}rem`
      const direct = Number.parseFloat(target) - Number.parseFloat(start)
      return { opacity: direct < 0 ? 1 : 0 }
    })

    const carChildren = children.animate(opacityFrames, {
      duration: 200,
      iterations: 1,
      direction: 'alternate',
      easing: 'linear',
      fill: 'forwards',
    })
    allCarAnimate.push(carChildren)

    firFinishedTween = finished?.animate([
      { left: `${LINELEFT}rem` },
      { left: `${LINELEFT + 200}rem` },
    ], {
      duration: 1500,
      iterations: 1,
      delay: 0,
      direction: 'normal',
      easing: 'linear',
      fill: 'forwards',
    })

    if (car && carIndex === 0) {
      car.onfinish = () => {
        secFinishedTween = finished?.animate([
          { left: `-${100}rem` },
          { left: `${FINISHPOSITION}rem` },
        ], {
          duration: 500,
          iterations: 1,
          delay: 500,
          direction: 'normal',
          easing: 'linear',
          fill: 'forwards',
        })
        if (secFinishedTween) {
          secFinishedTween.onfinish = () => {
            firFinishedTween?.cancel()
            stop().then(() => {
              carEndAnimate()
              cancelAnimationFrame(sortCarsAnimate)
            })
          }
        }
      }
    }
  })
}
function dealCarList() {
  const moveRange = 100

  return carsList.value.map((item, index) => {
    const el = item as HTMLElement
    const startLeft = el ? Number.parseFloat(el.style.left) || 0 : 0
    const positions: number[] = []
    let current = startLeft

    const end = FINISHPOSITION - 20
    const endPositions: Record<number, number> = {
      [result.value[0]]: end,
      [result.value[1]]: end + 20,
      [result.value[2]]: end + 30,
    }

    for (let i = 0; i < 4; i++) {
      if (i !== 3) {
        positions.push(current)
        const delta = (Math.random() - 0.8) * moveRange
        current += delta
      }
      else {
        positions.push(endPositions[index + 1] ?? current)
      }
    }

    return { el, position: positions }
  })
}
function carEndAnimate() {
  carsList.value.forEach((el, index) => {
    const end = el?.animate([
      { left: '-100rem' },
    ], {
      duration: 500,
      iterations: 1,
      delay: 500,
      direction: 'normal',
      easing: 'linear',
      fill: 'forwards',
    })
    allCarEndAnimate.push(end)
    if (end && index) {
      end.onfinish = () => {
        startWinnerAnimation()
        reset()
        sortCars.value = result.value
      }
    }
  })
}
function stop() {
  return new Promise<void>((resolve) => {
    skyTween?.pause()
    roadTween?.pause()
    allCarAnimate.forEach((el) => {
      el?.pause()
    })
    resolve()
  })
}

function reset() {
  firFinishedTween?.cancel()
  secFinishedTween?.cancel()
  roadTween?.cancel()
  skyTween?.cancel()
  allCarAnimate.forEach((el) => {
    el?.cancel()
  })
  allCarEndAnimate.forEach((el) => {
    el?.cancel()
  })
  skyTween = null
  roadTween = null
  firFinishedTween = null
  secFinishedTween = null
  allCarAnimate = []
  allCarEndAnimate = []
  carsList.value.forEach((el, index) => {
    if (el) {
      el.style.left = `${332 - (index + 1) * 4}rem`
      const children = el.children[0] as HTMLElement
      children.style.opacity = '0'
    }
  })
  cancelAnimationFrame(sortCarsAnimate)
}

async function animateEntry(
  container: HTMLElement,
  offset = '-60%,20%',
  duration = 800,
  wait = false,
): Promise<AnimateEntryResult> {
  // container 动画
  const containerAnim = container.animate(
    [{ transform: `translate(${offset})`, opacity: 1 }],
    { fill: 'forwards', easing: 'ease-in-out', duration },
  )
  winnerAnimateArr.push(containerAnim)
  await containerAnim.finished

  const rankImg = container.children[0] as HTMLElement
  let rankAnim: Animation

  if (wait) {
    rankAnim = rankImg.animate(
      [{ opacity: 1 }],
      { fill: 'forwards', easing: 'ease-in-out', duration: 800 },
    )
    winnerAnimateArr.push(rankAnim)
    await rankAnim.finished
  }
  else {
    rankAnim = rankImg.animate(
      [{ opacity: 1 }],
      { fill: 'forwards', easing: 'ease-in-out', duration: 800 },
    )
    winnerAnimateArr.push(rankAnim)
  }

  return { containerAnim, rankAnim }
}

async function startWinnerAnimation() {
  isShowWinner.value = true

  if (!winFirRef.value || !winSecRef.value || !winThirdRef.value)
    return

  await animateEntry(winFirRef.value)
  await animateEntry(winSecRef.value)
  await animateEntry(winThirdRef.value, '-60%,20%', 800, true)

  isShowWinner.value = false
  isShowLight.value = true
  cancelAnimationsInContainer()
}
function setResult(value: number[]) {
  result.value = value
  sortCars.value = value
}
function cancelAnimationsInContainer() {
  const container = document.querySelector('.racing-car-animate-container') as HTMLElement
  if (!container)
    return

  const elements = [...Array.from(container.querySelectorAll('*'))]

  for (const el of elements) {
    const htmlEl = el as HTMLElement
    if (!htmlEl.classList.contains('wind-nitro-animate')) {
      for (const anim of htmlEl.getAnimations()) {
        anim.cancel()
      }
    }
  }
  winnerAnimateArr.forEach((item) => {
    item.cancel()
  })
  winnerAnimateArr.length = 0
}
onMounted(() => {
  reset()
})

defineExpose({
  setResult,
  start,
  resetAll: async () => {
    isShowLight.value = true
    isShowWinner.value = false
    reset()
    cancelAnimationsInContainer()
  },
})
</script>

<template>
  <div class="w-full overflow-hidden relative racing-car-animate-container">
    <div v-bg-image="'/lottery/png/race-header.png'" class="w-full h-[32rem] overflow-hidden race-header-bg flex text-white items-center justify-around">
      <div class="w-[78rem] ml-[5rem] text-[11rem]">
        {{ curTabTitle }}
      </div>
      <div class="w-[176rem] flex">
        <template v-for="(item, index) in sortCars" :key="index ">
          <LotteryColorfulBalls :number="item" type="race-sec" class="size-[18rem]" />
        </template>
      </div>
      <div class="w-[96rem] mr-[2rem]">
        <span class="text-[10rem]">{{ $$t('第') }}.{{ curPeriod }}</span>
      </div>
    </div>
    <div class="relative overflow-hidden h-[180rem]">
      <!-- 红绿灯 -->
      <div v-show="isShowLight" v-bg-image="'/lottery/png/race-light-bg.png'" class="absolute top-1/2 flex justify-around left-1/2 -translate-1/2 z-10 w-[100rem] h-[40rem] " style="background-position: 50%,50%; background-size: 100%;">
        <LotteryImage url="/lottery/png/race-green-light.png" class="w-[29rem] mb-[3rem]" :style="{ opacity: endTime === 1 ? 1 : 0 }" />
        <LotteryImage url="/lottery/png/race-yellow-light.png" class="w-[29rem] mb-[3rem]" :style="{ opacity: endTime === 2 ? 1 : 0 }" />
        <LotteryImage url="/lottery/png/race-red-light.png" class="w-[29rem] mb-[3rem]" :style="{ opacity: endTime === 3 ? 1 : 0 }" />
      </div>
      <div class="h-[34rem] w-full overflow-hidden relative">
        <div class="absolute top-0 sky w-[1518rem] right-0 flex">
          <LotteryImage url="/lottery/png/sky.png" class="w-[759rem] h-[34rem] shrink-0 " />
          <LotteryImage url="/lottery/png/sky.png" class="w-[759rem] h-[34rem] shrink-0" />
        </div>
      </div>
      <div class="w-full h-[145rem] relative">
        <div class="w-full h-full absolute top-0 left-0 overflow-hidden">
          <div class="road absolute top-0 flex w-[759rem]" :style="{ left: `-${ROADLEFT}rem` }">
            <LotteryImage url="/lottery/png/race-road.png" class="w-[759rem] h-[145rem]" alt="" />
          </div>
          <div class="absolute race-finished top-0" :style="{ left: `${LINELEFT}rem` }">
            <LotteryImage url="/lottery/png/race-finished.png" class="w-[70rem] h-[138rem]" alt="" />
          </div>
          <div
            v-for="(_, index) in 10"
            :key="index + 1"
            :ref="(el) => { carsList[index] = (el as HTMLElement) }"
            class="absolute"
            :style="{ top: `${13 * index}rem` }"
          >
            <div>
              <div class=" absolute z-20 bottom-0 w-[40rem] -left-[1rem] wind-nitro-animate">
                <LotteryImage url="/lottery/png/wind.png" />
              </div>
              <div class=" absolute z-20 -right-[10rem] top-1/2 -transition-y-1/2 wind-nitro-animate">
                <LotteryImage url="/lottery/png/nitro.png" class="w-[14rem]" />
              </div>
            </div>
            <AppRaceCars
              :number="index + 1"
              class="w-[46rem] h-[13rem]"
              :style="{ width: `${44 + (index + 1) * 2}rem` }"
            />
          </div>
        </div>
      </div>
      <!-- 赢的结果动画 -->
      <div v-show="isShowWinner" class="absolute top-0 left-0 size-full">
        <LotteryImage url="/lottery/png/race-win-bg.png" class="h-[179rem]" fit="cover" />
        <div class=" absolute size-full top-0 left-0">
          <div ref="winSecRef" class="absolute left-[10rem] opacity-0 -translate-y-13/15 translate-x-[60%] top-1/2">
            <div class="flex justify-center h-[70rem] opacity-0">
              <LotteryImage url="/lottery/png/race-win-sec.png" class="w-[60rem]" />
            </div>
            <AppRaceCars type="win" :number="result[1]" class="w-[120rem]" />
          </div>
          <div ref="winFirRef" class="absolute left-1/2 opacity-0 translate-x-[10%] -translate-y-[80%] top-1/2 z-30">
            <div class="flex justify-center h-[90rem] opacity-0 ">
              <LotteryImage url="/lottery/png/race-win-first.png" class="w-[70rem]" />
            </div>
            <AppRaceCars type="win" :number="result[0]" class="w-[150rem]" />
          </div>
          <div ref="winThirdRef" class="absolute right-[10rem] -translate-y-13/15 opacity-0 translate-x-[60%] top-1/2">
            <div class="flex justify-center h-[70rem] opacity-0">
              <LotteryImage url="/lottery/png/race-win-third.png" class="w-[60rem]" />
            </div>
            <AppRaceCars type="win" :number="result[2]" class="w-[110rem]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.race-header-bg {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
}
.wind-nitro-animate {
  animation: wind 400ms infinite alternate ease-in-out;
}
@keyframes wind {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}
</style>

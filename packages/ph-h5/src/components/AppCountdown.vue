<script setup lang='ts'>
import type { Dayjs } from 'dayjs'
import { useIntervalFn } from '@vueuse/core'
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'AppCountdown',
})
const { endTime, nowTime, duration, setDownTime } = defineProps<Props>()
const emit = defineEmits<{ (event: 'onEnd'): void }>()

interface Props {
  endTime?: Dayjs
  nowTime?: Dayjs
  duration?: number
  setDownTime?: (time: number) => void
  gradientBorder?: boolean
}

let intervalControl: ReturnType<typeof useIntervalFn> | null = null

const currentDuration = ref<number>(0)

watch(
  () => ([endTime, nowTime, duration] as const),
  ([newEnd, newNow, newDuration]) => {
    if (newDuration) {
      currentDuration.value = newDuration
    }
    else {
      // 如果 `endTime` 不存在，则停止操作
      if (!newEnd)
        return

      const usedNow = newNow || dayjs()
      currentDuration.value = newEnd.unix() - usedNow.unix()
    }

    if (currentDuration.value < 0) {
      emit('onEnd')
      return
    }

    if (intervalControl)
      intervalControl.pause()

    intervalControl = useIntervalFn(() => {
      if (currentDuration.value > 0) {
        currentDuration.value -= 1
        setDownTime && setDownTime(currentDuration.value)
      }
      else {
        emit('onEnd')
        intervalControl?.pause()
      }
    }, 1000)
  },
  { immediate: true },
)

const hours = computed(() => {
  return currentDuration.value && Math.floor(currentDuration.value / (60 * 60))
})
const minutes = computed(() => {
  return currentDuration.value && Math.floor(currentDuration.value % (60 * 60) / 60)
})
const seconds = computed(() => {
  return currentDuration.value && currentDuration.value % 60
})
const disabled = computed(() => {
  return currentDuration.value === 0
})
</script>

<template>
  <div
    class="app-countdown"
  >
    <div
      class="[font-size:var(--tg-app-countdown-font-size)] flex items-center font-[var(--tg-app-countdown-font-weight)]"
      :class="[disabled ? 'text-[#6D7693]' : '', gradientBorder && 'gradient']"
    >
      <span class="border-bg h-[var(--tg-app-countdown-item-height)] w-[var(--tg-app-countdown-item-width)] border-[1rem] rounded-[var(--tg-app-countdown-border-radius)] border-solid text-center leading-[var(--tg-app-countdown-item-height)]">{{ `${(hours !== undefined && hours < 10) ? '0' : ''}` }}{{ hours }}</span>
      <span class="mx-[13rem]">:</span>
      <span class="border-bg h-[var(--tg-app-countdown-item-height)] w-[var(--tg-app-countdown-item-width)] border-[1rem] rounded-[var(--tg-app-countdown-border-radius)] border-solid text-center leading-[var(--tg-app-countdown-item-height)]">{{ `${(minutes !== undefined && minutes < 10) ? '0' : ''}` }}{{ minutes }}</span>
      <span class="mx-[13rem]">:</span>
      <span class="border-bg h-[var(--tg-app-countdown-item-height)] w-[var(--tg-app-countdown-item-width)] border-[1rem] rounded-[var(--tg-app-countdown-border-radius)] border-solid text-center leading-[var(--tg-app-countdown-item-height)]">{{ `${(seconds !== undefined && seconds < 10) ? '0' : ''}` }}{{ seconds }}</span>
    </div>
  </div>
</template>

<style lang="scss">
  :root {
  --tg-app-countdown-bg: #f6f7f8;
  --tg-app-countdown-border: #ebebeb;
  --tg-app-countdown-border-radius: 6rem;
  --tg-app-countdown-item-width: 40rem;
  --tg-app-countdown-item-height: 40rem;
  --tg-app-countdown-font-weight: 400;
  --tg-app-countdown-font-size: 14rem;
}
</style>

<style lang='scss' scoped>
.border-bg {
  background-color: var(--tg-app-countdown-bg);
  border-color: var(--tg-app-countdown-border);
}
.gradient {
  // 仅首页注册首充弹窗
  .border-bg {
    position: relative;
    border-radius: var(--tg-app-countdown-border-radius);
    border: none;
    background-color: #0d1f28;
    &::before {
      content: '';
      position: absolute;
      top: -1rem;
      left: -1rem;
      right: -1rem;
      bottom: -1rem;
      z-index: -1;
      background: linear-gradient(to bottom, #699ab9, #2f4553);
      border-radius: var(--tg-app-countdown-border-radius);
    }
  }
}
</style>

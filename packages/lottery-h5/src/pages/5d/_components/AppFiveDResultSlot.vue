<script setup lang='ts'>
import { ref, watch } from 'vue'
import AppDigitReel from './AppDigitReel.vue'

interface Props {
  result: string[]
}

defineOptions({ name: 'AppFiveDResultSlot' })
const props = defineProps<Props>()

const duration = 2
const stagger = 0.3
const cycles = 4
const easing = 'cubic-bezier(0.17, 0.67, 0.2, 1.02)'

const reels = ref<InstanceType<typeof AppDigitReel>[]>([]) // refs 数组

function startAll() {
  reels.value.forEach(r => r?.play({ duration: 0.6 })) // 同时开始循环匀速转
}

// ✅ 同一帧里同时 stop，但每位 duration 逐步拉长
function stopAllSimultaneous(values: string[]) {
  reels.value.forEach((r, idx) => {
    if (!r)
      return
    const digit = Number(values[idx] ?? 0)
    const stopDuration = 1.2 + idx * stagger // ★ 关键：第 idx 位更久才结束
    r.stop(digit, {
      duration: stopDuration,
      easing,
      minCycles: 2, // 继续保证至少滚两圈的“收尾感”
    })
  })
}

watch(() => props.result, (a, b) => {
  if (a.join(',') === b.join(','))
    return
  startAll()
  stopAllSimultaneous(a)
})
</script>

<template>
  <div class="h-[116rem] w-[327rem] mx-auto bg-[#00B977] rounded-[7rem]  relative p-[10rem]">
    <div class="bg-[#003C26] h-full rounded-[5rem] p-[5rem]">
      <div class="w-full h-full grid grid-cols-5 gap-[5rem]">
        <!-- 号码 -->
        <AppDigitReel
          v-for="i, idx in result" :key="idx" :ref="el => (reels[idx] = el as any)"
          :digit="Number(i)"
          :cycles="cycles"
          :duration="duration + idx * stagger"
          :easing="easing"
          :delay="0"
          :index="idx"
        />
      </div>
    </div>
    <div
      class="w-[5rem] h-[26rem] absolute left-[0] top-[50%] translate-y-[-50%] translate-x-[-100%] bg-[#008B59] rounded-tl-[5rem] rounded-bl-[5rem]"
    />
    <div class="w-[5rem] h-[26rem] absolute right-[0] top-[50%] translate-y-[-50%] translate-x-[100%] bg-[#008B59] rounded-tr-[5rem] rounded-br-[5rem]" />
  </div>
</template>

<style lang='scss' scoped></style>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'AfunBaseNoticeBar',
})
const props = withDefaults(defineProps<{
  /** 滚动方向 */
  col?: number
  /** 滚动速度 */
  speed?: number
  total?: number
}>(), {
  col: 0,
  total: 0,
  speed: 20,
})
const emit = defineEmits(['colEnd', 'rowEnd'])
const scrollContent = ref<HTMLElement | null>(null)
const prefixRef = ref<HTMLElement | null>(null)
let gsapScroll: gsap.core.Tween | null = null

/** 暂停滚动 */
function stopScroll() {
  // gsapScroll?.pause()
  // const content = scrollContentRef.value

  // if (content)
  //   content.style.animationPlayState = 'paused'
}

/** 开始滚动 */
function startScroll() {
  // gsapScroll?.resume()
  // const content = scrollContentRef.value

  // if (content)
  //   content.style.animationPlayState = 'running'
}

onMounted(() => {
  if (props.col) {
    gsapScroll = gsap.to(scrollContent.value, {
      duration: props.speed,
      delay: 0.5,
      // repeatDelay: 0.1,
      y: scrollContent.value ? `${-scrollContent.value?.offsetHeight / props.total * props.col}px` : '-100%',
      repeat: -1,
      ease: 'none',
      onRepeat: () => {
        emit('colEnd')
      },
    })
  }
  else {
    gsapScroll = gsap.to(scrollContent.value, {
      duration: props.speed,
      delay: 0.5,
      // repeatDelay: 0,
      translateX: scrollContent.value ? `${-(scrollContent.value.children[0] as HTMLElement)?.offsetWidth}px` : '-100%',
      repeat: -1,
      ease: 'none',
      paused: false,
      onRepeat: () => {
        emit('rowEnd')
      },
    })
  }
})

onUnmounted(() => {
  gsapScroll?.kill()
})
</script>

<template>
  <section class="base-notice-bar relative overflow-hidden" @mouseenter="stopScroll" @mouseleave="startScroll">
    <div ref="scrollContent" class="scroll-content" :class="{ flex: !col }">
      <!-- <div ref="slotContent" class="slot-content"> -->
      <slot />
      <!-- </div> -->
    </div>
    <div ref="prefixRef" class="prefix">
      <slot name="prefix" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.scroll-content {
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  will-change: transform;
}
.prefix {
  background-color: var(--base-notice-bar-background-color);
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

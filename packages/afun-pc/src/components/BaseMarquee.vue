<script lang="ts" setup>
interface Props {
  text?: string
  delay?: number
  speed?: number
  autoplay?: boolean
  color?: string
  mode?: 'closeable' | 'link'
  wrapable?: boolean
  scrollable?: boolean
}

defineOptions({
  name: 'BaseMarquee',
})

const props = withDefaults(defineProps<Props>(), {
  delay: 1,
  speed: 60,
  autoplay: true,
  scrollable: true,
})

const emits = defineEmits(['close', 'replay', 'end'])
let wrapWidth = 0
let contentWidth = 0
let startTimer: ReturnType<typeof setTimeout>

const wrapRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()

const state = reactive({
  show: true,
  offset: 0,
  duration: 0,
})

const real_style = ref()

const style = computed(() => ({
  transform: state.offset ? `translateX(${state.offset}px)` : '',
  transitionDuration: `${state.duration}s`,
}))

function onTransitionEnd() {
  state.offset = wrapWidth
  state.duration = 0
  emits('end')
  raf(() => {
    doubleRaf(() => {
      if (props.autoplay)
        emits('replay')
      else
        real_style.value = void 0
      state.offset = -contentWidth
      state.duration = (contentWidth + wrapWidth) / +props.speed
    })
  })
}

async function reset() {
  const { delay, speed, scrollable } = props
  const ms = delay !== undefined && delay !== null ? +delay * 1000 : 0

  wrapWidth = 0
  contentWidth = 0
  state.offset = 0
  state.duration = 0

  clearTimeout(startTimer)
  return new Promise((resolve) => {
    startTimer = setTimeout(() => {
      if (!wrapRef.value || !contentRef.value || scrollable === false) {
        resolve(true)
        return
      }

      const wrapRefWidth = useElementBounding(wrapRef).width
      const contentRefWidth = useElementBounding(contentRef).width

      if (scrollable || contentRefWidth > wrapRefWidth) {
        doubleRaf(() => {
          if (!props.autoplay)
            real_style.value = void 0
          wrapWidth = wrapRefWidth.value
          contentWidth = contentRefWidth.value
          state.offset = -contentWidth
          state.duration = contentWidth / +speed
          resolve(true)
        })
      }
      else {
        resolve(true)
      }
    }, ms)
  })
}

function start(p?: any) {
  reset().then(() => {
    real_style.value = style.value
  })
}

onMounted(() => {
  reset()
  if (props.autoplay)
    start()
})

onActivated(() => {
  reset()
  if (props.autoplay)
    start()
})

watch(() => [props.text], () => {
  reset()
})

defineExpose({ start })
</script>

<template>
  <div
    v-show="state.show"
    class="base-marquee"
  >
    <section ref="wrapRef" role="marquee" class="marquee-wrap relative">
      <div
        ref="contentRef"
        class="marquee-content absolute flex items-center whitespace-nowrap ease-linear"
        :style="real_style"
        @transitionend="onTransitionEnd"
      >
        <slot>
          {{ text }}
        </slot>
      </div>
    </section>
  </div>
</template>

<style>
:root {
  --tg-base-marquee-height: 26px;
  --tg-base-marquee-padding: 0 0;
  --tg-base-marquee-text-color: var(--tg-text-lightgrey);
  --tg-base-marquee-font-size: 14px;
  --tg-base-marquee-line-height: 26px;
  --tg-base-marquee-background: transparent;
}
</style>

<style lang="scss" scoped>
.base-marquee {
  .marquee-wrap {
    height: var(--tg-base-marquee-height);
    padding: var(--tg-base-marquee-padding);
    color: var(--tg-base-marquee-text-color);
    font-size: var(--tg-base-marquee-font-size);
    line-height: var(--tg-base-marquee-line-height);
    background: var(--tg-base-marquee-background);
  }
}
</style>

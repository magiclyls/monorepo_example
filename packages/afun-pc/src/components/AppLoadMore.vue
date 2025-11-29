<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  loading: boolean
  finished: boolean
  autoLoad?: boolean
}

const props = withDefaults(defineProps<Props>(), { autoLoad: true })
const emits = defineEmits(['load'])

const sentinel = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

function handleLoad() {
  if (!props.loading && !props.finished) {
    emits('load')
  }
}

function observeAgain() {
  if (observer && sentinel.value && !props.finished) {
    observer.observe(sentinel.value)
  }
}

onMounted(() => {
  if (!props.autoLoad || !sentinel.value)
    return

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        // 进入视口后先取消观察，防止重复触发
        observer!.unobserve(entry.target)
        handleLoad()
      }
    },
    { 
      root: null, 
      rootMargin: '0px 0px 200px 0px', // 距底部 200px 提前加载
      threshold: 0 
    },
  )

  observer.observe(sentinel.value)
})

// 加载完成后重新监听
watch(() => props.loading, (loading) => {
  if (!loading)
    observeAgain()
})

// 全部加载完断开监听
watch(() => props.finished, (finished) => {
  if (finished)
    observer?.disconnect()
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<template>
  <div class="list-wrapper">
    <slot />
    <div ref="sentinel" style="height: 1px;" />
  </div>
</template>

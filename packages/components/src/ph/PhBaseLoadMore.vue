<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

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
  if (!props.loading && !props.finished)
    emits('load')
}

onMounted(() => {
  if (!props.autoLoad || !sentinel.value)
    return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting)
        handleLoad()
    },
    { root: null, rootMargin: '0px', threshold: 0.1 },
  )
  observer.observe(sentinel.value)
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

<style scoped>
.list-wrapper {
  /* 可以不用固定高度，让内容自然延伸 */
}
</style>

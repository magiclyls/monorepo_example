<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface Props {
  list: Array<Record<string, any>>
  type?: number
}

defineOptions({ name: 'AfunBaseScrollNotice' })
const props = withDefaults(defineProps<Props>(), {
  type: 1,
})
const emit = defineEmits(['onclick'])
const singleHight = 30
const wrapperRef = ref()
const translateY = ref(0)
/* 回到原点时候不要过度 */
const goingBack = ref(false)

function onclick(item: Record<string, any>) {
  emit('onclick', item)
}
function disableScroll() {
  wrapperRef.value?.addEventListener('wheel', (e: WheelEvent) => e.preventDefault(), { passive: false })
  wrapperRef.value?.addEventListener('touchmove', (e: TouchEvent) => e.preventDefault(), { passive: false })
}
let timer: NodeJS.Timeout | null = null
onMounted(() => {
  // 一条的时候不滚动
  if (!props.list?.length && props.list.length === 1)
    return
  timer = setInterval(() => {
    const length = props.list.length
    const maxTranslateY = length * singleHight
    if (maxTranslateY <= translateY.value) {
      goingBack.value = true
      setTimeout(() => {
        translateY.value = 0
      }, 50)
      return
    }
    goingBack.value = false
    translateY.value = singleHight + translateY.value
  }, 2000)
  disableScroll()
})

onBeforeUnmount(() => {
  timer && clearInterval(timer)
})
</script>

<template>
  <div class="overflow-hidden rounded-[6px]" :style="{ height: `${singleHight}px` }">
    <div
      ref="wrapperRef" class="flex flex-col h-full overflow-y-scroll hide-scrollbar"
      style="background: linear-gradient(90deg, rgba(254, 91, 96, 0.2) 0%, rgba(254, 91, 96, 0) 17.08%), rgb(238, 238, 255);"
    >
      <div
        :style="{ transform: `translate3d(0px, -${translateY}px, 0)`, transition: goingBack ? '' : 'transform 300ms' }"
      >
        <div
          v-for="item in list" :key="item.id" class="flex shrink-0 justify-between items-center px-[4px]"
          :style="{ height: `${singleHight}px` }" @click="onclick(item)"
        >
          <span class="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">{{ item.content_lang }}</span>
          <span class="text-[#F23038] text-[12px] font-semibold shrink-0">{{ item.title_lang }}</span>
        </div>
        <div
          class="flex shrink-0 justify-between items-center px-[4px]" :style="{ height: `${singleHight}px` }"
          @click="onclick(list?.[0])"
        >
          <span class="text-[12px] whitespace-nowrap overflow-hidden text-ellipsis">{{ list?.[0]?.content_lang }}</span>
          <span class="text-[#F23038] text-[12px] font-semibold shrink-0">{{ list?.[0]?.title_lang }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hide-scrollbar {
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>

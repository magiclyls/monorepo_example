<script setup lang="ts">
import { AfunBaseImage } from '@tg/bccomponents'
import { useWindowScroll } from '@vueuse/core'
import { throttle } from 'lodash'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

interface Props {
  list: Array<{ name: string, [key: string]: any }> | null
  active: string
  type?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 1,
})

const emit = defineEmits(['update:active', 'change'])

const { y: windowY } = useWindowScroll()

const scrollDwon = ref(false)
// dash计算数据
const parent = ref()
const curTabRef = ref<Array<Element | null>>([])
const dashWidth = ref()
const dashOffset = ref()

function change($event: MouseEvent, item: Record<string, any>, i: number) {
  emit('change', item.value)
  emit('update:active', item.value)
}

function scrollIntoView(ele: HTMLElement, container: HTMLElement) {
  if (!ele || !container)
    return

  const prev = ele.previousElementSibling as HTMLElement | null
  if (!prev)
    return

  const prevRect = prev.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  const offsetLeft = prevRect.left - containerRect.left
  const targetScrollLeft = container.scrollLeft + offsetLeft

  container.scrollTo({
    left: targetScrollLeft,
    behavior: 'smooth',
  })
}

let lastScrollTop = 0
let lastScrollDownTop = 0
const SCROLL_UP_THRESHOLD = 20
const SCROLL_DOWN_TRIGGER = 50
// 暂停监听
let ignoreScroll = false

const handleScroll = throttle(() => {
  const current = windowY.value
  if (ignoreScroll)
    return

  if (current > lastScrollTop) {
    // 往下滚
    if (current >= SCROLL_DOWN_TRIGGER) {
      scrollDwon.value = true
    }
    lastScrollDownTop = current
  }
  else if (current < lastScrollTop) {
    // 往上滚
    if ((lastScrollDownTop - current) >= SCROLL_UP_THRESHOLD) {
      scrollDwon.value = false
    }
  }

  lastScrollTop = current
}, 30, {
  leading: true,
  trailing: false,
})

function reset() {
  ignoreScroll = true
  windowY.value = 0
  lastScrollTop = 0
  lastScrollDownTop = 0
  setTimeout(() => {
    ignoreScroll = false
  }, 100) // 冷却期
}

function changeActiveUrl(path: string) {
  return path.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_active.webp`)
}

watch(() => props.active, () => {
  const i = props.list?.findIndex(item => props.active === item.value)
  if (i !== undefined && curTabRef.value && curTabRef.value[i] && parent.value && i !== undefined && i !== -1) {
    scrollIntoView(curTabRef.value[i] as HTMLElement, parent.value as HTMLElement)
    const parentRect = parent.value!.getBoundingClientRect()
    const childRect = curTabRef.value[i]!.getBoundingClientRect()
    dashWidth.value = `${childRect.width}px`
    const offsetLeft = childRect.left - parentRect.left + parent.value.scrollLeft
    dashOffset.value = offsetLeft
  }
  // reset()
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  if (curTabRef.value && curTabRef.value[0] && parent.value) {
    const parentRect = parent.value!.getBoundingClientRect()
    const childRect = curTabRef.value[0].getBoundingClientRect()
    dashWidth.value = `${childRect.width}px`
    const offsetLeft = childRect.left - parentRect.left + parent.value.scrollLeft
    dashOffset.value = offsetLeft
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div
    class="wrapper mt-[12px] w-full  overflow-hidden  text-[14px] rounded-[4px]"
  >
    <div class="overflow-hidden">
      <div ref="parent" class="overflow-scroll hide-scroll  relative items-center flex">
        <div
          v-for="item, index in list"
          ref="curTabRef" :key="item.name"
          class="relative shrink-0 flex px-[10px] h-[36px] justify-center items-center  cursor-pointer"
          :class="{ active: active === item.value }"
          @click="change($event, item, index)"
        >
          <div class="h-[18px] mr-[4px]">
            <AfunBaseImage v-show="active === item.value" class="h-[18px] w-[18px]" is-network :url="changeActiveUrl(item.icon)" />
            <AfunBaseImage v-show="active !== item.value" class="h-[18px] w-[18px]" is-network :url="item.icon" />
          </div>
          <span class="font-[600] text-[#B1BAD3]">{{ item.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active {
  background-color: #2f4553;
  border-radius: 4px;
  color: #fff;
  span {
    color: #fff;
  }
  // div {
  //   filter: brightness(10);
  // }
}
</style>

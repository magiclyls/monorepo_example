import type { Ref } from 'vue'
import { useElementSize, useWindowSize } from '@vueuse/core'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useWindowStore = defineStore('window', () => {
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const bodyRef = ref(document.body) // 直接引用 body
  const { width: bodyWidth } = useElementSize(bodyRef as Ref<HTMLElement>)

  /** 宽度边界 768 sm */
  const widthBoundarySm = ref(768)

  /** 右侧边栏宽度 */
  const rightWidth = computed(() => {
    if (bodyWidth.value > widthBoundarySm.value && bodyWidth.value < 1000)
      return '320px'

    else if (bodyWidth.value >= 1000)
      return '370px'

    else
      return ''
  })

  const isMobile = computed(() => bodyWidth.value <= widthBoundarySm.value)

  return {
    windowWidth,
    windowHeight,
    bodyWidth,
    rightWidth,
    isMobile,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useWindowStore, import.meta.hot))

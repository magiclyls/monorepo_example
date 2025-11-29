import { onMounted, onUnmounted, ref } from 'vue'

// 获取并自适应窗口高度
export function useWindowHeightRem() {
  const heightRem = ref(0)

  const updateHeight = () => {
    const root = document.documentElement
    const rem = Number.parseFloat(getComputedStyle(root).fontSize)
    const hRem = window.innerHeight / rem

    heightRem.value = hRem
    root.style.setProperty('--window-height-rem', `${hRem}rem`)
  }

  onMounted(() => {
    updateHeight()
    window.addEventListener('resize', updateHeight)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateHeight)
  })

  return { heightRem }
}

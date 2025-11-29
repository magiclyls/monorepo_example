import { onBeforeUnmount, onMounted } from 'vue'

export function useHideKeyboard(inputSelector = 'input, textarea') {
  let startY = 0

  function isMobile() {
    const ua = navigator.userAgent
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  }
  function blurActiveInput() {
    const active = document.activeElement as HTMLElement | null
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      active.blur()
    }
  }

  function handleTouchStart(e: TouchEvent) {
    startY = e.touches[0].clientY
  }

  function handleTouchMove(e: TouchEvent) {
    const moveY = e.touches[0].clientY
    if (startY - moveY > 30) {
      blurActiveInput()
    }
  }

  function handleClick(e: MouseEvent) {
    const target = e.target as HTMLElement
    if (!target.closest(inputSelector)) {
      blurActiveInput()
    }
  }

  onMounted(() => {
    if (!isMobile())
      return
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('click', handleClick, true)
  })

  onBeforeUnmount(() => {
    if (!isMobile())
      return
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('click', handleClick, true)
  })
}

import { onMounted, onUnmounted } from 'vue'

function getScrollTop() {
  return window.pageYOffset
    || document.documentElement.scrollTop
    || document.body.scrollTop
}

export function useKeyboardViewportFix() {
  let keyboardHeight = 0
  let blurTimer: number | null = null
  let scrollTop = getScrollTop()
  let focusTimer: number | null = null

  function onResize() {
    const currentHeight = window.visualViewport?.height || 0
    keyboardHeight = currentHeight
  }

  function onFocusOut() {
    blurTimer = window.setTimeout(() => {
      const currentHeight = window.visualViewport?.height || keyboardHeight
      if (Math.abs(currentHeight - keyboardHeight) <= 10) {
        if (scrollTop < 80) {
          window.scrollTo({
            top: 1,
            left: 0,
          })
          window.scrollTo({
            top: 0,
            left: 0,
          })
        }
        else {
          window.scrollTo({
            left: 0,
            top: scrollTop + 1,
            behavior: 'smooth',
          })
        }
      }
    }, 120)
  }

  function onFocusIn() {
    if (blurTimer) {
      clearTimeout(blurTimer)
      blurTimer = null
    }

    if (focusTimer) {
      clearTimeout(focusTimer)
      focusTimer = null
      return
    }

    focusTimer = window.setTimeout(() => {
      scrollTop = getScrollTop()
    }, 80)
  }

  onMounted(() => {
    window.visualViewport?.addEventListener('resize', onResize)
    document.addEventListener('focusout', onFocusOut)
    document.addEventListener('focusin', onFocusIn)
  })

  onUnmounted(() => {
    window.visualViewport?.removeEventListener('resize', onResize)
    document.removeEventListener('focusout', onFocusOut)
    document.removeEventListener('focusin', onFocusIn)
  })
}

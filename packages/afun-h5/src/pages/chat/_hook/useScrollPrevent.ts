import { fill } from 'lodash'
import { ref } from 'vue'

export function useScrollPrevent() {
  const hasNotReachTop = ref<Array<boolean | undefined>>([])
  const hasNotReachBottom = ref<Array<boolean | undefined>>([])

  function lockScroll(els?: any) {
    let touchStartCount = 0
    if (els && els.length) {
      const arrayNodes = [].slice.call(els, 0)
      arrayNodes.reverse()
      arrayNodes.forEach((el: HTMLElement, idx: number) => {
        let initialY = 0
        let initialX = 0
        let maxYDistance = 0
        let maxXDistance = 0
        let isScrollYDirection = false
        let isScrollXDirection = false
        el.addEventListener('touchstart', (e) => {
          touchStartCount = touchStartCount + 1
          hasNotReachTop.value = fill(Array.from({ length: touchStartCount }), undefined)
          hasNotReachBottom.value = fill(Array.from({ length: touchStartCount }), undefined)
          maxYDistance = 0
          maxXDistance = 0
          isScrollYDirection = false
          isScrollXDirection = false
          if (e.targetTouches.length === 1) {
            // 单点滑动
            initialY = e.targetTouches[0].clientY
            initialX = e.targetTouches[0].clientX
          }
        }, { passive: false })
        el.addEventListener('touchmove', (e) => {
          if (e.targetTouches.length === 1) {
            // 单点滑动
            const cy = e.targetTouches[0].clientY
            const cx = e.targetTouches[0].clientX
            const clientY = cy - initialY
            const clientX = cx - initialX
            if (Math.abs(clientY) >= maxYDistance)
              maxYDistance = Math.abs(clientY)

            if (Math.abs(clientX) >= maxXDistance)
              maxXDistance = Math.abs(clientX)

            isScrollYDirection = maxYDistance >= maxXDistance
            isScrollXDirection = maxXDistance >= maxYDistance

            if (isScrollYDirection) {
              if (el.scrollTop + el.clientHeight >= el.scrollHeight && clientY < 0) {
                hasNotReachBottom.value[idx] = true
                if (hasNotReachBottom.value.filter(h => h === false).length)
                  return
                // 向下滑至底部
                e.preventDefault()
              }
              else if (el.scrollTop <= 0 && clientY > 0) {
                hasNotReachTop.value[idx] = true
                if (hasNotReachTop.value.filter(h => h === false).length)
                  return
                // 向上滑至顶部
                e.preventDefault()
              }
              else {
                hasNotReachTop.value[idx] = false
                hasNotReachBottom.value[idx] = false
              }
            }
          }
        }, { passive: false })
        el.addEventListener('touchend', (e) => {
          touchStartCount = 0
        }, { passive: false })
      },
      )
    }
  }

  return {
    lockScroll,
  }
}

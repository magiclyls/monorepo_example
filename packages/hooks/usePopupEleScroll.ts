import type { Ref } from 'vue'
import { onBeforeUnmount, unref, watch } from 'vue'

// ios滚动穿透处理
type ElementType = HTMLElement | undefined
export function usePopupEleScroll(ScrollElementRef: Ref<ElementType>) {
  let startY = 0
  let startX = 0
  const handleTouchStart = (e: TouchEvent) => onTouchStart(e)
  const handleTouchMove = (e: TouchEvent) => onTouchMove(e, unref(ScrollElementRef)!)

  // 监听元素变化
  watch(ScrollElementRef, (val) => {
    if (!val)
      return
    val.addEventListener('touchstart', handleTouchStart, { passive: true })
    val.addEventListener('touchmove', handleTouchMove, { passive: false })
  }, { immediate: true })

  // 清理
  onBeforeUnmount(() => {
    if (!ScrollElementRef.value)
      return
    ScrollElementRef.value.removeEventListener('touchstart', handleTouchStart)
    ScrollElementRef.value.removeEventListener('touchmove', handleTouchMove)
  })

  function onTouchStart(e: TouchEvent) {
    const t = e.touches[0]
    startY = t.clientY
    startX = t.clientX
  }

  function onTouchMove(e: TouchEvent, el: HTMLElement) {
    if (!el)
      return
    const t = e.touches[0]
    const deltaY = t.clientY - startY
    const deltaX = t.clientX - startX

    // 若是水平滑动优先，放行（避免影响横向滑动）
    if (Math.abs(deltaX) > Math.abs(deltaY))
      return

    const atTop = el.scrollTop === 0
    // 允许误差 1px，避免小数问题
    const atBottom = Math.abs(el.scrollHeight - el.clientHeight - el.scrollTop) <= 1

    // 在顶部向下滑（deltaY>0）或底部向上滑（deltaY<0）时阻止默认，避免冒泡到 body 导致整页滚动
    if ((atTop && deltaY > 0) || (atBottom && deltaY < 0)) {
      e.preventDefault()
    }
    // 其余情况不 prevent，让容器正常滚动
  }
}

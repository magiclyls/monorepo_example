<script setup lang='ts'>
import { GAMES_LIST_ENUM } from 'feie-ui'

window.addEventListener('beforeunload', () => {
  document.querySelector('.tg-crash-outer')?.classList.add('hidden-local')
})

onBeforeRouteLeave(() => {
  document.querySelector('.tg-crash-outer')?.classList.add('hidden-local')
})

const hasNotReachTop = ref<Array<boolean | undefined>>([])
const hasNotReachBottom = ref<Array<boolean | undefined>>([])

const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'

usePageTitle({
  prefix: 'Crash',
})

function lockScroll(els?: any) {
  const touchStartCount = 0
  if (els && els.length) {
    const arrayNodes = [].slice.call(els, 0)
    arrayNodes.reverse()
    arrayNodes.forEach((el: HTMLElement, idx: number) => {
      const initialY = 0
      const initialX = 0
      let maxYDistance = 0
      let maxXDistance = 0
      let isScrollYDirection = false
      let isScrollXDirection = false
      el.addEventListener(wheelEvent, (e: any) => {
        // 单点滑动
        const cy = e.wheelDeltaY
        const cx = e.clientX
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
      }, { passive: false })
    },
    )
  }
}

onMounted(() => {
  setTimeout(() => {
    lockScroll(document.querySelectorAll('.ranking-table .scroll-y'))
  }, 2000)
})
</script>

<template>
  <AppMiniGamePublicWrap :game="GAMES_LIST_ENUM.CRASH">
    <div class="tg-crash-outer">
      <AppMiniGameMainCrash />
    </div>
  </AppMiniGamePublicWrap>
</template>

<style lang='scss' scoped>

</style>

<route lang="yaml">
meta:
  layout: home
</route>

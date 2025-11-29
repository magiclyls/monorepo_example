<script lang="ts" setup>
// import Swiper from 'swiper'
import 'swiper/css'

// let marqueeItemIndex = 0
// const route = useRoute()
// const curMarqueeRef = ref<Array<any>>([])
// const swiper = ref()
const scrollWidth = ref(0)
const marqueeContainer = ref<HTMLElement>()

const { marqueeData } = storeToRefs(useNoticeStore())

// async function initSwiper() {
//   marqueeItemIndex = 0
//   setTimeout(() => {
//     swiper.value = new Swiper('.notice-swiper', {
//       direction: 'vertical',
//       loop: true,
//       autoplay: false,
//       allowTouchMove: false,
//     })
//     setTimeout(() => {
//       curMarqueeRef.value[marqueeItemIndex]?.start(marqueeItemIndex)
//     }, 2000)
//   }, 0)
// }
//
// function marqueeEnd() {
//   marqueeItemIndex++
//   if (marqueeItemIndex > marqueeData.value.length - 1)
//     marqueeItemIndex = 0
//   nextTick(() => {
//     setTimeout(() => {
//       swiper.value?.slideNext()
//       setTimeout(() => {
//         curMarqueeRef.value[marqueeItemIndex]?.start(marqueeItemIndex)
//       }, 100)
//     }, 0)
//   })
// }

onMounted(() => {
  if (marqueeContainer.value)
    scrollWidth.value = marqueeContainer.value.scrollWidth
})
//
// onMounted(() => {
//   setTimeout(() => {
//     initSwiper()
//   }, 2000)
// })
//
// onBeforeUnmount(() => {
//   swiper.value?.destroy()
// })
//
// watch(route, (val) => {
//   if ((val.name === 'casino-home' || val.path === '/')) {
//     nextTick(() => {
//       initSwiper()
//     })
//   }
//   else {
//     marqueeItemIndex = 0
//     swiper.value?.destroy()
//   }
// })
// watch(marqueeData, (val) => {
//   nextTick(() => {
//     setTimeout(() => {
//       if (!val || val.length === 0)
//         swiper.value?.destroy()
//       if (val && val.length)
//         initSwiper()
//     }, 0)
//   })
// }, { immediate: true })
</script>

<template>
  <div ref="marqueeContainer" class="notice-wrap overflow-hidden">
    <div class="inner">
      <div class="relative h-[26px]">
        <div style="height: 100%">
          <AppMarqueeNew>
            <div v-for="(item, idx) in marqueeData" :key="idx" :style="{ paddingRight: `${scrollWidth}px` }">
              <div class="content-lang">
                {{ item.title_lang }} - {{ item.content_lang }}
              </div>
            </div>
          </AppMarqueeNew>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.content-lang {
  width: 100%;
  @include webTheme('greenblack') {
    color: #fff;
    font-size: 12px;
  }
  @include webTheme('white') {
    font-size: 16px;
  }
  @include webTheme('new-default') {
    color: #fff;
    font-size: 16px;
  }
}
</style>

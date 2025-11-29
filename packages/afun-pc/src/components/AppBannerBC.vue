<script setup lang="ts">
interface Props {
  type?: 'casino' | 'sports'
}
defineOptions({
  name: 'AppBannerBC',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'casino',
})

const { appContentWidth } = storeToRefs(useWindowStore())
const { isMobile } = storeToRefs(useWindowStore())
const { bannerList, fetchDataOrLoadImage } = useBanner()

const mgt = computed(() => {
  if (appContentWidth.value < 600)
    return '0'
  else
    return 'var(--tg-spacing-16)'
})

await application.allSettled([fetchDataOrLoadImage(props.type)])
</script>

<template>
  <div
    class="app-banner" :style="{
      marginTop: mgt,
    }"
  >
    <BaseSwipeBC v-if="bannerList && bannerList.length" :items="bannerList" :slides-per-view="isMobile ? 1 : 3" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.swiper.swiper-initialized) {
  border-radius: var(--tg-radius-md);
  overflow: hidden;
}
</style>

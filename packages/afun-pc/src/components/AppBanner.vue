<script setup lang="ts">
interface Props {
  type?: 'casino' | 'sports'
}
defineOptions({
  name: 'AppBanner',
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
    return 'var(--tg-spacing-12)'
})

await application.allSettled([fetchDataOrLoadImage(props.type)])
</script>

<template>
  <div
    class="app-banner" :style="{
      marginTop: mgt,
    }"
  >
    <BaseSwipeH5
      v-if="isMobile && bannerList && bannerList.length" :items="bannerList"
      :style="`--tg-swipe-h5-wrapper-height:${appContentWidth / 2}px`"
    />
    <BaseSwipe v-else-if="bannerList && bannerList.length" :items="bannerList" />
  </div>
</template>

<style lang="scss" scoped>
</style>

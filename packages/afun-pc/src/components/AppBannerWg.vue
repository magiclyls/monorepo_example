<script setup lang="ts">
import type { BannerItem } from '~/types'
import { ApiMemberBannerV2List } from '@tg/apis'

interface Props {
  type?: 'casino' | 'sports'
}
defineOptions({
  name: 'AppBannerWg',
})
const props = withDefaults(defineProps<Props>(), {
  type: 'casino',
})
const { isLogin } = storeToRefs(useAppStore())
const { appContentWidth } = storeToRefs(useWindowStore())
const { isMobile } = storeToRefs(useWindowStore())
const {
  runAsync: runMemberBannerV2List,
  data: bannerList,
} = useRequest(ApiMemberBannerV2List)

const mgt = computed(() => {
  if (appContentWidth.value < 600)
    return '0'
  else
    return 'var(--tg-spacing-12)'
})

const items = computed(() => {
  if (bannerList.value === undefined || bannerList.value.length === 0)
    return []

  return bannerList.value.map<BannerItem>((item) => {
    const bannerInfo = item.banner_info
    const temp: BannerItem = {
      promo_info: item.promo_info,
      imgUrl: item.jump_url,
      type: item.jump_type,
      jumpState: item.jump_state,
      backgroundUrl: bannerInfo.background,
      rightImageUrl: bannerInfo.icon,
      content: bannerInfo.content ? bannerInfo.content[getCurrentLanguageForBackend()] : '',
      align: item.banner_style === 1 ? 'left' : 'right',
      banner_style: item.banner_style,
      title: bannerInfo.title ? bannerInfo.title[getCurrentLanguageForBackend()] : '',
      superscript: bannerInfo.superscript ? bannerInfo.superscript[getCurrentLanguageForBackend()] : '',
      banner_style3_background: item.banner_url ? item.banner_url[getCurrentLanguageForBackend()] : '',
      button: bannerInfo.button_state === 1
        ? {
            text: bannerInfo.button_content ? bannerInfo.button_content[getCurrentLanguageForBackend()] : '',
            url: bannerInfo.button_jump_url,
            type: bannerInfo.button_jump_type,
          }
        : undefined,
    }
    if (item.banner_style === 3 && bannerInfo.pic_mode_setting && bannerInfo.pic_mode_setting.config && [1, 2].includes(bannerInfo.pic_mode_setting.mode)) {
      const config = bannerInfo.pic_mode_setting.mode === 1 ? bannerInfo.pic_mode_setting?.config[getCurrentLanguageForBackend()] : bannerInfo.pic_mode_setting?.config.all
      if (config)
        return { ...temp, imgUrl: config.jump_url, type: config.jump_type, jumpState: config.jump_state }
    }
    return temp
  }).filter(a => a.banner_style === 3 ? !!a.banner_style3_background : true).filter((item) => {
    if (item.promo_info.display_mode === 1 && !isLogin.value)
      return false
    if (item.promo_info.display_mode === 3)
      return false
    return true
  })
})

function fetchDataOrLoadImage() {
  return new Promise((resolve, reject) => {
    runMemberBannerV2List({
      banner_type: props.type === 'casino' ? 1 : 2,
    }).then(async () => {
      const urls = items.value.reduce<Promise<any>[]>((acc, item) => {
        if (item.banner_style === 3)
          acc.push(application.loadImage(item.banner_style3_background))

        else
          acc.push(application.loadImage(item.backgroundUrl), application.loadImage(item.rightImageUrl))

        return acc
      }, [])
      await application.allSettled(urls)
      resolve(true)
    }).catch(() => {
      reject(new Error('fetch data error'))
    })
  })
}

await application.allSettled([fetchDataOrLoadImage()])
</script>

<template>
  <div
    class="app-banner" :style="{
      marginTop: mgt,
    }"
  >
    <BaseSwipeH5Wg v-if="isMobile && items && items.length" :items="items" style="--tg-swipe-h5-wrapper-height:6.5625rem" :slides-per-view="1" />
    <BaseSwipe v-else-if="items && items.length" :items="items" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.swiper.swiper-initialized) {
  border-radius: var(--tg-radius-md);
  overflow: hidden;
}
</style>

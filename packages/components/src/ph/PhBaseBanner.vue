<script setup lang="ts">
import type { BannerItem } from '@tg/types'
import { useRedirect } from '@tg/hooks'
import { getEnv } from '@tg/utils'
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onActivated, onDeactivated, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseImage from '../BaseImage.vue'
import BaseAspectRatio from '../bc-game/BaseAspectRatio.vue'
import 'swiper/css'
import 'swiper/css/pagination'

interface Props {
  items: BannerItem[]
  slidesPerView?: number
}

defineOptions({ name: 'PhBaseBanner' })
const props = withDefaults(defineProps<Props>(), {
  slidesPerView: 1,
})

const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const { jumpToUrl } = useRedirect()
const { t } = useI18n()

const swiperInstance = ref<any>(null)
const modules = ref([Navigation, Scrollbar, A11y, Autoplay, Pagination])
const pagination = ref({
  clickable: true,
  renderBullet(index: any, className: string) {
    return `<span class="${className}"></span>`
  },
})

const errorList = ref<boolean[]>(Array.from({ length: props.items.length }, () => true))

function onSwiper(swiper: object) {
  swiperInstance.value = swiper
  // console.log(swiper)
}

function onSlideChange() {
  // console.log('slide change')
}

onActivated(() => {
  setTimeout(() => {
    const autoplay = swiperInstance.value?.autoplay
    if (autoplay && typeof autoplay.start === 'function')
      autoplay.start()
  }, 100)
})

onDeactivated(() => {
  const autoplay = swiperInstance.value?.autoplay
  if (autoplay && typeof autoplay.stop === 'function')
    autoplay.stop()
})
</script>

<template>
  <BaseAspectRatio ratio="355/110">
    <Swiper
      :pagination="pagination"
      :space-between="10"
      :slides-per-view="slidesPerView"
      :modules="modules"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }"
      :loop="true"
      navigation
      :scrollbar="{ draggable: true }"
      class="rounded-[10rem] w-full h-full overflow-hidden"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <SwiperSlide
        v-for="item, i in items"
        :key="i" class="w-full h-full" @click="jumpToUrl({
          type: item.type ?? 1,
          jumpUrl: item.imgUrl ?? '',
          jumpState: item.jumpState,
          promo_info: item.promo_info,
        })"
      >
        <!-- :style="{
            'background-image': `url(${VITE_CASINO_IMG_CLOUD_URL}/${item.banner_style === 3 ? item.banner_style3_background : item.backgroundUrl})`,
            'backgroundSize': 'cover',
            'backgroundRepeat': 'no-repeat',
            'backgroundPosition': 'center',
          }" -->
        <div class="w-full h-full rounded-[10px] overflow-hidden">
          <BaseImage
            v-if="errorList[i]" is-network
            :url="`/${item.banner_style === 3 ? item.banner_style3_background : item.backgroundUrl}`"
            loading="eager" class="w-full h-full"
            fit="cover" @error-img="errorList[i] = false"
          />
          <div v-else class="bg-[#EBEBEB] text-[#9DABC9] w-full h-full center flex-col">
            <BaseImage class="mb-[6rem]" url="/ph-h5/png/game-img-error.png" width="24rem" height="24rem" />
            <span class="text-[12rem]">{{ t('加载失败了x_x') }}</span>
          </div>
          <!-- banner_style = 3 直接使用图片   1的时候 要自己组装 -->
          <!-- <template v-if="item.banner_style !== 3">
          <div class="other" :class="[item.align === 'left' ? 'other-left' : 'other-right']">
            <div
              class="banner-content" :class="{
                'banner-content-left': item.align === 'left',
                'banner-content-right': item.align === 'right',
              }"
            >
              <div class="name">
                {{ item.superscript }}
              </div>
              <div class="banner-content-text" v-html="item.content" />
            </div>
            <div>
              <button
                v-if="item.button"
                class="relative min-w-[120rem] rounded-[4rem] p-[12rem] text-[#fff] h-[40rem] center top-[-3rem] border border-solid border-[#fff]" @click.stop="jumpToUrl({
                  type: item.button?.type ?? 1,
                  jumpUrl: item.button?.url ?? '',
                })"
              >
                {{ item.button.text }}
              </button>
            </div>
          </div>
          <div
            v-if="item.rightImageUrl" class="right-icon"
            :class="[item.align === 'left' ? 'right-icon-right' : 'right-icon-left']"
          >
            <img class="right-img" :src="`${VITE_CASINO_IMG_CLOUD_URL}/${item.rightImageUrl}`" alt="">
          </div>
        </template> -->
        </div>
      </SwiperSlide>
    </Swiper>
  </BaseAspectRatio>
</template>

<style lang="scss">
:root {
  --swiper-pagination-color: rgba(255, 255, 255, 1);
  --swiper-pagination-bullet-inactive-color: rgba(255, 255, 255, 0.4);
  --swiper-pagination-bullet-width: 4px;
  --swiper-pagination-bullet-height: 4px;
  --swiper-pagination-bullet-inactive-opacity: 0.4;
}

.swiper-pagination-bullet-active {
  --swiper-pagination-bullet-width: 9px;
  border-radius: 10px;
}
</style>

<style scoped lang="scss">
.other {
  position: absolute;
  top: 0;
  width: 66%;
  height: 100%;
  padding: 10rem 12rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 10;

  &.other-left {
    left: 0;
  }

  &.other-right {
    right: 0;
    // text-align: right;
    padding-left: 16rem;
  }
}

.banner-content {
  line-height: 1.3;
  height: 0;
  flex: 1;
  max-width: 200rem;
  overflow: hidden;

  &.banner-content-left {
    padding-right: 3rem;
  }

  &.banner-content-right {
    padding-left: 3rem;
  }
}

.banner-content-text {
  overflow: hidden;
  font-size: 14rem;
  padding-right: 2rem;
}

.name {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 3rem;
  padding: 0 4rem;
  font-feature-settings: 'tnum';
  white-space: nowrap;
  line-height: 1.5;
  background-color: #fff;
  font-size: 12rem;
  margin-bottom: 6rem;
}

.right-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 46%;
  display: flex;
  align-items: center;

  .right-img {
    width: auto;
    height: 100%;
  }
}

.right-icon-left {
  left: 0;
  justify-content: flex-start;
  padding: 16rem;
}

.right-icon-right {
  right: 0;
  justify-content: flex-end;
  padding: 16rem;
}
</style>

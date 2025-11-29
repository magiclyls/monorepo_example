<script lang="ts" setup name="BaseSwipeH5">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { A11y, Autoplay, Navigation, Scrollbar } from 'swiper/modules'
import type { BannerItem } from '~/types'
import { IconUniArrowLeft, IconUniArrowRight } from '@tg/icons';
import { getEnv } from '@tg/utils';
// Import Swiper styles
import 'swiper/css'

import 'swiper/css/pagination'

interface Props {
  items: BannerItem[]
  slidesPerView?: number
}

const props = withDefaults(defineProps<Props>(), {
  slidesPerView: 1.05, // 旧版是1.05，不同主题有用不同的组件，可全局搜索此处
})

const heroContentRef = ref<HTMLElement | null>(null)
const { appContentWidth } = storeToRefs(useWindowStore())
const { bool: isShowLeftArrow, setBool: setLeftArrowStatus } = useBoolean(false)
const { bool: isShowRightArrow, setBool: setRightArrowStatus } = useBoolean(true)
const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
const { jumpToUrl } = useRedirect()
const modules = ref([Navigation, Scrollbar, A11y, Autoplay])
const swiperInstance = ref<any>(null)

const pagination = ref({
  clickable: true,
  renderBullet(index: any, className: string) {
    return `<span class="${className}"></span>`
  },
})

function onSwiper(swiper: object) {
  swiperInstance.value = swiper
  // console.log(swiper)
}
function onSlideChange() {
  // console.log('slide change')
}

onMounted(() => {
  // handleScroll()
})

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
  <div class="hero-wrapper">
    <div class="" :class="props.items.length == 1 ? 'un-after' : ''">
      <!--
      :free-mode="true"
      -->
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
        :loop="true" navigation
        :scrollbar="{ draggable: true }"
        @swiper="onSwiper"
        @slide-change="onSlideChange"
      >
        <SwiperSlide
          v-for="item, i in props.items" :key="i" :style="{
            'background-image': `url(${VITE_CASINO_IMG_CLOUD_URL}/${item.banner_style === 3 ? item.banner_style3_background : item.backgroundUrl})`,
            // 'background-image': `url(/webp/banner.webp)`,
            'backgroundSize': '100% 100%',
            'backgroundRepeat': 'no-repeat',
            'backgroundPosition': 'center',
          }" class="hero" :class="props.items.length == 1 ? 'un-margin' : ''" @click="jumpToUrl({
            type: item.type ?? 1,
            jumpUrl: item.imgUrl ?? '',
            jumpState: item.jumpState,
            promo_info: item.promo_info,
          })"
        >
          <div class="center wrapper" />
          <template v-if="item.banner_style !== 3">
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
                <!-- <div class="title">
                  {{ item.title }}
                </div> -->
                <div class="banner-content-text">
                  <BaseRichArea :content="item.content" />
                </div>
              </div>
              <div class="btn-flex mt-[1px]">
                <BaseButton
                  v-if="item.button"
                  class="relative top-[-3px]" type="line" @click.stop="jumpToUrl({
                    type: item.button?.type ?? 1,
                    jumpUrl: item.button?.url ?? '',
                  })"
                >
                  {{ item.button.text }}
                </BaseButton>
              </div>
            </div>
            <div
              v-if="item.rightImageUrl" class="right-icon"
              :class="[item.align === 'left' ? 'right-icon-right' : 'right-icon-left']"
            >
              <img class="right-img" :src="`${VITE_CASINO_IMG_CLOUD_URL}/${item.rightImageUrl}`" alt="">
            </div>
          </template>
        </SwiperSlide>

        <div class="arrow-left arrow">
          <!-- @click="scrollLeft" -->
          <button class="grid-heroes-button" data-testid="heroes-scroll-left">
            <IconUniArrowLeft name="uni-arrow-left" />
          </button>
        </div>
        <div class="arrow arrow-right">
          <!-- @click="scrollRight" -->
          <button class="grid-heroes-button" data-testid="heroes-scroll-right">
            <IconUniArrowRight name="uni-arrow-right" />
          </button>
        </div>
      </Swiper>
    </div>
  </div>
</template>

<style>
:root {
  --tg-swipe-h5-wrapper-height: 10rem;
}
</style>

<style lang="scss" scoped>
.hero-wrapper {
  container-type: inline-size;
  container-name: grid-size;
  --sick-fade-stamp-of-ed-approval: linear-gradient(90deg, transparent 0, var(--tg-primary-main) 4px, var(--tg-primary-main) calc(100% - 4px), transparent 100%);
  --standard-lockup-shadow-offset: 6px;
}

.grid-heroes {
  width: 100%;
  display: flex;
  position: relative;

  &:hover {
    .arrow {
      opacity: 1 !important;
    }
  }
}

.hero-content {
  display: grid;
  grid-auto-flow: column;
  padding-top: 12px;
  padding-bottom: 2px;
  // overflow-x: auto;
  // scroll-snap-type: x mandatory;
  // scroll-behavior: smooth;
  width: 100%;
  position: relative;
  -moz-column-gap: 16px;
  column-gap: 16px;
}
:deep(.swiper-wrapper) {
  // display: grid;
  // grid-auto-flow: column;
  padding-top: 12px;
  padding-bottom: 2px;
  // overflow-x: auto;
  // scroll-snap-type: x mandatory;
  // scroll-behavior: smooth;
  width: 100%;
  position: relative;
  // -moz-column-gap: 16px;
  // column-gap: 16px;
  // grid-auto-columns: calc(95.24% - 0.6875rem);
}

.hero {
  scroll-snap-align: start;
  overflow: hidden;
  container-type: inline-size;
  container-name: card-size;
  display: flex;
  flex-direction: column;
  position: relative;
  color: var(--tg-text-white);
  background: var(--tg-secondary-grey);
  border-radius: var(--tg-radius-md);
  cursor: pointer;
  background-size: cover;

  // .wrapper {
  //   width: 100%;
  // }
}

.hero-content .hero:last-child {
  margin-right: 8px !important;
}

.hero-content .un-margin:last-child {
  margin-right: 0 !important;
}

.arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  top: 0;
  opacity: 0;
  transition: opacity .2s;
  font-size: var(--tg-font-size-xl);
  --tg-icon-color: var(--tg-text-white);
}

.arrow-right {
  left: calc(100% - 8px);

  .grid-heroes-button {
    padding: 12px 32px 0 16px;
    height: 100%;
  }
}

.arrow-left {
  right: calc(100% - 8px);

  .grid-heroes-button {
    padding: 12px 16px 0 32px;
    height: 100%;
  }
}

.other {
  position: absolute;
  top: 0;
  width: 66%;
  height: 100%;
  padding: 10px var(--tg-spacing-button-padding-horizontal-xs);
  --tg-base-button-line-hover-color: rgba(255, 255, 255, 0.1);
  --tg-base-button-min-width: 120px;
  --tg-base-button-max-width: 170px;
  --tg-base-button-line-active-color: none;
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
    padding-left: 16px;
  }
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
  padding: 16px;
}

.right-icon-right {
  right: 0;
  justify-content: flex-end;
  padding: 16px;
}

.wrapper {
  height: var(--tg-swipe-h5-wrapper-height);
}

.btn-flex {
  display: flex;

  &>* {
    text-align: left;
  }
}

.banner-content {
  line-height: 1.3;
  height: 0;
  flex: 1;
  max-width: 200px;
  overflow: hidden;

  &.banner-content-left {
    padding-right: 3px;
  }

  &.banner-content-right {
    padding-left: 3px;
  }
}

.banner-content-text {
  overflow: hidden;
  font-size: 14px;
  padding-right: 2px;
}

.name {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tg-secondary-deepdark);
  border-radius: 3px;
  padding: 0 4px;
  font-feature-settings: "tnum";
  white-space: nowrap;
  line-height: 1.5;
  background-color: var(--tg-text-white);
  font-size: 12px;
  margin-bottom: 6px;
}

.title {
  color: var(--tg-text-white);
  font-size: 18px;
  line-height: 130%;
  font-weight: var(--tg-font-weight-bold);
  padding: 8px 0 4px 0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  word-wrap: break-word;
  word-break: break-all;
  // white-space: nowrap;
}

@container grid-size (width < 50rem) {
  .grid-heroes:after {
    content: "";
    position: absolute;
    top: 0;
    right: calc(16px*-1);
    bottom: 0;
    width: 28px;
    background-image: var(--sick-fade-stamp-of-ed-approval);
    z-index: 10
  }

  .un-after:after {
    content: "";
    background-image: unset;
  }

  .hero-content {
    -moz-column-gap: 8px;
    column-gap: 8px
  }

  .hero-content>.hero:last-of-type {
    margin-right: 4px
  }

  .banner-content-text {
    -webkit-line-clamp: 2;
  }
}

// @container card-size (width > 18.875rem) {
//   .right-icon {
//     width: 54%;
//   }

//   .right-icon-right {
//     padding: 12px;
//   }
// }

// @container card-size (width > 21.5rem) {
//   .wrapper {
//     height: 12rem;
//   }

//   .right-icon {
//     width: 56%;
//   }

//   .other {
//     width: 62%;
//     padding: var(--tg-spacing-button-padding-horizontal-sm);
//   }

//   .right-icon-right {
//     padding: 16px;
//   }
// }

// @container card-size (width > 24.5rem) {

//   .right-icon {
//     width: 50%;
//   }
// }

// @container card-size (width > 28rem) {
//   .right-icon {
//     width: 48%;
//   }
// }

:deep(.swiper-pagination) {
 bottom: 6px;
}
:deep(.swiper-pagination-bullet) {
  color: #000;
  background: #67737a;
  width: 23px;
  height: 5px;
  gap: 0px;
  border-radius: 16px;
  opacity: 0.3;

}

:deep(.swiper-pagination-bullet-active) {
  color: #fff;
  background: #fff;
  opacity: 1;
}
</style>

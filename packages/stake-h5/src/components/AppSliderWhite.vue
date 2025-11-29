<script lang="ts" setup name="app-slider">
import { IconUniArrowLeft, IconUniArrowRight, IconEmptyGame } from '@tg/icons'
interface Props {
  icon?: string
  title: string
  data: Array<any>
  showViewAll?: boolean
  showArrow?: boolean
  gameType?: string
  ty?: number
  cid?: string
  pid?: string
  useCloudImg?: boolean
  path?: string
  showManCount?: boolean
  total?: number
}
defineOptions({
  name: 'AppSliderWg',
})
const props = withDefaults(defineProps<Props>(), {
  showViewAll: true,
  showArrow: true,
})

const router = useLocalRouter()
const { appContentWidth } = storeToRefs(useWindowStore())
const { theme } = storeToRefs(useAppStore())
const { t } = useI18n()

const pageInfo = reactive({
  total: 0,
  pageSize: 0,
  page: 1,
})
const sliderOuter = ref()
const gallery = ref()
const galleryClass = ref('')
const itemWidthPercent = ref(0) // 百分比

const { x } = useScroll(gallery, { behavior: 'smooth' }) // , isScrolling, arrivedState, directions

const outerWidth = computed(() => appContentWidth.value)
const pageWidth = computed(() =>
  pageInfo.pageSize * itemWidthPercent.value * outerWidth.value)
const isEnd = computed(() => {
  if (props.data) {
    const temp = (x.value + outerWidth.value)
      / (itemWidthPercent.value * outerWidth.value)
    return temp >= props.data.length - 0.1
  }
})
const scrollLeftItemsCount = computed(() => {
  return Math.round(x.value / (itemWidthPercent.value * outerWidth.value))
})

function nextPage() {
  x.value += pageWidth.value
}

function prevPage() {
  const temp = x.value - pageWidth.value
  if (temp > 0)
    x.value = temp
  else
    x.value = 0
}

function goAllPage() {
  onTitleClick()
}
function onTitleClick() {
  if (props.path)
    router.push(props.path)
}

watchEffect(() => {
  if (outerWidth.value >= 1150) {
    itemWidthPercent.value = 0.1333
    galleryClass.value = 'gallery-1150'
    pageInfo.pageSize = 7
  }
  else if (outerWidth.value >= 1000) {
    itemWidthPercent.value = 0.1538
    galleryClass.value = 'gallery-1150-1000'
    pageInfo.pageSize = 6
  }
  else if (outerWidth.value >= 850) {
    itemWidthPercent.value = 0.1818
    galleryClass.value = 'gallery-1000-850'
    pageInfo.pageSize = 5
  }
  else if (outerWidth.value >= 700) {
    itemWidthPercent.value = 0.2222
    galleryClass.value = 'gallery-850-700'
    pageInfo.pageSize = 4
  }
  else if (outerWidth.value >= 500) {
    itemWidthPercent.value = 0.25
    galleryClass.value = 'gallery-700-500'
    pageInfo.pageSize = 4
  }
  else {
    itemWidthPercent.value = 0.3333
    galleryClass.value = 'gallery-500'
    pageInfo.pageSize = 3
  }
})

onActivated(() => {
  gallery.value?.scrollTo({ left: x.value, behavior: 'instant' })
})
</script>

<template>
  <section ref="sliderOuter" class="tg-app-slider-wg">
    <div class="header">
      <div class="title">
        <BaseButton type="text" size="none" @click="onTitleClick">
          <div v-if="icon" class="icon" style="--app-sport-image-error-icon-size:28px;">
            <AppImage v-if="useCloudImg" class="icon-img" style="width: 28px;height: 28px;" :url="icon" is-cloud
              with-theme active loading="eager" />
            <component v-else :is="icon" />
          </div>
          <h3 class="font-medium">
            {{ title }}
          </h3>
        </BaseButton>
      </div>
      <div class="right-wrap flex">
        <!-- <BaseButton
          v-if="total"
          type="square-line" class="h-[35px]" style="--tg-base-button-color:var(--tg-text-lightgrey);--tg-base-button-padding-x:18px; --tg-base-button-font-size:16px;--tg-base-button-square-line-border-color:var(--tg-border-color-grey-light);"
          @click="onTitleClick"
        >
          <span>{{ t('finance_other_tab_all') }}</span>
          <span class="total ml-[5px]">{{ total }}</span>
        </BaseButton> -->
        <BaseButton v-if="total" type="default" class="center h-[28px] all-btn"
          style="--tg-base-button-style-bg : #F5F5F5;--tg-base-button-padding-x:18px; --tg-base-button-font-size:16px;"
          @click="onTitleClick">
          <span class="whitespace-nowrap text-[16px]">{{ t('finance_other_tab_all') }}</span>
          <span class="total ml-[5px] text-[16px]">{{ total }}</span>
        </BaseButton>
        <div v-if="showArrow" class="arrows">
          <BaseButton size="none" type="default" class="rounded-lg" :disabled="x <= 0"
            style="--tg-base-button-style-bg : #F5F5F5" @click="prevPage">
            <div class="left a-inner">
              <IconUniArrowLeft class="left" style="--tg-icon-color:#555555;--tg-text-white:#555555" />
            </div>
          </BaseButton>
          <BaseButton type="default" size="none" class="rounded-lg" style="--tg-base-button-style-bg : #F5F5F5"
            :disabled="showViewAll ? scrollLeftItemsCount + pageInfo.pageSize
              >= data?.length + 1 : scrollLeftItemsCount + pageInfo.pageSize
            >= data?.length" @click="nextPage">
            <div class="a-inner right">
              <IconUniArrowRight class="right" style="--tg-icon-color:#555555;--tg-text-white:#555555" />
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
    <template v-if="data?.length > 0">
      <div ref="gallery" class="scroll-x gallery hide-scrollbar" :class="[galleryClass]">
        <div v-for="item, idx in data" :key="idx" class="slide" :class="{
          faded: idx === data?.length - 1
            ? !isEnd : idx >= scrollLeftItemsCount + pageInfo.pageSize,
        }">
          <div class="item">
            <slot name="item" :item="item" :loading="idx < pageInfo.pageSize ? 'eager' : 'lazy'">
              <BaseGameItemWhite :game-info="item" :loading="idx < pageInfo.pageSize ? 'eager' : 'lazy'"
                :show-man-count="showManCount" />
            </slot>
            <div class="link-next" @click="nextPage" />
          </div>
        </div>
        <div v-if="data?.length && (showViewAll || $slots.viewAll)" class="slide see-all"
          :class="{ faded: scrollLeftItemsCount + pageInfo.pageSize < data?.length + 1 }">
          <div class="item" @click="goAllPage">
            <slot name="viewAll">
              <BaseImage v-if="theme === 'white'" url="/png/casino/seeAll-en-white.png" />
              <BaseImage v-else-if="theme === 'green'" url="/png/casino/seeAll-en-green.png" />
              <BaseImage v-else url="/png/casino/seeAll-en.png" />
              <div class="txt">
                <span>{{ $t('view_all') }}</span>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </template>
    <BaseEmpty v-else icon="empty-game" :description="$t('empty_game')">
      <template #icon>
        <BaseImage class="w-[80px]" url="/png/icon/empty-game.png" />
      </template>
    </BaseEmpty>
  </section>
</template>

<style lang="scss" scoped>
.all-btn {
  --tg-base-button-color: #111111;
  --tg-base-button-padding-x: 18px;
  --tg-base-button-font-size: 16px;
  --tg-base-button-font-weight: 700;
  --tg-base-button-square-line-border-color: var(--tg-border-color-grey-light);

  @include webTheme('greenblack') {
    --tg-base-button-color: #26FFBE;
    --tg-base-button-square-line-border-color: #26FFBE;
  }
}

.tg-app-slider-wg {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: var(--tg-spacing-14);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    --tg-base-button-text-default-color: var(--tg-text-white);

    @include webTheme('white') {
      --tg-base-button-text-default-color: #111111;
    }

    .title {
      font-size: var(--tg-font-size-xl);
      color: var(--tg-text-white);
      display: inline-flex;
      position: relative;
      align-items: center;
      font-weight: 500;

      h3 {
        font-size: var(--tg-font-size-md);
        line-height: 1.5;
      }

      .icon {
        font-size: var(--tg-font-size-base);
        margin-right: var(--tg-spacing-8);
        display: flex;
        align-items: center;
      }

      &:hover {
        --tg-icon-color: var(--tg-text-white);

        .icon-img {
          filter: brightness(2);
        }
      }
    }

    .right-wrap {
      // gap: 6px;
    }

    .app-svg-icon {
      font-size: var(--tg-font-size-xxs);
      --tg-icon-color: var(--tg-text-lightgrey);
    }

    .arrows {
      display: flex;
      align-items: center;
      // gap: 6px;

      button {
        width: 28px;
        height: 28px;

        .a-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .2s;

          &.left svg {
            transform-origin: center center;
          }

          &.right svg {
            transform-origin: center center;
          }
        }

        &:not(:disabled) {
          .a-inner {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all .2s;

            &:hover svg {
              transform: scale(1.1426);
              opacity: 0.8;
              color: var(--tg-text-white);
            }

            &.left svg {
              transform-origin: center center;
            }

            &.right svg {
              transform-origin: center center;
            }
          }
        }

        &:disabled {
          opacity: var(--tg-base-button-disabled-opacity);
          cursor: default;
        }
      }

      button {
        border-color: var(--tg-border-color-grey-light);
      }

      .app-svg-icon {
        font-size: var(--tg-font-size-default);
        --tg-icon-color: var(--tg-text-lightgrey);
      }
    }
  }

  .gallery {
    display: grid;
    grid-auto-flow: column;
    padding-top: 10px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    // 以下数字代表 tg-app-slider 的宽度
    &.gallery-1150 {
      grid-auto-columns: calc(13.33% - 10px); // pageSize 7
      gap: 11px;
    }

    &.gallery-1150-1000 {
      grid-auto-columns: calc(15.38% - 15px); // 6
      gap: 16px;
    }

    &.gallery-1000-850 {
      grid-auto-columns: calc(18.18% - 15px); // 5
      gap: 16px;
    }

    &.gallery-850-700 {
      grid-auto-columns: calc(22.22% - 15px); // 4
      gap: 16px;
    }

    &.gallery-700-500 {
      grid-auto-columns: calc(25% - 5px); // 4
      gap: 6px;
    }

    &.gallery-500 {
      grid-auto-columns: calc((100% - 10px) / 3);
      gap: 5px;
    }

    .slide {
      scroll-snap-align: start;
      will-change: opacity;
      transition: all .3s;

      .link-next {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: transparent;
      }

      &.faded {
        opacity: .2;
        cursor: pointer;

        .link-next {
          display: block;
        }
      }

      .item {
        // border-radius: var(--tg-radius-md);
        position: relative;
        min-height: 20px;
      }

      &.see-all {
        .item {
          text-align: center;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;

          .link-next {
            display: none;
          }

          // &:hover {
          //   transform: translateY(-7px);
          // }

          img {
            display: block;
          }

          .txt {
            font-size: var(--tg-font-size-lg);
            color: var(--tg-text-white);
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;

            @include webTheme('white') {
              color: #fff;
            }
          }
        }
      }
    }
  }

  @include webTheme('greenblack') {
    .header {
      .title {
        h3 {
          color: #28FFBB;
        }
      }
    }
  }
}

.total {
  color: var(--tg-text-green);

  @include webTheme('green') {
    color: var(--tg-text-white);
  }

  @include webTheme('white') {
    color: #FFAA09;
  }
}
</style>

<style lang="scss" scoped>
// @supports (not (gap: 1px)) {
.tg-app-slider-wg {
  .header {
    .right-wrap {
      .arrows {
        margin-left: 6px;

        button:first-child {
          margin-right: 3px;
        }
      }
    }
  }
}

// }</style>

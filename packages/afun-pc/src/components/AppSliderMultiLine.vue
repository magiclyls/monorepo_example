<script lang="ts" setup name="app-slider">
import { IconUniArrowleftLine, IconUniArrowrightLine, IconEmptyGame } from '@tg/icons'

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
  name: 'AppSliderMultiLine',
})
const props = withDefaults(defineProps<Props>(), {
  showViewAll: true,
  showArrow: true,
})

const router = useLocalRouter()
const { appContentWidth } = storeToRefs(useWindowStore())
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
const gapWidth = ref(0)
const itemWidth = ref(0)

const { x } = useScroll(gallery, { behavior: 'smooth' }) // , isScrolling, arrivedState, directions

// 获取最长一行的长度
const maxLineLength = computed(() => {
  if (props.data !== undefined && props.data !== null)
    return props.data.map(a => a.length).sort((a, b) => b - a)[0]
  return 0
})
const outerWidth = computed(() => appContentWidth.value)
const pageWidth = computed(() => pageInfo.pageSize * itemWidthPercent.value * outerWidth.value)
const maxLineWidth = computed(() => {
  let w = 0
  if (galleryClass.value === 'gallery-1150')
    w = 11
  else if (galleryClass.value === 'gallery-1150-1000')
    w = 16
  else if (galleryClass.value === 'gallery-1000-850')
    w = 16
  else if (galleryClass.value === 'gallery-850-700 ')
    w = 16
  else if (galleryClass.value === 'gallery-700-500')
    w = 6
  else if (galleryClass.value === 'gallery-500')
    w = 5

  const totalGapWidth = w * (maxLineLength.value - 1)
  const totalItemWidth = itemWidth.value * maxLineLength.value

  return totalGapWidth + totalItemWidth
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

function onTitleClick() {
  if (props.path)
    router.push(props.path)
}

watchEffect(() => {
  if (outerWidth.value >= 1150) {
    itemWidthPercent.value = 0.1333
    galleryClass.value = 'gallery-1150'
    pageInfo.pageSize = 7
    gapWidth.value = 11
    itemWidth.value = Math.floor(outerWidth.value * 0.1333 - 10)
  }
  else if (outerWidth.value >= 1000) {
    itemWidthPercent.value = 0.1538
    galleryClass.value = 'gallery-1150-1000'
    pageInfo.pageSize = 6
    gapWidth.value = 16
    itemWidth.value = Math.floor(outerWidth.value * 0.1538 - 15)
  }
  else if (outerWidth.value >= 850) {
    itemWidthPercent.value = 0.1818
    galleryClass.value = 'gallery-1000-850'
    pageInfo.pageSize = 5
    gapWidth.value = 16
    itemWidth.value = Math.floor(outerWidth.value * 0.1818 - 15)
  }
  else if (outerWidth.value >= 700) {
    itemWidthPercent.value = 0.2222
    galleryClass.value = 'gallery-850-700'
    pageInfo.pageSize = 4
    gapWidth.value = 16
    itemWidth.value = Math.floor(outerWidth.value * 0.2222 - 15)
  }
  else if (outerWidth.value >= 500) {
    itemWidthPercent.value = 0.25
    galleryClass.value = 'gallery-700-500'
    pageInfo.pageSize = 4
    gapWidth.value = 6
    itemWidth.value = Math.floor(outerWidth.value * 0.25 - 5)
  }
  else {
    // 新版黑色 1行4个
    if (globalInitMap.currentTemplate == 6) {
      itemWidthPercent.value = 0.25
      galleryClass.value = 'gallery-700-500'
      pageInfo.pageSize = 4
      gapWidth.value = 6
      itemWidth.value = Math.floor(outerWidth.value * 0.25 - 5)
    }
    else {
      // 下面是一行三个的布局(旧版)
      itemWidthPercent.value = 0.3333
      galleryClass.value = 'gallery-500'
      pageInfo.pageSize = 3
      gapWidth.value = 5
      itemWidth.value = Math.floor((outerWidth.value - 10) / 3)
    }
  }
})

onActivated(() => {
  gallery.value?.scrollTo({ left: x.value, behavior: 'instant' })
})
</script>

<template>
  <section ref="sliderOuter" class="tg-app-slider">
    <div class="header">
      <div class="title">
        <BaseButton type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);"
          @click="onTitleClick">
          <div v-if="icon" class="icon">
            <AppImage v-if="useCloudImg" class="icon-img" :url="icon" loading="eager" is-cloud with-theme />
            <BaseImage v-else :url="icon" class="icon-img" loading="eager" is-cloud with-theme />
          </div>
          <h3 class="text-left">
            {{ title }}
          </h3>
        </BaseButton>
      </div>
      <div class="right-wrap flex">
        <BaseButton v-if="total" type="square-line" class="bt h-[28px]"
          style="--tg-base-button-color:var(--tg-text-lightgrey);--tg-base-button-padding-x:18px; --tg-base-button-font-size:16px;--tg-base-button-square-line-border-color:var(--tg-border-color-grey-light);"
          @click="onTitleClick">
          <span class="theme-text whitespace-nowrap">{{ t('finance_other_tab_all') }}</span>
          <span class="total ml-[5px]">{{ total }}</span>
        </BaseButton>
        <div v-if="showArrow" class="arrows">
          <BaseButton class="bt" type="square-line" size="none" :disabled="x <= 0" @click="prevPage">
            <div class="left a-inner">
              <IconUniArrowleftLine class="left" />
            </div>
          </BaseButton>
          <BaseButton class="bt" size="none" type="square-line" :disabled="x + outerWidth >= maxLineWidth"
            @click="nextPage">
            <div class="a-inner right">
              <IconUniArrowrightLine class="right" />
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
    <template v-if="!!data && data.length > 0">
      <div ref="gallery" class="scroll-x gallery hide-scrollbar">
        <AppSliderMultiLineComponents v-for="line, lineIdx in data" :key="lineIdx"
          :item-width-percent="itemWidthPercent" :item-width="itemWidth" :page-size="pageInfo.pageSize" :x="x"
          :list="line" :gallery-class="galleryClass" :line-index="lineIdx" :show-man-count="showManCount">
          <template #item="{ item, index }">
            <slot name="item" :item="item" :loading="index < pageInfo.pageSize ? 'eager' : 'lazy'">
              <BaseGameItem :game-info="item" :loading="index < pageInfo.pageSize ? 'eager' : 'lazy'"
                :show-man-count="showManCount" :ty="ty" />
            </slot>
          </template>
        </AppSliderMultiLineComponents>
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
.tg-app-slider {
  .theme-text {
    @include webTheme('new-default') {
      color: var(--tg-base-button-color);
      font-size: 13px;
    }

    @include webTheme('green') {
      font-size: 16px;
      color: #ffffff;
    }
  }

  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: var(--tg-spacing-18);

  &:nth-child(n+2) {
    @include webTheme('new-default') {
      margin-top: var(--tg-spacing-30);
    }

    @include webTheme('white') {
      margin-top: var(--tg-spacing-30);
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;

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

        @include webTheme('greenblack') {
          color: #fff;
        }
      }

      .icon {
        font-size: var(--tg-font-size-base);
        margin-right: var(--tg-spacing-8);
        display: flex;
        align-items: center;
        --app-sport-image-error-icon-size: 28px;

        @include webTheme('green') {
          --app-sport-image-error-icon-size: 28px;
        }

        @include webTheme('new-default') {
          --app-sport-image-error-icon-size: 28px;
        }

        .icon-img {
          width: 28px;
          height: 28px;

          @include webTheme('green') {
            width: 28px;
            height: 28px;
          }

          @include webTheme('new-default') {
            width: 28px;
            height: 28px;
          }
        }
      }

      &:hover {
        --tg-icon-color: var(--tg-text-white);

        .icon-img {
          @include webTheme('green') {
            filter: none;
          }

          // filter: brightness(2);
        }
      }
    }

    .right-wrap {
      // gap: 6px;
    }

    .arrows {
      display: flex;
      align-items: center;
      // gap: 6px;

      button {
        width: 32px;
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

            @include webTheme('green') {
              --tg-icon-color: #5ecea6;
            }
          }

          &.right svg {
            transform-origin: center center;

            @include webTheme('green') {
              --tg-icon-color: #5ecea6;
            }
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

              @include webTheme('green') {
                color: #5ecea6;
              }
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
    padding-top: 14px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

  }
}

.total {
  color: var(--tg-text-green);

  @include webTheme('new-default') {
    color: var(--tg-text-green);
    font-size: 13px;
  }

  @include webTheme('green') {
    font-size: 16px;
    color: #eca30c;
  }

  @include webTheme('greenblack') {
    color: #26FFBE;
  }
}

.bt {
  @include webTheme('new-default') {
    border: none;
    background: var(--tg-secondary-dark);
  }
}
</style>

<style lang="scss" scoped>
// @supports (not (gap: 1px)) {
.tg-app-slider {
  .header {
    .right-wrap {
      .arrows {
        margin-left: 6px;

        button:first-child {
          margin-right: 6px;
        }
      }
    }
  }
}
</style>

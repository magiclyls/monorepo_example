<script setup lang='ts'>
interface Props {
  itemWidth: number
  list: any[]
  galleryClass: string
  showManCount?: boolean
  lineIndex: number
  x: number
  pageSize: number
  itemWidthPercent: number
}
defineOptions({
  name: 'AppSliderMultiLineComponents',
})
const props = defineProps<Props>()
const { appContentWidth } = storeToRefs(useWindowStore())

const slideRef = ref()

const compactLayout = [4, 6]

const isEnd = computed(() => {
  const temp = (props.x + appContentWidth.value) / (props.itemWidthPercent * appContentWidth.value)
  return temp >= props.list.length - 0.1
})
const scrollLeftItemsCount = computed(() => {
  return Math.round(props.x / (props.itemWidthPercent * appContentWidth.value))
})

/** 判断是否华为手机 */
const isSpecificBrand = computed(() => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera
  // 根据品牌调整以下判断
  return /SAMSUNG|Huawei|Mi/i.test(userAgent)
})
/** 判断是否支持自动吸边 */
const supportsScrollSnapAlign = computed(() => CSS.supports('scroll-snap-align', 'start'))
</script>

<template>
  <div class="multi-line" :class="[galleryClass, lineIndex > 0 ? compactLayout.includes(globalInitMap.currentTemplate) ? 'mt-[8px]' : 'mt-[10px] @md:mt-[30px]' : '']">
    <div
      v-for="item, idx in list" :key="idx" ref="slideRef" class="slide" :class="{
        'faded': idx === list.length - 1
          ? !isEnd : idx >= scrollLeftItemsCount + pageSize,
        'scroll-snap': !isSpecificBrand && supportsScrollSnapAlign,
      }"
    >
      <div class="item">
        <slot name="item" :item="item" :index="idx">
          <BaseGameItem :game-info="item" :show-man-count="showManCount" />
        </slot>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.multi-line {
  display: grid;
  grid-auto-flow: column;
  transition: var(--tg-transition);
  height: auto;
  &.hide{
    height: 0;
    overflow: hidden;
    margin-top: 0;
  }

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
  &.gallery-300 {
    grid-auto-columns: calc((100% - 5px) / 2);
    gap: 5px;
  }

  .slide {
    will-change: opacity;
    transition: all .3s;
    &.faded{
      opacity: 0.2;
    }
    &.scroll-snap{
      scroll-snap-align: start;
    }

    .item {
      border-radius: var(--tg-radius-md);
      position: relative;
      min-height: 20px;
    }
  }
}
</style>

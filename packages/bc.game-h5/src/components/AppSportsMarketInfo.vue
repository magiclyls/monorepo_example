<script setup lang='ts'>
import { BaseIcon } from '@tg/bccomponents'
import { onClickOutside } from '@vueuse/core'
import { nextTick, ref, useTemplateRef } from 'vue'
import AppSportsBetButton from '~/components/AppSportsBetButton.vue'
import BaseSportsScrollbar from '~/components/BaseSportsScrollbar.vue'

defineOptions({ name: 'AppSportsMarketInfo' })

const marketInfoRef = useTemplateRef<HTMLElement>('marketInfoRef')

const oddsList = ref(['1.00', '0.98'])

// #region 🚧🚧 查看更多相关 🚧🚧
// 是否展开
const isShowMore = ref(false)
// 每个盘口高度
const moreItemHeight = ref(80)
// 个数
const moreItemCount = ref(4)
// 更多盘口高度
const showMoreListHeight = ref('0px')
// 滚动状态
const isShowMoreAtTop = ref(true)
const isShowMoreAtBottom = ref(false)
// 是否展示更多盘口的mask
const isShowMoreScrollMask = ref(false)

// 打开与关闭更多
function toggleShowMore() {
  if (!isShowMore.value) {
    // 打开
    isShowMore.value = true
    isShowMoreScrollMask.value = true
    showMoreListHeight.value = `${moreItemHeight.value * moreItemCount.value + 8}px`
  }
  else {
    // 关闭
    showMoreListHeight.value = '0px'
  }
}
function onShowMoreTransitionend() {
  if (showMoreListHeight.value === '0px') {
    // 关闭
    resetShowMore()
  }
  else {
    // 打开
    nextTick(() => {
      if (moreItemCount.value < 4) {
        isShowMoreScrollMask.value = false
      }
    })
  }
}
// 强制关闭
function closeShowMore() {
  if (!isShowMore.value)
    return
  showMoreListHeight.value = '0px'
}
// 重置状态
function resetShowMore() {
  isShowMore.value = false
  isShowMoreScrollMask.value = false
  isShowMoreAtTop.value = true
  isShowMoreAtBottom.value = false
}
// 更多盘口滚动事件
function onSimplebarScroll(e: Event) {
  const target = e.target as HTMLElement

  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  isShowMoreAtTop.value = scrollTop === 0
  isShowMoreAtBottom.value = scrollTop + clientHeight >= scrollHeight - 1 // 容错1px防抖
}
// 点击外部时
onClickOutside(marketInfoRef, closeShowMore)
// #endregion 🚧🚧 查看更多相关 🚧🚧
</script>

<template>
  <div ref="marketInfoRef" class="app-sports-market-info" :class="{ 'is-show-more': isShowMore }">
    <div class="wrapper">
      <!-- 上部分 -->
      <div class="top">
        <div class="left">
          <div class="info">
            <div class="w-full leading-[16px]">
              <!-- 联赛 -->
              <span class="title">
                <span class="inline-block mr-[4px] text-[16px]">
                  <BaseIcon :has-transition="false" name="basketball" />
                </span>
                <span class="h-[16px] flex overflow-hidden break-all items-center leading-[16px] tracking-[0.03em]">
                  美国
                  <BaseIcon :has-transition="false" name="uni-triangle" class="text-[8px] rotate-270 m-[2px]" />
                  美国职业篮球联赛
                </span>
              </span>
            </div>
          </div>
        </div>
        <!-- 收藏 -->
        <div class="right">
          <BaseIcon name="sports-fav" />
        </div>
      </div>
      <!-- 中 -->
      <div class="content">
        <!-- 状态 -->
        <div class="flex gap-[4px] h-[16px] pointer-events-none">
          <div class="flex-none flex">
            <div
              class="text-[12px] font-semibold leading-[16px] whitespace-nowrap tracking-[0.24px] align-middle opacity-50"
            >
              <div class="text-[12px] break-all leading-[16px] tracking-[0.03em] align-middle">
                明天, 06:30
              </div>
            </div>
          </div>
          <div class="flex items-center gap-[4px] grow text-[16px]">
            <BaseIcon name="sports-man" />
            <BaseIcon name="sports-data" />
          </div>
          <div class="flex-none ml-0 mr-[8px] flex items-center pointer-events-auto text-[16px]">
            <BaseIcon name="sports-live" style="--tg-base-icon-color:#fc3c3c;" />
          </div>
        </div>

        <div class="flex-1 mt-[12px] pointer-events-none flex overflow-hidden relative box-border">
          <!-- 主客队 -->
          <div class="flex-1 font-semibold">
            <!-- 主 -->
            <div class="flex items-center mb-[8px]">
              <div class="flex-1 h-[24px] flex relative text-[14px] items-center leading-[24px]">
                <div class="w-[24px] h-[24px] flex-none mr-[8px] text-[24px]">
                  <!-- 模拟队伍图片 -->
                  <div class="w-full h-full bg-amber-300 rounded-[50%]" />
                </div>
                <div
                  class="h-[24px] leading-[24px] w-full inline-block overflow-hidden box-border break-all align-middle mask-image"
                >
                  金州勇士
                </div>
              </div>
            </div>
            <!-- 客 -->
            <div class="flex items-center">
              <div class="flex-1 h-[24px] flex relative text-[14px] items-center leading-[24px]">
                <div class="w-[24px] h-[24px] flex-none mr-[8px] text-[24px] ">
                  <!-- 模拟队伍图片 -->
                  <div class="w-full h-full bg-amber-300 rounded-[50%]" />
                </div>
                <div
                  class="h-[24px] leading-[24px] w-full inline-block overflow-hidden box-border break-all align-middle mask-image"
                >
                  明尼苏达森林狼
                </div>
              </div>
            </div>
          </div>
          <!-- 比分 -->
          <div class="flex-none font-semibold">
            <div class="grid gap-[8px] text-[14px] box-border place-items-center grid-flow-col grid-rows-2">
              <div class="score-item">
                <span>1</span>
              </div>
              <div class="score-item">
                <span>2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 下 -->
      <div>
        <div class="bottom1">
          <div class="market-name">
            胜平负
          </div>
        </div>
        <div class="flex mt-[8px] items-end">
          <div class="flex-1 relative">
            <div class="w-full grid gap-[8px] grid-cols-2">
              <AppSportsBetButton v-for="item, i in oddsList" :key="i" size="big" :odds="item" />
            </div>
          </div>
          <div class="show-more" @click="toggleShowMore">
            <div class="icon" :class="{ up: isShowMore }">
              <BaseIcon name="uni-triangle" />
            </div>
          </div>
        </div>
        <!-- 更多 -->
        <div class="relative">
          <BaseSportsScrollbar class="max-h-[302px] overflow-x-hidden" @scroll="onSimplebarScroll">
            <div class="more-market" :style="{ height: showMoreListHeight }" @transitionend="onShowMoreTransitionend">
              <div class="overflow-hidden">
                <div v-for="item in moreItemCount" :key="item" class="relative">
                  <div class="label">
                    <div class="name">
                      合计
                    </div>
                  </div>
                  <div class="grid w-full gap-[8px] grid-cols-2">
                    <AppSportsBetButton size="big" odds="1.01" />
                    <AppSportsBetButton size="big" odds="0.98" />
                  </div>
                </div>
              </div>
            </div>
          </BaseSportsScrollbar>
          <div class="mask-top" :class="{ 'no-show': isShowMoreAtTop || !isShowMoreScrollMask }" />
          <div class="mask-bottom" :class="{ 'no-show': isShowMoreAtBottom || !isShowMoreScrollMask }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.mask-image {
  mask-image: linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%);
}

.app-sports-market-info {
  height: 204px;
  direction: ltr;
  position: relative;
  vertical-align: top;

  &.is-show-more {
    z-index: 9;

    .wrapper {
      top: 0;
      left: 0;
      position: absolute;
      box-shadow: 0 0 100px rgba(0, 0, 0, 0.65);
      max-height: max-content;
    }
  }

  .wrapper {
    color: #ffffff;
    width: 100%;
    border: 1px solid transparent;
    opacity: 1;
    padding: 12px 8px 8px;
    background: #292d2e;
    box-sizing: border-box;
    max-height: 204px;
    min-height: 100%;
    border-color: #292d2e;
    border-radius: 8px;
  }

  .top {
    display: flex;
    position: relative;
    font-size: 10px;
    padding-left: 8px;
    padding-right: 8px;

    .left {
      flex: 1;
      height: 16px;
      display: flex;
      overflow: hidden;
      position: relative;
      font-size: 12px;
      box-sizing: border-box;
      text-align: left;
      word-break: break-all;
      line-height: 16px;

      .info {
        width: 100%;
        overflow: hidden;
        mask-image: linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%);
        white-space: nowrap;

        .title {
          width: 100%;
          line-height: 16px;
          color: rgba(255, 255, 255, 0.5);
          height: 16px;
          display: flex;
          font-size: 12px;
          align-items: center;
          font-weight: 600;
          -webkit-font-smoothing: antialiased;
          --tg-base-icon-color: rgba(255, 255, 255, 0.5);

          @media (hover: hover) and (pointer: fine) {
            &:hover {
              color: rgb(255, 255, 255);
              cursor: pointer;
              transition:
                color,
                opacity 0.3s;
              --tg-base-icon-color: rgb(255, 255, 255);
            }
          }
        }
      }
    }

    .right {
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-left: 7px;
    }
  }

  .content {
    color: #ffffff;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 8px 0 12px 8px;
    background: none;
    transition: all 0.2s ease-in-out;
    border-color: #3a4142;
    border-radius: 6px;
    flex-direction: column;
    text-decoration: none;

    .score-item {
      color: rgb(255, 255, 255);
      border: 1px solid rgba(255, 255, 255, 0.1);
      height: 24px;
      display: flex;
      padding: 4px;
      font-size: 14px;
      min-width: 32px;
      background: rgba(255, 255, 255, 0.05);
      box-sizing: border-box;
      align-items: center;
      font-weight: 600;
      line-height: 16px;
      border-radius: 8px;
      justify-content: center;
    }
  }

  .bottom1 {
    width: auto;
    text-align: left;
    padding-left: 8px;
    color: #ffffff;
    margin: 0;
    z-index: 4;
    position: relative;
    background: #292d2e;
    box-sizing: border-box;
    font-weight: 600;

    .market-name {
      width: 100%;
      height: 16px;
      opacity: 0.5;
      overflow: hidden;
      font-size: 12px;
      box-sizing: border-box;
      line-height: 16px;
      border-radius: 2px;
      mask-image: linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%);
    }
  }

  .show-more {
    color: #ffffff;
    width: 32px;
    cursor: pointer;
    height: 40px;
    display: flex;
    background: #3a4142;
    box-sizing: border-box;
    transition: all 0.3s ease-in-out;
    align-items: center;
    font-weight: 600;
    margin-left: 8px;
    border-color: #3a4142;
    border-radius: 8px;
    justify-content: center;

    @media (hover: hover) and (pointer: fine) {
      &:hover {
        color: #ffffff;
        cursor: pointer;
        background: rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);
      }
    }

    .icon {
      display: flex;
      transition: all 0.3s;
      align-items: center;
      justify-content: center;
      opacity: 0.5;
      font-size: 16px;

      &.up {
        transform: rotate(-180deg);
      }
    }
  }

  .more-market {
    overflow: hidden;
    transition: height 0.3s linear;
    padding-bottom: 8px;

    .label {
      color: #ffffff;
      margin: 0;
      z-index: 4;
      position: relative;
      background: #292d2e;
      box-sizing: border-box;
      font-weight: 600;
      margin-top: 16px;
      text-align: left;
      padding-left: 8px;
      margin-bottom: 8px;

      .name {
        width: 100%;
        height: 16px;
        opacity: 0.5;
        overflow: hidden;
        font-size: 12px;
        box-sizing: border-box;
        line-height: 16px;
        border-radius: 2px;
        mask-image: linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%);
      }
    }
  }

  .mask-top {
    top: 0px;
    left: 0px;
    width: 100%;
    height: 32px;
    z-index: 1;
    position: absolute;
    transform-origin: center top;
    background: linear-gradient(rgb(41, 45, 46) 0%, rgb(41, 45, 46) 25%, rgba(41, 45, 46, 0) 100%);
    transition:
      transform 0.3s linear,
      opacity;
    pointer-events: none;

    &.no-show {
      opacity: 0;
      transform: scaleY(0);
    }
  }

  .mask-bottom {
    left: 0px;
    width: 100%;
    bottom: 0px;
    height: 32px;
    z-index: 1;
    position: absolute;
    transform-origin: center bottom;
    background: linear-gradient(0deg, rgb(41, 45, 46) 0%, rgb(41, 45, 46) 25%, rgba(41, 45, 46, 0) 100%);
    transition:
      transform 0.3s linear,
      opacity;
    pointer-events: none;

    &.no-show {
      opacity: 0;
      transform: scaleY(0);
    }
  }
}
</style>

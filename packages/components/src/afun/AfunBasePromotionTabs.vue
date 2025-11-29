<script setup lang='ts'>
import { useWindowStore } from '@tg/stores'
import { Dropdown as VDropdown } from 'floating-vue'
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseImage from '../BaseImage.vue'
import AfunBaseBadge from './AfunBaseBadge.vue'

interface TabItem {
  [text: string]: any
  value?: string | number
  label: string
  icon?: string
  activeIcon?: string
  path?: string
  useCloudImg?: boolean
  infoTip?: string
  dotTip?: number
  callBack?: () => void
}
interface Props {
  list: TabItem[]
  modelValue: string | number
  shape?: 'square' | 'round'
  full?: boolean
  center?: boolean
  size?: 'small' | 'large'
  useCloudImg?: boolean
  lineStyle?: boolean
  needScrollIntoView?: boolean
  needScrollAtInit?: boolean
  disableClick?: boolean
  disabled?: boolean
  showIcon?: boolean
  scrollInline?: ScrollLogicalPosition
  withTheme?: boolean
  moveCenter?: boolean
  withIcon?: boolean
}
defineOptions({
  name: 'AfunBasePromotionTabs',
})
const props = withDefaults(defineProps<Props>(), {
  shape: 'round',
  center: true,
  size: 'small',
  needScrollIntoView: true,
  disableClick: false,
  showIcon: true,
  scrollInline: 'nearest',
  moveCenter: false,
  withIcon: false,
})
const emit = defineEmits(['update:modelValue', 'change'])
const router = useRouter()
const { windowWidth } = storeToRefs(useWindowStore())

const curTabRef = ref<Array<Element | null>>([])
const tabWarpRef = ref<HTMLDivElement | null>(null)

function onClick(tab: TabItem, i: number, _e: MouseEvent) {
  if (tab.value === props.modelValue || tab.disabled || props.disableClick)
    return

  // 执行 tab 的回调
  if (tab.callBack)
    tab.callBack()

  // 更新选中 tab 的 value
  if (tab.value !== void 0 && tab.value !== null) {
    emit('update:modelValue', tab.value)
    emit('change', tab.value)
  }

  // 跳转到指定路径
  if (tab.path)
    router.push(tab.path)

  nextTick(() => {
    const targetTab = curTabRef.value[i]
    const tabWarp = tabWarpRef.value

    if (targetTab && tabWarp) {
      const targetTabRect = targetTab.getBoundingClientRect()
      const tabWarpRect = tabWarp.getBoundingClientRect()

      // 计算目标位置，确保目标 tab 居中
      const targetTabCenter = targetTabRect.left + targetTabRect.width / 2
      const tabWarpCenter = tabWarpRect.left + tabWarpRect.width / 2

      const distance = targetTabCenter - tabWarpCenter

      // 滚动到目标位置
      smoothScroll(tabWarp, distance)
    }
  })
}

function smoothScroll(tabWarp: HTMLElement, distance: number) {
  const start = tabWarp.scrollLeft
  const end = start + distance
  const duration = 300 // 设置滚动的持续时间（毫秒）
  let startTime: number

  function step(timestamp: number) {
    if (!startTime)
      startTime = timestamp
    const progress = timestamp - startTime

    const easeOutQuad = (t: number) => 1 - (1 - t) ** 2 // 缓动函数，控制滚动的加速度

    const newScrollLeft = start + (end - start) * easeOutQuad(progress / duration)

    tabWarp.scrollLeft = newScrollLeft

    if (progress < duration)
      requestAnimationFrame(step) // 继续动画
    else
      tabWarp.scrollLeft = end // 确保滚动到目标位置
  }

  requestAnimationFrame(step)
}

function resetTab(inline?: 'center' | 'nearest') {
  const index = props.list.findIndex(a => a.value === props.modelValue)
  curTabRef.value[index]?.scrollIntoView({
    behavior: 'instant',
    block: 'nearest',
    inline: inline ?? 'center',
  })
}

function calcTabWidth() {
  curTabRef.value.forEach((tab) => {
    if (tab) {
      const width = tab.getBoundingClientRect().width

      if (width > 88) {
        const tabEl: NodeListOf<HTMLElement> = tab.querySelectorAll('.tab')
        const contentEl: NodeListOf<HTMLElement> = tab.querySelectorAll('.content')
        const labelEl: NodeListOf<HTMLElement> = tab.querySelectorAll('.content-label')

        tabEl.forEach((child) => {
          child.style.width = '88px'
        })
        contentEl.forEach((child) => {
          child.style.paddingRight = '0'
        })
        labelEl.forEach((child) => {
          child.style.whiteSpace = 'normal'
        })
      }
    }
  })
}

onMounted(() => {
  if (props.moveCenter)
    calcTabWidth()

  nextTick(() => {
    if (props.needScrollIntoView && windowWidth.value < 768 && props.needScrollAtInit) {
      const index = props.list.findIndex(a => a.value === props.modelValue)
      curTabRef.value[index]?.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'center',
      })
    }
  })
})

defineExpose({ resetTab })
</script>

<template>
  <div class="base-tab" :class="{ center }">
    <div ref="tabWarpRef" class="scroll-x base-tab-wrap" :class="{ full, 'hide-scrollbar': lineStyle }">
      <div
        class="tab-wrap"
        :class="[shape, { 'line-style': lineStyle }]"
      >
        <div
          v-for="t, i in list" :key="i" :ref="el => curTabRef[i] = (el as Element)"
          class="tab-padding-box"
          @click="onClick(t, i, $event)"
        >
          <div
            class="tab"
            :class="[`tab-${size}`,
                     {
                       'active': t.value === modelValue,
                       'disabled': t.disabled || disabled,
                       'is-mobile': windowWidth < 768,
                       'relative': t.dotTip,
                       'with-icon': withIcon,
                     }]"
          >
            <VDropdown
              theme="info-tooltip"
              :shown="!!t.infoTip"
            >
              <div class="content">
                <slot name="tab" :item="t">
                  <div
                    v-if="t.icon && showIcon" class="icon"
                    style="--app-sport-image-error-icon-size:14px;"
                  >
                    <BaseImage
                      v-if="useCloudImg || t.useCloudImg"
                      :with-theme="withTheme"
                      :active="t.value === modelValue"
                      style="width: var(--tg-base-tab-appimage-width);height: var(--tg-base-tab-appimage-height);"
                      :url="t.value === modelValue && t.activeIcon ? t.activeIcon : t.icon" is-cloud loading="eager"
                    />
                    <component :is="t.icon" v-else style="display: block;" />
                  </div>
                  <span class="text content-label">{{ t.label }}</span>
                  <div v-if="t.bubble" class="bubble-wrap">
                    <div />
                  </div>
                </slot>
              </div>
              <template #popper>
                {{ t.infoTip }}
              </template>
            </VDropdown>
            <div v-if="t.dotTip && +t.dotTip > 0" class="dot-tip absolute right-0 top-0 z-[1] translate-x-1/3">
              <AfunBaseBadge
                class="state-text" :max="99999"
                :count="+t.dotTip" mode="red"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-tab-style-wrap-bg-color: #0f212e;
  --tg-tab-style-inner-padding-y: var(--tg-spacing-15);
  --tg-tab-style-inner-padding-x: 16px;
  --tg-tab-style-color: #fff;
  --tg-tab-style-line-active-text-color: #1475e1;
  --tg-tab-style-box-padding: 5px;
  --tg-tab-style-active-bg: #2f4553;
  --base-tab-brightness: 2;
  --tg-base-tab-appimage-width: 14px;
  --tg-base-tab-appimage-height: 14px;
  --tg-base-tab-active-tab-scale: 0.96;
  --tg-base-tab-font-weight: 600;
}
</style>

<style lang='scss' scoped>
.bubble-wrap {
  margin-top: 1px;
  div {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    z-index: 1;
    background: var(--tg-dot-state-bg);
    animation: OnlineFlash 0.2s ease-out;
    position: absolute;
    transform: translate(-50%, -50%) scale(1) !important;
  }
}

.base-tab {
  display: flex;
  max-width: 100%;
}

.base-tab-wrap {
  display: flex;
  max-width: 100%;

  .tab-wrap {
    padding: var(--tg-tab-style-box-padding) 0;
    background-color: var(--tg-tab-style-wrap-bg-color);
    flex: 1;
    display: flex;
    // gap: 5px;
    scroll-snap-type: x mandatory;
    .tab-padding-box {
      flex: 1;
      display: flex;
      padding: 0 2.5px;
      &:first-of-type {
        padding-left: 5px;
      }
      &:last-of-type {
        padding-right: 5px;
      }
    }
  }

  .square {
    border-radius: 4px;

    .tab-padding-box {
      border-radius: 4px;
      .tab {
        border-radius: 4px;
      }
    }
  }

  .round:not(.line-style) {
    border-radius: 100px;

    .tab-padding-box {
      border-radius: 100px;
      .tab {
        border-radius: 100px;
      }
    }
  }

  .tab {
    flex: 1;
    font-size: 14px;
    color: var(--tg-tab-style-color);
    padding: var(--tg-tab-style-inner-padding-y) var(--tg-tab-style-inner-padding-x);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all ease 0.25s;
    font-weight: var(--tg-base-tab-font-weight);
    &.tab-large {
      --tg-tab-style-inner-padding-y: var(--tg-spacing-15);
    }

    .content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1 0;
      white-space: nowrap;
      // gap: 8px;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      > * {
        margin-right: 8px;
      }
      > :last-child {
        margin-right: 0;
      }
    }

    &:hover:not(.disabled):not(.is-mobile) {
      background-color: var(--tg-tab-style-active-bg);
      color: #fff;
      .text {
        color: var(--tg-tab-active-text-color);
      }
    }

    &.active {
      background-color: var(--tg-tab-style-active-bg);
      color: #fff;
      .content {
        transform: scale(var(--tg-base-tab-active-tab-scale));
      }
      .icon {
        filter: brightness(var(--base-tab-brightness));
      }
      .text {
        color: var(--tg-tab-active-text-color);
      }
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
    //有图标的tab在黑绿主题下样式完全不一样
  }

  // 横线风格
  .line-style {
    background-color: transparent;
    gap: 0;
    .tab-padding-box {
      padding: 0;
    }
    .tab {
      background-color: transparent;
      border-radius: 0;
      border-bottom-style: solid;
      border-bottom-width: 2px;
      border-bottom-color: var(--tg-tab-style-active-bg);
      &.active {
        border-bottom-color: #1475e1;
        color: var(--tg-tab-style-line-active-text-color);
      }
      &:hover:not(.disabled):not(.is-mobile) {
        .text {
          --tg-tab-active-text-color: #ffffff;
        }
      }
    }
  }
}

.tab-active .base-tab-wrap .tab {
  &.active {
    background-color: #02432d;
    color: #3cb389;
  }
}

.full {
  flex: 1;
}

.center {
  justify-content: center;
}
</style>

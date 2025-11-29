<script lang="ts" setup>
import { IconTabSplit } from '@tg/icons'
import { nextTick, onMounted, ref } from 'vue'
import BaseBadge from '../afun/AfunBaseBadge.vue'
import BaseImage from '../BaseImage.vue'
import AfunBaseButton from './AfunBaseButton.vue'

interface TabItem {
  [text: string]: any
  value: string | number
  label: string
  icon?: string
  path?: string
  useCloudImg?: boolean
  customClick?: () => void
  dotTip?: number
  isComponentIcon?: boolean
}
interface Props {
  list: TabItem[]
  modelValue: string | number
  useCloudImg?: boolean
  needScrollIntoView?: boolean
  needScrollAtInit?: boolean
  disabled?: boolean
  scrollInline?: ScrollLogicalPosition
  type?: number // 1 默认 2首页分类 3 活动 4 钱包存款 5 消息中心 6 创建反馈 7 返水中心场馆tab
  full?: boolean // 是否100% 一屏 等分 tab
  activeIconColor?: boolean
}
defineOptions({
  name: 'AfunBasetab',
})
const props = withDefaults(defineProps<Props>(), {
  needScrollIntoView: true,
  scrollInline: 'nearest',
  type: 1,
  full: false,
})
const emit = defineEmits(['update:modelValue', 'change'])

const curTabRef = ref<Array<Element | null>>([])
const tabWarpRef = ref<HTMLDivElement | null>(null)

function onClick(tab: TabItem, i: number) {
  if (tab.value === props.modelValue || tab.disabled)
    return

  if (tab.customClick) {
    tab.customClick()
    return
  }
  emit('update:modelValue', tab.value)
  emit('change', tab.value)
  /* if (tab.path)
    router.push(tab.path) */
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

onMounted(() => {
  if (props.needScrollAtInit) {
    resetTab()
  }
})

defineExpose({ resetTab })
</script>

<template>
  <div ref="tabWarpRef" class="flex  overflow-auto hide-scroll" style="border-top-left-radius: var(--afun-tabs-top-rounded); border-top-right-radius: var(--afun-tabs-top-rounded);">
    <template v-if="type === 1">
      <div
        v-for="item, index in list" :key="item.title" :ref="el => curTabRef[index] = (el as Element)"
        class="px-[18px] py-[10px] h-[40px] flex items-center justify-center shrink-0 text-[rgb(41,49,64)] rounded-[18px] cursor-pointer"
        :class="{ 'bg-white font-bold': item.value === modelValue }" @click="onClick(item, index)"
      >
        <BaseImage v-if="item.icon" :url="item.icon" is-network class="mr-[7px] tab-icon" />
        <span class=" whitespace-nowrap"> {{ item.label }}</span>
      </div>
    </template>
    <template v-else-if="type === 2">
      <div
        v-for="item, index in list" :key="index" :ref="el => curTabRef[index] = (el as Element)"
        class="tab-item2 w-[58px] h-[56px] flex items-center justify-center shrink-0  rounded-t-[8px] cursor-pointer gap-[var(--afun-tabs-item-gap)]"
        :class="{ 'bg-white font-bold': item.value === modelValue }" @click="onClick(item, index)"
      >
        <BaseImage v-if="item.icon" :url="item.icon" is-network class=" w-auto h-[43px]" />
      </div>
    </template>
    <template v-else-if="type === 3">
      <div
        class="  w-full flex" :class="{
          'justify-center': full,
        }"
        style="
                gap: var(--afun-tabs-item-gap);
          "
      >
        <div
          v-for="item, index in list" :key="index" :ref="el => curTabRef[index] = (el as Element)"
          class="center px-[var(--afun-tabs-item-wrap-px)]"
          :class="[
            full ? 'flex-1' : 'shrink-0',
            item.value === modelValue ? 'text-[var(--afun-tabs-text-active-color)]' : 'text-[var(--afun-tabs-text-color)]',
          ]"
          @click="onClick(item, index)"
        >
          <div class="relative pb-[var(--afun-tabs-item-pb)]  flex flex-col items-center">
            <BaseImage v-if="item.icon" :url="item.icon" class="mb-[4px] tab-icon" />
            <div
              class="whitespace-nowrap   leading-[20px]  text-[length:var(--afun-tabs-font-size)] font-[600] cursor-pointer"
            >
              {{ item.label }}
            </div>

            <span
              v-if="item.value === modelValue"
              class="redborder bg-[#24EE89] h-[2px] w-[var(--afun-tabs-item-border-width)] rounded-[1px]"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 4">
      <div
        class="flex bg-[#0F212E]"
        style="
          border-radius: var(--afun-tabs-item-rounded-top) var(--afun-tabs-item-rounded-top) var(--afun-tabs-item-rounded-bottom) var(--afun-tabs-item-rounded-bottom);
        "
        :class="{
          'w-full': full,
        }"
      >
        <template v-for="(item, index) in list" :key="index">
          <div
            :ref="el => curTabRef[index] = (el as Element)"
            class="center px-[16px] relative h-[42px] leading-[20px]"
            :class="[
              full ? 'flex-1' : 'shrink-0 min-w-[98.33px]',
              {
                'bg-[#233846]': item.value === modelValue,
              },
            ]"
            :style="index === 0 ? {
              'border-top-left-radius': 'var(--afun-tabs-item-rounded-top)',
              'border-bottom-left-radius': 'var(--afun-tabs-item-rounded-bottom)',
            } : index === list.length - 1 ? {
              'border-top-right-radius': 'var(--afun-tabs-item-rounded-top)',
              'border-bottom-right-radius': 'var(--afun-tabs-item-rounded-bottom)',
            } : {}"
            @click="onClick(item, index)"
          >
            <div
              class="whitespace-nowrap  text-[14px] font-[600] cursor-pointer" :class="{
              }"
            >
              {{ item.label }}
            </div>
          </div>
          <IconTabSplit
            v-if="index !== (list.length - 1)" class="tab-split" :class="{
              'pre': list[index + 1].value === modelValue,
              'pre-fanzhuan': (list[index + 1].value === modelValue) && index % 2 === 0,
              'current': item.value === modelValue,
              'current-fanzhuan': index % 2 === 1,
            }"
          />
        </template>
      </div>
    </template>
    <template v-else-if="type === 5">
      <div
        class="flex overflow-x-auto hide-scroll" :class="{
          'w-full': full,
        }"
        style="
            background-color: var(--afun-tabs-wrap-bg);
            border-radius: var(--afun-tabs-item-rounded);
            padding: var(--afun-tabs-wrap-padding-y) var(--afun-tabs-wrap-padding-x);
            gap: var(--afun-tabs-item-gap);
            min-width: max-content;
          "
      >
        <div
          v-for="item, index in list" :key="index" :ref="el => curTabRef[index] = (el as Element)"
          class="item center relative"
          :class="[
            full ? 'flex-1' : 'shrink-0',
            {
              active: item.value === modelValue,
            }]"
          style="
                border-radius: var(--afun-tabs-item-rounded);
                padding: 0 var(--afun-tabs-item-padding-x);
                height: var(--afun-tabs-item-height);
                min-width: fit-content;
              "
          @click="onClick(item, index)"
        >
          <VDropdown
            theme="info-tooltip"
            :shown="item.infoTip"
            :distance="15"
          >
            <div
              class="whitespace-nowrap text-[14px] font-[600] cursor-pointer" :class="{
              }"
            >
              {{ item.label }}
            </div>
            <template #popper>
              {{ item.infoTip }}
            </template>
          </VDropdown>
          <div v-if="item.dotTip && item.dotTip > 0" class="absolute right-0 top-0 z-[1] translate-x-[7px]">
            <BaseBadge :max="99999" :value="item.dotTip" />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 6">
      <div class="w-full flex">
        <div
          v-for="item, index in list" :key="index" :ref="el => curTabRef[index] = (el as Element)"
          class=" center px-[20px]  h-[32px] border-b-[2px]  border-solid " :class="[full ? 'flex-1' : 'shrink-0', {
            'border-[#24EE89] text-[#fff]': item.value === modelValue,
            'border-[#2F4553] text-[#B1BAD3]': item.value !== modelValue,

          }]" @click="onClick(item, index)"
        >
          <div class="whitespace-nowrap   text-[14px] font-[600] cursor-pointer">
            {{ item.label }}
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 7">
      <div class="w-full bg-[#213743] h-[56px] rounded-[8px] overflow-hidden px-[15px]">
        <div class="w-full max-w-full h-full overflow-x-auto hide-scroll">
          <div class="flex h-full" style="gap: var(--tab-type-7-gap)">
            <div
              v-for="item, index in list" :key="item.value" :ref="el => curTabRef[index] = (el as Element)"
              class="h-full shrink-0 relative center  flex-col  text-[12px] font-[600]"
              @click="onClick(item, index)"
            >
              <template v-if="!useCloudImg">
                <component
                  :is="item.icon ?? ''"
                  v-if="item.isComponentIcon" class="text-[18px] mb-[2px] "
                  :class="activeIconColor && modelValue === item.value ? 'text-[#00E701]' : ''"
                />
                <div v-else class="tab-icon mb-[2px]">
                  <BaseImage v-if="modelValue === item.value && item.activeIcon" :url="item.activeIcon" />
                  <BaseImage v-else :url="item.icon" />
                </div>
              </template>
              <template v-else>
                <BaseImage v-if="modelValue === item.value" :url="item.activeIcon" class="tab-icon mb-[2px]" />
                <component :is="item.icon ?? ''" v-else class="text-[18px] mb-[2px] text-[#9DABC8]" />
              </template>
              <span class="leading-[17px]" :class="item.value === modelValue ? 'text-[#fff]' : 'text-[#B1BAD3]'">
                {{ item.label }}
              </span>
              <span v-show="item.value === modelValue" class="dot" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 8">
      <div class="w-full rounded-[8px] flex gap-[8px]">
        <div
          v-for="(item, index) in list"
          :key="item.value"
          :ref="el => curTabRef[index] = (el as Element)"
          :class="[full && 'flex-1']"
          class="flex"
        >
          <AfunBaseButton
            class="w-full"
            style="--afun-base-button-font-size: 14px;--afun-base-button-font-weight:500;--afun-base-button-padding-y:10px;"
            :type="modelValue === item.value ? 'primary' : 'default'"
            @click="onClick(item, index)"
          >
            {{ item.label }}
          </AfunBaseButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
:root {
  --afun-tabs-top-rounded: 0px;
  --afun-tabs-wrap-bg: #0f212e;
  --afun-tabs-wrap-padding-x: 5px;
  --afun-tabs-wrap-padding-y: 0;
  --afun-tabs-item-padding-x: 20px;
  --afun-tabs-item-wrap-px: 4px;
  --afun-tabs-item-pb: 6px;
  --afun-tabs-item-height: 44px;
  --afun-tabs-item-width: 110px;
  --afun-tabs-item-minwidth: auto;
  --afun-tabs-item-border-width: 100%;
  --afun-tabs-item-rounded: 40px;
  --afun-tabs-item-gap: 18px;
  --afun-tabs-item-bg: none;
  --afun-tabs-item-active-bg: #2f4553;
  --afun-tabs-item-color: inherit;
  --afun-tabs-item-active-color: inherit;
  --afun-tabs-icon-size: 17px;
  --afun-tabs-font-size: 14px;
  --tab-type-7-gap: 36px;
  --afun-tabs-item-rounded-top: 6px;
  --afun-tabs-item-rounded-bottom: 6px;
  --afun-tabs-text-color: #b1bad3;
  --afun-tabs-text-active-color: #24ee89;
}
</style>

<style scoped lang="scss">
.dot {
  width: 14px;
  height: 7px;
  border-radius: 0 0 3px 3px;
  background-color: #24ee89;
  position: absolute;
  top: 0;
  display: inline-block;
}
.tab-icon {
  width: var(--afun-tabs-icon-size);
  height: var(--afun-tabs-icon-size);
}
.redborder {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.tab-split {
  width: 30px;
  height: 42px;
  font-size: 42px;
  transition: none !important;
  color: #0f212e;
  transform: translate3d(0, 0, 0);

  &.pre {
    color: #233846;
    transform: scaleX(-1);

    &.pre-fanzhuan {
      transform: initial;
      transform: rotate(180deg);
    }
  }

  &.current {
    color: #233846;

    &.current-fanzhuan {
      transform: scaleY(-1);
    }
  }
}
.item {
  background-color: var(--afun-tabs-item-bg);
  color: var(--afun-tabs-item-color);
  &.active {
    background-color: var(--afun-tabs-item-active-bg);
    color: var(--afun-tabs-item-active-color);
  }
}
</style>

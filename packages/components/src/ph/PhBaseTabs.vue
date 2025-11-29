<script lang="ts" setup>
import { IconTabSplit } from '@tg/icons'
import { nextTick, onMounted, ref } from 'vue'
import BaseImage from '../BaseImage.vue'
import BaseBadge from '../ph/PhBaseBadge.vue'
import PhBaseButton from './PhBaseButton.vue'

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
  name: 'PhBasetab',
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
  <div ref="tabWarpRef" class="flex  overflow-auto hide-scroll">
    <template v-if="type === 1">
      <div
        v-for="item, index in list" :key="item.title" :ref="el => curTabRef[index] = (el as Element)"
        class="px-[18rem] py-[10rem] h-[40rem] flex items-center justify-center shrink-0 text-[rgb(41,49,64)] rounded-[18rem] cursor-pointer"
        :class="{ 'bg-white font-bold': item.value === modelValue }" @click="onClick(item, index)"
      >
        <BaseImage v-if="item.icon" :url="item.icon" is-network class="mr-[7rem] tab-icon" />
        <span class=" whitespace-nowrap"> {{ item.label }}</span>
      </div>
    </template>
    <template v-else-if="type === 2">
      <div
        v-for="item, index in list" :key="index" :ref="el => curTabRef[index] = (el as Element)"
        class="tab-item2 w-[58rem] h-[56rem] flex items-center justify-center shrink-0  rounded-t-[8rem] cursor-pointer gap-[var(--tabs-item-gap)]"
        :class="{ 'bg-white font-bold': item.value === modelValue }" @click="onClick(item, index)"
      >
        <BaseImage v-if="item.icon" :url="item.icon" is-network class=" w-auto h-[43rem]" />
      </div>
    </template>
    <template v-else-if="type === 3">
      <div
        class="  w-full flex" :class="{
          'justify-center': full,
        }"
        style="
                gap: var(--tabs-item-gap);
          "
      >
        <div
          v-for="item, index in list" :key="index" :ref="el => curTabRef[index] = (el as Element)"
          class="center px-[var(--tabs-item-wrap-px)]"
          :class="[
            full ? 'flex-1' : 'shrink-0',
            item.value === modelValue ? 'text-[#F23038]' : 'text-[#6D7693]',
          ]"
          @click="onClick(item, index)"
        >
          <div class="relative pb-[var(--tabs-item-pb)]  flex flex-col items-center">
            <BaseImage v-if="item.icon" :url="item.icon" class="mb-[4rem] tab-icon" />
            <div
              class="whitespace-nowrap   leading-[20rem]  text-[14rem] font-[500] cursor-pointer"
            >
              {{ item.label }}
            </div>

            <span
              v-if="item.value === modelValue"
              class="redborder bg-[#F23038] h-[2rem] w-[var(--tabs-item-border-width)] rounded-[1rem]"
            />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 4">
      <div
        class="flex bg-[#EBEBEB]"
        style="
          border-radius: var(--tabs-item-rounded-top) var(--tabs-item-rounded-top) var(--tabs-item-rounded-bottom) var(--tabs-item-rounded-bottom);
        "
        :class="{
          'w-full': full,
        }"
      >
        <template v-for="(item, index) in list" :key="index">
          <div
            :ref="el => curTabRef[index] = (el as Element)"
            class="center px-[16rem] relative h-[42rem] leading-[20rem]"
            :class="[
              full ? 'flex-1' : 'shrink-0 min-w-[98.33rem]',
              {
                'bg-white': item.value === modelValue,
              },
            ]"
            :style="index === 0 ? {
              'border-top-left-radius': 'var(--tabs-item-rounded-top)',
              'border-bottom-left-radius': 'var(--tabs-item-rounded-bottom)',
            } : index === list.length - 1 ? {
              'border-top-right-radius': 'var(--tabs-item-rounded-top)',
              'border-bottom-right-radius': 'var(--tabs-item-rounded-bottom)',
            } : {}"
            @click="onClick(item, index)"
          >
            <div
              class="whitespace-nowrap  text-[14rem] font-[500] cursor-pointer" :class="{
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
            background-color: var(--tabs-wrap-bg);
            border-radius: var(--tabs-item-rounded);
            padding: var(--tabs-wrap-padding-y) var(--tabs-wrap-padding-x);
            gap: var(--tabs-item-gap);
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
                border-radius: var(--tabs-item-rounded);
                padding: 0 var(--tabs-item-padding-x);
                height: var(--tabs-item-height);
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
              class="whitespace-nowrap text-[14rem] font-[500] cursor-pointer" :class="{
              }"
            >
              {{ item.label }}
            </div>
            <template #popper>
              {{ item.infoTip }}
            </template>
          </VDropdown>
          <div v-if="item.dotTip && item.dotTip > 0" class="absolute right-0 top-0 z-[1] translate-x-[7rem]">
            <BaseBadge :max="99999" :value="item.dotTip" />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 6">
      <div class="w-full flex">
        <div
          v-for="item, index in list" :key="index" :ref="el => curTabRef[index] = (el as Element)"
          class=" center px-[20rem]  h-[32rem] border-b-[2rem]  border-solid " :class="[full ? 'flex-1' : 'shrink-0', {
            'border-[#F23038] text-[#F23038]': item.value === modelValue,
            'border-[#9DABC8] text-[#6D7693]': item.value !== modelValue,

          }]" @click="onClick(item, index)"
        >
          <div class="whitespace-nowrap   text-[14rem] font-[500] cursor-pointer">
            {{ item.label }}
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 7">
      <div class="w-full bg-[#fff] h-[56rem] rounded-[8rem] overflow-hidden px-[15rem]">
        <div class="w-full max-w-full h-full overflow-x-auto hide-scroll">
          <div class="flex h-full" style="gap: var(--tab-type-7-gap)">
            <div
              v-for="item, index in list" :key="item.value" :ref="el => curTabRef[index] = (el as Element)"
              class="h-full shrink-0 relative center  flex-col  text-[12rem] font-[500]"
              @click="onClick(item, index)"
            >
              <template v-if="!useCloudImg">
                <component
                  :is="item.icon ?? ''"
                  v-if="item.isComponentIcon" class="text-[18rem] mb-[2rem] "
                  :class="activeIconColor && modelValue === item.value ? 'text-[#f23038]' : ''"
                />
                <div v-else class="tab-icon mb-[2rem]">
                  <BaseImage :url="item.icon" />
                </div>
              </template>
              <template v-else>
                <BaseImage v-if="modelValue === item.value" :url="item.activeIcon" class="tab-icon mb-[2rem]" />
                <component :is="item.icon ?? ''" v-else class="text-[18rem] mb-[2rem] text-[#9DABC8]" />
              </template>
              <span class="leading-[17rem]" :class="item.value === modelValue ? 'text-[#0D2245]' : 'text-[#6D7693]'">
                {{ item.label }}
              </span>
              <span v-show="item.value === modelValue" class="dot" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="type === 8">
      <div class="w-full rounded-[8rem] flex gap-[12rem]">
        <div
          v-for="(item, index) in list"
          :key="item.value"
          :ref="el => curTabRef[index] = (el as Element)"
          class="flex"
        >
          <PhBaseButton
            class="w-auto"
            :class="[full && 'flex-1']"
            style="--ph-base-button-font-size: 14rem;--ph-base-button-font-weight:500;--ph-base-button-padding-y:8rem;--ph-base-button-secondary-background-color:#fff"
            :type="modelValue === item.value ? 'primary' : 'secondary'"
            :style="[modelValue !== item.value && '--ph-base-button-border-color: #EBEBEB']"
            @click="onClick(item, index)"
          >
            {{ item.label }}
          </PhBaseButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style>
:root {
  --tabs-wrap-bg: #ebebeb;
  --tabs-wrap-padding-x: 5rem;
  --tabs-wrap-padding-y: 0;
  --tabs-item-padding-x: 20rem;
  --tabs-item-wrap-px: 4rem;
  --tabs-item-pb: 6rem;
  --tabs-item-height: 44rem;
  --tabs-item-width: 110rem;
  --tabs-item-minwidth: auto;
  --tabs-item-border-width: 100%;
  --tabs-item-rounded: 40rem;
  --tabs-item-gap: 18rem;
  --tabs-item-bg: none;
  --tabs-item-active-bg: white;
  --tabs-item-color: inherit;
  --tabs-item-active-color: inherit;
  --tabs-icon-size: 17rem;
  --tab-type-7-gap: 36rem;
  --tabs-item-rounded-top: 8rem;
  --tabs-item-rounded-bottom: 8rem;
}
</style>

<style scoped lang="scss">
.dot {
  width: 14rem;
  height: 7rem;
  border-radius: 0 0 3rem 3rem;
  background-color: #f23038;
  position: absolute;
  top: 0;
  display: inline-block;
}
.tab-icon {
  width: var(--tabs-icon-size);
  height: var(--tabs-icon-size);
}
.redborder {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}
.tab-split {
  width: 30rem;
  height: 42rem;
  font-size: 42rem;
  transition: none !important;
  color: #ebebeb;
  transform: translate3d(0, 0, 0);

  &.pre {
    color: #fff;
    transform: scaleX(-1);

    &.pre-fanzhuan {
      transform: initial;
      transform: rotate(180deg);
    }
  }

  &.current {
    color: #fff;

    &.current-fanzhuan {
      transform: scaleY(-1);
    }
  }
}
.item {
  background-color: var(--tabs-item-bg);
  color: var(--tabs-item-color);
  &.active {
    background-color: var(--tabs-item-active-bg);
    color: var(--tabs-item-active-color);
  }
}
</style>

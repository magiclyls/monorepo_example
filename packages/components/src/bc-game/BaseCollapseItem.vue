<script lang="ts" setup>
import { computed, ref } from 'vue'

interface CollapseProps {
  title: string
  disabled?: boolean
  modelValue?: boolean
  position?: 'first' | 'middle' | 'last' | 'single'
  showArrow?: boolean
  showHoverBg?: boolean
  arrow?: {
    showArrowBg?: boolean
    arrowPosition?: 'right' | 'up'
  }
  chooseStyle?: {
    titleColor?: string
    bgColor?: string
  }
}

const props = withDefaults(defineProps<CollapseProps>(), {
  modelValue: false,
  disabled: false,
  position: 'single', // 默认为单独使用的样式
  showHoverBg: false,
  showArrow: true,
  arrow: {
    showArrowBg: false,
    arrowPosition: 'right',
  } as any,

})

const emit = defineEmits(['update:modelValue', 'change', 'clickHeader', 'clickBtn'])

const isActive = ref(props.modelValue)

const titleColor = computed(() => {
  return props.chooseStyle?.titleColor || 'var(--collapse-title-color)'
})

const arrowDeg = computed(() => {
  return props.arrow.arrowPosition === 'right' ? '90deg' : '180deg'
})

const arrowBg = computed(() => {
  return props.arrow.showArrowBg ? '#464f50' : ''
})

const contentRef = ref<HTMLElement | null>(null)

// 折叠面板动画处理函数
function enter(element: Element) {
  const el = element as HTMLElement
  el.style.height = '0'
  el.style.overflow = 'hidden'
  // 获取内容实际高度
  const height = contentRef.value?.scrollHeight
  // 设置过渡效果
  el.style.transition = 'height 0.15s ease-in-out'
  // 设置高度为实际高度触发过渡
  requestAnimationFrame(() => {
    el.style.height = `${height}px`
  })
}

function afterEnter(element: Element) {
  const el = element as HTMLElement
  el.style.height = ''
  el.style.overflow = ''
}

function leave(element: Element) {
  const el = element as HTMLElement
  // 获取当前高度
  const height = el.scrollHeight
  el.style.height = `${height}px`
  el.style.overflow = 'hidden'
  // 设置过渡效果
  el.style.transition = 'height 0.15s ease-in-out'
  // 设置高度为0触发过渡
  requestAnimationFrame(() => {
    el.style.height = '0'
  })
}

function toggleCollapse() {
  isActive.value = !isActive.value
  emit('update:modelValue', isActive.value)
  emit('change')
}

function clickHeader() {
  emit('clickHeader')
  toggleCollapse()
}

function clickBtn() {
  emit('clickBtn')
  toggleCollapse()
}
</script>

<template>
  <div class="base-collapse" :class="[position]">
    <div
      class="collapse-header" :class="{ 'no-hover': !showHoverBg }" :style="{ background: chooseStyle?.bgColor }"
      @click="clickHeader"
    >
      <div class="header-left">
        <slot name="icon" />
        <div class="title">
          {{ title }}
        </div>
      </div>
      <div class="extra-wrapper">
        <slot name="extra" />
      </div>
      <div v-if="showArrow" class="arrow" :class="{ 'is-active': modelValue }" @click.stop="clickBtn">
        <slot name="arrow">
          <component :is="arrow.arrowPosition!" style="font-size: 1.2rem" />
        </slot>
      </div>
    </div>

    <transition @enter="enter" @after-enter="afterEnter" @leave="leave">
      <div v-show="isActive && !disabled" ref="contentRef" class="collapse-content">
        <div class="collapse-wrapper">
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
:root {
  --collapse-title-color: #96a5ae;
  --collapse-radius: 0.5rem;
  --collapse-header-bg: #292d2e;
  --collapse-content-bg: #292d2e;
  --collapse-border: 0.0625rem solid #3a4142;
  --collapse-hover-bg: linear-gradient(90deg, rgba(35, 238, 136, 0.2), rgba(35, 238, 136, 0));
  --collapse-content-padding: 0 0.75rem 0.75rem 0.75rem;
  --collapse-header-padding: 0.75rem;
  --collapse-text-color: #96a5ae;
  --collapse-title-font-weight: 600;
  --collapse-height: 2.25rem;
}
</style>

<style lang="scss" scoped>
.base-collapse {
  color: var(--collapse-text-color);
  border: var(--collapse-border);
  border-radius: 0;
  /* 默认无圆角 */
  background-color: #292d2e;
}

/* 第一个项目：只有上方圆角 */
.first {
  border-top-left-radius: var(--collapse-radius);
  border-top-right-radius: var(--collapse-radius);
  border-bottom: none;
}

/* 中间项目：无圆角，上下无边框 */
.middle {
  border-radius: 0;
}

/* 最后一个项目：只有下方圆角 */
.last {
  border-top: none;
  border-bottom-left-radius: var(--collapse-radius);
  border-bottom-right-radius: var(--collapse-radius);
}

/* 单独使用：四周都有圆角 */
.single {
  border-radius: var(--collapse-radius);
}

.no-hover {
  &:hover {
    background: var(--collapse-header-bg) !important;
  }
}

.collapse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--collapse-height);
  cursor: pointer;
  padding: var(--collapse-header-padding);
  background: var(--collapse-header-bg);
  border-radius: var(--collapse-radius);

  &:hover {
    background: var(--collapse-hover-bg);
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.title {
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: var(--collapse-title-font-weight);
  color: v-bind(titleColor);
}

.extra-wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  overflow: hidden;
  margin-right: 0.5rem;
}

.arrow {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.5rem;
  background-color: v-bind(arrowBg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s;
}

.arrow.is-active {
  transform: rotate(v-bind(arrowDeg));
}

.collapse-content {
  background-color: var(--collapse-content-bg);
}

.collapse-wrapper {
  padding: var(--collapse-content-padding);
}

/* 添加内容区圆角样式 */
.last .collapse-content,
.single .collapse-content {
  border-bottom-left-radius: calc(var(--collapse-radius) - 0.0625rem);
  border-bottom-right-radius: calc(var(--collapse-radius) - 0.0625rem);
}

/* 确保内容区包装器也有对应的圆角 */
.last .collapse-wrapper,
.single .collapse-wrapper {
  border-bottom-left-radius: calc(var(--collapse-radius) - 0.125rem);
  border-bottom-right-radius: calc(var(--collapse-radius) - 0.125rem);
}
</style>

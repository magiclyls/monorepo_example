<script setup lang='ts'>
interface TabItem {
  [text: string]: any
  value: string | number
  label: string
  icon?: string | Component
  path?: string
  useCloudImg?: boolean
  customClick?: () => void
}
interface Props {
  list: TabItem[]
  modelValue: string | number
  full?: boolean
  center?: boolean
  useCloudImg?: boolean
  size?: 'small' | 'large'
  lineStyle?: boolean
  needScrollIntoView?: boolean
  needScrollAtInit?: boolean
  disableClick?: boolean
  disabled?: boolean
  showIcon?: boolean
  scrollInline?: ScrollLogicalPosition
  withTheme?: boolean
  homePage?: boolean
  animate?: boolean
}
defineOptions({
  name: 'BasetabVi',
})
const props = withDefaults(defineProps<Props>(), {
  center: true,
  needScrollIntoView: true,
  disableClick: false,
  showIcon: true,
  scrollInline: 'nearest',
  homePage: false,
  animate: true,
})
const emit = defineEmits(['update:modelValue', 'change'])
const router = useLocalRouter()
const { isMobile } = storeToRefs(useWindowStore())

const parent = ref()
const curTabRef = ref<Array<Element | null>>([])
const scrollDom = ref()

const dashWidth = ref('')
const percent = ref(0)
const dashMountedClass = ref('')
const { x: scrollDomX } = useScroll(scrollDom, { behavior: 'smooth' })

const animateDash = computed(() => {
  if (props.animate)
    return dashMountedClass.value
  return ''
})

function onClick(tab: TabItem, i: number) {
  if (tab.value === props.modelValue || tab.disabled || props.disableClick)
    return

  if (tab.customClick) {
    tab.customClick()
    return
  }

  emit('update:modelValue', tab.value)
  emit('change', tab.value)
  if (tab.path)
    router.push(tab.path)

  nextTick(() => {
    if (curTabRef.value && scrollDom.value && i !== 0) {
      scrollDom.value.scrollTo({
        left: getActivePrveDomWidth(curTabRef.value as Element[], i),
        behavior: 'smooth',
      })
    }
    else {
      props.needScrollIntoView && curTabRef.value[i]?.scrollIntoView({
        behavior: 'smooth', block: 'nearest', inline: props.scrollInline,
      })
    }

    if (curTabRef.value && parent.value) {
      const parentRect = parent.value!.getBoundingClientRect()
      const childRect = curTabRef.value[i]!.getBoundingClientRect()
      dashWidth.value = `${childRect.width - 21}px`
      const offsetLeft = childRect.left - parentRect.left
      const padding = 2.5
      percent.value = offsetLeft + 8 + padding
    }
  })
}

/**
 * 获取当前激活的tab下标-1 元素 前面的元素的总宽度
 */
function getActivePrveDomWidth(dom: Element[], i: number) {
  const activePrevDom = dom.slice(0, i - 1)
  const width = activePrevDom.reduce((prev, cur) => {
    return prev + (cur?.clientWidth || 0)
  }, 0)
  return width
}

function resetTab(inline?: 'center' | 'nearest') {
  const index = props.list.findIndex(a => a.value === props.modelValue)
  props.needScrollIntoView && curTabRef.value[index]?.scrollIntoView({
    behavior: 'instant', block: 'nearest', inline: inline ?? 'center',
  })
  if (index === -1)
    return
  nextTick(() => {
    if (curTabRef.value && parent.value) {
      const parentRect = parent.value!.getBoundingClientRect()
      const childRect = curTabRef.value[index]!.getBoundingClientRect()
      dashWidth.value = `${childRect.width - 21}px`
      const offsetLeft = childRect.left - parentRect.left
      const padding = 2.5
      percent.value = offsetLeft + 8 + padding
    }
  })
}

onMounted(() => {
  const index = props.list.findIndex(a => a.value === props.modelValue)
  if (index === -1)
    return
  nextTick(() => {
    if (props.needScrollIntoView && isMobile.value && props.needScrollAtInit) {
      const index = props.list.findIndex(a => a.value === props.modelValue)
      curTabRef.value[index]?.scrollIntoView({
        behavior: 'instant', block: 'nearest', inline: 'center',
      })
    }
    if (curTabRef.value && parent.value) {
      const parentRect = parent.value!.getBoundingClientRect()
      const childRect = curTabRef.value[index]!.getBoundingClientRect()
      dashWidth.value = `${childRect.width - 21}px`
      const offsetLeft = childRect.left - parentRect.left
      const padding = 2.5
      percent.value = offsetLeft + 8 + padding
      nextTick(() => {
        setTimeout(() => {
          dashMountedClass.value = 'dash-mounted'
        }, 300)
      })
    }
  })
})

onActivated(() => {
  scrollDom.value?.scrollTo({ left: scrollDomX.value, behavior: 'instant' })
})

defineExpose({ resetTab })
</script>

<template>
  <div class="base-tab" :class="{ center, home: homePage }">
    <div
      ref="scrollDom"
      class="scroll-x base-tab-wrap hide-scrollbar"
      :class="{ full }"
    >
      <div
        ref="parent"
        class="square tab-wrap"
        :class="{ 'line-style': lineStyle }"
      >
        <div
          v-for="t, i in list" :key="i" :ref="el => curTabRef[i] = (el as Element)"
          class="tab-padding-box"
        >
          <div
            class="tab"
            :class="
              {
                'active': t.value === modelValue,
                'disabled': t.disabled || disabled,
                'is-mobile': isMobile,
              }"
            @click="onClick(t, i)"
          >
            <div class="content column">
              <slot name="tab" :item="t">
                <div
                  v-if="t.icon && showIcon" class="icon"
                  style="--app-sport-image-error-icon-size:14px;"
                >
                  <AppImage
                    v-if="useCloudImg || t.useCloudImg"
                    :with-theme="withTheme"
                    :active="t.value === modelValue"
                    style="width: var(--tg-base-tab2-icon-width); height: var(--tg-base-tab2-icon-height)"
                    :url="t.icon" is-cloud loading="eager"
                  />
                  <component v-else-if="(typeof t.icon) !== 'string'" :is="t.icon" style="display: block;" />
                </div>
                <span class="text">{{ t.label }}</span>
                <div v-if="t.bubble" class="bubble-wrap">
                  <div />
                </div>
              </slot>
            </div>
          </div>
        </div>
        <div class="dash" :class="[animateDash]" :style="{ width: dashWidth, transform: `translateX(${percent}px)` }" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-tabvn-style-wrap-bg-color: var(--tg-secondary-dark);
  --tg-tabvn-style-inner-padding-y: var(--tg-spacing-7);
  --tg-tabvn-style-inner-padding-x: var(--tg-spacing-13);
  --tg-tabvn-style-color: var(--tg-text-white);
  --tg-tabvn-style-line-active-text-color: var(--tg-text-blue);
  --tg-tabvn-style-box-padding:var(--tg-spacing-5);
  --tg-tabvn-style-active-bg: var(--tg-secondary-main);
  --tg-tabvn-active-text-color: var(--tg-text-white);
  --base-tab2-brightness: 2;
  --tg-base-tab2-base-filter:drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
  --tg-base-tab2-icon-height:22px;
  --tg-base-tab2-icon-width:auto;
}

[theme="green"] {
  --tg-tabvn-style-color: var(--tg-text-green-sub);
  --tg-tabvn-active-text-color: white;
  --base-tab2-brightness: 1;
 }

[theme="greenblack"] {
  --tg-tabvn-active-text-color: var(--tg-text-greenblack-main);
  --base-tab2-brightness: 1;
}

[theme="white"] {
  --tg-tabvn-active-text-color: var(--tg-white-text-main-color);
  --base-tab2-brightness: 1;
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
    background: var(--tg-primary-success);
    animation: OnlineFlash .2s ease-out;
    position: absolute;
    transform: translate(-50%, -50%) scale(1) !important;
  }
}

.base-tab {
  display: flex;
  max-width: 100%;
  border-radius: 4px;
  overflow: hidden;
  filter: var(--tg-base-tab2-base-filter);
  @include webTheme('white'){
    filter:none;
  }
  @include webTheme('green'){
    filter:none;
  }
  &.home {
    @include webTheme('green'){
      background-color: #02432D;
    }
    @include webTheme('new-default'){
      background-color: var(--tg-tabvn-style-wrap-bg-color);
    }
  }
}

.base-tab-wrap {
  display: flex;
  max-width: 100%;

  .tab-wrap {
    padding: var(--tg-tabvn-style-box-padding) 0;
    background-color: var(--tg-tabvn-style-wrap-bg-color);
    @include webTheme('green'){
      background-color: #02432D;
    }
    flex: 1;
    display: flex;
    // gap: var(--tg-spacing-5);
    scroll-snap-type: x mandatory;
    .tab-padding-box{
      flex: 1;
      display: flex;
      padding: 0 2.5px;
    }
  }

  .tab {
    flex: 1;
    font-size: var(--tg-font-size-default);
    color: var(--tg-tabvn-style-color);
    padding: var(--tg-tabvn-style-inner-padding-y) 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all ease .25s;
    font-weight: var(--tg-font-weight-semibold);
    @include webTheme('green'){
      color: #fff;
    }
    .content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1 0;
      white-space: nowrap;
      // gap: var(--tg-spacing-8);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      &.row {
        flex-direction: column;
        >* {
        margin-bottom: var(--tg-spacing-8);
        }
        >:last-child {
        margin-bottom: 0;
        }
      }
      &.column {
        flex-direction: column;
        >* {
          margin-bottom: var(--tg-spacing-6);
        }
        >:last-child {
        margin-bottom: 0;
        }
      }
    }

    &:active {
      .content {
        transform: scale(0.96);
      }
    }

    &.active {
      --tg-icon-color: var(--tg-tabvn-active-text-color);
      .icon{
        filter: brightness(var(--base-tab2-brightness));
      }
      .text {
        color: var(--tg-tabvn-active-text-color);
      }
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  // 横线风格
  .line-style {
    background-color: transparent;
    gap: 0;
    .tab-padding-box{
      padding:0;
    }
    .tab{
      background-color: transparent;
      border-radius: 0;
      border-bottom-style: solid;
      border-bottom-width: 2px;
      border-bottom-color: var(--tg-tabvn-style-active-bg);
      &.active{
        border-bottom-color: var(--tg-primary-active);
        color: var(--tg-tabvn-style-line-active-text-color);
      }
    }
  }
}

.full {
  flex: 1;
}

.center {
  justify-content: center;
}
.dash {
  height: 4px;
  position: absolute;
  left: 0;
  bottom : 0;
  width: 50px;
  background: var(--tg-tab-active-bar);
  &.dash-mounted {
    transition: all .2s ease-out;
  }
  @include webTheme('green'){
    background-color: #F6D14A;
  }
}
</style>

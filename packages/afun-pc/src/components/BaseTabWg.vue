<script setup lang='ts'>
interface TabItem {
  [text: string]: any
  value?: string | number
  label: string
  icon?: string | Component
  path?: string
  useCloudImg?: boolean
  infoTip?: string
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
}
defineOptions({
  name: 'BaseTabWg',
})
const props = withDefaults(defineProps<Props>(), {
  shape: 'round',
  center: true,
  size: 'small',
  needScrollIntoView: true,
  disableClick: false,
  showIcon: true,
  scrollInline: 'nearest',
})
const emit = defineEmits(['update:modelValue', 'change'])
const router = useLocalRouter()
const { isMobile } = storeToRefs(useWindowStore())

const curTabRef = ref<Array<Element | null>>([])

function onClick(tab: TabItem, i: number) {
  if (tab.value === props.modelValue || tab.disabled || props.disableClick)
    return
  if (tab.callBack)
    tab.callBack()

  if (tab.value !== void 0 && tab.value !== null) {
    emit('update:modelValue', tab.value)
    emit('change', tab.value)
  }

  if (tab.path)
    router.push(tab.path)

  if (tab.value !== void 0 && tab.value !== null) {
    nextTick(() => {
      props.needScrollIntoView && curTabRef.value[i]?.scrollIntoView({
        behavior: 'smooth', block: 'nearest', inline: props.scrollInline,
      })
    })
  }
}

function resetTab(inline?: 'center' | 'nearest') {
  const index = props.list.findIndex(a => a.value === props.modelValue)
  curTabRef.value[index]?.scrollIntoView({
    behavior: 'instant', block: 'nearest', inline: inline ?? 'center',
  })
}

onMounted(() => {
  nextTick(() => {
    if (props.needScrollIntoView && isMobile.value && props.needScrollAtInit) {
      const index = props.list.findIndex(a => a.value === props.modelValue)
      curTabRef.value[index]?.scrollIntoView({
        behavior: 'instant', block: 'nearest', inline: 'center',
      })
    }
  })
})

defineExpose({ resetTab })
</script>

<template>
  <div class="base-tab" :class="{ center }">
    <div class="scroll-x base-tab-wrap" :class="{ full, 'hide-scrollbar': lineStyle }">
      <div
        class="tab-wrap"
        :class="[shape, { 'line-style': lineStyle }]"
      >
        <div
          v-for="t, i in list" :key="i" :ref="el => curTabRef[i] = (el as Element)"
          class="tab-padding-box"
        >
          <div
            class="tab"
            :class="[`tab-${size}`,
                     {
                       'active': t.value === modelValue,
                       'disabled': t.disabled || disabled,
                       'is-mobile': isMobile,
                     }]"
            @click="onClick(t, i)"
          >
            <VDropdown
              theme="info-tooltip"
              :shown="t.infoTip"
            >
              <div class="content">
                <slot name="tab" :item="t">
                  <div
                    v-if="t.icon && showIcon" class="icon"
                    style="--app-sport-image-error-icon-size:14px;"
                  >
                    <AppImage
                      v-if="useCloudImg || t.useCloudImg"
                      :with-theme="withTheme"
                      :active="t.value === modelValue"
                      style="width: 14px;height: 14px;"
                      :url="t.icon" is-cloud loading="eager"
                    />
                    <component v-else-if="(typeof t.icon) !== 'string'" :is="t.icon" style="display: block;" />
                  </div>
                  <span>{{ t.label }}</span>
                  <div v-if="t.bubble" class="bubble-wrap">
                    <div />
                  </div>
                </slot>
              </div>
              <template #popper>
                {{ t.infoTip }}
              </template>
            </VDropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-wg-tab-style-wrap-bg-color: var(--tg-primary-light);
  --tg-wg-tab-style-inner-padding-y: var(--tg-spacing-10);
  --tg-wg-tab-style-inner-padding-x: var(--tg-spacing-13);
  --tg-wg-tab-style-color: var(--tg-text-white);
  --tg-wg-tab-style-line-active-text-color: var(--tg-text-blue);
  --tg-wg-tab-style-box-padding:var(--tg-spacing-5);
  --tg-wg-tab-style-active-bg: var(--tg-secondary-main);
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
}

.base-tab-wrap {
  display: flex;
  max-width: 100%;

  .tab-wrap {
    padding: var(--tg-wg-tab-style-box-padding) 0;
    background-color: var(--tg-wg-tab-style-wrap-bg-color);
    flex: 1;
    display: flex;
    // gap: var(--tg-spacing-5);
    scroll-snap-type: x mandatory;
    .tab-padding-box{
      flex: 1;
      display: flex;
      padding: 0 2.5px;
      &:first-of-type{
        padding-left: var(--tg-spacing-5);
      }
      &:last-of-type{
        padding-right:var(--tg-spacing-5) ;
      }
    }
  }

  .square {
    border-radius: var(--tg-radius-default);

    .tab-padding-box {
      border-radius: var(--tg-radius-default);
      .tab{
        border-radius: var(--tg-radius-default);
      }
    }
  }

  .round:not(.line-style) {
    border-radius: 100px;

    .tab-padding-box {
      border-radius: 100px;
      .tab{
        border-radius: 100px;
        @include webTheme('greenblack') {
          width: fit-content;
          height: 60px;
          border-radius: 4px;
          .content{
            display: flex;
            flex-direction: column;
            gap: 4px;
            font-size: 14px;
            .icon{
              margin: auto;
              .base-image{
                width:16px !important;
                height: 16px !important;
              }
            }
          }
        }
      }
    }
  }

  .tab {
    flex: 1;
    font-size: var(--tg-font-size-default);
    color: var(--tg-wg-tab-style-color);
    padding: var(--tg-wg-tab-style-inner-padding-y) var(--tg-wg-tab-style-inner-padding-x);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all ease .25s;
    font-weight: var(--tg-font-weight-semibold);
    .icon {
      // filter: brightness(2);
    }

    &.tab-large {
      --tg-wg-tab-style-inner-padding-y: var(--tg-spacing-11);
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
      >* {
        margin-right: var(--tg-spacing-8);
      }
      >:last-child {
        margin-right: 0;
      }
    }

    &:active {
      background-color: var(--tg-wg-tab-style-active-bg);
      .content {
        transform: scale(0.96);
      }
    }

    &:hover:not(.disabled):not(.is-mobile) {
      background-color: var(--tg-wg-tab-style-active-bg);
      --tg-icon-color: var(--tg-text-white);
      .icon{
        // filter: brightness(2);
      }
    }

    &.active {
      background-color: var(--tg-wg-tab-style-active-bg);
      --tg-icon-color: var(--tg-text-white);
      color: var(--tg-wg-tab-style-line-active-text-color);
      .icon{
        // filter: brightness(2);
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
      border-bottom-color: var(--tg-wg-tab-style-active-bg);
      &.active{
        border-bottom-color: var(--tg-primary-active);
        color: var(--tg-wg-tab-style-line-active-text-color);
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
</style>

<style lang="scss" scoped>
// @supports (not (gap: 1px)) {
  // .base-tab-wrap .tab .content {
  //   .icon {
  //     margin-right: var(--tg-spacing-8);
  //   }
  // }
// }
</style>

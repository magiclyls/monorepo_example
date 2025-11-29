<script setup lang='ts'>
interface ListItem {
  value: string | number
  label: string
  count?: number
  icon?: string|Component
  activeIcon?: string
  useCloudImg?: boolean
}
interface Props {
  list: ListItem[]
  modelValue: string | number
  hasCloudImg?: boolean
  tabFlex?: boolean
  withTheme?: boolean
  useFlex?: boolean
}
defineOptions({
  name: 'BaseSquareTab',
})
const props = withDefaults(defineProps<Props>(), {
  hasCloudImg: true,
})
const emit = defineEmits(['update:modelValue', 'change'])

const { isMobile } = storeToRefs(useWindowStore())

const curTabRef = ref<Array<Element | null>>([])
const lastIndex = ref(props.list.findIndex(a => a.value === props.modelValue))
const maxIndex = ref(props.list.length - 1)

function handleClick(item: ListItem, i: number) {
  emit('update:modelValue', item.value)
  emit('change', item)

  nextTick(() => {
    // 点击之后第二个元素要进入视口
    let nextOneIndex = i
    // 右边
    if (i > lastIndex.value) {
      if (i === maxIndex.value)
        nextOneIndex = i
      else
        nextOneIndex = i + 1
    }
    // 左边
    else {
      if (i === 0)
        nextOneIndex = i
      else
        nextOneIndex = i - 1
    }
    curTabRef.value[nextOneIndex]?.scrollIntoView({
      behavior: 'smooth', block: 'nearest', inline: 'nearest',
    })
    // 记录下标
    lastIndex.value = i
  })
}

// 统一加载tab中的网络icon
function loadIcon() {
  if (!props.hasCloudImg)
    return
  return new Promise((resolve) => {
    let a = 0
    const t = setInterval(() => {
      a++
      if (props.list && props.list.length > 0) {
        clearInterval(t)
        const arr = props.list.map((a) => {
          return a.useCloudImg ? application.loadImage(a.icon ?? '') : ''
        })
        Promise.allSettled(arr).then((result) => {
          resolve(result)
        })
      }
      else if (a > 300) {
        clearInterval(t)
        resolve(true)
      }
    }, 50)
  })
}

props.hasCloudImg && await application.allSettled([loadIcon() ?? Promise.resolve()])
</script>

<template>
  <div class="app-sports-tab">
    <div class="scroll-x">
      <div class="tab-wrap" :class="{ 'is-mobile': isMobile, 'tab-flex': tabFlex, 'use-flex': useFlex }">
        <div v-for="tab, i in list" :key="tab.value" :ref="el => curTabRef[i] = (el as Element)" class="tab">
          <div class="button" :class="{ active: tab.value === modelValue }" @click="handleClick(tab, i)">
            <div class="dot" />
            <div class="main">
              <div v-if="tab.icon" class="icon" style="--app-sport-image-error-icon-size:16px;">
                <AppImage
                  v-if="tab.useCloudImg" class="icon-img" :with-theme="withTheme"
                  :active="tab.value === modelValue" :class="{ 'icon-act': tab.value === modelValue }"
                  :url="tab.value === modelValue && tab.activeIcon ? tab.activeIcon : tab.icon" is-cloud
                />
                 <component v-else-if="(typeof tab.icon) !== 'string'" :is="tab.icon"></component>
                <BaseBadge
                  :mode="tab.value === modelValue ? 'active' : 'black'" style="--tg-badge-font-size:var(--tg-font-size-xs);
                    --tg-badge-padding-x:var(--tg-spacing-6);" class="badge" :count="tab.count" :max="99999"
                />
              </div>
              <div class="name">
                {{ tab.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-square-tab-padding-y: var(--tg-spacing-16);
  --tg-base-square-tab--padding-outer-y: 0;
  --tg-base-square-tab-bg: var(--tg-secondary-dark);
  --tg-base-square-tab-font-weight: var(--tg-font-weight-semibold);
  --tg-base-square-tab-padding-top: 14px;
  --tg-base-square-tab-dot-width: 28px;
  --tg-base-square-tab-icon-size: 26px;
  --tg-base-square-tab-font-size: var(--tg-font-size-default);
  --tg-base-square-tab-margin-top: 0;
  --tg-base-square-tab-mobile-justify: space-between;
  --tg-base-square-tab-mobile-gap: 25px;
  --tg-base-square-tab-name-color: var(--tg-text-lightgrey);
  --tg-base-square-tab-name-color-active: var(--tg-text-white);
  --tg-base-square-tab-dot-bg-color: var(--tg-primary-active);
}
</style>

<style>
:root {
  --base-square-tab-brightness: 2;
}

[theme="greenblack"] {
  --base-square-tab-brightness: 1;
}

[theme="green"] {
  --icon-color: #efd538;
  --tg-base-square-tab-bg-green: #055434;
  --tg-base-square-tab-name-color-active: #FEFEFE;
}

[theme="white"] {
  --base-square-tab-brightness: 1;
}
</style>

<style lang='scss' scoped>
.app-sports-tab {
  width: 100%;
  margin-top: var(--tg-base-square-tab-margin-top);
  // display: flex;
  // align-items: center;
  // margin: var(--tg-base-square-tab-margin);
  padding: 0 16px;
  background-color: var(--tg-base-square-tab-bg);
  border-radius: var(--tg-radius-default);
  overflow: hidden;
  padding-bottom: var(--tg-base-square-tab--padding-outer-y);

  @include webTheme('white') {
    background-color: #f5f5f5;
  }

  @include webTheme('green') {
    background-color: var(--tg-base-square-tab-bg-green);
  }

  .scroll-x {
    padding-bottom: var(--tg-base-square-tab-padding-y);
  }
}

.tab-wrap {
  display: inline-flex;

  // gap:55px;
  // padding-left: 33px;
  &.tab-flex {
    .tab {
      flex: 1;
    }
  }

  >* {
    margin-right: 55px;
  }

  >:last-child {
    margin-right: 0;
  }

  .tab {
    flex-shrink: 0;
    position: relative;

    .button {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      cursor: pointer;
      padding-top: 14px;

      .dot {
        display: none;
        content: "";
        background: var(--tg-base-square-tab-dot-bg-color);
        width: var(--tg-base-square-tab-dot-width);
        height: 7px;
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 1;
        transform: translate(-50%);
        border-radius: 0 0 3px 3px;

        @include webTheme('white') {
          background: #F2CA5C;
        }
      }

      .main {
        display: grid;
        grid-auto-flow: row;
        gap: var(--tg-spacing-4);
        place-items: center;
        position: relative;
        font-size: var(--tg-font-size-xs);

        .icon {
          font-size: var(--tg-base-square-tab-icon-size);
          width: var(--tg-base-square-tab-icon-size);
          height: var(--tg-base-square-tab-icon-size);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          .badge {
            position: absolute;
            top: -8px;
            left: 55%;
          }
        }

        .name {
          font-size: var(--tg-base-square-tab-font-size);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5;
          // max-width: 6ch;
          color: var(--tg-base-square-tab-name-color);
          font-weight: var(--tg-base-square-tab-font-weight);
        }
      }

      &:active {
        .main {
          transform: scale(0.96);

          .icon {
            filter: brightness(var(--base-square-tab-brightness));

            .icon-img {
              filter: brightness(var(--base-square-tab-brightness));
            }
          }
        }
      }

      &:hover {
        .main {
          .name {
            color: var(--tg-base-square-tab-name-color-active);

            @include webTheme('greenblack') {
              color: var(--tg-text-greenblack-main);
            }

            @include webTheme('white') {
              color: var(--tg-white-text-main-color);
            }
          }

          .icon {
            filter: brightness(var(--base-square-tab-brightness));
            --tg-icon-color: var(--tg-base-square-tab-name-color-active);

            .icon-img {
              filter: brightness(var(--base-square-tab-brightness));
            }

            @include webTheme('greenblack') {
              --tg-icon-color: var(--tg-text-greenblack-main);
            }

            @include webTheme('white') {
              --tg-icon-color: #F2CA5C;
            }

          }
        }
      }

      &.active {
        .dot {
          display: block;
        }

        .main {
          .name {
            color: var(--tg-base-square-tab-name-color-active);

            @include webTheme('greenblack') {
              color: var(--tg-text-greenblack-main);
            }

            @include webTheme('white') {
              color: #F2CA5C;
            }
          }

          .icon {
            filter: brightness(var(--base-square-tab-brightness));
            --tg-icon-color: var(--tg-base-square-tab-name-color-active);

            .icon-img {
              filter: brightness(var(--base-square-tab-brightness));
            }

            @include webTheme('greenblack') {
              --tg-icon-color: var(--tg-text-greenblack-main);
            }

            @include webTheme('white') {
              --tg-icon-color: #F2CA5C;
            }
          }
        }
      }

    }
  }

  &.use-flex {
    .tab {
      flex: 1;
    }
  }

  &.is-mobile {
    width: 100%;
    // gap: var(--tg-base-square-tab-mobile-gap);
    justify-content: var(--tg-base-square-tab-mobile-justify);

    >* {
      margin-right: var(--tg-base-square-tab-mobile-gap);
    }

    >:last-child {
      margin-right: 0;
    }

    .button {
      padding-top: var(--tg-base-square-tab-padding-top);

      .main {
        gap: var(--tg-spacing-4);

        .icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }

        .name {
          line-height: 1.5;
        }
      }
    }
  }
}
</style>

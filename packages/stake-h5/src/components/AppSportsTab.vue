<script setup lang='ts'>

interface ListItem {
  si: number
  sn: string
  count: number
  icon: string
  useCloudImg?: boolean
}
interface Props {
  list: ListItem[]
  modelValue: number
}
defineOptions({
  name: 'AppSportsTab',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])

const {isZhcn} = storeToRefs(useLanguageStore())
const { theme } = storeToRefs(useAppStore())
const isHaveActiveIconImg = computed(() => ['green', 'white', 'greenblack'].includes(theme.value))

const curTabRef = ref<Array<Element | null>>([])
const lastIndex = ref(props.list.findIndex(a => a.si === props.modelValue))
const maxIndex = ref(props.list.length - 1)

function handleClick(item: ListItem, i: number) {
  emit('update:modelValue', item.si)
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
</script>

<template>
  <div class="app-sports-tab">
    <div class="scroll-x w-full">
      <div class="tab-wrap" :class="{isZhcn}">
        <div v-for="tab, i in list" :key="tab.si" :ref="el => curTabRef[i] = (el as Element)" class="tab">
          <BaseButton type="text" size="none" @click="handleClick(tab, i)">
            <div class="button" :class="{ active: tab.si === modelValue }">
              <div class="dot" />
              <div class="main">
                <div class="icon" style="--app-sport-image-error-icon-size:28px;">
                  <AppImage
                    v-if="tab.useCloudImg "
                    :active="tab.si === modelValue"
                    class="icon-img"
                    :class="{ 'icon-act': tab.si === modelValue }"
                    :url="tab.icon" is-cloud :with-theme="isHaveActiveIconImg"
                  />
                  <component v-else :is="tab.icon" />
                  <BaseBadge
                    :mode="tab.si === modelValue ? 'active' : 'black'"
                    style="--tg-badge-font-size:var(--tg-font-size-xs);
                    --tg-badge-padding-x:var(--tg-spacing-6);"
                    class="badge" :count="tab.count" :max="99999"
                  />
                </div>
                <div class="name">
                  {{ tab.sn }}
                </div>
              </div>
            </div>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --app-sprots-tab-brightness: 2;
}

[theme="green"] {
  --app-sprots-tab-brightness: 1;
 }

 [theme="greenblack"] {
  --app-sprots-tab-brightness: 1;
 }

 [theme="white"] {
  --app-sprots-tab-brightness: 1;
 }
</style>

<style lang='scss' scoped>
.app-sports-tab {
  padding: 0 8px;
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: var(--tg-spacing-12);
  margin-bottom: var(--tg-spacing-12);
  background-color: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);
  overflow: hidden;
  @include webTheme('greenblack') {
    background-color: transparent;
    >div{
      width: 100%;
    }
  }
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}

.tab-wrap {
  padding: 16px 0;
  display: inline-flex;
  gap: 12px;
  &.isZhcn{
    gap: 24px;
  }

  .tab {
    flex-shrink: 0;
    position: relative;

    .button {
      .dot {
        display: none;
        content: "";
        background: var(--tg-primary-active);
        width: 12px;
        height: 6px;
        position: absolute;
        top: calc(-1 * var(--tg-spacing-16));
        left: 50%;
        z-index: 1;
        transform: translate(-50%);
        border-radius: 0 0 100% 100%;
        @include webTheme('greenblack') {
          background: transparent;
        }
        @include webTheme('white') {
          background: #F2CA5C;
        }
        @include webTheme('green') {
          background: #F6D14A;
        }
      }

      .main {
        display: grid;
        grid-auto-flow: row;
        gap: var(--tg-spacing-8);
        place-items: center;
        position: relative;
        // width: 58px;
        // max-width: 58px;
        width: auto;
        font-size: var(--tg-font-size-xs);

        @include webTheme('greenblack') {
          width:56px;
          padding: 6px 0;
          border-radius: 6px;
        }

        .icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .icon-act{
            filter: brightness(var(--app-sprots-tab-brightness));
          }
          .badge {
            position: absolute;
            top: -8px;
            left: 55%;

            @include webTheme('greenblack') {
              left: 86%;
            }
            @include webTheme('white') {
              --tg-badge-background-color: #555555;
              --tg-badge-color: #fff ;
            }
            @include webTheme('green') {
              --tg-badge-background-color: #055434;
              --tg-badge-color: #76F0C5 ;
            }
          }
        }

        .name {
          font-size: var(--tg-font-size-xs);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          // max-width: 6ch;
          color: var(--tg-text-lightgrey);
          @include webTheme('green') {
            color: var(--tg-text-green-sub);
          }

        }
      }

      &.active {
        .dot {
          display: block;
        }

        .main {
          @include webTheme('greenblack') {
            background: #5A5A5A;
          }
          .badge {
              @include webTheme('green') {
                --tg-badge-background-color: #F6D14A;
                --tg-badge-color: #055434 ;
              }
              @include webTheme('white') {
                --tg-badge-background-color: #FF9E36;
              }
          }

          .name {
            color: var(--tg-text-white) !important;
            @include webTheme('white') {
              color: #F2CA5C !important;
            }
          }
        }
      }
      &:hover{
        .main{
          .icon{
            .icon-img{
              filter: brightness(var(--app-sprots-tab-brightness));
            }
          }
        }
      }
    }
  }
}
</style>

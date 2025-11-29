<script setup lang='ts'>
import { isZhcn } from '@tg/vue-i18n'

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
    <div class="scroll-x base-tab-wrap">
      <div class="tab-wrap"  :class="[isZhcn() ? 'gap-[24px]' : 'gap-[12px]']">
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
</style>

<style lang='scss' scoped>
.app-sports-tab {
  width: 100%;
  display: flex;
  align-items: center;
  margin-top: var(--tg-spacing-12);
  margin-bottom: var(--tg-spacing-12);
  background-color: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);
  overflow: hidden;
  padding: 0 8px;

  .base-tab-wrap {
    width: 100%;
    max-width: 100%;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.tab-wrap {
  padding: var(--tg-spacing-16) 0;
  display: inline-flex;

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
      }

      .main {
        display: grid;
        grid-auto-flow: row;
        gap: var(--tg-spacing-8);
        place-items: center;
        position: relative;
        // width: 58px;
        // max-width: 58px;
        font-size: var(--tg-font-size-xs);

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
          }
        }

        .name {
          font-size: var(--tg-font-size-xs);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          // max-width: 6ch;
          color: var(--tg-text-lightgrey);
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

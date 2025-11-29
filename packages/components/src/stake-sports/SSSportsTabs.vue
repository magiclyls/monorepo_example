<script setup lang='ts'>
import { isZhcn } from '@tg/vue-i18n'
import { computed, nextTick, ref } from 'vue'
import SSAppImage from './SSAppImage.vue'

interface ITabItem {
  si: number
  sn: string
  count: number
  icon: string
  useCloudImg?: boolean
}
interface Props {
  modelValue: number
  list: ITabItem[]
  /** 球种图片路径 */
  sportDirectory?: string
  /** 项目名称 */
  projectName?: string
}

defineOptions({ name: 'SSSportsTabs' })
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'change'])

const curTabRef = ref<Array<Element | null>>([])
const lastIndex = ref(props.list.findIndex(a => a.si === props.modelValue))
const maxIndex = ref(props.list.length - 1)

const _list = computed(() => props.list.map((a) => {
  const arr = a.icon.split('.')

  return {
    ...a,
    active: a.si === props.modelValue,
    activeIcon: `${arr[0]}_active` + `.${arr[1]}`,
    // sn: isZhcn() && a.sn.length > 4 ? `${a.sn.slice(0, 4)}...` : a.sn,
  }
}))
// queen项目
const isQueenH5 = computed(() => props.projectName === 'ph-h5')
// Afun项目
const isAfunH5 = computed(() => props.projectName === 'afun-h5')

function onClickHandler(item: ITabItem, i: number) {
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
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
    // 记录下标
    lastIndex.value = i
  })
}
</script>

<template>
  <div class="base-tab">
    <div class="scroll-x base-tab-wrap">
      <div class="flex" :class="[isZhcn() ? 'gap-[24rem]' : 'gap-[12rem]']">
        <div
          v-for="item, i in _list" :key="item.si" :ref="el => curTabRef[i] = (el as Element)" class="tab"
          :class="{ active: item.active, isZhcn: isZhcn() }" @click="onClickHandler(item, i)"
        >
          <div class="w-[26rem] relative h-[26rem] mb-[8rem]">
            <template v-if="isQueenH5">
              <SSAppImage v-show="!item.active" :sport-directory="sportDirectory" :url="item.icon" style="--ss-sport-image-error-icon-size:26rem;" />
              <SSAppImage v-show="item.active" :sport-directory="sportDirectory" :url="item.activeIcon" style="--ss-sport-image-error-icon-size:26rem;" />
            </template>
            <template v-else>
              <SSAppImage
                :sport-directory="sportDirectory" :url="item.icon" style="--ss-sport-image-error-icon-size:26rem;"
                :style="{ filter: `brightness(${item.active ? '2' : '1'})` }"
              />
            </template>
            <span class="count">{{ item.count }}</span>
          </div>
          <span class="name">{{ item.sn }}</span>
          <span class="dot" :class="{ active: item.active }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss'>
:root {
  --ss-spt-tabs-bg1: #fff;
  --ss-spt-tabs-bg2: #6d7693;
  --ss-spt-tabs-bg3: #f23038;
  --ss-spt-tabs-bg4: #f23038;
  --ss-spt-tabs-color1: #0d2245;
  --ss-spt-tabs-color2: #fff;
  --ss-spt-tabs-color3: #f23038;
  --ss-spt-tabs-color4: #fff;
}
</style>

<style lang='scss' scoped>
.base-tab {
  width: 100%;
  max-width: 100%;
  background-color: var(--ss-spt-tabs-bg1);
  border-radius: 8rem;
  padding: 0 8rem;

  .base-tab-wrap {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }
}

.tab {
  flex-shrink: 0;
  // width: 58rem;
  // max-width: 58rem;
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16rem 0;
  position: relative;

  .name {
    font-size: 12rem;
    color: var(--ss-spt-tabs-color1);
    line-height: 12rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // max-width: 6ch;
  }
  .count {
    font-size: 12rem;
    font-weight: 600;
    color: var(--ss-spt-tabs-color2);
    line-height: 14rem;
    padding: 0 5rem;
    display: inline-block;
    position: absolute;
    background-color: var(--ss-spt-tabs-bg2);
    border-radius: 50rem;
    top: -6rem;
    right: 0;
    transform: translateX(66%);
  }

  &.active {
    .name {
      color: var(--ss-spt-tabs-color3);
    }
    .count {
      color: var(--ss-spt-tabs-color4);
      background-color: var(--ss-spt-tabs-bg3);
    }
  }

  .dot {
    display: none;
    position: absolute;
    top: 0;

    &.active {
      display: block;
      width: 12rem;
      height: 6rem;
      border-radius: 0 0 4rem 4rem;
      background-color: var(--ss-spt-tabs-bg4);
    }
  }

  // &.isZhcn {
  //   width: 62rem;
  //   max-width: 68rem;
  //   .name {
  //     max-width: 9ch;
  //   }
  // }
}
</style>

<script setup lang="ts">
import type { MenuItem } from '@tg/types'
import { AfunBaseArrow } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { computed, h, nextTick, ref, watch } from 'vue'
import AppImage from './AppImage.vue'
import BaseRadio from './BaseRadio.vue'
import BaseRadioGroup from './BaseRadioGroup.vue'

interface Props {
  menuInfo: any
  autoShow?: boolean
  domId?: string
  arrowSize?: 'small' | 'big'
}
defineOptions({
  name: 'BaseAccordion',
})
const props = withDefaults(defineProps<Props>(), {
  menuInfo: () => {
    return {
      title: '',
      icon: () => h('div'),
      list: [],
    }
  },
  autoShow: false,
  arrowSize: 'big',
})

const emit = defineEmits(['clickHead', 'clickItem', 'radioChange'])

const { bool: isShow, setBool: setAutoShowBool } = useBoolean(props.autoShow)

const radioValue = ref(props.menuInfo.value === void 0 ? '' : props.menuInfo.value)

const showDown = computed(() => {
  return props.menuInfo?.list?.length
})

function handleClickHeader() {
  setAutoShowBool(!isShow.value)
  emit('clickHead', props.menuInfo, isShow.value)

  nextTick(() => {
    if (!isShow.value)
      return
    if (props.domId !== 'static-menu-language')
      return

    const headerEl = document.getElementById(props?.domId || '')
    // content 通常是 header 的下一个兄弟节点（template 中就是这样）
    const contentEl = headerEl?.nextElementSibling as HTMLElement | null
    if (!contentEl)
      return

    const cs = window.getComputedStyle(contentEl)
    const td = cs.transitionDuration || '0s'
    let dur = 0
    try {
      dur = td.includes('ms') ? Number.parseFloat(td) : Number.parseFloat(td) * 1000
    }
    catch {
      dur = 0
    }

    const doScrollIfNeeded = () => {
      const rect = contentEl.getBoundingClientRect()
      const viewBottom = window.innerHeight || document.documentElement.clientHeight

      if (rect.bottom > viewBottom) {
        const delta = rect.bottom
        window.scrollBy({ top: delta, left: 0, behavior: 'smooth' })
      }
    }

    if (dur > 20) {
      setTimeout(doScrollIfNeeded, dur + 30)
    }
    else {
      doScrollIfNeeded()
    }
  })
}

function handleClickItem(item: any) {
  emit('clickItem', item)
}
function close() {
  setAutoShowBool(false)
}

watch(() => props.menuInfo.value, (val) => {
  radioValue.value = val
})

watch(radioValue, (val) => {
  emit('radioChange', val)
})

defineExpose({ close })
</script>

<template>
  <div class="base-accordion" :class="{ 'only-accordion': !isShow }">
    <div :id="domId" class="accordion-header" :class="{ isShow }" @click="handleClickHeader">
      <div class="title flex-center" style="--app-sport-image-error-icon-size:14px;">
        <AppImage
          v-if="menuInfo.useCloudImg" style="width: 18px;height: 18px;" :url="menuInfo.icon" is-cloud with-theme
          class="icon-img"
        />
        <component :is="menuInfo.icon" v-else-if="(typeof menuInfo.icon) !== 'string'" class="text-[18px] text-[#B1BAD3]" />
        <span class="header-title">{{ menuInfo.title }}</span>
      </div>
      <template v-if="showDown">
        <AfunBaseArrow :direction="isShow ? 'bottom' : 'right'" />
      </template>
    </div>
    <div
      v-if="showDown"
      class="accordion-content" :style="`height:${isShow ? 'auto' : 0};
      transition: height .3s; interpolate-size: allow-keywords`"
    >
      <!-- <div class="content-line" /> -->

      <template v-if="menuInfo.type === 'radio'">
        <BaseRadioGroup v-model="radioValue" :columns="1">
          <div
            v-for="item in menuInfo.list.map((r: MenuItem) => ({ ...r, label: r.title }))" :key="item.value"
            class="radio-menu-item pr-[16px]"
          >
            <BaseRadio :value="item.value" class="w-full">
              {{ item.label }}
            </BaseRadio>
          </div>
        </BaseRadioGroup>
      </template>

      <template v-else>
        <template v-for="item of menuInfo.list" :key="item.id">
          <slot :menu-item="{ ...item, domId }">
            <div class="content-item" @click="handleClickItem(item)">
              <component :is="item.icon" v-if="item.icon" />
              <span class="header-title">{{ item.title }}</span>
            </div>
          </slot>
        </template>
      </template>
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-accordion-header-height: 45px;
  --base-accordion-base-accordion-arrow-active: #55708680;
  --base-accordion-text-color: #fff;
  --base-accordion-icon-header-color: #fff;
  --base-accordion-icon-header-active-color: #fff;
  --base-accordion-icon-brightness: 2;
  --base-accordion-accordion-content-background-color: #1a2c38;
}
</style>

<style scoped lang="scss">
.base-accordion {
  color: var(--base-accordion-text-color);
  font-weight: 600;
  font-size: 14px;
  --tg-radio-group-style-gap-vertical: 0;
  --tg-radio-group-style-gap-horizontal: 0;
  --tg-base-radio-style-just-content: space-between;
  --tg-base-radio-style-flex-direction: row-reverse;

  .accordion-header {
    display: flex;
    height: var(--tg-base-accordion-header-height);
    min-height: 48px;
    padding: 0 16px;
    border-radius: 4px 4px 0 0;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    .title {
      flex: 1;
      justify-content: flex-start;
      width: 0;
    }

    .header-icon {
      width: 20px;
      height: 20px;
      border-radius: 100px;
      background-color: #2f4553;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      --tg-icon-color: var(--base-accordion-icon-header-color);

      &.small {
        width: 16px;
        height: 16px;
      }
    }

    &.isShow {
      background-color: #1a2c38;
      --tg-icon-color: #fff;
    }

    &:hover {
      // background-color: #2f4553;
      --tg-icon-color: #fff;
      .icon-img {
        filter: brightness(var(--base-accordion-icon-brightness));
      }
    }
  }

  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .accordion-content {
    overflow: hidden;
    // transition: max-height 0.8s;
    background-color: var(--base-accordion-accordion-content-background-color);

    .content-line {
      background: #2f4553;
      height: 2px;
      width: 100%;
    }

    .content-item,
    .radio-menu-item {
      height: 45px;
      display: flex;
      border-radius: 4px;
      padding-left: 42px;
      align-items: center;
      cursor: pointer;

      > div {
        height: 100%;
      }
    }
  }

  .header-title {
    padding-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
  }
}

.only-accordion {
  border-radius: 0 0 4px 4px;
  overflow: hidden;
}
</style>

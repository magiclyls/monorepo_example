<script setup lang="ts">
import type { MenuItem } from '~/composables/useApiMenuData'
import { IconUniArrowDown, IconUniArrowRight } from '@tg/icons';

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
      icon: () => h("div"),
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
        <AppImage v-if="menuInfo.useCloudImg" style="width: 14px;height: 14px;" :url="menuInfo.icon" is-cloud with-theme
          class="icon-img" />
        <component v-else-if="(typeof menuInfo.icon) !== 'string'"  :is="menuInfo.icon" />
        <span class="header-title">{{ menuInfo.title }}</span>
      </div>
      <template v-if="showDown">
        <div class="header-icon" :class="[isShow ? 'is-show' : '', arrowSize]">
          <IconUniArrowDown v-if="isShow" />
          <IconUniArrowRight v-else />
        </div>
      </template>
    </div>
    <div v-if="showDown" class="accordion-content" :style="`max-height:${isShow ? '2000px' : 0};
      transition: max-height ${isShow ? '1' : '0.3'}s;`">
      <div class="content-line" />

      <template v-if="menuInfo.type === 'radio'">
        <BaseRadioGroup v-model="radioValue" :columns="1">
          <div v-for="item in menuInfo.list.map((r: MenuItem) => ({ ...r, label: r.title }))" :key="item.value"
            class="radio-menu-item">
            <BaseRadio :value="item.value">
              {{ item.label }}
            </BaseRadio>
          </div>
        </BaseRadioGroup>
      </template>

      <template v-else>
        <template v-for="item of menuInfo.list" :key="item.id">
          <slot :menu-item="{ ...item, domId }">
            <div class="content-item" @click="handleClickItem(item)">
              <component v-if="item.icon" :is="item.icon" />
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
  --base-accordion-text-color: var(--tg-text-white);
  --base-accordion-icon-header-color: var(--tg-text-white);
  --base-accordion-icon-header-active-color: var(--tg-text-white);
  --base-accordion-icon-brightness: 2;
  --base-accordion-accordion-content-background-color: var(--tg-secondary-grey);
}

[theme="green"] {
  --base-accordion-arrow-active: #55708680;
  --base-accordion-text-color: var(--tg-text-white);
  --base-accordion-icon-header-color: #5ECEA6;
  --base-accordion-icon-header-active-color: var(--tg-svg-default-color);
  --base-accordion-icon-brightness: 1;
  --base-accordion-accordion-content-background-color: #1B6C46;
}

[theme="greenblack"] {
  --base-accordion-accordion-arrow-active: var(--tg-primary-active);
  --base-accordion-text-color: var(--tg-text-white);
  --base-accordion-icon-header-color: var(--tg-text-white);
  --base-accordion-icon-header-active-color: var(--tg-text-black);
  --base-accordion-icon-brightness: 1;
}
</style>

<style scoped lang="scss">
.base-accordion {
  color: var(--base-accordion-text-color);
  font-weight: var(--tg-font-weight-semibold);
  --tg-radio-group-style-gap-vertical: 0;
  --tg-radio-group-style-gap-horizontal: 0;
  --tg-base-radio-style-just-content: space-between;
  --tg-base-radio-style-flex-direction: row-reverse;

  .accordion-header {
    display: flex;
    height: var(--tg-base-accordion-header-height);
    min-height: 45px;
    padding: 0 16px;
    border-radius: var(--tg-radius-default) var(--tg-radius-default) 0 0;
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
      width: var(--tg-spacing-24);
      height: var(--tg-spacing-24);
      border-radius: 100px;
      background-color: #55708680;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      --tg-icon-color: var(--base-accordion-icon-header-color);

      @include webTheme('green') {
        background-color: #055434;
      }

      &.is-show {
        --tg-icon-color: var(--base-accordion-icon-header-active-color);
        background-color: var(--base-accordion-accordion-arrow-active);
      }

      &.small {
        width: var(--tg-spacing-16);
        height: var(--tg-spacing-16);
      }
    }

    &.isShow {
      background-color: var(--tg-secondary-grey);
      --tg-icon-color: var(--tg-text-white);

      @include webTheme('green') {
        background-color: #1B6C46;
        --tg-icon-color: var(--tg-svg-default-color);
      }
    }

    &:hover {
      background-color: var(--tg-secondary-main);
      --tg-icon-color: var(--tg-text-white);

      @include webTheme('green') {
        background-color: #197B59;
        --tg-icon-color: var(--tg-svg-default-color);
        --tg-base-radio-style-color: #5ecea6;
        --tg-icon-color: #fff;

      }

      @include webTheme('white') {
        background-color: var(--tg-white-primary-active-bg);
        --tg-icon-color: var(--tg-svg-default-color);
      }

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
    max-height: 0;
    overflow: hidden;
    // transition: max-height 0.8s;
    background-color: var(--base-accordion-accordion-content-background-color);

    .content-line {
      background: var(--tg-secondary-main);
      height: 2px;
      width: 100%;
    }

    .content-item,
    .radio-menu-item {
      height: 45px;
      display: flex;
      border-radius: var(--tg-radius-default);
      padding-left: 16px;
      align-items: center;
      cursor: pointer;

      >div {
        height: 100%;
      }
    }

    .content-item:hover,
    .radio-menu-item:hover {
      background-color: var(--tg-secondary-main);

      @include webTheme('green') {
        background-color: #0e6746;
        --tg-icon-color: var(--tg-svg-default-color);
        --tg-base-radio-text-active-color: #5ecea6;
      }

      @include webTheme('white') {
        background-color: #F2CA5C;
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
  border-radius: 0 0 var(--tg-radius-default) var(--tg-radius-default);
  overflow: hidden;
}
</style>

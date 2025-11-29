<script lang="ts" setup>
import { IconUniStakeArrowDown, IconSptSoccer } from '@tg/icons';

interface Props {
  title?: string
  icon?: Component|string
  showMore?: boolean
  loading?: boolean
  level?: string | number
  init?: boolean
  disabled?: boolean
  isCloudIcon?: boolean
}
defineOptions({
  name: 'BaseSecondaryAccordion',
})
const props = withDefaults(defineProps<Props>(), {
  init: true,
})

const emit = defineEmits(['more', 'open', 'close'])

const { bool: isOpen, setBool } = useBoolean(props.init)

const openCount = ref(0)

function loadMore() {
  emit('more')
}

function toggle() {
  setBool(!isOpen.value)
  if (isOpen.value) {
    openCount.value += 1
    emit('open', openCount.value)
  }
  else {
    emit('close')
  }
}
</script>

<template>
  <div class="base-secondary-accordion" :class="[isOpen ? 'is-open' : '', `level-${level}`]">
    <div class="header no-active-scale" :class="{ disabled }" @click="toggle">
      <slot name="header">
        <div class="wrap">
          <div class="wrap" :style="{
            '--app-sport-image-error-icon-size': '16px',
          }">
            <template v-if="icon">
              <AppImage v-if="isCloudIcon" width="16px" height="16px" is-cloud :url="icon"
                style="border-radius: 50%;overflow: hidden;flex-shrink: 0;" />
              <component v-else-if="(typeof icon) !== 'string'" :is="icon"></component>
            </template>

            <div class="wrap">
              <div class="center">
                <span>{{ title }}</span>
              </div>
              <slot name="sideThird" :is-open="isOpen" />
            </div>
            <slot name="sideSecond" :is-open="isOpen" />
          </div>
          <slot name="side" :is-open="isOpen" />
        </div>
      </slot>
      <div v-show="!disabled" class="arrow" :class="{ down: !isOpen }">
        <IconUniStakeArrowDown name="uni-stake-arrow-down" />
      </div>
    </div>
    <div v-if="isOpen" class="content" :class="{ 'is-open': isOpen }">
      <slot :is-open="isOpen" />
      <div v-if="showMore" class="show-more">
        <hr>
        <div class="load-more-box">
          <BaseButton type="text" @click="loadMore">
            <span v-if="!loading">{{ $t('load_more') }}</span>
            <span v-else class="ani-scale">
              <IconSptSoccer name="spt-soccer" />
            </span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --tg-secondaryAccordion-header-background: var(--tg-secondary-grey);
  --tg-secondaryAccordion-header-title-color: var(--tg-text-grey-light);
  --tg-secondaryAccordion-content-background: var(--tg-secondary-grey);
  --tg-secondaryAccordion-content-border-color: var(--tg-secondary-main);
  --tg-secondaryAccordion-header-padding-x: var(--tg-spacing-16);
  --tg-secondaryAccordion-header-padding-y: var(--tg-spacing-12);
  --title-span-color: inherit;
}

:root {
  --tg-secondaryAccordion-header-common-title-color: var(--tg-text-grey-light);
  --tg-secondaryAccordion-header-level1-title-color: var(--tg-text-white);
}

[theme="green"] {
  --title-span-color: #fff;
}

[theme="greenblack"] {
  --tg-secondaryAccordion-header-common-title-color: var(--tg-text-white);
  --tg-secondaryAccordion-header-level1-title-color: var(--tg-text-white);
}
</style>

<style lang="scss" scoped>
.load-more-box {
  padding-left: var(--tg-spacing-16);
  padding-top: var(--tg-spacing-12);
  padding-bottom: var(--tg-spacing-12);
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

@keyframes aniScale {
  0% {
    transform: scale(0.85);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(0.85);
  }
}

.ani-scale {
  animation: 800ms linear 0ms infinite normal both running aniScale;
}

.level-1 {
  --tg-secondaryAccordion-header-background: var(--tg-text-grey-deep);
  --tg-secondaryAccordion-header-title-color: var(--tg-secondaryAccordion-header-level1-title-color);
  --tg-secondaryAccordion-content-background: var(--tg-primary-main);
  --tg-secondaryAccordion-content-border-color: var(--tg-text-grey-deep);

  .arrow {
    --tg-icon-color: var(--tg-text-white);

    @include webTheme('green') {
      --tg-icon-color: #5ECEA6;
    }
  }
}

.level-2 {
  --tg-secondaryAccordion-header-background: var(--tg-secondary-grey);
  --tg-secondaryAccordion-header-title-color: var(--tg-secondaryAccordion-header-common-title-color);
  --tg-secondaryAccordion-content-background: var(--tg-secondary-grey);
  --tg-secondaryAccordion-content-border-color: var(--tg-secondary-main);

  @include webTheme('white') {
    --tg-secondaryAccordion-header-background: #f5f5f5;
    --tg-secondaryAccordion-content-background: #f5f5f5;
  }
}

.level-3 {
  --tg-secondaryAccordion-header-background: var(--tg-secondary-dark);
  --tg-secondaryAccordion-header-title-color: var(--tg-secondaryAccordion-header-common-title-color);
  --tg-secondaryAccordion-content-background: var(--tg-secondary-dark);
  --tg-secondaryAccordion-content-border-color: var(--tg-secondary-main);
}

.base-secondary-accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 0;
  box-shadow: var(--tg-box-shadow), var(--tg-shadow-inset);
  border-radius: var(--tg-radius-default);
  background: var(--header-background);
  --header-background: var(--tg-secondaryAccordion-header-background);

  @include webTheme('white') {
    box-shadow: none;
  }

  @include webTheme('green') {
    box-shadow: none;
  }

  --title-color: var(--tg-secondaryAccordion-header-common-title-color);
  --content-background: var(--tg-secondaryAccordion-content-background);
  --content-border: var(--tg-secondaryAccordion-content-border-color);

  &.is-open {
    .header {
      border-radius: var(--tg-radius-default) var(--tg-radius-default) 0 0;
    }
  }

  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--tg-font-size-base);
    width: var(--tg-spacing-18);
    height: var(--tg-spacing-18);
    transition: all ease .25s;

    &.down {
      transform: rotate(90deg);
    }
  }

  .header {
    width: 100%;
    z-index: 4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: 0 0;
    padding: var(--tg-secondaryAccordion-header-padding-y) var(--tg-secondaryAccordion-header-padding-x);
    color: var(--title-color);
    cursor: pointer;
    border-radius: var(--tg-radius-default);
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);
    line-height: 1.5;

    @include webTheme('white') {
      --title-color: #111111;
    }

    .wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      >*:not(:first-child) {
        margin-left: var(--tg-spacing-8);
      }
    }

    .center {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      color: var(--title-color);

      >*:not(:first-child) {
        margin-top: var(--tg-spacing-8);
      }

      >span {
        display: inline-flex;
        align-items: center;
        text-align: left;
        justify-content: flex-start;
        color: var(--title-span-color);
      }
    }

    &.disabled {
      cursor: not-allowed;
      pointer-events: none;
    }
  }

  .content {
    background: var(--content-background);
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0 0 var(--tg-radius-default) var(--tg-radius-default);

    &.is-open {
      border-top: 1px solid var(--content-border);

      @include webTheme('greenblack') {
        border-color: #4C4C4C;
      }
    }
  }

  .show-more {
    --tg-spacing-button-padding-vertical-xs: 0;
    --tg-spacing-button-padding-horizontal-xs: 0;

    hr {
      background: var(--tg-secondary-main);
      height: 2px;
      width: 100%;
      margin-top: var(--tg-spacing-8);
    }
  }
}
</style>

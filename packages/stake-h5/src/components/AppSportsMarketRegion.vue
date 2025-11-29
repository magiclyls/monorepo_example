<script lang="ts" setup>
import { IconUniArrowLeft } from '@tg/icons'

interface Props {
  title?: string
  icon?: string
  loading?: boolean
  init?: boolean
  count: number
  isStandard: boolean
  baseType: string
  leagueList: {
    ci: string
    cn: string
    c: number
  }[]
  isHotGame?: boolean
}
defineOptions({
  name: 'AppSportsMarketRegion',
})
const props = defineProps<Props>()
const { bool: isOpen, toggle: toggleOpen } = useBoolean(props.init)
</script>

<template>
  <div
    class="base-secondary-accordion-region level-1"
    :class="{ 'is-open': isOpen }"
  >
    <div class="header no-active-scale" @click="toggleOpen">
      <div class="container1">
        <div class="container1" style="--app-sport-image-error-icon-size:16px;">
          <div v-if="icon" class="flex items-center justify-center">
            <AppImage
              width="16px" height="16px" is-cloud :url="icon"
              style="border-radius: 50%;overflow: hidden;flex-shrink: 0;"
            />
          </div>
          <div class="container1">
            <div class="center">
              <span>{{ title }}</span>
            </div>
          </div>
        </div>
        <div v-show="!isOpen" class="accordion-badge-wrap">
          <BaseBadge :count="count" :max="99999" class="theme-base-dge" />
        </div>
      </div>
      <div class="arrow" :class="{ down: isOpen }">
        <IconUniArrowLeft />
      </div>
    </div>
    <div v-show="isOpen" class="content" :class="{ 'is-open': isOpen }">
      <div class="acc-box">
        <AppSportsMarketLeague
          v-for="league, i in leagueList"
          :key="league.ci"
          :auto-show="isHotGame ? leagueList[0].c < 10 ? true : i === 0 : i === 0 "
          :is-standard="isStandard"
          :base-type="baseType"
          :league-name="league.cn"
          :league-id="league.ci"
          :is-region-open="isOpen"
          :count="league.c"
        />
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
}
</style>

<style lang="scss" scoped>
.acc-box {
  display: grid;
  grid-auto-flow: row;
  justify-content: stretch;
  align-items: center;
  gap: var(--tg-spacing-12);
  padding: var(--tg-spacing-8);
}
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
  --tg-secondaryAccordion-header-background: var(--tg-sport-grey-deep);
  --tg-secondaryAccordion-header-title-color: var(--tg-text-white);
  --tg-secondaryAccordion-content-background: var(--tg-primary-main);
  --tg-secondaryAccordion-content-border-color: var(--tg-sport-grey-deep);
  .arrow {
    --tg-icon-color: var(--tg-text-white);
    @include webTheme('green'){
      --tg-icon-color: #5ECEA6;
    }
  }
  @include webTheme('white'){
    --tg-secondaryAccordion-header-background: #F5F5F5;
  }
}
.level-2 {
  --tg-secondaryAccordion-header-background: var(--tg-secondary-grey);
  --tg-secondaryAccordion-header-title-color: var(--tg-text-grey-light);
  --tg-secondaryAccordion-content-background: var(--tg-secondary-grey);
  --tg-secondaryAccordion-content-border-color: var(--tg-secondary-main);
}
.level-3 {
  --tg-secondaryAccordion-header-background: var(--tg-secondary-dark);
  --tg-secondaryAccordion-header-title-color: var(--tg-text-grey-light);
  --tg-secondaryAccordion-content-background: var(--tg-secondary-dark);
  --tg-secondaryAccordion-content-border-color: var(--tg-secondary-main);
  .arrow {
    --tg-icon-color: var(--tg-text-white);
  }
}
.base-secondary-accordion-region {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 0;
  box-shadow: var(--tg-box-shadow), var(--tg-shadow-inset);
  border-radius: var(--tg-radius-default);
  background: var(--header-background);
  --header-background: var(--tg-secondaryAccordion-header-background);
  --title-color: var(--tg-secondaryAccordion-header-title-color);
  --content-background: var(--tg-secondaryAccordion-content-background);
  --content-border: var(--tg-secondaryAccordion-content-border-color);
  @include webTheme('green'){
    --content-background:#055434;
    --content-border:#0E6746;
  }

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
    &.down{
      transform: rotate(-90deg);
    }
  }
  .header {
    width: 100%;
    z-index: 4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: 0 0;
    padding: var(--tg-spacing-12) var(--tg-spacing-16);
    color: var(--title-color);
    cursor: pointer;
    border-radius: var(--tg-radius-default);
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);
    line-height: 1.5;
    @include webTheme('green'){
      background-color: #0E6746;
    }
    .container1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // gap: var(--tg-spacing-8);
      width: 100%;
      >*:not(:last-child) {
        margin-right: var(--tg-spacing-8);
      }
    }
    .center {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      // gap: var(--tg-spacing-8);
      color: var(--tg-text-white);
      >*:not(:last-child) {
        margin-bottom: var(--tg-spacing-8);
      }
      > span {
        display: inline-flex;
        align-items: center;
        text-align: left;
        justify-content: flex-start;
      }
    }
  }
  .content {
    background: var(--content-background);
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0 0 var(--tg-radius-default) var(--tg-radius-default);
    &.is-open {
      border-top: 2px solid var(--content-border);
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
.icon{
  width: 16px;
  height: 16px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.theme-base-dge{
  @include webTheme('green'){
    --tg-badge-background-color:#02432D;
  }
  @include webTheme('white'){
    --tg-badge-background-color:#D8D8D8;
  }
}
</style>

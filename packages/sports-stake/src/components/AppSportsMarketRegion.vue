<script lang="ts" setup>
import { SSAppImage, SSBaseBadge } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconTaskSelectArrowDown, IconUniStakeArrowDown } from '@tg/icons'
import { useSportsConfig } from '../../config/index'
import AppSportsMarketLeague from './AppSportsMarketLeague.vue'

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
const { projectName } = useSportsConfig()
</script>

<template>
  <div class="base-secondary-accordion-region level-1" :class="{ 'is-open': isOpen }">
    <div class="header no-active-scale" @click="toggleOpen">
      <div class="container1">
        <div class="container1" style="--ss-sport-image-error-icon-size:16px;">
          <div v-if="icon" class="flex items-center justify-center">
            <SSAppImage
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
          <SSBaseBadge :count="count" :max="99999" />
        </div>
      </div>
      <div class="arrow" :class="{ down: isOpen }">
        <IconUniStakeArrowDown v-if="projectName === 'afun-h5'" class="text-[#b1bad3]" />
        <IconTaskSelectArrowDown v-else class="text-[#9DABC8]" />
      </div>
    </div>
    <div v-show="isOpen" class="content" :class="{ 'is-open': isOpen }">
      <div class="acc-box">
        <AppSportsMarketLeague
          v-for="league, i in leagueList" :key="league.ci"
          :auto-show="isHotGame ? leagueList[0].c < 10 ? true : i === 0 : i === 0" :is-standard="isStandard"
          :base-type="baseType" :league-name="league.cn" :league-id="league.ci" :is-region-open="isOpen"
          :count="league.c"
          style="
            --ss-secondaryAccordion-header-background2: var(--ss-spt-market-region-level2-bg1);
            --ss-secondaryAccordion-header-title-color2: var(--ss-spt-market-region-level2-color1);
            --ss-secondaryAccordion-content-background2: var(--ss-spt-market-region-level2-bg2);
            --ss-secondaryAccordion-content-border-color2: var(--ss-spt-market-region-level2-border1);
            --ss-spt-outcome-locked-bg1:var(--ss-spt-market-region-level2-bg3);
          "
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.acc-box {
  display: grid;
  grid-auto-flow: row;
  justify-content: stretch;
  align-items: center;
  gap: 12rem;
  padding: 8rem;
}

.load-more-box {
  padding-left: 16rem;
  padding-top: 12rem;
  padding-bottom: 12rem;
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

.base-secondary-accordion-region {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 0;
  border-radius: 4rem;
  background: var(--ss-spt-market-region-bg1);
  box-shadow: var(--ss-spt-market-region-box-shadow);

  &.is-open {
    .header {
      border-radius: 4rem 4rem 0 0;
    }
  }

  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16rem;
    width: 18rem;
    height: 18rem;
    transition: all ease 0.25s;
    transform: rotate(90deg);

    &.down {
      transform: rotate(0);
    }
  }

  .header {
    width: 100%;
    z-index: 4;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: 0 0;
    padding: 12rem 16rem;
    color: var(--ss-spt-market-region-color1);
    cursor: pointer;
    border-radius: 4rem;
    font-size: 14rem;
    font-weight: 600;
    line-height: 1.5;

    .container1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      > *:not(:last-child) {
        margin-right: 8rem;
      }
    }

    .center {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      color: var(--ss-spt-market-region-color2);

      > *:not(:last-child) {
        margin-bottom: 8rem;
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
    background: var(--ss-spt-market-region-bg2);
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0 0 4rem 4rem;

    &.is-open {
      border-top: 1px solid transparent;
    }
  }
}

.icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

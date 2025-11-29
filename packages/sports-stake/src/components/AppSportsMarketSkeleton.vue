<script setup lang='ts'>
import { SSBaseSkeleton } from '@tg/bccomponents'
import { IconUniStakeArrowDown } from '@tg/icons'
import AppSportsMarketInfoSkeleton from './AppSportsMarketInfoSkeleton.vue'

interface Props {
  num?: number
  si?: number | string
}
defineOptions({
  name: 'AppSportsMarketSkeleton',
})
withDefaults(defineProps<Props>(), {
  num: 1,
})
</script>

<template>
  <div
    class="base-secondary-accordion is-open level-2"
  >
    <div class="no-active-scale header">
      <SSBaseSkeleton animated="ani-opacity" width="120rem" height="21rem" />
      <div class="arrow">
        <IconUniStakeArrowDown />
      </div>
    </div>
    <div class="is-open content">
      <div class="wrapper">
        <AppSportsMarketInfoSkeleton :num="num" :si="si" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base-secondary-accordion {
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  z-index: 0;
  border-radius: 4rem;
  background: var(--ss-spt-market-skeleton-bg1);

  .arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16rem;
    width: 18rem;
    height: 18rem;
    transition: all ease 0.25s;
    color: var(--ss-spt-market-skeleton-color1);
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
    padding: 12rem 16rem;
    cursor: pointer;
    border-radius: 4rem 4rem 0 0;
  }
  .content {
    background: var(--ss-spt-market-skeleton-bg2);
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 0 0 4rem 4rem;
    border-top: 1rem solid var(--ss-spt-market-skeleton-border1);
  }
}
.wrapper {
  padding: 8rem 0;
}
</style>

<script setup lang='ts'>
import { SSBaseSkeleton } from '@tg/bccomponents'
import { isZhcn } from '@tg/vue-i18n'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSportsMarketInfoZhcnSkeleton from './AppSportsMarketInfoZhcnSkeleton.vue'

defineOptions({
  name: 'AppSportsMarketInfoSkeleton',
})
defineProps<{ num: number, si?: string | number }>()

const route = useRoute()

const isZhcnSportsHomePage = computed(() => route.fullPath.toString() === `/sports`)
</script>

<template>
  <template v-if="isZhcn() && isZhcnSportsHomePage">
    <AppSportsMarketInfoZhcnSkeleton :num="num" :si="si" />
  </template>
  <template v-else>
    <div
      v-for="i, index in num" :key="i"
      class="app-sports-market-info grid-standard-574 grid-setup-574"
    >
      <!-- 盘口状态 -->
      <div class="misc">
        <div class="wrapper">
          <div class="fixture-details">
            <SSBaseSkeleton animated="ani-opacity" width="130rem" height="18rem" />
          </div>
        </div>
      </div>

      <!-- 队名 -->
      <div class="fixture">
        <SSBaseSkeleton animated="ani-opacity" width="100rem" height="18rem" />
      </div>

      <!-- 标准盘 -->
      <div class="market-name" style="--area: marketName0;">
        <SSBaseSkeleton animated="ani-opacity" width="60rem" height="14rem" />
      </div>
      <div class="outcomes" style="--area: outcomes0;">
        <div class="bet-button">
          <SSBaseSkeleton animated="ani-opacity" width="60rem" height="14rem" />
          <SSBaseSkeleton animated="ani-opacity" width="30rem" height="14rem" />
        </div>
        <div class="bet-button">
          <SSBaseSkeleton animated="ani-opacity" width="60rem" height="14rem" />
          <SSBaseSkeleton animated="ani-opacity" width="30rem" height="14rem" />
        </div>
      </div>

      <!-- 更多盘口 -->
      <div class="market-count market-count-h5">
        <div class="options-wrapper">
          <SSBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" />
          <SSBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" />
        </div>
      </div>
    </div>
  </template>
</template>

<style>
:root {
  --ss-spt-market-info-skeleton-bg1: #f6f7f8;
  --ss-spt-market-info-skeleton-border1: #ebebeb;
}
</style>

<style lang='scss' scoped>
.app-sports-market-info {
  display: grid;
  grid-column-gap: 8rem;
  grid-template-areas: var(--areas);
  align-items: center;
  width: 100%;
  font-size: 14rem;
}

.misc {
  grid-area: misc;
  display: flex;
  position: relative;
  z-index: 2;
  font-size: 12rem;

  .wrapper {
    display: flex;
    align-items: center;
    text-transform: capitalize;
    justify-content: space-between;
    width: 100%;
    line-height: 1.3;
    white-space: nowrap;
    padding-right: 4rem;

    .fixture-details {
      display: flex;
      align-items: center;
      > *:not(:last-child) {
        margin-right: 8rem;
      }
    }
  }
}

.line {
  width: 100%;
  height: 1rem;
}

.line-bg {
  background: #2f4553;
}

.teams {
  grid-area: teams;
  white-space: nowrap;
  overflow: hidden;
  display: grid;
  gap: 8rem;
  align-self: center;
}

.fixture {
  grid-area: fixture;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  display: inline;
}

.fixture-score {
  grid-area: fixtureScore;
  display: flex;
  justify-content: flex-end;
  margin-right: 8rem;

  .options-wrapper {
    margin-left: 16rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    > *:not(:last-child) {
      margin-bottom: 12rem;
    }
  }
}

.market-name {
  width: 100%;
  grid-area: var(--area);
  z-index: 2;
  position: relative;
  padding: 0 8rem;
  align-items: center;
  text-align: center;
  line-height: 1.5;
  font-size: 12rem;

  span {
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inherit;
  }
}

.outcomes {
  place-items: center;
  width: 100%;
  grid-area: var(--area);
  display: grid;
  grid-gap: 8rem 8rem;
  grid-template-rows: 1fr;
  align-self: stretch;
  grid-template-columns: repeat(auto-fit, minmax(50rem, 1fr));
}

.market-count {
  grid-area: marketCount;
  justify-self: center;
  display: flex;
  align-items: center;
  > *:not(:last-child) {
    margin-right: 12rem;
  }
}

.market-count-h5 {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-self: flex-end;

  .options-wrapper {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-between;
    > *:not(:last-child) {
      margin-right: 6rem;
    }
  }
}

.grid-setup-574 {
  grid-template-columns: repeat(var(--column-count), 1fr);
  grid-template-rows: 1fr auto;
  grid-row-gap: 8rem;
  border-bottom: 1rem solid var(--ss-spt-market-info-skeleton-border1);
  padding: 12rem 20rem;

  &.is-last {
    border: none;
  }
}

.grid-setup {
  grid-template-rows: repeat(3, auto);
  grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
  padding: 8rem 16rem;
  row-gap: 8rem;
}

.grid-standard-574 {
  --areas: 'misc misc marketCount marketCount marketCount marketCount' 'fixture fixture fixture fixture fixture fixture'
    'marketName0 marketName0 marketName0 marketName0 marketName0 marketName0'
    'outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0'
    'outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0';
  --column-count: 6;
}
.grid-standard-normal {
  --areas: 'misc misc line line line line marketName0 marketName0 marketName0 marketName0 line2 line2'
    'teams teams teams fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 marketCount'
    'teams teams teams fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 marketCount';
  --column-count: 12;
}

.bet-button {
  background: var(--ss-spt-market-info-skeleton-bg1);
  border-radius: 4rem;
  width: 100%;
  height: 56rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5em 0.75em;
  > *:not(:last-child) {
    margin-bottom: 4rem;
  }
}
</style>

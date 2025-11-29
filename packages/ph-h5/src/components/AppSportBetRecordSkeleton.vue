<script setup lang='ts'>
import { PhBaseSkeleton } from '@tg/bccomponents'

defineOptions({
  name: 'AppSportBetRecordSkeleton',
})
defineProps<{ num: number, si?: string | number }>()
</script>

<template>
  <div
    v-for="i, index in num" :key="i"
  >
    <div class="relative slip mb-[10rem]">
      <div class="h-[37rem] flex gap-[4rem] justify-start bg-[#EBEBEB] px-[16rem] py-[8rem] items-center rounded-t-[4rem]">
        <PhBaseSkeleton animated="ani-opacity" width="40rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        <PhBaseSkeleton animated="ani-opacity" width="40rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
      </div>
      <div class="py-[8rem] px-[16rem] border-b border-b-[#EBEBEB] bg-[#F6F7F8]">
        <div class="flex gap-[4rem] items-center h-[21rem]">
          <PhBaseSkeleton animated="ani-opacity" width="60rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
          <PhBaseSkeleton animated="ani-opacity" width="60rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class=" h-[21rem] flex">
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[26rem]">
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[21rem]">
          <PhBaseSkeleton animated="ani-opacity" width="80rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
      </div>
      <div class="px-[16rem] py-[12rem] bg-[#F6F7F8]">
        <div class="flex justify-between h-[26rem]">
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[26rem]">
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[26rem]">
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
          <PhBaseSkeleton animated="ani-opacity" width="20rem" height="16rem" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-sports-market-info {
  display: grid;
  grid-column-gap: 8rem;
  grid-template-areas: var(--areas);
  align-items: center;
  width: 100%;
  color: #b1bad3;
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
      .count-time {
        display: inline-block;
        width: 4.5ch;
        font-size: 14rem;
        color: #fff;
      }

      .status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12rem;
        border-radius: 3rem;
        padding: 0 4rem;
        font-feature-settings: 'tnum';
        white-space: nowrap;
        line-height: 1.5;

        &.live {
          background: #e9113c;
          color: #fff;
        }

        &.end {
          color: #b1bad3;
          background: #071824;
        }
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

  .fixture-score-wrapper {
    font-weight: 600;
    display: flex;
    justify-content: flex-end;

    .score-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 2ch;
      padding-top: 1rem;
      > *:not(:last-child) {
        margin-bottom: 12rem;
      }
    }

    .total {
      color: #ff9800;
      margin-left: 8rem;
    }
  }

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
  border-bottom: 1rem solid #ebebeb;
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
  background: #f6f7f8;
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

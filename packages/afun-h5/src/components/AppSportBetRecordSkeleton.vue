<script setup lang='ts'>
import { AfunBaseSkeleton } from '@tg/bccomponents'

defineOptions({
  name: 'AppSportBetRecordSkeleton',
})
defineProps<{ num: number, si?: string | number }>()
</script>

<template>
  <div
    v-for="i, index in num" :key="i"
  >
    <div class="relative slip mb-[10px]">
      <div class="h-[37px] flex gap-[4px] justify-start bg-[#2F4553] px-[16px] py-[8px] items-center rounded-t-[4px]">
        <AfunBaseSkeleton animated="ani-opacity" width="40px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        <AfunBaseSkeleton animated="ani-opacity" width="40px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
      </div>
      <div class="py-[8px] px-[16px] border-b border-b-[#2F4553] bg-[#213743]">
        <div class="flex gap-[4px] items-center h-[21px]">
          <AfunBaseSkeleton animated="ani-opacity" width="60px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
          <AfunBaseSkeleton animated="ani-opacity" width="60px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class=" h-[21px] flex">
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[26px]">
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[21px]">
          <AfunBaseSkeleton animated="ani-opacity" width="80px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
      </div>
      <div class="px-[16px] py-[12px] bg-[#213743]">
        <div class="flex justify-between h-[26px]">
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[26px]">
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
        <div class="flex justify-between h-[26px]">
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
          <AfunBaseSkeleton animated="ani-opacity" width="20px" height="16px" style="--tg-skeleton-background-color: #aeb8d6;" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-sports-market-info {
  display: grid;
  grid-column-gap: 8px;
  grid-template-areas: var(--areas);
  align-items: center;
  width: 100%;
  color: #b1bad3;
  font-size: 14px;
}

.misc {
  grid-area: misc;
  display: flex;
  position: relative;
  z-index: 2;
  font-size: 12px;

  .wrapper {
    display: flex;
    align-items: center;
    text-transform: capitalize;
    justify-content: space-between;
    width: 100%;
    line-height: 1.3;
    white-space: nowrap;
    padding-right: 4px;

    .fixture-details {
      display: flex;
      align-items: center;
      > *:not(:last-child) {
        margin-right: 8px;
      }
      .count-time {
        display: inline-block;
        width: 4.5ch;
        font-size: 14px;
        color: #fff;
      }

      .status {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border-radius: 3px;
        padding: 0 4px;
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
  height: 1px;
}

.line-bg {
  background: #2f4553;
}

.teams {
  grid-area: teams;
  white-space: nowrap;
  overflow: hidden;
  display: grid;
  gap: 8px;
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
  margin-right: 8px;

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
      padding-top: 1px;
      > *:not(:last-child) {
        margin-bottom: 12px;
      }
    }

    .total {
      color: #ff9800;
      margin-left: 8px;
    }
  }

  .options-wrapper {
    margin-left: 16px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    > *:not(:last-child) {
      margin-bottom: 12px;
    }
  }
}

.market-name {
  width: 100%;
  grid-area: var(--area);
  z-index: 2;
  position: relative;
  padding: 0 8px;
  align-items: center;
  text-align: center;
  line-height: 1.5;
  font-size: 12px;

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
  grid-gap: 8px 8px;
  grid-template-rows: 1fr;
  align-self: stretch;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
}

.market-count {
  grid-area: marketCount;
  justify-self: center;
  display: flex;
  align-items: center;
  > *:not(:last-child) {
    margin-right: 12px;
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
      margin-right: 6px;
    }
  }
}

.grid-setup-574 {
  grid-template-columns: repeat(var(--column-count), 1fr);
  grid-template-rows: 1fr auto;
  grid-row-gap: 8px;
  border-bottom: 1px solid #2f4553;
  padding: 12px 20px;

  &.is-last {
    border: none;
  }
}

.grid-setup {
  grid-template-rows: repeat(3, auto);
  grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
  padding: 8px 16px;
  row-gap: 8px;
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
  background: #213743;
  border-radius: 4px;
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5em 0.75em;
  > *:not(:last-child) {
    margin-bottom: 4px;
  }
}
</style>

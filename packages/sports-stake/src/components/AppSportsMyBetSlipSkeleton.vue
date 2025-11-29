<script setup lang='ts'>
import { SSBaseButton, SSBaseSkeleton } from '@tg/bccomponents'
import { IconUniShareSlip } from '@tg/icons'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppSportsMyBetSlipSkeleton',
})
const props = defineProps<{
  settle: number
}>()

const { t } = useI18n()

const isSettled = computed(() => props.settle === 1) // 已结算
</script>

<template>
  <div class="sports-my-bet-slip">
    <div class="record">
      <div class="header">
        <div class="left">
          <SSBaseSkeleton width="128rem" height="14prem" />
        </div>
        <SSBaseButton type="text" size="none">
          <IconUniShareSlip />
        </SSBaseButton>
      </div>

      <div class="content">
        <!-- 盘口信息 -->
        <div class="bet-outcome-list">
          <div class="ticket">
            <div class="overview">
              <div class="title-wrapper">
                <SSBaseSkeleton width="155rem" height="14rem" />
                <SSBaseSkeleton width="102rem" height="14rem" />
              </div>
              <div class="odds-wrapper">
                <div class="outcome-name">
                  <SSBaseSkeleton width="120rem" height="14rem" />
                </div>
                <div class="odds">
                  <SSBaseSkeleton width="34rem" height="14rem" />
                </div>
              </div>
              <div class="wrapper">
                <div class="fixture-details">
                  <SSBaseSkeleton width="51rem" height="14rem" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- logo分割线 -->
        <div class="line" />
        <!-- 总计 -->
        <div class="total-box">
          <div class="item">
            <label>{{ t('赔率') }}</label>
            <SSBaseSkeleton width="34rem" height="14rem" />
          </div>
          <div class="item">
            <label>{{ t('投注额') }}</label>
            <SSBaseSkeleton width="85rem" height="14rem" />
          </div>
          <div class="item">
            <label>
              {{ isSettled ? t('赢利')
                : t('预计赢利') }}
            </label>
            <SSBaseSkeleton width="85rem" height="14rem" />
          </div>
        </div>
      </div>
      <div class="decorate" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.sports-my-bet-slip {
  display: flex;
  flex-direction: column;
  width: 100%;
  line-height: 1.5;
}

.record {
  position: relative;
  color: var(--ss-spt-my-bet-slip-skeleton-color1);
  flex-shrink: 0;
  display: flex;
  background: var(--ss-spt-my-bet-slip-skeleton-bg1);
  border-radius: 4rem;
  font-size: 14rem;
  flex-direction: column;
  width: 100%;
  .decorate {
    transform: translateY(-1rem);
    height: 6px;
    width: 100%;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        var(--ss-spt-my-bet-slip-skeleton-bg2) 50%,
        var(--ss-spt-my-bet-slip-skeleton-bg2) 100%
      )
      0px 1rem/11.2rem 11.2rem repeat-x;
  }
}

.header {
  position: relative;
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--ss-spt-my-bet-slip-skeleton-bg3);
  padding: 8rem 12rem;
  border-radius: 4rem 4rem 0 0;
}

.content {
  display: grid;
  width: 100%;
  grid-auto-rows: auto;
  align-items: center;
  background: var(--ss-spt-my-bet-slip-skeleton-bg6);
  padding: 0;
  padding-bottom: 8rem;
  border-radius: 0 0 4rem 4rem;
  z-index: 1;
  grid-template-columns: repeat(6, 1fr);
  grid-template-areas:
    'betOutcomeList betOutcomeList betOutcomeList betOutcomeList betOutcomeList betOutcomeList'
    'line line line line line line'
    'total total total total total total'
    'total total total total total total'
    'total total total total total total'
    'cashoutButton cashoutButton cashoutButton cashoutButton cashoutButton cashoutButton';
}

.bet-outcome-list {
  display: flex;
  flex-direction: column;
  grid-area: betOutcomeList;
  width: 100%;

  .ticket {
    position: relative;
    background: var(--ss-spt-my-bet-slip-skeleton-bg7);

    .overview {
      align-items: flex-start;
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 8rem 12rem;

      .title-wrapper {
        display: flex;
        flex-direction: column;
        max-width: 100%;
        > *:not(:last-child) {
          margin-bottom: 4rem;
        }
        .team-name-wrap {
          flex: 1;
          display: flex;
          justify-content: flex-start;
          .team-name {
            text-align: left;
            word-break: break-all;
          }
        }
        .icon {
          width: 14rem;
          height: 14rem;
          margin-right: 8rem;
        }
      }

      .odds-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        font-weight: 600;
        color: var(--ss-spt-my-bet-slip-skeleton-color6);
      }

      .wrapper {
        display: flex;
        align-items: center;
        text-transform: capitalize;
        justify-content: space-between;
        width: 100%;
        line-height: 1.3;

        .icons {
          margin-left: 8rem;
          display: flex;
          gap: 16rem;
          align-items: center;
        }
      }
    }

    .score {
      margin-top: 8rem;
      margin-bottom: 2rem;
    }

    &.is-multi {
      &::before {
        display: flex;
        content: '';
        height: 3px;
        width: 100%;
        background: radial-gradient(
            circle,
            var(--ss-spt-my-bet-slip-skeleton-bg8),
            var(--ss-spt-my-bet-slip-skeleton-bg8) 50%,
            var(--ss-spt-my-bet-slip-skeleton-bg9) 50%,
            var(--ss-spt-my-bet-slip-skeleton-bg9) 100%
          )
          1px -6px/0.7rem 0.7rem repeat-x;
      }

      &::after {
        display: flex;
        content: '';
        height: 6px;
        width: 100%;
        background: radial-gradient(
            circle,
            var(--ss-spt-my-bet-slip-skeleton-bg8),
            var(--ss-spt-my-bet-slip-skeleton-bg8) 50%,
            var(--ss-spt-my-bet-slip-skeleton-bg9) 50%,
            var(--ss-spt-my-bet-slip-skeleton-bg9) 100%
          )
          1px 1px/0.7rem 0.7rem repeat-x;
      }

      &:first-of-type::before {
        display: flex;
        content: '';
        height: 0;
        width: 100%;
      }

      &:last-of-type::after {
        display: flex;
        content: '';
        height: 0;
        width: 100%;
      }
    }
  }
}
.line {
  width: 100%;
  height: 1px;
  position: relative;
  overflow: visible;
  grid-area: line;
  display: flex;
  margin-bottom: 8px;
  background-color: var(--ss-spt-my-bet-slip-skeleton-bg10);
}
.hr {
  width: 100%;
  grid-area: line;
  padding: 12rem 0;
  position: relative;
  overflow: visible;
  display: flex;
  justify-items: space-between;
  align-items: center;
  gap: 16rem;

  .logo {
    max-width: 70px;
  }

  &::before {
    content: '';
    height: 3px;
    flex-grow: 1;
    background: var(--ss-spt-my-bet-slip-skeleton-bg11);
  }

  &::after {
    content: '';
    height: 3px;
    flex-grow: 1;
    background: var(--ss-spt-my-bet-slip-skeleton-bg11);
  }
}

.total-box {
  grid-area: total;
  width: 100%;
  padding: 0 12rem;

  .item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    label {
      color: var(--ss-spt-my-bet-slip-skeleton-color8);
    }
  }
}
</style>

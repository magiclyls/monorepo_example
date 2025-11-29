<script setup lang='ts'>
import type { IBasePanelType, ISportsMyBetSlipItem } from '@tg/types'
import { SSAppAmount, SSAppImage, SSBaseButton, SSBaseDialog } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniShareSlip, IconUniTrend } from '@tg/icons'
import { useAppStore, useCurrency, useSportsStore } from '@tg/stores'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { timeToCustomizeFormat, timeToDateWithDayFormat } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppDialogBetSlipSports from './AppDialogBetSlipSports.vue'
import AppMatchStatistics from './AppMatchStatistics.vue'
import AppSportsOdds from './AppSportsOdds.vue'

type ISportsMyBetSlipItemWithShowRe = {
  [K in keyof ISportsMyBetSlipItem]: K extends 'bi' ? Array<{
    showResult: boolean
    result: IBasePanelType
    betMarketName: string
    ono: string
  } & ISportsMyBetSlipItem['bi'][number]> : ISportsMyBetSlipItem[K];
}
type ISportsMyBetSlipItemBi = ISportsMyBetSlipItemWithShowRe['bi'][number]
interface Props {
  data: ISportsMyBetSlipItem
  isDialog?: boolean
  /**
   * @description 是否隐藏赛果
   */
  disableResult?: boolean
}
defineOptions({
  name: 'AppSportsMyBetSlip',
})
const props = withDefaults(defineProps<Props>(), {
  disableResult: false,
})

const { t } = useI18n()
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { userInfo } = storeToRefs(useAppStore())
const sportsStore = useSportsStore()
const { bool: isShowDetailDialog } = useBoolean(false)

const betSlipStatusText: { [t: number]: string } = {
  2: t('处理中'),
  3: t('拒绝'),
  4: t('取消'),
}
const settledStatus: { [t: number]: string } = {
  0: t('未结算'),
  1: t('赢'),
  2: t('输'),
  3: t('平'),
  4: t('赢一半'),
  5: t('输一半'),
  6: t('输部分'),
}
/** 添加开关赛果 */
const slipData = ref<ISportsMyBetSlipItemWithShowRe>(addShowResult(props.data))
const detailDialogProps = ref()

const list = computed(() => slipData.value.bi)
const isNotSettled = computed(() => slipData.value.os === 0) // 未结算
const isSettled = computed(() => slipData.value.os === 1) // 已结算
const statusText = computed(() => {
  if (isSettled.value)
    return settledStatus[slipData.value.oc]
  return betSlipStatusText[slipData.value.os]
})
const statusClass = computed(() => {
  if (isSettled.value)
    return slipData.value.oc === 1 || slipData.value.oc === 3 ? 'green' : 'grey'
  return 'grey'
})

/**
 * 跳转详情
 */
function goEventDetailPage(data: ISportsMyBetSlipItemBi) {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, {
    name: ESportsToMainPageRoutes.FIXTURE,
    data: {
      si: data.si,
      pgid: data.pgid,
      ci: data.ci,
      ei: data.ei,
    },
  })
}

// 是否已经开赛
function checkIsStarted(ts: number) {
  return dayjs().isAfter((ts * 1000))
}

function addShowResult(origin: ISportsMyBetSlipItem) {
  const copyData = cloneDeep(origin)
  copyData.bi = copyData.bi.map((a: ISportsMyBetSlipItemBi) => {
    return {
      ...a,
      showResult: false,
      result: {
        startTime: timeToDateWithDayFormat(a.ed),
        homeTeamName: a.htn,
        awayTeamName: a.atn,
        remark: '',
        homeTeamScore: a.hp,
        awayTeamScore: a.ap,
        atpic: a.atpic,
        htpic: a.htpic,
        spic: a.spic,
        si: a.si,
        pol: a.pol,
      },
      betMarketName: makeMarketInfo(a),
    }
  })
  return copyData
}
function makeMarketInfo(item: ISportsMyBetSlipItemBi) {
  switch (item.bt) {
    case 1:
      return item.sn.includes(item.hdp) ? item.sn : `${item.sn} (${item.hdp})`
    case 2:
      return item.sn.includes(item.hdp) ? item.sn : `${item.sn} ${item.hdp}`
    default:
      return item.sn
  }
}
function showDetail() {
  isShowDetailDialog.value = true
  detailDialogProps.value = { data: { ...props.data, username: userInfo.value?.username } }
}
</script>

<template>
  <div class="sports-my-bet-slip">
    <div class="record">
      <div class="header">
        <div class="left">
          <div v-if="!isNotSettled" class="status" :class="[statusClass]">
            {{ statusText }}
          </div>
          <span>{{ timeToCustomizeFormat(slipData.bt) }}</span>
        </div>
        <SSBaseButton v-if="!isDialog" type="text" size="none" @click="showDetail">
          <IconUniShareSlip />
        </SSBaseButton>
      </div>

      <!-- <pre>
        {{ data }}
      </pre> -->

      <div class="content">
        <!-- 盘口信息 -->
        <div class="bet-outcome-list">
          <div
            v-for="item in list"
            :key="item.ono" class="ticket"
            :class="{ 'is-multi': list.length > 1 }"
          >
            <div class="overview">
              <div class="title-wrapper">
                <SSBaseButton
                  type="text" size="none"
                  style="--ss-base-button-text-default-color:var(--ss-spt-my-bet-slip-color10);"
                  @click="goEventDetailPage(item)"
                >
                  <div v-if="isDialog" class="icon">
                    <SSAppImage
                      is-cloud
                      :url="sportsStore.getSportsIconBySi(item.si)"
                    />
                  </div>
                  <div class="team-name-wrap">
                    <span v-if="item.et === 1" class="team-name">
                      {{ item.htn }} - {{ item.atn }}
                    </span>
                    <span v-else-if="item.et === 2" class="team-name">{{ item.cn }}</span>
                  </div>
                </SSBaseButton>
                <span>{{ item.btn }}</span>
              </div>
              <div class="odds-wrapper">
                <div class="outcome-name">
                  {{ item.betMarketName }}
                </div>
                <div class="odds">
                  <AppSportsOdds :odds="item?.ov ?? ''" arrow="left" />
                </div>
              </div>
              <div class="wrapper">
                <div class="fixture-details">
                  <span v-if="isSettled" style="color:#ff9800">
                    {{ item.hp }} - {{ item.ap }}
                  </span>
                  <span v-else-if="!checkIsStarted(item.ed)">
                    {{ timeToDateWithDayFormat(item.ed) }}
                  </span>
                </div>
                <div class="icons">
                  <VTooltip placement="top" :triggers="['hover']">
                    <SSBaseButton
                      v-if="!props.disableResult"
                      type="text"
                      size="none" @click="item.showResult = !item.showResult"
                    >
                      <IconUniTrend />
                    </SSBaseButton>
                    <template #popper>
                      <div class="tiny-menu-item-title">
                        {{ t('比分') }}
                      </div>
                    </template>
                  </VTooltip>
                </div>
              </div>
            </div>

            <div class="score">
              <AppMatchStatistics
                v-if="item.showResult" :round="false"
                :data="item.result" :show-skeleton="item.m === 100"
                style="--ss-app-match-statistics-max-width:100%;"
              />
            </div>
          </div>
        </div>
        <!-- logo分割线 -->
        <div class="line" />

        <!-- 总计 -->
        <div class="total-box">
          <div class="item">
            <label>{{ t('赔率') }}</label>
            <AppSportsOdds :odds="slipData.ov" arrow="left" />
          </div>
          <div class="item">
            <label>{{ t('投注额') }}</label>
            <SSAppAmount
              :amount="slipData.a"
              :currency-type="currentGlobalCurrencyMap.type"
            />
          </div>
          <div class="item">
            <label>
              {{ isSettled ? t('赢利')
                : t('预计赢利') }}
            </label>
            <SSAppAmount
              :amount="isSettled ? slipData.pa > 0 ? slipData.pa : 0 : slipData.mwa + slipData.a"
              :currency-type="currentGlobalCurrencyMap.type"
            />
          </div>
        </div>
      </div>
      <div class="decorate" />
    </div>

    <SSBaseDialog v-if="isShowDetailDialog" v-model="isShowDetailDialog">
      <AppDialogBetSlipSports v-bind="detailDialogProps" />
    </SSBaseDialog>
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
  color: var(--ss-spt-my-bet-slip-color1);
  flex-shrink: 0;
  display: flex;
  background: var(--ss-spt-my-bet-slip-bg1);
  border-radius: 4rem;
  font-size: 14rem;
  flex-direction: column;
  width: 100%;
  .decorate {
    transform: translateY(-1rem);
    height: 6rem;
    width: 100%;
    background: radial-gradient(
        circle,
        transparent,
        transparent 50%,
        var(--ss-spt-my-bet-slip-bg2) 50%,
        var(--ss-spt-my-bet-slip-bg2) 100%
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
  background: var(--ss-spt-my-bet-slip-bg3);
  padding: 8rem 12rem;
  border-radius: 4rem 4rem 0 0;
  .left {
    .status {
      font-size: 12rem;
      display: inline-flex;
      font-weight: 600;
      align-items: center;
      justify-content: center;
      border-radius: 3rem;
      padding: 0 4rem;
      font-feature-settings: 'tnum';
      white-space: nowrap;
      line-height: 1.5;
      margin-right: 8rem;
      color: var(--ss-spt-my-bet-slip-color2);
      &.green {
        background-color: var(--ss-spt-my-bet-slip-bg4);
        color: var(--ss-spt-my-bet-slip-color3);
      }
      &.grey {
        background-color: var(--ss-spt-my-bet-slip-bg5);
        color: var(--ss-spt-my-bet-slip-color4);
      }
    }
  }
}

.content {
  display: grid;
  width: 100%;
  grid-auto-rows: auto;
  color: var(--ss-spt-my-bet-slip-color5);
  align-items: center;
  background: var(--ss-spt-my-bet-slip-bg6);
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
    background: var(--ss-spt-my-bet-slip-bg7);

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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .team-name {
            text-align: left;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
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
        color: var(--ss-spt-my-bet-slip-color6);
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
        height: 3rem;
        width: 100%;
        background: radial-gradient(
            circle,
            var(--ss-spt-my-bet-slip-bg8),
            var(--ss-spt-my-bet-slip-bg8) 50%,
            var(--ss-spt-my-bet-slip-bg9) 50%,
            var(--ss-spt-my-bet-slip-bg9) 100%
          )
          1px -6px/0.7rem 0.7rem repeat-x;
      }

      &::after {
        display: flex;
        content: '';
        height: 6rem;
        width: 100%;
        background: radial-gradient(
            circle,
            var(--ss-spt-my-bet-slip-bg8),
            var(--ss-spt-my-bet-slip-bg8) 50%,
            var(--ss-spt-my-bet-slip-bg9) 50%,
            var(--ss-spt-my-bet-slip-bg9) 100%
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
  margin-bottom: 8rem;
  background-color: var(--ss-spt-my-bet-slip-bg10);
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
    max-width: 70rem;
  }

  &::before {
    content: '';
    height: 3rem;
    flex-grow: 1;
    background: var(--ss-spt-my-bet-slip-bg11);
  }

  &::after {
    content: '';
    height: 3rem;
    flex-grow: 1;
    background: var(--ss-spt-my-bet-slip-bg11);
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
    color: var(--ss-spt-my-bet-slip-color7);
    label {
      color: var(--ss-spt-my-bet-slip-color8);
    }

    .odds {
      font-weight: 600;
      color: var(--ss-spt-my-bet-slip-color9);
    }
  }
}
</style>

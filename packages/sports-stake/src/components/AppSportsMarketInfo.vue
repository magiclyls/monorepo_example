<script setup lang='ts'>
import type { ISportEventInfo, ISportsBreadcrumbs } from '@tg/types'
import { ApiSportAddFavorite, ApiSportDelFavorite } from '@tg/apis'
import { SSBaseBreadcrumbs, SSBaseButton } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconChessStar, IconUniFavorites } from '@tg/icons'
import { useAppStore, useCurrency, useSportsStore } from '@tg/stores'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import {
  appEventBus,
  getCartObject,
  getSportsLiveTime,
  sportsDataBreadcrumbs,

} from '@tg/utils'
import { getLang, timeToCustomizeFormat, timeToDateWithDayFormat } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppSportsBetButton from './AppSportsBetButton.vue'
import AppSportsOutcomeLocked from './AppSportsOutcomeLocked.vue'

interface Props {
  index: number
  isStandard: boolean // 标准盘或三项投注
  isLast?: boolean // 是否列表最后一个
  showBreadcrumb?: boolean // 始终展示联赛数据
  data: ISportEventInfo
  baseType: string
  onlyTime?: boolean
}
defineOptions({
  name: 'AppSportsMarketInfo',
})
const props = defineProps<Props>()

const { t } = useI18n()
const userLanguage = ref(getLang())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const { isLogin } = storeToRefs(useAppStore())
const sportsStore = useSportsStore()
const { sportsFavoriteData } = storeToRefs(sportsStore)
/** 是否收藏 */
const { bool: isFavorite } = useBoolean(false)

/** 添加收藏 */
const { run: runAddFavorite } = useRequest(() =>
  ApiSportAddFavorite({
    si: props.data.si,
    eis: [props.data.ei],
    cur: currentGlobalCurrencyMap.value.cur,
  }), {
  onSuccess() {
    isFavorite.value = true
    sportsStore.refreshSportsFavList()
  },
  loadingKeep: 0,
})
/** 删除收藏 */
const { run: runDelFavorite } = useRequest(() =>
  ApiSportDelFavorite({
    si: props.data.si,
    eis: [props.data.ei],
    cur: currentGlobalCurrencyMap.value.cur,
  }), {
  onSuccess() {
    isFavorite.value = false
    sportsStore.refreshSportsFavList()
  },
  loadingKeep: 0,
})

// 赛事进行时间
const eventTime = ref('')

const baseGridAreaClass = computed(() => {
  if (props.showBreadcrumb) {
    if (props.isStandard)
      return 'grid-standard-574-coming'

    return 'grid-three-option-574-coming'
  }
  if (props.isStandard)
    return 'grid-standard-574'

  return 'grid-three-option-574'
})
const baseGridClass = computed(() => 'grid-setup-574')
// 取出baseType中的bt
const baseTypeBt = computed(() => Number(props.baseType.split('@@')[0]))
// 取出baseType中的egi
const baseTypeEgi = computed(() => Number(props.baseType.split('@@')[1]))
// 当前的盘口类型
const isHandicap = computed(() => baseTypeBt.value === 1 && baseTypeEgi.value === 1)
const isTotal = computed(() => baseTypeBt.value === 2 && baseTypeEgi.value === 1)
const isCorner = computed(() => baseTypeBt.value === 3 && baseTypeEgi.value === 2)
// 标准盘样式 -- 需要展示的盘口分类
const standardMarketFiltered = computed(() => {
  if (isHandicap.value)
    return props.data.ml.filter(a => a.bt === 1)

  else if (isTotal.value)
    return props.data.ml.filter(a => a.bt === 2)

  else if (isCorner.value)
    return props.data.ml.filter(a => a.bt === 3 && a.egi === 2)

  else
    return props.data.ml.filter(a => a.bt === 3 || a.bt === 4)
})
const standardMarketName = computed(() => standardMarketFiltered.value[0]?.btn)
const standardMarketBtns = computed(() => {
  if (isHandicap.value) {
    return standardMarketFiltered.value[0]?.ms.map((a) => {
      return {
        title: a.sn,
        ...a,
        disabled: standardMarketFiltered.value[0].mls !== 1,
        cartInfo: getCartObject(standardMarketFiltered.value[0], a, props.data),
      }
    })
  }
  else if (isTotal.value) {
    return standardMarketFiltered.value[0]?.ms.map((a) => {
      return {
        title: `${a.sn} ${a.hdp}`,
        ...a,
        disabled: standardMarketFiltered.value[0].mls !== 1,
        cartInfo: getCartObject(standardMarketFiltered.value[0], a, props.data),
      }
    })
  }
  else {
    return standardMarketFiltered.value[0]?.ms.map((a) => {
      return {
        title: a.sn,
        ...a,
        disabled: standardMarketFiltered.value[0].mls !== 1,
        cartInfo: getCartObject(standardMarketFiltered.value[0], a, props.data),
      }
    })
  }
})
/** 三项投注样式 -- 需要展示的盘口 */
// 总分盘
const threeOptionTotalMarket = computed(() => {
  return props.data.ml.filter(a => a.bt === 2)
})
const threeOptionTotalBtns = computed(() => {
  return threeOptionTotalMarket.value[0]?.ms.map((a) => {
    return {
      title: `${a.sn} ${a.hdp}`,
      ...a,
      disabled: threeOptionTotalMarket.value[0].mls !== 1,
      cartInfo: getCartObject(threeOptionTotalMarket.value[0], a, props.data),
    }
  })
})
// 获胜
const threeOptionWinnerMarket = computed(() => {
  return props.data.ml.filter(a => a.bt === 3 || a.bt === 4)
})
const threeOptionWinnerBtns = computed(() => {
  return threeOptionWinnerMarket.value[0]?.ms.map((a) => {
    return {
      title: a.sn,
      ...a,
      disabled: threeOptionWinnerMarket.value[0].mls !== 1,
      cartInfo: getCartObject(threeOptionWinnerMarket.value[0], a, props.data),
    }
  })
})
// 让分
const threeOptionHandicapMarket = computed(() => {
  return props.data.ml.filter(a => a.bt === 1)
})
const threeOptionHandicapBtns = computed(() => {
  return threeOptionHandicapMarket.value[0]?.ms.map((a) => {
    return {
      title: a.sn,
      ...a,
      disabled: threeOptionHandicapMarket.value[0].mls !== 1,
      cartInfo: getCartObject(threeOptionHandicapMarket.value[0], a, props.data),
    }
  })
})

// 面包屑
const breadcrumbs = computed(() => sportsDataBreadcrumbs(props.data))

// 距离开赛大于1小时
const isMoreThan1Hour = computed(() => {
  const startsTime = dayjs(props.data.ed * 1000)
  const resTime = startsTime.diff(dayjs(), 'minute')
  return resTime > 60
})
const timeText = computed(() => {
  if (props.onlyTime)
    return timeToCustomizeFormat(props.data.ed, 'HH:mm')

  return timeToDateWithDayFormat(props.data.ed)
})
// 一小时倒计时
const isCountdown = computed(() => {
  const startsTime = dayjs(props.data.ed * 1000)
  const resTime = startsTime.diff(dayjs(), 'minute')
  return resTime <= 60 && resTime >= 1
})
const countdownMins = computed(() => {
  const startsTime = dayjs(props.data.ed * 1000)
  return startsTime.diff(dayjs(), 'minute')
})
const countDownPercent = computed(() => {
  return ((60 - countdownMins.value) / 60 * 100).toFixed()
})
const isLastMin = computed(() => {
  const startsTime = dayjs(props.data.ed * 1000)
  const resSec = startsTime.diff(dayjs(), 'second')
  return resSec < 60 && resSec > 1
})
// 是否已经开赛
const isStarted = computed(() => dayjs().isAfter((props.data.ed * 1000)))
// 正在滚球
const isOnAir = computed(() => props.data.m === 3)
// 赛事暂停
const isTimeout = computed(() => props.data.rbts === 3)

// 是否有直播
// const isHasliveStream = computed(() => props.data.ls === 1)

function setEventTime() {
  getSportsLiveTime(eventTime, {
    rbtt: props.data.rbtt,
    ts: props.data.ts,
    si: props.data.si,
    rbts: props.data.rbts,
  }, dayjs)
}

// 联赛跳转
function onBreadcrumbsClick({ list, index }:
{ list: ISportsBreadcrumbs[], index: number },
) {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, list[2].data)
}
// 操作收藏
function favHandler() {
  if (isFavorite.value)
    runDelFavorite()

  else
    runAddFavorite()
}
function goEventDetailPage() {
  const data = props.data
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

watch(sportsFavoriteData, (a) => {
  if (a && a.d)
    isFavorite.value = a.d.findIndex(a => a.ei === props.data.ei) > -1
})

onMounted(() => {
  if (sportsFavoriteData.value && sportsFavoriteData.value.d) {
    const fl = sportsFavoriteData.value.d
    isFavorite.value = fl.findIndex(a => a.ei === props.data.ei) > -1
  }

  appEventBus.on(EventBusNames.SPORTS_LIST_COUNTDOWN_BUS, setEventTime)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.SPORTS_LIST_COUNTDOWN_BUS, setEventTime)
})

setEventTime()
</script>

<template>
  <div
    class="app-sports-market-info" :class="[
      baseGridAreaClass, baseGridClass,
      { 'is-last': isLast },
    ]"
  >
    <!-- 盘口状态 -->
    <div class="misc">
      <div class="wrapper">
        <div class="fixture-details">
          <!-- 状态 -->
          <span v-if="isMoreThan1Hour">{{ timeText }}</span>
          <template v-else-if="isCountdown">
            <div>
              <svg height="12" width="12" viewBox="0 0 20 20" class="svelte-l8nfzs">
                <circle r="10" cx="10" cy="10" fill="#72ACED" />
                <circle
                  r="5" cx="10" cy="10" fill="transparent" stroke="#105EB4" stroke-width="10.5"
                  :stroke-dasharray="`calc(${countDownPercent} * 31.4 / 100) 31.4`"
                  transform="rotate(-90) translate(-20)"
                />
              </svg>
            </div>
            <span>
              {{ t('开始时间分钟后', { minutes: countdownMins }) }}
            </span>
          </template>
          <span v-else-if="isLastMin || (isStarted && !isOnAir)">
            {{ t('即将开赛') }}
          </span>
          <template v-else-if="isOnAir">
            <div class="status live">
              {{ t('滚球') }}
            </div>
            <span v-if="isTimeout">
              {{ t('暂停') }}
            </span>
            <span v-show="eventTime && !isTimeout" class="count-time">
              {{ eventTime }}
            </span>
            <span>{{ data.rbtd }}</span>
          </template>

          <!-- H5时比分显示在这里 -->
          <div class="fixture-score-h5">
            <!-- 总分 -->
            <span v-if="isOnAir" class="total">{{ data.hp }}-{{ data.ap }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 队名 -->
    <div class="fixture">
      <!-- 主队名称 -->
      <div class="teams-name">
        <SSBaseButton type="text" size="none" @click="goEventDetailPage">
          <span style="text-align: left;" :class="[userLanguage]">{{ data.htn }}</span>
        </SSBaseButton>
      </div>
      <span> - </span>
      <!-- 客队名称 -->
      <div class="teams-name">
        <SSBaseButton type="text" size="none" @click="goEventDetailPage">
          <span style="text-align: left;" :class="[userLanguage]">{{ data.atn }}</span>
        </SSBaseButton>
      </div>
    </div>

    <!-- 标准盘 -->
    <template v-if="isStandard">
      <div class="market-name" style="--area: marketName0;">
        <span>{{ standardMarketName }}</span>
      </div>
      <div class="outcomes" style="--area: outcomes0;">
        <template v-if="standardMarketBtns">
          <AppSportsBetButton
            v-for="market in standardMarketBtns" :key="market.wid + market.sn"
            class="app-sports-bet-button" :title="market.title" :odds="market.ov" :disabled="market.disabled"
            :cart-info="market.cartInfo" :is-handicap="isHandicap" :hdp="market.hdp"
          />
        </template>
        <AppSportsOutcomeLocked v-else />
      </div>
    </template>
    <!-- 三项投注 -->
    <template v-else>
      <!-- 总分 -->
      <div class="market-name" style="--area: marketName0;">
        <span>{{ threeOptionTotalMarket[0]?.btn }}</span>
      </div>
      <div class="outcomes-three outcomes-three-h5" style="--area: outcomes0;">
        <template v-if="threeOptionTotalBtns && threeOptionTotalBtns.length > 0">
          <AppSportsBetButton
            v-for="market in threeOptionTotalBtns" :key="market.wid + market.sn"
            class="app-sports-bet-button" :title="market.title" :odds="market.ov" :disabled="market.disabled"
            :cart-info="market.cartInfo" :hdp="market.hdp" layout="horizontal"
          />
        </template>
        <AppSportsOutcomeLocked v-else />
      </div>
      <!-- 获胜 -->
      <div class="market-name" style="--area: marketName1;">
        <span>{{ threeOptionWinnerMarket[0]?.btn }}</span>
      </div>
      <div class="outcomes-three outcomes-three-h5" style="--area: outcomes1;">
        <template v-if="threeOptionWinnerBtns && threeOptionWinnerBtns.length > 0">
          <AppSportsBetButton
            v-for="market in threeOptionWinnerBtns" :key="market.wid + market.sn"
            class="app-sports-bet-button" :title="market.title" :odds="market.ov" :disabled="market.disabled"
            :cart-info="market.cartInfo" :hdp="market.hdp" layout="horizontal"
          />
        </template>
        <AppSportsOutcomeLocked v-else />
      </div>
      <!-- 让分 -->
      <div class="market-name" style="--area: marketName2;">
        <span>{{ threeOptionHandicapMarket[0]?.btn }}</span>
      </div>
      <div class="outcomes-three outcomes-three-h5" style="--area: outcomes2;">
        <template v-if="threeOptionHandicapBtns && threeOptionHandicapBtns.length > 0">
          <AppSportsBetButton
            v-for="market in threeOptionHandicapBtns" :key="market.wid + market.sn"
            class="app-sports-bet-button" :title="market.title" :odds="market.ov" :disabled="market.disabled"
            :cart-info="market.cartInfo" :hdp="market.hdp" layout="vertical" is-handicap
          />
        </template>
        <AppSportsOutcomeLocked v-else />
      </div>
    </template>

    <!-- 联赛分类 -->
    <div v-if="showBreadcrumb" class="breadcrumb">
      <SSBaseBreadcrumbs :list="breadcrumbs" :only-last="true" @item-click="onBreadcrumbsClick" />
    </div>

    <!-- 更多盘口 -->
    <div class="market-count market-count-h5">
      <div class="options-wrapper" />
      <SSBaseButton v-if="isLogin" type="text" size="none" @click="favHandler">
        <IconUniFavorites v-if="isFavorite" class="text-[var(--ss-spt-market-info-color1)]" />
        <IconChessStar v-else class="text-[var(--ss-spt-market-info-color1)]" />
      </SSBaseButton>
      <SSBaseButton
        style="--ss-base-button-text-default-color:var(--ss-spt-market-info-color1);" type="text" size="none"
        @click="goEventDetailPage"
      >
        <span>+{{ data.mc }}</span>
      </SSBaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
span.th-TH {
  line-height: 2 !important;
}

.app-sports-market-info {
  display: grid;
  grid-column-gap: 8rem;
  grid-template-areas: var(--areas);
  align-items: center;
  width: 100%;
  color: var(--ss-spt-market-info-color2);
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

      > * {
        margin-right: 8rem;
      }

      > :last-child {
        margin-right: 0;
      }

      .count-time {
        display: inline-block;
        width: 4.5ch;
        font-size: 14rem;
        color: var(--ss-spt-market-info-color3);
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
          background: var(--ss-spt-market-info-bg1);
          color: var(--ss-spt-market-info-color4);
          font-weight: 600;
        }

        &.end {
          color: var(--ss-spt-market-info-color5);
          background: var(--ss-spt-market-info-bg2);
        }
      }

      .fixture-score-h5 {
        display: flex;
        align-items: center;
        font-weight: 600;
        line-height: 1.5;

        .total {
          font-size: 14rem;
          color: var(--ss-spt-market-info-color6);
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
  background: var(--ss-spt-market-info-bg3);
}

.teams {
  grid-area: teams;
  white-space: nowrap;
  overflow: hidden;
  display: grid;
  gap: 8rem;
  align-self: center;

  .teams-name {
    color: var(--ss-spt-market-info-color3);
    font-weight: 600;
    display: flex;
    align-items: center;

    .icon {
      margin: 0 8rem;
    }

    span {
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
    }
  }
}

.fixture {
  grid-area: fixture;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
  display: inline;

  .teams-name {
    display: inline-flex;
    position: relative;
    align-items: center;

    span {
      color: var(--ss-spt-market-info-color3);
      font-weight: 600;
      line-height: 1.3;
      font-size: 14rem;
      cursor: pointer;
    }

    .icon {
      font-size: 12rem;
      display: flex;
      align-items: center;
    }

    .left {
      margin-right: 8rem;
    }

    .right {
      margin-left: 8rem;
    }
  }
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

      > * {
        margin-bottom: 12rem;
      }

      > :last-child {
        margin-bottom: 0;
      }
    }

    .total {
      color: var(--ss-spt-market-info-color6);
      margin-left: 8rem;
    }
  }

  .options-wrapper {
    margin-left: 16rem;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;

    > * {
      margin-bottom: 12rem;
    }

    > :last-child {
      margin-bottom: 0;
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
  font-weight: 600;

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

.outcomes-three {
  place-items: center;
  width: 100%;
  height: 100%;
  grid-area: var(--area);
  grid-gap: 8rem 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.outcomes-three-h5 {
  place-items: center;
  width: 100%;
  grid-area: var(--area);
  display: grid;
  grid-gap: 8rem 8rem;
  grid-template-rows: 1fr;
  align-self: stretch;
  grid-template-columns: repeat(auto-fit, minmax(50rem, 1fr));
}

.breadcrumb {
  grid-area: breadcrumb;
  overflow: hidden;
}

.market-count {
  grid-area: marketCount;
  justify-self: center;
  display: flex;
  align-items: center;
  gap: 12rem;
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

    > * {
      margin-right: 12rem;
    }

    > :last-child {
      margin-right: 0;
    }
  }
}

.grid-setup-574 {
  grid-template-columns: repeat(var(--column-count), 1fr);
  grid-template-rows: 1fr auto;
  grid-row-gap: 4rem;
  border-bottom: var(--ss-spt-market-info-border1);
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

// 滚球
.grid-standard-574 {
  --areas: 'misc misc marketCount marketCount marketCount marketCount' 'fixture fixture fixture fixture fixture fixture'
    'marketName0 marketName0 marketName0 marketName0 marketName0 marketName0'
    'outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0'
    'outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0';
  --column-count: 6;
}

.grid-three-option-574 {
  --areas: 'misc misc marketCount marketCount marketCount marketCount' 'fixture fixture fixture fixture fixture fixture'
    'marketName0 marketName0 marketName0 marketName0 marketName0 marketName0'
    'outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0'
    'outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0'
    'marketName1 marketName1 marketName1 marketName1 marketName1 marketName1'
    'outcomes1 outcomes1 outcomes1 outcomes1 outcomes1 outcomes1'
    'outcomes1 outcomes1 outcomes1 outcomes1 outcomes1 outcomes1'
    'marketName2 marketName2 marketName2 marketName2 marketName2 marketName2'
    'outcomes2 outcomes2 outcomes2 outcomes2 outcomes2 outcomes2'
    'outcomes2 outcomes2 outcomes2 outcomes2 outcomes2 outcomes2';
  --column-count: 6;
}

.grid-standard-normal {
  --areas: 'misc misc line line line line marketName0 marketName0 marketName0 marketName0 line2 line2'
    'teams teams teams fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 marketCount'
    'teams teams teams fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 marketCount';
  --column-count: 12;
}

.grid-three-option-normal {
  --areas: 'misc misc line line line line line marketName0 marketName0 marketName0 marketName1 marketName1 marketName1 marketName2 marketName2 marketName2 line2'
    'teams teams teams teams fixtureScore fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes1 outcomes1 outcomes1 outcomes2 outcomes2 outcomes2 marketCount'
    'teams teams teams teams fixtureScore fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes1 outcomes1 outcomes1 outcomes2 outcomes2 outcomes2 marketCount'
    'breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb outcomes0 outcomes0 outcomes0 outcomes1 outcomes1 outcomes1 outcomes2 outcomes2 outcomes2 marketCount';
  --column-count: 17;
}

// 即将开赛
.grid-standard-574-coming {
  --areas: 'misc misc marketCount marketCount marketCount marketCount' 'fixture fixture fixture fixture fixture fixture'
    'breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb'
    ' marketName0 marketName0 marketName0 marketName0 marketName0 marketName0'
    ' outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0'
    ' outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0';
  --column-count: 6;
}

.grid-standard-normal-coming {
  --areas: 'misc misc line line line line marketName0 marketName0 marketName0 marketName0 line2 line2'
    'teams teams teams fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 marketCount'
    'teams teams teams fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 marketCount'
    'breadcrumb breadcrumb breadcrumb fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 marketCount';
  --column-count: 12;
}

.grid-three-option-574-coming {
  --areas: 'misc misc marketCount marketCount marketCount marketCount' 'fixture fixture fixture fixture fixture fixture'
    'breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb'
    ' marketName0 marketName0 marketName0 marketName0 marketName0 marketName0'
    ' outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0'
    ' outcomes0 outcomes0 outcomes0 outcomes0 outcomes0 outcomes0'
    ' marketName1 marketName1 marketName1 marketName1 marketName1 marketName1'
    ' outcomes1 outcomes1 outcomes1 outcomes1 outcomes1 outcomes1'
    ' outcomes1 outcomes1 outcomes1 outcomes1 outcomes1 outcomes1'
    ' marketName2 marketName2 marketName2 marketName2 marketName2 marketName2'
    ' outcomes2 outcomes2 outcomes2 outcomes2 outcomes2 outcomes2'
    ' outcomes2 outcomes2 outcomes2 outcomes2 outcomes2 outcomes2';
  --column-count: 6;
}

.grid-three-option-normal-coming {
  --areas: 'misc misc line line line line line marketName0 marketName0 marketName0 marketName1 marketName1 marketName1 marketName2 marketName2 marketName2 line2'
    'teams teams teams teams fixtureScore fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes1 outcomes1 outcomes1 outcomes2 outcomes2 outcomes2 marketCount'
    'teams teams teams teams fixtureScore fixtureScore fixtureScore outcomes0 outcomes0 outcomes0 outcomes1 outcomes1 outcomes1 outcomes2 outcomes2 outcomes2 marketCount'
    'breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb breadcrumb outcomes0 outcomes0 outcomes0 outcomes1 outcomes1 outcomes1 outcomes2 outcomes2 outcomes2 marketCount';
  --column-count: 17;
}
</style>

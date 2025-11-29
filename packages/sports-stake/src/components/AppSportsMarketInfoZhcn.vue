<script setup lang='ts'>
import type { ISportEventInfo, ISportsEventInfoQml } from '@tg/types'
import { SSBaseButton, SSBasePopup } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowDown1, IconUniArrowRight, IconUniStakeArrowDown } from '@tg/icons'
import { useSportsStore } from '@tg/stores'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import {
  appEventBus,
  getCartObject,
  getSportsLiveTime,

} from '@tg/utils'
import { timeToCustomizeFormat, timeToDateWithDayFormat } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../../config/index'
import AppSportsBetButton from './AppSportsBetButton.vue'
import AppSportsMarketInfoPopup from './AppSportsMarketInfoPopup.vue'
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
  name: 'AppSportsMarketInfoZhcn',
})
const props = defineProps<Props>()

const { t } = useI18n()
const sportsStore = useSportsStore()
const { sportsFavoriteData } = storeToRefs(sportsStore)
/** 是否收藏 */
const { bool: isFavorite } = useBoolean(false)
// 是否显示更多盘口
const { bool: isShowMoreMarket } = useBoolean(false)
const { projectName } = useSportsConfig()

// 赛事进行时间
const eventTime = ref('')

/** 三项投注样式 -- 需要展示的盘口 */
// 总分盘
const threeOptionTotalMarket = computed(() => {
  return props.data.ml.filter(a => a.bt === 2)
})
const threeOptionTotalBtns = computed(() => {
  return threeOptionTotalMarket.value[0]?.ms.map((a) => {
    return {
      title: `${a.sn}${a.hdp}`,
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
      title: a.sn === props.data.htn ? '主' : a.sn === props.data.atn ? '客' : '和',
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
      title: a.hdp,
      ...a,
      disabled: threeOptionHandicapMarket.value[0].mls !== 1,
      cartInfo: getCartObject(threeOptionHandicapMarket.value[0], a, props.data),
    }
  })
})

const timeText = computed(() => {
  if (props.onlyTime)
    return timeToCustomizeFormat(props.data.ed, 'HH:mm')

  return timeToDateWithDayFormat(props.data.ed)
})
// 正在滚球
const isOnAir = computed(() => props.data.m === 3)
// 赛事暂停
const isTimeout = computed(() => props.data.rbts === 3)

function setEventTime() {
  getSportsLiveTime(eventTime, {
    rbtt: props.data.rbtt,
    ts: props.data.ts,
    si: props.data.si,
    rbts: props.data.rbts,
  }, dayjs)
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

const moreMarketProps = ref()
function showMoreMarket(item: ISportsEventInfoQml) {
  isShowMoreMarket.value = true
  moreMarketProps.value = {
    data: item,
    eventInfo: props.data,
  }
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
    class="market-cn border-b-[var(--ss-spt-market-info-zhcn-border1)] w-full flex flex-col border-solid pb-[10rem] pt-[10rem] text-[14rem] font-semibold"
    :class="isLast ? '' : 'border-b'"
  >
    <div class="w-full pl-[10rem] pr-[4rem] ">
      <div class="w-full flex justify-between">
        <!-- 左 -->
        <div class="mr-[10rem] flex grow flex-col overflow-hidden leading-[20rem]">
          <!-- 状态 -->
          <div class="flex items-center text-[var(--ss-spt-market-info-zhcn-color1)]">
            <span v-if="!isOnAir" class="text-[13rem] font-semibold">{{ timeText }}</span>
            <template v-else-if="isOnAir">
              <div class="mr-[6rem] rounded-[2rem] bg-[var(--ss-spt-market-info-zhcn-bg1)] px-[4rem] text-[11rem] font-semibold leading-[18rem] text-[var(--ss-spt-market-info-zhcn-color2)]">
                {{ t('滚球') }}
              </div>
              <span v-if="isTimeout" class="text-[13rem]">
                {{ t('暂停') }}
              </span>
              <span class="text-[13rem] font-semibold">{{ data.rbtd }}</span>&nbsp;
              <span v-show="eventTime && !isTimeout && eventTime !== 'NaN'" class="text-[13rem] font-semibold">
                {{ eventTime }}
              </span>
            </template>
          </div>
          <!-- 主队名 -->
          <div class="mb-[5rem] mt-[11rem] h-[20rem] w-full flex items-center">
            <span v-if="isOnAir" class="mr-[7rem] text-[var(--ss-spt-market-info-zhcn-color3)] ">{{ data.hp }}</span>
            <div
              class="teamname max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap "
              @click="goEventDetailPage"
            >
              {{ data.htn }}
            </div>
          </div>
          <!-- 客队名 -->
          <div class="mb-[5rem] mt-[11rem] h-[20rem] flex items-center">
            <span v-if="isOnAir" class="mr-[7rem] text-[var(--ss-spt-market-info-zhcn-color3)]">{{ data.ap }}</span>
            <div
              class="teamname max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap "
              @click="goEventDetailPage"
            >
              {{ data.atn }}
            </div>
          </div>
          <div class="mt-[11rem] h-[20rem] flex items-center gap-[2rem]">
            <SSBaseButton
              type="text" size="none"
              @click="goEventDetailPage"
            >
              <div class="flex items-center">
                <div
                  class="h-[18rem] rounded-[50rem] px-[6rem] text-center text-[12rem] leading-[18rem]"
                  style="background-color: var(--ss-sports-market-info-zhcn-bg); color: var(--ss-sports-market-info-zhcn-text);"
                >
                  {{ data.mc }}
                </div>
                <div class="text-[var(--ss-spt-market-info-zhcn-color4)] h-[18rem] flex items-center ml-[2rem] ">
                  <IconUniArrowRight v-if="projectName === 'afun-h5'" />
                  <IconUniArrowDown1 v-else class="rotate-[-90deg]" />
                </div>
              </div>
            </SSBaseButton>
          </div>
        </div>
        <!-- 右 -->
        <div class="right-sport max-w-full flex flex-shrink-0 overflow-x-scroll text-[var(--ss-spt-market-info-zhcn-color1)]">
          <div class="col-gap-4-top mr-[4rem] flex flex-col items-center">
            <div class="mb-[6rem] h-[20rem] w-[49rem] flex items-center justify-center text-[13rem] font-semibold">
              {{ data.si === 1 ? '让球' : '让分' }}
            </div>
            <template v-if="threeOptionHandicapBtns && threeOptionHandicapBtns.length > 0">
              <div
                v-for="market in threeOptionHandicapBtns" :key="market.wid + market.sn"
                class="h-[47rem] min-w-[56rem] "
              >
                <AppSportsBetButton
                  :title="market.title" :odds="market.ov" :disabled="market.disabled"
                  class="app-sports-bet-button" :cart-info="market.cartInfo" :hdp="market.hdp" layout="center"
                  style="--sports-bet-button-font-size:12rem;--sports-bet-button-padding-x:4rem;--sports-bet-button-padding-y:4rem;"
                />
              </div>
            </template>
            <template v-else>
              <div class="col-gap-4-top flex flex-col">
                <div v-for="i in 2" :key="i" class="h-[47rem] min-w-[56rem] ">
                  <AppSportsOutcomeLocked />
                </div>
              </div>
              <div class="h-[42rem] w-[49rem] flex-shrink-0" />
            </template>
          </div>
          <div class="col-gap-4-top mr-[4rem] flex flex-col items-center">
            <div class="mb-[6rem] h-[20rem] w-[49rem] flex items-center justify-center text-[13rem] font-semibold">
              大小
            </div>
            <template v-if="threeOptionTotalBtns && threeOptionTotalBtns.length > 0">
              <div
                v-for="market in threeOptionTotalBtns" :key="market.wid + market.sn"
                class="h-[47rem] min-w-[56rem] "
              >
                <AppSportsBetButton
                  :title="market.title" :odds="market.ov" :disabled="market.disabled"
                  class="app-sports-bet-button" :cart-info="market.cartInfo" :hdp="market.hdp" layout="center"
                  style="--sports-bet-button-font-size:12rem;--sports-bet-button-padding-x:4rem;--sports-bet-button-padding-y:4rem;"
                />
              </div>
            </template>
            <template v-else>
              <div class="col-gap-4-top flex flex-col">
                <div v-for="i in 2" :key="i" class="h-[47rem] min-w-[56rem] ">
                  <AppSportsOutcomeLocked />
                </div>
              </div>
              <div class="h-[42rem] w-[49rem] flex-shrink-0" />
            </template>
          </div>
          <div class="col-gap-4-top flex flex-col items-center">
            <div class="mb-[6rem] h-[20rem] w-[49rem] flex items-center justify-center text-[13rem] font-semibold">
              独赢
            </div>
            <template v-if="threeOptionWinnerBtns && threeOptionWinnerBtns.length > 0">
              <div
                v-for="market in threeOptionWinnerBtns" :key="market.wid + market.sn"
                :class="[threeOptionWinnerBtns.length === 3 ? 'h-[30rem] min-w-[66rem]' : 'h-[47rem] min-w-[56rem]']"
              >
                <AppSportsBetButton
                  :title="market.title" :odds="market.ov" :disabled="market.disabled"
                  class="app-sports-bet-button" :cart-info="market.cartInfo" :hdp="market.hdp"
                  :layout="threeOptionWinnerBtns.length === 3 ? 'horizontal-center' : 'center'"
                  style="--sports-bet-button-font-size:12rem;--sports-bet-button-padding-x:4rem;--sports-bet-button-padding-y:4rem;"
                />
              </div>
            </template>
            <template v-else>
              <div class="col-gap-4-top flex flex-col">
                <div
                  v-for="i in (data.si === 1 ? 3 : 2)" :key="i"
                  :class="[threeOptionWinnerBtns.length === 3 ? 'h-[30rem] min-w-[66rem]' : 'h-[47rem] min-w-[56rem]']"
                >
                  <AppSportsOutcomeLocked />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div
        v-if="data.qml && data.qml.length > 0 && data.qml[0].sqml.length > 0"
        class="scroll-x row-gap-10-right mt-[10rem] w-full flex"
      >
        <div
          v-for="item in data.qml" :key="item.n"
          class="text-[var(--ss-spt-market-info-zhcn-color5)] flex cursor-pointer items-center rounded-[100rem] bg-[var(--ss-spt-market-info-zhcn-bg2)] px-[12rem] py-[6rem] text-[14rem] font-semibold leading-[20rem] "
          @click="showMoreMarket(item)"
        >
          <span class="mr-[4rem]">{{ item.n }}</span>
          <IconUniStakeArrowDown v-if="projectName === 'afun-h5'" class="text-[var(--ss-spt-market-info-zhcn-color4)]" />
          <IconUniArrowDown1 v-else class="text-[var(--ss-spt-market-info-zhcn-color4)]" />
        </div>
      </div>
    </div>

    <SSBasePopup v-if="isShowMoreMarket" v-model="isShowMoreMarket">
      <AppSportsMarketInfoPopup v-bind="moreMarketProps" />
    </SSBasePopup>
  </div>
</template>

<style>
:root {
  --ss-sports-market-info-zhcn-text: #fff;
  --ss-sports-market-info-zhcn-bg: #6d7693;
}
</style>

<style lang='scss' scoped>
.market-cn {
  > *:not(:last-child) {
    margin-bottom: 5rem;
  }

  color: var(--ss-spt-market-info-zhcn-color5);
}

.col-gap-4-top {
  > *:not(:first-child) {
    margin-top: 4rem;
  }
}

.row-gap-10-right {
  > *:not(:last-child) {
    margin-right: 10rem;
  }
}

.col-gap-10-bottom {
  > *:not(:last-child) {
    margin-bottom: 10rem;
  }
}

.right-sport::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

.right-sport {
  scrollbar-width: none;
  /* firefox */
  -ms-overflow-style: none;
  /* IE 10+ */
}
</style>

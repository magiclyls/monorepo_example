<script setup lang='ts'>
import type { ISportEventInfo, ISportsEventInfoQml } from '@tg/types'
import { IconUniArrowRight, IconUniArrowUpSmall } from '@tg/icons'
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
const router = useLocalRouter()
const appStore = useAppStore()
const sportsStore = useSportsStore()
const { sportsFavoriteData } = storeToRefs(sportsStore)
const { isMobile } = storeToRefs(useWindowStore())
/** 是否收藏 */
const { bool: isFavorite } = useBoolean(false)
const { openSportsMarketInfoPopup } = useSportsMarketInfoPopup()

// 赛事进行时间
const eventTime = ref('')

/** 三项投注样式 -- 需要展示的盘口 **/
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
// 详情路径
const eventDetailPath = computed(() => {
  const data = props.data
  return `/sports/${SPORTS_PLAT_ID}/${data.si}/${data.pgid}/${data.ci}/${data.ei}`
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
  router.push(replaceSportsPlatId(eventDetailPath.value))
}

/** 显示更多盘口 */
const currentQmlName = ref('')
const eventInfoQmlData = computed(() => {
  if (props.data.qml && props.data.qml.length > 0)
    return props.data.qml.find(a => a.n === currentQmlName.value) ?? null

  return null
})
const eventInfoQmlDataSqml = computed(() => {
  if (eventInfoQmlData.value) {
    return eventInfoQmlData.value.sqml.map((a) => {
      return {
        ...a,
        ml: a.ml.map((b) => {
        // 波胆
          const isBodan = b.bt === 158 || b.bt === 6
          if (isBodan) {
            const msMaped = b.ms.map((c) => {
              return {
                ...c,
                title: c.sn,
                disabled: b.mls !== 1,
                cartInfo: getCartObject(b, c, props.data),
              }
            })
            const arr1 = msMaped.filter((d) => {
              const strArr = d.sn.split('-')
              return +strArr[0] > +strArr[1]
            })
            const arr2 = msMaped.filter((d) => {
              const strArr = d.sn.split('-')
              return +strArr[0] === +strArr[1] || strArr.length === 1
            })
            const arr3 = msMaped.filter((d) => {
              const strArr = d.sn.split('-')
              return +strArr[0] < +strArr[1]
            })

            return {
              ...b,
              isBodan,
              ms: msMaped,
              msCol1: arr1,
              msCol2: arr2,
              msCol3: arr3,
              msRow: [],
            }
          }
          // 其他
          return {
            ...b,
            isBodan: false,
            ms: b.ms.map((c) => {
            // 总分
              const isTotel = b.bt === 2
              // 让分
              const isHandicap = b.bt === 1
              // 独赢
              const isWinner = b.bt === 3 || b.bt === 4
              const nameText = c.sn === props.data.htn ? '主' : c.sn === props.data.atn ? '客' : '和'

              return {
                ...c,
                title: isTotel ? `${c.sn} ${c.hdp}` : isHandicap ? `${nameText} ${c.hdp}` : isWinner ? nameText : isBodan ? c.sn : '',
                disabled: b.mls !== 1,
                cartInfo: getCartObject(b, c, props.data),
              }
            }),
            msCol1: [],
            msCol2: [],
            msCol3: [],
            msRow: [],
          }
        }),
      }
    })
  }
  return []
})
const qmlTab = ref('')
const qmlTabList = computed(() => {
  return eventInfoQmlDataSqml.value.map((a) => {
    return {
      label: a.n,
      value: a.n,
    }
  })
})
const eventInfoQmlDataMarketList = computed(() => {
  const obj = eventInfoQmlDataSqml.value.find(a => a.n === qmlTab.value)
  if (obj) {
    // 波胆
    if (obj.ml[0].isBodan) {
      return obj.ml
    }

    else {
      // 新需求，需要重新组合数据结构，相同bt的放一起
      const btArr: number[] = uniqBy(obj.ml, 'bt').map((a: any) => a.bt)
      const mlArr = btArr.map(bt => obj.ml.filter(a => a.bt === bt))
      const arr = mlArr.map((sameBtList) => {
        return {
          ...sameBtList[0],
          msRow: sameBtList.map(a => a.ms),
        }
      })

      return arr
    }
  }

  return []
})

function showMoreMarket(item: ISportsEventInfoQml) {
  if (isMobile.value) {
    openSportsMarketInfoPopup({
      data: item,
      eventInfo: props.data,
    })
  }
  else {
    if (currentQmlName.value === item.n)
      currentQmlName.value = ''

    else
      currentQmlName.value = item.n
  }
}

watch(currentQmlName, () => {
  qmlTab.value = qmlTabList.value[0].value
})
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
    class="market-cn border-b-tg-secondary w-full flex flex-col border-solid pb-[10px] pt-[10px] text-[14px] font-semibold"
    :class="isLast ? '' : 'border-b'"
  >
    <div class="w-full pl-[10px] pr-[4px] @md:px-[16px]">
      <div class="w-full flex justify-between">
        <!-- 左 -->
        <div class="mr-[10px] flex grow flex-col overflow-hidden leading-[20px]">
          <!-- 状态 -->
          <div class="flex items-center">
            <span v-if="!isOnAir" class="text-[13px] font-semibold">{{ timeText }}</span>
            <template v-else-if="isOnAir">
              <div class="mr-[6px] rounded-[2px] bg-[#E91134] px-[4px] text-[11px] font-semibold leading-[18px] text-white">
                {{ t('sports_status_live') }}
              </div>
              <span v-if="isTimeout" class="text-[13px]">
                {{ t('pause') }}
              </span>
              <span class="text-[13px] font-semibold">{{ data.rbtd }}</span>&nbsp;
              <span v-show="eventTime && !isTimeout && eventTime !== 'NaN'" class="text-[13px] font-semibold">
                {{ eventTime }}
              </span>
            </template>
          </div>
          <!-- 主队名 -->
          <div class="mb-[5px] mt-[11px] h-[20px] w-full flex items-center">
            <span v-if="isOnAir" class="mr-[7px] text-[#FF9800] @md:mr-[6px]">{{ data.hp }}</span>
            <div class="teamname max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap @md:max-w-[286px]" @click="goEventDetailPage">
              {{ data.htn }}
            </div>
          </div>
          <!-- 客队名 -->
          <div class="mb-[5px] mt-[11px] h-[20px] flex items-center">
            <span v-if="isOnAir" class="mr-[7px] text-[#FF9800] @md:mr-[6px]">{{ data.ap }}</span>
            <div class="teamname max-w-full cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap @md:max-w-[286px]" @click="goEventDetailPage">
              {{ data.atn }}
            </div>
          </div>
          <div class="mt-[11px] h-[20px] flex items-center gap-[2px]">
            <BaseButton type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="goEventDetailPage">
              <div
                class="h-[18px] rounded-[50px] px-[6px] text-center text-[12px] leading-[18px]"
                style="background-color: var(--app-sports-market-info-zhcn-bg); color: var(--app-sports-market-info-zhcn-text);"
              >
                {{ data.mc }}
              </div>
              <IconUniArrowRight />
            </BaseButton>
          </div>
        </div>
        <!-- 右 -->
        <div class="right-sport max-w-full flex flex-shrink-0 overflow-x-scroll">
          <div class="col-gap-4-top mr-[4px] flex flex-col items-center">
            <div class="mb-[6px] h-[20px] w-[49px] flex items-center justify-center text-[13px] font-semibold">
              {{ data.si === 1 ? '让球' : '让分' }}
            </div>
            <template v-if="threeOptionHandicapBtns && threeOptionHandicapBtns.length > 0">
              <div v-for="market in threeOptionHandicapBtns" :key="market.wid + market.sn" class="h-[47px] min-w-[56px] @md:min-w-[200px]">
                <AppSportsBetButton
                  :title="market.title" :odds="market.ov" :disabled="market.disabled" class="app-sports-bet-button"
                  :cart-info="market.cartInfo" :hdp="market.hdp"
                  layout="center" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:4px;--sports-bet-button-padding-y:4px;"
                />
              </div>
            </template>
            <template v-else>
              <div class="col-gap-4-top flex flex-col">
                <div v-for="i in 2" :key="i" class="h-[47px] min-w-[56px] @md:min-w-[200px]">
                  <AppSportsOutcomeLocked />
                </div>
              </div>
              <div class="h-[42px] w-[49px] flex-shrink-0" />
            </template>
          </div>
          <div class="col-gap-4-top mr-[4px] flex flex-col items-center">
            <div class="mb-[6px] h-[20px] w-[49px] flex items-center justify-center text-[13px] font-semibold">
              大小
            </div>
            <template v-if="threeOptionTotalBtns && threeOptionTotalBtns.length > 0">
              <div v-for="market in threeOptionTotalBtns" :key="market.wid + market.sn" class="h-[47px] min-w-[56px] @md:min-w-[200px]">
                <AppSportsBetButton
                  :title="market.title" :odds="market.ov" :disabled="market.disabled" class="app-sports-bet-button"
                  :cart-info="market.cartInfo" :hdp="market.hdp"
                  layout="center" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:4px;--sports-bet-button-padding-y:4px;"
                />
              </div>
            </template>
            <template v-else>
              <div class="col-gap-4-top flex flex-col">
                <div v-for="i in 2" :key="i" class="h-[47px] min-w-[56px] @md:min-w-[200px]">
                  <AppSportsOutcomeLocked />
                </div>
              </div>
              <div class="h-[42px] w-[49px] flex-shrink-0" />
            </template>
          </div>
          <div class="col-gap-4-top flex flex-col items-center">
            <div class="mb-[6px] h-[20px] w-[49px] flex items-center justify-center text-[13px] font-semibold">
              独赢
            </div>
            <template v-if="threeOptionWinnerBtns && threeOptionWinnerBtns.length > 0">
              <div
                v-for="market in threeOptionWinnerBtns" :key="market.wid + market.sn"
                class="@md:min-w-[200px]"
                :class="[threeOptionWinnerBtns.length === 3 ? 'h-[30px] min-w-[66px]' : 'h-[30px] min-w-[56px]']"
              >
                <AppSportsBetButton
                  :title="market.title" :odds="market.ov" :disabled="market.disabled" class="app-sports-bet-button"
                  :cart-info="market.cartInfo" :hdp="market.hdp"
                  :layout="threeOptionWinnerBtns.length === 3 ? 'horizontal-center' : 'center'" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:4px;--sports-bet-button-padding-y:4px;"
                />
              </div>
            </template>
            <template v-else>
              <div class="col-gap-4-top flex flex-col">
                <div
                  v-for="i in (data.si === 1 ? 3 : 2)" :key="i" class="@md:min-w-[200px]"
                  :class="[threeOptionWinnerBtns.length === 3 ? 'h-[30px] min-w-[66px]' : 'h-[30px] min-w-[56px]']"
                >
                  <AppSportsOutcomeLocked />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div v-if="data.qml && data.qml.length > 0 && data.qml[0].sqml.length > 0" class="scroll-x row-gap-10-right mt-[10px] w-full flex">
        <div
          v-for="item in data.qml" :key="item.n " class="text-tg-text-white flex cursor-pointer items-center rounded-[100px] bg-[var(--app-sports-market-info-zhcn-sub-tab-bg)] px-[12px] py-[6px] text-[14px] font-semibold leading-[20px] @md:px-[17px]"
          @click="showMoreMarket(item)"
        >
          <span class="mr-[4px]">{{ item.n }}</span>
          <IconUniArrowUpSmall :class="item.n === currentQmlName ? 'rotate-180' : ''" />
        </div>
      </div>
    </div>
    <!-- 更多盘口 -->
    <div v-if="eventInfoQmlData" class="border-t-tg-secondary mt-[4px] w-full border-t-2 border-solid pb-[8px] pt-[16px]">
      <!-- 队伍 -->
      <div class="mx-auto max-w-[84%] w-full flex items-center justify-center">
        <!-- 主队名 -->
        <div class="mr-[4px] max-w-[40%] w-full flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-right">
          {{ data.htn }}
        </div>
        <!-- 比分 -->
        <div class="mr-[4px] text-ellipsis whitespace-nowrap">
          {{ data.hp }} : {{ data.ap }}
        </div>
        <!-- 客队名 -->
        <div class="max-w-[40%] w-full flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-left">
          {{ data.atn }}
        </div>
      </div>
      <!-- 分类 -->
      <div class="border-b-tg-secondary mt-[10px] w-full border-b-2 border-solid px-[10px] pb-[8px]">
        <BaseTab
          v-model="qmlTab" :list="qmlTabList"
          :style="{
            '--tg-tab-style-inner-padding-y': '5px',
            '--tg-tab-style-inner-padding-x': '71px',
          }"
        />
      </div>

      <div class="scroll-y col-gap-10-bottom max-h-[381px] min-h-[114px] w-full flex flex-col px-[16px] pt-[10px]">
        <!-- 无数据 -->
        <div v-if="eventInfoQmlDataMarketList.length === 0" class="h-[381px] w-full flex flex-col items-center justify-center">
          <div class="mb-[21px] text-[74px]">
            <component :is="appStore.theme ? `uni-empty-betslip_${appStore.theme}theme` : 'uni-empty-betslip'" />
          </div>
          <span class="text-tg-text-lightgrey">无相关比赛数据</span>
        </div>

        <div v-for="market in eventInfoQmlDataMarketList" :key="market.mlid">
          <!-- 盘口风格 2 colum -->
          <div v-if="[1, 2, 7].includes(market.pat)" class="col-gap-10-bottom w-full flex flex-col">
            <span>{{ market.btn }}</span>
            <div v-for="row, rowI in market.msRow" :key="rowI" class="grid grid-cols-2 w-full gap-[10px]">
              <div v-for="btn in row" :key="btn.wid + btn.sn" class="h-[33px]">
                <AppSportsBetButton
                  :title="btn.title" :odds="btn.ov" :disabled="btn.disabled" class="app-sports-bet-button"
                  :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;"
                />
              </div>
            </div>
          </div>

          <!-- 盘口风格 3 colum -->
          <div v-else-if="[3, 4, 5, 6].includes(market.pat)" class="col-gap-10-bottom w-full flex flex-col">
            <div class="grid grid-cols-3 w-full gap-[10px]">
              <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">{{ data.htn }}</span>
              <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">和局</span>
              <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">{{ data.atn }}</span>
            </div>
            <div v-if="market.isBodan" class="grid grid-cols-3 w-full gap-[10px]">
              <div class="col-gap-10-bottom flex flex-col">
                <div v-for="btn in market.msCol1" :key="btn.wid + btn.sn" class="h-[33px]">
                  <AppSportsBetButton
                    :title="btn.title" :odds="btn.ov" :disabled="btn.disabled" class="app-sports-bet-button"
                    :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                    layout="horizontal" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;"
                  />
                </div>
              </div>
              <div class="col-gap-10-bottom flex flex-col">
                <div v-for="btn in market.msCol2" :key="btn.wid + btn.sn" class="h-[33px]">
                  <AppSportsBetButton
                    :title="btn.title" :odds="btn.ov" :disabled="btn.disabled" class="app-sports-bet-button"
                    :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                    layout="horizontal" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;"
                  />
                </div>
              </div>
              <div class="col-gap-10-bottom flex flex-col">
                <div v-for="btn in market.msCol3" :key="btn.wid + btn.sn" class="h-[33px]">
                  <AppSportsBetButton
                    :title="btn.title" :odds="btn.ov" :disabled="btn.disabled" class="app-sports-bet-button"
                    :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                    layout="horizontal" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;"
                  />
                </div>
              </div>
            </div>
            <div v-else class="grid grid-cols-3 w-full gap-[10px]">
              <div v-for="btn in market.ms" :key="btn.wid + btn.sn" class="h-[33px]">
                <AppSportsBetButton
                  :title="btn.title" :odds="btn.ov" :disabled="btn.disabled" class="app-sports-bet-button"
                  :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal" style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.market-cn {
  >*:not(:last-child) {
    margin-bottom: 5px;
  }
  color: var(--tg-text-white);
  @include webTheme('white'){
    color: #555555;
    border-bottom-color: #e4e4e4;
  }
  @include webTheme('green'){
    border-bottom-color: #FFFFFF1A;
  }
}
.col-gap-4-top {
  >*:not(:first-child) {
    margin-top: 4px;
  }
}
.row-gap-10-right {
  >*:not(:last-child) {
    margin-right: 10px;
  }
}
.col-gap-10-bottom {
  >*:not(:last-child) {
    margin-bottom: 10px;
  }
}
.teamname {
  @include webTheme('white'){
    color: #111111;
  }
}
.app-sports-bet-button {
  @include webTheme('white'){
    background: #fff;
  }
}
.right-sport::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.right-sport{
  scrollbar-width: none; /* firefox */
  -ms-overflow-style: none; /* IE 10+ */
}
</style>

<style>
:root {
  --app-sports-market-info-zhcn-text: var(--tg-text-lightgrey);
  --app-sports-market-info-zhcn-bg: var(--tg-secondary-main);
  --app-sports-market-info-zhcn-sub-tab-bg: var(--tg-secondary-dark);
}
[theme="green"] {
  --app-sports-market-info-zhcn-text:#76F0C5;
  --app-sports-market-info-zhcn-bg: #055434;
}

[theme="greenblack"] {
  --app-sports-market-info-zhcn-text:var(--tg-text-black);
  --app-sports-market-info-zhcn-bg: var(--tg-primary-active);
}

[theme="white"] {
  --app-sports-market-info-zhcn-text: #111111;
  --app-sports-market-info-zhcn-bg: #F2CA5C;
  --app-sports-market-info-zhcn-sub-tab-bg: #FFFFFF;
}
</style>

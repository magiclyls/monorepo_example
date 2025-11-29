<script setup lang='ts'>
import {
  IconUniClose,
} from '@tg/icons'
import type { ISportEventInfo, ISportsEventInfoQml } from '@tg/types'

interface Props {
  data: ISportsEventInfoQml
  eventInfo: ISportEventInfo
}
defineOptions({
  name: 'AppSportsMarketInfoPopup',
})
const props = defineProps<Props>()
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)
const { isMobile, appContentWidth, bodyWidth, appContentOffsetLeft } = storeToRefs(useWindowStore())
// BasePopup 提供的关闭方法
const onCloseClick = inject<() => void>('onCloseClick')

const homeTeamName = computed(() => props.eventInfo.htn)
const awayTeamName = computed(() => props.eventInfo.atn)
const homeTeamPoint = computed(() => props.eventInfo.hp)
const awayTeamPoint = computed(() => props.eventInfo.ap)
const sqml = computed(() => {
  return props.data.sqml.map((a) => {
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
              cartInfo: getCartObject(b, c, props.eventInfo),
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
            const nameText = c.sn === homeTeamName.value ? '主' : c.sn === awayTeamName.value ? '客' : '和'

            return {
              ...c,
              title: isTotel ? `${c.sn} ${c.hdp}` : isHandicap ? `${nameText} ${c.hdp}` : isWinner ? nameText : isBodan ? c.sn : '',
              disabled: b.mls !== 1,
              cartInfo: getCartObject(b, c, props.eventInfo),
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
})

const tab = ref(sqml.value[0].n)
const tabList = computed(() => {
  return sqml.value.map((a) => {
    return {
      label: a.n,
      value: a.n,
    }
  })
})
const marketList = computed(() => {
  const obj = sqml.value.find(a => a.n === tab.value)
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

// 加了皮肤之后的宽度
const _width = computed(() => {
  if (theme.value === '')
    return isMobile.value ? '100%' : `${appContentWidth.value}px`

  else
    return `${bodyWidth.value}px`
})
// 加了皮肤之后的左边距离
const _marginLeft = computed(() => {
  if (theme.value === '')
    return isMobile.value ? '0' : `${appContentOffsetLeft.value}px`

  else
    return '0'
})
</script>

<template>
  <div
    class="text-tg-text-white bg-tg-primary wrapper relative rounded-t-[20px] pt-[16px] text-[14px] font-semibold leading-[20px]"
    :style="{
      width: _width,
      marginLeft: _marginLeft,
    }" @click.stop>
    <div
      class="absolute right-0 top-0 flex cursor-pointer items-center justify-center px-[10px] py-[18px] @md:px-[16px]"
      @click="() => onCloseClick && onCloseClick()">
      <IconUniClose />
    </div>
    <!-- 队伍 -->
    <div class="mx-auto max-w-[84%] w-full flex items-center justify-center">
      <!-- 主队名 -->
      <div class="max-w-[40%] w-full flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-right">
        {{ homeTeamName }}
      </div>
      <!-- 比分 -->
      <div class="mx-[4px] text-ellipsis whitespace-nowrap">
        {{ homeTeamPoint }} : {{ awayTeamPoint }}
      </div>
      <!-- 客队名 -->
      <div class="max-w-[40%] w-full flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-left">
        {{ awayTeamName }}
      </div>
    </div>

    <!-- 分类 -->
    <div class="mt-[10px] w-full border-b border-b-[var(--border-b-tg-border-color)] border-solid px-[10px] pb-[8px]">
      <BaseTab
        v-model="tab" :list="tabList" :full="isMobile"
        :style="{
          '--tg-tab-style-inner-padding-y': '5px',
          '--tg-tab-style-inner-padding-x': isMobile ? '5px' : '71px',
        }"
      />
    </div>

    <div
      class="scroll-y all-market-list max-h-[313px] min-h-[162px] w-full flex flex-col px-[12px] py-[14px] @md:mx-auto @md:max-h-[381px] @md:max-w-[1200px] @md:min-h-[230px] @md:px-[16px]">
      <!-- 无数据 -->
      <div v-if="marketList.length === 0"
        class="h-[313px] w-full flex flex-col items-center justify-center @md:h-[381px]">
        <div class="mb-[21px] text-[74px]">
          <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_greenblacktheme.png" v-if="appStore.theme === 'greenblack'" />
          <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_greentheme.png" v-else-if="appStore.theme === 'green'" />
          <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_whitetheme.png" v-else-if="appStore.theme === 'white'" />
          <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip.png" v-else />
        </div>
        <span class="text-tg-text-lightgrey">无相关比赛数据</span>
      </div>

      <div v-for="market in marketList" :key="market.mlid">
        <!-- 盘口风格 2 colum -->
        <BaseSecondaryAccordion v-if="[1, 2, 7].includes(market.pat)" class="base-secondary-accordion"
          :title="market.btn" style="--tg-secondaryAccordion-header-padding-x:10px;">
          <template #side="{ isOpen }">
            <div v-show="!isOpen" class="accordion-badge-wrap">
              <BaseBadge :count="market.ms.length" :max="99999" />
            </div>
          </template>
          <template #default>
            <div class="row-list w-full flex flex-col px-[10px] py-[12px]">
              <div v-for="row, rowI in market.msRow" :key="rowI" class="grid grid-cols-2 w-full gap-[5px]">
                <div v-for="btn in row" :key="btn.wid + btn.sn" class="h-[37.8px]">
                  <AppSportsBetButton class="app-sports-bet-button" :title="btn.title" :odds="btn.ov"
                    :disabled="btn.disabled" :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                    layout="horizontal"
                    style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;" />
                </div>
              </div>
            </div>
          </template>
        </BaseSecondaryAccordion>

        <!-- 盘口风格 3 colum -->
        <div v-else-if="[3, 4, 5, 6].includes(market.pat)"
          class="shadow-tg-box-shadow bg-tg-secondary-grey all-type-list w-full flex flex-col rounded-[4px] py-[12px]">
          <div class="grid grid-cols-3 w-full gap-[5px] px-[7px] pb-[12px] @md:gap-[10px]">
            <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">{{ homeTeamName
              }}</span>
            <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">和局</span>
            <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">{{ awayTeamName
              }}</span>
          </div>
          <div v-if="market.isBodan" class="bo-dan grid grid-cols-3 w-full gap-[5px] px-[7px] @md:gap-[10px]">
            <div class="flex flex-col">
              <div v-for="btn, bdx in market.msCol1" :key="btn.wid + btn.sn" class="h-[37.8px]"
                :class="[bdx < market.msCol1.length - 1 ? 'mb-[6px] @md:mb-[10px]' : '']">
                <AppSportsBetButton class="app-sports-bet-button" :title="btn.title" :odds="btn.ov"
                  :disabled="btn.disabled" :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal"
                  style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;" />
              </div>
            </div>
            <div class="flex flex-col">
              <div v-for="btn, bdx in market.msCol2" :key="btn.wid + btn.sn" class="h-[37.8px]"
                :class="[bdx < market.msCol2.length - 1 ? 'mb-[6px] @md:mb-[10px]' : '']">
                <AppSportsBetButton class="app-sports-bet-button" :title="btn.title" :odds="btn.ov"
                  :disabled="btn.disabled" :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal"
                  style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;" />
              </div>
            </div>
            <div class="flex flex-col">
              <div v-for="btn, bdx in market.msCol3" :key="btn.wid + btn.sn" class="h-[37.8px]"
                :class="[bdx < market.msCol3.length - 1 ? 'mb-[6px] @md:mb-[10px]' : '']">
                <AppSportsBetButton class="app-sports-bet-button" :title="btn.title" :odds="btn.ov"
                  :disabled="btn.disabled" :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal"
                  style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;" />
              </div>
            </div>
          </div>
          <div v-else class="grid grid-cols-3 w-full gap-[5px] @md:gap-[10px]">
            <div v-for="btn in market.ms" :key="btn.wid + btn.sn" class="h-[37.8px]">
              <AppSportsBetButton class="app-sports-bet-button" :title="btn.title" :odds="btn.ov"
                :disabled="btn.disabled" :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                layout="horizontal"
                style="--sports-bet-button-font-size:12px;--sports-bet-button-padding-x:8px;--sports-bet-button-padding-y:8px;" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.all-market-list {
  >* {
    margin-bottom: 10px;
  }

  >:last-child {
    margin-bottom: 0;
  }
}

.row-list {
  >* {
    margin-bottom: 5px;
  }

  >:last-child {
    margin-bottom: 0;
  }
}

.all-type-list {
  >* {
    margin-bottom: 12px;

    @include webTheme('white') {
      border: none;
    }
  }

  >:last-child {
    margin-bottom: 0;
  }

  @include webTheme('white') {
    background: #fff;
    box-shadow: none;

    .bo-dan {
      border: none;
    }
  }

  @include webTheme('green') {
    background: #055434;
    box-shadow: none;

    .bo-dan {
      border: none;
    }
  }
}

.wrapper {
  @include webTheme('green') {
    background: #055434;
  }
}

.base-secondary-accordion {
  @include webTheme('white') {
    --header-background: #fff;
    --content-background: #fff;
    --content-border: none;
  }

  @include webTheme('green') {
    --header-background: #055434;
    --content-background: #055434;
    --content-border: none;
  }
}

.app-sports-bet-button {
  @include webTheme('white') {
    background: #F5F5F5;
  }

  @include webTheme('green') {
    background: #02432D;
  }
}
</style>

<style>
:root {
  --border-b-tg-border-color: var(--tg-border-color-grey-light);
}

[theme="white"] {
  --border-b-tg-border-color: #E4E4E4;
}

[theme="green"] {
  --border-b-tg-border-color: #0E6746;
}
</style>

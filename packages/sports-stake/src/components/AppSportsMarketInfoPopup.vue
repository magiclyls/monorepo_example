<script setup lang='ts'>
import type { ISportEventInfo, ISportsEventInfoQml } from '@tg/types'
import { BaseImage, SSBaseBadge, SSBaseSecondaryAccordion, SSBaseTabs } from '@tg/bccomponents'
import { IconUniClose3 } from '@tg/icons'
import { getCartObject } from '@tg/utils'
import { uniqBy } from 'lodash'
import { computed, inject, ref } from 'vue'
import { useSportsConfig } from '../../config/index'
import AppSportsBetButton from './AppSportsBetButton.vue'

interface Props {
  data: ISportsEventInfoQml
  eventInfo: ISportEventInfo
}
defineOptions({
  name: 'AppSportsMarketInfoPopup',
})
const props = defineProps<Props>()
// BasePopup 提供的关闭方法
const onCloseClick = inject<() => void>('closePopup')

const { projectName } = useSportsConfig()

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
</script>

<template>
  <div
    class="text-[var(--ss-spt-market-info-popup-color1)] bg-[var(--ss-spt-market-info-popup-bg1)] wrapper relative rounded-t-[20rem] pt-[16rem] text-[14rem] font-semibold leading-[20rem]"
    :style="{
      width: '100%',
      marginLeft: 0,
    }"
    @click.stop
  >
    <div class="absolute right-0 top-0 flex cursor-pointer items-center justify-center px-[10rem] py-[18rem] " @click="() => onCloseClick && onCloseClick()">
      <IconUniClose3 />
    </div>
    <!-- 队伍 -->
    <div class="mx-auto max-w-[84%] w-full flex items-center justify-center">
      <!-- 主队名 -->
      <div class="max-w-[40%] w-full flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-right">
        {{ homeTeamName }}
      </div>
      <!-- 比分 -->
      <div class="mx-[4rem] text-ellipsis whitespace-nowrap">
        {{ homeTeamPoint }} : {{ awayTeamPoint }}
      </div>
      <!-- 客队名 -->
      <div class="max-w-[40%] w-full flex-shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-left">
        {{ awayTeamName }}
      </div>
    </div>

    <!-- 分类 -->
    <div class="mt-[10rem] w-full border-b border-b-[var(--ss-spt-market-info-popup-border1)] border-solid px-[10rem] pb-[8rem]">
      <SSBaseTabs
        v-model="tab" style="--ss-base-tab-background-color:var(--ss-spt-market-info-popup-bg5);--ss-base-tab-item-padding:5rem 20rem;"
        :list="tabList" full
      />
    </div>

    <div
      class="scroll-y all-market-list max-h-[313rem] min-h-[162rem] w-full flex flex-col px-[12rem] py-[14rem] "
    >
      <!-- 无数据 -->
      <div v-if="marketList.length === 0" class="h-[313rem] w-full flex flex-col items-center justify-center ">
        <div class="mb-[21rem] w-[120rem]">
          <BaseImage width="120px" :url="`/${projectName}/png/uni-table-empty.png`" />
        </div>
        <span class="text-[var(--ss-spt-market-info-popup-color2)]">无相关比赛数据</span>
      </div>

      <div v-for="market in marketList" :key="market.mlid">
        <!-- 盘口风格 2 colum -->
        <SSBaseSecondaryAccordion
          v-if="[1, 2, 7].includes(market.pat)"
          class="base-secondary-accordion" :title="market.btn"
          style="--ss-secondaryAccordion-header-padding-x:10px;
          --ss-secondaryAccordion-header-background:var(--ss-spt-market-info-popup-bg2);
          --ss-secondaryAccordion-content-background:var(--ss-spt-market-info-popup-bg2);
          "
        >
          <template #side="{ isOpen }">
            <div v-show="!isOpen" class="accordion-badge-wrap">
              <SSBaseBadge :count="market.ms.length" :max="99999" />
            </div>
          </template>
          <template #default>
            <div class="row-list w-full flex flex-col px-[10rem] py-[12rem]">
              <div v-for="row, rowI in market.msRow" :key="rowI" class="grid grid-cols-2 w-full gap-[5rem]">
                <div v-for="btn in row" :key="btn.wid + btn.sn" class="h-[40rem]">
                  <AppSportsBetButton
                    class="app-sports-bet-button"
                    :title="btn.title" :odds="btn.ov" :disabled="btn.disabled"
                    :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                    layout="horizontal"
                    style="--ss-spt-outcome-locked-bg1:var(--ss-spt-market-info-popup-bg6);
                    --sports-bet-button-font-size:12rem;--sports-bet-button-padding-x:8rem;
                    --sports-bet-button-bg:var(--ss-spt-market-info-popup-bg3);
                    --sports-bet-button-padding-y:8rem;"
                  />
                </div>
              </div>
            </div>
          </template>
        </SSBaseSecondaryAccordion>

        <!-- 盘口风格 3 colum -->
        <div v-else-if="[3, 4, 5, 6].includes(market.pat)" class="bg-[var(--ss-spt-market-info-popup-bg4)] all-type-list w-full flex flex-col rounded-[4rem] py-[12rem]">
          <div class="grid grid-cols-3 w-full gap-[5rem] px-[7rem] pb-[12rem]">
            <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">{{ homeTeamName }}</span>
            <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">和局</span>
            <span class="flex-shrink-0 grow overflow-hidden text-ellipsis whitespace-nowrap text-center">{{ awayTeamName }}</span>
          </div>
          <div v-if="market.isBodan" class="bo-dan grid grid-cols-3 w-full gap-[5rem] px-[7rem]">
            <div class="flex flex-col">
              <div
                v-for="btn, bdx in market.msCol1" :key="btn.wid + btn.sn" class="h-[40rem]"
                :class="[bdx < market.msCol1.length - 1 ? 'mb-[6rem] ' : '']"
              >
                <AppSportsBetButton
                  class="app-sports-bet-button"
                  :title="btn.title" :odds="btn.ov" :disabled="btn.disabled"
                  :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal"
                  style="--ss-spt-outcome-locked-bg1:var(--ss-spt-market-info-popup-bg6);--sports-bet-button-font-size:12rem;--sports-bet-button-bg:var(--ss-spt-market-info-popup-bg3);--sports-bet-button-padding-x:8rem;--sports-bet-button-padding-y:8rem;"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <div
                v-for="btn, bdx in market.msCol2" :key="btn.wid + btn.sn" class="h-[40rem]"
                :class="[bdx < market.msCol2.length - 1 ? 'mb-[6rem] ' : '']"
              >
                <AppSportsBetButton
                  class="app-sports-bet-button"
                  :title="btn.title" :odds="btn.ov" :disabled="btn.disabled"
                  :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal"
                  style="--ss-spt-outcome-locked-bg1:var(--ss-spt-market-info-popup-bg6);--sports-bet-button-font-size:12rem;--sports-bet-button-bg:var(--ss-spt-market-info-popup-bg3);--sports-bet-button-padding-x:8rem;--sports-bet-button-padding-y:8rem;"
                />
              </div>
            </div>
            <div class="flex flex-col">
              <div
                v-for="btn, bdx in market.msCol3" :key="btn.wid + btn.sn" class="h-[40rem]"
                :class="[bdx < market.msCol3.length - 1 ? 'mb-[6rem]' : '']"
              >
                <AppSportsBetButton
                  class="app-sports-bet-button"
                  :title="btn.title" :odds="btn.ov" :disabled="btn.disabled"
                  :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                  layout="horizontal"
                  style="--ss-spt-outcome-locked-bg1:var(--ss-spt-market-info-popup-bg6);--sports-bet-button-font-size:12rem;--sports-bet-button-bg:var(--ss-spt-market-info-popup-bg3);--sports-bet-button-padding-x:8rem;--sports-bet-button-padding-y:8rem;"
                />
              </div>
            </div>
          </div>
          <div v-else class="grid grid-cols-3 w-full gap-[5rem] ">
            <div v-for="btn in market.ms" :key="btn.wid + btn.sn" class="h-[40rem]">
              <AppSportsBetButton
                class="app-sports-bet-button"
                :title="btn.title" :odds="btn.ov" :disabled="btn.disabled"
                :cart-info="btn.cartInfo" :hdp="btn.hdp" horizontal-center-on-pc
                layout="horizontal"
                style="--ss-spt-outcome-locked-bg1:var(--ss-spt-market-info-popup-bg6);--sports-bet-button-font-size:12rem;--sports-bet-button-bg:var(--ss-spt-market-info-popup-bg3);--sports-bet-button-padding-x:8rem;--sports-bet-button-padding-y:8rem;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.all-market-list {
  > * {
    margin-bottom: 12rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
.row-list {
  > * {
    margin-bottom: 5rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
.all-type-list {
  > * {
    margin-bottom: 12rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
</style>

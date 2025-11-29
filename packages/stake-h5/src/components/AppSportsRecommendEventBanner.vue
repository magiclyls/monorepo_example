<script setup lang='ts'>
import { IconUniArrowRight } from '@tg/icons'

import type { ISportEventInfo, ISportEventList } from '@tg/types'

import { ApiSportsHomepageHot } from '@tg/apis'

defineOptions({
  name: 'AppSportsRecommendEventBanner',
})
const { push } = useLocalRouter()

const list = ref<ISportEventInfo[]>([])
const { runAsync: runGetSportsHotList } = useRequest(ApiSportsHomepageHot, {
  onSuccess(res) {
    if (res.d && res.d.length > 0)
      list.value = res.d
  },
})
const { startTimer, stopTimer } = useSportsDataUpdate(runGetSportsHotList)

const renderList = computed(() => {
  return list.value.filter((a) => {
    return a.ml.findIndex(b => b.bt === 1) > -1
  }).map((c) => {
    const handicapObj = c.ml.find(d => d.bt === 1)

    return {
      ...c,
      path: `/sports/${SPORTS_PLAT_ID}/${c.si}/${c.pgid}/${c.ci}/${c.ei}`,
      leaguePath: `/sports/${SPORTS_PLAT_ID}/${c.si}/${c.pgid}/${c.ci}?sn=${c.sn}&pgn=${c.pgn}&cn=${c.cn}`,
      marketName: handicapObj?.btn,
      showMarket: handicapObj?.ms.map((e) => {
        return {
          title: e.hdp,
          ...e,
          disabled: false,
          cartInfo: getCartObject(handicapObj, e, c),
        }
      }),
    }
  })
})

// 跳转详情页
function goEventDetailPage(path: string) {
  push(replaceSportsPlatId(path))
}
// 跳转联赛
function goEventLeaguePage(path: string) {
  push(replaceSportsPlatId(path))
}
function updateDataByMqtt(data: ISportEventList[]) {
  list.value = sportsEventInfoListUpdateByMqtt(list.value, data)
}

onMounted(() => {
  startTimer()
  appEventBus.on(EventBusNames.SPORTS_DATA_CHANGE_BUS, updateDataByMqtt)
})
onBeforeUnmount(() => {
  stopTimer()
  appEventBus.off(EventBusNames.SPORTS_DATA_CHANGE_BUS, updateDataByMqtt)
})

await application.allSettled([runGetSportsHotList()])
</script>

<template>
  <div class="scroll-x w-full flex pb-[7px] pt-[12px] @md:mb-[17px]">
    <div
      v-for="item, idx in renderList" :key="item.ei"
      class="bg-tg-secondary-grey shadow-tg-box-shadow-banner h-[134px] w-[270px] flex-shrink-0 rounded-[4px] px-[8px] py-[10px] @md:h-[143px] @md:w-[288px]"
      :class="[idx > 0 ? 'ml-[8px] @md:ml-[16.01px]' : '']"
    >
      <!-- 头部 -->
      <div class="text-tg-text-lightgrey border-tg-secondary relative mb-[5px] flex items-center justify-between border-b-[1px] border-solid pb-[5px] text-[12px] font-semibold leading-[17px]">
        <span>
          {{ timeToCustomizeFormat(item.ed, 'MM-DD HH:mm') }}
        </span>
        <span
          class="text-tg-text-white absolute left-[50%] max-w-[108px] translate-x-[-50%] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap @md:max-w-[120px]"
          @click="goEventLeaguePage(item.leaguePath)"
        >
          {{ item.cn }}
        </span>

        <BaseButton style="--tg-base-button-font-size:12px;" type="text" size="none" @click="goEventDetailPage(item.path)">
          <div class="flex items-center">
            <span class="bg-tg-secondary mr-[4px] inline-block rounded-[100px] px-[6px] leading-[17px]">
              {{ item.mc }}
            </span>
            <div class="flex items-center text-[14px]">
              <IconUniArrowRight />
            </div>
          </div>
        </BaseButton>
      </div>
      <!-- 赛事信息 -->
      <div class="mb-[5px] flex justify-between">
        <!-- 主 -->
        <BaseButton type="text" size="none" @click="goEventDetailPage(item.path)">
          <div class="w-[96px] flex flex-col items-center @md:w-[105px]">
            <div class="mb-[4px] h-[26px] w-[26px]" style="--app-sport-image-error-icon-size:26px;">
              <AppImage :url="item.htpic" is-network />
            </div>
            <span class="text-tg-text-white max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold leading-[16.8px]">
              {{ item.htn }}
            </span>
          </div>
        </BaseButton>

        <div class="flex flex-col items-center pt-[5px] font-semibold">
          <span class="text-tg-text-white text-[18px] leading-[25.2px]">VS</span>
          <span class="text-tg-text-lightgrey text-[12px] leading-[16.8px]">{{ item.marketName }}</span>
        </div>
        <!-- 客 -->
        <BaseButton type="text" size="none" @click="goEventDetailPage(item.path)">
          <div class="w-[96px] flex flex-col items-center gap-[4px] @md:w-[105px]">
            <div class="h-[26px] w-[26px]" style="--app-sport-image-error-icon-size:26px;">
              <AppImage :url="item.atpic" is-network />
            </div>
            <span class="text-tg-text-white max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold leading-[16.8px]">
              {{ item.atn }}
            </span>
          </div>
        </BaseButton>
      </div>
      <!-- 下注按钮 -->
      <div class="m-bet-btns h-[33px] flex @md:h-[34px]">
        <AppSportsBetButton
          v-for="market in item.showMarket" :key="market.wid + market.sn"
          layout="horizontal"
          :title="market.title" :odds="market.ov"
          :cart-info="market.cartInfo" :hdp="market.hdp"
        />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.m-bet-btns {
  > *:not(:last-child) {
    margin-right: 14px;
  }
}
</style>

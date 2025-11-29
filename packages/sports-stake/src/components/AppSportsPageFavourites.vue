<script lang="ts" setup>
import type { ISportDataGroupedByLeague } from '@tg/types'
import { BaseImage, SSBaseEmpty, SSSportsTabs } from '@tg/bccomponents'
import { useBoolean, useSportsDataUpdate } from '@tg/hooks'
import { IconUniFavorites } from '@tg/icons'
import { useSportsStore } from '@tg/stores'
import { application, sportsDataGroupByLeague, sportsDataGroupBySport } from '@tg/utils'
import { isZhcn } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../../config/index'
import AppSportsMarket from './AppSportsMarket.vue'
import AppSportsMarketTypeSelect from './AppSportsMarketTypeSelect.vue'

defineOptions({
  name: 'AppSportsPageFavourites',
})
const { sportDirectory, projectName } = useSportsConfig()
const { t } = useI18n()
const { bool: isStandard } = useBoolean(true)
const sportsStore = useSportsStore()
const {
  sportsFavoriteData,
  allSportsCount,
  currentFavNav,
  currentFavBetType,
} = storeToRefs(sportsStore)
/** 定时更新数据 */
const { startTimer, stopTimer }
= useSportsDataUpdate(sportsStore.refreshSportsFavList)

// 取出baseType中的bt
const baseTypeBt = computed(() => +currentFavBetType.value.split('@@')[0])
// 取出baseType中的egi
const baseTypeEgi = computed(() => +currentFavBetType.value.split('@@')[1])
const baseTypeOptions = computed(() =>
  sportsStore.getSportsBetTypeListBySi(currentFavNav.value),
)
/** 收藏数据根据球种组合 */
const sportsFavoriteList = computed(() => {
  if (sportsFavoriteData.value && sportsFavoriteData.value.d)
    return sportsDataGroupBySport(sportsFavoriteData.value.d)

  return []
})
const navs = computed(() => {
  return sportsFavoriteList.value.map((a) => {
    return {
      si: a.si,
      sn: allSportsCount.value?.list.find(b => b.si === a.si)?.sn ?? '',
      count: a.list.length,
      icon: allSportsCount.value?.list.find(b => b.si === a.si)?.spic ?? '',
      useCloudImg: true,
    }
  })
})
const list = computed(() => {
  let arr: ISportDataGroupedByLeague = []
  if (sportsFavoriteData.value && sportsFavoriteData.value.d) {
    const list = sportsFavoriteList.value.find(a => a.si === currentFavNav.value)?.list ?? []
    arr = sportsDataGroupByLeague(
      list.filter((event) => {
        return event.ml.findIndex(market => market.bt === baseTypeBt.value && market.egi === baseTypeEgi.value) > -1
      }),
    )
  }
  return arr
})

// 虚拟加载数据
function getData() {
  return new Promise((resolve) => {
    const t = setTimeout(() => {
      resolve(t)
      clearTimeout(t)
    }, 1000)
  })
}

function onSportsSiChange() {
  currentFavBetType.value
  = sportsStore.getSportsBetTypeListBySi(currentFavNav.value)[0]?.value
}

onMounted(() => {
  startTimer()
})
onBeforeUnmount(() => {
  stopTimer()
})

await application.allSettled([getData()])
</script>

<template>
  <div class="tg-sports-favourites">
    <div class="h-[25rem] w-full flex items-center justify-between " :class="isZhcn() ? 'my-[12rem]' : 'my-[24rem]'">
      <div class="text-[var(--ss-spt-page-title-color1)] flex items-center text-[18rem] font-semibold leading-[1.5]">
        <IconUniFavorites class="text-[var(--ss-spt-page-my-bet-color3)]" />
        <h6 class="ml-[8rem]">
          {{ t('收藏') }}
        </h6>
      </div>
      <AppSportsMarketTypeSelect
        v-model="currentFavBetType" v-model:is-standard="isStandard"
        :base-type-options="baseTypeOptions"
      />
    </div>
    <template v-if="navs.length > 0">
      <SSSportsTabs
        v-show="navs.length > 0" v-model="currentFavNav" :list="navs" :sport-directory="sportDirectory"
        @change="onSportsSiChange"
      />
      <div class="market-wrapper">
        <AppSportsMarket
          v-for="item, idx in list" :key="item.ci"
          :is-standard="true"
          :league-name="item.cn"
          :event-count="item.list.length"
          :event-list="item.list"
          :base-type="currentFavBetType"
          :class="[idx > 0 ? 'mt-[12rem]' : '']"
        />
      </div>
    </template>
    <div v-else class="empty">
      <SSBaseEmpty :description="t('暂无收藏赛事')">
        <template #icon>
          <div class="w-[80rem]">
            <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
          </div>
        </template>
      </SSBaseEmpty>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.market-wrapper {
  display: flex;
  flex-direction: column;
  margin-bottom: 24rem;
}
.empty {
  width: 100%;
  height: 240rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script lang="ts" setup>
import { IconUniFavorites, IconEmpty1 } from '@tg/icons'

import type { ISportDataGroupedByLeague } from '~/types'

defineOptions({
  name: 'AppSportsPageFavourites',
})
const { t } = useI18n()
const { isZhcn } = storeToRefs(useLanguageStore())
const { bool: isStandard } = useBoolean(true)
const sportsStore = useSportsStore()
const {
  sportsFavoriteData, allSportsCount, currentFavNav,
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
    <div class="h-[25px] w-full flex items-center justify-between @md:my-0 @md:h-[42px]"
      :class="isZhcn ? 'my-[12px]' : 'my-[24px]'">
      <div class="text-tg-text-white flex items-center text-[18px] font-semibold leading-[1.5]">
        <IconUniFavorites />
        <h6 class="ml-[8px]">
          {{ t('sports_title_favourites') }}
        </h6>
      </div>
      <AppSportsMarketTypeSelect v-model="currentFavBetType" v-model:is-standard="isStandard"
        :base-type-options="baseTypeOptions" />
    </div>
    <template v-if="navs.length > 0">
      <AppSportsTab v-show="navs.length > 0" v-model="currentFavNav" :list="navs" @change="onSportsSiChange" />
      <div class="market-wrapper">
        <AppSportsMarket v-for="item, idx in list" :key="item.ci" :is-standard="true" :league-name="item.cn"
          :event-count="item.list.length" :event-list="item.list" :base-type="currentFavBetType"
          :class="[idx > 0 ? 'mt-[12px]' : '']" />
      </div>
    </template>
    <div v-else class="empty">
      <BaseEmpty icon="empty-1" :description="t('empty_fav_event')">
        <template #icon>
          <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
        </template>
      </BaseEmpty>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.market-wrapper {
  display: flex;
  flex-direction: column;
  // gap: var(--tg-spacing-12);
  margin-bottom: var(--tg-spacing-24);
}

.empty {
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

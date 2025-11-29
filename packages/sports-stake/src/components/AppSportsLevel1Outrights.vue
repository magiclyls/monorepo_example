<script setup lang='ts'>
import { ApiSportCompetitionList } from '@tg/apis'
import { BaseImage, SSBaseEmpty } from '@tg/bccomponents'
import { useSportsDataUpdate } from '@tg/hooks'
import { IconSptSortAz, IconUniPopular } from '@tg/icons'
import { useSportsStore } from '@tg/stores'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'
import AppSportsOutrightsRegion from './AppSportsOutrightsRegion.vue'

defineOptions({
  name: 'AppSportsLevel1Outrights',
})
const { t } = useI18n()
const { route, projectName } = useSportsConfig()
const sportId = route.params.sport ? +route.params.sport : 0
const { sidebarData } = storeToRefs(useSportsStore())

const params = ref({ si: sportId, kind: 'outright' })
const { data: competitionListData, run, runAsync } = useRequest(ApiSportCompetitionList)
/** 定时更新数据 */
const { startTimer, stopTimer } = useSportsDataUpdate(() => run(params.value))

// 热门地区
const hotSportList = computed(() => {
  if (competitionListData.value && competitionListData.value.hot)
    return competitionListData.value.hot
  return []
})
// 所有地区
const allRegionList = computed(() => {
  if (competitionListData.value && competitionListData.value.list)
    return competitionListData.value.list
  return []
})
// 球种名称
const sportName = computed(() => {
  if (sidebarData.value)
    return sidebarData.value.all.find(a => a.si === sportId)?.sn ?? '-'
  return '-'
})

watch(route, (r) => {
  if (r.name === 'sports-platId-sport') {
    params.value.si = r.params.sport ? +r.params.sport : 0
    competitionListData.value = undefined
    run(params.value)
    startTimer()
  }
})

onMounted(() => {
  startTimer()
})
onBeforeUnmount(() => {
  stopTimer()
})

await application.allSettled([runAsync(params.value)])
</script>

<template>
  <!-- 热门 -->
  <div class="sub-wrapper">
    <div class="stake-sports-page-title">
      <div class="left">
        <IconUniPopular class="text-[var(--ss-spt-level1-live-upcoming-color2)]" />
        <h6>{{ t('热门') }} {{ sportName }} {{ t('冠军投注') }}</h6>
      </div>
    </div>
    <AppSportsOutrightsRegion
      v-for="region, i in hotSportList" :key="region.pgid"
      :title="region.pgn" :icon="region.ppic" :init="i === 0" :count="region.cl.length"
      :league-list="region.cl" is-hot-game
    />
    <div v-if="hotSportList.length === 0" class="empty">
      <SSBaseEmpty :description="t('未找到结果')">
        <template #icon>
          <div class="w-[80rem]">
            <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
          </div>
        </template>
      </SSBaseEmpty>
    </div>
  </div>

  <div class="sub-wrapper">
    <div class="stake-sports-page-title">
      <div class="stake-sports-page-title">
        <div class="left">
          <IconSptSortAz class="text-[var(--ss-spt-level1-live-upcoming-color2)]" />
          <span>{{ $t('所有') }} {{ sportName }} {{ t('冠军投注') }}</span>
        </div>
      </div>
    </div>
    <AppSportsOutrightsRegion
      v-for="region, in allRegionList" :key="region.pgid"
      :title="region.pgn" :icon="region.ppic" :init="false" :count="region.cl.length"
      :league-list="region.cl"
    />
    <div v-if="allRegionList.length === 0" class="empty">
      <SSBaseEmpty :description="t('未找到结果')">
        <template #icon>
          <div class="w-[80rem]">
            <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
          </div>
        </template>
      </SSBaseEmpty>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.sub-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24rem;
  > * {
    margin-bottom: 12rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
.empty {
  width: 100%;
  height: 240rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

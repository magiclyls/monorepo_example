<script setup lang='ts'>
import { ApiSportCompetitionList } from '@tg/apis'
import { useSportsDataUpdate } from '@tg/hooks'
import { IconSptSortAz, IconUniPopular } from '@tg/icons'
import { useSportsStore } from '@tg/stores'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'
import AppSportsMarketRegion from './AppSportsMarketRegion.vue'

interface Props {
  isStandard: boolean
  baseType: string
}
defineOptions({
  name: 'AppSportsLevel1LiveUpcoming',
})
defineProps<Props>()

const { t } = useI18n()
const { sidebarData } = storeToRefs(useSportsStore())
const { route } = useSportsConfig()
const sport = computed(() => route.params.sport ? +route.params.sport : 0)

const params = ref({ si: sport.value, kind: 'normal' })
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
    return sidebarData.value.all.find(a => a.si === sport.value)?.sn ?? '-'
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
  <div class="sub-wrapper hot">
    <div class="stake-sports-page-title">
      <div class="left">
        <IconUniPopular class="text-[var(--ss-spt-level1-live-upcoming-color2)]" />
        <h6>
          {{ t('热门') }} {{ sportName }}
        </h6>
      </div>
    </div>
    <AppSportsMarketRegion
      v-for="region, index in hotSportList"
      :key="region.pgid"
      :title="region.pgn"
      :icon="region.ppic"
      :init="index === 0"
      :count="region.c"
      :is-standard="isStandard"
      :base-type="baseType"
      :league-list="region.cl"
      is-hot-game
    />
  </div>

  <!-- 按字母顺序排序 -->
  <div class="sub-wrapper">
    <h3 class="sub-title">
      <IconSptSortAz class="mr-[8rem] text-[var(--ss-spt-level1-live-upcoming-color2)]" />
      <span>{{ t('所有') }} {{ sportName }}</span>
    </h3>
    <AppSportsMarketRegion
      v-for="region in allRegionList"
      :key="region.pgid"
      :title="region.pgn"
      :icon="region.ppic"
      :init="false"
      :count="region.c"
      :is-standard="isStandard"
      :base-type="baseType"
      :league-list="region.cl"
    />
  </div>
</template>

<style lang='scss' scoped>
.wrapper,
.sub-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  > * {
    margin-bottom: 24rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
.sub-wrapper {
  margin-bottom: 24rem;
  > * {
    margin-bottom: 12rem;
  }
  > :last-child {
    margin-bottom: 0;
  }
}

.sub-title {
  color: var(--ss-spt-level1-live-upcoming-color1);
  text-align: left;
  justify-content: flex-start;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  font-size: 18rem;
  line-height: 1.5;
}
</style>

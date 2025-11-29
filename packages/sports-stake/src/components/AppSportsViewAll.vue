<script setup lang='ts'>
import { ApiSportCompetitionList } from '@tg/apis'
import { SSBaseBadge, SSBaseButton, SSBaseSecondaryAccordion } from '@tg/bccomponents'
import { useSportsStore } from '@tg/stores'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus, application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'

defineOptions({
  name: 'AppSportsViewAll',
})
const { route, projectName } = useSportsConfig()
const { sidebarData } = storeToRefs(useSportsStore())

const sport = computed(() => route.params.sport ? +route.params.sport : 0)
// 球种名称
const sportName = computed(() => {
  if (sidebarData.value)
    return sidebarData.value.all.find(a => a.si === sport.value)?.sn ?? '-'
  return '-'
})

const params = ref({ si: sport.value, kind: 'normal' })
const { data, runAsync } = useRequest(ApiSportCompetitionList)
const allList = computed(() => {
  if (data.value && data.value.list)
    return data.value.list

  return []
})

function goLeagueDetail(pgid: string, pgn: string, ci: string, cn: string) {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, {
    name: ESportsToMainPageRoutes.LEAGUE,
    data: {
      si: sport.value,
      pgid,
      ci,
      query: application.objectToUrlParams({ sn: sportName.value, pgn, cn }),
    },
  })
}

await application.allSettled([runAsync(params.value)])
</script>

<template>
  <div class="view-all">
    <SSBaseSecondaryAccordion
      v-for="region in allList"
      :key="region.pgid" :project-name="projectName"
      :title="region.pgn"
      level="1"
      :init="true"
      :icon="region.ppic"
      is-cloud-icon
      class="base-secondary-accordion"
    >
      <template #side="{ isOpen }">
        <div v-show="!isOpen" class="accordion-badge-wrap">
          <SSBaseBadge :count="region.c" :max="99999" />
        </div>
      </template>
      <template #default>
        <div>
          <div class="wrapper">
            <div v-for="league in region.cl" :key="league.ci" class="btn" @click="goLeagueDetail(region.pgid, region.pgn, league.ci, league.cn)">
              <SSBaseButton
                type="text" size="none"
                style="--ss-base-button-text-default-color:var(--ss-spt-view-all-color1);"
              >
                <div class="th-leading-8 league">
                  <span>{{ league.cn }} ({{ league.c }})</span>
                </div>
              </SSBaseButton>
            </div>
          </div>
        </div>
      </template>
    </SSBaseSecondaryAccordion>
  </div>
</template>

<style lang='scss' scoped>
.view-all {
  display: flex;
  flex-direction: column;
  > *:not(:last-child) {
    margin-bottom: 12rem;
  }
}
.wrapper {
  display: grid;
  grid-gap: 8rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  padding: 16rem;
  background-color: var(--ss-spt-view-all-bg1);
}
.btn {
  width: 100%;
  padding: 12rem;
  border-radius: 4rem;
  background-color: var(--ss-spt-view-all-bg2);
  .league {
    overflow: hidden;
    span {
      white-space: nowrap;
    }
  }
}
</style>

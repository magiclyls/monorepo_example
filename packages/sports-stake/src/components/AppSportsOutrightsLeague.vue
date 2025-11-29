<script setup lang='ts'>
import type { ISportOutrightsInfo, ISportsBreadcrumbs } from '@tg/types'
import { ApiSportOutrightList } from '@tg/apis'
import { SSBaseBadge, SSBaseBreadcrumbs, SSBaseButton, SSBaseSecondaryAccordion } from '@tg/bccomponents'
import { useBoolean, useSportsDataUpdate } from '@tg/hooks'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus, application, sportsDataBreadcrumbs } from '@tg/utils'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'
import AppSportsOutrightsInfoSkeleton from './AppSportsOutrightsInfoSkeleton.vue'

interface Props {
  autoShow: boolean
  leagueName: string
  leagueId: string
  isRegionOpen: boolean // 父级是否展开
  count: number
}
defineOptions({
  name: 'AppSportsOutrightsLeague',
})
const props = defineProps<Props>()
const { route, projectName } = useSportsConfig()
const sport = route.params.sport
const { bool: isSelfOpen } = useBoolean(props.autoShow)

// 冠军数据
const params = ref({ si: +sport, ci: props.leagueId, page: 1, page_size: 100 })
const { data, run, runAsync, loading } = useRequest(ApiSportOutrightList)
/** 定时更新数据 */
const { startTimer, stopTimer } = useSportsDataUpdate(() => run(params.value))

const isRegionOpen = computed(() => props.isRegionOpen)
const eventList = computed(() => {
  if (data.value && data.value.d)
    return data.value.d

  return []
})

// 组件开关时判断是否需要获取数据
function getEventsData() {
  if (eventList.value.length > 0 || loading.value)
    return
  run(params.value)
  startTimer()
}

function onAccordionOpen() {
  isSelfOpen.value = true
  getEventsData()
}
function onAccordionClose() {
  isSelfOpen.value = false
}
// 联赛跳转
function onBreadcrumbsClick({ list }:
{ list: ISportsBreadcrumbs[], index: number },
) {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, list[2].data)
}
// 冠军投注页面
function goOutrightsPage(item: ISportOutrightsInfo) {
  const { si, ci, ei } = item
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, {
    name: ESportsToMainPageRoutes.OUTRIGHT,
    data: {
      si,
      ci,
      ei,
    },
  })
}

watch(isRegionOpen, (a) => {
  if (a && props.autoShow)
    getEventsData()
})

onBeforeUnmount(() => {
  stopTimer()
})

if (props.autoShow && props.isRegionOpen)
  await application.allSettled([runAsync(params.value).then(() => startTimer())])
</script>

<template>
  <SSBaseSecondaryAccordion
    :title="leagueName" :project-name="projectName"
    level="2"
    :init="autoShow"
    class="theme-outright-league"
    @open="onAccordionOpen"
    @close="onAccordionClose"
  >
    <template #side="{ isOpen }">
      <div v-show="!isOpen" class="accordion-badge-wrap">
        <SSBaseBadge :count="count" :max="99999" />
      </div>
    </template>
    <template #default>
      <div class="wrapper">
        <AppSportsOutrightsInfoSkeleton v-if="loading" :num="count" />
        <template v-else>
          <div v-for="item, i in eventList" :key="item.ei" class="fixture-wrapper">
            <div v-if="i > 0" class="line" />
            <div
              class="outright-preview"
            >
              <span class="name">
                <a class="link">
                  {{ item.oen }}
                </a>
              </span>
              <div class="breadcrumb">
                <SSBaseBreadcrumbs
                  :list="sportsDataBreadcrumbs(item)" :only-last="true"
                  @item-click="onBreadcrumbsClick"
                />
              </div>
              <span class="market-count">
                <SSBaseButton type="text" size="none" style="--ss-base-button-text-default-color: var(--ss-spt-outrights-league-color2);" @click="goOutrightsPage(item)">
                  +{{ item.ml[0].ms.length }}
                </SSBaseButton>
              </span>
            </div>
          </div>
        </template>
      </div>
    </template>
  </SSBaseSecondaryAccordion>
</template>

<style lang='scss' scoped>
.theme-outright-league {
}
.wrapper {
  padding: 8rem 0;
}
.outright-preview {
  display: grid;
  grid-column-gap: 8rem;
  padding: 14rem 20rem;
  grid-template-areas:
    'name marketCount'
    'breadcrumb marketCount';
  font-size: 14rem;
  font-weight: 600;
  line-height: 1.3;
}
.line {
  width: 100%;
  height: 1rem;
  background-color: var(--ss-spt-outrights-league-bg1);
}

.name {
  grid-area: name;
  color: var(--ss-spt-outrights-league-color1);
}
.breadcrumb {
  grid-area: breadcrumb;
}
.market-count {
  grid-area: marketCount;
  margin: auto 0 auto auto;
  color: var(--ss-spt-outrights-league-color2);
}
</style>

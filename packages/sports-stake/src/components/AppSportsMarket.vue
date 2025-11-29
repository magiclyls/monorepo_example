<script setup lang='ts'>
import type { ISportEventInfo } from '@tg/types'
import { SSBaseBadge, SSBaseSecondaryAccordion } from '@tg/bccomponents'
import { isZhcn } from '@tg/vue-i18n'
import { computed } from 'vue'
import { useSportsConfig } from '../../config/index'
import { sportsDataGroupByDate } from '../utils/index'
import AppSportsMarketInfo from './AppSportsMarketInfo.vue'
import AppSportsMarketInfoSkeleton from './AppSportsMarketInfoSkeleton.vue'
import AppSportsMarketInfoZhcn from './AppSportsMarketInfoZhcn.vue'

interface Props {
  showBreadcrumb?: boolean
  isStandard?: boolean
  showMore?: boolean
  autoShow?: boolean
  leagueName?: string
  eventCount?: number
  eventList: ISportEventInfo[]
  baseType: string
  loadingMore?: boolean
  groupByDate?: boolean
}
defineOptions({
  name: 'AppSportsMarket',
})
const props = withDefaults(defineProps<Props>(), {
  isStandard: true,
  autoShow: true,
})
const emit = defineEmits(['more'])

const { projectName } = useSportsConfig()

const dateList = computed(() => {
  if (props.groupByDate)
    return sportsDataGroupByDate(props.eventList)

  return []
})

function onMoreClick() {
  emit('more')
}
</script>

<template>
  <SSBaseSecondaryAccordion
    class="base-secondary-accordion"
    :title="leagueName"
    :show-more="showMore"
    level="2"
    :init="autoShow"
    :disabled="eventList.length === 0"
    :style="isZhcn() ? '--ss-secondaryAccordion-header-padding-x:10px;' : ''"
    :project-name="projectName"
    @more="onMoreClick"
  >
    <template #side="{ isOpen }">
      <div v-show="!isOpen" class="accordion-badge-wrap">
        <SSBaseBadge :count="eventCount" :max="99999" />
      </div>
    </template>
    <template #default>
      <div :class="{ 'group': groupByDate, 'py-[8rem]': !isZhcn() }">
        <template v-if="groupByDate">
          <div v-for="item, in dateList" :key="item.date">
            <div class="date-time">
              {{ item.date }}
            </div>
            <AppSportsMarketInfo
              v-for="event, ii in item.list" :key="event.ei"
              :show-breadcrumb="showBreadcrumb"
              :is-standard="isStandard" :index="1"
              :data="event"
              :base-type="baseType"
              :is-last="ii === eventList.length - 1"
              only-time
            />
          </div>
        </template>
        <template v-else>
          <template v-if="isZhcn()">
            <AppSportsMarketInfoZhcn
              v-for="item, i in eventList" :key="item.ei"
              :show-breadcrumb="showBreadcrumb"
              :is-standard="isStandard" :index="i"
              :data="item"
              :base-type="baseType"
              :is-last="i === eventList.length - 1"
            />
          </template>
          <template v-else>
            <AppSportsMarketInfo
              v-for="item, i in eventList"
              :key="item.ei"
              :show-breadcrumb="showBreadcrumb"
              :is-standard="isStandard" :index="i"
              :data="item"
              :base-type="baseType"
              :is-last="i === eventList.length - 1"
            />
          </template>
        </template>

        <AppSportsMarketInfoSkeleton v-if="loadingMore" :num="10" />
      </div>
    </template>
  </SSBaseSecondaryAccordion>
</template>

<style lang='scss' scoped>
.wrapper {
  padding: 8rem 0;
}
.group {
  padding-top: 0;
}
.date-time {
  padding: 6rem 16rem 8rem;
  font-size: 12rem;
  background-color: var(--ss-spt-market-bg1);
  color: var(--ss-spt-market-color1);
}
</style>

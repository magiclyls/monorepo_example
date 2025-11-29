<script setup lang='ts'>
import type { ISportEventInfo } from '@tg/types'

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

const { isZhcn } = storeToRefs(useLanguageStore())

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
  <BaseSecondaryAccordion
    class="base-secondary-accordion"
    :title="leagueName"
    :show-more="showMore"
    level="2"
    :init="autoShow"
    :disabled="eventList.length === 0"
    @more="onMoreClick"
  >
    <template #side="{ isOpen }">
      <div v-show="!isOpen" class="accordion-badge-wrap">
        <BaseBadge :count="eventCount" :max="99999" class="theme-base-dge" />
      </div>
    </template>
    <template #default>
      <div :class="{ 'group': groupByDate, 'py-[8px]': !isZhcn }">
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
          <template v-if="isZhcn">
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
  </BaseSecondaryAccordion>
</template>

<style lang='scss' scoped>
.wrapper{
  padding: var(--tg-spacing-8) 0;
}
.group{
  padding-top:0;
}
.date-time{
  padding: var(--tg-spacing-6) var(--tg-spacing-16) var(--tg-spacing-8);
  font-size: var(--tg-font-size-xs);
  background-color: var(--tg-secondary-main);
  color: var(--tg-text-lightgrey);
}
.theme-base-dge{
  @include webTheme('green'){
    --tg-badge-background-color: #00000033;
  }
  @include webTheme('white'){
    --tg-badge-background-color:#D8D8D8;
  }
}

.base-secondary-accordion {
  @include webTheme('white'){
    --content-border: #e4e4e4;
  }
  @include webTheme('green'){
    --header-background: #0E6746;
    --content-background:#0E6746;
    --content-border: #FFFFFF1A;
    --title-span-color: #76F0C5;
  }
}
</style>

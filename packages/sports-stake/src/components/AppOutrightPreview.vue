<script lang="ts" setup>
import type { ISportOutrightsInfo, ISportsBreadcrumbs } from '@tg/types'
import { SSBaseBadge, SSBaseBreadcrumbs, SSBaseButton, SSBaseSecondaryAccordion } from '@tg/bccomponents'
import { ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus, sportsDataBreadcrumbs } from '@tg/utils'
import { timeToDateFormat } from '@tg/vue-i18n'
import { computed } from 'vue'
import { useSportsConfig } from '../../config/index'

interface Props {
  autoShow: boolean
  data: {
    ci: string
    cn: string
    list: ISportOutrightsInfo[]
  }
}
defineOptions({
  name: 'AppOutrightPreview',
})
const props = defineProps<Props>()

const { projectName } = useSportsConfig()

const dateList = computed(() => {
  const origin = props.data.list.map((a) => {
    const date = timeToDateFormat(a.ed)
    return { ...a, date }
  })
  const arr: { date: string, list: ISportOutrightsInfo[] }[] = []
  for (let i = 0; i < origin.length; i++) {
    if (i === 0) {
      arr.push({ date: origin[i].date, list: [origin[i]] })
      continue
    }
    const index = arr.findIndex(a => a.date === origin[i].date)
    if (index > -1)
      arr[index].list.push(origin[i])
    else
      arr.push({ date: origin[i].date, list: [origin[i]] })
  }
  return { ci: props.data.ci, cn: props.data.cn, list: arr, c: props.data.list.length }
})

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
</script>

<template>
  <SSBaseSecondaryAccordion :title="dateList.cn" level="2" :init="autoShow" :project-name="projectName">
    <template #side="{ isOpen }">
      <div v-show="!isOpen" class="accordion-badge-wrap">
        <SSBaseBadge :count="dateList.c" :max="99999" />
      </div>
    </template>
    <div class="wrapper">
      <div v-for="item in dateList.list" :key="item.date">
        <div class="date-time">
          {{ item.date }}
        </div>
        <div v-for="event, i in item.list" :key="event.ei" class="fixture-wrapper">
          <div v-if="i > 0" class="line" />
          <div
            class="outright-preview"
          >
            <span class="name">
              <a class="link">
                {{ event.oen }}
              </a>
            </span>
            <div class="breadcrumb">
              <SSBaseBreadcrumbs
                :list="sportsDataBreadcrumbs(event)" :only-last="true"
                @item-click="onBreadcrumbsClick"
              />
            </div>
            <span class="market-count">
              <SSBaseButton
                type="text" size="none" style="--ss-base-button-text-default-color:var(--ss-spt-outright-preview-color3);"
                @click="goOutrightsPage(event)"
              >
                +{{ event.ml[0].ms.length }}
              </SSBaseButton>
            </span>
          </div>
        </div>
      </div>
    </div>
  </SSBaseSecondaryAccordion>
</template>

<style lang="scss" scoped>
.wrapper {
  padding-bottom: 8rem;
}
.date-time {
  padding: 6rem 16rem 8rem;
  font-size: 12rem;
  background-color: var(--ss-spt-outright-preview-bg1);
  color: var(--ss-spt-outright-preview-color1);
}
.line {
  width: 100%;
  height: 1px;
  background-color: var(--ss-spt-outright-preview-bg2);
}
.outright-preview {
  display: grid;
  grid-column-gap: 8rem;
  padding: 8rem 20rem;
  grid-template-areas:
    'name marketCount'
    'breadcrumb marketCount';
  font-size: 14rem;
  font-weight: 600;
  line-height: 1.3;
}

.name {
  grid-area: name;
  color: var(--ss-spt-outright-preview-color2);
}
.breadcrumb {
  grid-area: breadcrumb;
}
.market-count {
  grid-area: marketCount;
  margin: auto 0 auto auto;
  color: var(--ss-spt-outright-preview-color3);
}
</style>

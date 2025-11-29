<script setup lang='ts'>
import type { ISportsBreadcrumbs } from '@tg/types'
import { useWindowStore } from '@tg/stores'
import { application, replaceSportsPlatId } from '@tg/utils'
import { timeToDateWithDayFormat } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseBreadcrumbs from './BaseBreadcrumbs.vue'
import BaseTab from './BaseTab.vue'

defineOptions({
  name: 'AppSportsSearchResult',
})
const props = defineProps<{
  ty?: string | number
  data?: {
    list: {
      si: number
      sn: string
      c: number
      list: {
        pgid: string
        pgn: string
        ci: string
        cn: string
        ei: string
        ed: number
        htn: string
        atn: string
      }[]
    }[]
  }
}>()

const router = useRouter()
const { bodyWidth } = storeToRefs(useWindowStore())
const closeSearch = inject('closeSearch', () => {})
const closeSearchH5 = inject('closeSearchH5', () => {})

const currentTab = ref(props.data?.list[0].si ?? 0)
const isH5Layout = computed(() => bodyWidth.value < 575)
const tabList = computed(() => {
  if (props.data) {
    return props.data.list.map((a) => {
      return {
        label: a.sn,
        value: a.si,
        num: a.c,
      }
    })
  }

  return []
})
const list = computed(() => {
  if (props.data) {
    const dataFindBySi = props.data.list.find(a => a.si === currentTab.value)

    if (dataFindBySi) {
      return dataFindBySi.list.map((b) => {
        const sport = {
          label: dataFindBySi.sn,
          value: `${dataFindBySi.si}`,
          path: `/sports/${dataFindBySi.si}`,
        }
        const area = {
          label: b.pgn,
          value: `${b.pgid}`,

          path: `/sports/${dataFindBySi.si}/${b.pgid}?${application.objectToUrlParams({ sn: dataFindBySi.sn, pgn: b.pgn })}`,
        }
        const league = {
          label: b.cn,
          value: `${b.ci}`,

          path: `/sports/${dataFindBySi.si}/${b.pgid}/${b.ci}?${application.objectToUrlParams({ sn: dataFindBySi.sn, pgn: b.pgn, cn: b.cn })}`,
        }
        return {
          ...b,
          breadcrumb: [sport, area, league],
          time: timeToDateWithDayFormat(b.ed),
          path: `/sports/${dataFindBySi.si}/${b.pgid}/${b.ci}/${b.ei}`,
        }
      })
    }
    return []
  }
  return []
})
// 联赛跳转
function onBreadcrumbsClick({ list, index }: {
  list: ISportsBreadcrumbs[]
  index: number
},
) {
  if (isH5Layout.value) {
    router.push(replaceSportsPlatId(list[2].path))
    closeSearchH5()
  }
  else {
    router.push(replaceSportsPlatId(list[index].path))
    closeSearch()
  }
}
function goEventDetail(path: string) {
  if (isH5Layout.value) {
    router.push(replaceSportsPlatId(path))
    closeSearchH5()
  }
  else {
    router.push(replaceSportsPlatId(path))
    closeSearch()
  }
}
</script>

<template>
  <div class="app-sports-search-result">
    <BaseTab v-model="currentTab" :list="tabList" :center="false">
      <template #tab="{ item }">
        <div class="tab">
          <label>{{ item.label }}</label>
          <span>{{ item.num }}</span>
        </div>
      </template>
    </BaseTab>

    <div class="result-list mt-[8px]">
      <div v-for="item, in list" :key="item.ci" class="result-item">
        <div class="game-name mb-[8px]">
          <div
            @click="goEventDetail(item.path)"
          >
            <span>{{ item.htn }}</span>
          </div> -
          <div
            @click="goEventDetail(item.path)"
          >
            <span>{{ item.atn }}</span>
          </div>
        </div>
        <div class="status mb-[8px]">
          {{ item.time }}
        </div>
        <BaseBreadcrumbs :list="item.breadcrumb" @item-click="onBreadcrumbsClick" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-sports-search-result {
  --tg-tab-style-wrap-bg-color: #1a2c38;
  display: flex;
  flex-direction: column;
  // gap: var(--tg-spacing-8);
}

.tab {
  display: flex;
  line-height: 1.5;
  white-space: nowrap;

  label {
    margin-right: 8rem;
  }

  span {
    padding: 0 7rem;
    border-radius: 50px;
    background-color: #2f4553;
  }
}

.result-list {
  .result-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // gap: var(--tg-spacing-8);
    padding: 8rem 16rem;
    border-bottom: #2f4553 solid 2px;
    font-size: 14px;

    &:last-of-type {
      border: none;
    }

    .game-name {
      span {
        color: #fff;
        cursor: pointer;
      }
    }

    .status {
      // background-color: var(--tg-secondary-deepdark);
      border-radius: 4px;
      padding: 0 4rem;
      line-height: 1.5;
      font-size: 12px;
    }
  }
}
</style>

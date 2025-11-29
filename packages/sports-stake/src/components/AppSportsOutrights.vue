<script setup lang='ts'>
import { ApiSportOutrightList } from '@tg/apis'
import { BaseImage, SSBaseEmpty } from '@tg/bccomponents'
import { useSportsDataUpdate } from '@tg/hooks'
import { application } from '@tg/utils'
import { computed, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'
import AppOutrightPreview from './AppOutrightPreview.vue'

interface Props {
  level: 2 | 3
}
defineOptions({
  name: 'AppSportsOutrights',
})
const props = defineProps<Props>()

const { t } = useI18n()
const { route, projectName } = useSportsConfig()

const sportId = route.params.sport ? +route.params.sport : 0
const regionId = route.params.region ? route.params.region.toString() : ''
const leagueId = route.params.league ? route.params.league.toString() : ''
// 冠军数据
const params = ref({ si: sportId, page: 1, page_size: 100 })
const { data, run, runAsync } = useRequest(ApiSportOutrightList)
/** 定时更新数据 */
const { startTimer, stopTimer } = useSportsDataUpdate(() => run(params.value))

const isRegion = computed(() => props.level === 2)
const isLeague = computed(() => props.level === 3)

const regionList = computed(() => {
  if (data.value && data.value.d) {
    const origin = data.value.d.filter(a => a.pgid === regionId)
    const arr = []
    for (let i = 0; i < origin.length; i++) {
      if (i === 0) {
        arr.push({ ci: origin[i].ci, cn: origin[i].cn, list: [origin[i]] })
        continue
      }
      const index = arr.findIndex(a => a.ci === origin[i].ci)
      if (index > -1)
        arr[index].list.push(origin[i])
      else
        arr.push({ ci: origin[i].ci, cn: origin[i].cn, list: [origin[i]] })
    }
    return arr
  }
  return []
})
const leagueList = computed(() => {
  if (data.value && data.value.d) {
    const orgin = data.value.d.filter(a => a.ci === leagueId)
    return orgin.length > 0
      ? { ci: orgin[0].ci, cn: orgin[0].cn, list: orgin }
      : { ci: '', cn: '', list: [] }
  }
  return { ci: '', cn: '', list: [] }
})

watch(route, (r) => {
  if (r.fullPath.includes('tab=2')) {
    params.value.si = r.params.sport ? +r.params.sport : 0
    run(params.value)
    startTimer()
  }
})

onBeforeMount(() => {
  startTimer()
})
onBeforeUnmount(() => {
  stopTimer()
})

await application.allSettled([runAsync(params.value)])
</script>

<template>
  <div v-if="isRegion" class="acc-box">
    <AppOutrightPreview
      v-for="league, i in regionList" :key="league.ci"
      :auto-show="i === 0" :data="league"
    />
    <div v-show="regionList.length === 0" class="empty">
      <SSBaseEmpty :description="t('未找到结果')">
        <template #icon>
          <div class="w-[80rem]">
            <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
          </div>
        </template>
      </SSBaseEmpty>
    </div>
  </div>

  <template v-else-if="isLeague">
    <AppOutrightPreview v-if="leagueList.list.length > 0" auto-show :data="leagueList" />
    <div v-else class="empty">
      <SSBaseEmpty :description="t('未找到结果')">
        <template #icon>
          <div class="w-[80rem]">
            <BaseImage :url="`/${projectName}/png/uni-empty-market.png`" />
          </div>
        </template>
      </SSBaseEmpty>
    </div>
  </template>
</template>

<style lang='scss' scoped>
.acc-box {
  display: grid;
  grid-auto-flow: row;
  justify-content: stretch;
  align-items: center;
  gap: 12rem;
  padding: 8rem;
}
.empty {
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

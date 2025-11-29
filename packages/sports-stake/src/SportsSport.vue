<script lang="ts" setup>
import { SSAppLoading, SSBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useSportsStore } from '@tg/stores'
import { useTitle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../config/index'
import AppNavBreadCrumb from './components/AppNavBreadCrumb.vue'
import AppSportsLevel1LiveUpcoming from './components/AppSportsLevel1LiveUpcoming.vue'
import AppSportsLevel1Outrights from './components/AppSportsLevel1Outrights.vue'
import AppSportsMarketTypeSelect from './components/AppSportsMarketTypeSelect.vue'
import AppSportsViewAll from './components/AppSportsViewAll.vue'

defineOptions({ name: 'StakeSportsSport' })

const { t } = useI18n()
const { route } = useSportsConfig()
const sportsStore = useSportsStore()
const { sidebarData, sportsBetTypeList } = storeToRefs(sportsStore)
const { bool: isStandard } = useBoolean(true)
const { bool: isFirst, setFalse: isFirstFalse } = useBoolean(true)

const curTab = ref(route.query.tab ? `${route.query.tab}` : '1')
const sport = computed(() => route.params.sport ? +route.params.sport : 0)
const baseType = ref(sportsStore.getSportsBetTypeListBySi(sport.value)[0].value)

const isLiveAndUpcoming = computed(() => curTab.value === '1')
const isOutrights = computed(() => curTab.value === '2')
const isViewAll = computed(() => curTab.value === '3')
const baseTypeOptions = computed(() =>
  sportsStore.getSportsBetTypeListBySi(sport.value),
)
// 球种名称
const sportName = computed(() => {
  if (sidebarData.value)
    return sidebarData.value.all.find(a => a.si === sport.value)?.sn ?? '-'
  return '-'
})
const breadcrumb = computed(() => [
  {
    path: '',
    title: sportName.value,
  },
])
const tabs = computed(() => [
  { value: '1', label: t('滚球与即将开赛的盘口') },
  { value: '2', label: t('冠军投注') },
  { value: '3', label: `${t('全部')}${sportName.value}` },
])

function onTabChange(v: string) {
  isFirstFalse()
}

watch(sportsBetTypeList, () => {
  baseType.value = sportsStore.getSportsBetTypeListBySi(sport.value)[0].value
})
watch(route, (r) => {
  if (r.name?.toString().includes('sports-platId-sport')) {
    isFirstFalse()
    curTab.value = r.query.tab ? `${route.query.tab}` : '1'
  }
})

useTitle(sportName)
</script>

<template>
  <div class="tg-sports-index tg-sports-hotlive">
    <div class="wrapper">
      <AppNavBreadCrumb class="theme-bread-crumb" :breadcrumb="breadcrumb" />
      <div class="tab-box">
        <div class="left">
          <SSBaseTabs
            v-model="curTab"
            class="theme-tab" :list="tabs" size="large"
            :center="false" @change="onTabChange"
          />
        </div>
      </div>
      <AppSportsMarketTypeSelect
        v-show="isLiveAndUpcoming"
        v-model="baseType" v-model:is-standard="isStandard"
        class="mb-[12rem]" :base-type-options="baseTypeOptions"
      />

      <!-- 首次加载 -->
      <template v-if="isFirst">
        <!-- 滚球及即将开赛 -->
        <AppSportsLevel1LiveUpcoming
          v-if="isLiveAndUpcoming"
          :base-type="baseType" :is-standard="isStandard"
        />
        <!-- 冠军 -->
        <AppSportsLevel1Outrights v-else-if="isOutrights" />
        <AppSportsViewAll
          v-else-if="isViewAll"
          style="margin-bottom: 24rem;"
        />
      </template>
      <!-- 后续切换tab时 -->
      <template v-else>
        <Suspense timeout="0">
          <AppSportsLevel1LiveUpcoming
            v-if="isLiveAndUpcoming"
            :base-type="baseType" :is-standard="isStandard"
          />
          <AppSportsLevel1Outrights v-else-if="isOutrights" />
          <AppSportsViewAll
            v-else-if="isViewAll"
            style="margin-bottom: 24rem;"
          />
          <template #fallback>
            <SSAppLoading full-screen />
          </template>
        </Suspense>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-tab {
}
.tab-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rem;
  margin-top: 12rem;
  .left {
    max-width: 100%;
  }
}
.tg-sports-index {
  touch-action: manipulation;
}
.theme-bread-crumb {
}
</style>

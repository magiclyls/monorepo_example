<script lang="ts" setup>
import { SSAppLoading, SSBaseTabs } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { useSportsStore } from '@tg/stores'
import { ESportsToMainPageRoutes } from '@tg/types'
import { application } from '@tg/utils'
import { useTitle } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSportsConfig } from '../config/index'
import AppNavBreadCrumb from './components/AppNavBreadCrumb.vue'
import AppSportsLevel2LiveUpcoming from './components/AppSportsLevel2LiveUpcoming.vue'
import AppSportsMarketTypeSelect from './components/AppSportsMarketTypeSelect.vue'
import AppSportsOutrights from './components/AppSportsOutrights.vue'
import AppSportsViewAll from './components/AppSportsViewAll.vue'

defineOptions({ name: 'StakeSportsRegion' })

const { t } = useI18n()
useTitle(t('加密货币与比特币在线体育博彩'))
const sportsStore = useSportsStore()
const { sportsBetTypeList } = storeToRefs(sportsStore)
const { route } = useSportsConfig()
const navObj = application.urlParamsToObject(route.fullPath.split('?')[1])
const sport = computed(() => route.params.sport ? +route.params.sport : 0)
const { bool: isStandard } = useBoolean(true)
const { bool: isFirst, setFalse: isFirstFalse } = useBoolean(true)

const baseType = ref(sportsStore.getSportsBetTypeListBySi(sport.value)[0].value)
const curTab = ref(route.query.tab ? `${route.query.tab}` : '1')

const tabs = computed(() => [
  { value: '1', label: t('滚球与即将开赛的盘口') },
  { value: '2', label: t('冠军投注') },
  { value: '3', label: `${t('全部')} ${navObj.sn}` },
])
const baseTypeOptions = computed(() =>
  sportsStore.getSportsBetTypeListBySi(sport.value),
)

const isLiveAndUpcoming = computed(() => curTab.value === '1')
const isOutrights = computed(() => curTab.value === '2')
const isViewAll = computed(() => curTab.value === '3')
const breadcrumb = computed(() => [
  {
    path: `/sports/${sport.value}`,
    title: navObj.sn,
    data: {
      name: ESportsToMainPageRoutes.SPORT,
      data: {
        si: sport.value,
      },
    },
  },
  {
    path: '',
    title: navObj.pgn,
  },
])

watch(sportsBetTypeList, () => {
  baseType.value = sportsStore.getSportsBetTypeListBySi(sport.value)[0].value
})
</script>

<template>
  <div class="tg-sports-category-index">
    <div class="wrapper">
      <AppNavBreadCrumb class="theme-bread-crumb" :breadcrumb="breadcrumb" />
      <div class="tab-box">
        <div class="left">
          <SSBaseTabs
            v-model="curTab"
            class="theme-tab" :list="tabs" size="large"
            :center="false" @change="isFirstFalse"
          />
        </div>
      </div>
      <AppSportsMarketTypeSelect
        v-show="isLiveAndUpcoming" v-model="baseType"
        v-model:is-standard="isStandard" :base-type-options="baseTypeOptions"
      />
      <!-- 首次加载 -->
      <template v-if="isFirst">
        <AppSportsLevel2LiveUpcoming
          v-if="isLiveAndUpcoming" :base-type="baseType"
          :is-standard="isStandard"
        />
        <!-- 冠军 -->
        <AppSportsOutrights v-else-if="isOutrights" :level="2" />
        <AppSportsViewAll v-else-if="isViewAll" />
      </template>
      <!-- 后续切换tab时 -->
      <template v-else>
        <Suspense timeout="0">
          <AppSportsLevel2LiveUpcoming
            v-if="isLiveAndUpcoming" :base-type="baseType"
            :is-standard="isStandard"
          />
          <!-- 冠军 -->
          <AppSportsOutrights v-else-if="isOutrights" :level="2" />
          <AppSportsViewAll v-else-if="isViewAll" />
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
  .left {
    max-width: 100%;
  }
}
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12rem;
}
.tg-sports-category-index {
  touch-action: manipulation;
}
.theme-bread-crumb {
}
</style>

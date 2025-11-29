<script lang="ts" setup>
import { PhBaseTabs } from '@tg/bccomponents'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import Calculation from './calculation.vue'
import Conversions from './conversions.vue'
import GameEvents from './game-events.vue'
import Implementation from './implementation.vue'
import Overview from './overview.vue'
import SeedUnhash from './server-seed-unhash.vue'

const { t } = useI18n()
const route = useRoute()

const tab = ref(route.query.tab as string || 'ProvablyFairOverview')
const tabList = ref([
  { label: t('概述'), value: 'ProvablyFairOverview', component: Overview },
  { label: t('实施'), value: 'ProvablyFairImplementation', component: Implementation },
  { label: t('转换'), value: 'ProvablyFairConversions', component: Conversions },
  { label: t('游戏事件'), value: 'ProvablyFairGameEvents', component: GameEvents },
  { label: t('取消服务器种子散列'), value: 'ProvablyFairServerSeedUnhash', component: SeedUnhash },
  { label: t('计算'), value: 'ProvablyFairCalculation', component: Calculation },
])

const currentComponent = computed(() => tabList.value.find(item => tab.value === item.value)?.component)
</script>

<template>
  <AppPageLayout :title="t('可证明的公平')">
    <PhBaseTabs v-model="tab" :list="tabList" :type="5" class="mb-[16rem]" :need-scroll-at-init="true" style="--tabs-wrap-padding-y: 5rem; --tabs-item-active-bg: #F23038; --tabs-item-active-color: #fff; --tabs-item-color: #0D2245; --tabs-wrap-bg: #fff" />
    <div class="bg-[#fff] rounded-[8rem] p-[12rem]">
      <component :is="currentComponent" />
    </div>
  </AppPageLayout>
</template>

<script setup lang='ts'>
import { PhBaseSelect, PhBaseTabs } from '@tg/bccomponents'
import { useBoolean, useSportSelectSettle } from '@tg/hooks'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import casinoBetRecord from './_components/casino-bet-record.vue'
import sportBetRecord from './_components/sport-bet-record.vue'

defineOptions({ name: 'AppBetsRecord' })
const { t } = useI18n()
const route = useRoute()
const { bool: isFirst, setFalse: isFirstFalse } = useBoolean(true)
const initType = route.query.type ? route.query.type.toString() : 'casino'

const currentTab = ref(initType)
const currentDaysTab = ref('today')
const {
  settle,
  settleList,
} = useSportSelectSettle()

const settleValue = ref(settle.value)

const tabList = [
  { label: t('娱乐城'), value: 'casino' },
  { label: t('体育'), value: 'sports' },
]
const tabDaysList = [
  { label: t('今日'), value: 'today' },
  { label: t('本周'), value: 'week' },
  { label: t('本月'), value: 'month' },
]

const currentComponent = computed(() => currentTab.value === 'casino' ? casinoBetRecord : sportBetRecord)

function onTabChange(v: number) {
  settleValue.value = v
  isFirstFalse()
}
</script>

<template>
  <AppPageLayout :title="t('投注记录')">
    <PhBaseTabs v-model="currentDaysTab" :type="8" :list="tabDaysList" class="mb-[16rem] w-auto" bottom-rounded style="--ph-base-button-padding-x:12rem" />
    <div class="p-[12rem] bg-[#fff] flex flex-col gap-[10rem] rounded-[4rem]">
      <div class="flex justify-between items-start">
        <PhBaseTabs v-model="currentTab" :type="3" :list="tabList" bottom-rounded />
        <div class="flex-1 flex justify-end">
          <PhBaseSelect
            v-show="currentTab === 'sports'"
            v-model="settleValue"
            center-item
            class="pr-[4rem] pl-[20rem]"
            style="--ph-base-select-height: 20rem; --ph-base-select-border-color: transparent; --ph-base-select-arrow-icon-color: #9DABC8; --ph-base-select-label-color: #6D7693; --ph-base-select-padding: 0 25rem 0 4rem;   --ph-base-select-label-icon-gap: 4rem; --ph-base-select-content-align: center; --ph-base-select-font-weight: 600"
            :auto-size="false"
            :options="settleList" popper
            @change="onTabChange"
          />
        </div>
      </div>
      <component :is="currentComponent" :period="currentDaysTab" :settle="settleValue" />
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped></style>

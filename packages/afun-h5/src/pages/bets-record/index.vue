<script setup lang='ts'>
import { AfunBaseSelect, AfunBaseTabs } from '@tg/bccomponents'
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
    <AfunBaseTabs v-model="currentDaysTab" :type="8" :list="tabDaysList" class="mb-[16px] w-auto" bottom-rounded style="--afun-base-button-padding-x:12px" />
    <div class="p-[12px] bg-[#0F212E] flex flex-col gap-[10px] rounded-[4px]">
      <div class="flex justify-between items-start">
        <AfunBaseTabs v-model="currentTab" :type="3" :list="tabList" bottom-rounded style="--afun-tabs-text-color:#B1BAD3" />
        <div class="flex-1 flex justify-end">
          <AfunBaseSelect
            v-show="currentTab === 'sports'"
            v-model="settleValue"
            center-item
            class="pr-[4rem] pl-[20rem]"
            style="--afun-base-select-height: 20px; --afun-base-select-border-color: transparent; --afun-base-select-arrow-icon-color: #b1bad3; --afun-base-select-label-color: #b1bad3; --afun-base-select-padding: 0 25px 0 4px;   --afun-base-select-label-icon-gap: 4px; --afun-base-select-content-align: center; --afun-base-select-font-weight: 600"
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

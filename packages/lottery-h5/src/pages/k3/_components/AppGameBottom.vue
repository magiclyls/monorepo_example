<script setup lang='ts'>
import { LotteryTableTabs } from '@tg/bccomponents'
import { computed, ref } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import AppK3GameChart from './AppK3GameChart.vue'
import AppK3GameHistory from './AppK3GameHistory.vue'
import AppK3MyHistory from './AppK3MyHistory.vue'

const { $$t } = useLocale()
const btnArr = [{
  label: $$t('游戏记录'),
  value: 1,
  component: AppK3GameHistory,
}, {
  label: $$t('走势图'),
  value: 2,
  component: AppK3GameChart,
}, {
  label: $$t('我的记录'),
  value: 3,
  component: AppK3MyHistory,
}]
const currentBtn = ref(1)
const curComponent = computed(() => {
  return btnArr[currentBtn.value - 1].component
})
</script>

<template>
  <div class="flex flex-col gap-[16rem]">
    <LotteryTableTabs v-model="currentBtn" :tabs="btnArr" />
    <component :is="curComponent" />
  </div>
</template>

<style lang='scss' scoped>

</style>

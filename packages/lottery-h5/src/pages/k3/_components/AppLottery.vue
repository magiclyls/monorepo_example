<script setup lang='ts'>
import { LotteryCountDownMask } from '@tg/bccomponents'
import { computed, ref, watch } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { useK3Store } from '../../../stores/useK3Store'
import AppBet2some from './AppBet2some.vue'
import AppBet3some from './AppBet3some.vue'
import AppBetDifferent from './AppBetDifferent.vue'
import AppBetTotal from './AppBetTotal.vue'
import AppK3Tabs from './AppK3Tabs.vue'

const props = defineProps<Props>()
const { $$t } = useLocale()
type TabValue = 1 | 2 | 3 | 4
interface Props {
  timeMask: number
  isShowMask: boolean
  data: any
}
const k3Store = useK3Store()
const tab = ref<TabValue>(1)
const tabs = [
  {
    label: $$t('总和1'),
    value: 1,
    component: AppBetTotal,
  },
  {
    label: $$t('2个相同'),
    value: 2,
    component: AppBet2some,
  },
  {
    label: $$t('3个相同'),
    value: 3,
    component: AppBet3some,
  },
  {
    label: $$t('不同'),
    value: 4,
    component: AppBetDifferent,
  },
]

const componentProps = computed(() => {
  return {
    data: props.data,
  }
})

const currentComponent = computed(() => {
  return tabs.find(item => item.value === tab.value)?.component
})
watch(tab, () => {
  k3Store.closePop()
  k3Store.clearBet()
})
</script>

<template>
  <div class="relative k3-lottery-bg rounded-b-[10rem] pb-[9rem] px-[10rem]">
    <AppK3Tabs v-model="tab" :tabs="tabs" />
    <component :is="currentComponent" v-bind="{ ...componentProps }" />
    <LotteryCountDownMask v-if="timeMask > 0 || isShowMask" :time="timeMask" />
  </div>
</template>

<style lang='scss' scoped>

</style>

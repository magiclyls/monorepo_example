<script setup lang="ts" name="AppBetView">
import type { LotteryBetItem } from '@tg/types'
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import { k3IdToKindMap } from '../../../utils/lotteryMaps'
import AppBetResultItem from './AppBetResultItem.vue'

interface Props {
  k3BetData: any
  k3BetType?: number
  vertical?: boolean // vertical false时为历史记录里的 横版样式， true为投注弹窗里的竖版样式
  playid?: number // 如果传参 ，则仅显示改playid的数据
  showTitle?: boolean
}
interface ConfigItem {
  title: string
  type: number
  data: LotteryBetItem[]
  show: boolean
  extra?: LotteryBetItem[]
}
type ConfigData = ConfigItem[][]
const props = withDefaults(defineProps<Props>(), {
  vertical: false,
  showTitle: true,
})
const { $$t } = useLocale()

const k3BetData = computed(() => props.k3BetData)
const k3BetType = computed(() => props.k3BetType)
const needid = computed(() => Boolean(props.playid))
const configData = computed<ConfigData>(() => {
  return [
  // type1,2,3,4配置展示数据
    [
      {
        title: $$t('总和1'),
        type: 1,
        data: k3BetData.value,
        show: k3BetData.value?.length > 0,
      },
    ],
    [
      {
        title: k3IdToKindMap(305, $$t).label,
        type: 3,
        data: k3BetData.value.betArr1,
        show: needid.value ? props.playid === 305 : k3BetData.value.betArr1?.length > 0,
      },
      {
        title: k3IdToKindMap(306, $$t).label,
        type: 2,
        data: k3BetData.value.betArr2,
        extra: k3BetData.value.betArr3,
        show: needid.value ? props.playid === 306 : (k3BetData.value.betArr2?.length > 0 && k3BetData.value.betArr3?.length > 0),
      },
    ],
    [
      {
        title: k3IdToKindMap(307, $$t).label,
        type: 3,
        data: k3BetData.value.betArr1,
        show: needid.value ? props.playid === 307 : k3BetData.value.betArr1?.length > 0,
      },
      {
        title: k3IdToKindMap(308, $$t).label,
        type: 4,
        data: k3BetData.value.betArr2,
        show: needid.value ? props.playid === 308 : k3BetData.value.betArr2?.length > 0,
      },
    ],
    [
      {
        title: k3IdToKindMap(309, $$t).label,
        type: 3,
        data: k3BetData.value.betArr1,
        show: needid.value ? props.playid === 309 : k3BetData.value.betArr1?.length > 2,
      },
      {
        title: k3IdToKindMap(310, $$t).label,
        type: 4,
        data: k3BetData.value.betArr2,
        show: needid.value ? props.playid === 310 : k3BetData.value.betArr2?.length > 0,
      },
      {
        title: k3IdToKindMap(311, $$t).label,
        type: 3,
        data: k3BetData.value.betArr3,
        show: needid.value ? props.playid === 311 : k3BetData.value.betArr3?.length > 1,
      },
    ],
  ]
})
const currentRenderData = computed(() => {
  return configData.value[(k3BetType.value ?? 1) - 1].filter(item => item.show)
})
</script>

<template>
  <div>
    <div v-if="currentRenderData && currentRenderData?.length > 0" class="flex flex-col gap-[15rem]">
      <AppBetResultItem
        v-for="(item, i) in currentRenderData"
        :key="item.title"
        :title="`${item.title}:`"
        :type="item.type"
        :data="item.data"
        :vertical="vertical"
        :extra="item.extra"
        :show-title="showTitle"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

</style>

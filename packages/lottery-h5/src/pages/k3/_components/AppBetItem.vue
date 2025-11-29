<script lang="ts" setup name="AppBetItem">
import type { LotteryBetItem } from '@tg/types'
import { IconTaskTip } from '@tg/icons'
import AppBetBtnList from './AppBetBtnList.vue'
import AppDialogRules from './AppDialogRules.vue'

interface Props {
  title: string
  ruleType: number

  data: LotteryBetItem[]
  bettedArr: LotteryBetItem[]
  type: number // type 1  紫色，2 红色，3 绿色

  extra?: LotteryBetItem[]
  extraBettedArr?: LotteryBetItem[]
  extraType?: number // type 1  紫色，2 红色，3 绿色
}
const props = defineProps<Props>()
const emit = defineEmits(['toggle'])
</script>

<template>
  <div class="flex flex-col gap-[8rem]">
    <div class="flex items-center">
      <span class="bet-item-text text-[12rem]">{{ title }}</span>
      <AppDialogRules :type="ruleType">
        <IconTaskTip class="text-[#F00] ml-[5rem] bet-item-bg" />
      </AppDialogRules>
    </div>
    <AppBetBtnList
      :data="data" :betted-arr="bettedArr" :type="type" @toggle="(item) => {
        emit('toggle', item)
      }"
    />
    <AppBetBtnList
      v-if="extra && extraType && extraBettedArr && extra.length > 0"
      :data="extra"
      :betted-arr="extraBettedArr"
      :type="extraType"
      @toggle="(item) => {
        emit('toggle', item, true)
      }"
    />
  </div>
</template>

<style scoped lang="scss">

</style>

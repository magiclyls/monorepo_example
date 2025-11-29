<script setup lang='ts'>
import { LotteryCountDown, LotteryImage } from '@tg/bccomponents'
import { IconLotTicket } from '@tg/icons'
import { computed } from 'vue'
import { useLocale } from '../../../components/LotteryConfigProvider'
import AppDialogHowtoplay from './AppDialogHowtoplay.vue'

const props = defineProps<Props>()
const { $$t } = useLocale()
interface Props {
  curPeriod: string
  time: number
  timeToShowMask: any
  randomId: number
  lotteryResultArr: any
  showResults: any
}
const lastResult = computed(() => {
  return props.lotteryResultArr?.value?.[0]
})

const result = computed(() => {
  return props.showResults?.value || []
})
</script>

<template>
  <div class="k3-remain-time-bg rounded-t-[10rem] flex flex-col py-[16rem] px-[11rem]">
    <div class="flex justify-between items-center font-[500] k3-remain-time-text">
      <div class="center gap-[13rem]">
        <span class="d">
          {{ $$t('期号') }}
        </span>
        <AppDialogHowtoplay>
          <div class="border-[1rem] text-[18rem] k3-remain-time-border rounded-[30rem] center px-[20rem] h-[23rem] k3-remain-time-text1">
            <IconLotTicket /><span class="ml-[2rem] text-[12rem]">{{ $$t('玩法说明') }}</span>
          </div>
        </AppDialogHowtoplay>
      </div>
      <div class="text-right text-[12rem]">
        {{ $$t('倒计时') }}
      </div>
    </div>
    <div class="flex justify-between items-center font-[700] k3-remain-time-text2">
      <span class="text-[20rem]">
        {{ curPeriod }}
      </span>
      <LotteryCountDown :key="randomId" class="justify-end" style="--lot-timer-box-first-clip:none;--lot-timer-box-last-clip:none;" :time="time" type="k3" @on-time="timeToShowMask" />
    </div>

    <div class="dices my-[18rem] rounded-[7rem] k3-remain-time-bg1 p-[10rem]">
      <div class="center k3-remain-time-bg2 rounded-[5rem] gap-[7.5rem] p-[5rem] h-[96rem]">
        <div v-for="(item, i) in result" :key="i" class="item center flex-1 h-[86rem] ">
          <LotteryImage :url="`/lottery/png/dice-${item}.png`" class="w-[66rem]" />
        </div>
      </div>
    </div>
    <div class="absolute w-0 h-0 overflow-hidden">
      <LotteryImage url="/lottery/png/dice-1.png" class="w-[66rem]" />
      <LotteryImage url="/lottery/png/dice-2.png" class="w-[66rem]" />
      <LotteryImage url="/lottery/png/dice-3.png" class="w-[66rem]" />
      <LotteryImage url="/lottery/png/dice-4.png" class="w-[66rem]" />
      <LotteryImage url="/lottery/png/dice-5.png" class="w-[66rem]" />
      <LotteryImage url="/lottery/png/dice-6.png" class="w-[66rem]" />
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

<script lang="ts" setup name="AppWinLoseSettle">
import type { CurrencyCode } from '@tg/types'
import { IconLotteryDialogClose, IconLotterySelected } from '@tg/icons'
import { getCurrencyConfig } from '@tg/utils'
import { ref } from 'vue'
import { useLocale } from './LotteryConfigProvider'

interface Props {
  type: 'Win' | 'Lose'
  name: string
  period: string
  amount: string
  currencyId: CurrencyCode
}
const props = defineProps<Props>()
const emits = defineEmits(['close'])
const { $$t } = useLocale()
const isSelect = ref(false)
let timer: string | number | NodeJS.Timeout | undefined
function handleClick() {
  isSelect.value = !isSelect.value
  if (isSelect.value) {
    timer = setTimeout(() => {
      isSelect.value = false
      emits('close')
    }, 3000)
  }
  else {
    clearTimeout(timer)
  }
}
</script>

<template>
  <div>
    <div v-bg-image="`/lottery/png/lottery-${type.toLowerCase()}.png`" class="win-lose-dialog relative">
      <h1 class="text-center text-[24rem] leading-[29rem] font-[700] text-white pt-[125rem]">
        {{ type === 'Win' ? 'Congratulations' : 'Sorry' }}
      </h1>
      <h2 class="h-[70rem] center">
        <slot>组件</slot>
      </h2>
      <h3 class="pt-[20rem]">
        <template v-if="type === 'Win'">
          <div class="text-center text-[#F54A32] font-[700] text-[13rem] leading-[15rem]">
            {{ $$t('奖金') }}
          </div>
          <div class="text-center text-[20rem] text-[#F54A32] leading-[24rem] font-[700] mb-[10rem] mt-[4rem]">
            {{ `${getCurrencyConfig(currencyId).prefix} ${amount}` }}
          </div>
        </template>
        <template v-else>
          <div class="text-[#587BA4] font-[700] text-[24rem] leading-[29rem] text-center mt-[11rem] mb-[13.5rem]">
            Lose
          </div>
        </template>
        <div class="text-center font-[500] text-[11rem] leading-[14rem] text-[#6B6B6B]">
          <span>{{ $$t('期号') }}:</span><span>{{ name }}</span><span>&nbsp;{{ period }}</span>
        </div>
      </h3>
      <div class=" absolute bottom-[28rem] flex left-[28rem] text-white">
        <div class="size-[21rem] mr-[7rem] center border-[1rem] border-white rounded-[100rem] bg-[rgba(255,255,255,.26)]" @click="handleClick">
          <IconLotterySelected v-if="isSelect" class="text-white text-[12rem]" />
        </div>
        <div>{{ $$t('3秒后自动关闭') }}</div>
      </div>
    </div>
    <div class="center mt-[12rem] ">
      <div class="border-[2rem] rounded-[100rem] center size-[30rem] border-white" @click="emits('close')">
        <IconLotteryDialogClose class="text-white text-[14rem]" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.win-lose-dialog {
  width: 290rem;
  height: 410rem;
  background-size: 100% 100%;
  background-position: 50%;
  background-repeat: no-repeat;
  flex-shrink: 0;
}
</style>

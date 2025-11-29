<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { AfunBaseAmount } from '@tg/bccomponents'
import { getCurrencyConfig, toFixed } from '@tg/utils'
import { useI18n } from 'vue-i18n'

defineOptions({
  name: 'AppMiniGamePartBaseData',
})
defineProps<Props>()

interface Props {
  currencyId: CurrencyCode
  betAmount: string
  multiplier: string
  settleAmount: string
}
const { t } = useI18n()
</script>

<template>
  <div class="w-full">
    <div class="bg-[#0f212e] w-full flex flex-col rounded-[4px] p-[14px]">
      <div class="text-tg-text-lightgrey flex flex-col items-center p-[7px] text-[14px] font-semibold">
        <label class="text-[#b1bad3]">{{ t('投注') }}</label>
        <span class="text-[#fff] flex items-center justify-end text-[14px]">
          <AfunBaseAmount style="color:#fff" :amount="betAmount" :currency-type="getCurrencyConfig(currencyId)?.name" />
        </span>
      </div>
      <div class="text-tg-text-lightgrey relative flex flex-col items-center p-[7px] text-[14px] font-semibold">
        <div
          class="xm:block bg-[#213743]absolute right-[100%] top-[50%] hidden h-[80%] w-2 translate-y-[-50%]"
        />
        <label class="text-[#b1bad3]">{{ t('乘数') }}</label>
        <span class="text-[#fff] flex items-center justify-end text-[14px]">
          {{ multiplier ? `${toFixed(Number.parseFloat(multiplier))}×` : '-' }}
        </span>
      </div>
      <div class="text-tg-text-lightgrey relative flex flex-col items-center p-[7px] text-[14px] font-semibold">
        <div
          class="xm:block bg-[#213743]absolute right-[100%] top-[50%] hidden h-[80%] w-2 translate-y-[-50%]"
        />
        <label class="text-[#b1bad3]">{{ t('支付额') }}</label>
        <span
          class="flex items-center justify-end text-[14px]"
        >
          <AfunBaseAmount :amount="settleAmount" :currency-type="getCurrencyConfig(currencyId)?.name" show-color />
        </span>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --bet-res-amount-color: #24ee89;
}

[theme='green'] {
  --bet-res-amount-color: var(--tg-text-yellow-light);
}
[theme='greenblack'] {
  --bet-res-amount-color: var(--afun-table-amount-color);
}
</style>

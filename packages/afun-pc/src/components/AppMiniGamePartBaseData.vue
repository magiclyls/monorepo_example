<script setup lang='ts'>
import type { CurrencyCode } from '~/composables/useCurrencyData'

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
    <div class="theme-bg xm:flex-row xm:grid xm:grid-cols-3 mb-[4px] w-full flex flex-col rounded-[4px] p-[14px]">
      <div class="text-tg-text-lightgrey flex flex-col items-center p-[7px] text-[14px] font-semibold">
        <label class="leading-[1]">{{ t('menu_title_settings_bets') }}</label>
        <span class="xm:mt-[7px] text-tg-text-white flex items-center justify-end text-[14px]">
          <AppAmount style="color:var(--tg-table-amount-color)" :amount="betAmount" :currency-type="getCurrencyConfigByCode(currencyId)?.name" />
        </span>
      </div>
      <div class="text-tg-text-lightgrey relative flex flex-col items-center p-[7px] text-[14px] font-semibold">
        <div
          class="xm:block bg-tg-secondary-grey absolute right-[100%] top-[50%] hidden h-[80%] w-[2px] translate-y-[-50%]"
        />
        <label class="leading-[1]">{{ t('multiple_count') }}</label>
        <span class="text-tg-text-white xm:mt-[7px] flex items-center justify-end text-[14px]">
          {{ multiplier ? `${toFixed(Number.parseFloat(multiplier))}×` : '-' }}
        </span>
      </div>
      <div class="text-tg-text-lightgrey relative flex flex-col items-center p-[7px] text-[14px] font-semibold">
        <div
          class="xm:block bg-tg-secondary-grey absolute right-[100%] top-[50%] hidden h-[80%] w-[2px] translate-y-[-50%]"
        />
        <label class="leading-[1]">{{ t('sports_payment_amount') }}</label>
        <span
          class="xm:mt-[7px] flex items-center justify-end text-[14px]"
          :style="{
            color: +settleAmount >= 0 ? 'var(--bet-res-amount-color)' : inherit,
          }"
        >
          <AppAmount :amount="settleAmount" :currency-type="getCurrencyConfigByCode(currencyId)?.name" show-color />
        </span>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --bet-res-amount-color :var(--tg-text-green);
}

[theme="green"] {
  --bet-res-amount-color : var(--tg-text-yellow-light);
}
[theme="greenblack"] {
  --bet-res-amount-color : var(--tg-table-amount-color);
}
</style>

<style lang="scss" scoped>
.theme-bg{
  background-color: var(--tg-secondary-dark);
  @include webTheme('white'){
    background-color: #fff;
    --tg-app-amount-green-color:#FF9E36;
  }
  @include webTheme('green'){
    background-color: #02432D;
    --tg-table-amount-color:white;
  }
}
</style>

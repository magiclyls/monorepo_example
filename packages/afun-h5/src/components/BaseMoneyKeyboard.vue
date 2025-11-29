<script setup lang='ts'>
import type { CurrencyCode, ISelectOption } from '@tg/types'
import { BaseCurrency } from '@tg/bccomponents'
import { IconCheck2 } from '@tg/icons'
import { getCurrencyConfig, isVirtualCurrency } from '@tg/utils'

interface Props {
  options?: ISelectOption[]
  modelValue?: string
  isBorder?: boolean
  discountInfo?: any
  currency: CurrencyCode
}
defineOptions({
  name: 'BaseMoneyKeyboard',
})
const props = withDefaults(defineProps<Props>(), {
  options: () => [
    { label: '100', value: '100', bonus: '' },
    { label: '500', value: '500', bonus: '' },
    { label: '1000', value: '1000', bonus: '' },
    { label: '5000', value: '5000', bonus: '' },
    { label: '10000', value: '10000', bonus: '' },
    { label: '50000', value: '50000', bonus: '' },
    { label: '100000', value: '100000', bonus: '' },
    { label: '200000', value: '200000', bonus: '' },
  ],
  modelValue: '',
  isBorder: true,
})

const emit = defineEmits(['update:modelValue'])

function handleKey(item: ISelectOption) {
  const val = item.value.toString()
  emit('update:modelValue', val)
}
</script>

<template>
  <div class="base-money-keyboard">
    <div
      v-for="item of options"
      :key="item.label"
      class="item-key center"
      :class="{ active: item.value === modelValue }"
      @click="handleKey(item)"
    >
      <div>
        <div class="center">
          <BaseCurrency
            v-if="!isVirtualCurrency(getCurrencyConfig(currency).name)"
            class="currency-icon mr-[4px] text-[12px] leading-[12px] "
            :currency="getCurrencyConfig(currency).name"
          />
          <!--  <span v-if="!isVirtualCurrency(getCurrencyConfig(currency).name)" class="mr-8 text-[14px] font-[700] italic">{{ getCurrencyConfig(currency).prefix
        }}&nbsp;</span> -->
          <span class="label">{{ item.label }}</span>
        </div>
        <div class="item-svg center absolute bottom-0 right-0 h-[14px] w-[24px] shrink-0">
          <IconCheck2 class="text-[var(--tg-base-icon-color)]" />
        </div>
        <!-- 右上角：优惠信息 -->
        <!-- <div v-if="curDiscountInfo.pname" class="absolute right-0 top-0 h-3.5 inline-flex items-center justify-end gap-2.5 rounded-bl rounded-tr-[2px] px-2" :style="{ backgroundColor: tipLableColor(curDiscountInfo.ptype) }">
          <div class="text-right text-xs font-semibold text-tg-text-white">
            {{ curDiscountInfo.pname }}{{ curDiscountInfo.ptype === 1002 ? `${parseFloat(curDiscountInfo.promo)}%` : '' }}
          </div>
        </div> -->
        <!-- 顯示 bonus -->
        <div v-if="item.bonus" class="w-full bonus pt-4">
          {{ item.bonus }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --base-money-keyboard-border: #2f4553;
  --base-money-keyboard-active-border: #24ee89;
  --base-money-keyboard-bg: #0f212e;
  --base-money-keyboard-active-bg: rgba(0, 231, 1, 0.2);
  --base-money-keyboard-active-svg-bg: #24ee89;
  --base-money-keyboard-bonus-text-green: #24ee89;
}
</style>

<style lang='scss' scoped>
.base-money-keyboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16px;
  .item-key {
    position: relative;
    width: 100%;
    height: 43px;
    border-radius: 4px;
    border: 2px solid var(--base-money-keyboard-border);
    background: var(--base-money-keyboard-bg);
    color: #fff;
    font-size: 16px;
    line-height: 16px;
    font-weight: 700;
    .item-svg {
      display: none;
      border-radius: 8px 0px 2px 0px;
      background: var(--base-money-keyboard-active-svg-bg);
      font-size: 10px;
      --tg-base-icon-color: #05080a;
    }
    &.active {
      border-color: var(--base-money-keyboard-active-border);
      background: var(--base-money-keyboard-active-bg);
      color: #fff;
      .item-svg {
        display: flex;
      }
    }
    .label {
      font-size: 14px;
      font-weight: 700;
      font-family: proxima-nova;
    }
    .bonus {
      font-size: 12px;
      line-height: 12px;
      font-weight: 500;
      color: var(--base-money-keyboard-bonus-text-green);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

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
    { label: '100', value: '100' },
    { label: '500', value: '500' },
    { label: '1000', value: '1000' },
    { label: '5000', value: '5000' },
    { label: '10000', value: '10000' },
    { label: '50000', value: '50000' },
    { label: '100000', value: '100000' },
    { label: '200000', value: '200000' },
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
      class="item-key center flex-col"
      :class="{ active: item.value === modelValue }"
      @click="handleKey(item)"
    >
      <div class="center">
        <BaseCurrency
          v-if="!isVirtualCurrency(getCurrencyConfig(currency).name)"
          class="currency-icon mr-[4rem] text-[12rem] leading-[12rem] "
          :currency="getCurrencyConfig(currency).name"
        />
        <!--  <span v-if="!isVirtualCurrency(getCurrencyConfig(currency).name)" class="mr-4 text-[18rem] font-[700]">{{ getCurrencyConfig(currency).prefix
        }}&nbsp;</span>
 -->
        <span class="label">{{ item.label }}</span>
      </div>
      <div class="item-svg center absolute bottom-0 right-0 h-[14rem] w-[24rem] shrink-0">
        <IconCheck2 class="text-white" />
      </div>
      <!-- 右上角：优惠信息 -->
      <!-- <div v-if="curDiscountInfo.pname" class="absolute right-0 top-0 h-3.5 inline-flex items-center justify-end gap-2.5 rounded-bl rounded-tr-[2px] px-2" :style="{ backgroundColor: tipLableColor(curDiscountInfo.ptype) }">
        <div class="text-right text-xs font-semibold text-tg-text-white">
          {{ curDiscountInfo.pname }}{{ curDiscountInfo.ptype === 1002 ? `${parseFloat(curDiscountInfo.promo)}%` : '' }}
        </div>
      </div> -->
      <div v-if="item.bonus" class="w-full bonus pt-4">
        {{ item.bonus }}
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --base-money-keyboard-border: #ebebeb;
  --base-money-keyboard-active-border: #f23038;
  --base-money-keyboard-bg: none;
  --base-money-keyboard-active-bg: linear-gradient(180deg, #fff3f4 0%, #ffe9ea 69.23%, #ffd9db 100%);
  --base-money-keyboard-active-svg-bg: #f23038;
}
</style>

<style lang='scss' scoped>
.base-money-keyboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 16rem;
  .item-key {
    position: relative;
    width: 100%;
    height: 41rem;
    border-radius: 6rem;
    border: 1px solid var(--base-money-keyboard-border);
    background: var(--base-money-keyboard-bg);
    color: #0d2245;
    font-size: 16rem;
    line-height: 16rem;
    font-weight: 700;

    .item-svg {
      display: none;
      border-radius: 6rem 0px 4rem 0px;
      background: var(--base-money-keyboard-active-svg-bg);
      font-size: 10rem;
      --tg-base-icon-color: white;
    }
    &.active {
      border-color: var(--base-money-keyboard-active-border);
      background: var(--base-money-keyboard-active-bg);
      color: #f23038;

      .item-svg {
        display: flex;
      }
    }
    .bonus {
      font-size: 12rem;
      line-height: 12rem;
      font-weight: 500;
      color: var(--base-money-keyboard-active-border);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

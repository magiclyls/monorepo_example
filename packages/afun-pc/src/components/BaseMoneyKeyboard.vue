<script setup lang='ts'>
import {CurrencyCode} from '@tg/types'
import { application } from '~/utils'
import { getCurrencyConfigByCode } from '~/composables/useCurrencyData'

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
  isShowIcon: false,
  isBorder: true,
})

const emit = defineEmits(['update:modelValue'])

// 优惠信息
const curDiscountInfo = ref(props.discountInfo ?? {})
/* {
  pname: 'Presente',
  promo: '2.5',
  ptype: 1002
} */
// 计算属性，根据 isShowIcon 动态返回样式
const computedStyle = computed(() => {
  const baseStyle = {
    width: '100%',
    height:'100%',
    fontSize: '16px',
    color: 'var(--tg-text-white)',
    fontWeight: '700',
  }
  return baseStyle
})
function handleKey(item: ISelectOption) {
  const val = item.value.toString()
  emit('update:modelValue', val)
}
/** 优惠类型：根据不同颜色区别 */
function tipLableColor(type: number) {
  switch (type) {
    case 1001:
      return '#1375E1'
    case 1002:
      return '#00A200'
    case 1003:
      return '#F30000'
    case 1004:
      return '#D47200'
    default:
      return ''
  }
}

</script>

<template>
  <div class="base-money-keyboard">
    <div v-for="item of options" :key="item.label"
     class="item-key center"
      :class="{ active: item.value === modelValue }">
      <div class="item-button absolute">
        <BaseButton type="text" :style="computedStyle" @click="handleKey(item)">
          <div  class="flex flex-col" >
            <div class="flex"> 
              <BaseCurrency 
              class="mr-4 text-[12px] leading-[12px] text-white" 
              style="--tg-icon-color: #fff;"
              v-if="!application.isVirtualCurrency(getCurrencyConfigByCode(currency).name)" 
              :currency="getCurrencyConfigByCode(currency).name" />
            <!--   <span  class="mr-4 text-[18px] font-[700] italic">{{ getCurrencyConfigByCode(currency).prefix
              }}&nbsp;</span> -->
                <span class="label"> {{ item.label }}</span>
              </div>
            
            <div v-if="item.bonus" class="w-full bonus pt-4">
              {{ item.bonus }}
            </div>
           </div>
        </BaseButton>
      </div>
      <div class="item-svg absolute bottom-0 right-0 h-[14px] w-[24px] shrink-0 rounded-br-[2px] rounded-tl-[6px] flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" style="margin: auto;">
          <path
            d="M9.6192 2.17192L3.88607 7.97427L3.7182 8.13241L3.55032 7.97427L0 4.38102L1.15759 3.20927L3.71792 5.80087L8.46161 1L9.6192 2.17192Z" />
        </svg>
      </div>
      <!-- 右上角：优惠信息 -->
      <!-- <div v-if="curDiscountInfo.pname" class="absolute right-0 top-0 h-[3.5px] inline-flex items-center justify-end gap-[2.5px] rounded-bl rounded-tr-[2px] px-[2px]" :style="{ backgroundColor: tipLableColor(curDiscountInfo.ptype) }">
        <div class="text-right text-xs font-semibold text-tg-text-white">
          {{ curDiscountInfo.pname }}{{ curDiscountInfo.ptype === 1002 ? `${parseFloat(curDiscountInfo.promo)}%` : '' }}
        </div>
      </div> -->
      
    </div>
  </div>
</template>

<style>
:root {
  --base-money-keyboard-border: var(--tg-secondary-main);
  --base-money-keyboard-active-bg: rgba(36, 238, 137, 0.20);
  --base-money-keyboard-active-border: #24EE89;
  --base-money-keyboard-item-svg-bg: var(--tg-sub-blue);
  --base-money-keyboard-bg: #0F212E;
}

[theme="green"] {
  --base-money-keyboard-bg: #02432D;
  --base-money-keyboard-active-bg: none;
  --base-money-keyboard-border: #197b59;
  --base-money-keyboard-active-border: #F6D14A;
  --base-money-keyboard-item-svg-bg: #F6D14A;

}

[theme="greenblack"] {
  --base-money-keyboard-active-bg: rgba(38, 255, 190, 0.20);
}

[theme="white"] {
  --base-money-keyboard-bg: #E8E8E8;
  --base-money-keyboard-border: #BBBBBB;
  --base-money-keyboard-active-bg: #F2CA5C33;
  --base-money-keyboard-active-border: var(--tg-white-primary-active-bg);
  --base-money-keyboard-item-svg-bg: var(--tg-white-primary-active-bg);
}
</style>

<style lang='scss' scoped>
.base-money-keyboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 12px;

  .item-key {
    position: relative;
    width: 100%;
    height: 60px;
    border-radius: var(--tg-radius-default);
    border: 2px solid var(--base-money-keyboard-border);
    background: var(--base-money-keyboard-bg);

    // box-shadow: var(--tg-box-shadow);
    .item-button {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      .bonus {
        font-size: 12px;
        line-height: 12px;
        font-weight: 500;
        color: var(--base-money-keyboard-active-border);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .item-svg {
      display: none;
      background-color: #24EE89;

      svg {
        fill: #000;

        @include webTheme('greenblack') {
          fill: var(--tg-text-black)
        }

        @include webTheme('white') {
          fill: var(--tg-text-black)
        }
      }
    }

    &.active {
      border-color: var(--tg-text-blue);
      border: 2px solid var(--base-money-keyboard-active-border);
      background: var(--base-money-keyboard-active-bg);

      .item-svg {
        display: flex;
      }
    }
  }


}
</style>

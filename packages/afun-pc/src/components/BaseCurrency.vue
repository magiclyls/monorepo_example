<script lang="ts" setup>
import type { EnumCurrencyKey } from '@tg/types'
import {
  IconCurrencyBrl,
  IconCurrencyCny,
  IconCurrencyInr,
  IconCurrencyJpy,
  IconCurrencyKrw,
  IconCurrencyMyr,
  IconCurrencyPhp,
  IconCurrencyThb,
  IconCurrencyUsd,
  IconCurrencyVnd,
} from '@tg/icons'

interface Props {
  currency: EnumCurrencyKey // 暂时只支持10种法币，需要额外的需要加图标
}
defineOptions({
  name: 'BaseCurrency',
})
const props = withDefaults(defineProps<Props>(), {
})

const currencyIcons = {
  BRL: { icon: IconCurrencyBrl, width: 18, height: 12 },
  CNY: { icon: IconCurrencyCny, width: 12, height: 12 },
  INR: { icon: IconCurrencyInr, width: 9, height: 12 },
  JPY: { icon: IconCurrencyJpy, width: 12, height: 12 },
  KRW: { icon: IconCurrencyKrw, width: 13, height: 12 },
  MYR: { icon: IconCurrencyMyr, width: 28, height: 12 },
  PHP: { icon: IconCurrencyPhp, width: 13, height: 12 },
  THB: { icon: IconCurrencyThb, width: 9, height: 12 },
  USD: { icon: IconCurrencyUsd, width: 10, height: 12 },
  VND: { icon: IconCurrencyVnd, width: 10, height: 12 },
}
const currencyComponent = computed(() => {
  return currencyIcons[props.currency] || IconCurrencyUsd// 默认回退到美元图标
})
const iconStyle = computed(() => {
  const { width, height } = currencyComponent.value
  const widthEm = width / height // 根据宽高比计算宽度
  return {
    width: `${widthEm}em`,
    height: '1em',
  }
})
</script>

<template>
  <div class="basecurrency center">
    <component :is="currencyComponent.icon" :style="iconStyle" />
  </div>
</template>

<style lang="scss" scoped>
/*字体设置为高度*/
.basecurrency {
  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}
</style>
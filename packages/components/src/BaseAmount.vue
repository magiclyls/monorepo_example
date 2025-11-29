<script lang="ts" setup>
import type { EnumCurrencyKey } from '@tg/types'
import { isVirtualCurrency } from '@tg/utils'
import { computed } from 'vue'
import BaseCurrencyIcon from './BaseCurrencyIcon.vue'

interface Props {
  cur: EnumCurrencyKey
  amount: number | string
  color?: string
  /** 加密货币是否要单位 */
  withCryptoUnit?: boolean
  /** 货币图标位置 */
  iconPosition?: 'front' | 'back'
  /** 是否展示图标 */
  icon?: boolean
}

defineOptions({
  name: 'BaseTabs',
})

const props = withDefaults(defineProps<Props>(), {
  withCryptoUnit: true,
  iconPosition: 'back',
  icon: true,
})

const isCrypto = isVirtualCurrency(props.cur)

const isShowUnit = !isCrypto || (props.withCryptoUnit && isCrypto)

const ComputedTextStyle = computed(() => {
  return { color: props.color, fontSize: 'var(--tg-base-amount-fontSize)' }
})
const ComputedImageStyle = computed(() => {
  return {
    order: props.iconPosition === 'front' ? '-1' : '0',
    margin: props.iconPosition === 'front' ? `0 var(--tg-base-amount-margin) 0 0` : `0 0 0 var(--tg-base-amount-margin)`,
    width: 'var(--tg-base-amount-width)',
    height: 'var(--tg-base-amount-width)',
  }
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="flex items-center ">
      <span class="text-primary font-extrabold" :style="ComputedTextStyle">
        <span v-if="isShowUnit && !isCrypto">{{ cur }}&nbsp;</span>
        <span>{{ amount }}</span>
        <span v-if="isShowUnit && isCrypto">&nbsp;{{ cur }}</span>
      </span>
    </div>
    <div
      v-if="icon"
      class="inline-flex shrink-0 items-center justify-center rounded-full"
      :style="ComputedImageStyle"
    >
      <BaseCurrencyIcon :cur="cur" style="--tg-base-currency-icon-width:--tg-base-amount-width;" />
    </div>
  </div>
</template>

<style>
:root {
  --tg-base-amount-fontSize: 0.875rem;
  --tg-base-amount-width: 0.875rem;
  --tg-base-amount-margin: 0.25rem;
}
</style>

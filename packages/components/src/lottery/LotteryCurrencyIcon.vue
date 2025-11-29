<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { currencyMap } from '@tg/utils'
import { computed } from 'vue'
import LotteryImage from './LotteryImage.vue'

interface Props {
  currencyType: EnumCurrencyKey
  showName?: boolean
  iconAlign?: 'left' | 'right'
}
defineOptions({
  name: 'LotteryCurrencyIcon',
})
const props = defineProps<Props>()

const getIsRight = computed(() => props.iconAlign === 'right')

const iconUrl = computed(() => {
  return `/currency/${currencyMap[props.currencyType]?.cur}.webp`
})
</script>

<template>
  <div class="app-currency-icon">
    <div v-if="!getIsRight" class="icon" :title="currencyType">
      <LotteryImage :url="iconUrl" is-cloud />
    </div>
    <span
      v-if="showName"
      class="name"
      :style="`margin-${getIsRight ? 'right' : 'left'}: 4rem;`"
    >{{ currencyType === 'VND' ? 'KVND' : currencyType }}</span>
    <slot name="network" />
    <div v-if="getIsRight" class="icon" :title="currencyType">
      <LotteryImage :url="iconUrl" is-cloud />
    </div>
  </div>
</template>

<style lang="scss">
  :root {
  --Lottery-app-currency-icon-style-color: inherit;
  --Lottery-app-currency-icon-style-margin: 0;
  --Lottery-app-currency-icon-size: 14rem;
  --Lottery-app-currency-display: flex;
  --Lottery-app-currency-name-weight: 500;
}
</style>

<style lang='scss' scoped>
.app-currency-icon {
  font-size: inherit;
  color: var(--Lottery-app-currency-icon-style-color);
  display: var(--Lottery-app-currency-display);
  align-items: center;
  margin: var(--Lottery-app-currency-icon-style-margin);

  .icon {
    width: var(--Lottery-app-currency-icon-size);
    height: var(--Lottery-app-currency-icon-size);
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    font-weight: var(--Lottery-app-currency-name-weight);
  }
}
</style>

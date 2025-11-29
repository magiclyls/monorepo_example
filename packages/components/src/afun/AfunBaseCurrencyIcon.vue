<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { currencyMap } from '@tg/utils'
import { computed } from 'vue'
import BaseImage from '../BaseImage.vue'

interface Props {
  currencyType: EnumCurrencyKey
  showName?: boolean
  iconAlign?: 'left' | 'right'
}
defineOptions({
  name: 'AfunBaseCurrencyIcon',
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
      <BaseImage :url="iconUrl" is-cloud :is-show-error-img="false" />
    </div>
    <span
      v-if="showName"
      class="name"
      :style="`margin-${getIsRight ? 'right' : 'left'}: 4px;`"
    >{{ currencyType === 'VND' ? 'KVND' : currencyType }}</span>
    <slot name="network" />
    <div v-if="getIsRight" class="icon" :title="currencyType">
      <BaseImage :url="iconUrl" is-cloud :is-show-error-img="false" />
    </div>
  </div>
</template>

<style lang="scss">
  :root {
  --afun-app-currency-icon-style-color: inherit;
  --afun-app-currency-icon-style-margin: 0;
  --afun-app-currency-icon-size: 14px;
  --afun-app-currency-display: flex;
  --afun-app-currency-name-weight: 600;
}
</style>

<style lang='scss' scoped>
.app-currency-icon {
  font-size: inherit;
  color: var(--afun-app-currency-icon-style-color);
  display: var(--afun-app-currency-display);
  align-items: center;
  margin: var(--afun-app-currency-icon-style-margin);

  .icon {
    width: var(--afun-app-currency-icon-size);
    height: var(--afun-app-currency-icon-size);
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    font-weight: var(--afun-app-currency-name-weight);
  }
}
</style>

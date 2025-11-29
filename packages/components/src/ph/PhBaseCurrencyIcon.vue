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
  name: 'PhBaseCurrencyIcon',
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
      :style="`margin-${getIsRight ? 'right' : 'left'}: 4rem;`"
    >{{ currencyType === 'VND' ? 'KVND' : currencyType }}</span>
    <slot name="network" />
    <div v-if="getIsRight" class="icon" :title="currencyType">
      <BaseImage :url="iconUrl" is-cloud :is-show-error-img="false" />
    </div>
  </div>
</template>

<style lang="scss">
  :root {
  --ph-app-currency-icon-style-color: inherit;
  --ph-app-currency-icon-style-margin: 0;
  --ph-app-currency-icon-size: 14rem;
  --ph-app-currency-display: flex;
  --ph-app-currency-name-weight: 500;
}
</style>

<style lang='scss' scoped>
.app-currency-icon {
  font-size: inherit;
  color: var(--ph-app-currency-icon-style-color);
  display: var(--ph-app-currency-display);
  align-items: center;
  margin: var(--ph-app-currency-icon-style-margin);

  .icon {
    width: var(--ph-app-currency-icon-size);
    height: var(--ph-app-currency-icon-size);
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    font-weight: var(--ph-app-currency-name-weight);
  }
}
</style>

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
  name: 'SSBaseCurrencyIcon',
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
      <BaseImage :url="iconUrl" is-cloud />
    </div>
    <span
      v-if="showName"
      class="name"
      :style="`margin-${getIsRight ? 'right' : 'left'}: 4rem;`"
    >{{ currencyType === 'VND' ? 'KVND' : currencyType }}</span>
    <slot name="network" />
    <div v-if="getIsRight" class="icon" :title="currencyType">
      <BaseImage :url="iconUrl" is-cloud />
    </div>
  </div>
</template>

<style lang="scss">
  :root {
  --ss-app-currency-icon-style-color: inherit;
  --ss-app-currency-icon-style-margin: 0;
  --ss-app-currency-icon-size: 14rem;
  --ss-app-currency-display: flex;
  --ss-app-currency-name-weight: 500;
}
</style>

<style lang='scss' scoped>
.app-currency-icon {
  font-size: inherit;
  color: var(--ss-app-currency-icon-style-color);
  display: var(--ss-app-currency-display);
  align-items: center;
  margin: var(--ss-app-currency-icon-style-margin);

  .icon {
    width: var(--ss-app-currency-icon-size);
    height: var(--ss-app-currency-icon-size);
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    font-weight: var(--ss-app-currency-name-weight);
  }
}
</style>

<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { currencyConfig } from '~/composables/useCurrencyData'

interface Props {
  currencyType: EnumCurrencyKey
  showName?: boolean
  iconAlign?: 'left' | 'right'
}
defineOptions({
  name: 'AppCurrencyIconV2',
})
const props = defineProps<Props>()
const { t } = useI18n()

const getIsRight = computed(() => props.iconAlign === 'right')

const iconUrl = computed(() => {
  return `/currency/${currencyConfig[props.currencyType]?.cur}.webp`
})
</script>

<template>
  <div class="flex flex-col items-start justify-start gap-[20px]">
    <BaseLabel :label="t('currency')" class="justify-self-start">
      <div class="app-currency-icon">
        <div v-if="!getIsRight" class="icon rounded-l-[4px]" :title="currencyType">
          <BaseImage :url="iconUrl" is-cloud />
        </div>
        <span
          v-if="showName"
          class="name rounded-r-[4px] font-bold"
          :style="`margin-${getIsRight ? 'right' : 'left'}: 0;`"
        >{{ currencyType }}</span>
        <div v-if="getIsRight" class="icon" :title="currencyType">
          <BaseImage :url="iconUrl" is-cloud />
        </div>
      </div>
    </BaseLabel>
    <BaseLabel :label="t('network')" class="justify-self-end">
      <div class="app-currency-icon font-bold">
        <slot name="network" />
        <div v-if="getIsRight" class="icon" :title="currencyType">
          <BaseImage :url="iconUrl" is-cloud />
        </div>
      </div>
    </BaseLabel>
  </div>
</template>

<style lang="scss">
  :root{
    --tg-app-currency-icon-style-color: inherit;
    --tg-app-currency-icon-style-margin:0;
    --tg-app-currency-icon-size: var(--tg-font-size-default);
    --tg-app-currency-display:flex;
  }
</style>

<style lang='scss' scoped>
.app-currency-icon {
  font-size: inherit;
  color: --tg-app-currency-icon-style-color;
  display: var(--tg-app-currency-display);
  align-items: center;
  margin: --tg-app-currency-icon-style-margin;

  .icon {
    width: 23px;
    background-color: #0F212E;
    padding: 12px 0 13px 8px;
    @include webTheme('white'){
      background-color:#FFFFFF;
    }
    @include webTheme('green'){
      background-color:#02432D;
    }
  }

  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-transform: uppercase;
    background-color: #0F212E;
    padding: 13px 8px 13px 5px;
    @include webTheme('white'){
      background-color:#FFFFFF;
    }
    @include webTheme('green'){
      background-color:#02432D;
    }
  }
  .iconv2 {
    padding:13px 0 8px;
    width: 40px;
    height: 22px;
  }
}
</style>

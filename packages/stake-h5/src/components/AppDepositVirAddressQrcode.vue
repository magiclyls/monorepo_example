<script lang="ts" setup>
import type { virAddreesQrcode } from '@tg/types'
import { IconUniWarningColor } from '@tg/icons'

interface Props {
  data: virAddreesQrcode
  disabled: boolean
  loading: boolean
}
defineOptions({
  name: 'AppDepositVirAddressQrcode',
})
withDefaults(defineProps<Props>(), {
  disabled: false,
})
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-[10px]">
    <div>
      <p class="second-title font-semibold">
        {{ t('deposit_address') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
      </p>
      <p class="copy-row address-copy">
        <BaseSkeleton
          v-if="loading"
          bg="#B1BAD3"
          height="18px"
          width="80%"
          animated="ani-opacity"
        />
        <span v-else class="word-wrap mr-[10px] overflow-hidden py-[2px]">{{ data.virDepositAddrees }}</span>
        <AppTooltip :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" @click="application.copy(data.virDepositAddrees ?? '')" />
      </p>
      <div v-if="Number(data.virDepositMin) > 0 || Number(data.virDepositRatio) > 0" class="mt-[10px] flex gap-[5px]">
        <IconUniWarningColor style="font-size: var(--tg-font-size-base);" />
        <div class="flex text-xs font-semibold text-[var(--app-deposit-vir-address-qrcode-text-color)]">
          <i18n-t v-if="Number(data.virDepositMin) > 0" keypath="vir_deposit_addrees" tag="span">
            <span class="theme-text text-tg-text-white pr-[3px]">{{ data.virDepositMin }}{{ data.currency }}</span>
          </i18n-t>
          <i18n-t v-if="Number(data.virDepositRatio) > 0" keypath="vir_deposit_remark" tag="span">
            <span class="theme-text text-white">{{ (Number(data.virDepositRatio) * 100).toFixed(2) }}%</span>
          </i18n-t>
        </div>
      </div>
    </div>
    <div v-if="loading" class="wrap h-[176px] w-[176px]">
      <BaseSkeleton
        bg="#B1BAD3"
        height="176px"
        width="100%"
        animated="ani-opacity"
      />
    </div>
    <BaseQrcode v-else-if="data.virDepositAddrees" :url="data.virDepositAddrees" :size="160" />
    <div v-else class="wrap h-[176px] w-[176px]">
      <BaseSkeleton
        bg="#B1BAD3"
        height="176px"
        width="100%"
        animated="ani-opacity"
      />
    </div>
    <!-- <BaseQrcode v-else :url="data.virDepositAddrees" :size="160" /> -->
    <div class="mt-[6px] text-center text-xs font-medium text-[var(--app-deposit-vir-address-qrcode-text-color)]">
      {{ t('vir_deposit_addrees_confirm', { currency: data.currency }) }}
    </div>
  </div>
</template>

<style>
:root {
  --app-deposit-vir-address-qrcode-text-color: #cbd5e1;
}

[theme="white"] {
  --app-deposit-vir-address-qrcode-text-color: #999999;
  --tg-copy-row-border-color:#484848;
}
[theme="green"] {
  --app-deposit-vir-address-qrcode-text-color: #42BC91;
}
</style>

<style lang="scss" scoped>
.theme-text{
  @include webTheme('green'){
    color: #FFAA09;
  }
  @include webTheme('white'){
    color: #E77C19
  }
}
.second-title {
  margin-bottom: var(--tg-spacing-4);
  color: var(--tg-text-lightgrey);
}
.pay-theme {
  .theme-text{
    @include webTheme('green'){
      color: #ffffff;
    }
  }
}
.copy-row {
  max-width: 100%;
  border-radius: var(--tg-radius-default);
  border: 1px solid var(--tg-secondary-main);
  padding: var(--tg-spacing-10) var(--tg-spacing-12);
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--tg-text-white);
  cursor: pointer;
  font-weight: 600;
  background-color:  var(--tg-secondary-main);
  @include webTheme('green'){
    background-color: transparent;
    --tg-icon-color: #FFFFFF;
  }
  @include webTheme('white'){
    border: 1px solid var(--tg-copy-row-border-color);
  }
}
.copy-row span {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.05em;
}
.word-wrap {
  word-wrap:break-word;
}
.wrap {
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--tg-radius-default);
  box-shadow: var(--tg-header-shadow);
}
.address-copy{
  @include webTheme('green'){
    background-color:var(--tg-secondary-deepdark);
    --tg-icon-color:var(--tg-svg-default-color);
  }
}
</style>

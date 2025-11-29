<script lang="ts" setup>
import type { virAddreesQrcode } from '@tg/types'
import { AfunBaseImage, AfunBaseLabel, BaseQrcode } from '@tg/bccomponents'
import { copy } from 'clipboard'
import AppTooltip from '~/components/AppTooltip.vue'

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
</script>

<template>
  <div class="flex flex-col gap-[10px]">
    <AfunBaseLabel required :label="$t('存款地址')">
      <div class="copy-row">
        <div class="label break-all mr-[20px] overflow-hidden">
          {{ data.virDepositAddrees }}
        </div>
        <AppTooltip :text="$t('已成功复制')" @click="copy(data.virDepositAddrees ?? '')" />
      </div>
    </AfunBaseLabel>
    <div v-if="Number(data.virDepositMin) > 0 || Number(data.virDepositRatio) > 0" class="flex items-center gap-[4px]">
      <AfunBaseImage class="h-[20px] p-[3px]" url="/m/afun-h5/png/gift.png" />
      <div class="text-[12px] font-[600] text-[#B1BAD3]">
        <i18n-t v-if="Number(data.virDepositMin) > 0" keypath="最低存款" tag="span">
          <span class="text-[#fff] ">{{ data.virDepositMin }}{{ data.currency }}</span>
        </i18n-t>
        <span v-if="Number(data.virDepositMin) > 0 && Number(data.virDepositRatio) > 0" class="split"> ，</span>
        <i18n-t v-if="Number(data.virDepositRatio) > 0" keypath="额外奖金" tag="span">
          <span class="text-[#fff]">{{ (Number(data.virDepositRatio) * 100).toFixed(2) }}%</span>
        </i18n-t>
      </div>
    </div>
    <div class="center">
      <BaseQrcode v-if="data.virDepositAddrees" :value="data.virDepositAddrees" class="p-[10px] rounded-[4px] border-solid border border-[#EBEBEB] bg-[#fff]" :size="140" />
    </div>
    <div class="text-center text-[12px] font-[400] text-[#B1BAD3] pt-[6px]">
      {{ $t('二维码提示', { currency: data.currency }) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.copy-row {
  max-width: 100%;
  border-radius: 4px;
  background-color: #2f4553;
  padding: 7px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  .label {
    line-height: 1.05em;
  }
}
</style>

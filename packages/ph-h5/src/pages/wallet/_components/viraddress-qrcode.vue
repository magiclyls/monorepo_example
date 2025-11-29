<script lang="ts" setup>
import type { virAddreesQrcode } from '@tg/types'
import { BaseQrcode, PhBaseImage, PhBaseLabel } from '@tg/bccomponents'
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
  <div class="flex flex-col gap-[10rem]">
    <PhBaseLabel required :label="$t('存款地址')">
      <div class="copy-row">
        <div class="label break-all mr-[20rem] overflow-hidden">
          {{ data.virDepositAddrees }}
        </div>
        <AppTooltip :text="$t('已成功复制')" @click="copy(data.virDepositAddrees ?? '')" />
      </div>
    </PhBaseLabel>
    <div v-if="Number(data.virDepositMin) > 0 || Number(data.virDepositRatio) > 0" class="flex items-center py-[4rem] px-[6rem] gap-[4rem] bg-[#F2303814] rounded-[6rem]">
      <PhBaseImage class="h-[20rem] p-[3rem]" url="/ph-h5/png/gift.png" />
      <div class="text-[12rem] font-[500] text-[#6D7693]">
        <i18n-t v-if="Number(data.virDepositMin) > 0" keypath="最低存款" tag="span">
          <span class="text-[#F23038] ">{{ data.virDepositMin }}{{ data.currency }}</span>
        </i18n-t>
        <span v-if="Number(data.virDepositMin) > 0 && Number(data.virDepositRatio) > 0" class="split"> ，</span>
        <i18n-t v-if="Number(data.virDepositRatio) > 0" keypath="额外奖金" tag="span">
          <span class="text-[#F23038]">{{ (Number(data.virDepositRatio) * 100).toFixed(2) }}%</span>
        </i18n-t>
      </div>
    </div>
    <div class="center">
      <BaseQrcode v-if="data.virDepositAddrees" :value="data.virDepositAddrees" class="p-[10rem] rounded-[4rem] border-solid border border-[#EBEBEB]" :size="140" />
    </div>
    <div class="text-center text-[12rem] font-[400] text-[#6D7693]">
      {{ $t('二维码提示', { currency: data.currency }) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.copy-row {
  max-width: 100%;
  border-radius: 6rem;
  background-color: #f6f7f8;
  padding: 7rem 10rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #0d2245;
  cursor: pointer;
  font-weight: 500;
  .label {
    line-height: 1.05em;
  }
}
</style>

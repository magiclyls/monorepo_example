<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { IconUniArrowRight } from '@tg/icons'
import MerchantIcon from './merchant-icon.vue'

interface Props {
  currencyType?: 'wallet' | 'fiat' | 'virtual' // 钱包，法币，虚拟币--对应图标地址拼接不同
  list?: any
  currency: {
    currency_id: CurrencyCode
    currency_name: EnumCurrencyKey
  }
}
const props = withDefaults(defineProps<Props>(), {
  currencyType: 'wallet',
})
const emit = defineEmits(['itemclick'])

function tipLableColor(type: number) {
  switch (type) {
    case 1001:
      return '#025BE8'
    case 1002:
      return '#00A201'
    case 1003:
      return '#F40000'
    case 1004:
      return '#D57300'
    default:
      return ''
  }
}
</script>

<template>
  <div class="flex flex-col gap-[12px]">
    <div
      v-for="item in list.merchants" :key="item.id"
      class="relative w-full flex items-center pr-[5px] h-[52px] cursor-pointer break-all rounded-[4px] bg-[#2F4553] text-[12px] font-[600]"
      @click="emit('itemclick', { item, list })"
    >
      <div class="flex-1 flex items-center  gap-[4px]">
        <div class="bg-[#213744] rounded-l-[4px] h-[52px] w-[60px] flex items-center justify-center ">
          <MerchantIcon :currency-type="currencyType" :type="list.payment_type" :item="item" />
        </div>
        <div class="text-[#fff] font-[600] flex-1 ">
          {{ item.name }}
        </div>
      </div>
      <div class="w-[140px] h-[24px] flex items-center justify-end gap-[4px]">
        <div class="text-[#B1BAD3] whitespace-nowrap ">
          {{ item.amount_min }}-{{ item.amount_max }} {{ currency.currency_name }}
        </div>
        <IconUniArrowRight class="text-[14px] text-[#B1BAD3]" />
      </div>
      <div v-if="list.pname" class="absolute right-0 top-0 h-[14px] leading-[14px] px-[10px]  rounded-bl-[4px] rounded-tr-[4px] font-[600] text-white" :style="{ backgroundColor: tipLableColor(list.ptype) }">
        {{ list.pname }}{{ list.ptype === 1002 ? `${list.promo}%` : '' }}
      </div>
    </div>
  </div>
</template>

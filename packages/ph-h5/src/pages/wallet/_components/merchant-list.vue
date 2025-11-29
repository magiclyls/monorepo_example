<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { IconUniArrowDown1 } from '@tg/icons'
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
      return '#2BA471'
    case 1003:
      return '#F23038'
    case 1004:
      return '#F88D22'
    default:
      return ''
  }
}
</script>

<template>
  <div class="flex flex-col gap-[12rem]">
    <div
      v-for="item in list.merchants" :key="item.id"
      class="relative w-full flex items-center pr-[5rem] h-[50rem] cursor-pointer break-all rounded-[4rem] bg-[#F6F7F8] text-[12rem] font-[400]"
      @click="emit('itemclick', { item, list })"
    >
      <div class="flex-1 flex items-center  gap-[4rem]">
        <div class="bg-[#EBEBEB] rounded-l-[4rem] h-[50rem] w-[60rem] flex items-center justify-center ">
          <MerchantIcon :currency-type="currencyType" :type="list.payment_type" :item="item" />
        </div>
        <div class="text-[#0D2245] font-[500] flex-1 ">
          {{ item.name }}
        </div>
      </div>
      <div class="w-[140rem] h-[24rem] flex items-center justify-end gap-[4rem]">
        <div class="text-[#6D7693] whitespace-nowrap ">
          {{ item.amount_min }}-{{ item.amount_max }} {{ currency.currency_name }}
        </div>
        <IconUniArrowDown1 class="text-[14rem] rotate-[-90deg] text-[#9dabc9]" />
      </div>
      <div v-if="list.pname" class="absolute right-0 top-0 h-[14rem] leading-[14rem] px-[10rem]  rounded-bl-[4rem] rounded-tr-[4rem] font-[500] text-white" :style="{ backgroundColor: tipLableColor(list.ptype) }">
        {{ list.pname }}{{ list.ptype === 1002 ? `${list.promo}%` : '' }}
      </div>
    </div>
  </div>
</template>

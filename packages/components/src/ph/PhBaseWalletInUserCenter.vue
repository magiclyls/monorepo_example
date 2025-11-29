<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { IconUniSearch1 } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { getCurrencyConfig, isVirtualCurrency } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, inject, nextTick, ref } from 'vue'
import BaseSwitch from '../bc-game/BaseSwitch.vue'
import PhBaseAmount from './PhBaseAmount.vue'
import PhBaseCurrencyIcon from './PhBaseCurrencyIcon.vue'
import PhBaseInput from './PhBaseInput.vue'

defineOptions({ name: 'AppWalletInUserCenter' })
const props = withDefaults(defineProps<Props>(), {
  showSetting: false,
})

const emit = defineEmits(['choose'])

interface Props {
  showSetting?: boolean
  options?: any
  currency?: CurrencyCode
  t: (key: string, ...args: any[]) => string
}
const closePopup = inject('closePopup', () => { })

const currencyStore = useCurrency()
const { currencyList, currentGlobalCurrencyMap, isHideZeroBalance } = storeToRefs(currencyStore)

const searchValue = ref('')

const _allCurrency = computed(() => {
  const _list = isHideZeroBalance.value ? currencyList.value.filter(a => Number(a.balance) !== 0) : currencyList.value

  return _list
})
const list = computed(() => {
  let _options = props.options?.map((item: any) => {
    return item.type
      ? item
      : {
          ...item,
          type: item.currency_name || item.value,
        }
  }) || []
  _options = isHideZeroBalance.value ? _options.filter((a: any) => Number(a.balance) !== 0) : _options
  const _data = props.options
    ? _options
    : _allCurrency.value

  return _data.filter((a: any) => a.type.toLocaleLowerCase().includes(searchValue.value.toLocaleLowerCase()))
})
const cashList = computed(() => {
  return list.value.filter((item: any) => !isVirtualCurrency(item.type))
})
const virtualList = computed(() => {
  return list.value.filter((item: any) => isVirtualCurrency(item.type))
})

function onItemClick(data: any) {
  // currencyStore.setCurrentGlobalCurrency(data)
  emit('choose', data)
  nextTick(() => {
    closePopup()
  })
}
</script>

<template>
  <div class="relative w-full bg-[#fff] text-[#0D2245] text-[14rem] font-[600] h-[450rem] ">
    <div class="bg-[#fff] px-[10rem] w-full">
      <PhBaseInput
        v-model="searchValue" class="w-full" :placeholder="t('搜索货币')" name="search" search style="--ph-base-input-padding-y:6rem;
        --ph-base-input-style-placeholder-color:#0D2245;
        "
      >
        <template #search-icon>
          <IconUniSearch1 />
        </template>
      </PhBaseInput>
    </div>
    <div class="scroll-y px-[10rem] hide-scroll-bar" style="height: calc(100% - 82rem);">
      <div class="flex w-full flex-col">
        <label v-if="cashList.length > 0" class="px-[8rem] z-1 h-[40rem] flex items-center bg-[#fff] sticky top-[-1px]">{{ t('法币1') }}</label>
        <div
          v-for="item in cashList" :key="item.cur"
          class="flex items-center justify-between px-[8rem] cursor-pointer h-[40rem]"
          :class="{ active: (currency || currentGlobalCurrencyMap.cur) === getCurrencyConfig(item.type).cur }" @click="onItemClick(item)"
        >
          <PhBaseCurrencyIcon :currency-type="item.type" show-name />
          <PhBaseAmount :amount="item.balance" :currency-type="item.type" :show-icon="false" />
        </div>
        <label v-if="virtualList.length > 0" class="px-[8rem] h-[40rem] flex items-center z-2  bg-[#fff] sticky top-[-1px]">{{ t('加密货币') }}</label>
        <div
          v-for="item in virtualList" :key="item.cur"
          class="flex items-center justify-between px-[8rem] cursor-pointer h-[40rem]"
          :class="{ active: (currency || currentGlobalCurrencyMap.cur) === getCurrencyConfig(item.type).cur }" @click="onItemClick(item)"
        >
          <PhBaseCurrencyIcon :currency-type="item.type" show-name />
          <PhBaseAmount :amount="item.balance" :currency-type="item.type" :show-icon="false" />
        </div>
      </div>
    </div>

    <div v-if="showSetting" class=" sticky bottom-0 z-3 h-[48rem] flex items-center  text-[12rem] justify-between bg-[#F6F7F8] px-[8rem]">
      <div class="flex items-center mr-[10rem]">
        <BaseSwitch v-model="isHideZeroBalance" class="mr-[4rem] flex-none" />
        <span>{{ t('隐藏零数余额') }}</span>
      </div>
      <!--  <span class="font-[400] text-[#6D7693] text-ellipsis inline-block max-w-[159rem] whitespace-nowrap overflow-hidden">（{{ t('隐藏零数余额1') }}）</span> -->
    </div>
  </div>
</template>

<style lang='scss' scoped>
.active {
  background: linear-gradient(273deg, #ff131d 3.6%, #ff4d4d 97.54%);
  border-radius: 6rem;
  color: #fff;
}
</style>

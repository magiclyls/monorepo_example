<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { IconUniSearch1 } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { getCurrencyConfig, isVirtualCurrency } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, inject, nextTick, ref } from 'vue'
import AfunBaseAmount from './AfunBaseAmount.vue'
import AfunBaseCurrencyIcon from './AfunBaseCurrencyIcon.vue'
import AfunBaseInput from './AfunBaseInput.vue'
import AfunBaseSwitch from './AfunBaseSwitch.vue'

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
  <div class="relative w-full bg-[#1A2C38] text-[#fff] text-[14px] font-[600] h-[450px] ">
    <div class=" px-[10px] w-full">
      <AfunBaseInput
        v-model="searchValue" class="w-full" :placeholder="t('搜索货币')" name="search" search
        style="--afun-base-input-padding-y:6px;--afun-base-input-style-placeholder-color:#566771;--afun-base-input-background-color: #0F212E;"
      >
        <template #search-icon>
          <IconUniSearch1 />
        </template>
      </AfunBaseInput>
    </div>
    <div class="scroll-y px-[10px] hide-scroll-bar" style="height: calc(100% - 82px);">
      <div class="flex w-full flex-col">
        <label v-if="cashList.length > 0" class="font-[600] px-[8px] z-1 h-[40px] flex items-center sticky text-[#B1BAD3] bg-[#1A2C38] top-[-1px]">{{ t('法币1') }}</label>
        <div
          v-for="item in cashList" :key="item.cur"
          class="flex items-center justify-between px-[8px] cursor-pointer h-[40px]"
          :class="{ active: (currency || currentGlobalCurrencyMap.cur) === getCurrencyConfig(item.type).cur }" @click="onItemClick(item)"
        >
          <AfunBaseCurrencyIcon :currency-type="item.type" show-name />
          <AfunBaseAmount :amount="item.balance" :currency-type="item.type" :show-icon="false" />
        </div>
        <label v-if="virtualList.length > 0" class="font-[600] px-[8px] h-[40px] flex items-center z-2 text-[#B1BAD3] sticky bg-[#1A2C38] top-[-1px]">{{ t('加密货币') }}</label>
        <div
          v-for="item in virtualList" :key="item.cur"
          class="flex items-center justify-between px-[8px] cursor-pointer h-[40px]"
          :class="{ active: (currency || currentGlobalCurrencyMap.cur) === getCurrencyConfig(item.type).cur }" @click="onItemClick(item)"
        >
          <AfunBaseCurrencyIcon :currency-type="item.type" show-name />
          <AfunBaseAmount :amount="item.balance" :currency-type="item.type" :show-icon="false" />
        </div>
      </div>
    </div>

    <div v-if="showSetting" class=" sticky bottom-0 z-3 h-[48px] flex items-center  text-[12px] justify-between bg-[#0F212E] px-[8px]">
      <div class="flex items-center mr-[10px]">
        <AfunBaseSwitch v-model="isHideZeroBalance" class="mr-[4px] flex-none" />
        <span>{{ t('隐藏零数余额') }}</span>
      </div>
      <!--  <span class="font-[400] text-[#6D7693] text-ellipsis inline-block max-w-[159px] whitespace-nowrap overflow-hidden">（{{ t('隐藏零数余额1') }}）</span> -->
    </div>
  </div>
</template>

<style lang='scss' scoped>
.active {
  background: linear-gradient(90deg, #24ee89 0%, #9fe871 100%);
  border-radius: 4px;
  color: #000;
}
</style>

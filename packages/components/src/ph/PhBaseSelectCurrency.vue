<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { useBoolean } from '@tg/hooks'
import { IconPhClose } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import PhBasePopup from './PhBasePopup.vue'
import PhWalletInUserCenter from './PhBaseWalletInUserCenter.vue'

const props = withDefaults(defineProps<Props>(), {
  showSetting: true,
})

const emit = defineEmits(['choose'])

interface Props {
  showSetting?: boolean
  options?: any
  currency?: CurrencyCode
  t: (key: string, ...args: any[]) => string
}

const { bool: showWalletPopup } = useBoolean(false)
const currencyStore = useCurrency()
const { currencyList } = storeToRefs(currencyStore)

const diabled = computed(() => {
  const _list = props.options ? props.options : currencyList.value
  return _list.length < 2
})
function show() {
  if (diabled.value)
    return
  showWalletPopup.value = true
}
</script>

<template>
  <div class="">
    <div @click="show">
      <slot :is-menu-shown="showWalletPopup" />
    </div>
    <PhBasePopup v-model="showWalletPopup">
      <template #default="{ close }">
        <div class="bg-[#fff] rounded-tl-[8rem] rounded-tr-[8rem]">
          <div class="center relative  pt-[12rem] rounded-tl-[8rem] rounded-tr-[8rem] text-[#0D2245] pb-[10rem] font-semibold">
            {{ t('账户余额') }}
            <div class="absolute top-[50%] -translate-y-1/2 right-[12rem] cursor-pointer" @click="close">
              <IconPhClose class="text-[16rem] text-[#9dabc8]" />
            </div>
          </div>
          <PhWalletInUserCenter :t="t" :options="options" :show-setting="showSetting" :currency="currency" @choose="(data) => emit('choose', data)" />
        </div>
      </template>
    </PhBasePopup>
  </div>
</template>

<style lang='scss' scoped>

</style>

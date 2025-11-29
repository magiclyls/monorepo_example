<script setup lang='ts'>
import type { CurrencyCode } from '@tg/types'
import { useBoolean } from '@tg/hooks'
import { IconPhClose } from '@tg/icons'
import AfunBasePopup from './AfunBasePopup.vue'
import AfunBaseWalletInUserCenter from './AfunBaseWalletInUserCenter.vue'

withDefaults(defineProps<Props>(), {
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
</script>

<template>
  <div class="">
    <div @click="showWalletPopup = true">
      <slot :is-menu-shown="showWalletPopup" />
    </div>
    <AfunBasePopup v-model="showWalletPopup">
      <template #default="{ close }">
        <div class="bg-[#1A2C38] rounded-tl-[8px] rounded-tr-[8px]">
          <div class="center relative  pt-[12px] rounded-tl-[8px] rounded-tr-[8px] text-[#fff] pb-[10px] font-semibold">
            {{ t('账户余额') }}
            <div class="absolute top-[50%] -translate-y-1/2 right-[12px] cursor-pointer" @click="close">
              <IconPhClose class="text-[16px] text-[#9dabc8]" />
            </div>
          </div>
          <AfunBaseWalletInUserCenter :t="t" :options="options" :show-setting="showSetting" :currency="currency" @choose="(data) => emit('choose', data)" />
        </div>
      </template>
    </AfunBasePopup>
  </div>
</template>

<style lang='scss' scoped>

</style>

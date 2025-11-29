<script setup lang='ts'>
import { PhBaseAmount, PhBaseSelectCurrency } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniArrowDown1, IconUniPlus1 } from '@tg/icons'
import { useCurrency } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

defineOptions({ name: 'AppWallet' })
const { t } = useI18n()
const currencyStore = useCurrency()
const { currencyList, currentGlobalCurrencyMap } = storeToRefs(currencyStore)
const { bool: isMenuShown } = useBoolean(false)
const router = useRouter()
const diabled = computed(() => {
  return currencyList.value.length === 1
})
function openDeposit() {
  router.push('/wallet')
}

function onChoose(data: any) {
  currencyStore.setCurrentGlobalCurrency(data)
}
</script>

<template>
  <div class="rounded-[6px] px-[4rem] py-[5rem] bg-[#EBEBEB] text-[14rem] text-[#0D2245] font-semibold leading-[20rem]">
    <PhBaseSelectCurrency :t="t" :show-setting="true" @choose="onChoose">
      <div class="flex items-center">
        <PhBaseAmount reverse :amount="currentGlobalCurrencyMap.balance" :currency-type="currentGlobalCurrencyMap.type" style="--ss-app-amount-max-width:none" />

        <div class="flex items-center ml-[6rem] mr-[5rem]">
          <IconUniArrowDown1 v-if="!diabled" :class="isMenuShown ? 'rotate-[-180deg]' : ''" class="text-[#9dabc8]" />
        </div>
        <div
          class="w-[24rem] h-[24rem] rounded-[4px] bg-[#F23038] flex items-center cursor-pointer justify-center"
          @click.stop="openDeposit"
        >
          <IconUniPlus1 class="text-white" />
        </div>
      </div>
    </PhBaseSelectCurrency>
  </div>
</template>

<style lang='scss' scoped>

</style>

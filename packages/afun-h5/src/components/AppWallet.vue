<script setup lang='ts'>
import { AfunBaseAmount, AfunBaseSelectCurrency } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconUniPlus1, IconUniStakeArrowDown } from '@tg/icons'
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
  <div class="rounded-[6px] px-[5px] py-[5px] bg-[#0F212E] text-[14px] text-[#fff] font-[600]">
    <AfunBaseSelectCurrency :t="t" :show-setting="true" @choose="onChoose">
      <div class="flex items-center">
        <AfunBaseAmount reverse :amount="currentGlobalCurrencyMap.balance" :currency-type="currentGlobalCurrencyMap.type" style="--ss-app-amount-max-width:none;  --afun-app-currency-icon-size: 14px; --afun-base-amount-font-size: 14px;" />
        <div class="flex-1 flex items-center ml-[18px] mr-[4px] justify-end">
          <IconUniStakeArrowDown v-if="!diabled" :class="isMenuShown ? 'rotate-[-180deg]' : ''" class="text-[#fff] text-[14px]" />
        </div>
        <div
          class="size-[28px] rounded-[4px] bg-[linear-gradient(90deg,#24EE89_0%,#9FE871_100%)] flex items-center cursor-pointer justify-center"
          @click.stop="openDeposit"
        >
          <IconUniPlus1 class="text-[#05080A] text-[19px]" />
        </div>
      </div>
    </AfunBaseSelectCurrency>
  </div>
</template>

<style lang='scss' scoped>

</style>

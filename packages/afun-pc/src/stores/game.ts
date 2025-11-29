import { acceptHMRUpdate, defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const { currentGlobalCurrency } = storeToRefs(useAppStore())

  /** 货币ID */
  const currencyId = computed(() => getCurrencyConfig(currentGlobalCurrency.value).cur)
  /** 金额小数位数 */
  const decimalNum = computed(() => currencyConfig[currentGlobalCurrency.value].decimal)
  /** 投注额汇率换算前缀 */
  const currencyPrefix = computed(() =>
    application.isVirtualCurrency(currentGlobalCurrency.value)
      ? 'US$'
      : currencyConfig[currentGlobalCurrency.value].prefix,
  )

  return {
    currencyId,
    decimalNum,
    currencyPrefix,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useGameStore, import.meta.hot))

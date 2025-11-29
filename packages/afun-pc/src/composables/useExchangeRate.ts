import type { EnumCurrencyKey } from '@tg/types'
import { ApiExchangeRateFromTo } from '@tg/apis'

/**
 *  获取汇率，绑定响应式基础货币、目标货币
 */
export function useExchangeRateFromTo(
  baseCurrency: globalThis.Ref<EnumCurrencyKey>,
  targetCurrency: globalThis.Ref<EnumCurrencyKey>,
  keepBit = 2,
) {
  const rate = ref(setRate(1))

  const baseCurrencyCode = computed(() => getCurrencyConfig(baseCurrency.value).cur)
  const targetCurrencyCode = computed(() => getCurrencyConfig(targetCurrency.value).cur)

  const { runAsync: runGetRateFromTo } = useRequest(() => ApiExchangeRateFromTo({ from: baseCurrencyCode.value, to: targetCurrencyCode.value }), {
    refreshDeps: [baseCurrencyCode, targetCurrencyCode],
    refreshDepsAction() {
      runGetRateFromTo()
    },
    onSuccess(res) {
      rate.value = setRate(+res[baseCurrencyCode.value])
    },
  })

  function setRate(v: number) {
    return scientificToString(toFixed(v, keepBit))
  }

  return {
    rate,
    runGetRateFromTo,
  }
}

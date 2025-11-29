import type { EnumCurrencyKey } from '@tg/types'
import type { Ref } from 'vue'
import { ApiExchangeRateFromTo } from '@tg/apis'
import { getCurrencyConfig, scientificToString, toFixed } from '@tg/utils'
import { computed, ref } from 'vue'
import { useRequest } from 'vue-request'

/**
 *  获取汇率，绑定响应式基础货币、目标货币
 */
export function useExchangeRateFromTo(
  baseCurrency: Ref<EnumCurrencyKey>,
  targetCurrency: Ref<EnumCurrencyKey>,
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

import type { CurrencyCode, EnumCurrencyKey } from '@tg/types'
import { ApiExchangeRateFromTo } from '@tg/apis'
import { application, getCurrencyConfig ,scientificToString, sub, toFixed } from '@tg/utils'
import { computed, ref, watch } from 'vue'
import { useRequest } from 'vue-request'

export function useMiniGameLockCurrency(initCurrencyCode?: CurrencyCode) {
/** 类似Mines这种回合制的游戏，游戏开始之后不能更改货币，需要本地自行管理货币 */
  const orderCurrencyCode = ref<CurrencyCode>(initCurrencyCode || '701')
  const orderCurrencyType = computed(() => getCurrencyConfig(orderCurrencyCode.value).name)
  const rate = ref('0')
  const { run: runGetReateFromTo } = useRequest(ApiExchangeRateFromTo, {
    onSuccess(res, params) {
      const code = params[0].from as CurrencyCode
      rate.value = scientificToString(res[code])
    },
  })
  if (application.isVirtualCurrency(orderCurrencyType.value))
    runGetReateFromTo({ from: orderCurrencyCode.value, to: '706' })
  else
    rate.value = '1'

  /** 已游戏当前货币为标准转换小数位数 */
  function toFixedByLockCurrency(amount: string, currencyType: EnumCurrencyKey) {
    const decimalNum = getCurrencyConfig(currencyType).decimal
    return application.formatNumDecimal(+amount, decimalNum)
  }

  /** 获得金额换汇前缀 */
  function getLockCurrencyPrefix(currencyType: EnumCurrencyKey) {
    return application.isVirtualCurrency(currencyType) ? 'US$' : getCurrencyConfig(currencyType).prefix
  }

  watch(orderCurrencyType, (a) => {
    if (application.isVirtualCurrency(a))
      runGetReateFromTo({ from: orderCurrencyCode.value, to: '706' })
    else
      rate.value = '1'
  })

  return {
    rate,
    orderCurrencyCode,
    toFixedByLockCurrency,
    getLockCurrencyPrefix,
  }
}

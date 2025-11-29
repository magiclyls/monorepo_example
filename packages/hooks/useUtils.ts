import type { CurrencyCode } from '@tg/types'
import { useAppStore } from '@tg/stores'
import { getCurrencyConfig } from '@tg/utils'
import { storeToRefs } from 'pinia'

export function useUtils() {
  const { userInfo } = storeToRefs(useAppStore())

  function getRealNameFromUserInfoByFiatCurrencyId(id: CurrencyCode) {
    const key = getCurrencyConfig(id).realnameKey

    if (key)
      return userInfo.value?.realname[key as keyof typeof userInfo.value.realname]
  }

  return {
    getRealNameFromUserInfoByFiatCurrencyId,
  }
}

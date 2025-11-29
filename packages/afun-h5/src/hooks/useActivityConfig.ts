import type { CurrencyCode } from '@tg/types'
// useActivityConfig.ts
import { useAppStore, useCurrency, useDialogStore } from '@tg/stores'
import { languageConfig } from '@tg/types'
import { application, currencyMap } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, type ComputedRef, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'

export interface ActivityConfig {
  isLogin: Ref<boolean>
  callback: (type: string, data?: any) => void
  globalCurrencyCode: ComputedRef<CurrencyCode>
}

export function useActivityConfig(): ActivityConfig {
  const router = useRouter()
  const appStore = useAppStore()
  const { isLogin } = storeToRefs(appStore)
  const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
  const dialogStore = useDialogStore()
  const { showShareDialog } = storeToRefs(dialogStore)

  const currentLangCurrency = computed(() => {
    return currencyMap[languageConfig[getLang()].currency].cur
  })
  const globalCurrencyCode = computed(() => {
    if (isLogin.value)
      return application.isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? currencyMap.USDT.cur : currentGlobalCurrencyMap.value.cur

    return currentLangCurrency.value
  })

  function callback(type: string, data?: any) {
    switch (type) {
      case 'login':
        router.push('/login')
        break
      case 'recharge':
        router.push('/wallet')
        break
      case 'share':
        showShareDialog.value = true
        break
      case 'message':
        Message.success(data)
        break
      default:
        console.log('其他回调:', type)
    }
  }

  return {
    isLogin,
    callback,
    globalCurrencyCode,
  }
}

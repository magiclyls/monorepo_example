import type { CurrencyCode } from '@tg/types'
import type { InjectionKey } from 'vue'
import { inject } from 'vue'

export interface ConfigProviderContext {
  /** 是否登录 */
  isLogin: boolean
  locale: Record<string, string>
  globalCurrencyCode: CurrencyCode
  callback: (type: string, data?: any) => void
}

export const configSymbol: InjectionKey<ConfigProviderContext> = Symbol('ActivityConfigProvider')
export const ActivityLocaleSymbol = 'ActivityLocale'

export function useActivityConfig(): ConfigProviderContext {
  return inject(configSymbol, {
    isLogin: false,
    locale: {},
    globalCurrencyCode: '701',
    callback: () => {},
  })
}

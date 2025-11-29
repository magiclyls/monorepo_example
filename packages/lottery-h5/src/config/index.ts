// packages/core/config.ts
import type { InjectionKey } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { inject } from 'vue'

export interface ConfigProviderContext {
  route: RouteLocationNormalizedLoadedGeneric
  locale: {
    type: object
    required: true
  }
  projectName?: string
  [key: string]: any
}

export const configSymbol: InjectionKey<ConfigProviderContext> = Symbol('LotteryConfigProvider')
export const LotteryLocaleSymbol = Symbol('LotteryLocale')
export const LotteryProjectNameSymbol = Symbol('LotteryProjectName')

export function useSportsConfig(): ConfigProviderContext {
  return inject(configSymbol, {})
}

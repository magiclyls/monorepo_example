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
  kefuUrl?: string
  url?: string
  userName?: string
  sign?: string
  lang: string
  [key: string]: any
}

export const configSymbol: InjectionKey<ConfigProviderContext> = Symbol('ChatConfigProvider')
export const ChatLocaleSymbol = Symbol('ChatLocale')
export const ChatProjectNameSymbol = Symbol('ChatProjectName')

export function useChatConfig(): ConfigProviderContext {
  return inject(configSymbol, {} as ConfigProviderContext)
}

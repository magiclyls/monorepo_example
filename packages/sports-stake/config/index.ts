// packages/core/config.ts
import type { InjectionKey } from 'vue'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { inject } from 'vue'
import { useRoute } from 'vue-router'

export interface ConfigProviderContext {
  /** 路由实例 */
  route: RouteLocationNormalizedLoadedGeneric
  /** 球种图片目录 */
  sportDirectory?: string
  /** 项目名称 */
  projectName?: string
  [key: string]: any
}

export const configSymbol: InjectionKey<ConfigProviderContext> = Symbol('StakeSportsConfigProvider')

export function useSportsConfig(): ConfigProviderContext {
  // 这里的route没有用，解决默认值报错问题
  const route = useRoute()

  return inject(configSymbol, { route })
}

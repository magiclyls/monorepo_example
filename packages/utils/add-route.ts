import type { Component } from 'vue'
import type {
  NavigationGuardNext,
  RouteLocationNormalizedGeneric,
  RouteLocationNormalizedLoadedGeneric,
  Router,
} from 'vue-router'
import { withName } from './direction-detector-history'

interface CustomRouteRecordRaw {
  namePrefix: string
  pathPrefix: string
  component: () => Promise<{ default: Component }>
}

function createAddRouteGuard(
  router: Router,
  cfg: CustomRouteRecordRaw,
) {
  return function (
    to: RouteLocationNormalizedGeneric,
    from: RouteLocationNormalizedLoadedGeneric,
    next: NavigationGuardNext,
  ) {
    const { name, path, query = {} } = to
    // 判断是否匹配当前配置的前缀
    if (!name && path.startsWith(cfg.pathPrefix)) {
      const __name = `${cfg.namePrefix}Te${query.id || Date.now()}`
      router.addRoute({
        path,
        name: __name,
        component: () =>
          cfg.component().then(mod =>
            withName(mod.default, __name),
          ),
      })
      next({ ...to }) // 重新导航到刚刚添加的路由
    }
    else {
      next()
    }
  }
}

/**
 * 添加一些路由相同参数不同需要都缓存的页面，比如游戏详情页需要缓存多个
 * @param router
 * @param routes
 */
export function addDynamicRoutes(
  router: Router,
  routes: CustomRouteRecordRaw[],
): void {
  routes.forEach((cfg) => {
    router.beforeEach(createAddRouteGuard(router, cfg))
  })
}

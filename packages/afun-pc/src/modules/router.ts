import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import type { App, Component } from 'vue'
import generatedRoutes from '~pages'
import type { DynamicCategoryKeys, DynamicProviderKeys } from '~/utils/scroll-var'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: string
    /** 是否需要登录 */
    auth?: boolean
    /** 浏览器标题 */
    browserTitle?: string
    /** layout with-menu 标题 */
    withMenuTitle?: string
    /** layout with-menu 图标 */
    withMenuIcon?: string
    /** layout with-menu 菜单数据 */
    withMenuMenu?: Array<{ title: string; path: string; token?: boolean; isT?: boolean }>
    /** layout with-menu 移动端菜单展示方式 */
    withMenuMobileType?: 'tabs' | 'select'
    /** 布局配置 */
    withMenuLayoutConf?: { padding?: string; borderRadius?: string }
    /** body 滚动时是否让子盒子x滚动hidden */
    needScrollingXHidden?: boolean
    /** 是否显示带余额的header，三皮肤 */
    showHomeHeader: boolean
    /** 带余额的header是否显示返回按钮，三皮肤 */
    homeHeaderBack: boolean
    /** 路由层级 推屏动画用 */
    depth: number
  }
}

const routes = setupLayouts(generatedRoutes)

const { VITE_SOCKET_PREFIX, VITE_CASINO_IMG_CLOUD_URL } = getEnv()

const keepAliveUrl = [
  `/${getCurrentUrlLanguage()}/casino`,
  `/${getCurrentUrlLanguage()}/casino/group/category`,
  `/${getCurrentUrlLanguage()}/casino/group/provider`,
  `/${getCurrentUrlLanguage()}/promotion`,
]
let isBackFlag = false

// 初始化
function setupBackDetection(router: Router) {
  // 重写 router.back()
  const originalBack = router.back
  router.back = () => {
    isBackFlag = true
    return originalBack()
  }

  // 监听浏览器后退按钮
  /*  window.addEventListener('popstate', () => {
     isBackFlag = true
   }) */
}

// 获取方向
function getMeepALiveDirection(): 'back' | 'forward' {
  const direction = isBackFlag ? 'back' : 'forward'
  isBackFlag = false // 立即重置
  return direction
}
export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (from.fullPath === '/' && from.name === undefined)
      return { top: 0 }

    // 如果是pc端，跳转到顶部
    if (window.innerWidth > 768) {
      scrollMainContentToTop()
      return {
        top: 0,
        left: 0,
      }
    }

    if (!keepAliveUrl.includes(to.path)) {
      return {
        top: 0,
        left: 0,
      }
    }

    if (to.fullPath.includes('/casino/games/')) {
      return {
        top: 0,
      }
    }

    if (savedPosition) {
      if (from.path.includes('/casino/original-game/plinko')) {
        return {
          top: 0,
        }
      }

      if (to.path.includes('/casino/group/provider')) {
        return {
          top: scrollProviderVar[to.fullPath as DynamicProviderKeys] || 0,
        }
      }

      if (to.path.includes('/casino/group/category')) {
        return {
          top: scrollCategoryVar[to.fullPath as DynamicCategoryKeys] || 0,
        }
      }

      return savedPosition
    }
    else { return { top: 0 } }
  },
})
setupBackDetection(router)


function isWalletRoute(route: RouteLocationNormalized) {
  return route.path.includes('/center/deposit') || route.path.includes('/center/withdraw')
}
router.beforeEach(async (to, from, next) => {
  Local.set(STORAGE_FROM_URL, from.path)
  if (from.path.includes('/crash')) {
    socketClient.removeSubscribe('games/crash/pub')
    socketClient.removeSubscribe(`games/crash/${VITE_SOCKET_PREFIX}`)
    document.querySelector('.mini-game-crash-outer')?.classList.add('hidden-local')
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 50)
    })
  }

  const direction = getMeepALiveDirection()
  if (direction === 'back') {
    // 只有从wallet路由到wallet路由
    if (isWalletRoute(to) && isWalletRoute(from)) {
      Local.pop(STORAGE_WALLET_ROUTE)
    }
  }



  const defaultLang = getLocalUrlToUrlLang()
  const baseUrl = `/${defaultLang}`

  // 如果跳转体育页面，判断是否在维护中，如果在维护中，跳转到维护页面
  if (to.path.includes('sports') && globalInitMap.isSportsMaintained === true) {
    // 如果正在维护，现判断是否已经结束再跳转
    await getSportsMaintainedStatus()
    if (!globalInitMap.isSportsMaintained)
      next()
    else
      next({ path: `${baseUrl}/sport-maintained` })

    return
  }

  // 如果跳转维护页面，判断是否在维护中，如果不在维护中，跳转到首页
  if (to.path.includes('sport-maintained') && globalInitMap.isSportsMaintained === false) {
    next({ path: '/' })
    return
  }

  // 如果没有语言参数，跳转到默认语言
  if (to.params.lang === void 0) {
    next(addUrlSearch(baseUrl, location.search))
    return
  }

  // 如果语言参数不是项目中的语言，跳转到默认语言
  if (
    to.params.lang
    && (typeof to.params.lang === 'string')
    && !isExistRouterLanguage(to.params.lang)
  ) {
    next(addUrlSearch(baseUrl, location.search))
    return
  }
  else {
    const path = to.path.replace(/\/$/, '')
    if (path === `/${to.params.lang}`) {
      next(addUrlSearch(`${path}/${globalInitMap.defaultRedirect}`, location.search))
      return
    }
  }

  // 如果语言参数和上一个路由语言参数不一致，刷新页面
  if (
    isExistRouterLanguage(to.params.lang as string)
    && isExistRouterLanguage(from.params.lang as string)
  ) {
    if (to.params.lang !== from.params.lang) {
      setTimeout(() => {
        location.reload()
      }, 30)
    }
  }

  const appStore = useAppStore()
  const { isLogin } = storeToRefs(appStore)
  const { openRegisterDialog } = useRegisterDialog()
  const auth = to.meta.auth || false

  if (auth) {
    if (!isLogin.value) {
      openRegisterDialog()
      next(baseUrl)
      return
    }
  }

  next()
})

export function install(app: App<Element>) {
  app.use(router)
}

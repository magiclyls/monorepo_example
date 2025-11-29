import type { App } from 'vue'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [

]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const { isLogin } = storeToRefs(useAppStore())
  if (to.path === '/casino') {
    return next('/')
  }
  if (to.meta.needLogin && !isLogin.value) {
    next('/login')
  }
  next()
})

let lastPosition = ''
router.afterEach((to, from, failure) => {
  const currentPosition = history.state?.position ?? 0

  if (lastPosition !== '') {
    const isBack = currentPosition < lastPosition

    lastPosition = currentPosition

    to.meta.transitionName = isBack ? 'slide-right' : 'slide-left'
  }
  else {
    lastPosition = currentPosition
  }
})

export function install(app: App<Element>) {
  app.use(router)
}

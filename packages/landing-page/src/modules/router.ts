import type { App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'StartPage',
    component: () => import('../components/StartPage.vue'),
  },
  {
    path: '/v03',
    name: 'V03',
    component: () => import('../pages/v03/index.vue'),
  },
  {
    path: '/x02',
    name: 'X02',
    component: () => import('../pages/x02/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('../components/404.vue'),
  },
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

/* router.beforeEach(async (to, from, next) => {
  next(to.name as string)
}) */

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

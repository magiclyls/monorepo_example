import type { App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/win-go/index.vue'),
  },
  {
    path: '/win-go/detail',
    name: 'WinGoDeTail',
    component: () => import('../pages/win-go/detail/index.vue'),
  },
  {
    path: '/racing',
    name: 'Racing',
    component: () => import('../pages/racing/index.vue'),
  },
  {
    path: '/racing/detail',
    name: 'RacingDetail',
    component: () => import('../pages/racing/detail/index.vue'),
  },
  {
    path: '/5d',
    name: '5D',
    component: () => import('../pages/5d/index.vue'),
  },
  {
    path: '/5d/detail',
    name: '5DDeTail',
    component: () => import('../pages/5d/detail/index.vue'),
  },
  {
    path: '/k3',
    name: 'k3',
    component: () => import('../pages/k3/index.vue'),
  },
  {
    path: '/k3/detail',
    name: 'k3DeTail',
    component: () => import('../pages/k3/detail/index.vue'),
  },
  {
    path: '/trx-win-go',
    name: 'TrxWinGo',
    component: () => import('../pages/trx-win-go/index.vue'),
  },
  {
    path: '/trx-win-go/detail',
    name: 'TrxWinGoDetail',
    component: () => import('../pages/trx-win-go/detail/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory('/lottery/'),
  routes,
})

router.beforeEach(async (to, from, next) => {
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

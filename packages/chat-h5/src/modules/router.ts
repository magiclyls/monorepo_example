import type { App } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  next()
})

router.afterEach((to, from, failure) => {
})

export function install(app: App<Element>) {
  app.use(router)
}

import { createRouter, createWebHistory } from 'vue-router'
import BaseRouterLink from './components/BaseRouterLink.vue'

const routes = [
  {
    path: '/:lang/casino',
    name: 'Casino',
    component: () => import('~/pages/casino/index.vue'),
  },
  {
    path: '/:lang/test',
    name: 'test',
    component: () => import('~/pages/casino/test.vue'),
  },
  {
    path: '/:lang/sports',
    name: 'Sports',
    component: () => import('~/pages/sports/index.vue'),
  },
  {
    path: '/:lang/chat',
    name: 'Chat',
    meta: {
      layout: 'other',
    },
    component: () => import('~/pages/chat/index.vue'),
  },
  {
    path: '/:lang/affiliate-exhibition',
    name: 'Affiliate',
    component: () => import('~/pages/affiliate-exhibition/index.vue'),
  },
  {
    path: '/:lang/icon-list',
    name: 'AppIconList',
    component: () => import('~/pages/icon-list.vue'),
  },
  {
    path: '/:lang/menu',
    name: 'SideMenu',
    component: () => import('~/pages/menu/index.vue'),
  },
  {
    path: '/:lang/turntable-translation',
    name: 'TurntableTranslation',
    component: () => import('~/pages/turntable-translation/index.vue'),
    meta: {
      layout: 'withMenu',
      title: '免费获得钱币',
    },
  },
  {
    path: '/:lang/affiliate-program',
    name: 'AffiliateProgram',
    component: () => import('~/pages/affiliate-program/index.vue'),
    meta: {
      layout: 'withMenu',
    },
  },
  {
    path: '/:lang/affiliate-program/commission-detail',
    name: 'AffiliateProgramCommissionDetail',
    component: () => import('~/pages/affiliate-program/commission-detail.vue'),
    meta: {
      layout: 'withMenu',
    },
  },
  {
    path: '/:lang/affiliate-program/commission-record',
    name: 'AffiliateProgramCommissionRecord',
    component: () => import('~/pages/affiliate-program/commission-record.vue'),
    meta: {
      layout: 'withMenu',
    },
  },
  {
    path: '/:lang/affiliate-program/faq',
    name: 'AffiliateProgramFaq',
    component: () => import('~/pages/affiliate-program/faq.vue'),
    meta: {
      layout: 'withMenu',
    },
  },
  {
    path: '/:lang/affiliate-program/finance-data',
    name: 'AffiliateProgramFinanceData',
    component: () => import('~/pages/affiliate-program/finance-data.vue'),
    meta: {
      layout: 'withMenu',
    },
  },
  {
    path: '/:lang/affiliate-program/my-data',
    name: 'AffiliateProgramMyData',
    component: () => import('~/pages/affiliate-program/my-data.vue'),
    meta: {
      layout: 'withMenu',
    },
  },
] as const

export type RoutePaths = (typeof routes[number]['path'] extends `/:lang${infer Rest}` ? `${Rest}${'' | `?${string}`}` : never)

export * from './hooks/useLocalRouter'
export {
  BaseRouterLink,
}

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const defaultLang = 'zh'
  const baseUrl = `/${defaultLang}`

  if (to.params.lang === void 0 || to.params.lang !== 'zh') {
    next(`${baseUrl}/casino`)
    return
  }

  next()
})

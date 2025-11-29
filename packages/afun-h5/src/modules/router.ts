import type { App } from 'vue'
import type { RouteLocationNormalized, RouteRecordRaw } from 'vue-router'

import { getMeepALiveDirection } from '@tg/bccomponents/src/BaseKeepAlive'
import { useAppStore } from '@tg/stores'
import { addDynamicRoutes, isMobile, Local, setupVueRouterPush, STORAGE_WALLET_ROUTE } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('~/pages/casino/index.vue'),
  },
  {
    path: '/favourites',
    name: 'Favourites',
    component: () => import('~/pages/casino/favourites.vue'),
    meta: { needLogin: true },
  },
  {
    path: '/recent',
    name: 'Recent',
    component: () => import('~/pages/casino/recent.vue'),
    meta: { needLogin: true },
  },
  {
    path: '/group',
    children: [
      {
        path: 'all-provider',
        name: 'GroupAllProvider',
        component: () => import('~/pages/group/all-provider.vue'),
      },
      // {
      //   path: 'provider/:vid',
      //   name: 'GroupProvider',
      //   component: () => import('~/pages/group/provider.vue'),
      // },
      // {
      //   path: 'category/:cid',
      //   name: 'GroupCategory',
      //   component: () => import('~/pages/group/category.vue'),
      // },
    ],
  },
  {
    path: '/games',
    children: [
      {
        path: 'mobile-game-frame',
        name: 'MobileGameFrame',
        component: () => import('~/pages/games/mobile-game-frame.vue'),
      },
      {
        path: 'mobile-lottery',
        name: 'MobileLottery',
        component: () => import('~/pages/games/mobile-lottery.vue'),
      },
      // {
      //   path: ':id',
      //   name: 'CasinoGame',
      //   component: () => import('~/pages/games/index.vue'),
      // },
    ],
  },
  {
    path: '/original-game',
    children: [
      {
        path: 'wheel',
        name: 'OriginaGamelwheel',
        component: () => import('~/pages/original-game/wheel/index.vue'),
      },
      {
        path: 'crash',
        name: 'OriginalGameCrash',
        component: () => import('~/pages/original-game/crash/index.vue'),
      },
      {
        path: 'limbo',
        name: 'OriginalGameLimbo',
        component: () => import('~/pages/original-game/limbo/index.vue'),
      },
      {
        path: 'mines',
        name: 'OriginalGameMines',
        component: () => import('~/pages/original-game/mines/index.vue'),
      },
      {
        path: 'keno',
        name: 'OriginalGameKeno',
        component: () => import('~/pages/original-game/keno/index.vue'),
      },
      {
        path: 'dice',
        name: 'OriginalGameDice',
        component: () => import('~/pages/original-game/dice/index.vue'),
      },
      {
        path: 'hilo',
        name: 'OriginalGameHilo',
        component: () => import('~/pages/original-game/hilo/index.vue'),
      },
      {
        path: 'blackjack',
        name: 'OriginalGameBlackjack',
        component: () => import('~/pages/original-game/blackjack/index.vue'),
      },
      {
        path: 'plinko',
        name: 'OriginalGamePlinko',
        component: () => import('~/pages/original-game/plinko/index.vue'),
      },
    ],
  },
  {
    path: '/promotions',
    children: [
      {
        path: '',
        name: 'PromotionList',
        component: () => import('~/pages/promotions/index.vue'),
      },
      {
        path: 'promotion/:id',
        name: 'PromotionDetail',
        component: () => import('~/pages/promotions/promotion.vue'),
      },
    ],
  },
  {
    path: '/wallet',
    name: 'wallet',
    component: () => import('~/pages/wallet/index.vue'),
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('~/pages/menu/index.vue'),
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('~/pages/chat/index.vue'),
  },
  {
    path: '/wallet/deposit-detail',
    name: 'depositDetail',
    component: () => import('~/pages/wallet/deposit-detail.vue'),
  },
  {
    path: '/wallet/vir-deposit-detail',
    name: 'virDepositDetail',
    component: () => import('~/pages/wallet/virtual-deposit-detail.vue'),
  },
  {
    path: '/wallet/deposit-detail/submit',
    name: 'depositDetailSubmit',
    component: () => import('~/pages/wallet/deposit-detail-submit.vue'),
  },
  {
    path: '/wallet/bebank/:type',
    name: 'withdrawBank',
    component: () => import('~/pages/wallet/bebank.vue'),
  },
  /** ⚾️⚾️ 体育 ⚾️⚾️ */
  {
    path: '/sports',
    children: [
      {
        path: '',
        name: 'Sports',
        component: () => import('~/pages/sports/index.vue'),
      },
      {
        path: ':sport(\\d+)',
        name: 'AppSportsSport',
        component: () => import('~/pages/sports/sport.vue'),
      },
      {
        path: ':sport(\\d+)/:region(\\d+)',
        name: 'AppSportsRegion',
        component: () => import('~/pages/sports/region.vue'),
      },
      {
        path: ':sport(\\d+)/:region(\\d+)/:league(\\d+)',
        name: 'AppSportsLeague',
        component: () => import('~/pages/sports/league.vue'),
      },
      {
        path: ':sport(\\d+)/:region(\\d+)/:league(\\d+)/:fixture(\\d+)',
        name: 'AppSportsFixture',
        component: () => import('~/pages/sports/fixture.vue'),
      },
      {
        path: 'outrights',
        name: 'AppSportsOutrights',
        component: () => import('~/pages/sports/outrights.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('~/pages/login/index.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('~/pages/register/index.vue'),
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('~/pages/policy/index.vue'),
  },
  {
    path: '/components',
    name: 'components',
    component: () => import('~/pages/components.vue'),
  },
  {
    path: '/message',
    name: 'Message',
    component: () => import('~/pages/message/index.vue'),
  },
  {
    path: '/message/message-detail',
    name: 'MessageDetail',
    component: () => import('~/pages/message/message-detail.vue'),
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('~/pages/user/index.vue'),
    children: [
      {
        path: '',
        name: 'UserCenter',
        component: () => import('~/pages/user/center.vue'),
      },
      {
        path: 'coupon',
        name: 'UserCoupon',
        component: () => import('~/pages/user/coupon.vue'),
      },
      {
        path: 'language',
        name: 'UserLanguage',
        component: () => import('~/pages/user/language.vue'),
      },
      {
        path: 'info',
        name: 'UserInfo',
        component: () => import('~/pages/user/info.vue'),
      },
      {
        path: 'name',
        name: 'UserName',
        component: () => import('~/pages/user/name.vue'),
      },
      {
        path: 'gender',
        name: 'UserGender',
        component: () => import('~/pages/user/gender.vue'),
      },
      {
        path: 'nationality',
        name: 'UserNationality',
        component: () => import('~/pages/user/nationality.vue'),
      },
      {
        path: 'kyc',
        name: 'UserKyc',
        component: () => import('~/pages/user/kyc.vue'),
      },
      /*  {
        path: 'avatar',
        name: 'UserAvatar',
        component: () => import('~/pages/user/avatar.vue'),
      }, */
    ],
  },
  {
    path: '/rebate-center',
    name: 'RebateCenter',
    component: () => import('~/pages/rebate-center/index.vue'),
    children: [
      {
        path: '',
        name: 'RebateCenterRebate',
        component: () => import('~/pages/rebate-center/rebate.vue'),
      },
      {
        path: 'record',
        name: 'RebateCenterRecord',
        component: () => import('~/pages/rebate-center/record.vue'),
      },
      {
        path: 'rebate-detail',
        name: 'RebateCenterRebateDetail',
        component: () => import('~/pages/rebate-center/rebate-detail.vue'),
      },
    ],
  },
  {
    path: '/affiliate',
    name: 'Alliance',
    component: () => import('~/pages/affiliate/index.vue'),
  },
  {
    path: '/bets-record',
    name: 'BetsRecord',
    component: () => import('~/pages/bets-record/index.vue'),
  },
  {
    path: '/service',
    name: 'Service',
    component: () => import('~/pages/service.vue'),
  },
  {
    path: '/transaction-record',
    name: 'TransactionRecord',
    component: () => import('~/pages/transaction-record/index.vue'),
  },
  {
    path: '/transaction-record-detail',
    name: 'TransactionRecordDetail',
    component: () => import('~/pages/transaction-record-detail/index.vue'),
  },
  {
    path: '/interest',
    name: 'Interest',
    component: () => import('~/pages/interest/index.vue'),
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () => import('~/pages/setting/index.vue'),
  },
  {
    path: '/email',
    name: 'EmailSetting',
    component: () => import('~/pages/setting/email.vue'),
  },
  {
    path: '/phone',
    name: 'PhoneSetting',
    component: () => import('~/pages/setting/phone.vue'),
  },
  {
    path: '/login-password',
    name: 'LoginPasswordSetting',
    component: () => import('~/pages/setting/login-password.vue'),
  },
  {
    path: '/wallet-password',
    name: 'WalletPasswordSetting',
    component: () => import('~/pages/setting/wallet-password.vue'),
  },
  {
    path: '/social-media',
    name: 'SocialMediaSetting',
    component: () => import('~/pages/setting/social-media.vue'),
  },
  {
    path: '/login-history',
    name: 'LoginHistory',
    component: () => import('~/pages/setting/login-history.vue'),
  },
  {
    path: '/close-account',
    name: 'CloseAccount',
    component: () => import('~/pages/setting/close-account.vue'),
  },
  {
    path: '/double-verify',
    name: 'DoubleVerify',
    component: () => import('~/pages/setting/double-verify.vue'),
  },
  {
    path: '/policies',
    // name: 'Policies',
    component: () => import('~/pages/policies/index.vue'),
    children: [
      {
        path: '',
        name: 'Policies',
        component: () => import('~/pages/policies/list.vue'),
      },
      {
        path: 'about-us',
        name: 'AboutUs',
        component: () => import('~/pages/policies/about-us.vue'),
      },
      {
        path: 'general-rules',
        name: 'GeneralRules',
        component: () => import('~/pages/policies/general-rules.vue'),
      },
      {
        path: 'betting-station',
        name: 'BettingStation',
        component: () => import('~/pages/policies/betting-station.vue'),
      },
      {
        path: 'faqs',
        name: 'Faqs',
        component: () => import('~/pages/policies/faqs.vue'),
      },
      {
        path: 'responsible-gaming',
        name: 'ResponsibleGaming',
        component: () => import('~/pages/policies/responsible-gaming.vue'),
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('~/pages/policies/help.vue'),
      },
      {
        path: 'terms-of-use',
        name: 'TermsOfUse',
        component: () => import('~/pages/policies/terms-of-use.vue'),
      },
      {
        path: 'privacy-policy',
        name: 'PrivacyPolicy',
        component: () => import('~/pages/policies/privacy-policy.vue'),
      },
      {
        path: 'sports-book',
        name: 'SportsBook',
        component: () => import('~/pages/policies/sports-book.vue'),
      },
      {
        path: 'anti-money-laundering',
        name: 'AntiMoneyLaundering',
        component: () => import('~/pages/policies/anti-money-laundering.vue'),
      },
      {
        path: 'wager-requirements',
        name: 'WagerRequirements',
        component: () => import('~/pages/policies/wager-requirements.vue'),
      },
      {
        path: 'coin-mixing',
        name: 'CoinMixing',
        component: () => import('~/pages/policies/coin-mixing.vue'),
      },
      {
        path: 'game-provider',
        name: 'GameProvider',
        component: () => import('~/pages/policies/game-provider.vue'),
      },
      {
        path: 'cookie-policy',
        name: 'CookiePolicy',
        component: () => import('~/pages/policies/cookie-policy.vue'),
      },
    ],
  },
  {
    path: '/vip',
    name: 'AppVip',
    component: () => import('~/pages/vip/index.vue'),
  },
  {
    path: '/task/task-record',
    name: 'TaskRecord',
    component: () => import('~/pages/task/task-record.vue'),
  },
  {
    path: '/task/task-inner-d',
    name: 'TaskInnerD',
    component: () => import('~/pages/task/task-inner-d.vue'),
  },
  {
    path: '/task/task-inner-b',
    name: 'TaskInnerB',
    component: () => import('~/pages/task/task-inner-b.vue'),
  },
  {
    path: '/provably-fair',
    name: 'ProvablyFair',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/overview',
    name: 'ProvablyFairOverview',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/implementation',
    name: 'ProvablyFairImplementation',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/conversions',
    name: 'ProvablyFairConversions',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/game-events',
    name: 'ProvablyFairGameEvents',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/server-seed-unhash',
    name: 'ProvablyFairServerSeedUnhash',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/provably-fair/calculation',
    name: 'ProvablyFairCalculation',
    component: () => import('~/pages/provably-fair/index.vue'),
  },
  {
    path: '/lot/win-go',
    name: 'LotWinGo',
    component: () => import('~/pages/lottery/win-go/index.vue'),
  },
  {
    path: '/lot/racing',
    name: 'LotRacing',
    component: () => import('~/pages/lottery/racing/index.vue'),
  },
  {
    path: '/lot/racing/detail',
    name: 'LotRacingDetail',
    component: () => import('~/pages/lottery/racing/detail.vue'),
  },
  {
    path: '/lot/win-go/detail',
    name: 'LotWinGoDetail',
    component: () => import('~/pages/lottery/win-go/detail.vue'),
  },
  {
    path: '/lot/5d',
    name: 'Lot5D',
    component: () => import('~/pages/lottery/5d/index.vue'),
  },
  {
    path: '/lot/5d/detail',
    name: 'Lot5DDetail',
    component: () => import('~/pages/lottery/5d/detail.vue'),
  },
  {
    path: '/lot/trx-win-go',
    name: 'LotTrxWinGo',
    component: () => import('~/pages/lottery/trx-win-go/index.vue'),
  },
  {
    path: '/lot/trx-win-go/detail',
    name: 'LotTrxWinGoDetail',
    component: () => import('~/pages/lottery/trx-win-go/detail.vue'),
  },
  {
    path: '/lot/k3',
    name: 'LotK3',
    component: () => import('~/pages/lottery/k3/index.vue'),
  },
  {
    path: '/lot/k3/detail',
    name: 'LotK3Detail',
    component: () => import('~/pages/lottery/k3/detail.vue'),
  },
  {
    path: '/self-exclusion',
    name: 'SelfExclusion',
    component: () => import('~/pages/self-exclusion/index.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // ✅ 自动读取 base
  routes,
})

addDynamicRoutes(router, [
  {
    pathPrefix: '/group/provider/',
    namePrefix: 'GroupCategory',
    component: () => import('~/pages/group/provider.vue'),
  },
  {
    pathPrefix: '/group/category/',
    namePrefix: 'GroupProvider',
    component: () => import('~/pages/group/category.vue'),
  },
  {
    pathPrefix: '/games/',
    namePrefix: 'CasinoGame',
    component: () => import('~/pages/games/index.vue'),
  },
])

function isWalletRoute(route: RouteLocationNormalized) {
  return route.path.includes('/wallet')
}

router.beforeEach(async (to, from, next) => {
  const direction = getMeepALiveDirection()
  const { isLogin } = storeToRefs(useAppStore())
  if (to.path === '/casino') {
    return next('/')
  }
  if (to.meta.needLogin && !isLogin.value) {
    next('/login')
  }
  if (direction === 'back') {
    // 只有从wallet路由到wallet路由
    if (isWalletRoute(to) && isWalletRoute(from)) {
      Local.pop(STORAGE_WALLET_ROUTE)
    }
  }

  if (['back', 'forward'].includes(direction) && isMobile()) {
    // 不需要动画的路由
    const arr = ['Service']
    if (!arr.includes(to.name?.toString() ?? ''))
      to.meta.transitionName = direction === 'back' ? 'slide-right' : 'slide-left'
  }
  next()
})

router.afterEach((to, from, failure) => {
  // if (isSafari && +(getIOSVersion()?.major || 1) <= 18) {
  if (['forward'].includes(getMeepALiveDirection())) {
    // 如果只是 query 参数变化（特别是 page_dialog），不滚动到顶部
    const isOnlyQueryChange = to.path === from.path && (
      to.query.page_dialog !== from.query.page_dialog
      // || Object.keys(to.query).some(key => to.query[key] !== from.query[key])
    )

    if (!isOnlyQueryChange) {
      window.scrollTo(0, 0)

      setTimeout(() => {
        window.scrollTo(1, 1)
      }, 50)
    }
  }
})

export function install(app: App<Element>) {
  setupVueRouterPush(router)
  app.use(router)
}

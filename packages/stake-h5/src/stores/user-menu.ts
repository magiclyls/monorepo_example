import {
  IconNavbarCart,
  IconNavbarWallet,
  IconSptAirbonus,
  IconChessAffiliate,
  IconUniTrend,
  IconTabbarBet,
  IconSptUserBet,
  IconUniRebatereal,
  IconChessGameshow,
  IconUniCoupon,
  IconUniSet,
  IconChessOnlineSupport,
  IconUniLogout,
  IconUserSelfExclusion
} from '@tg/icons';
import { getEnv } from '@tg/utils';

/** 顶部用户菜单 */
export const useUserMenuStore = defineStore('userMenu', () => {
  const { t } = useI18n()
  const route = useRoute()
  const { isMobile, appContentWidth } = storeToRefs(useWindowStore())
  const { leftIsExpand, closeLeftSidebar } = useLeftSidebar()
  const router = useLocalRouter()
  const { openWalletDialog } = useWalletDialog()
  const { openStatisticsDialog } = useStatisticsDialog()
  const { openSafeDialog } = useSafeDialog()
  const { openLogoutDialog } = useLogoutDialog()
  const appStore = useAppStore()
  const { userInfo, isHaveVIPRebateConfig, isVipOpen } = storeToRefs(appStore)
  const {
    rightIsExpand,
    openRightSidebar,
    currentRightSidebarContent,
    closeRightSidebar,
  } = useRightSidebar()
  const { openService } = useService()
  const { openRealTimeRebateDialog } = useDialogRealTimeRebate()
  const { rebateAutomatic } = useVipInfo()
  const { isSafeInterestOpen } = storeToRefs(useBrandStore())
  const { isOpen } = storeToRefs(useAffiliate())
  const { openCouponDialog } = useDialogCoupon()
  const { VITE_SITE_NAME } = getEnv()

  const getActiveShown = computed(() => {
    return (shown: string) => rightIsExpand.value
    && shown === currentRightSidebarContent.value
  })
  const isRouteSports = computed(() => route.name?.toString().includes('sports'))
  const userMenu = computed(() => ([
    { id: 1, icon: IconNavbarWallet, title: t('wallet'), name: 'wallet' },
    isSafeInterestOpen.value ? { id: 2, icon: IconNavbarCart, title: t('safe'), name: 'safe' } : undefined,
    isVipOpen.value
      ? {
          id: 3,
          icon: IconSptAirbonus,
          title: t('vip'),
          name: 'vip',
          path: '/vip?tab=vipBonus',
        }
      : undefined,
    isOpen.value
      ? {
          id: 4,
          icon: IconChessAffiliate,
          title: t('affiliate'),
          name: 'affiliate',
          path: '/affiliate/invitation-link',
        }
      : undefined,
    {
      id: 6,
      icon: IconUniTrend,
      title: t('header_profile_drop_down_menu_statistics'),
      name: 'statistical-data',
    },
    {
      id: 7,
      icon: IconTabbarBet,
      title: t('header_profile_drop_down_menu_transaction_record'),
      name: 'transactions',
      path: appContentWidth.value <= 800 ? '/transactions' : '/transactions/deposits',
    },
    {

      id: 8,
      icon: IconSptUserBet,
      title: t('h5_header_profile_drop_down_menu_my_bets'),
      name: 'my-bets',
      path: `/casino/my-bets?type=${isRouteSports.value ? 'sports' : 'casino'}`,
    },
    // 返水中心
    isHaveVIPRebateConfig.value
      ? {
          id: 14,
          icon: IconUniRebatereal,
          title: t('vip_rebate_center'),
          name: 'rebate-center',
          path: '/rebate-center?tab=rebate',
        }
      : undefined,
    {
      id: 10,
      icon: IconChessGameshow,
      title: t('promo_activity'),
      name: 'promotion',
      path: '/promotion',
    },
    {
      id: 13,
      icon: IconUniCoupon,
      title: t('menu-coupon'),
      name: 'coupon',
    },
    {
      id: 9,
      icon: IconUniSet,
      title: t('setting'),
      name: 'settings',
      path: appContentWidth.value <= 800 ? '/settings' : '/settings/general',
    },
    VITE_SITE_NAME !== 'x02' ? {
      id:15,
      icon: IconUserSelfExclusion,
      title:t('extend'),
      name:t('self_exclusion'),
      path:'/self-exclusion'
    } : null,
    {
      id: 11,
      icon: IconChessOnlineSupport,
      title: t('online_support'),
      name: 'online-support',
    },
    {
      id: 12,
      icon: IconUniLogout,
      title: t('logout'),
      name: 'logout',
    },
  ].filter(item => !!item) as Record<string, any>[]))

  function handleClickMenuItem(item: { name: string; path?: string }) {
    const { name, path } = item
    if (path) {
      if (isMobile.value && leftIsExpand.value) {
        closeLeftSidebar(() => {
          router.push(path)
        })
      }
      else {
        router.push(path)
      }
      return
    }
    switch (name) {
      case 'wallet':
        openWalletDialog()
        break
      case 'safe':
        openSafeDialog()
        break
      case 'logout':
        openLogoutDialog()
        break
      case 'statistical-data':
        openStatisticsDialog(userInfo.value?.username)
        break
      case 'chat-room':
        getActiveShown.value(EnumRightSidebarContent.CHATROOM)
          ? closeRightSidebar()
          : openRightSidebar(EnumRightSidebarContent.CHATROOM)
        break
      case 'bet-slip':
        getActiveShown.value(EnumRightSidebarContent.BETTING)
          ? closeRightSidebar()
          : openRightSidebar(EnumRightSidebarContent.BETTING)
        break
      case 'notification':
        getActiveShown.value(EnumRightSidebarContent.NOTIFICATION)
          ? closeRightSidebar()
          : openRightSidebar(EnumRightSidebarContent.NOTIFICATION)
        isMobile.value && leftIsExpand.value && closeLeftSidebar()
        break
      case 'sports-betting':
        router.push(`/sports/${getSportsPlatId()}/my-bets?type=sports`)
        break
      case 'online-support':
        openService({ isFootBar: false, needDeal: true })
        break
      case 'realTimeRebate':
        openRealTimeRebateDialog()
        break
      case 'coupon':
        openCouponDialog()
        break
      default:
        break
    }
  }

  return {
    userMenu,
    handleClickMenuItem,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserMenuStore, import.meta.hot))

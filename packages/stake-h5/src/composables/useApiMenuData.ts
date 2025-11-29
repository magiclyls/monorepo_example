import type { EnumLanguageKeys } from '@tg/types'
import {
  IconNavbarUser,
  IconChessStar,
  IconChessGameRecord,
  IconSptUserBet,
  IconNavbarWallet,
  IconUniRebatereal,
  IconNavbarCart,
  IconChessVipclub,
  IconUniTrend,
  IconTabbarBet,
  IconUniLogout,
  IconChessGameshow,
  IconChessAffiliate,
  IconSptSecure,
  IconSptOnlineSupport,
  IconTimeSharp,
  IconSptOdds,
  IconUniSet
} from '@tg/icons';

export interface MenuItem {
  title: string
  icon: Component
  path?: string
  fullPath?: string
  list?: Menu
  domId?: string
  token?: boolean
  className?: string
  modalQuery?: { [k: string]: any }
  type?: 'radio'
  value?: any
  radioChange?: (val: any) => void
  fixtureCount?: number
  /** 有path，不会执行 */
  callBack?: () => void
  useCloudImg?: boolean
  clazz?: string
  sptToken?: boolean
  /** 活动菜单加的方法，比path优先，不会触发path */
  backFun?: () => void
  accordHeadClick?: () => void
  promo_id?: string
}

export type Menu = Array<MenuItem>

export function useApiMenuData() {
  const { openWalletDialog } = useWalletDialog()
  const { openSafeDialog } = useSafeDialog()
  const { openStatisticsDialog } = useStatisticsDialog()
  const { openLogoutDialog } = useLogoutDialog()
  const {
    openRightSidebar,
    closeRightSidebar,
    rightIsExpand,
    currentRightSidebarContent,
  } = useRightSidebar()
  const {
    activitySidebar,
  } = useActivityMenu()
  const appStore = useAppStore()
  const { t } = useI18n()
  const { isLogin, userInfo, isVipOpen } = storeToRefs(appStore)
  const { casinoSidebar: casinoGameList } = storeToRefs(useCasinoStore())
  const languageStore = useLanguageStore()
  const { userLanguage, validLangList } = storeToRefs(languageStore)
  const { langChoosed, brandConfig } = storeToRefs(useBrandStore())
  const { openService } = useService()
  const { rebateAutomatic } = useVipInfo()
  const route = useRoute()
  const { openRealTimeRebateDialog } = useDialogRealTimeRebate()
  const router = useLocalRouter()
  const { closeLeftSidebar, openLeftSidebar, leftIsExpand } = useLeftSidebar()
  const menuStore = useMenuStore()
  const { isMobile, isLessThanLg, appContentWidth } = storeToRefs(useWindowStore())
  const { isOpen } = storeToRefs(useAffiliate())
  // casino
  const casinoMenu = computed<Menu>(() => [
    {
      title: t('home_left_sidebar_sports_tab_favourites'),
      path: '/casino/favourites',
      icon: IconChessStar,
      list: [],
      domId: '',
      token: true,
    },
    {
      title: t('h5_pop_up_menu_recent'),
      path: '/casino/recent',
      icon: IconChessGameRecord,
      list: [],
      domId: '',
      token: true,
    },
    // isLogin.value && isMobile.value
    //   ? {
    //       title: t('notification_center'),
    //       path: '',
    //       icon: 'navbar-notice',
    //       list: [],
    //       domId: 'notification',
    //       token: true,
    //       callBack: () => {
    //         openRightSidebar(EnumRightSidebarContent.NOTIFICATION)
    //         setTimeout(() => {
    //           closeLeftSidebar()
    //         }, 300)
    //       },
    //     }
    //   : undefined,
    {
      title: t('h5_pop_up_menu_my_bets'),
      path: '/casino/my-bets?type=casino',
      icon: IconSptUserBet,
      list: [],
      domId: '',
      token: true,
    },
    isLogin.value && rebateAutomatic.value && +rebateAutomatic.value.automatic === 3 && userInfo.value && +userInfo.value.rebate_state === 1 && +userInfo.value.bonus_state === 1
      ? {
          domId: 'realTimeRebateDomId',
          path: '',
          list: [],
          token: true,
          icon: IconUniRebatereal,
          title: t('real_time_rebate'),
          callBack: () => openRealTimeRebateDialog(),
        }
      : undefined,
  ].filter(m => !!m))

  const isRouteSports = computed(() => route.name?.toString().includes('sports'))

  const getActiveShown = computed(() => {
    return (shown: string) => rightIsExpand.value
    && shown === currentRightSidebarContent.value
  })
  const staticMenu1 = computed<Menu[]>(() => [
    isLogin.value
      ? {
          title: t('profile'),
          path: '',
          icon: IconNavbarUser,
          list: [
            {
              title: t('wallet'),
              path: '',
              icon: IconNavbarWallet,
              callBack: () => {
                openWalletDialog()
              },
            },
            globalInitMap.allBrandInfo?.base?.interest === 1
              ? {
                  title: t('safe'),
                  path: '',
                  icon: IconNavbarCart,
                  callBack: () => openSafeDialog(),
                }
              : undefined,
            isVipOpen.value
              ? {
                  title: t('vip'),
                  path: '/vip?tab=vipBonus',
                  icon: IconChessVipclub,
                }
              : undefined,
            {
              title: t('statistical_data_dialog_title'),
              path: '',
              icon: IconUniTrend,
              callBack: () => openStatisticsDialog(),
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
            {
              title: t('notification'),
              path: '',
              icon: IconTabbarBet,
              callBack: () => {
                getActiveShown.value(EnumRightSidebarContent.NOTIFICATION)
                  ? closeRightSidebar()
                  : openRightSidebar(EnumRightSidebarContent.NOTIFICATION)
              },
            },
            { title: t('setting'), path: '/settings/general', icon:IconUniSet },
            {
              title: t('logout'),
              path: '',
              icon: IconUniLogout,
              callBack: () => openLogoutDialog(),
              clazz: 'has-line',
            },
          ].filter(i => i !== undefined),
          domId: 'static-menu-user',
        }
      : undefined,
    {
      title: t('promo_activity'),
      path: activitySidebar.value && activitySidebar.value.length > 1 ? '' : '/promotion',
      icon: IconChessGameshow,
      list: activitySidebar.value && activitySidebar.value.length > 1 ? activitySidebar.value : [],
      domId: 'static-menu-promotion',
      accordHeadClick: () => {
        if (activitySidebar.value && activitySidebar.value.length > 1) {
          console.log('pro', activitySidebar.value)
        }
        else {
          if ((isMobile.value || isLessThanLg.value) && leftIsExpand.value) {
            closeLeftSidebar(() => {
              router.push('/promotion')
            })
          }
          else {
            router.push('/promotion')
          }
        }
      },
    },
    isVipOpen.value
      ? {
          title: `${t('vip_club')}`,
          path: '/vip-club',
          icon: IconChessVipclub,
          list: [],
          domId: '',
        }
      : undefined,
    isOpen.value
      ? {
          title: t('affiliate'),
          path: '/affiliate/invitation-link',
          icon: IconChessAffiliate,
          list: [],
          domId: '',
        }
      : undefined,
  ].filter(i => i !== void 0))
  const staticMenu2 = computed<Menu[]>(() => [
    {
      title: t('h5_left_side_menu_responsible_casino'),
      path: '/responsible-gambling/safe',
      icon: IconSptSecure,
      list: [],
      domId: '',
    },
    {
      title: t('home_left_sidebar_online_support'),
      path: '',
      icon: IconSptOnlineSupport,
      list: [],
      domId: '',
      callBack: () => openService({ isFootBar: false, needDeal: true }),
    },
    {
      title: `
    ${t('language_title')}${userLanguage.value === 'en-US' ? '：' : ': '}
    ${validLangList.value.filter(a => a.value === userLanguage.value)[0]?.title}
  `,
      path: '',
      icon: IconSptOdds,
      type: 'radio',
      value: userLanguage.value,
      radioChange: (val: EnumLanguageKeys) => languageStore.changeLanguage(val),
      list: validLangList.value,
      domId: 'static-menu-language',
    },
    {
      title: dayjs(dayjs().format('YYYY-MM-DD HH:mm').toString()).tz(useLanguageStore().currentLangZone).format('YYYY-MM-DD HH:mm'),
      icon: IconTimeSharp,
      className: 'current_language_area_time',
      list: [],
      domId: '',
    },
  ].filter(f => f !== undefined))

  function menuItemClick(item: MenuItem) {
    if (item.domId)
      Local.set(STORAGE_MENU_EXPAND_DOMID, item.domId)
    if (item.backFun) {
      item.backFun()
    }
    else if (item.path && item.path.length) {
      if ((isMobile.value || isLessThanLg.value) && leftIsExpand.value) {
        closeLeftSidebar(() => {
          router.push(replaceSportsPlatId(item.path!))
        })
      }
      else {
        router.push(replaceSportsPlatId(item.path))
      }
      menuStore.setSideBigActiveMenu(item.path)
    }
    else if (item.list && item.list.length) {
      openLeftSidebar()
    }
    else if (item.callBack) {
      item.callBack()
    }
    // else if (item.modalQuery) {
    // if (isMobile.value)
    //   closeLeftSidebar()
    // router.push({
    //   path: route.path,
    //   query: { ...route.query, ...item.modalQuery },
    // })
    // }
  }

  return {
    casinoMenu,
    casinoGameList,
    staticMenu1,
    staticMenu2,
    menuItemClick,
  }
}

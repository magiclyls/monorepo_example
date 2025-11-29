import type { EnumLanguageKeys } from '@tg/types'
import {
  IconChessStar,
  IconChessGameRecord,
  IconChessVipclub,
  IconChessGameshow,
  IconSptOnlineSupport,
  IconSptOdds,
  IconTypeHelp,
  IconSlotGame
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
  const appStore = useAppStore()
  const { t } = useI18n()
  const { isVipOpen } = storeToRefs(appStore)
  const { casinoSidebar: casinoGameList } = storeToRefs(useCasinoStore())
  const languageStore = useLanguageStore()
  const { userLanguage, validLangList } = storeToRefs(languageStore)
  const { openService } = useService()
  const router = useLocalRouter()
  const { closeLeftSidebar, openLeftSidebar } = useLeftSidebar()
  const menuStore = useMenuStore()
  // casino
  const casinoMenu = computed<Menu>(() => {

    return [
      {
        title: t('h5_pop_up_menu_game'),
        path: '',
        icon: IconSlotGame,
        list: [],
        domId: 'game',
        token: false,
      },
      {
        title: t('home_left_sidebar_sports_tab_favourites'),
        path: '/casino/favourites',
        icon: IconChessStar,
        list: [],
        domId: 'favorite',
        token: true,
      },
      {
        title: t('recent'),
        path: '/casino/recent',
        icon: IconChessGameRecord,
        list: [],
        domId: 'recent',
        token: true,
      },
    ].filter(m => !!m);
  })

  const staticMenu1 = computed<MenuItem[]>(() => [
    {
      title: t('promo_activity'),
      path: '/promotion',
      icon: IconChessGameshow,
      list: [],
      domId: 'static-menu-promotion',
      accordHeadClick: () => {
        router.push('/promotion')
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
  ].filter(i => i !== void 0))

  const staticMenu2 = computed<MenuItem[]>(() => [
    {
      title: t('help_space_title'),
      path: '/help',
      icon: IconTypeHelp,
      list: [],
      domId: '',
    },
    {
      title: t('online_customer_service'),
      path: '',
      icon: IconSptOnlineSupport,
      list: [],
      domId: '',
      callBack: () => openService({ isFootBar: false, needDeal: true }),
    },
    {
      title: `
    ${t('language_title')}: 
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
  ].filter(f => f !== undefined))

  function menuItemClick(item: MenuItem) {
    if (item.domId)
      Local.set(STORAGE_MENU_EXPAND_DOMID, item.domId)
    if (item.backFun) {
      item.backFun()
    }
    else if (item.path && item.path.length) {
      // closeLeftSidebar(() => {
      //   router.push(replaceSportsPlatId(item.path!))
      // })
      router.push(replaceSportsPlatId(item.path!))
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

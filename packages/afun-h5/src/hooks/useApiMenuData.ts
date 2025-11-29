import type { EnumLanguageKeys, MenuItem } from '@tg/types'
import { useActivityMenu, useService } from '@tg/hooks'
import {
  IconChessGameRecord,
  IconChessGameshow,
  IconChessStar,
  IconChessVipclub,
  IconHelp,
  IconSlotGame,
  IconSptOdds,
  IconSptOnlineSupport,
} from '@tg/icons'
import { useAffiliate, useAppStore, useCasinoStore, useVipStore } from '@tg/stores'
import { Local, replaceSportsPlatId, STORAGE_MENU_EXPAND_DOMID } from '@tg/utils'
import { getLangConfig, i18n } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRightSidebar } from '~/pages/chat/_hook/useRightSidebar'
import { useMenuStore } from '~/stores/menu'
import { usePreferredLanguage } from './useLang'
import { useLeftSidebar } from './useLeftSidebar'

export type Menu = Array<MenuItem>

export function useApiMenuData() {
  // const { openWalletDialog } = useWalletDialog()
  // const { openSafeDialog } = useSafeDialog()
  // const { openStatisticsDialog } = useStatisticsDialog()
  // const { openLogoutDialog } = useLogoutDialog()
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
  const { t } = i18n.global
  const { isVipOpen } = storeToRefs(useVipStore())
  const { isLogin, userInfo } = storeToRefs(appStore)
  const { casinoSidebar: casinoGameList } = storeToRefs(useCasinoStore())
  // const languageStore = useLanguageStore()
  // const { userLanguage, AllLanguages } = storeToRefs(languageStore)
  const { rebateAutomatic } = storeToRefs(useVipStore())
  const { openService } = useService()
  const route = useRoute()
  // const { openRealTimeRebateDialog } = useDialogRealTimeRebate()
  const router = useRouter()
  const { closeLeftSidebar, openLeftSidebar, leftIsExpand } = useLeftSidebar()
  const menuStore = useMenuStore()
  const { isOpen } = storeToRefs(useAffiliate())
  // casino
  const currentLangZone = ref(getLangConfig()?.zone)
  const { validLangList, setLanguage, selectedLang, initLanguage } = usePreferredLanguage()
  const casinoMenu = computed<Menu>(() => [
    {
      title: t('游戏'),
      path: '',
      icon: IconSlotGame,
      list: [],
      domId: 'game',
      token: false,
    },
    {
      title: t('收藏'),
      path: '/favourites',
      icon: IconChessStar,
      list: [],
      domId: 'favorite',
      token: true,
    },
    {
      title: t('最近的'),
      path: '/recent',
      icon: IconChessGameRecord,
      list: [],
      domId: 'recent',
      token: true,
    },
  ].filter(m => !!m))

  const isRouteSports = computed(() => route.name?.toString().includes('sports'))

  const getActiveShown = computed(() => {
    return (shown: string) => rightIsExpand.value
      && shown === currentRightSidebarContent.value
  })
  const staticMenu1 = computed<MenuItem[]>(() => [
    {
      title: t('促销活动'),
      path: '/promotions',
      icon: IconChessGameshow,
      list: [],
      domId: 'static-menu-promotion',
      accordHeadClick: () => {
        closeLeftSidebar(() => {
          router.push('/promotions')
        })
      },
    },
    isVipOpen.value
      ? {
          title: `${t('VIP俱乐部')}`,
          path: '/vip',
          icon: IconChessVipclub,
          list: [],
          domId: '',
        }
      : undefined,
  ].filter(i => i !== void 0))
  const staticMenu2 = computed<MenuItem[]>(() => [
    {
      title: t('帮助'),
      path: '/policies/help',
      icon: IconHelp,
      list: [],
      domId: '',
    },
    {
      title: t('在线客服'),
      path: '/service',
      icon: IconSptOnlineSupport,
      list: [],
      domId: '',
      // callBack: () => openService({ isFootBar: false, needDeal: true }),
    },
    {
      title: `
        ${t('语言')}${selectedLang.value?.value === 'en-US' ? '：' : ': '}
        ${validLangList.value.filter(a => a.value === selectedLang.value?.value)[0]?.title}
      `,
      path: '',
      icon: IconSptOdds,
      type: 'radio',
      value: selectedLang.value?.value,
      radioChange: (val: EnumLanguageKeys) => setLanguage(val),
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
      if (leftIsExpand.value) {
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
      closeLeftSidebar()
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

  watchEffect(() => initLanguage())

  return {
    casinoMenu,
    casinoGameList,
    staticMenu1,
    staticMenu2,
    menuItemClick,
  }
}

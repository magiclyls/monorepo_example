import { globalInitMap, Local, STORAGE_MENU_ACTIVE_ITEM } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const sideBigActiveMenu = ref(Local.get(STORAGE_MENU_ACTIVE_ITEM)?.value ?? '')
  const footerBarCasinoRoute = ref()
  const footerBarSportsRoute = ref()
  // logo 点击回娱乐城首页还是体育首页判断
  const lastLogoShouldGo = ref('casino')

  function setLastLogoShouldGo(item: string) {
    lastLogoShouldGo.value = item
  }

  function setSideBigActiveMenu(p: string) {
    Local.set(STORAGE_MENU_ACTIVE_ITEM, p)
    sideBigActiveMenu.value = p
  }

  function setFooterBarCasinoRoute(item: string) {
    footerBarCasinoRoute.value = item.replace(`/${getLangForBackend()}`, '')
  }

  function setFooterBarSportsRoute(item: string) {
    footerBarSportsRoute.value = item.replace(`/${getLangForBackend()}`, '')
  }

  const isShowOriginalSport = computed(() => globalInitMap?.allBrandInfo?.base?.nativeTY ?? true)

  return {
    footerBarCasinoRoute,
    footerBarSportsRoute,
    lastLogoShouldGo,
    sideBigActiveMenu,
    isShowOriginalSport,
    setSideBigActiveMenu,
    setFooterBarCasinoRoute,
    setFooterBarSportsRoute,
    setLastLogoShouldGo,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useMenuStore, import.meta.hot))

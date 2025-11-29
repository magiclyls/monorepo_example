import { ApiMemberBrandKefuSign } from '@tg/apis'

export const useService = createGlobalState(() => {
  const { VITE_OFFICIAL_DOMAIN, VITE_CASINO_IMG_CLOUD_URL } = getEnv()

  // timeStamp
  const time = ref(dayjs().valueOf())

  const { rightIsExpand, currentRightSidebarContent, closeRightSidebar, openRightSidebar } = useRightSidebar()
  const { bool: serviceState, setBool } = useBoolean(rightIsExpand.value && currentRightSidebarContent.value === EnumRightSidebarContent.SERVICE)
  const { userInfo, isLogin, logoAndIcoAndLoading } = storeToRefs(useAppStore())
  const { isMobile } = storeToRefs(useWindowStore())
  const { brandKf } = storeToRefs(useBrandStore())
  const { push } = useLocalRouter()
  const { data: sign } = useRequest(ApiMemberBrandKefuSign, {
    ready: isLogin,
    manual: false,
  })

  const serviceUrl = computed(() => {
    if (!brandKf.value)
      return ''

    const detail = brandKf.value.find((item: any) => +item.state === 1)

    let str = ''
    if (isLogin.value && userInfo.value)
      str = `&username=${userInfo.value.username}&sign=${sign.value}`

    return detail && detail.url
      ? (`${detail.url}&lang=${getCurrentUrlLanguage()}${str}&VITE_OFFICIAL_DOMAIN=${VITE_OFFICIAL_DOMAIN}&LOGO_URL=${`${VITE_CASINO_IMG_CLOUD_URL}/${logoAndIcoAndLoading.value.logo_white}`}&time=${time.value}`)
      : ''
  })

  /**
   * 打开客服
   */
  function openService({ isFootBar = false, needDeal = false }: { isFootBar: boolean, needDeal: boolean }) {
    if (isMobile.value) {
      setBool(true)
      if (!isFootBar) {
        const footbarBtn = document.getElementById('h5-footbar-kefu')
        footbarBtn?.click()
      }
      else if (needDeal) {
        dealOpen()
      }
      lockBodyScroll(true)
    }
    else {
      setBool(true)
    }
  }

  function dealOpen() {
    if (rightIsExpand.value) {
      console.log('哈哈哈哈', currentRightSidebarContent.value)
      if (currentRightSidebarContent.value === EnumRightSidebarContent.SERVICE) {
        console.log('111111')
        closeService()
        closeRightSidebar()
        return
      }
      console.log('222222')
      currentRightSidebarContent.value = EnumRightSidebarContent.SERVICE
      return
    }
    currentRightSidebarContent.value = null
    openRightSidebar(EnumRightSidebarContent.SERVICE)
  }

  /**
   * 关闭客服
   */
  function closeService() {
    setBool(false)
    lockBodyScroll(false)
  }

  return {
    serviceState,
    openService,
    closeService,
  }
})

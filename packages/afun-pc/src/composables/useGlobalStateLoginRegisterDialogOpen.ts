export const useGlobalStateLoginRegisterDialogOpen = createGlobalState(() => {
  const { bodyWidth, isMobile } = storeToRefs(useWindowStore())

  const isLoginDialogOpen = ref(false)
  const isRegisterDialogOpen = ref(false)

  /**
   * 需要满屏的登陆注册
   * 白、绿、新stake、默认模板移动端
   */
  const isUseMobileScreen = computed(() => {
    return ['white', 'green'].includes(globalInitMap.currentTheme) || isMobile.value
  })
  /** 判断是否需要在当前模板中使用下面逻辑，登录注册：pc和h5的动态切换问题 */
  const isUseCurrentTemplate = computed(() => ![6, 1].includes(globalInitMap.currentTemplate))
  const tgDialogListWrapElement = document.getElementById('tg-dialog-list')

  // 解决pc时全屏登陆注册划入动画从外面划进来问题
  function addTgDialogListWrapOnFullScreen() {
    /** 📝如果是在手机上使用，就不用这个wrapper */
    const isOnPhoneOpen = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    const isMobilePWA = isOnPhoneOpen && isPwa()
    const isMobileBrowser = isOnPhoneOpen && !isPwa()
    if (isMobilePWA || isMobileBrowser)
      return

    if (isUseMobileScreen.value && isUseCurrentTemplate.value) {
      tgDialogListWrapElement?.classList.add('tg-dialog-list-wrap-on-full-screen')
      tgDialogListWrapElement?.style.setProperty('width', `${bodyWidth.value}px`)
      tgDialogListWrapElement?.style.setProperty('height', '100%')
    }
  }
  function removeTgDialogListWrapOnFullScreen() {
    if (isUseMobileScreen.value && isUseCurrentTemplate.value) {
      setTimeout(() => {
        if (!isLoginDialogOpen.value && !isRegisterDialogOpen.value) {
          tgDialogListWrapElement?.classList.remove('tg-dialog-list-wrap-on-full-screen')
          tgDialogListWrapElement?.style.setProperty('width', 'auto')
          tgDialogListWrapElement?.style.setProperty('height', 'auto')
        }
      }, 300)
    }
  }

  function whenFullScreenDialogOpen() {
    addTgDialogListWrapOnFullScreen()
    // 用来改变通知的高度（暂时不需要）
    //   document.body.style.setProperty('--tg-notification-list-app-pwa-define-top', '0')
    //   document.body.style.setProperty('--pc-h5model-left-notify-list', `calc(100% / 2 - ${bodyWidth.value / 2}px)`)
  }
  function whenFullScreenDialogClose() {
    // 用来改变通知的高度（暂时不需要）
    //   document.body.style.setProperty('--tg-notification-list-app-pwa-define-top', '126px')
    //   document.body.style.setProperty('--pc-h5model-left-notify-list', `calc(100% / 2 - ${bodyWidth.value / 2 - 16}px)`)
  }

  function toggleLoginDialogState(state: boolean) {
    isLoginDialogOpen.value = state

    if (state)
      whenFullScreenDialogOpen()
    else
      whenFullScreenDialogClose()
  }
  function toggleRegisterDialogState(state: boolean) {
    isRegisterDialogOpen.value = state

    if (state)
      whenFullScreenDialogOpen()
    else
      whenFullScreenDialogClose()
  }

  return {
    isLoginDialogOpen,
    isRegisterDialogOpen,
    toggleLoginDialogState,
    toggleRegisterDialogState,
    removeTgDialogListWrapOnFullScreen,
  }
})

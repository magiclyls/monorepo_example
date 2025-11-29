// import AppDialogLogin from '~/components/AppDialogLogin.vue'
// import AppDialogLoginV2 from '~/components/AppDialogLoginV2.vue'

export function useLoginDialog() {
  const { isMobile } = storeToRefs(useWindowStore())
  const { toggleLoginDialogState } = useGlobalStateLoginRegisterDialogOpen()
  /**
   * 需要满屏的登陆注册
   * 白、绿、新stake、默认模板移动端
   */
  const isNeedFullScreenLogin = computed(() => ['white', 'green'].includes(globalInitMap.currentTheme) || isMobile.value)

  const { openDialog: openLoginDialogIn, closeDialog: closeLoginDialog } = useDialog({
    id: 'unique_tg_login_dialog_id_local',
    title: '',
    icon: '',
    // todo
    clazz: `app-dialog-login-v2${isNeedFullScreenLogin.value ? '-h5' : ''}`,
    showLoad: false,
    isPreload: true,
    preloadName: 'login_dialog',
    backgroundColor: 'var(--tg-dialog_style_login_register-bg)',

    // default: () => h(defaultSlot),
  })

  return {
    openLoginDialog: (p?: any) => {
      if (isFlutterApp()) {
        sendMsgToFlutterApp(SendFlutterAppMessage.DIALOG_LOGIN)
      }
      else {
        toggleLoginDialogState(true)

        openLoginDialogIn({ is_first_load: true })
        openLoginDialogIn({ ...p })
        // 新版pc
        // openLoginDialogIn({ is_first_load: true, maxWidth: 733 })
        // openLoginDialogIn({ maxWidth: 733, ...p })
        // }
      }
    },
    closeLoginDialog,
  }
}

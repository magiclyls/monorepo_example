// import AppDialogRegister from '~/components/AppDialogRegister.vue'
// import AppDialogRegisterV2 from '~/components/AppDialogRegisterV2.vue'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'
export function useRegisterDialog() {
  const { isMobile } = storeToRefs(useWindowStore())
  const { toggleRegisterDialogState } = useGlobalStateLoginRegisterDialogOpen()
  /**
   * 需要满屏的登陆注册
   * 白、绿、新stake、默认模板移动端
   */
  const isNeedFullScreenRegister = computed(() => ['white', 'green'].includes(globalInitMap.currentTheme) || isMobile.value)

  const { openDialog: openRegisterDialogIn, closeDialog: closeRegisterDialog } = useDialog({
    id: 'unique_tg_register_dialog_id_local',
    title: '',
    icon: '',
    // todo
    clazz: `app-dialog-register-v2${isNeedFullScreenRegister.value ? '-h5' : ''}`,
    showLoad: false,
    isPreload: true,
    preloadName: 'register_dialog',
    backgroundColor: 'var(--tg-dialog_style_login_register-bg)',
    // default: () => h(AppDialogRegisterV2),
  })

  return {
    openRegisterDialog: (p?: any) => {
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.REGISTERCLICK)
      sendMsgToAdjust(SendFlutterThirdPartyAppMessage.REGISTERCLICK)
      if (isFlutterApp()) {
        sendMsgToFlutterApp(SendFlutterAppMessage.DIALOG_REGISTER)
      }
      else {
        toggleRegisterDialogState(true)

        openRegisterDialogIn({ is_first_load: true })
        openRegisterDialogIn({ ...p })
        // 新版带bannerPC
        // openRegisterDialogIn({ is_first_load: true, maxWidth: 733 })
        // openRegisterDialogIn({ maxWidth: 733, ...p })
        // }
      }
    },
    closeRegisterDialog,
  }
}

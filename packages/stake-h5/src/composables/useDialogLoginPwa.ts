import { ApiOnPwaDialogClose } from '@tg/apis'
import AppDialogLoginPwa from '~/components/AppDialogLoginPwa.vue'

export function useDialogLoginPwa() {
  const { theme } = storeToRefs(useAppStore())
  const { isLogin } = storeToRefs(useAppStore())
  const {
    openDialog: openLoginPwaDialog,
    closeDialog: closeLoginPwaDialog,
  } = useDialog({
    /** 比存款PWA高一级 */
    zIndex: 9001,
    default: () => h(AppDialogLoginPwa, { isInNormalDialog: true }),
    backgroundColor: 'transparent',
    closeIconStyle: theme.value === 'greenblack' ? 'stroke-width: 1px; color: #B1BAD3; size-[20px]' : 'stroke-width: 1px; color: #fff; size-[20px]',
    closeIcon: 'uni-pwa-close',
    onDialogClose() {
      isLogin.value && ApiOnPwaDialogClose({ lang: getCurrentLanguageForBackend() })
    },
  })

  return {
    // openLoginPwaDialog: () => {
    //   openDialog({
    //     height: '100%',
    //     maxHeight: '100%',
    //     maxWidth: document.documentElement.clientWidth,
    //     hasPadding: false,
    //   })
    // },
    openLoginPwaDialog,
    closeLoginPwaDialog,
  }
}

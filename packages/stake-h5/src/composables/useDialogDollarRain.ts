import AppDialogDollarRainCss from '~/components/AppDialogDollarRainCss.vue'

export function useDialogDollarRain() {
  const { isLogin } = storeToRefs(useAppStore())
  const {
    openDialog: openDialogDollarRainInner,
    closeDialog: closeDialogDollarRain,
  } = useDialog({
    id: 'tg-app-unique-dollar-rain-dialog-local',
    transparent: true,
    modalContentScrollY: false,
    showClose: false,
    maxHeight: window.innerHeight,
    maxWidth: window.innerWidth,
    closeOnClickOverlay: false,
    hasPadding: false,
    default: ({ pid, isBRL, isCrystal }) => h(AppDialogDollarRainCss, { pid, isBRL, isCrystal }),
  })

  return {
    openDialogDollarRain: (params?: { pid: string; isBRL: boolean; isCrystal: boolean }) => {
      if (isLogin.value) {
        if (isFlutterApp())
          sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DOLLAR_RAIN_MODAL, params)
        else
          openDialogDollarRainInner({ ...params })
      }
    },
    closeDialogDollarRain,
  }
}

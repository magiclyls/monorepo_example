import AppDialogDollarWaveBonus from '~/components/AppDialogDollarWaveBonus.vue'

export function useDialogDollarWaveBonus() {
  const {
    openDialog: openDialogDollarWaveBonusInner,
    closeDialog: closeDialogDollarWaveBonus,
  } = useDialog({
    transparent: true,
    modalContentScrollY: false,
    showClose: false,
    hasPadding: false,
    onBeforeDialogClose: () => {
      appEventBus.emit(EventBusNames.PROMO_REDRAIN_BONUSDIALOG_CLOSE)
    },
    default: ({ pid, firstBonusData, bonusData, nextScope, exchangeCb, isBRL, closeCb, showCount, isCrystal, currencyName }) => h(AppDialogDollarWaveBonus, { pid, firstBonusData, bonusData, nextScope, exchangeCb, isBRL, closeCb, showCount, isCrystal, currencyName }),
  })

  return {
    openDialogDollarWaveBonus: (p: any) => {
      if (isFlutterApp()) {
        sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DOLLAR_RAIN_RESULT_MODAL, p)
        return
      }
      openDialogDollarWaveBonusInner(p)
    },
    closeDialogDollarWaveBonus,
  }
}

import AppDialogTurnWithdraw from '~/components/AppDialogTurnWithdraw.vue'

export function useDialogTurnWithdraw() {
  const { t } = useI18n()
  const {
    openDialog: openTurnWithdrawDialog,
    closeDialog: closeTurnWithdrawDialog,
  } = useDialog({
    default: data => h(AppDialogTurnWithdraw, data),
  })

  return {
    openTurnWithdrawDialog,
    closeTurnWithdrawDialog,
  }
}

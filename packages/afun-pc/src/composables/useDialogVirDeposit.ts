import AppDialogVirDeposit from '~/components/AppDialogVirDeposit.vue'

export function useDialogVirDeposit() {
  const {
    openDialog: openDepositVirDialog,
    closeDialog: closeDepositVirDialog,
  } = useDialog({
    default: data => h(AppDialogVirDeposit, data),
  })

  return {
    openDepositVirDialog,
    closeDepositVirDialog,
  }
}

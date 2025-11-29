import AppDialogDeposit from '~/components/AppDialogDeposit.vue'

export function useDialogDeposit() {
  const {
    openDialog: openDepositDialog,
    closeDialog: closeDepositDialog,
  } = useDialog({
    default: data => h(AppDialogDeposit, data),
  })

  return {
    openDepositDialog,
    closeDepositDialog,
  }
}

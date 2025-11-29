import AppDialogVirtDeposit from '~/components/AppDialogVirtDeposit.vue'

export function useDialogVirtDeposit() {
  const {
    openDialog: openDepositVirtDialog,
    closeDialog: closeDepositVirtDialog,
  } = useDialog({
    default: data => h(AppDialogVirtDeposit, data),
  })

  return {
    openDepositVirtDialog,
    closeDepositVirtDialog,
  }
}

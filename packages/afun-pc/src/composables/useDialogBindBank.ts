import AppBindBankDialog from '~/components/AppBindBankDialog.vue'

export function useDialogBindBank() {
  const {
    openDialog: openBindBankDialog,
    closeDialog: closeBindBankDialog,
  } = useDialog({
    default: props => h(AppBindBankDialog, props),
  })

  return {
    openBindBankDialog,
    closeBindBankDialog,
  }
}

import AppAddPixDialog from '~/components/AppAddPixDialog.vue'

export function useDialogAddPix() {
  const {
    openDialog: openAddPixDialog,
    closeDialog: closeAddPixDialog,
  } = useDialog({
    default: props => h(AppAddPixDialog, props),
  })

  return {
    openAddPixDialog,
    closeAddPixDialog,
  }
}

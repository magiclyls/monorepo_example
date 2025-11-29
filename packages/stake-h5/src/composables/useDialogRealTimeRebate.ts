import AppRealTimeRebateDialog from '~/components/AppRealTimeRebateDialog.vue'

export function useDialogRealTimeRebate() {
  const {
    openDialog: openRealTimeRebateDialog,
    closeDialog: closeRealTimeRebateDialog,
  } = useDialog({
    showClose: false,
    modalContentScrollY: false,
    default: () => h(AppRealTimeRebateDialog),
  })

  return {
    openRealTimeRebateDialog,
    closeRealTimeRebateDialog,
  }
}

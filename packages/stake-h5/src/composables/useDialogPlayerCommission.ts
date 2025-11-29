import AppDialogPlayerCommission from '~/components/AppDialogPlayerCommission.vue'

export function useDialogPlayerCommission() {
  const {
    openDialog: openPlayerCommissionDialog,
    closeDialog: closePlayerCommissionDialog,
  } = useDialog({
    default: data => h(AppDialogPlayerCommission, data),
  })

  return {
    openPlayerCommissionDialog,
    closePlayerCommissionDialog,
  }
}

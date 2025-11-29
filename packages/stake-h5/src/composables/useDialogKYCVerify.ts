import AppDialogKYCVerify from '~/components/AppDialogKYCVerify.vue'

export function useDialogKYCVerify() {
  const {
    openDialog: openKYCDialog,
    closeDialog: closeKYCDialog,
  } = useDialog({
    default: props => h(AppDialogKYCVerify, props),
  })

  return {
    openKYCDialog,
    closeKYCDialog,
  }
}

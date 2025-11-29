import AppDialogPassword from '~/components/AppDialogPassword.vue'

export function useDialogPassword() {
  const {
    openDialog: openDialogPassword,
    closeDialog: closeDialogPassword,
  } = useDialog({
    default: props => h(AppDialogPassword, props),
  })

  return {
    openDialogPassword,
    closeDialogPassword,
  }
}

import AppDialogShareRegisterLink from '~/components/AppDialogShareRegisterLink.vue'

export function useDialogShareRegisterLink() {
  const {
    openDialog: openShareRegisterLinkDialog,
    closeDialog: closeShareRegisterLinkDialog,
  } = useDialog({
    default: data => h(AppDialogShareRegisterLink, data),
  })

  return {
    openShareRegisterLinkDialog,
    closeShareRegisterLinkDialog,
  }
}

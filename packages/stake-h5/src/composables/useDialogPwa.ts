import AppPwaDialog from '~/components/AppPwaDialog.vue'

export function useDialogPwa() {
  const {
    openDialog: openPwaDialog,
    closeDialog: closePwaDialog,
  } = useDialog({
    /** 比红包雨高一点 */
    zIndex: 9000,
    title: '',
    icon: '',
    transparent: true,
    showClose: false,
    default: () => h(AppPwaDialog, { isInNormalDialog: true }),
  })

  return {
    openPwaDialog,
    closePwaDialog,
  }
}

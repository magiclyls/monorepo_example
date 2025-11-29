import AppDownLoadDialog from '~/components/AppDownLoadDialog.vue'

export function useDialogAppDownload() {
  const {
    openDialog: openAppDownloadDialog,
    closeDialog: closeAppDownloadDialog,
  } = useDialog({
    title: '',
    icon: '',
    transparent: true,
    showClose: false,
    default: () => h(AppDownLoadDialog, { isInNormalDialog: true }),
  })

  return {
    openAppDownloadDialog,
    closeAppDownloadDialog,
  }
}

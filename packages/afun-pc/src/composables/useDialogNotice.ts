import AppDialogNotice from '~/components/AppDialogNotice.vue'

export function useDialogNotice() {
  const { t } = useI18n()
  const { openDialog: openNoticeDialog, closeDialog: closeNoticeDialog } = useDialog({
    title: t('notice'), // site_announcement
    icon: 'uni-notice-ygg',
    default: data => h(AppDialogNotice, { data }),
  })

  return {
    openNoticeDialog,
    closeNoticeDialog,
  }
}

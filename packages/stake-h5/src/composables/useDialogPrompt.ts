import AppDialogPrompt from '~/components/AppDialogPrompt.vue'

export function useDialogPrompt() {
  const { t } = useI18n()
  const { openDialog: openPromptDialog, closeDialog: closePromptDialog } = useDialog({
    title: t('warm_tip'), // site_announcement
    icon: 'uni-tips',
    default: data => h(AppDialogPrompt, { data }),
    onDialogClose() {
    },
  })

  return {
    openPromptDialog,
    closePromptDialog,
  }
}

import
AppAgentCommissionRecordDialog
  from '~/components/AppAgentCommissionRecordDialog.vue'

export function useDialogAgentCommissionRecord() {
  const { t } = useI18n()
  const title = computed(() => t('commission_record'))
  const {
    openDialog: openAgentCommissionRecordDialog,
    closeDialog: closeAgentCommissionRecordDialog,
  } = useDialog({
    title: title.value,
    icon: 'tabbar-bet',
    showLoad: true,
    backgroundColor: 'var(--tg-dialog_style_login_register-bg)',
    default: () => h(AppAgentCommissionRecordDialog),
  })

  return {
    openAgentCommissionRecordDialog,
    closeAgentCommissionRecordDialog,
  }
}

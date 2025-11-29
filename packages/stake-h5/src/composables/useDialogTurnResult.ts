import AppDialogTurnResult from '~/components/AppDialogTurnResult.vue'

export function useDialogTurnResult() {
  const { t } = useI18n()
  const {
    openDialog: openTurnResultDialog,
    closeDialog: closeTurnResultDialog,
  } = useDialog({
    title: t('get_free_coins'),
    icon: 'uni-activity-roulette',
    default: data => h(AppDialogTurnResult, data),
  })

  return {
    openTurnResultDialog,
    closeTurnResultDialog,
  }
}

import AppDialogGetMoreReps from '~/components/AppDialogGetMoreReps.vue'

export function useDialogGetMoreReps() {
  const { t } = useI18n()
  const {
    openDialog: openGetMoreRepsDialog,
    closeDialog: closeGetMoreRepsDialog,
  } = useDialog({
    title: t('get_more_reps'),
    icon: 'uni-activity-roulette',
    default: data => h(AppDialogGetMoreReps, data),
  })

  return {
    openGetMoreRepsDialog,
    closeGetMoreRepsDialog,
  }
}

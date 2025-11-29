import AppDialogFreeGetMany from '~/components/AppDialogFreeGetMany.vue'

export function useDialogFreeGetMany() {
  const { t } = useI18n()
  const {
    openDialog: openFreeGetManyDialog,
    closeDialog: closeFreeGetManyDialog,
  } = useDialog({
    title: t('get_free_coins'),
    icon: 'uni-activity-roulette',
    default: data => h(AppDialogFreeGetMany, data),
  })

  return {
    openFreeGetManyDialog,
    closeFreeGetManyDialog,
  }
}

import AppeRebateDetailDialog from '~/components/AppeRebateDetailDialog.vue'

export function useDialogRebatedetail() {
  const { t } = useI18n()
  const title = computed(() => t('rebate_rate'))
  const {
    openDialog: openRebateDetailDialog,
    closeDialog: closeRebateDetailDialog,
  } = useDialog({
    title: title.value,
    default: data => h(AppeRebateDetailDialog,
      {
        givenData: data,
      },
    ),
  })

  return {
    openRebateDetailDialog,
    closeRebateDetailDialog,
  }
}

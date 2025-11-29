import AppDialogBetSlipSports from '~/components/AppDialogBetSlipSports.vue'

export function useDialogBetSlipSports() {
  const { t } = useI18n()
  const title = computed(() => t('menu_title_settings_bets'))
  const {
    openDialog: openBetSlipDialogSports,
    closeDialog: closeBetSlipDialogSports,
  } = useDialog({
    title: title.value,
    icon: 'uni-checklist',
    default: (p: { data: any }) => h(AppDialogBetSlipSports,
      {
        sportsData: p.data,
      },
    ),
  })

  return {
    openBetSlipDialogSports,
    closeBetSlipDialogSports,
  }
}

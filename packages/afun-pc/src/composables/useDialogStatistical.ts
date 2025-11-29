import AppStatisticsDialogVue from '~/components/AppStatisticsDialog.vue'

export function useStatisticsDialog() {
  const { t } = useI18n()
  const { isLogin } = storeToRefs(useAppStore())
  const title = computed(() => t('statistical_data'))
  const {
    openDialog: openStatisticsDialog,
    closeDialog: closeStatisticsDialog,
  } = useDialog({
    title: title.value,
    icon: 'uni-trend',
    height: isLogin.value ? 550 : 0,
    // height: 550,
    statistics: true,
    default: (userName?: string) => h(AppStatisticsDialogVue, { userName }),
  })

  return {
    openStatisticsDialog,
    closeStatisticsDialog,
  }
}

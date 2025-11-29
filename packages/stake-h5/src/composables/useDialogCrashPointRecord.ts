import AppDialogCrashPointRecord from '~/components/AppDialogCrashPointRecord.vue'

export function useDialogCrashPointRecord() {
  const { t } = useI18n()
  const {
    openDialog: openCrashPointRecord,
    closeDialog: closeCrashPointRecord,
  } = useMiniGamePublicInsertDialog({
    title: t('crash_point_record'),
    icon: 'tabbar-bet',
    default: () => h(AppDialogCrashPointRecord),
  })

  return {
    openCrashPointRecord,
    closeCrashPointRecord,
  }
}

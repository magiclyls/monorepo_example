import AppDialogTurntableFirst from '~/components/AppDialogTurntableFirst.vue'

export function useDialogTurntableFirst() {
//   const { t } = useI18n()
  const {
    openDialog: openTurntableFirstDialog,
    closeDialog: closeTurntableFirstDialog,
  } = useDialog({
    showClose: false,
    transparent: true,
    default: data => h(AppDialogTurntableFirst, data),
  })
  return {
    openTurntableFirstDialog,
    closeTurntableFirstDialog,
  }
}

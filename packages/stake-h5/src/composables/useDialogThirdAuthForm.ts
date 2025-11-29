import AppAuthThirdFormDialog from '~/components/AppAuthThirdFormDialog.vue'

export function useDialogThirdAuthForm() {
  // const { t } = useI18n()
  // const title = computed(() => `${t('reg')} OAuth`)
  const {
    openDialog: openThirdAuthFormDialog,
    closeDialog: closeThirdAuthFormDialog,
  } = useDialog({
    default: ({ data, ty }) => h(AppAuthThirdFormDialog, { data, ty }),
  })

  return {
    openThirdAuthFormDialog,
    closeThirdAuthFormDialog,
  }
}

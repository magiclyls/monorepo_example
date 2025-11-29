import AppMultiBetExplainDialog from '~/components/AppMultiBetExplainDialog.vue'

export function useMultiBetExplainDialog() {
  const {
    openDialog: openMultiBetExplainDialog,
    closeDialog: closeMultiBetExplainDialog,
  } = useDialog({
    default: props => h(AppMultiBetExplainDialog, props),
    showClose: false,
    maxWidth: 263,
  })

  return {
    openMultiBetExplainDialog,
    closeMultiBetExplainDialog,
  }
}

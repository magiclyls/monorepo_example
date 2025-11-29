import AppAddVirAddressDialog from '~/components/AppAddVirAddressDialog.vue'

export function useVirAddressDialog() {
  const {
    openDialog: openVirAddressDialog,
    closeDialog: closeVirAddressDialog,
  } = useDialog({
    default: props => h(AppAddVirAddressDialog, props),
  })

  return {
    openVirAddressDialog,
    closeVirAddressDialog,
  }
}

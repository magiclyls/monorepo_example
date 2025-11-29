import AppDialogUpdatePhone from '~/components/AppDialogUpdatePhone.vue'

export function useDialogUpdatePhone({ onCloseCallback }: { onCloseCallback: () => void }) {
  const {
    openDialog: openDialogUpdatePhone,
    closeDialog: closeDialogUpdatePhone,
  } = useDialog({
    onDialogClose() {
      onCloseCallback()
    },
    default: (data: {
      phone: string
      areaCode: string
      uid: string
    }) => h(AppDialogUpdatePhone, { data }),
  })

  return {
    openDialogUpdatePhone,
    closeDialogUpdatePhone,
  }
}

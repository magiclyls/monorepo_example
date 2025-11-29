import AppDialogFacialRecognition from '~/components/AppDialogFacialRecognition.vue'

export function useDialogFacialRecognition() {
  const {
    openDialog: openDialogFacialRecognition,
    closeDialog: closeDialogFacialRecognition,
  } = useDialog({
    default: props => h(AppDialogFacialRecognition, props),
  })

  return {
    openDialogFacialRecognition,
    closeDialogFacialRecognition,
  }
}

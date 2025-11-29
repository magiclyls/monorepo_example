import AppDialogMarqueeDetail from '~/components/AppDialogMarqueeDetail.vue'

export function useDialogMarqueeDetail() {
  const {
    openDialog: openMarqueeDetailDialog,
    closeDialog: closeMarqueeDetailDialog,
  } = useDialog({
    default: props => h(AppDialogMarqueeDetail, props),
  })

  return {
    openMarqueeDetailDialog,
    closeMarqueeDetailDialog,
  }
}

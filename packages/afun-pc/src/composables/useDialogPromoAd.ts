import AppDialogPromoAd from '~/components/AppDialogPromoAd.vue'

export function usePromoAdDialog() {
  const {
    openDialog: openPromoAdDialog,
    closeDialog: closePromoAdDialog,
  } = useDialog({
    showClose: false,
    transparent: true,
    allowMultipleDialog: true,
    default: data => h(AppDialogPromoAd, { data }),
  })

  return {
    openPromoAdDialog,
    closePromoAdDialog,
  }
}

import AppDialogCoupon from '~/components/AppDialogCoupon.vue'

export function useDialogCoupon() {
  const {
    openDialog: openCouponDialog,
    closeDialog: closeCouponDialog,
  } = useDialog({
    default: props => h(AppDialogCoupon, props),
  })

  return {
    openCouponDialog,
    closeCouponDialog,
  }
}

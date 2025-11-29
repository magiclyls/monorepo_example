// import AppDialogForgetPassword from '~/components/AppDialogForgetPassword.vue'
import AppDialogForgetPasswordV2 from '~/components/AppDialogForgetPasswordV2.vue'

export function useDialogForgetPassword() {
  // const { t } = useI18n()
  // const title = computed(() => t('pop_up_forgot_password'))
  const {
    openDialog: openForgetPasswordDialog,
    closeDialog: closeForgetPasswordDialog,
  } = useDialog({
    // title: title.value,
    // icon: 'uni-set',
    title: '',
    icon: '',
    default: () => h(AppDialogForgetPasswordV2),
  })

  return {
    openForgetPasswordDialog,
    closeForgetPasswordDialog,
  }
}

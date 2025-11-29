import AppDialogUnloginFirstRechargeBonus from '~/components/AppDialogUnloginFirstRechargeBonus.vue'

export function useDialogUnloginFirstRechargeBonus() {
  const {
    openDialog: openDialogUnloginFirstRechargeBonus,
    closeDialog: closeDialogUnloginFirstRechargeBonus,
  } = useDialog({
    title: '',
    icon: '',
    maxWidth: 332,
    transparent: true,
    // modalContentScrollY: false,
    default: data => h(AppDialogUnloginFirstRechargeBonus, { data }),
  })

  return {
    openDialogUnloginFirstRechargeBonus,
    closeDialogUnloginFirstRechargeBonus,
  }
}

import AppDialogFirstRechargeBonus from '~/components/AppDialogFirstRechargeBonus.vue'

export function useDialogFirstRechargeBonus() {
  const {
    openDialog: openDialogFirstRechargeBonus,
    closeDialog: closeDialogFirstRechargeBonus,
  } = useDialog({
    title: '',
    icon: '',
    maxWidth: 332,
    transparent: true,
    default: data => h(AppDialogFirstRechargeBonus, { data }),
  })

  return {
    openDialogFirstRechargeBonus,
    closeDialogFirstRechargeBonus,
  }
}

import AppVipBonusDialog from '~/components/AppVipBonusDialog.vue'

export function useDialogVipBonus() {
  // const { t } = useI18n()
  const {
    openDialog: openVipBonusDialog,
    closeDialog: closeVipBonusDialog,
  } = useDialog({
    // title,
    icon: 'uni-bonus',
    // height: 240,
    default: ({ bonusType, vipBonusId, currencyId }) =>
      h(AppVipBonusDialog, {
        bonusType,
        vipBonusId,
        currencyId,
      }),
  })

  return {
    openVipBonusDialog,
    closeVipBonusDialog,
  }
}

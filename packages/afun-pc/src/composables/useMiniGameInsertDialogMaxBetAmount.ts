import AppMiniGamePartMaxBetAmountDIalog from '~/components/AppMiniGamePartMaxBetAmountDIalog.vue'
import { i18n } from '@tg/vue-i18n'

export function useMiniGameInsertDialogMaxBetAmount() {
  const { t } = i18n.global

  const {
    openDialog: openMiniGameInsertMaxBetAmountDialog,
    closeDialog: closeMiniGameInsertMaxBetAmountDialog,
  } = useMiniGamePublicInsertDialog({
    title: t('mini_max_bet_amount'),
    icon: 'uni-edit-amount',
    default: () => h(AppMiniGamePartMaxBetAmountDIalog),
  })

  return {
    openMiniGameInsertMaxBetAmountDialog,
    closeMiniGameInsertMaxBetAmountDialog,
  }
}

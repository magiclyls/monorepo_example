import AppDialogPromoInviteDetail from '~/components/AppDialogPromoInviteDetail.vue'
import { i18n } from '@tg/vue-i18n'
import type { CurrencyCode } from '~/composables/useCurrencyData'

export function useDialogPromoInviteDetail() {
  const { t } = i18n.global

  const {
    openDialog: openDialogInviteDetail,
    closeDialog: closeDialogInviteDetail,
  } = useDialog({
    title: t('promo_invite_detail'),
    icon: 'uni-group',
    default: (data: { pid: string;currencyId: CurrencyCode }) => h(AppDialogPromoInviteDetail, { data }),
  })

  return {
    openDialogInviteDetail,
    closeDialogInviteDetail,
  }
}

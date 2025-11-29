import AppDialogSiteAnnouncement from '~/components/AppDialogSiteAnnouncement.vue'
import AppDialogNoMoreToday from '~/components/AppDialogNoMoreToday.vue'
import { i18n } from '@tg/vue-i18n'

export function useDialogSiteAnnouncement() {
  const { t } = i18n.global

  const {
    openDialog: openDialogSiteAnnouncement,
    closeDialog: closeDialogSiteAnnouncement,
  } = useDialog({
    insert: true,
    title: t('site_announcement'),
    icon: 'uni-speaker',
    noMoreToday: true,
    backgroundColor: 'var(--tg-notice-bg-color)',
    default: data => h(AppDialogSiteAnnouncement, { data }),
    bottomSlot: () => h(AppDialogNoMoreToday),
  })

  return {
    openDialogSiteAnnouncement,
    closeDialogSiteAnnouncement,
  }
}

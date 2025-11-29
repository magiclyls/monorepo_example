import AppDialogInviteFriendHelp from '~/components/AppDialogInviteFriendHelp.vue'

export function useDialogInviteFriendHelp() {
  // const { t } = useI18n()
  const {
    openDialog: openInviteFriendHelpDialog,
    closeDialog: closeInviteFriendHelpDialog,
  } = useDialog({
    default: data => h(AppDialogInviteFriendHelp, data),
  })

  return {
    openInviteFriendHelpDialog,
    closeInviteFriendHelpDialog,
  }
}

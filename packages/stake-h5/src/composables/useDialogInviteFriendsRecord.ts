import AppDialogInviteFriendsRecord from '~/components/AppDialogInviteFriendsRecord.vue'

export function useDialogInviteFriendsRecord() {
  const {
    openDialog: openInviteFriendsRecordDialog,
    closeDialog: closeInviteFriendsRecordDialog,
  } = useDialog({
    default: props => h(AppDialogInviteFriendsRecord, props),
  })

  return {
    openInviteFriendsRecordDialog,
    closeInviteFriendsRecordDialog,
  }
}

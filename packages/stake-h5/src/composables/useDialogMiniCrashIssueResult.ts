import AppMiniGameCrashResultAndRanking from '~/components/AppMiniGameCrashResultAndRanking.vue'

export function useDialogCrashIssueResult() {
  const { t } = useI18n()
  const {
    openDialog: openCrashIssueResult,
    closeDialog: closeCrashIssueResult,
  } = useMiniGamePublicInsertDialog({
    title: `Crash ${t('game')}`,
    icon: 'tabbar-bet',
    default: (issue_id: string) => h(AppMiniGameCrashResultAndRanking, { issueId: issue_id }),
  })

  return {
    openCrashIssueResult,
    closeCrashIssueResult,
  }
}

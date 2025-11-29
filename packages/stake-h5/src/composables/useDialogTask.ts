import TaskRebateDay from '~/pages/[lang]/task/rebate-day.vue'
import TaskDepositeDay from '~/pages/[lang]/task/deposite-day.vue'

export function useDialogTask() {
  const { openDialog: openTaskDialog, closeDialog: closeTaskDialog } = useDialog({

    default: ({ ty, data }) => h(ty === 4 ? TaskDepositeDay : TaskRebateDay, {
      data,
    }),
    backgroundColor: 'var(--tg-dialog_style-bg2)',
  })

  return {
    openTaskDialog,
    closeTaskDialog,
  }
}

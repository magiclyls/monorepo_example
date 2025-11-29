export function useTaskHooks() {
  const { t } = useI18n()
  const TaskInnerD = defineAsyncComponent(() => import('~/pages/[lang]/task/task-inner-d.vue'))
  const TaskInnerB = defineAsyncComponent(() => import('~/pages/[lang]/task/task-inner-b.vue'))

  const TASKINNERB = ({ id, ty }: { id: string;ty: string }) => `/task/task-inner-b?id=${id}`
  const TASKINNERD = ({ id, ty }: { id: string;ty: string }) => `/task/task-inner-d?id=${id}&ty=${ty}`

  const { openDialog: openTaskInnerD } = useDialog({
    title: t('task_detail'),
    clazz: 'app-task-center-dialog',
    default: params => h(TaskInnerD, params),
  })
  const { openDialog: openTaskInnerB } = useDialog({
    title: t('task_detail'),
    clazz: 'app-task-center-dialog',
    default: params => h(TaskInnerB, params),
  })
  const pcDialogMap = new Map([
    ['4', (params: { id: string; ty: string }) => openTaskInnerD(params)],
    ['5', (params: { id: string }) => openTaskInnerB(params)],
    ['8', (params: { id: string; ty: string }) => openTaskInnerD(params)],
  ])
  const mobileRouterMap = new Map([
    ['4', TASKINNERD],
    ['5', TASKINNERB],
    ['8', TASKINNERD],
  ])
  return {
    mobileRouterMap,
    pcDialogMap,
  }
}

import { ApiMemberNotificationsCount } from '@tg/apis'

export const useNotificationState = createGlobalState(() => {
  const { isLogin } = storeToRefs(useAppStore())
  const {
    data: notificationsCount,
    run: runNotificationsCount,
  } = useRequest(ApiMemberNotificationsCount, {
    manual: false,
    ready: isLogin,
  })

  const showState = computed(() => {
    if (isLogin.value) {
      const values = notificationsCount.value ? Object.values(notificationsCount.value) : []
      return values.reduce((accumulator, currentValue) => accumulator + currentValue, 0) > 0
    }
    else {
      return false
    }
  })

  return {
    notificationsCount,
    showState,
    runNotificationsCount,
  }
})

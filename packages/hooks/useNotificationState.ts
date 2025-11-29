import { ApiMemberNotificationsCount } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { createGlobalState } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRequest } from 'vue-request'

export const useNotificationState = createGlobalState(() => {
  const { isLogin } = storeToRefs(useAppStore())
  const {
    data: notificationsCount,
    run: runNotificationsCount,
  } = useRequest(ApiMemberNotificationsCount, {
    manual: false,
    ready: isLogin,
  })

  const countTotal = computed(() => {
    return Number(notificationsCount.value?.station_count || 0)
      + Number(notificationsCount.value?.notice_count || 0)
      + Number(notificationsCount.value?.reward_count || 0)
      // + Number(notificationsCount.value?.notification_count || 0)
  })

  const countAllTotal = computed(() => {
    return Number(notificationsCount.value?.station_count || 0)
      + Number(notificationsCount.value?.notice_count || 0)
      + Number(notificationsCount.value?.reward_count || 0)
      + Number(notificationsCount.value?.notification_count || 0)
  })

  const showState = computed(() => {
    if (isLogin.value) {
      return countTotal.value > 0
    }
    else {
      return false
    }
  })

  return {
    notificationsCount,
    showState,
    countTotal,
    countAllTotal,
    runNotificationsCount,
  }
})

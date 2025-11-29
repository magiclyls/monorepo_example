import { ApiMemberLogout } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import { Local, sendMsgToFlutterThirdPartyApp, socketClient, STORAGE_PROMO_AD_POP_UNLOGIN } from '@tg/utils'
import { useRequest } from 'vue-request'

/** 退出登录 */
export function useLogout(callback?: () => void) {
  const appStore = useAppStore()
  const {
    run: runMemberLogout,
    loading: logoutLoading,
  } = useRequest(ApiMemberLogout, {
    onSuccess() {
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.LOGOUT)
      Local.remove(STORAGE_PROMO_AD_POP_UNLOGIN)
      appStore.removeToken()
      appStore.removeUserInfo()
      appStore.setMqttConnectedFalse()
      socketClient.connect('退出 重新连接')
      callback && callback()
      setTimeout(() => {
        location.replace('/')
      }, 0)
    },
  })

  return {
    runMemberLogout,
    logoutLoading,
  }
}

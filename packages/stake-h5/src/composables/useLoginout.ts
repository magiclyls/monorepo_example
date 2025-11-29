import { ApiMemberLogout } from '@tg/apis'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'

/** 退出登录 */
export function useLogout(callback?: () => void) {
  const { closeRightSidebar } = useRightSidebar()
  const appStore = useAppStore()
  const {
    run: runMemberLogout,
    loading: logoutLoading,
  } = useRequest(ApiMemberLogout, {
    onSuccess() {
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.LOGOUT)
      sendMsgToAdjust(SendFlutterThirdPartyAppMessage.LOGOUT)
      Local.remove(STORAGE_PROMO_AD_POP_UNLOGIN)
      appStore.removeToken()
      appStore.removeUserInfo()
      appStore.setMqttConnectedFalse()
      closeRightSidebar()
      socketClient.connect('退出 重新连接')
      callback && callback()
      // setTimeout(() => {
      //   // Local.clear()
      //   location.replace('/')
      // }, 0)
    },
  })

  return {
    runMemberLogout,
    logoutLoading,
  }
}

import { ApiMemberDetail } from '@tg/apis'
import { useBoolean } from '@tg/hooks'
import { getToken, removeToken, setToken } from '@tg/utils'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed } from 'vue'
import { useRequest } from 'vue-request'

export const useAppStore = defineStore('app', () => {
  const { bool: isLogin, setTrue: setLoginTrue, setFalse: setLoginFalse } = useBoolean(!!getToken())

  /** 用户信息 */
  const { data: _userInfo, runAsync: updateUserInfo } = useRequest(ApiMemberDetail, {
    ready: isLogin,
    manual: false,
  })

  const userInfo = computed(() => _userInfo.value)

  /**
   * 登录系统
   * @param token
   */
  function login(token: string) {
    setToken(token)
    setLoginTrue()
  }

  /**
   * 退出登录
   */
  function logout() {
    removeToken()
    setLoginFalse()
  }
  return {
    isLogin,
    userInfo,
    updateUserInfo,
    login,
    logout,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))

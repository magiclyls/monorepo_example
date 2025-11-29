import { ApiMemberAuthConfig } from '@tg/apis'

export const useAuthConfig = createGlobalState(() => {
  const { isLogin } = storeToRefs(useAppStore())

  const {
    loading: loadingAuthConfig,
    data: authConfig,
    runAsync: runMemberAuthConfig,
  } = useRequest(ApiMemberAuthConfig, {
    ready: isLogin,
    manual: false,
    throttleInterval: 500,
  })

  const isSetAuth = computed(() => {
    return authConfig.value?.is_secret === '1'
  })
  const isSetPayPwd = computed(() => {
    return authConfig.value?.is_pay_password === '1'
  })

  const singlePromiseArray = [runMemberAuthConfig()]

  return {
    /** 用户双重验证配置 */
    authConfig,
    /** 用户是否配置资金密码 */
    isSetPayPwd,
    /** 用户是否配置双重验证 */
    isSetAuth,
    loadingAuthConfig,
    runMemberAuthConfig,
    singlePromiseArray,
  }
})

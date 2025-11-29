export function useUserVerify() {
  const { userInfo } = storeToRefs(useAppStore())
  const brandStore = useBrandStore()
  const { isOpenVerify, brandBase } = storeToRefs(brandStore)
  const { isSetPayPwd, isSetAuth } = useAuthConfig()

  const SecuritySafePwd = defineAsyncComponent(() => import('~/components/AppPayPassword.vue'))
  const SecuritySafeCheck = defineAsyncComponent(() => import('~/pages/[lang]/settings/security-safe-check.vue'))
  const AppEmailVerify = defineAsyncComponent(() => import('~/components/AppEmailVerify.vue'))

  // 验证成功过邮箱
  const isEmailVerify = computed(() => userInfo.value?.email_check_state === 1)
  // 验证成功过手机
  const isPhoneVerified = computed(() => userInfo.value?.phone_check_state === 1)

  const getComponent = computed(() => {
    const check = brandBase.value?.verify
    console.log(userInfo.value?.email_check_state === 1, userInfo.value?.phone_check_state === 1, brandStore.isOpenEmailVerify, brandStore.isOpenMobileVerify)
    if ((!isPhoneVerified.value && !isEmailVerify.value && brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify))
      return AppEmailVerify

    else if (brandStore.isOpenEmailVerify && !brandStore.isOpenMobileVerify && !isEmailVerify.value)
      return AppEmailVerify

    else if (brandStore.isOpenMobileVerify && !brandStore.isOpenEmailVerify && !isPhoneVerified.value)
      return AppEmailVerify

    else if (brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify && !isEmailVerify.value && !isPhoneVerified.value)
      return AppEmailVerify

    else if (check?.all === true && !isSetPayPwd.value && !isSetAuth.value)
      return SecuritySafePwd

    else if (check?.otp === true && !isSetAuth.value)
      return SecuritySafeCheck

    else if (check?.password === true && !isSetPayPwd.value)
      return SecuritySafePwd

    else
      return null
  })

  // 如果是双重验证页面
  const isSecuritySafeCheckPage = computed(() => getComponent.value === SecuritySafeCheck)

  return {
    getComponent,
    isEmailVerify,
    isPhoneVerified,
    isSecuritySafeCheckPage,
  }
}

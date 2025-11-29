import { useBoolean } from '@tg/hooks'
import { useAppStore, useBrandStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import AppDoubleVerify from '~/components/AppDoubleVerify.vue'
import AppEmail from '~/components/AppEmail.vue'
import AppPhone from '~/components/AppPhone.vue'
import AppWalletPassword from '~/components/AppWalletPassword.vue'

export function useUserVerify() {
  const { userInfo, isSetPayPwd, isSetAuth } = storeToRefs(useAppStore())
  const brandStore = useBrandStore()
  const { isOpenVerify, brandBase } = storeToRefs(brandStore)

  const { bool: isEmail, toggle: toggleEmail } = useBoolean(brandStore.verifyType === 'email')

  // 验证成功过邮箱
  const isEmailVerify = computed(() => userInfo.value?.email_check_state === 1)
  // 验证成功过手机
  const isPhoneVerified = computed(() => userInfo.value?.phone_check_state === 1)

  const getComponent = computed(() => {
    const check = brandBase.value?.verify

    function EmailAndPhone() {
      return isEmail.value ? AppEmail : AppPhone
    }

    if ((!isPhoneVerified.value && !isEmailVerify.value && brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify))
      return EmailAndPhone()

    else if (brandStore.isOpenEmailVerify && !brandStore.isOpenMobileVerify && !isEmailVerify.value)
      return EmailAndPhone()

    else if (brandStore.isOpenMobileVerify && !brandStore.isOpenEmailVerify && !isPhoneVerified.value)
      return EmailAndPhone()

    else if (brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify && !isEmailVerify.value && !isPhoneVerified.value)
      return EmailAndPhone()

    else if (check?.all === true && !isSetPayPwd.value && !isSetAuth.value)
      return AppWalletPassword

    else if (check?.otp === true && !isSetAuth.value)
      return AppDoubleVerify

    else if (check?.password === true && !isSetPayPwd.value)
      return AppWalletPassword

    else
      return null
  })

  // 如果是双重验证页面
  const isSecuritySafeCheckPage = computed(() => getComponent.value === AppDoubleVerify)

  return {
    getComponent,
    isEmailVerify,
    isPhoneVerified,
    isSecuritySafeCheckPage,
    toggleEmail,
  }
}

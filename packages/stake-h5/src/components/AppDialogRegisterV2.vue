<script setup lang='ts'>
import type { IMemberReg } from '@tg/types'
import { IconUniArrowUpSmall, IconUniArrowUpSmall2, IconUniBack } from '@tg/icons'
import { ApiMemberExists, ApiMemberPhoneSms, ApiMemberReg, ApiMemberSendMailCaptcha } from '@tg/apis'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'

// interface IRegisterConfig {
//   app: {
//     birthday_check: boolean
//     email_validation: boolean
//     phone_validation: boolean
//     email: boolean
//     phone: boolean
//     username: boolean
//   }
//   web: {
//     email: boolean
//     phone: boolean
//     username: boolean
//     birthday_check: boolean
//     email_validation: boolean
//     phone_validation: boolean
//   }
// }
defineOptions({
  name: 'AppDialogRegisterV2',
})

const closeDialog = inject('closeDialog', () => { })

const { captchaButtonId, captchaEleId, showCaptcha, loadingMemberCaptcha } = useAliCaptcha({
  success: () => {
    runRegisterApi()
  },
})

const { setCloseAllDialog } = useDialogState()
const { openLoginDialog } = useLoginDialog()
const { t } = useI18n()
const appStore = useAppStore()
const { brandConfig, isOpenCPFOnRegister } = storeToRefs(useBrandStore())
// const { isMobile } = storeToRefs(useWindowStore())
const route = useRoute()
const { openNotify } = useNotify()
const { bool: pwdStatus, setBool: setPwdStatus } = useBoolean(true)
const { bool: isCode } = useBoolean(false)
const { bool: isCountdown } = useBoolean(false)
const { bool: isPopperShow, setTrue: setPopperShow, setFalse: setPopperHide } = useBoolean(false)
const {
  bool: isShowPasswordVerify,
  setTrue: setShowPasswordVerifyTrue,
  setFalse: setShowPasswordVerifyFalse,
} = useBoolean(false)
const { bool: needSaveFormData, setTrue: setNeedSaveFormDataTrue } = useBoolean(true)
const { bool: isRegBtnLoading, setBool: setIsRegBtnLoading } = useBoolean(false)
const { bool: isRegDeviceNumLoading, setBool: setIsRegDeviceNumLoading } = useBoolean(false)
const { areaCodeOptionsFiltered, clearAreaSearchValue } = useAreaCode()
const { countryCallingCode } = useIpApi()
const notLoginReloadDialog = useNotLoginReloadDialog()
const {
  start,
  reset,
  current,
} = useCountDown({
  time: 60 * 1000,
  onFinish() {
    isCountdown.value = false
  },
})

const phoneInputRef = ref()
const emailRef = ref()
const userNameRef = ref()
const passwordRef = ref()
const birthdayInputRef = ref()
const verifyCodeRef = ref()
const userAgreementRef = ref()
const birthday = ref('')
const q_u = route.query.u ? route.query.u.toString() : ''
const parentUid = ref(q_u)
const parentC = ref(route.query.c ? route.query.c.toString() : '')
const curParams = ref()
const page = ref(1)
const regType = ref('email')

if (brandConfig.value && brandConfig.value.reg && brandConfig.value.reg.length) {
  const { mail: b_mail, phone: b_phone } = brandConfig.value.reg[0]
  if (!b_mail.mail && b_phone.phone)
    regType.value = 'phone'
}

const regTypes = computed(() => [
  { label: t('email'), value: 'email' },
  { label: t('phone'), value: 'phone' },
])
const areaCode = ref(countryCallingCode.value)

/** 注册配置 */
const brandRegDetail = computed(() => brandConfig.value)
// const { data: brandRegDetail, runAsync: runAsyncBrandRegDetail } = useRequest(ApiMemberBrandDetail, {
//   onSuccess(res) {
//     if (res && res.reg && res.reg.length) {
//       const { mail, phone } = res.reg[0]
//       if (!mail.mail && phone.phone)
//         regType.value = 'phone'
//     }
//   },
// })

const regConfig = computed(() => brandRegDetail.value && brandRegDetail.value.reg && brandRegDetail.value.reg.length ? brandRegDetail.value.reg[0] : undefined)

const regDetailConfig = computed(() => {
  if (!regConfig.value) {
    return {
      email: false,
      email_validation: false,
      phone: false,
      phone_validation: false,
      username: false,
      birthday_check: false,
    }
  }
  return {
    email: regConfig.value.mail.mail,
    email_validation: regConfig.value.mail.verify,
    phone: regConfig.value.phone.phone,
    phone_validation: regConfig.value.phone.verify,
    username: regConfig.value.username,
    birthday_check: regConfig.value.birthday,
  }
})
const needEmail = computed(() => regDetailConfig.value.email)
const needPhone = computed(() => regDetailConfig.value.phone)
const needUsername = computed(() => regDetailConfig.value.username)
const needCheckEmail = computed(() => regDetailConfig.value.email_validation)
const needCheckPhone = computed(() => regDetailConfig.value.phone_validation)
const needBirthday = computed(() => regDetailConfig.value.birthday_check)
/** 是否展示tab */
const isShowTab = computed(() => needEmail.value && needPhone.value)
/** 邮箱注册 */
const isEmailRegType = computed(() => regType.value === 'email' && needEmail.value)
/** 手机注册 */
const isPhoneRegType = computed(() => regType.value === 'phone' && needPhone.value)
/** 注册页面 */
const isRegisterForm = computed(() => page.value === 1)
/** 验证码页面 */
const isVerifyPage = computed(() => page.value === 2)
/** 没有收到验证码页面 */
const isNoVerifyPage = computed(() => page.value === 3)
/** 用户协议 */
const isUserAgreement = computed(() => page.value === 4)
const pwdTouched = computed(() => passwordRef.value?.isTouched)
// const brandStore = useBrandStore()

// #region 表单字段验证
const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: validatePassword,
  meta: pwdMeta,
  resetField: resetPassword,
} = useField<string>('password', (value) => {
  let result
  if (!value)
    result = t('pop_up_create_account_password_least_8_characters')
  else if (value.length < 8)
    result = t('pop_up_create_account_password_least_8_characters')
  else if (!upperLowerReg.test(value))
    result = t('pop_up_create_account_password_uppercase_lowercase_letter')
  else if (!lastOneNumberReg.test(value))
    result = t('pop_up_create_account_password_least_1_number')
  else
    result = ''
  if (result && result.length)
    setIsRegBtnLoading(false)
  return result
})
const {
  value: email,
  errorMessage: emailErrorMsg,
  validate: validateEmail,
  setErrors: setEmailErrors,
  setValue: setEmail,
  resetField: resetEmail,
} = useField<string>('email', (value) => {
  const lastDotIdx = value ? value.lastIndexOf('.') : -1
  let result
  if (!value)
    result = t('pop_up_create_account_no_support_email')

  else if (!value.includes('@'))
    result = [t('pop_up_create_account_email_add_char', { delta: '@' })]

  else if (!value.includes('.'))
    result = t('pop_up_create_account_no_dot_email_add_char', { delta: '.' })

  else if (lastDotIdx === value.length - 1)
    result = t('pop_up_create_account_no_support_email')

  else if (value === password.value)
    result = t('email_no_equal_password')

  else if (!emailReg.test(value))
    result = t('pls_input_email')
  else if (value && value.length > 30)
    result = t('pls_input_email')
  else
    result = ''

  // 请在您的电邮地址中加入 “@” 符号
  // 请在您的电邮地址中加入 “.” 符号
  // 电子邮件域不受支持
  // 请输入有效的电邮地址
  if (result && result.length)
    setIsRegBtnLoading(false)

  return result
})
const {
  value: phone,
  errorMessage: phoneErrorMsg,
  validate: valiPhone,
  setErrors: setPhoneError,
  resetField: resetPhone,
} = useField<string>('phone', (value) => {
  let result
  if (areaCode.value === '+63')
    result = philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  else if (areaCode.value === '+86')
    result = chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  else if (areaCode.value === '+55')
    result = brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  else
    result = numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  if (result && result.length)
    setIsRegBtnLoading(false)
  return result
}, { initialValue: '' })
const phoneField = computed(() => `${areaCode.value}-${phone.value}`)
const {
  value: username,
  errorMessage: usernameErrorMsg,
  validate: validateUsername,
  setErrors: setUsernameErrors,
  setValue: setUsername,
  resetField: resetUsername,
} = useField<string>('username', (value) => {
  let result
  if (!value)
    result = t('pop_up_create_account_name_3_char')
  else if (value.length < 6)
    result = t('pop_up_create_account_name_3_char')
  else if (value.match('[^a-zA-Z0-9_]'))
    result = t('pop_up_create_an_account_user_name_has_invalid_char')
  else if (value.length > 30)
    result = t('pop_up_create_account_name_14_char')
  else if (value === password.value)
    result = t('name_no_equal_pwd')
  else if (!usernameReg2.test(value))
    result = t('validate_msg_user_name_tip')
  else
    result = ''
  // 此用户名已被使用，请选择另一用户名。
  // 用户名含有无效的字符
  // 您的用户名长度必须为 6 – 30 个字符。
  if (result && result.length)
    setIsRegBtnLoading(false)
  return result
})

const {
  value: verifyCode,
  errorMessage: verifyCodeErrorMsg,
  validate: valiVerifyCode,
  setValue: setVerifyCode,
} = useField<string>('verifyCode', (value) => {
  if (!value)
    return t('validate_msg_input_code')
  else if (!payPasswordReg.test(value))
    return isEmailRegType.value ? t('validate_msg_regexp_code') : t('validate_msg_regexp_code_phone')
  return ''
})
const {
  value: isAgreeUserAgreement,
  errorMessage: userAgreementErrorMsg,
  validate: valiUserAgreement,
} = useField<boolean>('isAgreeUserAgreement', (value) => {
  if (!value) {
    setIsRegBtnLoading(false)
    return t('please_agree_and_check_the_user_agreement')
  }

  return ''
}, { initialValue: true })
// CPF
const { value: cpf, errorMessage: cpfError, validate: valiCPF } = useField<string>('cpf', (v) => {
  if (!v)
    return t('setting_kyc_cpf_input_pls')
  if (!/^\d{11}$/.test(v))
    return t('format_error')

  return ''
})
// #endregion

const regParams = computed(() => Session.get<IMemberReg>(STORAGE_REG_PARAMS_KEYWORDS)?.value)
if (regParams.value) {
  setEmail(regParams.value.email ?? '', false)
  setUsername(regParams.value.username ?? '', false)
  birthday.value = regParams.value.birthday ?? ''
}
/** 检测是否存在 */
const { runAsync: runExists, loading: existLoading } = useRequest(ApiMemberExists, {
  onSuccess(res, params) {
    // const ty = params[0].ty
    // if (res.exist) {
    //   if (ty === 1)
    //     setUsernameErrors(t('choose_another_name'))
    //   else if (ty === 2)
    //     setEmailErrors(t('email_exists'))
    //   else if (ty === 3)
    //     setPhoneError(t('phone_exists'))
    // }
  },
  onError: (err, params) => {
    console.log(err)
    const ty = params[0].ty
    if (ty === 1)
      setUsernameErrors(t('choose_another_name'))
    else if (ty === 2)
      setEmailErrors(t('email_exists'))
    else if (ty === 3)
      setPhoneError(t('phone_exists'))

    setIsRegBtnLoading(false)
  },
})
/** 发送邮箱验证码 */
const {
  runAsync: runAsyncMemberSendMailCaptcha,
  loading: emailCaptchaLoading,
} = useRequest(() => ApiMemberSendMailCaptcha({ email: email.value }), {
  onSuccess() {
    reset()
    start()
    isCountdown.value = true
    openNotify({
      type: 'success',
      title: t('notify_title_success'),
      message: t('success_send_code'),
    })
  },
})
/** 发送手机验证码 */
const {
  runAsync: runAsyncSendPhoneSms,
  loading: phoneCaptchaLoading,
} = useRequest(() => ApiMemberPhoneSms({ phone: phoneField.value, type: 0 }), {
  onSuccess() {
    reset()
    start()
    isCountdown.value = true
    openNotify({
      type: 'success',
      title: t('notify_title_success'),
      message: t('success_send_code'),
    })
  },
})
/** 注册 */
const {
  run: runMemberReg,
  loading: regLoading,
} = useRequest(ApiMemberReg, {
  manual: true,
  onSuccess: async (res) => {
    setCloseAllDialog(true)
    await nextTick()
    appStore.setToken(res)
    Local.set('local_regist_token', res)
    sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.REGISTERSUCCESS)
    sendMsgToAdjust(SendFlutterThirdPartyAppMessage.REGISTERSUCCESS)
    Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.REGISTER)
    openNotify({
      title: t('tip_pop_up_reg_success_title'),
      type: 'success',
      message: `${t('tip_pop_up_reg_success_title')} ${curParams.value?.username}!`,
    })
    needSaveFormData.value = false
    Session.remove(STORAGE_REG_PARAMS_KEYWORDS)
    await nextTick()
    closeDialog()
    if (isSafari)
      document.querySelector('#tgTopForScroll')?.scrollIntoView({ behavior: 'smooth' })
  },
})
const isApiLoading = computed(() => regLoading.value || phoneCaptchaLoading.value || emailCaptchaLoading.value || isRegBtnLoading.value || loadingMemberCaptcha.value || isRegDeviceNumLoading.value)

/** 点击注册按钮 */
async function onRegisterClick() {
  // if (existLoading.value)
  //   return

  if (needEmail.value && isEmailRegType.value) {
    emailRef.value?.setTouchTrue()
    await validateEmail()
    // await onEmailUsernameBlur(2)
  }

  if (needPhone.value && isPhoneRegType.value)
    await valiPhone()
    // await onEmailUsernameBlur(3)

  if (needUsername.value) {
    userNameRef.value?.setTouchTrue()
    await validateUsername()
    // await onEmailUsernameBlur(1)
  }

  passwordRef.value.setTouchTrue()
  await validatePassword()
  if (pwdErrorMsg.value)
    setShowPasswordVerifyTrue()

  if (needBirthday.value) {
    const birthValid = await birthdayInputRef.value.valiBirthday()
    if (birthValid !== true)
      setIsRegBtnLoading(false)
  }

  // 需要CPF时必填
  if (isOpenCPFOnRegister.value) {
    await valiCPF()
    if (cpfError.value)
      return
  }

  await valiUserAgreement()
  userAgreementRef.value?.refreshTooltipStatus()

  // 这个不要删：有错误时直接返回，否则重复的邮箱或用户名会因通过格式校验从而进行注册请求
  if (
    (needEmail.value && isEmailRegType.value && emailErrorMsg.value)
    || (needPhone.value && isPhoneRegType.value && phoneErrorMsg.value)
    || usernameErrorMsg.value
    || pwdErrorMsg.value
    || (needBirthday.value && !birthdayInputRef.value.isValid)
    || userAgreementErrorMsg.value
  ) {
    setIsRegBtnLoading(false)
    return
  }

  if (isRegBtnLoading.value)
    return
  setIsRegBtnLoading(true)

  if (needEmail.value && isEmailRegType.value)
    await onEmailUsernameBlur(2)

  if (needPhone.value && isPhoneRegType.value)
    await onEmailUsernameBlur(3)

  if (needUsername.value)
    await onEmailUsernameBlur(1)

  // 需要验证邮箱
  if (needCheckEmail.value && isEmailRegType.value) {
    runAsyncMemberSendMailCaptcha().then(() => {
      page.value = 2
    }).finally(() => {
      setIsRegBtnLoading(false)
    })
    return
  }
  // 需要验证手机
  if (needCheckPhone.value && isPhoneRegType.value) {
    runAsyncSendPhoneSms().then(() => {
      page.value = 2
    }).finally(() => {
      setIsRegBtnLoading(false)
    })
    return
  }

  setIsRegBtnLoading(false)
  showCaptcha()
  // runRegisterApi()
}
/** 验证码页面点击提交 */
async function onSubmitClick() {
  await valiVerifyCode()
  if (verifyCodeErrorMsg.value)
    return

  setIsRegBtnLoading(false)
  showCaptcha()
  // runRegisterApi()
}
/** 进行注册请求 */
async function runRegisterApi() {
  setIsRegDeviceNumLoading(true)
  const paramsReg = {
    username: username.value,
    password: password.value,
    parent_uid: parentUid.value.trim() || q_u || (Local.get(STORAGE_UUUUU)?.value || ''),
    c: parentC.value || (Local.get(STORAGE_CCCCC)?.value || ''),
    device_number: await application.getDeviceNumber(),
    birthday: birthday.value,
    captcha: verifyCode.value,
    cpf_number: cpf.value,
  }
  setIsRegDeviceNumLoading(false)
  curParams.value = isEmailRegType.value
    ? { ...paramsReg, email: email.value }
    : { ...paramsReg, phone: phoneField.value }

  // 如果后台关闭了手机验证，把phone字段去掉
  if (!phone.value)
    delete curParams.value.phone

  if (!needUsername.value) {
    if (isEmailRegType.value)
      curParams.value.username = email.value
    else if (isPhoneRegType.value)
      curParams.value.username = phoneField.value?.replace('+', '').replace('-', '')
  }

  // Session.set(STORAGE_REG_PARAMS_KEYWORDS, paramsReg)
  Session.remove(STORAGE_THIRDREG_PARAMS_KEYWORDS)
  setNeedSaveFormDataTrue()
  runMemberReg(curParams.value)
}
/** 点击重新发送 */
function onResendClick() {
  if (isEmailRegType.value)
    runAsyncMemberSendMailCaptcha()
  else
    runAsyncSendPhoneSms()
}

function onPasswordFocus() {
  setShowPasswordVerifyTrue()
}
function onPasswordBlur() {
  if (pwdMeta.dirty) {
    passwordRef.value.setTouchTrue()
    validatePassword()
  }
  if (pwdStatus.value)
    setShowPasswordVerifyFalse()
}
function passwordVerifyPass(status: boolean) {
  setPwdStatus(status)
}
async function onEmailUsernameBlur(type: 1 | 2 | 3) {
  let result
  if (type === 1 && username.value && !usernameErrorMsg.value)
    result = await runExists({ ty: type, val: username.value, noNotify: true })
  if (type === 2 && email.value && !emailErrorMsg.value)
    result = await runExists({ ty: type, val: email.value })
  if (type === 3 && phone.value && !phoneErrorMsg.value)
    result = await runExists({ ty: type, val: phoneField.value, noNotify: true })
  return result
}
async function toLogin() {
  if (notLoginReloadDialog.isShow)
    notLoginReloadDialog.setShowFalse()

  closeDialog()
  await nextTick()
  openLoginDialog()
}
function selectAreaCode(v: string) {
  areaCode.value = v
}

function resetAllField() {
  resetPassword()
  resetEmail()
  resetPhone()
  resetUsername()
  birthdayInputRef.value?.resetBirthday()
}
function onVDropdownHide() {
  setPopperHide()
  clearAreaSearchValue()
}

watch(countryCallingCode, (a) => {
  areaCode.value = a
}, { immediate: true })

watch(isApiLoading, (a) => {
  if (a)
    document.body.classList.add('all-style-disabled')
  else
    document.body.classList.remove('all-style-disabled')
})

watch(verifyCode, (a) => {
  if (a && a.length > 6) {
    nextTick(() => {
      setVerifyCode(a.slice(0, 6))
    })
  }
})

onUnmounted(async () => {
  console.log('注册销毁')
  document.body.classList.remove('all-style-disabled')
  if (!needSaveFormData.value) {
    Session.remove(STORAGE_REG_PARAMS_KEYWORDS)
  }
  else {
    // Session.set(STORAGE_REG_PARAMS_KEYWORDS, paramsReg)
    Session.remove(STORAGE_THIRDREG_PARAMS_KEYWORDS)
  }
})

watch(regConfig, (val) => {
  if (val) {
    const { mail: b_mail, phone: b_phone } = val
    if (!b_mail.mail && b_phone.phone)
      regType.value = 'phone'
    else if (b_mail.mail && b_phone.phone)
      regType.value = 'email'
    else if (!b_mail.mail && !b_phone.phone)
      regType.value = 'email'
    else if (b_mail.mail && !b_phone.phone)
      regType.value = 'email'
  }
})

// await application.allSettled([runAsyncBrandRegDetail()])
</script>

<template>
  <div>
    <div class="grid gap-y-[12px] p-[16px] pb-[32px] pt-[20px]">
      <template v-if="isRegisterForm">
        <h6 class="text-tg-text-white pb-[10px] text-center text-[18px] font-semibold leading-[25px]">
          {{ t('register') }}
        </h6>
        <!-- 选择注册类型 -->
        <div v-if="isShowTab" class="text-tg-text-lightgrey flex justify-evenly text-[16px] font-semibold leading-[20px]">
          <div
            v-for="tab in regTypes" :key="tab.value" class="cursor-pointer border-b-2 border-solid px-[16px] pb-[12px]"
            :class="tab.value === regType ? 'text-tg-text-white  border-tg-primary-active theme-active-border' : 'border-transparent'"
            @click="regType = tab.value; resetAllField()"
          >
            {{ tab.label }}
          </div>
        </div>
        <!-- 表单 -->
        <BaseInput
          v-if="isEmailRegType" ref="emailRef" v-model="email" :placeholder="t('mail')" :msg="emailErrorMsg"
          msg-after-touched type="email" name="email" @blur="onEmailUsernameBlur(2)"
        />
        <div v-else-if="isPhoneRegType" class="flex flex-col">
          <div class="relative flex" style="--tg-input-lefticon-px: 0;--tg-input-lefticon-py: 0;">
            <BaseInput ref="phoneInputRef" v-model="phone" hide-spin-btn input-mode="numeric" type="number" :placeholder="t('new_phone')" @blur="onEmailUsernameBlur(3)">
              <template #left-icon>
                <div class="theme-bg relative flex items-center pl-[12px]" style="--tg-base-select-border: none;--tg-base-select-icon-right:6px;--tg-base-select-small-style-padding-right:22px;--tg-base-select-small-style-padding-left:5px;">
                  <div class="flex-1" style="width: 16px;">
                    <BaseImage v-if="areaCode && areaCode.length" height="16px" width="16px" :url="`/png/flag/${areaCode.slice(1)}.webp`" />
                  </div>
                  <BaseSelect
                    v-model="areaCode"
                    class="theme-select"
                    style="--tg-base-select-text-align: center;"
                    :placeholder="t('intl_phone_pre')" show-placeholder small
                    :border="false" :width="`${areaCode?.length * 11 + 25}px`"
                    :options="areaCodeOptionsFiltered"
                  />
                </div>
              </template>
            </BaseInput>
          </div>
          <div
            v-show="phoneErrorMsg && phoneInputRef.isTouched" class="flex items-center pb-[4px] pt-[8px] text-[12px]"
            style="--tg-icon-color:var(--tg-text-error-sub);"
          >
            <IconUniWarningColor class="error-icon" />
            <span class="text-tg-text-error-sub ml-[4px]">{{ phoneErrorMsg }}</span>
          </div>
        </div>
        <div v-if="needUsername" class="flex flex-col">
          <BaseInput
            ref="userNameRef" v-model="username" :placeholder="t('username_hint')" :msg="usernameErrorMsg"
            name="name" msg-after-touched @blur="onEmailUsernameBlur(1)"
          />
        <!-- <div v-if="!usernameErrorMsg" class="text-tg-secondary-light pb-[4px] pr-[4px] pt-[8px] text-[12px]">
          {{ t('pop_up_create_account_username_incorrect') }}
        </div> -->
        </div>
        <BaseInput
          ref="passwordRef" v-model="password" :placeholder="t('login_pwd')" type="password" name="password"
          autocomplete="current-password" msg-after-touched :msg="pwdErrorMsg" @focus="onPasswordFocus"
          @blur="onPasswordBlur"
        />
        <AppPasswordVerify
          v-show="password" :password="password" :has-error-msg="!!pwdErrorMsg" :pwd-touched="pwdTouched"
          type="row" @pass="passwordVerifyPass"
        />
        <BaseInputBirthday v-if="needBirthday" ref="birthdayInputRef" v-model="birthday" />
        <!-- CPF -->
        <BaseInput v-if="isOpenCPFOnRegister" v-model="cpf" max="11" :msg="cpfError" input-mode="numeric" placeholder="CPF" />
        <div class="flex flex-col gap-[4px]">
          <div class="theme-icon flex origin-center cursor-pointer items-center" @click="isCode = !isCode">
            <span class="text-tg-text-lightgrey theme-text mr-[4px] text-[14px] font-semibold">{{ t('input_invite_code') }}</span>
            <IconUniArrowUpSmall v-if="!isCode" />
            <IconUniArrowUpSmall2 v-else name="uni-arrow-up-small2" />
          </div>
          <BaseInput v-if="isCode" v-model="parentUid" :placeholder="t('code2')" />
        </div>
        <div class="flex">
          <BaseCheckBox
            ref="userAgreementRef" v-model="isAgreeUserAgreement" :msg="userAgreementErrorMsg"
            msg-type="tooltip"
          >
            <i18n-t
              keypath="i_agree_and_i_am_18" tag="div"
              class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]"
            >
              <BaseButton type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="page = 4">
                {{ t('user_agreement2') }}
              </BaseButton>
            </i18n-t>
          </BaseCheckBox>
        </div>
        <BaseButton
          :loading="isApiLoading" :disabled="isApiLoading" bg-style="secondary" size="md"
          style="--tg-base-button-font-size:16px;" @click="onRegisterClick"
        >
          {{ t('reg') }}
        </BaseButton>
        <div class="items-center">
          <span class="text-tg-text-lightgrey mr-[4px]">
            {{ t('have_account') }}
          </span>
          <BaseButton
            class="h-[22px]" type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);"
            @click="toLogin"
          >
            {{ t('login') }}
          </BaseButton>
        </div>
        <AppAuthLogin />
      </template>
      <!-- 邮箱或手机验证 -->

      <template v-else-if="isVerifyPage">
        <div class="flex">
          <div class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]" @click="page = 1">
            <IconUniBack class="text-[14px]" />
            <span>{{ isEmailRegType ? t('label_email_check') : t('label_phone_check') }}</span>
          </div>
        </div>

        <i18n-t
          keypath="please_input_your_verification_code" tag="div"
          class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]"
        >
          <span>{{ isEmailRegType ? email : `${areaCode} ${phone}` }}</span>
        </i18n-t>
        <BaseInput
          ref="verifyCodeRef"
          v-model="verifyCode" class="theme-input" max="6" :msg="verifyCodeErrorMsg" type="number"
          :hide-spin-btn="true" input-mode="numeric"
        >
          <template #right-icon>
            <div v-if="isCountdown">
              {{ current.seconds }}s
            </div>
            <BaseButton
              v-else size="none" type="text" style="--tg-base-button-text-default-color:var(--tg-text-white);"
              @click="onResendClick"
            >
              <span class="whitespace-nowrap">{{ t('resend') }}</span>
            </BaseButton>
          </template>
        </BaseInput>
        <div class="flex">
          <BaseButton type="text" size="none" @click="page = 3">
            {{ t('no_verification_code') }}
          </BaseButton>
        </div>
        <BaseButton
          bg-style="secondary" size="md" :loading="isApiLoading" :disabled="isApiLoading"
          style="--tg-base-button-font-size:16px;" @click="onSubmitClick"
        >
          {{ t('submit') }}
        </BaseButton>
      </template>

      <!-- 没收到验证码 -->
      <AppDialogRegisterPartNoReceiveCode
        v-else-if="isNoVerifyPage" :type="isEmailRegType ? 'email' : 'phone'"
        @back="page = 2"
      />

      <template v-else-if="isUserAgreement">
        <div class="flex">
          <div class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]" @click="page = 1">
            <IconUniBack class="text-[14px]" />
            <span>{{ t('user_agreement') }}</span>
          </div>
        </div>
        <div class="theme-bg scroll-y bg-tg-secondary max-h-[324px] rounded-[4px] px-[12px] py-[20px]" @touchstart.stop @touchmove.stop>
          <AppPoliciesTerms />
        </div>
      </template>
    </div>
    <div :id="captchaEleId" />
    <div :id="captchaButtonId" />
  </div>
</template>

<style>
.app-dialog-register-v2 {
  --tg-base-dialog-close-only-padding-top: 22px;
}
</style>

<style lang='scss' scoped>
.theme-bg {
  @include webTheme('green') {
    background-color: #055434;
  }
  @include webTheme('white') {
    background-color: #ffffff;
    border-radius: 4px 0 0 4px;
  }
}
.theme-active-border {
  @include webTheme('white') {
    border-color: #f2ca5c;
  }
}
.theme-text {
  @include webTheme('white') {
    color: #111111;
  }
}
.theme-icon {
  @include webTheme('white') {
    --tg-icon-color: #111111;
  }
}
.theme-select {
  @include webTheme('white') {
    --tg-base-select-box-shadow: none;
    --tg-radius-default: none;
    --tg-base-select-bg-theme-white: #fff;
  }
}
.theme-input {
  @include webTheme('white') {
    --tg-base-input-style-bg: #ffffff;
  }
}
</style>

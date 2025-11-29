<script lang="ts" setup>
import type { IMemberReg } from '@tg/types'
import { IconUniBcClose, IconUniBack, IconUniArrowDown } from '@tg/icons'
import { ApiMemberBrandDetail, ApiMemberExists, ApiMemberPhoneSms, ApiMemberReg, ApiMemberSendMailCaptcha } from '@tg/apis'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'

defineOptions({
  name: 'AppBcGameUserRegister',
})
const { t } = useI18n()
const { isMobile } = storeToRefs(useWindowStore())
const { areaCodeOptionsFiltered, clearAreaSearchValue } = useAreaCode()
const { captchaButtonId, captchaEleId, showCaptcha, loadingMemberCaptcha } = useAliCaptcha({
  success: () => {
    runRegisterApi()
  },
})

const modalStore = useModalStore()
const { setCloseAllDialog } = useDialogState()
const { openLoginDialog } = useLoginDialog()
const appStore = useAppStore()
const route = useRoute()
const { openNotify } = useNotify()
const { bool: pwdStatus, setBool: setPwdStatus } = useBoolean(true)
const { bool: isCountdown } = useBoolean(false)
const {
  bool: isShowPasswordVerify,
  setTrue: setShowPasswordVerifyTrue,
  setFalse: setShowPasswordVerifyFalse,
} = useBoolean(false)
const { bool: needSaveFormData, setTrue: setNeedSaveFormDataTrue } = useBoolean(true)
const { bool: isRegBtnLoading, setBool: setIsRegBtnLoading } = useBoolean(false)
const { bool: isRegDeviceNumLoading, setBool: setIsRegDeviceNumLoading } = useBoolean(false)
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

const isShowUserAgreeMsg = ref(false)
const isShowBcPactMsg = ref(false)
const isCode = ref(false)
//
const emailOrPhoneRef = ref()
const inputPhoneRef = ref()
const userNameRef = ref()
const passwordRef = ref()
const birthdayInputRef = ref()
const verifyCodeRef = ref()
const birthday = ref('')
const q_u = route.query.u ? route.query.u.toString() : ''
const parentUid = ref(q_u)
const parentC = ref(route.query.c ? route.query.c.toString() : '')
const curParams = ref()
const page = ref(1)
const regType = ref('email')
const areaCode = ref(countryCallingCode.value)

/** 注册配置 */
const { data: brandRegDetail, runAsync: runAsyncBrandRegDetail } = useRequest(ApiMemberBrandDetail, {
  onSuccess(res) {
    if (res && res.reg && res.reg.length) {
      const { mail, phone } = res.reg[0]
      if (!mail.mail && phone.phone)
        regType.value = 'phone'
    }
  },
})

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
/** 邮箱手机号placeholder */
const phoneOrEmailPlaceHolder = computed(() => {
  if (isShowTab.value)
    return '电子邮箱/手机号码'
  if (needEmail.value)
    return t('mail')
  if (needPhone.value)
    return t('new_phone')
})
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
  value: phoneOrEmail,
  errorMessage: phoneOrEmailErrorMsg,
  validate: valiPhoneOrEmail,
  setErrors: setPhoneOrEmailError,
  resetField: resetPhoneOrEmail,
  setValue: setPhoneOrEmail,
} = useField<string>('phone', (value) => {
  if (!value)
    return '请填写此字段'
  else if (isPhoneRegType.value)
    return validPhoneVal(value)
  else
    return validEmailVal(value)
}, { initialValue: '' })
function validEmailVal(value: string) {
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
}
function validPhoneVal(value: string) {
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
}

const phoneField = computed(() => `${areaCode.value}-${phoneOrEmail.value}`)

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
    isShowUserAgreeMsg.value = true
    setIsRegBtnLoading(false)
    return t('please_agree_and_check_the_user_agreement')
  }

  return ''
}, { initialValue: true })
const {
  value: isAgreeActivePact,
  errorMessage: userAgreeActivePactErrorMsg,
  validate: valiUserAgreeActivePact,
} = useField<boolean>('isAgreeActivePact', (value) => {
  if (!value) {
    isShowBcPactMsg.value = true
    setIsRegBtnLoading(false)
    return '请勾选并同意促销政策'
  }

  return ''
}, { initialValue: true })
// #endregion

const regParams = computed(() => Session.get<IMemberReg>(STORAGE_REG_PARAMS_KEYWORDS)?.value)
if (regParams.value) {
  setPhoneOrEmail(regParams.value.email ?? '', false)
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
      setPhoneOrEmailError(t('email_exists'))
    else if (ty === 3)
      setPhoneOrEmailError(t('phone_exists'))

    setIsRegBtnLoading(false)
  },
})
/** 发送邮箱验证码 */
const {
  runAsync: runAsyncMemberSendMailCaptcha,
  loading: emailCaptchaLoading,
} = useRequest(() => ApiMemberSendMailCaptcha({ email: phoneOrEmail.value }), {
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
    Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.REGISTER)
    sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.REGISTERSUCCESS)
    sendMsgToAdjust(SendFlutterThirdPartyAppMessage.REGISTERSUCCESS)
    openNotify({
      title: t('tip_pop_up_reg_success_title'),
      type: 'success',
      message: `${t('tip_pop_up_reg_success_title')} ${curParams.value?.username}!`,
    })
    needSaveFormData.value = false
    Session.remove(STORAGE_REG_PARAMS_KEYWORDS)
    await nextTick()
    modalStore.hideModal()
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
    emailOrPhoneRef.value?.setTouchTrue()
    await valiPhoneOrEmail()
    // await onEmailUsernameBlur(2)
  }

  if (needPhone.value && isPhoneRegType.value)
    await valiPhoneOrEmail()
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

  await valiUserAgreement()
  if (isAgreeUserAgreement.value)
    isShowUserAgreeMsg.value = false

  await valiUserAgreeActivePact()
  if (isAgreeActivePact.value)
    isShowBcPactMsg.value = false

  // userAgreementRef.value?.refreshTooltipStatus()

  // 这个不要删：有错误时直接返回，否则重复的邮箱或用户名会因通过格式校验从而进行注册请求
  if (
    (needEmail.value && isEmailRegType.value && phoneOrEmailErrorMsg.value)
    || (needPhone.value && isPhoneRegType.value && phoneOrEmailErrorMsg.value)
    || usernameErrorMsg.value
    || pwdErrorMsg.value
    || (needBirthday.value && !birthdayInputRef.value.isValid)
    || userAgreementErrorMsg.value
    || userAgreeActivePactErrorMsg.value
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
  }
  setIsRegDeviceNumLoading(false)
  curParams.value = isEmailRegType.value
    ? { ...paramsReg, email: phoneOrEmail.value }
    : { ...paramsReg, phone: phoneField.value }

  // 如果后台关闭了手机验证，把phone字段去掉
  if (!needPhone.value)
    delete curParams.value.phone

  if (!needUsername.value) {
    if (isEmailRegType.value)
      curParams.value.username = phoneOrEmail.value
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
  if (type === 2 && phoneOrEmail.value && !phoneOrEmailErrorMsg.value)
    result = await runExists({ ty: type, val: phoneOrEmail.value })
  if (type === 3 && phoneOrEmail.value && !phoneOrEmailErrorMsg.value)
    result = await runExists({ ty: type, val: phoneField.value, noNotify: true })
  return result
}
async function toLogin() {
  if (notLoginReloadDialog.isShow)
    notLoginReloadDialog.setShowFalse()

  modalStore.hideModal()
  await nextTick()
  openLoginDialog()
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
watch(phoneOrEmail, () => {
  if (!isShowTab.value)
    return
  if (phoneOrEmail.value.length < 3) {
    regType.value = 'email'
    nextTick(() => {
      if (emailOrPhoneRef.value) {
        emailOrPhoneRef.value?.getFocus()
        emailOrPhoneRef.value?.setTouchTrue()
      }
    })
  }
  if (phoneOrEmail.value.length > 2) {
    if (numberReg.test(phoneOrEmail.value)) {
      regType.value = 'phone'
      nextTick(() => {
        if (inputPhoneRef.value)
          inputPhoneRef.value?.getFocus()
      })
    }
    else {
      regType.value = 'email'
      nextTick(() => {
        if (emailOrPhoneRef.value)
          emailOrPhoneRef.value?.getFocus()
      })
    }
  }
  valiPhoneOrEmail()
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

await application.allSettled([runAsyncBrandRegDetail()])
</script>

<template>
  <div class="h-full">
    <div class="bc-game-register h-full @md:flex">
      <div class="header relative box-content h-[200px] w-full pt-0 @md:w-1/2">
        <img alt="top-img" class="absolute left-0 w-full overflow-hidden @md:relative" :src="`/stake/png/home/bcgame_register_${isMobile ? 'h5' : 'pc'}.png`">
        <div class="absolute left-0 top-0 z-10 w-full flex items-center justify-between p-[16px] pb-[20px]">
          <img alt="logo" class="h-[32px] w-auto" src="/stake/png/home/bcgame_logo.png">
          <button v-if="isMobile && isRegisterForm" class="center button size-32 rounded-lg bg-[#ffffff0d]" type="button" @click="() => modalStore.hideModal()">
            <IconUniBcClose class="text-[14px]" />
          </button>
        </div>
      </div>
      <div class="relative z-10 h-full w-full flex-1 overflow-hidden px-[24px] @md:px-[24px] @md:py-[24px]">
        <div v-if="!isNoVerifyPage && !isUserAgreement " class="text-tg-text-white mb-[12px] h-[20px] flex items-center text-lg font-extrabold @md:mb-[20px] @md:flex @md:justify-between">
          <span v-if="isRegisterForm">註冊</span>
          <div v-if="isVerifyPage" class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]" @click="page = 1">
            <IconUniBack class="text-[14px]" />
            <span>{{ isEmailRegType ? t('label_email_check') : t('label_phone_check') }}</span>
          </div>
          <button v-if="!isMobile && isRegisterForm" class="button size-32 center rounded-lg bg-[#ffffff0d]" type="button" @click="() => modalStore.hideModal()">
            <IconUniBcClose class="text-[14px] @md:text-[16px]" />
          </button>
        </div>
        <template v-if="isRegisterForm">
          <div v-if="isShowTab || needEmail || needPhone" class="mb-[12px]">
            <!-- 表单 -->
            <BaseInput v-if="isEmailRegType" ref="emailOrPhoneRef" v-model="phoneOrEmail" msg-after-touched :msg="phoneOrEmailErrorMsg" :placeholder="phoneOrEmailPlaceHolder" @blur="onEmailUsernameBlur(2)" />
            <div v-if="isPhoneRegType">
              <div class="relative flex" style="--tg-input-lefticon-px: 0;--tg-input-lefticon-py: 0;">
                <BaseInput ref="inputPhoneRef" v-model="phoneOrEmail" :msg="phoneOrEmailErrorMsg" hide-spin-btn type="email" :placeholder="t('new_phone')" @blur="onEmailUsernameBlur(3)">
                  <template #left-icon>
                    <div class="relative flex items-center pl-[12px]" style="--tg-base-select-border: none;--tg-base-select-icon-right:6px;--tg-base-select-small-style-padding-right:22px;--tg-base-select-small-style-padding-left:5px;">
                      <div class="flex-1" style="width: 16px;">
                        <BaseImage v-if="areaCode && areaCode.length" height="16px" width="16px" :url="`/stake/png/flag/${areaCode.slice(1)}.webp`" />
                      </div>
                      <BaseSelect
                        v-model="areaCode"
                        style="--tg-base-select-text-align: center;"
                        :placeholder="t('intl_phone_pre')" show-placeholder small
                        :border="false" :width="`${areaCode?.length * 11 + 25}px`"
                        :options="areaCodeOptionsFiltered"
                      />
                    </div>
                  </template>
                </BaseInput>
              </div>
            </div>
          </div>
          <div v-if="needUsername" class="mb-[12px]">
            <BaseInput v-model="username" :msg="usernameErrorMsg" :placeholder="t('username_hint')" />
          </div>
          <div class="mb-[12px]">
            <BaseInput
              ref="passwordRef" v-model="password" :placeholder="t('login_pwd')" type="password" name="password"
              autocomplete="current-password" msg-after-touched :msg="pwdErrorMsg" @focus="onPasswordFocus"
              @blur="onPasswordBlur"
            />
            <AppPasswordVerify
              v-show="password" :password="password" :has-error-msg="!!pwdErrorMsg" :pwd-touched="pwdTouched"
              type="row" @pass="passwordVerifyPass"
            />
          </div>
          <div v-if="needBirthday" class="mb-[12px]">
            <BaseInputBirthday ref="birthdayInputRef" v-model="birthday" />
          </div>
          <div class="mb-[12px] mr-[4px] flex cursor-pointer items-center text-[12px] text-[#B3BEC1] @md:text-[14px]" @click="isCode = !isCode">
            <span class="@md:font-extrabold">输入促销/促销代码</span>
            <IconUniArrowDown class="ml-[2px] text-[12px] @md:text-[14px]" :class="isCode ? 'rotate-180 duration-300 ' : ''" />
          </div>
          <div v-if="isCode" class="mb-[12px]">
            <BaseInput v-model="parentUid" :placeholder="t('code2')" />
          </div>
          <div class="mb-[12px]">
            <BaseBcGameCheckBox v-model="isAgreeUserAgreement" v-model:show-msg="isShowUserAgreeMsg" :msg="userAgreementErrorMsg" :label="() => h('div', { class: 'text-[#B3BEC1] @md:text-[14px] text-[12px]' }, [h('span'), null, '我同意', h('span', { class: 'text-white cursor-pointer', onClick: () => page = 4 }, '「用户协议」'), h('span', null, '并确认我已年满 18 岁')])" />
          </div>
          <div class="mb-[12px]">
            <BaseBcGameCheckBox v-model="isAgreeActivePact" v-model:show-msg="isShowBcPactMsg" :msg="userAgreeActivePactErrorMsg" :label="() => h('div', { class: 'text-[#B3BEC1] @md:text-[14px] text-[12px]' }, '我同意接收 BC.GAME 的行销促销活动。')" />
          </div>
          <div class="mb-[12px]">
            <BaseButton class="w-full" style="background: linear-gradient(90deg, #24EE89 0%, #9FE871 100%);" @click="onRegisterClick">
              注册
            </BaseButton>
          </div>
          <div class="mb-[24px] text-[12px] @md:text-[14px]">
            <span class="text-white">已有一个账户？</span>
            <BaseButton type="text" custom-padding style="--tg-base-button-text-default-color: #24EE89;--tg-base-button-padding-y:0;--tg-base-button-padding-x:0">
              登入
            </BaseButton>
          </div>
        </template>
        <!-- 邮箱或手机验证 -->

        <template v-if="isVerifyPage">
          <i18n-t
            keypath="please_input_your_verification_code" tag="div"
            class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]"
          >
            <span>{{ isEmailRegType ? phoneOrEmail : `${areaCode} ${phoneOrEmail}` }}</span>
          </i18n-t>
          <div class="my-[12px]">
            <BaseInput
              ref="verifyCodeRef" v-model="verifyCode" max="6" :msg="verifyCodeErrorMsg" type="number"
              :hide-spin-btn="true" input-mode="numeric"
            >
              <template #right-icon>
                <div v-if="isCountdown" class="text-white">
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
          </div>
          <div class="mb-[12px] flex">
            <BaseButton type="text" size="none" @click="page = 3">
              {{ t('no_verification_code') }}
            </BaseButton>
          </div>
          <BaseButton
            :loading="isApiLoading" :disabled="isApiLoading"
            class="w-full"
            style="background: linear-gradient(90deg, #24EE89 0%, #9FE871 100%);" @click="onSubmitClick"
          >
            {{ t('submit') }}
          </BaseButton>
        </template>
        <!-- 没收到验证码 -->
        <AppBcDialogRegisterPartNoReceiveCode
          v-if="isNoVerifyPage" :type="isEmailRegType ? 'email' : 'phone'"
          @back="page = 2"
        />
        <template v-if="isUserAgreement">
          <div class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]" @click="page = 1">
            <IconUniBack class="text-[14px]" />
            <span class="text-white">{{ t('user_agreement') }}</span>
          </div>
          <div class="scroll-y h-[70vh] rounded-[4px] px-[12px] py-[20px] @md:max-h-[560px]" @touchstart.stop @touchmove.stop>
            <AppPoliciesTerms />
          </div>
        </template>
        <div v-if="isRegisterForm" class="w-full @md:absolute @md:bottom-[20px] @md:right-0 @md:px-[20px]">
          <Suspense timeout="0">
            <AppBcAuthLogin />
          </Suspense>
        </div>
      </div>
    </div>
    <div :id="captchaEleId" />
    <div :id="captchaButtonId" />
  </div>
</template>

<style lang="scss" scoped>
.bc-game-register {
  --tg-base-button-color: black;
}
</style>

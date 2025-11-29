<script setup lang='ts'>
import { ApiMemberCPFInfo, ApiMemberExists, ApiMemberPhoneSms, ApiMemberReg, ApiMemberSendMailCaptcha } from '@tg/apis'
import { BaseForm, PhBaseButton, PhBaseCheckbox, PhBaseDialog, PhBaseImage, PhBaseInput, PhBaseInputBirthday, PhBaseOriginSelect } from '@tg/bccomponents'
import { sendMsgToAdjust, useAliCaptcha, useAreaCode, useBoolean, useCountDown, useIpApi } from '@tg/hooks'
import { IconLoginClose, IconLoginFlagArrow } from '@tg/icons'
import { useAppStore, useBrandStore } from '@tg/stores'
import { CustomStatisticsEvent, type IMemberReg, SendFlutterThirdPartyAppMessage } from '@tg/types'
import { application, brazilPhoneReg, chinaPhoneReg, emailReg, getEnv, lastOneNumberReg, Local, numberReg, payPasswordReg, philippinePhoneReg, sendMsgToFlutterThirdPartyApp, Session, Statistics, STORAGE_CCCCC, STORAGE_REG_PARAMS_KEYWORDS, STORAGE_THIRDREG_PARAMS_KEYWORDS, STORAGE_UUUUU, upperLowerReg, usernameReg2 } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import * as Yup from 'yup'
import { useWindowHeightRem } from '~/hooks'
import { Message } from '~/utils'
import AppThirdLogin from '../../components/AppThirdLogin.vue'
import AppPhoneOrEmailVerify from './_comp/AppPhoneOrEmailVerify.vue'

/**
 * 与V2的不同点：
 * 1、手机邮箱存在同一个页面，不用切tab
 * 2、如果后台开启了手机验证和邮箱验证，那么只需要验证手机号就可以了，邮箱不需要验证，状态为未验证
 */

defineOptions({
  name: 'Register',
})

const { showCaptcha, loadingMemberCaptcha } = useAliCaptcha({
  success: (validate) => {
    runRegisterApi(validate)
  },
})

const { t: $t } = useI18n()
const appStore = useAppStore()
const { brandConfig, isOpenCPFOnRegister } = storeToRefs(useBrandStore())
const route = useRoute()
const router = useRouter()
const { bool: isCode } = useBoolean(false)
const { bool: isCountdown } = useBoolean(false)
const { bool: needSaveFormData, setTrue: setNeedSaveFormDataTrue } = useBoolean(true)
const { bool: isRegBtnLoading, setBool: setIsRegBtnLoading } = useBoolean(false)
const { bool: isRegDeviceNumLoading, setBool: setIsRegDeviceNumLoading } = useBoolean(false)
const { areaCodeOptionsFiltered } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { VITE_OFFICIAL_NAME } = getEnv()

const {
  start,
  reset,
} = useCountDown({
  time: 60 * 1000,
  onFinish() {
    isCountdown.value = false
  },
})
const schema = Yup.object().shape({
  username: Yup.string(),
  email: Yup.string(),
  phone: Yup.string(),
  cpf: Yup.string(),
  parentUid: Yup.string(),
})

const birthdayInputRef = ref()
const birthday = ref('')
const q_u = route.query.u ? route.query.u.toString() : ''
const parentUid = ref(q_u)
const parentC = ref(route.query.c ? route.query.c.toString() : '')
const curParams = ref()
const regType = ref('phone')
const areaCode = ref(countryCallingCode.value)
const isVerifyCode = ref(false)

if (brandConfig.value && brandConfig.value.reg && brandConfig.value.reg.length) {
  const { mail: b_mail, phone: b_phone } = brandConfig.value.reg[0]
  if (b_mail.mail && !b_phone.phone)
    regType.value = 'email'
}

/** 注册配置 */
const brandRegDetail = computed(() => brandConfig.value)
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
const { heightRem } = useWindowHeightRem()

/** 手机注册 */
const isPhoneRegType = computed(() => regType.value === 'phone' && needPhone.value)
/** 邮箱注册 */
const isEmailRegType = computed(() => regType.value === 'email' && needEmail.value)

// #region 表单字段验证
const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: validatePassword,
  // meta: pwdMeta,
  // resetField: resetPassword,
} = useField<string>('password', (value) => {
  let result
  if (!value)
    result = $t('您的密码必须含有至少 8 个字符')
  else if (value.length < 8)
    result = $t('您的密码必须含有至少 8 个字符')
  else if (!upperLowerReg.test(value))
    result = $t('密码必须含有至少 1 个大写字母和 1 个小写字母')
  else if (!lastOneNumberReg.test(value))
    result = $t('密码必须含有至少一个数字')
  else
    result = ''
  if (result && result.length)
    setIsRegBtnLoading(false)
  return result
}, { validateOnValueUpdate: false })
const {
  value: email,
  errorMessage: emailErrorMsg,
  validate: validateEmail,
  // setErrors: setEmailErrors,
  setValue: setEmail,
  // resetField: resetEmail,
} = useField<string>('email', (value) => {
  const lastDotIdx = value ? value.lastIndexOf('.') : -1
  let result
  if (!value)
    result = $t('电子邮件域不受支持')

  else if (!value.includes('@'))
    result = [$t('请在您的电邮地址中加入x符号', { delta: '@' })]

  else if (!value.includes('.'))
    result = $t('请在您的电邮地址中加入x符号', { delta: '.' })

  else if (lastDotIdx === value.length - 1)
    result = $t('电子邮件域不受支持')

  else if (value === password.value)
    result = $t('您的电邮地址和密码不能相同')

  else if (!emailReg.test(value))
    result = $t('请输入有效的电邮地址')
  else if (value && value.length > 30)
    result = $t('请输入有效的电邮地址')
  else
    result = ''

  // 请在您的电邮地址中加入 “@” 符号
  // 请在您的电邮地址中加入 “.” 符号
  // 电子邮件域不受支持
  // 请输入有效的电邮地址
  if (result && result.length)
    setIsRegBtnLoading(false)

  return result
}, { validateOnValueUpdate: false })
const {
  value: phone,
  errorMessage: phoneErrorMsg,
  validate: valiPhone,
  // setErrors: setPhoneError,
  // resetField: resetPhone,
} = useField<string>('phone', (value) => {
  let result
  if (areaCode.value === '+63')
    result = philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18 ? '' : $t('手机号码无效')
  else if (areaCode.value === '+86')
    result = chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18 ? '' : $t('手机号码无效')
  else if (areaCode.value === '+55')
    result = brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18 ? '' : $t('手机号码无效')
  else
    result = numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : $t('手机号码无效')
  if (result && result.length)
    setIsRegBtnLoading(false)
  return result
}, { initialValue: '', validateOnValueUpdate: false })
const phoneField = computed(() => `${areaCode.value}-${phone.value}`)
const {
  value: username,
  errorMessage: usernameErrorMsg,
  validate: validateUsername,
  // setErrors: setUsernameErrors,
  setValue: setUsername,
  // resetField: resetUsername,
} = useField<string>('username', (value) => {
  let result
  if (!value)
    result = $t('您的用户名必须含有至少 6 个字符')
  else if (value.length < 6)
    result = $t('您的用户名必须含有至少 6 个字符')
  else if (value.match('[^a-zA-Z0-9_]'))
    result = $t('用户名含有无效的字符')
  else if (value.length > 30)
    result = $t('您的用户名不得超过 30 个字符')
  else if (value === password.value)
    result = $t('您的用户名和密码不能相同')
  else if (!usernameReg2.test(value))
    result = $t('您的用户名长度必须为 6 – 30 个大小写英文字母和数字组成')
  else
    result = ''
  // 此用户名已被使用，请选择另一用户名。
  // 用户名含有无效的字符
  // 您的用户名长度必须为 6 – 30 个字符。
  if (result && result.length)
    setIsRegBtnLoading(false)
  return result
}, { validateOnValueUpdate: false })

const {
  value: verifyCode,
  errorMessage: verifyCodeErrorMsg,
  validate: valiVerifyCode,
  // setValue: setVerifyCode,
} = useField<string>('verifyCode', (value) => {
  if (!value)
    return $t('请输入验证码')
  else if (!payPasswordReg.test(value))
    return isEmailRegType.value ? $t('您的邮箱验证码含有6位数字') : $t('您的手机验证码含有6位数字')
  return ''
}, { validateOnValueUpdate: false })
const {
  value: isAgreeUserAgreement,
  errorMessage: userAgreementErrorMsg,
  validate: valiUserAgreement,
} = useField<boolean>('isAgreeUserAgreement', (value) => {
  if (!value) {
    setIsRegBtnLoading(false)
    return $t('请同意并勾选用户协议')
  }

  return ''
}, { initialValue: true, validateOnValueUpdate: false })
// CPF
const { value: cpf, errorMessage: cpfError, validate: valiCPF, setErrors: setCPFError } = useField<string>('cpf', (v) => {
  if (!v)
    return $t('请输入CPF')
  if (!/^\d{11}$/.test(v))
    return $t('CPF格式不正确')

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
const { runAsync: runExists } = useRequest(ApiMemberExists, {
  onError: (err, params) => {
    console.log(err)
    const ty = params[0].ty
    if (ty === 1) {
      Message.error($t('此用户名已被使用，请选择另一用户名'))
    }
    else if (ty === 2) {
      Message.error($t('电邮地址已存在'))
    }
    else if (ty === 3) {
      Message.error($t('手机号码已存在'))
    }

    setIsRegBtnLoading(false)
  },
})
/** 检测CPF状态 */
const { runAsync: runAsyncCPFCheck } = useRequest(() => ApiMemberCPFInfo(cpf.value), {
  onError(err) {
    setCPFError(JSON.parse(err.message).data)
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
    Message.success($t('验证码发送成功'))
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
    Message.success($t('验证码发送成功'))
  },
})
/** 注册 */
const {
  run: runMemberReg,
  loading: regLoading,
} = useRequest(ApiMemberReg, {
  manual: true,
  onSuccess: async (res) => {
    isVerifyCode.value = false
    await nextTick()
    appStore.setToken(res)
    Local.set('local_regist_token', res)
    Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.REGISTER, { eventID: `reg-${curParams.value?.username}` })
    Message.success(`${$t('欢迎')} ${curParams.value?.username}!`)
    needSaveFormData.value = false
    Session.remove(STORAGE_REG_PARAMS_KEYWORDS)
    sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.REGISTERSUCCESS)
    sendMsgToAdjust(SendFlutterThirdPartyAppMessage.REGISTERSUCCESS)
    await nextTick()
    router.push('/')
  },
})
const isApiLoading = computed(() => regLoading.value || phoneCaptchaLoading.value || emailCaptchaLoading.value || isRegBtnLoading.value || loadingMemberCaptcha.value || isRegDeviceNumLoading.value)

/** 点击注册按钮 */
async function onRegisterClick() {
  if (needEmail.value) {
    await validateEmail()
  }

  if (needPhone.value)
    await valiPhone()

  if (needUsername.value) {
    await validateUsername()
  }

  await validatePassword()

  if (needBirthday.value) {
    const birthValid = await birthdayInputRef.value.valiBirthday()
    if (birthValid) {
      Message.error(birthValid)
      return
    }
    // if (birthValid !== true)
    //   setIsRegBtnLoading(false)
  }

  // 需要CPF时必填
  if (isOpenCPFOnRegister.value)
    await valiCPF()

  await valiUserAgreement()

  // 这个不要删：有错误时直接返回，否则重复的邮箱或用户名会因通过格式校验从而进行注册请求
  if (
    (needEmail.value && emailErrorMsg.value)
    || (needPhone.value && phoneErrorMsg.value)
    || usernameErrorMsg.value
    || pwdErrorMsg.value
    || (isOpenCPFOnRegister.value && cpfError.value)
    || userAgreementErrorMsg.value
  ) {
    Message.error(
      emailErrorMsg.value
      || phoneErrorMsg.value
      || usernameErrorMsg.value as string
      || pwdErrorMsg.value
      || cpfError.value as string
      || userAgreementErrorMsg.value as string,
    )
    setIsRegBtnLoading(false)
    return
  }

  if (isRegBtnLoading.value)
    return
  setIsRegBtnLoading(true)

  if (needPhone.value)
    await onEmailUsernameBlur(3)

  if (needEmail.value)
    await onEmailUsernameBlur(2)

  if (needUsername.value)
    await onEmailUsernameBlur(1)

  if (isOpenCPFOnRegister.value)
    await runAsyncCPFCheck()

  // 需要验证手机
  if (needCheckPhone.value) {
    runAsyncSendPhoneSms().then(() => {
      isVerifyCode.value = true
    }).finally(() => {
      setIsRegBtnLoading(false)
    })
    return
  }

  // 需要验证邮箱
  if (needCheckEmail.value) {
    regType.value = 'email'
    runAsyncMemberSendMailCaptcha().then(() => {
      isVerifyCode.value = true
    }).finally(() => {
      setIsRegBtnLoading(false)
    })
    return
  }

  setIsRegBtnLoading(false)
  showCaptcha()
}

/** 进行注册请求 */
async function runRegisterApi(validate?: string) {
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
    email: email.value,
    phone: phoneField.value,
    validate,
  }
  setIsRegDeviceNumLoading(false)

  curParams.value = { ...paramsReg }

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
  console.log('🚸🚸🚸 ~ runRegisterApi ~ 注册传参:', curParams.value)
  runMemberReg(curParams.value)
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
/** 点击重新发送 */
function onResendClick() {
  if (isEmailRegType.value)
    runAsyncMemberSendMailCaptcha()
  else
    runAsyncSendPhoneSms()
}
/** 验证码页面点击提交 */
async function onSubmitClick() {
  await valiVerifyCode()
  if (verifyCodeErrorMsg.value) {
    Message.error(verifyCodeErrorMsg.value)
    return
  }

  setIsRegBtnLoading(false)
  showCaptcha()
}

function goLogin() {
  router.push('/login')
}
function onReturn() {
  router.push('/')
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
onMounted(() => {
  sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.REGISTERCLICK)
  sendMsgToAdjust(SendFlutterThirdPartyAppMessage.REGISTERCLICK)
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
      regType.value = 'phone'
    else if (!b_mail.mail && !b_phone.phone)
      regType.value = 'phone'
    else if (b_mail.mail && !b_phone.phone)
      regType.value = 'email'
  }
})
</script>

<template>
  <div class="bg-[#fff]" :style="{ height: `${heightRem}rem` }">
    <div class="relative w-full">
      <PhBaseImage url="/ph-h5/png/login-head.png" alt="" class="w-full h-[261rem]" height="245" />
      <div class="absolute top-0 w-full p-[22rem] flex">
        <PhBaseButton
          class="bg-[#000000] ml-auto !size-[20rem]"
          style="--ph-base-button-border-radius: 100rem"
          type="none"
          @click="onReturn"
        >
          <IconLoginClose class="text-[20rem] shrink-0 text-white" />
        </PhBaseButton>
      </div>

      <div class="h-full px-[20rem] bg-transparent pb-[30rem] relative w-full -mt-[70rem]">
        <h3 class="text-[#0D2245] text-[18rem] leading-[25rem] font-semibold mb-[30rem] text-center">
          {{ $t('注册') }}
        </h3>
        <div>
          <BaseForm :schema="schema" autocomplete="off" @submit="onRegisterClick">
            <PhBaseInput
              v-if="needPhone"
              v-model="phone"
              name="phone"
              class="mb-[12rem]"
              type="number"
              inputmode="number"
              :placeholder="$t('请填写手机号码')"
              :required="true"
            >
              <template #left>
                <div class="center h-full flex text-[#9DABC9]">
                  <PhBaseImage v-if="areaCode && areaCode.length" class="w-[16rem]" :url="`/flag/${areaCode.slice(1)}.webp`" />
                  <PhBaseOriginSelect v-model="areaCode" :options="areaCodeOptionsFiltered" />
                </div>
              </template>
            </PhBaseInput>
            <PhBaseInput
              v-if="needEmail"
              v-model="email"
              name="email"
              class="mb-[12rem]"
              :placeholder="$t('请填写邮箱')"
              :required="true"
            />
            <PhBaseInput
              v-if="needUsername"
              v-model="username"
              name="username"
              class="mb-[12rem]"
              :placeholder="$t('账号n～m位', [6, 18])"
              :required="true"
            />

            <PhBaseInput
              v-model="password"
              name="password"
              type="password"
              :required="true"
              :placeholder="$t('请输入登入密码')"
              class="mb-[12rem]"
            />
            <PhBaseInput v-if="isOpenCPFOnRegister" v-model="cpf" :required="true" name="cpf" :max="11" input-mode="numeric" placeholder="CPF" class="mb-[12rem]" />
            <PhBaseInputBirthday v-if="needBirthday" ref="birthdayInputRef" v-model="birthday" class="mb-[12rem]" />
            <div class="w-full mb-[12rem]">
              <div class="flex items-center">
                <span class="text-[14rem] font-[600] mr-[6rem] leading-[21rem]" @click="isCode = !isCode">{{ $t('输入推荐代码') }}</span>
                <IconLoginFlagArrow class="text-[14rem] transition duration-300 origin-center text-[#6d7693]" :class="{ 'rotate-180': isCode }" />
              </div>

              <PhBaseInput v-if="isCode" v-model="parentUid" name="parentUid" class="mt-[6rem]" :placeholder="$t('请输入推荐代码')" />
            </div>
            <div class="mb-[12rem] flex items-center ">
              <PhBaseCheckbox v-model="isAgreeUserAgreement" class="mr-[4rem]" />
              <span class="text-[12rem] font-medium text-[#6D7693] leading-[17rem]">{{ $t('我同意') }} <span class="text-[#F23038] cursor-pointer" @click="router.push('/policies/responsible-gaming')">{{ $t('用户协议') }}</span> {{ $t('并确定我已满18岁') }}</span>
            </div>
            <PhBaseButton html-type="submit" :disabled="username ? false : true" :loading="isApiLoading" type="primary" class="w-full mb-[12rem]">
              {{ $t('注册') }}
            </PhBaseButton>
            <div class="flex font-[600] text-[#6D7693] leading-[20rem]">
              {{ $t('已有账号') }}?<span class="ml-[4rem] text-[#0D2245] leading-[20rem]" @click="goLogin">{{ $t('登录') }}</span>
            </div>
          </BaseForm>
        </div>
        <div class="px-[30.89rem] pb-[24rem] pt-0 mt-[16rem]">
          <AppThirdLogin />
        </div>
        <div class="center text-[14rem] mb-[24rem] leading-[24rem] font-[500]" @click="router.push('/service')">
          <span class="text-[#6D7693] mr-[5rem]">{{ $t('需要帮助') }}</span><span class="text-[#F23038] cursor-pointer">{{ $t('联系客服') }}</span>
        </div>
        <div class="text-center text-[#6D7693] leading-[18.5rem] text-[12rem] font-[500]">
          Copyright © 2025 {{ VITE_OFFICIAL_NAME }} ALL RIGHTS RESERVED
        </div>
      </div>
    </div>
    <PhBaseDialog v-model="isVerifyCode" :show-header="false">
      <AppPhoneOrEmailVerify
        v-if="isVerifyCode"
        :is-email-reg-type="isEmailRegType" :email="email" :area-code="areaCode" :phone="phone" :verify-code="verifyCode" :is-api-loading="isApiLoading"
        @resend="onResendClick" @submit="onSubmitClick" @code-type="(v) => verifyCode = v" @close="isVerifyCode = false"
      />
    </PhBaseDialog>
  </div>
</template>

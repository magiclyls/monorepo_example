<script setup lang='ts'>
import { IconUniSet, IconUniWarningColor } from '@tg/icons'
import { ApiMemberAuthInfo, ApiMemberExists, ApiMemberPasswordUpdateCode, ApiMemberPhoneSms, ApiMemberSendMailCaptcha } from '@tg/apis'

defineOptions({
  name: 'AppDialogForgetPasswordV2',
})
const closeDialog = inject('closeDialog', () => {})
const { openNotify } = useNotify()
const { t } = useI18n()
const { openService } = useService()
const { areaSearchValue, areaCodeOptionsFiltered, clearAreaSearchValue } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { bool: isPopperShow, setTrue: setPopperShow, setFalse: setPopperHide } = useBoolean(false)
const { bool: isCountdown } = useBoolean(false)
const { isMobile } = storeToRefs(useWindowStore())
const { isFaceVerificationOpen } = storeToRefs(useBrandStore())

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
const { closeLoginDialog } = useLoginDialog()
const { openDialogFacialRecognition } = useDialogFacialRecognition()

const page = ref(1)
const areaCode = ref(countryCallingCode.value)
const cpf = ref('')

const {
  value: account,
  errorMessage: accountErrorMsg,
  validate: valiAccount,
  setErrors: setAccountError,
} = useField<string>('account', (value) => {
  if (!value) {
    return t('pls_enter_email_address') + t(' or ') + t('phone')
  }

  else if (value.includes('@')) {
    return emailReg.test(value) ? '' : t('email_address_incorrect')
  }

  else if (startWithNumber.test(value)) {
    if (areaCode.value === '+63')
      return philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
    else if (areaCode.value === '+86')
      return chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
    else if (areaCode.value === '+55')
      return brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
    return numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  }

  return ''
}, { initialValue: '' })

const isEmailType = computed(() => account.value.includes('@'))
const isStartWithNumber = computed(() => startWithNumber.test(account.value))
const phoneEmail = computed(() => isEmailType.value ? account.value : `${areaCode.value}-${account.value}`)
const curExistsTy = computed(() => isEmailType.value ? 2 : 3)

const {
  value: verifyCode,
  errorMessage: verifyCodeErrorMsg,
  validate: valiVerifyCode,
  setValue: setVerifyCode,
} = useField<string>('verifyCode', (value) => {
  if (!value)
    return t('validate_msg_input_code')
  else if (!payPasswordReg.test(value))
    return isEmailType.value ? t('validate_msg_regexp_code') : t('validate_msg_regexp_code_phone')
  return ''
})
const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: valiPassword,
} = useField<string>('password', (value) => {
  if (!value)
    return t('pop_up_create_account_password_least_8_characters')
  else if (value.length < 8)
    return t('pop_up_create_account_password_least_8_characters')
  else if (!upperLowerReg.test(value))
    return t('pop_up_create_account_password_uppercase_lowercase_letter')
  else if (!lastOneNumberReg.test(value))
    return t('pop_up_create_account_password_least_1_number')
  return ''
})
/** 验证验证码并获得cpf */
const { runAsync: runAsyncMemberAuthInfoCheck, loading: runAsyncMemberAuthInfoCheckLoading } = useRequest(() => ApiMemberAuthInfo({
  captcha: verifyCode.value,
  type: isEmailType.value ? 1 : 2,
  phone_email: phoneEmail.value,
}), {
  onSuccess(data) {
    if (data.status === 1) {
      if (data.cpf_number) {
        cpf.value = data.cpf_number
        toFaceVerify()
      }
      else {
        // 没有cpf
        openNotify({
          type: 'error',
          message: `${t('setting_kyc_tip1')}${t('setting_kyc_tip2')}`,
        })
      }
    }
  },
})

/** 找回密码接口 */
const { runAsync: runResetPassword, loading: resetLoading } = useRequest(() => ApiMemberPasswordUpdateCode({
  captcha: verifyCode.value,
  type: isEmailType.value ? 1 : 2,
  new_password: password.value,
  phone_email: phoneEmail.value,
}), {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('notify_title_success'),
      message: t('login_pwd') + t('success_edit'),
    })
    closeDialog()
  },
})

/** 发送邮箱验证码 */
const {
  runAsync: runAsyncMemberSendMailCaptcha,
  loading: emailCaptchaLoading,
} = useRequest(() => ApiMemberSendMailCaptcha({ email: account.value }), {
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
} = useRequest(() => ApiMemberPhoneSms({ phone: phoneEmail.value, type: 0 }), {
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

/** 检测是否存在 */
const { runAsync: runExists, loading: existLoading } = useRequest(ApiMemberExists, {
  onSuccess(res) {
    // if (!res.exist) {
    if (isEmailType.value)
      setAccountError(t('no_this_user'))
    else
      setAccountError(t('no_this_user'))
    // }
    // else if (res.exist) {
    //   setAccountError('')
    //   if (isEmailType.value) {
    //     runAsyncMemberSendMailCaptcha().then(() => {
    //       page.value = 2
    //     })
    //   }
    //   else {
    //     runAsyncSendPhoneSms().then(() => {
    //       page.value = 2
    //     })
    //   }
    // }
  },
  onError: () => {
    setAccountError('')
    if (isEmailType.value) {
      runAsyncMemberSendMailCaptcha().then(() => {
        page.value = 2
      })
    }
    else {
      runAsyncSendPhoneSms().then(() => {
        page.value = 2
      })
    }
  },
})

/** 人脸识别成功回调 */
async function onConfirm() {
  runResetPassword()
}

/** 去人脸识别 */
function toFaceVerify() {
  openDialogFacialRecognition({
    onConfirm,
    cpf: cpf.value,
  })
}

/** 点击恢复密码 */
async function onSendCodeClick() {
  if (emailCaptchaLoading.value || phoneCaptchaLoading.value || existLoading.value)
    return

  await valiAccount()
  if (!accountErrorMsg.value)
    runExists({ ty: curExistsTy.value, val: phoneEmail.value, noNotify: true })
}
/** 点击重新发送 */
function onResendClick() {
  if (isEmailType.value)
    runAsyncMemberSendMailCaptcha()
  else
    runAsyncSendPhoneSms()
}
/** 点击提交 */
async function onSubmitClick() {
  await valiVerifyCode()
  await valiPassword()
  if (!verifyCodeErrorMsg.value && !pwdErrorMsg.value) {
    if (isFaceVerificationOpen.value)
      runAsyncMemberAuthInfoCheck()
    else
      runResetPassword()
  }
}

function selectAreaCode(v: string) {
  areaCode.value = v
}
async function onClickService() {
  closeDialog()
  closeLoginDialog()
  await nextTick()
  openService({ isFootBar: false, needDeal: true })
}
function goBack() {
  page.value = 1
  reset()
}
function onVDropdownHide() {
  setPopperHide()
  clearAreaSearchValue()
}

watch(countryCallingCode, (a) => {
  areaCode.value = a
}, { immediate: true })
watch(verifyCode, (a) => {
  if (a && a.length > 6) {
    nextTick(() => {
      setVerifyCode(a.slice(0, 6))
    })
  }
})
</script>

<template>
  <div class="grid gap-y-[12px] p-[16px]">
    <template v-if="page === 1">
      <div class="flex">
        <div class="theme-icon grid grid-cols-[auto_1fr] items-center gap-x-[5px] text-[18px] font-semibold leading-[25px]">
          <IconUniSet class="text-[16px]" />
          <span>{{ t('pop_up_forgot_password') }}</span>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex">
          <BaseSelect
            v-if="account && !isEmailType && isStartWithNumber"
            v-model="areaCode" :placeholder="t('intl_phone_pre')" show-placeholder small :width="isMobile ? '100px' : '150px'"
            :options="areaCodeOptionsFiltered"
          />
          <BaseInput v-model="account" class="theme-input" type="text" :placeholder="`${t('email1')}/${t('phone2')}`" />
        </div>
        <div
          v-show="accountErrorMsg" class="flex items-center pb-[4px] pt-[8px] text-[12px]"
          style="--tg-icon-color:var(--tg-text-error-sub);"
        >
          <IconUniWarningColor class="error-icon" name="uni-warning-color" />
          <span class="text-tg-text-error-sub ml-[4px]">{{ accountErrorMsg }}</span>
        </div>
      </div>
      <BaseButton
        bg-style="primary"
        size="md" style="--tg-base-button-font-size:16px;"
        class="forget-password-base-button"
        @click="onSendCodeClick"
      >
        {{ t('recover_pwd') }}
      </BaseButton>
      <i18n-t keypath="no_email_or_phone_pls" tag="div" class="text-tg-text-lightgrey flex-wrap items-center font-semibold leading-[1.5]">
        <BaseButton class="ml-[4px]" size="none" type="text" style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="onClickService">
          {{ t('connect_service') }}
        </BaseButton>
      </i18n-t>
    </template>
    <template v-else-if="page === 2">
      <div class="flex">
        <div class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]">
          <span>{{ isEmailType ? t('label_email_check') : t('label_phone_check') }}</span>
        </div>
      </div>

      <i18n-t keypath="please_input_your_verification_code" tag="div" class="text-tg-text-lightgrey theme-text text-[14px] font-semibold leading-[1.5]">
        <span>{{ isEmailType ? account : `${areaCode} ${account}` }}</span>
      </i18n-t>
      <BaseInput v-model="verifyCode" class="theme-input" :msg="verifyCodeErrorMsg" max="6" type="number" input-mode="numeric" :hide-spin-btn="true">
        <template #right-button>
          <div v-if="isCountdown">
            {{ current.seconds }}s
          </div>
          <BaseButton v-else size="none" type="text" style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="onResendClick">
            <span class="whitespace-nowrap">{{ t('resend') }}</span>
          </BaseButton>
        </template>
      </BaseInput>
      <BaseInput v-model="password" class="theme-input" type="password" :placeholder="t('new_pwd')" :msg="pwdErrorMsg" />
      <!--  <div class="flex">
        <BaseButton type="text" class="theme-text" size="none" @click="page = 3">
          {{ t('no_verification_code') }}
        </BaseButton>
      </div> -->
      <BaseButton
        bg-style="primary" size="md" style="--tg-base-button-font-size:16px;" :loading="resetLoading || runAsyncMemberAuthInfoCheckLoading"
        :disabled="resetLoading" @click="onSubmitClick"
      >
        {{ t('submit') }}
      </BaseButton>
      <div class="center cursor-pointer font-semibold leading-5" @click="goBack">
        {{ isEmailType ? $t('switch_to_phone_verify') : $t('switch_to_email_verify') }}
      </div>
    </template>
    <AppDialogRegisterPartNoReceiveCode v-else-if="page === 3" :type="isEmailType ? 'email' : 'phone'" @back="page = 2" />
  </div>
</template>

<style lang='scss' scoped>
.theme-icon {
  @include webTheme('white') {
    --tg-icon-color: #555555;
  }
}
.theme-text {
  @include webTheme('green') {
    color: #3cb389;
    --tg-base-button-text-default-color: #ffffff;
  }
}
.theme-input {
  --tg-base-input-height: 40px;
  .right-btn {
    padding: 10px;
    height: 100%;
    background-color: #2f4553;
  }
  @include webTheme('green') {
    --tg-base-select-box-shadow: none;
    --tg-radius-default: 4px;
    --tg-base-input-style-border: 1px solid #197b59;
    --tg-base-input-style-bg: #02432d;
  }
}
</style>

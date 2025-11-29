<script setup lang='ts'>
import { IconSmallError, IconUniBack, IconUniWarningColor } from '@tg/icons'
import { ApiMemberUnlock, ApiMemberVerify } from '@tg/apis'

interface Props {
  openPage: 'self' | 'long' | 'noCode'
  getAccount?: string
  getUsername?: string
  getPassword?: string
  closeLoginHandler?: () => void
  cpf?: string
}
defineOptions({
  name: 'AppResolveLocked',
})
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => {})
const { openNotify } = useNotify()
const { t } = useI18n()
const { openLoginDialog } = useLoginDialog()
const { areaSearchValue, areaCodeOptionsFiltered, clearAreaSearchValue } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { bool: isCountdown } = useBoolean(false)
const { isMobile } = storeToRefs(useWindowStore())
const appStore = useAppStore()
const { isRegFaceVerificationOpen } = storeToRefs(useBrandStore())
const { openDialogFacialRecognition } = useDialogFacialRecognition()
const { noLoginDays } = storeToRefs(useBrandStore())

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

const areaCode = ref(countryCallingCode.value)
const page = ref<'self' | 'long' | 'noCode'>('long')
const isFirst = ref(true)
const isDisabled = ref(true)

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

const {
  value: username,
  errorMessage: usernameErrorMsg,
  validate: valiUsername,
  setErrors: setUsernameErrorMsg,
} = useField<string>('username', (value) => {
  if (!value || value.length < 3)
    return t('pop_up_login_first_input_min_length', { delta: 3 })
  else if (value.length > 30)
    return t('max_len_char', { delta: 30 })
  else if (value.match('[^@.a-zA-Z0-9_]'))
    return t('name_has_invalid_char')
  else if (!emailReg.test(value) && !usernameReg.test(value))
    return t('validate_msg_user_name')
  return ''
})

const isStartWithNumber = computed(() => startWithNumber.test(account.value))
const pageType = computed(() => props.openPage)
const getAccount = computed(() => props.getAccount || '')
const getUsername = computed(() => props.getUsername || '')
const getPassword = computed(() => props.getPassword || '')
const isEmailType = computed(() => {
  if (pageType.value == 'self' && account.value.includes('@'))
    return true
  if (pageType.value == 'long' && getAccount.value.includes('@'))
    return true

  return false
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
    return isEmailType.value ? t('validate_msg_regexp_code') : t('validate_msg_regexp_code_phone')
  return ''
})
const { runAsync: runResolveLocked } = useRequest(ApiMemberUnlock)
const { runAsync: runMemberVerify, loading: verifyLoading } = useRequest(ApiMemberVerify)

async function getCodeSelf() {
  if (isCountdown.value)
    return
  await valiAccount()
  await valiUsername()
  if (usernameErrorMsg.value || accountErrorMsg.value)
    return

  const params = {
    username: username.value,
    [isEmailType.value ? 'email' : 'phone']: isEmailType.value ? account.value : `${areaCode.value}-${account.value}`,
    captcha: '',
  }
  runResolveLocked(params).then(() => {
    if (isFirst.value)
      isFirst.value = false
    reset()
    start()
    isCountdown.value = true
  })
}
// 30天未登录验证码获取
async function getCodeLong() {
  if (isCountdown.value)
    return
  const params = {
    [getAccount.value.includes('@') ? 'email' : 'phone']: getAccount.value,
    username: getUsername.value,
    password: getPassword.value,
    captcha: '',
  }
  runMemberVerify(params).then(() => {
    if (isFirst.value)
      isFirst.value = false
    reset()
    start()
    isCountdown.value = true
  })
}
/** 解锁 */
async function onResolve() {
  await valiAccount()
  await valiVerifyCode()
  await valiUsername()
  if (verifyCodeErrorMsg.value || usernameErrorMsg.value || accountErrorMsg.value)
    return

  const params = {
    username: username.value,
    [isEmailType.value ? 'email' : 'phone']: isEmailType.value ? account.value : `${areaCode.value}-${account.value}`,
    captcha: verifyCode.value,
  }
  runResolveLocked(params).then(() => {
    openNotify({
      type: 'success',
      title: t('resolve_success'),
      message: t('your_account_already_resolve_lock'),
    })
    goBack()
  })
}

// 验证接口
function runMemberVerifyApi() {
  const params = {
    [getAccount.value.includes('@') ? 'email' : 'phone']: getAccount.value,
    username: getUsername.value,
    password: getPassword.value,
    captcha: verifyCode.value,
  }
  runMemberVerify(params).then((res) => {
    appStore.setToken(res)
    openNotify({ type: 'user', message: `${t('welcome_guest')} ${getUsername.value}！` })
    closeDialog()
    props?.closeLoginHandler && props?.closeLoginHandler()
  })
}

// 验证
async function onVerify() {
  await valiVerifyCode()
  if (!verifyCode.value)
    return

  // 需要脸部识别
  if (isRegFaceVerificationOpen.value) {
    if (props.cpf) {
      openDialogFacialRecognition({
        onConfirm: runMemberVerifyApi,
        cpf: props.cpf,
        successText: t('go_to_home'),
      })
    }
    else {
      // 没有cpf
      openNotify({
        type: 'error',
        message: `${t('setting_kyc_tip1')}${t('setting_kyc_tip2')}`,
      })
    }
  }
  else {
    runMemberVerifyApi()
  }
}

async function goBack() {
  closeDialog()
  await nextTick()
  // openLoginDialog()
}
function noCodeBack() {
  page.value = pageType.value
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
watch(() => props.openPage, (n) => {
  page.value = n
}, { immediate: true })

watch([() => account.value, () => username.value], () => {
  setTimeout(() => {
    if (account.value && username.value && !accountErrorMsg.value && !usernameErrorMsg.value)
      isDisabled.value = false

    else isDisabled.value = true
  }, 100)
})
onMounted(() => {
  if (pageType.value == 'long') {
    if (isFirst.value)
      isFirst.value = false
    reset()
    start()
    isCountdown.value = true
  }
})
</script>

<template>
  <div class="theme-input grid gap-y-[12px] p-[16px]">
    <!-- 解除锁定 -->
    <template v-if="page == 'self'">
      <div class="flex">
        <div class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]" @click="goBack">
          <IconUniBack class="text-[14px]" />
          <span>{{ t('resolve_locked') }}</span>
        </div>
      </div>
      <BaseInput v-model="username" :placeholder="t('username')" :msg="usernameErrorMsg" />

      <div class="flex flex-col">
        <div class="flex">
          <BaseSelect
            v-if="account && !isEmailType && isStartWithNumber"
            v-model="areaCode"
            class="theme-select" :placeholder="t('intl_phone_pre')" show-placeholder small :width="isMobile ? '100px' : '150px'"
            :options="areaCodeOptionsFiltered"
          />
          <BaseInput v-model="account" type="text" :placeholder="`${t('mail')}/${t('phone')}`" />
        </div>
        <div
          v-show="accountErrorMsg" class="flex items-center pb-[4px] pt-[8px] text-[12px]"
          style="--tg-icon-color:var(--tg-text-error-sub);"
        >
          <IconUniWarningColor class="error-icon" />
          <span class="text-tg-text-error-sub ml-[4px]">{{ accountErrorMsg }}</span>
        </div>
      </div>

      <BaseInput v-model="verifyCode" class="theme-input right-bg" :placeholder="t('code')" :msg="verifyCodeErrorMsg" max="6" type="number" input-mode="numeric" :hide-spin-btn="true">
        <template #right-icon>
          <BaseButton :disabled="isDisabled" class="custom-button" type="text" style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="getCodeSelf">
            <span v-if="isFirst" class="whitespace-nowrap">{{ t('get_email_code') }}</span>
            <template v-else>
              <div v-if="isCountdown">
                {{ current.seconds }}s
              </div>
              <span v-else class="whitespace-nowrap">{{ t('resend') }}</span>
            </template>
          </BaseButton>
        </template>
      </BaseInput>
      <div class="flex">
        <BaseButton type="text" size="none" @click="page = 'noCode'">
          {{ t('no_verification_code') }}
        </BaseButton>
      </div>
      <BaseButton bg-style="primary" size="md" style="--tg-base-button-font-size:16px;" @click="onResolve">
        {{ t('submit') }}
      </BaseButton>
    </template>

    <!-- 长时间未登录弹窗 -->
    <template v-if="page == 'long'">
      <div class="flex">
        <div class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]">
          <span>{{ t('verify_account') }}</span>
        </div>
      </div>

      <i18n-t
        keypath="please_input_your_verification_code2" tag="div"
        class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]"
      >
        <span>{{ getAccount }}</span>
        <span>{{ 30 }}</span>
      </i18n-t>
      <BaseInput v-model="verifyCode" class="right-bg" :placeholder="t('code')" :msg="verifyCodeErrorMsg" max="6" type="number" input-mode="numeric" :hide-spin-btn="true">
        <template #right-icon>
          <BaseButton type="text" class="custom-button" style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="getCodeLong">
            <span v-if="isFirst" class="whitespace-nowrap">{{ t('get_email_code') }}</span>
            <template v-else>
              <div v-if="isCountdown">
                {{ current.seconds }}s
              </div>
              <span v-else class="whitespace-nowrap">{{ t('resend') }}</span>
            </template>
          </BaseButton>
        </template>
      </BaseInput>
      <div class="flex">
        <BaseButton type="text" size="none" @click="page = 'noCode'">
          {{ t('no_verification_code') }}
        </BaseButton>
      </div>
      <BaseButton
        bg-style="primary" size="md" :loading="verifyLoading"
        style="--tg-base-button-font-size:16px;" @click="onVerify"
      >
        {{ t('submit') }}
      </BaseButton>
      <div
        class="center long-no_login w-full flex border-[2px] border-[#ED4163] rounded-md border-dashed p-[10px] text-[#ED4163]"
      >
        <IconSmallError class="text-[#ED4163]" /><span class="ml-[4px]">{{ t('long_no_login_warn_word') }}</span>
      </div>
    </template>
    <AppDialogRegisterPartNoReceiveCode v-if="page === 'noCode'" :type="isEmailType ? 'email' : 'phone'" @back="noCodeBack" />
  </div>
</template>

<style lang='scss' scoped>
.right-bg {
  --tg-base-input-style-right-icon-pad-v: 0;
  --tg-spacing-8: 0;
  --tg-base-button-border-radius: 0 2px 2px 0;
  --tg-base-input-style-bg: #2f4553;
  --tg-base-input-style-background-color: #0f212e;
  --tg-base-button-min-width: 80px;
  @include webTheme('green') {
    --tg-base-input-style-background-color: #02432d;
    --tg-base-input-style-bg: transparent;
    --tg-inner-input-radius-theme-green: 4px 0 0 4px;
    --tg-base-input-height: 40px;
  }
  @include webTheme('white') {
    --tg-base-input-style-background-color: #ffffff;
    --tg-base-input-style-bg: transparent;
    --tg-base-button-text-default-color: #111111;
    --tg-base-button-disabled-opacity: 1;
  }
}
.theme-input {
  @include webTheme('green') {
    --tg-base-select-box-shadow: none;
    --tg-radius-default: 4px;
    --tg-base-input-style-border: 1px solid #197b59;
  }
}
.custom-button {
  background-color: #2f4553;
  @include webTheme('green') {
    background-color: #197b59;
  }
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
}
.theme-select {
  @include webTheme('green') {
    --tg-base-select-border: 1px solid #197b59;
    --tg-border-color-deep-grey: #5ecea6;
    --tg-spacing-8: 9px;
    --tg-base-select-select-warp-background-color: #02432d;
  }
}
.long-no_login {
  background-color: #0f212e;
  @include webTheme('green') {
    background-color: #02432d;
  }
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
}
</style>

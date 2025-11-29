<script lang="ts" setup>
import type { notifyType } from '~/composables/useNotify'
import { IconUniWarningColor } from '@tg/icons'
import { ApiMemberEmailCheckRequest, ApiMemberExists, ApiMemberPhoneSms, ApiMemberUpdate } from '@tg/apis'

interface Props {
  /** 提示文字 && 有值表示钱包中使用，没有表示设置中使用 */
  tipText?: string
}
defineOptions({
  name: 'AppEmailVerify',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })
const { openWalletDialog } = useWalletDialog({ activeTab: 'withdraw' })

const { t } = useI18n()
const { openNotify } = useNotify()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const visibility = useDocumentVisibility()
const { start, current, pause, reset } = useCountDown({ time: 60000 })
const brandStore = useBrandStore()
const { bool: isTypeEmail, toggle: toggleTypeEmail } = useBoolean(props.tipText ? brandStore.verifyType === 'email' : true)
const { isMobile } = storeToRefs(useWindowStore())

const {
  bool: emailDisabledBtn,
  setTrue: setEmailDisabledBtnTrue,
  setFalse: setEmailDisabledBtnFalse,
} = useBoolean(true)
const {
  bool: msgAfterTouched,
  setFalse: setMsgAfterTouchedFalse,
  setTrue: setMsgAfterTouchedTrue,
} = useBoolean(true)
const {
  value: email,
  errorMessage: emailErrormsg,
  validate: emailValidate,
  setValue: setEmail,
} = useField<string>('email', (value) => {
  if (!value)
    return t('this_field_is_required')

  if (!emailReg.test(value))
    return t('this_contains_invalid_email_characters')
  else if (value && value.length > 30)
    return t('pls_input_email')
  return ''
})
const notifyData = ref({
  type: '' as notifyType,
  title: '',
  message: '',
})
const { runAsync: runMemberUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess(data, params) {
    if (params[0].record.email) {
      setEmailDisabledBtnTrue()
      emailCheck(false)
    }
    notifyData.value = {
      type: 'email',
      title: t('success_update_email'),
      message: `${t('tip_email_to')} ${email.value}`,
    }
    // emailCheck(false)
    appStore.updateUserInfo()
  },
})
const {
  run: runEmailCheckRequest,
  loading: loadingEmailCheckRequest,
} = useRequest(ApiMemberEmailCheckRequest, {
  onSuccess(data) {
    stop()
    if (+data > 0) {
      reset(+data * 1000)
      start()
    }
    else {
      reset(60 * 1000)
      start()
      openNotify(notifyData.value)
    }
  },
})

const emailVerified = computed(() => userInfo.value?.email_check_state === 1)
const phoneVerified = computed(() => userInfo.value?.phone_check_state === 1)
const isDialog = computed(() => !!props.tipText)

/**
 * 邮箱提交按钮是否禁用
 */
const emailSubmitBtnDisabled = computed(() => {
  if (!email.value)
    return true

  const initEmailText = userInfo.value?.email
  if (email.value === initEmailText)
    return true

  return emailVerified.value
})

/**
 * 重新发送邮件按钮是否禁用
 */
const emailCheckBtnDisabled = computed(() => {
  if (!email.value)
    return true

  return emailVerified.value
})

async function emailCheck(manual: boolean) {
  await emailValidate()
  if (!emailErrormsg.value) {
    manual && (notifyData.value = {
      type: 'email',
      title: t('tip_email_sent'),
      message: `${t('email_update_to')} ${email.value}`,
    })
    runEmailCheckRequest({ email: email.value })
  }
}
function emailPaste() {
  setTimeout(() => {
    setEmailDisabledBtnFalse()
  }, 0)
}
function goGmail() {
  window.open(`https://mail.google.com/mail/u/#search/from:@${location.origin}`)
}

/**
 * 重新发送
 */
function emailCheckAgain() {
  const initEmailText = userInfo.value?.email
  if (email.value !== initEmailText)
    emailSubmit()
  else
    emailCheck(true)
}

/** 监听邮箱改变 */
watch(() => email.value, (newValue, oldValue) => {
  if (oldValue && newValue && newValue !== oldValue)
    setEmailDisabledBtnFalse()
  else
    setEmailDisabledBtnTrue()
})
watch(() => userInfo.value?.email, (newValue) => {
  setEmail(newValue ?? '')
})

watch(visibility, (newValue) => {
  if (newValue === 'visible')
    appStore.updateUserInfo()
})

/**
 * 验证手机相关
 */
const { bool: isPopperShow, setTrue: setPopperShow, setFalse: setPopperHide } = useBoolean(false)
const { areaSearchValue, areaCodeOptionsFiltered, clearAreaSearchValue } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { bool: isCountdown } = useBoolean(false)
const { bool: isSendedCode } = useBoolean(false)
const {
  start: startPhoneCountdown,
  reset: resetPhoneCountdown,
  current: phoneCurrent,
} = useCountDown({
  time: 60 * 1000,
  onFinish() {
    isCountdown.value = false
  },
})

const areaCode = ref(countryCallingCode.value)
const verifyCodeRef = ref()

const {
  value: phone,
  errorMessage: phoneErrorMsg,
  validate: valiPhone,
  setErrors: setPhoneError,
} = useField<string>('phone', (value) => {
  if (areaCode.value === '+63')
    return philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  else if (areaCode.value === '+86')
    return chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  else if (areaCode.value === '+55')
    return brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  return numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
}, { initialValue: userInfo.value?.phone ? userInfo.value?.phone.split('-')[1] : '' })

const {
  value: verifyCode,
  errorMessage: verifyCodeErrorMsg,
  validate: valiVerifyCode,
} = useField<string>('verifyCode', (value) => {
  if (!value)
    return t('validate_msg_input_code')
  else if (!payPasswordReg.test(value))
    return t('validate_msg_regexp_code_phone')
  return ''
})
const phoneField = computed(() => `${areaCode.value}-${phone.value}`)
const goodToSave = computed(() => {
  if (phone.value && !phoneErrorMsg.value && verifyCode.value && !verifyCodeErrorMsg.value)
    return false
  return true
})
const { run: runPhoneUpdate, loading: updateLoading } = useRequest(() => ApiMemberUpdate({
  record: {
    phone: phoneField.value,
  },
  uid: userInfo.value?.uid,
  captcha: verifyCode.value,
}), {
  async onSuccess() {
    await nextTick()
    openNotify({
      type: 'phone',
      title: t('check_phone'),
      message: t('phone_verify_success'),
    })
    closeDialog()
    nextTick(() => {
      appStore.updateUserInfo()
      openWalletDialog()
    })
  },
})
/** 发送手机验证码 */
const {
  runAsync: runAsyncSendPhoneSms,
  loading: phoneCaptchaLoading,
} = useRequest(() => ApiMemberPhoneSms({ phone: phoneField.value, type: 0 }), {
  onSuccess() {
    isSendedCode.value = true
    resetPhoneCountdown()
    startPhoneCountdown()
    isCountdown.value = true
    openNotify({
      type: 'success',
      title: t('notify_title_success'),
      message: t('success_send_code'),
    })
  },
})
/** 检测是否存在 */
const { runAsync: runExists } = useRequest(ApiMemberExists, {
  onSuccess(res) {
    // if (res.exist)
    //   setPhoneError(t('phone_exists'))
  },
  onError: () => {
    setPhoneError(t('phone_exists'))
  },
})

async function checkPhoneExit() {
  await valiPhone()
  if (!phoneErrorMsg.value)
    await runExists({ ty: 3, val: phoneField.value, noNotify: true })
}
function onVDropdownHide() {
  setPopperHide()
  clearAreaSearchValue()
}
function selectAreaCode(v: string) {
  areaCode.value = v
}
/** 发送验证码 */
async function onSendClick() {
  await checkPhoneExit()
  await valiPhone()
  if (phone.value && !phoneErrorMsg.value)
    runAsyncSendPhoneSms()
}

async function emailSubmit() {
  if (isTypeEmail.value) {
    await emailValidate()
    if (!emailErrormsg.value)
      runMemberUpdate({ record: { email: email.value }, uid: userInfo.value?.uid })
  }
  else {
    await checkPhoneExit()
    await valiPhone()
    await valiVerifyCode()
    if (!phoneErrorMsg.value && !verifyCodeErrorMsg.value && !updateLoading.value)
      runPhoneUpdate()
  }
}

onMounted(() => {
  setEmail(userInfo.value?.email ?? '')
})
</script>

<template>
  <div class="tg-settings-general">
    <AppSettingsContentItem
      :last-one="isDialog" :dialog-box="isDialog"
      :title="isDialog ? (isTypeEmail ? t('label_email_check') : t('check_phone')) : t('email_address')"
      :verified="isTypeEmail ? emailSubmitBtnDisabled : goodToSave"
      :is-counting="current?.seconds > 0 && current?.seconds < 60"
      :badge="isTypeEmail ? emailVerified : phoneVerified"
      :show-submit-btn="!emailVerified || !phoneVerified"
      @submit="emailSubmit"
    >
      <template v-if="isDialog" #top-desc>
        {{ isTypeEmail ? t('must_verify_email_then', { delta: `${tipText}`.toLowerCase() })
          : t('must_verify_phone_then_withdraw') }}
      </template>
      <div :class="{ 'verify-content': isDialog }">
        <BaseLabel v-if="isTypeEmail" :label="isDialog ? t('email1') : t('email_address')" must-small>
          <div v-if="emailVerified" class="email-erified-box cursor-pointer">
            {{ email }}
          </div>
          <BaseInput
            v-else v-model="email" :disabled="emailVerified || (current?.seconds > 0 && current?.seconds < 60)"
            :placeholder="t('email1')"
            :msg="emailErrormsg" :msg-after-touched="msgAfterTouched" style="--tg-base-input-style-pad-left: 0.5em"
            @blur="setMsgAfterTouchedFalse" @focus="setMsgAfterTouchedTrue" @paste="emailPaste"
          />
        </BaseLabel>

        <!-- 验证手机 -->
        <template v-else>
          <BaseLabel :label="t('phone')" must-small>
            <div class="flex gap-[0px] border-rounded">
              <div class="border-right">
                <BaseSelect
                  v-model="areaCode" :placeholder="t('intl_phone_pre')" show-placeholder small :width="isMobile ? '80px' : '150px'"
                  :options="areaCodeOptionsFiltered" :border="false"
                  style="--tg-base-select-border:0;--tg-spacing-8:9px"
                />
              </div>
              <div class="w-full">
                <BaseInput v-model="phone" hide-spin-btn input-mode="numeric" type="number" :placeholder="t('phone')" style="--tg-base-input-style-border:0;--tg-radius-default:0 4px 4px 0;--tg-base-input-height:39px" />
              </div>
            </div>
            <div
              v-show="phoneErrorMsg" class="flex items-center pb-[4px] pt-[8px] text-[12px]"
              style="--tg-icon-color:var(--tg-text-error-sub);"
            >
              <IconUniWarningColor class="error-icon" />
              <span class="text-tg-text-error-sub ml-[4px]">{{ phoneErrorMsg }}</span>
            </div>
          </BaseLabel>
          <BaseLabel :label="t('code')" must-small>
            <BaseInput
              ref="verifyCodeRef" v-model="verifyCode" max="6" :msg="verifyCodeErrorMsg" type="number"
              :hide-spin-btn="true" input-mode="numeric"
            >
              <template #right-icon>
                <div v-if="isCountdown">
                  {{ phoneCurrent.seconds }}s
                </div>
              </template>
            </BaseInput>
          </BaseLabel>
        </template>
      </div>
      <div v-if="isDialog" class="text-tg-text-lightgrey h-[20px] flex items-center font-medium">
        <template v-if="isTypeEmail && brandStore.isOpenMobileVerify">
          {{ t('no_email') }}
          <BaseButton
            type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);"
            @click="toggleTypeEmail"
          >
            &nbsp;{{ t('use_phone') }}
          </BaseButton>
        </template>

        <template v-else-if="!isTypeEmail && brandStore.isOpenEmailVerify">
          {{ t('no_verification_code') }}
          <BaseButton
            type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);"
            @click="toggleTypeEmail"
          >
            &nbsp;{{ t('use_email') }}
          </BaseButton>
        </template>
      </div>

      <template #btm-right>
        <div v-if="isTypeEmail">
          <span v-if="current?.seconds > 0" class="time-seconds">{{ current?.seconds }}s</span>
          <BaseButton
            type="text" :disabled="emailCheckBtnDisabled || (current?.seconds > 0 && current?.seconds < 60)"
            :loading="loadingEmailCheckRequest" size="none" @click="emailCheckAgain()"
          >
            <span :class="{ 'not-verified-span': !emailVerified }">
              {{ t('resend') }}
            </span>
          </BaseButton>
        </div>
        <div v-else-if="!isTypeEmail && brandStore.isOpenMobileVerify">
          <BaseButton
            v-if="!isSendedCode" :disabled="phoneCaptchaLoading" size="none" type="text"
            style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="onSendClick"
          >
            <span class="whitespace-nowrap">{{ t('send_code') }}</span>
          </BaseButton>
          <BaseButton
            v-else :disabled="phoneCaptchaLoading || isCountdown" size="none" type="text"
            style="--tg-base-button-text-default-color:var(--tg-text-white);" @click="onSendClick"
          >
            <span class="resend whitespace-nowrap">{{ t('resend') }}</span>
          </BaseButton>
        </div>
      </template>
    </AppSettingsContentItem>
  </div>
</template>

<style lang="scss" scoped>
.time-seconds {
  margin-right: 6px;
  font-size: var(--tg-font-size-default);
}

.tg-settings-general {
  // padding: 0 16px 16px;
  .verify-content {
    display: flex;
    flex-direction: column;
    // padding: 0 16px 16px;
    > *:not(:first-child) {
      margin-top: 16px;
    }
  }

  .email-erified-box {
    width: 100%;
    height: 40.5px;
    background-color: var(--tg-secondary-main);
    line-height: 20.5px;
    color: var(--tg-text-white);
    padding: var(--tg-spacing-input-padding-vertical) var(--tg-base-input-style-pad-x);
    padding-left: 0.5em;
    font-weight: var(--tg-font-weight-semibold);
    border-radius: var(--tg-radius-default);
    border-width: var(--tg-border-width-sm);
    border-style: solid;
    border-color: var(--tg-border-color-main);
    transition: all ease 0.25s;

    &:hover {
      border-color: var(--tg-border-color-deep-grey);
    }
    @include webTheme('green') {
      background-color: #02432d;
    }
    @include webTheme('white') {
      background-color: #e8e8e8;
    }
  }

  .open-gmail {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--tg-text-white);
    font-size: var(--tg-font-size-default);
    --tg-icon-color: var(--tg-text-white);
  }

  .not-verified-span {
    color: var(--tg-text-white);
  }
  .resend {
    @include webTheme('green') {
      color: #ffefb0;
    }
  }
  .border-right {
    border-right: 2px solid var(--tg-border-color-main);
  }
  .border-rounded {
    border-radius: var(--tg-radius-default);
    border-width: var(--tg-border-width-sm);
    border-style: solid;
    border-color: var(--tg-border-color-main);
  }
}

.base-input {
  @include webTheme('green') {
    --tg-base-input-style-bg: #02432d;
  }
  @include webTheme('white') {
    --tg-base-input-style-border: 1px solid #e3e3e3;
    --tg-base-input-style-bg: #f5f5f5;
  }
}
</style>

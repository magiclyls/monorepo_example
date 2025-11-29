<script lang="ts" setup>
import { ApiMemberPayPasswordUpdate, ApiMemberPhoneSms, ApiMemberSendMailCode } from '@tg/apis'

interface Props {
  tipText?: string
}
defineOptions({
  name: 'AppPayPassword',
})
defineProps<Props>()

const { t } = useI18n()
const router = useLocalRouter()
const { openNotify } = useNotify()
const { userInfo } = storeToRefs(useAppStore())
const { openService } = useService()
const brandStore = useBrandStore()
const { isSetPayPwd, runMemberAuthConfig } = useAuthConfig()
const { isEmailVerify, isPhoneVerified } = useUserVerify()
const { bool: isEmailCodeType, toggle: toggleCodeType } = useBoolean(isEmailVerify.value)

const {
  value: oldPayPassword,
  errorMessage: oldPayPwdErrorMsg,
  validate: valiOldPayPwd,
  resetField: resetOldPayPwd,
} = useField<string>('payPassword', (value) => {
  if (!payPasswordReg.test(value))
    return t('only_6_num')
  return ''
})
const {
  value: payPassword,
  errorMessage: payPwdErrorMsg,
  validate: valiPayPwd,
  resetField: resetPayPassword,
} = useField<string>('payPassword', fieldVerifyPayPwd)
const {
  value: aginPayPassword,
  errorMessage: aginPayPwdErrorMsg,
  validate: valiAginPayPwd,
  resetField: resetAginPayPassword,
} = useField<string>('aginPayPassword', (value) => {
  if (!value)
    return t('only_6_num')
    // return t('pls_enter_password')
  else if (value !== payPassword.value)
    // return t('validate_msg_safepwd_unequal')
    return t('pwd_2_not_equal')
  return ''
})
const {
  value: emailCode,
  errorMessage: emailCodeErrorMsg,
  validate: valiemailCode,
  resetField: resetEmailCode,
} = useField<string>('emailCode', (value) => {
  if (!value)
    return t('validate_msg_input_code')
  else if (value.length !== 6)
    return t('your_code_msg')
  return ''
}, { initialValue: '' })
const { bool: isCountdown, setFalse: setCountdownFalse } = useBoolean(false)
const {
  start,
  reset,
  current,
} = useCountDown({
  time: 60 * 1000,
  onFinish() {
    setCountdownFalse()
  },
})

const {
  run: runMemberPayPasswordUpdate,
  loading: payPasswordUpdateLoading,
} = useRequest(ApiMemberPayPasswordUpdate, {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('notify_title_success'),
      message: t('success_set_safepwd'),
    })
    // 资金密码设置成功之后，刷新信息
    reset()
    runMemberAuthConfig()
    resetOldPayPwd()
    resetPayPassword()
    resetAginPayPassword()
    resetEmailCode()
  },
})

const pwdRef = ref()
const oldPwdRef = ref()
const aginPwdRef = ref()
const mailCodeRef = ref()

const {
  runAsync: runAsyncMemberSendMailCode,
  loading: sendMailCodeLoading,
} = useRequest(ApiMemberSendMailCode, {
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
} = useRequest(() => ApiMemberPhoneSms({ type: 1, uid: userInfo.value?.uid }), {
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

// const getPayPwdState = computed(() => {
//   return userInfo.value?.pay_password === '1'
// })
const getMailState = computed(() => {
  return userInfo.value?.email_check_state === 2 && userInfo.value?.phone_check_state === 2
})
const isEmptyEmail = computed(() => (isSetPayPwd.value ? oldPayPassword.value : true) && payPassword.value && aginPayPassword.value)
const isEmptyInput = computed(() => [oldPayPassword.value, payPassword.value, aginPayPassword.value, emailCode.value])
/** 是否显示手机或者邮箱Code输入框 */
const isHideCode = computed(() => {
  return brandStore.isOpenEmailVerify === false && brandStore.isOpenMobileVerify === false
})
const passwordSubmitDisabled = computed(() => {
  if (brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify)
    return getMailState.value
  else if (brandStore.isOpenEmailVerify)
    return !isEmailVerify.value
  else if (brandStore.isOpenMobileVerify)
    return !isPhoneVerified.value

  return false
})

/** 发送验证码 */
function sendCode() {
  if (isEmailCodeType.value)
    runAsyncMemberSendMailCode()
  else
    runAsyncSendPhoneSms()
}

function fieldVerifyPayPwd(value: string) {
  if (!payPasswordReg.test(value))
    return t('only_6_num')
  // return t('pls_enter_password')
  // else if (!payPasswordReg.test(value))
  //   return t('tip_safepwd_six')
  else if (aginPayPassword.value)
    valiAginPayPwd()
  return ''
}
// 提交资金密码
async function submitPayPwd() {
  isSetPayPwd.value && oldPwdRef.value.setTouchTrue()
  pwdRef.value.setTouchTrue()
  aginPwdRef.value.setTouchTrue()
  isSetPayPwd.value && valiOldPayPwd()

  if (!isHideCode.value)
    mailCodeRef.value.setTouchTrue()

  await valiPayPwd()
  await valiAginPayPwd()
  if (!isHideCode.value)
    await valiemailCode()

  if (!(payPwdErrorMsg.value || aginPayPwdErrorMsg.value || emailCodeErrorMsg.value || oldPayPwdErrorMsg.value)) {
    runMemberPayPasswordUpdate({
      types: isSetPayPwd.value ? 2 : 1,
      old_pay_password: isSetPayPwd.value ? oldPayPassword.value : '',
      pay_password: payPassword.value,
      code: emailCode.value,
      code_type: isEmailCodeType.value ? 1 : 2,
    })
  }
}

watchEffect(() => {
  if (brandStore.isOpenMobileVerify && !brandStore.isOpenEmailVerify && isPhoneVerified.value)
    isEmailCodeType.value = false
})
</script>

<template>
  <div class="tg-settings-security pay-setting-form">
    <!-- t('menu_title_settings_update_safepwd') -->
    <AppSettingsContentItem
      :title="isSetPayPwd ? t('edit_safe_pwd') : t('settings_change_password_funds_password_set_safe_pwd')"
      last-one
      :btn-loading="payPasswordUpdateLoading"
      :verified="passwordSubmitDisabled"
      :btn-text="tipText ? t('save') : t('save')"
      :style="{
        '--tg-app-settings-content-item-style-max-width':
          getMailState ? '100%' : '420px',
      }"
      :depends-disabled="[isEmptyInput]"
      @submit="submitPayPwd"
    >
      <template v-if="tipText" #top-desc>
        {{ t('first_withdraw_money_need_pay_password') }}
      </template>

      <div v-if="(getMailState && brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify)" class="mail-not-bind">
        <div class="mb-[20px]">
          {{ t('settings_change_password_funds_password_not_bind_email') + t('settings_change_password_funds_password_must_bind_email') }}
        </div>
        <BaseButton size="none" type="text" @click="router.push('/settings/general')">
          {{ t('go_bind') }}
        </BaseButton>
      </div>
      <div v-else-if="brandStore.isOpenEmailVerify && !brandStore.isOpenMobileVerify && !isEmailVerify" class="mail-not-bind">
        <div class="mb-[20px]">
          {{ t('not_bind_email_pay_pwd_tip') }}
        </div>
        <BaseButton size="none" type="text" @click="router.push('/settings/general')">
          {{ t('go_bind') }}
        </BaseButton>
      </div>
      <div v-else-if="brandStore.isOpenMobileVerify && !brandStore.isOpenEmailVerify && !isPhoneVerified" class="mail-not-bind">
        <div class="mb-[20px] leading-6">
          {{ t('not_bind_phone_pay_pwd_tip') }}
        </div>
        <BaseButton class="go-to-bind" size="none" type="text" @click="router.push('/settings/general')">
          {{ t('go_bind') }}
        </BaseButton>
      </div>
      <template v-else>
        <BaseLabel v-if="isSetPayPwd" :must="isSetPayPwd" :label="t('old_safe_pwd')">
          <BaseInput
            ref="oldPwdRef" v-model="oldPayPassword"
            :placeholder="t('old_safe_pwd')" input-mode="numeric"
            :msg="oldPayPwdErrorMsg"
            type="password"
            max="6"
            msg-after-touched
          />
        </BaseLabel>
        <!-- t('menu_title_settings_update_safepwd') -->
        <BaseLabel
          :must="true"
          :label="isSetPayPwd
            ? t('new_safe_pwd') : t('menu_title_settings_update_safepwd')"
        >
          <BaseInput
            ref="pwdRef" v-model="payPassword" input-mode="numeric"
            :placeholder="isSetPayPwd
              ? t('new_safe_pwd') : t('menu_title_settings_update_safepwd')"
            :msg="payPwdErrorMsg"
            type="password"
            max="6"
            msg-after-touched
          />
        </BaseLabel>
        <BaseLabel :label="t('confirm_safe_pwd')" :must="true">
          <BaseInput
            ref="aginPwdRef" v-model="aginPayPassword" input-mode="numeric"
            :placeholder="t('confirm_safe_pwd')"
            :msg="aginPayPwdErrorMsg"
            type="password"
            max="6"
            msg-after-touched
          />
        </BaseLabel>
        <BaseLabel v-if="!isHideCode" :label="isEmailCodeType ? t('pop_up_wallet_card_set_funds_password_email_code') : t('phone_verify_code')" :must="true">
          <div class="row-mail-code">
            <div class="mr-[10px]" style="flex:  1;">
              <BaseInput
                ref="mailCodeRef" v-model="emailCode" input-mode="numeric"
                :placeholder="t('code')"
                :msg="emailCodeErrorMsg"
                type="text"
                max="6"
                msg-after-touched
              />
            </div>
            <BaseButton
              bg-style="primary"
              :loading="sendMailCodeLoading || phoneCaptchaLoading"
              :disabled="isCountdown || !isEmptyEmail"
              custom-padding
              :style="{
                '--tg-base-button-style-bg': isCountdown ? 'var(--tg-text-grey)' : '',
                'min-width': '105px',
                '--tg-base-button-padding-y': 'var(--tg-spacing-13)',
              }"
              @click="sendCode"
            >
              <!-- t('after_seconds_send_code') -->
              <span v-if="isCountdown">{{ `${t('re_get')} ${current.seconds}s` }}</span>
              <span v-else>{{ t('get_email_code') }}</span>
            </BaseButton>
          </div>
        </BaseLabel>
        <div v-if="isEmailVerify && isPhoneVerified && brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify">
          {{ t('no_verification_code') }}
          <BaseButton
            type="text" size="none" style="--tg-base-button-text-default-color:var(--tg-text-white);"
            @click="setCountdownFalse();toggleCodeType();resetEmailCode()"
          >
            <span class="theme-text">{{ isEmailCodeType ? t('use_phone') : t('use_email') }}</span>
          </BaseButton>
        </div>
        <div v-if="isSetPayPwd" class="forget-pwd">
          {{ t('forget_safe_pwd') }}
          <BaseButton class="contact-customer" size="none" type="text" @click="openService({ isFootBar: false, needDeal: true })">
            {{ t('connect_service') }}
          </BaseButton>
        </div>
      </template>

      <!-- <template #top-desc>
        {{ t('tip_safepwd') }}
      </template> -->
      <!-- <BaseLabel :label="t('password')" must-small>
        <BaseInputPassword
          ref="pwdRef"
          v-model="payPassword"
          :msg="payPwdErrorMsg"
          msg-after-touched
        />
      </BaseLabel>
      <BaseLabel :label="t('confirm_pwd')" must-small>
        <BaseInputPassword
          ref="aginPwdRef" v-model="aginPayPassword"
          :msg="aginPayPwdErrorMsg"
          msg-after-touched
        />
      </BaseLabel> -->
    </AppSettingsContentItem>
  </div>
</template>

<style>
[theme='white'] {
  --tg-text-blue: #ff9724;
}
</style>

<style lang="scss" scoped>
.tg-settings-security {
  .theme-text {
    @include webTheme('green') {
      color: #ffefb0;
    }
  }
  color: var(--tg-text-lightgrey);
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);
  .mail-not-bind {
    display: flex;
    flex-direction: column;
    align-items: center;
    // gap: var(--tg-spacing-20);
    margin: var(--tg-spacing-50) 0;
    --tg-base-button-text-default-color: var(--tg-text-blue);
  }
  .row-mail-code {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    // gap: var(--tg-spacing-10);
  }
  .forget-pwd {
    font-size: var(--tg-font-size-default);
    text-align: center;
    margin-top: var(--tg-spacing-30);
    --tg-base-button-text-default-color: var(--tg-text-blue);
    @include webTheme('green') {
      --tg-base-button-text-default-color: #ffefb0;
      color: var(--tg-text-green-main);
    }
  }
}
.pay-setting-form {
  @include webTheme('white') {
    .contact-customer {
      --tg-base-button-text-default-color: var(--tg-text-blue);
    }
  }
  @include webTheme('green') {
    .contact-customer {
      --tg-base-button-text-default-color: var(--tw-ring-offset-color);
    }
  }
}

.base-label {
  @include webTheme('green') {
    --tg-base-input-style-bg: #02432d;
  }
  @include webTheme('white') {
    --tg-base-input-style-bg: #f5f5f5;
  }
}
</style>

<route lang="yaml">
  </route>

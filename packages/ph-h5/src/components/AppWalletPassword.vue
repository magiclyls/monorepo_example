<script lang="ts" setup>
import { ApiMemberPayPasswordUpdate, ApiMemberPhoneSms, ApiMemberSendMailCode } from '@tg/apis'
import { PhBaseButton, PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
import { useBoolean, useCountDown } from '@tg/hooks'
import { useAppStore, useBrandStore } from '@tg/stores'
import { payPasswordReg } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { RouterLink, useRouter } from 'vue-router'
import { useUserVerify } from '~/hooks'
import { Message } from '~/utils'

interface Props {
  isComponent?: boolean
}
defineOptions({ name: 'AppWalletPasswordSetting' })

const props = withDefaults(defineProps<Props>(), {
  isComponent: false,
})

const { t } = useI18n()
const pwdRef = ref()
const oldPwdRef = ref()
const aginPwdRef = ref()
const mailCodeRef = ref()
const brandStore = useBrandStore()
const router = useRouter()
const { updateUserInfo, runMemberAuthConfig } = useAppStore()
const { isEmailVerify, isPhoneVerified } = useUserVerify()
const { userInfo, isSetPayPwd, isLogin } = storeToRefs(useAppStore())
const { bool: isCountdown, setFalse: setCountdownFalse } = useBoolean(false)
const { bool: isEmailCodeType, toggle: toggleCodeType } = useBoolean(isEmailVerify.value)
const {
  value: oldPayPassword,
  errorMessage: oldPayPwdErrorMsg,
  validate: valiOldPayPwd,
  resetField: resetOldPayPwd,
} = useField<string>('payPassword', (value) => {
  if (!payPasswordReg.test(value))
    return t('仅支持6位纯数字')
  return ''
})

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
    return t('仅支持6位纯数字')
  else if (value !== payPassword.value)
    return t('密码不一致')
  return ''
})

const {
  value: emailCode,
  errorMessage: emailCodeErrorMsg,
  validate: valiemailCode,
  resetField: resetEmailCode,
} = useField<string>('emailCode', (value) => {
  if (!value)
    return t('请输入验证码')
  else if (value.length !== 6)
    return t('仅支持6位纯数字')
  return ''
}, { initialValue: '' })

const getMailState = computed(() => {
  return userInfo.value?.email_check_state === 2 && userInfo.value?.phone_check_state === 2
})
const isEmptyEmail = computed(() => (isSetPayPwd.value ? oldPayPassword.value : true) && payPassword.value && aginPayPassword.value)
const isEmptyInput = computed(() => [oldPayPassword.value, payPassword.value, aginPayPassword.value, emailCode.value])
const needBindEmail = computed(() => brandStore.isOpenEmailVerify && !brandStore.isOpenMobileVerify && !isEmailVerify.value)
const needBindPhone = computed(() => brandStore.isOpenMobileVerify && !brandStore.isOpenEmailVerify && !isPhoneVerified.value)
const needBindEmailOrPhone = computed(() => getMailState.value && brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify)
const needToVerifyPhoneOrEmail = computed(() => isEmailVerify.value && isPhoneVerified.value && brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify)
const bindUrl = computed(() => needBindEmail.value ? '/email' : needBindPhone.value ? '/phone' : needBindEmailOrPhone.value ? '/phone' : '')
const showBind = computed(() => needBindEmailOrPhone.value || needBindEmail.value || needBindPhone.value)
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

const {
  run: runMemberPayPasswordUpdate,
  loading: payPasswordUpdateLoading,
} = useRequest(ApiMemberPayPasswordUpdate, {
  onSuccess() {
    Message.success(t('设置资金密码成功'))
    // 资金密码设置成功之后，刷新信息
    reset()
    runMemberAuthConfig()
    resetOldPayPwd()
    resetPayPassword()
    resetAginPayPassword()
    resetEmailCode()
    updateUserInfo()
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
    Message.success(t('验证码发送成功'))
  },
})

const {
  runAsync: runAsyncMemberSendMailCode,
  loading: sendMailCodeLoading,
} = useRequest(ApiMemberSendMailCode, {
  onSuccess() {
    reset()
    start()
    isCountdown.value = false
    Message.success(t('设置资金密码成功'))
  },
})

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

function fieldVerifyPayPwd(value: string) {
  if (!payPasswordReg.test(value))
    return t('仅支持6位纯数字')
  else if (aginPayPassword.value)
    valiAginPayPwd()
  return ''
}

/** 发送验证码 */
function sendCode() {
  if (isEmailCodeType.value)
    runAsyncMemberSendMailCode()
  else
    runAsyncSendPhoneSms()
}

watchEffect(() => {
  if (brandStore.isOpenMobileVerify && !brandStore.isOpenEmailVerify && isPhoneVerified.value)
    isEmailCodeType.value = false
})
</script>

<template>
  <div class="bg-white rounded-[8rem] p-[12rem]">
    <div v-if="!isSetPayPwd && !showBind && isComponent">
      <div class="text-[#0D2245] text-[18rem] font-[600] mb-[16rem] flex items-center">
        <span>{{ t('资金密码') }}</span>
      </div>
      <div class="text-[#6D7693] text-[14rem] font-[500] mb-[16rem]">
        {{ t('您是首次提款,需要先设置资金密码') }}
      </div>
    </div>
    <div v-if="(getMailState && brandStore.isOpenEmailVerify && brandStore.isOpenMobileVerify)" class="text-[14rem] text-[#6D7693] font-[600] text-left">
      {{ t('未绑定手机和邮箱') }}
    </div>
    <div v-else-if="brandStore.isOpenEmailVerify && !brandStore.isOpenMobileVerify && !isEmailVerify" class="text-[14rem] text-[#6D7693] font-[600] text-left">
      {{ t('未绑定邮箱') }}
    </div>
    <div v-else-if="brandStore.isOpenMobileVerify && !brandStore.isOpenEmailVerify && !isPhoneVerified" class="text-[14rem] text-[#6D7693] font-[600] text-left">
      {{ t('未绑定手机') }}
    </div>
    <div v-else>
      <PhBaseLabel v-if="isSetPayPwd" :label="t('原资金密码')" required class="mb-[16rem]">
        <PhBaseInput
          ref="oldPwdRef"
          v-model="oldPayPassword"
          name="password"
          type="password"
          msg-after-touched
          :msg="oldPayPwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('原资金密码')"
          style="--ph-base-input-padding-y: 9rem;"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('新资金密码')" required class="mb-[16rem]">
        <PhBaseInput
          ref="pwdRef"
          v-model="payPassword"
          name="password"
          type="password"
          msg-after-touched
          :msg="payPwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('新资金密码')"
          style="--ph-base-input-padding-y: 9rem;"
        />
      </PhBaseLabel>
      <PhBaseLabel :label="t('确认资金密码')" required class="mb-[16rem]">
        <PhBaseInput
          ref="aginPwdRef"
          v-model="aginPayPassword"
          name="password"
          type="password"
          msg-after-touched
          :msg="aginPayPwdErrorMsg"
          required
          inputmode="number"
          :placeholder="$t('确认资金密码')"
          style="--ph-base-input-padding-y: 9rem;"
        />
      </PhBaseLabel>

      <div v-if="!isHideCode" class="flex gap-[20rem] mb-[5rem] items-end">
        <div class="flex-1">
          <PhBaseLabel :label="isEmailCodeType ? t('邮箱验证码') : t('手机验证码')" required>
            <PhBaseInput
              ref="mailCodeRef"
              v-model="emailCode"
              name="emailCode"
              type="text"
              msg-after-touched
              :msg="emailCodeErrorMsg"
              required
              inputmode="number"
              :placeholder="isEmailCodeType ? t('邮箱验证码') : t('手机验证码')"
              style="--ph-base-input-padding-y: 9rem;"
            />
          </PhBaseLabel>
        </div>
        <PhBaseButton type="primary" :loading="sendMailCodeLoading || phoneCaptchaLoading" :disabled="isCountdown || !isEmptyEmail" class="h-[40rem] w-[110rem] mt-[25rem]" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: #EBEBEB;--ph-base-button-secondary-background-color:#fff" @click="sendCode">
          <span v-if="isCountdown">{{ `${t('重新获取')} ${current.seconds}s` }}</span>
          <span v-else>{{ t('获取验证码') }}</span>
        </PhBaseButton>
      </div>
      <div v-if="needToVerifyPhoneOrEmail" class="flex gap-[2rem] text-[14rem] font-[600]" @click="isEmailCodeType = !isEmailCodeType">
        <span class="text-[#6D7693]">{{ t('没有收到验证码吗') }}</span>
        <span class="text-[#0D2245]">{{ isEmailCodeType ? t('使用手机') : t('使用邮箱') }}</span>
      </div>
      <div v-if="isSetPayPwd" class="text-right mt-[16rem]">
        <RouterLink class="text-[14rem] text-[#6D7693] font-[500] " to="/service">
          {{ t('忘记密码了') }}
        </RouterLink>
      </div>
    </div>
    <div v-if="showBind" class="text-center text-[#025BE8] font-[600] mt-[16rem]" @click="router.push(bindUrl)">
      {{ t('前往绑定') }}
    </div>
    <div class="flex justify-end">
      <PhBaseButton :disabled="showBind" type="primary" html-type="submit" :loading="payPasswordUpdateLoading" class="h-[44rem] mt-[16rem] w-full" :class="[isComponent && 'w-auto!']" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: #EBEBEB;--ph-base-button-secondary-background-color:#fff" :style="[isComponent && '--ph-base-button-padding-x: 26rem']" @click="submitPayPwd">
        {{ t('保存') }}
      </PhBaseButton>
    </div>
  </div>
</template>

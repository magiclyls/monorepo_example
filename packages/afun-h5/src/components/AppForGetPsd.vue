<script setup lang='ts'>
import { ApiMemberExists, ApiMemberPasswordUpdateCode, ApiMemberPhoneSms, ApiMemberSendMailCaptcha } from '@tg/apis'
import { AfunBaseButton, AfunBaseImage, AfunBaseInput, AfunBaseOriginSelect } from '@tg/bccomponents'
import { useAreaCode, useBoolean, useCountDown, useIpApi } from '@tg/hooks'
import { IconForgetClose } from '@tg/icons'
import { brazilPhoneReg, chinaPhoneReg, emailReg, lastOneNumberReg, numberReg, payPasswordReg, philippinePhoneReg, startWithNumber, upperLowerReg } from '@tg/utils'
import { useField } from 'vee-validate'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'

defineOptions({
  name: 'AppForGetPsd',
})
const emits = defineEmits(['close'])
const { t } = useI18n()
const router = useRouter()
// const { openService } = useService()
const { areaCodeOptionsFiltered } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { bool: isCountdown } = useBoolean(false)
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

const page = ref(1)
const areaCode = ref(countryCallingCode.value)

const {
  value: account,
  errorMessage: accountErrorMsg,
  validate: valiAccount,
  setErrors: setAccountError,
} = useField<string>('account', (value) => {
  if (!value) {
    return t('请输入电邮地址') + t(' 或 ') + t('手机号码')
  }

  else if (value.includes('@')) {
    return emailReg.test(value) ? '' : t('电邮地址格式不正确')
  }

  else if (startWithNumber.test(value)) {
    if (areaCode.value === '+63')
      return philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18 ? '' : t('手机号码无效')
    else if (areaCode.value === '+86')
      return chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18 ? '' : t('手机号码无效')
    else if (areaCode.value === '+55')
      return brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18 ? '' : t('手机号码无效')
    return numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : t('手机号码无效')
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
    return t('请输入验证码')
  else if (!payPasswordReg.test(value))
    return isEmailType.value ? t('您的邮箱验证码含有6位数字') : t('您的手机验证码含有6位数字')
  return ''
})
const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: valiPassword,
} = useField<string>('password', (value) => {
  if (!value)
    return t('您的密码必须含有至少 8 个字符')
  else if (value.length < 8)
    return t('您的密码必须含有至少 8 个字符')
  else if (!upperLowerReg.test(value))
    return t('密码必须含有至少 1 个大写字母和 1 个小写字母')
  else if (!lastOneNumberReg.test(value))
    return t('密码必须含有至少一个数字')
  return ''
})

/** 找回密码接口 */
const { runAsync: runResetPassword, loading: resetLoading } = useRequest(() => ApiMemberPasswordUpdateCode({
  captcha: verifyCode.value,
  type: isEmailType.value ? 1 : 2,
  new_password: password.value,
  phone_email: phoneEmail.value,
}), {
  onSuccess() {
    Message.success(t('登录密码') + t('修改成功'))
    emits('close')
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
    Message.success(t('验证码发送成功'))
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
    Message.success(t('验证码发送成功'))
  },
})

/** 检测是否存在 */
const { runAsync: runExists, loading: existLoading } = useRequest(ApiMemberExists, {
  onSuccess(res) {
    if (isEmailType.value)
      setAccountError(t('用户不存在'))
    else
      setAccountError(t('用户不存在'))
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

/** 点击恢复密码 */
async function onSendCodeClick() {
  if (emailCaptchaLoading.value || phoneCaptchaLoading.value || existLoading.value)
    return

  await valiAccount()
  if (accountErrorMsg.value) {
    Message.error(accountErrorMsg.value)
    return
  }
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
  if (verifyCodeErrorMsg.value || pwdErrorMsg.value) {
    Message.error(verifyCodeErrorMsg.value as string || pwdErrorMsg.value as string)
    return
  }
  if (!verifyCodeErrorMsg.value && !pwdErrorMsg.value)
    runResetPassword()
}

async function onClickService() {
  emits('close')
  await nextTick()
  router.push('/service')
  // openService({ isFootBar: false, needDeal: true })
}
function goBack() {
  page.value = 1
  reset()
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
  <div class="p-[16px] grid gap-[12px] pb-[32px]">
    <template v-if="page === 1">
      <div class="flex items-center">
        <span class="text-[18px] font-[600] mr-auto leading-[25px] font-[600]">{{ t('忘记密码') }}</span>
        <div class="cursor-pointer" @click="emits('close')">
          <IconForgetClose class="text-[16px] text-[#B1BAD3]" />
        </div>
      </div>
      <div>
        <div class="flex">
          <AfunBaseInput v-model="account" name="account" type="text" :placeholder="`${t('邮箱地址')}/${t('手机号码')}`">
            <template v-if="account && !isEmailType && isStartWithNumber" #left>
              <div class="center h-full flex text-[#fff]">
                <AfunBaseImage v-if="areaCode && areaCode.length" class="w-[16px]" :url="`/flag/${areaCode.slice(1)}.webp`" />
                <AfunBaseOriginSelect v-model="areaCode" :options="areaCodeOptionsFiltered" />
              </div>
            </template>
          </AfunBaseInput>
        </div>
      </div>
      <AfunBaseButton
        :loading="emailCaptchaLoading || phoneCaptchaLoading"
        @click="onSendCodeClick"
      >
        {{ t('恢复密码') }}
      </AfunBaseButton>
      <i18n-t keypath="未绑定邮箱或手机，请{0}" tag="div" class="text-[#B1BAD3] flex-wrap items-center font-semibold leading-[21px]">
        <span class="ml-[4px] text-[#fff]" @click="onClickService">
          {{ t('联系客服') }}
        </span>
      </i18n-t>
    </template>
    <template v-else-if="page === 2">
      <div class="flex items-center text-[18px] font-[600]" @click="goBack">
        <span class="mr-auto">{{ isEmailType ? t('邮箱验证') : t('手机验证') }}</span>
        <IconForgetClose class="text-[16px] text-[#0D2245]" />
      </div>

      <i18n-t keypath="请输入发送至 {0} 的6位验证码，该验证码的有效期为5分钟。" tag="div" class="text-[14px] text-[#0D2245] leading-[21px] font-[600]">
        <span>{{ isEmailType ? account : `${areaCode} ${account}` }}</span>
      </i18n-t>
      <AfunBaseInput v-model="verifyCode" name="verifyCode" :msg="verifyCodeErrorMsg" :max="6" type="number" input-mode="numeric">
        <template #right>
          <div v-if="isCountdown" class="center h-full text-[#9DABC9]">
            {{ current.seconds }}s
          </div>
          <div v-else class="center h-full text-[#9DABC9]" @click="onResendClick">
            <span class="whitespace-nowrap">{{ t('重新发送') }}</span>
          </div>
        </template>
      </AfunBaseInput>
      <AfunBaseInput v-model="password" type="password" :placeholder="t('新密码')" name="password" />
      <AfunBaseButton :loading="resetLoading" :disabled="resetLoading" @click="onSubmitClick">
        {{ t('提交') }}
      </AfunBaseButton>
      <div class="text-center font-[600] cursor-pointer" @click="page = 1">
        {{ `${t('切换')}${isEmailType ? t('手机验证') : t('邮箱验证')}` }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
</style>

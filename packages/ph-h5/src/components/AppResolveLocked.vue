<script setup lang='ts'>
import { ApiMemberUnlock, ApiMemberVerify } from '@tg/apis'
import { PhBaseButton, PhBaseImage, PhBaseInput, PhBaseOriginSelect } from '@tg/bccomponents'
import { useAreaCode, useBoolean, useCountDown, useIpApi } from '@tg/hooks'
import { IconUniClose3, IconUniError } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { brazilPhoneReg, chinaPhoneReg, emailReg, numberReg, payPasswordReg, philippinePhoneReg, startWithNumber, usernameReg } from '@tg/utils'
import { useField } from 'vee-validate'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'
import AppNoReceiveCode from './AppNoReceiveCode.vue'

interface Props {
  openPage: 'self' | 'long' | 'noCode'
  getAccount?: string
  getUsername?: string
  getPassword?: string
  cpf?: string
  isShow: boolean
}
defineOptions({
  name: 'AppResolveLocked',
})
const props = defineProps<Props>()
const emits = defineEmits(['close'])

// const { openNotify } = useNotify()
const { t } = useI18n()
const router = useRouter()
const { areaCodeOptionsFiltered } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { bool: isCountdown } = useBoolean(false)

const appStore = useAppStore()

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
    return t('请输入电邮地址') + t('或') + t('手机号码')
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

const {
  value: username,
  errorMessage: usernameErrorMsg,
  validate: valiUsername,
  setErrors: setUsernameErrorMsg,
} = useField<string>('username', (value) => {
  if (!value || value.length < 3)
    return t('最小字符长度为 {delta}', { delta: 3 })
  else if (value.length > 30)
    return t('最大字符长度为 {delta}', { delta: 30 })
  else if (value.match('[^@.a-zA-Z0-9_]'))
    return t('用户名含有无效的字符')
  else if (!emailReg.test(value) && !usernameReg.test(value))
    return t('请输入正确的电邮地址或 3 - 30 个大小写英文和数字组成的用户名')
  return ''
})

const isStartWithNumber = computed(() => startWithNumber.test(account.value))
const pageType = computed(() => props.openPage)
const getAccount = computed(() => props.getAccount || '')
console.log('🚀 ~ getAccount:', getAccount)
const getUsername = computed(() => props.getUsername || '')
const getPassword = computed(() => props.getPassword || '')
const isEmailType = computed(() => {
  if (pageType.value === 'self' && account.value.includes('@'))
    return true
  if (pageType.value === 'long' && getAccount.value.includes('@'))
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
    return t('请输入验证码')
  else if (!payPasswordReg.test(value))
    return isEmailType.value ? t('您的邮箱验证码含有6位数字') : t('您的手机验证码含有6位数字')
  return ''
}, { initialValue: '' })
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
    if (isFirst.value) {
      isFirst.value = false
      reset()
      start()
      isCountdown.value = true
    }
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
  if (verifyCodeErrorMsg.value || usernameErrorMsg.value || accountErrorMsg.value) {
    Message.error(verifyCodeErrorMsg.value as string || usernameErrorMsg.value as string || accountErrorMsg.value as string)
    return
  }

  const params = {
    username: username.value,
    [isEmailType.value ? 'email' : 'phone']: isEmailType.value ? account.value : `${areaCode.value}-${account.value}`,
    captcha: verifyCode.value,
  }
  runResolveLocked(params).then(() => {
    Message.success(t('您的账号已解除锁定。'))
    emits('close')
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
    Message.success(`${t('欢迎')} ${getUsername.value}！`)
    router.push('/')
  })
}

// 验证
async function onVerify() {
  await valiVerifyCode()
  if (!verifyCode.value)
    return

  runMemberVerifyApi()
}
function onClose() {
  emits('close')
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
  if (pageType.value === 'long') {
    if (isFirst.value)
      isFirst.value = false
    reset()
    start()
    isCountdown.value = true
  }
})
</script>

<template>
  <div class="p-[16rem] pb-[32rem] bg-[#F6F7F8]">
    <!-- 解除锁定 -->
    <template v-if="page === 'self'">
      <div class="flex w-full cursor-pointer items-center text-[18rem] mb-[12rem] font-semibold">
        <span class="mr-auto leading-[25rem]">{{ t('解除锁定') }}</span>
        <div @click="onClose">
          <IconUniClose3 class="text-[14rem] text-[#0D2245]" />
        </div>
      </div>
      <PhBaseInput v-model="username" name="username" :placeholder="t('用户名')" class="mb-[12rem]" />

      <div class="flex flex-col">
        <PhBaseInput v-model="account" name="account" type="text" :placeholder="`${t('邮箱')}/${t('手机号码')}`" class="mb-[12rem]">
          <template v-if="account && !isEmailType && isStartWithNumber" #left>
            <div class="center h-full flex text-[#9DABC9]">
              <PhBaseImage v-if="areaCode && areaCode.length" class="w-[16rem]" :url="`/flag/${areaCode.slice(1)}.webp`" />
              <PhBaseOriginSelect v-model="areaCode" :options="areaCodeOptionsFiltered" />
            </div>
          </template>
        </PhBaseInput>
      </div>
      <div class="flex justify-between">
        <PhBaseInput v-model="verifyCode" name="verify" class="!w-[190rem] right-bg mr-[6rem]" :placeholder="t('验证码')" :max="6" type="number" input-mode="numeric" />
        <PhBaseButton :disabled="isDisabled" class="w-auto shrink-0" style="--ph-base-button-font-weight: 500" @click="getCodeSelf">
          <span v-if="isFirst">{{ t('获取验证码') }}</span>
          <template v-else>
            <div v-if="isCountdown">
              {{ current.seconds }}s
            </div>
            <span v-else>{{ t('重新发送') }}</span>
          </template>
        </PhBaseButton>
      </div>

      <div class="text-[#6D7693] cursor-pointer whitespace-nowrap font-[600] my-[12rem] leading-[21rem]" @click="page = 'noCode'">
        {{ t('没有收到验证码？') }}
      </div>

      <PhBaseButton class="w-full" @click="onResolve">
        {{ t('提交') }}
      </PhBaseButton>
    </template>

    <!-- 长时间未登录弹窗 -->
    <template v-if="page === 'long'">
      <div class="grid gap-[12rem]">
        <div class="flex w-full cursor-pointer items-center text-[18rem] font-semibold">
          <span class="mr-auto leading-[25rem]">{{ t('验证帐号') }}</span>
          <div @click="onClose">
            <IconUniClose3 class="text-[14rem] text-[#0D2245]" />
          </div>
        </div>

        <i18n-t
          keypath="请输入发送至 {0} 的6位验证码，该验证码的有效期为{1}分钟。" tag="div"
          class="text-[14rem] text-[#0D2245] font-medium leading-[21rem]"
        >
          <span>{{ getAccount }}</span>
          <span>{{ 30 }}</span>
        </i18n-t>
        <div class="flex">
          <PhBaseInput v-model="verifyCode" name="verify" class="right-bg !w-[190rem] mr-auto" :placeholder="t('验证码')" :max="6" type="number" input-mode="numeric" />
          <PhBaseButton class="w-auto" @click="getCodeLong">
            <span v-if="isFirst" class="whitespace-nowrap">{{ t('获取验证码') }}</span>
            <template v-else>
              <div v-if="isCountdown">
                {{ current.seconds }}s
              </div>
              <span v-else class="whitespace-nowrap">{{ t('重新发送') }}</span>
            </template>
          </PhBaseButton>
        </div>
        <div class="flex">
          <div class="cursor-pointer font-semibold text-[#6D7693] whitespace-nowrap leading-[21rem]" @click="page = 'noCode'">
            {{ t('没有收到验证码？') }}
          </div>
        </div>
        <PhBaseButton
          bg-style="secondary" size="md" :loading="verifyLoading"
          @click="onVerify"
        >
          {{ t('提交') }}
        </PhBaseButton>
        <div
          class="w-full flex items-center justify-start text-[#FF4D4F]"
        >
          <IconUniError class="text-[14rem]" :style="{ color: '#FF4D4F' }" /><span class="ml-[4rem] text-[14rem] font-medium leading-[20rem]">{{ t('您的账号长期未登录，请先验证您的账号。') }}</span>
        </div>
      </div>
    </template>
    <AppNoReceiveCode v-if="page === 'noCode'" :type="isEmailType ? 'email' : 'phone'" @back="noCodeBack" />
  </div>
</template>

<style lang="scss" scoped>
</style>

<script setup lang='ts'>
import {
  ApiAccountMoney,
  ApiCloseAccount,
  ApiMemberAuthInfo,
  ApiMemberPhoneSms,
  ApiMemberSendMailCode,
  ApiTransferMoneyToWallet,
} from '@tg/apis'
import { PhBaseButton, PhBaseDialog } from '@tg/bccomponents'
import { useAppStore, useBrandStore, useCurrency } from '@tg/stores'
import { Local, socketClient, STORAGE_PROMO_AD_POP_UNLOGIN } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { Message } from '~/utils'

defineOptions({ name: 'CloseAccountSetting' })

const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { isKYCVerifyOpen, isFaceVerificationOpen } = storeToRefs(useBrandStore())
const { currencyList, currentGlobalCurrencyMap } = storeToRefs(useCurrency())
// const { openDialogFacialRecognition } = useDialogFacialRecognition()
// const { openWalletDialog } = useWalletDialog({ activeTab: 'withdraw' })

const loadingBalance = ref(false)
const loadingTransfer = ref(false)
const loadingVerify = ref(false)
const loadingSendCode = ref(false)
const loadingBindCpf = ref(false)
const step = ref(1)
const cpf = ref('')
const captcha = ref('')
const show = ref(false)
const accountBalance = ref()
const useCaptcha = ref(userInfo.value?.email ? 'email' : userInfo.value?.phone ? 'phone' : '')
const reasons = ref([
  { label: t('关闭账户原因1'), value: 1, checked: false },
  { label: t('关闭账户原因2'), value: 2, checked: false },
  { label: t('关闭账户原因3'), value: 3, checked: false },
])

const reasonIds = computed(() => reasons.value.filter(item => item.checked).map(item => item.value))
const dialogTitle = computed(() => {
  if (step.value === 1) {
    return t('账户资金')
  }
  else if (step.value === 2) {
    return t('温馨提示')
  }
  else if (step.value === 3) {
    return t('验证您的身份')
  }
  else if (step.value === 4) {
    if (useCaptcha.value === 'email')
      return t('验证邮箱')
    else if (useCaptcha.value === 'phone')
      return t('验证手机')
  }
  else if (step.value === 5) {
    return t('关闭账户')
  }
})

const {
  value: remark,
  errorMessage: remarkError,
  validate: validRemark,
  resetField: resetRemark,
} = useField<string>(
  'remark',
  (v) => {
    if (!v)
      return t('请简易叙述您所遇到的问题')
    if (v.length > 100)
      return t('双重验证码格式错误')
    return ''
  },
  { initialValue: '' },
)

function simplifyData(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(obj)) {
    // 跳过 uid 和 site_id 字段本身（包括顶层）
    if (key === 'uid' || key === 'site_id')
      continue

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // 递归处理子对象（深层结构也可以处理）
      const filtered = simplifyData(value)

      // 如果子对象不是空对象，则保留
      if (Object.keys(filtered).length > 0)
        result[key] = filtered
    }
    else {
      // 直接保留非对象类型（如字符串、数字）
      result[key] = value
    }
  }

  return result
}

function showVerify() {
  if (useCaptcha.value) {
    step.value = 4
    sendCode()
  }
  else {
    // openNotify({
    //   type: 'error',
    //   title: t('友情提示') + t('冒号'),
    //   message: t('未绑定手机和邮箱'),
    // })
    Message.error(t('未绑定手机和邮箱'))
  }
}

/** 人脸识别取消回调 */
function onCancel() {
  // openNotify({
  //   type: 'info',
  //   title: t('warm_tip'),
  //   message: t('face_verify_cancel'),
  // })
}

/** 人脸识别成功回调 */
function onConfirm() {
  step.value = 5
}

function clearLoginStatus() {
  Local.remove(STORAGE_PROMO_AD_POP_UNLOGIN)
  appStore.removeToken()
  appStore.removeUserInfo()
  appStore.setMqttConnectedFalse()
  socketClient.connect('退出 重新连接')
  router.push('/')
}

async function runCloseAccount() {
  await validRemark()
  if (!remarkError.value && reasonIds.value.length > 0) {
    ApiCloseAccount({
      remark: remark.value,
      domain: window.location.hostname,
      reasonIds: reasonIds.value,
      skip_key: '',
    }).then(() => {
      Message.success(t('您的账户已关闭'))
      clearLoginStatus()
    })
  }
}

/** 去人脸识别 */
async function toFaceVerify() {
  // TODO:
  // openDialogFacialRecognition({
  //   onCancel,
  //   onConfirm,
  //   cpf: cpf.value,
  // })
}

function openDialog() {
  loadingBalance.value = true
  ApiAccountMoney().then((res: any) => {
    loadingBalance.value = false
    accountBalance.value = simplifyData(res || {})
    if (Object.keys(accountBalance.value || {}).length > 1) {
      show.value = true
      if (res?.balance_skip === '2')
        step.value = 1

      else
        step.value = 2
    }
    else {
      show.value = true
      step.value = 3
    }
  })
}
const countDown = ref(0)
const countDown1 = ref(0)
const isCountDown = ref(false)
const isCountDown1 = ref(false)
let timer: any = null
let timer1: any = null
function startCountDown() {
  if (isCountDown.value)
    return
  countDown.value = 60
  isCountDown.value = true
  if (timer)
    clearInterval(timer)

  timer = setInterval(() => {
    countDown.value--
    if (countDown.value === 0) {
      clearInterval(timer)
      isCountDown.value = false
    }
  }, 1000)
}
function startCountDown1() {
  if (isCountDown1.value)
    return
  countDown1.value = 60
  isCountDown1.value = true
  if (timer1)
    clearInterval(timer1)

  timer1 = setInterval(() => {
    countDown1.value--
    if (countDown1.value === 0) {
      clearInterval(timer1)
      isCountDown1.value = false
    }
  }, 1000)
}
function sendCode() {
  loadingSendCode.value = true
  const callback = () => {
    if (useCaptcha.value === 'email')
      startCountDown()
    else
      startCountDown1()
    loadingSendCode.value = false
  }

  if (useCaptcha.value === 'email') {
    ApiMemberSendMailCode().then(callback).finally(() => {
      loadingSendCode.value = false
    })
  }
  else {
    ApiMemberPhoneSms({ type: 1, uid: userInfo.value!.uid }).then(callback).finally(() => {
      loadingSendCode.value = false
    })
  }
}

function transferToWallet() {
  loadingTransfer.value = true
  ApiTransferMoneyToWallet().then(() => {
    loadingTransfer.value = false
    Message.success(t('转入钱包成功'))
    step.value = 2
  }).finally(() => {
    loadingTransfer.value = false
  })
}

function submit(ty: 1 | 2) {
  loadingVerify.value = true
  ApiMemberAuthInfo({ captcha: captcha.value, type: ty, phone_email: ty === 1 ? userInfo.value!.email : userInfo.value!.phone }).then((res) => {
    loadingVerify.value = false
    if (res.status === 1) {
      if (isKYCVerifyOpen.value) {
        if (!res.cpf_number) {
          Message.error(t('请先绑定CPF再进行验证'))
          router.push('/user/kyc')
        }
        else {
          if (isFaceVerificationOpen.value) {
            cpf.value = res.cpf_number
            toFaceVerify()
          }
          else {
            step.value = 5
          }
        }
      }
      else {
        step.value = 5
      }
    }
  }).finally(() => {
    loadingVerify.value = false
  })
}
function maskEmail(email: string) {
  const prefix = email.slice(0, 3)
  const atIndex = email.indexOf('@')
  const suffix = email.slice(atIndex)
  const maskedPart = '*'.repeat(atIndex - 3)
  return prefix + maskedPart + suffix
}
function maskPhone(phoneNumber: string) {
  const areaCode = phoneNumber.split('-')[0]
  const cleanedNumber = phoneNumber.split('-')[1]
  const prefix = cleanedNumber.slice(0, 3)
  const suffix = cleanedNumber.slice(-4)
  const maskedPart = '*'.repeat(cleanedNumber.length - 7)
  return `${areaCode}-${prefix}${maskedPart}${suffix}`
}

watch(userInfo, () => {
  if (!useCaptcha.value)
    useCaptcha.value = userInfo.value?.email ? 'email' : userInfo.value?.phone ? 'phone' : ''
})
</script>

<template>
  <AppPageLayout :title="t('关闭账户')">
    <div
      class="py-[20rem] text-[#0D2245] px-[16rem] flex flex-col gap-[16rem] rounded-[4rem] bg-[#fff]"
    >
      <h5 class="text-[20rem] font-[600]">
        {{ t('关闭账户') }}
      </h5>
      <div class="line" />
      <p>{{ t('请问是否要删除此帐号呢') }}</p>
      <p class="text-[#6D7693]">
        {{ t('关闭账户提示语1') }}
      </p>
      <p class="text-[#6D7693]">
        {{ t('关闭账户提示语2') }}
      </p>
      <div class="line" />
      <div class="flex justify-end">
        <PhBaseButton class="h-[42rem]" @click="openDialog">
          {{ t('请求关闭账户') }}
        </PhBaseButton>
      </div>
    </div>

    <PhBaseDialog v-model="show" :title="dialogTitle">
      123
    </PhBaseDialog>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.line {
  height: 1rem;
  width: 100%;
  background-color: #f5f5f5;
}
</style>

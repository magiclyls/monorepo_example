<script lang="ts" setup>
import type { EnumCurrencyKey } from '@tg/types'
import { ApiAccountMoney, ApiCloseAccount, ApiMemberAuthInfo, ApiMemberPhoneSms, ApiMemberSendMailCode, ApiTransferMoneyToWallet } from '@tg/apis'

const { openNotify } = useNotify()
const { t } = useI18n()
const router = useLocalRouter()
usePageTitle({ prefix: t('login_pwd') })
const loadingBalance = ref(false)
const loadingTransfer = ref(false)
const loadingVerify = ref(false)
const loadingSendCode = ref(false)
const loadingBindCpf = ref(false)
const step = ref(1)
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { globalPageTitle } = useGlobalStatePageTitle()
const { isKYCVerifyOpen, isFaceVerificationOpen } = storeToRefs(useBrandStore())
const { openDialogFacialRecognition } = useDialogFacialRecognition()
const useCaptcha = ref(userInfo.value?.email ? 'email' : userInfo.value?.phone ? 'phone' : '')
const reasons = ref([
  { label: t('close_account_reason1'), value: 1, checked: false },
  { label: t('close_account_reason2'), value: 2, checked: false },
  { label: t('close_account_reason3'), value: 3, checked: false },
])
globalPageTitle.value = t('close_account')

const reasonIds = computed(() => reasons.value.filter(item => item.checked).map(item => item.value), { immediate: true })
const {
  renderBalanceList,
} = useCurrencyData()
const { openWalletDialog } = useWalletDialog({ activeTab: 'withdraw' })
const dialogTitle = computed(() => {
  if (step.value === 1) {
    return t('account_money')
  }
  else if (step.value === 2) {
    return t('pwa_ios_lead9')
  }
  else if (step.value === 3) {
    return t('verify_you')
  }
  else if (step.value === 4) {
    if (useCaptcha.value === 'email')
      return t('verify_email')
    else if (useCaptcha.value === 'phone')
      return t('verify_phone')
  }
  else if (step.value === 5) {
    return t('close_account')
  }
})
const cpf = ref('')
const captcha = ref('')
const show = ref(false)
const accountBalance = ref()

watch(userInfo, () => {
  if (!useCaptcha.value)
    useCaptcha.value = userInfo.value?.email ? 'email' : userInfo.value?.phone ? 'phone' : ''
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
      return t('close_account_problem')
    if (v.length > 100)
      return t('wrong_format')
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
  else { openNotify({ type: 'error', title: t('login_pwa_lead7'), message: t('settings_change_password_funds_password_not_bind_email') }) }
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
    ApiCloseAccount({ remark: remark.value, domain: window.location.hostname, reasonIds: reasonIds.value }).then(() => {
      openNotify({
        type: 'success',
        title: t('notify_title_success'),
        message: t('close_account_success'),
      })
      clearLoginStatus()
    })
  }
}

/** 去人脸识别 */
async function toFaceVerify() {
  openDialogFacialRecognition({
    onCancel,
    onConfirm,
    cpf: cpf.value,
  })
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
    openNotify({
      type: 'success',
      title: t('notify_title_success'),
      message: t('transfer_to_wallet_success'),
    })
    step.value = 2
  }).finally(() => {
    loadingTransfer.value = false
  })
}

function submit(ty: number) {
  loadingVerify.value = true
  ApiMemberAuthInfo({ captcha: captcha.value, type: ty, phone_email: ty === 1 ? userInfo.value!.email : userInfo.value!.phone }).then((res) => {
    loadingVerify.value = false
    if (res.status === 1) {
      if (isKYCVerifyOpen.value) {
        if (!res.cpf_number) {
          openNotify({
            type: 'error',
            title: t('notify_title_error'),
            message: t('bind_cpf_to_close_account'),
          })
          router.push('/settings/kyc')
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
    else {
      openNotify({
        type: 'error',
        title: t('notify_title_error'),
        message: t('component.component.verify.error'),
      })
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
</script>

<template>
  <div class="tg-settings-security">
    <AppSettingsContentItem class="bg" show-hr :title="t('menu_title_settings_delete_account')" :btn-text="t('menu_title_settings_delete_account')" :btn-loading="loadingBalance" @submit="openDialog">
      <span class="text white">{{ t('delete_account_tip1') }}</span>
      <span class="text">{{ t('delete_account_tip2') }}</span>
      <span class="text">{{ t('delete_account_tip3') }}</span>
    </AppSettingsContentItem>
    <BaseDialog
      show-close
      account
      :icon="step === 4 ? 'uni-arrow-left' : step === 3 ? 'uni-setting' : ''" :title="dialogTitle" :show="show"
      height="auto" @click-title="step === 4 && step--" @close="show = false"
    >
      <div v-if="step == 1" class="flex flex-col justify-between px-[16px] pb-[32px] pt-[18px]">
        <div v-if="Object.keys(accountBalance?.balance || {}).length > 0" class="flex items-start justify-between">
          <div class="balance_label">
            {{ t('balance') }}:
          </div>
          <div class="flex flex-col items-end">
            <div v-for="key in Object.keys(accountBalance?.balance || {})" :key="key" class="h-[40px] flex items-center">
              <AppAmount
                :show-icon="false"
                :amount="accountBalance?.balance?.[key]"
                :currency-type="key as EnumCurrencyKey"
              />
              <AppCurrencyIcon :currency-type="key as EnumCurrencyKey" style="--tg-app-currency-icon-size: 18px" />
            </div>
          </div>
        </div>
        <div v-if="Object.keys(accountBalance?.game_balance || {}).length > 0" class="flex items-start justify-between">
          <div class="balance_label">
            {{ t('game_total_balance') }}:
          </div>
          <div class="flex flex-col items-end">
            <div v-for="key in Object.keys(accountBalance?.game_balance || {})" :key="key" class="h-[40px] flex items-center">
              <AppAmount
                :show-icon="false"
                :amount="accountBalance?.game_balance?.[key]"
                :currency-type="key as EnumCurrencyKey"
              />
              <AppCurrencyIcon :currency-type="key as EnumCurrencyKey" style="--tg-app-currency-icon-size: 18px" />
            </div>
          </div>
        </div>
        <div v-if="Object.keys(accountBalance?.interest || {}).length > 0" class="flex items-start justify-between">
          <div class="balance_label">
            {{ t('interest_total_balance') }}:
          </div>
          <div class="flex flex-col items-end">
            <div v-for="key in Object.keys(accountBalance?.interest || {})" :key="key" class="h-[40px] flex items-center">
              <AppAmount
                :show-icon="false"
                :amount="accountBalance?.interest?.[key]"
                :currency-type="key as EnumCurrencyKey"
              />
              <AppCurrencyIcon :currency-type="key as EnumCurrencyKey" style="--tg-app-currency-icon-size: 18px" />
            </div>
          </div>
        </div>
        <div v-if="Object.keys(accountBalance?.agency_balance || {}).length > 0" class="flex items-start justify-between">
          <div class="balance_label">
            {{ t('commission_total_balance') }}:
          </div>
          <div class="flex flex-col items-end">
            <div v-for="key in Object.keys(accountBalance?.agency_balance || {})" :key="key" class="h-[40px] flex items-center">
              <AppAmount
                :show-icon="false"
                :amount="accountBalance?.agency_balance?.[key]"
                :currency-type="key as EnumCurrencyKey"
              />
              <AppCurrencyIcon :currency-type="key as EnumCurrencyKey" style="--tg-app-currency-icon-size: 18px" />
            </div>
          </div>
        </div>
        <div v-if="Object.keys(accountBalance?.rebate || {}).length > 0" class="flex items-start justify-between">
          <div class="balance_label">
            {{ t('rebate_total_balance') }}:
          </div>
          <div class="flex flex-col items-end">
            <div v-for="key in Object.keys(accountBalance?.rebate || {})" :key="key" class="h-[40px] flex items-center">
              <AppAmount
                :show-icon="false"
                :amount="accountBalance?.rebate?.[key]"
                :currency-type="key as EnumCurrencyKey"
              />
              <AppCurrencyIcon :currency-type="key as EnumCurrencyKey" style="--tg-app-currency-icon-size: 18px" />
            </div>
          </div>
        </div>
        <span class="text mb-[20px] mt-[14px] text-center">{{ t('get_rebate') }}</span>
        <div class="h-[2.75rem] flex gap-[1.875rem]">
          <BaseButton
            bg-style="grey" size="md" class="w-full" @click="show = false"
          >
            {{ t('cancel') }}
          </BaseButton>
          <BaseButton
            bg-style="primary" size="md" class="w-full" :loading="loadingTransfer" @click="transferToWallet"
          >
            {{ t('transfer_wallet_immediately') }}
          </BaseButton>
        </div>
      </div>
      <div v-if="step === 2" class="px-[16px] pb-[32px] pt-[24px]">
        <div class="text text-center">
          {{ t('close_account_balance_tip') }}
        </div>
        <div class="line my-[20px]" />
        <div class="text mb-[20px] text-center">
          {{ t('balance') }}
        </div>
        <div class="flex flex-wrap justify-center gap-[16px]">
          <template v-for="balance of renderBalanceList" :key="balance.type">
            <div v-if="+balance.balanceWithSymbol > 0" class="h-[20px] flex items-center">
              <AppAmount
                :show-icon="false"
                :amount="balance.balanceWithSymbol"
                :currency-type="balance.type"
              />
              <AppCurrencyIcon :currency-type="balance.type" style="--tg-app-currency-icon-size: 18px" />
            </div>
          </template>
        </div>
        <div class="line my-[20px]" />
        <div class="h-[44px] flex gap-[30px]">
          <BaseButton
            bg-style="grey" size="md" class="w-full" @click="show = false"
          >
            {{ t('cancel') }}
          </BaseButton>
          <BaseButton
            bg-style="primary" size="md" class="w-full" @click="show = false; openWalletDialog()"
          >
            {{ t('withdraw_now') }}
          </BaseButton>
        </div>
      </div>
      <div v-if="step === 3" class="px-[16px] pb-[32px] pt-[16px]">
        <div class="text mb-[16px] text-left">
          {{ t('close_account_verify_tip') }}
        </div>
        <BaseButton
          bg-style="primary" size="md" class="w-full" @click="showVerify"
        >
          {{ t('setting_kyc_cpf_verify_now') }}
        </BaseButton>
      </div>
      <div v-if="step === 4" class="flex flex-col justify-between gap-[16px] px-[16px] pb-[32px] pt-[12px]">
        <span class="text">{{ t('extend_content_6', { phone: useCaptcha === 'email' ? maskEmail(userInfo!.email) : maskPhone(userInfo!.phone) }) }}</span>
        <div class="flex gap-[4px]">
          <BaseInput v-model="captcha" class="var" :max="6">
            <template v-if="(countDown !== 0 && useCaptcha === 'email') || (countDown1 !== 0 && useCaptcha === 'phone')" #right-icon>
              <span v-show="useCaptcha === 'email' && countDown !== 0">{{ countDown }}s</span>
              <span v-show="useCaptcha === 'phone' && countDown1 !== 0">{{ countDown1 }}s</span>
            </template>
          </BaseInput>
          <BaseButton
            v-if="(countDown === 0 && useCaptcha === 'email') || (countDown1 === 0 && useCaptcha === 'phone')"
            class="var custom-button"
            :loading="loadingSendCode"
            bg-style="primary" style="white-space: nowrap" @click="sendCode"
          >
            {{ t('re_send') }}
          </BaseButton>
        </div>
        <BaseButton bg-style="primary" :loading="loadingVerify" :disabled="!captcha" @click="submit(useCaptcha === 'email' ? 1 : 2)">
          <span>{{ t('submit') }}</span>
        </BaseButton>
        <div v-if="userInfo?.phone && useCaptcha === 'email'" class="text white mx-auto my-[16px] cursor-pointer text-center" @click="useCaptcha = 'phone'">
          {{ t('switch_to_phone_verify') }}
        </div>
        <div v-if="userInfo?.email && useCaptcha === 'phone'" class="text white mx-auto my-[16px] cursor-pointer text-center" @click="useCaptcha = 'email';">
          {{ t('switch_to_email_verify') }}
        </div>
      </div>
      <div v-if="step === 5" class="flex flex-col justify-between p-[16px] pb-[32px]">
        <div class="text mb-[16px] text-[14px] font-[600]">
          {{ t('close_account_reason') }}
          <span class="checkbox-active">{{ t('required_text') }}</span>
          <span class="text-[#fc3c3c]">*</span>
        </div>
        <BaseCheckBox v-for="reason in reasons" :key="reason.value" v-model="reason.checked" class="mb-[12px]" style="--tg-base-checkbox-box-width:16px;--tg-secondary-main:#00E701;--tg-border-color-deep-grey:#00E701;--tg-base-checkbox-outer-border-color-active:#00E701;--tg-check-box-active-theme-green:#00E701;--tg-check-box-theme-white:#00E701;--tg-check-box-check-color:#fff">
          <span class="text-[12px] leading-[20px] font-[600]" :class="[reason.checked && 'checkbox-active']">
            {{ reason.label }}
          </span>
        </BaseCheckBox>
        <div class="text mb-[12px] mt-[4px] text-[14px] font-[600]">
          {{ t('close_account_problem') }}
          <span class="text-[#fc3c3c]">*</span>
        </div>
        <BaseTextarea v-model="remark" :placeholder="placeholder" class="h-[80px]" :rows="6" />
        <div class="mt-[4px] text-12 text-[#fc3c3c]">
          {{ remarkError }}
        </div>
        <BaseButton bg-style="primary" class="mt-[16px]" :loading="loadingBindCpf" :disabled="remarkError || !reasonIds.length" @click="runCloseAccount()">
          <span>{{ t('submit') }}</span>
        </BaseButton>
      </div>
    </BaseDialog>
  </div>
</template>

<style lang="scss" scoped>
:root {
  --tg-dialog-header-padding-x: 16px;
  --tg-dialog-header-padding-t: 16px;
  --tg-dialog-header-padding-b: 12px;
  --tg-app-currency-icon-size: 18px;
}
.bg {
  --tg-app-settings-content-item-style-max-width: 100%;
  @include webTheme('white') {
    --tg-primary-main: #e8e8e8;
    border: none;
  }
}
.balance_label {
  color: #b1bad3;
  font-size: 14px;
  font-weight: 600;
  height: 40px;
  line-height: normal;
  padding: 10px 0;
  @include webTheme('white') {
    color: rgba(85, 85, 85, 0.33);
  }
  @include webTheme('green') {
    color: #3cb389;
  }
}
.var {
  @include webTheme('white') {
    --tg-base-input-style-bg: #fff;
    --tg-base-button-style-bg: #c1c1c1;
  }
}
.text {
  font-size: 14px;
  line-height: 20px;
  color: var(--tg-text-lightgrey);
}
.dash {
  border: 2px dashed var(--tg-text-lightgrey);
  border-radius: 6px;
  @include webTheme('white') {
    background: #e8e8e8;
  }
}
.line {
  height: 1px;
  background-color: var(--tg-popper-color-default);
  @include webTheme('white') {
    background-color: #c1c1c1;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.light {
  @include webTheme('green') {
    color: white;
  }
}
.white {
  color: white;
  @include webTheme('white') {
    color: #111111;
  }
  @include webTheme('green') {
    color: var(--tg-text-lightgrey);
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

.custom-button {
  background-color: #2f4553;
  @include webTheme('green') {
    background-color: #197b59;
  }
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
}
.checkbox-active {
  color: #fff;
  @include webTheme('green') {
    color: #fff;
  }
  @include webTheme('white') {
    color: #111;
  }
}
</style>

<route lang="yaml">
</route>

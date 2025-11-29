<script setup lang='ts'>
import { IconUniWarningColor } from '@tg/icons'
import { ApiMemberLogin } from '@tg/apis'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import { sendMsgToFlutterThirdPartyApp } from '~/utils'

defineOptions({
  name: 'AppLoginV2',
})
const closeDialog = inject('closeDialog', () => { })

const { setCloseAllDialog } = useDialogState()
const { t } = useI18n()
const appStore = useAppStore()
const { brandReg, isLoginPWAOpen, noLoginDays } = storeToRefs(useBrandStore())
const { openNotify } = useNotify()
const { openRegisterDialog } = useRegisterDialog()
const { openForgetPasswordDialog } = useDialogForgetPassword()
const { openResolveLockedDialog } = useDialogResolveLocked()
const { bool: isEmailLoginType, toggle: toggleUserLogin } = useBoolean(getEmailLoginType())
const { bool: isPopperShow, setTrue: setPopperShow, setFalse: setPopperHide } = useBoolean(false)
const { areaSearchValue, areaCodeOptionsFiltered, clearAreaSearchValue } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { isMobile } = storeToRefs(useWindowStore())
const notLoginReloadDialog = useNotLoginReloadDialog()
const { isLoginDialogOpen } = useGlobalStateLoginRegisterDialogOpen()
const { openLoginPwaDialog } = useDialogLoginPwa()

const { captchaButtonId, captchaEleId, showCaptcha, loadingMemberCaptcha } = useAliCaptcha({
  success: (validate) => {
    getMemberLogin(validate)
  },
})

const userNameRef = ref()
const passwordRef = ref()
const phoneInputRef = ref()
let scrollTop = 0
const {
  value: username,
  errorMessage: usernameErrorMsg,
  validate: valiUsername,
  resetField: resetUserName,
} = useField<string>('username', (value) => {
  if (!isEmailLoginType.value)
    return ''
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
const areaCode = ref(countryCallingCode.value)

const {
  value: phone,
  setValue: setPhone,
  errorMessage: phoneErrorMsg,
  validate: valiPhone,
  resetField: resetPhone,
} = useField<string>('phone', (value) => {
  if (isEmailLoginType.value)
    return ''
  if (value) {
    if (areaCode.value === '+63')
      return philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
    else if (areaCode.value === '+86')
      return chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
    else if (areaCode.value === '+55')
      return brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
    return numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  }
  return t('new_phone')
})
const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: valiPassword,
  resetField: resetPwd,
} = useField<string>('password', (value) => {
  if (!value || value.length < 8)
    return t('pop_up_login_second_input_min_length', { delta: 8 })
  return ''
})

const userNameField = computed(() => isEmailLoginType.value ? username.value : `${areaCode.value}-${phone.value}`)
const {
  run: runMemberLogin,
  loading: isLoading,
} = useRequest(ApiMemberLogin, {
  manual: true,
  onSuccess: async (res: string) => {
    sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.LOGIN)
    sendMsgToAdjust(SendFlutterThirdPartyAppMessage.LOGIN)
    Local.set(STORAGE_LOGIN_MQTT_ID, Math.floor(Math.random() * 100))
    Local.remove(STORAGE_PROMO_AD_POP_LOGIN)
    // 在关闭弹窗前保存用户名来用发提示语
    const _userNameField = userNameField.value

    closeDialog()
    setCloseAllDialog(true)
    await nextTick()
    appStore.setToken(res)

    setTimeout(() => {
      // 因为满屏的登陆框提示语位置不一样，所以这里延迟提示语出现。
      openNotify({
        title: t('tip_pop_up_reg_success_title'),
        type: 'success',
        message: `${_userNameField}!`,
      })

      // 打开登陆PWA
      if (isLoginPWAOpen.value && !isPwa())
        openLoginPwaDialog()
    }, 300)

    if (isSafari) {
      setTimeout(() => {
        if (scrollTop <= 10) {
          if (isSafari)
            document.querySelector('#tgTopForScroll')?.scrollIntoView({ behavior: 'auto' })
          else
            document.documentElement.scrollTop = 1
        }
      }, 10)
    }
  },
  onError: (err) => {
    const { data, tip } = JSON.parse(err.message)
    if (data.includes('member-verify') && noLoginDays.value) {
      const cpf = data.split('|')[2]
      toLongNoLoginLocked(tip, cpf)
    }
    // 自我排除
    else if (data.includes('self_exclusion')) {
      const time = data.split('|')[1]
      openNotify({
        type: 'error',
        title: t('login_error'),
        message: t('your_account_was_self_exclusioned', { time }),
      })
    }

    // openNotify({
    //   type: 'error',
    //   title: t('login_error'),
    //   message: t('your_account_was_locked'),
    // })
  },
})

async function getMemberLogin(validate?: string) {
  if (isEmailLoginType.value) {
    userNameRef.value.setTouchTrue()
    await valiUsername()
  }
  else {
    await valiPhone()
  }

  passwordRef.value.setTouchTrue()
  await valiPassword()

  const params = {
    username: userNameField.value,
    password: password.value,
    device_number: await application.getDeviceNumber(),
    validate
  }
  if (isEmailLoginType.value) {
    if (!usernameErrorMsg.value && !pwdErrorMsg.value) {
      appStore.setMqttConnectedFalse()
      runMemberLogin(params)
    }
  }
  else {
    if (!pwdErrorMsg.value && !phoneErrorMsg.value) {
      appStore.setMqttConnectedFalse()
      runMemberLogin(params)
    }
  }
}

async function toRegister() {
  if (notLoginReloadDialog.isShow)
    notLoginReloadDialog.setShowFalse()

  closeDialog()
  await nextTick()
  openRegisterDialog()
}
async function toForget() {
  openForgetPasswordDialog()
}
async function toResolveLocked() {
  openResolveLockedDialog({ openPage: 'self' })
}
async function toLongNoLoginLocked(data: string, cpf: string) {
  openResolveLockedDialog({
    openPage: 'long',
    getAccount: maskData(data),
    getUsername: userNameField.value,
    getPassword: password.value,
    closeLoginHandler: closeDialog,
    cpf,
  })
}

function selectAreaCode(v: string) {
  areaCode.value = v
}
function onVDropdownHide() {
  setPopperHide()
  clearAreaSearchValue()
}
function pwdEnter() {
  verifyFields()
}
async function verifyFields() {
  if (isEmailLoginType.value) {
    userNameRef.value.setTouchTrue()
    await valiUsername()
  }
  else {
    await valiPhone()
  }

  passwordRef.value.setTouchTrue()
  await valiPassword()

  if (isEmailLoginType.value) {
    if (!usernameErrorMsg.value && !pwdErrorMsg.value)
      showCaptcha()
  }
  else {
    if (!pwdErrorMsg.value && !phoneErrorMsg.value)
      showCaptcha()
  }
}
// 脱敏处理
function maskData(data: string) {
  // 判断是否是手机号
  const phoneRegex = /^1[3-9]\d{9}$/
  // 判断是否是邮箱
  const emailRegex = /^[\w.%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i

  if (phoneRegex.test(data)) {
    // 如果是手机号，保留前3位和后4位，中间部分用*代替
    return `${data.substring(0, 3)}****${data.substring(7)}`
  }
  else if (emailRegex.test(data)) {
    // 如果是邮箱，处理用户名和域名部分
    const [username, domain] = data.split('@') // 拆分用户名和域名部分

    // 保留用户名的前三个字符，中间部分用****代替，保留@及域名部分
    return `${username.substring(0, 3)}****` + `@${domain}`
  }
  else {
    // 如果既不是手机号也不是邮箱，直接返回原数据（或进行其他处理）
    return data
  }
}

function getEmailLoginType() {
  if (brandReg.value && brandReg.value.username)
    return true

  if (brandReg.value && brandReg.value.phone && brandReg.value.phone.phone)
    return false
}

watch(countryCallingCode, (a) => {
  areaCode.value = a
}, { immediate: true })
// 监听dialog开关清除数据
watch(isLoginDialogOpen, (a) => {
  resetUserName()
  resetPhone()
  resetPwd()
  if (a)
    isEmailLoginType.value = Boolean(getEmailLoginType())
})

onMounted(() => {
  scrollTop = document.documentElement.scrollTop
  userNameRef.value?.getFocus()
  useFixedTop('.app-login')
})
</script>

<template>
  <div>
    <div class="app-login grid grid-cols-1 gap-y-[12px]">
      <BaseInput v-if="isEmailLoginType" ref="userNameRef" v-model="username" class="theme-input"
        :placeholder="t('login_user_or_email')" :msg="usernameErrorMsg" msg-after-touched />
      <div v-else class="flex flex-col">
        <div class="relative flex" style="--tg-input-lefticon-px: 0;--tg-input-lefticon-py: 0;">
          <BaseInput ref="phoneInputRef" v-model="phone" class="theme-input theme-inner-input" hide-spin-btn
            input-mode="numeric" type="number" :placeholder="t('new_phone')">
            <template #left-icon>
              <div class="theme-bg theme-left-box relative flex items-center pl-[12px]"
                style="--tg-base-select-border: none;--tg-base-select-icon-right:6px;--tg-base-select-small-style-padding-right:22px;--tg-base-select-small-style-padding-left:5px;">
                <div class="flex-1" style="width: 16px;">
                  <BaseImage v-if="areaCode && areaCode.length" height="16px" width="16px"
                    :url="`/png/flag/${areaCode.slice(1)}.webp`" />
                </div>
                <BaseSelect v-model="areaCode" class="theme-select" style="--tg-base-select-text-align: center;"
                  :placeholder="t('intl_phone_pre')" show-placeholder small :border="false"
                  :width="`${areaCode?.length * 11 + 25}px`" :options="areaCodeOptionsFiltered" />
              </div>
              <div v-if="globalInitMap.currentTemplate == 2" class="h-[38px] w-[10px] bg-[#02432d]" />
              <div v-if="globalInitMap.currentTemplate == 4" class="h-[38px] w-[10px] bg-[#F5F5F5]" />
              <div v-if="globalInitMap.currentTemplate == 6" class="h-[38px] w-[10px] bg-[#0F212E]" />
            </template>
          </BaseInput>
        </div>
        <div v-show="phoneErrorMsg && phoneInputRef.isTouched" class="flex items-center pb-[4px] pt-[8px] text-[12px]"
          style="--tg-icon-color:var(--tg-text-error-sub);">
          <IconUniWarningColor class="error-icon" />
          <span class="text-tg-text-error-sub ml-[4px]">{{ phoneErrorMsg }}</span>
        </div>
      </div>

      <BaseInput ref="passwordRef" v-model="password" :placeholder="t('login_pwd')" :msg="pwdErrorMsg" type="password"
        autocomplete="current-password" msg-after-touched class="theme-input" @down-enter="pwdEnter" />
      <div class="email-login-line flex items-center justify-between">
        <BaseButton class="h-[21px]" type="text" size="none" @click="toggleUserLogin">
          {{ isEmailLoginType ? t('login_phone') : t('login_user_or_email') }}
        </BaseButton>
        <BaseButton class="h-[21px]" type="text" size="none" @click="toForget">
          {{ t('forgot_password') + t('question_mark') }}
        </BaseButton>
      </div>

      <BaseButton bg-style="secondary" :loading="isLoading || loadingMemberCaptcha" size="md"
        style="--tg-base-button-font-size:16px;" @click="verifyFields">
        {{ t('pop_up_login_button') }}
      </BaseButton>
      <div class="flex items-center justify-between">
        <div>
          <span class="text-tg-text-lightgrey font-semibold">
            {{ t('new_user') + t('question_mark') }}
          </span>
          <BaseButton class="theme-text h-[20px]" type="text" size="none" @click="toRegister">
            {{ t('create_user') }}
          </BaseButton>
        </div>
        <div>
          <BaseButton class="h-[20px]" type="text" size="none" @click="toResolveLocked">
            {{ t('resolve_locked') }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div :id="captchaEleId" />
    <div :id="captchaButtonId" />
  </div>
</template>

<style lang='scss' scoped>
.theme-input {
  @include webTheme('green') {
    --tg-base-select-box-shadow: none;
    --tg-radius-default: 4px;
    --tg-base-input-style-border: 1px solid #197b59;
  }

  @include webTheme('white') {
    --tg-base-input-style-background-color: #f5f5f5;
  }
}

.theme-inner-input {
  @include webTheme('green') {
    --tg-inner-input-radius-theme-green: 0 4px 4px 0;
  }
}

.theme-text {
  @include webTheme('white') {
    --tg-base-button-text-default-color: #111111;
  }

  @include webTheme('green') {
    --tg-base-button-text-default-color: #fff;
  }

  @include webTheme('new-default') {
    --tg-base-button-text-default-color: #fff;
  }
}

.email-login-line {
  @include webTheme('green') {
    --tg-text-white: var(--tg-base-button-text-default-color);
  }
}

.theme-select {
  @include webTheme('white') {
    --tg-base-select-box-shadow: none;
    --tg-radius-default: none;
    --tg-base-select-bg-theme-white: #f5f5f5;
  }

  @include webTheme('green') {
    --tg-base-select-box-shadow: none;
    --tg-radius-default: none;
    --tg-base-select-select-warp-background-color: transparent;
  }
}

.theme-bg {
  @include webTheme('white') {
    background-color: #f5f5f5;
    border-radius: 4px 0 0 4px;
    border-right: 1px solid #c1c1c1;
  }

  @include webTheme('green') {
    background-color: #02432d;
    border-radius: 4px 0 0 4px;
  }
}

.theme-left-box {
  @include webTheme('green') {
    --tg-base-select-border: none;
    --tg-base-select-icon-right: 6px;
    --tg-base-select-small-style-padding-right: 22px;
    --tg-base-select-small-style-padding-left: 5px;
    border-right: 1px solid;
    border-color: #197b59;
    background-color: #02432d;
    --tg-secondary-dark: #02432d;
    border-radius: 4px 0 0 4px;
  }

  @include webTheme('new-default') {
    --tg-base-select-border: none;
    --tg-base-select-icon-right: 6px;
    --tg-base-select-small-style-padding-right: 22px;
    --tg-base-select-small-style-padding-left: 5px;
    border-right: 2px solid;
    border-color: #2f4553;
    background-color: #0f212e;
    --tg-secondary-dark: #0f212e;
    border-radius: 4px 0 0 4px;
  }
}
</style>

<script setup lang='ts'>
import { ApiMemberLogin } from '@tg/apis'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'

defineOptions({
  name: 'AppLogin',
})
const closeDialog = inject('closeDialog', () => {})

const { t } = useI18n()
const appStore = useAppStore()
const { openNotify } = useNotify()

const userNameRef = ref()
const passwordRef = ref()
let scrollTop = 0
const {
  value: username,
  errorMessage: usernameErrorMsg,
  validate: valiUsername,
} = useField<string>('username', (value) => {
  if (!value || value.length < 3)
    return t('pop_up_login_first_input_min_length', { delta: 3 })
  else if (value.length > 30)
    return t('max_len_char', { delta: 30 })
  else if (value.match('[^@.a-zA-Z0-9]'))
    return t('name_has_invalid_char')
  else if (!emailReg.test(value) && !usernameReg.test(value))
    return t('validate_msg_user_name')
  return ''
})
const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: valiPassword,
} = useField<string>('password', (value) => {
  if (!value || value.length < 8)
    return t('pop_up_login_second_input_min_length', { delta: 8 })
  // else if (!upperLowerReg.test(value))
  //   return t('password_uppercase_lowercase_letter')
  // else if (!lastOneNumberReg.test(value))
  //   return t('password_least_1_number')
  return ''
})
const {
  run: runMemberLogin,
  loading: isLoading,
} = useRequest(async () => ApiMemberLogin({
  username: username.value,
  password: password.value,
  device_number: await application.getDeviceNumber(),
}), {
  manual: true,
  onSuccess: (res: string) => {
    sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.LOGIN)
    sendMsgToAdjust(SendFlutterThirdPartyAppMessage.LOGIN)
    closeDialog()
    appStore.setToken(res)
    openNotify({ type: 'user', message: `${t('welcome_guest')} ${username.value}！` })
    if (isSafari) {
      setTimeout(() => {
        if (scrollTop <= 10)
          document.documentElement.scrollTop = 1
      }, 10)
    }
    // setTimeout(() => {
    //   loggedOpenActivity()
    // }, 100)
  },
})

async function getMemberLogin() {
  userNameRef.value.setTouchTrue()
  passwordRef.value.setTouchTrue()
  await valiUsername()
  await valiPassword()
  if (!usernameErrorMsg.value && !pwdErrorMsg.value) {
    appStore.setMqttConnectedFalse()
    runMemberLogin()
  }
}

onMounted(() => {
  scrollTop = document.documentElement.scrollTop
  userNameRef.value?.getFocus()
  useFixedTop('.app-login')
})
</script>

<template>
  <div class="app-login">
    <div class="app-login-input-box">
      <BaseLabel :label="t('email_or_username')" must-small need-focus>
        <BaseInput
          ref="userNameRef" v-model="username"
          :msg="usernameErrorMsg" msg-after-touched
        />
      </BaseLabel>
      <BaseLabel :label="t('password')" must-small need-focus>
        <BaseInput
          ref="passwordRef" v-model="password"
          :msg="pwdErrorMsg"
          type="password"
          autocomplete="current-password"
          msg-after-touched
          @down-enter="getMemberLogin"
        />
      </BaseLabel>
      <BaseButton
        bg-style="secondary"
        :loading="isLoading"
        size="xl"
        @click.stop="getMemberLogin"
      >
        <span class="login-text">
          {{ t('pop_up_login_button') }}
        </span>
      </BaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.app-login {
  &-input-box {
    display: grid;
    flex-direction: column;
    gap: var(--tg-spacing-16);
  }
  &-btn {
    width: 100%;
  }
  .login-text {
    font-size: var(--tg-font-size-base);
  }
}
</style>

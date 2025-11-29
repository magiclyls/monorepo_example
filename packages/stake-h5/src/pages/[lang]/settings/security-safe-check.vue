<script lang="ts" setup>
import { ApiMemberAuthClose, ApiMemberAuthQrcode, ApiMemberAuthSet } from '@tg/apis'

interface Props {
  tipText?: string
}

defineProps<Props>()

const { t } = useI18n()
usePageTitle({ prefix: t('two_step_verification') })
const { openNotify } = useNotify()
const { userInfo } = storeToRefs(useAppStore())
const { isSetAuth, loadingAuthConfig, runMemberAuthConfig, singlePromiseArray } = useAuthConfig()
/** 双重验证 */
const {
  value: loginPassword,
  errorMessage: loginPwdErrorMsg,
  validate: validateLoginPwd,
  resetField: resetLoginPassword,
} = useField<string>('loginPassword', fieldVerifyLoginPwd)
const {
  value: doublePassword,
  errorMessage: doublePwdErrorMsg,
  validate: validateDoublePwd,
  resetField: resetDoublePassword,
} = useField<string>('doublePassword', (value) => {
  if (!value)
    return t('pls_input_double_check_pwd')
  return ''
})
// 获取二阶段验证密钥
const {
  data: authQrcode,
  run: runMemberAuthQrcode,
} = useRequest(ApiMemberAuthQrcode, {
  onSuccess() {
  },
})
// 设定二阶段验证
const {
  run: runMemberAuthSet,
  loading: loadMemberAuthSet,
} = useRequest(ApiMemberAuthSet, {
  onSuccess() {
    runMemberAuthConfig()
    openNotify({
      type: 'success',
      message: t('success_set_double_check'),
    })
    resetLoginPassword()
    resetDoublePassword()
  },
})
// 关闭二阶段验证
const {
  run: runMemberAuthClose,
  loading: loadMemberAuthClose,
} = useRequest(ApiMemberAuthClose, {
  onSuccess() {
    runMemberAuthConfig()
    openNotify({
      type: 'success',
      message: t('success_close_double_check'),
    })
    resetLoginPassword()
    resetDoublePassword()
  },
})

// const getQRcodeUrl = computed(() => {
//   if (userInfo.value)
//     return generateQRCodeUrl({ label: 'sg', email: userInfo.value.email, secret: authQrcode.value?.secret ?? '' })
// })

function fieldVerifyLoginPwd(value: string) {
  if (!value)
    return t('pls_enter_password')
  else if (value.length < 8)
    return t('password_least_8_characters')
  else if (!upperLowerReg.test(value))
    return t('password_uppercase_lowercase_letter')
  else if (!lastOneNumberReg.test(value))
    return t('password_least_1_number')
  return ''
}
async function submitDoublePassword() {
  await validateLoginPwd()
  await validateDoublePwd()
  if (!loginPwdErrorMsg.value && !doublePwdErrorMsg.value) {
    const data = { password: loginPassword.value, auth_code: doublePassword.value }
    isSetAuth.value ? runMemberAuthClose(data) : runMemberAuthSet(data)
  }
}
// function generateQRCodeUrl(params: {
//   /** appName */
//   label: string
//   /** email */
//   email: string
//   /** 密钥 */
//   secret: string
// }) {
//   return `otpauth://totp/${encodeURIComponent(params.label)}:${encodeURIComponent(params.email)}?secret=${params.secret}&issuer=${encodeURIComponent(params.label)}`
// }
// function awaitHandle() {
//   return new Promise((resolve) => {
//     let timer: NodeJS.Timeout | null = setInterval(() => {
//       if (!loadingAuthConfig.value) {
//         timer && clearInterval(timer)
//         timer = null
//         return resolve(true)
//       }
//     }, 1000)
//   })
// }

watch(() => isSetAuth.value, (val) => {
  if (!val)
    runMemberAuthQrcode()
}, { immediate: true })

await application.allSettled(singlePromiseArray)
</script>

<template>
  <div class="tg-settings-security">
    <AppSettingsContentItem
      :title="isSetAuth ? t('close_verification') : t('two_step_verification') "
      last-one
      :btn-loading="loadMemberAuthSet || loadMemberAuthClose || loadingAuthConfig"
      :depends-disabled="[doublePassword, doublePassword]"
      btn-text="submit"
      @submit="submitDoublePassword"
    >
      <template #top-desc>
        {{ tipText ? t('first_withdraw_money_need_verification') : t('tip_start_double_check') }}
      </template>
      <div class="two-step-verification">
        <template v-if="!isSetAuth">
          <AppCopyLine
            v-if="userInfo"
            class="app-copy-line"
            :label="t('copy_to_google')"
            :msg="authQrcode?.secret ?? ''"
          />
          <p class="tg-mt-16" style="line-height: 1.5;">
            {{ t('hide_from_others') }}
          </p>
          <div v-if="authQrcode" class="qr-wrap">
            <BaseQrcode :url="authQrcode.qrcode" class="tg-mt-16" />
          </div>
        </template>
        <div class="theme-label">
          <BaseLabel :label="t('login_pwd')" must-small>
            <BaseInput
              v-model="loginPassword"
              :msg="loginPwdErrorMsg"
              type="password"
            />
          </BaseLabel>
          <div class="tg-mt-16">
            <BaseLabel :label="t('double_check_code')" must-small>
              <BaseInput
                v-model="doublePassword"
                :msg="doublePwdErrorMsg"
                type="text"
              />
            </BaseLabel>
          </div>
        </div>
      </div>
    </AppSettingsContentItem>
  </div>
</template>

<style lang="scss" scoped>
.tg-settings-security {
  .theme-label {
    @include webTheme('green') {
      --tg-text-lightgrey: #ffffff;
    }
  }
  @include webTheme('green') {
    --tg-text-lightgrey: var(--tg-text-green-main);
    --tg-text-grey: var(--tg-text-green-main);
  }
  color: var(--tg-text-lightgrey);
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);
  .two-step-verification {
    .text {
      padding-bottom: var(--tg-spacing-4);
    }
    .tg-mt-16 {
      margin-top: var(--tg-spacing-16);
    }
    .qr-wrap {
      width: 144px;
      height: 144px;
      margin-bottom: 16px;
    }
  }
}

.app-copy-line {
  @include webTheme('green') {
    --tg-app-copy-line-input-background-color: #02432d;
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

<route lang="yaml">
  </route>

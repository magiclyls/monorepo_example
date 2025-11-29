<script lang="ts" setup>
import type { IMemberThirdReg } from '@tg/types'
import { ApiMemberExists, ApiMemberThirdReg } from '@tg/apis'

interface Props {
  data: {
    id: string
    email: string
    name: string
  }
  ty: 1 | 2 | 3 | 4
}
defineOptions({
  name: 'AppAuthThirdFormDialog',
})
const props = defineProps<Props>()

const closeDialog = inject('closeDialog', () => { })

const brandStore = useBrandStore()
const { brandReg } = storeToRefs(brandStore)

const { openNotify } = useNotify()
const { t } = useI18n()
const appStore = useAppStore()
// const { openTermsDialog } = useDialogAuthTerms()
const route = useRoute()
const curExists = ref<1 | 2 | 3>(2)

const { bool: pwdStatus, setBool: setPwdStatus } = useBoolean(true)
const { bool: isEmailEmptyAndMust, setBool: setEmailShow } = useBoolean(false)
const {
  bool: isShowPasswordVerify,
  setTrue: setShowPasswordVerifyTrue,
  setFalse: setShowPasswordVerifyFalse,
} = useBoolean(false)
const emailRef = ref()
const userNameRef = ref()
const passwordRef = ref()

// const needUsername = computed(() => brandReg.value?.username)
/** 后台管理注册配置是否需要显示邮箱 */
// const needPhone = computed(() => brandReg.value && brandReg.value.phone && brandReg.value.phone.phone)
// const needEmail = computed(() => needPhone.value ? false : brandReg.value && brandReg.value.mail && brandReg.value.mail.mail)

const {
  value: email,
  errorMessage: emailErrorMsg,
  validate: validateEmail,
  setErrors: setEmailErrors,
} = useField<string>('email', (value) => {
  if (!value)
    return t('this_field_is_required')
  else if (!emailReg.test(value))
    return t('email_address_incorrect')
  else if (value && value.length > 30)
    return t('pls_input_email')
  return ''
}, {
  initialValue: props.data.email,
})
const {
  value: username,
  errorMessage: usernameErrorMsg,
  validate: validateUsername,
  setErrors: setUsernameErrors,
} = useField<string>('username', (value) => {
  if (!value)
    return t('min_len_char', { delta: 6 })
  else if (value.length < 6)
    return t('min_len_char', { delta: 6 })
  else if (value.match('[^a-zA-Z0-9]'))
    return t('name_has_invalid_char')
  else if (value.length > 30)
    return t('max_len_char', { delta: 30 })
  else if (!usernameReg.test(value))
    return t('validate_msg_user_name_tip')
  // 此用户名已被使用，请选择另一用户名。
  // 用户名含有无效的字符
  // 您的用户名长度必须为 3 – 30 个字符。
  return ''
})
const {
  value: password,
  errorMessage: pwdErrorMsg,
  validate: validatePassword,
  meta: pwdMeta,
} = useField<string>('password', (value) => {
  if (!value)
    return t('pop_up_create_account_password_least_8_characters')
  else if (value.length < 8)
    return t('pop_up_create_account_password_least_8_characters')
  else if (!upperLowerReg.test(value))
    return t('pop_up_create_account_password_uppercase_lowercase_letter')
  else if (!lastOneNumberReg.test(value))
    return t('pop_up_create_account_password_least_1_number')
  return ''
})

const { runAsync: runExists } = useRequest(ApiMemberExists, {
  onSuccess(res) {
    // if (res.exist) {
    //   if (curExists.value === 1)
    //     setUsernameErrors(t('choose_another_name'))
    //   if (curExists.value === 2)
    //     setEmailErrors(t('email_exists'))
    // }
  },
  onError: () => {
    if (curExists.value === 1)
      setUsernameErrors(t('choose_another_name'))
    if (curExists.value === 2)
      setEmailErrors(t('email_exists'))
  },
})

const curParams = ref()
const regThirdParams = computed(() => {
  return Session.get<IMemberThirdReg>(STORAGE_THIRDREG_PARAMS_KEYWORDS)?.value
})
const { run: runThirdReg, loading: thirdRegLoading } = useRequest(ApiMemberThirdReg, {
  onSuccess: async (data) => {
    appStore.setToken(data)
    Session.remove(STORAGE_THIRDREG_PARAMS_KEYWORDS)
    openNotify({
      title: t('tip_pop_up_reg_success_title'),
      type: 'success',
      message: `${t('tip_pop_up_reg_success_title')} ${curParams.value?.username}!`,
    })
    await nextTick()
    closeDialog()
    setTimeout(() => {
      location.replace('/')
    }, 100)
  },
})

const isApiLoading = computed(() => thirdRegLoading.value)
const pwdTouched = computed(() => passwordRef.value?.isTouched)

function onPasswordFocus() {
  setShowPasswordVerifyTrue()
}
function onPasswordBlur() {
  if (pwdMeta.dirty) {
    passwordRef.value.setTouchTrue()
    validatePassword()
  }
  if (pwdStatus.value)
    setShowPasswordVerifyFalse()
}
function passwordVerifyPass(status: boolean) {
  setPwdStatus(status)
}

// const { isMobile } = storeToRefs(useWindowStore())
const { countryCallingCode } = useIpApi()
// const { areaCodeOptionsFiltered, clearAreaSearchValue } = useAreaCode()
// const phoneInputRef = ref()
const areaCode = ref(countryCallingCode.value)
const {
  value: phone,
  errorMessage: phoneErrorMsg,
  validate: valiPhone,
  setErrors: setPhoneError,
  resetField: resetPhone,
} = useField<string>('phone', (value) => {
  if (areaCode.value === '+63')
    return philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  else if (areaCode.value === '+86')
    return chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  else if (areaCode.value === '+55')
    return brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
  return numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : t('phone_invalid')
}, { initialValue: '' })
const phoneField = computed(() => `${areaCode.value}-${phone.value}`)

async function submit() {
  // if (needPhone.value) {
  //   await valiPhone()
  //   await onEmailUsernameBlur(3)
  // }

  if (isEmailEmptyAndMust.value) {
    emailRef.value?.setTouchTrue()
    await validateEmail()
    await onEmailUsernameBlur(2)
  }

  // if (needUsername.value) {
  userNameRef.value?.setTouchTrue()
  await validateUsername()
  await onEmailUsernameBlur(1)
  // }

  passwordRef.value.setTouchTrue()
  await validatePassword()
  if (usernameErrorMsg.value || emailErrorMsg.value || pwdErrorMsg.value)
    return

  // closeDialog()
  const thirdReg: IMemberThirdReg = {
    email: email.value,
    username: username.value,
    third_id: props.data.id,
    third_type: props.ty,
    device_number: await application.getDeviceNumber(),
    parent_uid: route.query.u?.toString() || (Local.get(STORAGE_UUUUU)?.value || '') as string,
    password: password.value,
    c: route.query.c?.toString() || (Local.get(STORAGE_CCCCC)?.value || '') as string,
    // phone: phoneField.value,
  }

  curParams.value = thirdReg
  // 把第三方注册信息存储到session中，就把正常注册信息删除
  Session.set(STORAGE_THIRDREG_PARAMS_KEYWORDS, thirdReg)
  Session.remove(STORAGE_REG_PARAMS_KEYWORDS)
  // openTermsDialog()
  // if (!needUsername.value) {
  //   // if (needPhone.value)
  //   //   curParams.value.username = thirdReg.phone?.replace('+', '').replace('-', '')
  //   // else
  //   if (isEmailEmptyAndMust.value) // || needEmail.value
  //     curParams.value.username = thirdReg.email
  // }
  runThirdReg(curParams.value)
}

async function onEmailUsernameBlur(type: 1 | 2 | 3) {
  curExists.value = type
  if (type === 1 && username.value && !usernameErrorMsg.value)
    await runExists({ ty: type, val: username.value, noNotify: true })
  if (type === 2 && email.value && !emailErrorMsg.value)
    await runExists({ ty: type, val: email.value })
  if (type === 3 && phone.value && !phoneErrorMsg.value)
    await runExists({ ty: type, val: phoneField.value, noNotify: true })
}

onMounted(() => {
  if (props.data && !props.data.email)
    setEmailShow(true)
})
</script>

<template>
  <div class="app-auth-third-form flex flex-col p-[16px]">
    <h6 class="text-tg-text-white text-center text-[18px] font-semibold">
      {{ `${t('reg')} OAuth` }}
    </h6>
    <div>
      <div class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]">
        {{ t('reg_step1') }}
      </div>

      <!-- v-if="needUsername" -->
      <BaseInput
        ref="userNameRef" v-model="username" :placeholder="t('username_hint')"
        :msg="usernameErrorMsg"
        @blur="onEmailUsernameBlur(1)"
      />
    </div>

    <BaseInput
      v-if="isEmailEmptyAndMust"
      ref="emailRef" v-model="email" :msg="emailErrorMsg" :placeholder="t('email_address')"
      @blur="onEmailUsernameBlur(2)"
    />

    <div>
      <BaseInput
        ref="passwordRef" v-model="password" :placeholder="t('login_pwd')"
        :msg="pwdErrorMsg" type="password" name="password"
        autocomplete="current-password"
        msg-after-touched @focus="onPasswordFocus" @blur="onPasswordBlur"
      />
      <AppPasswordVerify
        v-show="password" type="row"
        :password="password" :has-error-msg="!!pwdErrorMsg"
        :pwd-touched="pwdTouched" @pass="passwordVerifyPass"
      />
    </div>
    <BaseButton bg-style="secondary" size="md" :loading="isApiLoading" :disabled="isApiLoading" @click="submit">
      {{ t('registration_finally_play_now') }}
    </BaseButton>
  </div>
</template>

<style lang="scss" scoped>
.app-auth-third-form {
  > * {
    margin-bottom: 12px;
  }
  > :last-child {
    margin-bottom: 0;
  }
}
</style>

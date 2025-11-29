<script lang="ts" setup>
import { IconInfo } from '@tg/icons'
import { ApiExcludeSendMailCode, ApiMemberExclude, ApiMemberPhoneSms } from '@tg/apis'

const { openNotify } = useNotify()
const { t } = useI18n()
usePageTitle({ prefix: t('login_pwd') })
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const { globalPageTitle } = useGlobalStatePageTitle()

globalPageTitle.value = t('self_exclusion')

const captcha = ref('')
const exclude = computed(() => {
  return userInfo.value?.exclude === 1
})
const show = ref(false)
const step = ref(1)
const useCaptcha = computed(() => {
  if (userInfo.value?.email)
    return 'email'
  if (userInfo.value?.phone)
    return 'phone'
  return ''
})
function openDialog() {
  if (useCaptcha.value) {
    show.value = true
    step.value = 1
  }
  else {
    submit(3)
  }
}
const countDown = ref(60)
const isCountDown = ref(false)
let timer: any = null
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
function sendCode() {
  const callback = () => {
    step.value = 2
    startCountDown()
  }

  if (useCaptcha.value === 'email')
    ApiExcludeSendMailCode({ email: userInfo.value!.email }).then(callback)
  else
    ApiMemberPhoneSms({ type: 1, uid: userInfo.value!.uid }).then(callback)
}

function submit(ty: number) {
  ApiMemberExclude({ ty, captcha: captcha.value, exclude: !exclude.value ? 1 : 2, domain: location.origin || '' }).then(() => {
    appStore.updateUserInfo().then(() => {
      openNotify({ type: 'success', title: exclude.value ? t('extend_on') : t('extend_off'), message: exclude.value ? t('extend_on_content') : t('extend_off_content') })
      isCountDown.value = false
      show.value = false
      captcha.value = ''
    })
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
    <AppSettingsContentItem class="bg" show-hr :title="t('extend')" :btn-text="t(!exclude ? 'extend_btn' : 'extend_btn_off')" @submit="openDialog">
      <span v-if="!exclude" class="text white">{{ t('extend_content_1') }}</span>
      <span v-if="!exclude" class="text">{{ t('extend_content_2') }}</span>
      <span v-if="exclude" class="text">{{ t('extend_content_8') }}</span>
    </AppSettingsContentItem>
    <BaseDialog
      show-close
      :icon="step != 1 ? 'uni-arrow-left' : ''" :title="step === -1 ? t('no_sms') : (step === 1 ? t('say_hello', { name: userInfo!.username }) : t(useCaptcha == 'email' ? 'label_email_check' : 'phone_verify'))" :show="show"
      height="auto" @click-title="step === -1 ? (step = 2) : (step--)" @close="show = false"
    >
      <div v-if="step == 1" class="flex flex-col justify-between gap-[16px] p-[16px]">
        <div class="line" />
        <span class="flex justify-center font-bold" style="line-height: 20px;">{{ t(!exclude ? 'extend_content_3' : 'extend_content_9') }}</span>
        <span class="text light">{{ t(!exclude ? 'extend_content_4' : 'extend_content_10') }}</span>
        <div class="line" />
        <BaseButton
          bg-style="secondary" size="xl" class="w-full" @click="sendCode"
        >
          {{ t(!exclude ? 'extend_btn_2' : 'extend_btn_off') }}
        </BaseButton>
        <span class="text dash flex items-center justify-center gap-[4px] px-[24px] py-[12px]"> <IconInfo /> {{ t('extend_content_5') }}</span>
      </div>
      <div v-if="step == 2" class="flex flex-col justify-between gap-[16px] p-[16px]">
        <span class="text">{{ t('extend_content_6', { phone: useCaptcha == 'email' ? maskEmail(userInfo!.email) : maskPhone(userInfo!.phone) }) }}</span>
        <div class="flex gap-[4px]">
          <BaseInput v-model="captcha" class="var" :max="6">
            <template v-if="countDown !== 0" #right-icon>
              <span v-show="countDown !== 0">{{ countDown }}s</span>
            </template>
          </BaseInput>
          <BaseButton
            v-if="countDown === 0"
            class="var"
            bg-style="primary" style="white-space: nowrap" @click="sendCode"
          >
            {{ t('re_send') }}
          </BaseButton>
        </div>
        <span class="text cursor-pointer" @click="step = -1">{{ t('extend_content_7') }}</span>
        <BaseButton bg-style="secondary" @click="submit(useCaptcha == 'email' ? 1 : 2)">
          <span>{{ t('submit') }}</span>
        </BaseButton>
      </div>
      <div v-if="step == -1" class="flex flex-col justify-between gap-[16px] p-[16px]">
        <i18n-t
          class="text"
          keypath="verify_code_send_already" tag="div"
        >
          {{ useCaptcha === 'email' ? t('mail') : t("cellphone") }}
        </i18n-t>
        <div class="text">
          1. {{ useCaptcha === 'email' ? t('check_your_email') : t('check_your_phone') }}
        </div>
        <div class="text">
          2.
          <i18n-t keypath="check_your_trash_box" tag="span">
            {{ useCaptcha === 'email' ? t('mail_item') : t("sms") }}
          </i18n-t>
        </div>
        <div class="text">
          3. {{ t('wait_for_10_mins') }}
        </div>
        <BaseButton bg-style="secondary" size="xl" @click="step = 2">
          {{ t('confirm') }}
        </BaseButton>
      </div>
    </BaseDialog>
  </div>
</template>

<style lang="scss" scoped>
.bg {
  --tg-app-settings-content-item-style-max-width: 100%;
  @include webTheme('white') {
    --tg-primary-main: #e8e8e8;
    border: none;
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
  background-color: var(--tg-text-lightgrey);
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
</style>

<route lang="yaml">
</route>

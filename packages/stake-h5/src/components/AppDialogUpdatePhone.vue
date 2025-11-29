<script setup lang='ts'>
import { IconUniBack } from '@tg/icons'
import { ApiMemberPhoneSms, ApiMemberUpdate } from '@tg/apis'

interface Props {
  data: {
    phone: string
    areaCode: string
    uid: string
  }
}
defineOptions({
  name: 'AppDialogUpdatePhone',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const { openNotify } = useNotify()
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

const verifyCodeRef = ref()
const page = ref(1)

const phoneField = computed(() => `${props.data.areaCode}-${props.data.phone}`)
const phone = computed(() => props.data.phone)
const areaCode = computed(() => props.data.areaCode)
const uid = computed(() => props.data.uid)

const {
  value: verifyCode,
  errorMessage: verifyCodeErrorMsg,
  validate: valiVerifyCode,
  setValue: setVerifyCode,
} = useField<string>('verifyCode', (value) => {
  if (!value)
    return t('validate_msg_input_code')
  else if (!payPasswordReg.test(value))
    return t('validate_msg_regexp_code_phone')
  return ''
})

const { run: runMemberUpdate, loading: updateLoading } = useRequest(() => ApiMemberUpdate({
  record: {
    phone: phoneField.value,
  },
  uid: uid.value,
  captcha: verifyCode.value,
}), {
  async onSuccess() {
    closeDialog()
    await nextTick()
    openNotify({
      type: 'phone',
      title: t('success_update_phone'),
      message: t('phone_update_to', [`${areaCode.value} ${phone.value}`]),
    })
    appStore.updateUserInfo()
  },
})

/** 发送手机验证码 */
const {
  runAsync: runAsyncSendPhoneSms,
  loading: phoneCaptchaLoading,
} = useRequest(() => ApiMemberPhoneSms({ phone: phoneField.value, type: 0 }), {
  onSuccess(res) {
    if (+res > 0) {
      reset(+res * 1000)
      start()
      isCountdown.value = true
    }
    else {
      reset()
      start()
      isCountdown.value = true
      openNotify({
        type: 'success',
        title: t('notify_title_success'),
        message: t('success_send_code'),
      })
    }
  },
})

/** 点击重新发送 */
function onResendClick() {
  if (phoneCaptchaLoading.value)
    return
  runAsyncSendPhoneSms()
}
/** 提交 */
async function onSubmitClick() {
  await valiVerifyCode()
  if (!verifyCodeErrorMsg.value)
    runMemberUpdate()
}

watch(verifyCode, (a) => {
  if (a && a.length > 6) {
    nextTick(() => {
      setVerifyCode(a.slice(0, 6))
    })
  }
})

await application.allSettled([runAsyncSendPhoneSms()])
</script>

<template>
  <div class="root flex flex-col p-[16px]">
    <template v-if="page === 1">
      <div class="flex">
        <div class="flex cursor-pointer items-center text-[18px] font-semibold leading-[25px]" @click="closeDialog">
          <IconUniBack class="text-[14px]" />
          <span class="ml-[5px]">{{ t('label_phone_check') }}</span>
        </div>
      </div>

      <i18n-t
        keypath="please_input_your_verification_code" tag="div"
        class="text-tg-text-lightgrey text-[14px] font-semibold leading-[1.5]"
      >
        <span>{{ `${areaCode} ${phone}` }}</span>
      </i18n-t>
      <BaseInput
        ref="verifyCodeRef" v-model="verifyCode" max="6" :msg="verifyCodeErrorMsg" type="number" :hide-spin-btn="true"
        input-mode="numeric" msg-after-touched
      >
        <template #right-icon>
          <div v-if="isCountdown">
            {{ current.seconds }}s
          </div>
          <BaseButton
            v-else size="none" type="text" style="--tg-base-button-text-default-color:var(--tg-text-white);"
            @click="onResendClick"
          >
            <span class="whitespace-nowrap">{{ t('resend') }}</span>
          </BaseButton>
        </template>
      </BaseInput>
      <div class="flex">
        <BaseButton type="text" size="none" @click="page = 2">
          {{ t('no_verification_code') }}
        </BaseButton>
      </div>
      <BaseButton
        bg-style="secondary" size="md" :loading="updateLoading" :disabled="updateLoading"
        style="--tg-base-button-font-size:16px;" @click="onSubmitClick"
      >
        {{ t('submit') }}
      </BaseButton>
    </template>

    <!-- 没收到验证码 -->
    <AppDialogRegisterPartNoReceiveCode v-else-if="page === 2" type="phone" @back="page = 1" />
  </div>
</template>

<style lang='scss' scoped>
.root {
  > *:not(:first-child) {
    margin-top: 12px;
  }
}
</style>

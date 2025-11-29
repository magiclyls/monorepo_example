<script lang="ts" setup>
import { ApiMemberEmailCheckRequest, ApiMemberUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean, useCountDown } from '@tg/hooks'
import { useAppStore, useBrandStore } from '@tg/stores'
import { emailReg } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'

interface Props {
  isComponent?: boolean
}
defineOptions({ name: 'EmailSetting' })
const props = withDefaults(defineProps<Props>(), {
  isComponent: false,
})
const emit = defineEmits(['toggle'])
const brandStore = useBrandStore()
const { t } = useI18n()
const { start, current, pause, reset } = useCountDown({ time: 60000 })
const { userInfo } = storeToRefs(useAppStore())
const { updateUserInfo } = useAppStore()
const emailVerified = computed(() => userInfo.value?.email_check_state === 1)
const {
  value: email,
  errorMessage: emailErrormsg,
  validate: emailValidate,
  setValue: setEmail,
} = useField<string>('email', (value) => {
  if (!value)
    return t('此字段为必填项')

  if (!emailReg.test(value))
    return t('这含有无效的电子邮件字符')
  else if (value && value.length > 30)
    return t('请输入有效的电邮地址')
  return ''
})

const {
  bool: emailDisabledBtn,
  setTrue: setEmailDisabledBtnTrue,
  setFalse: setEmailDisabledBtnFalse,
} = useBoolean(true)

const {
  run: runEmailCheckRequest,
  loading: loadingEmailCheckRequest,
} = useRequest(ApiMemberEmailCheckRequest, {
  onSuccess(data) {
    stop()
    if (+data > 0) {
      reset(+data * 1000)
      start()
    }
    else {
      reset(60 * 1000)
      start()
      Message.success(t('验证电邮已重新发送至') + email.value)
    }
  },
})

const hasChangeEmail = computed(() => userInfo.value?.email !== email.value)

async function emailCheck(manual: boolean) {
  await emailValidate()
  if (!emailErrormsg.value) {
    runEmailCheckRequest({ email: email.value })
  }
}

const { runAsync: runMemberUpdate, loading: memberUpdateLoading } = useRequest(ApiMemberUpdate, {
  onSuccess(data, params) {
    if (params[0].record.email) {
      setEmailDisabledBtnTrue()
      emailCheck(false)
    }
    // emailCheck(false)
    updateUserInfo()
    Message.success(t('成功更新电邮地址'))
  },
})

async function emailSubmit() {
  await emailValidate()
  if (!emailErrormsg.value)
    runMemberUpdate({ record: { email: email.value }, uid: userInfo.value?.uid })
}

/**
 * 重新发送
 */
function emailCheckAgain() {
  if (current.value.seconds > 0)
    return
  const initEmailText = userInfo.value?.email
  if (email.value !== initEmailText)
    emailSubmit()
  else
    emailCheck(true)
}

watch(() => userInfo.value?.email, (newValue) => {
  setEmail(newValue ?? '')
}, { immediate: true })
</script>

<template>
  <div class="bg-transparent rounded-[8px] p-[12px]" :class="isComponent && 'p-[0]!'">
    <div class="text-[#fff] text-[18px] font-[600] mb-[8px] flex items-center">
      <span>{{ t('邮箱地址') }}</span>
      <span v-if="emailVerified" class="bg-[#24EE89] text-[#05080A] text-[12px] font-[600] rounded-[45px] h-[22px] flex justify-center items-center px-[8px] ml-[10px]">{{ t('已验证') }}</span>
    </div>
    <div v-if="isComponent" class="text-[#B1BAD3] text-[14px] font-[600] mb-[16px]">
      {{ t('您必须验证您的电邮地址才能进行提款 ') }}
    </div>
    <AfunBaseLabel :label="t('邮箱地址')" required class="mb-[16px]">
      <AfunBaseInput
        ref="emailRef"
        v-model="email"
        name="emailCode"
        type="text"
        msg-after-touched
        :msg="emailErrormsg"
        required
        :disabled="current.seconds > 0"
        inputmode="text"
        :placeholder="t('邮箱地址')"
      />
    </AfunBaseLabel>
    <div v-if="isComponent && brandStore.isOpenMobileVerify" class="mb-[16px]" @click="emit('toggle')">
      <span class="text-[#B1BAD3] font-[600] mr-[4px]">{{ t('没有收到验证码？') }}</span>
      <span class="text-[#F23038] font-[600]">{{ t('使用手机') }}</span>
    </div>
    <div v-if="!emailVerified" class="flex justify-end items-center">
      <div type="none" class="h-[42px] mr-[12px] leading-[42px]" :class="[current.seconds > 0 && 'text-[#B1BAD3]']" @click="emailCheckAgain">
        <span>{{ `${current.seconds > 0 ? `${current.seconds} ` : ''}${t('重新发送')}` }}</span>
      </div>
      <AfunBaseButton type="primary" :loading="memberUpdateLoading" :disabled="!!emailErrormsg || (current.seconds > 0 && current?.seconds < 60) || !hasChangeEmail" class="h-[42px] px-[26px]" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; --afun-base-button-padding-x: 26px" @click="emailSubmit">
        <span>{{ t('确认') }}</span>
      </AfunBaseButton>
    </div>
  </div>
</template>

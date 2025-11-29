<script setup lang="ts">
import { PhBaseButton, PhBaseInput } from '@tg/bccomponents'
import { useCountDown } from '@tg/hooks'
import { IconUniClose3 } from '@tg/icons'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppNoReceiveCode from '../../../components/AppNoReceiveCode.vue'

defineOptions({
  name: 'AppPhoneOrEmailVerify',
})
defineProps<Props>()
const emits = defineEmits(['resend', 'submit', 'codeType', 'close'])
interface Props {
  isEmailRegType: boolean
  email: string
  areaCode: string
  phone: string
  verifyCode: string
  isApiLoading: boolean
}
const { t } = useI18n()
const isCountdown = ref(false)
const isShowNoCode = ref(false)
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
function onSubmitClick() {
  emits('submit')
}
function onResendClick() {
  reset()
  start()
  isCountdown.value = true
  emits('resend')
}
function noCodeBack() {
  isShowNoCode.value = false
}
onMounted(() => {
  reset()
  start()
  isCountdown.value = true
})
</script>

    <!-- 邮箱或手机验证 -->
<template>
  <div class="p-[16rem] pb-[32rem] grid gap-[12rem]">
    <template v-if="!isShowNoCode">
      <div class="flex cursor-pointer items-center text-[18rem]">
        <span class="mr-auto font-semibold">{{ isEmailRegType ? t('邮箱验证') : t('手机验证') }}</span>
        <div @click="emits('close')">
          <IconUniClose3 class="text-[#0D2245]" />
        </div>
      </div>
      <i18n-t
        keypath="请输入发送至 {0} 的6位验证码，该验证码的有效期为{1}分钟。" tag="div"
        class="text-[14rem] text-[#0D2245] font-medium "
      >
        <span>{{ isEmailRegType ? email : `${areaCode} ${phone}` }}</span>
        <span>{{ 5 }}</span>
      </i18n-t>
      <PhBaseInput
        :model-value="verifyCode" name="verifyCode" :max="6" type="number" input-mode="numeric"
        @update:model-value="(v) => emits('codeType', v)"
      >
        <template #right>
          <div v-if="isCountdown" class="h-full center text-[#9DABC9]">
            {{ current.seconds }}s
          </div>
          <div
            v-else
            class="h-full center cursor-pointer text-[#9DABC9]"
            @click="onResendClick"
          >
            <span class="whitespace-nowrap ">{{ t('重新发送') }}</span>
          </div>
        </template>
      </PhBaseInput>
      <div class="text-[#6D7693] font-semibold" @click="isShowNoCode = true">
        {{ t('没有收到验证码？') }}
      </div>
      <PhBaseButton
        :loading="isApiLoading" @click="onSubmitClick"
      >
        {{ t('提交') }}
      </PhBaseButton>
    </template>
    <AppNoReceiveCode v-if="isShowNoCode" :type="isEmailRegType ? 'email' : 'phone'" @back="noCodeBack" />
  </div>
</template>

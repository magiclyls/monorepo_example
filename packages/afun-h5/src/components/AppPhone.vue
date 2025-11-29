<script lang="ts" setup>
import { ApiMemberExists, ApiMemberPhoneSms, ApiMemberUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseImage, AfunBaseInput, AfunBaseLabel, AfunBaseOriginSelect, AfunBaseSelect } from '@tg/bccomponents'
import { useAreaCode, useBoolean, useCountDown, useIpApi } from '@tg/hooks'
import { useAppStore, useBrandStore } from '@tg/stores'
import { brazilPhoneReg, chinaPhoneReg, numberReg, philippinePhoneReg } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'

interface Props {
  isComponent?: boolean
}
defineOptions({ name: 'PhoneSetting' })

const props = withDefaults(defineProps<Props>(), {
  isComponent: false,
})
const emit = defineEmits(['toggle'])
const { areaSearchValue, areaCodeOptionsFiltered, clearAreaSearchValue, areaCodeOptions, areaCodeData } = useAreaCode()
const { isOpenMobileVerify, isOpenEmailVerify } = storeToRefs(useBrandStore())
const { t } = useI18n()
const { countryCallingCode } = useIpApi()
const phoneRef = ref()
const codeRef = ref()
const { bool: isCountdown } = useBoolean(false)
const { userInfo, isSetPayPwd, isLogin } = storeToRefs(useAppStore())
const { updateUserInfo } = useAppStore()
const area_code = ref(areaPlus(userInfo.value?.phone.split('-')[0]) || countryCallingCode.value || '+86')
const areaCodeLabel = computed(() => areaCodeOptions.value?.find(a => a.value === area_code.value)?.label ?? '')
const phoneVerified = computed(() => userInfo.value?.phone_check_state === 1)

// 添加区号数据加载状态检查
const isAreaCodeDataReady = computed(() => {
  return areaCodeData.value && areaCodeData.value.length > 0
})

// 确保 areaCodeOptionsFiltered 在数据未加载完成时有默认值
const safeAreaCodeOptionsFiltered = computed(() => {
  if (!isAreaCodeDataReady.value) {
    // 如果数据未加载完成，返回一个默认的区号选项
    return [{ label: '+86', value: '+86' }]
  }
  return areaCodeOptionsFiltered.value
})

// 添加加载状态显示
const showAreaCodeLoading = computed(() => {
  return !isAreaCodeDataReady.value && areaCodeData.value === undefined
})

const paramsData = ref({
  uid: '',
  telegram: '',
  facebook: '',
  zalo: '',
  line: '',
  viber: '',
  whatsapp: '',
  twitter: '',
  wechat: '',
  qq: '',
  /** 性别 1=男，2=女 */
  sex: 1,
  cpf: '',
})

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

const {
  value: phone,
  errorMessage: phoneErrorMsg,
  validate: validPhone,
  setValue: setPhone,
  resetField: resetPhone,
} = useField<string>('phone', fieldVerifyPhone, { initialValue: '' })

const {
  value: phoneCode,
  errorMessage: phoneCodeErrorMsg,
  validate: valiPhoneCode,
  resetField: resetPhoneCode,
} = useField<string>('phoneCode', (value) => {
  if (!value)
    return t('请输入验证码')
  else if (value.length !== 6)
    return t('仅支持6位纯数字')
  return ''
}, { initialValue: '' })

const hasChangePhone = computed(() => `${area_code.value}-${phone.value}` !== userInfo.value?.phone)

const { runAsync: runMemberUpdate, loading: updatePhoneLoading } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    Message.success(t('修改成功'))
    updateUserInfo()
  },
})

/** 发送手机验证码 */
const {
  runAsync: runAsyncSendPhoneSms,
  loading: phoneCaptchaLoading,
} = useRequest(() => ApiMemberPhoneSms({ phone: `${area_code.value}-${phone.value}`, type: 0 }), {
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
      Message.success(t('验证码发送成功'))
    }
  },
})

/** 点击重新发送 */
function onResendClick() {
  if (phoneCaptchaLoading.value)
    return
  runAsyncSendPhoneSms()
}

/** 检测是否存在 */
const { runAsync: runExists, loading: existLoading } = useRequest(ApiMemberExists, {
  onSuccess(res) {
    runMemberUpdate({
      record: {
        phone: `${area_code.value}-${phone.value}`,
      },
      uid: paramsData.value.uid,
    })
    // }
  },
})

/** 📱📱修改手机相关📱📱 */
const isPhoneVerified = computed(() => userInfo.value?.phone_check_state === 1)
const isSamePhoneNumber = computed(() => phone.value === userInfo.value?.phone.split('-')[1])
const phoneEditBtnText = computed(() => {
  if (userInfo.value?.phone) // && !isPhoneVerified.value && isSamePhoneNumber.value
    return isOpenMobileVerify.value ? t('验证') : t('确认')

  return t('确认')
})

// 区号接口数据有可能没有+号
function areaPlus(v?: string) {
  if (v && v.length)
    return v.includes('+') ? v : `+${v}`
}

function fieldVerifyPhone(): string {
  let b = false
  const _phone = phone.value
  if (!_phone)
    b = false
  const areaCode = isPhoneVerified.value ? areaCodeLabel.value : area_code.value
  if (areaCode === '+63')
    b = !!(philippinePhoneReg.test(`+63${_phone}`) && _phone.length > 5 && _phone.length <= 18)
  else if (areaCode === '+86')
    b = !!chinaPhoneReg.test(`${_phone}`) && _phone.length > 5 && _phone.length <= 18
  else if (areaCode === '+55')
    b = !!brazilPhoneReg.test(`+55${_phone}`) && _phone.length > 5 && _phone.length <= 18
  else
    b = !!numberReg.test(_phone) && _phone.length > 5 && _phone.length <= 18
  if (!b)
    return t('手机号码无效')
  else
    return ''
}

// 提交
async function updatePhone() {
  phoneRef.value.setTouchTrue()
  await validPhone()
  if (isOpenMobileVerify.value) {
    codeRef.value.setTouchTrue()
    await valiPhoneCode()
  }
  if (phoneErrorMsg.value || (isOpenMobileVerify.value && phoneCodeErrorMsg.value))
    return
  if (!isSamePhoneNumber.value) {
    runExists({ ty: 3, val: `${area_code.value}-${phone.value}`, noNotify: true })
  }
  else {
    runMemberUpdate({
      record: {
        phone: `${area_code.value}-${phone.value}`,
      },
      uid: paramsData.value.uid,
    })
  }
}

watch(() => userInfo.value?.phone, (newValue) => {
  if (userInfo.value?.phone) {
    const arr = userInfo.value.phone.split('-')
    setPhone(arr[1])
    area_code.value = arr[0]
  }
}, { immediate: true })

// 监听区号数据加载完成，确保 area_code 有正确的值
watch(() => isAreaCodeDataReady.value, (isReady) => {
  if (isReady && areaCodeOptions.value.length > 0) {
    // 如果数据加载完成，检查当前 area_code 是否在可选项中
    const isValidOption = areaCodeOptions.value.some(option => option.value === area_code.value)
    if (!isValidOption) {
      // 如果当前值不在可选项中，设置为第一个可选项
      area_code.value = areaCodeOptions.value[0].value
    }
  }
  else if (isReady && !area_code.value) {
    // 如果数据加载完成但 area_code 还没有值，设置默认值
    area_code.value = countryCallingCode.value || '+86'
  }
}, { immediate: true })
</script>

<template>
  <div class="bg-transparent rounded-[8px] p-[12px]" :class="isComponent && 'p-[0]!'">
    <div class="text-[#fff] text-[18px] font-[600] mb-[8px] flex items-center">
      <span>{{ t('手机号码') }}</span>
      <span v-if="phoneVerified" class="bg-[#24EE89] text-[#05080A] text-[12px] font-[600] rounded-[45px] h-[22px] flex justify-center items-center px-[8px] ml-[10px]">{{ t('已验证') }}</span>
    </div>
    <div v-if="isComponent" class="text-[#B1BAD3] text-[14px] font-[600] mb-[16px]">
      {{ t('您必须验证您的电邮地址才能进行提款 ') }}
    </div>
    <div v-else class="text-[#B1BAD3] text-[14px] font-[600] mb-[16px]">
      {{ t('我们只服务国际电话区号列表中所列有的区域') }}
    </div>

    <AfunBaseLabel v-if="isComponent" :label="t('手机号码')" required class="mb-[16px]">
      <AfunBaseInput
        ref="phoneRef"
        v-model="phone"
        name="phone"
        type="text"
        msg-after-touched
        :msg="phoneErrorMsg"
        required
        inputmode="number"
        :placeholder="t('手机号码')"
      >
        <template #left>
          <div class="center h-full flex text-[#9DABC9]">
            <AfunBaseImage v-if="area_code && area_code.length" class="w-[16px]" :url="`/flag/${area_code.slice(1)}.webp`" />
            <AfunBaseOriginSelect
              v-if="!showAreaCodeLoading"
              v-model="area_code"
              :options="safeAreaCodeOptionsFiltered"
              class="cursor-pointer"
            />
            <div v-else class="text-[12px] text-[#9DABC9] px-[4px]">
              {{ t('加载中') }}
            </div>
          </div>
        </template>
      </AfunBaseInput>
    </AfunBaseLabel>
    <template v-else>
      <AfunBaseLabel :label="t('国际电话区号')" required class="mb-[16px]">
        <AfunBaseSelect
          v-model="area_code"
          shadowed :options="safeAreaCodeOptionsFiltered"
        />
      </AfunBaseLabel>
      <AfunBaseLabel :label="t('手机号码')" required class="mb-[16px]">
        <AfunBaseInput
          ref="phoneRef"
          v-model="phone"
          name="phone"
          type="text"
          msg-after-touched
          :msg="phoneErrorMsg"
          required
          inputmode="number"
          :placeholder="t('手机号码')"
        />
      </AfunBaseLabel>
    </template>

    <div v-if="isOpenMobileVerify && !phoneVerified" class="mb-[5px]">
      <div v-if="isComponent && isOpenEmailVerify" class="flex items-center mb-[4px]">
        <span class="text-[#0D2245] text-[14px] font-[600]">{{ t('验证码') }}</span>
        <span class="text-[#F23038] text-[12px] ml-[5px] mr-[10px]">*</span>
      </div>
      <div v-else class="text-[#0D2245] text-[14px] font-[600] mb-[4px]">
        {{ t('验证码') }}<span data-v-934b1b0e="" class="text-[#F23038] text-[12px] ml-[5px]">*</span>
      </div>
      <div class="flex gap-[20px]">
        <div class="flex-1">
          <AfunBaseInput
            ref="codeRef"
            v-model="phoneCode"
            name="codeRef"
            type="text"
            msg-after-touched
            :msg="phoneCodeErrorMsg"
            required
            inputmode="number"
            :placeholder="t('验证码')"
          >
            <template v-if="isComponent" #right>
              <span v-if="isCountdown" class="text-[#9DABC9]">{{ `${current.seconds}s` }}</span>
            </template>
          </AfunBaseInput>
        </div>
        <AfunBaseButton v-if="!isComponent" type="primary" :loading="phoneCaptchaLoading" :disabled="isCountdown || !!phoneCodeErrorMsg || !phone" class="h-[40px] w-[110px]" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; --afun-base-button-border-color: #EBEBEB;--afun-base-button-secondary-background-color:#fff; --afun-base-button-padding-y: 8px" @click="onResendClick">
          <span v-if="isCountdown">{{ `${t('重新获取')} ${current.seconds}s` }}</span>
          <span v-else>{{ t('获取验证码') }}</span>
        </AfunBaseButton>
      </div>
    </div>
    <div v-if="isComponent && isOpenEmailVerify" class="mt-[11px] mb-[16px]">
      <span class="text-[#B1BAD3] font-[600] mr-[4px]">{{ t('没有收到验证码？') }}</span>
      <span class="text-[#F23038] font-[600] cursor-pointer" @click="emit('toggle')">{{ t('使用邮箱') }}</span>
    </div>

    <template v-if="!phoneVerified">
      <AfunBaseButton v-if="!isComponent" type="primary" :loading="updatePhoneLoading" :disabled="!hasChangePhone" class="h-[42px] w-full mt-[16px]" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; --afun-base-button-border-color: #EBEBEB;--afun-base-button-secondary-background-color:#fff; --afun-base-button-padding-y: 8px" @click="updatePhone">
        <span>{{ phoneEditBtnText }}</span>
      </AfunBaseButton>
      <div v-else class="flex justify-end items-center my-[8px]">
        <div type="none" class="h-[42px] mr-[12px] leading-[42px]" :class="[current.seconds > 0 && 'text-[#B1BAD3]']" @click="onResendClick">
          <span>{{ `${current.seconds > 0 ? `${current.seconds}s ` : ''}${t('重新发送')}` }}</span>
        </div>
        <AfunBaseButton type="primary" :loading="updatePhoneLoading" :disabled="!!hasChangePhone" class="h-[42px] px-[26px]" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; --afun-base-button-border-color: #EBEBEB;--afun-base-button-secondary-background-color:#fff;--afun-base-button-padding-x: 26px" @click="updatePhone">
          <span>{{ t('确认') }}</span>
        </AfunBaseButton>
      </div>
    </template>
  </div>
</template>

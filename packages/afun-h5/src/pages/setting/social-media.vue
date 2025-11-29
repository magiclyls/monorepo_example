<script lang="ts" setup>
import { ApiMemberUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseImage, AfunBaseInput } from '@tg/bccomponents'
import { useAreaCode, useBoolean, useIpApi } from '@tg/hooks'
import { useAppStore, useBrandStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { Message } from '~/utils'

defineOptions({ name: 'SocialMediaSetting' })
const { t } = useI18n()
interface ISocialData {
  [key: string]: boolean
}
// 输入框错误信息接口
interface Errors {
  // -1 为不通过，1为通过验证，0为中间状态
  [key: number]: { label: string, state: number }
}
interface INotifyData {
  type: notifyType
  title?: string
  message: string
}
/** 社交账号改变 */
const socialDataChanged: ISocialData = {
  facebook: false,
  whatsapp: false,
  telegram: false,
  line: false,
  twitter: false,
  zalo: false,
  viber: false,
  wechat: false,
  qq: false,
}
const { userInfo, updateUserInfo } = storeToRefs(useAppStore())
const { countryCallingCode } = useIpApi()// 表单验证错误信息
const inputErrorMsg: Errors = reactive({})
const { bool: isUpdateing } = useBoolean(false)
const { isOpenMobileVerify } = storeToRefs(useBrandStore())
const { bool: socialDisabledBtn, setTrue: setSocialDisabledBtnTrue, setFalse: setSocialDisabledBtnFalse } = useBoolean(true)
const { areaSearchValue, areaCodeOptionsFiltered, clearAreaSearchValue, areaCodeOptions } = useAreaCode()
const phone = ref(userInfo.value?.phone.split('-')[1] ?? '')
const area_code = ref(areaPlus(userInfo.value?.phone.split('-')[0]) || countryCallingCode.value)
const areaCodeRef = ref()
const areaCodeLabel = computed(() => areaCodeOptions.value?.find(a => a.value === area_code.value)?.label ?? '')
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
const socialData = [
  {
    label: 'Facebook',
    img: '/m/afun-h5/png/social-facebook.png',
    index: 'facebook',
    max: 50,
  },
  {
    label: 'WhatsApp',
    img: '/m/afun-h5/png/social-whatsapp.png',
    index: 'whatsapp',
    max: 19,
  },
  {
    label: 'Telegram',
    img: '/m/afun-h5/png/social-telegram.png',
    index: 'telegram',
    max: 32,
  },
  { label: 'Line', img: '/m/afun-h5/png/social-line.png', index: 'line', max: 50 },
  { label: 'X', img: '/m/afun-h5/png/social-x.png', index: 'twitter', max: 15 },
  { label: 'Zalo', img: '/m/afun-h5/png/social-zalo.png', index: 'zalo', max: 19 },
  { label: 'Viber', img: '/m/afun-h5/png/social-viber.png', index: 'viber', max: 100 },
  { label: 'WeChat', img: '/m/afun-h5/png/social-wechat.png', index: 'wechat', max: 20 },
]

/** 📱📱修改手机相关📱📱 */
const isPhoneVerified = computed(() => userInfo.value?.phone_check_state === 1)
const isSamePhoneNumber = computed(() => phone.value === userInfo.value?.phone.split('-')[1])
const phoneEditBtnText = computed(() => {
  if (userInfo.value?.phone) // && !isPhoneVerified.value && isSamePhoneNumber.value
    return isOpenMobileVerify.value ? t('验证') : t('确认')

  return t('确认')
})
/** 是否有手机号 */
const hasPhone = computed(() => !!userInfo.value?.phone)

const { runAsync: runMemberUpdate, loading: loadingUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    Message.success(t('修改成功'))
    updateUserInfo()
  },
})

// 区号接口数据有可能没有+号
function areaPlus(v?: string) {
  if (v && v.length)
    return v.includes('+') ? v : `+${v}`
}

/** 输入框验证格式方法 */
function checkFormat(index: number, label: string, val: string) {
  // 去除空格
  if (val.includes('\\'))
    return inputErrorMsg[index] = { label: t('格式不正确'), state: -1 }
  // facebook
  if (socialData[index].index === 'facebook') {
    if (val.length !== 0)
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // whatsapp 和 zalo
  if (socialData[index].index === 'whatsapp' || socialData[index].index === 'zalo') {
    const regex = /^\d{10,19}$/
    const resState = regex.test(val)
    if (!(resState) && val.length < 10 && val.length !== 0)
      inputErrorMsg[index] = { label: t('最小字符长度', ['10']), state: -1 }
    else if (!(resState) && val.length >= 10)
      inputErrorMsg[index] = { label: t('纯数字'), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // telegram
  if (socialData[index].index === 'telegram') {
    const regex = /^[a-z]\w{4,}$/i
    const resState = regex.test(val)
    if (!(resState) && !(/[a-z]/i.test(val[0])))
      inputErrorMsg[index] = { label: t('请以英文字母开头'), state: -1 }
    else if (!(resState) && val.length < 5 && (/[a-z]/i.test(val[0])) && val.length !== 0)
      inputErrorMsg[index] = { label: t('最小字符长度', ['5']), state: -1 }
    else if (!(resState) && val.length >= 5)
      inputErrorMsg[index] = { label: t('仅支持', ['"_"']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // line
  if (socialData[index].index === 'line') {
    const regex = /^[\w-]{2,50}$/
    const resState = regex.test(val)
    if (!resState && val.length < 2 && val.length !== 0)
      inputErrorMsg[index] = { label: t('最小字符长度', ['2']), state: -1 }
    else if (!resState && val.length >= 2)
      inputErrorMsg[index] = { label: t('仅支持1', ['“-” ', '"_”']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // x
  if (socialData[index].index === 'twitter') {
    const regex = /^\w{4,15}$/
    const resState = regex.test(val)
    if (!resState && val.length < 4 && val.length !== 0)
      inputErrorMsg[index] = { label: t('最小字符长度', ['4']), state: -1 }
    else if (!resState && val.length >= 4)
      inputErrorMsg[index] = { label: t('仅支持', ['"_"']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // viber
  if (socialData[index].index === 'viber') {
    const regex = /^[\w-]{6,100}$/
    const resState = regex.test(val)
    if (!resState && val.length < 6 && val.length !== 0)
      inputErrorMsg[index] = { label: t('最小字符长度', ['6']), state: -1 }
    else if (!resState && val.length >= 6)
      inputErrorMsg[index] = { label: t('仅支持1', ['“-” ', '"_”']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // wechat
  if (socialData[index].index === 'wechat') {
    const regex = /^[\w-]{6,20}$/
    const resState = regex.test(val)
    if (!resState && val.length < 6 && val.length !== 0)
      inputErrorMsg[index] = { label: t('最小字符长度', ['6']), state: -1 }
    else if (!resState && val.length >= 6)
      inputErrorMsg[index] = { label: t('仅支持1', ['“-” ', '"_”']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
}

// 提交表单
function socialSubmit() {
  let totalState = true
  for (const i in inputErrorMsg) {
    const inputState = inputErrorMsg[i].state
    if (inputState === -1)
      totalState = false
  }
  // 遍历完成后增加判断是否调用接口
  nextTick(() => {
    if (totalState) {
      const { sex, ...rest } = paramsData.value
      runMemberUpdate({ record: { sex: sex.toString(), ...rest }, uid: paramsData.value.uid })
      setSocialDisabledBtnTrue()
    }
    else {
      Message.error(t('输入的账号格式有误'))
    }
  })
}

// 选中时，改变错误状态
function onFocusInput(index: number) {
  inputErrorMsg[index] = { label: '', state: 1 }
}

watch(countryCallingCode, (a) => {
  area_code.value = a
}, { immediate: true })

watch(() => userInfo.value, (newValue) => {
  if (newValue && !isUpdateing.value && userInfo.value) {
    paramsData.value = {
      ...paramsData.value,
      ...newValue.mext,
      uid: newValue.uid,
    }
    phone.value = userInfo.value.phone.split('-')[1]
    area_code.value = areaPlus(userInfo.value.phone.split('-')[0]) || countryCallingCode.value

    setTimeout(() => {
      setSocialDisabledBtnTrue()
    }, 0)
  }
}, { immediate: true })

/** 监听社交账号改变 */
for (const k in paramsData.value) {
  if (
    ['facebook', 'telegram', 'line', 'twitter', 'zalo', 'viber', 'wechat', 'qq', 'whatsapp'].includes(k)
  ) {
    const key = k as keyof typeof paramsData.value
    watch(() => paramsData.value[key], (newValue, oldValue) => {
      if ((newValue as string).trim() === (oldValue as string).trim())
        socialDataChanged[k] = false
      else
        socialDataChanged[k] = true

      if (
        socialDataChanged.facebook
        || socialDataChanged.whatsapp
        || socialDataChanged.telegram
        || socialDataChanged.line
        || socialDataChanged.twitter
        || socialDataChanged.zalo
        || socialDataChanged.viber
        || socialDataChanged.wechat
        || socialDataChanged.qq
      ) {
        setSocialDisabledBtnFalse()
      }
      else {
        setSocialDisabledBtnTrue()
      }
    })
  }
}

onMounted(() => {
  if (userInfo.value) {
    paramsData.value = {
      ...paramsData.value,
      ...userInfo.value.mext,
      uid: userInfo.value.uid,
    }
    phone.value = userInfo.value.phone.split('-')[1]
    area_code.value = areaPlus(userInfo.value.phone.split('-')[0]) || countryCallingCode.value
    setTimeout(() => {
      setSocialDisabledBtnTrue()
    }, 0)
  }
})
</script>

<template>
  <AppPageLayout :title="t('社交账号')">
    <div class="bg-transparent rounded-[8px] p-[12px] pb-0">
      <div
        v-for="item, index in socialData"
        :key="index"
        class="flex gap-[10px] mb-[16px]"
      >
        <AfunBaseImage
          :url="item.img"
          class="w-[40px] h-[40px] shrink-0"
        />
        <AfunBaseInput
          v-model="paramsData[item.index as keyof typeof paramsData]"
          style="--afun-base-input-padding-y:9px;"
          :max="item.max" :label="item.label"
          :msg="inputErrorMsg[index]?.label"
          msg-after-touched
          @blur="checkFormat(index, item.index, paramsData[item.index as keyof typeof paramsData] as string)"
          @focus="onFocusInput(index)"
        />
      </div>
      <AfunBaseButton type="primary" :loading="loadingUpdate" :disabled="socialDisabledBtn" class="h-[42px] px-[26px] w-full" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500;--afun-base-button-padding-x: 26px" @click="socialSubmit">
        <span>{{ t('确认') }}</span>
      </AfunBaseButton>
    </div>
  </AppPageLayout>
</template>

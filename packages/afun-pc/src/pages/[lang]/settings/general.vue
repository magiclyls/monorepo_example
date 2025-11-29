<script lang="ts" setup>
import type { notifyType } from '~/composables/useNotify'

import { ApiMemberEmailCheck, ApiMemberExists, ApiMemberUpdate } from '@tg/apis'

interface INotifyData {
  type: notifyType
  title?: string
  message: string
}
interface ISocialData {
  [key: string]: boolean
}
// 输入框错误信息接口
interface Errors {
  // -1 为不通过，1为通过验证，0为中间状态
  [key: number]: { label: string, state: number }
}

const props = withDefaults(defineProps<{type: string}>(), {
  type: ''
})

const { t } = useI18n()
const route = useRoute()
const router = useLocalRouter()
const { openNotify } = useNotify()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
const { isOpenMobileVerify } = storeToRefs(useBrandStore())
const { isLessThanXs } = storeToRefs(useWindowStore())
usePageTitle({ prefix: t('set_general') })
const { bool: socialDisabledBtn, setTrue: setSocialDisabledBtnTrue, setFalse: setSocialDisabledBtnFalse } = useBoolean(true)
const { areaSearchValue, areaCodeOptionsFiltered, clearAreaSearchValue, areaCodeOptions } = useAreaCode()
const { countryCallingCode } = useIpApi()
const { bool: isUpdateing } = useBoolean(false)
const { openDialogUpdatePhone } = useDialogUpdatePhone({
  onCloseCallback: () => {
    isUpdateing.value = false
  },
})

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
    img: '/png/settings/social-facebook.png',
    index: 'facebook',
    max: 50,
  },
  {
    label: 'WhatsApp',
    img: '/png/settings/social-whatsapp.png',
    index: 'whatsapp',
    max: 19,
  },
  {
    label: 'Telegram',
    img: '/png/settings/social-telegram.png',
    index: 'telegram',
    max: 32,
  },
  { label: 'Line', img: '/png/settings/social-line.png', index: 'line', max: 50 },
  { label: 'X', img: '/png/settings/social-x.png', index: 'twitter', max: 15 },
  { label: 'Zalo', img: '/png/settings/social-zalo.png', index: 'zalo', max: 19 },
  { label: 'Viber', img: '/png/settings/social-viber.png', index: 'viber', max: 100 },
  { label: 'WeChat', img: '/png/settings/social-wechat.png', index: 'wechat', max: 20 },
  // { label: 'QQ', img: '/png/settings/social-qq.png', index: 'qq' },
]
const notifyData = ref<INotifyData>({
  type: 'success',
  title: '',
  message: t('success_edit'),
})
// 表单验证错误信息
const inputErrorMsg: Errors = reactive({})
const { run: runMemberUpdate } = useRequest(ApiMemberUpdate, {
  onSuccess() {
    openNotify(notifyData.value)
    appStore.updateUserInfo()
  },
})

/** 📱📱修改手机相关📱📱 */
const isPhoneVerified = computed(() => userInfo.value?.phone_check_state === 1)
const isSamePhoneNumber = computed(() => phone.value === userInfo.value?.phone.split('-')[1])
const phoneEditBtnText = computed(() => {
  if (userInfo.value?.phone) // && !isPhoneVerified.value && isSamePhoneNumber.value
    return isOpenMobileVerify.value ? t('menu_title_settings_verify') : t('save')

  return t('save')
})
/** 是否有手机号 */
const hasPhone = computed(() => !!userInfo.value?.phone)
/** 检测是否存在 */
const { runAsync: runExists, loading: existLoading } = useRequest(ApiMemberExists, {
  onSuccess(res) {
    // if (res.exist) {
    //   openNotify({
    //     type: 'error',
    //     message: t('phone_exists'),
    //   })
    // }
    // else {
    isUpdateing.value = true
    if (isOpenMobileVerify.value) {
      openDialogUpdatePhone({
        phone: phone.value,
        areaCode: area_code.value,
        uid: paramsData.value.uid,
      })
    }
    else {
      notifyData.value = { type: 'phone', title: t('success_update_phone'), message: t('phone_update_to', [`${area_code.value} ${phone.value}`]) }
      runMemberUpdate({
        record: {
          phone: `${area_code.value}-${phone.value}`,
        },
        uid: paramsData.value.uid,
      })
    }
    // }
  },
  onError: () => {
    openNotify({
      type: 'error',
      message: t('phone_exists'),
    })
  },
})
/** 手机错误信息 */
const phoneErrorMsg = ref('')
// computed(() => {
//   if (!phone.value)
//     return ''
//   return numberReg.test(phone.value) && phone.value.length > 5 && phone.value.length <= 18 ? '' : t('phone_invalid')
// })
/** 提交按钮禁用 */
const phoneSubmitDisabled = computed(() => {
  return !phone.value || !!phoneErrorMsg.value || existLoading.value
})
function validPhone() {
  let b = false
  const _phone = phone.value
  if (!phone.value)
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
    phoneErrorMsg.value = t('phone_invalid')
  else
    phoneErrorMsg.value = ''
  return b
}
// 提交
function updatePhone() {
  if (!isSamePhoneNumber.value) {
    runExists({ ty: 3, val: `${area_code.value}-${phone.value}`, noNotify: true })
  }
  else {
    const bool = validPhone()
    if (!bool)
      return

    isUpdateing.value = true
    if (isOpenMobileVerify.value) {
      openDialogUpdatePhone({
        phone: phone.value,
        areaCode: area_code.value,
        uid: paramsData.value.uid,
      })
    }
    else {
      notifyData.value = { type: 'phone', title: t('success_update_phone'), message: t('phone_update_to', [`${area_code.value} ${phone.value}`]) }
      runMemberUpdate({
        record: {
          phone: `${area_code.value}-${phone.value}`,
        },
        uid: paramsData.value.uid,
      })
    }
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
      notifyData.value = { type: 'success', message: t('success_msg') }
      setSocialDisabledBtnTrue()
    }
    else {
      notifyData.value = { type: 'error', message: t('fail_msg') }
      openNotify(notifyData.value)
    }
  })
}

function selectAreaCode(v: string) {
  area_code.value = v
}

/** 输入框验证格式方法 */
function checkFormat(index: number, label: string, val: string) {
  // 去除空格
  if (val.includes('\\'))
    return inputErrorMsg[index] = { label: t('format_error'), state: -1 }
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
      inputErrorMsg[index] = { label: t('min_word_length', ['10']), state: -1 }
    else if (!(resState) && val.length >= 10)
      inputErrorMsg[index] = { label: t('pure_numbers'), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // telegram
  if (socialData[index].index === 'telegram') {
    const regex = /^[a-z]\w{4,}$/i
    const resState = regex.test(val)
    if (!(resState) && !(/[a-z]/i.test(val[0])))
      inputErrorMsg[index] = { label: t('firstword_must_en'), state: -1 }
    else if (!(resState) && val.length < 5 && (/[a-z]/i.test(val[0])) && val.length !== 0)
      inputErrorMsg[index] = { label: t('min_word_length', ['5']), state: -1 }
    else if (!(resState) && val.length >= 5)
      inputErrorMsg[index] = { label: t('only_supports', ['"_"']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // line
  if (socialData[index].index === 'line') {
    const regex = /^[\w-]{2,50}$/
    const resState = regex.test(val)
    if (!resState && val.length < 2 && val.length !== 0)
      inputErrorMsg[index] = { label: t('min_word_length', ['2']), state: -1 }
    else if (!resState && val.length >= 2)
      inputErrorMsg[index] = { label: t('only_supports1', ['“-” ', '"_”']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // x
  if (socialData[index].index === 'twitter') {
    const regex = /^\w{4,15}$/
    const resState = regex.test(val)
    if (!resState && val.length < 4 && val.length !== 0)
      inputErrorMsg[index] = { label: t('min_word_length', ['4']), state: -1 }
    else if (!resState && val.length >= 4)
      inputErrorMsg[index] = { label: t('only_supports', ['"_"']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // viber
  if (socialData[index].index === 'viber') {
    const regex = /^[\w-]{6,100}$/
    const resState = regex.test(val)
    if (!resState && val.length < 6 && val.length !== 0)
      inputErrorMsg[index] = { label: t('min_word_length', ['6']), state: -1 }
    else if (!resState && val.length >= 6)
      inputErrorMsg[index] = { label: t('only_supports1', ['“-” ', '"_”']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
  // // wechat
  if (socialData[index].index === 'wechat') {
    const regex = /^[\w-]{6,20}$/
    const resState = regex.test(val)
    if (!resState && val.length < 6 && val.length !== 0)
      inputErrorMsg[index] = { label: t('min_word_length', ['6']), state: -1 }
    else if (!resState && val.length >= 6)
      inputErrorMsg[index] = { label: t('only_supports1', ['“-” ', '"_”']), state: -1 }
    else
      inputErrorMsg[index] = { label: '', state: 1 }
  }
}
// 选中时，改变错误状态
function onFocusInput(index: number) {
  inputErrorMsg[index] = { label: '', state: 1 }
}

// 区号接口数据有可能没有+号
function areaPlus(v?: string) {
  if (v && v.length)
    return v.includes('+') ? v : `+${v}`
}

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
watch(() => userInfo.value, (newValue) => {
  if (newValue && !isUpdateing.value) {
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
})
watch(() => route.query, (newValue) => {
  if (JSON.stringify(newValue) !== '{}'
    && newValue.email
    && newValue.uid && newValue.captcha) {
    const { run } = useRequest(ApiMemberEmailCheck, {
      async onSuccess() {
        openNotify({ type: 'email', title: t('success_verify'), message: t('congratulate_email_success') })
        await appStore.updateUserInfo()
      },
    })
    if (
      typeof newValue.email === 'string'
      && typeof newValue.uid === 'string'
      && typeof newValue.captcha === 'string') {
      run({
        email: newValue.email,
        uid: newValue.uid,
        captcha: newValue.captcha,
      })
    }
  }
}, { immediate: true })
watch(countryCallingCode, (a) => {
  area_code.value = a
}, { immediate: true })

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
  <div v-if="paramsData" class="tg-settings-general">
    <AppEmailVerify v-if="!props.type || props.type === 'email'"/>
    <AppSettingsContentItem
      v-if="!props.type || props.type === 'phone'"
      :title="t('phone')"
      :verified="phoneSubmitDisabled"
      :btn-text="phoneEditBtnText"
      :badge="isPhoneVerified"
      :show-submit-btn="!isPhoneVerified"
      @submit="updatePhone"
    >
      <template #top-desc>
        {{ t('tip_phone') }}
      </template>
      <BaseLabel class="area-code-lable" :label="t('intl_phone_pre')" must-small>
        <BaseInput v-if="isPhoneVerified" v-model="areaCodeLabel" readonly />
        <BaseSelect
          v-else ref="areaCodeRef" v-model="area_code" :placeholder="t('intl_phone_pre')" show-placeholder small
          :disabled="hasPhone" :options="areaCodeOptionsFiltered" popper :is-label-border="true"
        />
        <!-- <BaseSelect
            v-else ref="areaCodeRef" v-model="area_code" popper
            :disabled="isPhoneVerified" :options="areaCodeOptionsFiltered || []"
            style="--tg-base-select-style-padding-x: var(--tg-spacing-6);
          --tg-base-select-style-padding-y: var(--tg-spacing-7);
          --tg-base-select-style-color: var(--tg-text-white)"
            @popper-hide="clearAreaSearchValue"
          >
            <template #popper="{ hide }">
              <div class="scroll-y flex flex-col px-[6px] py-[10px]" :style="{ maxWidth: `169px` }">
                <BaseSearch
                  v-model="areaSearchValue" style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:0px;"
                  class="h-[32px]" :place-holder="t('search')" white-style shape="square"
                />
                <a
                  v-for="type, i in areaCodeOptionsFiltered" :key="i"
                  class="text-tg-secondary-deepdark block h-[32px] cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-semibold leading-[32px]"
                  @click="hide(); selectAreaCode(type.value);clearAreaSearchValue()"
                >
                  {{ type.value }}
                </a>
              </div>
            </template>
          </BaseSelect> -->
      </BaseLabel>
      <BaseLabel :label="t('phone')" must-small>
        <BaseInput
          v-model="phone" :readonly="isPhoneVerified"
          max="11"
          style="--tg-base-input-style-pad-x: var(--tg-spacing-6);"
          :placeholder="t('phone')"
          inputmode="decimal" :hide-spin-btn="true" :msg="phoneErrorMsg"
          @blur="validPhone"
        />
      </BaseLabel>
    </AppSettingsContentItem>
    <AppSettingsContentItem
      v-if="!props.type || props.type === 'social'"
      :title="t('social_account')"
      :verified="socialDisabledBtn"
      last-one
      style="--tg-app-settings-content-item-style-max-width: 100%;"
      @submit="socialSubmit"
    >
      <div class="social-wrap" :class="{ 'is-less-than-xs': isLessThanXs }">
        <div
          v-for="item, index in socialData"
          :key="index"
          class="social-item"
        >
          <BaseImage
            :url="item.img"
            width="50px"
            height="50px"
            class="general-base-image"
          />
          <BaseInput
            v-model="paramsData[item.index as keyof typeof paramsData]"
            class="social-input"
            :max="item.max" :label="item.label"
            :msg="inputErrorMsg[index]?.label"
            msg-after-touched
            :class="{ thLineHight: userLanguage === 'th-TH' }"
            @blur="checkFormat(index, item.index, paramsData[item.index as keyof typeof paramsData] as string)"
            @focus="onFocusInput(index)"
          />
        </div>
      </div>
    </AppSettingsContentItem>
  </div>
</template>

<style lang="scss" scoped>
.tg-settings-general {
  .thLineHight {
    --tg-base-input-line-height: 2;
  }
  .general-base-image {
    width: 50px;
    height: 50px;
    --tg-base-img-style-radius: var(--tg-radius-md);
  }
  .social-wrap {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 1.25rem;
    .social-item {
      font-size: 50px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    &.is-less-than-xs {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  .area-code-lable {
    --tg-base-select-popper-bg-color: var(--tg-secondary-dark);
    --tg-base-select-popper-label-hover-bg-color: var(--tg-secondary-dark);
    --tg-base-select-popper-style-padding-y: 10px 10px;
    --tg-base-select-popper-style-padding-x: 10px 6px;
    @include webTheme('green') {
      --tg-base-select-popper-bg-color: #02432d;
      --tg-base-select-popper-label-hover-bg-color: #02432d;
    }
    @include webTheme('white') {
      --tg-base-select-bg: var(--tg-base-button-grey-style-bg);
      --tg-base-select-border: none;
      --tg-base-select-box-shadow: none;
      --tg-base-select-popper-bg-color: #f5f5f5;
      --tg-base-select-popper-label-hover-bg-color: #f5f5f5;
    }
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

.base-select {
  @include webTheme('green') {
    --tg-base-select-select-warp-background-color: #02432d;
  }
  @include webTheme('white') {
    --tg-base-input-style-background-color: #f5f5f5;
  }
}
.social-input {
  @include webTheme('green') {
    --tg-base-input-style-text-color: #76f0c5;
  }
  @include webTheme('white') {
    --tg-base-input-style-background-color: #f5f5f5;
  }
}
</style>

<route lang="yaml">
</route>

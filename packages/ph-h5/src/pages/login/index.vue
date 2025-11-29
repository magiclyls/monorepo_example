<script lang="ts" setup name="Login">
import { ApiMemberLogin } from '@tg/apis'
import { BaseForm, PhBaseButton, PhBaseDialog, PhBaseImage, PhBaseInput, PhBaseOriginSelect } from '@tg/bccomponents'
import { sendMsgToAdjust, useAliCaptcha, useAreaCode, useIpApi } from '@tg/hooks'
import { IconLoginClose } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import { application, brazilPhoneReg, chinaPhoneReg, emailReg, getEnv, Local, numberReg, philippinePhoneReg, sendMsgToFlutterThirdPartyApp, STORAGE_LOGIN_MQTT_ID, STORAGE_PROMO_AD_POP_LOGIN, usernameReg } from '@tg/utils'
import { watchOnce } from '@vueuse/core'
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import * as Yup from 'yup'
import { useWindowHeightRem } from '~/hooks'
import { Message } from '~/utils'
import AppForGetPsd from '../../components/AppForGetPsd.vue'
import AppResolveLocked from '../../components/AppResolveLocked.vue'
import AppThirdLogin from '../../components/AppThirdLogin.vue'

const { t: $t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const { countryCallingCode } = useIpApi()
// const { brandReg, isLoginPWAOpen } = storeToRefs(useBrandStore())
const { areaCodeOptionsFiltered } = useAreaCode()

const isPhoOrEma = ref<'p' | 'e'>('e')
const userOrEmail = ref('')
const phone = ref('')
const password = ref('')
const isShowResolve = ref(false)
const isShowForget = ref(false)
const resolveType = ref<'self' | 'long'>('self')
const getAccount = ref('')
const areaCode = ref(countryCallingCode.value)
const { VITE_OFFICIAL_NAME } = getEnv()
const { heightRem } = useWindowHeightRem()

const { run: runMemberLogin, loading: isLoading } = useRequest(
  async data =>
    ApiMemberLogin({
      ...data,
      device_number: await application.getDeviceNumber(),
    }),
  {
    manual: true,
    onSuccess: async (res: string) => {
      console.log('res', res)
      Local.set(STORAGE_LOGIN_MQTT_ID, Math.floor(Math.random() * 100))
      Local.remove(STORAGE_PROMO_AD_POP_LOGIN)

      await nextTick()
      appStore.setToken(res)
      router.push('/')
      Message.success($t('登录成功'))
      sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.LOGIN)
      sendMsgToAdjust(SendFlutterThirdPartyAppMessage.LOGIN)
    },
    onError: (err) => {
      const { data, tip } = JSON.parse(err.message)
      if (data.includes('member-verify')) {
        getAccount.value = tip
        goResolve('long')
        Message.error($t('您的账号已锁定'))
      }
      // 自我排除
      else if (data.includes('self_exclusion')) {
        const time = data.split('|')[1]
        Message.error($t('您的账号将解除自我排除', { time }))
      }
    },
  },
)
const { captchaButtonId, captchaEleId, showCaptcha } = useAliCaptcha({
  success: (validate) => {
    let num = ''
    if (isPhoOrEma.value === 'p') {
      num = dealNumber(phone.value)
    }
    else {
      num = userOrEmail.value
    }
    console.log('🚸🚸🚸 ~ runMemberLogin--登录参数:', {
      username: num,
      password: password.value,
      validate,
    })

    runMemberLogin({
      username: num,
      password: password.value,
      validate,
    })
  },
})
const schema = Yup.object().shape({
  userOrEmail: Yup.string(),
  phone: Yup.string(),
  password: Yup.string(),
})
const getUsername = computed(() => resolveType.value === 'self' ? undefined : userOrEmail.value)
const getPassword = computed(() => resolveType.value === 'self' ? undefined : password.value)
const isDisableLogin = computed(() => {
  if (isPhoOrEma.value === 'e' && !userOrEmail.value)
    return true
  if (isPhoOrEma.value === 'p' && !phone.value)
    return true
  return false
})
function validEmail(value: string) {
  if (value.length < 3)
    return $t('最小字符长度为 {delta}', { delta: 3 })
  else if (value.length > 30)
    return $t('最大字符长度为 {delta}', { delta: 30 })
  else if (value.match('[^@.a-zA-Z0-9_]'))
    return $t('用户名含有无效的字符')
  else if (!emailReg.test(value) && !usernameReg.test(value))
    return $t('请输入正确的电邮地址或 3 - 30 个大小写英文和数字组成的用户名')
  return ''
}
function validPhoneVal(value: string) {
  let result
  if (areaCode.value === '+63') {
    result
        = philippinePhoneReg.test(`+63${value}`) && value.length > 5 && value.length <= 18
        ? ''
        : $t('手机号码无效')
  }
  else if (areaCode.value === '+86') {
    result
        = chinaPhoneReg.test(`${value}`) && value.length > 5 && value.length <= 18
        ? ''
        : $t('手机号码无效')
  }
  else if (areaCode.value === '+55') {
    result
        = brazilPhoneReg.test(`+55${value}`) && value.length > 5 && value.length <= 18
        ? ''
        : $t('手机号码无效')
  }
  else {
    result
        = numberReg.test(value) && value.length > 5 && value.length <= 18 ? '' : $t('手机号码无效')
  }
  return result
}

function onValidNum() {
  let res = ''
  if (isPhoOrEma.value === 'p') {
    res = validPhoneVal(phone.value)
  }
  else {
    res = validEmail(userOrEmail.value)
  }
  if (res) {
    return res
  }
}
function onValidPsd() {
  if (!password.value || password.value.length < 8)
    return $t('最小字符长度为 {delta}', { delta: 8 })
  return ''
}
function dealNumber(v: string) {
  return isPhoOrEma.value === 'e' ? v : `${areaCode.value}-${v}`
}

function onSubmit() {
  const userVal = onValidNum()
  const psdVal = onValidPsd()
  if (userVal || psdVal) {
    Message.error(userVal || psdVal as string)
    return
  }
  showCaptcha()
}
function onInvalidSubmit(err: any) {
  console.log(err, 'err')
}
function onReturn() {
  router.push('/')
}
function changeLogin() {
  if (isPhoOrEma.value === 'e') {
    isPhoOrEma.value = 'p'
  }
  else {
    isPhoOrEma.value = 'e'
  }
}

function goRegister() {
  router.push('/register')
}

function goResolve(type: 'self' | 'long') {
  if (type === 'self')
    getAccount.value = ''
  resolveType.value = type
  nextTick(() => {
    isShowResolve.value = true
  })
}

watchOnce(countryCallingCode, () => {
  areaCode.value = countryCallingCode.value
})
</script>

<template>
  <div class="ph-login bg-[#fff]" :style="{ height: `${heightRem}rem` }">
    <div class="relative w-full">
      <PhBaseImage url="/ph-h5/png/login-head.png" alt="" class="w-full h-[261rem]" height="245" />
      <div class="absolute top-0 w-full p-[22rem] flex">
        <PhBaseButton
          class="bg-[#000000] ml-auto !size-[20rem] z-30"
          style="--ph-base-button-border-radius: 100rem"
          type="none"
          @click="onReturn"
        >
          <IconLoginClose class="text-[20rem] shrink-0 text-white" />
        </PhBaseButton>
      </div>

      <div class="px-[21rem] bg-transparent pb-[30rem] relative w-full -mt-[70rem]">
        <h3 class="text-[#0D2245] text-[18rem] leading-[25rem] font-semibold mb-[30rem] text-center">
          {{ $t('登录') }}
        </h3>
        <div class="flex justify-between w-full">
          <span class="text-base font-extrabold text-white">{{ $t('登录') }}</span>
        </div>
        <BaseForm :schema="schema" autocomplete="off" @submit="onSubmit" @invalid-submit="onInvalidSubmit">
          <PhBaseInput
            v-if="isPhoOrEma === 'e'"
            v-model="userOrEmail"
            name="userOrEmail"
            class="mb-[14rem]"
            :placeholder="$t('请输入账号')"
          />
          <PhBaseInput
            v-else
            v-model="phone"
            name="phone"
            class="mb-[14rem]"
            type="number"
            inputmode="number"
            :placeholder="$t('请填写手机号码')"
          >
            <template #left>
              <div class="center h-full flex text-[#9DABC9]">
                <PhBaseImage v-if="areaCode && areaCode.length" class="w-[16rem]" :url="`/flag/${areaCode.slice(1)}.webp`" />
                <PhBaseOriginSelect v-model="areaCode" :options="areaCodeOptionsFiltered" />
              </div>
            </template>
          </PhBaseInput>
          <PhBaseInput
            v-model="password"
            name="password"
            type="password"
            :placeholder="$t('请输入登入密码')"
          />
          <div class="w-full flex justify-between mt-[14rem] font-medium">
            <span type="none" class="text-[14rem] cursor-pointer text-[#6D7693] leading-[24rem]" @click="changeLogin">
              {{ isPhoOrEma === 'e' ? $t('手机登入') : $t('账号/邮箱登入') }}
            </span>
            <span class="text-[#6D7693] cursor-pointer text-[14rem] leading-[24rem]" @click="isShowForget = true">
              {{ $t('忘记密码') }}？
            </span>
          </div>
          <PhBaseButton html-type="submit" :loading="isLoading" type="primary" :disabled="isDisableLogin" class="w-full my-[14rem]" style="--ph-base-button-width: 100%">
            {{ $t('登录') }}
          </PhBaseButton>
        </BaseForm>
        <div class="flex text-[14rem] font-medium">
          <span class="text-[#6D7693] leading-[24rem]">{{ $t('新用户') }}？</span>
          <span class="text-[#F23038]  cursor-pointer leading-[24rem]" @click="goRegister">
            {{
              $t('创建账号')
            }}
          </span>
          <span class="ml-auto text-[#6D7693] cursor-pointer leading-[24rem]" @click="goResolve('self')">
            {{ $t('解除锁定') }}
          </span>
        </div>
        <div class="px-[30.89rem] pb-[24rem] pt-0 mt-[14rem]">
          <AppThirdLogin />
        </div>
        <div class="center text-[14rem] mb-[24rem] leading-[24rem] font-[500]" @click="router.push('/service')">
          <span class="text-[#6D7693] mr-[5rem]">{{ $t('需要帮助') }}</span><span class="text-[#F23038] cursor-pointer">{{ $t('联系客服') }}</span>
        </div>
        <div class="text-center text-[#6D7693] leading-[18.5rem] text-[12rem] font-[500]">
          Copyright © 2025 {{ VITE_OFFICIAL_NAME }} ALL RIGHTS RESERVED
        </div>
        <div>
          <div :id="captchaEleId" />
          <div :id="captchaButtonId" />
          <PhBaseDialog v-model="isShowResolve" :show-header="false">
            <AppResolveLocked v-if="isShowResolve" :open-page="resolveType" :get-account="getAccount" :is-show="isShowResolve" :get-password="getPassword" :get-username="getUsername" @close="isShowResolve = false" />
          </PhBaseDialog>
          <PhBaseDialog v-model="isShowForget" :show-header="false">
            <AppForGetPsd v-if="isShowForget" :open-page="resolveType" @close="isShowForget = false" />
          </PhBaseDialog>
        </div>
      </div>
    </div>
  </div>
</template>

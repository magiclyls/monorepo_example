<script lang="ts" setup>
import { ApiMemberAuthClose, ApiMemberAuthConfig, ApiMemberAuthQrcode, ApiMemberAuthSet } from '@tg/apis'
import { AfunBaseButton, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { IconUniCopy } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { lastOneNumberReg, upperLowerReg } from '@tg/utils'
import { useClipboard } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import QrcodeVue from 'qrcode.vue'
import { useField } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { Message } from '~/utils'

interface Props {
  isComponent?: boolean
}
defineOptions({ name: 'AppDoubleVerify' })
const props = withDefaults(defineProps<Props>(), {
  isComponent: false,
})
const { t } = useI18n()
const codeRef = ref()
const pwdRef = ref()
const { isLogin } = storeToRefs(useAppStore())
const { text, copy, copied, isSupported } = useClipboard()
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
    return t('请输入双重验证密码')
  return ''
})

const {
  loading: loadingAuthConfig,
  data: authConfig,
  runAsync: runMemberAuthConfig,
} = useRequest(ApiMemberAuthConfig, {
  ready: isLogin,
  manual: false,
  throttleInterval: 500,
})

const isSetAuth = computed(() => {
  return authConfig.value?.is_secret === '1'
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
    Message.success(t('设置双重验证密码成功'))
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
    Message.success(t('关闭双重验证密码成功'))
    resetLoginPassword()
    resetDoublePassword()
  },
})

function fieldVerifyLoginPwd(value: string) {
  if (!value)
    return t('请输入密码')
  else if (value.length < 8)
    return t('八位密码')
  else if (!upperLowerReg.test(value))
    return t('包含大小写')
  else if (!lastOneNumberReg.test(value))
    return t('至少一个数字')
  return ''
}
async function submitDoublePassword() {
  pwdRef.value.setTouchTrue()
  codeRef.value.setTouchTrue()
  await validateLoginPwd()
  await validateDoublePwd()
  if (!loginPwdErrorMsg.value && !doublePwdErrorMsg.value) {
    const data = { password: loginPassword.value, auth_code: doublePassword.value }
    isSetAuth.value ? runMemberAuthClose(data) : runMemberAuthSet(data)
  }
}

function copyText() {
  copy(authQrcode.value?.secret || '').then(() => {
    Message.success(t('成功复制'))
  })
}

watch(() => isSetAuth.value, (val) => {
  if (!val)
    runMemberAuthQrcode()
}, { immediate: true })

onMounted(() => runMemberAuthConfig())
</script>

<template>
  <div class=" rounded-[4px] p-[12px] border solid border-[#2F4553]">
    <div class="text-[#fff] text-[18px] font-[600] mb-[8px]">
      {{ t('双重验证') }}
    </div>
    <div class="text-[#B1BAD3] text-[14px] font-[600] mb-[16px]">
      {{ t('启用双重验证以让您的账户更加安全') }}
    </div>
    <div class="text-[#B1BAD3] text-[14px] font-[600] mb-[5px]">
      {{ t('复制验证代码') }}
    </div>
    <div v-show="!isSetAuth">
      <div class="text-[#fff] h-[62px] text-[14px] font-[600] bg-[#2F4553] rounded-[6px] p-[10px] flex justify-between items-center mb-[16px] shadow-[0_1px_3px_0_rgba(0,0,0,0.20)]" @click="copyText()">
        <span class="max-w-[270px] break-words">{{ authQrcode?.secret }}</span>
        <IconUniCopy class="text-[18px]" :style="{ color: '#B1BAD3' }" />
      </div>
      <div class="text-[#B1BAD3] text-[14px] font-[600] mb-[12px]">
        {{ t('防止他人看到此页') }}
      </div>
      <div class="w-[144px] h-[144px] rounded-[4px] mb-[16px] bg-white flex justify-center items-center">
        <QrcodeVue
          :size="144"
          :value="authQrcode?.qrcode"
          bg-color="#9DABC9"
        />
      </div>
    </div>
    <AfunBaseLabel :label="t('登录密码')" required class="mb-[16px]">
      <AfunBaseInput
        ref="pwdRef"
        v-model="loginPassword"
        name="password"
        type="password"
        msg-after-touched
        :msg="loginPwdErrorMsg"
        required
        inputmode="number"
        :placeholder="$t('登录密码')"
      />
    </AfunBaseLabel>
    <AfunBaseLabel :label="t('双重验证码')" required class="mb-[16px]">
      <AfunBaseInput
        ref="codeRef"
        v-model="doublePassword"
        name="code"
        type="text"
        msg-after-touched
        :msg="doublePwdErrorMsg"
        required
        inputmode="number"
        :placeholder="$t('双重验证码')"
      />
    </AfunBaseLabel>
    <div class="flex justify-end">
      <AfunBaseButton type="primary" :loading="loadMemberAuthSet || loadMemberAuthClose" class="h-[42px] w-full" :class="[isComponent && 'w-auto!']" style="--afun-base-button-font-size: 14px; --afun-base-button-font-weight: 500; " :style="[isComponent && '--afun-base-button-padding-x: 26px']" @click="submitDoublePassword">
        <span>{{ t('确认') }}</span>
      </AfunBaseButton>
    </div>
  </div>
</template>

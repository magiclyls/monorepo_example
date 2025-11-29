<script lang="ts" setup>
import { ApiMemberAuthClose, ApiMemberAuthConfig, ApiMemberAuthQrcode, ApiMemberAuthSet } from '@tg/apis'
import { PhBaseButton, PhBaseInput, PhBaseLabel } from '@tg/bccomponents'
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
  <div class="bg-[#fff] rounded-[8rem] p-[12rem]">
    <div class="text-[#0D2245] text-[18rem] font-[600] mb-[8rem]">
      {{ isSetAuth ? t('关闭双重验证') : t('双重验证') }}
    </div>
    <div class="text-[#6D7693] text-[14rem] font-[500] mb-[16rem]">
      {{ t('启用双重验证以让您的账户更加安全') }}
    </div>
    <div v-if="!isSetAuth" class="text-[#6D7693] text-[14rem] font-[500] mb-[5rem]">
      {{ t('复制验证代码') }}
    </div>
    <div v-show="!isSetAuth">
      <div class="text-[#0D2245] text-[14rem] font-[500] bg-[#F6F7F8] rounded-[6rem] p-[10rem] flex justify-between items-center mb-[16rem]" @click="copyText()">
        <span class="max-w-[270rem] break-words">{{ authQrcode?.secret }}</span>
        <IconUniCopy class="text-[18rem]" :style="{ color: '#9DABC8' }" />
      </div>
      <div class="text-[#6D7693] text-[14rem] font-[500] mb-[12rem]">
        {{ t('防止他人看到此页') }}
      </div>
      <div class="w-[120rem] h-[120rem] rounded-[4rem] mb-[16rem]">
        <QrcodeVue
          :size="120"
          :value="authQrcode?.qrcode"
          bg-color="#9DABC9"
        />
      </div>
    </div>
    <PhBaseLabel :label="t('登录密码')" required class="mb-[16rem]">
      <PhBaseInput
        ref="pwdRef"
        v-model="loginPassword"
        name="password"
        type="password"
        msg-after-touched
        :msg="loginPwdErrorMsg"
        required
        inputmode="number"
        :placeholder="$t('登录密码')"
        style="--ph-base-input-padding-y: 9rem;"
      />
    </PhBaseLabel>
    <PhBaseLabel :label="t('双重验证码')" required class="mb-[16rem]">
      <PhBaseInput
        ref="codeRef"
        v-model="doublePassword"
        name="code"
        type="text"
        msg-after-touched
        :msg="doublePwdErrorMsg"
        required
        inputmode="number"
        :placeholder="$t('双重验证码')"
        style="--ph-base-input-padding-y: 9rem;"
      />
    </PhBaseLabel>
    <div class="flex justify-end">
      <PhBaseButton type="primary" :loading="loadMemberAuthSet || loadMemberAuthClose" class="h-[46rem] w-full" :class="[isComponent && 'w-auto!']" style="--ph-base-button-font-size: 14rem; --ph-base-button-font-weight: 500; --ph-base-button-border-color: #EBEBEB;--ph-base-button-secondary-background-color:#fff" :style="[isComponent && '--ph-base-button-padding-x: 26rem']" @click="submitDoublePassword">
        <span>{{ t('保存') }}</span>
      </PhBaseButton>
    </div>
  </div>
</template>

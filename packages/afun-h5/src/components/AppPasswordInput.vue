<script setup lang='ts'>
import { AfunBaseInput, AfunBaseLabel, AfunBaseSelect } from '@tg/bccomponents'

import { useAppStore, useBrandStore } from '@tg/stores'
import { payPasswordReg } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: string
  modelType?: string
  errPayPwd?: string
  placeholder?: string
}
defineOptions({
  name: 'AppPasswordInput',
})
withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  errPayPwd: '',
})

const emit = defineEmits(['update:modelValue', 'update:modelType'])
const { t } = useI18n()
const {
  isOpenVerify,
  isOpenPayPwd,
  brandBase,
} = storeToRefs(useBrandStore())

const {
  isSetPayPwd,
  isSetAuth,
} = storeToRefs(useAppStore())

const pwdOptions = computed(() => {
  const check = brandBase.value?.verify
  const code = { label: t('双重验证码'), value: '1', wrongFormat: t('双重验证码格式错误') }
  const pwd = { label: t('资金密码'), value: '2', wrongFormat: t('资金密码格式错误') }
  const teg = []
  if (check?.all === true) {
    isSetPayPwd.value && teg.push(pwd)
    isSetAuth.value && teg.push(code)
    return teg
  }
  else if (isOpenVerify.value) {
    teg.push(code)
  }
  else if (isOpenPayPwd.value) {
    teg.push(pwd)
  }
  return teg
})

const passwordRef = ref()
const pwdType = ref('')

const pwdItem = computed(() => {
  return pwdOptions.value.find(t => t.value === pwdType.value)
})

const pwdLabel = computed(() => {
  return pwdItem.value?.label
})

const {
  value: password,
  resetField: resetPassword,
  validate: validatePassword,
  errorMessage: errPassword,
} = useField<string>('password', (value) => {
  if (!value)
    return t('最小字符长度为 {delta}', { delta: 6 })
  else if (!payPasswordReg.test(value))
    return pwdItem.value?.wrongFormat // `${pwdLabel.value}${t('wrong_format')}`
  return ''
})

const getTouchTrue = computed(() => {
  return passwordRef.value.setTouchTrue
})

// 密码类型切换
function selectTypeChange(item: string) {
  pwdType.value = item
  if (password.value) {
    resetPassword()
    emit('update:modelValue', '')
  }
  emit('update:modelType', item)
}
function passwordChange(e: any) {
  emit('update:modelValue', e.target?.value)
}

watch(() => pwdOptions.value, () => {
  pwdType.value = pwdOptions.value?.length === 2 ? '2' : pwdOptions.value[0]?.value.toString()
  emit('update:modelType', pwdType.value)
}, { immediate: true })

defineExpose({ resetPassword, validatePassword, errPassword, setTouchTrue: getTouchTrue, authType: pwdType })
</script>

<template>
  <div class="password-box">
    <AfunBaseLabel :label="pwdLabel" required>
      <AfunBaseInput
        ref="passwordRef"
        v-model="password"
        input-mode="numeric"
        :msg="errPassword ?? (password && errPayPwd ? ((pwdItem?.wrongFormat) || (pwdLabel + errPayPwd)) : errPayPwd)"
        :placeholder="placeholder || pwdLabel"
        type="password"
        :max="6"
        must
        :msg-after-touched="!errPayPwd"
        class="deposit-input"
        @change="passwordChange"
      >
        <template #right>
          <div class="bg-[#2F4553] h-[41px] center whitespace-nowrap rounded-r-[2px]">
            <div v-if="pwdOptions.length < 2" class="px-[12px]">
              {{ pwdLabel }}
            </div>
            <AfunBaseSelect
              v-else :model-value="pwdType" :options="pwdOptions"
              @change="selectTypeChange"
            >
              <template #label="{ data }">
                <div class="h-[40px] flex items-center pl-[5px] pr-[24px]">
                  {{ data?.label ?? '' }}
                </div>
              </template>
              <template #option="{ item }">
                <div class="center" :style="{ color: item.value === pwdType ? '#F23038' : '#0D2245' }">
                  {{ item.label }}
                </div>
              </template>
            </AfunBaseSelect>
          </div>
        </template>
      </AfunBaseInput>
    </AfunBaseLabel>
  </div>
</template>

<style lang='scss' scoped>
.deposit-input {
  --afun-base-input-padding-left: 10px;
  --afun-base-input-padding-right: 0;
  --afun-base-input-padding-y: 9px;
}
</style>

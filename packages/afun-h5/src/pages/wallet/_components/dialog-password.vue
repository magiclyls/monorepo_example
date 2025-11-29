<script setup lang="ts">
import type { ISelectOption } from '@tg/types'
import { AfunBaseButton, AfunBaseDialog, AfunBaseInputPassword, AfunBaseSelect } from '@tg/bccomponents'
import { IconUniLock } from '@tg/icons'
import { useAppStore, useBrandStore } from '@tg/stores'
import { payPasswordReg } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
  callBack: (data: {
    auth_type: number
    password: string
  }) => any
}
interface IPwdOptions extends ISelectOption {
  wrongFormat: string
}
defineOptions({
  name: 'AppDialogPassword',
})
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()
const {
  isOpenVerify,
  isOpenPayPwd,
  brandBase,
} = storeToRefs(useBrandStore())
const { isSetPayPwd, isSetAuth } = storeToRefs(useAppStore())

const passwordRef = ref()
const pwdType = ref('')

const computedValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})
const pwdOptions = computed(() => {
  const check = brandBase.value?.verify
  const code = { label: t('双重验证码'), value: '1', wrongFormat: t('双重验证码格式错误') }
  const pwd = { label: t('资金密码'), value: '2', wrongFormat: t('资金密码格式错误') }
  const teg: IPwdOptions[] = []
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

const pwdItem = computed(() => {
  return pwdOptions.value.find(t => t.value === pwdType.value)
})
const pwdLabel = computed(() => {
  return pwdOptions.value.find(t => t.value === pwdType.value)?.label
})

const {
  value: password,
  validate: validatePassword,
  errorMessage: errPassword,
} = useField<string>('password', (value) => {
  if (!value)
    return t('最小字符长度为 {delta}', { delta: 6 })
  else if (!payPasswordReg.test(value))
    return pwdItem.value?.wrongFormat ?? '' // `${pwdLabel.value}${t('wrong_format')}`
  return ''
})

async function onConfirmClick() {
  passwordRef.value?.setTouchTrue()
  await validatePassword()
  if (errPassword.value)
    return

  emit('update:modelValue', false)
  nextTick(() => {
    props.callBack({
      auth_type: +pwdType.value,
      password: password.value,
    })
  })
}

onMounted(() => {
  setTimeout(() => {
    passwordRef.value?.setFocus()
  }, 500)
})

watch(() => pwdOptions.value, () => {
  pwdType.value = pwdOptions.value?.length === 2 ? '2' : pwdOptions.value[0]?.value.toString()
}, { immediate: true })
</script>

<template>
  <AfunBaseDialog v-model="computedValue">
    <template #header>
      <div class="flex items-center gap-[4px]">
        <div class="flex items-center text-[16px]">
          <IconUniLock class="text-[#B1BAD3]" />
        </div>
        <div v-if="pwdOptions.length === 1" class="text-[18px] font-[600] leading-[25px]">
          {{ pwdLabel }}
        </div>
        <AfunBaseSelect
          v-else v-model="pwdType" :options="pwdOptions"
          active-background-color="transparent"
          active-color="#00AD01"
        >
          <template #label="{ data }">
            <div class="text-[18px] font-[600] leading-[25px] pr-[24px] text-[#fff]">
              {{ data?.label }}
            </div>
          </template>
        </AfunBaseSelect>
      </div>
    </template>
    <div class="flex flex-col gap-[16px] p-[16px]">
      <AfunBaseInputPassword ref="passwordRef" v-model="password" :msg="errPassword" msg-after-touched />
      <AfunBaseButton @click="onConfirmClick">
        {{ t('确认提款') }}
      </AfunBaseButton>
    </div>
  </AfunBaseDialog>
</template>

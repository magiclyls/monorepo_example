<script setup lang='ts'>
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
  isOpenVerify, isOpenPayPwd, brandBase,
} = storeToRefs(useBrandStore())
const { appContentWidth } = storeToRefs(useWindowStore())

const { isSetPayPwd, isSetAuth } = useAuthConfig()

const pwdOptions = computed(() => {
  const check = brandBase.value?.verify
  const code = { label: t('double_check_code'), value: '1', wrongFormat: t('db_code_wrong_format') }
  const pwd = { label: t('menu_title_settings_update_safepwd'), value: '2', wrongFormat: t('paypwd_wrong_format') }
  const teg: ISelectOption[] = []
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

const pwdLabel = computed(() => {
  return pwdOptions.value.find(t => t.value === pwdType.value)?.label
})
const pwdItem = computed(() => {
  return pwdOptions.value.find(t => t.value === pwdType.value)
})

const {
  value: password,
  resetField: resetPassword,
  validate: validatePassword,
  errorMessage: errPassword,
} = useField<string>('password', (value) => {
  if (!value)
    return t('min_len_6')
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
function passwordChange(val: string) {
  emit('update:modelValue', val)
}

watch(() => pwdOptions.value, () => {
  pwdType.value = pwdOptions.value?.length === 2 ? '2' : pwdOptions.value[0]?.value.toString()
  emit('update:modelType', pwdType.value)
}, { immediate: true })

defineExpose({ resetPassword, validatePassword, errPassword, setTouchTrue: getTouchTrue, authType: pwdType })
</script>

<template>
  <div class="password-box">
    <BaseLabel :label="pwdLabel" must-small>
      <BaseInput
        ref="passwordRef" v-model="password" input-mode="numeric"
        :msg="errPassword ?? (password && errPayPwd ? ((pwdItem?.wrongFormat) || (pwdLabel + errPayPwd)) : errPayPwd)"
        :placeholder="placeholder || pwdLabel" type="password" max="6" must :msg-after-touched="!errPayPwd" @input="passwordChange"
      >
        <template #right>
          <div class="right-btn h-full flex items-center">
            <div v-if="pwdOptions.length < 2" class="px-[12px] font-semibold" :class="appContentWidth < 350 ? 'min-w-[84px] whitespace-normal' : 'whitespace-nowrap'">
              {{ pwdLabel }}
            </div>
            <BaseSelect
              v-else :model-value="pwdType" popper plain-popper-label :options="pwdOptions"
              @select="selectTypeChange"
            >
              <template #label="{ data }">
                <div :class="appContentWidth < 350 ? 'min-w-[60px] whitespace-normal' : 'whitespace-nowrap'" class="h-[41px] flex items-center font-semibold">
                  {{ data?.label ?? '' }}
                </div>
              </template>
              <template #option="{ data: { item } }">
                <div class="center font-semibold">
                  {{ item.label }}
                </div>
              </template>
            </BaseSelect>
          </div>
        </template>
      </BaseInput>
    </BaseLabel>
  </div>
</template>

<style lang='scss' scoped>
.password-box {
  --tg-app-select-currency-bg: none;
  --tg-base-input-right-button-padding: 0 0;
  --tg-base-select-hover-bg-color: none;
  --tg-base-select-popper-style-padding-y: 0;
  --tg-base-select-popper-style-padding-x: 12px;
  @include webTheme('green'){
    --tg-secondary-light: var(--tg-text-white);
    --tg-secondary-main: #197B59;
    --tg-base-input-style-border: 2px solid #197B59;
    // --tg-border-color-deep-grey: var(--tg-text-green-main);
  }
}
.right-btn{
  background-color: var(--tg-secondary-main);
  @include webTheme('white'){
    background-color: #e3e3e3;
    &:hover{
      background-color: #d4d4d4;
    }

  }
  @include webTheme('green'){
    background-color: #187b5a;
    &:hover{
      background-color: #4aa882;
    }

  }
}
</style>

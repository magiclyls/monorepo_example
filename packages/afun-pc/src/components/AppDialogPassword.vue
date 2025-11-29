<script setup lang='ts'>
import { IconUniLock } from '@tg/icons'
interface Props {
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
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const {
  isOpenVerify, isOpenPayPwd, brandBase,
} = storeToRefs(useBrandStore())

const { isSetPayPwd, isSetAuth } = useAuthConfig()

const passwordRef = ref()
const pwdType = ref('')

const pwdOptions = computed(() => {
  const check = brandBase.value?.verify
  const code = { label: t('double_check_code'), value: '1', wrongFormat: t('db_code_wrong_format') }
  const pwd = { label: t('menu_title_settings_update_safepwd'), value: '2', wrongFormat: t('paypwd_wrong_format') }
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
    return t('min_len_6')
  else if (!payPasswordReg.test(value))
    return pwdItem.value?.wrongFormat ?? '' // `${pwdLabel.value}${t('wrong_format')}`
  return ''
})

async function onConfirmClick() {
  passwordRef.value?.setTouchTrue()
  await validatePassword()
  if (errPassword.value)
    return

  closeDialog()
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
  <div class="flex flex-col gap-[16px] p-[16px]">
    <div class="flex items-center gap-[8px]">
      <div class="flex items-center text-[16px]">
        <IconUniLock />
      </div>
      <div v-if="pwdOptions.length === 1" class="text-tg-text-white text-[18px] font-semibold leading-[25px]">
        {{ pwdLabel }}
      </div>
      <BaseSelect
        v-else v-model="pwdType" :options="pwdOptions" popper
        :popper-center="true"
        style="
        --tg-base-select-style-font-size:18px;
        --tg-base-select-popper-style-padding-y:3.5px;
        --tg-base-select-popper-style-padding-x:1px;
        --tg-base-select-popcontent-lineheight:1;
        --tg-base-select-popper-bg-color:transparent;
        --tg-base-select-hover-bg-color:transparent;
        "
      />
    </div>
    <BaseInputPassword ref="passwordRef" v-model="password" clazz="white-password" :msg="errPassword" :split="false" msg-after-touched />
    <BaseButton bg-style="primary" size="md" style="--tg-base-button-font-size:16px;" @click="onConfirmClick">
      {{ t('confirm_withdrawal') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>

</style>

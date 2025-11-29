<script setup lang='ts'>
import { IconUniSetSmall } from '@tg/icons'
import { ApiMemberCPFUpdate } from '@tg/apis'

defineOptions({ name: 'AppDialogKYCVerify' })
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const appStore = useAppStore()
const { memberKYCInfo } = storeToRefs(appStore)
const { openNotify } = useNotify()
const { loadLegitimuzCDNAndInit, staryVerifyDocument } = useKYC()

const cpfNumber = computed(() => memberKYCInfo.value?.cpf_number ?? '')

const { value: cpf, errorMessage: cpfError, validate: valiCPF } = useField<string>('cpf', (v) => {
  if (!/^\d{11}$/.test(v))
    return t('format_error')

  return ''
})

/** 保存CPF */
async function saveCPF() {
  await valiCPF()
  if (cpfError.value)
    return

  ApiMemberCPFUpdate(cpf.value).then((res) => {
    if (res.state === 1) {
      openNotify({
        type: 'error',
        title: t('bind_fail'),
        message: t('setting_kyc_cpf_exit'),
      })
      return
    }
    else if (res.state === 2) {
      openNotify({
        type: 'error',
        title: t('bind_fail'),
        message: t('setting_cpf_invalid'),
      })
      return
    }

    openNotify({
      title: t('success_verify'),
      message: t('success_msg'),
    })
    appStore.runGetMemberKYCInfo()
  })
}
/** 进行KYC验证 */
function verifyDocument() {
  staryVerifyDocument({ cpf: cpfNumber.value.replace(/\D/g, ''), referenceId: memberKYCInfo.value?.uid ?? '' })
    .then(() => {
      closeDialog()
    })
}

loadLegitimuzCDNAndInit()
</script>

<template>
  <div class="px-[16px] py-[20px]">
    <template v-if="!cpfNumber">
      <div class="mb-[16px] h-[25px] flex items-center text-[16px]">
        <IconUniSetSmall />
        <span class="ml-[5px] text-[18px] font-semibold">{{ t('bind_cpf') }}</span>
      </div>
      <BaseLabel label="CPF">
        <BaseCpfInput v-model="cpf" hideBorderPlaceholder placeholder="000.000.000-00" input-mode="numeric" name="cpf" :required="true" :msg-after-touched="false" />
      </BaseLabel>
      <p class="theme-text my-[16px] text-[14px] font-medium leading-[21px]">
        {{ t('setting_kyc_tip1') }}{{ t('setting_kyc_tip2') }}
      </p>
      <BaseButton bg-style="primary" class="h-[44px] w-full" @click="saveCPF">
        {{ t('confirm_submit') }}
      </BaseButton>
    </template>
    <template v-else>
      <div class="mb-[16px] h-[25px] flex items-center text-[16px]">
        <IconUniSetSmall />
        <span class="ml-[5px] text-[18px] font-semibold">{{ t('verify_you') }}</span>
      </div>
      <p class="theme-text my-[16px] text-[14px] font-medium leading-[21px]">
        {{ t('you_should_make_a_kyc') }}
      </p>
      <BaseButton bg-style="primary" class="h-[44px] w-full" @click="verifyDocument">
        {{ t('setting_kyc_cpf_verify_now') }}
      </BaseButton>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.theme-text {
  color: #b1bad3;
  @include webTheme('white') {
    color: #555;
  }
  @include webTheme('green') {
    color: #3cb389;
  }
}
</style>

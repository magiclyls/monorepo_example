<script setup lang="ts">
import { ApiMemberCPFUpdate } from '@tg/apis'
import {
  IconUniRecordErr,
  IconUniWarningColor,
  IconUniSettingKycUser,
  IconUniSettingKycUserFace,
  IconUniSettingKycUserInfo,
} from '@tg/icons'

const { t } = useI18n()
const appStore = useAppStore()
const { memberKYCInfo, isCompleteKYC } = storeToRefs(appStore)
usePageTitle({ prefix: t('menu_title_settings_KYC') })
const { loadLegitimuzCDNAndInit, staryVerifyDocument } = useKYC()
const { openNotify } = useNotify()

const { bool: verifyLoading, setTrue, setFalse } = useBoolean(false)
const { value: cpf, errorMessage: cpfError, validate: valiCPF } = useField<string>('cpf', (v) => {
  if (!/^\d{11}$/.test(v))
    return t('format_error')

  return ''
})

const cpfNumber = computed(() => memberKYCInfo.value?.cpf_number ?? '')

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
      type: 'error',
      title: t('success_verify'),
      message: t('success_msg'),
    })
    appStore.runGetMemberKYCInfo()
  })
}
function verifyDocument() {
  setTrue()
  staryVerifyDocument({ cpf: cpfNumber.value.replace(/\D/g, ''), referenceId: memberKYCInfo.value?.uid ?? '' })
    .then(() => {
      setFalse()
    })
}

loadLegitimuzCDNAndInit()
</script>

<template>
  <div class="tg-settings-kyc">
    <div class="flex items-center gap-[8px]">
      <h6 class="text-[18px] font-[500]">{{ t('menu_title_settings_KYC') }}</h6>
      <div v-if="!isCompleteKYC" class="flex items-center gap-[4px] text-[14px] text-[#B1BAD3]">
        <IconUniRecordErr />
        <span>{{ t('verified_yet') }}</span>
      </div>
      <div v-else
        class="px-[7px] h-[19px] bg-[#24EE89] rounded-[100px] leading-[19px] text-[12px] font-[600] text-[#000]">
        {{ t('verified') }}
      </div>
    </div>

    <!-- 未绑定CPF提示 -->
    <div v-if="!cpfNumber" class="cpf-tips">
      <div class="h-[20px] flex items-center">
        <IconUniWarningColor />
      </div>
      <div class="ml-[4px] flex">
        <p>{{ t('setting_kyc_tip1') }}</p>
        <p>{{ t('setting_kyc_tip2') }}</p>
      </div>
    </div>

    <BaseLabel label="CPF" must class="theme-cpf">
      <AppCopyLine v-if="cpfNumber" :msg="cpfNumber" hide-copy />
      <BaseCpfInput v-else v-model="cpf" hide-border-placeholder class="mb-[12px]" placeholder="000.000.000-00" input-mode="numeric" name="cpf" :required="true" :msg-after-touched="false">
        <template #right>
          <div class="bg-[#2F4553] font-[500] px-[10px] h-full flex items-center justify-center min-w-[60px] text-center cursor-pointer" @click="saveCPF">
            {{ t('save') }}
          </div>
        </template>
      </BaseCpfInput>
      <!-- <BaseInput v-else v-model="cpf" max="11" :msg="cpfError" input-mode="numeric"
        :placeholder="t('setting_kyc_cpf_input_pls')" @on-right-button="saveCPF">
        <template #right-button>
          <div>
            {{ t('save') }}
          </div>
        </template>
      </BaseInput> -->
    </BaseLabel>

    <div class="base-info">
      <h6>{{ t('setting_kyc_base_verify') }}</h6>
      <div class="line" />
      <div class="h-[45px] flex items-center text-[16px]">
        <IconUniSettingKycUser />
        <span class="ml-[8px] text-[14px]">{{ t('setting_kyc_cpf_personal_info') }}</span>
      </div>
      <div class="h-[45px] flex items-center text-[18px]">
        <IconUniSettingKycUserInfo />
        <span class="ml-[8px] text-[14px]">{{ t('setting_kyc_cpf_government_id') }}</span>
      </div>
      <div class="h-[45px] flex items-center text-[18px]">
        <IconUniSettingKycUserFace />
        <span class="ml-[8px] text-[14px]">{{ t('setting_kyc_cpf_facial_recognition') }}</span>
      </div>
      <template v-if="!isCompleteKYC">
        <div class="line" />
        <div class="flex justify-end">
          <BaseButton :disabled="!cpfNumber" :loading="verifyLoading" bg-style="primary"
            class="theme-btn h-[44px]" @click="verifyDocument">
            {{ t('setting_kyc_cpf_verify_now') }}
          </BaseButton>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang=scss scoped>
.tg-settings-kyc {
  border-radius: 4px;
  border: 1px solid #2F4553;
  background: #1A2C38;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.20), 0 1px 2px 0 rgba(0, 0, 0, 0.12);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.theme-btn {}

.theme-cpf {
  --app-copyline-color: #b1bad3;
}

.cpf-tips {
  border-radius: 6px;
  border: 2px dashed #b1bad3;
  background: #0f212e;
  font-size: 14px;
  font-weight: 500;
  color: #b1bad3;
  display: flex;
  justify-content: center;
  padding: 8px 10px;
  line-height: 20px;
}

.base-info {
  color: #fff;
  font-size: 16px;
  font-weight: 400;

  h6 {
    font-size: 20px;
    line-height: 28px;
  }

  .line {
    height: 1px;
    background: #2f4553;
    margin: 16px 0;
  }
}

.custom-card-color {}

.custom-text-color1 {
  color: #00e701;
}

.custom-text-color2 {
  color: var(--tg-text-lightgrey);
}
</style>

<route lang="yaml">
meta:
  layout: center
</route>

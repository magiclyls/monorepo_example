<script setup lang="ts">
import { ApiMemberCPFUpdate } from '@tg/apis'

import { IconUniWarningColor,IconUniSettingKycUser,IconUniSettingKycUserFace,IconUniSettingKycUserInfo,IconUniRecordSuccess,IconUniCircleAdd } from '@tg/icons'

const { t } = useI18n()
const appStore = useAppStore()
const { memberKYCInfo, isCompleteKYC } = storeToRefs(appStore)
const { isMobile } = storeToRefs(useWindowStore())
const { bool: showElem, setBool: setShowElemBool } = useBoolean(false)
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
onMounted(() => {
  setShowElemBool(true)
})
</script>

<template>
  <div class="tg-settings-kyc">
    <!-- 未绑定CPF提示 -->
    <div v-if="!cpfNumber" class="cpf-tips mb-[16px]">
      <div class="h-[20px] flex items-center">
        <IconUniWarningColor />
      </div>
      <div class="ml-[4px] @md:flex">
        <p>{{ t('setting_kyc_tip1') }}</p>
        <p>{{ t('setting_kyc_tip2') }}</p>
      </div>
    </div>

    <BaseLabel label="CPF" must class="theme-cpf mb-[16px]">
      <AppCopyLine v-if="cpfNumber" :msg="cpfNumber" hide-copy />
      <BaseInput
        v-else v-model="cpf" max="11" :msg="cpfError" input-mode="numeric"
        :placeholder="t('setting_kyc_cpf_input_pls')" @on-right-button="saveCPF"
      >
        <template #right-button>
          <div>
            {{ t('save') }}
          </div>
        </template>
      </BaseInput>
    </BaseLabel>

    <div class="base-info">
      <h6>{{ t('setting_kyc_base_verify') }}</h6>
      <div class="line" />
      <div class="h-[45px] flex items-center text-[16px]">
        <IconUniSettingKycUser  />
        <span class="ml-[8px] text-[14px]">{{ t('setting_kyc_cpf_personal_info') }}</span>
      </div>
      <div class="h-[45px] flex items-center text-[18px]">
        <IconUniSettingKycUserInfo  />
        <span class="ml-[8px] text-[14px]">{{ t('setting_kyc_cpf_government_id') }}</span>
      </div>
      <div class="h-[45px] flex items-center text-[18px]">
        <IconUniSettingKycUserFace  />
        <span class="ml-[8px] text-[14px]">{{ t('setting_kyc_cpf_facial_recognition') }}</span>
      </div>
      <template v-if="!isCompleteKYC">
        <div class="line" />
        <BaseButton
          :disabled="!cpfNumber" :loading="verifyLoading" bg-style="secondary" class="theme-btn h-[42px] w-full"
          @click="verifyDocument"
        >
          {{ t('setting_kyc_cpf_verify_now') }}
        </BaseButton>
      </template>
    </div>

    <!-- <AppSettingsContentItem
      title="二级验证"
      last-one
      :btn-loading="loading"
      btn-text="save"
      :verified="KYC1IsDone" @submit="submitKYC2"
    >
      <template #top-desc>
        <span>请先完成一级级验证。</span>
        <span class="mt-[16px] block max-w-[420px] w-full leading-[20px]">请上传您的身份证明。所有文件都必须放置在平面上，其四个角都要在画面内，且所有信息都应该清晰可辨。</span>
      </template>
<template #default>
        <div class="flex flex-col gap-[16px]">
          <BaseLabel :label="t('身份证明')" must class="w-full">

          </BaseLabel>
          <div class="flex flex-col items-center gap-[4px] text-[14px] leading-[20px] @md:items-start">
            <span>我们接收以下文件类型:png、jpg、pdf</span>
            <span>所有数据都会被安全存储与加密</span>
          </div>
        </div>
      </template>
</AppSettingsContentItem> -->

    <template v-if="showElem && isMobile">
      <teleport to="#tgWithMenuRight">
        <div>
          <div class="flex items-center gap-[4px] text-[14px]">
            <template v-if="isCompleteKYC">
              <IconUniRecordSuccess class="text-[#00e701]" />
              <span class="custom-text-color1">{{ t('verified') }}</span>
            </template>
            <template v-else>
              <div class="rotate-45">
                <IconUniCircleAdd  />
              </div>
              <span class="custom-text-color2">{{ t('verified_yet') }}</span>
            </template>
          </div>
        </div>
      </teleport>
    </template>
  </div>
</template>

<style lang=scss scoped>
.theme-btn {
  @include webTheme('green') {
    --tg-secondary-text-color-theme-green: #055434;
  }
}
.theme-cpf {
  --app-copyline-color: #b1bad3;
  @include webTheme('green') {
    --app-copyline-color: #3cb389;
  }
  @include webTheme('white') {
    --app-copyline-color: #111;
    --tg-base-input-style-background-color: #e3e3e3;
    --tg-base-input-style-border: 1px solid #e3e3e3;
    --tg-base-input-style-bg: #e3e3e3;
    --tg-base-input-right-button-bg: #c1c1c1;
  }
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

  @include webTheme('green') {
    border-color: #5ecea6;
    background: #02432d;
    color: #3cb389;
  }
  @include webTheme('white') {
    border-color: #555;
    background: #e3e3e3;
    color: #555;
  }
}

.base-info {
  border-radius: 4px;
  border: 2px solid #2f4553;
  background: #1a2c38;
  box-shadow:
    0px 1px 2px -1px rgba(0, 0, 0, 0.25),
    0px 2px 3px -1px rgba(0, 0, 0, 0.3);
  padding: 24px 16px;
  color: #fff;
  font-size: 16px;
  font-weight: 400;

  @include webTheme('green') {
    border-color: #197b59;
    background-color: #055434;
    color: #3cb389;
  }
  @include webTheme('white') {
    border-color: #e8e8e8;
    background-color: #e8e8e8;
    color: #111;
    box-shadow: none;
  }

  h6 {
    font-size: 20px;
    line-height: 28px;
    @include webTheme('green') {
      color: #fff;
    }
  }

  .line {
    height: 1px;
    background: #2f4553;
    margin: 16px 0;

    @include webTheme('green') {
      background-color: #197b59;
    }
    @include webTheme('white') {
      background-color: #c1c1c1;
    }
  }
}

.custom-card-color {
  @include webTheme('white') {
    color: #b3b3b3;
    background-color: #e8e8e8;
  }
}

.custom-text-color1 {
  color: #00e701;
}

.custom-text-color2 {
  color: var(--tg-text-lightgrey);

  @include webTheme('green') {
    color: #42bc91;
  }
}
</style>

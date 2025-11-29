<script setup lang='ts'>
import { ApiMemberCPFUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseCpfInput, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean, useKYC } from '@tg/hooks'
import {
  IconUniSettingKycUser,
  IconUniSettingKycUserFace,
  IconUniSettingKycUserInfo,
  IconUniWarningColor,
} from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppPageLayout from '~/components/AppPageLayout.vue'
import { useNotify } from '~/hooks'

defineOptions({ name: 'AppUserKyc' })

const { t } = useI18n()
const appStore = useAppStore()
const { memberKYCInfo, isCompleteKYC } = storeToRefs(appStore)
const { openNotify } = useNotify()
const { staryVerifyDocument, loadLegitimuzCDNAndInit } = useKYC()

const { bool: verifyLoading, setTrue, setFalse } = useBoolean(false)
const { value: cpf, errorMessage: cpfError, validate: valiCPF } = useField<string>('cpf', (v) => {
  if (!/^\d{11}$/.test(v))
    return t('格式不正确')

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
        title: t('绑定失败'),
        message: t('CPF已存在'),
      })
      return
    }
    else if (res.state === 2) {
      openNotify({
        type: 'error',
        title: t('绑定失败'),
        message: t('CPF无效'),
      })
      return
    }

    openNotify({
      type: 'error',
      title: t('验证成功'),
      message: t('已保存成功'),
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
  <AppPageLayout :title="t('KYC验证')">
    <div class="flex flex-col gap-[16rem]">
      <div class="flex items-center gap-[8rem]">
        <h6 class="text-[18rem] font-[600]">
          {{ t('KYC验证') }}
        </h6>
        <div v-if="!isCompleteKYC" class="px-[7rem] h-[19rem] bg-[#2F4553] rounded-[100px] leading-[19rem] text-[12rem] font-[600] text-[#B1BAD3]">
          {{ t('未验证') }}
        </div>
        <div v-else class="px-[7rem] h-[19rem] bg-[#24EE89] rounded-[100px] leading-[19rem] text-[12rem] font-[600] text-[#000]">
          {{ t('已验证') }}
        </div>
      </div>

      <div v-if="!cpfNumber" class="bg-[#0F212E] flex justify-center p-[10rem] rounded-[6rem] border-dashed border-[2rem] leading-[20rem] border-[#B1BAD3] text-[#B1BAD3] text-[14rem] font-[500]">
        <div class="h-[20rem] text-[14rem] flex items-center">
          <IconUniWarningColor />
        </div>

        <div class="ml-[4rem]">
          <p>{{ t('cpf提示1') }}</p>
          <p>{{ t('cpf提示2') }}</p>
        </div>
      </div>

      <AfunBaseLabel label="CPF" required>
        <div v-if="cpfNumber" class="bg-[#2F4553] w-full h-[43rem] rounded-[4rem] leading-[43rem] pl-[10rem] text-[14rem] text-[#B1BAD3] font-[600]">
          {{ cpfNumber }}
        </div>
        <!-- <AfunBaseInput
          v-else
          v-model="cpf" :max="11" :msg="cpfError" input-mode="numeric"
          :placeholder="t('请输入CPF')" style="--afun-base-input-padding-right:0;"
        >
          <template #right>
            <div class="bg-[#2F4553] font-[500] px-[10rem] h-full flex items-center" @click="saveCPF">
              {{ t('保存') }}
            </div>
          </template>
        </AfunBaseInput> -->
        <AfunBaseCpfInput v-else v-model="cpf" hide-border-placeholder class="mb-[12px]" placeholder="000.000.000-00" input-mode="numeric" name="cpf" :required="true" :msg-after-touched="false">
          <template #right>
            <div class="bg-[#2F4553] font-[500] px-[10px] h-full flex items-center justify-center" @click="saveCPF">
              {{ t('保存') }}
            </div>
          </template>
        </AfunBaseCpfInput>
      </AfunBaseLabel>

      <div class="px-[16rem] flex flex-col  py-[24rem] bg-[#213743] rounded-[4rem] border-solid border-[2rem] border-[#2F4553]">
        <h6>{{ t('基本验证') }}</h6>
        <div class="line" />
        <div class="h-[45px] flex items-center text-[16px]">
          <IconUniSettingKycUser />
          <span class="ml-[8px] text-[14px]">{{ t('个人信息') }}</span>
        </div>
        <div class="h-[45px] flex items-center text-[18px]">
          <IconUniSettingKycUserInfo />
          <span class="ml-[8px] text-[14px]">{{ t('政府ID') }}</span>
        </div>
        <div class="h-[45px] flex items-center text-[18px]">
          <IconUniSettingKycUserFace />
          <span class="ml-[8px] text-[14px]">{{ t('脸部识别') }}</span>
        </div>
        <template v-if="!isCompleteKYC">
          <div class="line" />
          <AfunBaseButton
            :disabled="!cpfNumber" :loading="verifyLoading" class=" h-[42rem] w-full"
            @click="verifyDocument"
          >
            {{ t('立即验证') }}
          </AfunBaseButton>
        </template>
      </div>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>
.line {
  height: 1px;
  background-color: #2f4553;
  margin: 16rem 0;
}
</style>

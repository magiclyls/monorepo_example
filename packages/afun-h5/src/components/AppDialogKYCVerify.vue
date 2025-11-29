<script setup lang='ts'>
import { ApiMemberCPFUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useKYC } from '@tg/hooks'
import { IconUniSetSmall } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { Message } from '~/utils/index'

defineOptions({ name: 'AppDialogKYCVerify' })
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const appStore = useAppStore()
const { memberKYCInfo } = storeToRefs(appStore)
const { loadLegitimuzCDNAndInit, staryVerifyDocument } = useKYC()

const cpfNumber = computed(() => memberKYCInfo.value?.cpf_number ?? '')

const { value: cpf, errorMessage: cpfError, validate: valiCPF } = useField<string>('cpf', (v) => {
  if (!/^\d{11}$/.test(v))
    return t('格式不正确')

  return ''
})

/** 保存CPF */
async function saveCPF() {
  await valiCPF()
  if (cpfError.value)
    return

  ApiMemberCPFUpdate(cpf.value).then((res) => {
    if (res.state === 1) {
      Message.error(t('CPF已存在'))
      return
    }
    else if (res.state === 2) {
      Message.error(t('CPF无效'))
      return
    }
    Message.success(t('已保存成功'))
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
        <span class="ml-[5px] text-[18px] font-semibold">{{ t('绑定CPF') }}</span>
      </div>
      <AfunBaseLabel label="CPF">
        <AfunBaseInput v-model="cpf" :max="11" input-mode="numeric" :msg="cpfError" :placeholder="t('请输入CPF')" />
      </AfunBaseLabel>
      <p class="theme-text my-[16px] text-[14px] font-[600] leading-[21px]">
        {{ t('cpf提示1') }}{{ t('cpf提示2') }}
      </p>
      <AfunBaseButton bg-style="secondary" class="h-[44px] w-full" @click="saveCPF">
        {{ t('确认提交') }}
      </AfunBaseButton>
    </template>
    <template v-else>
      <div class="mb-[16px] h-[25px] flex items-center text-[16px]">
        <IconUniSetSmall />
        <span class="ml-[5px] text-[18px] font-semibold">{{ t('验证您的身份') }}</span>
      </div>
      <p class="theme-text my-[16px] text-[14px] font-[600] leading-[21px]">
        {{ t('为了保护您的账户安全并且符合法规要求') }}
      </p>
      <AfunBaseButton bg-style="secondary" class="h-[44px] w-full" @click="verifyDocument">
        {{ t('立即验证') }}
      </AfunBaseButton>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.theme-text {
  color: #b1bad3;
}
</style>

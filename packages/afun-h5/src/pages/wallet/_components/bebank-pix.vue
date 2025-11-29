<script lang="ts" setup>
import type { CurrencyCode, IWithdrawTypeItem } from '@tg/types'
import { ApiMemberBankcardBank, ApiMemberBankcardInsert, ApiMemberBankcardUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseCheckbox, AfunBaseImage, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean, useWalletState } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { Local, payPasswordReg, STORAGE_WALLET_ROUTE } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppPasswordInput from '~/components/AppPasswordInput.vue'
import AppSelect from '~/components/AppSelect.vue'
import { Message } from '~/utils'

interface IWithdrawTypeListItem extends IWithdrawTypeItem {
  label: string
  value: number
  icon: string
  cardCount: number
}
defineOptions({
  name: 'AppWalletWithDrawPixBeBankV3',
})
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const { isSetPayPwd } = storeToRefs(appStore)
const { realNameBRL } = useWalletState()
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const cpf = ref(routeData?.cpf as string)
const currencyId = ref<CurrencyCode>(routeData?.currencyId as CurrencyCode)
const isEdit = computed(() => (Number(routeData?.isEdit) === 1))
const initData = ref((JSON.parse((routeData?.data || '{}') as string)))

/** 提款方式 */
const withdrawType = ref(Number(routeData?.withdrawType))
const withdrawTypeList = ref(JSON.parse((routeData?.withdrawTypeList || '{}') as string))
const isFirst = computed(() => Number(routeData?.isFirst) === 1)
const auth_type = ref<'1' | '2'>('1')
const bankSelectRef = ref()
const passwordRef = ref()
// 是否设置为默认地址
const { bool: isDefaultAddress } = useBoolean(isEdit.value ? initData.value?.is_default === 1 : isFirst.value)
const withdrawTypeId = computed(() => withdrawTypeList.value.find((a: any) => a.type === withdrawType.value)?.id ?? '')

const openName = computed(() => routeData?.openName as string || realNameBRL.value)

// #region 表单数据
const {
  value: open_name,
  errorMessage: open_nameError,
  validate: valiOpenName,
} = useField<string>('open_name', (v) => {
  if (!v)
    return t('请输入内容')

  return v.length < 2 ? t('最小字符长度为 {delta}', { delta: 2 }) : ''
}, { initialValue: openName.value ?? '' })
const { value: country } = useField<string>('country', v => v ? '' : t('请输入内容'), { initialValue: '' })
const {
  value: bank_name,
  errorMessage: bank_nameError,
  validate: valiBankName,
} = useField<string>(
  'bank_name',
  v => v ? '' : t('请选择内容'),
  { initialValue: isEdit.value ? initData.value?.bank_name : '' },
)
/** cpf类型 */
const isCPF = computed(() => bank_name.value.includes('CPF'))
const {
  value: bank_area_cpf,
  errorMessage: cpfError,
  validate: valiCpf,
} = useField<string>(
  'bank_area_cpf',
  v => v ? '' : t('请输入内容'),
  { initialValue: cpf.value ?? '' },
)
const {
  value: bank_account,
  errorMessage: bank_accountError,
  validate: valiBankAcc,
} = useField<string>('bank_account', (v) => {
  if (!isCPF.value && !v)
    return t('请输入内容')
  return ''
}, { initialValue: isEdit.value ? initData.value?.bank_account : '' })
const {
  value: pay_password,
  errorMessage: pay_passwordError,
  validate: valiPwd,
} = useField<string>('pay_password', (v) => {
  if (!v)
    return t('请输入内容')

  if (!payPasswordReg.test(v))
    return t('格式错误')

  return ''
})

/** 新增银行卡 */
const {
  run: runBankcardInsert,
  loading: bankcardInsertLoading,
} = useRequest(ApiMemberBankcardInsert, {
  onSuccess() {
    appStore.updateUserInfo()
    Message.success(t('绑定成功'))
    router.back()
  },
})
/** 编辑银行卡 */
const {
  runAsync: runUpdateBankcard,
  loading: updateBankcardLoading,
} = useRequest(ApiMemberBankcardUpdate, {
  onSuccess() {
    Message.success(t('编辑成功'))
    router.back()
  },
})

// #region 国家和银行数据
const { data: countryList } = useRequest(ApiMemberBankcardBank, {
  defaultParams: [{
    currency_id: currencyId.value,
    type_id: `${withdrawType.value}`,
  }],
  manual: false,
})
const countryOptions = computed(() => {
  if (!countryList.value)
    return []
  return countryList.value.map((item) => {
    const temp = {
      label: item.country_name ? item.country_name : '--',
      value: item.country_id,
    }
    return temp
  })
})
const bank_nameOptions = computed(() => {
  if (!country.value)
    return []

  const temp = countryList.value?.find(item => item.country_id === country.value)
  const arr = (temp?.bank_list ?? []).map((item) => {
    const temp = {
      icon: `/webp/bank/${item.id}.webp`,
      label: item.name,
      value: item.name,
      id: item.id,
    }
    return temp
  })

  return isEdit.value && initData.value?.bank_name.includes('CPF') ? arr : cpf.value ? arr.filter(a => !a.label.includes('CPF')) : arr
})
// #endregion

// #region 提交表单
// 3、表单行为===============================================================================
// 提交表单：验证成功的处理和验证失败的处理
// 第一个参数：验证成功回调，入参为表单数据
// 第二个参数：验证失败回调，入参为表单数据、错误信息、验证结果
// 验证成功后，调用 resetForm()，重置表单
async function onSubmit() {
  await valiOpenName()
  await valiBankName()
  await valiCpf()
  await valiBankAcc()
  await valiPwd()
  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()

  if (open_nameError.value
    || bank_nameError.value
    || cpfError.value
    || bank_accountError.value
    || pay_passwordError.value
  ) {
    return
  }

  if (!isEdit.value) {
    // 新增
    runBankcardInsert({
      currency_id: currencyId.value,
      open_name: open_name.value,
      bank_name: bank_name.value,
      bank_account: isCPF.value ? bank_area_cpf.value : bank_account.value,
      is_default: isDefaultAddress.value ? 1 : 2,
      pay_password: pay_password.value,
      country: country.value,
      city: '',
      bank_area_cpf: bank_area_cpf.value,
      address: '',
      auth_type: +auth_type.value as any,
      bank_id: +(bank_nameOptions.value.find(item => item.label === bank_name.value)?.id ?? 0),
      type_id: withdrawTypeId.value,
    })
  }
  else {
    // 编辑
    runUpdateBankcard({
      ...initData.value,
      currency_id: currencyId.value,
      bank_name: bank_name.value,
      bank_account: isCPF.value ? bank_area_cpf.value : bank_account.value,
      is_default: isDefaultAddress.value ? 1 : 2,
      pay_password: pay_password.value,
      country: country.value,
      city: '',
      bank_area_cpf: bank_area_cpf.value,
      address: '',
      auth_type: +auth_type.value as any,
      bank_id: +(bank_nameOptions.value.find(item => item.label === bank_name.value)?.id ?? 0),
    })
  }
}

// 默认选中第一个国家
watch(countryOptions, (val) => {
  if (val.length)
    country.value = val[0].value
})
</script>

<template>
  <AppPageLayout :title="$t('绑定PIX账户')">
    <form class="flex flex-col gap-[16px]">
      <AfunBaseLabel required :label="$t('真实姓名')">
        <AfunBaseInput v-model="open_name" style="--afun-base-input-padding-y:10px;" :placeholder="t('真实姓名')" :msg="open_nameError" :disabled="!!openName" />
      </AfunBaseLabel>
      <AfunBaseLabel required :label="$t('请选择PIX类型')">
        <AppSelect
          ref="bankSelectRef"
          v-model="bank_name"
          :place-holder="t('PIX类型')"
          :options="bank_nameOptions"
          :msg="bank_nameError"
          full
          item-align="left"
          style="--app-select-label-border-color-active: #557086;"
        >
          <template #item-icon="{ item }">
            <AfunBaseImage class="w-full h-full" :url="item.icon" is-network />
          </template>
        </AppSelect>
      </AfunBaseLabel>
      <AfunBaseLabel v-show="!isCPF" required :label="$t('PIX账号')">
        <AfunBaseInput v-model="bank_account" style="--afun-base-input-padding-y:10px;" :placeholder="t('PIX账号')" :msg="bank_accountError" />
      </AfunBaseLabel>
      <AfunBaseLabel required label="CPF">
        <AfunBaseInput v-model="bank_area_cpf" style="--afun-base-input-padding-y:10px;" :disabled="!!cpf" placeholder="CPF" :msg="cpfError" />
      </AfunBaseLabel>
      <AppPasswordInput ref="passwordRef" v-model="pay_password" v-model:model-type="auth_type" />

      <div class="flex items-center">
        <AfunBaseCheckbox v-model="isDefaultAddress" style="--tg-base-checked-bg:#1A2C38;--tg-base-checked-border:#2F4553;--tg-base-checkbox-box-width:16px;" />
        <span class="ml-[4px] text-[#6D7693] text-[12px] font-[400] ">
          {{ $t('是否设为默认地址') }}
        </span>
      </div>
      <div class="text-[#6D7693] text-[12px] font-[400]">
        {{ $t('请认真核对账户，账户错误资金将无法到账') }}
      </div>
      <AfunBaseButton
        :loading="Boolean(bankcardInsertLoading || updateBankcardLoading)"
        @click="onSubmit"
      >
        {{ t('确认绑定') }}
      </AfunBaseButton>
    </form>
  </AppPageLayout>
</template>

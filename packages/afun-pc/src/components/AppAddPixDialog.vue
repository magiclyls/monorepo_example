<script lang="ts" setup>
import type { BankCard, IWithdrawTypeItem } from '@tg/types'
import { IconUniBack } from '@tg/icons'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberBankcardBank, ApiMemberBankcardInsert, ApiMemberBankcardUpdate } from '@tg/apis'

interface IWithdrawTypeListItem extends IWithdrawTypeItem {
  label: string
  value: number
  icon: string
  cardCount: number
}

interface Props {
  openName: string
  cpf: string
  currencyId: CurrencyCode
  isWithdraw?: boolean
  isEdit?: boolean
  data?: BankCard
  /** 1CNY银行卡 2支付宝 3钱包支付 */
  withdrawType: number
  withdrawTypeList: IWithdrawTypeListItem[]
  isFirst?: boolean
}
defineOptions({
  name: 'AppAddPixDialog',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const appStore = useAppStore()
const { realNameBRL } = useWalletState()

const isEdit = computed(() => props.isEdit)
const { openWalletDialog } = useWalletDialog({
  activeTab: 'withdraw',
  initCurrency: getCurrencyConfigByCode(props.currencyId).name,
})

const currencyId = ref<CurrencyCode>(props.currencyId)
const auth_type = ref<'1' | '2'>('1')
const bankSelectRef = ref()
const passwordRef = ref()
const { width } = useElementSize(bankSelectRef)
// 是否设置为默认地址
const { bool: isDefaultAddress } = useBoolean(isEdit.value ? props.data?.is_default === 1 : props.isFirst)
/** 提款方式 */
const withdrawType = ref(props.withdrawType)
const withdrawTypeId = computed(() => props.withdrawTypeList.find(a => a.type === withdrawType.value)?.id ?? '')
const _withdrawTypeList = computed(() => isEdit.value ? props.withdrawTypeList : props.withdrawTypeList.filter(a => a.cardCount < 3))

const openName = computed(() => props.openName || realNameBRL.value)

// #region 表单数据
const {
  value: open_name,
  errorMessage: open_nameError,
  validate: valiOpenName,
} = useField<string>('open_name', (v) => {
  if (!v)
    return t('enter_your_content')

  // if (chineseRegex.test(v))
  return v.length < 2 ? t('pop_up_login_first_input_min_length', { delta: 2 }) : ''

  // return v.length < 3 ? t('pop_up_login_first_input_min_length', { delta: 3 }) : ''
}, { initialValue: openName.value })
const { value: country } = useField<string>('country', v => v ? '' : t('enter_your_content'), { initialValue: '' })
const {
  value: bank_name,
  errorMessage: bank_nameError,
  validate: valiBankName,
} = useField<string>(
  'bank_name',
  v => v ? '' : t('select_content_pls'),
  { initialValue: isEdit.value ? props.data?.bank_name : '' },
)
/** cpf类型 */
const isCPF = computed(() => bank_name.value.includes('CPF'))
const {
  value: bank_area_cpf,
  errorMessage: cpfError,
  validate: valiCpf,
} = useField<string>(
  'bank_area_cpf',
  v => v ? '' : t('enter_your_content'),
  { initialValue: props.cpf ?? '' },
)
const {
  value: bank_account,
  errorMessage: bank_accountError,
  validate: valiBankAcc,
} = useField<string>('bank_account', (v) => {
  if (!isCPF.value && !v)
    return t('enter_your_content')
  return ''
}, { initialValue: isEdit.value ? props.data?.bank_account : '' })
const {
  value: pay_password,
  errorMessage: pay_passwordError,
  validate: valiPwd,
} = useField<string>('pay_password', (v) => {
  if (!v)
    return t('enter_your_content')

  if (!payPasswordReg.test(v))
    return t('wrong_format')

  return ''
})
// #endregion

// #region 请求api
const { openNotify } = useNotify()
/** 新增银行卡 */
const {
  run: runBankcardInsert,
  loading: bankcardInsertLoading,
} = useRequest(ApiMemberBankcardInsert, {
  onSuccess() {
    appStore.updateUserInfo()
    openNotify({
      type: 'success',
      title: t('label_bind'),
      message: t('success_bind'),
    })
    closeDialog()
  },
})
/** 编辑银行卡 */
const {
  runAsync: runUpdateBankcard,
  loading: updateBankcardLoading,
} = useRequest(ApiMemberBankcardUpdate, {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('edit'),
      message: t('edit_success'),
    })
    closeDialog()
  },
})
// #endregion

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

  return isEdit.value && props.data?.bank_name.includes('CPF') ? arr : props.cpf ? arr.filter(a => !a.label.includes('CPF')) : arr
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
      ...props.data,
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

// #endregion
function onBankOptionClick(item: any) {
  bank_name.value = item.value
}

// 默认选中第一个国家
watch(countryOptions, (val) => {
  if (val.length)
    country.value = val[0].value
})

onUnmounted(() => {
  openWalletDialog()
})
</script>

<template>
  <div class="p-[16px]">
    <div class="flex">
      <div
        class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]"
        @click="closeDialog()"
      >
        <IconUniBack class="text-[16px]" />
        <span>{{ t('bind_pix_account') }}</span>
      </div>
    </div>
    <form class="flex flex-col gap-[16px] pt-[16px]">
      <BaseLabel must :label="$t('real_name')">
        <BaseInput v-model="open_name" :placeholder="t('real_name')" :msg="open_nameError" :disabled="!!openName" />
      </BaseLabel>
      <BaseLabel must :label="$t('pix_account_type')">
        <BaseSelect
          ref="bankSelectRef" v-model="bank_name" show-placeholder :placeholder="t('pix_account_type')"
          popper :border="true" :options="bank_nameOptions" :msg="bank_nameError"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:9.5px;"
        >
          <template #label="{ popperLabel, data: option }">
            <div v-if="!bank_name" class="text-tg-wallet-optionbs-placehoder-color h-[20px] text-[14px] font-semibold">
              {{ t('pix_account_type') }}
            </div>
            <div v-else class="h-[20px] w-full flex items-center gap-[6px] text-[14px] font-semibold">
              <BaseImage :key="option?.icon" width="16px" height="16px" :url="option?.icon" is-network />
              {{ popperLabel }}
            </div>
          </template>
          <template #popper="{ hide }">
            <div class="scroll-y flex flex-col gap-[16px] px-[10px] py-[16px]" :style="{ width: `${width}px` }">
              <div
                v-for="bank in bank_nameOptions" :key="bank.value" :class="{ 'text-tg-text-blue': bank.value === bank_name }"
                class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                @click="hide(); onBankOptionClick(bank)"
              >
                <BaseImage width="16px" height="16px" :url="bank.icon" is-network />
                {{ bank.label }}
              </div>
            </div>
          </template>
        </BaseSelect>
      </BaseLabel>
      <BaseLabel v-show="!isCPF" must :label="$t('pix_account')">
        <BaseInput v-model="bank_account" :placeholder="t('pix_account')" :msg="bank_accountError" />
      </BaseLabel>
      <BaseLabel must label="CPF">
        <BaseInput v-model="bank_area_cpf" :disabled="!!cpf" placeholder="CPF" :msg="cpfError" />
      </BaseLabel>
      <AppPasswordInput ref="passwordRef" v-model="pay_password" v-model:model-type="auth_type" />
      <BaseCheckBox v-model="isDefaultAddress" style="--tg-base-checkbox-box-width:16px;">
        <span class="text-[14px] font-medium leading-[20px]">
          {{ $t('is_default_addr_brl') }}
        </span>
      </BaseCheckBox>
      <div class="leading-[20px text-tg-text-lightgrey text-[14px] font-medium">
        {{ $t('check_card_account_pls_brl') }}
      </div>
      <BaseButton
        style="--tg-base-button-font-size:16px;" :loading="bankcardInsertLoading || updateBankcardLoading"
        bg-style="primary" size="md" @click="onSubmit"
      >
        {{ t('confirm_bind') }}
      </BaseButton>
    </form>
  </div>
</template>

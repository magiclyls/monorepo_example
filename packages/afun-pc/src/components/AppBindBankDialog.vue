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
  openName?: string
  currencyId: CurrencyCode
  isWithdraw?: boolean
  isEdit?: boolean
  data?: BankCard
  /** 1CNY银行卡 2支付宝 3钱包支付 */
  withdrawType: number
  withdrawTypeList: IWithdrawTypeListItem[]
  isFirst?: boolean
  /** 每个钱包最多绑3个，需要排除的钱包id */
  needDisabledBankIds: number[]
  /** 是否所有钱包都绑定了三张卡 */
  isFullBindedAllWallet?: boolean
}
defineOptions({
  name: 'AppBindBankDialog',
})
const props = defineProps<Props>()
const closeDialog = inject('closeDialog', () => { })

const { t } = useI18n()
const isEdit = computed(() => props.isEdit)
const { openWalletDialog } = useWalletDialog({
  activeTab: 'withdraw',
  initCurrency: getCurrencyConfigByCode(props.currencyId).name,
})

const appStore = useAppStore()
const { realNameMap } = useWalletState()
const currencyId = ref<CurrencyCode>(props.currencyId)
const auth_type = ref<'1' | '2'>('1')
const passwordRef = ref()
const bankSelectRef = ref()
const { width } = useElementSize(bankSelectRef)
// 是否设置为默认地址
const { bool: isDefaultAddress } = useBoolean(isEdit.value ? props.data?.is_default === 1 : props.isFirst)
/** 提款方式 */
const withdrawType = ref(props.withdrawType)

/** 当前是银行卡 */
const isBankCardType = computed(() => withdrawType.value === 1)
/** 当前是支付宝 */
const isAlipayType = computed(() => withdrawType.value === 2)
/** 当前是钱包支付 */
const isThreePartyWalletType = computed(() => withdrawType.value === 3)
const withdrawTypeId = computed(() => props.withdrawTypeList.find(a => a.type === withdrawType.value)?.id ?? '')
const _withdrawTypeList = computed(() => {
  return isEdit.value
    ? props.withdrawTypeList
    : props.withdrawTypeList.filter(a => (!props.isFullBindedAllWallet && a.type === 3) || a.cardCount < 3)
})
const openName = computed(() => props.openName || realNameMap.value[currencyId.value])

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
const {
  value: country,
} = useField<string>('country', () => '', { initialValue: isEdit.value ? props.data?.country : '' })
const {
  value: address,
  errorMessage: addressError,
  validate: valiAddress,
  resetField: resetAddress,
} = useField<string>(
  'address',
  v => v ? '' : t('enter_your_content'),
  { initialValue: isEdit.value ? props.data?.address : '' },
)
const {
  value: bank_name,
  errorMessage: bank_nameError,
  validate: valiBankName,
  resetField: resetBankName,
} = useField<string>(
  'bank_name',
  v => v ? '' : t('select_content_pls'),
  { initialValue: isEdit.value ? props.data?.bank_name : '' },
)
const {
  value: bank_account,
  errorMessage: bank_accountError,
  validate: valiBankAcc,
  resetField: resetBankAccount,
} = useField<string>(
  'bank_account',
  v => v ? '' : t('enter_your_content'),
  { initialValue: isEdit.value ? props.data?.bank_account : '' },
)
const {
  value: pay_password,
  errorMessage: pay_passwordError,
  validate: valiPwd,
  resetField: resetPassword,
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
const { data: countryList, runAsync: runGetBankCard } = useRequest(ApiMemberBankcardBank)
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
  return (temp?.bank_list ?? []).filter(a => !props.needDisabledBankIds.includes(+a.id)).map((item) => {
    const temp = {
      icon: `/webp/bank/${item.id}.webp`,
      label: item.name,
      value: item.name,
      id: item.id,
    }
    return temp
  })
})

const dialogTitle = computed(() => {
  if (isBankCardType.value)
    return t('bind_bank_card')
  else if (isAlipayType.value)
    return t('bind_alipay')
  else if (isThreePartyWalletType.value)
    return t('bind_wallet')
  return ''
})
// 需要显示开户网点
const isNeedAddress = computed(() => {
  // 人民币
  return props.currencyId === '701' && isBankCardType.value
})

/** 绑定 */
async function onSubmit() {
  await valiOpenName()
  // 支付宝不需要银行名称
  if (!isAlipayType.value)
    await valiBankName()

  await valiBankAcc()
  await valiPwd()
  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()

  if (isNeedAddress.value)
    await valiAddress()

  if (open_nameError.value
    || bank_nameError.value
    || addressError.value
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
      bank_account: bank_account.value,
      is_default: isDefaultAddress.value ? 1 : 2,
      pay_password: pay_password.value,
      country: country.value,
      city: '',
      address: address.value,
      auth_type: +auth_type.value as any,
      bank_id: +(bank_nameOptions.value.find(item => item.value === bank_name.value)?.id ?? 0),
      type_id: withdrawTypeId.value,
    })
  }
  else {
    // 编辑
    runUpdateBankcard({
      ...props.data,
      currency_id: currencyId.value,
      bank_name: bank_name.value,
      bank_account: bank_account.value,
      is_default: isDefaultAddress.value ? 1 : 2,
      pay_password: pay_password.value,
      country: country.value,
      city: '',
      address: address.value,
      auth_type: +auth_type.value as any,
      bank_id: +(bank_nameOptions.value.find(item => item.value === bank_name.value)?.id ?? 0),
    })
  }
}
// #endregion
function onBankOptionClick(item: ISelectOptionString) {
  bank_name.value = item.value
}
function onWithdrawTypeOnClick(item: IWithdrawTypeListItem, hide: () => void) {
  hide()

  setTimeout(() => {
    withdrawType.value = item.value
    runGetBankCard({ currency_id: currencyId.value, type_id: `${withdrawType.value}` })
    resetAddress()
    resetBankName()
    resetBankAccount()
    resetPassword()
  }, 200)
}

// 默认选中第一个国家
watch(countryOptions, (val) => {
  if (val.length && !isEdit.value)
    country.value = val[0].value
})

onUnmounted(() => {
  openWalletDialog()
})

await application.allSettled([runGetBankCard({ currency_id: currencyId.value, type_id: `${withdrawType.value}` })])
</script>

<template>
  <div class="p-[16px]">
    <div class="flex">
      <div
        class="flex cursor-pointer items-center gap-[5px] text-[18px] font-semibold leading-[25px]"
        @click="closeDialog()"
      >
        <IconUniBack class="text-[16px]" />
        <span>{{ dialogTitle }}</span>
      </div>
    </div>
    <form class="flex flex-col gap-[16px] pt-[16px]">
      <BaseLabel must class="thHight" :label="$t('real_name')">
        <BaseInput v-model="open_name" class="thHight-name" :placeholder="t('real_name')" :msg="open_nameError" :disabled="!!openName" />
      </BaseLabel>
      <BaseLabel v-if="_withdrawTypeList.length > 1" must :label="$t('withdraw_type')">
        <BaseSelect
          ref="bankSelectRef" v-model="withdrawType" popper :border="true" :options="_withdrawTypeList" :disabled="isEdit"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:8.5px;"
        >
          <template #label="{ popperLabel, data: option }">
            <div class="h-[20px] w-full flex items-center gap-[6px] text-[14px] font-semibold">
              <BaseImage width="16px" height="16px" :url="option?.icon" is-network />
              {{ popperLabel }}
            </div>
          </template>

          <template #popper="{ hide }">
            <div class="scroll-y flex flex-col gap-[16px] px-[10px] py-[16px]" :style="{ width: `${width}px` }">
              <div
                v-for="bank in _withdrawTypeList" :key="bank.value"
                class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                :class="{ 'text-tg-text-blue': bank.value === withdrawType }" @click="onWithdrawTypeOnClick(bank, hide)"
              >
                <BaseImage width="16px" height="16px" :url="bank.icon" is-network />
                {{ bank.label }}
              </div>
            </div>
          </template>
        </BaseSelect>
      </BaseLabel>
      <template v-if="isBankCardType">
        <BaseLabel must :label="$t('bank_choose')">
          <BaseSelect
            ref="bankSelectRef" v-model="bank_name" popper :border="true" :options="bank_nameOptions"
            :msg="bank_nameError"
            style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:8.5px;"
          >
            <template #label="{ popperLabel, data: option }">
              <div v-if="!bank_name" class="text-tg-wallet-optionbs-placehoder-color h-[20px] text-[14px] font-semibold">
                {{ t('bank_choose') }}
              </div>
              <div v-else class="h-[20px] w-full flex items-center gap-[6px] text-[14px] font-semibold">
                <BaseImage width="16px" height="16px" :url="option?.icon" is-network />
                {{ popperLabel }}
              </div>
            </template>

            <template #popper="{ hide }">
              <div class="scroll-y max-h-[333px] flex flex-col gap-[16px] px-[10px] py-[16px]" :style="{ width: `${width}px` }">
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
        <BaseLabel v-if="isNeedAddress" must :label="$t('open_addr')">
          <BaseInput v-model="address" :msg="addressError" :placeholder="t('open_addr')" />
        </BaseLabel>
        <BaseLabel must :label="$t('label_bank_number')">
          <BaseInput
            v-model="bank_account" :placeholder="t('label_bank_number')" type="number"
            :msg="bank_accountError" hide-spin-btn
          />
        </BaseLabel>
      </template>
      <template v-else-if="isAlipayType">
        <BaseLabel must :label="$t('alipay_account')">
          <BaseInput v-model="bank_account" :placeholder="t('alipay_account')" :msg="bank_accountError" />
        </BaseLabel>
      </template>
      <template v-else-if="isThreePartyWalletType">
        <BaseLabel must :label="$t('choose_wallet')">
          <BaseSelect
            ref="bankSelectRef" v-model="bank_name" popper :border="true" :options="bank_nameOptions"
            :msg="bank_nameError" :disabled="isEdit"
            style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:8.5px;"
          >
            <template #label="{ popperLabel, data: option }">
              <div v-if="!bank_name" class="text-tg-wallet-optionbs-placehoder-color h-[20px] text-[14px] font-semibold">
                {{ t('choose_wallet') }}
              </div>
              <div v-else class="h-[20px] w-full flex items-center gap-[6px] text-[14px] font-semibold">
                <BaseImage width="16px" height="16px" :url="option?.icon" is-network />
                {{ popperLabel }}
              </div>
            </template>

            <template #popper="{ hide }">
              <div class="scroll-y flex flex-col gap-[16px] px-[10px] py-[16px]" :style="{ width: `${width}px` }">
                <div
                  v-for="bank in bank_nameOptions" :key="bank.value"
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
        <BaseLabel must :label="$t('wallet_account')">
          <BaseInput v-model="bank_account" :placeholder="t('wallet_account')" :msg="bank_accountError" />
        </BaseLabel>
      </template>

      <AppPasswordInput ref="passwordRef" v-model="pay_password" v-model:model-type="auth_type" />
      <BaseCheckBox v-model="isDefaultAddress" style="--tg-base-checkbox-box-width:16px;">
        <span class="text-[14px] font-medium leading-[20px]">
          {{ isBankCardType ? $t('tip_msg_is_default_bank_number') : t('is_default_addr_brl') }}
        </span>
      </BaseCheckBox>
      <div class="leading-[20px text-tg-text-lightgrey text-[14px] font-medium">
        {{ isBankCardType ? $t('check_card_account_pls') : t('check_card_account_pls_brl') }}
      </div>
      <BaseButton
        style="--tg-base-button-font-size:16px;" :loading="bankcardInsertLoading || updateBankcardLoading" bg-style="primary"
        size="md" @click="onSubmit"
      >
        {{ t('confirm_bind') }}
      </BaseButton>
    </form>
  </div>
</template>

<style scoped lang="scss">
  .thHight {
  &-name {
    --tg-base-input-line-height: 2 !important
    ;
  }
}
</style>

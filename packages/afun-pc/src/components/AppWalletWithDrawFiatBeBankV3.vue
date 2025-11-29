<script setup lang="ts">
import type { BankCard, IWithdrawTypeItem } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberBankcardBank, ApiMemberBankcardInsert, ApiMemberBankcardUpdate } from '@tg/apis'
import {indiaPhoneReg,ifscReg,indiaCardReg,indiaUPIReg} from '~/utils/regexp'

interface IWithdrawTypeListItem extends IWithdrawTypeItem {
  label: string
  value: number
  icon: string
  cardCount: number
}

defineOptions({
  name: 'AppWalletWithDrawFiatBeBankV3',
})
const SecuritySafePwd = defineAsyncComponent(() => import('~/components/AppPayPassword.vue'))
const { t } = useI18n()
const appStore = useAppStore()
const brandStore = useBrandStore()
const router = useLocalRouter()
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]

const { realNameMap } = useWalletState()
const { isSetPayPwd } = useAuthConfig()
const initData = ref((JSON.parse((routeData?.data || '{}') as string)))
const isEdit = computed(() => (Number(routeData?.isEdit) === 1))
const isFirst = computed(() => Number(routeData?.isFirst) === 1)
const needDisabledBankIds = ref<number[]>(JSON.parse((routeData?.needDisabledBankIds || '[]') as string))
const currencyId = ref<CurrencyCode>(routeData?.currencyId as CurrencyCode)
const withdrawTypeList = ref(JSON.parse((routeData?.withdrawTypeList || '[]') as string))
const isFullBindedAllWallet = ref(Number(routeData?.isFullBindedAllWallet) === 1)
/** 提款方式 */
const currentWithdrawId = ref(routeData?.withdrawId)
const withdrawType = computed(() => {
  return withdrawTypeList.value.find((item: any) => item.id === currentWithdrawId.value)?.type
})
const auth_type = ref<'1' | '2'>('1')
const passwordRef = ref()
const bankSelectRef = ref()
const { width } = useElementSize(bankSelectRef)
// 是否设置为默认地址
const { bool: isDefaultAddress } = useBoolean(isEdit.value ? initData.value?.is_default === 1 : isFirst.value)
const openName = computed(() => routeData?.openName || realNameMap.value[currencyId.value])
const isPhp = computed(() => {
  // 菲律宾货币
  return currencyId.value === '735'
})
const isIndiaCard = computed(() => {
  // 印度货币
  return currencyId.value === '703'
})
const setCustomTitle: any = inject('setCustomTitle', () => { })

/** 当前是银行卡 */
const isBankCardType = computed(() => withdrawType.value === 1)
/** 当前是支付宝 */
const isAlipayType = computed(() => withdrawType.value === 2 && !isIndiaCard.value && !isPhp.value)
/** 当前是钱包支付 */
const isThreePartyWalletType = computed(() => withdrawType.value === 3)
const currentWithdrawItem = computed(() => withdrawTypeList.value.find((a: any) => a.id === currentWithdrawId.value))
const _withdrawTypeList = computed(() => {
  return isEdit.value
    ? withdrawTypeList.value
    : withdrawTypeList.value.filter(a => (!isFullBindedAllWallet.value && a.type === 3) || a.cardCount < 3)
})

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
} = useField<string>('country', () => '', { initialValue: isEdit.value ? initData.value?.country : '' })
const {
  value: address,
  errorMessage: addressError,
  validate: valiAddress,
  resetField: resetAddress,
} = useField<string>(
  'address',
  v => v ? '' : t('enter_your_content'),
  { initialValue: isEdit.value ? initData.value?.address : '' },
)
const {
  value: bank_name,
  errorMessage: bank_nameError,
  validate: valiBankName,
  resetField: resetBankName,
} = useField<string>(
  'bank_name',
  v => v ? '' : t('select_content_pls'),
  { initialValue: isEdit.value ? initData.value?.bank_name : '' },
)
const {
  value: bank_account,
  errorMessage: bank_accountError,
  validate: valiBankAcc,
  resetField: resetBankAccount,
} = useField<string>(
  'bank_account',
  (v) => {
    if (!v)
      return t('enter_your_content')

    if (isIndiaCard.value) {
      if (withdrawType.value === 1 && !indiaCardReg.test(v))
        return t('wrong_format')

      if (withdrawType.value === 2 && !indiaUPIReg.test(v))
        return t('wrong_format')
    }

    return ''
  },
  { initialValue: isEdit.value ? initData.value?.bank_account : '' },
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
const {
  value: phone,
  errorMessage: phoneErrorMsg,
  validate: validPhone,
  resetField: resetPhone,
} = useField<string>('phone', (value) => {
  if (!value)
    return t('enter_your_content')
  if (!indiaPhoneReg.test(value))
    return t('phone_invalid')
  return ''
}, { initialValue: isEdit.value ? initData.value?.phone : '' })
const {
  value: email,
  errorMessage: emailErrormsg,
  validate: emailValidate,
  resetField: resetEmail,
} = useField<string>('email', (value) => {
  if (!value)
    return t('enter_your_content')
  if (!emailReg.test(value))
    return t('this_contains_invalid_email_characters')
  else if (value && value.length > 30)
    return t('pls_input_email')
  return ''
}, { initialValue: isEdit.value ? initData.value?.email : '' })
const {
  value: ifsc,
  errorMessage: ifscErrorMsg,
  validate: validifsc,
  resetField: resetifsc,
} = useField<string>('ifsc', (value) => {
  if (!value)
    return t('enter_your_content')
  if (!ifscReg.test(value))
    return t('wrong_format')
  return ''
}, { initialValue: isEdit.value ? initData.value?.bank_area_cpf : '' })
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
    router.back()
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
    router.back()
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
  return (temp?.bank_list ?? []).filter(a => !needDisabledBankIds.value.includes(+a.id)).map((item) => {
    const temp = {
      icon: `/webp/bank/${item.id}.webp`,
      label: item.name,
      value: item.name,
      id: item.id,
    }
    return temp
  })
})

// 需要显示开户网点
const isNeedAddress = computed(() => {
  // 人民币
  return currencyId.value === '701' && isBankCardType.value
})

/** 绑定 */
async function onSubmit() {
  await valiOpenName()
  if (isIndiaCard.value) {
    // 印度卡
    await validPhone()
    await emailValidate()
    if (withdrawType.value === 1)
      await validifsc()
  }
  // 支付宝不需要银行名称
   if (isBankCardType.value)
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
    || phoneErrorMsg.value
    || emailErrormsg.value
    || ifscErrorMsg.value
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
      type_id: currentWithdrawItem.value?.id ?? '',
      phone: phone.value,
      email: email.value,
      bank_area_cpf: ifsc.value,
    })
  }
  else {
    // 编辑
    runUpdateBankcard({
      ...initData.value,
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
      phone: phone.value,
      email: email.value,
      bank_area_cpf: ifsc.value,
    })
  }
}
// #endregion
function onBankOptionClick(item: ISelectOptionString) {
  bank_name.value = item.value
}
function onWithdrawTypeOnClick(item: IWithdrawTypeListItem, hide: () => void){
  currentWithdrawId.value = item.id
  hide()
}
watch(currentWithdrawItem, () => {
  runGetBankCard({ currency_id: currencyId.value, type_id: `${withdrawType.value}` })
  resetAddress()
  resetBankName()
  resetBankAccount()
  resetPassword()
  resetPhone()
  resetEmail()
  resetifsc()
}, { immediate: true })

watchEffect(() => {
  let title = [t('bind_bank_card'), t('bind_alipay'), t('bind_wallet')][withdrawType.value - 1]
  if (isPhp.value) {
    title = t('绑定{n}', { n: currentWithdrawItem.value.name })
  }
  if (isIndiaCard.value)
    title = [t('绑定IMPS'), t('绑定UPI')][withdrawType.value - 1]

  setCustomTitle(title)
})
// 默认选中第一个国家
watch(countryOptions, (val) => {
  if (val.length && !isEdit.value)
    country.value = val[0].value
})

runGetBankCard({ currency_id: currencyId.value, type_id: `${withdrawType.value}` })
</script>

<template>
  <div>
    <template v-if="isSetPayPwd">
      <form class="flex flex-col gap-[16px] pt-[16px]">
        <BaseLabel must class="thHight" :label="$t('real_name')">
          <BaseInput v-model="open_name" class="thHight-name" :placeholder="t('real_name')" :msg="open_nameError" :disabled="!!openName" />
        </BaseLabel>
        <BaseLabel v-if="_withdrawTypeList.length > 1" must :label="$t('withdraw_type')">
          <BaseSelect
            ref="bankSelectRef" v-model="currentWithdrawId" popper :border="true" :options="_withdrawTypeList" :disabled="isEdit"
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
        <template v-if="isIndiaCard">
          <BaseLabel must :label="$t('phone_number')">
            <BaseInput v-model="phone" :placeholder="t('phone_number')" :msg="phoneErrorMsg" />
          </BaseLabel>
          <BaseLabel must :label="$t('电子邮箱')">
            <BaseInput v-model="email" :placeholder="t('电子邮箱')" :msg="emailErrormsg" />
          </BaseLabel>
          <BaseLabel v-if="withdrawType === 1" must label="IFSC">
            <BaseInput v-model="ifsc" placeholder="IFSC" :msg="ifscErrorMsg" />
          </BaseLabel>
          <BaseLabel v-if="withdrawType === 2" must :label="$t('withdraw_account1')">
            <BaseInput v-model="bank_account" :placeholder="t('withdraw_account1')" :msg="bank_accountError" />
          </BaseLabel>
        </template>
        <AppPasswordInput ref="passwordRef" v-model="pay_password" v-model:model-type="auth_type" />
        <BaseCheckBox v-model="isDefaultAddress" style="--tg-base-checkbox-box-width:16px;">
          <span class="text-[14px] font-medium leading-[20px]">
            {{ isBankCardType ? $t('tip_msg_is_default_bank_number') : t('is_default_addr_brl') }}
          </span>
        </BaseCheckBox>
        <div class="text-tg-text-lightgrey leading-[20px text-[14px] font-medium">
          {{ isBankCardType ? $t('check_card_account_pls') : t('check_card_account_pls_brl') }}
        </div>
        <BaseButton
          style="--tg-base-button-font-size:16px;" :loading="bankcardInsertLoading || updateBankcardLoading" bg-style="primary"
          size="md" @click="onSubmit"
        >
          {{ t('confirm_bind') }}
        </BaseButton>
      </form>
    </template>
    <template v-else>
      <Suspense timeout="0" suspensible>
        <component :is="SecuritySafePwd" :key="brandStore.brandChangeNum" :tip-text="$t('menu_title_settings_withdrawals')" />
        <template #fallback>
          <div class="center dialog-loading-height">
            <BaseLoading />
          </div>
        </template>
      </Suspense>
    </template>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script setup lang="ts">
import type { CurrencyCode, ISelectOptionString, IWithdrawTypeItem } from '@tg/types'
import { ApiMemberBankcardBank, ApiMemberBankcardInsert, ApiMemberBankcardUpdate } from '@tg/apis'
import { AfunBaseButton, AfunBaseCheckbox, AfunBaseImage, AfunBaseInput, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean, useWalletState } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { emailReg, ifscReg, indiaCardReg, indiaPhoneReg, indiaUPIReg, Local, payPasswordReg, STORAGE_WALLET_ROUTE } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPageLayout from '~/components/AppPageLayout.vue'
import AppPasswordInput from '~/components/AppPasswordInput.vue'
import AppSelect from '~/components/AppSelect.vue'
import AppWalletPassword from '~/components/AppWalletPassword.vue'
import { Message } from '~/utils'

interface IWithdrawTypeListItem extends IWithdrawTypeItem {
  label: string
  value: number
  icon: string
  cardCount: number
}

defineOptions({
  name: 'AppWithDrawBeBankFiat',
})
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const { isSetPayPwd } = storeToRefs(appStore)
const { realNameMap } = useWalletState()
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const initData = ref((JSON.parse((routeData?.data || '{}') as string)))
const isEdit = computed(() => (Number(routeData?.isEdit) === 1))
const isFirst = computed(() => Number(routeData?.isFirst) === 1)
const needDisabledBankIds = ref<number[]>(JSON.parse((routeData?.needDisabledBankIds || '[]') as string))
const currencyId = ref<CurrencyCode>(routeData?.currencyId as CurrencyCode)
const withdrawTypeList = ref(JSON.parse((routeData?.withdrawTypeList || '{}') as string))
const isFullBindedAllWallet = ref(Number(routeData?.isFullBindedAllWallet) === 1)
/** 提款方式 */
const currentWithdrawId = ref(routeData?.withdrawId)
const withdrawType = computed(() => {
  return withdrawTypeList.value.find((item: any) => item.id === currentWithdrawId.value)?.type
})
const auth_type = ref<'1' | '2'>('1')
const passwordRef = ref()
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
/** 当前是银行卡 */
const isBankCardType = computed(() => withdrawType.value === 1)
/** 当前是支付宝 */
const isAlipayType = computed(() => withdrawType.value === 2 && !isIndiaCard.value && !isPhp.value)
/** 当前是钱包支付 */
const isThreePartyWalletType = computed(() => withdrawType.value === 3)
const currentWithdrawItem = computed(() => withdrawTypeList.value.find((a: any) => a.id === currentWithdrawId.value))

const title = computed(() => {
  if (isPhp.value) {
    return t('绑定{n}', { n: currentWithdrawItem.value.name })
  }

  if (isIndiaCard.value) {
    return [t('绑定IMPS'), t('绑定UPI')][withdrawType.value - 1]
  }
  return [t('绑定银行卡'), t('绑定支付宝'), t('绑定钱包')][withdrawType.value - 1]
})

const _withdrawTypeList = computed(() => {
  return isEdit.value
    ? withdrawTypeList.value
    : withdrawTypeList.value.filter((a: any) => (!isFullBindedAllWallet.value && a.type === 3) || a.cardCount < 3)
})

// #region 表单数据
const {
  value: open_name,
  errorMessage: open_nameError,
  validate: valiOpenName,
} = useField<string>('open_name', (v) => {
  if (!v)
    return t('请输入内容')

  // if (chineseRegex.test(v))
  return v.length < 2 ? t('最小字符长度为 {delta}', { delta: 2 }) : ''

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
  v => v ? '' : t('请输入内容'),
  { initialValue: isEdit.value ? initData.value?.address : '' },
)
const {
  value: bank_name,
  errorMessage: bank_nameError,
  validate: valiBankName,
  resetField: resetBankName,
} = useField<string>(
  'bank_name',
  v => v ? '' : t('请选择内容'),
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
      return t('请输入内容')

    if (isIndiaCard.value) {
      if (withdrawType.value === 1 && !indiaCardReg.test(v)) {
        return t('格式错误')
      }
      if (withdrawType.value === 2 && !indiaUPIReg.test(v)) {
        return t('格式错误')
      }
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
    return t('请输入内容')

  if (!payPasswordReg.test(v))
    return t('格式错误')

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
    return t('请输入内容')
  if (!indiaPhoneReg.test(value))
    return t('手机号码无效')
  return ''
}, { initialValue: isEdit.value ? initData.value?.phone : '' })
const {
  value: email,
  errorMessage: emailErrormsg,
  validate: emailValidate,
  resetField: resetEmail,
} = useField<string>('email', (value) => {
  if (!value)
    return t('请输入内容')
  if (!emailReg.test(value))
    return t('这含有无效的电子邮件字符')
  else if (value && value.length > 30)
    return t('请输入有效的电邮地址')
  return ''
}, { initialValue: isEdit.value ? initData.value?.email : '' })
const {
  value: ifsc,
  errorMessage: ifscErrorMsg,
  validate: validifsc,
  resetField: resetifsc,
} = useField<string>('ifsc', (value) => {
  if (!value)
    return t('请输入内容')
  if (!ifscReg.test(value))
    return t('格式错误')
  return ''
}, { initialValue: isEdit.value ? initData.value?.bank_area_cpf : '' })

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

  const arr = countryList.value?.find(item => item.country_id === country.value)?.bank_list ?? []
  const result = needDisabledBankIds.value ? arr.filter(a => !needDisabledBankIds.value.includes(+a.id)) : arr
  return result.map((item) => {
    const temp = {
      icon: `/webp/bank/${item.id}.webp`,
      label: item.name,
      value: item.name,
      id: item.id,
    }
    return temp
  })
})
const currentBank = computed(() => {
  return bank_nameOptions.value.find(item => item.value === bank_name.value)
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
  if (isNeedAddress.value)
    await valiAddress()
  await valiPwd()
  await valiBankAcc()

  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()
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
      bank_id: +(currentBank.value?.id ?? 0),
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
      bank_id: +(currentBank.value?.id ?? 0),
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
// 默认选中第一个国家
watch(countryOptions, (val) => {
  if (val.length && !isEdit.value)
    country.value = val[0].value
})
onMounted(() => {
  runGetBankCard({ currency_id: currencyId.value, type_id: `${withdrawType.value}` })
})
</script>

<template>
  <AppPageLayout :title="title">
    <template v-if="isSetPayPwd">
      <div class="flex flex-col gap-[16px] my-16 mx-12">
        <AfunBaseLabel required :label="$t('真实姓名')">
          <AfunBaseInput v-model="open_name" style="--afun-base-input-padding-y:10px;" :placeholder="t('真实姓名')" :msg="open_nameError" :disabled="!!openName" />
        </AfunBaseLabel>

        <AfunBaseLabel v-if="_withdrawTypeList.length > 1" required :label="$t('提款方式')">
          <AppSelect
            v-model="currentWithdrawId"
            :options="_withdrawTypeList"
            :disabled="isEdit"
            :place-holder="t('提款方式')"
            full
            item-align="left"
            style="--app-select-label-border-color-active: #557086;"
          >
            <template #item-icon="{ item }">
              <AfunBaseImage v-if="item?.icon" class="w-full h-full" :url="item?.icon" is-network />
            </template>
          </AppSelect>
        </AfunBaseLabel>
        <template v-if="isBankCardType && bank_nameOptions.length > 0">
          <AfunBaseLabel :label="t('银行选择')" required>
            <AppSelect
              v-model="bank_name"
              :options="bank_nameOptions"
              :msg="bank_nameError"
              :place-holder="t('银行选择')"
              full
              item-align="left"
              style="--app-select-label-border-color-active: #557086;"
            >
              <template #item-icon="{ item }">
                <AfunBaseImage v-if="item?.icon" class="w-full h-full" :url="item?.icon" is-network />
              </template>
            </AppSelect>
          </AfunBaseLabel>
          <AfunBaseLabel v-if="isNeedAddress" required :label="$t('开户网点')">
            <AfunBaseInput v-model="address" style="--afun-base-input-padding-y:10px;" :msg="addressError" :placeholder="t('开户网点')" />
          </AfunBaseLabel>
          <AfunBaseLabel required :label="$t('银行卡号')">
            <AfunBaseInput
              v-model="bank_account"
              style="--afun-base-input-padding-y:10px;" :placeholder="t('银行卡号')" type="number"
              :msg="bank_accountError" hide-spin-btn
            />
          </AfunBaseLabel>
        </template>
        <template v-else-if="isAlipayType">
          <AfunBaseLabel required :label="$t('支付宝账号')">
            <AfunBaseInput v-model="bank_account" style="--afun-base-input-padding-y:10px;" :placeholder="t('支付宝账号')" :msg="bank_accountError" />
          </AfunBaseLabel>
        </template>
        <template v-else-if="isThreePartyWalletType">
          <AfunBaseLabel required :label="$t('选择钱包')">
            <AppSelect
              v-model="bank_name"
              :options="bank_nameOptions"
              :msg="bank_nameError"
              disabled="isEdit"
              :place-holder="t('选择钱包')"
              full
              item-align="left"
              @change="onBankOptionClick"
            >
              <template #item-icon="{ item }">
                <AfunBaseImage v-if="item?.icon" class="w-full h-full" :url="item?.icon" is-network />
              </template>
            </AppSelect>
          </AfunBaseLabel>
          <AfunBaseLabel required :label="$t('钱包账号')">
            <AfunBaseInput v-model="bank_account" style="--afun-base-input-padding-y:10px;" :placeholder="t('钱包账号')" :msg="bank_accountError" />
          </AfunBaseLabel>
        </template>
        <template v-if="isIndiaCard">
          <AfunBaseLabel required :label="$t('电话号码')">
            <AfunBaseInput v-model="phone" style="--afun-base-input-padding-y:10px;" :placeholder="t('电话号码')" :msg="phoneErrorMsg" />
          </AfunBaseLabel>
          <AfunBaseLabel required :label="$t('电子邮箱')">
            <AfunBaseInput v-model="email" style="--afun-base-input-padding-y:10px;" :placeholder="t('电子邮箱')" :msg="emailErrormsg" />
          </AfunBaseLabel>
          <AfunBaseLabel v-if="withdrawType === 1" required label="IFSC">
            <AfunBaseInput v-model="ifsc" style="--afun-base-input-padding-y:10px;" placeholder="IFSC" :msg="ifscErrorMsg" />
          </AfunBaseLabel>
          <AfunBaseLabel v-if="withdrawType === 2" required :label="$t('提款账号')">
            <AfunBaseInput
              v-model="bank_account"
              style="--afun-base-input-padding-y:10px;" :placeholder="t('提款账号')"
              :msg="bank_accountError" hide-spin-btn
            />
          </AfunBaseLabel>
        </template>
        <template v-if="isPhp && withdrawType === 2">
          <AfunBaseLabel required :label="$t('提款账号')">
            <AfunBaseInput
              v-model="bank_account"
              style="--afun-base-input-padding-y:10px;" :placeholder="t('提款账号')"
              :msg="bank_accountError" hide-spin-btn
            />
          </AfunBaseLabel>
        </template>

        <AppPasswordInput ref="passwordRef" v-model="pay_password" v-model:model-type="auth_type" />
        <div class="flex items-center">
          <AfunBaseCheckbox v-model="isDefaultAddress" style="--tg-base-checked-bg:#1A2C38;--tg-base-checked-border:#2F4553;--tg-base-checkbox-box-width:16px;" />
          <span class="ml-[4px] text-[#B1BAD3] text-[14px] font-[600] ">
            {{ isBankCardType ? $t('是否设为默认卡号') : t('是否设为默认账户') }}
          </span>
        </div>
        <div class="text-[#B1BAD3] text-[12px] font-[600]">
          {{ isBankCardType ? $t('请认真核对卡号，卡号错误资金将无法到账') : t('请认真核对账户，账户错误资金将无法到账') }}
        </div>
        <AfunBaseButton
          :loading="Boolean(bankcardInsertLoading || updateBankcardLoading)"
          @click="onSubmit"
        >
          {{ t('确认绑定') }}
        </AfunBaseButton>
      </div>
    </template>
    <component :is="AppWalletPassword" v-else :is-component="true" />
  </AppPageLayout>
</template>

<style lang="scss" scoped>

</style>

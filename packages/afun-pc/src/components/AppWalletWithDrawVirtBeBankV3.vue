<script setup lang="ts">
import type { IAvailableCurrency, EnumCurrencyKey, VirtualCoin } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiFinanceDepositWalletInvalidCurrency, ApiMemberWalletInsert, ApiMemberWalletUpdate } from '@tg/apis'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface IAllContractList {
  [k: string]: Array<{
    label: string
    value: string
  }>
}
defineOptions({
  name: 'AppWalletWithDrawVirtBeBankV3',
})
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]

const { bool: isDefault } = useBoolean(Number(routeData.isFirst) === 1 )
const isEdit = ref(Number(routeData.isEdit) ===1 ) // 是否是编辑状态  true 编辑状态 false 新增状态  默认是新增状态
const initData = ref((JSON.parse((routeData?.data || '{}') as string)))
const { allContractListData } = useCurrencyData()
const { openNotify } = useNotify()
const {
  value: address,
  errorMessage: addressMsg,
  validate: valiAddress,
  resetField: resetAddress,
} = useField<string>('address', (value) => {
  if (!value)
    // return t('this_field_is_required')
    return t('input_draw_coin_addr')
  else if (!virtualCoinAddressReg.test(value))
    return t('pls_input_virtual_addr')
  return ''
}, { initialValue: isEdit.value ? initData.value.address : '' })
const passwordRef = ref()
const password = ref('')
const _currencyId = ref(routeData.currencyId as unknown as CurrencyCode)
const virCurrencyList = ref(JSON.parse((routeData?.virCurrencyList || '[]') as string))
const currentNetwork = ref(routeData.contractId as string)
const currencySelectRef = ref()
const { width: currencySelectWidth } = useElementSize(currencySelectRef)
// 会员钱包显示不可绑定的货币
const { data: invalidCurrencyData, runAsync: runGetInvalidCurrency } = useRequest(ApiFinanceDepositWalletInvalidCurrency)
// 经过过滤的协议列表
const contractListFiltered = computed(() => {
  if (invalidCurrencyData.value && invalidCurrencyData.value.length > 0) {
    // 获取所有的协议id
    const contractIdList: Array<string> = []

    for (let i = 0; i < invalidCurrencyData.value.length; i++) {
      for (let ii = 0; ii < invalidCurrencyData.value[i].contract_id.length; ii++)
        contractIdList.push(invalidCurrencyData.value[i].contract_id[ii].id)
    }

    // 提取不包含这些id的协议
    const _allContractList: IAllContractList = cloneDeep(allContractListData.value)
    const newAllContractList: IAllContractList = {}
    for (const currencyType in _allContractList) {
      const arr = []
      for (let i = 0; i < _allContractList[currencyType].length; i++) {
        if (!contractIdList.includes(_allContractList[currencyType][i].value))
          arr.push(_allContractList[currencyType][i])
      }
      newAllContractList[currencyType] = arr
    }

    // 过滤没有协议的货币
    for (const key in newAllContractList) {
      if (newAllContractList[key].length === 0)
        delete newAllContractList[key]
    }
    return newAllContractList
  }

  return allContractListData.value
})
// 经过过滤的货币列表
const virCurrencyListFiltered = computed(() => {
  if (invalidCurrencyData.value && invalidCurrencyData.value.length > 0) {
    const keyArr = Object.keys(contractListFiltered.value)
    const arr = []
    for (let i = 0; i < keyArr.length; i++) {
      const item = virCurrencyList.value.find(a => a.currency_name === keyArr[i])
      if (item)
        arr.push(item)
    }
    return arr
  }
  return virCurrencyList.value
})
// 当前选择的货币item
const curCurrencyItem = computed(() => {
  if (!virCurrencyListFiltered.value || virCurrencyListFiltered.value.length === 0)
    return null

  return virCurrencyListFiltered.value.find(a => a.currency_id === _currencyId.value)
})
// 协议类型
const curContractList = computed(() => {
  const currencyType = virCurrencyList.value.find(a => a.currency_id === _currencyId.value)?.currency_name
  return currencyType ? contractListFiltered.value[currencyType] : []
})

const {
  run: runMemberWalletInsert,
  loading: addWalletInsertLoading,
} = useRequest(ApiMemberWalletInsert, {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('label_bind'),
      message: t('success_bind'),
    })
    if (curCurrencyItem.value)
      router.back()
  },
})

const {
  run: runMemberWalletUpdate,
  loading: updateWalletLoading,
} = useRequest(ApiMemberWalletUpdate, {
  onSuccess() {
    openNotify({
      type: 'success',
      title: t('edit'),
      message: t('edit_success'),
    })
    if (curCurrencyItem.value)
      router.back()
  },
})

async function handleBindAddress() {
  await valiAddress()
  passwordRef.value.setTouchTrue()
  await passwordRef.value.validatePassword()
  if (!addressMsg.value && !passwordRef.value.errPassword) {
    if (isEdit.value) {
      runMemberWalletUpdate({
        id: initData.value.id,
        address: address.value,
        is_default: isDefault.value ? 1 : 2,
        pay_password: password.value,
        auth_type: +passwordRef.value.authType,
      })
    }
    else {
      runMemberWalletInsert({
        contract_type: Number(currentNetwork.value),
        currency_id: _currencyId.value,
        address: address.value,
        is_default: isDefault.value ? 1 : 2,
        pay_password: password.value,
        auth_type: +passwordRef.value.authType,
      })
    }
  }
}
function onVirCurrencyChange(item: ICurrencyOption) {
  _currencyId.value = item.currency_id
  resetAddress()
  passwordRef.value?.resetPassword()
}
function onContractClick(item: ISelectOptionString) {
  currentNetwork.value = item.value
}

watch(() => curContractList.value, (a) => {
  currentNetwork.value = a && a.length > 0 ? a[0].value : ''
})
watch(() => routeData.contractId, () => {
  resetAddress()
  currentNetwork.value = routeData.contractId as string
})

application.allSettled([runGetInvalidCurrency()])
</script>

<template>
  <div class="flex flex-col gap-[16px] pt-[16px]">
    <BaseLabel :label="t('currency')" must-small>
      <div
        v-if="virCurrencyListFiltered.length === 1"
        class="bg-tg-secondary-dark text-tg-text-white border-tg-secondary h-[41px] w-full flex items-center border-[2px] rounded-[4px] border-solid px-[10px] text-[14px] font-semibold"
      >
        <AppCurrencyIcon style="--tg-app-currency-icon-size:18px;" :currency-type="getCurrencyConfigByCode(_currencyId).name" show-name />
      </div>
      <BaseSelect
        v-else
        ref="currencySelectRef"
        v-model="_currencyId" :disabled="isEdit" popper-strategy="fixed"
        style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:8.5px;"
        popper :border="true" :options="virCurrencyListFiltered"
      >
        <template #label="{ popperLabel }">
          <div class="h-[20px] w-full flex items-center gap-[6px] text-[14px] font-semibold">
            <AppCurrencyIcon style="--tg-app-currency-icon-size:18px;" :currency-type="popperLabel as EnumCurrencyKey" />
            {{ popperLabel }}
          </div>
        </template>
        <template #popper="{ hide }">
          <div class="scroll-y max-h-[350px] flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]" :style="{ width: `${currencySelectWidth}px` }">
            <div
              v-for="item, in virCurrencyListFiltered" :key="item.value"
              class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
              :class="{ 'text-tg-text-blue': item.value === _currencyId }" @click="hide();onVirCurrencyChange(item)"
            >
              <AppCurrencyIcon style="--tg-app-currency-icon-size:18px;" :currency-type="item.label" show-name />
            </div>
          </div>
        </template>
      </BaseSelect>
    </BaseLabel>
    <BaseLabel
      v-if="curContractList?.length" :label="t('choose_proto_pls')" must-small
    >
      <BaseSelect
        ref="currencySelectRef"
        v-model="currentNetwork" :options="curContractList" style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:9.5px;"
        :disabled="isEdit"
        popper :border="true"
      >
        <template #popper="{ hide }">
          <div class="scroll-y max-h-[255px] flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]" :style="{ width: `${currencySelectWidth}px` }">
            <div
              v-for="item, in curContractList" :key="item.value"
              class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
              :class="{ 'text-tg-text-blue': item.value === currentNetwork }" @click="hide();onContractClick(item)"
            >
              {{ item.label }}
            </div>
          </div>
        </template>
      </BaseSelect>
    </BaseLabel>

    <BaseLabel :label="t('wallet_address')" must-small>
      <BaseInput v-model="address" :placeholder="t('wallet_address')" :msg="addressMsg" />
    </BaseLabel>
    <AppPasswordInput ref="passwordRef" v-model="password" />
    <BaseCheckBox v-model="isDefault" style="--tg-base-checkbox-box-width:16px;">
      <span class="text-[14px] font-medium leading-[20px]">
        {{ $t('is_default_addr') }}
      </span>
    </BaseCheckBox>
    <div class="text-tg-text-lightgrey leading-[20px text-[14px] font-medium">
      {{ $t('check_vir_address_pls') }}
    </div>
    <BaseButton
      style="--tg-base-button-font-size:16px;" :loading="addWalletInsertLoading || updateWalletLoading" bg-style="primary"
      size="md" @click="handleBindAddress"
    >
      {{ t('confirm_bind') }}
    </BaseButton>
  </div>
</template>

<style lang='scss' scoped>
</style>

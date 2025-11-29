<script setup lang="ts">
import type { IAvailableCurrency, EnumCurrencyKey, VirtualCoin } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconEditActive, IconUniBankDelete, IconUniWarningColor } from '@tg/icons'
import { ApiFinanceWithdrawBalance, ApiFinanceWithdrawCoin, ApiFinanceWithdrawFeeInfo, ApiFinanceWithdrawMethodList, ApiFinanceWithdrawWallet } from '@tg/apis'
import AppMemberNotificationsMessage from './AppMemberNotificationsMessage.vue'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface IVirAddressOption extends VirtualCoin {
  label: string
  value: string
  disabled: boolean
}
interface IVirCardOption extends VirtualCoin {
  label: string
  value: string
  disabled: boolean
}
interface Props {
  initVirCurrency: IAvailableCurrency
  initVirCurrencyList: ICurrencyOption[]
}
defineOptions({
  name: 'AppWalletWithDrawVirV3',
})
const props = defineProps<Props>()
const { t } = useI18n()
const customRouter = useCustomRouter()
const appStore = useAppStore()
const { balanceData, isCompleteKYC, isLogin } = storeToRefs(appStore)
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { bool: isDataLoading } = useBoolean(false)
const { bool: showMaxAmount, setBool: setMaxAmount } = useBoolean(false)
const { openDeleteConfirm } = useDeleteConfirmDialog()
const { openPromptDialog } = useDialogPrompt()
const { openNotify } = useNotify()
const { getVirtualCurrencyContractType } = useCurrencyData()
const { brandAmount } = storeToRefs(useBrandStore())
/** 最大提款额 */
const {
  data: withdrawBalance,
  runAsync: runWithdrawBalance,
} = useRequest(ApiFinanceWithdrawBalance)
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()

const activeVirCurrency = ref(props.initVirCurrency)
const virSearchValue = ref('')
const virCurrencyList = ref(props.initVirCurrencyList)
const currentNetwork = ref(initNetwork())
const amountRef = ref()
const memoRef = ref()
const addressSelectRef = ref()
const { width } = useElementSize(addressSelectRef)
const getMaxAmount = computed(() =>
  application.formatNumDecimal(withdrawBalance.value?.withdraw_balance ?? 0, currencyConfig[activeVirCurrency.value.currency_name].decimal),
)
const minWithdraw = computed(() => Number(brandAmount.value ? brandAmount.value[`c${activeVirCurrency.value.currency_id}`].w ?? 0 : 0))
/** 当前是XRP */
const isXRP = computed(() => activeVirCurrency.value.currency_name === 'XRP')
/** 当前是EOS */
const isEOS = computed(() => activeVirCurrency.value.currency_name === 'EOS')

const {
  value: address,
  errorMessage: addressMsg,
  validate: valiAddress,
  setValue: setAddress,
} = useField<string>('address', (value) => {
  if (!value)
    return t('select_addr')
  return ''
})
const {
  value: memo,
  errorMessage: memoMsg,
  validate: valiMemo,
  resetField: resetMemo,
} = useField<string>('memo', (value) => {
  if (!value)
    return t('input_remark')
  return ''
})
const {
  value: amount,
  errorMessage: amountMsg,
  validate: valiAmount,
  setValue: setAmount,
  resetField: amountReset,
} = useField<string>('amount', (value) => {
  if (!value) {
    return t('input_amount')
  }
  else if (Number(value) === 0) {
    return `${t('validate_amount')}0`
  }
  else if (Number(value) < minWithdraw.value) {
    return `${t('min_amount_is')}${application.formatNumDecimal(minWithdraw.value, currencyConfig[activeVirCurrency.value.currency_name].decimal)}`
  }
  else if (value && Number(value) > Number(withdrawBalance.value?.withdraw_balance)) {
    setAmount(getMaxAmount.value)
    setMaxAmount(true)
  }
  // return t('validate_deposit_amount_max')
  return ''
}, { initialValue: '' })

/** 获取取款账号 */
const {
  runAsync: runAsyncWithdrawMethodList,
} = useRequest(ApiFinanceWithdrawMethodList)

/** 获取取款次数 */
const {
  runAsync: runAsyncWithdrawFeeInfo,
} = useRequest(ApiFinanceWithdrawFeeInfo)

/** 获取虚拟钱包列表 */
const {
  data: walletList,
  runAsync: runAsyncWalletList,
} = useRequest(ApiFinanceWithdrawWallet, {
  onSuccess(res) {
    if (res.d && res.d.length > 0) {
      const list = res.d.filter(a => a.state !== 2)
      // 判断列表中是否有默认地址，没有则选中第一个
      const defaultItem = list.find(i => i.is_default === 1)
      if (defaultItem)
        setAddress(defaultItem.id, false)
      else
        setAddress(list[0].id, false)
    }
  },
})
const {
  runAsync: runAsyncWithdrawCoin,
  loading: withdrawLoading,
} = useRequest(ApiFinanceWithdrawCoin, {
  onSuccess(data, params) {
    const type = activeVirCurrency.value.currency_name
    openNotify({
      icon: `coin-${type.toLocaleLowerCase()}`,
      title: t('withdraw_in_process'),
      message: () => h(AppMemberNotificationsMessage, {
        amount: application.formatNumDecimal(params[0].amount, currencyConfig[type].decimal),
        currencyType: type,
        keypath: 'withdraw_info_going',
      }),
    })
    amountReset()
    setMaxAmount(false)
    resetMemo()
    appStore.getBalanceData()
    // passwordRef.value.resetPassword()
  },
})

const virCurrencyListOptions = computed(() => virCurrencyList.value.filter(a => a.currency_name.includes(virSearchValue.value.toUpperCase())))
/** 虚拟钱包列表 */
const addrOptions = computed(() => {
  if (walletList.value && walletList.value.d) {
    return walletList.value.d.map((i) => {
      return {
        ...i,
        label: i.address,
        value: i.id,
        disabled: i.state === 2,
      }
    })
  }
  return []
})
// 协议列表
const curContractList = computed(() => {
  const currencyType = virCurrencyList.value.find(a => a.currency_id === activeVirCurrency.value.currency_id)?.currency_name
  return currencyType ? getVirtualCurrencyContractType(currencyType) : []
})
// 协议label
const currentNetworkLabel = computed(() => curContractList.value.find(a => a.value === currentNetwork.value)?.label ?? '')

function initNetwork() {
  const network = getVirtualCurrencyContractType(props.initVirCurrency.currency_name)
  return network ? network[0]?.value : ''
}
function onVirCurrencyChange(item: ICurrencyOption) {
  activeVirCurrency.value = item
  nextTick(() => {
    amountReset()
    setMaxAmount(false)
    resetMemo()
    getAllData()
  })
}
function onVirPopperHide() {
  setTimeout(() => {
    virSearchValue.value = ''
  }, 200)
}
/** 获取当前日期：格式如YYYYMMDD */
function getCurDate() {
  const currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}
// 绑定虚拟货币地址
function toAddVirAddress() {
  let isFirst = true
  if (addrOptions.value.length > 0)
    isFirst = false
  customRouter.push('/widthdraw/bebank', {
    currencyType: 'virtual',
    currencyId: activeVirCurrency.value.currency_id,
    currencyName: activeVirCurrency.value.currency_name,
    virCurrencyList: virCurrencyList.value,
    contractId: currentNetwork.value,
    isFirst,
  })
}
function onAddressClick(item: IVirAddressOption, hide: () => void) {
  if (item.disabled)
    return
  address.value = item.value
  hide()
}
function maxNumber() {
  setMaxAmount(true)
  setAmount(getMaxAmount.value)
}
function formatAmount() {
  setAmount(application.formatNumDecimal(amount.value, currencyConfig[activeVirCurrency.value.currency_name].decimal))
}
// 编辑
function toEdit(item: IVirCardOption) {
  if (item.disabled)
    return

  customRouter.push('/widthdraw/bebank', {
    currencyType: 'virtual',
    currencyId: activeVirCurrency.value.currency_id,
    currencyName: activeVirCurrency.value.currency_name,
    virCurrencyList: virCurrencyList.value,
    contractId: currentNetwork.value,
    isEdit: true,
    addressId: item.value,
    data: item,
    isFirst: item.is_default === 1,
  })
}
function toDeleteVirAddress(item: VirtualCoin) {
  openDeleteConfirm({
    item,
    updateWalletList: () => runAsyncWalletList({ currency_id: activeVirCurrency.value.currency_id, contract_type: currentNetwork.value }),
  })
}
async function handleWithdraw() {
  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  amountRef.value?.setTouchTrue()
  await valiAmount()

  if (isXRP.value) {
    memoRef.value?.setTouchTrue()
    await valiMemo()
  }
  await valiAddress()
  if (!amountMsg.value && !addressMsg.value && !memoMsg.value) {
    // 先判断取款次数再调取款接口
    runAsyncWithdrawFeeInfo({ currency_id: activeVirCurrency.value.currency_id }).then((data): void => {
      if (data.withdraw_setting_count > 0 && data.withdraw_count >= data.withdraw_setting_count && !Local.get(STORAGE_DEPOSIT_COUNT + getCurDate() + data.withdraw_count)?.value) {
        openPromptDialog(data)
        Local.set(STORAGE_DEPOSIT_COUNT + getCurDate() + data.withdraw_count, data.withdraw_count)
      }
      else {
        // 打开输入资金密码弹窗
        const { openDialogPassword } = useDialogPassword()
        openDialogPassword({
          callBack: (pwdData: {
            auth_type: number
            password: string
          }) => {
            runAsyncWithdrawCoin({
              currency_id: Number(activeVirCurrency.value.currency_id),
              contract_id: currentNetwork.value,
              amount: amount.value,
              pay_password: pwdData.password,
              wallet_id: address.value,
              auth_type: pwdData.auth_type,
              auth_code: pwdData.password,
              memo: memo.value || undefined,
            })
          },
        })
      }
    })
  }
}
// 获取数据
async function getAllData() {
  isDataLoading.value = true
  return Promise.allSettled([
    runWithdrawBalance({ currency_id: activeVirCurrency.value.currency_id }),
    runAsyncWithdrawMethodList({ currency_id: activeVirCurrency.value.currency_id, contract_id: currentNetwork.value }),
    runAsyncWalletList({ currency_id: activeVirCurrency.value.currency_id, contract_type: currentNetwork.value }),
  ]).finally(() => {
    isDataLoading.value = false
  })
}
// 切换网络
function onNetworkChange() {
  nextTick(async () => {
    isDataLoading.value = true
    return Promise.allSettled([
      runAsyncWithdrawMethodList({ currency_id: activeVirCurrency.value.currency_id, contract_id: currentNetwork.value }),
      runAsyncWalletList({ currency_id: activeVirCurrency.value.currency_id, contract_type: currentNetwork.value }),
    ]).finally(() => {
      isDataLoading.value = false
    })
  })
}

watch(curContractList, (a) => {
  if (a && a.length > 0)
    currentNetwork.value = a && a.length > 0 ? a[0].value : ''
})
// 余额有变化，打码信息更新
watch(() => balanceData.value, () => {
  nextTick(() => {
    runWithdrawBalance({ currency_id: activeVirCurrency.value.currency_id })
  })
})
onActivated(async () => {
  await application.allSettled([
    runWithdrawBalance({ currency_id: activeVirCurrency.value.currency_id }),
    runAsyncWithdrawMethodList({ currency_id: activeVirCurrency.value.currency_id, contract_id: currentNetwork.value }),
    runAsyncWalletList({ currency_id: activeVirCurrency.value.currency_id, contract_type: currentNetwork.value }),
  ])
})
await application.allSettled([
  runWithdrawBalance({ currency_id: activeVirCurrency.value.currency_id }),
  runAsyncWithdrawMethodList({ currency_id: activeVirCurrency.value.currency_id, contract_id: currentNetwork.value }),
  runAsyncWalletList({ currency_id: activeVirCurrency.value.currency_id, contract_type: currentNetwork.value }),
])
</script>

<template>
  <div class="wallet-wrap flex flex-col gap-[16px]">
    <!-- 选择货币 -->
    <div v-if="virCurrencyList.length > 1" class="flex items-center justify-between">
      <label class="text-[14px] font-semibold leading-[19.6px]">
        {{ t('withdraw_currency') }} <span class="text-tg-text-error text-[12px]">*</span>
      </label>
      <template v-if="activeVirCurrency">
        <div v-if="virCurrencyList.length === 1" class="text-tg-text-white bg-tg-secondary-dark flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
          <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
        </div>
        <BaseSelect
          v-else
          v-model="activeVirCurrency.currency_name"
          class="select1"
          popper-clazz="deep-mode wallet-pop-box" :skidding="-28" popper :border="false"
          :options="virCurrencyListOptions" style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
          popper-strategy="fixed" @popper-hide="onVirPopperHide"
        >
          <template #label>
            <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
          </template>
          <template #popper="{ hide }">
            <div class="bg wallet-pop-content max-h-[368px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
              <div class="w-full px-[10px]">
                <BaseSearch
                  v-model="virSearchValue" style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                  class="h-[36px]" :place-holder="t('search')" shape="square" white-style
                />
              </div>
              <div class="scroll-y w-full flex flex-col">
                <div
                  v-for="fiat, in virCurrencyListOptions" :key="fiat.value"
                  class="theme-color text-tg-text-secondary flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[10px] text-[14px] font-semibold"
                  @click="hide();onVirCurrencyChange(fiat)"
                >
                  <div class="flex items-center justify-between">
                    <AppCurrencyIcon :currency-type="fiat.label" show-name />
                    <span>{{ application.formatNumDecimal(fiat.balance ? fiat.balance : 0, currencyConfig[fiat.currency_name].decimal) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </BaseSelect>
      </template>
    </div>
    <div class="flex items-center justify-between">
      <label class="text-[14px] font-semibold leading-[19.6px]">
        {{ t('select_network') }} <span class="text-tg-text-error text-[12px]">*</span>
      </label>
      <BaseSelect
        v-if="curContractList.length > 1"
        v-model="currentNetwork"
        class="select1" popper-clazz="deep-mode wallet-pop-box"
        popper :options="curContractList" style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
        @select="onNetworkChange"
      />
      <div v-else class="bg-tg-secondary-dark text-tg-text-white h-[40px] rounded-[4px] px-[10px] text-center font-semibold leading-[40px]">
        {{ currentNetworkLabel }}
      </div>
    </div>
    <!-- 表单 -->
    <AppLoading v-if="isDataLoading" />
    <template v-else>
      <template v-if="curContractList && curContractList.length">
        <!-- 有银行卡 -->
        <template v-if="addrOptions.length">
          <BaseLabel :label="t('withdraw_address1')" must-small>
            <BaseSelect
              ref="addressSelectRef"
              v-model="address"
              class="select1" popper-clazz="deep-mode wallet-pop-box" :options="addrOptions" popper :border="true" :placeholder="t('withdraw_address1')"
              style="--tg-base-select-popper-style-padding-y: 9.5px;--tg-base-select-popper-style-padding-x:10px;" :msg="addressMsg" show-placeholder
            >
              <template #popper="{ hide }">
                <div class="bg scroll-y wallet-pop-content flex flex-col gap-[16px] py-[16px] pl-[8px] pr-[4px]" :style="{ width: `${width}px` }">
                  <div
                    v-for="item in addrOptions" :key="item.value"
                    class="h-[20px] w-full flex items-center justify-between gap-[12px] text-[14px] font-semibold leading-[20px]"
                    :class="{ 'text-tg-text-blue': item.value === address, 'text-line': item.value !== address }" @click="onAddressClick(item, hide)"
                  >
                    <span class="scroll-hidden inline-flex grow items-center" :class="item.disabled ? 'cursor-not-allowed text-[#AEAFB1]' : 'cursor-pointer '">
                      <span class="overflow-hidden text-ellipsis whitespace-nowrap" :class="item.disabled ? 'max-w-[88%]' : ''">{{ item.label }}</span>
                      <span v-if="item.disabled" class="ml-[10px] text-[12px] font-semibold text-[#E91134]">{{ t('baned') }}</span>
                    </span>
                    <div class="flex items-center gap-[4px] text-[14px]">
                      <BaseButton type="text" size="none" @click.stop="toEdit(item, hide)">
                        <div
                          class="flex items-center px-[6px] py-[10px]"
                          :class="item.disabled ? 'cursor-not-allowed opacity-[0.5] ' : 'cursor-pointer '"
                        >
                          <IconEditActive style="color:var(--tg-secondary-main);" />
                        </div>
                      </BaseButton>
                      <BaseButton type="text" size="none" @click.stop="hide();toDeleteVirAddress(item)">
                        <div class="flex items-center px-[6px] py-[10px]">
                          <IconUniBankDelete />
                        </div>
                      </BaseButton>
                    </div>
                  </div>
                  <div v-if="addrOptions.length < 3" class="flex justify-center">
                    <span
                      class="text-tg-text-blue inline-block cursor-pointer text-[12px] font-semibold leading-[20px] active:scale-[0.96]"
                      @click="toAddVirAddress"
                    >
                      {{ t('add_withdraw_address') }}
                    </span>
                  </div>
                </div>
              </template>
            </BaseSelect>
          </BaseLabel>
          <BaseLabel v-if="isXRP" :label="t('label')" must-small>
            <BaseInput
              ref="memoRef" v-model="memo" :msg="memoMsg" msg-after-touched :placeholder="t('label')"
            />
          </BaseLabel>
          <BaseLabel v-if="isEOS" :label="t('memorandum')">
            <BaseInput v-model="memo" :placeholder="t('memorandum')" />
          </BaseLabel>
          <BaseLabel :label="t('withdraw_amount1')" must-small>
            <BaseInput
              ref="amountRef" v-model="amount" :msg="amountMsg" type="number" msg-after-touched
              input-mode="decimal" :placeholder="t('withdraw_amount1')"
              @on-right-button="maxNumber" @blur="formatAmount"
            >
              <template #right-icon>
                <AppCurrencyIcon :currency-type="activeVirCurrency.currency_name" />
              </template>
              <template #right-button>
                <span>{{ t('input_max') }}</span>
              </template>
            </BaseInput>
            <div
              v-show="showMaxAmount && Number(withdrawBalance?.remaining_balance) > 0"
              class="text-tg-text-error-sub flex flex-col gap-[4px] pt-[8px] text-[12px]"
            >
              <div>{{ $t('withdrawal_amount') }} {{ withdrawBalance?.withdraw_balance }}</div>
              <div>
                {{ $t('withdrawals_require_turnover') }} {{ withdrawBalance?.remaining_balance }}
              </div>
            </div>
          </BaseLabel>
          <!-- <AppPasswordInput ref="passwordRef" v-model="payPassword" /> -->
          <BaseButton
            style="--tg-base-button-font-size:16px;" :loading="withdrawLoading" :disabled="withdrawLoading"
            bg-style="secondary" size="md" @click="handleWithdraw"
          >
            {{ t('confirm_submit') }}
          </BaseButton>
        </template>
        <!-- 没有绑定银行卡 -->
        <template v-else>
          <div class="box-1 w-full border-[2px] rounded-[4px] border-dashed py-[20px]">
            <div class="flex justify-center gap-[12px] px-[20px]">
              <IconUniWarningColor style="font-size: var(--tg-font-size-base);" />
              <div class="font-medium leading-[19.6px] text-light">
                <div>
                  {{ t('no_withdraw_information_about_the_currency') }}
                </div>
                <div>{{ t('bind_first_pls') }}</div>
              </div>
            </div>
          </div>
          <BaseButton style="--tg-base-button-font-size:16px;" bg-style="secondary" size="md" @click="toAddVirAddress">
            {{ t('label_bind') }}{{ t('withdraw_address') }}
          </BaseButton>
        </template>
      </template>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.select1 {
  @include webTheme('green') {
    --tg-base-select-popper-bg-color: #02432d;
  }
}
.text-line {
  @include webTheme('green') {
    color: #3cb389;
  }
  @include webTheme('white') {
    color: #555;
  }
}

.bg {
  --tg-text-secondary: #111;
}
.theme-color {
  @include webTheme('green') {
    color: #02432d;
  }
  &:hover {
    background-color: var(--tg-popper-hover-bg);
    @include webTheme('green') {
      background: #197b5980;
    }
  }
}
.scroll-hidden {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
  overflow: auto;
  white-space: nowrap;
}
.box-1 {
  background-color: var(--tg-secondary-dark);
  border-color: var(--tg-text-lightgrey);
  @include webTheme('white') {
    --tg-icon-color: #e85353;
    background-color: white;
    border-color: #e85353;
  }
}
.wallet-wrap {
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #fff;
    --tg-base-select-style-color: #111111;
    --tg-base-select-border: 2px solid #e8e8e8;
    --tg-base-select-popper-label-hover-bg-color: #e8e8e8;
    --tg-popper-bg: #e8e8e8;
  }
  @include webTheme('green') {
    --tg-body-bg: var(--tg-green-dark);
  }
}
</style>

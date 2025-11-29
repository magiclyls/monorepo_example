<!-- 钱包:存款虚拟币模块V2版本 -->

<script setup lang='ts'>
import type { IAvailableCurrency, EnumCurrencyKey, virAddreesQrcode, IPromoDetail } from '@tg/types'

import type { CurrencyCode, Merchants } from '~/composables/useCurrencyData'
import { ApiFinanceMethodListV2, ApiFinanceThirdCoinDeposit, ApiPaymentDepositBankApplication, ApiPaymentDepositBankCancel, ApiPaymentDepositBankConfirm, ApiPaymentDepositCoinApplication, ApiPaymentDepositCoinCancel, ApiPaymentDepositCoinConfirm, ApiThirdVirtualGetAddr } from '@tg/apis'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'
import { IconUniUnionpay, IconUniBack, IconUniError, IconUniWarningColor } from '@tg/icons'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: EnumCurrencyKey
}
interface ContractOption {
  label: string
  value: string
}
/** 支付通道对象 */
interface IPaymentMerchantData {
  id: string
  name: string
  amount_max: string
  amount_min: string
  amount_type: number
  amount_fixed: string
  often_amount: string
  bankcard_id: string
  method_id: string
  method_name: string
  alias: string
}

interface Props {
  currencyId: CurrencyCode // 当前的货币ID
  curMerchant: Merchants // 当前的支付通道
  curPaymentType: number // 当前的支付类型
  initVirCurrency: IAvailableCurrency // 初始化当前虚拟币
  paymentId: string // 当前的支付ID
  activeCurrency: object
  virCurrencyList: ICurrencyOption[] // 虚拟币列表
  curDepositPromo: [] // 当前支付优惠
  merchantsList?: IPaymentMerchantData // 当前支付通道列表
  initCurrentNetwork?: string // 初始化虚拟币网络
  initContractList: ContractOption[]
  initvirAddreesQrcodeData: virAddreesQrcode
}
defineOptions({
  name: 'AppDialogVirtDeposit',
})
const props = defineProps<Props>()
const emit = defineEmits(['show', 'deposit'])
const closeCurDialog = inject('closeDialog', () => { })
const languageStore = useLanguageStore()
const { brandConfig } = storeToRefs(useBrandStore())
const { userLanguage } = storeToRefs(languageStore)
const VirQrcodeMsg = ref('')
const amountRef = ref()
const step = ref(1)
const contractSelectRef = ref()
const currencySelectRef = ref()
const virtSearchValue = ref('')
/** 当前的充值优惠 */
const activeDepositPromo = ref('')
/** 当前的支付类型:1:在线支付, 2:公司入款 */
const paymentType = ref(props.curPaymentType)
const virAddreesQrcodeData = reactive(props.initvirAddreesQrcodeData)
// let tempVirAddreesQrcodeData = reactive(props.initvirAddreesQrcodeData)
/** 当前的支付ID */
const curPaymentId = ref(props.paymentId)
/** 当前的支付通道 */
const activeMerchant = ref(props.curMerchant)
const contractList = ref(props.initContractList)
/** 当前的加密货币网络 */
const currentNetwork = ref(props.initCurrentNetwork ?? '')
const activeVirtCurrency = ref(props.initVirCurrency)
const { width: contractSelectWidth } = useElementSize(contractSelectRef)
const { width: currencySelectWidth } = useElementSize(currencySelectRef)
/** 公司打款入款标记 */
const { bool: isConfirmPayment, setBool: setConfirmPayment } = useBoolean(false)
const { bool: isDisableQrcode, setTrue: setTrueQrcode, setFalse: setFalseQrcode } = useBoolean(false)
/** 标签：付款方式 or 选择银行 */
const { bool: isDataLoading } = useBoolean(false)
/** 通知消息：是否优先显示虚拟币代收付二维码 */
const showQrcodeFirst = ref(false)
const { openNotify } = useNotify()
const { updateUserInfo } = useAppStore()

const { t } = useI18n()
const strToArray = function (amounts: string, bonusMap?: Record<string, string>) {
  const temp = amounts.split(',').filter(str => str.trim() !== '')
  return temp.map((i) => {
    return {
      label: i,
      value: i,
      bonus: bonusMap?.[i] || '', // 從 bonus_map 中獲取對應的 bonus
    }
  })
}
/** 常用金额 */
const oftenAmount = computed(() => {
  return strToArray(activeMerchant.value?.often_amount ?? [], activeMerchant.value?.bonus_map)
})
/** 固定金额 amount_type: 1:固定, 2:范围 */
const fixedAmount = computed(() => {
  if (activeMerchant.value.amount_type === 1)
    return strToArray(activeMerchant.value?.amount_fixed ?? [], activeMerchant.value?.bonus_map)

  return []
})
const backDepositInfo: {
  address: string
  amount: string
  memo?: string
  currency_name: string
  id?: string
} = reactive({
  address: '',
  amount: '',
  currency_name: '',
  memo: '',
})
const { toFixedByLockCurrency } = useMiniGameLockCurrency()
const { openWalletDialog } = useWalletDialog({
  activeTab: 'deposit',
  initCurrency: getCurrencyConfigByCode(props.currencyId)?.name,
})
const {
  getVirContractName,
} = useCurrencyData()
/** 最小额度 */
const getMin = computed(() => {
  return Number(activeMerchant.value.amount_min)
})
/** 校验最小最大金额 */
const {
  value: amount,
  errorMessage: amountError,
  validate: amountValidate,
  resetField: amountReset,
  setValue: setAmount,
} = useField<string>('amount', (value) => {
  const Value = Number(value)
  if (!value)
    return activeMerchant.value?.amount_type === 1 ? t('select_amount') : t('input_amount')
  else if (Value < getMin.value)
    return `${t('min_amount_is')}${activeMerchant.value?.amount_min}`
  else if (activeMerchant.value?.amount_max && Value > Number(activeMerchant.value?.amount_max))
    return `${t('max_amount_is')}${activeMerchant.value?.amount_max}`
  return ''
}, { initialValue: oftenAmount.value[0]?.value })
/** 校验存款人姓名 */
const {
  value: depositName,
  errorMessage: depositNameError,
  validate: depositNameValidate,
  resetField: depositNameReset,
} = useField<string>('depositName', (value) => {
  if (!value)
    return t('pls_enter_savor_name')
  return ''
})
/** 虚拟币代收付存款地址 */
const {
  runAsync: runAsyncvirDepositAddrees,
  loading: virDepositAddreesLoading,
  data: virCurrencyDepositAddrees,
} = useRequest(ApiThirdVirtualGetAddr)
/** 下一步操作 */
const nextStep = function () {
  // emit('show', false)
  setConfirmPayment(true)
  // emit('deposit')
}
/** 公司入款存款 */
const {
  run: runPaymentDepositBankApplication,
  data: paymentDepositBankInfo,
  loading: paymentDepositBankInfoLoading,
} = useRequest(ApiPaymentDepositBankApplication, {
  onSuccess() {
    nextStep()
    handleDeposit()
  },
})
/** 上一步操作 */
const previous = function () {
  emit('show', true)
  amountReset()
  depositNameReset()
  setConfirmPayment(false)
}
/** 公司入款存款-我已存款 */
const { run: runPaymentDepositBankConfirm, loading: paymentDepositBankConfirmLoading } = useRequest(ApiPaymentDepositBankConfirm, {
  onSuccess() {
    showNotify()
    previous()
  },
})

/** 公司入款存款-取消存款 */
const { run: runPaymentDepositBankCancel, loading: paymentDepositBankCancelLoading } = useRequest(ApiPaymentDepositBankCancel, {
  onSuccess() {
    previous()
  },
})
/** 虚拟币存款 */
const { run: runPaymentDepositCoinApplication, loading: paymentDepositCoinInfoLoading } = useRequest(ApiPaymentDepositCoinApplication, {
  onSuccess(data) {
    backDepositInfo.address = data.deposit_coin.wallet_address
    backDepositInfo.currency_name = data.deposit_coin.currency_name
    backDepositInit(data)
    // emit('deposit')
  },
})
/** 第三方支付存款 */
const {
  run: runFinanceThirdCoinDeposit,
  loading: financeThirdCoinDepositLoading,
} = useRequest(ApiFinanceThirdCoinDeposit, {
  onSuccess(data) {
    showNotify()
    backDepositInfo.address = data.address
    backDepositInit(data)
    emit('deposit')
  },
})
const {
  run: runPaymentDepositCoinConfirm,
  loading: paymentDepositCoinConfirmLoading,
} = useRequest(ApiPaymentDepositCoinConfirm, {
  onSuccess() {
    showNotify()
    cancelPayment()
  },
})
const {
  run: runPaymentDepositCoinCancel,
  loading: paymentDepositCoinCancelLoading,
} = useRequest(ApiPaymentDepositCoinCancel, {
  onSuccess() {
    cancelPayment()
  },
})
/** 支付方式V2列表 */
const {
  runAsync: runAsyncPaymentMethodList,
} = useRequest(ApiFinanceMethodListV2, {
  onSuccess() {
  },
})

/** 充值优惠列表 */
const depositPromoArray = computed(() => {
  if (props.curDepositPromo && props.curDepositPromo.length > 0) {
    return props.curDepositPromo.map((i) => {
      return {
        ...i,
        label: i.max,
        value: i.max,
        bonus: i.bonus_max,
      }
    })
  }
  else {
    return []
  }
})
const _merchantsArray = computed(() => {
  return props.merchantsList?.map((a) => {
    return {
      ...a,
      label: a.name,
      value: a.id,
    }
  })
})
/** 支付通道列表 */
const merchantsArray = ref(_merchantsArray.value)
/** 是否显示当前的支付通道 */
const ifShowMerchant = computed(() => {
  if (merchantsArray.value?.length > 1)
    return false
  else
    return true
})
/** 当前虚拟币列表 */
const _virCurrencyList = computed(() => props.virCurrencyList.filter(a => a.currency_name.includes(virtSearchValue.value.toUpperCase())))
/** 是否为虚拟币入款、隐藏通道 */
const isPaymentDepositBank = computed(() => {
  return paymentType.value === 2
})
const getAmountLimit = computed(() => {
  return (activeMerchant.value?.amount_min && activeMerchant.value?.amount_max)
    ? `${activeMerchant.value?.amount_min}-${activeMerchant.value?.amount_max}`
    : `${t('please_input_verification_amount')}`
})

/** 获取二维码数据 */
function getQrcodeData() {
  if (VirQrcodeMsg.value && Object.keys(VirQrcodeMsg.value).length > 0) {
    if (showQrcodeFirst.value) {
      setFalseQrcode()
    }
    else {
      setTrueQrcode()
      virAddreesQrcodeData.value.virDepositAddrees = ''
    }
  }
  else if (VirQrcodeMsg.value === '') {
    setFalseQrcode()
  }
  else {
    setTrueQrcode()
    virAddreesQrcodeData.value.virDepositAddrees = ''
  }
}
function checkShareQrCode(codeMsg: any) {
  // 取出所有的键
  if (codeMsg === '' || Object.keys(codeMsg).length === 0) {
    showQrcodeFirst.value = false
  }
  else {
    const msg = codeMsg
    const currencyKeys = Object.keys(msg)
    const CurrencyFindIndex = currencyKeys.includes(activeVirtCurrency.value.currency_id)
    const ContractFindIndex = getContractId(msg).includes(currentNetwork.value)
    if (CurrencyFindIndex && ContractFindIndex && virAddreesQrcodeData.value.virDepositAddrees)
      showQrcodeFirst.value = true

    else
      showQrcodeFirst.value = false
  }
}
/** 取出message里的协议编号 */
function getContractId(msg: any) {
  // 用于存储所有内层对象的键
  const innerKeys = []
  // 遍历外层对象的每一个键
  Object.keys(msg).forEach((outerKey) => {
    const innerObject = msg[outerKey]
    // 遍历内层对象的每一个键
    Object.keys(innerObject).forEach((innerKey) => {
      innerKeys.push(innerKey)
    })
  })
  return innerKeys
}
function sortPromoOptions(promoOptions: []): [] {
  return promoOptions.sort((a, b) => {
    const maxA = Number.parseFloat(a.max)
    const maxB = Number.parseFloat(b.max)
    return maxA - maxB
  })
}
/** 获取图标路径 */
function getMerchantsIconPath(type: number, str: string) {
  return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
}
function onVirtPopperHide() {
  setTimeout(() => {
    virtSearchValue.value = ''
  }, 200)
}
function handleDeposit() {
  Statistics.sendStatisticsCustomEvent(CustomStatisticsEvent.ADD_TO_CART)
  setTimeout(() => {
    updateUserInfo()
  }, 1000 * 300)
}
/** 格式化金额 */
function formatAmount() {
  if (amount.value)
    setAmount(Number.parseFloat(amount.value).toString())
}
/** 拷贝 */
const toCopy = function (item: string) {
  application.copy(item)
}
/** 格式化银行账号 */
function formatBankAccount(s: string) {
  if (s.length > 10)
    return s.replace(/(\d{4})(?=\d)/g, '$1 ')

  else
    return s.replace(/(\d{4})(?=\d)/, '$1 ').replace(/(.{8})(?=.)/, '$1 ')
}
function backDepositInit(data: { amount: string, id?: string, memo: string }) {
  backDepositInfo.amount = data.amount
  backDepositInfo.id = data.id
  backDepositInfo.memo = data.memo
  step.value = 2
  // emit('show', false)
}
function cancelPayment() {
  amountReset()
  step.value = 1
  activeDepositPromo.value = ''
  // emit('show', true)
}
async function confirmPayment() {
  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await amountValidate()
  if (!amountError.value) {
    if (paymentType.value === 1) { // 三方支付存款
      runFinanceThirdCoinDeposit({
        amount: amount.value,
        bank_code: '',
        cid: activeMerchant.value?.id ?? '',
        mid: curPaymentId.value,
        currency_id: activeVirtCurrency.value.currency_id,
        currency_name: activeVirtCurrency.value.currency_name,
        bankcard_id: activeMerchant.value?.bankcard_id ?? '',
      })
    }
    else if (paymentType.value === 2) { // 虚拟币存款(公司入款)
      runPaymentDepositCoinApplication({
        amount: amount.value,
        cid: activeMerchant.value?.id ?? '',
        currency_id: activeVirtCurrency.value.currency_id,
        currency_name: activeVirtCurrency.value.currency_name,
        mid: curPaymentId.value,
        bankcard_id: activeMerchant.value?.bankcard_id ?? '',
      })
    }
  }
}
function showNotify() {
  const type = activeVirtCurrency.value.currency_name
  openNotify({
    icon: `coin-${type.toLocaleLowerCase()}`,
    title: t('deposit_in_process'),
    message: () => h(AppMemberNotificationsMessage, {
      amount: application.formatNumDecimal(backDepositInfo.amount, currencyConfig[type].decimal),
      currencyType: type,
      keypath: 'deposit_info_going',
    }),
  })
}
/** 切换货币类型事件 */
function onVirtCurrencyChange(item: ICurrencyOption) {
  activeVirtCurrency.value = item
  const { openWalletDialog } = useWalletDialog({
    activeTab: 'deposit',
    initCurrency: getCurrencyConfigByCode(activeVirtCurrency.value.currency_id)?.name,
  })
  closeCurDialog()
  openWalletDialog()
}
/** 选择协议 */
function selectNetwork(activeValue: any) {
  currentNetwork.value = activeValue
  amountReset()
  activeDepositPromo.value = ''
  runAsyncPaymentMethodList({ currency_id: activeVirtCurrency.value.currency_id, contract_id: currentNetwork.value }).then((data) => {
    const paymentList = data.filter(item => item.merchants.filter(child => child.payment_type === paymentType.value).length > 0)
    if (paymentList.length > 0) {
      activeMerchant.value = paymentList[0].merchants.filter(item => item.payment_type === paymentType.value)[0]
      curPaymentId.value = paymentList[0].id
    }
    if (paymentType.value === 3) {
      virAddreesQrcodeData.value.virDepositRatio = paymentList[0].deposit_promo[0] === undefined ? '' : paymentList[0].deposit_promo[0].ratio
      virAddreesQrcodeData.value.virDepositMin = paymentList[0].deposit_promo[0] === undefined ? '' : paymentList[0].deposit_promo[0].min
      virAddreesQrcodeData.value.currency = activeVirtCurrency.value.currency_name
      runAsyncvirDepositAddrees({ id: paymentList[0].merchants[0].id, mid: paymentList[0].id, currency_id: activeVirtCurrency.value.currency_id }).then((data) => {
        virAddreesQrcodeData.value.virDepositAddrees = data || ''
      })
    }
  })
}

function selectCurPromo(v: any) {
  amount.value = v.value
}
function promoAmount(amount: number) {
  const bonusMax = depositPromoArray.value.length > 0 ? Number.parseFloat(depositPromoArray.value?.[depositPromoArray.value.length - 1].bonus_max) : 0
  const _amount = amount as number
  if (_amount > 0 && depositPromoArray.value.length > 0) {
    if (_amount >= Number.parseFloat(depositPromoArray.value?.[depositPromoArray.value.length - 1].min)) {
      if (depositPromoArray.value.length > 0 && bonusMax > 0) {
        const ratio = Number.parseFloat(depositPromoArray.value?.[0].ratio)
        return ratio * _amount > bonusMax ? bonusMax : ratio * _amount
      }
      else if (depositPromoArray.value.length > 0 && bonusMax === 0) {
        const ratio = Number.parseFloat(depositPromoArray.value?.[0].ratio)
        return ratio * _amount
      }
      else {
        return 0.00
      }
    }
    else {
      return 0.00
    }
  }
  else {
    return 0.00
  }
}
function getReceivedStr(amount: number) {
  const total1 = promoAmount(amount)
  /**  优惠活动列表 */
  let resultStr = total1 > 0 ? toFixedByLockCurrency(total1.toString(), activeVirtCurrency.value.currency_name) : ''

  if (activeMerchant.value.promo_cfgs && activeMerchant.value.promo_cfgs[0]) {
    const {
      bonus_type, // 1:固定金额,2:随机金额, 3:比例金额
      promo_cfgs,
    } = activeMerchant.value.promo_cfgs[0]
    const sortedCfgs = promo_cfgs.sort((a: IPromoDetail, b: IPromoDetail) => Number(a.deposit) - Number(b.deposit))
    const firstStage = sortedCfgs[0]
    const lastStage = sortedCfgs[sortedCfgs.length - 1]
    if (amount >= Number(firstStage.deposit)) {
      let currentStage
      if (amount >= Number(lastStage.deposit)) {
        currentStage = lastStage
      }
      else {
        const nextIndex = sortedCfgs.findIndex((item: IPromoDetail) => Number(item.deposit) > amount)
        currentStage = sortedCfgs[nextIndex - 1]
      }

      if (bonus_type === 1) {
        resultStr = toFixedByLockCurrency((total1 + Number(currentStage.min)).toString(), activeVirtCurrency.value.currency_name)
      }
      else if (bonus_type === 2) {
        resultStr = `${toFixedByLockCurrency((Number(currentStage.min) + total1).toString(), activeVirtCurrency.value.currency_name)}~${toFixedByLockCurrency((Number(currentStage.max) + total1).toString(), activeFiatCurrency.value.currency_name)}`
      }
      else if (bonus_type === 3) {
        resultStr = toFixedByLockCurrency((total1 + Math.min(currentStage.scale * amount / 100, currentStage.limit)).toString(), activeFiatCurrency.value.currency_name)
      }
    }
  }
  return resultStr
}
/** 是否显示虚拟币代收付存款地址 */
function handleVirQrcodeChange(msg: any) {
  VirQrcodeMsg.value = msg
}
watch(amount, (a) => {
  if (Number.isNaN(Number(a)))
    return
  activeDepositPromo.value = getReceivedStr(Number(a))
}, { immediate: true })
watch(VirQrcodeMsg, (a) => {
  checkShareQrCode(a)
  getQrcodeData()
})
onMounted(() => {
  appEventBus.on(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})
</script>

<template>
  <div class="p-[16px]">
    <div class="header flex">
      <h2 v-if="step === 1" class="flex cursor-pointer items-center font-semibold"
        @click="closeCurDialog(); openWalletDialog()">
        <IconUniBack />
        <span>{{ t('deposit') }}</span>
      </h2>
      <h2 v-if="step === 2" class="flex cursor-pointer items-center font-semibold" @click="cancelPayment()">
        <IconUniBack />
        <span>{{ t('deposit') }}</span>
      </h2>
    </div>
    <!-- 第一步 -->
    <template v-if="step === 1">
      <template v-if="paymentType === 3">
        <div class="flex flex-row items-start justify-start gap-[21px] pt-[16px]">
          <!-- 选择货币 -->
          <div class="w-1/2 flex flex-col items-start justify-between">
            <label class="text-tg-text-lightgrey text-[14px] font-semibold leading-[19.6px]">{{ t('deposit_currency') }}
              <span class="text-tg-text-error text-[12px]">*</span></label>
            <template v-if="activeVirtCurrency">
              <div v-if="_virCurrencyList.length === 1"
                class="text-tg-text-white bg-tg-secondary-dark w-full flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
                <AppCurrencyIcon icon-align="left" style="--tg-app-currency-icon-size:18px;"
                  :currency-type="activeVirtCurrency.currency_name" show-name />
              </div>
              <BaseSelect v-else v-model="activeVirtCurrency.currency_name" popper :border="false"
                :options="_virCurrencyList"
                style="--tg-base-select-popper-style-padding-x:10px;width: 100%;--tg-base-select-popper-style-padding-y:11px;"
                popper-strategy="fixed" @popper-hide="onVirtPopperHide">
                <template #label>
                  <AppCurrencyIcon icon-align="left" style="--tg-app-currency-icon-size:18px;"
                    :currency-type="activeVirtCurrency.currency_name" show-name />
                </template>
                <template #popper="{ hide }">
                  <div class="max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
                    <div class="w-full px-[10px]">
                      <BaseSearch v-model="virtSearchValue"
                        style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;" class="h-[36px]"
                        :place-holder="t('search')" white-style shape="square" />
                    </div>
                    <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                      <div v-for="fiat, in _virCurrencyList" :key="fiat.value"
                        class="text-tg-secondary h-[14px] flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold"
                        @click="hide(); onVirtCurrencyChange(fiat)">
                        <div class="flex items-center justify-between">
                          <AppCurrencyIcon :currency-type="fiat.label" show-name />
                          <span>{{ application.formatNumDecimal(fiat.balance ? fiat.balance : 0,
                            currencyConfig[fiat.currency_name].decimal) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </BaseSelect>
            </template>
          </div>
          <!-- 选择付款协议 -->
          <div class="w-1/2 flex flex-col items-start justify-between">
            <label v-if="contractList.length > 0"
              class="text-tg-text-lightgrey text-[14px] font-semibold leading-[19.6px]">{{
                t('select_network') }} <span class="text-tg-text-error text-[12px]">*</span></label>
            <div v-if="contractList && contractList.length === 1"
              class="text-tg-text-white bg-tg-secondary-dark w-full flex items-center gap-[6px] rounded-[4px] p-[13px] text-[14px] font-semibold">
              {{ getVirContractName(currentNetwork) }}
              <!-- <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeMerchant.alias.toUpperCase()" :show-name="false" /> -->
            </div>
            <BaseSelect v-if="contractList && contractList.length > 1" ref="contractSelectRef" v-model="currentNetwork"
              :options="contractList" popper
              style="--tg-base-select-popper-style-padding-x:10px;width: 100%;--tg-base-select-popper-style-padding-y:11px;">
              <template #popper="{ hide }">
                <div class="scroll-y flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]"
                  :style="{ width: `${contractSelectWidth}px` }">
                  <div v-for="itsm, in contractList" :key="itsm.value"
                    class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                    :class="{ 'text-tg-text-blue': itsm.value === currentNetwork }"
                    @click="hide(); selectNetwork(itsm.value)">
                    <span>{{ itsm.label }}</span>
                  </div>
                </div>
              </template>
            </BaseSelect>
          </div>
        </div>
      </template>
      <!-- 虚拟币代收付 -->
      <template v-else>
        <div class="flex flex-col gap-[16px] pb-[16px] pt-[16px]">
          <!-- 选择货币 -->
          <div class="flex items-center justify-between">
            <label class="text-tg-text-lightgrey text-[14px] font-semibold leading-[19.6px]">{{ t('deposit_currency') }}
              <span class="text-tg-text-error text-[12px]">*</span></label>
            <template v-if="activeVirtCurrency">
              <div v-if="_virCurrencyList.length === 1"
                class="bg-tg-secondary-dark text-tg-text-white flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
                <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;"
                  :currency-type="activeVirtCurrency.currency_name" show-name />
              </div>
              <BaseSelect v-else v-model="activeVirtCurrency.currency_name" :skidding="-28" popper :border="false"
                :options="_virCurrencyList"
                style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
                popper-strategy="fixed" @popper-hide="onVirtPopperHide">
                <template #label>
                  <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;"
                    :currency-type="activeVirtCurrency.currency_name" show-name />
                </template>
                <template #popper="{ hide }">
                  <div class="max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
                    <div class="w-full px-[10px]">
                      <BaseSearch v-model="virtSearchValue"
                        style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;" class="h-[36px]"
                        :place-holder="t('search')" white-style shape="square" />
                    </div>
                    <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                      <div v-for="fiat, in _virCurrencyList" :key="fiat.value"
                        class="text-tg-secondary h-[14px] flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold"
                        @click="hide(); onVirtCurrencyChange(fiat)">
                        <div class="flex items-center justify-between">
                          <AppCurrencyIcon :currency-type="fiat.label" show-name />
                          <span>{{ application.formatNumDecimal(fiat.balance ? fiat.balance : 0,
                            currencyConfig[fiat.currency_name].decimal) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </BaseSelect>
            </template>
          </div>
          <!-- 选择付款协议 -->
          <div class="flex items-center justify-between">
            <label v-if="contractList.length > 0"
              class="text-tg-text-lightgrey text-[14px] font-semibold leading-[19.6px]">{{
                t('select_network') }} <span class="text-tg-text-error text-[12px]">*</span></label>
            <div v-if="contractList && contractList.length === 1"
              class="text-tg-text-white bg-tg-secondary-dark flex items-center gap-[6px] rounded-[4px] p-[13px] text-[14px] font-semibold">
              {{ getVirContractName(currentNetwork) }}
              <!-- <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeMerchant.alias.toUpperCase()" :show-name="false" /> -->
            </div>
            <BaseSelect v-if="contractList && contractList.length > 1" v-model="currentNetwork" :options="contractList"
              popper style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
              @select="selectNetwork" />
            <!-- <div class="flex items-center gap-[6px] rounded-[4px] bg-tg-secondary-dark p-[13px] text-[14px] font-semibold">
            {{ getVirContractName(currentNetwork) }}
          </div> -->
          </div>
        </div>
      </template>
      <div class="flex flex-col gap-[16px] pb-[16px] pt-[16px]">
        <template v-if="paymentType === 3">
          <!-- <AppDepositVirAddressQrcode :data="virAddreesQrcodeData" /> -->
          <AppDepositVirAddressQrcode :data="virAddreesQrcodeData" :disabled="isDisableQrcode"
            :loading="virDepositAddreesLoading" />
        </template>
        <template v-else>
          <!-- 公司入款存款 -->
          <div v-if="isConfirmPayment" class="type-online-bank">
            <div class="bank-second">
              <div>
                <p class="second-title">
                  {{ t('savor_name') }}
                </p>
                <p class="copy-row" @click="toCopy(paymentDepositBankInfo?.bankcard.open_name ?? '')">
                  <span>{{ paymentDepositBankInfo?.bankcard.open_name }}</span>
                  <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
                </p>
              </div>
              <p class="copy-row" @click="toCopy(paymentDepositBankInfo?.bankcard.bank_account ?? '')">
                <span>{{
                  formatBankAccount(paymentDepositBankInfo?.bankcard.bank_account ?? '')
                  }}</span>
                <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
              </p>
              <p class="copy-row">
                <span class="center" style="gap: 8px;">
                  <IconUniUnionpay />
                  {{ paymentDepositBankInfo?.bankcard.bank_id }}
                </span>
              </p>
              <p v-if="activeVirtCurrency.currency_name === 'CNY'" class="copy-row"
                @click="toCopy(paymentDepositBankInfo?.bankcard.bank_area_cpf ?? '')">
                <span>
                  {{ t('open_addr') }}：{{ paymentDepositBankInfo?.bankcard.bank_area_cpf }}
                </span>
                <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
              </p>
              <div>
                <p class="copy-row" @click="toCopy(paymentDepositBankInfo?.amount ?? '')">
                  <span>{{ t('transfer_amount') }}：{{
                    `${paymentDepositBankInfo?.amount} ${activeVirtCurrency.currency_name}` }}</span>
                  <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
                </p>
                <p class="second-tips">
                  {{ t('transfer_amount_equal_order') }}
                </p>
              </div>
              <div class="second-btns" style="--tg-spacing-12:28px">
                <BaseButton size="md" :loading="paymentDepositBankCancelLoading" @click="runPaymentDepositBankCancel(
                  { id: paymentDepositBankInfo?.id ?? '' })">
                  {{ t('cancel_deposit') }}
                </BaseButton>
                <BaseButton bg-style="secondary" size="md" :loading="paymentDepositBankConfirmLoading" @click="runPaymentDepositBankConfirm(
                  { id: paymentDepositBankInfo?.id ?? '' })">
                  {{ t('already_deposit') }}
                </BaseButton>
              </div>
              <div class="second-tips2">
                <IconUniError />
                {{ t('confirm_transfer_ontime') }}
              </div>
            </div>
          </div>
          <!-- 三方支付存款 -->
          <div v-else class="type-other">
            <div class="other-first">
              <!-- 存款人姓名 -->
              <!-- <BaseLabel v-if="!isPaymentDepositBank" must-small :label="t('deposit_name')">
              <BaseInput
                v-model="depositName" :msg="depositNameError" :placeholder="t('pls_enter_savor_name')"
                style="--tg-base-input-style-pad-y:8.75px;"
              />
            </BaseLabel> -->
              <!-- 充值金额 -->
              <BaseLabel :label="t('deposit_amount_label')" must-small>
                <div class="flex items-center justify-between">
                  <!-- 输入金额 -->
                  <div v-if="activeMerchant.amount_type === 2" class="w-full flex">
                    <BaseInput ref="amountRef" v-model="amount" step="0.00001" :placeholder="getAmountLimit"
                      :msg="amountError" type="number" input-mode="decimal" msg-after-touched
                      clear-place-holder-on-focus @blur="formatAmount">
                      <template v-if="activeDepositPromo" #right-button>
                        <div class="text-tg-text-lightgrey w-1/3 whitespace-nowrap font-semibold">
                          {{ t('give_away') }} +{{ activeDepositPromo }}
                        </div>
                      </template>
                    </BaseInput>
                  </div>
                  <!-- 固定金额 -->
                  <div v-if="activeMerchant.amount_type === 1" class="w-full flex">
                    <div class="flex-1 flex rounded-l-[4px]" style="border:2px solid var(--tg-border-color-grey-light)">
                      <BaseSelect ref="currencySelectRef" v-model="amount" popper :border="false"
                        :placeholder="t('select_deposit_amount')" show-placeholder :options="fixedAmount"
                        style="width: 100%; --tg-base-select-popper-style-padding-y:11px;">
                        <template #popper="{ hide }">
                          <div class="scroll-y flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]"
                            :style="{ width: `${currencySelectWidth}px` }">
                            <div v-for="itsm, in fixedAmount" :key="itsm.value"
                              class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                              @click="hide(); selectCurPromo(itsm)">
                              <span>{{ itsm.label }}</span>
                            </div>
                          </div>
                        </template>
                      </BaseSelect>
                    </div>
                    <div v-if="activeDepositPromo"
                      class="text-tg-text-lightgrey bg-tg-secondary w-1/3 flex items-center justify-center whitespace-nowrap rounded-r-[4px] p-[13px] font-semibold">
                      {{ t('give_away') }} +{{ activeDepositPromo }}
                    </div>
                  </div>
                </div>
                <div v-if="amountError && activeMerchant.amount_type === 1"
                  class="text-tg-text-error-sub mt-[6px] flex items-center gap-[4px] text-[12px]">
                  <IconUniWarningColor style="--tg-icon-color:var(--tg-text-error-sub);" name="uni-warning-color" />
                  {{ amountError }}
                </div>
              </BaseLabel>
              <!-- 充值金额面板 -->
              <BaseMoneyKeyboard v-if="oftenAmount && oftenAmount.length" :currency="activeVirtCurrency.currency_id"
                v-model="amount" :options="oftenAmount" />
              <!-- 确认支付按钮 -->
              <BaseButton bg-style="secondary" size="md" style="--tg-base-button-font-size:16px;"
                :loading="paymentDepositCoinInfoLoading || financeThirdCoinDepositLoading" @click="confirmPayment">
                {{ t('confirm_pay') }}
              </BaseButton>
            </div>
          </div>
        </template>
        <AppLoading v-if="isDataLoading" />
      </div>
    </template>
    <!-- 第二步 -->
    <template v-if="step === 2">
      <div class="app-virtual-deposit mb-[16px]">
        <div class="mt-[16px] flex flex-row">
          <AppCurrencyIconV2 :show-name="true" :network="true" :currency-type="activeVirtCurrency.currency_name"
            icon-align="left">
            <template #network>
              <span class="bg-tg-secondary-dark w-[74px] rounded-[4px] px-[8px] py-[13px] text-center">
                {{ getVirContractName(currentNetwork) }}
              </span>
            </template>
          </AppCurrencyIconV2>
          <div class="grow">
            <BaseQrcode :url="backDepositInfo.address" :size="160" />
          </div>
        </div>
        <div>
          <p class="second-title font-semibold">
            {{ t('saving_address') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
          </p>
          <p class="copy-row" @click="application.copy(backDepositInfo.address)">
            <span>{{ backDepositInfo.address }}</span>
            <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
          </p>
        </div>
        <div v-if="backDepositInfo.currency_name === 'EOS' || backDepositInfo.currency_name === 'XRP'">
          <p class="second-title font-semibold">
            {{ backDepositInfo.currency_name === 'EOS' ? t('memorandum') : t('label') }}<span
              class="text-tg-text-error ml-[5px] text-[12px]">* ({{ t('required') }}{{ backDepositInfo.currency_name ===
                'XRP' ?
                t('if_not_your_funds_lost') : '' }})</span>
          </p>
          <p class="copy-row" @click="application.copy(backDepositInfo.memo ?? '')">
            <span>{{ backDepositInfo.memo }}</span>
            <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
          </p>
        </div>
        <div>
          <p class="second-title font-semibold">
            {{ t('payment_in_amount') }}<span class="text-tg-text-error ml-[5px] text-[12px]">*</span>
          </p>
          <p class="copy-row" @click="toCopy(backDepositInfo.amount)">
            <span class="flex items-center justify-start gap-[6px]">
              <AppCurrencyIcon style="--tg-app-currency-icon-size:14px;"
                :currency-type="activeVirtCurrency.currency_name" />
              {{ toFixedByLockCurrency(backDepositInfo.amount, activeVirtCurrency.currency_name) }}
            </span>
            <AppTooltip :skidding="-19" :text="t('copy_addr_suc')" icon-name="uni-doc" :triggers="['click']" />
          </p>
          <div
            class="bg-tg-secondary-dark border-tg-text-lightgrey mt-[16px] w-full border-[2px] rounded-[4px] border-dashed px-[5px] py-[10px]">
            <div class="flex gap-[5px]">
              <IconUniWarningColor style="font-size: var(--tg-font-size-base);" />
              <div class="font-medium" :class="[userLanguage === 'th-TH' ? 'leading-[23.6px]' : 'leading-[19.6px]']">
                <div class="text-tg-text-lightgrey">
                  {{ t('note_check_address_is_completed') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="backDepositInfo.id" class="box-btn" style="--tg-spacing-12:28px">
          <BaseButton size="md" :loading="paymentDepositCoinCancelLoading"
            @click="runPaymentDepositCoinCancel({ id: backDepositInfo.id ?? '' })">
            {{ t('cancel_deposit') }}
          </BaseButton>
          <BaseButton bg-style="secondary" size="md" :loading="paymentDepositCoinConfirmLoading"
            @click="runPaymentDepositCoinConfirm({ id: backDepositInfo.id ?? '' })">
            {{ t('already_payment') }}
          </BaseButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped>
.type-online-bank {
  .bank-second {
    display: flex;
    flex-direction: column;
    gap: var(--tg-spacing-16);
  }

  .bank-second {
    .second-title {
      margin-bottom: var(--tg-spacing-4);
      color: var(--tg-text-lightgrey);
    }

    .copy-row {
      max-width: 100%;
      border-radius: var(--tg-radius-default);
      border: 1px solid var(--tg-secondary-main);
      padding: var(--tg-spacing-12) var(--tg-spacing-12);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--tg-text-white);
      cursor: pointer;
      font-weight: 600;
      background-color: var(--tg-secondary-dark);
    }

    .second-tips {
      color: var(--tg-text-error);
      font-size: var(--tg-font-size-xs);
      margin-top: var(--tg-spacing-4);
    }

    .second-btns {
      display: flex;
      gap: var(--tg-spacing-12);

      button {
        width: 100%;
      }
    }

    .second-tips2 {
      display: flex;
      justify-content: left;
      align-items: center;
      color: var(--tg-text-error);
      font-size: var(--tg-font-size-xs);
      gap: 0.25rem;
    }
  }
}

.type-other {
  .other-first {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.app-virtual-deposit {
  display: flex;
  flex-direction: column;
  gap: var(--tg-spacing-16);
  --tg-select-placeholder-color: var(--tg-text-lightgrey);

  .second-title {
    margin-bottom: var(--tg-spacing-4);
    color: var(--tg-text-lightgrey);
  }

  .copy-row {
    max-width: 100%;
    border-radius: var(--tg-radius-default);
    border: 1px solid var(--tg-secondary-main);
    padding: var(--tg-spacing-12) var(--tg-spacing-12);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--tg-text-white);
    cursor: pointer;
    background-color: var(--tg-secondary-main);
    word-break: break-all;
  }

  .copy-row span {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.05em;
  }

  .warn-msg {
    line-height: 1;
    color: var(--tg-text-error);
    font-size: var(--tg-font-size-xs);
    font-weight: 500;
    margin-top: var(--tg-spacing-4);
  }

  .box-btn {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: var(--tg-spacing-12);
  }

  .not-payment-msg {
    gap: 16px;

    .msg-warp {
      display: flex;
      width: 100%;
      gap: var(--tg-spacing-4);
      justify-content: center;
      padding: 27px 12px;
      border: var(--tg-border-width-sm) dashed var(--tg-secondary-light);
      border-radius: var(--tg-radius-sm);
      background-color: var(--tg-secondary-dark);
      font-size: var(--tg-font-size-default);
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--tg-spacing-12);
  font-size: var(--tg-font-size-lg);
  touch-action: none;

  h2 {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--tg-spacing-4);
    font-size: var(--tg-font-size-base);
    line-height: 24px;

    >span {
      font-weight: var(--tg-font-weight-semibold);
    }
  }
}
</style>

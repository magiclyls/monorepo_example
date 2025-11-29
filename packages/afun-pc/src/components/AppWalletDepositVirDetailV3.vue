<script setup lang="ts">
import { IconUniWarningColor } from '@tg/icons'

import type { EnumCurrencyKey, IAvailableCurrency, IPromoDetail } from '@tg/types'

import type { Merchants } from '~/composables/useCurrencyData'
import { ApiFinanceMethodListV2, ApiFinanceThirdCoinDeposit, ApiPaymentDepositCoinApplication, ApiThirdVirtualGetAddr } from '@tg/apis'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: EnumCurrencyKey
}
interface ContractOption {
  label: string
  value: string
}
defineOptions({
  name: 'AppWalletDepositVirDetailV3',
})
const { t } = useI18n()
const router = useLocalRouter()
const route = useRoute()
const { toFixedByLockCurrency } = useMiniGameLockCurrency()
const { balanceData } = storeToRefs(useAppStore())
/** 标签：付款方式 or 选择银行 */
const { bool: isDataLoading } = useBoolean(false)
const { openNotify } = useNotify()

const contractSelectRef = ref()
const currencySelectRef = ref()
const { width: contractSelectWidth } = useElementSize(contractSelectRef)
const { width: currencySelectWidth } = useElementSize(currencySelectRef)
const { bool: isDisableQrcode, setTrue: setTrueQrcode, setFalse: setFalseQrcode } = useBoolean(false)
const VirQrcodeMsg = ref('')
const amountRef = ref()
const virtSearchValue = ref('')
/** 当前的充值优惠 */
const activeDepositPromo = ref('')
/** 当前的支付类型:1:在线支付, 2:公司入款 */
const routeData = (Local.get(STORAGE_WALLET_ROUTE)?.value as any[])?.[0]
const { curPaymentType, paymentId, initCurrentNetwork } = routeData
const paymentType = ref(routeData.curPaymentType as unknown as number)
const virAddreesQrcodeData = ref(JSON.parse((routeData?.initvirAddreesQrcodeData || '{}') as string))
const activeMerchant = ref(JSON.parse((routeData?.curMerchant || '{}') as string))
const contractList = ref(JSON.parse((routeData?.initContractList || '{}') as string))
const activeVirtCurrency = ref(JSON.parse((routeData?.initVirCurrency || '{}') as string))
const curDepositPromo = ref(JSON.parse((routeData?.curDepositPromo || '[]') as string))

const curPaymentId = ref(paymentId as string)
const currentNetwork = ref(initCurrentNetwork)
const virCurrencyList = ref(JSON.parse((routeData?.virCurrencyList || '[]') as string))
/** 通知消息：是否优先显示虚拟币代收付二维码 */
const showQrcodeFirst = ref(false)
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
const {
  getVirContractName,
} = useCurrencyData()
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
  return strToArray(activeMerchant.value?.often_amount ?? '', activeMerchant.value?.bonus_map)
})
/** 固定金额 amount_type: 1:固定, 2:范围 */
const fixedAmount = computed(() => {
  if (activeMerchant.value.amount_type === 1)
    return strToArray(activeMerchant.value?.amount_fixed ?? '', activeMerchant.value?.bonus_map)

  return []
})

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
/** 虚拟币代收付存款地址 */
const {
  runAsync: runAsyncvirDepositAddrees,
  loading: virDepositAddreesLoading,
} = useRequest(ApiThirdVirtualGetAddr)

/** 虚拟币存款 */
const { run: runPaymentDepositCoinApplication, loading: paymentDepositCoinInfoLoading } = useRequest(ApiPaymentDepositCoinApplication, {
  onSuccess(data) {
    backDepositInfo.address = data.deposit_coin.wallet_address
    backDepositInfo.currency_name = data.deposit_coin.currency_name
    backDepositInfo.amount = data.amount
    backDepositInfo.id = data.id
    backDepositInfo.memo = data.memo
    amountReset()

    Local.push(STORAGE_WALLET_ROUTE, {
      currencyType: 'virtual',
      curPaymentType: paymentType.value,
      activeCurrency: JSON.stringify(activeVirtCurrency.value),
      currentNetwork: currentNetwork.value,
      backDepositInfo: JSON.stringify(backDepositInfo),
    })
    router.push('/center/deposit/submit')
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
    backDepositInfo.amount = data.amount
    backDepositInfo.memo = ''
    amountReset()
    Local.push(STORAGE_WALLET_ROUTE, {
      currencyType: 'virtual',
      curPaymentType: paymentType.value,
      activeCurrency: JSON.stringify(activeVirtCurrency.value),
      currentNetwork: currentNetwork.value,
      backDepositInfo: JSON.stringify(backDepositInfo),
    })
    router.push('/center/deposit/submit')

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
  if (curDepositPromo.value && curDepositPromo.value.length > 0) {
    return curDepositPromo.value.map((i) => {
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
/** 当前虚拟币列表 */
const _virCurrencyList = computed(() => virCurrencyList.value.filter(a => a.currency_name.includes(virtSearchValue.value.toUpperCase())))

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
  const innerKeys: string[] = []
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
function onVirtPopperHide() {
  setTimeout(() => {
    virtSearchValue.value = ''
  }, 200)
}
/** 格式化金额 */
function formatAmount() {
  if (amount.value)
    setAmount(Number.parseFloat(amount.value).toString())
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
  router.back({
    activeSubTab: 'virtual',
    initCurrency: getCurrencyConfigByCode(activeVirtCurrency.value.currency_id)?.name,
  })
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
        resultStr = `${toFixedByLockCurrency((Number(currentStage.min) + total1).toString(), activeVirtCurrency.value.currency_name)}~${toFixedByLockCurrency((Number(currentStage.max) + total1).toString(), activeVirtCurrency.value.currency_name)}`
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
watch(balanceData, (val) => {
  if (val && val.uid)
    virCurrencyList.value = virCurrencyList.value.map(v => ({ ...v, balance: val[v.currency_name] }))
})
onMounted(() => {
  appEventBus.on(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})
</script>

<template>
  <template v-if="paymentType === 3">
    <div class="select-line flex flex-row items-start justify-start gap-[21px]">
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
              <div class="bg max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
                <div class="w-full px-[10px]">
                  <BaseSearch v-model="virtSearchValue"
                    style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                    class="base-search-icon-color h-[36px]" :place-holder="t('search')" white-style shape="square" />
                </div>
                <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                  <div v-for="fiat, in _virCurrencyList" :key="fiat.value"
                    class="text-tg-text-secondary h-[14px] flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold"
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
    <div class="flex flex-col gap-[16px] pb-[16px]">
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
          <BaseSelect v-else v-model="activeVirtCurrency.currency_name" class="theme-select" :skidding="-28" popper
            :border="false" :options="_virCurrencyList" popper-strategy="fixed" @popper-hide="onVirtPopperHide">
            <template #label>
              <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;"
                :currency-type="activeVirtCurrency.currency_name" show-name />
            </template>
            <template #popper="{ hide }">
              <div class="bg max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
                <div class="w-full px-[10px]">
                  <BaseSearch v-model="virtSearchValue"
                    style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                    class="base-search-icon-color h-[36px]" :place-holder="t('search')" white-style shape="square" />
                </div>
                <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                  <div v-for="fiat, in _virCurrencyList" :key="fiat.value"
                    class="text-tg-text-secondary h-[14px] flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold"
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
        </div>
        <BaseSelect v-if="contractList && contractList.length > 1" v-model="currentNetwork" class="theme-select"
          :options="contractList" popper :is-pay-theme="true" @select="selectNetwork" />
      </div>
    </div>
  </template>
  <div class="flex flex-col gap-[16px] pt-[16px]">
    <template v-if="paymentType === 3">
      <AppDepositVirAddressQrcode class="theme-border pay-theme" :data="virAddreesQrcodeData"
        :disabled="isDisableQrcode" :loading="virDepositAddreesLoading" />
      <AppAuthWarp />
    </template>
    <template v-else>
      <!-- 三方支付存款 -->
      <div class="type-other">
        <div class="other-first">
          <!-- 充值金额 -->
          <BaseLabel :label="t('deposit_amount_label')" must-small>
            <div class="w-full flex items-center justify-between">
              <!-- 输入金额 -->
              <div v-if="activeMerchant.amount_type === 2" class="w-full flex">
                <BaseInput ref="amountRef" v-model="amount" step="0.00001" :placeholder="getAmountLimit"
                  :msg="amountError" type="number" input-mode="decimal" msg-after-touched clear-place-holder-on-focus
                  class="theme-amount-input" @blur="formatAmount">
                  <template v-if="activeDepositPromo" #right-button>
                    <div class="theme-give-away w-1/3 whitespace-nowrap font-semibold">
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
                  class="text-tg-text-lightgrey bg-tg-secondary flex items-center justify-center whitespace-nowrap rounded-r-[4px] p-[13px] font-semibold">
                  {{ t('give_away') }} +{{ activeDepositPromo }}
                </div>
              </div>
            </div>
            <div v-if="amountError && activeMerchant.amount_type === 1"
              class="text-tg-text-error-sub mt-[6px] flex items-center gap-[4px] text-[12px]">
              <IconUniWarningColor style="color:var(--tg-text-error-sub);" />
              {{ amountError }}
            </div>
          </BaseLabel>
          <!-- 充值金额面板 -->
          <BaseMoneyKeyboard v-if="oftenAmount && oftenAmount.length" :currency="activeVirtCurrency.currency_id"
            v-model="amount" class="keyboard" :options="oftenAmount" />
          <!-- 确认支付按钮 -->
          <BaseButton bg-style="primary" size="md" style="--tg-base-button-font-size:16px;"
            :loading="paymentDepositCoinInfoLoading || financeThirdCoinDepositLoading" @click="confirmPayment">
            {{ t('confirm_pay') }}
          </BaseButton>
        </div>
      </div>
    </template>
    <AppLoading v-if="isDataLoading" />
  </div>
</template>

<style lang='scss' scoped>
.theme-give-away {
  color: var(--tg-text-lightgrey);

  @include webTheme('green') {
    color: #fff;
  }
}

.select-line {
  @include webTheme('green') {
    --tg-base-select-popper-bg-color: #02432d;
  }
}

.theme-amount-input {
  @include webTheme('green') {
    --tg-base-input-right-button-bg: #0e6746;
    --tg-base-input-right-button-hover-bg: #0e6746;
  }
}

.theme-select {
  --tg-base-select-popper-style-padding-x: 10px;
  --tg-base-select-popper-style-padding-y: 11px;

  @include webTheme('green') {
    --tg-base-select-popper-bg-color: #02432d;
    // --tg-base-select-popper-label-hover-bg-color:#013725;
    // border: 1px solid #02432D;
    // border-radius: 4px;
    // &:hover{
    //   border: 1px solid #197B59;
    // }
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

.keyboard {
  @include webTheme('white') {
    --base-money-keyboard-bg: #ffffff;
    --base-money-keyboard-border: #e8e8e8;
  }
}

.theme-border {
  @include webTheme('green') {
    --tg-secondary-main: #197b59;
  }

  @include webTheme('white') {
    --tg-secondary-main: #e8e8e8;
    --tg-copy-row-border-color: #e8e8e8;
    --app-deposit-vir-address-qrcode-text-color: #555555;
  }
}

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

<script setup lang="ts">
import type { IAvailableCurrency, IPromoDetail } from '@tg/types'
import { IconUniWarningColor } from '@tg/icons'

import { ApiFinanceThirdDeposit, ApiPaymentDepositBankApplication, ApiPaymentDepositBankList } from '@tg/apis'
import AppMemberNotificationsMessage from '~/components/AppMemberNotificationsMessage.vue'

interface DiscountInfo {
  pname: string
  promo: string
  ptype: number
}
interface Props {
  paymentMethodList: any
  activeCurrency: IAvailableCurrency
}
defineOptions({
  name: 'AppWalletDepositPayPanel',
})
const props = defineProps<Props>()
const { t } = useI18n()
const customRouter = useCustomRouter()
const { toFixedByLockCurrency } = useMiniGameLockCurrency()
const appStore = useAppStore()
const { balanceData, isCompleteKYC } = storeToRefs(appStore)
const { userLanguage } = storeToRefs(useLanguageStore())
const closeCurDialog = inject('closeDialog', () => { })
const { updateUserInfo } = useAppStore()
const { openNotify } = useNotify()
const router = useLocalRouter()
const { runGetFinanceDepositCurrencyData } = useCurrencyData()
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()

const curTabRef = ref<Array<Element | null>>([])
/** 支付方式列表 */
const paymentMethodList = ref(props.paymentMethodList)
/** 当前支付方式 */
const curPaymentMethod = ref(paymentMethodList.value[0])
const merchantsList = ref(paymentMethodList.value[0].merchants)
/** 选择的支付通道 */
const activeMerchant = ref(merchantsList.value[0])
/** 当前优惠信息 */
const curDiscountInfo = ref<DiscountInfo>({
  pname: paymentMethodList.value[0].pname,
  promo: paymentMethodList.value[0].promo,
  ptype: paymentMethodList.value[0].ptype,
})
/** 当前的充值优惠 */
const curDepositPromo = ref(curPaymentMethod.value.deposit_promo)
const initzkId = ref(curPaymentMethod.value.zkId)
const initHaveBank = ref(curPaymentMethod.value.bank)
/** 当前的支付类型:1:在线支付, 2:公司入款 */
const paymentType = ref(curPaymentMethod.value.payment_type)
/** 当前的支付ID */
const curPaymentId = ref(curPaymentMethod.value.id)
const amountRef = ref()
const activeFiatCurrency = ref(props.activeCurrency)
/** 标签：付款方式 or 选择银行 */
// const currentPaymentLable = ref(paymentType.value === 2 ? activeFiatCurrency.value.currency_name === 'BRL' ? t('select_deposit_type') : t('select_deposit_bank') : t('select_deposit_method'))
/** 当前的充值优惠 */
const activeDepositPromo = ref('')
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
const currencySelectRef = ref()
const { width: currencySelectWidth } = useElementSize(currencySelectRef)
const typeSelectRef = ref()

const amountSelectRef = ref()
const { width: amountSelectWidth } = useElementSize(amountSelectRef)
/** 总控ID */
const zkId = ref(initzkId.value)
/** 当前支付通道是否有银行 */
const haveBank = ref(initHaveBank.value)
/** 常用金额 */
const oftenAmount = ref(activeMerchant.value && strToArray(activeMerchant.value?.often_amount ?? '', activeMerchant.value?.bonus_map))
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
/** 检测是否选择银行 */
const {
  value: curPaymentBank,
  errorMessage: curBankError,
  validate: curBankValidate,
} = useField<string>('curPaymentBank', (value) => {
  if (!value)
    return t('validate_msg_choose_bank')
  return ''
}, { initialValue: '' })
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
/** 第三方支付存款 */
const {
  runAsync: runAsyncThirdDeposit,
  loading: thirdDepositLoading,
} = useRequest(ApiFinanceThirdDeposit)
/** 公司入款存款 */
const {
  run: runPaymentDepositBankApplication,
  data: paymentDepositBankInfo,
  loading: paymentDepositBankInfoLoading,
} = useRequest(ApiPaymentDepositBankApplication, {
  onSuccess() {
    depositNameReset()
    amountReset()
    activeDepositPromo.value = ''
    customRouter.push('/deposit/detail/submit', {
      currencyType: 'fiat',
      curPaymentType: paymentType.value,
      curMerchant: activeMerchant.value,
      paymentDepositBankInfo: paymentDepositBankInfo.value,
      activeFiatCurrency: activeFiatCurrency.value,
    })
    handleDeposit()
  },
})
/** 银行列表请求 */
const {
  run: runPaymentDepositBankList,
  data: paymentDepositBankList,
} = useRequest(ApiPaymentDepositBankList)
/** 固定金额 */
const fixedAmount = computed(() => {
  if (activeMerchant.value.amount_type === 1)
    return strToArray(activeMerchant.value?.amount_fixed ?? [], activeMerchant.value?.bonus_map)

  return []
})
/** 充值优惠列表 */
const depositPromoArray = computed(() => {
  if (curDepositPromo.value && curDepositPromo.value.length > 0) {
    return curDepositPromo.value.map((i: { max: any, bonus_max: any }) => {
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

const merchantsArray = computed(() => {
  return merchantsList.value?.map((a: { name: any, id: any }) => {
    return {
      ...a,
      label: a.name,
      value: a.id,
    }
  })
})
/** 支付通道列表 */
// const merchantsArray = ref(_merchantsArray.value)

/** 银行列表数据 */
const paymentDepositBankData = computed(() => {
  if (paymentDepositBankList.value) {
    return paymentDepositBankList.value.map((i) => {
      return {
        label: i.name,
        value: i.id,
      }
    })
  }
  return []
})
/** 是否为法币入款、隐藏通道 */
const isPaymentDepositBank = computed(() => {
  return paymentType.value === 2
})
const getAmountLimit = computed(() => {
  return `${activeMerchant.value?.amount_min}-${activeMerchant.value?.amount_max}`
})

/** 获取图标路径 */
function getMerchantsIconPath(type: number, item: object) {
  let str = (item as { alias: string }).alias
  if (str === 'qb') {
    str = (item as { zk_id: string }).zk_id
    return `/payment/deposit/${str}.webp`
  }
  else {
    return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
  }
}
/** 初始化银行列表 */
async function initData() {
  if (haveBank.value) {
    return Promise.allSettled([
      runPaymentDepositBankList({ id: zkId.value }),
    ])
  }
  appStore.updateUserInfo()
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
    setAmount(Number.parseInt(amount.value).toString())
}
async function depositSubmit() {
  /** 增加kyc逻辑 */
  if (isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  if (amountRef.value)
    amountRef.value.setTouchTrue()
  /** 校验金额 */
  await amountValidate()
  /** 校验银行 */
  if (haveBank.value)
    await curBankValidate()
  /** 校验存款人姓名 */
  await depositNameValidate()

  if (amountError.value
    || (haveBank.value && curBankError.value)
    || (isPaymentDepositBank.value && depositNameError.value)
  ) {
    return
  }

  /** 进行请求 */
  if (isPaymentDepositBank.value && !depositNameError.value) { // 公司入款存款
    runPaymentDepositBankApplication({
      amount: amount.value,
      cid: activeMerchant.value?.id ?? '',
      mid: curPaymentId.value,
      currency_id: activeFiatCurrency.value.currency_id,
      currency_name: activeFiatCurrency.value.currency_name,
      realname: depositName.value,
      bankcard_id: activeMerchant.value?.bankcard_id ?? '',
    })
  }
  else { // 三方支付存款
    if (isMiBrowser()) {
      runAsyncThirdDeposit({
        amount: amount.value, // 存款金额
        cid: activeMerchant.value?.id ?? '', // 支付通道ID
        mid: curPaymentId.value, // 支付方式ID
        bank_code: curPaymentBank.value, // 银行编号
        currency_id: activeFiatCurrency.value.currency_id, // 当前货币ID
        currency_name: activeFiatCurrency.value.currency_name, // 当前货币名称
      }).then((data: string) => {
        window.open(data, '_blank')
      })
    }
    else {
      const newWindow = window.open('', '_blank')

      if (!newWindow)
        return
      runAsyncThirdDeposit({
        amount: amount.value, // 存款金额
        cid: activeMerchant.value?.id ?? '', // 支付通道ID
        mid: curPaymentId.value, // 支付方式ID
        bank_code: curPaymentBank.value, // 银行编号
        currency_id: activeFiatCurrency.value.currency_id, // 当前货币ID
        currency_name: activeFiatCurrency.value.currency_name, // 当前货币名称
      }).then((data) => {
        /* closeCurDialog()
        Local.set(STORAGE_FIAT_CURRENCY_DEPOSIT_URL, data)
        router.push('/deposit-details') */
        newWindow.location.href = data
      }).catch(() => newWindow.close())
    }
  }
}
function showNotify(amount?: string) {
  const type = activeFiatCurrency.value?.currency_name
  openNotify({
    icon: `coin-${type.toLocaleLowerCase()}`,
    title: t('deposit_in_process'),
    message: () => h(AppMemberNotificationsMessage, {
      amount: application.formatNumDecimal(amount ?? paymentDepositBankInfo.value?.amount ?? 0, currencyConfig[type].decimal),
      currencyType: type,
      keypath: 'deposit_info_going',
      class: 'cur-in-notify',
    }),
  })
}
/** 选择当前的支付方式 */
function selectPaymentMethod(item: any) {
  depositNameReset()
  amountReset()
  activeDepositPromo.value = ''
  curPaymentMethod.value = item
  merchantsList.value = item.merchants
  paymentType.value = item.payment_type
  activeMerchant.value = merchantsList.value[0]
  curDiscountInfo.value = { pname: item.pname, promo: item.promo, ptype: item.ptype }
  oftenAmount.value = strToArray(activeMerchant.value?.often_amount ?? [], activeMerchant.value?.bonus_map)
}
/** 选择当前的支付通道 */
function selectMerchant(item: any, i?: number) {
  depositNameReset()
  amountReset()
  activeDepositPromo.value = ''
  activeMerchant.value = item
  activeMerchant.value = merchantsArray.value?.filter((a: { id: any }) => a.id === activeMerchant.value.id)[0] || {}
  oftenAmount.value = strToArray(activeMerchant.value?.often_amount ?? [], activeMerchant.value?.bonus_map)
  if (i !== undefined) {
    nextTick(() => {
      curTabRef.value[i]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    })
  }
}
function selectCurPromo(v: any) {
  amount.value = v.value
}
function selectBank(v: ISelectOptionString) {
  curPaymentBank.value = v.value
}
/** 将数字1-20转换成罗马数字 */
function toRoman(num: number) {
  const roman: string[] = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX']
  return roman[num - 1]
}

/** PIX显示为PIX-I,PIX-II */
function showPixName(alias: string, name: string, i: number) {
  if (alias === 'PIX' || alias === 'pix')
    return `${alias.toUpperCase()} - ${toRoman(i + 1)}`

  return name
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
  let resultStr = total1 > 0 ? toFixedByLockCurrency(total1.toString(), activeFiatCurrency.value.currency_name) : ''

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
        resultStr = toFixedByLockCurrency((total1 + Number(currentStage.min)).toString(), activeFiatCurrency.value.currency_name)
      }
      else if (bonus_type === 2) {
        resultStr = `${toFixedByLockCurrency((Number(currentStage.min) + total1).toString(), activeFiatCurrency.value.currency_name)}~${toFixedByLockCurrency((Number(currentStage.max) + total1).toString(), activeFiatCurrency.value.currency_name)}`
      }
      else if (bonus_type === 3) {
        resultStr = toFixedByLockCurrency((total1 + Math.min(currentStage.scale * amount / 100, currentStage.limit)).toString(), activeFiatCurrency.value.currency_name)
      }
    }
  }
  return resultStr
}
watch(amount, (a) => {
  if (Number.isNaN(Number(a)))
    return
  activeDepositPromo.value = getReceivedStr(Number(a))
}, { immediate: true })
// 余额有变化，打码信息更新
watch(() => balanceData.value, () => {
  runGetFinanceDepositCurrencyData()
})
await application.allSettled([initData()])
</script>

<template>
  <div class="mb-[16px] flex flex-col gap-[16px]">
    <!-- 选择支付方式 -->
    <template v-if="paymentMethodList.length === 1 && merchantsArray?.length === 1">
      <div class="flex items-center justify-between">
        <label class="text-tg-text-lightgrey w-1/2 text-[14px] font-semibold leading-[19.6px]">{{ t('pay_methods') }}
          <span class="text-tg-text-error text-[12px]">*</span></label>
        <div class="bg-tg-secondary-dark flex items-center gap-[6px] rounded-[4px] p-[11px] text-[14px] font-semibold">
          <span class="max-w-[80px] min-w-[42px] overflow-hidden text-ellipsis whitespace-nowrap">{{
            paymentMethodList[0].name }}</span>
          <BaseImage width="18px" height="18px"
            :url="getMerchantsIconPath(paymentMethodList[0].payment_type, paymentMethodList[0].merchants[0])" is-network
            flex-shrink />
        </div>
      </div>
    </template>
    <div v-if="paymentMethodList?.length > 1" class="flex items-center justify-between">
      <label class="text-tg-text-lightgrey w-1/2 text-[14px] font-semibold leading-[19.6px]">{{ t('pay_methods') }}
        <span class="text-tg-text-error ml-[5px] text-[12px]">*</span></label>
      <BaseSelect ref="currencySelectRef" v-model="curPaymentMethod.id" popper-strategy="fixed" popper :border="false"
        :options="paymentMethodList"
        style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;">
        <template #label>
          <div class="w-full flex items-center gap-[6px] text-[14px] font-semibold">
            <span class="max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap">{{ curPaymentMethod.name
              }}</span>
            <BaseImage width="18px" height="18px"
              :url="getMerchantsIconPath(curPaymentMethod.payment_type, curPaymentMethod.merchants[0])" is-network />
          </div>
        </template>
        <template #popper="{ hide }">
          <div class="scroll-y max-h-[180px] max-w-[125px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
            <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
              <div v-for="item, in paymentMethodList" :key="item.value"
                class="w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                @click="hide(); selectPaymentMethod(item)">
                <BaseImage width="18px" height="18px" :url="getMerchantsIconPath(item.payment_type, item)"
                  :shrink0="true" is-network />
                <span class="w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </template>
      </BaseSelect>
    </div>
    <!-- 选择类型:支付方式为在线支付的情况下 -->
    <template v-if="paymentType === 1">
      <div v-if="merchantsArray?.length > 1" class="overflow-hidden">
        <div class="scroll-x flex flex-row items-center justify-start gap-[8px]">
          <button v-for="item, i in merchantsArray" :key="item.value" :ref="el => curTabRef[i] = (el as Element)"
            class="btCustomer" :class="{ active: item.value === activeMerchant.id }" @click="selectMerchant(item, i)">
            {{ showPixName(item.alias, item.name, i) }}
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="merchantsArray?.length > 1" class="flex items-center justify-between">
        <label class="text-tg-text-lightgrey w-1/2 text-[14px] font-semibold leading-[19.6px]">{{
          t('select_deposit_type') }} <span class="text-tg-text-error ml-[5px] text-[12px]">*</span></label>
        <!-- <template v-if="merchantsArray.length === 1">
          <div class="flex items-center gap-[6px] rounded-[4px] bg-tg-secondary-dark p-[11px] text-[14px] font-semibold">
            <span class="w-[80px] overflow-hidden text-ellipsis whitespace-nowrap">{{ merchantsArray[0].name }}</span>
            <BaseImage width="18px" height="18px" :url="getMerchantsIconPath(merchantsArray[0].payment_type, merchantsArray[0])" is-network flex-shrink />
          </div>
        </template> -->
        <BaseSelect ref="typeSelectRef" v-model="activeMerchant.id" popper-strategy="fixed" popper :border="false"
          :options="merchantsArray"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;">
          <template #label>
            <div class="w-full flex items-center gap-[6px] text-[14px] font-semibold">
              <span class="w-[60px] overflow-hidden text-ellipsis whitespace-nowrap">{{ activeMerchant.name }}</span>
              <BaseImage width="18px" height="18px"
                :url="getMerchantsIconPath(activeMerchant.payment_type, activeMerchant)" is-network />
            </div>
          </template>
          <template #popper="{ hide }">
            <div class="scroll-y max-h-[180px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
              <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                <div v-for="item, in merchantsArray" :key="item.value"
                  class="w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                  @click="hide(); selectMerchant(item)">
                  <BaseImage width="18px" height="18px" :url="getMerchantsIconPath(item.payment_type, item)"
                    :shrink0="true" is-network />
                  {{ item.name }}
                </div>
              </div>
            </div>
          </template>
        </BaseSelect>
      </div>
    </template>
    <!-- 选择银行 -->
    <BaseLabel v-if="haveBank" :label="t('bank_choose')" must-small>
      <BaseSelect ref="currencySelectRef" v-model="curPaymentBank" :options="paymentDepositBankData"
        :placeholder="t('validate_msg_choose_bank')" :msg="curBankError" popper show-placeholder
        style="--tg-base-select-style-padding-y:8.5px;--tg-base-select-popper-style-padding-y:9px" :border="true">
        <template #popper="{ hide }">
          <div class="scroll-y max-h-[270px] flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]"
            :style="{ width: `${currencySelectWidth}px` }">
            <div v-for="itsm, in paymentDepositBankData" :key="itsm.value"
              class="w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
              @click="hide(); selectBank(itsm)">
              <span>{{ itsm.label }}</span>
            </div>
          </div>
        </template>
      </BaseSelect>
    </BaseLabel>
    <!-- 三方支付存款 -->
    <div class="type-other">
      <div class="other-first">
        <!-- 存款人姓名 -->
        <BaseLabel v-if="isPaymentDepositBank" must-small :label="t('deposit_name')">
          <BaseInput v-model="depositName" :msg="depositNameError" :placeholder="t('pls_enter_savor_name')"
            style="--tg-base-input-style-pad-y:8.75px;"
            :style="[userLanguage === 'th-TH' && '--tg-base-input-line-height: 1.7']" />
        </BaseLabel>
        <!-- 充值金额 -->
        <BaseLabel :label="t('deposit_amount_label')" must-small>
          <div class="flex items-center justify-between">
            <!-- 输入金额 -->
            <div v-if="activeMerchant.amount_type === 2" class="w-full flex">
              <BaseInput ref="amountRef" v-model="amount" :placeholder="getAmountLimit" :msg="amountError" type="number"
                input-mode="decimal" msg-after-touched clear-place-holder-on-focus style="--tg-font-size-default:16px;"
                @blur="formatAmount">
                <template v-if="activeDepositPromo" #right-button>
                  <div class="text-tg-text-lightgrey w-1/3 whitespace-nowrap">
                    {{ t('give_away') }} +{{ activeDepositPromo }}
                  </div>
                </template>
              </BaseInput>
            </div>
            <!-- 固定金额 -->
            <div v-if="activeMerchant.amount_type === 1" class="w-full flex">
              <div class="flex-1 flex rounded-l-[4px]" style="border:2px solid var(--tg-border-color-grey-light)">
                <BaseSelect ref="amountSelectRef" v-model="amount" popper :border="false"
                  :placeholder="t('select_deposit_amount')" show-placeholder :options="fixedAmount"
                  style="width: 100%; --tg-base-select-popper-style-padding-y:9px;--tg-base-select-style-font-size:16px;">
                  <template #popper="{ hide }">
                    <div class="scroll-y max-h-[190px] flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]"
                      :style="{ width: `${amountSelectWidth}px` }">
                      <div v-for="itsm, in fixedAmount" :key="itsm.value"
                        class="w-full flex cursor-pointer items-center gap-[6px] text-[16px] font-semibold"
                        @click="hide(); selectCurPromo(itsm)">
                        <span>{{ itsm.label }}</span>
                      </div>
                    </div>
                  </template>
                </BaseSelect>
              </div>
              <div v-if="activeDepositPromo"
                class="text-tg-text-lightgrey bg-tg-secondary w-2/5 flex items-center justify-center whitespace-nowrap rounded-r-[4px] p-[13px] font-bold">
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
        <BaseMoneyKeyboard v-if="oftenAmount && oftenAmount.length" v-model="amount" :is-show-icon="true"
          :is-border="false" :discount-info="curDiscountInfo" :options="oftenAmount"
          :currency="activeFiatCurrency.currency_id" />
        <!-- 确认支付按钮 -->
        <BaseButton bg-style="secondary" size="md" :loading="thirdDepositLoading || paymentDepositBankInfoLoading"
          style="--tg-base-button-font-size: 16px;" @click="depositSubmit">
          {{ t('confirm_pay') }}
        </BaseButton>
      </div>
    </div>
  </div>
  <!-- 内容区-end -->
</template>

<style lang='scss' scoped>
.type-other {
  .other-first {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.btCustomer {
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid var(--tg-border-color-grey-light);
  color: #ffffff;
  padding: 6px 26px;
  margin-bottom: 6px;
  white-space: nowrap;
}

.btCustomer.active {
  background-color: #0f212e;
  border: 1px solid var(--tg-text-blue);
}
</style>

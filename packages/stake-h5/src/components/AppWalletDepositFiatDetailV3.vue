<script setup lang="ts">
import { IconUniRefresh, IconUniWarningColor } from '@tg/icons'
import type { IAvailableCurrency, EnumCurrencyKey, IPromoDetail } from '@tg/types'
import type { Merchants } from '~/composables/useCurrencyData'
import { ApiFinanceThirdDeposit, ApiPaymentDepositBankApplication, ApiPaymentDepositBankList } from '@tg/apis'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: EnumCurrencyKey
}
defineOptions({
  name: 'AppWalletDepositFiatDetailV3',
})
const visibility = useDocumentVisibility()
const { t } = useI18n()
const customRouter = useCustomRouter()
const { toFixedByLockCurrency } = useMiniGameLockCurrency()
const appStore = useAppStore()
const { userInfo, isLogin, balanceData, uPayBalance, loadingUpayBalance, uPayUrl, loadingUpayUrl, readyGetUpayBalance, upayBalErrCode, isCompleteKYC } = storeToRefs(appStore)
const { userLanguage } = storeToRefs(useLanguageStore())
const closeCurDialog = inject('closeDialog', () => { })
const { updateUserInfo } = useAppStore()
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { bool: isDataLoading } = useBoolean(false)
const { openNotify } = useNotify()
const router = useLocalRouter()
const { depositCurrencyList, runGetFinanceDepositCurrencyData } = useCurrencyData()
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()

const merchantsList = ref(customRouter.query.merchantsList as unknown as Merchants[])
const curMerchant = ref(customRouter.query.curMerchant as unknown as Merchants)
const curDepositPromo = ref(customRouter.query.curDepositPromo as unknown as Merchants[])
const initzkId = ref(customRouter.query.initzkId as string)
const initHaveBank = ref(customRouter.query.initHaveBank as unknown as boolean)
/** 当前的支付类型:1:在线支付, 2:公司入款 */
const paymentType = ref(customRouter.query.curPaymentType as unknown as number)
/** 当前的支付ID */
const curPaymentId = ref(customRouter.query.paymentId as string)
const amountRef = ref()
const activeFiatCurrency = ref(customRouter.query.initFiatCurrency as unknown as IAvailableCurrency)
/** 标签：付款方式 or 选择银行 */
const currentPaymentLable = ref(paymentType.value === 2 ? activeFiatCurrency.value.currency_name === 'BRL' ? t('select_deposit_type') : t('select_deposit_method') : t('select_deposit_method'))
const fiatSearchValue = ref('')
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
const amountSelectRef = ref()
const { width: amountSelectWidth } = useElementSize(amountSelectRef)
/** 总控ID */
const zkId = ref(initzkId.value)
/** 当前支付通道是否有银行 */
const haveBank = ref(initHaveBank.value)
/** 当前的支付通道 */
const activeMerchant = ref(curMerchant.value)
/** 常用金额 */
const oftenAmount = ref(curMerchant.value && strToArray(curMerchant.value?.often_amount ?? '', activeMerchant.value?.bonus_map))
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
    return `${t('min_amount_is')} ${activeMerchant.value?.amount_min}`
  else if (activeMerchant.value?.amount_max && Value > Number(activeMerchant.value?.amount_max))
    return `${t('max_amount_is')}${activeMerchant.value?.amount_max}`
  return ''
}, { initialValue: oftenAmount.value[0]?.value })

const uPayPwdRef = ref()
/** 内嵌模式 upay */
const isEmbed = computed(() => !!(activeMerchant.value && activeMerchant.value.embedded && +activeMerchant.value.embedded === 1))
/** U币密码 */
const {
  value: uPayPwd,
  errorMessage: uPayPwdError,
  validate: uPayPwdValidate,
  resetField: uPayPwdReset,
  setValue: setuPayPwd,
} = useField<string>('uPayPwd', (value) => {
  // if (isEmbed.value && !value)
  //   return t('pls_enter_u_pwd')
  return ''
})

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
    uPayPwdReset()
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

const _merchantsArray = computed(() => {
  return merchantsList.value?.map((a) => {
    return {
      ...a,
      label: a.name,
      value: a.id,
    }
  })
})
/** 支付通道列表 */
const merchantsArray = ref(_merchantsArray.value)
/** 法币列表 */
const fiatCurrencyList = computed(() => {
  if (depositCurrencyList.value) {
    return depositCurrencyList.value.filter(a => !application.isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name,
        value: b.currency_name,
      }
    })
  }
  return []
})
/** 当前法币列表 */
const _fiatCurrencyList = computed(() => fiatCurrencyList.value.filter(a => a.currency_name.includes(fiatSearchValue.value.toUpperCase())))
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

/** 是否已经绑定 upay 账号 */
const hasBindUpayAccount = computed(() => true)

let upayRefreshTimer: any
function refreshUpayBalance() {
  if (loadingUpayBalance.value || loadingUpayUrl.value)
    return
  if (readyGetUpayBalance.value) {
    clearTimeout(upayRefreshTimer)
    upayRefreshTimer = setTimeout(() => {
      appStore.runGetUpayBalance()
    }, upayBalErrCode.value === '5024' ? 2000 : 0)
  }
}

function goBuyUpay() {
  if (loadingUpayUrl.value)
    return

  if (readyGetUpayBalance.value && hasBindUpayAccount.value) {
    let newWindow: any
    if (!isMiBrowser())
      newWindow = window.open('', '_blank')
    appStore.runGetUpayUrl().then((uu) => {
      console.log('uPayUrl.value === ', uPayUrl.value, uu)

      if (isMiBrowser()) {
        window.open(uu)
      }
      else {
        if (!newWindow)
          return
        newWindow.location.href = uu ?? ''
      }
    })
  }
  else {
    // toAddBankcards()
  }
}

const upayBalanceNum = computed(() => uPayBalance.value?.Balance)

function onFiatPopperHide() {
  setTimeout(() => {
    fiatSearchValue.value = ''
  }, 200)
}
/** 获取图标路径 */
/* function getMerchantsIconPath(type: number, str: string) {
  return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
} */
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
const isEmbedPending = ref(false)
async function depositSubmit() {
  /** 增加自我排除逻辑 */
  if (userInfo.value?.exclude === 1) {
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
    return
  }
  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  if (amountRef.value)
    amountRef.value.setTouchTrue()
  /** 校验金额 */
  await amountValidate()
  if (isEmbed.value) {
    if (uPayPwdRef.value)
      uPayPwdRef.value.setTouchTrue()
    await uPayPwdValidate()
  }
  /** 校验银行 */
  if (haveBank.value)
    await curBankValidate()
  /** 校验存款人姓名 */
  await depositNameValidate()

  if (amountError.value
    || (haveBank.value && curBankError.value)
    || (isPaymentDepositBank.value && depositNameError.value)
    || (isEmbed.value && uPayPwdError.value)
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
    if (isEmbed.value) {
      if (hasBindUpayAccount.value) {
        if (upayBalanceNum.value && +upayBalanceNum.value > 0) {
          runAsyncThirdDeposit({
            amount: amount.value, // 存款金额
            cid: activeMerchant.value?.id ?? '', // 支付通道ID
            mid: curPaymentId.value, // 支付方式ID
            bank_code: curPaymentBank.value, // 银行编号
            currency_id: activeFiatCurrency.value.currency_id, // 当前货币ID
            currency_name: activeFiatCurrency.value.currency_name, // 当前货币名称
            extra: uPayPwd.value,
          }).then((data: string) => {
            isEmbedPending.value = true
            // upay 不用打开窗口，status true 提示 下单成功就行
            // setTimeout(() => {
            //   appStore.runGetUpayBalance()
            // }, 1000)
          }).catch((err) => {
            try {
              const msg = JSON.parse(err?.message)
              if (msg && msg.data && msg.data === '5023')
                goBuyUpay()
            }
            catch {

            }
          })
        }
        else {
          openNotify({
            type: 'error',
            title: t('deposit_fail'),
            message: t('balance_not_enough'),
          })
          goBuyUpay()
        }
      }
      else {
        openNotify({
          type: 'error',
          message: t('pls_bind_acc_first'),
        })
      }
      return
    }
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
/** 切换货币类型事件 */
function onFiatCurrencyChange(item: ICurrencyOption) {
  activeFiatCurrency.value = item
  customRouter.back({
    activeSubTab: 'fiat',
    initCurrency: getCurrencyConfigByCode(activeFiatCurrency.value.currency_id)?.name,
  })
  // emit('changeCurrency', item.currency_name)
}
/** 选择当前的支付通道 */
function selectMerchant(item: any) {
  depositNameReset()
  amountReset()
  uPayPwdReset()
  activeDepositPromo.value = ''
  activeMerchant.value = item
  activeMerchant.value = merchantsArray.value?.filter(a => a.id === activeMerchant.value.id)[0] || {}
  oftenAmount.value = strToArray(activeMerchant.value?.often_amount ?? [], activeMerchant.value?.bonus_map)
}
function selectCurPromo(v: any) {
  amount.value = v.value
}
function selectBank(v: ISelectOptionString) {
  curPaymentBank.value = v.value
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

onActivated(() => {
  isEmbedPending.value = false
  appStore.runGetUpayBalance()
})

watch(amount, (a) => {
  if (Number.isNaN(Number(a)))
    return
  activeDepositPromo.value = getReceivedStr(Number(a))
}, { immediate: true })
// 余额有变化，打码信息更新
watch(() => balanceData.value, () => {
  runGetFinanceDepositCurrencyData()
  setTimeout(() => {
    if (readyGetUpayBalance.value)
      appStore.runGetUpayBalance()
  }, 1000)
})
watch(upayBalanceNum, () => {
  setTimeout(() => {
    isEmbedPending.value = false
    amountReset()
    uPayPwdReset()
  }, 500)
})

watch(visibility, (newValue) => {
  if (newValue === 'visible') {
    if (readyGetUpayBalance.value) {
      setTimeout(() => {
        appStore.runGetUpayBalance()
      }, 1000)
    }
  }
})

await application.allSettled([initData()])
</script>

<template>
  <div class="flex flex-col gap-[16px] pb-[16px]">
    <!-- 选择货币 -->
    <div class="flex items-center justify-between">
      <label class="theme-white-diff text-tg-text-lightgrey text-[14px] font-semibold leading-[19.6px]">{{
        t('deposit_currency') }} <span class="text-tg-text-error text-[12px]">*</span></label>
      <template v-if="activeFiatCurrency">
        <div v-if="_fiatCurrencyList.length === 1"
          class="text-tg-text-white bg-tg-secondary-dark flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
          <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;"
            :currency-type="activeFiatCurrency.currency_name" show-name />
        </div>
        <BaseSelect v-else v-model="activeFiatCurrency.currency_name" class="theme-select" :skidding="-28" popper
          :border="false" popper-strategy="fixed" :options="_fiatCurrencyList"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
          @popper-hide="onFiatPopperHide">
          <template #label>
            <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;"
              :currency-type="activeFiatCurrency.currency_name" show-name />
          </template>
          <template #popper="{ hide }">
            <div class="bg3 max-h-[368px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
              <div class="w-full px-[10px]">
                <BaseSearch v-model="fiatSearchValue"
                  style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                  class="base-search-icon-color h-[36px]" :place-holder="t('search')" white-style shape="square" />
              </div>
              <div class="scroll-y w-full flex flex-col">
                <div v-for="fiat, in _fiatCurrencyList" :key="fiat.value"
                  class="theme-color text-tg-text-secondary flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[10px] text-[14px] font-semibold"
                  @click="hide(); onFiatCurrencyChange(fiat)">
                  <div class="flex items-center justify-between">
                    <AppCurrencyIcon :currency-type="fiat.label" show-name />
                    <span>{{ fiat.balance }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </BaseSelect>
      </template>
    </div>
    <!-- 选择付款方式 -->
    <div v-if="merchantsArray?.length > 0" class="flex items-center justify-between">
      <label class="theme-white-diff text-tg-text-lightgrey w-1/2 text-[14px] font-semibold leading-[19.6px]">{{
        currentPaymentLable }} <span class="text-tg-text-error text-[12px]">*</span></label>
      <template v-if="merchantsArray.length === 1">
        <div class="bg1 flex items-center gap-[6px] rounded-[4px] p-[11px] text-[14px] font-semibold">
          {{ activeMerchant.name }}
          <BaseImage width="18px" height="18px" :url="getMerchantsIconPath(paymentType, activeMerchant)" is-network
            flex-shrink />
        </div>
      </template>
      <template v-else>
        <BaseSelect ref="currencySelectRef" v-model="activeMerchant.id" class="theme-select" popper-strategy="fixed"
          popper :border="false" :options="merchantsArray"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;">
          <template #label>
            <div class="w-full flex items-center gap-[6px] text-[14px] font-semibold">
              {{ activeMerchant.name }}
              <BaseImage width="18px" height="18px" :url="getMerchantsIconPath(paymentType, activeMerchant)"
                is-network />
            </div>
          </template>
          <template #popper="{ hide }">
            <div class="bg3 scroll-y max-h-[180px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
              <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                <div v-for="item, in merchantsArray" :key="item.value"
                  class="w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                  @click="hide(); selectMerchant(item)">
                  <BaseImage width="18px" height="18px" :url="getMerchantsIconPath(paymentType, item)" :shrink0="true"
                    is-network />
                  {{ item.name }}
                </div>
              </div>
            </div>
          </template>
        </BaseSelect>
      </template>
    </div>
    <!-- 选择银行 -->
    <BaseLabel v-if="haveBank" :label="t('bank_choose')" must-small>
      <BaseSelect ref="currencySelectRef" v-model="curPaymentBank" class="theme-select"
        :options="paymentDepositBankData" :placeholder="t('validate_msg_choose_bank')" :msg="curBankError" popper
        show-placeholder style="--tg-base-select-style-padding-y:8.5px;--tg-base-select-popper-style-padding-y:9px"
        :border="true">
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
    <div v-if="isEmbed" class="min-h-[32px] flex items-center justify-between">
      <div class="flex items-center text-[14px] font-semibold">
        <span class="mr-[4px]">{{ t('u_pay_balance') }}</span>
        <AppAmount v-if="readyGetUpayBalance" class="text-white" currency-type="CNY"
          :amount="uPayBalance?.Balance ?? '0.00'" reverse />
        <span v-else class="text-tg-text-white mr-[4px]">{{ t('get_fail') }}</span>
        <div class="flex cursor-pointer items-center justify-center"
          :class="[loadingUpayBalance || loadingUpayUrl ? 'ani-roll-2' : '']" @click="refreshUpayBalance">
          <IconUniRefresh />
        </div>
      </div>
      <BaseButton :loading="loadingUpayUrl" class="buy-btn min-w-[78px] flex items-center justify-center"
        style="--tg-base-button-min-width:78px" bg-style="secondary" size="none" @click="goBuyUpay">
        <template #loadingText>
          <div class="h-[32px] px-[8px] text-[14px] font-semibold leading-[32px]">
            <!-- <template v-if="loadingBankcard">
              <div class="h-[32px] px-[8px] text-[14px] font-semibold leading-[32px]">
                ...
              </div>
            </template>
    <template v-else> -->
            {{ readyGetUpayBalance && hasBindUpayAccount ? `+${t('add_bug_u')}` : t('bing_account_label') }}
            <!-- </template> -->
          </div>
        </template>
      </BaseButton>
    </div>
    <!-- 三方支付存款 -->
    <div class="type-other">
      <div class="other-first saving-box">
        <!-- 存款人姓名 -->
        <BaseLabel v-if="isPaymentDepositBank" must-small :label="t('deposit_name')" style="margin-bottom: 20px">
          <BaseInput v-model="depositName" :msg="depositNameError" :placeholder="t('pls_enter_savor_name')"
            style="--tg-base-input-style-pad-y:8.75px;"
            :style="[userLanguage === 'th-TH' && '--tg-base-input-line-height: 1.7', 'marginTop:4px']" />
        </BaseLabel>
        <!-- 充值金额 -->
        <BaseLabel :label="t('deposit_amount_label')" must-small>
          <div class="flex items-center justify-between">
            <!-- 输入金额 -->
            <div v-if="activeMerchant && activeMerchant.amount_type === 2" class="w-full flex">
              <BaseInput ref="amountRef" v-model="amount" :placeholder="getAmountLimit" :msg="amountError" type="number"
                input-mode="decimal" clear-place-holder-on-focus msg-after-touched style="margin-top: 4px"
                @blur="formatAmount">
                <template v-if="activeDepositPromo" #right-button>
                  <div class="text-tg-text-lightgrey w-1/3 whitespace-nowrap">
                    {{ t('give_away') }} +{{ activeDepositPromo }}
                  </div>
                </template>
              </BaseInput>
            </div>
            <!-- 固定金额 -->
            <div v-if="activeMerchant && activeMerchant.amount_type === 1" class="w-full flex">
              <div class="flex-1 flex rounded-l-[4px]" style="border:2px solid var(--tg-border-color-grey-light)">
                <BaseSelect ref="amountSelectRef" v-model="amount" popper :border="false"
                  :placeholder="t('select_deposit_amount')" show-placeholder :options="fixedAmount"
                  style="width: 100%; --tg-base-select-popper-style-padding-y:9px;" class="theme-select grey-select">
                  <template #popper="{ hide }">
                    <div class="bg3 scroll-y max-h-[190px] flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]"
                      :style="{ width: `${amountSelectWidth}px` }">
                      <div v-for="itsm, in fixedAmount" :key="itsm.value"
                        class="w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                        @click="hide(); selectCurPromo(itsm)">
                        <span>{{ itsm.label }}</span>
                      </div>
                    </div>
                  </template>
                </BaseSelect>
              </div>
              <div v-if="activeDepositPromo"
                class="text-tg-text-lightgrey bg2 w-1/3 flex items-center justify-center whitespace-nowrap rounded-r-[4px] p-[13px] font-bold">
                {{ t('give_away') }} +{{ activeDepositPromo }}
              </div>
            </div>
          </div>
          <div v-if="amountError && activeMerchant && activeMerchant.amount_type === 1"
            class="text-tg-text-error-sub mt-[6px] flex items-center gap-[4px] text-[12px]">
            <IconUniWarningColor style="color:var(--tg-text-error-sub);" />
            {{ amountError }}
          </div>
        </BaseLabel>
        <!-- U币密码 -->
        <BaseLabel v-if="isEmbed" :label="t('u_pay_pwd')" class="mt-[16px]">
          <div class="flex items-center justify-between">
            <div class="w-full flex">
              <BaseInput ref="uPayPwdRef" v-model="uPayPwd" :placeholder="t('pls_enter_u_pwd')" :msg="uPayPwdError"
                clear-place-holder-on-focus msg-after-touched type="password" />
            </div>
          </div>
        </BaseLabel>
        <!-- 充值金额面板 -->
        <BaseMoneyKeyboard v-if="oftenAmount && oftenAmount.length" v-model="amount" class="keyboard"
          :options="oftenAmount" :currency="activeFiatCurrency.currency_id" />
        <!-- 确认支付按钮 -->
        <BaseButton v-if="isEmbedPending" bg-style="secondary" size="md" loading
          class="mt-[16px] flex items-center justify-center gap-[5px]">
          <template #loadingText>
            <span>{{ t('on_deposit') }}</span>
          </template>
        </BaseButton>
        <BaseButton v-else bg-style="secondary" class="mt-[16px]" size="md"
          :loading="thirdDepositLoading || paymentDepositBankInfoLoading" @click="depositSubmit">
          {{ t('confirm_pay') }}
        </BaseButton>
      </div>
    </div>
    <AppLoading v-if="isDataLoading" />
  </div>
  <!-- 内容区-end -->
</template>

<style lang='scss' scoped>
.theme-select {
  @include webTheme('green') {
    --tg-base-select-popper-bg-color: #02432d;
  }
}

.base-search-icon-color {
  @include webTheme('white') {
    --tg-base-search-icon-color: #c1c1c1;
    --tg-base-search-icon-border-color: #c1c1c1;
    --tg-text-grey-light: #555555;
    --tg-secondary-main: #555555;
  }
}

.bg3 {
  --tg-text-secondary: #111;
}

.bg1 {
  background-color: var(--tg-secondary-dark);

  @include webTheme('white') {
    background-color: var(--tg-secondary-grey);
  }
}

.bg2 {
  background-color: var(--tg-secondary-main);

  @include webTheme('white') {
    background-color: #e8e8e8;
  }
}

.grey-select {
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #f5f5f5;
  }
}

.theme-color {
  &:hover {
    background-color: var(--tg-popper-hover-bg);

    @include webTheme('green') {
      background: #ffefb0;
    }
  }
}

:deep(.buy-btn .content) {
  display: none !important;
}

:deep(.buy-btn .loading-icon) {
  margin-left: 8px !important;
}

.type-other {
  .other-first {
    display: flex;
    flex-direction: column;

    @include webTheme('green') {
      --tg-base-input-right-button-bg: #0e6746;
      --tg-text-lightgrey: #ffffff;
    }
  }
}

.saving-box {
  @include webTheme('white') {
    --base-money-keyboard-active-border: var(--tg-tab-item-active);
    --base-money-keyboard-item-svg-bg: var(--tg-tab-item-active);
    --base-money-keyboard-bg: #ffffff;
    --base-money-keyboard-border: #e8e8e8;
  }

  .keyboard {
    margin-top: 16px;
    grid-gap: 15px;
  }
}
</style>

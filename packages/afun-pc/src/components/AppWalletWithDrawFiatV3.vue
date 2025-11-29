<!-- 提款法币V3.0-首页 -->
<script setup lang="ts">
import { IconEditActive, IconUniBankDelete, IconUniRefresh, IconUniWarningColor } from '@tg/icons'
import type { IAvailableCurrency, BankCard, EnumCurrencyKey, IWithdrawBankOrWalletItem, CurrencyCode,ISortedListItem } from '@tg/types'

import { ApiFinanceWithdraw, ApiFinanceWithdrawBalance, ApiFinanceWithdrawBankcard, ApiFinanceWithdrawFeeInfo, ApiFinanceWithdrawMethodList } from '@tg/apis'
import AppMemberNotificationsMessage from './AppMemberNotificationsMessage.vue'
import {indiaPhoneReg,ifscReg,indiaCardReg,indiaUPIReg} from '~/utils/regexp'

type TWithdrawCurrencyList = IAvailableCurrency & ISortedListItem
interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: EnumCurrencyKey
}
interface BankCardOption extends BankCard {
  label: string
  value: string
  disabled: boolean
}
interface IBankOption extends IWithdrawBankOrWalletItem {
  label: string
  value: string
  icon: string
  is_default: number
  withdraw_type_id: string
}

interface Props {
  /* 可取款法币列表 */
  fiatCurrencyList: TWithdrawCurrencyList[]
}

defineOptions({
  name: 'AppWalletWithDrawFiatV3',
})
const emit = defineEmits(['loaded'])
const props = defineProps<Props>()
const visibility = useDocumentVisibility()
const { t } = useI18n()
const router = useLocalRouter()
const route = useRoute()
const appStore = useAppStore()
const { isLogin, userInfo, balanceData, readyGetUpayBalance, currentGlobalCurrency,uPayBalance, loadingUpayBalance, loadingUpayUrl, uPayUrl, upayBalErrCode, isCompleteKYC } = storeToRefs(appStore)
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { bool: isDataLoading } = useBoolean(false)
const { openNotify } = useNotify()
const { bool: showMaxAmount, setBool: setMaxAmount } = useBoolean(false)
const { openDeleteConfirm } = useDeleteConfirmDialog()
const { openPromptDialog } = useDialogPrompt()
const { brandAmount } = storeToRefs(useBrandStore())
const { getRealNameFromUserInfoByFiatCurrencyId } = useCurrencyData()
const { withdrawCurrencyList } = useCurrencyData()
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()

/** 获取当前货币可提款额度 */
const { runAsync: runWithdrawBalance, data: withdrawBalance } = useRequest(ApiFinanceWithdrawBalance)

/** 当前选中的货币 */
const activeFiatCurrency = ref()
/** 当前取款类型:银行卡 | 钱包 | 支付宝 */
const currentWithdrawId = ref('')

/** 货币搜索值 */
const fiatSearchValue = ref('')

/** 银行卡下拉ref */
const bankCardSelectRef = ref()
const { width } = useElementSize(bankCardSelectRef)
const currentWithdrawType = computed(() => {
  return withdrawTypeListOptions.value.find(item => item.value === currentWithdrawId.value)?.type
})
/** 金额输入框ref */
const amountRef = ref()
const isIndiaCard = computed(() => {
  // 印度货币
  return activeFiatCurrency.value?.currency_id === '703'
})
/** 法币列表 */
const fiatCurrencyList = computed(() => {
  if (withdrawCurrencyList.value.length) {
    return withdrawCurrencyList.value.filter(a => !application.isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name as EnumCurrencyKey,
        value: b.currency_name as EnumCurrencyKey,
      }
    })
  }
  return []
})
/** 搜索法币列表 */
const fiatCurrencyListOptions = computed(() => fiatCurrencyList.value.filter(a => a.currency_name.includes(fiatSearchValue.value.toUpperCase())))
/** 当前取款类型: 银行卡 */
const isBankCardType = computed(() => currentWithdrawType.value === 1)
/** 当前取款类型: 支付宝 */
const isAlipayType = computed(() => currentWithdrawType.value === 2 && !isIndiaCard.value)
/** 当前取款类型: 钱包支付 */
const isThreePartyWalletType = computed(() => currentWithdrawType.value === 3)
/** 最大提款额 */
const getMaxAmount = computed(() => application.formatNumDecimal(withdrawBalance.value?.withdraw_balance ?? 0, 0, 0)) // currencyConfig[activeFiatCurrency.value?.currency_name].decimal
/** 最低提款额 */
const minWithdraw = computed(() => Number(brandAmount.value ? brandAmount.value[`c${activeFiatCurrency.value?.currency_id}`].w ?? 0 : 0))
/** 巴西货币使用pix */
const isPix = computed(() => {
  if (activeFiatCurrency.value)
    return activeFiatCurrency.value.currency_id === '702'
  return false
})
const selectTitle = computed(() => {
  if (isBankCardType.value)
    return isPix.value ? t('pix_type') : t('bank_name')

  else
    return t('withdraw_wallet')
})
const accountTitle = computed(() => {
  if (isBankCardType.value)
    return isPix.value ? t('withdraw_account1') : t('bank_account')

  else if (isAlipayType.value)
    return t('alipay_account')

  else
    return t('withdraw_account1')
})
/** 表单组件校验 */
const { value: bankNameId, errorMessage: bankNameIdErr, setValue: setBankNameId, validate: valiBankNameId, resetField: resetBankNameId } = useField<string>('bankNameId', (v) => {
  if (!v)
    return isPix.value ? t('validate_msg_choose_pix_account_type') : isBankCardType.value ? t('choose_draw_bank') : isThreePartyWalletType.value ? t('select_withdraw_wallet_pls') : ''
  return ''
}, { initialValue: '' })
const { value: currentBankId, errorMessage: bankIdErr, setValue: setBankId, validate: valiBankId, resetField: resetBankId } = useField<string>('account', (v) => {
  if (!v)
    return isPix.value ? t('pls_select_pix') : isAlipayType.value ? t('select_alipay_pls') : isBankCardType.value ? t('select_bank_account_pls') : t('select_withdraw_bank_account_pls')
  return ''
}, { initialValue: '' })
const { value: amount, errorMessage: amountError, validate: amountValidate, setValue: setAmount, resetField: amountReset } = useField<string>('amount', (value) => {
  if (!value) {
    return t('input_amount')
  }
  else if (Number(value) === 0) {
    return `${t('validate_amount')}0`
  }
  else if (Number(value) < minWithdraw.value) {
    return `${t('min_amount_is')}${application.formatNumDecimal(minWithdraw.value, 0, 0)}` // currencyConfig[activeFiatCurrency.value?.currency_name].decimal
  }
  else if (value && Number(value) > Number(withdrawBalance.value?.withdraw_balance)) {
    setAmount(getMaxAmount.value)
    setMaxAmount(true)
  }
  return ''
})

/** 获取取款列表 */
const { runAsync: runAsyncWithdrawMethodList, data: withdrawMethodList } = useRequest(ApiFinanceWithdrawMethodList)
/** 获取已经绑定银行卡和钱包, 支持的取款类型, */
const { runAsync: runAsyncWithdrawBankcard, data: allTypeBankcardData, loading: loadingBankcard } = useRequest(ApiFinanceWithdrawBankcard)
/** 获取取款次数 */
const { runAsync: runAsyncWithdrawFeeInfo } = useRequest(ApiFinanceWithdrawFeeInfo)
/** 发起提款 */
const { runAsync: runWithdraw, loading: withdrawLoading } = useRequest(ApiFinanceWithdraw, {
  onSuccess(data, params) {
    const type =  activeFiatCurrency.value?.currency_name
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
    appStore.getBalanceData()
  },
})

/** 支持的取款类型 银行卡或者钱包或者支付宝  */
const allWithdrawType = computed(() => allTypeBankcardData.value?.w || [])
/** 所有出款方式支持已经绑定的银行或钱包只取接口b的值 */
const allMemberBankOrWallet = computed(() => {
  const data: any[] = allTypeBankcardData.value?.b || []
  if (data.length > 0) {
    const allWithdrawTypeIds = allWithdrawType.value.map(a => a.id)
    return data.filter(w => allWithdrawTypeIds.includes(w.withdraw_type_id))
      .map((a) => {
        return {
          ...a,
          label: a.bank_name,
          value: `${a.bank_id}`,
          icon: `/webp/bank/${a.bank_id}.webp`,
        }
      })
  }
  return []
})
/** 所有出款方式支持已经绑定的银行或钱包（包含禁用状态）,需要从接口d键和b键中取重叠的值 */
const allTypeBankcardListOptions = computed(() => {
  if (allTypeBankcardData.value && allTypeBankcardData.value.d) {
    const allMemberBankOrWalletIds = allMemberBankOrWallet.value.map(w => w.bank_id)
    const allWithdrawTypeIds = allWithdrawType.value.map(a => a.id)
    return allTypeBankcardData.value.d.filter((item) => {
      return allWithdrawTypeIds.includes(item.type_id) && allMemberBankOrWalletIds.includes(item.bank_id)
    }).map((a) => {
      return {
        ...a,
        label: a.bank_account,
        value: a.id,
        disabled: a.state === 2,
      }
    })
  }
  return []
})
/** 是否已经绑定 upay 账号 */
const hasBindUpayAccount = computed(() => true) // allTypeBankcardListOptions.value?.filter(item => item.api_file_name === 'upayhutong_cny_withdraw').length > 0
/** 支持的取款类型(allWithdrawType 添加自定义属性 ) */
const withdrawTypeListOptions = computed(() => {
  return allWithdrawType.value.map((w) => {
    return {
      ...w,
      label: w.name,
      value: w.id,
      icon: `/payment/deposit/${w.alias}.webp`,
      cardCount: allTypeBankcardListOptions.value.filter(b => b.type_id === w.id).length,
    }
  })
})
/** 当前出款方式支持的已绑定的钱包/银行列表 */
const walletOrBankList = computed(() => allMemberBankOrWallet.value.filter(a => a.withdraw_type_id === currentWithdrawId.value))
/** 钱包出款方式,已绑定的钱包统计 */
const memberThreePartyWalletList = computed(() => {
  // 如果取款方式有钱包类型 再统计  因为b没有取款类型ID所以要取重叠值
  const haveThreePartyWallet = allWithdrawType.value.find(a => a.type === 3)
  if (haveThreePartyWallet) {
    return allMemberBankOrWallet.value.filter(a => a.withdraw_type_id === haveThreePartyWallet.id).map((b) => {
      return {
        ...b,
        cardCount: allTypeBankcardListOptions.value.filter(card => card.bank_id === b.bank_id).length,
      }
    })
  }
  return []
})
/** 提款账号列表 */
const renderBankAccountList = computed(() => {
  if (isAlipayType.value) {
    return allTypeBankcardListOptions.value.filter(a => a.type_id === currentWithdrawId.value && `${a.bank_id}`.includes(bankNameId.value))
  }
  else if (isBankCardType.value && !isPix.value) {
    return allTypeBankcardListOptions.value.filter(a => a.type_id === currentWithdrawId.value && `${a.bank_id}`.includes(bankNameId.value)).map((b) => {
      return {
        ...b,
        label: b.bank_account.replace(/(\d{4})/g, '$1 ').trim(),
      }
    })
  }

  return allTypeBankcardListOptions.value.filter(a => a.type_id === currentWithdrawId.value && `${a.bank_id}`.includes(bankNameId.value))
})
/** 当前出款方式下的账号列表个数 */
const numberOfAccountListOnCurrentWithdrawType = computed(() => allTypeBankcardListOptions.value.filter(a => a.type_id === currentWithdrawId.value).length)
/** 是否所有钱包都绑定了三张卡 - 钱包隐藏添加按钮 */
const isFullBindedAllWallet = computed(() => {
  if (Number(allTypeBankcardData.value?.a?.length) > 0 && Number(allTypeBankcardData.value?.d?.length) > 0) {
    return allTypeBankcardData.value?.a.map((wallet) => {
      return allTypeBankcardData.value!.d.filter(card => card.bank_id === +wallet.id).length
    }).every(num => num >= 3)
  }
  return false
})

const upayBalanceNum = computed(() => uPayBalance.value?.Balance)

/** 内嵌模式 upay */
const isEmbed = computed(() => {
  const all = allTypeBankcardData.value?.a
  if (all && all.length && bankNameId.value) {
    const obj = all.filter(a => +a.id === +bankNameId.value)[0]
    return !!(obj && obj.embedded && +obj.embedded === 1)
  }
  return false
})

async function onFiatCurrencyChange(item: ICurrencyOption) {
  activeFiatCurrency.value = item
  resetBankId()
  resetBankNameId()
  amountReset()
  setMaxAmount(false)
  // passwordRef.value?.resetPassword()

}
watch(activeFiatCurrency, (a) => {
  if (a) {
    nextTick(() => {
      getData()
    })
  }
})
function onFiatPopperHide() {
  setTimeout(() => {
    fiatSearchValue.value = ''
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
// 添加取款方式
function bind() {
  if (isPix.value)
    toAddPix()
  else
    toAddBankcards()
}
// 编辑取款方式
function toEdit(item: BankCardOption, hide: () => void) {
  if (item.disabled)
    return
  if (isPix.value)
    toEditPix(item)
  else
    toEditBankcard(item)
  hide()
}
// 添加PIX
function toAddPix() {
  let isFirst = true
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value?.currency_id) ?? ''
  let cpf = userInfo.value?.mext.cpf ?? ''
  if (numberOfAccountListOnCurrentWithdrawType.value > 0) {
    isFirst = false
    cpf = allTypeBankcardListOptions.value[0].bank_area_cpf
  }
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'pix',
    isFirst: isFirst ? 1 : 0,
    openName,
    cpf,
    currencyId: activeFiatCurrency.value?.currency_id,
    currencyName: activeFiatCurrency.value?.currency_name,
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
  })
  router.push('/center/withdraw/bebank')
}
// 编辑PIX
function toEditPix(item: BankCardOption) {
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value?.currency_id) ?? ''
  let cpf = ''
  if (numberOfAccountListOnCurrentWithdrawType.value > 0)
    cpf = allTypeBankcardListOptions.value[0].bank_area_cpf
   Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'pix',
    openName,
    cpf,
    currencyId: activeFiatCurrency.value?.currency_id,
    currencyName: activeFiatCurrency.value?.currency_name,
    isEdit: 1,
    data: JSON.stringify(item),
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
  })
  router.push('/center/withdraw/bebank')
}
// 添加银行卡
function toAddBankcards() {
  let isFirst = true
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value?.currency_id) ?? ''
  if (numberOfAccountListOnCurrentWithdrawType.value > 0)
    isFirst = false

  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'fiat',
    isFirst: isFirst ? 1 : 0,
    openName,
    currencyId: activeFiatCurrency.value?.currency_id,
    currencyName: activeFiatCurrency.value?.currency_name,
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
    needDisabledBankIds: JSON.stringify(memberThreePartyWalletList.value.filter(a => a.cardCount >= 3).map(b => b.bank_id)),
    isFullBindedAllWallet: isFullBindedAllWallet.value ? 1 : 0,
  })
  router.push('/center/withdraw/bebank')

}
// 编辑银行卡
function toEditBankcard(item: BankCardOption) {
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value?.currency_id) ?? ''
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'fiat',
    openName,
    currencyId: activeFiatCurrency.value?.currency_id,
    currencyName: activeFiatCurrency.value?.currency_name,
      isEdit: 1,
      data: JSON.stringify(item),
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
    needDisabledBankIds: JSON.stringify(memberThreePartyWalletList.value.filter(a => a.cardCount >= 3).map(b => b.bank_id)),
    isFullBindedAllWallet: isFullBindedAllWallet.value ? 1 : 0,
  })
  router.push('/center/withdraw/bebank')
}
// 删除银行卡
function toDeleteBankcard(item: BankCardOption) {
  openDeleteConfirm({
    item,
    withdrawType: currentWithdrawType.value,
    updateWalletList: () => {
      getData()
    },
  })
}
// 选择银行名称
function onBankNameOptionClick(bank: IBankOption) {
  resetBankId()
  setBankNameId(bank.value)
  nextTick(() => {
    const stateNot2 = renderBankAccountList.value.filter(a => a.state !== 2)
    if (stateNot2.length > 0) {
      if (stateNot2.find(item => item.is_default === 1))
        setBankId(stateNot2.find(item => item.is_default === 1)!.id, false)

      else
        setBankId(stateNot2[0].id, false)
    }
  })
}
// 选择银行
function onBankOptionClick(bank: BankCardOption, hide: () => void) {
  if (bank.disabled)
    return
  currentBankId.value = bank.id
  hide()
}
function maxNumber() {
  setMaxAmount(true)
  setAmount(getMaxAmount.value)
}
function formatAmount() {
  amount.value = amount.value?.replace(/\D/g, '')
  setAmount(application.formatNumDecimal(amount.value, 0, 0)) // currencyConfig[activeFiatCurrency.value?.currency_name].decimal
}
/** 切换取款方式 */
function onWithdrawTypeChange() {
  setMaxAmount(false)
  resetBankNameId()
  resetBankId()
  const item = allTypeBankcardListOptions.value.find(a => a.type_id === currentWithdrawId.value && !a.disabled)
  if (item) {
    setBankId(item.id, false)
    setBankNameId(allMemberBankOrWallet.value.find(a => a.bank_id === item.bank_id)?.value ?? '')
  }
  amountReset()
}
// 取款操作
async function withDrawSubmit() {
  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await amountValidate()
  // passwordRef.value.setTouchTrue()
  // await passwordRef.value.validatePassword()
  await valiBankNameId()
  await valiBankId()
  if (!amountError.value && !bankIdErr.value && !bankNameIdErr.value) {
    // 先判断取款次数再调取款接口
    runAsyncWithdrawFeeInfo({ currency_id: activeFiatCurrency.value?.currency_id }).then((data): void => {
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
            runWithdraw({
              currency_id: Number(activeFiatCurrency.value?.currency_id),
              method_id: withdrawMethodList.value ? withdrawMethodList.value[0].id : '',
              amount: amount.value,
              pay_password: pwdData.password,
              bankcard_id: currentBankId.value,
              auth_type: pwdData.auth_type,
              auth_code: pwdData.password,
            })
          },
        })
      }
    })
  }
}
// 获取所需要的数据
let resolveLoadingPromise: (value: unknown) => void
const loadingPromise = new Promise((resolve) => {
  resolveLoadingPromise = resolve
})
// 获取所需要的数据
async function getData() {
  try {
    isDataLoading.value = true
    await Promise.all([
      runWithdrawBalance({ currency_id: activeFiatCurrency.value?.currency_id }),
      runAsyncWithdrawMethodList({ currency_id: activeFiatCurrency.value?.currency_id }),
      runAsyncWithdrawBankcard({ currency_id: activeFiatCurrency.value?.currency_id, withdraw_type: '1' }),
    ])
    // appStore.updateUserInfo()
        // 默认选中第一个出款类型
    if(allWithdrawType.value.length > 0){
      currentWithdrawId.value = allWithdrawType.value[0].id
    }
    // 已绑的银行(钱包)大于0
    if (allMemberBankOrWallet.value.length > 0) {
      // 过滤不可用的出款账户
      const _allActiveBankCardList = allTypeBankcardListOptions.value.filter(a => !a.disabled)

      // 检查是否有默认的卡号
      const defaultBankCard = _allActiveBankCardList.find(a => a.is_default === 1)
      if (defaultBankCard) {
        setBankNameId(allMemberBankOrWallet.value.find(a => a.bank_id === defaultBankCard.bank_id)!.bank_id.toString())
        currentWithdrawId.value = allWithdrawType.value.find(a => a.id === defaultBankCard.type_id)!.id
        setBankId(defaultBankCard.id, false)
      }
      else {
        // 无默认，选中第一个下面有绑定出款账户(可用状态)的出款方式
        // 统计所有出款方式下面各有多少个出款账户(可用状态)
        const _allTypeArr = allWithdrawType.value.map((a) => {
          return {
            ...a,
            cardCount: _allActiveBankCardList.filter(b => b.type_id === a.id).length,
          }
        })
        // 有绑卡的类型
        const obj1 = _allTypeArr.find(a => a.cardCount > 0)
        if (obj1) {
          currentWithdrawId.value = obj1?.id
          // 选中可用卡
          const _bankCard = _allActiveBankCardList.find(a => a.type_id === obj1.id)
          if (_bankCard) {
            setBankId(_bankCard.id, false)
            // 选中可用卡对应的银行
            setBankNameId(allMemberBankOrWallet.value.find(a => a.bank_id === _bankCard.bank_id)!.value ?? '')
          }
        }
      }
    }
    isDataLoading.value = false
    emit('loaded', true)
    resolveLoadingPromise(true)
  }
  catch (error) {
    console.error('获取提款数据出错', error)
  }
  finally {
    isDataLoading.value = false
  }
}

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

      // try {
      //   window.open(uPayUrl.value)
      // }
      // catch {
      //   const newWindow = window.open('', '_blank')
      //   if (!newWindow)
      //     return
      //   newWindow.location.href = uPayUrl.value ?? ''
      // }
    })
  }
  else {
    toAddBankcards()
  }
}
const defaultCurrency = computed(() => {
  const routeCurrency = route.query.currency as CurrencyCode
  const firstFiat = fiatCurrencyListOptions.value[0]
  const defaultCode = routeCurrency || (application.isVirtualCurrency(currentGlobalCurrency.value) ? firstFiat.currency_id : getCurrencyConfig(currentGlobalCurrency.value).cur)
  return fiatCurrencyListOptions.value.find(a => a.currency_id === defaultCode) || firstFiat
})

watch(defaultCurrency, onFiatCurrencyChange, { immediate: true })
watch(activeFiatCurrency, (t) => {
  if (t) {
    router.replace(`/center/withdraw?${qs.stringify({...route.query,currency: t.currency_id})}`)
  }
}, { immediate: true })
// 余额有变化，打码信息更新
watch(() => balanceData.value, () => {
  nextTick(() => {
    runWithdrawBalance({ currency_id: activeFiatCurrency.value?.currency_id })
  })
  setTimeout(() => {
    if (readyGetUpayBalance.value)
      appStore.runGetUpayBalance()
  }, 1000)
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

appStore.runGetUpayBalance()
getData()
await application.allSettled([loadingPromise])
</script>

<template>
  <div class="wallet-wrap flex flex-col gap-[16px]">
    <!-- 选择货币 -->
    <div v-if="fiatCurrencyList.length > 1" class="flex items-center justify-between">
      <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('withdraw_currency') }} <span
        class="text-tg-text-error text-[12px]"
      >*</span></label>
      <template v-if="activeFiatCurrency">
        <div
          v-if="fiatCurrencyList.length === 1"
          class="text-tg-text-white bg-tg-secondary-dark flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold"
        >
          <AppCurrencyIcon
            icon-align="right" style="--tg-app-currency-icon-size:18px;"
            :currency-type="activeFiatCurrency.currency_name" show-name
          />
        </div>
        <BaseSelect
          v-else
          v-model="activeFiatCurrency.currency_name"
          class="select1"
          popper-clazz="deep-mode wallet-pop-box" :skidding="-28" popper :border="false"
          popper-strategy="fixed" :options="fiatCurrencyListOptions"
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
          @popper-hide="onFiatPopperHide"
        >
          <template #label>
            <AppCurrencyIcon
              icon-align="right" style="--tg-app-currency-icon-size:18px;"
              :currency-type="activeFiatCurrency.currency_name" show-name
            />
          </template>

          <template #popper="{ hide }">
            <div class="bg max-h-[368px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
              <div class="w-full px-[10px]">
                <BaseSearch
                  v-model="fiatSearchValue"
                  popper-clazz="deep-mode"
                  style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;" class="h-[36px]"
                  :place-holder="t('search')" white-style shape="square"
                />
              </div>
              <div class="scroll-y w-full flex flex-col">
                <div
                  v-for="fiat, in fiatCurrencyListOptions" :key="fiat.value"
                  class="theme-color text-tg-text-secondary flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[10px] text-[14px] font-semibold"
                  @click="hide(); onFiatCurrencyChange(fiat)"
                >
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
    <template v-if="withdrawTypeListOptions.length > 0">
      <!-- 出款方式 -->
      <BaseTab
        v-if="withdrawTypeListOptions.length > 1"
        v-model="currentWithdrawId" class="theme-text" full shape="square"
        :list="withdrawTypeListOptions" :show-icon="false"
        style="--tg-tab-style-inner-padding-y:14px;--tg-tab-style-box-padding:5px;" @change="onWithdrawTypeChange"
      />
      <!-- 表单 -->
      <AppLoading v-if="isDataLoading" />
      <template v-else>
        <template v-if="fiatCurrencyList && fiatCurrencyList.length">
          <!-- 有绑定支付账号 -->
          <template v-if="numberOfAccountListOnCurrentWithdrawType">
            <!-- 银行卡类型 -->
            <template v-if="isBankCardType || isThreePartyWalletType">
              <BaseLabel must :label="selectTitle">
                <BaseSelect
                  v-model="bankNameId"
                  class="select1"
                  popper-clazz="deep-mode" :msg="bankNameIdErr" popper :border="true" :options="walletOrBankList"
                  :placeholder="selectTitle"
                  style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:6.5px;"
                >
                  <template #label="{ popperLabel, data: option }">
                    <div v-if="!bankNameId" class="text-tg-wallet-optionbs-placehoder-color h-[20px] text-[14px] font-semibold">
                      {{ selectTitle }}
                    </div>
                    <div v-else class="h-[20px] w-full flex items-center gap-[6px] text-[14px] font-semibold">
                      <BaseImage width="16px" height="16px" :url="option?.icon" is-network />
                      {{ popperLabel }}
                    </div>
                  </template>

                  <template #popper="{ hide }">
                    <div class="bg scroll-y flex flex-col gap-[16px] px-[10px] py-[16px]" :style="{ width: `${width}px` }">
                      <div
                        v-for="bank in walletOrBankList" :key="bank.value"
                        class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                        :class="{ 'text-tg-text-blue': bank.value === bankNameId }"
                        @click="hide(); onBankNameOptionClick(bank)"
                      >
                        <BaseImage width="16px" height="16px" :url="bank.icon" is-network />
                        {{ bank.label }}
                      </div>
                    </div>
                  </template>
                </BaseSelect>
              </BaseLabel>
            </template>

            <BaseLabel :label="accountTitle" must-small>
              <BaseSelect
                ref="bankCardSelectRef"
                v-model="currentBankId"
                class="select1" popper-clazz="deep-mode" :msg="bankIdErr"
                :options="renderBankAccountList" popper show-placeholder :border="true"
                :placeholder="accountTitle"
                style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:9.5px;"
              >
                <template #popper="{ hide }">
                  <div class="bg scroll-y flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]" :style="{ width: `${width}px` }">
                    <div
                      v-for="bank in renderBankAccountList" :key="bank.value"
                      class="h-[20px] w-full flex items-center justify-between gap-[12px] text-[14px] font-semibold"
                      :class="{ 'text-tg-text-blue': bank.value === currentBankId }"
                      @click="onBankOptionClick(bank, hide)"
                    >
                      <span
                        class="scroll-hidden inline-flex grow items-center"
                        :class="bank.disabled ? 'cursor-not-allowed text-[#AEAFB1]' : 'cursor-pointer '"
                      >
                        <span
                          class="overflow-hidden text-ellipsis whitespace-nowrap"
                          :class="bank.disabled ? 'max-w-[88%]' : ''"
                        >{{ bank.label }}</span>
                        <span v-if="bank.disabled" class="ml-[10px] text-[12px] font-semibold text-[#E91134]">{{ t('baned')
                        }}</span>
                      </span>
                      <div class="flex items-center gap-[4px] text-[14px]">
                        <BaseButton type="text" size="none" @click.stop="toEdit(bank, hide)">
                          <div
                            class="flex items-center px-[6px] py-[10px]"
                            :class="bank.disabled ? 'cursor-not-allowed opacity-[0.5] ' : 'cursor-pointer '"
                          >
                            <IconEditActive style="color:var(--tg-secondary-main);" />
                          </div>
                        </BaseButton>
                        <BaseButton type="text" size="none" @click.stop="hide(); toDeleteBankcard(bank)">
                          <div class="flex items-center px-[6px] py-[10px]">
                            <IconUniBankDelete />
                          </div>
                        </BaseButton>
                      </div>
                    </div>
                    <div v-if="!isFullBindedAllWallet" class="flex justify-center">
                      <span
                        class="text-tg-text-blue inline-block cursor-pointer text-[12px] font-semibold leading-[20px] active:scale-[0.96]"
                        @click="bind"
                      >
                        {{ t('add_withdraw_acc') }}
                      </span>
                    </div>
                  </div>
                </template>
              </BaseSelect>
            </BaseLabel>

            <div v-if="isEmbed" class="min-h-[32px] flex items-center justify-between">
              <div class="flex items-center text-[14px] font-semibold">
                <span class="mr-[4px]">{{ t('u_pay_balance') }}</span>
                <AppAmount v-if="readyGetUpayBalance" class="text-white" currency-type="CNY" :amount="uPayBalance?.Balance ?? '0.00'" reverse />
                <span v-else class="text-tg-text-white mr-[4px]">{{ t('get_fail') }}</span>
                <div class="flex cursor-pointer items-center justify-center" :class="[loadingUpayBalance || loadingUpayUrl ? 'ani-roll-2' : '']" @click="refreshUpayBalance">
                  <IconUniRefresh />
                </div>
              </div>
              <BaseButton :loading="loadingUpayUrl" class="buy-btn min-w-[78px] flex items-center justify-center" style="--tg-base-button-min-width:78px" bg-style="primary" size="none" @click="goBuyUpay">
                <template #loadingText>
                  <!-- <template v-if="loadingBankcard">
                    <div class="h-[32px] px-[8px] text-[14px] font-semibold leading-[32px]">
                      ...
                    </div>
                  </template>
                  <template v-else> -->
                  <div class="h-[32px] px-[8px] text-[14px] font-semibold leading-[32px]">
                    {{ readyGetUpayBalance && hasBindUpayAccount ? t('withdraw_u_pay') : t('bing_account_label') }}
                  </div>
                  <!-- </template> -->
                </template>
              </BaseButton>
            </div>

            <BaseLabel :label="t('withdraw_amount1')" must-small>
              <BaseInput
                ref="amountRef" v-model="amount" :msg="amountError" type="number"
                input-mode="decimal" :placeholder="t('withdraw_amount1')" msg-after-touched is-integer @on-right-button="maxNumber"
                @blur="formatAmount"
              >
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="activeFiatCurrency.currency_name" />
                </template>

                <template #right-button>
                  <span>{{ t('input_max') }}</span>
                </template>
              </BaseInput>
              <div
                v-show="showMaxAmount && Number(withdrawBalance?.remaining_balance) > 0"
                class="text-tg-text-error-sub flex flex-col gap-[4px] pt-[8px] text-[12px]"
              >
                <div>{{ $t('withdrawal_amount') }} {{ getMaxAmount }}</div>
                <div>
                  {{ $t('withdrawals_require_turnover') }} {{ withdrawBalance?.remaining_balance }}
                </div>
              </div>
            </BaseLabel>
            <!-- <AppPasswordInput ref="passwordRef" v-model="payPassword" /> -->
            <BaseButton
              style="--tg-base-button-font-size:16px;" :loading="withdrawLoading" :disabled="withdrawLoading"
              bg-style="primary" size="md" @click="withDrawSubmit"
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
            <BaseButton style="--tg-base-button-font-size:16px;" bg-style="primary" size="md" @click="bind">
              {{ t('label_bind') }}{{ t('withdraw_account') }}
            </BaseButton>
          </template>
        </template>
      </template>
    </template>
    <BaseEmpty v-else style="font-size: var(--tg-empty-icon-size);padding-bottom: 0;" icon="empty-1">
        <template #icon>
          <BaseImage class="w-[80px]" url="/png/icon/empty-1.png" />
        </template>
      </BaseEmpty>
  </div>
</template>

<style lang='scss' scoped>
.select1 {
  @include webTheme('green') {
    --tg-base-select-popper-bg-color: #02432d;
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
.text-light {
  @include webTheme('white') {
    color: #555;
  }
}

:deep(.buy-btn .content) {
  display: none !important;
}
:deep(.buy-btn .loading-icon) {
  margin-left: 8px !important;
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
  @include webTheme('green') {
    --tg-body-bg: var(--tg-green-dark);
  }
}
.wallet-pop-box {
  @include webTheme('white') {
    --tg-base-select-popper-bg-color: #fff;
    --tg-base-select-style-color: #111111;
    --tg-base-select-border: 2px solid #e8e8e8;
    --tg-base-select-popper-label-hover-bg-color: #e8e8e8;
    --tg-popper-bg: #e8e8e8 !important;
  }
  @include webTheme('green') {
    background-color: #fff;
    --tg-popper-bg: var(--tw-ring-offset-color);
  }
}
</style>

<script setup lang="ts">
import type { BankCard, CurrencyCode, EnumCurrencyKey, IAvailableCurrency, ISortedListItem, IWithdrawBankOrWalletItem } from '@tg/types'
import { ApiFinanceWithdraw, ApiFinanceWithdrawBalance, ApiFinanceWithdrawBankcard, ApiFinanceWithdrawFeeInfo, ApiFinanceWithdrawMethodList } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseCurrencyIcon, AfunBaseEmpty, AfunBaseFinanceEmpty, AfunBaseImage, AfunBaseInput, AfunBaseLabel, AfunBaseTabs } from '@tg/bccomponents'
import { useBoolean, useUtils } from '@tg/hooks'
import { IconUniArrowDown, IconUniRefresh } from '@tg/icons'
import { useAppStore, useBrandStore, useCurrency } from '@tg/stores'
import { application, isMiBrowser, isVirtualCurrency, Local, STORAGE_DEPOSIT_COUNT, STORAGE_WALLET_ROUTE } from '@tg/utils'
import { useDocumentVisibility } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppSelect from '~/components/AppSelect.vue'
import AppSelectCurrency from '~/components/AppSelectCurrency.vue'
import { Message } from '~/utils'
import AccountSelect from './account-select.vue'
import DeleteComfirm from './delete-comfirm.vue'
import DialogPassword from './dialog-password.vue'

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
  name: 'AppFiatWithDraw',
})
const props = defineProps<Props>()
const emit = defineEmits(['loaded'])
const visibility = useDocumentVisibility()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const appStore = useAppStore()
const currencyStore = useCurrency()
const { isLogin, userInfo, uPayBalance, loadingUpayBalance, loadingUpayUrl, uPayUrl, upayBalErrCode, isCompleteKYC } = storeToRefs(appStore)
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { currentGlobalCurrencyMap, currencyList } = storeToRefs(currencyStore)
const { bool: isDataLoading } = useBoolean(false)
const { bool: showMaxAmount, setBool: setMaxAmount } = useBoolean(false)
/* const { openDeleteConfirm } = useDeleteConfirmDialog()
const { openPromptDialog } = useDialogPrompt() */
const { brandAmount } = storeToRefs(useBrandStore())
const { getRealNameFromUserInfoByFiatCurrencyId } = useUtils()

/** KYC弹窗 */
/* const { openKYCDialog } = useDialogKYCVerify() */

/** 获取当前货币可提款额度 */
const { runAsync: runWithdrawBalance, data: withdrawBalance } = useRequest(ApiFinanceWithdrawBalance)

/** 当前选中的货币 */
const activeFiatCurrency = ref()
/** 当前取款类型:银行卡 | 钱包 | 支付宝 */
const currentWithdrawId = ref('')

/** 获取已经绑定银行卡和钱包, 支持的取款类型, */
const { runAsync: runAsyncWithdrawBankcard, data: allTypeBankcardData, loading: loadingBankcard } = useRequest(ApiFinanceWithdrawBankcard)
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
const currentWithdrawType = computed(() => {
  return withdrawTypeListOptions.value.find(item => item.value === currentWithdrawId.value)?.type
})
/** 金额输入框ref */
const amountRef = ref()
const isPhp = computed(() => {
  // 菲律宾货币
  return activeFiatCurrency.value.currency_id === '735'
})

const isIndiaCard = computed(() => {
  // 印度货币
  return activeFiatCurrency.value.currency_id === '703'
})
/** 当前取款类型: 银行卡 */
const isBankCardType = computed(() => currentWithdrawType.value === 1)
/** 当前取款类型: 支付宝 */
const isAlipayType = computed(() => currentWithdrawType.value === 2 && !isIndiaCard.value && !isPhp.value)

/** 当前取款类型: 钱包支付 */
const isThreePartyWalletType = computed(() => currentWithdrawType.value === 3)
/** 最大提款额 */
const getMaxAmount = computed(() => application.formatNumDecimal(withdrawBalance.value?.withdraw_balance ?? 0, 0, 0)) // currencyConfig[activeFiatCurrency.value.currency_name].decimal
/** 最低提款额 */
const minWithdraw = computed(() => Number(brandAmount.value ? brandAmount.value[`c${activeFiatCurrency.value.currency_id}`].w ?? 0 : 0))
/** 巴西货币使用pix */
const isPix = computed(() => {
  if (activeFiatCurrency.value)
    return activeFiatCurrency.value.currency_id === '702'
  return false
})
const selectTitle = computed(() => {
  if (isBankCardType.value) {
    return isPix.value ? t('PIX类型') : t('银行名称')
  }
  else {
    return t('提款钱包')
  }
})
const accountTitle = computed(() => {
  if (isBankCardType.value) {
    return isPix.value ? t('提款账号') : t('银行账号')
  }
  else if (isAlipayType.value) {
    return t('支付宝账号')
  }
  else {
    return t('提款账号')
  }
})

/** 表单组件校验 */
const { value: bankNameId, errorMessage: bankNameIdErr, setValue: setBankNameId, validate: valiBankNameId, resetField: resetBankNameId } = useField<string>('bankNameId', (v) => {
  if (!v)
    return isPix.value ? t('请选择PIX类型') : isBankCardType.value ? t('请选择出款银行') : isThreePartyWalletType.value ? t('请选择提款钱包') : ''
  return ''
}, { initialValue: '' })
const { value: currentBankId, errorMessage: bankIdErr, setValue: setBankId, validate: valiBankId, resetField: resetBankId } = useField<string>('account', (v) => {
  if (!v)
    return isPix.value ? t('请选择PIX账号') : isAlipayType.value ? t('请选择支付宝账号') : isBankCardType.value ? t('请选择银行账号') : t('请选择提款账号')
  return ''
}, { initialValue: '' })
const { value: amount, errorMessage: amountError, validate: amountValidate, setValue: setAmount, resetField: amountReset } = useField<string>('amount', (value) => {
  if (!value) {
    return t('请输入金额')
  }
  else if (Number(value) === 0) {
    return `${t('金额不能为')}0`
  }
  else if (Number(value) < minWithdraw.value) {
    return `${t('最小金额为')}${application.formatNumDecimal(minWithdraw.value, 0, 0)}` // currencyConfig[activeFiatCurrency.value.currency_name].decimal
  }
  else if (value && Number(value) > Number(withdrawBalance.value?.withdraw_balance)) {
    setAmount(getMaxAmount.value)
    setMaxAmount(true)
  }
  return ''
})

/** 获取取款列表 */
const { runAsync: runAsyncWithdrawMethodList, data: withdrawMethodList } = useRequest(ApiFinanceWithdrawMethodList)
/** 获取取款次数 */
const { runAsync: runAsyncWithdrawFeeInfo } = useRequest(ApiFinanceWithdrawFeeInfo)
/** 发起提款 */
const { runAsync: runWithdraw, loading: withdrawLoading } = useRequest(ApiFinanceWithdraw, {
  onSuccess(data, params) {
    const type = activeFiatCurrency.value.currency_name
    Message.info(t('提款进行中'))
    /*   openNotify({
      icon: `coin-${type.toLocaleLowerCase()}`,
      title: t('提款进行中'),
      message: () => h(AppMemberNotificationsMessage, {
        amount: application.formatNumDecimal(params[0].amount, currencyConfig[type].decimal),
        currencyType: type,
        keypath: 'withdraw_info_going',
      }),
    }) */
    amountReset()
    setMaxAmount(false)
    currencyStore.initCurrencyList()
  },
})

/** 当前出款方式id */

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

/** 内嵌模式 upay */
const isEmbed = computed(() => {
  const all = allTypeBankcardData.value?.a
  if (all && all.length && bankNameId.value) {
    const obj = all.filter(a => +a.id === +bankNameId.value)[0]
    return !!(obj && obj.embedded && +obj.embedded === 1)
  }
  return false
})

async function onFiatCurrencyChange(item: TWithdrawCurrencyList) {
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
function toEdit(item: any) {
  if (item.disabled)
    return
  if (isPix.value)
    toEditPix(item)
  else
    toEditBankcard(item)
}
// 添加PIX
function toAddPix() {
  let isFirst = true
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value.currency_id) ?? ''
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
    currencyId: activeFiatCurrency.value.currency_id,
    currencyName: activeFiatCurrency.value.currency_name,
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
  })
  router.push({
    path: '/wallet/bebank/pix',
    query: {

    },
  })
}
// 编辑PIX
function toEditPix(item: BankCardOption) {
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value.currency_id) ?? ''
  let cpf = ''
  if (numberOfAccountListOnCurrentWithdrawType.value > 0)
    cpf = allTypeBankcardListOptions.value[0].bank_area_cpf
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'pix',
    openName,
    cpf,
    currencyId: activeFiatCurrency.value.currency_id,
    currencyName: activeFiatCurrency.value.currency_name,
    isEdit: 1,
    data: JSON.stringify(item),
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
  })
  router.push({
    path: '/wallet/bebank/pix',
    query: {

    },
  })
}
// 添加银行卡
function toAddBankcards() {
  let isFirst = true
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value.currency_id) ?? ''
  if (numberOfAccountListOnCurrentWithdrawType.value > 0)
    isFirst = false
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'fiat',
    isFirst: isFirst ? 1 : 0,
    openName,
    currencyId: activeFiatCurrency.value.currency_id,
    currencyName: activeFiatCurrency.value.currency_name,
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
    needDisabledBankIds: JSON.stringify(memberThreePartyWalletList.value.filter(a => a.cardCount >= 3).map(b => b.bank_id)),
    isFullBindedAllWallet: isFullBindedAllWallet.value ? 1 : 0,
  })
  router.push({
    path: '/wallet/bebank/fiat',
    query: {

    },
  })
}
// 编辑银行卡
function toEditBankcard(item: BankCardOption) {
  const openName = getRealNameFromUserInfoByFiatCurrencyId(activeFiatCurrency.value.currency_id) ?? ''
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'fiat',
    openName,
    currencyId: activeFiatCurrency.value.currency_id,
    currencyName: activeFiatCurrency.value.currency_name,
    isEdit: 1,
    data: JSON.stringify(item),
    withdrawId: currentWithdrawId.value,
    withdrawTypeList: JSON.stringify(withdrawTypeListOptions.value),
    needDisabledBankIds: JSON.stringify(memberThreePartyWalletList.value.filter(a => a.cardCount >= 3).map(b => b.bank_id)),
    isFullBindedAllWallet: isFullBindedAllWallet.value ? 1 : 0,
  })
  router.push({
    path: '/wallet/bebank/fiat',
    query: {

    },
  })
}
// 删除银行卡
const showDeleteDialog = ref(false)
const deleteConfirmOptions = ref()
function toDeleteBankcard(item: any) {
  deleteConfirmOptions.value = {
    item,
    withdrawType: currentWithdrawType.value,
    updateWalletList: () => {
      getData()
    },
  }
  showDeleteDialog.value = true
}

// 选择银行名称
function onBankNameOptionClick(bankId: string) {
  resetBankId()
  setBankNameId(bankId)
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
function onBankOptionClick(id: string) {
  const bank = renderBankAccountList.value.find(item => item.id === id)
  if (bank && bank.disabled)
    return
  currentBankId.value = id
}
function maxNumber() {
  setMaxAmount(true)
  setAmount(getMaxAmount.value)
}
function formatAmount() {
  amount.value = amount.value?.replace(/\D/g, '')
  setAmount(application.formatNumDecimal(amount.value, 0, 0)) // currencyConfig[activeFiatCurrency.value.currency_name].decimal
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

// 资金密码弹窗
const showPswDialog = ref(false)

const pswDialogOptions = ref({
  callBack: (pwdData: {
    auth_type: number
    password: string
  }) => {
    runWithdraw({
      currency_id: Number(activeFiatCurrency.value.currency_id),
      method_id: withdrawMethodList.value ? withdrawMethodList.value[0].id : '',
      amount: amount.value,
      pay_password: pwdData.password,
      bankcard_id: currentBankId.value,
      auth_type: pwdData.auth_type,
      auth_code: pwdData.password,
    })
  },
})

// 取款操作
async function withDrawSubmit() {
  /** 增加kyc逻辑 */
  /* if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog() */

  if (amountRef.value)
    amountRef.value.setTouchTrue()
  await amountValidate()
  // passwordRef.value.setTouchTrue()
  // await passwordRef.value.validatePassword()
  await valiBankNameId()
  await valiBankId()
  if (!amountError.value && !bankIdErr.value && !bankNameIdErr.value) {
    // 先判断取款次数再调取款接口
    runAsyncWithdrawFeeInfo({ currency_id: activeFiatCurrency.value.currency_id }).then((data): void => {
      if (data.withdraw_setting_count > 0 && data.withdraw_count >= data.withdraw_setting_count && !Local.get(STORAGE_DEPOSIT_COUNT + getCurDate() + data.withdraw_count)?.value) {
        /* openPromptDialog(data) */
        Local.set(STORAGE_DEPOSIT_COUNT + getCurDate() + data.withdraw_count, data.withdraw_count)
      }
      else {
        // 打开输入资金密码弹窗
        showPswDialog.value = true
      }
    })
  }
}
// 获取所需要的数据
let resolveLoadingPromise: (value: unknown) => void
const loadingPromise = new Promise((resolve) => {
  resolveLoadingPromise = resolve
})

async function getData(): Promise<void> {
  try {
    isDataLoading.value = true
    await Promise.all([
      runWithdrawBalance({ currency_id: activeFiatCurrency.value.currency_id }),
      runAsyncWithdrawMethodList({ currency_id: activeFiatCurrency.value.currency_id }),
      runAsyncWithdrawBankcard({ currency_id: activeFiatCurrency.value.currency_id, withdraw_type: '1' }),
    ])
    // appStore.updateUserInfo()
    // 默认选中第一个出款类型
    if (allWithdrawType.value.length > 0) {
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
  if (isLogin.value) {
    clearTimeout(upayRefreshTimer)
    upayRefreshTimer = setTimeout(() => {
      appStore.runGetUpayBalance()
    }, upayBalErrCode.value === '5024' ? 2000 : 0)
  }
}

function goBuyUpay() {
  if (loadingUpayUrl.value)
    return

  if (isLogin.value && hasBindUpayAccount.value) {
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
  const firstFiat = props.fiatCurrencyList[0]
  const defaultCode = routeCurrency || (isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? firstFiat.currency_id : currentGlobalCurrencyMap.value.cur)
  return props.fiatCurrencyList.find(a => a.currency_id === defaultCode) || firstFiat
})

watch(defaultCurrency, onFiatCurrencyChange, { immediate: true })
watch(activeFiatCurrency, (t) => {
  if (t) {
    router.replace({
      query: {
        ...route.query,
        currency: t.currency_id,
      },
    })
  }
}, { immediate: true })

// 余额有变化，打码信息更新
function updateBalance() {
  if (isLogin.value)
    appStore.runGetUpayBalance()
}
watch(currencyList, () => {
  nextTick(() => {
    runWithdrawBalance({ currency_id: activeFiatCurrency.value.currency_id })
  })
  updateBalance()
})
watch(visibility, (newValue) => {
  if (newValue === 'visible') {
    updateBalance()
  }
})

updateBalance()
getData()
await application.allSettled([loadingPromise])
</script>

<template>
  <div class="flex flex-col gap-[16px]">
    <!-- 选择货币 -->
    <AfunBaseLabel :label="t('提款货币')" required layout="horizontal" class="fiat-withdraw-label">
      <template v-if="fiatCurrencyList.length > 0">
        <div
          v-if="fiatCurrencyList.length === 1"
          class="flex items-center justify-between h-[43px] px-[8px] bg-[#0F212E] rounded-[4px]"
        >
          <AfunBaseCurrencyIcon
            icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:18px;"
            :currency-type="activeFiatCurrency.currency_name"
          />
        </div>
        <AppSelectCurrency
          v-else v-slot="slotProps" :t="t" :options="fiatCurrencyList"
          :currency="activeFiatCurrency?.cur" @choose="onFiatCurrencyChange"
        >
          <div class="flex items-center justify-between h-[43px] px-[8px] rounded-[4px] bg-[#0F212E]">
            <AfunBaseCurrencyIcon
              icon-align="left" :show-name="true" style="--afun-app-currency-icon-size:18px;"
              :currency-type="activeFiatCurrency.currency_name"
            />
            <IconUniArrowDown v-if="fiatCurrencyList.length > 1" class="ml-[4px] text-[#9dabc9]" />
          </div>
        </AppSelectCurrency>
      </template>
    </AfunBaseLabel>
    <template v-if="withdrawTypeListOptions.length > 0">
      <!-- 出款方式 -->
      <AfunBaseTabs
        v-if="withdrawTypeListOptions.length > 1"
        v-model="currentWithdrawId" class="bank-tab" :type="5"
        full :list="withdrawTypeListOptions" @change="onWithdrawTypeChange"
      />
      <!-- 表单 -->
      <AppLoading v-if="isDataLoading" />
      <template v-else>
        <template v-if="fiatCurrencyList && fiatCurrencyList.length">
          <!-- 有绑定支付账号 -->
          <template v-if="numberOfAccountListOnCurrentWithdrawType">
            <!-- 银行卡或三方钱包 -->
            <template v-if="isBankCardType || isThreePartyWalletType">
              <AfunBaseLabel required :label="selectTitle" class="fiat-withdraw-label">
                <AppSelect
                  v-model="bankNameId" :msg="bankNameIdErr" :options="walletOrBankList"
                  :place-holder="selectTitle" full item-align="left" @change="onBankNameOptionClick"
                >
                  <template #item-icon="{ item }">
                    <AfunBaseImage v-if="item?.icon" class="w-full h-full" :url="item?.icon" is-network />
                  </template>
                </AppSelect>
              </AfunBaseLabel>
            </template>
            <AccountSelect
              v-model="currentBankId" :title="accountTitle" :msg="bankIdErr" :list="renderBankAccountList"
              :num="numberOfAccountListOnCurrentWithdrawType" @change="onBankOptionClick" @edit="toEdit"
              @delete="toDeleteBankcard" @bind="bind"
            />

            <div v-if="isEmbed" class="flex items-center justify-between">
              <div class="flex items-center text-[14px] font-[600]">
                <span class="mr-4 text-[#B1BAD3]">{{ t('U币余额：') }}</span>
                <AfunBaseAmount
                  v-if="isLogin" currency-type="CNY" :amount="uPayBalance?.Balance ?? '0.00'" reverse
                  style="--afun-base-amount-font-size:14px;"
                />
                <span v-else class=" mr-4">{{ t('获取失败') }}</span>
                <div
                  class=" ml-[4px] cursor-pointer  center text-[16px]"
                  :class="[loadingUpayBalance || loadingUpayUrl ? 'ani-roll-2' : '']" @click="refreshUpayBalance"
                >
                  <IconUniRefresh class="text-[#9DABC8]" />
                </div>
              </div>
              <AfunBaseButton :loading="loadingUpayUrl" class="add-btn1 center" @click="goBuyUpay">
                <!-- <template v-if="loadingBankcard">
                    <div class="h-32 px-8 text-[14px] font-[600] leading-[32px]">
                      ...
                    </div>
                  </template>
                  <template v-else> -->
                <div class="text-[14px] leading-[20px] font-[600]">
                  {{ isLogin && hasBindUpayAccount ? t('提取U币') : t('绑定账号') }}
                </div>
                <!-- </template> -->
              </AfunBaseButton>
            </div>

            <AfunBaseLabel :label="t('提款金额')" required class="fiat-withdraw-label">
              <AfunBaseInput
                ref="amountRef" v-model="amount" :msg="amountError" type="number" class="deposit-input"
                input-mode="decimal" :placeholder="t('提款金额')" msg-after-touched is-integer @blur="formatAmount"
              >
                <template #right>
                  <div class="flex items-center h-full">
                    <AfunBaseCurrencyIcon
                      :currency-type="activeFiatCurrency.currency_name"
                      style="--ph-app-currency-icon-size:18px;"
                    />
                    <div
                      class="ml-[8px] bg-[#2F4553] px-[12px] h-full center whitespace-nowrap rounded-r-[2px] font-[600]"
                      @click.stop.prevent="maxNumber"
                    >
                      {{ t('最大值') }}
                    </div>
                  </div>
                </template>
              </AfunBaseInput>
              <div
                v-show="showMaxAmount && Number(withdrawBalance?.remaining_balance) > 0"
                class="text-[#FF4D4F] flex flex-col  pt-[4px] text-[12px]"
              >
                <div>{{ $t('可提款金额') }} {{ getMaxAmount }}</div>
                <div>
                  {{ $t('全部提款还需打码') }} {{ withdrawBalance?.remaining_balance }}
                </div>
              </div>
            </AfunBaseLabel>
            <AfunBaseButton :loading="withdrawLoading" :disabled="withdrawLoading" @click="withDrawSubmit">
              {{ t('确认提交') }}
            </AfunBaseButton>
          </template>
          <!-- 没有绑定银行卡 -->
          <template v-else>
            <AfunBaseFinanceEmpty :description="$t('该币种您暂无收款信息 请先绑定收款信息')" />
            <AfunBaseButton @click="bind">
              {{ t('绑定') }}{{ t('收款账号') }}
            </AfunBaseButton>
          </template>
        </template>
      </template>
    </template>
    <AfunBaseEmpty v-else :description="t('暂无数据')">
      <template #icon>
        <AfunBaseImage class="w-[80px]" url="/m/afun-h5/png/uni-table-empty.png" />
      </template>
    </AfunBaseEmpty>
    <DeleteComfirm v-if="showDeleteDialog" v-model="showDeleteDialog" v-bind="{ ...deleteConfirmOptions }" />
    <DialogPassword v-if="showPswDialog" v-model="showPswDialog" v-bind="{ ...pswDialogOptions }" />
  </div>
</template>

<style lang='scss' scoped>
.fiat-withdraw-label {
  --afun-base-label-color: #b1bad3;
}

.add-btn1 {
  --afun-base-button-padding-y: 5px;
  --afun-base-button-padding-x: 8px;
  --afun-base-button-border-radius: 4px;
  --afun-base-button-font-weight: 600;
}

.deposit-input {
  --afun-base-input-padding-left: 10px;
  --afun-base-input-padding-right: 0;
  --afun-base-input-padding-y: 8px;
  --afun-base-input-background-color: #0f212e;
  --afun-base-input-border-color: #2f4553;
}

.bank-tab {
  --afun-tabs-wrap-padding-x: 4px;
  --afun-tabs-wrap-padding-y: 4px;
  --afun-tabs-item-gap: 5px;
  --afun-tabs-item-rounded: 4px;
  --afun-tabs-item-height: 35px;
  --afun-tabs-wrap-bg: #0f212e;
  --afun-tabs-item-active-bg: #2f4553;
}

// 按钮loading动画
.ani-roll-2 {
  transform-origin: center;
  animation-name: tg-roll-2;
  animation-duration: 1.6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes tg-roll-2 {
  0%,
  5% {
    transform: rotate(0);
  }

  15% {
    transform: rotate(45deg);
  }

  20%,
  30% {
    transform: rotate(90deg);
  }

  37.5% {
    transform: rotate(135deg);
  }

  45%,
  55% {
    transform: rotate(180deg);
  }

  62.5% {
    transform: rotate(225deg);
  }

  70%,
  80% {
    transform: rotate(270deg);
  }

  87.5% {
    transform: rotate(315deg);
  }

  95%,
  to {
    transform: rotate(360deg);
  }
}
</style>

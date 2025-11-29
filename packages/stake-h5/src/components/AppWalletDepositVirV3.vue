<script setup lang="ts">
import type { IAvailableCurrency, EnumCurrencyKey, virAddreesQrcode } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconUniWarningColor, IconUniArrowDown, IconUniArrowRight } from '@tg/icons'
import { ApiFinanceCoinContract, ApiFinanceDepositVirtualInfo, ApiFinanceMethodComboListV2, ApiThirdVirtualGetAddr } from '@tg/apis'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface Props {
  initVirCurrency: EnumCurrencyKey
}
defineOptions({
  name: 'AppWalletDepositVirV3',
})
const props = defineProps<Props>()
const emit = defineEmits(['changeCurrency'])
const { t } = useI18n()
const customRouter = useCustomRouter()
const { bool: isDataLoading } = useBoolean(false)
const appStore = useAppStore()
const { userInfo, balanceData, isCompleteKYC } = storeToRefs(appStore)
const { openNotify } = useNotify()
/** 当前存款货币列表：depositCurrencyList  钱包存款接口请求：runGetFinanceDepositCurrencyData */
const { getVirContractName, depositCurrencyList, runGetFinanceDepositCurrencyData } = useCurrencyData()
const { brandConfig, isOpenFastDeposit, isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { bool: isDisableQrcode, setTrue: setTrueQrcode, setFalse: setFalseQrcode } = useBoolean(false)
const { bool: isChangeCurrency, setTrue: setTrueChangeCurrency, setFalse: setFalseChangeCurrency } = useBoolean(false)
const currencySelectRef = ref()
const { width: currencySelectWidth } = useElementSize(currencySelectRef)
const promoStore = usePromoStore()
const { depositDetail } = storeToRefs(promoStore)
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()

const virtSearchValue = ref('')
const paymentContracts = ref([])
/** 当前的支付ID */
const curPaymentId = ref('')
/** 当前的虚拟币 */
const activeVirCurrency = ref({} as ICurrencyOption)
const currentNetwork = ref('')
const showIds = ref<Array<string>>([])
const VirQrcodeMsg = ref('')
/** 存款地址 */
const virAddreesQrcodeData = ref<virAddreesQrcode>({
  virDepositAddrees: '',
  virDepositRatio: '',
  virDepositMin: '',
  currency: '',
})
/** 虚拟币代收付存款地址 */
const {
  runAsync: runAsyncvirDepositAddrees,
  loading: virDepositAddreesLoading,
} = useRequest(ApiThirdVirtualGetAddr)
/** 支付方式&协议V2列表 */
const {
  runAsync: runAsyncPaymentMethodList,
  loading: paymentLoading,
  data: paymentMethodList,
} = useRequest(ApiFinanceMethodComboListV2, {
  onSuccess: (res, p) => {
  },
})
/** 获取协议V2列表 */
const {
  runAsync: runAsyncContractList,
  data: paymentTypeContractList,
} = useRequest(ApiFinanceMethodComboListV2, {
  onSuccess: (res, p) => {
  },
})
/** 虚拟币协议列表 */
const {
  runAsync: runAsyncFinanceCoinContractList,
} = useRequest(ApiFinanceCoinContract)

/** 获取有代付的币种和协议 */
const {
  runAsync: runFinanceDepositVirtualInfo,
  data: financeDepositVirtualInfo,
} = useRequest(ApiFinanceDepositVirtualInfo, {
  manual: true,
})

/** 有代付的币种 id 数组 */
const payType3Currency = computed(() => financeDepositVirtualInfo.value && financeDepositVirtualInfo.value.length ? financeDepositVirtualInfo.value.map(f => f.currency_id) : [])

/** 当前虚拟币列表 */
const virCurrencyList = computed(() => {
  if (depositCurrencyList.value.length) {
    return depositCurrencyList.value.filter(a => application.isVirtualCurrency(a.currency_name)).map((b) => {
      return {
        ...b,
        label: b.currency_name,
        value: b.currency_id,
      }
    })
  }
  return []
})
const virCurrencyListOptions = computed(() => {
  return virCurrencyList.value.filter(a => isOpenFastDeposit.value ? (payType3Currency.value.length > 0 ? payType3Currency.value.includes(a.currency_id) : true) : true).filter(a => a.currency_name.includes(virtSearchValue.value.toUpperCase())).map((a) => {
    return {
      ...a,
      value: a.currency_id,
      label: a.currency_name,
    }
  })
})
const contractList = computed(() => {
  if (!activeVirCurrency.value)
    return []

  let _pay = []
  if (paymentMethodList.value?.method && paymentMethodList.value.method.length > 0) {
    const showQrcodeFast = isOpenFastDeposit.value ? true : (paymentMethodList.value?.method.filter(item => item.merchants.filter(child => child.payment_type === 3).length > 0).length > 0 && brandConfig.value?.base?.fast === 1)
    if (showQrcodeFast) {
      const methodList = paymentTypeContractList.value?.method.filter(item => item.merchants.filter(child => child.payment_type === 3).length > 0)
      const _methodList: string[] = []
      let _contractList: any[] = []
      if (methodList) {
        methodList.forEach((item) => {
          _methodList.push(item.contract_id)
        })
      }

      _contractList = paymentMethodList.value?.contract?.filter(a => a.currency_id === activeVirCurrency.value.currency_id) as any[] || []
      return _pay = _contractList[0].contract_list.filter((contract: { value: string }) => _methodList.includes(contract.value))
    }
    else {
      _pay = paymentMethodList.value?.contract?.filter(a => a.currency_id === activeVirCurrency.value.currency_id) ?? []
      return _pay[0].contract_list
    }
  }
})
const filteredContractList = computed(() => {
  if (isOpenFastDeposit.value && financeDepositVirtualInfo.value && financeDepositVirtualInfo.value.length) {
    const temp = financeDepositVirtualInfo.value.filter(f => f.currency_id === activeVirCurrency.value.currency_id)[0]
    if (temp) {
      const contracts = temp.contracts
      return contractList.value.filter((cc: any) => contracts.map(item => item.contract_id).includes(cc.value))
    }
  }
  return contractList.value
})
const renderList = computed(() => {
  if (paymentMethodList.value?.method && paymentMethodList.value.method.length > 0) {
    return paymentMethodList.value.method.map((a) => {
      return {
        ...a,
        merchants: showIds.value.includes(a.id) ? a.merchants : a.merchants.length > 10 ? a.merchants.slice(0, 3) : a.merchants.slice(0, 2),
      }
    })
  }

  return []
})
const showQrcodeFast = computed(() => {
  if (isOpenFastDeposit.value)
    return true
  if (paymentMethodList.value?.method && paymentMethodList.value.method.length > 0)
    return paymentMethodList.value?.method.filter(item => item.merchants.filter(child => child.payment_type === 3).length > 0).length > 0 && brandConfig.value?.base?.fast === 1
})
/** 通知消息：是否优先显示虚拟币代收付二维码 */
const showQrcodeFirst = computed(() => {
  // 取出所有的键
  if (VirQrcodeMsg.value === '') {
    return false
  }
  else {
    const msg = VirQrcodeMsg.value
    const currencyKeys = Object.keys(msg)
    const CurrencyFindIndex = currencyKeys.includes(activeVirCurrency.value.currency_id)
    const ContractFindIndex = getContractId(msg).includes(currentNetwork.value)
    return CurrencyFindIndex && ContractFindIndex && virAddreesQrcodeData.value.virDepositAddrees
  }
})
/** 是否直接显示虚拟币代收付二维码 */
const showQrcode = computed(() => {
  return isOpenFastDeposit.value ? true : paymentMethodList.value?.method.length === 1 && paymentMethodList.value?.method[0].merchants.length === 1 && paymentMethodList.value?.method[0].merchants[0].payment_type === 3
})
/** 选择协议 */
async function selectNetwork(activeValue: any) {
  currentNetwork.value = activeValue
  await runAsyncPaymentMethodList({ currency_id: activeVirCurrency.value.currency_id, contract_id: currentNetwork.value })
  updateVirAddress()
}
/** 选择线上支持或转账 */
async function gotoDepositVirtDetail(itsm: any, id: any, type: any) {
  if (isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  if (userInfo.value?.exclude === 1) {
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
    return
  }
  if (paymentLoading.value)
    return
  await runAsyncContractList({ currency_id: activeVirCurrency.value.currency_id })
  const methodList = paymentTypeContractList.value?.method.filter(item => item.merchants.filter(child => child.payment_type === type).length > 0)
  const _methodList: string[] = []
  if (methodList) {
    methodList.forEach((item) => {
      _methodList.push(item.contract_id)
    })
  }

  paymentContracts.value = contractList.value.filter((contract: { value: string }) => _methodList.includes(contract.value))
  curPaymentId.value = itsm.id
  customRouter.push('/deposit/detail', {
    currencyType: 'virtual',
    currencyId: activeVirCurrency.value.currency_id, // 当前的货币ID
    currencyName: activeVirCurrency.value.currency_name, // 当前的货币名称
    curMerchant: itsm, // 当前的支付通道
    curPaymentType: type,
    paymentId: id, // 当前的支付ID
    initVirCurrency: activeVirCurrency.value, // 初始化当前虚拟币
    activeCurrency: activeVirCurrency.value, // 初始化当前虚拟币
    virCurrencyList: virCurrencyList.value, // 虚拟币列表
    curDepositPromo: curDepositPromo(id), // 当前支付优惠
    merchantsList: curMerchantsList(id), // 当前支付通道列表
    initCurrentNetwork: currentNetwork.value, // 初始化当前网络
    initContractList: paymentContracts.value,
    initvirAddreesQrcodeData: virAddreesQrcodeData.value,
  })
}
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
/** 更新二维码的相关数据 */
function updateVirAddress() {
  const virDepositList = paymentMethodList.value?.method.filter(item => item.merchants.filter(child => child.payment_type === 3).length > 0)
  if (virDepositList && virDepositList.length > 0) {
    const merchants = virDepositList[0].merchants.filter(item => item.payment_type === 3)
    virAddreesQrcodeData.value.virDepositRatio = virDepositList[0].deposit_promo[0] === undefined ? '' : virDepositList[0].deposit_promo[0].ratio
    virAddreesQrcodeData.value.virDepositMin = virDepositList[0].deposit_promo[0] === undefined ? '' : virDepositList[0].deposit_promo[0].min
    virAddreesQrcodeData.value.currency = activeVirCurrency.value.currency_name
    runAsyncvirDepositAddrees({ id: merchants[0].id, mid: virDepositList[0].id, currency_id: activeVirCurrency.value.currency_id }).then((data) => {
      virAddreesQrcodeData.value.virDepositAddrees = data || ''
    })
  }
}
/** 取出message里的协议编号 */
function getContractId(msg: any) {
  // 用于存储所有内层对象的键
  const innerKeys: any[] = []
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

function ifShowMore(id: string) {
  if (paymentMethodList.value?.method && paymentMethodList.value.method.length > 0)
    return paymentMethodList.value.method.filter(a => a.id === id)[0].merchants.length > 3 && !showIds.value.includes(id)
}
function ifShowHide(id: string) {
  if (renderList.value && renderList.value.length > 0)
    return renderList.value.filter(a => a.id === id)[0].merchants.length > 3
}
function onShowAllClick(id: string) {
  showIds.value.push(id)
}
function onHideALlClick(id: string) {
  const i = showIds.value.findIndex(a => a === id)
  if (i > -1)
    showIds.value.splice(i, 1)
}
function tipLableColor(type: number) {
  switch (type) {
    case 1001:
      return '#1375E1'
    case 1002:
      return '#00A200'
    case 1003:
      return '#F30000'
    case 1004:
      return '#D47200'
    default:
      return ''
  }
}
/** 切换货币类型事件 */
function onVirtCurrencyChange(item: ICurrencyOption) {
  if (item.currency_id === activeVirCurrency.value.currency_id)
    setFalseChangeCurrency()

  else
    setTrueChangeCurrency()

  activeVirCurrency.value = item
  getData()
  // emit('changeCurrency', item.currency_name)
}
function onVirtPopperHide() {
  setTimeout(() => {
    virtSearchValue.value = ''
  }, 200)
}
/** 获取初始化的数据 */
function getData() {
  isDataLoading.value = true
  return new Promise((resolve, reject) => {
    runAsyncFinanceCoinContractList().finally(() => {
      isDataLoading.value = false
      resolve(true)
    })
    setTimeout(async () => {
      try {
        const financeCoinContractList = await runAsyncFinanceCoinContractList()
        if (isOpenFastDeposit.value && financeDepositVirtualInfo.value && financeDepositVirtualInfo.value.length) {
          const _contractids = financeDepositVirtualInfo.value?.filter(f => f.currency_id === activeVirCurrency.value.currency_id)[0].contracts.map(m => m.contract_id)
          const arr = financeCoinContractList?.filter(a => a.currency_id === activeVirCurrency.value.currency_id)[0].contract_list?.filter(ff => _contractids.includes(ff.value))
          currentNetwork.value = arr[0]?.value
        }
        else {
          currentNetwork.value = financeCoinContractList?.filter(a => a.currency_id === activeVirCurrency.value.currency_id)[0].contract_list[0]?.value
        }

        await runAsyncPaymentMethodList({ currency_id: activeVirCurrency.value.currency_id, contract_id: currentNetwork.value })
        updateVirAddress()
        await runAsyncContractList({ currency_id: activeVirCurrency.value.currency_id })
        isDataLoading.value = false
        resolve(true)
      }
      catch (error) {
        isDataLoading.value = false
        console.error('获取初始化的数据失败:', error)
        reject(new Error('获取初始化的数据失败'))
      }
    }, 0)
  })
}
/** 选择当前的支付优惠 */
function curDepositPromo(id: string) {
  const curPaymentMethod = paymentMethodList?.value?.method.filter(a => a.id === id)[0]
  return curPaymentMethod?.deposit_promo
}
/** 选择当前的支付通道 */
function curMerchantsList(id: string) {
  const curPaymentMethod = paymentMethodList?.value?.method.filter(a => a.id === id)[0]
  return curPaymentMethod?.merchants
}
/** 是否显示虚拟币代收付存款地址 */
function handleVirQrcodeChange(msg: any) {
  VirQrcodeMsg.value = msg
  getQrcodeData()
}
function initCurrency() {
  if (depositCurrencyList.value.length > 0) {
    // if (application.isVirtualCurrency(props.initVirCurrency)) {
    let _code: any
    let initVirCurrencyCode = currencyConfig[props.initVirCurrency]?.cur // application.isVirtualCurrency(props.initVirCurrency) ? currencyConfig[props.initVirCurrency]?.cur : undefined
    if (isOpenFastDeposit.value && payType3Currency.value && payType3Currency.value.length) {
      initVirCurrencyCode = application.isVirtualCurrency(props.initVirCurrency) ? currencyConfig[props.initVirCurrency]?.cur : undefined
      if (initVirCurrencyCode && payType3Currency.value.includes(initVirCurrencyCode))
        _code = initVirCurrencyCode
      else
        _code = virCurrencyListOptions.value[0].currency_id
      activeVirCurrency.value = depositCurrencyList.value.filter(a => a.currency_id === (_code || initVirCurrencyCode))[0] as unknown as ICurrencyOption
    }
    else {
      activeVirCurrency.value = application.isVirtualCurrency(props.initVirCurrency) ? depositCurrencyList.value.filter(a => a.currency_id === initVirCurrencyCode)[0] : depositCurrencyList.value.filter(a => application.isVirtualCurrency(a.currency_name))[0]
    }
    // }
    // else {
    //   activeVirCurrency.value = depositCurrencyList.value.filter(a => application.isVirtualCurrency(a.currency_name))[0] as unknown as ICurrencyOption
    // }
  }
}
// initCurrency()
// 余额有变化，打码信息更新
watch(balanceData, () => {
  runGetFinanceDepositCurrencyData()
})
onActivated(() => {
  if (customRouter.backQuery.initCurrency) {
    const query_initCurrency = customRouter.backQuery.initCurrency as EnumCurrencyKey
    const query_initCurrencyId = currencyConfig[query_initCurrency]?.cur
    if (isOpenFastDeposit.value && payType3Currency.value && payType3Currency.value.length) {
      if (payType3Currency.value.includes(query_initCurrencyId))
        activeVirCurrency.value = virCurrencyListOptions.value.filter(a => a.currency_id === query_initCurrencyId)[0]
      else
        activeVirCurrency.value = virCurrencyListOptions.value[0]
    }
    else {
      activeVirCurrency.value = virCurrencyList.value.filter(a => a.currency_name === customRouter.backQuery.initCurrency)[0] as unknown as ICurrencyOption
    }
  }
  flowData()
})

async function flowData() {
  if (isOpenFastDeposit.value)
    await runFinanceDepositVirtualInfo()
  initCurrency()
  await getData()
}

onMounted(() => {
  if (depositDetail.value && depositDetail.value.subTab === 'virtual' && depositDetail.value.detail) {
    const selectItem = virCurrencyList.value.find(item => item.currency_id === depositDetail.value.detail.currency_id) as unknown as ICurrencyOption
    onVirtCurrencyChange(selectItem)
    promoStore.setDepositDetail(null)
  }

  appEventBus.on(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})
await application.allSettled([flowData()])
</script>

<template>
  <div class="wallet-wrap mb-[16px] flex flex-col gap-[16px]">
    <div v-if="showQrcode || showQrcodeFast" class="flex flex-row items-start justify-start gap-[21px]">
      <!-- 选择货币 -->
      <div v-if="virCurrencyList.length > 0" class="w-1/2 flex flex-col items-start justify-between">
        <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('deposit_currency') }} <span class="text-tg-text-error text-[12px]">*</span></label>
        <template v-if="activeVirCurrency">
          <div v-if="virCurrencyList.length === 1 " class="text-tg-text-white bg1 w-full flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
            <AppCurrencyIcon icon-align="left" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
          </div>
          <BaseSelect
            v-else
            v-model="activeVirCurrency.currency_name"
            class="select1" popper :border="false"
            :options="virCurrencyListOptions" style="--tg-base-select-popper-style-padding-x:10px; width: 100%; --tg-base-select-popper-style-padding-y:11px;"
            popper-strategy="fixed" @popper-hide="onVirtPopperHide"
          >
            <template #label>
              <AppCurrencyIcon icon-align="left" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
            </template>
            <template #popper="{ hide }">
              <div class="bg max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
                <div class="w-full px-[10px]">
                  <BaseSearch
                    v-model="virtSearchValue" style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                    class="base-search-icon-color h-[36px]" :place-holder="t('search')" white-style shape="square"
                  />
                </div>
                <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                  <div
                    v-for="fiat, in virCurrencyListOptions" :key="fiat.value"
                    class="text-tg-text-secondary h-[14px] flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold"
                    @click="hide();onVirtCurrencyChange(fiat)"
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
      <template v-if="isDataLoading && isChangeCurrency">
        <div class="w-1/2 flex flex-col items-start justify-between">
          <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('select_network') }} <span class="text-tg-text-error text-[12px]">*</span></label>
          <div class="text-tg-text-white bg1 h-[40px] w-full flex items-center justify-between rounded-[4px] p-[11px] text-[14px] font-semibold">
            <BaseSkeleton
              bg="#B1BAD3"
              height="20px"
              width="45%"
              animated="ani-opacity"
            />
            <IconUniArrowDown />
          </div>
        </div>
      </template>
      <template v-else>
        <!-- 选择网络标签 -->
        <div v-if="contractList && contractList.length > 0" class="w-1/2 flex flex-col items-start justify-between">
          <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('select_network') }} <span class="text-tg-text-error text-[12px]">*</span></label>
          <div v-if="contractList && contractList.length === 1" class="text-tg-text-white bg1 w-full flex items-center gap-[6px] rounded-[4px] p-[13px] text-[14px] font-semibold">
            {{ getVirContractName(currentNetwork) }}
            <!-- <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeMerchant.alias.toUpperCase()" :show-name="false" /> -->
          </div>
          <BaseSelect
            v-if="contractList && contractList.length > 1"
            ref="currencySelectRef"
            v-model="currentNetwork"
            class="select1"
            :options="contractList"
            popper
            style="--tg-base-select-popper-style-padding-x:10px;width: 100%;--tg-base-select-popper-style-padding-y:11px;"
          >
            <template #popper="{ hide }">
              <div class="scroll-y flex flex-col gap-[16px] py-[16px] pl-[10px] pr-[4px]" :style="{ width: `${currencySelectWidth}px` }">
                <div
                  v-for="itsm, in contractList" :key="itsm.value"
                  class="h-[20px] w-full flex cursor-pointer items-center gap-[6px] text-[14px] font-semibold"
                  :class="{ 'text-tg-text-blue': itsm.value === currentNetwork }"
                  @click="hide();selectNetwork(itsm.value)"
                >
                  <span>{{ itsm.label }}</span>
                </div>
              </div>
            </template>
          </BaseSelect>
        </div>
      </template>
    </div>
    <template v-else>
      <!-- 选择货币 -->
      <div v-if="virCurrencyList.length > 1" class="flex items-center justify-between">
        <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('deposit_currency') }} <span class="text-tg-text-error text-[12px]">*</span></label>
        <template v-if="activeVirCurrency">
          <div v-if="virCurrencyList.length === 1 " class="text-tg-text-white bg1 flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
            <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
          </div>
          <BaseSelect
            v-else
            v-model="activeVirCurrency.currency_name"
            popper-clazz="deep-mode" :skidding="-28" popper :border="false"
            :options="virCurrencyListOptions" style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
            popper-strategy="fixed" class="select1"
            @popper-hide="onVirtPopperHide"
          >
            <template #label>
              <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
            </template>
            <template #popper="{ hide }">
              <div id="WalletDeposit" class="bg max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden py-[12px]">
                <div class="w-full px-[10px]">
                  <BaseSearch
                    v-model="virtSearchValue" style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                    class="base-search-icon-color h-[36px]" :place-holder="t('search')" white-style shape="square"
                  />
                </div>
                <div class="scroll-y w-full flex flex-col gap-[16px] px-[10px]">
                  <div
                    v-for="fiat, in virCurrencyListOptions" :key="fiat.value"
                    class="text-tg-text-secondary theme-color h-[14px] flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-semibold"
                    @click="hide();onVirtCurrencyChange(fiat)"
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
      <!-- 选择网络标签 -->
      <div v-if="contractList && contractList.length > 0" class="flex items-center justify-between">
        <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('select_network') }} <span class="text-tg-text-error text-[12px]">*</span></label>
        <div v-if="contractList && contractList.length === 1" class="text-tg-text-white bg1 flex items-center gap-[6px] rounded-[4px] p-[13px] text-[14px] font-semibold">
          {{ getVirContractName(currentNetwork) }}
        <!-- <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeMerchant.alias.toUpperCase()" :show-name="false" /> -->
        </div>
        <BaseSelect
          v-if="contractList && contractList.length > 1"
          v-model="currentNetwork"
          class="select1"
          :options="contractList"
          popper
          style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
          @select="selectNetwork"
        />
      </div>
    </template>
    <AppLoading v-if="isDataLoading" />

    <!-- 选择支付方式 -->
    <template v-else>
      <template v-if="((paymentMethodList?.method?.length ?? 0 > 0) && (!showQrcode && !showQrcodeFast))">
        <BaseLabel
          :label="t('choose_pay_methods')"
        >
          <div class="bg1 pay-list-wrap mt-[6px] flex flex-col rounded-[4px] px-[9px] py-[6px]">
            <!-- 线上支付列表 -->
            <BaseLabel
              v-for="list in renderList" :key="list.id" :label="list.name" class="mt-[6px] flex flex-col"
            >
                <div v-for="item in list.merchants" :key="item.id" class="relative my-[6px] h-[50px] w-full text-[12px] cursor-pointer rounded bg-[var(--app-wallet-deposit-walletV3-tabs-bg)]" @click="gotoDepositVirtDetail(item, list.id, item.payment_type)">
                <div class="absolute left-0 top-0 inline-flex items-center justify-start gap-[1px]">
                  <div class="bg-tg-wallet-left-card-bg h-[50px] w-[60px] flex items-center justify-center rounded-bl rounded-tl">
                    <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:24px;" :currency-type="item.alias.toUpperCase()" :show-name="false" />
                  </div>
                  <div class="text-tg-text-white ml-[6px] text-[12px] font-medium">
                    {{ item.name }}
                  </div>
                </div>
                <div class="absolute right-[5px] top-[18px] inline-flex items-center justify-end gap-[1px]">
                  <div class="color-secondary text-left text-[12px] font-medium">
                    {{ item.amount_min }}-{{ item.amount_max }} {{ activeVirCurrency.currency_name }}
                  </div>
                  <IconUniArrowRight />
                </div>
                <div v-if="list.pname" class="absolute right-0 top-0 h-[14px] inline-flex items-center justify-end gap-[10px] rounded-bl rounded-tr px-[10px]" :style="{ backgroundColor: tipLableColor(list.ptype) }">
                  <div class="text-right text-[12px] font-semibold text-white">
                    {{ list.pname }}{{ list.ptype === 1002 ? `${list.promo}%` : '' }}
                  </div>
                </div>
              </div>
              <div v-if="ifShowMore(list.id)" class="text-special mb-[6px] mt-[4px] text-center text-[14px]" @click="onShowAllClick(list.id)">
                {{ t('show_more') }}
              </div>
              <div v-if="ifShowHide(list.id)" class="text-special mb-[6px] mt-[4px] text-center text-[14px]" @click="onHideALlClick(list.id)">
                {{ t('hide_all') }}
              </div>
            </BaseLabel>
          </div>
        </BaseLabel>
      </template>
      <template v-else-if="showQrcode || showQrcodeFast">
        <AppDepositVirAddressQrcode class="theme-border" :data="virAddreesQrcodeData" :disabled="isDisableQrcode" :loading="virDepositAddreesLoading" />
      </template>
      <template v-else>
        <div class="bg1 border-tg-text-lightgrey w-full border-[2px] rounded-[4px] border-dashed py-[20px] text-[12px]">
          <div class="flex justify-center gap-[12px]">
            <IconUniWarningColor style="font-size: var(--tg-font-size-base);" />
            <div class="font-medium leading-[19.6px]">
              <div>
                {{ t('not_deposit_information_currency') }}
              </div>
              <div>{{ t('please_again_later_contact_customer_service') }}</div>
            </div>
          </div>
        </div>
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
.base-search-icon-color {
  @include webTheme('white') {
    --tg-base-search-icon-color: #c1c1c1;
    --tg-base-search-icon-border-color: #c1c1c1;
    --tg-text-grey-light: #555555;
    --tg-secondary-main: #555555;
  }
}

.theme-border {
  @include webTheme('green') {
    --tg-secondary-main: #197b59;
  }
}
.wrap {
  width: 100%;
}
.text-special {
  color: var(--tg-text-lightgrey);
}
.color-secondary {
  /* color: var(--tg-text-lightgrey); */
}
.bg1 {
  background: var(--tg-secondary-dark);
  @include webTheme('white') {
    background-color: var(--app-wallet-deposit-walletV3-bg);
  }
}
.wallet-wrap {
  @include webTheme('green') {
    --tg-body-bg: var(--tg-green-dark);
    .pay-list-wrap {
      --app-wallet-deposit-walletV3-tabs-bg: var(--tg-primary-light);
      --tg-wallet-left-card-bg: var(--tg-sport-card-bg);
      background-color: var(--tg-wallet-green-dark-bg);
    }
  }
}
</style>

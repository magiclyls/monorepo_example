<script setup lang="ts">
import type { CurrencyCode, EnumCurrencyKey, IAvailableCurrency, virAddreesQrcode } from '@tg/types'
import { ApiFinanceCoinContract, ApiFinanceDepositVirtualInfo, ApiFinanceMethodComboListV2, ApiThirdVirtualGetAddr } from '@tg/apis'
import { AfunBaseCurrencyIcon, AfunBaseFinanceEmpty, AfunBaseLabel } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconMore, IconUniArrowRight } from '@tg/icons'
import { useAppStore, useBrandStore, useCurrency } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus, application, getCurrencyConfig, isVirtualCurrency, Local, STORAGE_WALLET_ROUTE } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppSelect from '~/components/AppSelect.vue'
import AppSelectCurrency from '~/components/AppSelectCurrency.vue'
import { Message } from '~/utils'
import MerchantList from './merchant-list.vue'
import AppDepositVirAddressQrcode from './viraddress-qrcode.vue'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface Props {
}

defineOptions({
  name: 'AppVirtualDeposit',
})
const props = withDefaults(defineProps<Props>(), {
})
const emit = defineEmits(['loaded'])
const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const appStore = useAppStore()
const currencyStore = useCurrency()
const { userInfo } = storeToRefs(appStore)
const { depositCurrencyList, currencyList } = storeToRefs(currencyStore)
const { brandConfig, isOpenFastDeposit, isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { bool: isDisableQrcode, setTrue: setTrueQrcode, setFalse: setFalseQrcode } = useBoolean(false)
/** KYC弹窗 */
/* const { openKYCDialog } = useDialogKYCVerify() */

const virtSearchValue = ref('')
const paymentContracts = ref([])
/** 当前的支付ID */
const curPaymentId = ref('')
/** 当前的虚拟币 */
const activeVirCurrency = ref<IAvailableCurrency | undefined>()
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

/** 虚拟币协议列表 */
const {
  loading: isDataLoading,
  data: financeCoinContractList,
  runAsync: runAsyncFinanceCoinContractList,
} = useRequest(ApiFinanceCoinContract, {
  onSuccess: (res) => {
    /* if (isOpenFastDeposit.value && res && res.length) {

    } */

  },
})
const loaded = ref(false)
let resolveLoadingPromise: (value: unknown) => void
const loadingPromise = new Promise((resolve) => {
  resolveLoadingPromise = resolve
})
const showLoading = computed(() => {
  return isDataLoading.value || !loaded.value
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
    const virDepositList = res.method.filter((item: any) => item.merchants.filter((child: any) => child.payment_type === 3).length > 0)
    updateVirAddress(virDepositList)
    if (virDepositList && virDepositList.length > 0) {
      // wait load qrcode
    }
    else {
      loaded.value = true
      resolveLoadingPromise(true)
      emit('loaded')
    }
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

const currentContract = computed(() => {
  return financeCoinContractList.value?.find(f => f.currency_id === activeVirCurrency.value?.currency_id)
})
watch(currentContract, (d) => {
  if (d && d?.contract_list.length > 0) {
    currentNetwork.value = d.contract_list[0].value ?? ''
  }
})

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
    return depositCurrencyList.value.filter(a => isVirtualCurrency(a.currency_name)).map((b) => {
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

      _contractList = paymentMethodList.value?.contract?.filter(a => a.currency_id === activeVirCurrency.value?.currency_id) as any[] || []
      return _pay = _contractList[0].contract_list.filter((contract: { value: string }) => _methodList.includes(contract.value))
    }
    else {
      _pay = paymentMethodList.value?.contract?.filter(a => a.currency_id === activeVirCurrency.value?.currency_id) ?? []
      return _pay[0].contract_list
    }
  }
})
const filteredContractList = computed(() => {
  if (isOpenFastDeposit.value && financeDepositVirtualInfo.value && financeDepositVirtualInfo.value.length) {
    const temp = financeDepositVirtualInfo.value.filter(f => f.currency_id === activeVirCurrency.value?.currency_id)[0]
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
    const CurrencyFindIndex = currencyKeys.includes(activeVirCurrency.value?.currency_id ?? '')
    const ContractFindIndex = getContractId(msg).includes(currentNetwork.value)
    return CurrencyFindIndex && ContractFindIndex && virAddreesQrcodeData.value.virDepositAddrees
  }
})
/** 是否直接显示虚拟币代收付二维码 */
const showQrcode = computed(() => {
  return isOpenFastDeposit.value ? true : paymentMethodList.value?.method.length === 1 && paymentMethodList.value?.method[0].merchants.length === 1 && paymentMethodList.value?.method[0].merchants[0].payment_type === 3
})

/** 选择线上支持或转账 */
async function gotoDepositVirtDetail({ item, list }: { item: any, list: any }) {
  /*  if (isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog() */
  const { id } = list
  const { payment_type } = item
  if (userInfo.value?.exclude === 1) {
    Message.error(t('请先解除自我排除'))
    return
  }
  if (paymentLoading.value)
    return
  await runAsyncContractList({ currency_id: activeVirCurrency.value?.currency_id })
  const methodList = paymentTypeContractList.value?.method.filter(item => item.merchants.filter(child => child.payment_type === payment_type).length > 0)
  const _methodList: string[] = []
  if (methodList) {
    methodList.forEach((item) => {
      _methodList.push(item.contract_id)
    })
  }

  paymentContracts.value = contractList.value.filter((contract: { value: string }) => _methodList.includes(contract.value))
  curPaymentId.value = item.id
  Local.push(STORAGE_WALLET_ROUTE, {
    currencyType: 'virtual',
    currencyId: activeVirCurrency.value?.currency_id, // 当前的货币ID
    currencyName: activeVirCurrency.value?.currency_name, // 当前的货币名称
    curMerchant: JSON.stringify(item), // 当前的支付通道
    curPaymentType: payment_type,
    paymentId: id, // 当前的支付ID
    initVirCurrency: JSON.stringify(activeVirCurrency.value), // 初始化当前虚拟币
    activeCurrency: JSON.stringify(activeVirCurrency.value), // 初始化当前虚拟币
    virCurrencyList: JSON.stringify(virCurrencyList.value), // 虚拟币列表
    curDepositPromo: JSON.stringify(curDepositPromo(id)), // 当前支付优惠
    merchantsList: JSON.stringify(curMerchantsList(id)), // 当前支付通道列表
    initCurrentNetwork: currentNetwork.value, // 初始化当前网络
    initContractList: JSON.stringify(paymentContracts.value),
    initvirAddreesQrcodeData: JSON.stringify(virAddreesQrcodeData.value),
  })
  router.push({
    path: '/wallet/vir-deposit-detail',
    query: {

    },
  })
/*   customRouter.push('/deposit/detail', {

  }) */
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
function updateVirAddress(virDepositList: any) {
  if (virDepositList && virDepositList.length > 0) {
    const merchants = virDepositList[0].merchants.filter((item: any) => item.payment_type === 3)
    virAddreesQrcodeData.value.virDepositRatio = virDepositList[0].deposit_promo[0] === undefined ? '' : virDepositList[0].deposit_promo[0].ratio
    virAddreesQrcodeData.value.virDepositMin = virDepositList[0].deposit_promo[0] === undefined ? '' : virDepositList[0].deposit_promo[0].min
    virAddreesQrcodeData.value.currency = activeVirCurrency.value?.currency_name ?? ''
    runAsyncvirDepositAddrees({ id: merchants[0].id, mid: virDepositList[0].id, currency_id: activeVirCurrency.value?.currency_id ?? '' }).then((data) => {
      virAddreesQrcodeData.value.virDepositAddrees = data || ''
      loaded.value = true
      resolveLoadingPromise(true)
      emit('loaded')
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

/** 切换货币类型事件 */
function onVirtCurrencyChange(item: any) {
  activeVirCurrency.value = item
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

const defaultCurrency = computed(() => {
  const routeCurrency = route.query.currency as CurrencyCode
  const routeCurrencyItem = getCurrencyConfig(routeCurrency)
  const initVirCurrencyCode: CurrencyCode = (routeCurrency && isVirtualCurrency(routeCurrencyItem.name)) ? routeCurrency : virCurrencyListOptions.value[0]?.currency_id

  return virCurrencyListOptions.value.find(a => a.currency_id === initVirCurrencyCode)
})

watch(defaultCurrency, (item) => {
  onVirtCurrencyChange(item)
}, { immediate: true })

watch(activeVirCurrency, (t) => {
  if (t) {
    router.replace({
      query: {
        ...route.query,
        currency: t.currency_id,
      },
    })
  }
}, { immediate: true })

watch(
  [() => currentNetwork.value],
  ([networkId]) => {
    if (networkId) {
      runAsyncPaymentMethodList({
        currency_id: activeVirCurrency.value?.currency_id,
        contract_id: networkId,
      })
    }
  },
)

watch(
  () => activeVirCurrency.value?.currency_id,
  (currencyId) => {
    if (currencyId) {
      runAsyncContractList({ currency_id: currencyId })
    }
  },
  { immediate: true },
)

// initCurrency()
// 余额有变化，打码信息更新
watch(currencyList, () => {
  currencyStore.getFinanceDepositCurrency()
})
/* onActivated(() => {
  if (customRouter.backQuery.initCurrency) {
    const query_initCurrency = customRouter.backQuery.initCurrency as EnumCurrencyKey
    const query_initCurrencyId = getCurrencyConfig[query_initCurrency]?.cur
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
}) */

onMounted(() => {
  /* if (depositDetail.value && depositDetail.value.subTab === 'virtual' && depositDetail.value.detail) {
    const selectItem = virCurrencyList.value.find(item => item.currency_id === depositDetail.value.detail.currency_id) as unknown as ICurrencyOption
    onVirtCurrencyChange(selectItem)
    promoStore.setDepositDetail(null)
  } */

  appEventBus.on(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.DEPOSIT_CHANGE_VIRT_QRCODE, handleVirQrcodeChange)
})
if (isOpenFastDeposit.value)
  runFinanceDepositVirtualInfo()

await application.allSettled([runAsyncFinanceCoinContractList(), loadingPromise])
</script>

<template>
  <div class="mt-[16px] flex flex-col gap-[16px] ">
    <div class=" flex gap-[16px]" :class="[showQrcode || showQrcodeFast ? 'flex-row' : 'flex-col']">
      <!-- 选择货币 -->
      <AfunBaseLabel :label="t('存款货币')" required :layout="showQrcode || showQrcodeFast ? 'vertical' : 'horizontal'" style="--afun-base-label-color:#B1BAD3" :class="[showQrcode || showQrcodeFast ? 'flex-1' : '']">
        <template v-if="activeVirCurrency">
          <div
            v-if="virCurrencyList.length === 1"
            class="flex items-center justify-between h-[43px] px-[8px] bg-[#0F212E] rounded-[4px]"
          >
            <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" />
          </div>
          <AppSelectCurrency v-else v-slot="slotProps" :t="t" :options="virCurrencyListOptions" :currency="activeVirCurrency?.currency_id" @choose="onVirtCurrencyChange">
            <div class="flex items-center justify-between h-[43px] px-[8px] bg-[#0F212E] rounded-[4px]" :class="[slotProps.isMenuShown ? 'border-[#F23038]' : 'border-[#EBEBEB]']">
              <AfunBaseCurrencyIcon icon-align="left" :show-name="true" style="--ph-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" />
              <IconUniArrowRight v-if="virCurrencyListOptions.length > 1" class="ml-[4px] text-[#9dabc9] rotate-[90deg]" />
            </div>
          </AppSelectCurrency>
        </template>
      </AfunBaseLabel>
      <!-- 选择网络标签 -->
      <AfunBaseLabel v-if="contractList && contractList.length > 0" :label="t('选择网络')" required :layout="showQrcode || showQrcodeFast ? 'vertical' : 'horizontal'" style="--afun-base-label-color:#B1BAD3" :class="[showQrcode || showQrcodeFast ? 'flex-1' : '']">
        <AppSelect
          v-model="currentNetwork"
          :options="contractList"
          placement="bottom-end"
          style="--app-select-label-border-color: #0F212E; --app-select-label-border-color-active: #0F212E;"
          full
        />
      </AfunBaseLabel>
    </div>
    <!-- 选择支付方式 -->
    <AppLoading v-if="paymentLoading || virDepositAddreesLoading" />
    <AppDepositVirAddressQrcode v-else-if="showQrcode || showQrcodeFast" :data="virAddreesQrcodeData" :disabled="isDisableQrcode" :loading="virDepositAddreesLoading" />
    <AfunBaseLabel v-else-if="paymentMethodList?.method?.length" :label="t('选择支付方式')" style="--afun-base-label-color:#B1BAD3">
      <div class=" pt-[6px] flex flex-col gap-[12px]  rounded-[4px]">
        <!-- 线上支付列表 -->
        <div
          v-for="list in renderList" :key="list.id" :label="list.name" class="mt-6 flex flex-col"
        >
          <div class="font-[600] mb-[6px] text-[#B1BAD3]">
            {{ list.name }}
          </div>
          <MerchantList v-if="activeVirCurrency" :list="list" currency-type="virtual" :currency="activeVirCurrency" @itemclick="gotoDepositVirtDetail" />
          <div v-if="ifShowMore(list.id)" class="center mt-6 cursor-pointer " @click="onShowAllClick(list.id)">
            <IconMore class="text-[24px] more" />
          </div>
          <div v-if="ifShowHide(list.id)" class="center mt-6 cursor-pointer" @click="onHideALlClick(list.id)">
            <IconMore class="text-[24px] rotate-180 more" />
          </div>
        </div>
      </div>
    </AfunBaseLabel>
    <AfunBaseFinanceEmpty v-else :description="$t('无存款渠道')" />
  </div>
</template>

<style lang="scss" scoped>
.select-item {
  width: 100%;
  padding: 0 16px;
  display: flex;
  align-items: center;
  line-height: 24px;
  font-weight: 500;
  font-size: 14px;
  color: #0d2245;
  &.active {
    background-color: #f23038;
    color: white;
  }
}
.more {
  color: #24ee89;
}
</style>

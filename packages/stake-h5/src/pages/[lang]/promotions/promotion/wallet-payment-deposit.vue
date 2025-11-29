<script lang="ts" setup>
import type { IAvailableCurrency, DepositStoryRecordList, EnumCurrencyKey, LoginWalletPaymentDepositActivity, WalletPaymentDepositActivity } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiFinanceDepositVirtualInfo, ApiMemberPromoWalletDailyClaim, ApiMemberPromoWalletDailyData, ApiMemberPromoWalletDailyDetail, ApiMemberPromoWalletDailyList } from '@tg/apis'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
defineOptions({
  name: 'KeepAlivePromotionWalletPaymentDeposit',
})

const props = defineProps<Props>()
interface Item {
  deposit: number
  limit: number
  max: number
  min: number
  scale: number
}
interface Props {
  initVirCurrency: EnumCurrencyKey
}
const { t } = useI18n()
usePageTitle({ prefix: t('wallet_payment_deposit') })

const { openNotify } = useNotify()
const { openWalletDialog } = useWalletDialog()
const { openLoginDialog } = useLoginDialog()
const { jumpToUrl } = useRedirect()
const router = useLocalRouter()
const { isLogin, currentGlobalCurrency, balanceData } = storeToRefs(useAppStore())
const route = useRoute()
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const currentLang = getCurrentLanguageForBackend()
/** 当前存款货币列表：depositCurrencyList  钱包存款接口请求：runGetFinanceDepositCurrencyData */
const { getVirContractName, depositCurrencyList, runGetFinanceDepositCurrencyData } = useCurrencyData()
const { brandConfig, isOpenFastDeposit } = storeToRefs(useBrandStore())
const promoStore = usePromoStore()

const RECORD_PAGE_SIZE = 10
const RECORD_SHOW_NUM = 4
const TIME_FORMAT_1 = 'YYYY-MM-DD'
const TIME_FORMAT_3 = 'YYYY/MM/DD'
const FIXED_DISPLAY_CURRENCY = 'CNY'

const tableColumn: Column[] = [
  {
    title: t('deposit_amount'),
    dataIndex: 'deposit',
    align: 'center',
    width: '50%',
    slot: 'amount',
  },
  {
    title: t('sports_events_inside_table_header_prize'),
    dataIndex: 'min',
    align: 'center',
    slot: 'bonus_rate',
    width: '50%',
  },
]
const pastEventsTableColumn: Column[] = [
  {
    title: t('event_cycle'),
    dataIndex: 'cycle',
    align: 'center',
    width: '33%',
    slot: 'cycle',
  },
  {
    title: t('accumulated_recharge'),
    dataIndex: 'recharge',
    align: 'center',
    width: '33%',
    slot: 'recharge',
  },
  {
    title: t('sports_events_inside_table_header_prize'),
    dataIndex: 'bonus_rate', // 1,2,3,4 领取，审核中，重新提交，已领取
    align: 'center',
    slot: 'bonus_rate',
    width: '34%',
  },
]

/** 当前的虚拟币 */
const activeVirCurrency = ref({} as ICurrencyOption)
const { bool: isChangeCurrency, setTrue: setTrueChangeCurrency, setFalse: setFalseChangeCurrency } = useBoolean(false)
const virtSearchValue = ref('')
const refresh = ref<number>(0)
const fullRes = ref<WalletPaymentDepositActivity>()
const current_taskid = ref<string>('')
const recordPage = ref<number>(1)
const recordExpand = ref<boolean>(false)
const past_events = ref<DepositStoryRecordList>({ d: [], t: 1, s: 10 })
const loginFullRes = ref<LoginWalletPaymentDepositActivity>()
const tab = ref<1 | 2>(1)

const pid = computed(() => Number(route.query.pid))
const preview = route.query.preview?.toString() ?? ''
const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone)
const hasUnReceived = computed<boolean>(() => Boolean((past_events.value.d || []).find(item => item.state === 1)))
const tabList = computed(() => {
  return [{ label: t('this_issue'), value: 1 }, { label: t('past_issues'), value: 2, infoTip: hasUnReceived.value ? t('wait_receive') : undefined }]
})

const configData = computed(() => {
  let conf = null
  if (!fullRes.value?.config)
    return conf
  try {
    conf = JSON.parse(fullRes.value.config)
  }
  catch (e) {

  }
  return conf
})
const imgUrl = computed(() => {
  const images = fullRes.value?.images
  if (!images)
    return ''
  return JSON.parse(images)[currentLang]
})

const currentLangCurrency = computed(() => {
  return currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
})
const globalCurrencyCode = computed(() => {
  if (isLogin.value)
    return application.isVirtualCurrency(currentGlobalCurrency.value) ? currencyConfig.USDT.cur : currencyConfig[currentGlobalCurrency.value].cur

  return currentLangCurrency.value
})

const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const nextUsedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const usedCurrency = computed(() => {
  return getCurrencyConfigByCode(usedCurrencyCode.value).name
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
  return virCurrencyList.value.filter(a => isOpenFastDeposit.value ? (payType3Currency.value.length > 0 ? payType3Currency.value.includes(a.currency_id) : true) : true).filter((a) => {
    return a.currency_name.includes(virtSearchValue.value.toUpperCase()) && Object.keys(loginFullRes.value?.contract || {}).includes(a.value)
  }).map((a) => {
    return {
      ...a,
      value: a.currency_id,
      label: a.currency_name,
    }
  })
})
const currentContract = computed(() => {
  return loginFullRes.value?.contract[activeVirCurrency.value.currency_id]
})
const subTabList = computed(() => {
  const r = []
  if (loginFullRes.value?.wallet && Number(loginFullRes.value?.wallet.length) > 0)
    r.push({ label: t('wallet_payment'), value: 'wallet' })
  if (loginFullRes.value?.contract && Object.keys(loginFullRes.value?.contract).length > 0)
    r.push({ label: t('currency_byte_coin'), value: 'virtual' })
  return r
})
const currentSubTab = ref()
const prize_config = computed<Item[]>(() => {
  const tongue = configData.value?.bonus || []
  return tongue['701'] || []
})
const sortedPrizeConfig = computed(() => {
  const s = prize_config.value || []
  return s.sort((a, b) => Number(a.d) - Number(b.d))
})
const recordParam = computed(() => ({ activity_id: pid.value.toString(), page: recordPage.value, page_size: RECORD_PAGE_SIZE, cur: usedCurrencyCode.value }))

const max_award = computed(() => {
  if (sortedPrizeConfig.value.length === 0)
    return ''
  const bonusType = configData.value?.tongue || 1 // 奖金方式 1(固定金额)  2(随机金额  3(比例金额)
  const { deposit, max, min, scale } = sortedPrizeConfig.value[sortedPrizeConfig.value.length - 1]
  return [formatAmountFunc(min.toString(), FIXED_DISPLAY_CURRENCY), formatAmountFunc(max.toString(), FIXED_DISPLAY_CURRENCY), `${toFixed(scale, 2)}%`][bonusType - 1]
})
const currentDetail = computed(() => {
  let detail = ''
  try {
    detail = fullRes.value ? JSON.parse(fullRes.value.detail)[currentLang] : ''
  }
  catch (e) {

  }
  return detail
})

watch(recordPage, () => {
  getRecord()
})

const recharge_now = computed(() => {
  let button_text = ''
  try {
    button_text = fullRes.value ? JSON.parse(fullRes.value.button_text)[currentLang] : ''
  }
  catch (e) {

  }
  return button_text
}) // 配置的 充值按钮 文案
const recharge_on = computed(() => fullRes.value?.button === 1) // 配置充值按钮 开启

// 领取奖金
const {
  loading: receiveLoading,
  runAsync: runAsyncReceive,
} = useRequest(ApiMemberPromoWalletDailyClaim, {
  onSuccess: (data) => {
    if (data.state === -1) {
      return openNotify({
        type: 'error',
        title: t('fail_bonus'),
        message: t('please_contact_service'),
      })
    }
    const currentTask = past_events.value.d.find(item => item.id === current_taskid.value)
    if (currentTask) {
      currentTask.state = 2
      current_taskid.value = ''
    }
  },
  onError: () => {
    current_taskid.value = ''
    openNotify({
      type: 'error',
      title: t('fail_bonus'),
      message: t('please_contact_service'),
    })
  },
})
// 获取活动历史领取
const {
  loading: recordLoading,
  runAsync: runAsyncRecordList,
} = useRequest(ApiMemberPromoWalletDailyList, {
  onSuccess: (data) => {
    if (data)
      past_events.value = data
  },
})

// 获取config活动配置
const {
  loading: configLoading,
  runAsync: runAsyncProfitConfig,
} = useRequest(ApiMemberPromoWalletDailyDetail, {
  onSuccess: (data) => {
    if ((data.state === 2 || data.state === 3) && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      return goPromo()
    }
    if (data.period === 0) {
      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('promo_currency_error'),
      })
      // 已经在当前页面 且 有之前货币数据的
      if (!fullRes.value)
        goPromo()
    }
    else {
      fullRes.value = data
      if (data.currency_id)
        usedCurrencyCode.value = data.currency_id
    }
  },
  onError: () => {
    openNotify({
      type: 'error',
      code: 'false',
      message: t('promo_end'),
    })
    goPromo()
  },
})
// 获取登录后活动详情
const {
  runAsync: runAsyncConfigDetail,
} = useRequest(ApiMemberPromoWalletDailyData, {
  onSuccess: (data) => {
    if (usedCurrencyCode.value === data.cur)
      loginFullRes.value = data
  },
  onError: () => {
  },
})
const pageLoading = computed(() => {
  let loading = configLoading.value && !fullRes.value
  if (isLogin.value)
    loading = loading || !loginFullRes.value
  return loading
})

/** 获取图标路径 */
function getMerchantsIconPath(type: number, str: string) {
  return type === 2 ? `/webp/bank/${str}.webp` : `/payment/deposit/${str ?? 'dft'}.webp`
}
function openWalletDialogIfNotApp(detail: any) {
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DEPOSIT_MODAL)
  }
  else {
    promoStore.setDepositDetail(detail)
    openWalletDialog()
  }
}
function onTabChange(tab: string) {
  currentSubTab.value = tab
}
/** 切换货币类型事件 */
function onVirtCurrencyChange(item: ICurrencyOption) {
  if (item.currency_id === activeVirCurrency.value.currency_id)
    setFalseChangeCurrency()

  else
    setTrueChangeCurrency()

  activeVirCurrency.value = item
  // getData()
  // emit('changeCurrency', item.currency_name)
}
function onVirtPopperHide() {
  setTimeout(() => {
    virtSearchValue.value = ''
  }, 200)
}
// 立即领取
function handleReceive(task_id: string) {
  if (isLogin.value) {
    current_taskid.value = task_id
    runAsyncReceive(
      { activity_id: task_id, cur: usedCurrencyCode.value },
    )
  }
  else {
    openLoginDialog()
  }
}
function getRecord() {
  runAsyncRecordList(recordParam.value)
}

function getInitRequestList() {
  const r = runAsyncProfitConfig({ pid: pid.value, cur: nextUsedCurrencyCode.value })
  if (isLogin.value) {
    getRecord()
    r.then(() => {
      runAsyncConfigDetail({ activity_id: pid.value.toString(), cur: nextUsedCurrencyCode.value })
    })
  }
}
function mqttRefresh(msg: string) {
  if (msg === 'promo_wallet_daily_total')
    refresh.value++
  // 需更新状态
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}
function initCurrency() {
  /*  if (depositCurrencyList.value.length > 0) {
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
  } */
}

onMounted(() => {
  // console.log('myconsole----:', 'watch started')
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
  watch(globalCurrencyCode, (c) => {
    if (c)
      nextUsedCurrencyCode.value = c
  })
  watch([isLogin, refresh, balanceData, nextUsedCurrencyCode], () => {
    // console.log('myconsole----:', 'changed', '&,fullRes.value:', fullRes.value)
    if (fullRes.value) {
      // 接口有值后的变动
      getInitRequestList()
    }
  })
  watch(subTabList, (newSub) => {
    if (newSub && newSub.length > 0 && !currentSubTab.value)
      currentSubTab.value = newSub[0].value
  })
  watch(virCurrencyListOptions, (newVirCurrency) => {
    if (newVirCurrency && newVirCurrency.length > 0 && !activeVirCurrency.value?.currency_id)
      activeVirCurrency.value = newVirCurrency[0]
  })

  // 之前是不支持的货币，重新请求
  nextUsedCurrencyCode.value = globalCurrencyCode.value
  getInitRequestList()
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

if (!pid.value)
  goPromo()
</script>

<template>
  <AppLoading v-if="(pageLoading)" full-screen />
  <div v-else class="text-tg-text-lightgrey fixed-container m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="text-sm font-semibold text-[#B1BAD3]">
      <BaseTab v-model="tab" style="--tg-tab-style-inner-padding-y:12px;" :full="true" :list="tabList" class="grey-tab mb-[20px]" />
      <div v-if="tab === 1">
        <div class="text-grey mb-[20px] text-center text-xs">
          {{ t('statistic_period') }}{{ `${fullRes?.display_start_at_tz} - ${fullRes?.display_end_at_tz}` }}
        </div>
        <div class="text-grey rounded-[4px] bg-light p-[12px]">
          <div class="mb-[8px] flex justify-between">
            <span>{{ $t('recent_recharge_time') }}</span>
            <span>{{ loginFullRes?.recent_deposit_at || '-' }}</span>
          </div>
          <div class="mb-[8px] flex justify-between">
            <span>{{ $t('recent_recharge_amount') }}</span>
            <span class="flex">
              <AppAmount class="theme-amount" :amount="loginFullRes?.recent_deposit_amount || '0.00'" :currency-type="FIXED_DISPLAY_CURRENCY" />
            </span>
          </div>
          <div class="mb-[8px] flex justify-between">
            <span>{{ $t('today_accumulated_recharge') }}</span>

            <span class="flex">
              <AppAmount class="theme-amount" :amount=" loginFullRes?.deposit_amount || '0.00'" :currency-type="FIXED_DISPLAY_CURRENCY" />
            </span>
          </div>

          <div v-if="isLogin" class="bg-deep flex flex-col items-center justify-center rounded-[4px] p-[12px]">
            <template v-if="loginFullRes?.state === 1">
              <span class="text-tg-text-white font-semibold">{{ $t('claim_bonus_time') }}</span>
              <span class="my-[6px] font-normal">{{ loginFullRes?.claim_time }}</span>
              <img class="mb-[15px] h-[30px] w-[43px]" src="/stake/webp/promotions/dollar.webp" alt="">
              <div class="flex font-normal">
                <AppAmount class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'" :currency-type="FIXED_DISPLAY_CURRENCY" />
              </div>
            </template>
            <template v-else>
              <span class="text-tg-text-white font-semibold">{{ $t('finance_other_tab_bonus') }}</span>
              <div class="my-[6px] flex">
                <AppAmount class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'" :currency-type="FIXED_DISPLAY_CURRENCY" />
              </div>
              <img class="mb-[10px] h-[30px] w-[43px]" src="/stake/webp/promotions/dollar.webp" alt="">

              <BaseButton
                class="w-[100%]" bg-style="secondary" size="md"
                @click="openWalletDialogIfNotApp"
              >
                {{ t('fast_go_recharge') }}
              </BaseButton>
            </template>
          </div>
          <div v-else class="bg-deep rounded-[4px] p-[12px]">
            <div class="min-h-[52px] flex items-center justify-center">
              <span>{{ $t('login_view_more') }}</span>
            </div>
            <BaseButton
              class="mt-[12px] w-[100%]" bg-style="secondary" size="md"
              @click.stop="openLoginDialog"
            >
              {{ $t('login_now') }}
            </BaseButton>
          </div>
        </div>
      </div>
      <div v-else>
        <BaseTable class="table" :columns="pastEventsTableColumn" last-first-padding :data-source="past_events.d">
          <template #cycle="{ record }">
            <span>{{ dayjs.unix(record.created_at).tz(currentDollarZone).format(TIME_FORMAT_3) }}</span>
          </template>
          <template #recharge="{ record }">
            <div class="flex items-center justify-center">
              <AppAmount
                class="theme-amount"
                :amount="record.deposit_amount || '0.00'" :currency-type="FIXED_DISPLAY_CURRENCY"
              />
            </div>
          </template>
          <template #bonus_rate="{ record }">
            <BaseButton
              v-if="record.state === 1"
              style="--tg-spacing-button-padding-vertical-xs:7px;"
              class="w-[100%]" bg-style="secondary" size="xs"
              :loading="receiveLoading && current_taskid === record.id"
              @click.stop="handleReceive(record.id)"
            >
              {{ t('receive') }}
            </BaseButton>
            <BaseButton
              v-else-if="record.state === 2"
              style="--tg-spacing-button-padding-vertical-xs:7px;"
              class="w-[100%] disabled-btn" size="xs"
              :disabled="true"
            >
              {{ t('received') }}
            </BaseButton>
            <BaseButton
              v-else-if="record.state === 3"
              style="--tg-spacing-button-padding-vertical-xs:7px;"
              class="w-[100%] disabled-btn" size="xs"
              :disabled="true"
            >
              {{ t('expired') }}
            </basebutton>
            <BaseButton
              v-else-if="record.state === 4"
              style="--tg-spacing-button-padding-vertical-xs:7px;"
              class="w-[100%] disabled-btn" size="xs"
              :disabled="true"
            >
              {{ t('wait_receive') }}
            </basebutton>
          </template>
        </BaseTable>
        <BasePaginationV1 v-if="past_events.t > 0" v-model="recordPage" :total-pages="Math.ceil(past_events.t / RECORD_PAGE_SIZE) || 1" :disabled="recordLoading" class="my-[16px]" />
        <!-- <template v-if="(past_events.d || []).length > RECORD_SHOW_NUM">
          <div v-if="recordExpand" class="cursor-pointer text-center text-[14px] leading-[24px]" @click="recordExpand = false">
            {{ $t('hide_all') }}
          </div>
          <div v-else class="mb-[6px] mt-[4px] cursor-pointer text-center text-[14px]" @click="recordExpand = true">
            {{ $t('show_more') }}
          </div>
        </template> -->
        <!-- <div class="split-line" /> -->
      </div>
    </div>

    <BaseTable class="table" :columns="tableColumn" last-first-padding :data-source="prize_config ?? []">
      <template #amount="{ record }">
        <div class="theme-amount flex items-center justify-center">
          <span>≥</span>
          <AppAmount :amount="record.deposit || '0.00'" :currency-type="FIXED_DISPLAY_CURRENCY" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="theme-amount flex items-center justify-center">
          <span class="">{{ [formatAmountFunc(record.min, usedCurrency), `${formatAmountFunc(record.min, usedCurrency)}-${formatAmountFunc(record.max, usedCurrency)}`, `${toFixed(record.scale, 2)}%`][configData?.tongue - 1] }}</span>&nbsp;
          <AppCurrencyIcon :currency-type="FIXED_DISPLAY_CURRENCY" />
        </div>
      </template>
    </BaseTable>

    <!-- 充值 -->
    <div v-if="isLogin && tab === 1 && loginFullRes?.wallet" class="mt-[16px] rounded bg-light p-[16px]">
      <div class="text-tg-text-white mb-[16px] text-center text-lg">
        {{ t('join_payment') }}
      </div>
      <div v-if="subTabList.length > 1" class="mb-[16px] h-[25px] flex flex-row">
        <div
          v-for="item in subTabList" :key="item.value"
          class="text-tg-text-lightgrey grow cursor-pointer border-b-[1px] border-solid pb-[4px] text-center text-[14px] font-semibold leading-[19.6px]"
          :class="[item.value === currentSubTab ? 'border-tab-active text-tg-text-white' : 'border-tab-default']" @click="onTabChange(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <div v-if="currentSubTab === 'wallet'" class="bg-deep payment p-[8px]">
        <div v-for="item in loginFullRes.wallet" :key="item.id" class="flex">
          <div class="h-[50px] w-[60px] flex items-center justify-center rounded-bl rounded-tl bg-dark">
            <BaseImage width="24px" height="24px" :url="getMerchantsIconPath(1, item.zk_id)" is-network />
          </div>
          <div class="bg-main-light h-[50px] flex flex-1 items-center justify-between rounded rounded-l-none pl-[6px] pr-[6px]">
            <div class="text-tg-text-white text-xs">
              {{ item.name }}
            </div>
            <BaseButton bg-style="secondary" class="h-[28px] w-[85px] shrink-0" @click="() => openWalletDialogIfNotApp({ subTab: 'wallet', detail: item })">
              {{ t('fast_go_recharge') }}
            </BaseButton>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="payment bg-deep p-[8px]">
          <!-- 选择货币 -->
          <div v-if="virCurrencyList.length > 1" class="flex items-center justify-between">
            <label class="text-[14px] font-semibold leading-[19.6px]">{{ t('deposit_currency') }} <span class="text-tg-text-error text-[12px]">*</span></label>
            <template v-if="activeVirCurrency">
              <div v-if="virCurrencyList.length === 1 " class="text-tg-text-white bg-main-light-dark flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-semibold">
                <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
              </div>
              <BaseSelect
                v-else
                v-model="activeVirCurrency.currency_name"
                popper-clazz="deep-mode" :skidding="-28" popper :border="false"
                :options="virCurrencyListOptions" style="--tg-base-select-popper-style-padding-x:10px;--tg-base-select-popper-style-padding-y:11px;"
                popper-strategy="fixed" @popper-hide="onVirtPopperHide"
              >
                <template #label>
                  <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:18px;" :currency-type="activeVirCurrency.currency_name" show-name />
                </template>
                <template #popper="{ hide }">
                  <div class="max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
                    <div class="w-full px-[10px]">
                      <BaseSearch
                        v-model="virtSearchValue" style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;"
                        class="h-[36px]" :place-holder="t('search')" white-style shape="square"
                      />
                    </div>
                    <div class="scroll-y w-full flex flex-col">
                      <div
                        v-for="fiat, in virCurrencyListOptions" :key="fiat.value"
                        class="theme-color flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[14px] text-[14px] font-semibold"
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
          <div v-for="item in currentContract" :key="item.id" class="flex">
            <div class="h-[50px] w-[60px] flex items-center justify-center rounded-bl rounded-tl bg-dark">
              <AppCurrencyIcon icon-align="right" style="--tg-app-currency-icon-size:24px;" :currency-type="activeVirCurrency.currency_name" :show-name="false" />
            </div>
            <div class="bg-main-light h-[50px] flex flex-1 items-center justify-between rounded rounded-l-none pl-[6px] pr-[6px]">
              <div class="text-tg-text-white text-xs">
                {{ item.label }}
              </div>
              <BaseButton bg-style="secondary" class="h-[28px] w-[85px] shrink-0" @click="() => openWalletDialogIfNotApp({ subTab: 'virtual', detail: item })">
                {{ t('fast_go_recharge') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-[16px]">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ t('activity_rule_desc') }}
      </div>
      <div class="my-[16px]">
        <BaseRichArea v-if="fullRes?.rule_type === 2" :content="currentDetail" />
        <AppPromotionBaseRuleText
          v-else
          :amount="max_award" :currency-type="FIXED_DISPLAY_CURRENCY"
          :content="currentDetail"
        />
        <BaseButton
          v-if="isLogin && recharge_on"
          class="mt-[16px] w-[100%]" bg-style="secondary" size="md"
          @click="jumpToUrl({ type: Number(fullRes?.button_type), jumpUrl: fullRes?.button_redirect })"
        >
          {{ recharge_now }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.border-tab-default {
  border-bottom-color: var(--tg-secondary-main);
  @include webTheme('white') {
    border-bottom-color: #c1c1c1;
  }
}
.border-tab-active {
  border-bottom-color: var(--tg-text-blue);
  @include webTheme('white') {
    border-bottom-color: #f2ca5c;
  }
  @include webTheme('green') {
    border-bottom-color: #f6d14a;
  }
}
.bg-light {
  background-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.bg-dark {
  background-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background-color: #c1c1c1;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.bg-main-light {
  background-color: var(--tg-primary-main);
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #0e6746;
  }
}
.bg-deep {
  background-color: var(--tg-primary-main);
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
  @include webTheme('green') {
    background-color: #02432d;
  }
}
.grey-tab {
  @include webTheme('white') {
    --tg-tab-style-wrap-bg-color: #f5f5f5;
  }
}
.theme-color {
  color: var(--tg-secondary-main);
  @include webTheme('green') {
    color: #42bc91;
  }
  &:hover {
    @include webTheme('green') {
      background: #ffefb0;
    }
  }
  @include webTheme('white') {
    color: #2f4553;
  }
}
.fixed-container {
  @include webTheme('green') {
    --tg-primary-main: #076237;
  }
}
.split-line {
  margin: 20px 0;
  border-bottom: 1px solid #2f4554;
}
.payment > *:not(:last-child) {
  margin-bottom: var(--tg-spacing-6);
}
.table {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
    --tg-table-odd-background: var(--tg-primary-main);
    --tg-table-even-background: var(--tg-secondary-dark);
  }
}
.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
.text-grey {
  @include webTheme('white') {
    color: #484848;
  }
  @include webTheme('green') {
    color: #3cb389;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

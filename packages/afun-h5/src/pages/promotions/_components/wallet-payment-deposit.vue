<script lang="ts" setup>
import type { Column, CurrencyCode, DepositStoryRecordList, EnumCurrencyKey, IAvailableCurrency, LoginWalletPaymentDepositActivity, WalletPaymentDepositActivity } from '@tg/types'
import {
  ApiFinanceDepositVirtualInfo,
  ApiMemberPromoWalletDailyClaim,
  ApiMemberPromoWalletDailyData,
  ApiMemberPromoWalletDailyDetail,
  ApiMemberPromoWalletDailyList,
} from '@tg/apis'
import {
  AfunBaseAmount,
  AfunBaseButton,
  AfunBaseCurrencyIcon,
  AfunBaseImage,
  AfunBaseRichArea,
  AfunBaseSelect,
  AfunBaseTable,
  AfunBaseTabs,
} from '@tg/bccomponents'
import { useBoolean, useRedirect } from '@tg/hooks'
import { useAppStore, useBrandStore, useCurrency, usePromoStore } from '@tg/stores'
import { EventBusNames, languageConfig, SendFlutterAppMessage } from '@tg/types'
import {
  appEventBus,
  application,
  currencyMap,
  formatAmountFunc,
  getCurrencyConfig,
  isFlutterApp,
  sendMsgToFlutterApp,
  toFixed,
} from '@tg/utils'
import { getLang, getLangConfig, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

interface ICurrencyOption extends IAvailableCurrency {
  label: EnumCurrencyKey
  value: CurrencyCode
}
interface Props {
  initVirCurrency: EnumCurrencyKey
}

defineOptions({
  name: 'WalletPaymentDeposit',
})
const props = defineProps<Props>()
interface Item {
  deposit: number
  limit: number
  max: number
  min: number
  scale: number
}
const setTitle = inject('setTitle', (v: string) => { })

const { t } = useI18n()
setTitle(t('钱包支付存款'))
const { jumpToUrl } = useRedirect()
const router = useRouter()
const { isLogin } = storeToRefs(useAppStore())
/** 当前存款货币列表：depositCurrencyList  钱包存款接口请求：runGetFinanceDepositCurrencyData */
const { currentGlobalCurrencyMap, depositCurrencyList, currencyList } = storeToRefs(useCurrency())
const route = useRoute()
const userLanguage = ref(getLang())
const currentLang = getLangForBackend()
const { brandConfig, isOpenFastDeposit } = storeToRefs(useBrandStore())
const promoStore = usePromoStore()

const RECORD_PAGE_SIZE = 10
const RECORD_SHOW_NUM = 4
const TIME_FORMAT_1 = 'YYYY-MM-DD'
const TIME_FORMAT_3 = 'YYYY/MM/DD'
const FIXED_DISPLAY_CURRENCY = 'CNY'

const tableColumn: Column[] = [
  {
    title: t('充值金额'),
    dataIndex: 'deposit',
    align: 'center',
    width: '50%',
    slot: 'amount',
  },
  {
    title: t('奖金'),
    dataIndex: 'min',
    align: 'center',
    slot: 'bonus_rate',
    width: '50%',
  },
]
const pastEventsTableColumn: Column[] = [
  {
    title: t('周期'),
    dataIndex: 'cycle',
    align: 'center',
    width: '33%',
    slot: 'cycle',
  },
  {
    title: t('累计充值'),
    dataIndex: 'recharge',
    align: 'center',
    width: '33%',
    slot: 'recharge',
  },
  {
    title: t('奖金'),
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
const currentDollarZone = ref(getLangConfig()?.zone)
const hasUnReceived = computed<boolean>(() => Boolean((past_events.value.d || []).find(item => item.state === 1)))
const tabList = computed(() => {
  return [{ label: t('本期'), value: 1 }, { label: t('往期'), value: 2, infoTip: hasUnReceived.value ? t('待领取') : undefined }]
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
  return JSON.parse(images)[currentLang as string] || ''
})

const currentLangCurrency = computed(() => {
  return currencyMap[languageConfig[getLang()].currency].cur
})
const globalCurrencyCode = computed(() => {
  if (isLogin.value)
    return application.isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? currencyMap.USDT.cur : currentGlobalCurrencyMap.value.cur

  return currentLangCurrency.value
})

const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const nextUsedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const usedCurrency = computed(() => {
  return getCurrencyConfig(usedCurrencyCode.value).name
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
    r.push({ label: t('钱包支付'), value: 'wallet' })
  if (loginFullRes.value?.contract && Object.keys(loginFullRes.value?.contract).length > 0)
    r.push({ label: t('加密货币'), value: 'virtual' })
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
    detail = fullRes.value ? JSON.parse(fullRes.value.detail)[currentLang as string] : ''
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
    button_text = fullRes.value ? JSON.parse(fullRes.value.button_text)[currentLang as string] : ''
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
      Message.error(t('请联系在线客服'))
      return
    }
    const currentTask = past_events.value.d.find(item => item.id === current_taskid.value)
    if (currentTask) {
      currentTask.state = 2
      current_taskid.value = ''
    }
  },
  onError: () => {
    current_taskid.value = ''
    Message.error(t('请联系在线客服'))
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
const showErrorThrottled = throttle((message: string) => {
  Message.error(message)
}, 2000, { trailing: false })
// 获取config活动配置
const {
  loading: configLoading,
  runAsync: runAsyncProfitConfig,
} = useRequest(ApiMemberPromoWalletDailyDetail, {
  onSuccess: (data) => {
    if ((data.state === 2 || data.state === 3) && !preview) {
      Message.error(t('活动已结束'))
      return goPromo()
    }
    if (data.period === 0) {
      // Message.info(t('当前选择的货币不支持此活动'))
      showErrorThrottled(t('当前选择的货币不支持此活动'))
      // 已经在当前页面 且 有之前货币数据的
      if (!fullRes.value) {
        nextUsedCurrencyCode.value = data.currencys[0]
        getInitRequestList()
        // goPromo()
      }
    }
    else {
      fullRes.value = data
      if (data.currency_id)
        usedCurrencyCode.value = data.currency_id
    }
  },
  onError: () => {
    Message.error(t('活动已结束'))
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
    router.push('/wallet')
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
    router.push('/login')
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
    router.replace('/promotions')
}

onMounted(() => {
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
  watch(globalCurrencyCode, (c) => {
    if (c)
      nextUsedCurrencyCode.value = c
  })
  watch([isLogin, refresh, currencyList, nextUsedCurrencyCode], () => {
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
  <div v-else class="wallet-payment-deposit-active text-[#b1bad3] fixed-container">
    <div class="mb-[16px] center">
      <AfunBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div class="text-[14px] font-[600] text-[#b1bad3]">
      <AfunBaseTabs
        v-model="tab" style="--afun-tabs-wrap-padding-y:5px;" :list="tabList" :full="true" :type="5"
        class="grey-tab mb-[20px]"
      />
      <div v-if="tab === 1">
        <div class=" mb-[20px] text-center text-[12px]">
          {{ t('统计周期1') }}{{ `${fullRes?.display_start_at_tz} - ${fullRes?.display_end_at_tz}` }}
        </div>
        <div class="rounded-[4px] bg-[#213743] p-[12px]">
          <div class="h-[14px] mb-[8px] flex justify-between">
            <span>{{ $t('最近充值时间1') }}</span>
            <span>{{ loginFullRes?.recent_deposit_at || '-' }}</span>
          </div>
          <div class="h-[14px] mb-[8px] flex justify-between">
            <span>{{ $t('最近充值金额1') }}</span>
            <span class="flex">
              <AfunBaseAmount
                class="theme-amount" :amount="loginFullRes?.recent_deposit_amount || '0.00'"
                :currency-type="FIXED_DISPLAY_CURRENCY"
              />
            </span>
          </div>
          <div class="h-[14px] mb-[8px] flex justify-between">
            <span>{{ $t('本日累计充值1') }}</span>

            <span class="flex">
              <AfunBaseAmount
                class="theme-amount" :amount="loginFullRes?.deposit_amount || '0.00'"
                :currency-type="FIXED_DISPLAY_CURRENCY"
              />
            </span>
          </div>

          <div v-if="isLogin" class="bg-deep flex flex-col items-center justify-center rounded-[4px] p-[12px]">
            <template v-if="loginFullRes?.state === 1">
              <span class="text-[#b1bad3] font-[600]">{{ $t('领取奖金时间') }}</span>
              <span class="my-[6px] font-normal">{{ loginFullRes?.claim_time }}</span>
              <AfunBaseImage
                class="mb-[15px] h-[30px] w-[43px]" url="/m/afun-h5/png/promo-wallet-payment-dollar.png"
                alt=""
              />
              <div class="flex font-normal">
                <AfunBaseAmount
                  class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'"
                  :currency-type="FIXED_DISPLAY_CURRENCY"
                />
              </div>
            </template>
            <template v-else>
              <span class="text-[#fff] font-[600]">{{ $t('奖金') }}</span>
              <div class="my-[6px] flex">
                <AfunBaseAmount
                  class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'"
                  :currency-type="FIXED_DISPLAY_CURRENCY"
                />
              </div>
              <AfunBaseImage
                class="mb-[10px] h-[30px] w-[43px]" url="/m/afun-h5/png/promo-wallet-payment-dollar.png"
                alt=""
              />
              <AfunBaseButton class="w-[100%]" @click="openWalletDialogIfNotApp">
                {{ t('立即充值') }}
              </AfunBaseButton>
            </template>
          </div>
          <div v-else class="bg-deep rounded-[4px] p-[12px]">
            <div class="min-h-[52px] center">
              <span>{{ $t('登录后查看更多内容') }}</span>
            </div>
            <AfunBaseButton class="mt-[12px] w-[100%]" @click.stop="router.push('/login')">
              {{ $t('立即登录') }}
            </AfunBaseButton>
          </div>
        </div>
      </div>
      <div v-else>
        <AfunBaseTable :columns="pastEventsTableColumn" last-first-padding :data-source="past_events.d">
          <template #cycle="{ record }">
            <span>{{ dayjs.unix(record.created_at).tz(currentDollarZone).format(TIME_FORMAT_3) }}</span>
          </template>
          <template #recharge="{ record }">
            <div class="center">
              <AfunBaseAmount
                class="theme-amount" :amount="record.deposit_amount || '0.00'"
                :currency-type="FIXED_DISPLAY_CURRENCY"
              />
            </div>
          </template>
          <template #bonus_rate="{ record }">
            <AfunBaseButton
              v-if="record.state === 1" class="w-[100%]"
              :loading="receiveLoading && current_taskid === record.id" @click.stop="handleReceive(record.id)"
            >
              {{ t('领取') }}
            </AfunBaseButton>
            <AfunBaseButton
              v-else-if="record.state === 2" class="w-[100%] disabled-btn" :disabled="true"
              style="--afun-base-button-primary-background-color:#b1bad3;--afun-base-button-disabled-opacity:0.85"
            >
              {{ t('已领取') }}
            </AfunBaseButton>
            <AfunBaseButton
              v-else-if="record.state === 3" class="w-[100%] disabled-btn" :disabled="true"
              style="--afun-base-button-primary-background-color:#b1bad3;--afun-base-button-disabled-opacity:0.85"
            >
              {{ t('已过期') }}
            </AfunBaseButton>
            <AfunBaseButton v-else-if="record.state === 4" class="w-[100%] disabled-btn" :disabled="true">
              {{ t('待领取') }}
            </AfunBaseButton>
          </template>
        </AfunBaseTable>
        <!-- TODO -->
        <!-- <BasePaginationV1
          v-if="past_events.t > 0" v-model="recordPage"
          :total-pages="Math.ceil(past_events.t / RECORD_PAGE_SIZE) || 1" :disabled="recordLoading" class="my-[16px]"
        /> -->
      </div>
    </div>

    <AfunBaseTable :columns="tableColumn" last-first-padding :data-source="prize_config ?? []">
      <template #amount="{ record }">
        <div class="theme-amount center">
          <span>≥</span>
          <AfunBaseAmount :amount="record.deposit || '0.00'" :currency-type="FIXED_DISPLAY_CURRENCY" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="theme-amount center">
          <span class="">
            {{ [formatAmountFunc(record.min, usedCurrency), `${formatAmountFunc(record.min, usedCurrency)}-${formatAmountFunc(record.max, usedCurrency)}`, `${toFixed(record.scale, 2)}%`][configData?.tongue - 1] }}
          </span>&nbsp;
          <AfunBaseCurrencyIcon v-if="isLogin" :currency-type="FIXED_DISPLAY_CURRENCY" />
        </div>
      </template>
    </AfunBaseTable>

    <!-- 充值 -->
    <div v-if="isLogin && tab === 1 && loginFullRes?.wallet" class="mt-[16px] rounded-[4px] bg-[#213743] p-[16px]">
      <div class="text-[#fff] mb-[16px] text-center text-[18px] font-semibold">
        {{ t('参与支付方式') }}
      </div>
      <div v-if="subTabList.length > 1" class="mb-[16px] h-[25px] flex flex-row">
        <div
          v-for="item in subTabList" :key="item.value"
          class=" grow cursor-pointer border-b-[1px] border-solid pb-[4px] font-[600] text-center text-[14px] font-[600] leading-[19.6px]"
          :class="[item.value === currentSubTab ? 'border-tab-active text-[#fff] ' : ' text-[#b1bad3] border-tab-default']"
          @click="onTabChange(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
      <div v-if="currentSubTab === 'wallet'" class="bg-deep payment p-[8px]">
        <div v-for="item in loginFullRes.wallet" :key="item.id" class="flex">
          <div class="h-[50px] w-[60px] center rounded-bl-[4px] rounded-tl-4px bg-dark">
            <AfunBaseImage width="24px" height="24px" :url="getMerchantsIconPath(1, item.zk_id)" is-network />
          </div>
          <div
            class="bg-main-light h-[50px] flex flex-1 items-center justify-between rounded-[4px] rounded-l-none pl-[6px] pr-[6px]"
          >
            <div class="text-[#fff] text-[12px]">
              {{ item.name }}
            </div>
            <AfunBaseButton
              bg-style="secondary" class=" shrink-0 text-[14px]"
              style="--afun-base-button-font-size: 14px; --afun-base-button-line-height: 14px;--afun-base-button-padding-y:6px; --afun-base-button-padding-x: 18px;"
              @click="() => openWalletDialogIfNotApp({ subTab: 'wallet', detail: item })"
            >
              {{ t('立即充值') }}
            </AfunBaseButton>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="payment bg-deep p-[8px]">
          <!-- 选择货币 -->
          <div v-if="virCurrencyList.length > 1" class="flex items-center justify-between">
            <label class="text-[14px] font-[600] leading-[19.6px]">{{ t('存款货币') }} <span
              class="text-[#ed4163] text-[12px]"
            >*</span></label>
            <template v-if="activeVirCurrency">
              <div
                v-if="virCurrencyList.length === 1"
                class="text-[#fff] bg-main-light-dark flex items-center rounded-[4px] px-[10px] py-[11px] text-[14px] font-[600]"
              >
                <AfunBaseCurrencyIcon
                  v-if="isLogin"
                  icon-align="right" style="--tg-app-currency-icon-size:18px;"
                  :currency-type="activeVirCurrency.currency_name" show-name
                />
              </div>
              <AfunBaseSelect
                v-else v-model="activeVirCurrency.currency_name" :skidding="-28"
                :options="virCurrencyListOptions" @popper-hide="onVirtPopperHide"
              >
                <template #label>
                  <AfunBaseCurrencyIcon
                    v-if="isLogin"
                    icon-align="right" style="--tg-app-currency-icon-size:18px;"
                    :currency-type="activeVirCurrency.currency_name" show-name
                  />
                </template>
                <template #popper="{ hide }">
                  <div class="max-h-[360px] max-w-[180px] flex flex-col gap-[16px] overflow-hidden pt-[12px]">
                    <div class="w-full px-[10px]">
                      <BaseSearch
                        v-model="virtSearchValue"
                        style="--tg-base-search-icon-size:16px;--tg-base-search-base-padding-x:12px;" class="h-[36px]"
                        :place-holder="t('搜索')" white-style shape="square"
                      />
                    </div>
                    <div class="scroll-y w-full flex flex-col">
                      <div
                        v-for="fiat, in virCurrencyListOptions" :key="fiat.value"
                        class="theme-color flex-shrink-0 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap px-[10px] py-[14px] text-[14px] font-[600]"
                        @click="hide(); onVirtCurrencyChange(fiat)"
                      >
                        <div class="flex items-center justify-between">
                          <AfunBaseCurrencyIcon v-if="isLogin" :currency-type="fiat.label" show-name />
                          <span>{{ application.formatNumDecimal(fiat.balance ? fiat.balance : 0,
                                                                currencyMap[fiat.currency_name].decimal) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </AfunBaseSelect>
            </template>
          </div>
          <div v-for="item in currentContract" :key="item.id" class="flex">
            <div
              class="h-[50px] w-[60px] center rounded-bl-[4px] rounded-tl-[4px] bg-dark"
            >
              <AfunBaseCurrencyIcon
                v-if="isLogin"
                icon-align="right" style="--tg-app-currency-icon-size:24px;"
                :currency-type="activeVirCurrency.currency_name" :show-name="false"
              />
            </div>
            <div
              class="bg-main-light h-[50px] flex flex-1 items-center justify-between rounded rounded-l-none pl-[6px] pr-[6px]"
            >
              <div class="text-[#fff] text-[12px]">
                {{ item.label }}
              </div>
              <AfunBaseButton
                class=" shrink-0 text-[14px]"
                style="--afun-base-button-font-size: 14px; --afun-base-button-line-height: 14px;--afun-base-button-padding-y:6px; --afun-base-button-padding-x: 18px;"
                @click="() => openWalletDialogIfNotApp({ subTab: 'virtual', detail: item })"
              >
                {{ t('立即充值') }}
              </AfunBaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-[16px]">
      <div class="text-[#fff] text-[20px] font-[600]">
        {{ t('活动规则说明') }}
      </div>
      <div class="mt-[16px]">
        <AfunBaseRichArea v-if="fullRes?.rule_type === 2" :content="currentDetail" />
        <AppPromotionBaseRuleText
          v-else :amount="max_award" :is-login="isLogin" :currency-type="FIXED_DISPLAY_CURRENCY"
          :content="currentDetail"
        />
        <AfunBaseButton
          v-if="isLogin && recharge_on" class="mt-[16px] w-[100%]"
          @click="jumpToUrl({ type: Number(fullRes?.button_type), jumpUrl: fullRes?.button_redirect })"
        >
          {{ recharge_now }}
        </AfunBaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.set-radios {
  --tg-base-img-style-radius: 12px;
}
.border-tab-default {
  border-bottom-color: #6d7693;
}

.border-tab-active {
  border-bottom-color: #1475e1;
}

.bg-light {
  background-color: #fff;
}

.bg-dark {
  background-color: #213744;
}

.bg-main-light {
  background-color: #2f4553;
}

.bg-deep {
  background-color: #1a2c38;
}

.grey-tab {
}

.theme-color {
  color: #2f4553;

  &:hover {
  }
}

.fixed-container {
}

.split-line {
  margin: 20px 0;
  border-bottom: 1px solid #2f4554;
}

.payment {
  border: 1px solid rgba(#ebebeb, 0);
  padding: 9px;
  border-radius: 4px;
  > *:not(:last-child) {
    margin-bottom: 6px;
  }
}

.wallet-payment-deposit-active {
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 14px;
  --afun-base-button-font-size: 14px;
  --afun-tabs-item-color: #fff;
  --afun-tabs-item-active-color: #fff;
  --afun-table-th-color: #b1bad3;
}
</style>

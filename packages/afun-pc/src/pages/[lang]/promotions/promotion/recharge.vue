<script lang="ts" setup>
import type { DepositStoryRecordList, RechargeActivity } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoDepositAccumulative, ApiMemberPromoDepositFirst, ApiMemberPromoDepositReceive, ApiMemberPromoDepositRecordResubmit, ApiMemberPromoDepositRegistration, ApiMemberPromoDepositStoryRecordList } from '@tg/apis'
import dayjs from 'dayjs'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { formatAmountFunc } from '~/composables/useAmountFormat'

const { t } = useI18n()
const { openNotify } = useNotify()
const { openWalletDialog } = useWalletDialog()
const { openLoginDialog } = useLoginDialog()
const { jumpToUrl } = useRedirect()
const router = useLocalRouter()
const { isLogin, currentGlobalCurrency, balanceData } = storeToRefs(useAppStore())
const route = useRoute()
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const currentLang = getCurrentLanguageForBackend()

const RECORD_PAGE_SIZE = 300
const RECORD_SHOW_NUM = 4
const TIME_FORMAT_1 = 'YYYY/MM/DD HH:mm:ss'
const TIME_FORMAT_2 = 'YYYY-MM-DD HH:mm:ss'
const TIME_FORMAT_3 = 'YYYY/MM/DD'
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
    width: '50%',
    slot: 'cycle',
  },
  {
    title: t('accumulated_recharge'),
    dataIndex: 'recharge',
    align: 'center',
    width: '50%',
    slot: 'recharge',
  },
  // {
  //   title: t('sports_events_inside_table_header_prize'),
  //   dataIndex: 'bonus_rate', // 1,2,3,4 领取，审核中，重新提交，已领取
  //   align: 'center',
  //   slot: 'bonus_rate',
  //   width: '34%',
  // },
]
const accumulatedRechargeLabel = [t('today_accumulated_recharge'), t('week_accumulated_recharge'), t('month_accumulated_recharge')]
const configDaysMap: { [key: number]: { img: string, label: string } } = {
  2: {
    img: '/webp/promotions/level_1.webp',
    label: t('n_day', { day: 2 }),
  },
  3: {
    img: '/webp/promotions/level_2.webp',
    label: t('n_day', { day: 3 }),
  },
  5: {
    img: '/webp/promotions/level_3.webp',
    label: t('n_day', { day: 5 }),
  },
  7: {
    img: '/webp/promotions/level_4.webp',
    label: t('n_day', { day: 7 }),
  },
  15: {
    img: '/webp/promotions/level_5.webp',
    label: t('n_day', { day: 15 }),
  },
  30: {
    img: '/webp/promotions/level_6.webp',
    label: t('n_day', { day: 30 }),
  },
}

const current_taskid = ref<string>('')
const recordPage = ref<number>(1)
const recordExpand = ref<boolean>(false)
const fullRes = ref<RechargeActivity | undefined>()
const past_events = ref<DepositStoryRecordList>({ d: [], t: 1, s: 10 })
const refresh = ref<number>(0)
const isFirstLoading = ref<boolean>(true)
const tab = ref<1 | 2>(1)
const activeDay = ref<number>(2)
const { globalPageTitle } = useGlobalStatePageTitle()

const pid = computed(() => Number(route.query.pid))
const preview = route.query.preview?.toString() ?? ''
// const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone)
const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === fullRes.value?.time_zone.replace('_', '-'))[0].zone)

const activityType = computed(() => Number(route.query.cond))// 1,2,3 首充， 累计充值， 注册充值

const configData = computed(() => fullRes.value?.promo_info)
const imgUrl = computed(() => {
  const images = configData.value?.images
  if (!images)
    return ''
  return JSON.parse(images)[currentLang]
})
const NOW = computed(() => {
  const nowUnix = Number(fullRes.value?.cur_time)
  return nowUnix ? dayjs.unix(nowUnix).tz(currentDollarZone.value) : dayjs().tz(currentDollarZone.value)
})
const TIME_RANGES = computed<{ start: dayjs.Dayjs, end: dayjs.Dayjs }[]> (() => {
  return [
    { start: NOW.value.startOf('day'), end: NOW.value.endOf('day') },
    { start: NOW.value.startOf('week').add(1, 'day'), end: NOW.value.endOf('week').add(1, 'day') }, // 周一到周日
    { start: NOW.value.startOf('month'), end: NOW.value.endOf('month') },
  ]
})
const currentLangCurrency = computed(() => {
  return currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
})
const globalCurrencyCode = ref<CurrencyCode>('701')
const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const usedCurrency = computed(() => {
  return getCurrencyConfigByCode(usedCurrencyCode.value).name
})
const prize_config = computed(() => {
  const tongue = configData.value?.config.tongue || []
  return tongue[usedCurrencyCode.value] || []
})

const sortedPrizeConfig = computed(() => {
  const s = prize_config.value || []
  return s.sort((a, b) => Number(a.deposit) - Number(b.deposit))
})
const max_prize = computed<string>(() => {
  const state = fullRes.value?.state || 0 // 0(待获取资格)，1(待领取)，2(已领取)，3(没有资格)，4（待审核），5（重新提交）6. 可领取，未到时间  10 活动结束
  const bonusType = configData.value?.config.bonus || 1 // 奖金方式 1(固定金额)  2(随机金额  3(比例金额)
  const lockState = [1, 2, 4, 5, 6]
  if (lockState.includes(state)) {
    const info_str = fullRes.value?.cashback_info
    let info
    if (!info_str)
      return ''

    try {
      info = JSON.parse(info_str)
    }
    catch (e) {

    }
    let res: string = [formatAmountFunc(info.bonus_amount, usedCurrency.value), info.apply_amount, `${toFixed(info.apply_amount, 2)}%`][bonusType - 1]
    if (state === 2)
      // 比例，已领取显示金额
      res = formatAmountFunc(info.bonus_amount, usedCurrency.value)

    return res
  }
  if (!sortedPrizeConfig.value || sortedPrizeConfig.value.length === 0)
    return ''
  const minItem = sortedPrizeConfig.value[0]
  const { max, min, scale, deposit } = sortedPrizeConfig.value[sortedPrizeConfig.value.length - 1]
  return [formatAmountFunc(min, usedCurrency.value), `${formatAmountFunc(minItem.min, usedCurrency.value)}-${formatAmountFunc(max, usedCurrency.value)}`, `${toFixed(scale, 2)}%`][bonusType - 1]
})
const max_award = computed(() => {
  if (sortedPrizeConfig.value.length === 0)
    return 0

  const bonusType = configData.value?.config.bonus || 1 // 奖金方式 1(固定金额)  2(随机金额  3(比例金额)
  const { deposit, max, min, scale } = sortedPrizeConfig.value[sortedPrizeConfig.value.length - 1]
  return [formatAmountFunc(min, usedCurrency.value), formatAmountFunc(max, usedCurrency.value), `${toFixed(scale, 2)}%`][bonusType - 1]
})
const currentDetail = computed(() => {
  let detail = ''
  try {
    detail = configData.value ? JSON.parse(configData.value.detail)[currentLang] : ''
  }
  catch (e) {

  }
  return detail
})
const hasUnReceived = computed<boolean>(() => Boolean((past_events.value.d || []).find(item => item.state === 1)))
const tabList = computed(() => {
  return [{ label: t('this_issue'), value: 1 }, { label: t('past_issues'), value: 2, infoTip: hasUnReceived.value ? t('wait_receive') : undefined }]
})
const accumulatedRechargeType = computed(() => configData.value?.config.period.flag ?? 1) // 账户首充 0不限制 1注册时间内存款   累计充值 1,2,3 本日累计，本周累计吗，本月累计
const currentRange = computed(() => {
  const i = accumulatedRechargeType.value ?? 1
  return TIME_RANGES.value[i - 1]
})
const recharge_now = computed(() => {
  return configData.value?.text
}) // 配置的 充值按钮 文案
const recharge_on = computed(() => configData.value?.button === 1) // 配置充值按钮 开启
const configDays = computed(() => configData.value?.config.period.days) // 配置 天数
const countdownEndTime = computed(() => {
  const d = dayjs.unix(Number(fullRes.value?.reg_time)).tz(currentDollarZone.value).add(Number(configData.value?.config.period.val), [0, 1].includes(configData.value?.config.period.ty) ? 'minute' : 'hour')
  return d
})
const registBeforeStart = computed(() => {
  const reg_time = dayjs.unix(Number(fullRes.value?.reg_time)).tz(currentDollarZone.value)
  const start_time = dayjs(configData.value?.s || NOW.value).tz(currentDollarZone.value)
  return reg_time.isBefore(start_time)
})
const defaultActiveDay = computed(() => {
  if (!configDays.value)
    return 2
  if (registBeforeStart.value)
    return 2
  let day = configDays.value[0]
  const reversedConfigDays = configDays.value.slice().reverse()
  const reg_time = dayjs.unix(Number(fullRes.value?.reg_time)).tz(currentDollarZone.value)
  reversedConfigDays.forEach((cur: number) => {
    if (NOW.value.isBefore(reg_time.add(cur, 'day').startOf('day')))
      day = cur
  })
  return day
})
const recordParam = computed(() => ({ pid: pid.value, page: recordPage.value, page_size: RECORD_PAGE_SIZE, currency_id: usedCurrencyCode.value }))

function handleGetConfig(data: RechargeActivity) {
  isFirstLoading.value = false
  let tongue = data.promo_info.tongue || '[]'

  try {
    tongue = JSON.parse(tongue)
  }
  catch (e) {

  }

  if (!tongue.includes(getCurrentLanguageForBackend())) {
    openNotify({
      type: 'error',
      code: 'false',
      message: t('lang_not_support_promo'),
    })
    goPromo()
  }
  usedCurrencyCode.value = data.promo_info.config.currency

  if (data && data.state === 30) {
    openNotify({
      type: 'error',
      code: 'false',
      message: t('same_ip_once'),
    })
    data.state = 0 // 提示后页面变为待充值状态
  }
  if (data && data.activity_state === 10 && !preview) {
    openNotify({
      type: 'error',
      code: 'false',
      message: t('promo_end'),
    })
    goPromo()
  }
  else if (data && data.activity_state === 11 && !preview) {
    openNotify({
      icon: 'chess-gameshow',
      iconColor: '--tg-text-alltheme-green',
      title: t('warm_tip'),
      message: t('activity_not_start'),
    })
    goPromo()
  }
  else {
    fullRes.value = data
    /* if (data.promo_cur)
      usedCurrencyCode.value = data.promo_cur */
  }
}
// 领取奖金
const {
  loading: receiveLoading,
  runAsync: runAsyncReceive,
} = useRequest(ApiMemberPromoDepositReceive, {
  onSuccess: (data) => {
    if (data && fullRes.value) {
      if (current_taskid.value) {
        const currentTask = past_events.value.d.find(item => item.id === current_taskid.value)
        if (currentTask)
          currentTask.state = data.state
      }
      else {
        fullRes.value.state = data.state
      }
    }
    current_taskid.value = ''
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
// 重新提交
const {
  loading: resubmitLoading,
  runAsync: runAsyncResubmit,
} = useRequest(ApiMemberPromoDepositRecordResubmit, {
  onSuccess: (data) => {
    if (data && fullRes.value) {
      if (current_taskid.value) {
        const currentTask = past_events.value.d.find(item => item.id === current_taskid.value)
        if (currentTask)
          currentTask.state = 4
      }
      else {
        fullRes.value.state = 4
      }
    }
    current_taskid.value = ''
  },
  onError: () => {
    current_taskid.value = ''
    openNotify({
      type: 'error',
      message: t('resubmit_fail'),
    })
  },
})
// 获取config活动配置, 首充，累计，注册
const {
  loading: configLoading1,
  runAsync: runAsyncProfitConfig1,
} = useRequest(ApiMemberPromoDepositFirst, {
  onSuccess: (data) => {
    handleGetConfig(data)
  },
})
const {
  loading: configLoading2,
  runAsync: runAsyncProfitConfig2,
} = useRequest(ApiMemberPromoDepositAccumulative, {
  onSuccess: (data) => {
    handleGetConfig(data)
  },
})
const {
  loading: configLoading3,
  runAsync: runAsyncProfitConfig3,
} = useRequest(ApiMemberPromoDepositRegistration, {
  onSuccess: (data) => {
    handleGetConfig(data)
  },
})
const configLoading = computed(() => [configLoading1.value, configLoading2.value, configLoading3.value][activityType.value - 1])
const runAsyncProfitConfig = computed(() => [runAsyncProfitConfig1, runAsyncProfitConfig2, runAsyncProfitConfig3][activityType.value - 1])
// 获取累计充值活动历史领取
const {
  loading: recordLoading,
  runAsync: runAsyncRecordList,
} = useRequest(ApiMemberPromoDepositStoryRecordList, {
  onSuccess: (data) => {
    if (data)
      past_events.value = data
  },
})

function openWalletDialogIfNotApp() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DEPOSIT_MODAL)
  else
    openWalletDialog()
}
// 立即领取
function handleReceive(task_id?: string) {
  if (isLogin.value) {
    if (task_id)
      current_taskid.value = task_id
    runAsyncReceive(
      { activity_id: pid.value, task_id: task_id || fullRes.value?.task_id || '', curr_id: usedCurrencyCode.value },
    )
  }
  else {
    openLoginDialog()
  }
}
// 重新提交
function handleResubmit(task_id?: string) {
  if (isLogin.value) {
    if (task_id)
      current_taskid.value = task_id
    runAsyncResubmit(
      { id: task_id || fullRes.value?.task_id || '' },
    )
  }
  else {
    openLoginDialog()
  }
}
function onCountDownEnd() {
  if (fullRes.value)
    fullRes.value.state = 3 // 时间结束 没资格
}
function getConfig() {
  runAsyncProfitConfig.value({ activity_id: pid.value, curr_id: usedCurrencyCode.value })
}
function getRecord() {
  runAsyncRecordList(recordParam.value)
}
function getInitRequestList() {
  getConfig() // 只能执行一次,每次需要新建
  if (activityType.value === 2 && isLogin.value)
    getRecord()
}
function mqttRefresh(data: any) {
  const promoType = Number(data.promo_type)
  if (promoType === 8) {
    // 充值活动提示，需更新状态
    refresh.value++
  }
}
function onChooseActiveDay(day: number) {
  if (day >= defaultActiveDay.value) {
    // 只能选择当前之后的时间
    activeDay.value = day
  }
}
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

watch(defaultActiveDay, (newValue) => {
  activeDay.value = newValue
})

watch([recordPage, usedCurrencyCode], () => {
  if (isLogin.value)
    getRecord()
})
watch(activityType, () => {
  // reload
  isFirstLoading.value = true
  refresh.value++
})
watch([isLogin, refresh, balanceData, usedCurrencyCode], async () => {
  getInitRequestList()
})

watchEffect(() => {
  let names = fullRes.value?.promo_info.names || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
})
onMounted(() => {
  if (!pid.value)
    return goPromo()
  getInitRequestList()
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
</script>

<template>
  <AppLoading v-if="((configLoading && isFirstLoading) || !(prize_config.length > 0))" full-screen />
  <div v-else class="fixed-container text-tg-text-lightgrey m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="text-sm font-semibold text-[var(--tg-text-lightgrey)]">
      <div v-if="activityType === 1" class="rounded-[4px] bg-light p-[12px]">
        <div class="mb-[8px] flex justify-between">
          <span>{{ $t('registration_time') }}</span>
          <span class="second-color">{{ Number(fullRes?.reg_time) > 0 ? dayjs.unix(fullRes?.reg_time).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
        </div>
        <div class="mb-[8px] flex justify-between">
          <span>{{ $t('first_recharge_time') }}</span>
          <span class="second-color">{{ Number(fullRes?.first_time) > 0 ? dayjs.unix(fullRes?.first_time).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
        </div>
        <div class="mb-[8px] flex justify-between">
          <span>{{ $t('first_recharge_amount') }}</span>

          <AppAmount class="theme-amount" :amount="fullRes?.first_amount || '0.00'" :currency-type="usedCurrency" />
        </div>
        <div v-if="isLogin" class="second-color bg-deep flex flex-col items-center justify-center rounded-[4px] p-[12px]">
          <template v-if="fullRes?.state === 3">
            <div class="min-h-[52px] flex items-center justify-center font-normal">
              <span>{{ $t('not_get_bonus') }}</span>
            </div>
            <BaseButton
              class="mt-[12px] w-[100%]" bg-style="primary" size="md"
              @click.stop="goPromo"
            >
              {{ $t('view_more_event') }}
            </BaseButton>
          </template>
          <template v-else-if="fullRes?.state === 0">
            <template v-if="accumulatedRechargeType === 1">
              <span class="text-white">{{ $t('recharge_countdown') }}</span>
              <AppCountdown class="my-[12px]" :end-time="countdownEndTime" :now-time="NOW" @on-end="onCountDownEnd" />
              <i18n-t :keypath="[0, 1].includes(Number(configData?.config.period.ty)) ? 'deposit_rewards_minute' : 'deposit_rewards'" tag="div" class="flex font-normal">
                <template #n>
                  {{ configData?.config.period.val }}
                </template>
                <template #money>
                  <span class="theme-amount">{{ max_prize }}</span>&nbsp;
                  <AppCurrencyIcon :currency-type="usedCurrency" />
                </template>
              </i18n-t>
            </template>
            <template v-else>
              <span class="min-h-[52px] flex items-center justify-center font-normal">
                <span class="">{{ t('first_recharge_bonus_label', [max_prize]) }}</span>&nbsp;
                <AppCurrencyIcon :currency-type="usedCurrency" />
              </span>
              <BaseButton
                class="w-[100%]" bg-style="primary" size="md"
                @click="openWalletDialogIfNotApp"
              >
                {{ t('fast_go_recharge') }}
              </BaseButton>
            </template>
          </template>
          <template v-else>
            <span class="text-tg-text-white font-semibold">{{ $t('you_have_received_your_bonus') }}</span>
            <div class="my-[6px] flex">
              <span class="theme-amount">{{ max_prize }}</span>&nbsp;
              <AppCurrencyIcon :currency-type="usedCurrency" />
            </div>
            <img class="mb-[10px] h-[30px] w-[43px]" src="/afun-pc/webp/promotions/dollar.webp" alt="">
          </template>
        </div>
        <div v-else class="second-color bg-deep rounded-[4px] p-[12px]">
          <div class="min-h-[52px] flex items-center justify-center font-normal">
            <span>{{ $t('login_view_more') }}</span>
          </div>
          <BaseButton
            class="mt-[12px] w-[100%]" bg-style="primary" size="md"
            @click.stop="openLoginDialog"
          >
            {{ $t('login_now') }}
          </BaseButton>
        </div>
      </div>
      <div v-else-if="activityType === 2">
        <BaseTab v-model="tab" style="--tg-tab-style-inner-padding-y:12px;" :full="true" :list="tabList" class="grey-tab mb-[20px]" />
        <div v-if="tab === 1">
          <div class="second-color mb-[20px] text-center text-xs">
            {{ t('statistic_period') }}{{ currentRange?.start.tz(currentDollarZone).format(TIME_FORMAT_1) }}-{{ currentRange?.end.tz(currentDollarZone).format(TIME_FORMAT_1) }}
          </div>
          <div class="box rounded-[4px] bg-light p-[12px]">
            <div class="mb-[8px] flex justify-between">
              <span>{{ $t('recent_recharge_time') }}</span>
              <span class="second-color">{{ Number(fullRes?.last_time) > 0 ? dayjs.unix(fullRes?.last_time).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
            </div>
            <div class="mb-[8px] flex justify-between">
              <span>{{ $t('recent_recharge_amount') }}</span>
              <span class="flex">
                <AppAmount class="theme-amount" :amount=" fullRes?.last_amount || '0.00'" :currency-type="usedCurrency" />
              </span>
            </div>
            <div class="mb-[8px] flex justify-between">
              <span>{{ accumulatedRechargeLabel[accumulatedRechargeType - 1] }}</span>

              <span class="flex">
                <AppAmount class="theme-amount" :amount=" fullRes?.cumulative_amount || '0.00'" :currency-type="usedCurrency" />
              </span>
            </div>

            <div v-if="isLogin" class="second-color bg-deep flex flex-col items-center justify-center rounded-[4px] p-[12px]">
              <template v-if="fullRes?.state === 0">
                <i18n-t keypath="chance_to_get" tag="div" class="min-h-[52px] flex items-center justify-center">
                  <template #money>
                    &nbsp;<span class="theme-amount">{{ max_prize }}</span>&nbsp;
                    <AppCurrencyIcon :currency-type="usedCurrency" />
                  </template>
                </i18n-t>

                <BaseButton
                  class="w-[100%]" bg-style="primary" size="md"
                  @click="openWalletDialogIfNotApp"
                >
                  {{ t('fast_go_recharge') }}
                </BaseButton>
              </template>
              <template v-else>
                <span class="text-tg-text-white font-semibold">{{ $t('claim_bonus_time') }}</span>
                <span class="my-[6px] font-normal">{{ currentRange?.end.add(1, 'hour').add(1, 'second').tz(currentDollarZone).format(TIME_FORMAT_2) }}</span>
                <img class="mb-[15px] h-[30px] w-[43px]" src="/afun-pc/webp/promotions/dollar.webp" alt="">
                <div class="flex font-normal">
                  <span class="theme-amount">{{ max_prize }}</span>&nbsp;
                  <AppCurrencyIcon :currency-type="usedCurrency" />
                </div>
              </template>
            </div>
            <div v-else class="second-color bg-deep rounded-[4px] p-[12px]">
              <div class="min-h-[52px] flex items-center justify-center">
                <span>{{ $t('login_view_more') }}</span>
              </div>
              <BaseButton
                class="mt-[12px] w-[100%]" bg-style="primary" size="md"
                @click.stop="openLoginDialog"
              >
                {{ $t('login_now') }}
              </BaseButton>
            </div>
          </div>
        </div>
        <div v-else>
          <BaseTable class="table" :columns="pastEventsTableColumn" last-first-padding :data-source="recordExpand ? (past_events.d || []) : (past_events.d || []).slice(0, RECORD_SHOW_NUM)">
            <template #cycle="{ record }">
              <span>{{ dayjs.unix(record.created_at).tz(currentDollarZone).format(TIME_FORMAT_3) }}</span>
            </template>
            <template #recharge="{ record }">
              <div class="flex items-center justify-center">
                <AppAmount
                  class="theme-amount"
                  :amount="record.deposit_amount || '0.00'" :currency-type="getCurrencyConfigByCode(record.currency_id).name"
                />
              </div>
            </template>
            <template #bonus_rate="{ record }">
              <BaseButton
                v-if="record.state === 1"
                style="--tg-spacing-button-padding-vertical-xs:7px;"
                class="w-[100%]" bg-style="primary" size="xs"
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
                v-else-if="record.state === 4"
                style="--tg-spacing-button-padding-vertical-xs:7px;"
                class="w-[100%] disabled-btn" size="xs"
                :disabled="true"
              >
                {{ t('promo_invite_pending') }}
              </BaseButton>
              <BaseButton
                v-else-if="record.state === 5"
                style="--tg-spacing-button-padding-vertical-xs:7px;"
                class="w-[100%]" :bg-style="isStyle2() ? 'secondary' : 'primary'" size="xs"
                :loading="resubmitLoading && current_taskid === record.id"
                @click.stop="handleResubmit(record.id)"
              >
                {{ t('resubmit') }}
              </BaseButton>
            </template>
          </BaseTable>
          <template v-if="(past_events.d || []).length > RECORD_SHOW_NUM">
            <div v-if="recordExpand" class="cursor-pointer text-center text-[14px] leading-[24px]" @click="recordExpand = false">
              {{ $t('hide_all') }}
            </div>
            <div v-else class="mb-[6px] mt-[4px] cursor-pointer text-center text-[14px]" @click="recordExpand = true">
              {{ $t('show_more') }}
            </div>
          </template>
          <div class="split-line" />
        </div>
      </div>
      <div v-else-if="activityType === 3">
        <div class="grid grid-cols-6 mb-[20px] items-start gap-[13px]">
          <div
            v-for="(day, i) in configDays"
            :key="i" :class="{
              'active-day': activeDay === day,
            }" class="flex flex-col items-center justify-center" @click="onChooseActiveDay(day)"
          >
            <div
              class="img-wrap bg-days h-[48px] w-[48px] flex items-center justify-center rounded-[6px]"
            >
              <img class="h-[38px] w-[38px]" :src="`/afun-pc/${configDaysMap[day]?.img}`" alt="">
            </div>
            <div class="text-days text-center text-[10px] leading-[14px]">
              {{ configDaysMap[day]?.label }}
            </div>
          </div>
        </div>
        <div class="rounded-[4px] bg-light p-[12px]">
          <div class="mb-[8px] flex justify-between">
            <span>{{ $t('registration_time') }}</span>
            <span class="second-color">{{ (Number(fullRes?.reg_time) > 0 && !registBeforeStart) ? dayjs.unix(fullRes?.reg_time).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
          </div>
          <div class="mb-[8px] flex justify-between">
            <span>{{ $t('n_day_recharge_amount', { day: activeDay }) }}</span>

            <span class="flex">
              <AppAmount class="theme-amount" :amount="(!registBeforeStart && fullRes?.cumulative_amount) || '0.00'" :currency-type="usedCurrency" />
            </span>
          </div>

          <div v-if="isLogin" class="second-color bg-deep flex flex-col items-center justify-center rounded-[4px] p-[12px]">
            <template v-if="registBeforeStart">
              <div class="min-h-[52px] flex items-center justify-center font-normal">
                <span>{{ $t('only_new_registered') }}</span>
              </div>
              <BaseButton
                class="mt-[12px] w-[100%]" bg-style="primary" size="md"
                @click.stop="goPromo"
              >
                {{ $t('view_more_event') }}
              </BaseButton>
            </template>
            <template v-else-if="fullRes?.state === 0">
              <img class="mb-[15px] mt-[11px] h-[30px] w-[43px]" src="/afun-pc/webp/promotions/dollar.webp" alt="">
              <div class="mb-[8px] flex">
                <span class="theme-amount">{{ max_prize }}</span>&nbsp;
                <AppCurrencyIcon :currency-type="usedCurrency" />
              </div>
              <BaseButton
                class="w-[100%]" bg-style="primary" size="md"
                @click="openWalletDialogIfNotApp"
              >
                {{ t('fast_go_recharge') }}
              </BaseButton>
            </template>
            <template v-else-if="fullRes?.state === 6">
              <span class="text-tg-text-white font-semibold">{{ $t('claim_bonus_time') }}</span>
              <span class="my-[6px] font-normal">{{ Number(fullRes?.reg_time) > 0 ? dayjs.unix(fullRes?.reg_time).tz(currentDollarZone).add(activeDay - 1, 'day').startOf('day').tz(currentDollarZone).format(TIME_FORMAT_2) : '-' }}</span>
              <img class="mb-[15px] h-[30px] w-[43px]" src="/afun-pc/webp/promotions/dollar.webp" alt="">
              <div class="flex font-normal">
                <span class="theme-amount">{{ max_prize }}</span>&nbsp;
                <AppCurrencyIcon :currency-type="usedCurrency" />
              </div>
            </template>
            <template v-else>
              <span class="text-tg-text-white font-semibold">{{ $t('you_have_received_your_bonus') }}</span>
              <div class="my-[6px] flex">
                <span class="theme-amount">{{ max_prize }}</span>&nbsp;
                <AppCurrencyIcon :currency-type="usedCurrency" />
              </div>
              <img class="mb-[10px] h-[30px] w-[43px]" src="/afun-pc/webp/promotions/dollar.webp" alt="">
            </template>
          </div>
          <div v-else class="second-color bg-deep rounded-[4px] p-[12px]">
            <div class="min-h-[52px] flex items-center justify-center font-normal">
              <span>{{ $t('login_view_more') }}</span>
            </div>
            <BaseButton
              class="mt-[12px] w-[100%]" bg-style="primary" size="md"
              @click.stop="openLoginDialog"
            >
              {{ $t('login_now') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <BaseTable class="second-color table" :columns="tableColumn" last-first-padding :data-source="prize_config ?? []">
      <template #amount="{ record }">
        <div class="theme-amount flex items-center justify-center">
          <AppAmount :amount="record.deposit || '0.00'" :currency-type="usedCurrency" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="theme-amount flex items-center justify-center">
          <span class="">{{ [formatAmountFunc(record.min, usedCurrency), `${formatAmountFunc(record.min, usedCurrency)}-${formatAmountFunc(record.max, usedCurrency)}`, `${toFixed(record.scale, 2)}%`][configData?.config.bonus - 1] }}</span>&nbsp;
          <AppCurrencyIcon :currency-type="usedCurrency" />
        </div>
      </template>
    </BaseTable>
    <div class="mt-[16px]">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ t('activity_rule_desc') }}
      </div>
      <div class="my-[16px]">
        <BaseRichArea v-if="configData?.rule_type === 2" :content="currentDetail" />
        <AppPromotionBaseRuleText
          v-else :currency-type="usedCurrency"
          :amount="max_award" :content="currentDetail"
        />
        <BaseButton
          v-if="isLogin && recharge_on"
          class="mt-[16px] w-[100%]" bg-style="primary" size="md"
          @click="jumpToUrl({ type: Number(configData?.button_type), jumpUrl: configData?.redirect })"
        >
          {{ recharge_now }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
.bg-light {
  background-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.fixed-container {
  @include webTheme('green') {
    --tg-primary-main: #076237;
  }
}
.bg-days {
  border: 1px solid var(--tg-sport-btn-hover);
  background-color: var(--tg-secondary-dark);
  @include webTheme('white') {
    background-color: #e3e3e3;
    border: 1px solid #c1c1c1;
  }
}
.text-days {
  color: white;
  @include webTheme('white') {
    color: #111;
  }
}
.active-day {
  .img-wrap {
    border-color: #1fff20;
  }
  .text-days {
    color: #1fff20;
  }
  @include webTheme('greenblack') {
    .img-wrap {
      border-color: var(--tg-primary-active);
    }
    .text-days {
      color: var(--tg-primary-active);
    }
  }
  @include webTheme('white') {
    .img-wrap {
      border: 1px solid #ffaa09;
    }
    .text-days {
      color: #ffaa09;
    }
  }
}
.split-line {
  margin: 20px 0;
  border-bottom: 1px solid var(--tg-sport-btn-hover);
  @include webTheme('white') {
    border-bottom: 1px solid #e3e3e3;
  }
}

.table {
  @include webTheme('greenblack') {
    --tg-table-odd-background: var(--tg-primary-main);
    --tg-table-even-background: var(--tg-secondary-dark);
  }
}
.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
.box {
  @include webTheme('green') {
    --tg-primary-main: var(--tg-primary-light);
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

<script lang="ts" setup>
import type { WatchHandle } from 'vue'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoMemberDayClaim, ApiMemberPromoMemberDayDetail, ApiMemberPromoMemberDayReport } from '@tg/apis'
import isBetween from 'dayjs/plugin/isBetween'

defineOptions({
  name: 'KeepAlivePromotionEveryEight',
})

dayjs.extend(isBetween)

const { t } = useI18n()
const { openNotify } = useNotify()
const { openWalletDialog } = useWalletDialog()
const { openLoginDialog } = useLoginDialog()
const router = useLocalRouter()
const route = useRoute()
const { jumpToUrl } = useRedirect()
const { isLogin } = storeToRefs(useAppStore())
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())

const pid = computed(() => String(route.query.pid))
const preview = route.query.preview?.toString() ?? ''

/** 获取config活动配置  */
const { runAsync: runAsyncBaseConfig, data: baseConfig } = useRequest(ApiMemberPromoMemberDayDetail, {
  onSuccess: (data) => {
    const tongue = data.lang || []

    if (!tongue.includes(getCurrentLanguageForBackend())) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('lang_not_support_promo'),
      })
      goPromo()
    }
    if (data && +data.state === 2 && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
    }
  },
})
const currentDollarZone = computed(() => baseConfig.value?.timezone)
const date = String(dayjs().tz(currentDollarZone.value).$D) as unknown as keyof typeof stepSection
const month = Number(dayjs().tz(currentDollarZone.value).$M) + 1

const staticType = computed(() => baseConfig.value?.conf?.staticType)
const timeType = computed(() => baseConfig.value?.conf?.timeType)

const selectedPeriod = ref<string | null>(null)

const stepSection = computed<Record<string, string>>(() => getStepSection())
const { globalPageTitle } = useGlobalStatePageTitle()

const activeStep = ref('')
/** 记录上次成功的step请求失败后返回 */
const lastSuccessStep = ref('')
const userConfig = ref()
const loadingDayClaim = ref(false)

const tableColumn = computed<Column[]>(() => {
  return [
    {
      title: staticType.value === 0
        ? t('Accumulated_deposit')
        : staticType.value === 1
          ? t('platform_loss')
          : staticType.value === 2
            ? t('Valid_bets')
            : staticType.value === 3
              ? t('negative_profit_text')
              : t('Accumulated_deposit'),
      dataIndex: 'deposit',
      align: 'center' as const,
      width: '50%',
      slot: 'amount',
    },
    {
      title: t('sports_events_inside_table_header_prize'),
      dataIndex: 'min',
      align: 'center' as const,
      width: '50%',
      slot: 'bonus_rate',
    },
  ]
})

/** 获取当前用户活动数据  */
const { runAsync: runAsyncUserConfig, loading: loadingUserConfig } = useRequest(ApiMemberPromoMemberDayReport, {
  onSuccess: (data) => {
    userConfig.value = data
    userConfig.value.net_amount = Number(data.net_amount)
    lastSuccessStep.value = activeStep.value
  },
  onError: () => {
    activeStep.value = lastSuccessStep.value
  },
})

const levelName = computed(() => baseConfig.value?.status_desc)
/** 获取奖金  */
const { runAsync: runAsyncDayClaim } = useRequest(ApiMemberPromoMemberDayClaim)

const globalCurrencyCode = computed(() => {
  /* const code = currencyConfig[currentGlobalCurrency.value]?.cur
  return supportedCur.includes(code) ? (code as CurrencyCode) : ('706' as CurrencyCode) */
  return (baseConfig.value?.conf.currency_id ?? '701') as CurrencyCode
})
const currentGlobalCurrency = computed(() => {
  return getCurrencyConfigByCode(globalCurrencyCode.value).name
})

const UserConfigCurrencyCode = computed(() => {
  return (baseConfig.value?.conf?.currency_id || '706') as CurrencyCode
})

const currencyIcon = computed(() => {
  const config = getCurrencyConfigByCode(UserConfigCurrencyCode.value)
  return config?.name || ''
})

const imgUrl = computed(() => baseConfig.value?.img?.[userLanguage.value.replace('-', '_')] || '')

// function formatLadderData(ladder: any[]) {
//   return ladder.map((item) => {
//     if (item.e) {
//       // 范围展示
//       return {
//         b: `${item.b}~${item.e}`,
//         d: item.d,
//       }
//     }
//     // 单值展示
//     return {
//       b: item.b,
//       d: item.d,
//     }
//   })
// }

const tableData = computed(() => {
  const currency = Number(baseConfig.value?.conf?.currency_id)
  const ladder = baseConfig.value?.conf?.ladder[currency] || []
  return ladder
})

const showIcon = computed(() => {
  const awardType = baseConfig.value?.conf?.adwardType
  return awardType === 2 || awardType === 3
})

const ruleText = computed(() => baseConfig.value?.detail?.[userLanguage.value.replace('-', '_')] || '')
const rule_type = computed(() => baseConfig.value?.rule_type)
const buttonConfig = computed(() => baseConfig.value?.button)
const recharge_now = computed(() => baseConfig.value?.buttonText?.[userLanguage.value.replace('-', '_')] || '')
/** 表格最后一行金额数据 */
const amountArr = computed(() => {
  if (tableData.value && tableData.value.length)
    return [tableData.value[0].d, tableData.value[tableData.value.length - 1].b]
  else
    return []
})

/** 动态信息文字  */
const informationText = computed(() => {
  if (!baseConfig.value)
    return ''
  if (staticType.value === 0)
    return t('random_text_1745')
  else if (staticType.value === 1)
    return t('random_text_1817')
  else if (staticType.value === 2)
    return t('random_text_1818')
  else if (staticType.value === 3)
    return t('random_text_1819')
})

function openWalletDialogIfNotApp() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DEPOSIT_MODAL)
  else
    openWalletDialog()
}
function changeActiveDay(val: any) {
  activeStep.value = val.value
  selectedPeriod.value = val.value
  isLogin.value && runAsyncUserConfig({ pid: pid.value, currency: UserConfigCurrencyCode.value, step: activeStep.value })
}
async function getBonus() {
  if (userConfig.value?.bet_count === 4 || userConfig.value?.bet_count === 5) {
    openNotify({
      type: 'info',
      title: t('warm_tip'),
      message: t('not_claim_time'),
    })
    return
  }
  if (userConfig.value?.net_amount === 0) {
    openNotify({
      type: 'info',
      title: t('warm_tip'),
      message: t('notEligible'),
    })
    return
  }
  loadingDayClaim.value = true
  try {
    await runAsyncDayClaim({ pid: pid.value, currency: globalCurrencyCode.value, step: activeStep.value })
    const amount = formatAmount(userConfig.value?.net_amount || 0.00)
    const currencyIconPath = application.getImgUrl(`/currency/${currencyConfig[currentGlobalCurrency.value]?.cur}.webp`)
    openNotify({
      type: 'success',
      title: t('receive_success'),
      message: `${t('amount')}: ${amount} <img class="inline-block align-middle w-[14px] h-[14px] ml-[4px]" style="width: 14px !important; height: 14px !important;" src="${currencyIconPath}" alt="${currencyConfig[currentGlobalCurrency.value]?.cur}">`,
    })
    loadingDayClaim.value = false
    await runAsyncUserConfig({ pid: pid.value, currency: UserConfigCurrencyCode.value, step: activeStep.value })
  }
  catch (error) {
    loadingDayClaim.value = false
  }
}

// 添加格式化金额的函数
function formatAmount(amount: number) {
  return `${amount.toFixed(2)}`
}

function getStepSection() {
  const type = timeType.value ?? 0
  if (type === 1) { // 3,13,23
    return {
      3: '1',
      13: '1',
      23: '1',
      4: '1',
      14: '1',
      24: '1',
      5: '2',
      15: '2',
      25: '2',
      6: '2',
      16: '2',
      26: '2',
      7: '3',
      17: '3',
      27: '3',
      8: '3',
      18: '3',
      28: '3',
      1: '3',
      2: '3',
      9: '3',
      10: '3',
      11: '3',
      12: '3',
      19: '3',
      20: '3',
      21: '3',
      22: '3',
      29: '3',
      30: '3',
      31: '3',
    }
  }
  else if (type === 2) { // 5,15,25
    return {
      5: '1',
      15: '1',
      25: '1',
      6: '1',
      16: '1',
      26: '1',
      7: '2',
      17: '2',
      27: '2',
      8: '2',
      18: '2',
      28: '2',
      9: '3',
      19: '3',
      29: '3',
      10: '3',
      20: '3',
      30: '3',
      1: '3',
      2: '3',
      3: '3',
      4: '3',
      11: '3',
      12: '3',
      13: '3',
      14: '3',
      21: '3',
      22: '3',
      23: '3',
      24: '3',
      31: '3',
    }
  }
  else if (type === 3) { // 7,17,27
    return {
      7: '1',
      17: '1',
      27: '1',
      8: '1',
      18: '1',
      28: '1',
      9: '2',
      19: '2',
      29: '2',
      10: '2',
      20: '2',
      30: '2',
      11: '3',
      21: '3',
      31: '3',
      12: '3',
      22: '3',
      1: '3',
      2: '3',
      3: '3',
      4: '3',
      5: '3',
      6: '3',
      13: '3',
      14: '3',
      15: '3',
      16: '3',
      23: '3',
      24: '3',
      25: '3',
      26: '3',
    }
  }
  else { // type === 0, 8,18,28
    return {
      8: '1',
      18: '1',
      28: '1',
      9: '1',
      19: '1',
      29: '1',
      10: '2',
      20: '2',
      30: '2',
      11: '2',
      21: '2',
      31: '2',
      12: '3',
      22: '3',
      13: '3',
      23: '3',
      1: '3',
      2: '3',
      3: '3',
      4: '3',
      5: '3',
      6: '3',
      7: '3',
      14: '3',
      15: '3',
      16: '3',
      17: '3',
      24: '3',
      25: '3',
      26: '3',
      27: '3',
    }
  }
}

function getConfigDayRanges() {
  const type = timeType.value ?? 0
  const currentDate = dayjs().tz(currentDollarZone.value)
  const currentDay = currentDate.date()
  const currentMonth = currentDate.month() + 1
  const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1
  const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1

  // Helper function to get the settlement day for each type
  const getSettlementDay = (type: number) => {
    switch (type) {
      case 1: return 23 // 3,13,23
      case 2: return 25 // 5,15,25
      case 3: return 27 // 7,17,27
      default: return 28 // 8,18,28
    }
  }

  const settlementDay = getSettlementDay(type)
  const isBeforeSettlement = currentDay <= settlementDay

  // Determine which month to use for each period
  const getPeriodMonths = () => {
    if (isBeforeSettlement) {
      return {
        startMonth: prevMonth,
        endMonth: currentMonth,
      }
    }
    else {
      return {
        startMonth: currentMonth,
        endMonth: nextMonth,
      }
    }
  }

  const { startMonth, endMonth } = getPeriodMonths()

  if (type === 1) { // 3,13,23
    return [
      {
        value: '1',
        label: `${formattedMonth(startMonth)}.23-${formattedMonth(endMonth)}.02`,
      },
      {
        value: '2',
        label: `${formattedMonth(endMonth)}.03-${formattedMonth(endMonth)}.12`,
      },
      {
        value: '3',
        label: `${formattedMonth(endMonth)}.13-${formattedMonth(endMonth)}.22`,
      },
    ]
  }
  else if (type === 2) { // 5,15,25
    return [
      {
        value: '1',
        label: `${formattedMonth(startMonth)}.25-${formattedMonth(endMonth)}.04`,
      },
      {
        value: '2',
        label: `${formattedMonth(endMonth)}.05-${formattedMonth(endMonth)}.14`,
      },
      {
        value: '3',
        label: `${formattedMonth(endMonth)}.15-${formattedMonth(endMonth)}.24`,
      },
    ]
  }
  else if (type === 3) { // 7,17,27
    return [
      {
        value: '1',
        label: `${formattedMonth(startMonth)}.27-${formattedMonth(endMonth)}.06`,
      },
      {
        value: '2',
        label: `${formattedMonth(endMonth)}.07-${formattedMonth(endMonth)}.16`,
      },
      {
        value: '3',
        label: `${formattedMonth(endMonth)}.17-${formattedMonth(endMonth)}.26`,
      },
    ]
  }
  else { // type === 0, 8,18,28
    return [
      {
        value: '1',
        label: `${formattedMonth(startMonth)}.28-${formattedMonth(endMonth)}.07`,
      },
      {
        value: '2',
        label: `${formattedMonth(endMonth)}.08-${formattedMonth(endMonth)}.17`,
      },
      {
        value: '3',
        label: `${formattedMonth(endMonth)}.18-${formattedMonth(endMonth)}.27`,
      },
    ]
  }
}

// 格式化日期
function formattedMonth(val: number) {
  if (val === 13)
    val = 1
  else if (val === 0)
    val = 12
  return String(val).padStart(2, '0')
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

let stopWatch1: WatchHandle
let stopWatch2: WatchHandle
let activatedCounter = 0

onActivated(() => {
  activatedCounter++
  if (activatedCounter > 1) {
    console.log('已经激活过一次，跳过')
    return
  }
  stopWatch1 = watch([isLogin, currentGlobalCurrency, tableData], () => {
    if (!tableData.value || !baseConfig.value)
      return
    isLogin.value && runAsyncUserConfig({ pid: pid.value, currency: UserConfigCurrencyCode.value, step: activeStep.value })
  }, { immediate: true })
  stopWatch2 = watch([tableData, currentGlobalCurrency], () => {
    if (baseConfig.value && !baseConfig.value?.conf?.currency_id) {
      console.log(baseConfig.value?.conf?.[currencyConfig[currentGlobalCurrency.value].cur], '1111111111')

      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('promo_currency_error'),
      })
    }
  }, { immediate: true })
})

onDeactivated(() => {
  activatedCounter = 0
  if (stopWatch1)
    stopWatch1()
  if (stopWatch2)
    stopWatch2()
})

/** 获取当前时间所在的周期 */
function getCurrentTimePeriod(): string {
  const currentDate = dayjs().tz(currentDollarZone.value).subtract(1, 'day')
  const currentDay = currentDate.date()
  const ranges = getConfigDayRanges()

  for (const range of ranges) {
    const [start, end] = range.label.split('-')
    const [startMonth, startDay] = start.split('.')
    const [endMonth, endDay] = end.split('.')

    const startDate = dayjs().tz(currentDollarZone.value).month(Number(startMonth) - 1).date(Number(startDay))

    const endDate = dayjs().tz(currentDollarZone.value).month(Number(endMonth) - 1).date(Number(endDay)).hour(23).minute(59).second(59)

    // 处理跨月的情况
    if (Number(startMonth) > Number(endMonth))
      endDate.add(1, 'year')

    if (currentDate.isBetween(startDate, endDate, 'day', '[]'))
      return range.value
  }
  return ''
}

onMounted(() => {
  const currentPeriod = getCurrentTimePeriod()
  activeStep.value = currentPeriod
  lastSuccessStep.value = currentPeriod
  selectedPeriod.value = currentPeriod
  if (isLogin.value && currentPeriod) {
    runAsyncUserConfig({
      pid: pid.value,
      currency: UserConfigCurrencyCode.value,
      step: currentPeriod,
    })
  }
})

await application.allSettled([runAsyncBaseConfig({ pid: pid.value, currency: globalCurrencyCode.value })])

/** 获取状态文本 */
function getStatusText(item: any) {
  if (!levelName.value)
    return t('Not_started')
  const periods = levelName.value.split(':')
  const status = periods[Number(item.value) - 1]
  switch (status) {
    case '0':
      return t('tickets_status_in_progress')
    case '1':
      return t('tickets_status_in_progress')
    case '2':
      return t('Ended')
    case '3':
      return t('Ended')
    case '4':
      return t('tickets_status_in_progress')
    case '5':
      return t('Not_started')
    default:
      return t('Not_started')
  }
}

/** 获取状态图片 */
function getStatusImage(item: any) {
  if (!levelName.value)
    return '/png/promotions/event_disable.png'
  const periods = levelName.value.split(':')
  const status = periods[Number(item.value) - 1]
  return status === '4' || status === '1' ? '/png/promotions/event_active.png' : '/png/promotions/event_disable.png'
}
watchEffect(() => {
  let names = baseConfig.value?.name || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
})
</script>

<template>
  <div class="text-tg-text-lightgrey m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="bg-tg-secondary-grey mb-[16px] rounded-[4px] p-[12px]">
      <div class="text-tg-text-white mb-[10px] flex justify-between text-[18px] font-semibold">
        <span>{{ `${t('act_time_title')}` }}</span>
      </div>
      <div class="grid grid-cols-3 items-start justify-between gap-[13px]">
        <div
          v-for="(item, i) in getConfigDayRanges()"
          :key="i"
          :class="{ 'active-day': selectedPeriod === item.value || (!selectedPeriod && getCurrentTimePeriod() === item.value) }"
          class="bg-tg-secondary-dark mx-[3px] my-[6px] aspect-[98/116] flex flex-col items-center justify-center border-[1px] border-transparent rounded-[6px] border-solid px-0 py-[14px]"
          @click="changeActiveDay(item)"
        >
          <div class="text-center text-[12px] leading-[14px]">
            <div class="mt-[2px] text-[12px]">
              {{ getStatusText(item) }}
            </div>
          </div>
          <div class="my-[6px] h-[58px] w-[65px] flex items-center justify-center">
            <img
              :src="getStatusImage(item)"
              alt=""
            >
          </div>
          <div class="date text-center text-[12px] leading-[14px]">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="text-tg-text-lightgrey text-sm font-semibold">
      <div class="bg-tg-secondary-grey center-box rounded-[4px] p-[12px] px-[12px] pb-[4px] pt-[12px]">
        <!-- <div class="mb-[8px] flex justify-between">
          <span>{{ `${t('total_deposits_for_this_period')}：` }}</span>
          <AppAmount class="text-tg-text-white theme-amount" :amount="userConfig?.deposit_amount || 0.00" :currency-type="currencyIcon" />
        </div> -->
        <div class="inner-box flex flex-col items-center justify-center rounded-[4px] p-[12px]">
          <template v-if="loadingUserConfig">
            <AppLoading :height="134" :full-screen="false" />
          </template>
          <template v-else>
            <div class="w-full flex items-end">
              <div class="border-tg-divider-dark flex flex-1 items-end justify-center border-r">
                <div class="flex flex-col items-center">
                  <span class="text-tg-text-white text-center font-semibold">{{ informationText }}</span>
                  <div class="my-[6px]">
                    <AppAmount class="text-tg-text-white theme-amount font-semibold" :amount="userConfig?.deposit_amount || 0.00" :currency-type="currencyIcon" :member-amount="true" />
                  </div>
                </div>
              </div>
              <div class="flex flex-1 items-end justify-center">
                <div class="flex flex-col items-center justify-center">
                  <span class="text-tg-text-white font-semibold">{{ t('sports_events_inside_table_header_prize') }}</span>
                  <div class="my-[6px]">
                    <AppAmount class="text-tg-text-white theme-amount font-semibold" :amount="userConfig?.net_amount || 0.00" :currency-type="currencyIcon" :member-amount="true" />
                  </div>
                </div>
              </div>
            </div>
            <template v-if="isLogin">
              <BaseButton
                v-if="userConfig?.bet_count === 0 && userConfig?.net_amount === 0"
                class="w-[100%]" bg-style="secondary" size="md"
                @click="openWalletDialogIfNotApp"
              >
                {{ t('fast_go_recharge') }}
              </BaseButton>
              <BaseButton
                v-else-if="userConfig?.bet_count === 1"
                :loading="loadingDayClaim"
                class="w-[100%]" bg-style="secondary" size="md"
                @click="getBonus"
              >
                {{ t('vip_right_now') }}
              </BaseButton>
              <BaseButton
                v-else-if="userConfig?.bet_count === 4 || userConfig?.bet_count === 5"
                :loading="loadingDayClaim"
                class="w-[100%] opacity-50" bg-style="secondary" size="md"
                @click="getBonus"
              >
                {{ t('vip_right_now') }}
              </BaseButton>
              <BaseButton
                v-else-if="userConfig?.bet_count === 2"
                class="w-[100%] opacity-50" bg-style="secondary" size="md"
              >
                {{ t('expired') }}
              </BaseButton>
              <BaseButton
                v-else-if="userConfig?.bet_count === 3"
                class="w-[100%] opacity-50" bg-style="secondary" size="md"
              >
                {{ t('received') }}
              </BaseButton>
            </template>
            <!-- 未登录 -->
            <template v-else>
              <BaseButton
                class="w-[100%]" bg-style="secondary" size="md"
                @click.stop="openLoginDialog"
              >
                {{ t('login_first_please') }}
              </BaseButton>
            </template>
          </template>
        </div>
        <!-- <div v-else class="inner-box bg-tg-primary rounded-[4px] p-[12px]">
          <div class="min-h-[52px] flex items-center justify-center font-normal">
            <span>{{ t('login_view_more') }}</span>
          </div>
          <BaseButton
            class="mt-[12px] w-[100%]" bg-style="secondary" size="md"
            @click.stop="openLoginDialog"
          >
            {{ t('login_first_please') }}
          </BaseButton>
        </div> -->
      </div>
    </div>
    <BaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #amount="{ record }">
        <div class="flex items-center justify-center">
          <AppAmount :amount="record.d || '0.00'" :currency-type="currencyIcon" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="flex items-center justify-center">
          <template v-if="record.e">
            <span v-if="showIcon" class="amount-unit" style="font-family: proxima-nova, sans-serif;">{{ record.b }}~{{ record.e }}%</span>
            <template v-else>
              <AppAmount :amount="record.b || '0.00'" :currency-type="currencyIcon" :show-icon="false" />~
              <AppAmount :amount="record.e || '0.00'" :currency-type="currencyIcon" />
            </template>
          </template>
          <template v-else>
            <span v-if="showIcon" class="amount-unit" style="font-family: proxima-nova, sans-serif;">{{ record.b }}%</span>
            <AppAmount v-else :amount="record.b || '0.00'" :currency-type="currencyIcon" />
          </template>
        </div>
      </template>
    </BaseTable>

    <AppActivityVenues
      v-if="baseConfig?.conf?.platform_ids.length > 0"
      :title="$t('statistical_platform')"
      :plat-form-ids="baseConfig?.conf?.platform_ids"
      default-tab="3"
    />

    <div v-if="tableData.length" class="mt-[16px]">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ t('activity_rule_desc') }}
      </div>
      <div v-if="tableData.length" class="my-[16px]">
        <BaseRichArea v-if="rule_type === 2" :content="ruleText" />
        <AppPromotionBaseRuleText
          v-else
          amount="" :currency-type="currencyIcon" :content="ruleText" replace-type="1"
          :amount-arr="amountArr"
        />
        <BaseButton
          v-if="isLogin && buttonConfig?.button === 1"
          class="mt-[16px] w-[100%]" bg-style="secondary" size="md"
          @click="jumpToUrl({ type: Number(buttonConfig?.button_type), jumpUrl: buttonConfig?.redirect })"
        >
          {{ recharge_now }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.date {
  @include webTheme('green') {
    color: #3cb389;
  }
}
.active-day {
  border-color: #00e701;
  @include webTheme('white') {
    border-color: #ffaa09;
  }
  .text-white {
    color: #00e701;
  }
  .date {
    @include webTheme('white') {
      color: #ffaa09;
    }
    @include webTheme('green') {
      color: #00e701;
    }
  }
  @include webTheme('greenblack') {
    border-color: var(--tg-primary-active);
    .text-white {
      color: var(--tg-primary-active);
    }
  }
}
.w-full {
  margin-bottom: 20px;
  .border-tg-divider-dark {
    border-right: 1px solid var(--tg-sport-btn-hover);
  }
}
.split-line {
  margin: 20px 0;
  border-bottom: 1px solid var(--tg-sport-btn-hover);
}
.table {
  @include webTheme('white') {
    --tg-table-th-color: #555;
  }
}

.inner-box {
  @include webTheme('green') {
    background-color: #02432d;
  }
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
}

.center-box {
  @include webTheme('green') {
    background-color: #055434;
  }
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
}
.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import type { WatchHandle } from 'vue'
import {
  ApiMemberPromoMemberDayClaim,
  ApiMemberPromoMemberDayDetail,
  ApiMemberPromoMemberDayReport,
} from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseImage, PhBaseRichArea, PhBaseTable } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { useAppStore } from '@tg/stores'
import { SendFlutterAppMessage } from '@tg/types'
import {
  application,
  currencyMap,
  getCurrencyConfig,
  isFlutterApp,
  sendMsgToFlutterApp,
} from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { storeToRefs } from 'pinia'
import { computed, inject, onActivated, onDeactivated, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppActivityVenues from '~/components/AppActivityVenues.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({
  name: 'PromotionEveryEight',
})
const setTitle = inject('setTitle', (v: string) => { })

dayjs.extend(isBetween)

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const { jumpToUrl } = useRedirect()
const { isLogin } = storeToRefs(useAppStore())
const userLanguage = ref(getLang())

const pid = computed(() => String(route.query.pid))
const preview = route.query.preview?.toString() ?? ''

/** 获取config活动配置  */
const { runAsync: runAsyncBaseConfig, data: baseConfig } = useRequest(ApiMemberPromoMemberDayDetail, {
  onSuccess: (data) => {
    const tongue = data.lang || []

    if (!tongue.includes(getLangForBackend())) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (data && +data.state === 2 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
    }
  },
})
const currentDollarZone = computed(() => baseConfig.value?.timezone)

const staticType = computed(() => baseConfig.value?.conf?.staticType)
const timeType = computed(() => baseConfig.value?.conf?.timeType)

const selectedPeriod = ref<string | null>(null)

const stepSection = computed<Record<string, string>>(() => getStepSection())

const activeStep = ref('')
/** 记录上次成功的step请求失败后返回 */
const lastSuccessStep = ref('')
const userConfig = ref()
const loadingDayClaim = ref(false)

const tableColumn = computed<Column[]>(() => {
  return [
    {
      title: staticType.value === 0
        ? t('累计存款')
        : staticType.value === 1
          ? t('平台亏损')
          : staticType.value === 2
            ? t('有效投注')
            : staticType.value === 3
              ? t('负盈利')
              : t('累计存款'),
      dataIndex: 'deposit',
      align: 'center' as const,
      width: '50%',
      slot: 'amount',
    },
    {
      title: t('奖金'),
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
  return (baseConfig.value?.conf.currency_id ?? '701') as CurrencyCode
})
const currentGlobalCurrency = computed(() => {
  return getCurrencyConfig(globalCurrencyCode.value).name
})

const UserConfigCurrencyCode = computed(() => {
  return (baseConfig.value?.conf?.currency_id || '706') as CurrencyCode
})

const currencyIcon = computed(() => {
  const config = getCurrencyConfig(UserConfigCurrencyCode.value)
  return config?.name || ''
})

const imgUrl = computed(() => baseConfig.value?.img?.[userLanguage.value.replace('-', '_')] || '')

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
    return t('本期存款')
  else if (staticType.value === 1)
    return t('本期亏损')
  else if (staticType.value === 2)
    return t('本期投注')
  else if (staticType.value === 3)
    return t('本期负盈利')
})

function openWalletDialogIfNotApp() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DEPOSIT_MODAL)
  else
    router.push('/wallet')
}
function changeActiveDay(val: any) {
  activeStep.value = val.value
  selectedPeriod.value = val.value
  isLogin.value && runAsyncUserConfig({ pid: pid.value, currency: UserConfigCurrencyCode.value, step: activeStep.value })
}
async function getBonus() {
  if (userConfig.value?.bet_count === 4 || userConfig.value?.bet_count === 5) {
    Message.info(t('还未到领取时间'))
    return
  }
  if (userConfig.value?.net_amount === 0) {
    Message.info(t('不符合活动条件'))
    return
  }
  loadingDayClaim.value = true
  try {
    await runAsyncDayClaim({ pid: pid.value, currency: globalCurrencyCode.value, step: activeStep.value })
    const amount = formatAmount(userConfig.value?.net_amount || 0.00)
    const currencyIconPath = application.getImgUrl(`/currency/${currencyMap[currentGlobalCurrency.value]?.cur}.webp`)
    Message.success(t('领取成功'))
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
      Message.info(t('当前选择的货币不支持此活动'))
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
    return t('未开始')
  const periods = levelName.value.split(':')
  const status = periods[Number(item.value) - 1]
  switch (status) {
    case '0':
      return t('进行中')
    case '1':
      return t('进行中')
    case '2':
      return t('已结束')
    case '3':
      return t('已结束')
    case '4':
      return t('进行中')
    case '5':
      return t('未开始')
    default:
      return t('未开始')
  }
}

/** 获取状态图片 */
function getStatusImage(item: any) {
  const defaultImg = '/ph-h5/png/event_disable.png'
  const activeImg = '/ph-h5/png/event_active.png'
  if (!levelName.value)
    return defaultImg
  const periods = levelName.value.split(':')
  const status = periods[Number(item.value) - 1]
  return status === '4' || status === '1' ? activeImg : defaultImg
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
    setTitle(name)
})
</script>

<template>
  <div class="flex flex-col gap-[16rem]">
    <PhBaseImage v-if="imgUrl" class="w-full" style="--tg-base-img-style-radius: 12rem;" :url="imgUrl" is-network />
    <div class="bg-white rounded-[4rem] p-[12rem]">
      <div class=" mb-[6rem] flex justify-between text-[18rem] leading-[25rem] font-[500]">
        <span>{{ `${t('活动时间')}` }}</span>
      </div>
      <div class="flex gap-[16rem] text-[12rem] text-[#6D7693] font-[500]">
        <div
          v-for="(item, i) in getConfigDayRanges()"
          :key="i"
          :class="{ 'active-day': selectedPeriod === item.value || (!selectedPeriod && getCurrentTimePeriod() === item.value) }"
          class="bg-[#F6F7F8]  aspect-[98/116] flex-1 flex flex-col gap-[4rem] items-center justify-center border-[1rem] border-[#EBEBEB] rounded-[7rem] border-solid "
          @click="changeActiveDay(item)"
        >
          <div class="text-center ">
            {{ getStatusText(item) }}
          </div>
          <PhBaseImage
            class="h-[58rem] w-[65rem]"
            :url="getStatusImage(item)"
          />
          <div class="text-center  ">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="bg-white rounded-[4rem] p-[16rem] font-[500]">
      <template v-if="loadingUserConfig">
        <AppLoading :height="134" :full-screen="false" />
      </template>
      <template v-else>
        <div class="center mb-[20rem] h-[71rem]">
          <div class="flex-1 flex flex-col items-center">
            <span class="text-center font-[500] whitespace-nowrap">{{ informationText }}</span>
            <PhBaseAmount class="mt-[8rem]  font-[500]" :amount="userConfig?.deposit_amount || 0.00" :currency-type="currencyIcon" :member-amount="true" />
          </div>
          <div class="w-[25rem] h-[66rem] center">
            <span class="w-[1rem] h-full bg-[#EBEBEB]" />
          </div>
          <div class="flex-1  flex flex-col items-center justify-center">
            <span class=" font-[500]">{{ t('奖金') }}</span>
            <PhBaseAmount class="mt-[8rem]  font-[500]" :amount="userConfig?.net_amount || 0.00" :currency-type="currencyIcon" :member-amount="true" />
          </div>
        </div>
        <template v-if="isLogin">
          <PhBaseButton
            v-if="userConfig?.bet_count === 0 && userConfig?.net_amount === 0"
            class="w-[100%]"
            @click="openWalletDialogIfNotApp"
          >
            {{ t('立即充值') }}
          </PhBaseButton>
          <PhBaseButton
            v-else-if="userConfig?.bet_count === 1"
            :loading="loadingDayClaim"
            class="w-[100%]"
            @click="getBonus"
          >
            {{ t('立即领取') }}
          </PhBaseButton>
          <PhBaseButton
            v-else-if="userConfig?.bet_count === 4 || userConfig?.bet_count === 5"
            :loading="loadingDayClaim"
            class="w-[100%] opacity-50"
            @click="getBonus"
          >
            {{ t('立即领取') }}
          </PhBaseButton>
          <PhBaseButton
            v-else-if="userConfig?.bet_count === 2"
            class="w-[100%] opacity-50"
          >
            {{ t('已过期') }}
          </PhBaseButton>
          <PhBaseButton
            v-else-if="userConfig?.bet_count === 3"
            class="w-[100%] opacity-50"
          >
            {{ t('已领取') }}
          </PhBaseButton>
        </template>
        <!-- 未登录 -->
        <template v-else>
          <PhBaseButton
            class="w-[100%]"
            @click.stop="router.push('/login')"
          >
            {{ t('请先登入') }}
          </PhBaseButton>
        </template>
      </template>
    </div>
    <PhBaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #amount="{ record }">
        <div class="center">
          <PhBaseAmount :amount="record.d || '0.00'" :currency-type="currencyIcon" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="center">
          <template v-if="record.e">
            <span v-if="showIcon" class="amount-unit" style="font-family: proxima-nova, sans-serif;">{{ record.b }}~{{ record.e }}%</span>
            <template v-else>
              <PhBaseAmount :amount="record.b || '0.00'" :currency-type="currencyIcon" :show-icon="false" />~
              <PhBaseAmount :amount="record.e || '0.00'" :currency-type="currencyIcon" />
            </template>
          </template>
          <template v-else>
            <span v-if="showIcon" class="amount-unit" style="font-family: proxima-nova, sans-serif;">{{ record.b }}%</span>
            <PhBaseAmount v-else :amount="record.b || '0.00'" :currency-type="currencyIcon" />
          </template>
        </div>
      </template>
    </PhBaseTable>

    <AppActivityVenues
      v-if="baseConfig?.conf?.platform_ids.length > 0"
      :title="$t('统计平台')"
      :plat-form-ids="baseConfig?.conf?.platform_ids"
      default-tab="3"
    />

    <div v-if="tableData.length" class="mt-16">
      <div class="text-[20rem] leading-[28rem] font-[500]">
        {{ t('活动规则说明') }}
      </div>
      <div v-if="tableData.length" class="my-[8rem]">
        <PhBaseRichArea v-if="rule_type === 2" :content="ruleText" />
        <AppPromotionBaseRuleText
          v-else
          amount="0" :currency-type="currencyIcon" :content="ruleText" replace-type="1"
          :is-login="isLogin"
          :amount-arr="amountArr"
        />
        <PhBaseButton
          v-if="isLogin && buttonConfig?.button === 1"
          class="mt-16 w-[100%]"
          @click="jumpToUrl({ type: Number(buttonConfig?.button_type), jumpUrl: buttonConfig?.redirect })"
        >
          {{ recharge_now }}
        </PhBaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.active-day {
  border-color: #f23038;
  background: linear-gradient(180deg, #fff3f4 0%, #ffe9ea 69.23%, #ffd9db 100%);
}
</style>

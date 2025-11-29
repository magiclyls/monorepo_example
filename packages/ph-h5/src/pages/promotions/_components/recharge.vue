<script lang="ts" setup>
import type { Column, CurrencyCode, DepositStoryRecordList, RechargeActivity } from '@tg/types'
import {
  ApiMemberPromoDepositAccumulative,
  ApiMemberPromoDepositFirst,
  ApiMemberPromoDepositReceive,
  ApiMemberPromoDepositRecordResubmit,
  ApiMemberPromoDepositRegistration,
  ApiMemberPromoDepositStoryRecordList,
} from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseImage, PhBaseRichArea, PhBaseTable, PhBaseTabs } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { IconChessGameshow, IconMore } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import { appEventBus, formatAmountFunc, getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp, toFixed } from '@tg/utils'
import { ALL_LANGUAGES, getLang, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { throttle } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, h, inject, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppCountdown from '~/components/AppCountdown.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({ name: 'PromotionRecharge' })
const setTitle = inject('setTitle', (v: string) => {})

const { t } = useI18n()
// const { openNotify } = useNotify()
// const { openWalletDialog } = useWalletDialog()
// const { openLoginDialog } = useLoginDialog()
const { jumpToUrl } = useRedirect()
const router = useRouter()
const { isLogin } = storeToRefs(useAppStore())
const { currencyList } = storeToRefs(useCurrency())
const route = useRoute()
const userLanguage = ref(getLang())
const currentLang = getLangForBackend()

const RECORD_PAGE_SIZE = 300
const RECORD_SHOW_NUM = 4
const TIME_FORMAT_1 = 'YYYY/MM/DD HH:mm:ss'
const TIME_FORMAT_2 = 'YYYY-MM-DD HH:mm:ss'
const TIME_FORMAT_3 = 'YYYY/MM/DD'
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
    width: '50%',
    slot: 'cycle',
  },
  {
    title: t('累计充值'),
    dataIndex: 'recharge',
    align: 'center',
    width: '50%',
    slot: 'recharge',
  },
  // {
  //   title: t('奖金'),
  //   dataIndex: 'bonus_rate', // 1,2,3,4 领取，审核中，重新提交，已领取
  //   align: 'center',
  //   slot: 'bonus_rate',
  //   width: '34%',
  // },
]
const accumulatedRechargeLabel = [t('本日累计充值1'), t('本日累计充值1'), t('本月累计充值')]
const configDaysMap: { [key: number]: { img: string, label: string } } = {
  2: {
    img: '/ph-h5/png/level_1.png',
    label: t('第几天', { day: 2 }),
  },
  3: {
    img: '/ph-h5/png/level_2.png',
    label: t('第几天', { day: 3 }),
  },
  5: {
    img: '/ph-h5/png/level_3.png',
    label: t('第几天', { day: 5 }),
  },
  7: {
    img: '/ph-h5/png/level_4.png',
    label: t('第几天', { day: 7 }),
  },
  15: {
    img: '/ph-h5/png/level_5.png',
    label: t('第几天', { day: 15 }),
  },
  30: {
    img: '/ph-h5/png/level_6.png',
    label: t('第几天', { day: 30 }),
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

const pid = computed(() => Number(route.query.pid))
const preview = route.query.preview?.toString() ?? ''
// const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone)
const currentDollarZone = computed(() => ALL_LANGUAGES.filter((lang: any) => lang.value === fullRes.value?.time_zone.replace('_', '-'))[0]?.zone || 'UTC')

const activityType = computed(() => Number(route.query.cond))// 1,2,3 首充， 累计充值， 注册充值

const configData = computed(() => fullRes.value?.promo_info)
const imgUrl = computed(() => {
  const images = configData.value?.images
  if (!images)
    return ''
  return JSON.parse(images)[currentLang as string]
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
const globalCurrencyCode = ref<CurrencyCode>('701')
const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const usedCurrency = computed(() => {
  return getCurrencyConfig(usedCurrencyCode.value).name
})
const prize_config = computed(() => {
  const tongue = configData.value?.config.tongue || []
  return tongue[usedCurrencyCode.value] || []
})

const sortedPrizeConfig = computed(() => {
  const s = prize_config.value || []
  return s.sort((a: any, b: any) => Number(a.deposit) - Number(b.deposit))
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
    detail = configData.value ? JSON.parse(configData.value.detail)[currentLang as string] : ''
  }
  catch (e) {

  }
  return detail
})
const hasUnReceived = computed<boolean>(() => Boolean(((past_events.value.d as any[] || []).find((item: any) => item.state === 1))))
const tabList = computed(() => {
  return [{ label: t('本期'), value: 1 }, { label: t('往期'), value: 2, infoTip: hasUnReceived.value ? t('待领取') : undefined }]
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

const showErrorThrottled = throttle((message: string) => {
  Message.error(message)
}, 2000, { trailing: false })
function handleGetConfig(data: RechargeActivity) {
  isFirstLoading.value = false
  let tongue = data.promo_info.tongue || '[]'

  try {
    tongue = JSON.parse(tongue)
  }
  catch (e) {

  }

  if (!Array.isArray(tongue) || !tongue.includes(getLangForBackend() || '')) {
    console.log('不支持当前语言的促销活动', getLangForBackend())
    showErrorThrottled(t('当前语言不支持此活动'))
    goPromo()
  }
  usedCurrencyCode.value = data.promo_info.config.currency

  if (data && data.state === 30) {
    showErrorThrottled(t('本活动同一个ip只能参与一次'))
    data.state = 0 // 提示后页面变为待充值状态
  }
  if (data && data.activity_state === 10 && !preview) {
    showErrorThrottled(t('活动已结束'))
    goPromo()
  }
  else if (data && data.activity_state === 11 && !preview) {
    Message.error(
      h('div', { class: 'flex items-center gap-[4rem]' }, [
        h(IconChessGameshow, { class: 'text-white' }),
        h('span', { class: 'whitespace-nowrap' }, t('活动未开始请稍后再试')),
      ]),
    )
    goPromo()
  }
  else {
    fullRes.value = data
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
        const currentTask = (past_events.value.d as any[]).find((item: any) => item.id === current_taskid.value)
        if (currentTask)
          currentTask.state = data.state
        Message.success(t('领取成功'))
      }
      else {
        fullRes.value.state = data.state
      }
    }
    current_taskid.value = ''
  },
  onError: () => {
    current_taskid.value = ''
    Message.error(t('请联系在线客服'))
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
        const currentTask = past_events.value.d.find((item: any) => item.id === current_taskid.value)
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
    Message.error(t('重新提交失败'))
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
const runAsyncProfitConfig = computed(() => {
  const index = activityType.value - 1
  const functions = [runAsyncProfitConfig1, runAsyncProfitConfig2, runAsyncProfitConfig3]
  return functions[index] || functions[0] // 如果索引无效，默认使用第一个函数
})
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
    // openWalletDialog()
    router.push('/wallet')
}
function openLoginDialog() {
  // openLoginDialog()
  router.push('/login')
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
  const configFunction = runAsyncProfitConfig.value
  if (typeof configFunction === 'function') {
    configFunction({ activity_id: pid.value, curr_id: usedCurrencyCode.value })
  }
  else {
    console.error('runAsyncProfitConfig is not a function:', configFunction)
  }
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
    router.replace('/promotions')
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
watch([isLogin, refresh, currencyList, usedCurrencyCode], async () => {
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
    setTitle(name)
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
  <AppLoading v-if="((configLoading && isFirstLoading) || !(prize_config.length > 0))" />
  <div v-else class="fixed-container flex flex-col gap-[16rem]">
    <PhBaseImage v-if="imgUrl" class="w-full" style="--tg-base-img-style-radius: 12rem;" :url="imgUrl" is-network />
    <div class=" font-[500] text-[#6D7693]">
      <div v-if="activityType === 1" class="rounded-[4rem] bg-light p-[12rem]">
        <div class="mb-[8rem] flex justify-between">
          <span>{{ t('注册时间') }}</span>
          <span class="second-color">{{ Number(fullRes?.reg_time) > 0 ? dayjs.unix(Number(fullRes?.reg_time)).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
        </div>
        <div class="mb-[8rem] flex justify-between">
          <span>{{ t('首次充值时间') }}</span>
          <span class="second-color">{{ Number(fullRes?.first_time) > 0 ? dayjs.unix(Number(fullRes?.first_time)).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
        </div>
        <div class="mb-[8rem] flex justify-between">
          <span>{{ t('首次充值金额') }}</span>

          <PhBaseAmount class="" :amount="fullRes?.first_amount || '0.00'" :currency-type="usedCurrency" />
        </div>
        <div v-if="isLogin" class="second-color bg-deep flex flex-col items-center justify-center rounded-[4rem] p-[12rem]">
          <template v-if="fullRes?.state === 3">
            <div class="min-h-[52rem] center font-normal">
              <span>{{ t('很遗憾暂未获得奖金') }}</span>
            </div>
            <PhBaseButton
              class="mt-[12rem] w-[100%]"
              @click.stop="goPromo"
            >
              {{ t('查看更多活动') }}
            </PhBaseButton>
          </template>
          <template v-else-if="fullRes?.state === 0">
            <template v-if="accumulatedRechargeType === 1">
              <span class="text-white">{{ t('充值倒计时') }}</span>
              <AppCountdown class="my-[12rem]" :end-time="countdownEndTime" :now-time="NOW" @on-end="onCountDownEnd" />
              <i18n-t :keypath="[0, 1].includes(Number(configData?.config.period.ty)) ? '几分钟内首充奖有机会获得' : '几小时内首充奖有机会获得'" tag="div" class="flex font-normal">
                <template #n>
                  {{ configData?.config.period.val }}
                </template>
                <template #money>
                  <span class="">{{ max_prize }}</span>&nbsp;
                </template>
                <template #currency>
                  <PhBaseCurrencyIcon :currency-type="usedCurrency" />
                </template>
              </i18n-t>
            </template>
            <template v-else>
              <i18n-t keypath="首充将有机会获得{money}" tag="div" class="min-h-[52rem] center">
                <template #money>
                  <PhBaseAmount :amount="max_prize" :currency-type="usedCurrency" />
                </template>
              </i18n-t>
              <PhBaseButton
                class="w-[100%]"
                @click="openWalletDialogIfNotApp"
              >
                {{ t('立即充值') }}
              </PhBaseButton>
            </template>
          </template>
          <template v-else>
            <span class="text-[#0D2245] font-[500]">{{ t('您已获取奖金') }}</span>
            <div class="my-[6rem] flex">
              &nbsp;<span class="">{{ max_prize }}</span>&nbsp;
              <PhBaseCurrencyIcon v-if="isLogin" :currency-type="usedCurrency" />
            </div>
            <PhBaseImage class="mb-[10rem] h-[30rem] w-[43rem]" url="/ph-h5/png/dollar.png" />
          </template>
        </div>
        <div v-else class="second-color bg-deep rounded-[4rem] p-[12rem]">
          <div class="min-h-[52rem] center font-normal">
            <span>{{ t('请先登录') }}</span>
          </div>
          <PhBaseButton
            class="mt-[12rem] w-[100%]"
            @click.stop="openLoginDialog"
          >
            {{ t('立即登录') }}
          </PhBaseButton>
        </div>
      </div>
      <div v-else-if="activityType === 2">
        <PhBaseTabs v-model="tab" style="--tabs-wrap-padding-y:5rem;--tabs-wrap-bg:white;--tabs-item-active-bg:#F23038;--tabs-item-active-color:white;" :full="true" :type="5" :list="tabList" class="mb-[20rem]" />
        <div v-if="tab === 1">
          <div class="second-color text-[12rem] my-[20rem] text-center ">
            {{ t('统计周期1') }}{{ currentRange?.start.tz(currentDollarZone).format(TIME_FORMAT_1) }}-{{ currentRange?.end.tz(currentDollarZone).format(TIME_FORMAT_1) }}
          </div>
          <div class="rounded-[4rem] bg-white p-[12rem]">
            <div class="mb-[8rem] flex justify-between">
              <span>{{ t('最近充值时间1') }}</span>
              <span class="second-color">{{ Number(fullRes?.last_time) > 0 ? dayjs.unix(Number(fullRes?.last_time)).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
            </div>
            <div class="mb-[8rem] flex justify-between">
              <span>{{ t('最近充值金额1') }}</span>
              <span class="flex">
                <PhBaseAmount class="" :amount=" fullRes?.last_amount || '0.00'" :currency-type="usedCurrency" />
              </span>
            </div>
            <div class="mb-[8rem] flex justify-between">
              <span>{{ accumulatedRechargeLabel[accumulatedRechargeType - 1] }}</span>
              <span class="flex">
                <PhBaseAmount class="" :amount=" fullRes?.cumulative_amount || '0.00'" :currency-type="usedCurrency" />
              </span>
            </div>

            <div v-if="isLogin" class="second-color bg-[#F6F7F8] flex flex-col items-center justify-center rounded-[4rem] p-[12rem]">
              <template v-if="fullRes?.state === 0">
                <i18n-t keypath="最高有机会获得{money}" tag="div" class="min-h-[52rem] center">
                  <template #money>
                    &nbsp;<span class="">{{ max_prize }}</span>&nbsp;
                    <PhBaseCurrencyIcon v-if="isLogin" :currency-type="usedCurrency" />
                  </template>
                </i18n-t>

                <PhBaseButton
                  class="w-[100%]"
                  @click="openWalletDialogIfNotApp"
                >
                  {{ t('立即充值') }}
                </PhBaseButton>
              </template>
              <template v-else>
                <span class="text-[#0D2245] font-[500]">{{ t('领取倒计时') }}</span>
                <span class="my-[6rem] font-normal">{{ currentRange?.end.add(1, 'hour').add(1, 'second').tz(currentDollarZone).format(TIME_FORMAT_2) }}</span>
                <PhBaseImage class="mb-[15rem] h-[30rem] w-[43rem]" url="/ph-h5/png/dollar.png" />
                <div class="flex font-normal">
                  <span class="">{{ max_prize }}</span>&nbsp;
                  <PhBaseCurrencyIcon v-if="isLogin" :currency-type="usedCurrency" />
                </div>
              </template>
            </div>
            <div v-else class="second-color bg-deep rounded-[4rem] p-[12rem]">
              <div class="min-h-[52rem] center">
                <span>{{ t('请先登录') }}</span>
              </div>
              <PhBaseButton
                class="mt-[12rem] w-[100%]"
                @click.stop="openLoginDialog"
              >
                {{ t('立即登录') }}
              </PhBaseButton>
            </div>
          </div>
        </div>
        <div v-else>
          <PhBaseTable class="table" :columns="pastEventsTableColumn" last-first-padding :data-source="recordExpand ? (past_events.d || []) : (past_events.d || []).slice(0, RECORD_SHOW_NUM)">
            <template #cycle="{ record }">
              <span>{{ dayjs.unix(record.created_at).tz(currentDollarZone).format(TIME_FORMAT_3) }}</span>
            </template>
            <template #recharge="{ record }">
              <div class="center">
                <PhBaseAmount
                  class=""
                  :amount="record.deposit_amount || '0.00'" :currency-type="getCurrencyConfig(record.currency_id).name"
                />
              </div>
            </template>
            <template #bonus_rate="{ record }">
              <PhBaseButton
                v-if="record.state === 1"
                class="w-[85rem]"
                style="--ph-base-button-padding-y:2rem;--ph-base-button-font-size:14rem;--ph-base-button-border-radius:4rem;"
                :loading="receiveLoading && current_taskid === record.id"
                @click.stop="handleReceive(record.id)"
              >
                {{ t('领取') }}
              </PhBaseButton>
              <PhBaseButton
                v-else-if="record.state === 2"
                class="w-[85rem] disabled-btn"
                style="--ph-base-button-padding-y:2rem;--ph-base-button-font-size:14rem;--ph-base-button-border-radius:4rem;"
                :disabled="true"
              >
                {{ t('已领取') }}
              </PhBaseButton>
              <PhBaseButton
                v-else-if="record.state === 4"
                class="w-[85rem] disabled-btn"
                style="--ph-base-button-padding-y:2rem;--ph-base-button-font-size:14rem;--ph-base-button-border-radius:4rem;--ph-base-button-primary-background-color:#F88D22;"
                :disabled="true"
              >
                {{ t('审核中') }}
              </PhBaseButton>
              <PhBaseButton
                v-else-if="record.state === 5"
                class="w-[85rem] "
                style="--ph-base-button-padding-y:2rem;--ph-base-button-font-size:14rem;--ph-base-button-border-radius:4rem;--ph-base-button-primary-background-color:#025BE8;"
                :loading="resubmitLoading && current_taskid === record.id"
                @click.stop="handleResubmit(record.id)"
              >
                {{ t('重新提交') }}
              </PhBaseButton>
            </template>
          </PhBaseTable>
          <template v-if="(past_events.d || []).length > RECORD_SHOW_NUM">
            <div v-if="recordExpand" class="centercursor-pointer" @click="recordExpand = false">
              <IconMore class="text-[24rem] more" />
            </div>
            <div v-else class="center cursor-pointer" @click="recordExpand = true">
              <IconMore class="text-[24rem] rotate-180 more" />
            </div>
          </template>
          <div class="split-line" />
        </div>
      </div>
      <div v-else-if="activityType === 3">
        <div class="grid grid-cols-6 mb-[20rem] items-start gap-[13rem]">
          <div
            v-for="(day, i) in configDays"
            :key="i" :class="{
              'active-day': activeDay === day,
            }" class="flex flex-col items-center justify-center" @click="onChooseActiveDay(day)"
          >
            <div
              class="img-wrap bg-days h-[48rem] w-[48rem] center rounded-[6rem]"
            >
              <PhBaseImage class="h-[38rem] w-[38rem]" :url="configDaysMap[day]?.img" />
            </div>
            <div class="text-days text-center text-[10rem] leading-[14rem]">
              {{ configDaysMap[day]?.label }}
            </div>
          </div>
        </div>
        <div class="rounded-[4rem] bg-[#fff] p-[12rem]">
          <div class="mb-[8rem] flex justify-between">
            <span>{{ t('注册时间') }}</span>
            <span class="second-color">{{ (Number(fullRes?.reg_time) > 0 && !registBeforeStart) ? dayjs.unix(Number(fullRes?.reg_time)).tz(currentDollarZone).format(TIME_FORMAT_1) : '-' }}</span>
          </div>
          <div class="mb-[8rem] flex justify-between">
            <span>{{ t('几天充值总额：', { day: activeDay }) }}</span>

            <span class="flex">
              <PhBaseAmount class="" :amount="(!registBeforeStart && fullRes?.cumulative_amount) || '0.00'" :currency-type="usedCurrency" />
            </span>
          </div>

          <div v-if="isLogin" class="second-color flex flex-col items-center justify-center rounded-[4rem] p-[12rem]">
            <template v-if="registBeforeStart">
              <div class="min-h-[52rem] center font-normal">
                <span>{{ t('该活动仅对新注册用户开放') }}</span>
              </div>
              <PhBaseButton
                class="mt-[12rem] w-[100%]"
                @click.stop="goPromo"
              >
                {{ t('查看更多活动') }}
              </PhBaseButton>
            </template>
            <template v-else-if="fullRes?.state === 0">
              <PhBaseImage class="mb-[15rem] mt-[11rem] h-[30rem] w-[43rem]" url="/ph-h5/png/dollar.png" />
              <div class="mb-[8rem] flex">
                <span class="">{{ max_prize }}</span>&nbsp;
                <PhBaseCurrencyIcon v-if="isLogin" :currency-type="usedCurrency" />
              </div>
              <PhBaseButton
                class="w-[100%]"
                @click="openWalletDialogIfNotApp"
              >
                {{ t('立即充值') }}
              </PhBaseButton>
            </template>
            <template v-else-if="fullRes?.state === 6">
              <span class="text-[#0D2245] font-[500]">{{ t('领取奖金时间') }}</span>
              <span class="my-[6rem] font-normal">{{ Number(fullRes?.reg_time) > 0 ? dayjs.unix(Number(fullRes?.reg_time)).tz(currentDollarZone).add(activeDay - 1, 'day').startOf('day').tz(currentDollarZone).format(TIME_FORMAT_2) : '-' }}</span>
              <PhBaseImage class="mb-[15rem] h-[30rem] w-[43rem]" url="/ph-h5/png/dollar.png" />
              <div class="flex font-normal">
                <span class="">{{ max_prize }}</span>&nbsp;
                <PhBaseCurrencyIcon :currency-type="usedCurrency" />
              </div>
            </template>
            <template v-else>
              <span class="text-[#0D2245] font-[500]">{{ t('您已获取奖金') }}</span>
              <div class="my-[6rem] flex">
                <span class="">{{ max_prize }}</span>&nbsp;
                <PhBaseCurrencyIcon :currency-type="usedCurrency" />
              </div>
              <PhBaseImage class="mb-[10rem] h-[30rem] w-[43rem]" url="/ph-h5/png/dollar.png" />
            </template>
          </div>
          <div v-else class="second-color bg-deep rounded-[4rem] p-[12rem]">
            <div class="min-h-[52rem] center font-normal">
              <span>{{ t('请先登录') }}</span>
            </div>
            <PhBaseButton
              class="mt-[12rem] w-[100%]"
              @click.stop="openLoginDialog"
            >
              {{ t('立即登录') }}
            </PhBaseButton>
          </div>
        </div>
      </div>
    </div>
    <PhBaseTable class="second-color table" :columns="tableColumn" last-first-padding :data-source="prize_config ?? []">
      <template #amount="{ record }">
        <div class=" center">
          <PhBaseAmount :amount="record.deposit || '0.00'" :currency-type="usedCurrency" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class=" center">
          <span class="">{{ [formatAmountFunc(record.min, usedCurrency), `${formatAmountFunc(record.min, usedCurrency)}-${formatAmountFunc(record.max, usedCurrency)}`, `${toFixed(record.scale, 2)}%`][(configData?.config?.bonus || 1) - 1] }}</span>&nbsp;
          <PhBaseCurrencyIcon v-if="isLogin" :currency-type="usedCurrency" />
        </div>
      </template>
    </PhBaseTable>
    <div>
      <div class="text-[20rem] leading-[28rem] font-[500]">
        {{ t('活动规则说明') }}
      </div>
      <div class="my-[8rem]">
        <PhBaseRichArea v-if="configData?.rule_type === 2" :content="currentDetail" />
        <AppPromotionBaseRuleText
          v-else :currency-type="usedCurrency"
          :is-login="isLogin"
          :amount="String(max_award)" :content="currentDetail"
        />
        <PhBaseButton
          v-if="isLogin && recharge_on"
          class="mt-[16rem] w-[100%]"
          @click="jumpToUrl({ type: Number(configData?.button_type), jumpUrl: configData?.redirect })"
        >
          {{ recharge_now }}
        </PhBaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.disabled-btn {
  background-color: #6d7693;
  color: rgba(255, 255, 255, 0.5);
}
.more {
  --tg-base-icon-color: #f23038;
}
.set-radios {
  --tg-base-img-style-radius: 12rem;
}
.bg-light {
  background-color: #fff;
}
.bg-deep {
  background-color: #f6f7f8;
}
.bg-days {
  border: 1px solid #ebebeb;
  background-color: #fff;
}
.text-days {
  color: #0d2245;
}
.active-day {
  .img-wrap {
    border-color: #f23038;
  }
  .text-days {
    color: #f23038;
  }
  .bg-days {
    background-color: #f23038;
  }
}
.split-line {
  margin: 16rem 0;
  border-bottom: 1rem solid #ebebeb;
}

.second-color {
  color: #6d7693;
}
</style>

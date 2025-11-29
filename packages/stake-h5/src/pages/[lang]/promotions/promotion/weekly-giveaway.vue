<script lang="ts" setup>
import { getEnv } from '@tg/utils';

import { ApiMemberTurntableConfig, ApiMemberTurntableGetRecord, ApiMemberTurntableRecord, ApiMemberTurntableRoll } from '@tg/apis'
import { IconUniClose,IconUniShare } from '@tg/icons'
import gsap from 'gsap'
// 转盘风格配置接口
interface RouletteStyle {
  /** 风格名称 */
  name: string
  /** 风格标识 */
  id: string
  /** 整个转盘的宽度(px)或(%) */
  width: number | string
  /** 转盘的宽度(px)或(%) */
  rouletteWidth: number
  /** 转盘的定位 */
  roulettePosition: {
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 转盘背景图片 */
  backgroundImage: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 顶部背景图 */
  topBackgroundImage?: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 底部左边背景图 */
  leftBackgroundImage?: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
  /** 底部右边背景图 */
  rightBackgroundImage?: {
    url: string
    width: number
    left: number
    right: number
    top: number
    bottom: number
  }
}

defineOptions({
  name: 'KeepAlivePromotionWeeklyGiveaway',
})

const { t } = useI18n()
const { VITE_SOCKET_PREFIX } = getEnv()
const router = useLocalRouter()
const { openNotify } = useNotify()
const { openInviteFriendHelpDialog } = useDialogInviteFriendHelp()
const { openTurnWithdrawDialog } = useDialogTurnWithdraw()
const { openTurnResultDialog } = useDialogTurnResult()
const { openRegisterDialog } = useRegisterDialog()
const { openGetMoreRepsDialog } = useDialogGetMoreReps()
const { isLogin, currentGlobalCurrency, userInfo } = storeToRefs(useAppStore())
const { isMobile } = storeToRefs(useWindowStore())
const { isPtbr, userLanguage } = storeToRefs(useLanguageStore())
const { globalPageTitle } = useGlobalStatePageTitle()

const route = useRoute()
// 转盘风格配置数组
const rouletteStyles = ref<RouletteStyle[]>([
  {
    name: '巴西风',
    id: 'style_1',
    width: '100%',
    rouletteWidth: 200,
    roulettePosition: { left: 0, right: 0, top: 67, bottom: 0 },
    backgroundImage: { url: '/png/promotions/bottom-background.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    topBackgroundImage: { url: '/png/promotions/before-top-background.png', width: 49, left: 157, right: 0, top: 60, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background.png', width: 70, left: 50, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background.png', width: 95, left: 0, right: 15, top: 0, bottom: 0 },
  },
  {
    name: '中国风',
    id: 'style_2',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 37, right: 0, top: 67, bottom: 0 },
    backgroundImage: { url: '/png/promotions/bottom-background1.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background1.png', width: 111, left: 0, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background1.png', width: 113, left: 0, right: 5, top: 0, bottom: 0 },
  },
  {
    name: '菲律宾风',
    id: 'style_3',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 38, right: 0, top: 66, bottom: 0 },
    backgroundImage: { url: '/png/promotions/bottom-background2.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background2.png', width: 80, left: 10, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background2.png', width: 85, left: 0, right: 20, top: 0, bottom: 0 },
  },
  {
    name: '通用风',
    id: 'style_4',
    width: '320px',
    rouletteWidth: 230,
    roulettePosition: { left: 44, right: 0, top: 63, bottom: 0 },
    backgroundImage: { url: '/png/promotions/bottom-background3.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/png/promotions/before-left-background3.png', width: 74, left: 20, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/png/promotions/before-right-background3.png', width: 84, left: 0, right: 10, top: 0, bottom: 5 },
  },
])
const { jumpToUrl } = useRedirect()
// 抽奖金额
const { data: resultRoll, runAsync: runAsyncTurntableRoll } = useRequest(ApiMemberTurntableRoll, {
  ready: isLogin,
})
const time = ref()
const rollRecord = ref()
const turntableConfig = ref()

// 获取转盘数据
const {
  // data: _rollRecord,
  runAsync: runAsyncTurntableRecord,
} = useRequest(ApiMemberTurntableRecord, {
  ready: isLogin,
  onSuccess(data) {
    if (data) {
      if ([5].includes(data.state)) // 4已领取 5待审核 金钱要显示为0
        data.achieved_prize = '0'
      if (data.state == 4 && data.last_apply == 2) { // 表示最已经领取奖金，还可以重新转
        rollRecord.value = null
      }
      else {
        rollRecord.value = data
      }
      if (data.period)
        time.value = data.period * 1000 - (new Date().getTime() - ((rollRecord.value?.first_roll_at ?? 0) * 1000)) - 400
      // setCallBack(() => {
      //   openTurnResultDialog({ data, pid: params[0].pid })
      // })
    }
    else { // 数据为空返回列表
      // setTimeout(() => {
      //   closeDialog()
      //   goPromo()
      // }, isManualReceive.value ? 0 : 3000)
    }
  },
})

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}
// 报告列表
const reportList = ref<any>([])
// 顶部消息列表
const topNoticeList = ref<any>([])
// 活动配置
const { runAsync: runAsyncTurntableConfig } = useRequest(ApiMemberTurntableConfig, {
  // onSuccess(data) {
  //   if (data && data !== 'refresh')
  //     turntableConfig.value = data
  // },
})
// 我的邀请记录
// const { data: prizeRecord, loading: prizeRecordLoading, run: runTurntablePrizeRecord } = useRequest(ApiMemberTurntablePrizeRecord)
// 我的报告 首次请求
const { runAsync: runAsyncTurntableGetRecord } = useRequest(ApiMemberTurntableGetRecord, {
  onSuccess(data) {
    topNoticeList.value = cloneDeep(data.slice(0, 4))
    reportList.value = data
  },
})

const rouletteRef = ref()
const currentTab = ref('report')
const tabList = [
  { label: t('report'), value: 'report' },
  // { label: t('my_invitation'), value: 'invitation' },
  { label: t('rule'), value: 'rule' },
]
const pid = ref(route.query.pid as string)
const preview = route.query.preview?.toString() ?? ''
const topicCarousel = `${VITE_SOCKET_PREFIX}/member/active/carousel`
const topicTurntable = `${VITE_SOCKET_PREFIX}/promo/turntable/${userInfo.value?.uid}`
// 顶部滚动待更新列表
const newTopReport: any[] = []
// 报告待更新列表
const newBoxReport: any[] = []
// 转盘当前风格id
const currentStyleId = computed(() => {
  return turntableConfig.value?.now_style ?? 'style_1'
})
// 转盘配置数据
const wheelConfig = computed(() => {
  return turntableConfig.value?.style?.roll_style ?? []
})
// 当前抽奖币种货币配置 默认USDT
const getCurrencyConfig = computed(() => {
  return getCurrencyConfigByCode(turntableConfig.value?.currency_id ?? '706') // 删除领取：rollRecord.value?.currency_id ??
})
// 百分比
const getPercent = computed(() => {
  return toFixed(Number(mul(Number(div(Number(rollRecord.value?.achieved_prize ?? 0), Number(rollRecord.value?.total_prize ?? 100))), 100)), 2)
})
// 剩余余额
const getSurplusBalance = computed(() => {
  return toFixed(Number(sub(Number(rollRecord.value?.total_prize ?? turntableConfig.value?.withdraw_amount ?? 0), Number(rollRecord.value?.achieved_prize ?? 0))), 2)
})

// 是否可领取 1未解锁 2已解锁 3过期 4已领取 5待审核 6已取消
// const ableReceive = computed(() => {
//   return rollRecord.value?.state === 2
// })
const getTime = computed(() => {
  return countTime(time.value)
})
const getDay = computed(() => {
  return Math.floor(time.value / 86400000)
})

const activeCurrency = computed(() => {
  // 虚拟币统一使用USDT
  /* const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
  return currencyConfig[isLogin.value ? val : (languageConfig[getCurrentLanguageForFrontend()].currency)] */
  return getCurrencyConfigByCode(turntableConfig.value?.currency_id ?? '701').name
})
// 根据状态显示按钮文本
const getBtnText = computed(() => {
  switch (rollRecord.value?.state) {
    case 1:
    case 2: return t('take_out')
    case 3: return t('expired')
    case 4: return t('received')
    case 5: return t('promo_invite_pending')
    default: return t('take_out')
  }
})
// 根据状态显示文本
const getShowText = computed(() => {
  switch (rollRecord.value?.state) {
    case 1: return 1
    case 2: return t('you_currently_withdraw_money_wallet')
    case 3: return t('expired')
    case 4: return 4
    case 5: return t('current_bonus_submitted_system_review')
    default: return 1
  }
})
// 获取指定风格的配置
function getRouletteStyle(styleId: string): RouletteStyle | undefined {
  const id = styleId || 'style_1'
  return rouletteStyles.value.find(style => style.id === id)
}
function handleStartRoll(isZero: boolean) {
  if (isZero) { // 次数为0不可滚动
    openGetMoreRepsDialog({
      data: rollRecord.value,
      rollType: rollRecord.value.roll_type,
    })
    return
  }
  if ((!rollRecord.value) || rollRecord.value?.state === 1) { // 金额满了不可滚动 && !rollLoading.value
    rouletteRef.value?.play()
    // 使用活动配置的currency_id，防止当前钱包货币没有配置
    runAsyncTurntableRoll({ pid: pid.value })
  }
}
function handleTurned() {
  runAsyncTurntableRecord({ pid: pid.value })
}
function handleEndRoll() {
  if ((turntableConfig.value?.daily_roll_times ?? 0) - (rollRecord.value?.left_roll ?? 0) === 1)
    openTurnResultDialog({ data: rollRecord.value, pid: pid.value })

  if (resultRoll.value)
    resultRoll.value = undefined
}
function countTime(leftTime: number) {
  // 获取当前时间
  let hour, min, second
  if (leftTime && leftTime > 0) {
    // 天
    // day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
    // 时
    const h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
    hour = h < 10 ? `0${h}` : h
    // 分
    const m = Math.floor(leftTime / 1000 / 60 % 60)
    min = m < 10 ? `0${m}` : m
    // 秒
    const s = Math.floor(leftTime / 1000 % 60)
    second = s < 10 ? `0${s}` : s
    return `${hour}:${min}:${second}`
  }
  else {
    return false
  }
}
function handleRowEnd() {
  const item = topNoticeList.value.shift()
  if (newTopReport.length)
    topNoticeList.value.push(newTopReport.shift())
  else
    topNoticeList.value.push(item)
  // topNoticeList.value.push()
  // newBoxReport.push(...reportList.value?.splice(0, 4))
  // reportList.value?.push(...newBoxReport.splice(0, 4))
}
function handleColEnd() {
  newBoxReport.push(...reportList.value?.splice(0, 4))
  reportList.value?.push(...newBoxReport.splice(0, 4))
}
// 改变状态
// function changeState() {
//   if (rollRecord.value)
//     rollRecord.value.state = 4
// }
// function changeTab(val: string) {
// if (val === 'invitation' && isLogin.value)
//   runTurntablePrizeRecord(pid)
// }
// 报告消息处理
function changeCarousel(msg: any) {
  const arr = msg
  newBoxReport.unshift(...arr)
  newTopReport.push(...arr)
  if (newBoxReport.length > 10)
    newBoxReport.splice(-5)
}
// 邀请&状态变化 通知处理
function changeTurntable(msg: any) {
  switch (msg) {
    case 'invite':
      runAsyncTurntableRecord({ pid: pid.value }) // 刷新记录
      // runTurntablePrizeRecord(pid) // 刷新报告
      return
    case 'review':
      runAsyncTurntableRecord({ pid: pid.value }) // 刷新记录
      // runTurntablePrizeRecord(pid) // 刷新报告
  }
}
function openWithdrawDialog() {
  openTurnWithdrawDialog({
    data: rollRecord.value,
    // callBack: runAsyncTurntableRecord,
    // changeState,
    prefix: getCurrencyConfig.value?.name,
    surplus: getSurplusBalance.value,
    achieved: rollRecord.value?.achieved_prize,
  })
}
function openFriendHelp() {
  if (isLogin.value)
    openInviteFriendHelpDialog({ pid: pid.value })
  else
    openRegisterDialog()
}

const timer = setInterval(() => {
  time.value = time.value - 1000
}, 1000)
const resultGsap = reactive({
  showNumber: 0,
})

onActivated(() => {
  pid.value = route.query.pid as string
  socketClient.addSubscribe(topicCarousel, { callback: promoCarouselCallback })
  appEventBus.on(EventBusNames.ACTIVE_CAROUSEL_BUS, changeCarousel)
  socketClient.addSubscribe(topicTurntable, { callback: promoTurntableCallback })
  appEventBus.on(EventBusNames.PROMO_TURNTABLE_BUS, changeTurntable)
})

watch(() => rollRecord.value?.achieved_prize ?? 0, (newVal) => {
  if (route.fullPath.includes('/weekly-giveaway'))
    gsap.to(resultGsap, { duration: 1.2, showNumber: newVal, ease: 'power4.out' })
})

onDeactivated(() => {
  socketClient.removeSubscribe(topicCarousel)
  socketClient.removeSubscribe(topicTurntable)
  appEventBus.off(EventBusNames.ACTIVE_CAROUSEL_BUS, changeCarousel)
  appEventBus.off(EventBusNames.PROMO_TURNTABLE_BUS, changeTurntable)
  clearInterval(timer)
})

if (isLogin.value) {
  await application.allSettled(
    [runAsyncTurntableRecord({ pid: pid.value }), runAsyncTurntableConfig({ pid: pid.value }).then((data) => {
      let tongue = data.lang || '[]'
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
      if (data && +data.state !== 1 && !preview) {
        openNotify({
          type: 'error',
          code: 'false',
          message: t('promo_end'),
        })
        goPromo()
        return
      }
      turntableConfig.value = data
    }), runAsyncTurntableGetRecord({
      t: 'carousel',
      size: 11,
    })],
  )
}
else {
  await application.allSettled(
    [
      runAsyncTurntableConfig({ pid: pid.value }).then((data) => {
        let tongue = data.lang || '[]'
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
        if (data && +data.state !== 1 && !preview) {
          openNotify({
            type: 'error',
            code: 'false',
            message: t('promo_end'),
          })
          goPromo()
          return
        }
        turntableConfig.value = data
      }),
      runAsyncTurntableGetRecord({
        t: 'carousel',
        size: 11,
      }),
    ],
  )
}

function goAffiliate() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.USER_AFFILIATE)
  else
    router.push('/affiliate/invitation-link')
}

watchEffect(() => {
  let names = turntableConfig.value?.name || '[]'
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
  <div class="tg-weekly-giveaway">
    <div class="m-auto mb-[24px] max-w-[375px] w-[100%] flex flex-col gap-[12px] pt-[20px]">
      <!-- <div v-if="isMobile" class="box-content h-[16px] flex items-center justify-end pb-[8px]">
        <BaseButton type="text" size="none" @click="goPromo">
          <IconUniClose  />
        </BaseButton>
      </div> -->
      <div class="flex items-center gap-[4px]">
        <AppCurrencyIcon
          :currency-type="getCurrencyConfig?.name"
          style="--tg-app-currency-icon-size: var(--tg-font-size-md)"
        />
        <BaseNoticeBar :key="getCurrencyConfig.prefix" :speed="5" @row-end="handleRowEnd">
          <template #default>
            <div
              v-for="item, i in topNoticeList" :key="i"
              class="theme-notice-bar flex items-center gap-[4px] py-[3px] pr-[24px]"
            >
              <span class="whitespace-nowrap text-[12px]">
                {{ `${item.username.slice(0, 2)}****${item.username.slice(-2)}` }}
                {{ $t('just_cashed_in') }}
                <span class="theme-amount">
                  {{ `${getCurrencyConfig.prefix}${rollRecord?.total_prize
                    ?? parseFloat(turntableConfig.withdraw_amount).toFixed(2)}` }}
                </span>
              </span>
            </div>
          </template>
        </BaseNoticeBar>
      </div>
      <div class="theme-bg flex flex-col gap-[13px] rounded-[4px] px-[10px] py-[16px]">
        <div class="text-tg-text-white center gap-[8px] text-[32px]">
          <BaseImage class="w-[30px]" url="/png/promotions/price-money.png" />
          <AppAmount
            class="theme-amount"
            :amount="resultGsap.showNumber" :currency-type="getCurrencyConfig?.name"
            style="--tg-app-amount-font-size: 32px;--tg-app-currency-icon-size: 28px"
          />
          <BaseButton
            :bg-style="isStyle2() ? 'secondary' : 'primary'"
            :disabled="rollRecord?.state === 4" custom-padding
            style="--tg-base-button-padding-y: 8px;--tg-base-button-padding-x: 16px;"
            :class="{ 'disabled-btn': rollRecord?.state === 4 }" @click="openWithdrawDialog"
          >
            {{ getBtnText }}
          </BaseButton>
        </div>
        <div class="progress-bg">
          <div class="text-tg-text-white pb-[2px] text-right text-[14px] font-semibold">
            {{ getPercent }}%
          </div>
          <BaseProgress
            width="100%" :percent="Number(getPercent)" :show-info="false" :stroke-width="8"
            :show-padding="false" stroke-color="var(--tg-primary-success)"
          />
        </div>
        <div class="text-tg-text-lightgrey text-center text-[14px] font-semibold">
          <div v-if="getShowText === 1" class="center">
            <i18n-t keypath="need_money_withdraw">
              <AppAmount :amount="getSurplusBalance" class="theme-amount theme-text mx-[4px]" :currency-type="getCurrencyConfig?.name" />
            </i18n-t>
          </div>
          <div v-else-if="getShowText === 4">
            <i18n-t keypath="more_bonuses_go">
              <BaseButton
                type="text" size="none" style="--tg-base-button-text-default-color: var(--tg-text-white)"
                @click="goAffiliate"
              >
                {{ $t('affiliate') }}
              </BaseButton>
            </i18n-t>
          </div>
          <div v-else>
            {{ getShowText }}
          </div>
        </div>
      </div>
      <!-- 整个转盘及背景 -->
      <div v-if="wheelConfig.length > 0" class="relative m-auto" :style="{ width: `${getRouletteStyle(currentStyleId)?.width}` }">
        <div
          v-if="getRouletteStyle(currentStyleId)?.topBackgroundImage" class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.width}px`,
            left: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.left}px`,
            top: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.top}px`,
          }"
        >
          <BaseImage :url="getRouletteStyle(currentStyleId)?.topBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.width}px`,
            left: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.left}px`,
            bottom: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.bottom}px`,
          }"
        >
          <BaseImage :url="getRouletteStyle(currentStyleId)?.leftBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.width}px`,
            right: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.right}px`,
            bottom: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.bottom}px`,
          }"
        >
          <BaseImage :url="getRouletteStyle(currentStyleId)?.rightBackgroundImage?.url" />
        </div>
        <!-- 各种转盘样式 -->
        <AppRouletteNew
          ref="rouletteRef" :config="wheelConfig" :amount="resultRoll?.amount"
          :state="Number(turntableConfig?.state)"
          :roulette-width="getRouletteStyle(currentStyleId)?.rouletteWidth"
          :roulette-position="getRouletteStyle(currentStyleId)?.roulettePosition"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times"
          :type="getCurrencyConfig?.name" @turned="handleTurned" @start-roll="handleStartRoll"
          @end-roll="handleEndRoll"
        />
        <div class="absolute left-0 top-0 z-[1] w-[100%] px-[6px]">
          <BaseImage :url="getRouletteStyle(currentStyleId)?.backgroundImage.url" />
        </div>
      </div>
      <!-- 兼容老的转盘样式 -->
      <div v-else>
        <!-- 各种转盘样式 -->
        <AppRoulettePt
          v-if="isPtbr"
          ref="rouletteRef" :amount="resultRoll?.amount" :state="turntableConfig?.state"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times"
          :type="getCurrencyConfig?.name" @turned="handleTurned" @start-roll="handleStartRoll"
          @end-roll="handleEndRoll"
        />
        <AppRoulette2
          v-else-if="isStyle2()"
          ref="rouletteRef" :amount="resultRoll?.amount" :state="turntableConfig?.state"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times"
          :type="getCurrencyConfig?.name" @turned="handleTurned" @start-roll="handleStartRoll"
          @end-roll="handleEndRoll"
        />
        <AppRoulette
          v-else
          ref="rouletteRef" :amount="resultRoll?.amount" :state="turntableConfig?.state"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times"
          :type="getCurrencyConfig?.name" @turned="handleTurned" @start-roll="handleStartRoll"
          @end-roll="handleEndRoll"
        />
      </div>
      <div
        v-if="rollRecord && getShowText === 1"
        class="text-tg-text-lightgrey text-color text-center text-[14px] leading-[1.2] font-[600]"
      >
        <i18n-t :keypath="`activity_turntable_add_reps_condition_${rollRecord.roll_type}`">
          <template #amount>
            <AppAmount
              class="text-tg-text-white theme-text theme-amount inline-block" :amount="rollRecord.roll_condition ?? ''"
              :currency-type="getCurrencyConfig?.name"
            />
          </template>
          <template #people>
            <span class="text-tg-text-white theme-text">{{ rollRecord.roll_condition }}</span>
          </template>
          <template #reps>
            <span class="text-tg-text-white theme-text">{{ rollRecord.roll_times }}</span>
          </template>
          <template #reps1>
            <span class="text-tg-text-white theme-text">{{ rollRecord.roll_condition }}</span>
          </template>
        </i18n-t>
      </div>
      <div v-if="rollRecord?.period && isLogin" class="text-tg-text-lightgrey text-color text-center text-[14px] font-semibold">
        <span v-if="turntableConfig?.state === 2">{{ $t('sports_status_finished') }}</span>
        <span v-else-if="rollRecord?.state === 4">{{ $t('checklist_completed') }}</span>
        <template v-else-if="getTime">
          <span>{{ $t('expires_in_days', { day: getDay }) }}</span>
          <span class="text-tg-text-white theme-text">&nbsp;{{ getTime }}</span>
        </template>
        <span v-else>{{ $t('expired') }}</span>
      </div>
      <div
        v-else-if="turntableConfig?.state === 2"
        class="text-tg-text-lightgrey text-center text-[14px] font-semibold"
      >
        {{ $t('sports_status_finished') }}
      </div>
      <div class="center relative cursor-pointer overflow-hidden rounded-[4px]" @click="openFriendHelp()">
        <div class="btn1 flex-1 py-[13px] pr-[56px] text-center text-[14px] font-[600]">
          {{ $t('invite_friends_help_withdrawals') }}
        </div>
        <div class="btn2 absolute right-0">
          <BaseButton
            size="none" custom-padding type="text"
            style="--tg-base-button-padding-x: 18px;--tg-base-button-padding-y:10px"
          >
            <IconUniShare  class="text-[20px]"  />
          </BaseButton>
        </div>
      </div>
      <BaseTab v-model="currentTab" class="theme-tab" :list="tabList" full />
      <div v-if="reportList?.length" v-show="currentTab === 'report'" class="h-[378px] overflow-hidden">
        <BaseNoticeBar :speed="4" :col="4" :total="11" @col-end="handleColEnd">
          <template #default>
            <div
              v-for="item, i in reportList" :key="i"
              class="center text-tg-text-lightgrey theme-bg-row w-[100%] rounded-[4px] py-[20px] text-center text-[14px]"
            >
              <div class="flex-1">
                {{ `${item.username.slice(0, 2)}****${item.username.slice(-2)}` }}
              </div>
              <div class="flex-1">
                {{ timeToFromNow(item.created_at) }}
              </div>
              <div class="center flex-1">
                <AppAmount
                  class="theme-amount"
                  :amount="rollRecord?.total_prize ?? turntableConfig?.withdraw_amount"
                  :currency-type="getCurrencyConfig?.name"
                />
              </div>
            </div>
          </template>
        </BaseNoticeBar>
      </div>
      <div v-if="currentTab === 'rule'" class="text-tg-text-lightgrey">
        <BaseRichArea v-if="turntableConfig?.rule_type === 2" :content="turntableConfig?.detail ?? ''" />

        <AppPromotionBaseRuleText
          v-else :amount="turntableConfig?.withdraw_amount"
          :freetimes="rollRecord?.daily_roll_times ?? turntableConfig?.daily_roll_times"
          :currency-type="getCurrencyConfig.name" :content="turntableConfig?.detail"
        />
      </div>
      <BaseButton
        v-if="turntableConfig?.button === 1" bg-style="secondary" size="md"
        @click="jumpToUrl({ type: +turntableConfig.button_type, jumpUrl: turntableConfig.button_redirect })"
      >
        {{ turntableConfig?.button_text }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-tab {
  @include webTheme('white') {
    --tg-tab-style-wrap-bg-color: #f5f5f5;
    --tg-tab-style-color: #111;
  }
  @include webTheme('green') {
    --tg-tab-style-wrap-bg-color: #02432d;
    --tg-text-green-sub: #fff;
    --tg-tab-active-text-color: #fff;
  }
}
.theme-notice-bar {
  color: var(--tg-text-white);
  background-color: var(--tg-secondary-dark);
  @include webTheme('white') {
    background-color: #f5f5f5;
    color: #555;
  }
}
.theme-bg {
  background-color: var(--tg-sport-card-bg);
  --tg-base-progress-inner-bg: var(--tg-primary-main);
  @include webTheme('white') {
    background-color: #f5f5f5;
    --tg-primary-success: #f2ca5c;
    --tg-base-progress-inner-bg: #c1c1c1;
  }
}
.theme-bg-row {
  &:nth-child(odd) {
    background-color: var(--tg-secondary-grey);
    @include webTheme('white') {
      background-color: #f5f5f5;
    }
    @include webTheme('green') {
      background-color: #055434;
    }
  }
}
.tg-weekly-giveaway {
  --base-notice-bar-background-color: none;
  --base-notice-bar-height: auto;
  --base-notice-bar-radius: var(--tg-radius-default);
}
.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
.btn1 {
  background-color: var(--tg-text-green);
  color: var(--tg-text-dark);
  @include webTheme('greenblack') {
    background-color: var(--tg-primary-active);
    color: var(--tg-text-black-secondary);
  }
  @include webTheme('white') {
    background-color: var(--tg-white-primary-active-bg);
    color: #111;
  }
  @include webTheme('green') {
    background-color: #f6d14a;
    color: #02432d;
  }
}
.btn2 {
  background-color: #00c701;
  --tg-icon-color: #00ffa4;
  @include webTheme('greenblack') {
    background-color: #008f64;
    --tg-icon-color: var(--tg-text-black-secondary);
  }
  @include webTheme('white') {
    background-color: #e6aa05;
    --tg-icon-color: #111;
  }
  @include webTheme('green') {
    background-color: #eca30c;
    --tg-icon-color: #02432d;
  }
}
.theme-text {
  @include webTheme('green') {
    --tg-text-white: #fff;
  }
  @include webTheme('white') {
    --tg-text-white: #ffaa09;
  }
}
.text-color {
  @include webTheme('green') {
    color: #42bc91;
  }
}
.progress-bg {
  @include webTheme('green') {
    --tg-primary-success: #1fff20;
    --tg-base-progress-inner-bg: #197b59;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

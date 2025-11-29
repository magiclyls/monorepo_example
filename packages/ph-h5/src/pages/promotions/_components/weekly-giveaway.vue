<script lang="ts" setup>
import type { CurrencyCode } from '@tg/types'
import {
  ApiMemberTurntableConfig,
  ApiMemberTurntableGetRecord,
  ApiMemberTurntableRecord,
  ApiMemberTurntableRoll,
} from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseDialog, PhBaseImage, PhBaseNoticeBar, PhBaseProgress, PhBaseRichArea, PhBaseTabs } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { IconInviteFriendsShare, IconVector } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import {
  appEventBus,
  application,
  div,
  getCurrencyConfig,
  getEnv,
  isFlutterApp,
  mul,
  sendMsgToFlutterApp,
  socketClient,
  sub,

  toFixed,
} from '@tg/utils'
import { getLang, getLangForBackend, timeToFromNow } from '@tg/vue-i18n'
import gsap from 'gsap'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, inject, onActivated, onDeactivated, reactive, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppDialogInviteFriendHelp from '~/components/AppDialogInviteFriendHelp.vue'
import AppDialogTurnResult from '~/components/AppDialogTurnResult.vue'
import AppDialogTurnWithdraw from '~/components/AppDialogTurnWithdraw.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import AppRouletteNew from '~/components/AppRouletteNew.vue'
import { Message } from '~/utils'

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
// 转盘无数据时：默认数据
interface RollStyle {
  id: number
  currency_id: string
  award_amount: string
  type: number
  color: string
  icon: string
  style: {
    id: string
  }
}
defineOptions({
  name: 'KeepAlivePromotionWeeklyGiveaway',
})
const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
const { VITE_SOCKET_PREFIX } = getEnv()
const router = useRouter()
// isStyle2 兼容处理
const isStyle2 = () => false
function promoCarouselCallback() {}
function promoTurntableCallback() {}
const { isLogin, userInfo } = storeToRefs(useAppStore())
const userLanguage = ref(getLang())
// 转盘风格配置数组
const rouletteStyles = ref<RouletteStyle[]>([
  {
    name: '巴西风',
    id: 'style_1',
    width: '100%',
    rouletteWidth: 200,
    roulettePosition: { left: 0, right: 0, top: 67, bottom: 0 },
    backgroundImage: { url: '/ph-h5/png/bottom-background.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    topBackgroundImage: { url: '/ph-h5/png/before-top-background.png', width: 49, left: 157, right: 0, top: 60, bottom: 0 },
    leftBackgroundImage: { url: '/ph-h5/png/before-left-background.png', width: 70, left: 50, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/ph-h5/png/before-right-background.png', width: 95, left: 0, right: 15, top: 0, bottom: 0 },
  },
  {
    name: '中国风',
    id: 'style_2',
    width: '320rem',
    rouletteWidth: 230,
    roulettePosition: { left: 37, right: 0, top: 67, bottom: 0 },
    backgroundImage: { url: '/ph-h5/png/bottom-background1.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/ph-h5/png/before-left-background1.png', width: 111, left: 0, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/ph-h5/png/before-right-background1.png', width: 113, left: 0, right: 5, top: 0, bottom: 0 },
  },
  {
    name: '菲律宾风',
    id: 'style_3',
    width: '320rem',
    rouletteWidth: 230,
    roulettePosition: { left: 38, right: 0, top: 66, bottom: 0 },
    backgroundImage: { url: '/ph-h5/png/bottom-background2.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/ph-h5/png/before-left-background2.png', width: 80, left: 10, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/ph-h5/png/before-right-background2.png', width: 85, left: 0, right: 20, top: 0, bottom: 0 },
  },
  {
    name: '通用风',
    id: 'style_4',
    width: '320rem',
    rouletteWidth: 230,
    roulettePosition: { left: 44, right: 0, top: 63, bottom: 0 },
    backgroundImage: { url: '/ph-h5/png/bottom-background3.png', width: 200, left: 0, right: 0, top: 0, bottom: 0 },
    leftBackgroundImage: { url: '/ph-h5/png/before-left-background3.png', width: 74, left: 20, right: 0, top: 0, bottom: 0 },
    rightBackgroundImage: { url: '/ph-h5/png/before-right-background3.png', width: 84, left: 0, right: 10, top: 0, bottom: 5 },
  },
])
const route = useRoute()
const { jumpToUrl } = useRedirect()
// 转盘抽奖金额
const { data: resultRoll, runAsync: runAsyncTurntableRoll } = useRequest(ApiMemberTurntableRoll, {
  ready: isLogin,
})
const time = ref()
const rollRecord = ref()
const turntableConfig = ref()
const showWithdrawDialog = ref(false)
const showInviteFriendHelp = ref(false)
const showTurnResult = ref(false)
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
      if (data.state === 4 && data.last_apply === 2) { // 表示最已经领取奖金，还可以重新转
        rollRecord.value = null
      }
      else {
        rollRecord.value = data
      }
      if (data.period)
        time.value = data.period * 1000 - (new Date().getTime() - ((rollRecord.value?.first_roll_at ?? 0) * 1000)) - 400
    }
  },
})

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}
// 报告列表
const reportList = ref<any>([])
// 顶部消息列表
const topNoticeList = ref<any>([])
// 活动配置
const { runAsync: runAsyncTurntableConfig } = useRequest(ApiMemberTurntableConfig, {
})
// 我的报告 首次请求
const { runAsync: runAsyncTurntableGetRecord } = useRequest(ApiMemberTurntableGetRecord, {
  onSuccess(data) {
    topNoticeList.value = cloneDeep(data.slice(0, 4))
    reportList.value = data
  },
})
// 当前抽奖币种货币配置 默认USDT
const getCurrencyConfigAll = computed(() => {
  return getCurrencyConfig(turntableConfig.value?.currency_id ?? '706') // 删除领取：rollRecord.value?.currency_id ??
})
// 转盘无数据时：默认数据
const default_roll_style = ref<RollStyle[]>([
  {
    id: 1,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 1,
    color: '#fff',
    icon: 'face',
    style: {
      id: 'circle2',
    },
  },
  {
    id: 2,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '20',
    type: 2,
    color: '#fff',
    icon: 'face',
    style: {
      id: 'circle3',
    },
  },
  {
    id: 3,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 1,
    color: '#fff',
    icon: 'money',
    style: {
      id: 'circle4',
    },
  },
  {
    id: 4,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '50',
    type: 2,
    color: '#FFEA00',
    icon: 'face',
    style: {
      id: 'circle5',
    },
  },
  {
    id: 7,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 1,
    color: '#fff',
    icon: 'gold',
    style: {
      id: 'circle7',
    },
  },
  {
    id: 6,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '30',
    type: 2,
    color: '#fff',
    icon: 'face',
    style: {
      id: 'circle8',
    },
  },
  {
    id: 5,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '20',
    type: 1,
    color: '#fff',
    icon: 'box',
    style: {
      id: 'circle9',
    },
  },
  {
    id: 8,
    currency_id: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode,
    award_amount: '100',
    type: 2,
    color: '#FFEA00',
    icon: 'face',
    style: {
      id: 'circle6',
    },
  },
])
const rouletteRef = ref()
const currentTab = ref('report')
const tabList = [
  { label: t('报告'), value: 'report' },
  { label: t('规则'), value: 'rule' },
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
  return turntableConfig.value?.style?.roll_style ?? default_roll_style.value
})

// 百分比
const getPercent = computed(() => {
  return toFixed(Number(mul(Number(div(Number(rollRecord.value?.achieved_prize ?? 0), Number(rollRecord.value?.total_prize ?? 100))), 100)), 2)
})
// 剩余余额
const getSurplusBalance = computed(() => {
  return toFixed(Number(sub(Number(rollRecord.value?.total_prize ?? turntableConfig.value?.withdraw_amount ?? 0), Number(rollRecord.value?.achieved_prize ?? 0))), 2)
})
const getTime = computed(() => {
  return countTime(time.value)
})
const getDay = computed(() => {
  return Math.floor(time.value / 86400000)
})
// 根据状态显示按钮文本
const getBtnText = computed(() => {
  switch (rollRecord.value?.state) {
    case 1:
    case 2: return t('取出')
    case 3: return t('已过期')
    case 4: return t('已领取')
    case 5: return t('审核中')
    default: return t('取出')
  }
})
// 根据状态显示文本
const getShowText = computed(() => {
  switch (rollRecord.value?.state) {
    case 1: return 1
    case 2: return t('已满足要求可提现到钱包')
    case 3: return t('已过期')
    case 4: return 4
    case 5: return t('当前奖金已提交到系统审核')
    default: return 1
  }
})
// 获取指定风格的配置
function getRouletteStyle(styleId: string): RouletteStyle | undefined {
  const id = styleId || 'style_1'
  return rouletteStyles.value.find(style => style.id === id)
}
// 转盘开始
function handleStartRoll(isZero: boolean) {
  if (isZero) { // 次数为0不可滚动
    return
  }
  if ((!rollRecord.value) || rollRecord.value?.state === 1) { // 金额满了不可滚动 && !rollLoading.value
    rouletteRef.value?.play()
    // 使用活动配置的currency_id，防止当前钱包货币没有配置
    runAsyncTurntableRoll({ pid: pid.value, cur: turntableConfig.value?.currency_id })
  }
}
// 转盘转动
function handleTurned() {
  runAsyncTurntableRecord({ pid: pid.value })
}
// 转盘结束
function handleEndRoll() {
  if ((turntableConfig.value?.daily_roll_times ?? 0) - (rollRecord.value?.left_roll ?? 0) === 1) {
    showTurnResult.value = true
    if (resultRoll.value)
      resultRoll.value = undefined
  }
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
// 顶部消息滚动结束
function handleRowEnd() {
  const item = topNoticeList.value.shift()
  if (newTopReport.length)
    topNoticeList.value.push(newTopReport.shift())
  else
    topNoticeList.value.push(item)
}
// 报告消息滚动结束
function handleColEnd() {
  newBoxReport.push(...reportList.value?.splice(0, 4))
  reportList.value?.push(...newBoxReport.splice(0, 4))
}
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
// 打开提取奖金弹窗
function openWithdrawDialog() {
  showWithdrawDialog.value = true
}

function openFriendHelp() {
  if (isLogin.value)
    showInviteFriendHelp.value = true
  else
    router.push('/login')
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
    [runAsyncTurntableRecord({ pid: pid.value }), runAsyncTurntableConfig({ pid: pid.value, cur: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode }).then((data) => {
      let tongue = data.lang || '[]'
      try {
        tongue = JSON.parse(tongue)
      }
      catch (e) {

      }

      if (!tongue.includes(getLangForBackend() as string)) {
        Message.error(t('当前语言不支持此活动'))
        goPromo()
      }
      if (data && +data.state !== 1 && !preview) {
        Message.error(t('活动已结束'))
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
      runAsyncTurntableConfig({ pid: pid.value, cur: getCurrencyConfigAll.value?.name as CurrencyCode || 'CNY' as CurrencyCode }).then((data) => {
        let tongue = data.lang || '[]'
        try {
          tongue = JSON.parse(tongue)
        }
        catch (e) {

        }

        if (!tongue.includes(getLangForBackend() as string)) {
          Message.error(t('当前语言不支持此活动'))
          goPromo()
        }
        if (data && +data.state !== 1 && !preview) {
          Message.error(t('活动已结束'))
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
    setTitle(name)
})
</script>

<template>
  <div class="tg-weekly-giveaway">
    <div class="m-auto mb-[24rem] max-w-[var(--pc-max-width)] w-[100%] flex flex-col gap-[12rem]">
      <div class="flex items-center gap-[4rem]">
        <PhBaseCurrencyIcon
          v-if="isLogin"
          :currency-type="getCurrencyConfigAll?.name"
          style="--tg-app-currency-icon-size: 18rem"
        />
        <PhBaseNoticeBar :key="getCurrencyConfigAll.prefix" :speed="5" @row-end="handleRowEnd">
          <template #default>
            <div
              v-for="item, i in topNoticeList" :key="i"
              class="theme-notice-bar flex items-center gap-[4rem] py-[0rem] pr-[24rem]"
            >
              <span class="whitespace-nowrap text-[12rem]">
                {{ `${item.username.slice(0, 2)}****${item.username.slice(-2)}` }}
                {{ t('刚刚兑现') }}
                <span class="theme-amount">
                  {{ `${getCurrencyConfigAll.prefix}${rollRecord?.total_prize
                    ?? parseFloat(turntableConfig?.withdraw_amount || '0').toFixed(2)}` }}
                </span>
              </span>
            </div>
          </template>
        </PhBaseNoticeBar>
      </div>
      <div class="theme-bg flex flex-col rounded-[4rem] px-[10rem] py-[6rem]">
        <div class="text-[#0D2245] center gap-[9rem] text-[32rem]">
          <PhBaseImage class="w-[30rem]" url="/ph-h5/png/price-money.png" />
          <PhBaseAmount
            class="theme-amount"
            :amount="resultGsap.showNumber" :currency-type="getCurrencyConfigAll?.name"
            style="--ph-base-amount-font-size: 32rem;--ph-app-currency-icon-size: 28rem;--ph-app-amount-font-weight:500;"
          />
          <PhBaseButton
            :bg-style="isStyle2() ? 'secondary' : 'primary'"
            :disabled="rollRecord?.state === 4" custom-padding
            class="small-btn"
            :class="{ 'disabled-btn': rollRecord?.state === 4 }" @click="openWithdrawDialog"
          >
            {{ getBtnText }}
          </PhBaseButton>
        </div>
        <div class="progress-bg">
          <div class="text-[#0D2245] pb-[2rem] text-right text-[14rem] font-[500]">
            {{ getPercent }}%
          </div>
          <PhBaseProgress
            width="100%" :value="Number(getPercent)" :stroke-width="8" height="8rem"
            :show-percentage="false" bar-color="#2BA471" background-color="#EBEBEB"
          />
        </div>
        <div class="text-tg-text-lightgrey py-[12rem] text-center text-[14rem] font-semibold">
          <div v-if="getShowText === 1" class="center">
            <i18n-t keypath="您还需要多少才能提现到钱包">
              <PhBaseAmount :amount="getSurplusBalance" class="theme-text mx-[4rem]" :currency-type="getCurrencyConfigAll?.name" />
            </i18n-t>
          </div>
          <div v-else-if="getShowText === 4">
            <i18n-t keypath="获得更多奖金前往">
              <PhBaseButton
                type="none" size="none" style="--tg-base-button-text-default-color: #fff"
                @click="goAffiliate"
              >
                {{ t('联盟计划') }}
              </PhBaseButton>
            </i18n-t>
          </div>
          <div v-else>
            {{ getShowText }}
          </div>
        </div>
      </div>
      <!-- 整个转盘及背景 -->
      <div class="relative m-auto" :style="{ width: `${getRouletteStyle(currentStyleId)?.width}` }">
        <div
          v-if="getRouletteStyle(currentStyleId)?.topBackgroundImage" class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.width}rem`,
            left: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.left}rem`,
            top: `${getRouletteStyle(currentStyleId)?.topBackgroundImage?.top}rem` }"
        >
          <PhBaseImage :url="getRouletteStyle(currentStyleId)?.topBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.width}rem`,
            left: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.left}rem`,
            bottom: `${getRouletteStyle(currentStyleId)?.leftBackgroundImage?.bottom}rem` }"
        >
          <PhBaseImage :url="getRouletteStyle(currentStyleId)?.leftBackgroundImage?.url" />
        </div>
        <div
          class="absolute z-[3]" :style="{
            width: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.width}rem`,
            right: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.right}rem`,
            bottom: `${getRouletteStyle(currentStyleId)?.rightBackgroundImage?.bottom}rem` }"
        >
          <PhBaseImage :url="getRouletteStyle(currentStyleId)?.rightBackgroundImage?.url" />
        </div>
        <!-- 各种转盘样式 -->
        <AppRouletteNew
          ref="rouletteRef" :config="wheelConfig" :amount="resultRoll?.amount"
          :state="Number(turntableConfig?.state)"
          :roulette-width="getRouletteStyle(currentStyleId)?.rouletteWidth"
          :roulette-position="getRouletteStyle(currentStyleId)?.roulettePosition"
          :frequency="isLogin && rollRecord ? rollRecord.left_roll : turntableConfig?.daily_roll_times"
          :type="getCurrencyConfigAll?.name" @turned="handleTurned" @start-roll="handleStartRoll"
          @end-roll="handleEndRoll"
        />
        <div class="absolute top-0 left-0 z-[1] w-[100%] px-[6rem]">
          <PhBaseImage :url="getRouletteStyle(currentStyleId)?.backgroundImage.url" />
        </div>
      </div>
      <div
        v-if="rollRecord && getShowText === 1"
        class="text-tg-text-lightgrey text-color text-center text-[14rem] leading-[1.2] font-[500]"
      >
        <i18n-t :keypath="`activity_turntable_add_reps_condition_${rollRecord.roll_type}`">
          <template #amount>
            <span class="text-[#0D2245] theme-text theme-amount inline-flex items-center gap-[4rem]">
              <PhBaseAmount
                class="inline-block" :amount="rollRecord.roll_condition ?? ''"
                :currency-type="getCurrencyConfigAll?.name"
              /><br>
            </span>
          </template>
          <template #people>
            <span class="text-[#0D2245] theme-text">{{ rollRecord.roll_condition }}</span>
          </template>
          <template #reps>
            <span class="text-[#0D2245] theme-text">{{ rollRecord.roll_times }}</span>
          </template>
          <template #reps1>
            <span class="text-[#0D2245] theme-text">{{ rollRecord.roll_condition }}</span>
          </template>
        </i18n-t>
      </div>
      <div v-if="rollRecord?.period && isLogin" class="text-tg-text-lightgrey text-color text-center text-[14rem] font-[500]">
        <span v-if="turntableConfig?.state === 2">{{ t('已结束') }}</span>
        <span v-else-if="rollRecord?.state === 4">{{ t('已完成') }}</span>
        <template v-else-if="getTime">
          <span>{{ t('几天后过期', { day: getDay, time: getTime }) }}</span>
        </template>
        <span v-else>{{ t('已过期') }}</span>
      </div>
      <div
        v-else-if="turntableConfig?.state === 2"
        class="text-tg-text-lightgrey text-center text-[14rem] font-[500]"
      >
        {{ t('已结束') }}
      </div>
      <div class="center relative cursor-pointer overflow-hidden rounded-[4px]" @click="openFriendHelp()">
        <div class="btn1 flex-1 py-[9rem] pr-[56rem] text-center text-[14rem] font-[500]">
          {{ t('邀请好友帮忙提款') }}
        </div>
        <div class="btn2 absolute right-[0rem]">
          <PhBaseButton
            size="none" custom-padding type="none"
            style="--tg-base-button-padding-x: 18rem;--tg-base-button-padding-y:10rem"
          >
            <IconInviteFriendsShare class="text-[20rem]" />
          </PhBaseButton>
        </div>
      </div>
      <PhBaseTabs v-model="currentTab" :type="5" class="theme-tab" style="--tabs-wrap-padding-y:5rem;--tabs-wrap-bg:white;--tabs-item-active-bg:#F23038;--tabs-item-active-color:white;" :list="tabList" full />
      <div v-if="reportList?.length" v-show="currentTab === 'report'" class="h-[378rem] overflow-hidden">
        <PhBaseNoticeBar :speed="4" :col="4" :total="11" @col-end="handleColEnd">
          <template #default>
            <div
              v-for="item, i in reportList" :key="i"
              class="center text-tg-text-lightgrey theme-bg-row w-[100%] rounded-[4rem] py-[17rem] text-center text-[14rem]"
            >
              <div class="flex-1">
                {{ `${item.username.slice(0, 2)}****${item.username.slice(-2)}` }}
              </div>
              <div class="flex-1">
                {{ timeToFromNow(item.created_at) }}
              </div>
              <div class="center flex-1">
                <PhBaseAmount
                  :amount="rollRecord?.total_prize ?? turntableConfig?.withdraw_amount"
                  :currency-type="getCurrencyConfigAll?.name"
                />
              </div>
            </div>
          </template>
        </PhBaseNoticeBar>
      </div>
      <div v-if="currentTab === 'rule'" class="text-tg-text-lightgrey">
        <PhBaseRichArea v-if="turntableConfig?.rule_type === 2" :content="turntableConfig?.detail ?? ''" />

        <AppPromotionBaseRuleText
          v-else :amount="turntableConfig?.withdraw_amount"
          :is-login="isLogin"
          :freetimes="rollRecord?.daily_roll_times ?? turntableConfig?.daily_roll_times"
          :currency-type="getCurrencyConfigAll.name" :content="turntableConfig?.detail"
        />
      </div>
      <PhBaseButton
        v-if="turntableConfig?.button === 1" bg-style="secondary" size="md"
        @click="jumpToUrl({ type: +turntableConfig?.button_type, jumpUrl: turntableConfig?.button_redirect })"
      >
        {{ turntableConfig?.button_text }}
      </PhBaseButton>
    </div>
  </div>
  <PhBaseDialog v-model="showWithdrawDialog" :title="t('取款进度')" style="--ph-base-dialog-background-color: #F6F7F8;">
    <AppDialogTurnWithdraw :data="rollRecord" :achieved="rollRecord?.achieved_prize" :prefix="getCurrencyConfigAll?.name" :surplus="getSurplusBalance" />
  </PhBaseDialog>
  <PhBaseDialog v-model="showInviteFriendHelp" :title="t('邀请好友帮忙提款')" style="--ph-base-dialog-background-color: #F6F7F8;">
    <AppDialogInviteFriendHelp v-model="showInviteFriendHelp" :pid="pid" />
  </PhBaseDialog>
  <PhBaseDialog v-model="showTurnResult" :title="t('免费获得钱币')" :icon="IconVector" style="--ph-base-dialog-background-color: #F6F7F8;">
    <AppDialogTurnResult :data="rollRecord" :pid="pid" :amount="rollRecord?.total_prize ?? turntableConfig?.withdraw_amount" />
  </PhBaseDialog>
</template>

<style lang="scss" scoped>
.theme-tab {
  --tg-tab-style-wrap-bg-color: #02432d;
  --tg-text-green-sub: #fff;
  --tg-tab-active-text-color: #fff;
}
.theme-notice-bar {
  color: #0d2245;
  background-color: #ebebeb;
}
.theme-bg {
  background-color: #ffffff;
  --tg-base-progress-inner-bg: #f23038;
}
.theme-bg-row {
  &:nth-child(odd) {
    background-color: #fff;
  }
}
.tg-weekly-giveaway {
  --base-notice-bar-background-color: none;
  --base-notice-bar-height: auto;
  --base-notice-bar-radius: 4rem;
}
.theme-amount {
  color: #0d2245;
}
.btn1 {
  background-color: #f23038;
  color: #fff;
}
.btn2 {
  color: #fff;
  background-color: #d7121a;
  padding: 9rem 15rem;
}
.theme-text {
  --tg-text-white: #ffaa09;
}
.text-color {
  color: #42bc91;
}
.progress-bg {
  --tg-primary-success: #1fff20;
  --tg-base-progress-inner-bg: #197b59;
}
.small-btn {
  --ph-base-button-font-size: 12rem;
  --ph-base-button-line-height: 12rem;
  --ph-base-button-padding-y: 8rem;
  --ph-base-button-padding-x: 17.5rem;
  --ph-base-button-border-radius: 4rem;
  --ph-base-button-font-weight: 400;
}
.text-tg-text-lightgrey {
  color: #6d7693;
}
</style>

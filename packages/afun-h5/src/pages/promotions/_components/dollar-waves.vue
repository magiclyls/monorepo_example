<script lang="ts" setup>
import type { FlutterAppMsgType } from '@tg/types'
import { ApiMemberPromoRedBonus, ApiMemberRedDetail, ApiPromoRedClaimed } from '@tg/apis'
import { AfunBaseAmount, AfunBaseImage, AfunBaseRichArea } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { IconChessGameshow } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { EnumLanguage, EventBusNames, ReceiveFlutterAppMessage, SendFlutterAppMessage, TIMEZONE_LABEL_KEY } from '@tg/types'
import { appEventBus, application, getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { flatten, throttle, uniq } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, h, inject, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({ name: 'DollarWaves' })

const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const currencyStore = useCurrency()
const { jumpToUrl } = useRedirect()
const { isLogin } = storeToRefs(appStore)
const userLanguage = ref(getLang())
const pid = ref(`${route.query.promoid}`)
const preview = route.query.preview?.toString() ?? ''
const currencyName = ref('')
const lang = ref(getLangForBackend())

const { data: detailData, runAsync: runGetDetail } = useRequest(ApiMemberRedDetail, {
  manual: true,
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess: (res, params) => {
    setLocalHM()
    const bb = res && res.lang && res.lang.length && res.lang.map(r => r.replace('_', '-').includes(userLanguage.value))
    if (bb) {
      const displayTime = res.display_time

      currencyName.value = Object.keys(res.conf)[0]
      const displayTimeStartStamp = displayTime && displayTime.s ? (dayjs.tz(displayTime.s, res.timezone).valueOf()) : undefined
      localStorage.setItem(`promo_red_start_${params[0]}_${currencyName.value}`, displayTimeStartStamp?.toString() ?? '')
    }
    const tongue = res && res.lang ? res.lang.toString() : undefined
    if (tongue) {
      if (tongue.includes(userLanguage.value.slice(0, 2)))
        console.log('yes')
      else
        goPromo()
    }
    // if (res && +res.display !== 1)
    if (res && +res.state !== 1 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
    }
  },
  onError: (err) => {
    const obj = JSON.parse(err.message)
    if (obj.data === 'refresh' && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
    }
    else {
      goPromo()
    }
  },
})
const currentDollarZone = computed(() => detailData.value?.timezone)
const globalCurrencyCode = computed(() => detailData.value?.conf.currency ?? '701')
const languageCurrencyType = computed(() => getCurrencyConfig(globalCurrencyCode.value).name)
const currentDollarZoneKey = computed(() => String(currentDollarZone.value))
const localHM = ref(zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm'))

// 计算时区标签文本
const timezoneLabel = computed(() => {
  const timezoneKey = TIMEZONE_LABEL_KEY[currentDollarZoneKey.value as keyof typeof TIMEZONE_LABEL_KEY] || 'Label_UTC'
  return t(timezoneKey)
})
function zoneDayJs(t?: any) {
  return dayjs(t).tz(currentDollarZone.value)
}

function setLocalHM() {
  localHM.value = zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
}
const configs = computed(() => [
  // 红包，金钱雨，钻石
  {
    descKey: '凡是有在我司投注/充值的会员即可参与红包雨，每日{num}场，最高可领取{bonus}，每场最高可领取{single}，请根据浮标提示时间参与，记得按时领取哦。',
    timezoneKey: '当前红包显示时间为',
    titleKey: t('红包时间'),
    bgImages: ['/bonus-time-1', '/bonus-time-0', '/bonus-time-2'], // default, received ,expired
    descDetailCondition: [
      t('红包领取后会自动派发到玩家钱包余额内'),
      t('此活动仅适用于本平台的真钱用户'),
      t('同一手机号姓名邮箱地址银行卡号等信息的游戏账号单场红包派发仅可参与一次'),
      t('任何用户或团体以不正常的方式进行套取活动优惠平台保留在不通知的情况下冻结或关闭相关账户的权利并不退还款项且用户会被列入黑名单'),
      t('为避免文字理解差异本平台保留本活动最终解释权'),
      t('中奖金额可用于任何游戏投注N倍流水即可出款', { n: detailData.value?.multiple }),
    ].join('\n'),
    qaList: [
      { q: t('红包是随机派发的吗'), a: t('红包随机派发投注充值越多拆到大额红包的概率就越大') },
      { q: t('红包在什么时候派发'), a: t('每场红包准点派发请注意活动提示') },
      { q: t('红包怎么领取'), a: t('活动期间进入本平台红包会在每个场次准点派发您可通过点击活动浮标来触发活动通过点击洒落的红包即可领取') },
      { q: t('红包开启时有提醒吗'), a: t('红包派发前会有倒计时提醒建议您提前进入平台游戏以免错过活动时间') },
      { q: t('红包有领取数量限制吗'), a: t('单一场次只能领取一个红包最多可以获得个红包哦') },
      { q: t('红包有提款要求吗'), a: t('领取到的红包即刻自动到账钱包余额可用于任何游戏投注N倍流水即可出款', { n: detailData.value?.multiple }) },
    ],
  },
  {
    descKey: '凡是有在我司投注/充值的会员即可参与金钱雨，每日{num}场，最高可领取{bonus}，每场最高可领取{single}，请根据浮标提示时间参与，记得按时领取哦。',
    timezoneKey: '当前金钱雨显示时间为',
    titleKey: t('活动时间'),
    bgImages: ['/brl-time-1', '/brl-time-2', '/brl-time-2'],
    descDetailCondition: [
      t('1_描述'),
      t('此活动仅适用于本平台的真钱用户'),
      t('2_描述'),
      t('任何用户或团体以不正常的方式进行套取活动优惠平台保留在不通知的情况下冻结或关闭相关账户的权利并不退还款项且用户会被列入黑名单'),
      t('为避免文字理解差异本平台保留本活动最终解释权'),
      t('中奖金额可用于任何游戏投注N倍流水即可出款', { n: detailData.value?.multiple }),
    ].join('\n'),
    qaList: [
      { q: t('1_问题'), a: t('1_回答') },
      { q: t('2_问题'), a: t('2_回答') },
      { q: t('3_问题'), a: t('3_回答') },
      { q: t('4_问题'), a: t('4_回答') },
      { q: t('5_问题'), a: t('5_回答') },
      { q: t('6_问题'), a: t('6_回答', { n: detailData.value?.multiple }) },
    ],
  },
  {
    descKey: '抢红包活动说明',
    timezoneKey: '当前水晶显示时间为',
    titleKey: t('水晶时间'),
    bgImages: ['/diamond', '/diamond-received', '/diamond-received'],
    descDetailCondition: [
      t('水晶挖取后会自动派发到玩家钱包余额内'),
      t('此活动仅适用于本平台的真钱用户'),
      t('同一手机号姓名邮箱地址银行卡号等信息的游戏账号单场水晶挖取仅可参与一次'),
      t('任何用户或团体以不正常的方式进行套取活动优惠平台保留在不通知的情况下冻结或关闭相关账户的权利并不退还款项且用户会被列入黑名单'),
      t('为避免文字理解差异本平台保留本活动最终解释权'),
      t('中奖金额可用于任何游戏投注N倍流水即可出款', { n: detailData.value?.multiple }),
    ].join('\n'),
    qaList: [
      { q: t('水晶是随机挖取的吗'), a: t('水晶随机挖取投注充值越多挖到大额水晶的概率就越大') },
      { q: t('水晶在什么时候可以挖'), a: t('每场水晶准点开启，请注意活动提示') },
      { q: t('水晶怎么挖'), a: t('活动期间进入本平台水晶会在每个场次准点开启您可通过点击活动浮标来触发活动通过点击撒落的水晶即可领取') },
      { q: t('水晶开启时有提醒吗'), a: t('水晶开启前会有倒计时提醒建议您提前进入平台游戏以免错过活动时间') },
      { q: t('水晶有挖取数量限制吗'), a: t('单一场次只能挖取一次水晶最多可以获得个水晶哦') },
      { q: t('水晶有提款要求吗'), a: t('挖取到的水晶即刻自动到账钱包余额可用于任何游戏投注N倍流水即可提款', { n: detailData.value?.multiple }) },
    ],
  },
])
const currentConfig = computed(() => {
  if (detailData.value) {
    const drop = detailData.value.drop // 1,2,3 红包，金钱，钻石
    return configs.value[Number(drop) - 1]
  }
})

const timeScopes = computed(() => {
  // >= <
  if (detailData.value && detailData.value.cycle) {
    const cycle = detailData.value.cycle
    // 过滤 开始 === 结束；开始 > 结束 则 开始 - 23:59；结束 >= 24
    if (cycle && cycle.length)
      return transferScope(cycle) // .sort((a, b) => a - b) // uniq(flatten(detailData.value.config.map(c => c.scope))).sort(sortTimeTag).map((i: string) => i.split('~').map(m => formatTag(m)))
  }
  return []
})

const { data: cdata, runAsync: runGetClaimed, loading: claimedLoading } = useRequest(ApiPromoRedClaimed, {
  ready: isLogin,
  manual: true,
  throttleInterval: 2000,
  onAfter: () => {
    setLocalHM()
    // localHM.value = dayjs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
  },
})

const { data: bonusData, runAsync: runGetBonus, loading: bonusLoading } = useRequest(ApiMemberPromoRedBonus, {
  ready: isLogin,
  manual: true,
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  // onError: (err: Error) => {
  //   console.log('haldfjsa ', err)
  // },
  onAfter: () => {
    if (pid.value)
      runGetClaimed({ pid: pid.value, lang: lang.value })
  },
})
const splitTime = (num: string) => [num.toString().slice(0, -2) || '0', num.toString().slice(-2).padStart(2, '0')]
const claimedData = computed(() => cdata.value?.claimed?.split(',').map((i) => {
  const arr = splitTime(i)
  return `${arr[0]}:${arr[1]}`
}).join('|'))
const claimedDataArr = computed(() => {
  // const today_date = dayjs().format('YYYY-MM-DD') // 当前语言的日期
  //     .map((im: string[]) => im.map(tag => `${today_date} ${tag}`))
  //     .map(arr => arr.map(str => dayjs(str).valueOf() + local2langtime.value).map(s => dayjs(s).format('HH:mm')).map(s => formatTag(s)))
  return claimedData.value && claimedData.value.length
    ? claimedData.value.split('|').filter(i => i.length).map(m => m.split('~').map(s => formatTag(s)))
    : []
})
const claimedDataFlat = computed(() => uniq(flatten(claimedDataArr.value)))
const claimLimit = computed(() => {
  if (detailData.value) {
    const claimLimit = detailData.value.claim_Limit
    return (claimLimit ?? 0) || 0
  }
  return 0
})
// const period = computed(() => detailData.value?.period)
const displayTime = computed(() => detailData.value?.display_time)
const displayTimeStartStamp = computed(() => displayTime.value && displayTime.value.s ? (dayjs.tz(displayTime.value.s, currentDollarZone.value).valueOf()) : undefined)

const descDetail = computed(() => {
  const d = detailData.value?.detail
  const temp = d ? d[EnumLanguage[userLanguage.value]] : ''
  return temp
})
// 按钮文字，跳转配置
const buttonConfig = computed(() => detailData.value?.button)
// 活动 banner 图
const bannerImg = computed(() => {
  const temp = detailData.value?.img
  if (temp) {
    const b = temp[EnumLanguage[userLanguage.value]]
    if (b)
      return b[0] === '/' ? b : `/${b}`
  }
})

const buttonText = computed(() => {
  const obj = detailData.value?.buttonText
  if (obj && obj[getLangForBackend()])
    return obj[getLangForBackend()]

  return ''
})
// 是否富文本
const isRichText = computed(() => detailData.value ? detailData.value.rule_type?.toString() === '2' : false)

function formatTag(tag: string) {
  return tag.split(':').map(i => +i < 10 ? `0${+i}` : i).join(':')
}

function judgeTimeInTag(tagArr: string[]) {
  setLocalHM()
  const startTag = tagArr[0]

  return localHM.value < startTag // startTag <= localHM.value && endTag > localHM.value
}

const notifyThrottle = throttle(() => {
  if (isFlutterApp()) {
    sendMsgToFlutterApp(SendFlutterAppMessage.PROMO_NORMAL_TIPS, {
      icon: 'chess-gameshow',
      iconColor: '--tg-text-alltheme-green',
      title: t('温馨提示'),
      message: t('活动未开始请稍后再试'),
    })
  }
  else {
    Message.error(
      h('div', { class: 'flex items-center gap-[4px]' }, [
        h(IconChessGameshow, { class: 'text-white' }),
        h('span', { class: 'whitespace-nowrap' }, t('活动未开始请稍后再试')),
      ]),
    )
  }
}, 5 * 1000, { leading: true, trailing: false })

const notifyLangThrottle = throttle(langNotify, 5 * 1000, { leading: true, trailing: false })

function littleBusterd(tag?: string[]) {
  if (!isLogin.value) {
    // openRegisterDialog()
    return
  }
  if (cdata.value && (cdata.value.ip || cdata.value.bl)) {
    if (cdata.value.ip) {
      Message.error(t('本活动同一个ip只能参与一次'))
    }
    if (cdata.value.bl) {
      Message.error(t('不符合活动参与资格'))
    }
    goPromo()
    if (pid.value)
      runGetClaimed({ pid: pid.value, lang: lang.value })
    return
  }
  const timestamp = zoneDayJs().valueOf() + window.serverTimeDiff
  // localHM.value = dayjs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
  setLocalHM()
  const nextScope = timeScopes.value.find((item: any) => localHM.value < item[0]) ?? timeScopes.value[0]
  if (tag && localHM.value >= tag[1]) {
    // 已过期
    if (isReceive(tag))
      return '' // openDialogDollarWaveBonus({ pid: pid.value, firstBonusData: { }, bonusData: { state: 1 }, nextScope: nextScope?.join('-'), isBRL: false, isCrystal: true, currencyName: detailData.value?.conf.currency })

    else return getDetail()
  }
  if (tag && tag.length) {
    const b = judgeTimeInTag(tag)
    if (b) {
      getDetail()
      notifyThrottle()
      return
    }
  }
  const outRange = (localHM.value >= '00:00' && localHM.value < timeScopes.value[0][0]) || localHM.value >= '23:59'
  if (outRange) {
    getDetail()
    notifyThrottle()
    return
  }
  if (displayTime.value && displayTimeStartStamp.value && timestamp < displayTimeStartStamp.value) {
    getDetail()
    notifyThrottle()
    return
  }
  // initJudgeBonus({ p: pid.value, notify: true, showAmount: false })
  if (pid.value) {
    const code = globalCurrencyCode.value
    runGetBonus(pid.value, code, 0).then((res) => {
      if (res.tongue && +res.state === 4) {
        notifyLangThrottle(t(`lang_${res.tongue}`))
        return
      }
      if (res && res.amount && +res.amount > 0) {
        // openDialogDollarRain({ pid: pid.value, isBRL: false, isCrystal: false })
      }
      else {
        const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
        if (nextScope)
          nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1]
        appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
        // openDialogDollarWaveBonus({ pid: pid.value, firstBonusData: { ...res, currencyCode: code }, bonusData: { ...res, currencyCode: code }, nextScope: nextScope?.join('-'), isBRL: false, currencyName: detailData.value?.conf.currency })
      }
    }).catch(() => {
      const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
      if (nextScope)
        nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1]
      appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
      // openDialogDollarWaveBonus({ pid: pid.value, firstBonusData: { }, bonusData: { state: 1 }, nextScope: nextScope?.join('-'), isBRL: false, currencyName: detailData.value?.conf.currency })
    })
  }
  // openDialogDollarRain({ pid: pid.value, isBRL: false })
}

function exchangeSuccess() {
  getDetail()
  currencyStore.initCurrencyList()
  // promoStore.setLastBonusData(undefined)
  if (pid.value)
    runGetClaimed({ pid: pid.value, lang: lang.value })
}

function transferScope(arr: Array<number[]>) {
  arr.sort((a, b) => a[0] - b[0])
  const result = []
  for (let i = 0; i < arr.length; i++) {
    const sun = arr[i]
    let temp
    const start = sun[0]
    const end = sun[1]
    if (start < 24 && end >= 24)
      temp = [`${sun[0]}`, '23:59'].map(s => formatTag(s))
    else
      temp = [`${sun[0]}`, `${sun[1]}`].map(s => formatTag(s))
    result.push(temp)
  }
  return result
}

function pageClicked() {
  // localHM.value = dayjs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
  setLocalHM()
}

function langNotify(m: string) {
  /* openNotify({
    type: 'info',
    message: t('promo_lang_receive', [m]),
  }) */
}

function refreshClaimed(p: FlutterAppMsgType) {
  if (p.type === ReceiveFlutterAppMessage.PROMO_RED_REFRESH_CLAIMED && pid.value)
    runGetClaimed({ pid: pid.value, lang: lang.value })
}

function refreshClaimedSec() {
  if (pid.value)
    runGetClaimed({ pid: pid.value, lang: lang.value })
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}
function isReceive(i: string[]) {
  return claimedDataFlat.value?.includes(i[0])
}
function isExpire(i: string[]) {
  return localHM.value > i[1]
}
function getBgImage(i: string[]) {
  if (isReceive(i)) {
    return currentConfig.value?.bgImages[1]
  }
  if (isExpire(i)) {
    return currentConfig.value?.bgImages[2]
  }
  return currentConfig.value?.bgImages[0]
}

function getDetail() {
  runGetDetail(pid.value)
}

watchEffect(() => {
  const names = detailData.value?.name
  const name = names ? names[userLanguage.value.replace('-', '_') as any] : ''
  if (name)
    setTitle(name)
})
watch(pid, (val) => {
  if (val && val.length)
    getDetail()
})
onMounted(() => {
  appEventBus.on(EventBusNames.USER_CLAIMED_DOLLAR_BONUS, exchangeSuccess)
  appEventBus.on(EventBusNames.RECEIVE_FLUTTER_APP_MSG, refreshClaimed)
  appEventBus.on(EventBusNames.USER_REFRESH_RED_CLAIMED, refreshClaimedSec)
  // initJudgeBonus({ p: pid.value, notify: false, showAmount: true })
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.USER_CLAIMED_DOLLAR_BONUS, exchangeSuccess)
  appEventBus.off(EventBusNames.RECEIVE_FLUTTER_APP_MSG, refreshClaimed)
})

if (isLogin.value)
  await application.allSettled([runGetDetail(pid.value), runGetClaimed({ pid: pid.value, lang: currencyName.value })])
else
  await application.allSettled([runGetDetail(pid.value)])
</script>

<template>
  <div v-if="detailData && currentConfig">
    <div
      class="dollar-waves-active flex flex-col gap-[16px]"
      @touchstart="pageClicked"
      @mousemove="pageClicked"
      @click="pageClicked"
    >
      <AfunBaseImage v-if="bannerImg" class="set-radios" :url="bannerImg" is-network />
      <div class="p-[12px] rounded-[6px] text-[14px] bg-[#213743] text-[#b1bad3]">
        <div class="mb-[8px] text-[20px] font-[600] text-[#fff]">
          {{ t('活动说明') }}
        </div>
        <div class="text-[14px] font-[400]">
          <ul class="flex flex-col list-disc pl-[14px]">
            <li class="mb-[8px]">
              <div v-if="currentConfig.descKey" class="" style="--tg-app-currency-display:inline-block;">
                <i18n-t :keypath="currentConfig.descKey">
                  <template #num>
                    <span class="text-tg-primary-fail mx-[3px] inline font-[600]">{{ timeScopes?.length }}</span>
                  </template>
                  <template #bonus>
                    <span class="ml-[3px] inline-block">
                      <AfunBaseAmount class="inline-block" :amount="Number(detailData?.single_match_limit ?? 0)" :currency-type="languageCurrencyType" />
                    </span>
                  </template>
                  <template #single>
                    <span class="ml-[3px] inline-block">
                      <AfunBaseAmount class="inline-block" :amount="+claimLimit" :currency-type="languageCurrencyType" />
                    </span>
                  </template>
                </i18n-t>
              </div>
            </li>
            <li>
              <span>{{ t(currentConfig.timezoneKey) }}{{ timezoneLabel }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="timeScopes && timeScopes.length" class="p-[12px] rounded-[6px] text-[14px] bg-[#213743] text-[#b1bad3]">
        <div class="mb-[8px] text-[20px] font-[600] text-[#fff]">
          {{ currentConfig.titleKey }}
        </div>
        <section v-if="detailData.drop === 1" class="grid grid-cols-3 gap-y-[8px]">
          <template v-for="(i, idx) in timeScopes" :key="`${i}-${idx}`">
            <div
              v-bg-image="getBgImage(i)"
              class="bg-time relative flex items-center justify-between flex-col  h-[130px] w-[110px] cursor-pointer text-center font-[600] "
              :class="[
                (isExpire(i) || isReceive(i)) ? 'text-[#FDF9E4] ' : 'text-[#FFDD64]',
              //localHM <= i[0] ? 'tag-future has-b' : '',
              ]"
              @click="() => littleBusterd(i)"
            >
              <div class=" mt-[14px] center w-[80px] min-h-[40px] text-[12px] leading-[12px]">
                <span>
                  <template v-if="isReceive(i)">
                    {{ t('已领取') }}
                  </template>
                  <template v-else-if="isExpire(i)">
                    {{ t('已过期') }}
                  </template>
                  <template v-else>
                    {{ t('发放时间') }}
                  </template>
                </span>
              </div>
              <div class="mb-[24px] text-[18px] leading-[25px]">
                {{ i[0] }}
              </div>
            </div>
          </template>
        </section>
        <section v-if="detailData.drop === 2" class="grid grid-cols-3 gap-y-[8px] gap-x-[38px]">
          <template v-for="(i, idx) in timeScopes" :key="`${i}-${idx}`">
            <div
              class="relative h-[77px] w-[84px] cursor-pointer text-center font-[600] "
              :class="[
                (isExpire(i) || isReceive(i)) ? 'text-[#fff] ' : 'text-[#b1bad3]',
                //localHM <= i[0] ? 'tag-future has-b' : '',
              ]"
              @click="() => littleBusterd(i)"
            >
              <AfunBaseImage :url="`/m/afun-h5/png/${getBgImage(i)}.png`" />
              <div class="whitespace-nowrap my-[4px] text-[12px] leading-[14px]">
                <template v-if="isReceive(i)">
                  {{ t('已领取') }}
                </template>
                <template v-else-if="isExpire(i)">
                  {{ t('已过期') }}
                </template>
                <template v-else>
                  {{ t('发放时间') }}
                </template>
              </div>
              <div class="text-[12px] leading-[14px]">
                {{ i[0] }}
              </div>
            </div>
          </template>
        </section>
        <section v-if="detailData.drop === 3" class="grid grid-cols-3 gap-[8px]">
          <template v-for="(i, idx) in timeScopes" :key="`${i}-${idx}`">
            <div
              class="bg-[#F6F7F8] border-[#EBEBEB] py-[8px] rounded-[7px] relative h-[118px] w-[104px] cursor-pointer text-center text-[#fff] font-[600] "
              :class="[
                (isExpire(i) || isReceive(i)) ? 'opacity-50-text' : '',
              //localHM <= i[0] ? 'tag-future has-b' : '',
              ]"
              @click="() => littleBusterd(i)"
            >
              <div class="whitespace-nowrap  text-[12px] leading-[12px] txt">
                <template v-if="isReceive(i)">
                  {{ t('已领取') }}
                </template>
                <template v-else-if="isExpire(i)">
                  {{ t('已过期') }}
                </template>
                <template v-else>
                  {{ t('发放时间') }}
                </template>
              </div>
              <AfunBaseImage class="mx-auto my-[4px] w-[70px] h-[70px]" :url="`/m/afun-h5/png/${getBgImage(i)}.png`" />
              <div class=" text-[12px] leading-[12px] txt">
                {{ i[0] }}
              </div>
            </div>
          </template>
        </section>
      </div>

      <div v-if="descDetail && descDetail.length" class="p-[12px] rounded-[6px] text-[14px] bg-[#213743] text-[#b1bad3]">
        <div class="mb-[8px] text-[20px] font-[600] text-[#fff]">
          {{ t('活动规则') }}
        </div>
        <!-- <BaseRichArea :content="descDetail" /> -->
        <AfunBaseRichArea v-if="isRichText" :content="descDetail" />
        <AppPromotionBaseRuleText v-else :content="descDetail" :is-login="isLogin" :currency-type="languageCurrencyType" :amount="detailData.multiple.toString()" />
      </div>
      <div class="p-[12px] rounded-[6px] text-[14px] bg-[#213743] text-[#b1bad3]">
        <div class="mb-[16px] text-[20px] font-[600] text-[#fff]">
          {{ t('常见问题') }}
        </div>
        <section v-if="currentConfig.qaList" class="flex flex-col gap-[16px]">
          <div
            v-for="(item, idx) in currentConfig.qaList"
            :key="idx"
            class="pb-[10px] text-[14px] font-[600] leading-[20px]"
            :class="[idx === currentConfig.qaList.length - 1 ? '' : 'border-b-[#b1bad3] border-b-[0.5px] border-solid']"
          >
            <div class="flex items-start">
              <div class="mr-[8px] mt-[2px] h-[16px] w-[16px] rounded-[2px] bg-[#05A80F] text-center text-[10px] font-[600] leading-[16px] text-[#ffffff]">
                {{ t('Q') }}
              </div>
              <div>{{ item.q }}</div>
            </div>
            <div class="mt-[4px] flex items-start">
              <div class="mr-[8px] mt-[2px] h-[16px] w-[16px] rounded-[2px] bg-[#1475E1] text-center text-[10px] font-[600] leading-[16px] text-[#ffffff]">
                {{ t('A') }}
              </div>
              <div class="flex-1">
                {{ item.a }}
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="p-[12px] rounded-[6px] text-[14px] bg-[#213743] text-[#b1bad3]">
        <div class="mb-[8px] text-[20px] font-[600] text-[#fff]">
          {{ t('条款与条件') }}
        </div>
        <AppPromotionBaseRuleText v-if="currentConfig?.descDetailCondition" :is-login="isLogin" :content="currentConfig?.descDetailCondition" currency-type="USDT" amount="0" />
        <div v-if="buttonConfig?.button === 1" class="rounded px-[12px] py-[17px]">
          <div class="mt-[16px] flex justify-center">
            <BaseButton bg-style="secondary" size="md" class="submit-button w-[42%]" @click="jumpToUrl({ type: +buttonConfig.button_type, jumpUrl: buttonConfig.redirect })">
              {{ buttonText }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-time {
  background-position: center top;
  background-size: contain;
  background-repeat: no-repeat;
}

button.submit-button {
  --tg-base-button-min-width: 42%;
}

.set-radios {
  --tg-base-img-style-radius: 12px;
}
.opacity-50-text {
  .txt {
    opacity: 0.5;
  }
}
.dollar-waves-active {
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 14px;
}
</style>

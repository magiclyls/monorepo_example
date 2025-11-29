<script lang="ts" setup>
import { ApiMemberPromoRedBonus, ApiMemberRedDetail, ApiPromoRedClaimed, ApiPromoRedCountdown } from '@tg/apis'
import { useBoolean, useCountDown } from '@tg/hooks'
import { useAppStore, useDialogStore, usePromoStore } from '@tg/stores'
import { EventBusNames } from '@tg/types'
import { appEventBus } from '@tg/utils'
import { getLang, getLangConfig } from '@tg/vue-i18n'
import { useDocumentVisibility } from '@vueuse/core'
import dayjs from 'dayjs'
import { flatten } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '~/utils'
import AppDialogDollarRainCss from './AppDialogDollarRainCss.vue'
import AppDialogDollarWaveBonus from './AppDialogDollarWaveBonus.vue'

defineOptions({
  name: 'AppDollarRainCountdown',
})
const route = useRoute()
const { push } = useRouter()

const { t, locale } = useI18n()
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)
const { dialogBonusData, dialogRainData } = storeToRefs(useDialogStore())
const userLanguage = ref(getLang())
const visibility = useDocumentVisibility()
const promoStore = usePromoStore()
const { lastBonusData, lastBonusAccount } = storeToRefs(promoStore)
const globalCurrencyCode = ref('701')
const pid = ref()
const seconds = ref(-1)
const pendSeconds = ref(-1)

const countData = ref()
const timeScopes = ref<any>([])

const languageBack = computed(() => userLanguage.value?.replace('-', '_'))
const currentDollarZone = ref(getLangConfig()?.zone)

const localHM = ref(zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm'))
const localHour = computed(() => +localHM.value.split(':')[0])
const timeDelay = ref(-1)

const { bool: bonusApiStatus, setBool: setBonusApiStatus } = useBoolean(false)
const { bool: isRealCounting, setBool: setIsRealCounting } = useBoolean(false)
// const { bool: isDelayCounting, setBool: setIsDelayCounting } = useBoolean(false)
function zoneDayJs(t?: any) {
  return dayjs(t).tz(currentDollarZone.value)
}

function setLocalHM() {
  localHM.value = zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
}

const isInRange = computed(() => {
  return timeScopes.value.find((arr: string[]) => localHM.value >= arr[0] && localHM.value < arr[1])
})

const { start, current, pause, reset } = useCountDown({
  time: seconds.value * 1000,
  onFinish: () => {
    if (lastBonusData.value)
      promoStore.setLastBonusData(undefined)
    setLocalHM()

    nextTick(() => {
      setIsRealCounting(false)
      finishCount()
    })
  },
  onChange: () => {
    promoStore.setRedCountCurrent(current.value)
    setLocalHM()
    if (!isRealCounting.value)
      setIsRealCounting(true)
    if (!bonusApiStatus.value)
      setBonusApiStatus(true)
  },
})
pause()
// 空转倒计时
const { start: pendStart, current: pendCurrent, pause: pendPause, reset: pendReset } = useCountDown({
  time: pendSeconds.value * 1000,
  onFinish: () => {
    setLocalHM()
    start()
    setIsRealCounting(true)
  },
  onChange: () => {
    setLocalHM()
  },
})
pendPause()

const { data: cdata, runAsync: runGetClaimed, loading: claimedLoading } = useRequest(ApiPromoRedClaimed, {
  ready: isLogin,
  manual: true,
})
const splitTime = (num: string) => [num.toString().slice(0, -2) || '0', num.toString().slice(-2).padStart(2, '0')]

const ctongue = computed(() => cdata.value?.tongue?.replace('_', '-'))
const claimedData = computed(() => cdata.value?.claimed?.split(',').map((i) => {
  const arr = splitTime(i)
  return `${arr[0]}:${arr[1]}`
}).join('|'))
const claimedDataArr = computed(() => {
  return claimedData.value && claimedData.value.length
    ? claimedData.value.split('|').filter(i => i.length).map(m => m.split('~').map(s => formatTag(s)))
    : []
})
const claimedDataFlat = computed(() => flatten(claimedDataArr.value))
const claimedDataHourFlat = computed(() => claimedDataFlat.value.map((i: string) => +i.split(':')[0]))

const { data: bonusData, runAsync: runGetBonus, loading: bonusLoading } = useRequest(ApiMemberPromoRedBonus, {
  ready: isLogin,
  manual: true,
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
})

const currencyName = ref('')

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

const { data: detailData, runAsync: runGetDetail } = useRequest(ApiMemberRedDetail, {
  manual: true,
  onSuccess: (res, params) => {
    const displayTime = res.display_time
    currentDollarZone.value = res.timezone
    currencyName.value = languageBack.value
    globalCurrencyCode.value = res.conf.currency ?? '701'
    const displayTimeStartStamp = displayTime && displayTime.s ? (dayjs.tz(displayTime.s, currentDollarZone.value).valueOf()) : undefined
    localStorage.setItem(`promo_red_start_${params[0]}_${currencyName.value}`, displayTimeStartStamp?.toString() || '')
    const d_server_time = zoneDayJs(dayjs().valueOf() + window.serverTimeDiff)
    setLocalHM()
    if (res) {
      const cfg = res.count
      if (cfg)
        countData.value.count = cfg[globalCurrencyCode.value]
      const cycle = res.cycle
      if (cycle && cycle.length) {
        timeDelay.value = window.serverTimeDiff
        timeScopes.value = transferScope(cycle) // .sort((a, b) => a - b) // [['1:00', '3:00'], ['3:00', '7:00'], ['7:00', '12:00'], ['12:00', '14:00'], ['14:00', '17:00'], ['17:00', '20:00'], ['20:00', '23:59']].map(m => m.map(s => formatTag(s))) // uniq(flatten(res.config.map(c => c.scope))).sort(sortTimeTag).map((i: string) => i.split('~').map(m => formatTag(m)))
        const _nextScope = timeScopes.value.filter((item: any) => Number(localHM.value.replace(':', '')) < Number(item[0].replace(':', '')))[0]
        const nextScopeStart: string = _nextScope ? _nextScope[0] : timeScopes.value[0][0]
        const nextScopeStartHour = nextScopeStart.split(':')[0]
        const nextScopeStartMinute = nextScopeStart.split(':')[1]
        const hour = d_server_time.hour()
        const minute = d_server_time.minute()
        const second = d_server_time.second()
        const nextStart = Number(nextScopeStartHour) * 60 * 60 + Number(nextScopeStartMinute) * 60
        const currentTime = hour * 60 * 60 + minute * 60 + second
        const day1Seconds = 24 * 60 * 60
        const configCount = (+countData.value.count) * 60
        // 当前距离 红包倒计时 开始的倒计时
        let p = nextStart - currentTime - configCount
        if (currentTime < nextStart) {
          seconds.value = Math.min((nextStart - currentTime), configCount)
          pendSeconds.value = p >= 0 ? p : 0
        }
        else {
          // 跨天了
          p = p + day1Seconds
          seconds.value = Math.min((nextStart - currentTime + day1Seconds), configCount)
          pendSeconds.value = p >= 0 ? p : 0
        }
        // delayReset(timeDelay.value >= 0 ? timeDelay.value + 3000 : -1)
        reset(seconds.value * 1000)
        pendReset(pendSeconds.value * 1000)

        if (+pendSeconds.value < 1) {
          pendPause()
          start()
          setIsRealCounting(true)
        }
        else {
          pause()
          pendStart()
        }
      }
    }
  },
})

const hasTongue = computed(() => detailData.value && detailData.value.lang && detailData.value.lang.length && detailData.value.lang.map(r => r.replace('_', '-').includes(userLanguage.value)))

const { runAsync: runGetCount } = useRequest(ApiPromoRedCountdown, {
  manual: false,
  onSuccess: (res) => {
    if (res && res.id) {
      countData.value = {}
      pid.value = res.id
      // countData.value.count = res.ct ? res.ct[userLanguage.value.replace('-', '_')] : 0
      runGetDetail(pid.value)
      if (isLogin.value)
        runGetClaimed({ pid: pid.value, lang: currencyName.value })
    }
  },
})

const isHome = computed(() => {
  return route.name === 'casino-home' || route.path === '/'
})
const canRaining = computed(() => {
  let canReceive = true
  if (lastBonusAccount.value) {
    const received = lastBonusData.value && lastBonusData.value.state === 2
    if (isInRange.value && isInRange.value[0] === lastBonusAccount.value?.scope && lastBonusAccount.value?.uid === userInfo.value?.uid && !received)
      canReceive = false
  }
  const unReceilve = Boolean(isInRange.value && !claimedDataFlat.value.includes(isInRange.value[0]) && canReceive)
  return unReceilve
})
const showCount = computed(() => {
  // && isLogin.value
  const _b = isHome.value
    && (canRaining.value || isRealCounting.value)
  return _b
})

const showTime = computed(() => {
  const m = current.value.minutes < 10 ? `0${current.value.minutes}` : current.value.minutes
  const s = current.value.seconds < 10 ? `0${current.value.seconds}` : current.value.seconds
  return `${m}:${s}`
})

const isBRL = computed(() => {
  if (detailData.value) {
    const drop = detailData.value?.drop
    return !!(drop && +drop === 2)
  }
  return false
})

const isCrystal = computed(() => {
  if (detailData.value) {
    const drop = detailData.value?.drop
    return !!(drop && +drop === 3)
  }
  return false
})

// 有皮肤的情况下基础宽度

const el = ref(null)

function formatTag(tag: string) {
  return tag.split(':').map(i => +i < 10 ? `0${+i}` : i).join(':')
}

function openRainIfcan(need = false) {
  if (canRaining.value) {
    dialogRainData.value = { pid: pid.value, isBRL: isBRL.value, isCrystal: isCrystal.value }
  }
}

function finishCount() {
  seconds.value = -1
  pendSeconds.value = -1
  runGetCount()
}

function errorDeal() {
  // 背景红包雨
  /* if (isBRL.value)
    openRainIfcan()
   if (isCrystal.value)
    openRainIfcan() */
  setLocalHM()
  const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
  if (nextScope)
    nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1]
  appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
  dialogBonusData.value = {
    pid: pid.value,
    firstBonusData: { },
    bonusData: { state: 1 },
    nextScope: nextScope?.join('-'),
    isBRL: isBRL.value,
    isCrystal: isCrystal.value,
    showCount,
    closeCb: () => {
      if (isBRL.value || isCrystal.value) {
        dialogRainData.value = undefined
      }
    },
    currencyName: detailData.value?.conf.currency,
  }
}

function dollarClick() {
  setLocalHM()
  if (!isLogin.value) {
    push('/login')
    return
  }
  if (cdata.value && (cdata.value.ip || cdata.value.bl)) {
    errorDeal()
    if (pid.value)
      runGetClaimed({ pid: pid.value, lang: currencyName.value })
    return
  }
  setLocalHM()
  if (pid.value) {
    const code = globalCurrencyCode.value
    runGetBonus(pid.value, code, 0).then((res) => {
      if (res.tongue && +res.state === 4) {
        Message.info(t('请切换至{0}领取', [t(`lang_${res.tongue}`)]))
        return
      }
      if (res && res.amount && +res.amount > 0) {
        openRainIfcan()
      }
      else {
        if (isBRL.value || isCrystal.value)
          openRainIfcan()

        const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
        if (nextScope)
          nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1]
        appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
        console.log(nextScope)
        dialogBonusData.value = {
          pid: pid.value,
          firstBonusData: { ...res, currencyCode: code },
          bonusData: { ...res, currencyCode: code },
          nextScope: nextScope?.join('-'),
          isBRL: isBRL.value,
          closeCb: () => {
            if (isBRL.value) {
              dialogRainData.value = undefined
            }
          },
          showCount,
          currencyName: detailData.value?.conf.currency,
        }
      }
    }).catch(() => {
      errorDeal()
    })
  }
}

function exchangeSuccess() {
  // bonusData.value = undefined
  // promoStore.setLastBonusData(undefined)
  if (pid.value)
    runGetClaimed({ pid: pid.value, lang: currencyName.value })
}

function getBonusCallback(data?: any) {
  // bonusData.value = data
  promoStore.setLastBonusData(data)
  promoStore.setLastBonusAccount({
    uid: userInfo.value?.uid,
    scope: isInRange.value && isInRange.value[0],
  })
}

function popRainTip() {
  if (pid.value) {
    /* if (isBRL.value || isCrystal.value)
      openRainIfcan() */
    nextTick(() => {
      dialogBonusData.value = {
        pid: pid.value,
        firstBonusData: {},
        bonusData: {},
        nextScope: '',
        isBRL: isBRL.value,
        isCrystal: isCrystal.value,
        showCount,
        closeCb: () => {
          if (isBRL.value) {
            dialogRainData.value = undefined
          }
        },
        currencyName: detailData.value?.conf.currency,
      }
    })
  }
}

function getBgImage() {
  if (isBRL.value) {
    return '/afun-h5/special/brl-count.webp'
  }
  else if (isCrystal.value) {
    return ['/crystal-claim-hand', userLanguage.value === 'zh-CN' ? '/afun-h5/special/crystal-count-cn.webp' : '/afun-h5/special/crystal-count.webp']
  }
  return '/afun-h5/special/dollar_bg.webp'
}

watch(isLogin, (val, old) => {
  if (val && !old) {
    if (pid.value)
      runGetClaimed({ pid: pid.value, lang: currencyName.value })
  }
})

watch(visibility, (val, old) => {
  if (val === 'visible')
    runGetCount()
})

watch(route, (val, old) => {
  runGetCount()
})

onMounted(() => {
  appEventBus.on(EventBusNames.USER_CLAIMED_DOLLAR_BONUS, exchangeSuccess)
  appEventBus.on(EventBusNames.USER_GETBONUS_RESULT, getBonusCallback)
})

onBeforeUnmount(() => {
  pause()
  pendPause()
  appEventBus.off(EventBusNames.USER_CLAIMED_DOLLAR_BONUS, exchangeSuccess)
  appEventBus.off(EventBusNames.USER_GETBONUS_RESULT, getBonusCallback)
})
</script>

<template>
  <section
    v-if="pid && hasTongue && showCount"
    ref="el"
    v-bg-image="getBgImage()"
    class="app-dollar-rain-countdown flex flex-col cursor-pointer items-center duration-[0.25s]  h-[75px] w-[75px]"
    :class="[
      `count-lang-${userLanguage}`,
      isBRL ? 'count-brl' : '',
      isCrystal ? 'justify-center count-crystal' : 'justify-end pb-[10px]',
    ]"
    @click.stop="dollarClick"
  >
    <div
      v-if="current.total > 0 && pendCurrent.total <= 1"
      class="box text-center text-[#FFDD64] leading-[8px]"
      :class="[isCrystal ? 'pt-[14px]' : 'pt-[51px]']" @click="popRainTip"
    >
      <div v-if="isCrystal" class="crystal-get">
        {{ t('领') }}
      </div>
      <div
        v-if="!isBRL"
        class="down text-[6px] font-[600]"
        :class="isCrystal ? 'crystal-down-text' : ''"
      >
        {{ $t('倒计时') }}
      </div>
      <div
        class="time pt-[2px] font-normal text-[9px]"
        :class="[isBRL && 'brl-time-down', isCrystal && 'crystal-countdown']"
      >
        {{ showTime }}
      </div>
    </div>
    <div
      v-else
      class="receive center flex-col cursor-pointer text-center font-[600] text-[#FFDD64] text-[12px]"
    >
      <div v-if="isCrystal" class="crystal-get" :class="userLanguage === 'zh-CN' ? 'text-[22px]' : '!text-[11px]'">
        {{ t('领') }}
      </div>
      <span :class="isCrystal ? 'crystal-get-text' : ''">{{ isBRL ? $t('领奖金') : isCrystal ? $t('领水晶') : $t('领红包') }}</span>
    </div>
  </section>
  <AppDialogDollarRainCss />
  <AppDialogDollarWaveBonus />

<!--   <img src="/webp/promotions/dollar-bg-0.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/yellow-btn.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/bonus-time-0.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/bonus-time-1.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/bonus-time-2.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/brl-bg-0.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/yellow-btn-brl.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/brl-time-0.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/brl-time-1.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/brl-time-2.webp" style="display:none;width:0;height:0;">

  <img src="/webp/promotions/dollar_bg.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/brl_bg.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/crystal-style-1.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/crystal-style-2.webp" style="display:none;width:0;height:0;">
  <img src="/webp/promotions/crystal-style-3.webp" style="display:none;width:0;height:0;"> -->
</template>

<style lang="scss" scoped>
.app-dollar-rain-countdown {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  .crystal-get {
    text-shadow: 0px 0.7px 1px rgba(0, 0, 0, 0.4);

    font-size: 22px;
    font-style: normal;
    font-weight: 600;
    background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: brightness(1.3);
    line-height: 26px;
  }
  .crystal-down-text {
    text-shadow: 0px 0.43px 0.215px rgba(0, 0, 0, 0.3);

    font-size: 7.458px;
    font-style: normal;
    font-weight: 600;
    background: linear-gradient(180deg, #fff 0%, #b4aaf4 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: brightness(1.3);
  }
  .crystal-countdown {
    text-shadow: 0px 0.645px 0.43px rgba(0, 0, 0, 0.3);

    font-size: 9.667px;
    font-style: normal;
    font-weight: 600;
    background: linear-gradient(90deg, #ffe7ba 0%, #ffc65b 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: brightness(1.3);
  }
  .crystal-get-text {
    text-shadow: 0px 0.4px 0.2px rgba(0, 0, 0, 0.3);

    font-size: 8px;
    font-style: normal;
    font-weight: 600;
    width: 40px;
    display: inline-block;
    background: linear-gradient(180deg, #fff 0%, #b4aaf4 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: brightness(1.3);
  }
  &.count-brl {
    &.count-lang-pt-BR {
      &.pc-w {
        .box {
          padding-top: 61px !important;
        }
        .receive {
          padding-top: 65px;
          padding-left: 0;
          padding-right: 0;
          font-size: 8px !important;
        }
        .crystal-get {
          font-size: 17.504px;
        }
      }
    }
    &.count-lang-en-US {
      .receive {
        font-size: 7px !important;
        padding-left: 9.5px;
        padding-right: 8px;
        padding-top: 55px;
        line-height: 9px;
      }
      &.pc-w {
        .receive {
          font-size: 9px !important;
          padding-left: 9.5px;
          padding-right: 8px;
          padding-top: 62px;
        }
      }
    }
    &.count-lang-vi-VN {
      &.pc-w {
        .receive {
          padding-top: 58px;
          padding-left: 10px;
          padding-right: 10px;
          line-height: 10px;
        }
      }
    }
    .time.brl-time-down {
      font-size: 14px !important;
      font-weight: 600 !important;
    }
  }
  &.count-crystal {
    background-position:
      bottom right,
      center;
    background-size: 32px, cover;
  }
}
.app-dollar-rain-countdown:not(.count-crystal) {
  &.count-lang-th-TH {
    .down {
      font-size: 6px !important;
    }
    .time {
      font-size: 9px !important;
    }
    .receive {
      font-size: 12px !important;
    }
  }
  &.count-lang-th-TH:not(.count-brl) {
    .receive {
      font-size: 10px !important;
    }
  }
  &.count-lang-vi-VN {
    .down {
      font-size: 6px !important;
    }
    .time {
      font-size: 9px !important;
    }
    .receive {
      font-size: 11px !important;
    }
  }
  &.count-lang-hi-IN {
    .down {
      font-size: 6px !important;
    }
    .time {
      font-size: 9px !important;
    }
    .receive {
      font-size: 8px !important;
      padding-left: 12px;
      padding-right: 12px;
      line-height: 9px;
    }
    &.pc-w {
      .receive {
        padding-left: 16px;
        padding-right: 16px;
      }
    }
  }
  &.count-lang-en-US {
    .down {
      font-size: 6px !important;
    }
    .time {
      font-size: 9px !important;
    }
    .receive {
      font-size: 9px !important;
      padding-left: 8px;
      padding-right: 8px;
      line-height: 9px;
    }
  }
  &.count-lang-pt-BR {
    &.mobile-w {
      .box {
        padding-top: 49px;
      }
      .down {
        font-size: 5px !important;
      }
      .time {
        padding-top: 0.5px;
      }
      .receive {
        padding-top: 49px;
      }
    }
    &.pc-w {
      .box {
        padding-top: 57px;
      }
      .time {
        padding-top: 1px;
      }
    }
    .down {
      padding-left: 18px;
      padding-right: 18px;
      line-height: 5.5px;
    }
    .time {
      font-size: 9px !important;
    }
    .receive {
      font-size: 6px !important;
      padding-left: 18px;
      padding-right: 18px;
      line-height: 6px;
    }
  }
}
</style>

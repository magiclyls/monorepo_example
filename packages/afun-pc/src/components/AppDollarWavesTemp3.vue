<script lang="ts" setup>
import type { DollarWavesDataDetail } from '@tg/types'

import type { FlutterAppMsgType } from '~/types'
import { ApiMemberPromoRedBonus, ApiPromoRedClaimed } from '@tg/apis'

interface Props {
  data: DollarWavesDataDetail
  getDetail: () => void
}
defineOptions({
  name: 'AppDollarWavesTemp3',
})
const props = defineProps<Props>()

const router = useLocalRouter()
const { t } = useI18n()
const { jumpToUrl } = useRedirect()
const appStore = useAppStore()
const { isLogin, currentGlobalCurrency } = storeToRefs(appStore)
const { openNotify } = useNotify()
const route = useRoute()
const { openRegisterDialog } = useRegisterDialog()
// const { isMobile } = storeToRefs(useWindowStore())
const { openDialogDollarWaveBonus } = useDialogDollarWaveBonus()
const { openDialogDollarRain } = useDialogDollarRain()
const { userLanguage } = storeToRefs(useLanguageStore())

/** 当前语言对应的币种 */
const detailData = computed(() => props.data)

// for backend
const lang = computed(() => userLanguage.value?.replace('-', '_'))

const currentDollarZone = computed(() => detailData.value?.timezone)
const globalCurrencyCode = computed(() => detailData.value.conf.currency ?? '701')
const languageCurrencyType = computed(() => getCurrencyConfigByCode(globalCurrencyCode.value).name)

const localHM = ref(zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm'))

function zoneDayJs(t?: any) {
  return dayjs(t).tz(currentDollarZone.value)
}
function parseZone(t: any) {
  return dayjs.tz(t, currentDollarZone.value)
}

function setLocalHM() {
  localHM.value = zoneDayJs(dayjs().valueOf() + window.serverTimeDiff).format('HH:mm')
}
const pid = computed(() => `${route.query.promoid ?? ''}`)
// const globalCurrencyCode = computed(() => currencyConfig[currentGlobalCurrency.value]?.cur ?? '701')

// const activeCurrencyCode = computed(() => detailData.value && detailData.value.currency ? detailData.value.currency : globalCurrencyCode.value)
const descDetailCondition = computed(() => [
  t('diamond_desc_0'),
  t('dollar_desc_1'),
  t('diamond_desc_2'),
  t('dollar_desc_3'),
  t('dollar_desc_4'),
  t('dollar_desc_5', { n: detailData.value.multiple }),
].join('\n'))

const qaList = computed(() => [
  { q: t('diamond_qa_q_0'), a: t('diamond_qa_a_0') },
  { q: t('diamond_qa_q_1'), a: t('diamond_qa_a_1') },
  { q: t('diamond_qa_q_2'), a: t('diamond_qa_a_2') },
  { q: t('diamond_qa_q_3'), a: t('diamond_qa_a_3') },
  { q: t('diamond_qa_q_4'), a: t('diamond_qa_a_4') },
  { q: t('diamond_qa_q_5'), a: t('diamond_qa_a_5', { n: detailData.value.multiple }) },
])
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

  onAfter: () => {
    if (pid.value)
      runGetClaimed({ pid: pid.value, lang: lang.value })
  },
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

const claimLimit = computed(() => {
  if (detailData.value) {
    const claimLimit = detailData.value.claim_Limit
    return (claimLimit ?? 0) || 0
  }
  return 0
})

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
  if (obj && obj[getCurrentLanguageForBackend()])
    return obj[getCurrentLanguageForBackend()]

  return ''
})
// 是否富文本
const isRichText = computed(() => detailData.value ? detailData.value.rule_type?.toString() === '2' : false)

function formatTag(tag: string) {
  return tag.split(':').map(i => +i < 10 ? `0${+i}` : i).join(':')
}

// tag [0:00,0:59] [23:30,00:29]
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
      title: t('warm_tip'),
      message: t('activity_not_start'),
    })
  }
  else {
    openNotify({
      icon: 'chess-gameshow',
      iconColor: '--tg-text-alltheme-green',
      title: t('warm_tip'),
      message: t('activity_not_start'),
    })
  }
}, 5 * 1000, { leading: true, trailing: false })

const notifyLangThrottle = throttle(langNotify, 5 * 1000, { leading: true, trailing: false })

function littleBusterd(tag?: string[]) {
  if (!isLogin.value) {
    openRegisterDialog()
    return
  }
  if (cdata.value && (cdata.value.ip || cdata.value.bl)) {
    if (cdata.value.ip) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('same_ip_once'),
      })
    }
    if (cdata.value.bl) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('activity_blacked'),
      })
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
      return openDialogDollarWaveBonus({ pid: pid.value, firstBonusData: { }, bonusData: { state: 1 }, nextScope: nextScope?.join('-'), isBRL: false, isCrystal: true, currencyName: detailData.value?.conf.currency })

    else return props.getDetail()
  }
  if (tag && tag.length) {
    const b = judgeTimeInTag(tag)
    if (b) {
      props.getDetail()
      return notifyThrottle()
    }
  }
  const outRange = (localHM.value >= '00:00' && localHM.value < timeScopes.value[0][0]) || localHM.value >= '23:59'
  if (outRange) {
    props.getDetail()
    return notifyThrottle()
  }

  if (displayTime.value && timestamp < displayTimeStartStamp.value) {
    props.getDetail()
    return notifyThrottle()
  }
  if (pid.value) {
    const code = globalCurrencyCode.value
    runGetBonus(pid.value, code, 0).then((res) => {
      if (res.tongue && +res.state === 4) {
        notifyLangThrottle(t(`lang_${res.tongue}`))
        return
      }
      if (res && res.amount && +res.amount > 0) {
        openDialogDollarRain({ pid: pid.value, isBRL: false, isCrystal: true })
      }
      else {
        const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
        if (nextScope)
          nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1]
        appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
        openDialogDollarWaveBonus({ pid: pid.value, firstBonusData: { ...res, currencyCode: code }, bonusData: { ...res, currencyCode: code }, nextScope: nextScope?.join('-'), isBRL: false, isCrystal: true, currencyName: detailData.value?.conf.currency })
      }
    }).catch(() => {
      const nextScope = timeScopes.value.filter((item: any) => localHM.value < item[0])[0] ?? timeScopes.value[0]
      if (nextScope)
        nextScope[1] = nextScope[1] === '23:59' ? '23:59' : nextScope[1]
      appEventBus.emit(EventBusNames.USER_GETBONUS_RESULT, bonusData.value)
      openDialogDollarWaveBonus({ pid: pid.value, firstBonusData: { }, bonusData: { state: 1 }, nextScope: nextScope?.join('-'), isBRL: false, isCrystal: true, currencyName: detailData.value?.conf.currency })
    })
  }
  // openDialogDollarRain({ pid: pid.value, isBRL: false })
}

function exchangeSuccess() {
  props.getDetail()
  appStore.getBalanceData()
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
    /* const startHour = sun[0]
    const endHour = startHour + Math.floor(sun[1] / 60)
    const endMinute = sun[1] % 60 */
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
  openNotify({
    type: 'info',
    message: t('promo_lang_receive', [m]),
  })
}

function initJudgeBonus({ p, notify, showAmount }: { p?: string, notify?: boolean, showAmount?: boolean }) {
  const _p = p ?? pid.value
  if (cdata.value && (cdata.value.ip || cdata.value.bl)) {
    if (_p)
      runGetClaimed({ pid: _p, lang: lang.value })
    return
  }
  if (_p) {
    runGetBonus(_p, globalCurrencyCode.value, 0).then((res) => { // , globalCurrencyCode.value
      if (res && +res.state === 4) {
        if (notify) {
          // openNotify({
          //   type: 'info',
          //   message: t('promo_lang_receive', [t(`lang_${res.tongue}`)]),
          // })
          notifyLangThrottle(t(`lang_${res.tongue}`))
        }
        return
      }
      if (route.path.includes('promotions/promotion/dollar-waves')) {
        if (showAmount) {
          if (res && res.amount && +res.amount > 0)
            openDialogDollarRain({ pid: pid.value, isBRL: false, isCrystal: true })
        }
        else {
          if (res)
            openDialogDollarRain({ pid: pid.value, isBRL: false, isCrystal: true })
        }
      }
    })
  }
}

// 时间段是否已领取
function isClaimedTag(tagArr: string[]) {
  const data = claimedDataFlat.value
  const temp = data && data.length ? data?.includes(tagArr[0]) || data?.includes(tagArr[1]) || data?.filter((c: any) => c >= tagArr[0] && c < tagArr[1]).length : false
  return ctongue.value === lang.value ? temp : false
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
    router.replace('/promotion')
}
function isReceive(i: string[]) {
  return claimedDataFlat.value?.includes(i[0])
}
function isExpire(i: string[]) {
  return localHM.value > i[1]
}
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

watch(pid, (val) => {
  if (val && val.length)
    props.getDetail()
})

if (isLogin.value && route.query.promoid)
  runGetClaimed({ pid: route.query.promoid as string, lang: lang.value })
</script>

<template>
  <div class="dollar-waves text-tg-secondary-light m-auto mb-[32px] max-w-[650px] pb-[16px] font-medium @md:mt-[32px]" :class="[`lang-${lang}`]" @touchstart="pageClicked" @mousemove="pageClicked" @click="pageClicked">
    <div class="mb-[16px] aspect-[650/283] flex items-center justify-center">
      <BaseImage v-if="bannerImg" class="aspect-[650/283]" :url="bannerImg" is-network />
    </div>

    <div class="theme-bg activity-desc bg-tg-secondary-dark my-[16px] rounded px-[12px] py-[17px]">
      <div class="text-tg-text-white mb-[15px] text-[20px] font-semibold leading-[28px]">
        {{ t('act_desc_label') }}
      </div>
      <!-- <AppPromotionBaseRuleText :content="ruleDesc" currency-type="USDT" amount="0" /> -->
      <div class="text-tg-text-lightgrey w-full text-[14px] font-medium leading-[1.5]">
        <ul class="w-full flex flex-col list-disc pl-[16px]">
          <li class="mb-[8px]">
            <div class="" style="--tg-app-currency-display:inline-block;">
              <i18n-t keypath="diamond_wave_desc">
                <template #num>
                  <span class="text-tg-primary-fail mx-[3px] inline font-semibold">{{ timeScopes?.length }}</span>
                </template>
                <template #bonus>
                  <span class="ml-[3px] inline-block">
                    <AppAmount class="inline-block" :amount="Number(detailData?.single_match_limit ?? 0)" :currency-type="languageCurrencyType" />
                  </span>
                </template>
                <template #single>
                  <span class="ml-[3px] inline-block">
                    <AppAmount class="inline-block" :amount="+claimLimit" :currency-type="languageCurrencyType" />
                  </span>
                </template>
              </i18n-t>
            </div>
          </li>
          <li>
            <span>{{ t('diamond_time_zone_label', { timezone: t(TIMEZONE_LABEL_KEY[currentDollarZone]) }) }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="timeScopes && timeScopes.length" class="theme-bg bg-tg-secondary-dark bonus-time my-[16px] rounded px-[12px] py-[17px]">
      <div class="text-tg-text-white pb-[6px] text-[20px] font-semibold leading-[28px]">
        {{ t('diamond_time') }}
      </div>
      <section class="all-box gap-[16px] md:gap-[16px]">
        <div v-for="(i, idx) in timeScopes" :key="i + idx">
          <div
            class="b-time-item relative mx-auto h-[98px] max-w-[130px] cursor-pointer py-[8px] text-center font-semibold md:h-[122px] md:py-[16px]"
            :class="{
              expire: isReceive(i) || isExpire(i),
            }"
            @click="() => littleBusterd(i)"
          >
            <div class="whitespace-nowrap text-[12px] leading-[12px]">
              <template v-if="isReceive(i)">
                {{ t('received') }}
              </template>
              <template v-else-if="isExpire(i)">
                {{ t('expired') }}
              </template>
              <template v-else>
                {{ t('send_time_label') }}
              </template>
            </div>
            <div class="diamond mx-auto my-[4px] md:my-[8px]" />
            <div class="text-[14px] leading-[14px]">
              {{ i[0] }}
            </div>
            <!-- <div
                class="lucky-hand ani-scaleAndRotate absolute h-[15px] w-[11.4px] cursor-pointer overflow-visible bg-cover bg-center bg-no-repeat"
              /> -->
          </div>
        </div>
      </section>
    </div>

    <div class="bg-tg-secondary-dark theme-bg rounded px-[12px] py-[17px]">
      <div v-if="descDetail && descDetail.length" class="text-tg-text-white mb-[15px] text-xl font-semibold">
        {{ t('event_rules_description') }}
      </div>
      <!-- <BaseRichArea :content="descDetail" /> -->
      <template v-if="descDetail && descDetail.length">
        <BaseRichArea v-if="isRichText" :content="descDetail" />
        <AppPromotionBaseRuleText v-else :content="descDetail" :currency-type="languageCurrencyType" :amount="detailData.multiple.toString()" />
      </template>
      <!-- <div v-if="buttonConfig?.button === 1" class="mt-[16px] flex justify-center">
        <BaseButton bg-style="primary" size="md" class="submit-button w-[42%]" @click="jumpToUrl({ type: +buttonConfig.button_type, jumpUrl: buttonConfig.redirect })">
          {{ buttonConfig?.text[EnumLanguage[lang]] }}
        </BaseButton>
      </div> -->
    </div>
    <div class="bg-tg-secondary-dark theme-bg my-[16px] rounded px-[12px] py-[17px]">
      <div class="text-tg-text-white mb-[15px] text-xl font-semibold">
        {{ t('normal_ques') }}
      </div>
      <section class="qa-list flex flex-col">
        <div
          v-for="(item, idx) in qaList"
          :key="idx"
          class="text-tg-secondary-light q-a-item pb-[10px] text-[14px] font-medium leading-[20px]"
          :class="[idx === qaList.length - 1 ? '' : 'border-b-tg-border-color-grey-light border-b-[0.5px] border-solid']"
        >
          <div class="question flex items-start">
            <div class="qa-tag mr-[8px] mt-[2px] h-[16px] w-[16px] rounded-sm bg-[#05A80F] text-center text-[10px] font-medium leading-[16px] text-[#ffffff]">
              {{ t('q_label') }}
            </div>
            <div>{{ item.q }}</div>
          </div>
          <div class="answer mt-[4px] flex items-start">
            <div class="qa-tag mr-[8px] mt-[2px] h-[16px] w-[16px] rounded-sm bg-[#1475E1] text-center text-[10px] font-medium leading-[16px] text-[#ffffff]">
              {{ t('a_label') }}
            </div>
            <div class="flex-1">
              {{ item.a }}
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="mb-[15px] text-xl font-semibold text-white">
      {{ t('terms_conditions') }}
    </div>
    <AppPromotionBaseRuleText :content="descDetailCondition" currency-type="USDT" amount="0" />
    <div v-if="buttonConfig?.button === 1" class="rounded px-[12px] py-[17px]">
      <div class="mt-[16px] flex justify-center">
        <BaseButton bg-style="primary" size="md" class="submit-button w-[42%]" @click="jumpToUrl({ type: +buttonConfig.button_type, jumpUrl: buttonConfig.redirect })">
          {{ buttonText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-text {
  @include webTheme('white') {
    color: #fff;
  }
}
.theme-bg {
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
}
.qa-list {
  > *:not(:first-child) {
    margin-top: 16px;
  }
}
.lang-th-TH {
  .qa-tag {
    width: 22px;
  }
}
.b-time-item {
  background-color: #1a2c38;
  border: 1px solid #2f4553;
  border-radius: 7px;
  color: var(--tg-text-white);
  @include webTheme('white') {
    background-color: #e3e3e3;
    border-color: #c1c1c1;
  }
  @include webTheme('green') {
    background-color: #02432d;
    border-color: #02432d;
  }
  .diamond {
    width: 50px;
    height: 50px;

    @include getBackgroundImage('/promotions/diamond');
    background-size: 100% 100%;
  }
  &.expire {
    color: #b3bec1;
    @include webTheme('white') {
      color: #555;
    }
    @include webTheme('green') {
      color: #3cb389;
    }
    .diamond {
      @include getBackgroundImage('/promotions/diamond_received');
    }
  }
}
.bonus-time {
  .all-box {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
.red-money-limit {
  &.pt-BR {
    display: inline-block;
    > div {
      display: inline;
      :deep(.app-currency-icon) {
        display: inline-flex;
        margin-left: 3px;
      }
    }
  }
}
.dollar-red {
  &.th-TH {
    font-size: 26px;
  }
  &.vi-VN {
    font-size: 26px;
  }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
button.submit-button {
  --tg-base-button-min-width: 42%;
}
.red-pack {
  background-image: url(/png/promotions/red-hide.png);
  .app-svg-icon {
    --tg-icon-color: white;
  }
}
.lucky-hand {
  background-image: url(/png/promotions/lucky-hand.svg);
  left: calc(50% - 5.5px);
  top: calc(50% - 5px);
  display: none;
}
.overlay {
  position: absolute;
  left: 0;
  top: -100px;
  bottom: 0;
  right: 0;
  background: #{rgba($color: var(--tg-color-grey-rgb), $alpha: 0.7)};
  touch-action: none;
  z-index: var(--tg-z-index-50);
}
.time-white {
  --tg-icon-color: white;
}
.currency-img {
  --tg-app-currency-icon-size: 26px;
  --tg-app-amount-font-size: 26px;
}
.lucky-opened {
  .content {
    background-image: url('/png/promotions/red-opened.png');
  }
  .close {
    --tg-icon-color: var(--tg-primary-main);
    cursor: pointer;
    font-size: var(--tg-font-size-base);
    display: flex;
    position: absolute;
    right: 27px;
    top: 20px;
  }
}
.exchange-button {
  width: 238px;
  height: 50px;
  flex-shrink: 0;
  border-radius: 120px;
  background: linear-gradient(0deg, #fff4d5 0%, #ffd687 100%);
  box-shadow: 0px 3px 3px 0px rgba(87, 7, 7, 0.25);
}
.q-a-item {
  @include webTheme('white') {
    color: #555555;
  }
  @include webTheme('green') {
    color: #3cb389;
  }
}
</style>

<!-- <route lang="yaml">
meta:
  layout: home
</route> -->

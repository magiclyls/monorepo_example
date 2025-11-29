<script setup lang="ts">
import type { PromoMineDetail } from '@tg/types'
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoMineClaim, ApiMemberPromoMineDetail } from '@tg/apis'
import dayjs from 'dayjs'
/* 神秘矿井产品说不要了 */
import { computed, ref } from 'vue'
import AppAmountNotify from '~/components/AppAmountNotify.vue'

defineOptions({
  name: 'MysteriousMine',
})
const { t } = useI18n()
// 领取状态
const getSuccess = ref(false)
const { openNotify: openNotifyRefresh } = useNotify({
  onClose: () => {
    getSuccess.value = false
    getDetail()
  },
})
const { openNotify } = useNotify()
const { openLoginDialog } = useLoginDialog()
const currentLang = getCurrentLanguageForBackend()
const { push } = useLocalRouter()
const route = useRoute()

const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
const contentText = ref('')
const loading = ref(true)
const downTime = ref({
  hour: 0,
  minute: 0,
  second: 0,
  time: 0,
})
const endTime = ref({
  hour: 0,
  minute: 0,
  second: 0,
  time: 0,
})
const detail = ref<PromoMineDetail>()
const images = ref('')
const pid = computed(() => Number(route.query.pid))
const refreshNum = ref(1)
const isFirstLoading = ref(true)
const currentLangCurrency = computed(() => {
  return currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
})
const globalCurrencyCode = computed(() => {
  if (isLogin.value)
    return application.isVirtualCurrency(currentGlobalCurrency.value) ? currencyConfig.USDT.cur : currencyConfig[currentGlobalCurrency.value].cur

  return currentLangCurrency.value
})
// 是否富文本
const isRichText = computed(() => detail.value ? detail.value.rule_type.toString() === '2' : false)

const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone)

const countdownEndTime = computed(() => {
  const d = (detail.value?.count_down_end ? dayjs.unix(detail.value?.count_down_end) : dayjs().tz(currentDollarZone.value))
  return d
})

const countdowncountStart = computed(() => {
  const d = (detail.value?.count_down_start ? dayjs.unix(detail.value?.count_down_start) : dayjs().tz(currentDollarZone.value))
  return d
})

const NOW = computed(() => {
  const nowUnix = Number(detail.value?.cur_time)
  return nowUnix ? dayjs.unix(nowUnix) : dayjs().tz(currentDollarZone.value)
})

function setDownTime(time: number) {
  downTime.value.hour = Math.floor(time / (60 * 60))
  downTime.value.minute = Math.floor(time % (60 * 60) / 60)
  downTime.value.second = time % 60
  downTime.value.time = time
}

function setEndTime(time: number) {
  endTime.value.hour = Math.floor(time / (60 * 60))
  endTime.value.minute = Math.floor(time % (60 * 60) / 60)
  endTime.value.second = time % 60
  endTime.value.time = time
}

// 详情
const {
  loading: detailLoading,
  runAsync: runAsyncPromoMineDetail,
} = useRequest(ApiMemberPromoMineDetail, {
  onSuccess: (data) => {
    isFirstLoading.value = false
    handleGetConfig(data)
  },
})

// 领取
const {
  runAsync: runAsyncPromoMineClaim,
} = useRequest(ApiMemberPromoMineClaim, {
  onSuccess: (data) => {
    getSuccess.value = true
    openNotifyRefresh({
      type: 'success',
      title: t('receive_success'),
      message: () => {
        return h(AppAmountNotify, {
          data: [{ currencyName: currentGlobalCurrency.value, amount: data.message, hideAmountTitle: true, noFormat: true }],
        })
      },
    })
  },
  onError: () => {
    openNotifyRefresh({
      type: 'error',
      title: t('fail_bonus'),
      message: t('please_contact_service'),
    })
    loading.value = false
  },
})

function isTimeSlotPast(timeSlot: string, now = dayjs()) {
  // 拆分时间段（防御性代码处理异常格式）
  const [startStr, endStr] = (timeSlot || '').split(/\s*-\s*/)
  if (!startStr || !endStr)
    return false

  // 时间解析函数
  const parseTime = (str: string) => {
    const [h, m] = (str || '').split(':').map(Number)
    return { h: Number.isNaN(h) ? 0 : h, m: Number.isNaN(m) ? 0 : m }
  }

  // 生成基准时间
  const today = now.startOf('day')
  const start = parseTime(startStr)
  const end = parseTime(endStr)

  // 构建时间对象
  const startTime = today.add(start.h, 'hour').add(start.m, 'minute')
  let endTime = today.add(end.h, 'hour').add(end.m, 'minute')

  // 处理跨天时间段
  if (endTime.isBefore(startTime))
    endTime = endTime.add(1, 'day')

  // 核心判断逻辑
  return now.isAfter(endTime)
}

function handleGetConfig(data: PromoMineDetail) {
  detail.value = data
  contentText.value = data.detail ? JSON.parse(data.detail)[currentLang] : ''
  images.value = data.images ? JSON.parse(data.images)[currentLang] : ''
  refreshNum.value += 1
  getSuccess.value = false
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// 获取详情
function getDetail() {
  const params = {
    pid,
    currency_id: usedCurrencyCode.value,
  }
  runAsyncPromoMineDetail(params)
}

function formatMoney(value?: string) {
  // 转换为数字
  const num = Number(value)

  // 检查是否为有效数字
  if (Number.isNaN(num)) {
    console.warn('formatMoney: 输入值不是有效数字', value)
    return '0.00'
  }

  // 四舍五入并保留两位小数
  return num.toFixed(2)
}

// 领取
async function handleGetClaim() {
  if (!isLogin.value) {
    await nextTick()
    openLoginDialog()
    return
  }
  if (getSuccess.value)
    return

  if ((endTime.value.time >= 600 && detail.value?.hour_claim_state == 2) || downTime.value.time >= 600) {
    // 十分钟以上
    openNotify({
      icon: 'chess-gameshow',
      iconColor: '--tg-text-alltheme-green',
      title: t('activity_tip'),
      message: `${t('next_round_count')}${(endTime.value.hour !== undefined && endTime.value.hour < 10) ? '0' : ''}${endTime.value.hour}:${(endTime.value.minute !== undefined && endTime.value.minute < 10) ? '0' : ''}${endTime.value.minute}:${(endTime.value.second !== undefined && endTime.value.second < 10) ? '0' : ''}${endTime.value.second}`,
    })
    return
  }
  else if ((endTime.value.time > 0 && detail.value?.hour_claim_state == 2) || (downTime.value.time < 600 && downTime.value.time > 0)) {
    // 十分钟倒计时
    openNotify({
      icon: 'chess-gameshow',
      iconColor: '--tg-text-alltheme-green',
      title: t('activity_tip'),
      message: t('activity_not_start'),
    })
    return
  }

  const params = {
    pid,
    currency_id: usedCurrencyCode.value,
  }
  loading.value = true
  runAsyncPromoMineClaim(params)
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <AppLoading v-if="(detailLoading && isFirstLoading)" full-screen />
  <div v-else class="fixed-container text-tg-text-lightgrey main-box m-auto mt-[16px] max-w-[650px] pb-[25px]">
    <div class="top-img mb-[16px] flex items-center justify-center" :class="{ ' mb-[9px]': images }">
      <BaseImage v-if="images" class="top-img" :url="images" is-network />
    </div>
    <div class="countdown mb-[20px] flex flex-col items-center justify-center rounded-[4px] bg-light p-[12px]">
      <span class="text-down font-[600] text-white">{{ t('event_countdown') }}</span>
      <!--      距离活动结束时间 -->
      <AppCountdown class="my-[10px]" :set-down-time="setEndTime" :end-time="countdownEndTime" :now-time="NOW" @on-end="getDetail" />
      <!--      距离活动开始时间 -->
      <AppCountdown style="display: none" :set-down-time="setDownTime" class="my-[10px]" :end-time="countdowncountStart" :now-time="NOW" />
    </div>
    <div class="relative mb-[20px] flex flex-col items-center justify-center rounded-[4px] bg-light px-[12px] py-[24px]">
      <div class="text-lg font-[600] text-white">
        {{ t('today_earnings') }}
      </div>
      <div class="align-center mt-[8px] flex text-lg text-white">
        <AppCurrencyIcon :currency-type="currentGlobalCurrency" />
        <div class="ml-[4px] font-[600]">
          {{ formatMoney(detail?.day_claim) }}
        </div>
      </div>
      <BaseButton
        class="click-btn mt-[20px]"
        :loading="loading && !getSuccess"
        :class="{ waitTime: (endTime.time > 600 && detail?.hour_claim_state == 2) || getSuccess || downTime.time > 0 }"
        type="text" size="none"
        @click="handleGetClaim()"
      >
        <template v-if="getSuccess">
          {{ t('Received') }}
        </template>
        <template v-else-if="downTime.time <= 0 && detail?.hour_claim_state == 1">
          <span>{{ t('vip_right_now') }}</span>
        </template>
        <template v-else-if="endTime.time > 0 || loading">
          <span class="open-time">
            <span>{{ `${(endTime.hour !== undefined && endTime.hour < 10) ? '0' : ''}` }}{{ endTime.hour }}</span>
            <span class="mx-[2px]">:</span>
            <span>{{ `${(endTime.minute !== undefined && endTime.minute < 10) ? '0' : ''}` }}{{ endTime.minute }}</span>
            <span class="mx-[2px]">:</span>
            <span>{{ `${(endTime.second !== undefined && endTime.second < 10) ? '0' : ''}` }}{{ endTime.second }}</span>
          </span>
          <span class="ml-[6px]">{{ t('about_start') }}</span>
        </template>
      </BaseButton>
      <BaseImage v-if="globalInitMap.currentTemplate == 2" class="record-icon" url="/webp/promotions/mysterious-record-2.webp" @click="push('/promotions/promotion/mysterious-records')" />
      <BaseImage v-else-if="globalInitMap.currentTemplate == 4" class="record-icon" url="/webp/promotions/mysterious-record-4.webp" @click="push('/promotions/promotion/mysterious-records')" />
      <BaseImage v-else class="record-icon" url="/webp/promotions/mysterious-record.webp" @click="push(`/promotions/promotion/mysterious-records?pid=${pid}`)" />
    </div>

    <div class="countdown mb-[20px] flex flex-col items-center justify-center rounded-[4px] bg-light p-[12px]">
      <div class="text-sm font-[600] text-white">
        {{ t('mining_activity_time') }}
      </div>
      <div class="time-grid">
        <div v-for="i in detail?.cond" :key="i" class="time-item" :class="{ finished: isTimeSlotPast(i, dayjs.unix(detail?.count_down_start)) }">
          {{ i }}
        </div>
      </div>
    </div>

    <div class="content text-sm">
      <div class="mb-[10px] text-xl text-white">
        {{ t('event_rules_description') }}
      </div>
      <div class="content-item">
        <BaseRichArea v-if="isRichText" :content="contentText" />
        <AppPromotionBaseRuleText
          v-else
          amount="0"
          :currency-type="currentGlobalCurrency"
          :content="contentText"
        />
      </div>
      <!--      <div class="content-item"> -->
      <!--        <div class="round" /> -->
      <!--        <div style="line-height: 150%"> -->
      <!--          仅限昨日充值的会员才可参加。充值越多，奖励越丰厚。 【请务必在上述时间内登录，以免错过奖励。 【强烈建议使用手机APP】如未登录，则已过期（即未主动认领，则视为主动放弃） -->
      <!--        </div> -->
      <!--      </div> -->
      <!--      <div class="content-item"> -->
      <!--        <div class="round" /> -->
      <!--        <div style="line-height: 150%"> -->
      <!--          活动奖励需手动领取；未领取的奖励将被视为无效。 -->
      <!--        </div> -->
      <!--      </div> -->
      <!--      <div class="content-item"> -->
      <!--        <div class="round" /> -->
      <!--        <div style="line-height: 150%"> -->
      <!--          本活动所赠送的奖金（不含主奖金）需经过一次以上有效投注才可领取（投注仅限老虎机：PG、PP、Tada、JDB、CP） -->
      <!--        </div> -->
      <!--      </div> -->
    </div>
  </div>
<!--  <AppMysteriousDialog /> -->
</template>

<style scoped lang="scss">
.main-box {
  font-family: PingFang SC;
  background-color: var(--tg-body-bg);
  .top-img {
    min-height: 175px;
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
  .need-login {
    text-decoration: underline;
  }
  .record-icon {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 14px;
    height: 14px;
    cursor: pointer;
  }
  .countdown {
    --tg-app-countdown-bg: #1a2c38;
    @include webTheme('green') {
      --tg-text-lightgrey: #ffffff;
    }
  }
  .text-white {
    @include webTheme('white') {
      color: #111111;
    }
  }
  .click-btn {
    text-align: center;
    width: 80%;
    padding: 11px 20px;
    background-color: var(--tg-text-green);
    border-radius: 4px;
    color: var(--tg-text-dark);
    font-weight: 600;
    --tg-text-white: #05080a;
    @include webTheme('green') {
      background-color: #f6d14a;
      color: #02432d;
      --tg-text-white: #02432d;
    }
    @include webTheme('white') {
      background-color: #f2ca5c;
      color: #111111;
      --tg-text-white: #111111;
    }
    @include webTheme('greenblack') {
      background-color: var(--tg-primary-active);
      color: #111111;
      --tg-text-white: #111111;
    }

    &.waitTime {
      background-color: #4d5d6f;
      color: #b1bad3;

      @include webTheme('green') {
        background-color: #0e6746;
        color: #3cb389;
      }
      @include webTheme('white') {
        background-color: #c1c1c1;
        color: #e3e3e3;
      }
      @include webTheme('greenblack') {
        background-color: var(--tg-secondary-main);
        color: var(--tg-promotion-text-color);
      }
    }
  }

  .time-grid {
    width: 100%;
    margin-top: 11px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 11px;
    column-gap: 6px;
    .time-item {
      text-align: center;
      white-space: nowrap;
      background-color: transparent;
      border: 1px solid #2f4553;
      padding: 9.5px 11px;
      border-radius: 6px;
      font-size: 14px;
      @include webTheme('green') {
        background-color: #055434;
        border-color: #197b59;
      }
      @include webTheme('white') {
        border-color: #555555;
        background-color: #f5f5f5;
      }
      @include webTheme('greenblack') {
        border-color: var(--tg-border-color-grey);
      }
      &.finished {
        filter: opacity(0.6);
      }
    }
  }

  .content {
    .content-item {
      display: flex;
      align-items: baseline;
      margin-bottom: 10px;
    }
    .round {
      min-width: 6px;
      height: 6px;
      border-radius: 100%;
      background-color: var(--tg-text-lightgrey);
      margin-right: 8px;
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

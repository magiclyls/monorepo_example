<script lang="ts" setup>
import type { SignRewardDataConfig } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoDailySignClaim, ApiMemberPromoDailySignDetail } from '@tg/apis'
import { computed, ref } from 'vue'

/* defineOptions({
  name: 'KeepAlivePromotionSigninRewards',
}) */
const { t } = useI18n()
usePageTitle({ prefix: t('erveryday_signin') })

const { openNotify } = useNotify()
const router = useLocalRouter()
const { jumpToUrl } = useRedirect()
const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
const currentLang = getCurrentLanguageForBackend()
const isFirstLoading = ref<boolean>(true)

const route = useRoute()
/** 从链接中获取活动的PID */
const pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
/** 图片地址 */
const imgUrl = ref('')

/** 接口返回币种,防止选择的货币没有数据 */
const memberCurrency = ref<CurrencyCode>('701')
/** 活动配置 */
const dataActivityConfig = ref<SignRewardDataConfig>()
/** 接口: 活动配置 */
const {
  runAsync: runAsyncDataConfig,
  loading: dataConfigLoading,
} = useRequest(ApiMemberPromoDailySignDetail, {
})
/** 接口: 领取接口 */
const {
  runAsync: runAsyncReceive,
} = useRequest(ApiMemberPromoDailySignClaim)
/**
 获取次日 0 点的 Unix 时间戳（秒)
const startOfNextDayUnixTimestamp = dayjs().add(1, 'day').startOf('day').unix()
倒计时开始时间
倒计时结束时间
 */
const nowTime = computed(() => {
  return dataActivityConfig.value ? dayjs(dataActivityConfig.value.count_down_start * 1000) : dayjs()
})
const endTime = computed(() => {
  return dataActivityConfig.value ? dayjs(dataActivityConfig.value.count_down_end * 1000) : dayjs()
})
/** 当前货币配置，虚拟币统一使用USDT */
const activeCurrency = computed(() => {
  const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
  return currencyConfig[isLogin.value ? val : languageConfig[getCurrentLanguageForFrontend()].currency]
})
/** 基础配置条件 */
const baseConfig = computed(() => {
  return {
    deposit: dataActivityConfig.value?.cond.deposit ? dataActivityConfig.value.cond.deposit : 0,
    bet: dataActivityConfig.value?.cond.bet ? dataActivityConfig.value.cond.bet : 0,
  }
})
/**
 * 奖金条件
 * serial: 连续签到奖金
 * base: 累计签到奖金
 * exp: 1, // 是否过期 0:未过期 1:已过期
 * rcp: 0, // 是否达成/已领取/可领取 0:未达成 1:已领取 2:已达成/可领取 3:领取中
 */
const bonusConfig = computed(() => {
  return {
    serial: dataActivityConfig.value?.bonus_serial ? dataActivityConfig.value.bonus_serial[0] : null,
    base: dataActivityConfig.value?.bonus_base ? dataActivityConfig.value.bonus_base : [],
  }
})
/** 是否参与活动领取 */
const isJoinCurrency = computed(() => {
  return dataActivityConfig.value ? dataActivityConfig.value.fr_currency_id : null
})
/** 配置活动图片 */
function setProfitConfig(data: any) {
  memberCurrency.value = data.currency_id
  imgUrl.value = JSON.parse(data.images)[currentLang]
}
/** 活动说明文案 */
const contentDetail = computed(() => {
  return dataActivityConfig.value ? JSON.parse(dataActivityConfig.value.detail)[currentLang] : ''
})

/** 连续签到多少天 */
const signDays = computed(() => {
  const dayArray = (dataActivityConfig.value && dataActivityConfig.value.rule) ? dataActivityConfig.value.rule.map(item => item.day) : []
  return dayArray.join('、')
})

/** 连续签到奖金 */
const signBonus = computed(() => {
  const amtArray = (dataActivityConfig.value && dataActivityConfig.value.rule) ? dataActivityConfig.value.rule.map(item => (Number.parseFloat(item.amt).toFixed(2))) : []
  return amtArray.join('、')
})

/** 活动配置数据 */
function runAsyncConfig() {
  return runAsyncDataConfig({ pid, currency_id: activeCurrency.value.cur }).then((data) => {
    data = data as SignRewardDataConfig
    if (typeof data === 'string' && data === '活动不支持该币种') {
      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('promo_currency_error'),
      })
      goPromo()
    }
    else if (data && (data as SignRewardDataConfig).fr_currency_id !== '') {
      runAsyncConfigAfterJoin((data as SignRewardDataConfig).fr_currency_id as CurrencyCode)
    }
    else if (data && +(data as SignRewardDataConfig).state === 2 && !preview) {
      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('activity') + t('sports_status_finished'),
      })
      goPromo()
    }
    else if (data && +(data as SignRewardDataConfig).state === 3 && !preview) {
      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('activity') + t('unopened'),
      })
      goPromo()
    }
    else {
      dataActivityConfig.value = data as SignRewardDataConfig
      setProfitConfig(data)
    }
    isFirstLoading.value = false
  })
}
/** 参与后的活动配置数据 */
function runAsyncConfigAfterJoin(currency_id: CurrencyCode) {
  return runAsyncDataConfig({ pid, currency_id }).then((data) => {
    dataActivityConfig.value = data as SignRewardDataConfig
    setProfitConfig(data)
  })
}
/** 领取奖金 */
function receiveBonus(day: number, type: number) {
  const _currency_id = isJoinCurrency.value ? isJoinCurrency.value : activeCurrency.value.cur
  if (type === 1) {
    bonusConfig.value.base.forEach((item) => {
      if (+item.day === day)
        item.rcp = 3
    })
  }
  else if (type === 2) {
    if (bonusConfig.value.serial)
      bonusConfig.value.serial.rcp = 1
  }
  runAsyncReceive({ pid, type, day, currency_id: _currency_id as CurrencyCode }).then((data) => {
    if (data === '') {
      // runAsyncConfig()
      const item = bonusConfig.value.base.find(item => Number(item.day) === day)
      const amt = item?.amt
      if (isFlutterApp())
        sendMsgToFlutterApp(SendFlutterAppMessage.SIGN_RECEIVE_AWARD, amt)
    }
    else {
      openNotify({
        type: 'error',
        title: t('fail_bonus'),
        message: t('please_contact_service'),
      })
    }
  })
}
/** 跳转到活动列表页面 */
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}
/** 监听消息通知 */
function mqttRefresh() {
  setTimeout(() => {
    runAsyncConfig()
  }, 50)
}
watch(() => currentGlobalCurrency.value, (newVal) => {
  if (isJoinCurrency.value && currencyConfig[newVal].cur !== isJoinCurrency.value) {
    return false
  }
  else {
    runAsyncDataConfig({ pid, currency_id: currencyConfig[newVal].cur }).then((data) => {
      if (typeof data === 'string' && data === '活动不支持该币种') {
        openNotify({
          icon: 'uni-record-warn',
          title: t('warm_tip'),
          message: t('promo_currency_error'),
        })
        return false
      }
      else if (data && (data as SignRewardDataConfig).fr_currency_id !== '') {
        runAsyncConfigAfterJoin((data as SignRewardDataConfig).fr_currency_id as CurrencyCode)
      }
      else {
        dataActivityConfig.value = data as SignRewardDataConfig
        setProfitConfig(data)
      }
    })
  }
})
watch(isLogin, async (newVal) => {
  if (newVal)
    await application.allSettled([runAsyncConfig()])
})
onMounted(() => {
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
await application.allSettled([runAsyncConfig()])
</script>

<template>
  <AppLoading v-if="(dataConfigLoading && isFirstLoading)" full-screen />
  <div v-else class="text-tg-text-lightgrey page-signin-rewards m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="theme-bg grid grid-cols-1 mb-[16px] place-items-center gap-y-[6px] rounded-[4px] p-[12px] font-[600]">
      <span class="text-tg-text-white text-sm">{{ $t('today_remaining') }}</span>
      <AppCountdown :now-time="nowTime" :end-time="endTime" class="countdown-costom" />
    </div>
    <div class="theme-bg grid grid-cols-1 mb-[16px] gap-y-[8px] rounded-[4px] p-[12px] text-[14px] font-[600]">
      <section v-if="baseConfig.deposit && Number(baseConfig.deposit) > 0" class="flex flex-row justify-between">
        <span>{{ $t('need_money') }}</span>
        <span class="flex flex-row">
          <AppAmount :amount="Number(dataActivityConfig?.deposit ?? 0)" :currency-type="getCurrencyConfigByCode(memberCurrency)?.name" :show-icon="false" class="theme-amount theme-amount-margin-right0" />
          <span>/</span>
          <AppAmount :amount="baseConfig.deposit" :currency-type="getCurrencyConfigByCode(memberCurrency)?.name" />
        </span>
      </section>
      <section v-if="baseConfig.bet && Number(baseConfig.bet) > 0" class="flex flex-row justify-between">
        <span>{{ $t('today_required_valid_bets') }}</span>
        <span class="flex flex-row">
          <AppAmount :amount="Number(dataActivityConfig?.bet ?? 0)" :currency-type="getCurrencyConfigByCode(memberCurrency)?.name" :show-icon="false" class="theme-amount-margin-right0 theme-amount" />
          <span>/</span>
          <AppAmount :amount="baseConfig.bet" :currency-type="getCurrencyConfigByCode(memberCurrency)?.name" />
        </span>
      </section>
      <section class="flex flex-row justify-between">
        <span>{{ $t('total_collection') }}</span>
        <span class="theme-amount flex flex-row">
          <AppAmount class="theme-amount" :amount="Number(dataActivityConfig?.bonus_amt ?? 0.00)" :currency-type="getCurrencyConfigByCode(memberCurrency)?.name" />
        </span>
      </section>
      <section v-if="bonusConfig.serial && isLogin" class="bg-color grid grid-cols-1 place-items-center gap-y-[12px] rounded-[4px] p-[12px]">
        <div class="inline-costom">
          {{ $t('signed_in_for_day_can_receive', { day: bonusConfig.serial.day }) }}
          <AppAmount class="theme-amount" :amount="bonusConfig.serial.amt" :currency-type="getCurrencyConfigByCode(memberCurrency)?.name" />
        </div>
        <BaseButton
          class="w-[100%]" :bg-style="bonusConfig.serial.rcp === 0 ? 'secondary' : 'grey'" size="md" :disabled="bonusConfig.serial.rcp === 1"
          @click="receiveBonus(+bonusConfig.serial.day, 2)"
        >
          {{ bonusConfig.serial.rcp === 1 ? $t('received') : $t('vip_right_now') }}
        </BaseButton>
      </section>
      <!-- 皮肤调试用 -->
      <!-- <section class="bg-color grid grid-cols-1 place-items-center gap-y-[12px] rounded-[4px] p-[12px]">
        <div class="inline-costom">
          {{ $t('signed_in_for_day_can_receive', { day: 12 }) }}
          <AppAmount class="theme-amount" :amount="100" :currency-type="getCurrencyConfigByCode(memberCurrency)?.name" />
        </div>
        <BaseButton class="w-[100%]" bg-style="secondary" size="md">
          {{ $t('received') }}
        </BaseButton>
      </section> -->
    </div>
    <div v-if="bonusConfig.base.length > 0" class="grid grid-cols-4 justify-between gap-y-[16px] text-[10px] font-[600]" style="grid-template-columns: repeat(4, 55px);">
      <div v-for="(item, i) in bonusConfig.base" :key="i" class="w-[55px]">
        <section class="grid grid-cols-1 place-items-center gap-y-[2px]">
          <span class="theme-text" :class="{ 'opacity-50 theme-timeout': item.exp === 1 }">{{ $t('n_day', { day: item.day }) }}</span>
          <div :class="{ 'opacity-50': item.exp === 1 }" class="border-costom">
            <BaseImage class="w-[43px]" url="/png/promotions/money.png" />
          </div>
          <BaseButton
            v-if="item.rcp !== 0 || item.exp === 1" :bg-style="item.rcp === 2 ? 'secondary' : 'grey'" size="none"
            :class="[item.rcp === 2 ? 'theme-btn-sec' : 'button-grey']"
            :disabled="item.rcp === 1 || item.rcp === 3 || item.exp === 1" @click="receiveBonus(+item.day, 1)"
          >
            {{ (item.rcp === 2 || item.rcp === 3) ? $t('receive') : item.rcp === 1 ? $t('received') : $t('expired') }}
          </BaseButton>
          <!-- 皮肤调试用 -->
          <!-- <BaseButton bg-style="grey" size="none" class="button-grey">
            {{ t('received') }}
          </BaseButton> -->
        </section>
      </div>
    </div>
    <div class="text-tg-text-white my-[16px] text-[18px] font-[600]">
      {{ $t('event_rules_description') }}
    </div>
    <div>
      <BaseRichArea v-if="dataActivityConfig?.rule_type === 2" :content="contentDetail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfigByCode(memberCurrency)?.name"
        :amount="dataActivityConfig?.max_bonus ?? '0'"
        :amount-arr="[dataActivityConfig?.max_bonus ?? '0', dataActivityConfig?.period ?? '0']"
        :rule-array="[signDays, signBonus]"
        replace-type="3"
        :content="contentDetail"
      />
    </div>
    <div v-if="dataActivityConfig?.button === 1" class="my-[24px] text-center">
      <BaseButton
        bg-style="secondary" size="md" class="w-[100%]"
        @click="jumpToUrl({ type: +dataActivityConfig.button_type, jumpUrl: dataActivityConfig.button_redirect })"
      >
        {{ dataActivityConfig?.button_text }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-bg {
  background-color: var(--tg-secondary-grey);
  @include webTheme('greenblack') {
    background-color: var(--tg-secondary-dark);
  }
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.theme-text {
  color: var(--tg-text-white);
  @include webTheme('white') {
    color: #111;
    opacity: 1;
  }
}
.theme-timeout {
  @include webTheme('green') {
    color: #3cb389;
    opacity: 1;
  }
  @include webTheme('white') {
    color: #555;
    opacity: 1;
  }
}
.page-signin-rewards {
  --tg-table-layout: fixed;
  --tg-table-th-padding-x: 8px;
  --tg-table-td-padding-x: 8px;
  --tg-table-th-word-wrap: break-word;
  --tg-table-th-white-space: normal;
}
.bg-color {
  background-color: #1a2c38;
  @include webTheme('greenblack') {
    background-color: var(--tg-primary-main);
  }
  @include webTheme('green') {
    background-color: #02432d;
  }
  @include webTheme('white') {
    background-color: #fff;
  }
}
.countdown-costom {
  --tg-app-countdown-bg: #1a2c38;
}
.button-grey {
  --tg-base-button-font-size: 10px;
  --tg-base-button-border-radius: 2px;
  --tg-base-button-font-weight: 500;
  width: 44px;
  height: 14px;
  @include webTheme('green') {
    --tg-base-button-style-bg: #055434;
    color: #3cb389;
    --tg-base-button-disabled-opacity: 1;
  }
}
.theme-btn-sec {
  --tg-base-button-font-size: 10px;
  --tg-base-button-border-radius: 2px;
  --tg-base-button-font-weight: 500;
  width: 44px;
  height: 14px;
  @include webTheme('white') {
    --tg-base-button-style-bg: #f2ca5c;
  }
}
.border-costom {
  border: 1px solid var(--tg-sport-btn-hover);
  border-radius: 6px;
  background-color: var(--tg-secondary-dark);
  padding: 4px;
  text-align: center;
  @include webTheme('white') {
    border-color: #c1c1c1;
    background-color: #e8e8e8;
  }
  @include webTheme('green') {
    border-color: #197b59;
    background-color: #02432d;
  }
}
.amount-costom {
  --tg-app-amount-font-size: 10px;
  --tg-app-currency-icon-size: 10px;
}
.amount-margin-right0 {
  --tg-spacing-4: 0;
}
.inline-costom > div {
  display: inline-table;
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

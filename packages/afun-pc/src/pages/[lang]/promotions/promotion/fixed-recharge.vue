<script lang="ts" setup>
import type { FixedRechargeActivity, LoginFixedRechargeActivity } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoFixedDepositClaim, ApiMemberPromoFixedDepositData, ApiMemberPromoFixedDepositDetail } from '@tg/apis'
import dayjs from 'dayjs'
import { computed, ref } from 'vue'

defineOptions({
  name: 'KeepAlivePromotionFixedRecharge',
})
interface Item {
  b: number
  d: number
}

const { t } = useI18n()
const { openNotify } = useNotify()
const { openWalletDialog } = useWalletDialog()
const { openLoginDialog } = useLoginDialog()
const { jumpToUrl } = useRedirect()
const router = useLocalRouter()
const { isLogin, currentGlobalCurrency, balanceData } = storeToRefs(useAppStore())
const route = useRoute()
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const currentLang = getCurrentLanguageForBackend()
const { globalPageTitle } = useGlobalStatePageTitle()

const TIME_FORMAT_1 = 'YYYY-MM-DD'
const tableColumn: Column[] = [
  {
    title: t('deposit_amount'),
    dataIndex: 'deposit',
    align: 'center',
    width: '50%',
    slot: 'amount',
  },
  {
    title: t('sports_events_inside_table_header_prize'),
    dataIndex: 'min',
    align: 'center',
    slot: 'bonus_rate',
    width: '50%',
  },
]

const refresh = ref<number>(0)
const fullRes = ref<FixedRechargeActivity>()
const loginFullRes = ref<LoginFixedRechargeActivity>()

const pid = computed(() => Number(route.query.pid))
const preview = route.query.preview?.toString() ?? ''
/* const currentDollarZone = computed(() => AllLanguages.value.filter(lang => lang.value === userLanguage.value)[0].zone) */
const currentDollarZone = computed(() => fullRes.value?.timezone)

const configData = computed(() => {
  let conf = null
  if (!fullRes.value?.config)
    return conf
  try {
    conf = JSON.parse(fullRes.value.config)
  }
  catch (e) {

  }
  return conf
})
const imgUrl = computed(() => {
  const images = fullRes.value?.images
  if (!images)
    return ''
  return JSON.parse(images)[currentLang]
})
const NOW = computed(() => {
  const nowUnix = Number(fullRes.value?.apply_period)
  return nowUnix ? dayjs.unix(nowUnix).tz(currentDollarZone.value) : dayjs().tz(currentDollarZone.value)
})
const isStart = computed(() => {
  // 当前时间在start-end之间
  const start = dayjs.tz(`${NOW.value.format(TIME_FORMAT_1)} ${configData.value?.fixed_start_at}`, currentDollarZone.value).unix()
  // const end = dayjs.tz(`${NOW.value.format(TIME_FORMAT_1)} ${configData.value?.fixed_end_at}`, currentDollarZone.value).unix()
  const nowUnix = NOW.value.unix()
  return nowUnix >= start
})
const currentLangCurrency = computed(() => {
  return currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
})
const globalCurrencyCode = ref<CurrencyCode>('701')
const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const usedCurrency = computed(() => {
  return getCurrencyConfigByCode(usedCurrencyCode.value).name
})
const prize_config = computed<Item[]>(() => {
  const tongue = configData.value?.recharge || []
  return tongue[usedCurrencyCode.value] || []
})
const sortedPrizeConfig = computed(() => {
  const s = prize_config.value || []
  return s.sort((a, b) => Number(a.d) - Number(b.d))
})
const minItem = computed(() => {
  if (sortedPrizeConfig.value.length === 0)
    return { b: 0, d: 0 }

  return sortedPrizeConfig.value[0]
})
const maxItem = computed(() => {
  if (sortedPrizeConfig.value.length === 0)
    return { b: 0, d: 0 }

  return sortedPrizeConfig.value[sortedPrizeConfig.value.length - 1]
})
const currentDetail = computed(() => {
  let detail = ''
  try {
    detail = fullRes.value ? JSON.parse(fullRes.value.detail)[currentLang] : ''
  }
  catch (e) {

  }
  return detail
})

const recharge_now = computed(() => {
  let button_text = ''
  try {
    button_text = fullRes.value ? JSON.parse(fullRes.value.button_text)[currentLang] : ''
  }
  catch (e) {

  }
  return button_text
}) // 配置的 充值按钮 文案
const recharge_on = computed(() => fullRes.value?.button === 1) // 配置充值按钮 开启

// 领取奖金
const {
  loading: receiveLoading,
  runAsync: runAsyncReceive,
} = useRequest(ApiMemberPromoFixedDepositClaim, {
  onSuccess: (data) => {
    if (data.state === -1) {
      return openNotify({
        type: 'error',
        title: t('fail_bonus'),
        message: t('please_contact_service'),
      })
    }
    if (loginFullRes.value?.state)
      loginFullRes.value.state = 4
  },
  onError: () => {
    openNotify({
      type: 'error',
      title: t('fail_bonus'),
      message: t('please_contact_service'),
    })
  },
})

// 获取config活动配置
const {
  loading: configLoading,
  runAsync: runAsyncProfitConfig,
} = useRequest(ApiMemberPromoFixedDepositDetail, {
  onSuccess: (data) => {
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
    if ((data.state === 2 || data.state === 3) && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      return goPromo()
    }
    /*  if (data.period === 0) {
      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('promo_currency_error'),
      })
      if (!fullRes.value)
        goPromo()
    }
    else { */
    fullRes.value = data
    const config = JSON.parse(data.config)
    usedCurrencyCode.value = config.currency_id
    // }
  },
  onError: () => {
    openNotify({
      type: 'error',
      code: 'false',
      message: t('promo_end'),
    })
    goPromo()
  },
})
// 获取登录后活动详情
const {
  runAsync: runAsyncConfigDetail,
} = useRequest(ApiMemberPromoFixedDepositData, {
  onSuccess: (data) => {
    loginFullRes.value = data
  },
  onError: () => {
    goPromo()
  },
})

function openWalletDialogIfNotApp() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.OPEN_DEPOSIT_MODAL)
  else
    openWalletDialog()
}
// 立即领取
function handleReceive() {
  if (isLogin.value) {
    runAsyncReceive(
      { activity_id: pid.value.toString(), cur: usedCurrencyCode.value },
    )
  }
  else {
    openLoginDialog()
  }
}

function onCountDownEnd() {
  refresh.value++
}

function getInitRequestList() {
  const r = runAsyncProfitConfig({ pid: pid.value, cur: usedCurrencyCode.value })
  if (isLogin.value) {
    r.then(() => {
      runAsyncConfigDetail({ activity_id: pid.value.toString(), cur: usedCurrencyCode.value })
    })
  }
}
function mqttRefresh(msg: string) {
  if (msg === 'promo_fixed_start')
    refresh.value++
  // 定点充值活动开始，需更新状态
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

watch([isLogin, refresh, balanceData, usedCurrencyCode], () => {
  // console.log('myconsole----:', 'changed', '&,fullRes.value:', fullRes.value)
  if (fullRes.value) {
    // 接口有值后的变动
    getInitRequestList()
  }
})

watchEffect(() => {
  let names = fullRes.value?.name || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
})

onMounted(() => {
  // console.log('myconsole----:', 'watch started')
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
if (!pid.value)
  goPromo()
getInitRequestList()
</script>

<template>
  <AppLoading v-if="(configLoading && !fullRes)" />
  <div v-else class="text-tg-text-lightgrey fixed-container m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="text-sm font-semibold text-[var(--tg-text-lightgrey)]">
      <div class="flex flex-col items-center rounded-[4px] bg-[var(--tg-primary-main)] p-[12px]">
        <span>{{ isStart ? $t('left_time') : $t('unstart') }}</span>
        <AppCountdown class="my-[12px]" :duration="fullRes?.last_claim_time" @on-end="onCountDownEnd" />
      </div>
    </div>
    <div class="my-[20px] text-center text-sm font-semibold">
      {{ $t('save_time') }}{{ configData.fixed_start_at }} - {{ configData.fixed_end_at }}
    </div>
    <div class="text-sm font-semibold text-[var(--tg-text-lightgrey)]">
      <div class="rounded-[4px] bg-light p-[12px]">
        <div class="mb-[8px] flex justify-between">
          <span>{{ $t('need_money') }}</span>
          <span class="color3 flex font-normal"> <span class="color4">{{ formatAmountFunc(loginFullRes?.deposit_amount || '0.00', usedCurrency) }}</span>/<AppAmount :amount="(isLogin ? loginFullRes?.cond_deposit_amount : minItem.d.toString()) || '0.00'" :currency-type="usedCurrency" /></span>
        </div>
        <div class="mb-[8px] flex justify-between">
          <span>{{ $t('need_valid_bet') }}</span>
          <span class="color3 flex font-normal"> <span class="color4">{{ formatAmountFunc(loginFullRes?.bet_amount || '0.00', usedCurrency) }}</span>/<AppAmount :amount="(isLogin ? loginFullRes?.cond_bet_amount : (minItem.d * configData.bet).toString()) || '0.00'" :currency-type="usedCurrency" /></span>
        </div>
        <div v-if="isLogin" class="bg-deep flex flex-col items-center justify-center rounded-[4px] p-[12px]">
          <template v-if="loginFullRes?.state === 5">
            <span class="text-tg-text-white font-semibold">{{ $t('claim_bonus_time') }}</span>
            <span class="my-[6px] font-normal">{{ NOW.format(TIME_FORMAT_1) }} {{ loginFullRes?.fixed_end_at }}</span>
            <img class="mb-[15px] h-[30px] w-[43px]" src="/afun-pc/webp/promotions/dollar.webp" alt="">
            <div class="flex font-normal">
              <AppAmount class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'" :currency-type="usedCurrency" />
            </div>
          </template>
          <template v-else>
            <span class="text-tg-text-white font-semibold">{{ Number(loginFullRes?.claim_amount) > 0 ? $t('have_qualified') : $t('finance_other_tab_bonus') }}</span>
            <div class="my-[6px] flex">
              <AppAmount class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'" :currency-type="usedCurrency" />
            </div>
            <img class="mb-[10px] h-[30px] w-[43px]" src="/afun-pc/webp/promotions/dollar.webp" alt="">
            <BaseButton
              v-if="loginFullRes?.state === 1"
              :loading="receiveLoading"
              class="w-[100%]" bg-style="primary" size="md"
              @click.stop="handleReceive()"
            >
              {{ $t('vip_right_now') }}
            </BaseButton>
            <BaseButton
              v-else-if="loginFullRes?.state === 2"
              class="w-[100%] disabled-btn" :disabled="true" size="md"
            >
              {{ $t('expired') }}
            </BaseButton>
            <BaseButton
              v-else-if="loginFullRes?.state === 3"
              class="w-[100%]" bg-style="primary" size="md"
              @click="openWalletDialogIfNotApp"
            >
              {{ t('fast_go_recharge') }}
            </BaseButton>
            <BaseButton
              v-else-if="loginFullRes?.state === 4"
              class="w-[100%] disabled-btn" :disabled="true" size="md"
            >
              {{ $t('received') }}
            </BaseButton>
            <BaseButton
              v-else-if="loginFullRes?.state === 6"
              class="w-[100%] disabled-btn" :disabled="true" size="md"
            >
              {{ $t('not_satisfied') }}
            </BaseButton>
          </template>
        </div>
        <div v-else class="bg-deep rounded-[4px] p-[12px]">
          <div class="min-h-[52px] flex items-center justify-center font-normal">
            <span>{{ $t('login_view_more') }}</span>
          </div>
          <BaseButton
            class="mt-[12px] w-[100%]" bg-style="primary" size="md"
            @click.stop="openLoginDialog"
          >
            {{ $t('login_now') }}
          </BaseButton>
        </div>
      </div>
    </div>

    <BaseTable class="second-color table" :columns="tableColumn" last-first-padding :data-source="sortedPrizeConfig ?? []">
      <template #amount="{ record }">
        <div class="flex items-center justify-center">
          ≥
          <AppAmount :amount="record.d || '0.00'" :currency-type="usedCurrency" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="flex items-center justify-center">
          <AppAmount :amount="record.b || '0.00'" :currency-type="usedCurrency" />
        </div>
      </template>
    </BaseTable>
    <div class="mt-[16px]">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ t('activity_rule_desc') }}
      </div>
      <div class="my-[16px]">
        <BaseRichArea v-if="fullRes?.rule_type === 2" :content="currentDetail" />
        <AppPromotionBaseRuleText
          v-else
          :amount="maxItem.d.toString()" :currency-type="usedCurrency"
          :content="currentDetail"
          replace-type="1"
          :amount-arr="[maxItem.d, maxItem.b]"
        />
        <BaseButton
          v-if="isLogin && recharge_on"
          class="mt-[16px] w-[100%]" bg-style="primary" size="md"
          @click="jumpToUrl({ type: Number(fullRes?.button_type), jumpUrl: fullRes?.button_redirect })"
        >
          {{ recharge_now }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-light {
  background-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.bg-deep {
  background-color: var(--tg-primary-main);
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
  @include webTheme('green') {
    background-color: #02432d;
  }
}
.fixed-container {
  @include webTheme('green') {
    --tg-primary-main: #076237;
  }
}
.split-line {
  margin: 20px 0;
  border-bottom: 1px solid var(--tg-sport-btn-hover);
}
.second-color {
  color: inherit;
}

.table {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
    --tg-table-odd-background: var(--tg-primary-main);
    --tg-table-even-background: var(--tg-secondary-dark);
  }
}
.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
.color3 {
  @include webTheme('white') {
    color: #111;
  }
  @include webTheme('green') {
    color: white;
  }
}
.color4 {
  color: var(--tg-text-green);
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
  @include webTheme('white') {
    color: #ffaa09;
  }
  @include webTheme('green') {
    color: #eca30c;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

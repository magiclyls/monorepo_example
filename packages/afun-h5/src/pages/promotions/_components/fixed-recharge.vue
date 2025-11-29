<script lang="ts" setup>
import type { Column, CurrencyCode, FixedRechargeActivity, LoginFixedRechargeActivity } from '@tg/types'
import { ApiMemberPromoFixedDepositClaim, ApiMemberPromoFixedDepositData, ApiMemberPromoFixedDepositDetail } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseImage, AfunBaseRichArea, AfunBaseTable } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { useAppStore, useCurrency } from '@tg/stores'
import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import {
  appEventBus,
  formatAmountFunc,
  getCurrencyConfig,
  isFlutterApp,
  sendMsgToFlutterApp,
} from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, inject, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppCountdown from '~/components/AppCountdown.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({
  name: 'KeepAlivePromotionFixedRecharge',
})
interface Item {
  b: number
  d: number
}
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
const currentLang: any = getLangForBackend()
// const { globalPageTitle } = useGlobalStatePageTitle()

const TIME_FORMAT_1 = 'YYYY-MM-DD'
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
const globalCurrencyCode = ref<CurrencyCode>('701')
const usedCurrencyCode = ref<CurrencyCode>(globalCurrencyCode.value)
const usedCurrency = computed(() => {
  return getCurrencyConfig(usedCurrencyCode.value).name
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
      return Message.error(t('请联系在线客服'))
    }
    if (loginFullRes.value?.state)
      loginFullRes.value.state = 4
    Message.success(t('领取成功'))
  },
  onError: () => {
    Message.error(t('请联系在线客服'))
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

    if (!tongue.includes(currentLang || '')) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if ((data.state === 2 || data.state === 3) && !preview) {
      Message.error(t('活动已结束'))
      return goPromo()
    }
    if (data.period === 0) {
      Message.error(t('当前选择的货币不支持此活动'))
      if (!fullRes.value)
        goPromo()
    }
    else {
      fullRes.value = data
      const config = JSON.parse(data.config)
      usedCurrencyCode.value = config.currency_id
    }
  },
  onError: () => {
    Message.error(t('活动已结束'))
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
    // openWalletDialog()
    router.push('/wallet')
}
// 立即领取
function handleReceive() {
  if (isLogin.value) {
    runAsyncReceive(
      { activity_id: pid.value.toString(), cur: usedCurrencyCode.value },
    )
  }
  else {
    // openLoginDialog()
    router.push('/login')
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
    router.replace('/promotions')
}

watch([isLogin, refresh, currencyList, usedCurrencyCode], () => {
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
    setTitle(name)
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
  <div v-else class="fixed-recharge-active text-[#0D2245] fixed-container m-auto mt-[16px] max-w-[650px] text-">
    <div class="mb-[16px] center" :class="{ ' mb-[16px]': imgUrl }">
      <AfunBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div class="text-[14px] font-[600] text-[#B1BAD3]">
      <div class="flex flex-col items-center rounded-[4px] bg-[#1A2C38] p-[12px]">
        <span>{{ isStart ? t('领取剩余时间') : t('狂欢未开始') }}</span>
        <AppCountdown class="my-[12px]" :duration="fullRes?.last_claim_time" @on-end="onCountDownEnd" />
      </div>
    </div>
    <div class="my-[20px] text-center text-[14px] font-[600] text-[#B1BAD3]">
      {{ t('存款时间') }}{{ configData.fixed_start_at }} - {{ configData.fixed_end_at }}
    </div>
    <div class="text-[14px] font-[600] text-[#B1BAD3] ">
      <div class="rounded-[4px] bg-[#213743] p-[12px]">
        <div class="h-[14px] mb-[8px] flex justify-between">
          <span>{{ t('所需存款') }}</span>
          <span class="color3 flex items-center font-normal"> <span class="color4 font-[600]">{{ formatAmountFunc(loginFullRes?.deposit_amount || '0.00', usedCurrency) }}</span>/<AfunBaseAmount :amount="(isLogin ? loginFullRes?.cond_deposit_amount : minItem.d.toString()) || '0.00'" :currency-type="usedCurrency" /></span>
        </div>
        <div class="h-[14px] mb-[8px] flex justify-between">
          <span>{{ t('所需有效投注') }}</span>
          <span class="color3 flex items-center font-normal"> <span class="color4 font-[600]">{{ formatAmountFunc(loginFullRes?.bet_amount || '0.00', usedCurrency) }}</span>/<AfunBaseAmount :amount="(isLogin ? loginFullRes?.cond_bet_amount : (minItem.d * configData.bet).toString()) || '0.00'" :currency-type="usedCurrency" /></span>
        </div>
        <div v-if="isLogin" class="bg-deep flex flex-col items-center justify-center rounded-[4px] p-[12px]">
          <template v-if="loginFullRes?.state === 5">
            <span class="text-[#0D2245] font-[600]">{{ t('领取奖金时间') }}</span>
            <span class="my-[6px] font-normal">{{ NOW.format(TIME_FORMAT_1) }} {{ loginFullRes?.fixed_end_at }}</span>
            <AfunBaseImage class="mb-[15px] h-[30px] w-[43px]" url="/m/afun-h5/png/dollar.png" />
            <div class="flex font-normal">
              <AfunBaseAmount class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'" :currency-type="usedCurrency" />
            </div>
          </template>
          <template v-else>
            <span class="text-[#fff] font-[600]">{{ Number(loginFullRes?.claim_amount) > 0 ? t('您已获取领取资格') : t('奖金') }}</span>
            <div class="my-[6px] flex">
              <AfunBaseAmount class="theme-amount" :amount="loginFullRes?.claim_amount || '0.00'" :currency-type="usedCurrency" />
            </div>
            <AfunBaseImage class="mb-[15px] h-[30px] w-[43px]" url="/m/afun-h5/png/dollar.png" />
            <AfunBaseButton
              v-if="loginFullRes?.state === 1"
              :loading="receiveLoading"
              class="w-[100%]" bg-style="secondary" size="md"
              @click.stop="handleReceive()"
            >
              {{ t('立即领取') }}
            </AfunBaseButton>
            <AfunBaseButton
              v-else-if="loginFullRes?.state === 2"
              class="w-[100%] disabled-btn" :disabled="true" size="md"
            >
              {{ t('已过期') }}
            </AfunBaseButton>
            <AfunBaseButton
              v-else-if="loginFullRes?.state === 3"
              class="w-[100%]" bg-style="secondary" size="md"
              @click="openWalletDialogIfNotApp"
            >
              {{ t('立即充值') }}
            </AfunBaseButton>
            <AfunBaseButton
              v-else-if="loginFullRes?.state === 4"
              class="w-[100%] disabled-btn" :disabled="true" size="md"
            >
              {{ t('已领取') }}
            </AfunBaseButton>
            <AfunBaseButton
              v-else-if="loginFullRes?.state === 6"
              class="w-[100%] disabled-btn" :disabled="true" size="md"
            >
              {{ t('未符合') }}
            </AfunBaseButton>
          </template>
        </div>
        <div v-else class="bg-deep rounded-[4px] p-12">
          <div class="min-h-[52px] center font-normal">
            <span>{{ t('登录后查看更多内容') }}</span>
          </div>
          <AfunBaseButton
            class="mt-[12px] w-[100%]" bg-style="secondary" size="md"
            @click.stop="router.push('/login')"
          >
            {{ t('立即登录') }}
          </AfunBaseButton>
        </div>
      </div>
    </div>

    <AfunBaseTable class="second-color table" :columns="tableColumn" last-first-padding :data-source="sortedPrizeConfig ?? []">
      <template #amount="{ record }">
        <div class="center">
          ≥
          <AfunBaseAmount :amount="record.d || '0.00'" :currency-type="usedCurrency" />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="center">
          <AfunBaseAmount :amount="record.b || '0.00'" :currency-type="usedCurrency" />
        </div>
      </template>
    </AfunBaseTable>
    <div class="mt-[16px]">
      <div class="text-[#fff] text-[20px] font-[600]">
        {{ t('活动规则说明') }}
      </div>
      <div class="mt-[16px]">
        <AfunBaseRichArea v-if="fullRes?.rule_type === 2" :content="currentDetail" />
        <AppPromotionBaseRuleText
          v-else
          :amount="maxItem.d.toString()" :currency-type="usedCurrency"
          :content="currentDetail"
          replace-type="1"
          :is-login="isLogin"
          :amount-arr="[maxItem.d, maxItem.b]"
        />
        <AfunBaseButton
          v-if="isLogin && recharge_on"
          class="mt-[16px] w-[100%]" bg-style="secondary" size="md"
          @click="jumpToUrl({ type: Number(fullRes?.button_type), jumpUrl: fullRes?.button_redirect })"
        >
          {{ recharge_now }}
        </AfunBaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bg-light {
  background-color: #fff;
}
.bg-deep {
  background-color: #1a2c38;
}
.fixed-container {
  --afun-primary-main: #076237;
}
.split-line {
  margin: 20px 0;
  border-bottom: 1px solid #2f4554;
}
.second-color {
  color: inherit;
}

.table {
  /* color: #1475e1;
  --afun-table-odd-background: #1a2c38;
  --afun-table-even-background: #0f212e; */
}
.theme-amount {
  color: #b1bad3;
}
.color3 {
  color: #fff;
}
.color4 {
  color: #24ee89;
}
.set-radios {
  --afun-base-img-style-radius: 12px;
}
.fixed-recharge-active {
  --tg-app-countdown-bg: #213744;
  --tg-app-countdown-border: #2f4553;
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 14px;
  --afun-base-button-font-size: 14px;
  --afun-table-th-color: #b1bad3;
}
</style>

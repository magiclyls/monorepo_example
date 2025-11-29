<script lang="ts" setup>
import type { EnumCurrencyKey, MysteryBoxDetail } from '@tg/types'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoMysteryBoxClaim, ApiMemberPromoMysteryBoxData, ApiMemberPromoMysteryBoxDetail } from '@tg/apis'
import { IconMysteryPicker,IconMysteryReward } from '@tg/icons'

interface TableList {
  deposit: string
  show_max: string
  show_min: string
}
interface ButtonState {
  text: string
  disabled: boolean
  bg: any
}

defineOptions({
  name: 'MysteryBox',
})

const { t } = useI18n()

const { openNotify } = useNotify()
const route = useRoute()
const router = useLocalRouter()
const { isLogin } = storeToRefs(useAppStore())
const { openLoginDialog } = useLoginDialog()
const currentLang = getCurrentLanguageForBackend()

const dayList = [
  { label: t('n_day', { day: 2 }), value: 2, url: '/png/promotions/mystery-2.png' },
  { label: t('n_day', { day: 3 }), value: 3, url: '/png/promotions/mystery-3.png' },
  { label: t('n_day', { day: 7 }), value: 7, url: '/png/promotions/mystery-7.png' },
  { label: t('n_day', { day: 15 }), value: 15, url: '/png/promotions/mystery-15.png' },
  { label: t('n_day', { day: 30 }), value: 30, url: '/png/promotions/mystery-30.png' },
]

const buttonState: { [key: number]: ButtonState } = {
  1: { text: t('vip_right_now'), disabled: false, bg: 'secondary' },
  2: { text: t('Received'), disabled: true, bg: 'secondary' },
  3: { text: t('vip_right_now'), disabled: true, bg: 'secondary' },
}
const pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
const curDay = ref(2)
const imgUrl = ref<string>('')
// 未登录时，要展示的数据
const config = ref<MysteryBoxDetail>()
// 登陆后用户数据
const userData = ref()
const tableInfo = ref()
const curCurrency = ref<CurrencyCode>()
const curMode = ref<'recharge' | 'loss'>('recharge')
const columns = computed<Column[]>(() => {
  return [
    {
      title: curMode.value === 'recharge' ? t('deposit_amount_label') : t('loss_amount'),
      dataIndex: 'deposit',
      align: 'center',
      width: '50%',
      slot: 'deposit_slot',
    },
    {
      title: t('mystery_reword2'),
      dataIndex: 'min',
      align: 'center',
      slot: 'reward_slot',
      width: '50%',
    },
  ]
})

// 未登录调用
const { runAsync: runAsyncConfig } = useRequest(ApiMemberPromoMysteryBoxDetail)
// 登陆后的用户数据
const { runAsync: runAsyncData, loading: userDataLoading } = useRequest(ApiMemberPromoMysteryBoxData)
// 奖金领取
const { runAsync: runAsyncClaim } = useRequest(ApiMemberPromoMysteryBoxClaim)

const activeRules = computed(() => {
  if (config.value)
    return config.value ? JSON.parse(config.value.detail)[currentLang] : ''

  else
    return ''
})
const tableList = computed<TableList[]>(() => {
  return tableInfo.value?.[curDay.value].recharge_config.filter((item: { deposit: string }) => item.deposit)
})
const highest = computed(() => {
  if (tableList.value.length > 0) {
    const maxList = tableList.value.map(item => Number(item.show_max))
    return Math.max(...maxList)
  }
  return 0
})
const curState = computed<number>(() => {
  if (!isLogin.value)
    return 3
  return Number(userData.value?.state)
})
const applyDate = computed(() => userData.value?.apply_date || '-')
const claimDate = computed(() => userData.value?.claim_at || '-')
const depositMoney = computed(() => userData.value?.deposit_amount || '0')

async function dealRunAsyncConfig() {
  config.value = await runAsyncConfig({ pid })
  const hasLang = checkLang(config.value)
  if (!hasLang)
    return
  const tableConfig = JSON.parse(config.value.config)
  tableInfo.value = tableConfig.config_info[tableConfig.currency_id]?.reward_config
  curMode.value = tableConfig.config_info[tableConfig.currency_id]?.award_mode
  curCurrency.value = tableConfig.currency_id
  const isActive = checkStart()
  if (!isActive)
    return false
  imgUrl.value = JSON.parse(config.value.images)[getCurrentLanguageForBackend()]
  if (isLogin.value)
    userData.value = await runAsyncData({ activity_id: pid, claim_day: curDay.value })
}
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

function checkStart() {
  if (config.value && config.value.apply_period == 1 && !preview) {
    openNotify({
      icon: 'uni-record-warn',
      title: t('warm_tip'),
      message: t('activity_not_start'),
    })
    goPromo()
    return false
  }
  if (config.value && config.value.apply_period == 2 && !preview) {
    openNotify({
      icon: 'uni-record-warn',
      title: t('warm_tip'),
      message: t('promo_end'),
    })
    goPromo()
    return false
  }
  return true
}
function checkLang(v: any) {
  const tongue = JSON.parse(v?.lang || '[]')
  if (!tongue.includes(getCurrentLanguageForBackend())) {
    openNotify({
      type: 'error',
      code: 'false',
      message: t('lang_not_support_promo'),
    })
    goPromo()
    return false
  }
  return true
}

async function handleDayChange(v: number) {
  if (curDay.value === v)
    return
  curDay.value = v
  if (isLogin.value)
    userData.value = await runAsyncData({ activity_id: pid, claim_day: curDay.value })
}
function codeToType(code?: CurrencyCode): EnumCurrencyKey | undefined {
  if (code)
    return Object.entries(currencyConfig).map(([k, v]) => ({ type: k as EnumCurrencyKey, ...v })).filter(item => item.cur === code)[0]?.type
}
function getBonus() {
  runAsyncClaim({ activity_id: pid, claim_day: curDay.value }).then(async (res) => {
    if (res.state == -1) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('Failed_to_collect'),
      })
    }
    else if (res.state == 1) {
      userData.value = await runAsyncData({ activity_id: pid, claim_day: curDay.value })
    }
  })
}

watch(isLogin, () => {
  isLogin.value && dealRunAsyncConfig()
})
watchEffect(() => {
  const names = JSON.parse(config.value?.name || '{}')
  if (currentLang in names)
    usePageTitle({ prefix: names[currentLang] })
})
await application.allSettled([dealRunAsyncConfig()])
</script>

<template>
  <div class="text-tg-secondary-light promo-mystery-box m-auto mb-[32px] max-w-[650px] pt-[20px] font-medium @md:mt-[32px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <!-- 天数选择 -->
    <div class="grid grid-cols-5 mb-[16px] gap-[8px]">
      <div v-for="item of dayList" :key="item.value" :class="{ 'days-bg-active': curDay == item.value }" class="days-bg shrink-0 rounded px-[12px] py-[6px]" @click="handleDayChange(item.value)">
        <div class="center mb-[8px]">
          <BaseImage class="w-[30px]" :url="item.url" />
        </div>
        <div class="text-center text-[12px] font-normal">
          {{ item.label }}
        </div>
      </div>
    </div>
    <!-- 信息展示 -->
    <div class="mb-[16px] rounded bg-[#213744] p-[12px]">
      <template v-if="isLogin">
        <div class="mb-[6px] flex text-[16px] font-normal">
          <span class="mr-auto">{{ t('registration_period') }}</span><span>{{ applyDate }}</span>
        </div>
        <div class="mb-[14px] flex text-[16px] font-normal">
          <span class="mr-auto">{{ curMode === 'recharge' ? t('n_days_all_deposit', { day: curDay }) : t('n_days_all_loss', { day: curDay }) }}</span><span class="center small-amount"><AppCurrencyIcon :currency-type="codeToType(curCurrency) || 'USDT'" /><AppAmount :amount="depositMoney" class="ml-[4px]" /></span>
        </div>
        <h3 class="mb-[6px] flex items-center font-normal text-white">
          <BaseImage url="/png/promotions/mystery-picker.png" class="mr-[6px] w-[22px]" />
          <div>
            {{ t('label_draw_time') }}
          </div>
        </h3>
        <div class="center mb-[12px] h-[42px] w-full rounded-md bg-[#1A2C38] py-[6px] font-normal text-white">
          <BaseLoading v-if="userDataLoading" />
          <span v-else>{{ claimDate }}</span>
        </div>
      </template>
      <h3 class="mb-[6px] flex items-center font-normal text-white">
        <BaseImage url="/png/promotions/mystery-reward.png" class="mr-[6px] w-[22px]" />
        <div>{{ t('mystery_reward') }}</div>
      </h3>
      <div class="center mb-[12px] h-[42px] w-full flex rounded-md bg-[#1A2C38] py-[6px] text-center font-normal leading-[30px] text-white">
        <AppCurrencyIcon :currency-type="codeToType(curCurrency) || 'USDT'" /><AppAmount :amount="highest.toFixed(2)" class="ml-[4px]" />
      </div>
      <BaseButton v-if="isLogin" :loading="userDataLoading" :bg-style="buttonState[curState]?.bg || 'secondary'" :disabled="buttonState[curState] ? buttonState[curState]?.disabled : true" class="w-full text-[16px]" @click="getBonus">
        {{ buttonState[curState]?.text ? buttonState[curState]?.text : t('vip_right_now') }}
      </BaseButton>
      <BaseButton v-else bg-style="primary" class="w-full text-[16px]" @click="openLoginDialog">
        {{ t('login_first_please') }}
      </BaseButton>
    </div>
    <div>
      <BaseTable :columns="columns" :data-source="tableList">
        <template #deposit_slot="{ record }">
          <div class="center">
            <AppAmount :amount="record.deposit" :currency-code="curCurrency" style="--tg-app-amount-font-size:14px" />
          </div>
        </template>
        <template #reward_slot="{ record }">
          <div class="center">
            <span class="mr-[4px]">{{ Number(record.show_min).toFixed(2) }}~{{ Number(record.show_max).toFixed(2) }}</span><AppCurrencyIcon :currency-type="codeToType(curCurrency) || 'USDT'" />
          </div>
        </template>
      </BaseTable>
    </div>
    <div class="mt-[8px]">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ t('activity_rule_desc') }}
      </div>
      <div class="mb-[16px] mt-[8px]">
        <AppPromotionBaseRuleText
          :content="activeRules"
          amount="0"
          :currency-type="codeToType(curCurrency) || 'USDT'"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.promo-mystery-box {
  --tg-app-amount-font-size: 16px;
  --tg-app-currency-icon-size: 16px;
  .small-amount {
    --tg-app-amount-font-size: 14px;
    --tg-app-currency-icon-size: 14px;
  }

  .days-bg {
    background-color: #0f212e;
    &-active {
      background-color: #1475e1;
      color: #fff;
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

<script lang="ts" setup>
import { ApiMemberProfitBonusApply, ApiMemberProfitConfig, ApiMemberProfitLevel } from '@tg/apis'

defineOptions({
  name: 'KeepAlivePromotionBackCash',
})
const { t } = useI18n()

const { openNotify } = useNotify()
const router = useLocalRouter()
const { jumpToUrl } = useRedirect()
const { isLogin, currentGlobalCurrency, userInfo } = storeToRefs(useAppStore())
const { userLanguage } = storeToRefs(useLanguageStore())
const { openRegisterDialog } = useRegisterDialog()
const { globalPageTitle } = useGlobalStatePageTitle()

const route = useRoute()
const imgUrl = ref('')
/** 活动配置 */
const dataProfitConfig = ref()
/** 接口返回币种,防止选择的货币没有数据 */
const memberCurrency = ref()

const {
  runAsync: runAsyncProfitConfig,
} = useRequest(ApiMemberProfitConfig, {
})
/** 盈利活动会员等级查询 */
const {
  data: dataProfitLevel,
  runAsync: runAsyncProfitLevel,
  loading: loadingProfitLevel,
} = useRequest(ApiMemberProfitLevel)
// 领取奖金
const {
  loading: loadingApply,
  runAsync: runAsyncProfitBonusApply,
} = useRequest(ApiMemberProfitBonusApply)

const pid = ref(route.query.pid?.toString() ?? '')
const preview = route.query.preview?.toString() ?? ''
const tableColumn = computed<Column[]>(() => {
  if (dataProfitConfig.value?.reward_mode === 2) {
    return [
      {
        title: `${t('vip_level')}`,
        dataIndex: 'level',
        align: 'center',
        slot: 'level',
        width: '50%',
      },
      {
        title: t('cash_back_ratio'),
        dataIndex: 'bonus_rate',
        align: 'center',
        slot: 'rate',
        width: '50%',
      },
    ]
  }
  return [
    {
      title: t('cash_back_level'),
      dataIndex: 'level',
      align: 'center',
      width: '28%',
    },
    {
      title: t('effective_bet'),
      dataIndex: 'valid_bet_amount',
      align: 'center',
      isAmount: true,
      width: '44%',
    },
    {
      title: dataProfitConfig.value?.prize_config?.bonus_type === 2 ? t('cash_back_ratio') : t('Bonus'),
      dataIndex: 'bonus_rate',
      align: 'center',
      slot: dataProfitConfig.value?.prize_config?.bonus_type === 2 ? 'rate' : 'bonus_rate',
      width: '28%',
    },
  ]
})

const tableTabData = computed(() => {
  if (dataProfitConfig.value?.reward_mode === 2)
    return dataProfitConfig.value?.prize_config?.vip_mode ?? []

  return dataProfitConfig.value?.prize_config?.profit_prize_config ?? []
})

const currentLevel = computed(() => {
  return dataProfitLevel.value ?? {
    /** 当前比例 */
    bonus_rate: '0',
    /** 当前等级 */
    level: '0',
    /** 当前有效投注 */
    valid_bet_amount: '0',
  }
})
/** 领取是否可用 */
const isReceive = computed(() => {
  if ((dataProfitLevel.value?.receive as unknown as number) === 2)
    return false

  else
    return true
})
// 下一级
const nextLevel = computed(() => {
  return dataProfitConfig.value?.prize_config.profit_prize_config[Number(currentLevel.value.level || 0)]
})
// 距离下级还需
const stillNextLevel = computed(() => {
  const levelNum = sub(Number(nextLevel.value.valid_bet_amount), Number(currentLevel.value.valid_bet_amount || 0))
  return nextLevel.value ? Number.parseFloat(levelNum).toFixed(2) : ''
})
const activeCurrency = computed(() => {
  // 虚拟币统一使用USDT
  const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
  return currencyConfig[isLogin.value ? val : languageConfig[getCurrentLanguageForFrontend()].currency]
})

// 当前有效投注占比
function percentNextLevel() {
  if (nextLevel.value) {
    if (Number(nextLevel.value.valid_bet_amount))
      return Number(div(Number(currentLevel.value.valid_bet_amount || 0), Number(nextLevel.value.valid_bet_amount))) * 100

    else
      return 0
  }
  else {
    return 100
  }
}
// 显示日期文本
function showText(s: number) {
  const bonus_type = dataProfitConfig.value?.prize_config?.bonus_type
  const str = dataProfitConfig.value?.prize_config?.bonus_type === 1 && dataProfitConfig.value?.reward_mode === 1 ? '' : '%'
  const number = dataProfitConfig.value?.prize_config.profit_prize_config.slice(-1)[0].bonus_rate + str
  switch (s) { // period
    case (86400 * 7): return t('highest_cashback_playing_games_week', { number })
    case (86400 * 14): return t('highest_cashback_playing_games_two_week', { number })
    case (86400 * 30): return t('highest_cashback_playing_games_month', { number })
    default: return t('highest_cashback_playing_games_week', { number })
  }
}
// 立即领取
function handleReceive() {
  if (isLogin.value) {
    runAsyncProfitBonusApply({
      pid: pid.value,
      cur: memberCurrency.value,
    }).then((data) => {
      if (data) {
        if (data.withdraw_type === 2) {
          openNotify({
            icon: 'uni-record-confirm',
            title: t('applying'),
            message: t('your_cashback_being_applied_for'),
          })
        }
        runAsyncProfitLevel({ pid: pid.value, cur: activeCurrency.value.cur })
        // dataProfitLevel.value.receive = false
      }
    })
  }
  else {
    openRegisterDialog()
  }
}
function runAsyncConfig() {
  return runAsyncProfitConfig({ pid: pid.value, currency: activeCurrency.value.cur }).then((data) => {
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

    dataProfitConfig.value = data
    setProfitConfig(data)
  })
}
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}
function setProfitConfig(data: any) {
  memberCurrency.value = data.currency_id
  imgUrl.value = JSON.parse(data.images)[getCurrentLanguageForBackend()]
  data.prize_config.profit_prize_config.forEach((item: any) => {
    item.currency_id = memberCurrency.value
  })
}
watchEffect(() => {
  let names = dataProfitConfig.value?.names || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
})

if (isLogin.value)
  await application.allSettled([runAsyncConfig(), runAsyncProfitLevel({ pid: pid.value, cur: activeCurrency.value.cur })])
else
  await application.allSettled([runAsyncConfig()])
</script>

<template>
  <div class="page-back-cash text-tg-text-lightgrey m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div v-if="dataProfitConfig?.reward_mode !== 2" class="bg-tg-secondary-grey bg-box mb-[16px] rounded-[4px] p-[12px] font-[600]">
      <div class="h-[48px] flex items-center justify-between">
        <div class="text-tg-text-white text-[20px]">
          {{ $t('current_level') }}{{ dataProfitLevel?.level || '0' }}
        </div>
        <AppImage width="48px" url="/png/promotions/back-cash-currency.png" />
      </div>
      <BaseProgress
        width="100%" :percent="percentNextLevel()" :show-info="false" :stroke-width="6"
        stroke-color="var(--back-cash-stroke-color)" style="--tg-base-progress-inner-bg: var(--back-cash-progress-inner-bg)"
      />
      <div v-if="nextLevel" class="text-right text-[12px]">
        {{ $t('reach_lower_level_still_need') }}<span class="theme-amount">{{ stillNextLevel }}</span>
      </div>
      <div v-else class="text-right text-[12px]">
        {{ $t('reached_highest_level') }}
      </div>
    </div>
    <div class="bg-tg-secondary-grey bg-box grid gap-y-[14px] rounded-[4px] p-[12px] font-[600]">
      <div class="text-tg-text-white text-[28px]">
        {{ $t('negative_profit_cashback') }}
      </div>
      <div class="theme-text text-[16px]" :class="[userLanguage === 'th-TH' ? 'leading-6' : '']">
        {{ showText(dataProfitConfig?.period) }}
      </div>
      <div class="theme-text text-[16px]" :class="[userLanguage === 'th-TH' ? 'leading-6' : '']">
        {{ $t('get_one_coding_can_withdraw', { count: dataProfitConfig?.multiple }) }}
      </div>
      <BaseButton
        :class="`${dataProfitLevel?.receive as any === 3 && 'bt btn-disabled'} w-[100%]`" bg-style="primary" size="md" :disabled="isReceive"
        :loading="loadingApply && loadingProfitLevel" @click="handleReceive"
      >
        {{ dataProfitLevel?.receive as unknown as number === 3 ? $t('receive_today') : $t('vip_right_now') }}
      </BaseButton>
    </div>
    <BaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableTabData">
      <template #level="{ record }">
        <div v-if="dataProfitConfig?.reward_mode === 2" class="flex items-center justify-center">
          <BaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
        </div>
        <div v-else class="flex items-center justify-center">
          {{ record.level }}
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <template v-if="dataProfitConfig.prize_config.bonus_type === 1">
          <AppAmount
            class="inline-block"
            :amount="record.bonus_rate"
            :currency-type="getCurrencyConfigByCode(dataProfitConfig.prize_config.currency_id)?.name"
          />
        </template>
        <template v-else>
          {{ record.bonus_rate }}%
        </template>
      </template>
      <template #rate="{ record }">
        <div class="flex items-center justify-center">
          <div class="relative">
            <div class="inline-table">
              {{ record.bonus_rate }}%
            </div>
            <div v-if="+userInfo?.vip === +record.level" class="current-level-label absolute left-[50%] top-[-20px] translate-x-[-50%] rounded-[12px] bg-[#f00000] px-[8px] text-[10px] font-semibold">
              <span class="relative z-[10]">{{ t('current') }}</span>
            </div>
          </div>
        </div>
      </template>
    </BaseTable>
    <AppActivityVenues
      v-if="dataProfitConfig?.platform_ids.length > 0"
      :title="$t('venues_activity')"
      :plat-form-ids="dataProfitConfig?.platform_ids"
      default-tab="3"
    />
    <div class="text-tg-text-white my-[16px] text-[18px] font-[600]">
      {{ $t('event_rules_description') }}
    </div>
    <div>
      <BaseRichArea v-if="dataProfitConfig?.rule_type === 2" :content="dataProfitConfig?.detail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfigByCode(memberCurrency)?.name"
        :amount="dataProfitConfig?.prize_limit" :content="dataProfitConfig?.detail"
      />
    </div>
    <div class="text-tg-text-white theme-color grid grid-flow-col my-[16px] h-[100%] justify-start gap-x-[16px] font-[600]">
      <div class="theme-bg bg-tg-secondary-dark rounded-[18px] px-[12px] py-[12px] text-[12px]">
        {{ $t('sports_label') }}
      </div>
      <div class="theme-bg bg-tg-secondary-dark rounded-[18px] px-[12px] py-[12px] text-[12px]">
        {{ $t('casino') }}
      </div>
    </div>
    <div v-if="dataProfitConfig?.button === 1" class="my-[24px] text-center">
      <BaseButton
        bg-style="primary" size="md"
        @click="jumpToUrl({ type: +dataProfitConfig.button_type, jumpUrl: dataProfitConfig.button_redirect })"
      >
        {{ dataProfitConfig?.button_text }}
      </BaseButton>
    </div>
  </div>
</template>

<style>
:root {
  --back-cash-stroke-color: var(--tg-text-white);
  --back-cash-progress-inner-bg: var(--tg-primary-main);
}

[theme='white'] {
  --back-cash-stroke-color: #f2ca5c;
  --back-cash-progress-inner-bg: #c1c1c1;
}

[theme='green'] {
  --back-cash-stroke-color: #1fff20;
  --back-cash-progress-inner-bg: #197b59;
}
</style>

<style lang="scss" scoped>
.bt {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #0e6746;
    --tg-secondary-text-color-theme-green: #3cb389;
  }
}
.page-back-cash {
  --tg-table-layout: fixed;
  --tg-table-th-padding-x: 8px;
  --tg-table-td-padding-x: 8px;
  --tg-table-th-word-wrap: break-word;
  --tg-table-th-white-space: normal;
}
.dialog-loading-min-height {
  min-height: 120px;
}

.bg-box {
  @include webTheme('green') {
    background-color: #055434;
  }
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
}

.theme-text {
  @include webTheme('green') {
    color: #ffffffcc;
  }
}
.btn-disabled {
  @include webTheme('white') {
    background-color: #adadad;
    color: #fff;
  }
}

.current-level-label {
  color: #fff;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: -5px;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 12px solid #f00000;
  }
}
</style>

<style lang='scss'>
.page-back-cash {
  .m-table-wrap .m-table .m-tr .m-td {
    overflow: visible !important;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

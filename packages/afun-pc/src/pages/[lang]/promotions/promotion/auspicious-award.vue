<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'
import { IconUniConfirmed } from '@tg/icons'

import { ApiMemberLuckyBetBonusApply, ApiMemberLuckyBetConfig, ApiMemberLuckyBetLevel } from '@tg/apis'

const { t } = useI18n()

const { openNotify } = useNotify()
const router = useLocalRouter()
const route = useRoute()
const { isLogin } = storeToRefs(useAppStore()) // , currentGlobalCurrency
const { openRegisterDialog } = useRegisterDialog()
const { jumpToUrl } = useRedirect()
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const { globalPageTitle } = useGlobalStatePageTitle()

/** 活动配置 */
const dataLuckyConfig = ref()

/** request 幸运赌注活动配置 */
const {
  runAsync: runGetLuckyConfig,
} = useRequest(ApiMemberLuckyBetConfig, {
  manual: true,
})

/** request 会员等级 */
const {
  data: dataLuckyLevel,
  loading: loadingLuckyLevel,
  runAsync: runGetLuckyLevel,
} = useRequest(ApiMemberLuckyBetLevel, {
  manual: true,
  ready: isLogin,
})

/** request 领取奖金 */
const {
  loading: loadingApply,
  runAsync: runAsyncBonusApply,
} = useRequest(ApiMemberLuckyBetBonusApply, {
  manual: true,
  ready: isLogin,
})

const imgUrl = ref('')
/** 接口返回币种,防止选择的货币没有数据 */
const memberCurrency = ref()

let pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
const tableColumn = computed<Column[]>(() => [
  {
    title: t('effective_bet'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    width: '50%',
    slot: 'valid_bet_amount',
  },
  {
    title: t('max_claims'),
    dataIndex: 'receive_count',
    align: 'center',
    slot: 'receive_count',
    width: '50%',
  },
])
const tableColumn2 = computed<Column[]>(() => [
  {
    title: t('bet_id'),
    dataIndex: 'lucky_number',
    align: 'center',
    width: '25%',
    slot: 'lucky_number',
  },
  {
    title: t('bonus_label'),
    dataIndex: 'bonus_multiple',
    align: 'center',
    slot: 'bonus_multiple',
    width: '25%',
  },
  {
    title: t('maximum_reward'),
    dataIndex: 'limit',
    align: 'center',
    width: '25%',
    slot: 'limit',
  },
  {
    title: t('status'),
    dataIndex: 'receive',
    align: 'center',
    width: '25%',
    slot: 'receive',
  },
])

const lucky_bet_prize_config = computed(() => {
  const temp = dataLuckyConfig.value?.prize_config?.lucky_bet_prize_config
  return temp && temp.length ? temp : []
})
const lucky_number_config = computed(() => {
  const temp = dataLuckyConfig.value?.prize_config?.lucky_number_config
  return temp && temp.length ? temp : []
})
const canReceiveLuckyNumber = computed(() => {
  return dataLuckyLevel.value && dataLuckyLevel.value.lucky_number && dataLuckyLevel.value.lucky_number.length ? dataLuckyLevel.value.lucky_number : []
})
// 审核中的号码
const pendingLuckyNumber = computed(() => {
  return dataLuckyLevel.value && dataLuckyLevel.value.lucky_number_pending && dataLuckyLevel.value.lucky_number_pending.length ? dataLuckyLevel.value.lucky_number_pending : []
})
// const activeCurrency = computed(() => {
//   // 虚拟币统一使用USDT
//   const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
//   return currencyConfig[isLogin.value ? val : languageConfig[getCurrentLanguageForFrontend()].currency]
// })
const params = computed(() => ({ pid, currency: '702' as CurrencyCode }))
/** 今日是否都领取了 */
const isTodayAllReceived = computed(() => {
  const today_receive_count = dataLuckyLevel.value && dataLuckyLevel.value.today_receive_count ? +dataLuckyLevel.value.today_receive_count : 0
  /** 已领取的次数 */
  // const user_receive_count = dataLuckyLevel.value && dataLuckyLevel.value.receive_count ? +dataLuckyLevel.value.receive_count : 0
  const last_receive_count = lucky_bet_prize_config.value.length ? lucky_bet_prize_config.value[lucky_bet_prize_config.value.length - 1]?.receive_count : 0
  return lucky_bet_prize_config.value.length ? today_receive_count === +last_receive_count : false
})

const currentLevel = computed(() => {
  return dataLuckyLevel.value ?? {
    /** 当前等级 */
    level: '0',
    /** 当前有效投注 */
    valid_bet_amount: '0',
  }
})
/** 领取是否可用 */
const isReceive = computed(() => {
  return canReceiveLuckyNumber.value.length === 0
  // if ((dataLuckyLevel.value?.receive) === 2)
  //   return false

  // else
  //   return true
})
// 下一级
const nextLevel = computed(() => {
  return lucky_bet_prize_config.value[Number(currentLevel.value.level || 0)]
})
// 距离下级还需
const stillNextLevel = computed(() => {
  let levelNum = sub(Number(nextLevel.value.valid_bet_amount), Number(currentLevel.value.valid_bet_amount || 0))
  levelNum = +levelNum >= 0 ? levelNum : '0'
  return nextLevel.value ? Number.parseFloat(levelNum).toFixed(2) : '0.00'
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

// 立即领取
function handleReceive(lucky_number?: string | number) {
  if (isLogin.value) {
    runAsyncBonusApply({
      cur: '702',
      pid,
      lucky_number,
    }).then((data) => {
      if (data) {
        if (data.withdraw_type === 2) {
          openNotify({
            icon: 'uni-record-confirm',
            title: t('submit_success_label'),
            message: t('bonus_on_the_way'),
          })
        }
        else if (data.withdraw_type === 0) {
          openNotify({
            icon: 'uni-record-err',
            title: t('fail_bonus'),
            message: t('pls_contact_us_label'),
          })
        }
        // else if (data.withdraw_type === 1 && +data.bonus_amount > 0) {
        // usePromoNotifications({ payload: JSON.stringify({ type: '2', currency_id: memberCurrency.value, bonus_amount: data.bonus_amount }) })
        // }
        runGetLuckyLevel({ pid, currency: '702' })
        runAsyncConfig()
      }
    })
  }
  else {
    openRegisterDialog()
  }
}

function setProfitConfig(data: any) {
  memberCurrency.value = data.currency_id
  imgUrl.value = JSON.parse(data.images)[getCurrentLanguageForBackend()]
  data.prize_config?.lucky_bet_prize_config?.forEach((item: any) => {
    item.currency_id = memberCurrency.value
  })
}

function runAsyncConfig() {
  return runGetLuckyConfig(params.value).then((data) => {
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
    if (data && +data.state === 2 && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
      return
    }
    if (typeof data === 'string' && data === 'refresh' && !preview) {
      // openNotify({
      //   icon: 'uni-record-warn',
      //   title: t('warm_tip'),
      //   message: t('promo_currency_error'),
      // })
      if (!dataLuckyConfig.value)
        goPromo()
    }
    else {
      dataLuckyConfig.value = data
      setProfitConfig(data)
    }
  })
}
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

function mqttRefresh() {
  setTimeout(() => {
    runAsyncConfig()
    runGetLuckyLevel(params.value)
  }, 0)
}

watch(isLogin, (val) => {
  setTimeout(() => {
    runAsyncConfig()
    runGetLuckyLevel(params.value)
  }, 0)
})

watchEffect(() => {
  let names = dataLuckyConfig.value?.names || '[]'
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
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

onActivated(() => {
  pid = route.query.pid?.toString() ?? ''
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

if (isLogin.value)
  await application.allSettled([runAsyncConfig(), runGetLuckyLevel(params.value)])
else
  await application.allSettled([runAsyncConfig()])
</script>

<template>
  <div class="text-tg-text-lightgrey page-back-cash m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>

    <div class="theme-bg bg-tg-secondary-grey mb-[16px] rounded-[4px] p-[12px] font-[600]">
      <div class="h-[48px] flex items-center justify-between">
        <div class="text-tg-text-white flex items-center gap-[4px] text-[20px]" style="--tg-app-amount-font-size: 20px;--tg-app-currency-icon-size:18px;">
          <span>{{ $t('today_efficiency_betting') }}</span> : <AppAmount class="theme-amount" :amount="dataLuckyLevel?.valid_bet_amount || '0.00'" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
        </div>
        <AppImage width="48px" url="/png/promotions/back-cash-currency.png" />
      </div>
      <BaseProgress
        class="theme-inner"
        width="100%" :percent="percentNextLevel()" :show-info="false" :stroke-width="6"
        stroke-color="var(--tg-text-white)"
      />
      <div v-if="nextLevel" class="flex items-center justify-end gap-3 text-right text-[12px]" style="--tg-app-amount-font-size: 12px;">
        <span>{{ $t('reach_lower_level_still_need') }}</span><AppAmount class="theme-amount" :amount="stillNextLevel" :show-icon="false" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
      </div>
      <div v-else class="text-right text-[12px]">
        {{ $t('reached_highest_level') }}
      </div>
    </div>

    <BaseTable class="table" :columns="tableColumn" last-first-padding :data-source="lucky_bet_prize_config">
      <template #valid_bet_amount="{ record }">
        <div class="flex items-center justify-center" style="--tg-app-amount-font-weight: 400;">
          <AppAmount class="theme-amount" :amount="record.valid_bet_amount" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
        </div>
      </template>
      <template #receive_count="{ record }">
        <div class="theme-icon flex items-center justify-center">
          <span>{{ record.receive_count }}</span><IconUniConfirmed v-if="dataLuckyLevel && +record.level <= +dataLuckyLevel.level"  class="ml-[8px]" />
        </div>
      </template>
    </BaseTable>
    <BaseDivider class="my-[16px]" />
    <BaseTable class="table" :columns="tableColumn2" last-first-padding :data-source="lucky_number_config">
      <template #lucky_number="{ record }">
        <span :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']">{{ record.lucky_number }}</span>
      </template>
      <template #bonus_multiple="{ record }">
        <span :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']">{{ record.bonus_multiple }}{{ t('multiple') }}</span>
      </template>
      <template #limit="{ record }">
        <div v-if="+record.limit > 0" class="flex items-center justify-center" :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']" style="--tg-app-amount-font-weight: 400;">
          <AppAmount class="theme-amount" :amount="record.limit" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
        </div>
        <span v-else :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']">
          {{ t('un_limit_label') }}
        </span>
      </template>
      <template #receive="{ record }">
        <a v-if="canReceiveLuckyNumber.includes(record.lucky_number)" class="text1 cursor-pointer text-sm font-medium" @click="() => handleReceive(record.lucky_number)">{{ t('receive') }}</a>
        <a v-else-if="pendingLuckyNumber.includes(record.lucky_number)" class="text1 cursor-pointer text-sm font-medium">{{ t('promo_invite_pending') }}</a>
        <span v-else>-</span>
      </template>
    </BaseTable>

    <div class="flex flex-col gap-[14px] rounded-[4px] px-0 pt-[16px] font-[600]">
      <BaseButton
        class="w-[100%]" :bg-style="dataLuckyLevel?.receive === 3 || (dataLuckyLevel?.receive === 4 && isTodayAllReceived) ? 'grey' : 'secondary'" size="md" :disabled="isReceive"
        :loading="loadingApply && loadingLuckyLevel" @click="() => handleReceive()"
      >
        <span v-if="dataLuckyLevel?.receive === 3">{{ $t('receive_today') }}</span>
        <span v-else-if="dataLuckyLevel?.receive === 4 && isTodayAllReceived">{{ t('today_all_pending') }}</span>
        <span v-else>{{ $t('promo_get_it_with_one_click') }}</span>
      </BaseButton>
    </div>

    <AppActivityVenues
      v-if="dataLuckyConfig?.platform_ids.length > 0"
      :title="$t('venues_activity')"
      :plat-form-ids="dataLuckyConfig?.platform_ids"
      default-tab="3"
    />

    <div class="text-tg-text-white my-[16px] text-[18px] font-[600]">
      {{ $t('event_rules_description') }}
    </div>
    <div class="mb-[16px]">
      <BaseRichArea v-if="dataLuckyConfig?.rule_type === 2" :content="dataLuckyConfig?.detail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfigByCode(memberCurrency)?.name"
        :amount="dataLuckyConfig?.prize_limit" :content="dataLuckyConfig?.detail"
      />
    </div>
    <div class="text-tg-text-white my-[16px] h-[100%] flex gap-[16px] font-[600]">
      <div class="bg-tg-secondary-dark theme-bottom rounded-[18px] px-[12px] py-[12px] text-[12px]">
        {{ $t('sports_label') }}
      </div>
      <div class="theme-bottom bg-tg-secondary-dark rounded-[18px] px-[12px] py-[12px] text-[12px]">
        {{ $t('casino') }}
      </div>
    </div>
    <div v-if="dataLuckyConfig?.button === 1" class="mb-[16px] text-center">
      <BaseButton
        bg-style="primary" size="md"
        @click="jumpToUrl({ type: +dataLuckyConfig.button_type, jumpUrl: dataLuckyConfig.button_redirect })"
      >
        {{ dataLuckyConfig?.button_text }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-bottom {
  @include webTheme('white') {
    background-color: #555555;
    color: #ffffff;
  }
}
.table {
  @include webTheme('greenblack') {
    --tg-table-odd-background: var(--tg-primary-main);
    --tg-table-even-background: var(--tg-secondary-dark);
  }
}
.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
.text1 {
  color: var(--tg-text-green);
  @include webTheme('greenblack') {
    .theme-amount {
      color: var(--tg-text-green);
    }
  }
  @include webTheme('white') {
    color: #ffaa09;
  }
  @include webTheme('green') {
    color: #f6d14a;
  }
}
.theme-bg {
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
  @include webTheme('green') {
    background-color: #055434;
  }
}
.theme-inner {
  --tg-base-progress-inner-bg: #d9d9d926;

  @include webTheme('white') {
    --tg-base-progress-inner-bg: #c1c1c1;
    --tg-text-white: #f2ca5c;
  }
  @include webTheme('green') {
    --tg-base-progress-inner-bg: #197b59;
    --tg-text-white: #1fff20;
  }
}
.theme-icon {
  --tg-icon-color: #00e701;
  @include webTheme('white') {
    --tg-icon-color: #ffaa09;
  }
  @include webTheme('green') {
    --tg-icon-color: #f6d14a;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

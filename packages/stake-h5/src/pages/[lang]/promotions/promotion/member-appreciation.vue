<script lang="ts" setup>
import type { MemberAppreciationDetail } from '@tg/types'
import { IconAppreciation1,IconAppreciation2 } from '@tg/icons'

import type { CurrencyCode } from '~/composables/useCurrencyData'
import { ApiMemberPromoMemberAppreciationClaim, ApiMemberPromoMemberAppreciationDetail } from '@tg/apis'

const { t } = useI18n()
const { openNotify } = useNotify()
const route = useRoute()
const router = useLocalRouter()
const appStore = useAppStore()
const { userInfo } = storeToRefs(appStore)
let pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
const { globalPageTitle } = useGlobalStatePageTitle()

const { openLoginDialog } = useLoginDialog()

const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())

const dataConfig = ref()

const activeCurrency = computed(() => {
  // 虚拟币统一使用USDT
  const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
  return currencyConfig[isLogin.value ? val : languageConfig[getCurrentLanguageForFrontend()].currency]
})

const activeCurrencyCode = computed(() => activeCurrency.value?.cur)

/** 当前活动页币种 */
const promoCurrencyCode = computed(() => dataConfig.value?.conf?.currency_id ?? activeCurrencyCode.value)

const receiveLoading = ref(false)

// const curDate1 = computed(() => dayjs.unix(dataConfig.value?.claim_day).format('YYYY/MM/DD'))
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const currentDollarZone = computed(() => dataConfig.value?.timezone)
const curDate = computed(() => dayjs.unix(dataConfig.value?.claim_day).tz(currentDollarZone.value).format('YYYY/MM/DD'))

/**
 *  状态1立即领取（活动可领取时间内）
 *  状态2已领取（活动可领取时间内，点击可领取后）
 *  状态3领取成功，审核中（活动可领取时间内，点击领取需要审核）
 *  状态4审核通过（后台审核通过）
 *  状态5审核拒绝（后台审核拒绝）
 *  状态6立即领取置灰（在活动时间内，但是没有到可领取时间）
 *  状态7审核拒绝后，还在活动时间里，按钮还是【立即领取
 */
const receiveState = ref()

const uid = computed(() => userInfo.value?.uid ?? '')

const imgUrl = computed(() => {
  const str = dataConfig.value?.img ?? ''
  try {
    return str[getCurrentLanguageForBackend()]
  }
  catch {}
  return ''
})
const descDetail = computed(() => {
  const temp = dataConfig.value?.detail ?? ''
  try {
    return temp[getCurrentLanguageForBackend()]
  }
  catch {}
  return ''
})
const maximumReward = computed(() => dataConfig.value?.maximum_reward ?? '')
const column = {
  fixed: [
    {
      title: t('each_day_commission'),
      align: 'center',
      headerSlot: 'minCondition',
      width: '50%',
      slot: 'deposit',
      dataIndex: 'min_value',
    },
    {
      title: t('bonus_amount'),
      align: 'center',
      width: '50%',
      slot: 'fixed',
      dataIndex: 'fixed',
    },
  ],
  random: [
    {
      title: t('each_day_commission'),
      align: 'center',
      width: '50%',
      headerSlot: 'minCondition',
      slot: 'deposit',
      dataIndex: 'min_value',
    },
    {
      title: t('bonus_amount'),
      align: 'center',
      width: '50%',
      slot: 'random',
      dataIndex: 'fixed',
    },
  ],
  percentage: [
    {
      title: t('each_day_commission'),
      align: 'center',
      width: '50%',
      headerSlot: 'minCondition',
      slot: 'deposit',
      dataIndex: 'min_value',
    },
    {
      title: t('bonus_amount'),
      align: 'center',
      width: '50%',
      slot: 'percentage',
      dataIndex: 'fixed',
    },
  ],
  random_percentage: [
    {
      title: t('each_day_commission'),
      align: 'center',
      headerSlot: 'minCondition',
      width: '50%',
      slot: 'deposit',
      dataIndex: 'min_value',
    },
    {
      title: t('bonus_amount'),
      align: 'center',
      width: '50%',
      slot: 'random_percentage',
      dataIndex: 'fixed',
    },
  ],

}
const modelValueRef1 = computed(() =>
  dataConfig.value?.reward_type === 'recharge'
    ? t('by_deposit')
    : dataConfig.value?.reward_type === 'loss'
      ? t('by_losses')
      : t('by_bet'),
)
const tableColumn: ComputedRef<Column[]> = computed((): Column[] => column[dataConfig.value?.conf?.amount_type])
const tableData = computed(() => {
  return dataConfig.value?.conf?.ladder || []
})
const {
  runAsync: runAsyncBaseConfig,
} = useRequest(ApiMemberPromoMemberAppreciationDetail, {
  throttleInterval: 2000,
  onSuccess: (res: MemberAppreciationDetail) => {
    if (res) {
      dataConfig.value = res
      res.state = Number(res.claim_status)
      receiveState.value = res.state

      const tongue = res.lang || []

      if (!tongue.includes(getCurrentLanguageForBackend())) {
        openNotify({
          type: 'error',
          code: 'false',
          message: t('lang_not_support_promo'),
        })
        goPromo()
      }
      // 活动已结束
      if (res.state === 9 && !preview) {
        openNotify({
          type: 'error',
          code: 'false',
          message: t('promo_end'),
        })
        goPromo()
      }
      // 活动未开始
      else if (res.state === 8 && !preview) {
        openNotify({
          icon: 'chess-gameshow',
          iconColor: '--tg-text-alltheme-green',
          title: t('warm_tip'),
          message: t('activity_not_start'),
        })
        goPromo()
      }
      // 活动已关闭
      else if (res.state === 10 && !preview) {
        openNotify({
          type: 'error',
          title: t('warm_tip'),
          message: t('activity_closed'),
        })
        goPromo()
      }
    }
    else {
      openNotify({
        type: 'error',
        title: t('activity_tip'),
        message: t('please_contact_service'),
      })
    }
  },
  onError: () => {
    goPromo()
  },
})

const {
  runAsync: runAsyncReceiveConfig,
} = useRequest(ApiMemberPromoMemberAppreciationClaim, {
  throttleInterval: 2000,
  onSuccess: (res) => {
    if (res) {
      if (Number(res) === 4) {
        receiveState.value = 12
        openNotify({
          icon: 'uni-record-warn',
          title: t('warm_tip'),
          message: t('cant_get_bonus'),
        })
      }
      else {
        receiveState.value = Number(res)
      }
    }
    else {
      openNotify({
        type: 'error',
        title: t('fail_bonus'),
        message: t('please_contact_service'),
      })
    }
  },
})
/**
 * 领取
 */
async function getBonus() {
  receiveLoading.value = true
  try {
    await runAsyncReceiveConfig({ pid, uid: uid.value, currency: activeCurrencyCode.value })
    receiveLoading.value = false
  }
  catch (error) {
    receiveLoading.value = false
  }
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

function getDetail(id: CurrencyCode) {
  runAsyncBaseConfig({ pid, uid: uid.value, currency: id })
}
function mqttRefresh() {
  setTimeout(() => {
    getDetail(promoCurrencyCode.value)
  }, 0)
}
onMounted(() => {
  appEventBus.on(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

onActivated(() => {
  pid = route.query.pid?.toString() ?? ''
})

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})
watch(isLogin, (val) => {
  getDetail(promoCurrencyCode.value)
})

watchEffect(() => {
  let names = dataConfig.value?.name || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
})
await application.allSettled([runAsyncBaseConfig({ pid, uid: uid.value, currency: activeCurrencyCode.value })])
</script>

<template>
  <div class="text-tg-text-lightgrey page-back-cash m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="text-tg-text-white theme-bg bg-tg-secondary-grey mb-[16px] rounded-[4px] p-[12px] font-[600]">
      <div>
        <label class="mb-[12px] flex items-center text-[14px]">
          <BaseImage class="mr-[10px] w-[22px]" url="/png/promotions/appreciation-1.png" />
          {{ $t('label_draw_time') }}
        </label>
        <div class="bg-tg-primary text text-center text-[18px]">
          {{ curDate }}
        </div>
      </div>
      <div>
        <label class="my-[12px] flex items-center text-[14px]">
          <BaseImage class="mr-[10px] w-[22px]" url="/png/promotions/appreciation-2.png" />
          {{ $t('maximum_eward') }}
        </label>
        <div class="text bg-tg-primary text-center text-[18px]">
          <AppAmount :amount="maximumReward" :currency-code="promoCurrencyCode" />
        </div>
      </div>
    </div>
    <div v-if="isLogin" class="mb-[16px] flex flex-col items-center justify-center">
      <BaseButton
        v-if="receiveState === 1 || receiveState === 5 || receiveState === 7 || receiveState === 12"
        :loading="receiveLoading"
        class="w-[100%]" bg-style="secondary" size="md"
        @click="getBonus"
      >
        {{ $t('vip_right_now') }}
      </BaseButton>
      <BaseButton
        v-else-if="receiveState === 2 || receiveState === 4"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
      >
        {{ $t('received') }}
      </BaseButton>
      <BaseButton
        v-else-if="receiveState === 3"
        :loading="receiveLoading"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
        @click="getBonus"
      >
        {{ t('bonus-pending-review') }}
      </BaseButton>
      <BaseButton
        v-else-if="receiveState === 6 || receiveState === 11"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
      >
        {{ $t('vip_right_now') }}
      </BaseButton>
      <BaseButton
        v-else-if="receiveState === 8"
        class="w-[100%] disabled-btn" :disabled="true" size="md"
      >
        {{ $t('promo_end') }}
      </BaseButton>
    </div>
    <div v-else class="mb-[16px] flex flex-col items-center justify-center">
      <BaseButton
        class="w-[100%] opacity-50" bg-style="secondary" size="md"
        @click.stop="openLoginDialog"
      >
        {{ $t('login_receive_money') }}
      </BaseButton>
    </div>
    <!-- <BaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #minCondition>
        <div class="flex items-center justify-center">
          {{ modelValueRef1 }}({{ $t('minimum_threshold') }}
          <span class="mr-[2px]">&ge;</span><AppAmount amount="" :currency-code="promoCurrencyCode" />)
        </div>
      </template>
      <template #deposit="{ record }">
        <div v-if="record.min_value" class="flex items-center justify-center">
          <span class="mr-[2px]">&ge;</span>
          <AppAmount :amount="record.min_value" :currency-code="promoCurrencyCode" />
        </div>
      </template>
      <template #fixed="{ record }">
        <div v-if="record.fixed" class="flex items-center justify-center">
          <AppAmount :amount="record.fixed" :currency-code="promoCurrencyCode" />
        </div>
      </template>
      <template #random="{ record }">
        <div class="flex items-center justify-center">
          <AppAmount v-if="record.range_min" :amount="record.range_min" :currency-code="promoCurrencyCode" :show-icon="false" />~&nbsp;
          <AppAmount v-if="record.range_max" :amount="record.range_max" :currency-code="promoCurrencyCode" />
        </div>
      </template>
      <template #percentage="{ record }">
        <div v-if="record.percentage" class="flex items-center justify-center">
          {{ record.percentage }}%
        </div>
      </template>
      <template #random_percentage="{ record }">
        <div class="flex items-center justify-center">
          {{ record.range_percent_min }}% ~&nbsp;
          {{ record.range_percent_max }}%
        </div>
      </template>
    </BaseTable> -->
    <div class="mt-[16px]">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ $t('activity_rule_desc') }}
      </div>
      <div class="my-[16px]">
        <BaseRichArea v-if="dataConfig?.rule_type === 2" :content="descDetail" />
        <AppPromotionBaseRuleText
          v-else :currency-type="getCurrencyConfigByCode(promoCurrencyCode)?.name"
          :amount="dataConfig?.prize_limit" :content="descDetail"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-back-cash {
  --tg-table-layout: fixed;
  --tg-table-th-padding-x: 8px;
  --tg-table-td-padding-x: 8px;
  --tg-table-th-word-wrap: break-word;
  --tg-table-th-white-space: normal;
  @include webTheme('green') {
    --green-500: #ffefb0 !important;
  }
  .theme-bg {
    @include webTheme('green') {
      background: #055434;
    }
    @include webTheme('white') {
      background-color: #f5f5f5;
    }
    > div {
      display: flex;
      flex-direction: column;
      > .text {
        @include webTheme('white') {
          --tg-primary-main: #e3e3e3;
        }
        padding: var(--tg-spacing-button-padding-vertical-md) var(--tg-spacing-button-padding-horizontal-md);
        :deep(.app-amount) {
          justify-content: center;
          --tg-app-amount-font-size: 18px;
          --tg-app-amount-font-weight: 600;
        }
      }
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

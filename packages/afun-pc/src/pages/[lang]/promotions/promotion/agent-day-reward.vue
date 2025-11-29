<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'

import { ApiMemberPromoAgentDaily, ApiMemberPromoAgentDailyReceive } from '@tg/apis'

const { t } = useI18n()
const { openNotify } = useNotify()
const route = useRoute()
const router = useLocalRouter()
const { jumpToUrl } = useRedirect()
let pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''

const { openLoginDialog } = useLoginDialog()

const { isLogin } = storeToRefs(useAppStore())
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const { globalPageTitle } = useGlobalStatePageTitle()

const data = ref()

const {
  runAsync: runGetDetail,
} = useRequest(ApiMemberPromoAgentDaily, {
  throttleInterval: 2000,
  onSuccess: (res) => {
    const temp = res?.promo_info?.config?.tongue
    let currencyArr: CurrencyCode[] = []
    let tongue = res?.promo_info?.lang || '[]'

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
    if (temp && temp !== null && temp !== undefined)
      currencyArr = Object.keys(temp) as CurrencyCode[]
    if (res && +res.activity_state === 21 && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
      return
    }
    else if (res && +res.activity_state === 20 && !preview) {
      openNotify({
        icon: 'chess-gameshow',
        iconColor: '--tg-text-alltheme-green',
        title: t('warm_tip'),
        message: t('activity_not_start'),
      })
      goPromo()
      return
    }
    else if (res && +res.activity_state === 24) {
      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('promo_currency_error'),
      })
      if (currencyArr && currencyArr.length)
        runGetDetail({ activity_id: pid, curr_id: currencyArr[0] })
      // goPromo()
      return
    }
    if (res && res !== null && res !== undefined)
      data.value = { ...res }
    console.log('进入活动详情')
  },
})

const { runAsync: runGetBonus, loading: bonusLoading } = useRequest(ApiMemberPromoAgentDailyReceive, {
  ready: isLogin,
  onSuccess: (res) => {
    if (res && res.status === 0) {
      console.log('success receive')
    }
    else {
      openNotify({
        type: 'error',
        title: t('fail_bonus'),
        message: t('please_contact_service'),
      })
    }
  },
  onError: () => {
    openNotify({
      type: 'error',
      title: t('fail_bonus'),
      message: t('please_contact_service'),
    })
  },
})

/** 所有支持的币种 */
const supportedCurrency = computed(() => {
  const temp = data.value?.promo_info?.config?.tongue
  if (temp && temp !== null && temp !== undefined)
    return Object.keys(temp)

  return []
})

const activeCurrency = computed(() => {
  // 虚拟币统一使用USDT
  /* const val = application.isVirtualCurrency(currentGlobalCurrency.value) ? 'USDT' : currentGlobalCurrency.value
  return currencyConfig[isLogin.value ? val : languageConfig[getCurrentLanguageForFrontend()].currency] */
})
/* const currentGlobalCurrency = computed(()=>{

}) */

const activeCurrencyCode = computed(() => (data.value?.promo_info.config.currency ?? '701') as CurrencyCode)

/** 当前活动页币种 */
const promoCurrencyCode = computed(() => activeCurrencyCode.value)

const serverTime = computed(() => {
  const temp = data.value?.cur_time
  return temp !== null && temp !== undefined && +temp > 0 ? temp : dayjs().valueOf()
})

const curDate = computed(() => dayjs(checkTs(serverTime.value)).date())

/** 状态  0未达 1(待领取)，2(已过期)，3(待审核)，4(已领取)，5（审核拒绝） */
const receiveState = computed(() => data.value?.state)

const tableData = computed(() => {
  const temp = data.value?.promo_info?.config?.tongue
  const d = temp !== null && temp !== undefined ? temp[promoCurrencyCode.value] : []
  if (d !== null && d !== undefined && d.length)
    return d

  return []
})

/** 表格最后一行金额数据 */
const amountArr = computed(() => {
  if (tableData.value && tableData.value.length) {
    const temp = tableData.value.slice(-1)[0]
    return [temp.commission, temp.min]
  }
})

const imgUrl = computed(() => {
  const str = data.value?.promo_info?.images ?? ''
  try {
    const obj = JSON.parse(str)
    return obj[getCurrentLanguageForBackend()]
  }
  catch {}
  return ''
})

const buttonText = computed(() => {
  const str = data.value?.promo_info?.text ?? ''
  try {
    const obj = JSON.parse(str)
    return obj[getCurrentLanguageForBackend()]
  }
  catch {}
  return ''
})

const descDetail = computed(() => {
  const temp = data.value?.promo_info?.detail ?? ''
  try {
    const obj = JSON.parse(temp)
    return obj[getCurrentLanguageForBackend()]
  }
  catch {}
  return ''
})

/** 佣金金额 */
const commissionAmount = computed(() => {
  const temp = data.value?.commission_amount
  if (temp === null || temp === undefined || temp === '')
    return 0
  else
    return temp
})

/** 奖金金额 */
const bonusAmount = computed(() => {
  const temp = data.value?.bonus_amount
  if (temp === null || temp === undefined || temp === '')
    return 0
  else
    return temp
})

const tableColumn: ComputedRef<Column[]> = computed((): Column[] => [
  {
    title: t('each_day_commission'),
    align: 'center',
    width: '50%',
    slot: 'deposit',
    dataIndex: 'deposit',
  },
  {
    title: t('extra_reward'),
    align: 'center',
    width: '50%',
    slot: 'reward',
    dataIndex: 'reward',
  },
])

/** 已登录情况下，配置注册弹窗，就不用显示按钮了 */
// const hiddenBtn = computed(() => )

function openLogin() {
  openLoginDialog()
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

function getDetail(id: CurrencyCode) {
  runGetDetail({ activity_id: pid, curr_id: id })
}

function getBonus() {
  runGetBonus({ activity_id: pid, curr_id: promoCurrencyCode.value }).finally(() => {
    getDetail(promoCurrencyCode.value)
  })
}

onActivated(() => {
  pid = route.query.pid?.toString() ?? ''
})

watch(isLogin, (val) => {
  getDetail(promoCurrencyCode.value)
})

watchEffect(() => {
  let names = data.value?.promo_info.names ?? '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
})
await application.allSettled([runGetDetail({ activity_id: pid, curr_id: activeCurrencyCode.value })])
</script>

<template>
  <div class="text-tg-text-lightgrey promo-agent-day-reward m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="theme-bg bg-tg-secondary-grey mb-[16px] flex flex-col rounded p-[12px] text-sm font-semibold">
      <div class="mb-[8px] flex justify-between">
        <span>{{ t('last_day_commission') }}:</span>
        <span><AppAmount class="theme-amount" :amount="commissionAmount" :currency-code="promoCurrencyCode" /></span>
      </div>
      <div class="mb-[8px] flex justify-between">
        <span>{{ t('today_bonus') }}:</span>
        <span class="theme-amount2"><AppAmount :amount="bonusAmount" :currency-code="promoCurrencyCode" /></span>
      </div>
      <div class="theme-bg-sec bg-tg-primary flex flex-col items-center justify-center rounded p-[12px] text-center">
        <template v-if="isLogin">
          <div v-if="receiveState && (+receiveState === 1 || +receiveState === 4)" class="flex flex-col items-center justify-center">
            <div class="theme-text text-white">
              {{ t('have_qualified') }}
            </div>
            <span class="my-[6px]"><AppAmount class="theme-amount" :amount="bonusAmount" :currency-code="promoCurrencyCode" /></span>
            <AppImage width="43px" url="/png/promotions/promo_money01.png" />
          </div>
          <div v-else class="mb-[18px] mt-[16px]">
            {{ t('not_get_bonus') }}
          </div>
          <BaseButton v-if="receiveState && +receiveState === 1" :loading="bonusLoading" class="mt-[10px] w-full" bg-style="primary" size="md" @click="getBonus">
            {{ t('vip_right_now') }}
          </BaseButton>
          <BaseButton v-else-if="receiveState && +receiveState === 4" class="custom-grey mt-[10px] w-full" bg-style="grey" size="md">
            {{ t('received') }}
          </BaseButton>
          <BaseButton v-else class="mt-[10px] w-full" bg-style="primary" size="md" @click="goPromo">
            {{ t('view_more_event') }}
          </BaseButton>
        </template>
        <template v-else>
          <div class="mb-[18px] mt-[16px]">
            {{ t('login_view_more') }}
          </div>
          <BaseButton class="mt-[10px] w-full" bg-style="primary" size="md" @click="openLogin">
            {{ t('login_now') }}
          </BaseButton>
        </template>
      </div>
    </div>
    <BaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #deposit="{ record }">
        <div class="flex items-center justify-center">
          <span class="mr-[2px]">&ge;</span><AppAmount :amount="record.commission" :currency-code="promoCurrencyCode" />
        </div>
      </template>
      <template #reward="{ record }">
        <div class="flex items-center justify-center">
          <AppAmount :amount="record.min" :currency-code="promoCurrencyCode" />
        </div>
      </template>
    </BaseTable>
    <div class="text-tg-text-white my-[16px] mt-[20px] text-[18px] font-[600]">
      {{ $t('event_rules_description') }}
    </div>
    <div class="mb-[24px]">
      <BaseRichArea v-if="data?.promo_info?.rule_type === 2" :content="descDetail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfigByCode(promoCurrencyCode)?.name"
        :amount="data?.promo_info?.prize_limit" :content="descDetail ?? ''" replace-type="2"
        :amount-arr="amountArr"
      />
    </div>
    <div v-if="data?.promo_info?.button === 1" class="mb-[24px] text-center">
      <BaseButton
        bg-style="primary" size="md"
        @click="jumpToUrl({ type: +data?.promo_info?.button_type, jumpUrl: data?.promo_info?.redirect })"
      >
        {{ buttonText }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-grey {
  --tg-base-button-default-fake-active-bg: var(--tg-text-grey-third);
  --tg-base-button-style-bg-hover: var(--tg-text-grey-third);
  @include webTheme('green') {
    --tg-base-button-style-bg: #0e6746;
    --tg-base-button-default-fake-active-bg: #0e6746;
    --tg-base-button-style-bg-hover: #0e6746;
  }
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
.theme-amount2 {
  color: var(--tg-text-error);
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
  @include webTheme('white') {
    --tg-text-error: #ed4163;
  }
  @include webTheme('green') {
    color: #eca30c;
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
.theme-bg-sec {
  @include webTheme('white') {
    background-color: #e3e3e3;
  }
}
.theme-text {
  @include webTheme('white') {
    color: #111;
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
  </route>

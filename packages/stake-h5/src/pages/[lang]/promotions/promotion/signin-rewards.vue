<script lang="ts" setup>
import { ApiMemberPromoDailySignClaim, ApiMemberPromoDailySignDetail } from '@tg/apis'

defineOptions({
  name: 'KeepAlivePromotionSigninRewards',
})

const { t } = useI18n()
const { openNotify } = useNotify()
const { openLoginDialog } = useLoginDialog()
const router = useLocalRouter()
const route = useRoute()
const { isLogin } = storeToRefs(useAppStore())
const { globalPageTitle } = useGlobalStatePageTitle()
const { userLanguage } = storeToRefs(useLanguageStore())

const pid = computed(() => String(route.query.pid))

const imgUrl = ref('')
const activeIndex = ref(0)
const currencyIcon = ref<any>('')
const currencyCode = ref<any>('')
const ruleText = ref('')
const rule_type = ref(1)
// 奖励配置 1:固定金额 2:充值比例 3:打码比例
const cond_type = ref(0)
const tabsWrapper = ref<HTMLInputElement>()

/** 获取config活动配置  */
const { runAsync: runAsyncBaseConfig, data: baseConfig } = useRequest(ApiMemberPromoDailySignDetail, {
  onSuccess: (data) => {
    if (!data)
      return
    if (!data.lang.includes(getCurrentLanguageForBackend())) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('lang_not_support_promo'),
      })
      goPromo()
    }
    if (+data.state === 2) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
    }
    countdown(data.timezone, data.count_down_start, data.count_down_end)
    try {
      const name = JSON.parse(data.names)[userLanguage.value.replace('-', '_') as any]
      globalPageTitle.value = name
      imgUrl.value = JSON.parse(data.images)[userLanguage.value.replace('-', '_')]
      ruleText.value = JSON.parse(data.detail)[userLanguage.value.replace('-', '_')]
      rule_type.value = data.rule_type
      currencyCode.value = data.currency_id
      currencyIcon.value = getCurrencyConfigByCode(currencyCode.value).name
      cond_type.value = data.cond_type
      // 0:不要高亮显示 1:要高亮显示  默认进到活动要自动选中高亮的那一天
      activeIndex.value = data.cond_base_conf.findIndex((item: Record<'highlight', number>) => item.highlight === 1)
    }
    catch (error) {}
    setTimeout(() => {
      scrollIntoView(tabsWrapper.value?.children?.[activeIndex.value])
    }, 1000)
  },
})

// 状态 0:立即领取(不可领取) 1:已过期 2:已领取 3:立即领取(可领取)
const currentDayState = ref(0)
/** 获取奖金  */
const { runAsync: runAsyncUserClaim } = useRequest(ApiMemberPromoDailySignClaim)

const loadingClaim = ref(false)

async function getBonus() {
  loadingClaim.value = true
  try {
    const data = await runAsyncUserClaim({ pid: pid.value })
    loadingClaim.value = false
    if (data !== '')
      return

    openNotify({
      type: 'success',
      title: t('warm_tip'),
      message: t('receive_success'),
    })
    baseConfig.value!.cond_base_conf![activeIndex.value].state = 2
    currentDayState.value = 2
  }
  catch (error) {
    loadingClaim.value = false
  }
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotion')
}

function onClickItem($event: any, index: number) {
  activeIndex.value = index
  scrollIntoView($event.target)
}

function scrollIntoView(ele: any) {
  if (!ele)
    return
  ele.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  })
}

let timer: NodeJS.Timeout | null = null
const leftTimeText = ref(['00', '00', '00'])
function countdown(timezone: string, start: number, end: number) {
  timer && clearInterval(timer as NodeJS.Timeout)
  // const endOfToday = dayjs().tz(timezone).endOf('day')
  // endOfToday.format('YYYY-MM-DD HH:mm:ss')
  // let leftTime = Math.floor(endOfToday.valueOf() / 1000) - Math.floor(Date.now() / 1000)
  if (end === Number(0))
    return
  let leftTime = end - start
  timer = setInterval(() => {
    leftTime--
    // 刚好到24点
    if (leftTime <= 0) {
      runAsyncBaseConfig({ pid: pid.value })
      return
    }
    const hour = Math.floor(leftTime / 3600)
    leftTimeText.value[0] = hour > 9 ? `${hour}` : `0${hour}`
    const mins = Math.floor(leftTime % 3600 / 60)
    leftTimeText.value[1] = mins > 9 ? `${mins}` : `0${mins}`
    const sec = Math.floor(leftTime % 60)
    leftTimeText.value[2] = sec > 9 ? `${sec}` : `0${sec}`
  }, 1000)
}

function sTextNumber(num: number) {
  let text = t('n_day', { day: num })
  // 找出所有数字（包含整数和小数）
  const numbers = text.match(/\d+(\.\d+)?/g)
  text = text.replace(numbers![0], `<span class="s-text">${numbers![0]}</span>`)
  return text
}

watch(isLogin, () => {
  runAsyncBaseConfig({ pid: pid.value })
})

watch([activeIndex, baseConfig], () => {
  currentDayState.value = baseConfig.value?.cond_base_conf?.[activeIndex.value]?.state
})

await application.allSettled([runAsyncBaseConfig({ pid: pid.value })])
</script>

<template>
  <div class="text-tg-text-lightgrey m-auto mt-[20px] max-w-[650px] pb-[20px]">
    <div class="aspect-[65/24] w-full flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="w-full" :url="imgUrl" is-network />
    </div>
    <div class="text-tg-text-white mb-[16px] h-[90px] w-full flex flex-col items-center rounded bg-[#213744]">
      <div class="mt-[12px] font-semibold">
        {{ t('sign_in_countdown') }}
      </div>
      <div class="mt-[10px] flex items-center justify-center">
        <div class="h-[40px] w-[40px] flex items-center justify-center border border-[#2F4553] rounded-[6px] border-solid bg-[#1A2C38]">
          {{ leftTimeText[0] }}
        </div>
        <div class="px-[13px]">
          :
        </div>
        <div class="h-[40px] w-[40px] flex items-center justify-center border border-[#2F4553] rounded-[6px] border-solid bg-[#1A2C38]">
          {{ leftTimeText[1] }}
        </div>
        <div class="px-[13px]">
          :
        </div>
        <div class="h-[40px] w-[40px] flex items-center justify-center border border-[#2F4553] rounded-[6px] border-solid bg-[#1A2C38]">
          {{ leftTimeText[2] }}
        </div>
      </div>
    </div>
    <div ref="tabsWrapper" class="hide-scrollbar scroll-container mb-[16px] w-full flex">
      <div v-for="item, index in baseConfig?.cond_base_conf" :key="item" class="item" :class="{ active: activeIndex === index }" @click="onClickItem($event, index)">
        <div>
          {{ baseConfig?.cond_period === 1 ? t('sign_in_weekly') : t('sign_in_monthly') }}
        </div>
        <div class="my-[4px] h-[42px] w-[53px]">
          <BaseImage class="w-full" url="/png/promotions/sign-in-item.png" />
        </div>
        <div v-html="sTextNumber(item.day)" />
      </div>
    </div>
    <div class="mb-[16px] rounded-[4px] bg-[#213744] px-[10px] py-[12px] text-[14px]">
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.deposit)" class="mb-[12px] flex items-center justify-between font-semibold">
        <div>{{ t('deposit_amount') }}</div>
        <AppAmount :amount="baseConfig?.cond_base_conf?.[activeIndex]?.deposit" :currency-type="currencyIcon" />
      </div>
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.bet)" class="mb-[12px] flex items-center justify-between font-semibold">
        <div>{{ t('valid_betting') }}</div>
        <AppAmount :amount="baseConfig?.cond_base_conf?.[activeIndex]?.bet" :currency-type="currencyIcon" />
      </div>
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.bonus)" class="mb-[12px] flex items-center justify-between font-semibold">
        <div>{{ t('reward_amount') }}</div>
        <AppAmount v-if="cond_type === 1" :amount="baseConfig?.cond_base_conf?.[activeIndex]?.bonus" :currency-type="currencyIcon" />
        <span v-else>{{ application.formatNumDecimal(baseConfig?.cond_base_conf?.[activeIndex]?.bonus, 2) }}%</span>
      </div>
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.extra)" class="mb-[12px] flex items-center justify-between font-semibold">
        <div>{{ t('extra_reward') }}</div>
        <AppAmount :amount="baseConfig?.cond_base_conf?.[activeIndex]?.extra" :currency-type="currencyIcon" />
      </div>
      <BaseButton v-if="!isLogin" class="h-[44px] w-[100%]" bg-style="secondary" @click="openLoginDialog">
        {{ t('login_first_please') }}
      </BaseButton>
      <BaseButton v-else-if="currentDayState === 0" class="h-[44px] w-[100%]" bg-style="secondary" disabled>
        {{ t('vip_right_now') }}
      </BaseButton>
      <BaseButton v-else-if="currentDayState === 1" class="h-[44px] w-[100%]" bg-style="secondary" disabled>
        {{ t('expired') }}
      </BaseButton>
      <BaseButton v-else-if="currentDayState === 2" class="h-[44px] w-[100%]" bg-style="secondary" disabled>
        {{ t('Received') }}
      </BaseButton>
      <BaseButton v-else-if="currentDayState === 3" class="h-[44px] w-[100%]" bg-style="secondary" :loading="loadingClaim" @click="getBonus">
        {{ t('vip_right_now') }}
      </BaseButton>
    </div>
    <AppActivityVenues
      v-if="baseConfig?.platform_ids?.length > 0"
      :title="$t('venues_activity')"
      :plat-form-ids="baseConfig?.platform_ids"
      default-tab="3"
    />
    <div v-if="baseConfig">
      <div class="text-tg-text-white text-xl font-semibold">
        {{ t('activity_rule_desc') }}
      </div>
      <div class="my-[7px]">
        <BaseRichArea v-if="rule_type === 2" :content="ruleText" />
        <AppPromotionBaseRuleText
          v-else
          amount="" :content="ruleText" replace-type="1" :currency-type="currencyIcon"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scroll-container {
  overflow: scroll;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth; /* 平滑滚动（可选） */
}
.item {
  scroll-snap-align: start;
  width: calc((100% - 60px) / 4);
  max-width: 100px;
  height: 91px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(0deg, #2f4c5f -0.32%, #1a2c38 97.58%);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2) inset;
  border: 1px solid #55758b;
  border-radius: 7px;
  font-size: 12px;
  color: #b1bad3;
  opacity: 0.5;
  margin-right: 20px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2) inset;
  padding-top: 6px;
  &:last-child {
    margin-right: 0px;
  }
  &.active {
    border: 1px solid #00e701;
    opacity: 1;
  }
}
</style>

<style>
  .s-text {
  font-weight: 600;
  color: var(--tg-text-white);
  margin: 0 3px;
  font-size: 16px;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

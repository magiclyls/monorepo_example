<script lang="ts" setup>
import { ApiMemberPromoDailySignClaim, ApiMemberPromoDailySignDetail } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseImage, AfunBaseRichArea } from '@tg/bccomponents'
import { useAppStore } from '@tg/stores'
import { SendFlutterAppMessage } from '@tg/types'
import {
  application,
  getCurrencyConfig,
  isFlutterApp,
  sendMsgToFlutterApp,
} from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { storeToRefs } from 'pinia'
import { computed, inject, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppCountdown from '~/components/AppCountdown.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({
  name: 'KeepAlivePromotionSigninRewards',
})

const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
// const { openNotify } = useNotify()
// const { openLoginDialog } = useLoginDialog()
const router = useRouter()
const route = useRoute()
const { isLogin } = storeToRefs(useAppStore())
// const { globalPageTitle } = useGlobalStatePageTitle()
const userLanguage = ref(getLang())

const pid = computed(() => String(route.query.pid))

const imgUrl = ref('')
const activeIndex = ref(0)
const currencyIcon = ref<any>('')
const currencyCode = ref<any>('')
const ruleText = ref('')
// 奖励配置 1:固定金额 2:充值比例 3:打码比例
const cond_type = ref(0)
const tabsWrapper = ref<HTMLInputElement>()
const isFirstLoading = ref<boolean>(true)
/** 获取config活动配置  */
const { runAsync: runAsyncBaseConfig, data: baseConfig } = useRequest(ApiMemberPromoDailySignDetail, {
  onSuccess: (data) => {
    let tongue = (data as any).lang || '[]'

    try {
      tongue = JSON.parse(tongue)
    }
    catch (e) {

    }

    if (!data)
      return
    if (!tongue.includes(getLangForBackend() || '')) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (+data.state === 2) {
      Message.error(t('活动已结束'))
      goPromo()
    }
    isFirstLoading.value = false
    try {
      const name = JSON.parse(data.names)[userLanguage.value.replace('-', '_') as any]
      setTitle(name)
      imgUrl.value = JSON.parse(data.images)[userLanguage.value.replace('-', '_')]
      ruleText.value = JSON.parse(data.detail)[userLanguage.value.replace('-', '_')]
      currencyCode.value = data.currency_id
      currencyIcon.value = getCurrencyConfig(currencyCode.value).name
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
const currentDollarZone = computed(() => baseConfig.value?.timezone)
const NOW = computed(() => {
  const d = dayjs.unix(Number(baseConfig.value?.count_down_start)).tz(currentDollarZone.value)
  return d
})
const countdownEndTime = computed(() => {
  const d = dayjs.unix(Number(baseConfig.value?.count_down_end)).tz(currentDollarZone.value)
  return d
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

    // Message.success(t('领取成功'))
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
    router.replace('/promotions')
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

function sTextNumber(num: number) {
  let text = t('第几天', { day: num })
  // 找出所有数字（包含整数和小数）
  const numbers = text.match(/\d+(\.\d+)?/g)
  if (numbers && numbers.length > 0) {
    text = text.replace(numbers[0], `<span class="mx-[3px] text-[16px] text-[#fff] font-[600]">${numbers[0]}</span>`)
  }
  return text
}
function getConfig() {
  runAsyncBaseConfig({ pid: pid.value })
}
watch(isLogin, () => {
  getConfig()
})

watch([activeIndex, baseConfig], () => {
  currentDayState.value = baseConfig.value?.cond_base_conf?.[activeIndex.value]?.state || 0
})

onMounted(() => {
  getConfig()
})
</script>

<template>
  <AppLoading v-if="isFirstLoading" />
  <div v-else class="signin-rewards-active flex flex-col gap-[16px]">
    <AfunBaseImage v-if="imgUrl" class="w-full" style="--tg-base-img-style-radius: 12px;" :url="imgUrl" is-network />
    <div class=" h-[90px] py-[12px] w-full flex flex-col gap-[6px] items-center justify-center rounded-[7px] bg-[#213744]">
      <div class=" font-[600]">
        {{ t('签到倒计时') }}
      </div>
      <AppCountdown :end-time="countdownEndTime" :now-time="NOW" @on-end="getConfig" />
    </div>
    <div ref="tabsWrapper" class="hide-scroll scroll-container  w-full flex gap-[19px]">
      <div v-for="(item, index) in baseConfig?.cond_base_conf" :key="index" class="item" :class="{ active: activeIndex === index }" @click="onClickItem($event, index)">
        <div class="whitespace-nowrap">
          {{ baseConfig?.cond_period === 1 ? t('每周签到') : t('每月签到') }}
        </div>
        <div class="my-[4px] h-[42px] w-[53px]">
          <AfunBaseImage class="w-full" url="/m/afun-h5/png/sign-in-item.png" />
        </div>
        <div class="leading-[16px]" v-html="sTextNumber(item.day)" />
      </div>
    </div>
    <div class="rounded-[6px] p-[12px] text-[14px] bg-[#213744] text-[#b1bad3]">
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.deposit)" class="h-[14px] mb-[12px] flex items-center justify-between font-[600]">
        <div>{{ t('充值金额') }}</div>
        <AfunBaseAmount :amount="Number(baseConfig?.cond_base_conf?.[activeIndex]?.deposit)" :currency-type="currencyIcon" />
      </div>
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.bet)" class="h-[14px] mb-[12px] flex items-center justify-between font-[600]">
        <div>{{ t('有效打码') }}</div>
        <AfunBaseAmount :amount="Number(baseConfig?.cond_base_conf?.[activeIndex]?.bet)" :currency-type="currencyIcon" />
      </div>
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.bonus)" class="h-[14px] mb-[12px] flex items-center justify-between font-[600]">
        <div>{{ t('奖励金额') }}</div>
        <AfunBaseAmount v-if="cond_type === 1" :amount="Number(baseConfig?.cond_base_conf?.[activeIndex]?.bonus)" :currency-type="currencyIcon" />
        <span v-else>{{ application.formatNumDecimal(Number(baseConfig?.cond_base_conf?.[activeIndex]?.bonus), 2) }}%</span>
      </div>
      <div v-if="Number(baseConfig?.cond_base_conf?.[activeIndex]?.extra)" class="h-[14px] mb-[12px] flex items-center justify-between font-[600]">
        <div>{{ t('额外奖励') }}</div>
        <AfunBaseAmount :amount="Number(baseConfig?.cond_base_conf?.[activeIndex]?.extra)" :currency-type="currencyIcon" />
      </div>
      <AfunBaseButton v-if="!isLogin" class="h-[44px] w-[100%]" @click="$emit('login')">
        {{ t('请先登入') }}
      </AfunBaseButton>
      <AfunBaseButton v-else-if="currentDayState === 0" class="h-[44px] w-[100%]" disabled>
        {{ t('立即领取') }}
      </AfunBaseButton>
      <AfunBaseButton v-else-if="currentDayState === 1" class="h-[44px] w-[100%]" disabled>
        {{ t('已过期') }}
      </AfunBaseButton>
      <AfunBaseButton v-else-if="currentDayState === 2" class="h-[44px] w-[100%]" disabled>
        {{ t('已领取') }}
      </AfunBaseButton>
      <AfunBaseButton v-else-if="currentDayState === 3" class="h-[44px] w-[100%]" :loading="loadingClaim" @click="getBonus">
        {{ t('立即领取') }}
      </AfunBaseButton>
    </div>
    <!-- <AppActivityVenues
      v-if="baseConfig?.platform_ids?.length > 0"
      :title="$t('venues_activity')"
      :plat-form-ids="baseConfig?.platform_ids"
      default-tab="3"
    /> -->
    <div v-if="baseConfig">
      <div class="text-[20px] leading-[28px] font-[600]">
        {{ t('活动规则说明') }}
      </div>
      <div class="mt-[8px]">
        <AfunBaseRichArea v-if="baseConfig.rule_type === 2" :content="ruleText" />
        <AppPromotionBaseRuleText
          v-else
          amount="0" :content="ruleText" replace-type="1" :is-login="isLogin" :currency-type="currencyIcon"
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
  border: 1px solid #ebebeb;
  border-radius: 7px;
  font-size: 12px;
  line-height: 17px;
  font-weight: 500;
  color: #b1bad3;
  opacity: 0.5;
  background: linear-gradient(0deg, #2f4c5f -0.32%, #1a2c38 97.58%);
  padding: 3px 0;
  &.active {
    border: 1px solid #24ee89;
    opacity: 1;
    background: linear-gradient(0deg, #2f4c5f -0.32%, #1a2c38 97.58%);
  }
}
.signin-rewards-active {
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 14px;
  --afun-base-button-font-size: 14px;
}
</style>

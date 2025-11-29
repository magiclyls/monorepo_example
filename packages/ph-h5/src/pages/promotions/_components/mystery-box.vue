<script lang="ts" setup>
import type { Column, CurrencyCode, EnumCurrencyKey, MysteryBoxDetail } from '@tg/types'
import { ApiMemberPromoMysteryBoxClaim, ApiMemberPromoMysteryBoxData, ApiMemberPromoMysteryBoxDetail } from '@tg/apis'
import { BaseLoading, PhBaseAmount, PhBaseButton, PhBaseCurrencyIcon, PhBaseImage, PhBaseTable } from '@tg/bccomponents'
import { IconChessGameshow } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { SendFlutterAppMessage } from '@tg/types'
import { application, getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { getLangForBackend, i18n } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, h, inject, ref, watch, watchEffect } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppLoading from '~/components/AppLoading.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

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

interface DayItem {
  label: string
  value: number
  url: string
}

defineOptions({
  name: 'MysteryBox',
})

const { t } = i18n.global
const setTitle = inject('setTitle', (v: string) => {})
const route = useRoute()
const router = useRouter()
const { isLogin } = storeToRefs(useAppStore())
function openLoginDialog() {
  router.replace('/login')
}
const currentLang = getLangForBackend()

const dayList: DayItem[] = [
  { label: t('第几天', { day: 2 }), value: 2, url: '/ph-h5/png/mystery-2.png' },
  { label: t('第几天', { day: 3 }), value: 3, url: '/ph-h5/png/mystery-3.png' },
  { label: t('第几天', { day: 7 }), value: 7, url: '/ph-h5/png/mystery-7.png' },
  { label: t('第几天', { day: 15 }), value: 15, url: '/ph-h5/png/mystery-15.png' },
  { label: t('第几天', { day: 30 }), value: 30, url: '/ph-h5/png/mystery-30.png' },
]

const buttonState: { [key: number]: ButtonState } = {
  1: { text: t('立即领取'), disabled: false, bg: 'secondary' },
  2: { text: t('已领取'), disabled: true, bg: 'secondary' },
  3: { text: t('立即领取'), disabled: true, bg: 'secondary' },
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
      title: curMode.value === 'recharge' ? t('存款金额') : t('最近亏损金额'),
      dataIndex: 'deposit',
      align: 'center',
      width: '50%',
      slot: 'deposit_slot',
    },
    {
      title: t('神秘奖金'),
      dataIndex: 'min',
      align: 'center',
      slot: 'reward_slot',
      width: '50%',
    },
  ]
})
const isFirstLoading = ref<boolean>(true)
// 未登录调用
const { runAsync: runAsyncConfig } = useRequest(ApiMemberPromoMysteryBoxDetail)
// 登陆后的用户数据
const { runAsync: runAsyncData, loading: userDataLoading } = useRequest(ApiMemberPromoMysteryBoxData)
// 奖金领取
const { runAsync: runAsyncClaim } = useRequest(ApiMemberPromoMysteryBoxClaim)

const activeRules = computed(() => {
  if (config.value)
    return config.value ? JSON.parse(config.value.detail)[currentLang || ''] : ''

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
  isFirstLoading.value = false
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
  imgUrl.value = JSON.parse(config.value.images)[getLangForBackend()]
  if (isLogin.value)
    userData.value = await runAsyncData({ activity_id: pid, claim_day: curDay.value })
}
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}

function checkStart() {
  if (config.value && config.value.apply_period === 1 && !preview) {
    Message.error(
      h('div', { class: 'flex items-center gap-[4rem]' }, [
        h(IconChessGameshow, { class: 'text-white' }),
        h('span', { class: 'whitespace-nowrap' }, t('活动未开始请稍后再试')),
      ]),
    )
    goPromo()
    return false
  }
  if (config.value && config.value.apply_period === 2 && !preview) {
    Message.error(t('活动已结束'))
    goPromo()
    return false
  }
  return true
}
function checkLang(v: any) {
  const tongue = JSON.parse(v?.lang || '[]')
  if (!tongue.includes(getLangForBackend())) {
    Message.error(t('当前语言不支持此活动'))
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
  if (!code)
    return undefined
  const config = getCurrencyConfig(code)
  return config.name as EnumCurrencyKey
}
// 领取奖金
function getBonus() {
  runAsyncClaim({ activity_id: pid, claim_day: curDay.value }).then(async (res) => {
    if (res.state === -1) {
      Message.error(t('领取失败'))
    }
    else if (res.state === 1) {
      userData.value = await runAsyncData({ activity_id: pid, claim_day: curDay.value })
    }
  })
}

watch(isLogin, () => {
  isLogin.value && dealRunAsyncConfig()
})
watchEffect(() => {
  const names = JSON.parse(config.value?.name || '{}')
  if (currentLang && currentLang in names)
    setTitle(names[currentLang])
})
await application.allSettled([dealRunAsyncConfig()])
</script>

<template>
  <AppLoading v-if="isFirstLoading" />
  <div v-else class="promo-mystery-box flex flex-col gap-[16rem]">
    <PhBaseImage v-if="imgUrl" class="w-full" style="--tg-base-img-style-radius: 12rem;" :url="imgUrl" is-network />
    <!-- 天数选择 -->
    <div class="grid grid-cols-5  gap-[8rem]">
      <div v-for="item of dayList" :key="item.value" :class="{ 'days-bg-active': curDay === item.value }" class="days-bg shrink-0 rounded px-[12rem] py-[6rem]" @click="handleDayChange(item.value)">
        <div class="center mb-[8rem]">
          <PhBaseImage class="w-[30rem]" :url="item.url" />
        </div>
        <div class="text-center text-[12rem] font-[500]">
          {{ item.label }}
        </div>
      </div>
    </div>
    <!-- 信息展示 -->
    <div class="bg-[#ffffff] rounded-[4rem] p-[12rem]">
      <template v-if="isLogin">
        <div class="mb-[6rem] flex text-[14rem] font-[500] text-[#6D7693]">
          <span class="mr-auto">{{ t('报名时间') }}</span><span>{{ applyDate }}</span>
        </div>
        <div class="mb-[14rem] flex text-[14rem] font-[500] text-[#6D7693]">
          <span class="mr-auto">{{ curMode === 'recharge' ? t('天总存款', { day: curDay }) : t('天总亏损', { day: curDay }) }}</span><span class="center small-amount"><PhBaseCurrencyIcon :currency-type="codeToType(curCurrency) || 'USDT'" /><PhBaseAmount :amount="depositMoney" class="ml-4" /></span>
        </div>
        <h3 class="mb-[6rem] flex items-center font-[500] text-[#0D2245]">
          <PhBaseImage url="/ph-h5/png/mystery-picker.png" class="mr-[6rem] w-[22rem]" />
          <div>
            {{ t('领取时间') }}
          </div>
        </h3>
        <div class="center mb-[12rem] h-[42rem] w-full rounded-[4rem] bg-[#F6F7F8] py-[6rem] font-[500] text-[#0D2245]">
          <BaseLoading v-if="userDataLoading" />
          <span v-else>{{ claimDate }}</span>
        </div>
      </template>
      <h3 class="mb-[6rem] flex items-center font-[500] text-[#0D2245]">
        <PhBaseImage url="/ph-h5/png/mystery-reward.png" class="mr-[6rem] w-[22rem]" />
        <div>{{ t('神秘奖励') }}</div>
      </h3>
      <div class="center mb-[12rem] h-[42rem] w-full flex rounded-[4rem] bg-[#F6F7F8] py-[6rem] text-center font-[500] leading-[30rem] text-[#0D2245]">
        <PhBaseAmount :amount="highest.toFixed(2)" :currency-type="codeToType(curCurrency) || 'USDT'" class="ml-4" />
      </div>
      <PhBaseButton v-if="isLogin" :loading="userDataLoading" :bg-style="buttonState[curState]?.bg || 'secondary'" :disabled="buttonState[curState] ? buttonState[curState]?.disabled : true" class="w-full text-sm" @click="getBonus">
        {{ buttonState[curState]?.text ? buttonState[curState]?.text : t('立即领取') }}
      </PhBaseButton>
      <PhBaseButton v-else bg-style="secondary" class="w-full text-sm" @click="openLoginDialog">
        {{ t('请先登入') }}
      </PhBaseButton>
    </div>
    <div>
      <PhBaseTable :columns="columns" :data-source="tableList">
        <template #deposit_slot="{ record }">
          <div class="center">
            <PhBaseAmount :amount="record.deposit" :currency-code="curCurrency" style="--tg-app-amount-font-size:14rem" />
          </div>
        </template>
        <template #reward_slot="{ record }">
          <div class="center">
            <span class="mr-4">{{ Number(record.show_min).toFixed(2) }}~{{ Number(record.show_max).toFixed(2) }}</span><PhBaseCurrencyIcon v-if="isLogin" :currency-type="codeToType(curCurrency) || 'USDT'" />
          </div>
        </template>
      </PhBaseTable>
    </div>
    <div class="mt-[8rem]">
      <div class="text-[#0D2245] text-[22rem] font-[500]">
        {{ t('活动规则说明') }}
      </div>
      <div class="mb-[16rem] mt-[8rem]">
        <AppPromotionBaseRuleText
          :content="activeRules"
          amount="0"
          :is-login="isLogin"
          :currency-type="codeToType(curCurrency) || 'USDT'"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.promo-mystery-box {
  --tg-app-amount-font-size: 16rem;
  --tg-app-currency-icon-size: 16rem;
  .small-amount {
    --tg-app-amount-font-size: 14rem;
    --tg-app-currency-icon-size: 14rem;
  }

  .days-bg {
    background-color: #fff;
    border: 1px solid #ebebeb;
    border-radius: 4rem;
    color: #6d7693;
    &-active {
      background-color: #f23038;
      color: #ffffff;
    }
  }
}
.set-radios {
  --tg-base-img-style-radius: 12rem;
}
</style>

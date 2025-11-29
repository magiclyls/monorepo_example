<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import type { ComputedRef } from 'vue'
import { ApiMemberPromoAgentDaily, ApiMemberPromoAgentDailyReceive } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseImage, AfunBaseRichArea, AfunBaseTable } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { IconChessGameshow } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { SendFlutterAppMessage } from '@tg/types'
import { application, getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp } from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, h, inject, onActivated, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({ name: 'AgentDayReward' })
const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
// const { openNotify } = useNotify()
const route = useRoute()
const router = useRouter()
const { jumpToUrl } = useRedirect()
let pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
const { isLogin } = storeToRefs(useAppStore())
const userLanguage = ref(getLang())
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

    if (!tongue.includes(getLangForBackend())) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (temp && temp !== null && temp !== undefined)
      currencyArr = Object.keys(temp) as CurrencyCode[]
    if (res && +res.activity_state === 21 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
      return
    }
    else if (res && +res.activity_state === 20 && !preview) {
      Message.error(
        h('div', { class: 'flex items-center gap-[4px]' }, [
          h(IconChessGameshow, { class: 'text-white' }),
          h('span', { class: 'whitespace-nowrap' }, t('活动未开始请稍后再试')),
        ]),
      )
      goPromo()
      return
    }
    else if (res && +res.activity_state === 24) {
      Message.error(t('当前选择的货币不支持此活动'))
      if (currencyArr && currencyArr.length)
        runGetDetail({ activity_id: pid, curr_id: currencyArr[0] })
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
      Message.error(t('请联系在线客服'))
    }
  },
  onError: () => {
    Message.error(t('请联系在线客服'))
  },
})

const activeCurrencyCode = computed(() => (data.value?.promo_info.config.currency ?? '701') as CurrencyCode)

/** 当前活动页币种 */
const promoCurrencyCode = computed(() => activeCurrencyCode.value)

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
    return obj[getLangForBackend()]
  }
  catch {}
  return ''
})

const buttonText = computed(() => {
  const str = data.value?.promo_info?.text ?? ''
  try {
    const obj = JSON.parse(str)
    return obj[getLangForBackend()]
  }
  catch {}
  return ''
})

const descDetail = computed(() => {
  const temp = data.value?.promo_info?.detail ?? ''
  try {
    const obj = JSON.parse(temp)
    return obj[getLangForBackend()]
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
    title: t('每日佣金'),
    align: 'center',
    width: '50%',
    slot: 'deposit',
    dataIndex: 'deposit',
  },
  {
    title: t('额外奖励'),
    align: 'center',
    width: '50%',
    slot: 'reward',
    dataIndex: 'reward',
  },
])

/** 已登录情况下，配置注册弹窗，就不用显示按钮了 */
// const hiddenBtn = computed(() => )

function openLogin() {
  router.push('/login')
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
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
    setTitle(name)
})
await application.allSettled([runGetDetail({ activity_id: pid, curr_id: activeCurrencyCode.value })])
</script>

<template>
  <div class="agent-day-reward-active text-tg-text-lightgrey promo-agent-day-reward m-auto max-w-[650px]">
    <div class="mb-[16px] center" :class="{ ' mb-[16px]': imgUrl }">
      <AfunBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div class="bg-[#213743] rounded-[4px] mb-[16px] flex flex-col rounded p-[12px] text-[14px] text-[#b1bad3] font-[600]">
      <div class="h-[14px] mb-[8px] flex justify-between">
        <span>{{ t('昨日佣金') }}:</span>
        <span><AfunBaseAmount class="text-[#b1bad3]" :amount="commissionAmount" :currency-code="promoCurrencyCode" /></span>
      </div>
      <div class="h-[14px] mb-[8px] flex justify-between">
        <span>{{ t('今日奖金') }}:</span>
        <span class="theme-amount2"><AfunBaseAmount :amount="bonusAmount" :currency-code="promoCurrencyCode" /></span>
      </div>
      <div class="bg-[#1a2c38] text-[#b1bad3] rounded-[4px] flex flex-col items-center justify-center rounded p-[12px] text-center">
        <template v-if="isLogin">
          <div v-if="receiveState && (+receiveState === 1 || +receiveState === 4)" class="flex flex-col items-center justify-center">
            <div class="text-[#fff]">
              {{ t('您已领取奖金') }}
            </div>
            <span class="my-[6px]"><AfunBaseAmount class="theme-amount" :amount="bonusAmount" :currency-code="promoCurrencyCode" /></span>
            <AfunBaseImage width="43px" url="/m/afun-h5/png/promo_money01.png" />
          </div>
          <div v-else class="mb-[18px] mt-[16px]">
            {{ t('很遗憾暂未获得奖金') }}
          </div>
          <AfunBaseButton v-if="receiveState && +receiveState === 1" :loading="bonusLoading" class="mt-[10px] w-full" @click="getBonus">
            {{ t('立即领取') }}
          </AfunBaseButton>
          <AfunBaseButton v-else-if="receiveState && +receiveState === 4" style="--afun-base-button-primary-background-color:#6D7693" class="mt-[10px] w-full">
            {{ t('已领取') }}
          </AfunBaseButton>
          <AfunBaseButton v-else class="mt-[10px] w-full" @click="goPromo">
            {{ t('查看更多活动') }}
          </AfunBaseButton>
        </template>
        <template v-else>
          <div class="mb-[18px] mt-[16px] font-[400] ">
            {{ t('登录后查看更多内容') }}
          </div>
          <AfunBaseButton class="mt-[10px] w-full" @click="openLogin">
            {{ t('立即登录') }}
          </AfunBaseButton>
        </template>
      </div>
    </div>
    <AfunBaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #deposit="{ record }">
        <div class="center">
          <span class="mr-[2px]">&ge;</span><AfunBaseAmount :amount="record.commission" :currency-code="promoCurrencyCode" />
        </div>
      </template>
      <template #reward="{ record }">
        <div class="center">
          <AfunBaseAmount :amount="record.min" :currency-code="promoCurrencyCode" />
        </div>
      </template>
    </AfunBaseTable>
    <div class="text-[#fff] my-[16px] mt-[20px] text-[18px] font-[600]">
      {{ t('活动规则') }}
    </div>
    <div class="mb-[24px]">
      <AfunBaseRichArea v-if="data?.promo_info?.rule_type === 2" :content="descDetail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfig(promoCurrencyCode)?.name"
        :is-login="isLogin"
        :amount="data?.promo_info?.prize_limit" :content="descDetail ?? ''" replace-type="2"
        :amount-arr="amountArr"
      />
    </div>
    <div v-if="data?.promo_info?.button === 1" class="mb-[24px] text-center">
      <AfunBaseButton
        bg-style="secondary" size="md"
        @click="jumpToUrl({ type: +data?.promo_info?.button_type, jumpUrl: data?.promo_info?.redirect })"
      >
        {{ buttonText }}
      </AfunBaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-grey {
  --tg-base-button-default-fake-active-bg: var(--tg-text-grey-third);
  --tg-base-button-style-bg-hover: var(--tg-text-grey-third);
}
.theme-amount2 {
  color: #ed4163;
}
.set-radios {
  --tg-base-img-style-radius: 12px;
}
.agent-day-reward-active {
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 14px;
  --afun-base-button-font-size: 14px;
}
</style>

<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import type { ComputedRef } from 'vue'
import { ApiMemberPromoAgentMonthly, ApiMemberPromoAgentMonthlyReceive } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseImage, PhBaseRichArea, PhBaseTable } from '@tg/bccomponents'
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

defineOptions({
  name: 'PromotionAgentMonthReward',
})
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
const agentRechargeCurrency = ref()
const promoCurrencyCode = computed(() => (data.value?.promo_info.config.currency ?? '701') as CurrencyCode)
const {
  data: originData,
  runAsync: runGetDetail,
} = useRequest(ApiMemberPromoAgentMonthly, {
  throttleInterval: 2000,
  onSuccess: (res, params) => {
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
    if (res) {
      if (+res.activity_state === 24) {
        if (!agentRechargeCurrency.value)
          agentRechargeCurrency.value = res.promo_cur
      }
      else {
        agentRechargeCurrency.value = params[0]?.curr_id
      }
    }

    if (res && +res.activity_state === 21 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
      return
    }
    else if (res && +res.activity_state === 20 && !preview) {
      Message.error(
        h('div', { class: 'flex items-center gap-[4rem]' }, [
          h(IconChessGameshow, { class: 'text-white' }),
          h('span', { class: 'whitespace-nowrap' }, t('活动未开始请稍后再试')),
        ]),
      )
      goPromo()
      return
    }
    else if (res && +res.activity_state === 28 && !preview) {
      Message.error(
        h('div', { class: 'flex items-center gap-[4rem]' }, [
          h(IconChessGameshow, { class: 'text-white' }),
          h('span', { class: 'whitespace-nowrap' }, t('本月已参与过该活动暂不符合参与资格')),
        ]),
      )
      goPromo()
      return
    }
    else if (res && +res.activity_state === 24) {
      Message.error(t('当前选择的货币不支持此活动'))
      if (currencyArr && currencyArr.length) {
        setTimeout(() => {
          runGetDetail({ activity_id: pid, curr_id: currencyArr[0] })
        }, 0)
      }
      // goPromo()
      return
    }
    if (res && res !== null && res !== undefined)
      data.value = { ...res }

    console.log('enter detail')
  },
})

const { runAsync: runGetBonus, loading: bonusLoading } = useRequest(ApiMemberPromoAgentMonthlyReceive, {
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

/** 状态  0未达 1(待领取)，2(已过期)，3(待审核)，4(已领取)，5（审核拒绝） */
const receiveState = computed(() => data.value?.state)

const descDetail = computed(() => {
  const temp = data.value?.promo_info?.detail ?? ''
  try {
    const obj = JSON.parse(temp)
    return obj[getLangForBackend()]
  }
  catch {}
  return ''
})

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
  return []
})

const imgUrl = computed(() => {
  const str = originData.value?.promo_info?.images ?? ''
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
    title: t('上月下级充值'),
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

function openLogin() {
  router.push('/login')
}

function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}

function getBonus() {
  runGetBonus({ activity_id: pid, curr_id: promoCurrencyCode.value }).finally(() => {
    getDetail(promoCurrencyCode.value)
  })
}

async function getDetail(id: CurrencyCode) {
  if (route.fullPath.includes('/promotion/agent-month-reward'))
    await runGetDetail({ activity_id: pid, curr_id: id })
}

onActivated(() => {
  pid = route.query.pid?.toString() ?? ''
  getDetail(promoCurrencyCode.value)
})

watch(isLogin, (val) => {
  getDetail(promoCurrencyCode.value)
})

watchEffect(() => {
  let names = data.value?.promo_info.names || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    setTitle(name)
})
await application.allSettled([runGetDetail({ activity_id: pid, curr_id: promoCurrencyCode.value })])
</script>

<template>
  <div class="text-tg-text-lightgrey promo-agent-month-reward m-auto max-w-[650rem]">
    <div class="mb-[16rem] center" :class="{ ' mb-[16rem]': imgUrl }">
      <PhBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div class="bg-[#fff] rounded-[4rem] mb-[16rem] flex flex-col rounded p-[12rem] text-[14rem] text-[#6D7693] font-[500]">
      <div class="mb-[8rem] flex justify-between">
        <span>{{ t('上月下级充值') }}:</span>
        <span><PhBaseAmount class="text-[#000]" :amount="commissionAmount" :currency-code="promoCurrencyCode" /></span>
      </div>
      <div class="mb-[8rem] flex justify-between">
        <span>{{ t('本月奖金') }}:</span>
        <span><PhBaseAmount class="theme-amount-sec" :amount="bonusAmount" :currency-code="promoCurrencyCode" /></span>
      </div>
      <div class="bg-[#F6F7F8] text-[#6D7693] rounded-[4rem]  flex flex-col items-center justify-center rounded p-[12rem] text-center">
        <template v-if="isLogin">
          <template v-if="receiveState && +receiveState === 4">
            <div class="flex flex-col items-center justify-center">
              <div class="text-[#000]">
                {{ t('您已获取领取资格') }}
              </div>
              <span class="my-[6rem] flex"><PhBaseAmount class="theme-amount" :amount="bonusAmount" :currency-code="promoCurrencyCode" /></span>
              <PhBaseImage width="43rem" url="/ph-h5/png/promo_money01.png" />
            </div>
          </template>
          <template v-else-if="receiveState && +receiveState === 1">
            <template v-if="data && +data.activity_state === 25">
              <div class="mb-[18rem] mt-[16rem]">
                {{ t('活动已结束') }}
              </div>
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center">
                <div>{{ t('您已获取领取资格') }}</div>
                <span class="my-[6rem] flex"><PhBaseAmount class="theme-amount" :amount="bonusAmount" :currency-code="promoCurrencyCode" /></span>
                <PhBaseImage width="43rem" url="/ph-h5/png/promo_money01.png" />
              </div>
              <PhBaseButton :loading="bonusLoading" class="mt-[10rem] w-full" bg-style="secondary" size="md" @click="getBonus">
                {{ t('立即领取') }}
              </PhBaseButton>
            </template>
          </template>
          <div v-else class="mb-[18rem] mt-[16rem]">
            {{ t('很遗憾暂未获得奖金') }}
          </div>
          <PhBaseButton v-if="receiveState && +receiveState === 4" style="--ph-base-button-primary-background-color:#6D7693" class="mt-10 w-full">
            {{ t('已领取') }}
          </PhBaseButton>
          <PhBaseButton v-if="!receiveState || (receiveState && +receiveState !== 1 && +receiveState !== 4) || (data && +data.activity_state === 25)" class="mt-10 w-full" @click="goPromo">
            {{ t('查看更多活动') }}
          </PhBaseButton>
        </template>
        <template v-else>
          <div class="mb-[18rem] mt-[16rem] font-[400]">
            {{ t('登录后查看更多内容') }}
          </div>
          <PhBaseButton class="mt-[10rem] w-full" bg-style="secondary" size="md" @click="openLogin">
            {{ t('立即登录') }}
          </PhBaseButton>
        </template>
      </div>
    </div>
    <PhBaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableData">
      <template #deposit="{ record }">
        <div class="center">
          <span class="mr-[2rem]">&ge;</span><PhBaseAmount :amount="record.commission" :currency-code="promoCurrencyCode" />
        </div>
      </template>
      <template #reward="{ record }">
        <div class="center">
          <PhBaseAmount :amount="record.min" :currency-code="promoCurrencyCode" />
        </div>
      </template>
    </PhBaseTable>
    <div class="text-[#0D2245] my-[16rem] mt-[20rem] text-[18rem] font-[500]">
      {{ t('活动规则') }}
    </div>
    <div class="mb-[24rem]">
      <PhBaseRichArea v-if="data?.promo_info?.rule_type === 2" :content="descDetail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfig(promoCurrencyCode)?.name"
        :is-login="isLogin"
        :amount="data?.promo_info?.prize_limit" :content="descDetail ?? ''" replace-type="2"
        :amount-arr="amountArr"
      />
    </div>
    <div v-if="data?.promo_info?.button === 1" class="mb-[24rem] text-center">
      <PhBaseButton
        bg-style="secondary" size="md"
        @click="jumpToUrl({ type: +data?.promo_info?.button_type, jumpUrl: data?.promo_info?.redirect })"
      >
        {{ buttonText }}
      </PhBaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-amount-sec {
  color: #ed4163;
}
.set-radios {
  --tg-base-img-style-radius: 12rem;
}
</style>

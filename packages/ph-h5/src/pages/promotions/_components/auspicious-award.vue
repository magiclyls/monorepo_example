<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberLuckyBetBonusApply, ApiMemberLuckyBetConfig, ApiMemberLuckyBetLevel } from '@tg/apis'
import { BaseDivider, PhBaseAmount, PhBaseButton, PhBaseImage, PhBaseProgress, PhBaseRichArea, PhBaseTable } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { IconUniConfirmed, IconUniError, IconUniRecordConfirm } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { EventBusNames, SendFlutterAppMessage } from '@tg/types'
import {
  appEventBus,
  application,
  div,
  getCurrencyConfig,
  isFlutterApp,
  sendMsgToFlutterApp,
  sub,
} from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, h, inject, onActivated, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppActivityVenues from '~/components/AppActivityVenues.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({ name: 'AuspiciousAward' })

const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
// const { openNotify } = useNotify()
const router = useRouter()
const route = useRoute()
const { isLogin } = storeToRefs(useAppStore()) // , currentGlobalCurrency
// const { openRegisterDialog } = useRegisterDialog()
const { jumpToUrl } = useRedirect()
const userLanguage = ref(getLang())
// const { globalPageTitle } = useGlobalStatePageTitle()

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
    title: t('有效投注'),
    dataIndex: 'valid_bet_amount',
    align: 'center',
    width: '50%',
    slot: 'valid_bet_amount',
  },
  {
    title: t('领取次数'),
    dataIndex: 'receive_count',
    align: 'center',
    slot: 'receive_count',
    width: '50%',
  },
])
const tableColumn2 = computed<Column[]>(() => [
  {
    title: t('注单尾号'),
    dataIndex: 'lucky_number',
    align: 'center',
    width: '25%',
    slot: 'lucky_number',
  },
  {
    title: t('奖励'),
    dataIndex: 'bonus_multiple',
    align: 'center',
    slot: 'bonus_multiple',
    width: '25%',
  },
  {
    title: t('奖励上限'),
    dataIndex: 'limit',
    align: 'center',
    width: '25%',
    slot: 'limit',
  },
  {
    title: t('状态'),
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
const params = computed(() => ({ pid, currency: '702' as CurrencyCode }))
/** 今日是否都领取了 */
const isTodayAllReceived = computed(() => {
  const today_receive_count = dataLuckyLevel.value && dataLuckyLevel.value.today_receive_count ? +dataLuckyLevel.value.today_receive_count : 0
  /** 已领取的次数 */
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
          Message.success(
            h('div', { class: 'flex items-center gap-[4rem]' }, [
              h(IconUniRecordConfirm, { class: 'text-white' }),
              h('span', { class: 'whitespace-nowrap' }, t('奖金系统正在审核中')),
            ]),
          )
        }
        else if (data.withdraw_type === 0) {
          Message.error(
            h('div', { class: 'flex items-center gap-[4rem]' }, [
              h(IconUniError, { class: 'text-white' }),
              h('span', { class: 'whitespace-nowrap' }, t('请联系在线客服')),
            ]),
          )
        }
        runGetLuckyLevel({ pid, currency: '702' })
        runAsyncConfig()
      }
    })
  }
  else {
    router.push('/login')
  }
}

function setProfitConfig(data: any) {
  memberCurrency.value = data.currency_id
  imgUrl.value = JSON.parse(data.images)[getLangForBackend()]
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

    if (!tongue.includes(getLangForBackend())) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (data && +data.state === 2 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
      return
    }
    if (typeof data === 'string' && data === 'refresh' && !preview) {
      Message.error(t('当前选择的货币不支持此活动'))
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
    router.replace('/promotions')
}

function mqttRefresh() {
  setTimeout(() => {
    runAsyncConfig()
    runGetLuckyLevel(params.value)
  }, 0)
}

watch(isLogin, () => {
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
    setTitle(name)
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
  <div class="text-tg-text-lightgrey page-back-cash m-auto  max-w-[650rem] bg-[#F6F7F8]">
    <div class="mb-[16rem] center" :class="{ ' mb-[16rem]': imgUrl }">
      <PhBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>

    <div class=" bg-[#FFF] mb-[16rem] rounded-[4rem] p-[12rem] font-[500]">
      <div class="h-[48rem] flex items-center justify-between">
        <div class="text-[#0D2245] flex items-center gap-[4rem] text-[20rem]" style="--tg-app-amount-font-size: 20rem;--tg-app-currency-icon-size:18rem;">
          <span>{{ t('今日有效投注') }}</span> :
          <PhBaseAmount class="theme-amount text-[20rem]" style="--ph-base-amount-font-size:20rem;--ph-app-currency-icon-size:18rem;" :amount="dataLuckyLevel?.valid_bet_amount || '0.00'" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
        </div>
        <PhBaseImage width="48rem" url="/ph-h5/png/back-cash-currency.png" />
      </div>
      <PhBaseProgress class="theme-inner mt-[9rem]" width="100%" :value="percentNextLevel()" :show-percentage="false" :stroke-width="6" height="6rem" background-color="#EBEBEB" bar-color="#2BA471" stroke-color="#fff" />
      <div v-if="nextLevel" class="flex items-center mt-[10rem] text-[#6D7693] justify-end gap-[3rem] text-right text-[12rem]" style="--tg-app-amount-font-size: 12rem;">
        <span>{{ t('距离下级还需') }}</span>
        <PhBaseAmount class="theme-amount" :amount="stillNextLevel" :show-icon="false" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
      </div>
      <div v-else class="text-right text-[#6D7693] text-[12rem] ">
        {{ t('已达到最高级') }}
      </div>
    </div>

    <PhBaseTable class="table" :columns="tableColumn" style="--tg-table-odd-background:#FFF;--tg-table-even-background:#F6F7F8;" last-first-padding :data-source="lucky_bet_prize_config">
      <template #valid_bet_amount="{ record }">
        <div class="center" style="--tg-app-amount-font-weight: 400;">
          <PhBaseAmount class="theme-amount" :amount="record.valid_bet_amount" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
        </div>
      </template>
      <template #receive_count="{ record }">
        <div class="center">
          <span>{{ record.receive_count }}</span>
          <IconUniConfirmed v-if="dataLuckyLevel && +record.level <= +dataLuckyLevel.level" class="ml-8 theme-icon" />
        </div>
      </template>
    </PhBaseTable>
    <BaseDivider class="my-[7rem]" />
    <PhBaseTable class="table" style="--tg-table-odd-background:#FFF;--tg-table-even-background:#F6F7F8;" :columns="tableColumn2" last-first-padding :data-source="lucky_number_config">
      <template #lucky_number="{ record }">
        <span :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']">{{ record.lucky_number }}</span>
      </template>
      <template #bonus_multiple="{ record }">
        <span :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']">{{ record.bonus_multiple }}{{ t('倍') }}</span>
      </template>
      <template #limit="{ record }">
        <div v-if="+record.limit > 0" class="center" :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']" style="--tg-app-amount-font-weight: 400;">
          <PhBaseAmount class="theme-amount" :amount="record.limit" :currency-code="dataLuckyConfig?.prize_config?.currency_id" />
        </div>
        <span v-else :class="[canReceiveLuckyNumber.includes(record.lucky_number) && 'text1']">
          {{ t('无限') }}
        </span>
      </template>
      <template #receive="{ record }">
        <a v-if="canReceiveLuckyNumber.includes(record.lucky_number)" class="text1 cursor-pointer text-sm font-[400]" @click="() => handleReceive(record.lucky_number)">{{ t('领取') }}</a>
        <a v-else-if="pendingLuckyNumber.includes(record.lucky_number)" class="text1 cursor-pointer text-sm font-[400]">{{ t('审核中') }}</a>
        <span v-else>-</span>
      </template>
    </PhBaseTable>

    <div class="flex flex-col gap-[14rem] rounded-[4rem] px-0 pt-[16rem] font-[500]">
      <PhBaseButton
        class="w-[100%]" :bg-style="dataLuckyLevel?.receive === 3 || (dataLuckyLevel?.receive === 4 && isTodayAllReceived) ? 'grey' : 'secondary'" size="md" :disabled="isReceive"
        :loading="loadingApply && loadingLuckyLevel" @click="() => handleReceive()"
      >
        <span v-if="dataLuckyLevel?.receive === 3">{{ t('当日已领取') }}</span>
        <span v-else-if="dataLuckyLevel?.receive === 4 && isTodayAllReceived">{{ t('当日已提交审核') }}</span>
        <span v-else>{{ t('一键领取') }}</span>
      </PhBaseButton>
    </div>

    <AppActivityVenues
      v-if="dataLuckyConfig?.platform_ids.length > 0"
      :title="t('活动场馆')"
      :plat-form-ids="dataLuckyConfig?.platform_ids"
      default-tab="3"
    />

    <div class="text-[##0D2245] my-[16rem] text-[18rem] font-[500]">
      {{ t('活动规则') }}
    </div>
    <div class="mb-[16rem]">
      <PhBaseRichArea v-if="dataLuckyConfig?.rule_type === 2" :content="dataLuckyConfig?.detail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfig(memberCurrency)?.name"
        :is-login="isLogin"
        :amount="dataLuckyConfig?.prize_limit" :content="dataLuckyConfig?.detail"
      />
    </div>
    <div class="text-[#0D2245] my-[16rem] h-[100%] flex gap-[16rem] font-[500]">
      <div class="bg-tg-secondary-dark theme-bottom rounded-[18rem] px-[12rem] py-[12rem] text-[12rem]">
        {{ t('体育博彩') }}
      </div>
      <div class="theme-bottom bg-tg-secondary-dark rounded-[18rem] px-[12rem] py-[12rem] text-[12rem]">
        {{ t('娱乐城') }}
      </div>
    </div>
    <div v-if="dataLuckyConfig?.button === 1" class="mb-[16rem] text-center">
      <PhBaseButton
        bg-style="secondary" size="md"
        @click="jumpToUrl({ type: +dataLuckyConfig.button_type, jumpUrl: dataLuckyConfig.button_redirect })"
      >
        {{ dataLuckyConfig?.button_text }}
      </PhBaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-bottom {
  background-color: #555555;
  color: #ffffff;
}
.table {
  --tg-table-odd-background: #1a2c38;
  --tg-table-even-background: #0f212e;
}
.theme-amount {
  color: --tg-primary-active;
}
.text1 {
  color: #2ba471;
}
.theme-bg {
  background-color: #f5f5f5;
}
.theme-inner {
  --tg-base-progress-inner-bg: #d9d9d926;
}
.theme-icon {
  color: #2ba471;
}
.set-radios {
  --tg-base-img-style-radius: 12rem;
}
</style>

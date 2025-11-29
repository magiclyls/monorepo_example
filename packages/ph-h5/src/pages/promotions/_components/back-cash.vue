<script setup lang='ts'>
import type { Column } from '@tg/types'
import { ApiMemberProfitBonusApply, ApiMemberProfitConfig, ApiMemberProfitLevel } from '@tg/apis'
import { PhBaseAmount, PhBaseButton, PhBaseImage, PhBaseProgress, PhBaseRichArea, PhBaseTable } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { useAppStore, useCurrency } from '@tg/stores'
import { languageConfig, SendFlutterAppMessage } from '@tg/types'
import { application, div, getCurrencyConfig, isFlutterApp, sendMsgToFlutterApp, sub } from '@tg/utils'
import { getLang, getLangForBackend } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed, inject, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppActivityVenues from '~/components/AppActivityVenues.vue'
import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({ name: 'PromotionBackCash' })

const setTitle = inject('setTitle', (v: string) => {})
const { t } = useI18n()
const router = useRouter()
const { jumpToUrl } = useRedirect()
const { isLogin, userInfo } = storeToRefs(useAppStore())
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const userLanguage = ref(getLang())

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
        title: t('VIP等级'),
        dataIndex: 'level',
        align: 'center',
        slot: 'level',
        width: '50%',
        visible: true,
      },
      {
        title: t('返现比例'),
        dataIndex: 'bonus_rate',
        align: 'center',
        slot: 'rate',
        width: '50%',
        visible: true,
      },
    ]
  }
  else {
    return [
      {
        title: t('返现等级'),
        dataIndex: 'level',
        align: 'center',
        slot: 'level',
        width: '28%',
        visible: true,
      },
      {
        title: t('有效投注'),
        dataIndex: 'valid_bet_amount',
        align: 'center',
        slot: 'valid_bet_amount',
        width: '44%',
        visible: true,
      },
      {
        title: dataProfitConfig.value?.prize_config?.bonus_type === 2 ? t('返现比例') : t('奖金'),
        dataIndex: 'bonus_rate',
        align: 'center',
        slot: dataProfitConfig.value?.prize_config?.bonus_type === 2 ? 'rate' : 'bonus_rate',
        width: '28%',
        visible: true,
      },
    ]
  }
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
  const val = application.isVirtualCurrency(currentGlobalCurrencyMap.value.type) ? 'USDT' : currentGlobalCurrencyMap.value.type
  return getCurrencyConfig(isLogin.value ? val : languageConfig[getLang()].currency)
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
  const type = dataProfitConfig.value?.reward_mode === 2 ? 'vip_mode' : 'profit_prize_config'
  const number = dataProfitConfig.value?.prize_config[type]?.slice(-1)?.[0]?.bonus_rate + str
  switch (s) { // period
    case (86400 * 7): return t('玩游戏将会获得最高返现', { number })
    case (86400 * 14): return t('您本2周玩游戏将会获得最高返现', { number })
    case (86400 * 30): return t('您本月玩游戏将会获得最高返现', { number })
    default: return t('玩游戏将会获得最高返现', { number })
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
          Message.success(t('您的返现正在申请中'))
        }
        runAsyncProfitLevel({ pid: pid.value, cur: activeCurrency.value.cur })
      }
    })
  }
  else {
    router.push('/login')
  }
}
function runAsyncConfig() {
  return runAsyncProfitConfig({ pid: pid.value, currency: activeCurrency.value.cur }).then((data) => {
    let tongue = (data as any).lang || '[]'

    try {
      tongue = JSON.parse(tongue)
    }
    catch (e) {

    }

    if (!tongue.includes(getLangForBackend())) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (data && +data.state !== 1 && !preview) {
      Message.error(t('活动已结束'))
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
    router.replace('/promotions')
}
function setProfitConfig(data: any) {
  memberCurrency.value = data.currency_id
  imgUrl.value = JSON.parse(data.images)[getLangForBackend()]
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
    setTitle(name)
})

if (isLogin.value)
  await application.allSettled([runAsyncConfig(), runAsyncProfitLevel({ pid: pid.value, cur: activeCurrency.value.cur })])
else
  await application.allSettled([runAsyncConfig()])
</script>

<template>
  <div class="page-back-cash text-tg-text-lightgrey m-auto mt-[16rem] max-w-[650rem]">
    <div class="mb-[16rem] center" :class="{ ' mb-[16rem]': imgUrl }">
      <PhBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>

    <div v-if="dataProfitConfig?.reward_mode !== 2" class="bg-[#fff] bg-box mb-[16rem] rounded-[4rem] p-[12rem] font-[500]">
      <div class="h-[48rem] flex items-center justify-between">
        <div class="text-[#0D2245] text-[20rem]">
          {{ t('当前等级') }}{{ dataProfitLevel?.level || '0' }}
        </div>
        <PhBaseImage class="w-[48rem]" url="/ph-h5/png/back-cash-currency.png" />
      </div>
      <PhBaseProgress class="mt-[16rem]" width="100%" :value="percentNextLevel()" :show-percentage="false" :stroke-width="6" height="6rem" background-color="#EBEBEB" bar-color="#2BA471" stroke-color="var(--bg-layer-3)" />
      <div v-if="nextLevel" class="text-right mt-[10rem] text-[12rem]">
        {{ t('距离下级还需') }}<span class="theme-amount">{{ stillNextLevel }}</span>
      </div>
      <div v-else class="text-right text-[12rem]">
        {{ t('已达到最高级') }}
      </div>
    </div>

    <div class="bg-[#fff] bg-box grid gap-y-[14rem] rounded-[4rem] p-[12rem] font-[500]">
      <div class="text-[#0D2245] text-[28rem]">
        {{ t('负盈利返现') }}
      </div>
      <div class="theme-text text-[16rem] text-[#6D7693]" :class="[userLanguage === 'th-TH' ? 'leading-6' : '']">
        {{ showText(dataProfitConfig?.period) }}
      </div>
      <div class="theme-text text-[16rem] text-[#6D7693]" :class="[userLanguage === 'th-TH' ? 'leading-6' : '']">
        {{ t('获得奖金需倍打码才可提款', { count: dataProfitConfig?.multiple }) }}
      </div>
      <PhBaseButton
        :class="`${dataProfitLevel?.receive as any === 3 && 'bt btn-disabled'} w-[100%]`" bg-style="secondary" size="md" :disabled="isReceive"
        :loading="loadingApply && loadingProfitLevel" @click="handleReceive"
      >
        {{ dataProfitLevel?.receive as unknown as number === 3 ? t('当日已领取') : t('立即领取') }}
      </PhBaseButton>
    </div>
    <PhBaseTable class="table" :columns="tableColumn" last-first-padding :data-source="tableTabData">
      <template #level="{ record }">
        <div v-if="dataProfitConfig?.reward_mode === 2" class="flex items-center justify-center">
          <PhBaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
        </div>
        <div v-else class="flex items-center justify-center">
          {{ record.level }}
        </div>
      </template>
      <template #valid_bet_amount="{ record }">
        <div class="flex items-center justify-center">
          <PhBaseAmount
            :amount="record.valid_bet_amount"
            :currency-type="getCurrencyConfig(dataProfitConfig.prize_config.currency_id)?.name"
          />
        </div>
      </template>
      <template #bonus_rate="{ record }">
        <div class="flex items-center justify-center">
          <div class="relative">
            <template v-if="dataProfitConfig.prize_config.bonus_type === 1">
              <PhBaseAmount
                :amount="record.bonus_rate"
                :currency-type="getCurrencyConfig(dataProfitConfig.prize_config.currency_id)?.name"
              />
            </template>
            <template v-else>
              {{ record.bonus_rate }}%
            </template>
          </div>
        </div>
      </template>
      <template #rate="{ record }">
        <div class="flex items-center justify-center">
          <div class="relative">
            <div class="inline-table">
              {{ record.bonus_rate }}%
            </div>
            <div v-if="+userInfo?.vip === +record.level" class="current-level-label absolute left-[50%] top-[-20px] translate-x-[-50%] rounded-[12px] bg-[#f00000] px-[8px] text-[10px] font-semibold">
              <span class="relative z-[10]">{{ t('当前') }}</span>
            </div>
          </div>
        </div>
      </template>
    </PhBaseTable>
    <AppActivityVenues
      v-if="dataProfitConfig?.platform_ids.length > 0" :title="t('活动场馆')"
      :plat-form-ids="dataProfitConfig?.platform_ids" default-tab="3"
    />
    <div class="text-[#0D2245] my-[16rem] text-[18rem] font-[500]">
      {{ t('活动规则') }}
    </div>
    <div>
      <PhBaseRichArea v-if="dataProfitConfig?.rule_type === 2" :content="dataProfitConfig?.detail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="getCurrencyConfig(memberCurrency)?.name"
        :is-login="isLogin"
        :amount="dataProfitConfig?.prize_limit" :content="dataProfitConfig?.detail"
      />
    </div>
    <div v-if="dataProfitConfig?.button === 1" class="my-[24rem] text-center">
      <PhBaseButton
        bg-style="secondary" size="md"
        @click="jumpToUrl({ type: +dataProfitConfig.button_type, jumpUrl: dataProfitConfig.button_redirect })"
      >
        {{ dataProfitConfig?.button_text }}
      </PhBaseButton>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.set-radios {
  --tg-base-img-style-radius: 12rem;
  --tg-table-odd-background: #fff;
  --tg-table-even-background: transparent;
  --tg-table-th-background: transparent;
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

<script lang="ts" setup>
import type { Column, CurrencyCode } from '@tg/types'
import { ApiMemberPromoDailyBonusBet, ApiMemberPromoDailyBonusClaim, ApiMemberPromoDailyBonusDetail } from '@tg/apis'
import { AfunBaseAmount, AfunBaseButton, AfunBaseImage, AfunBaseProgress, AfunBaseRichArea, AfunBaseTable } from '@tg/bccomponents'
import { useRedirect } from '@tg/hooks'
import { IconUniRecordConfirm } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
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
import { computed, h, inject, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppActivityVenues from '~/components/AppActivityVenues.vue'

import AppPromotionBaseRuleText from '~/components/AppPromotionBaseRuleText'
import { Message } from '~/utils'

defineOptions({
  name: 'KeepAlivePromotionBettingRewards',
})
const setTitle = inject('setTitle', (v: string) => { })
const { t } = useI18n()
// const { openNotify } = useNotify()
const router = useRouter()
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap } = storeToRefs(currencyStore)
const userLanguage = ref(getLang())
const { jumpToUrl } = useRedirect()
const { isLogin } = storeToRefs(useAppStore())
const currentLang = getLangForBackend()
const route = useRoute()
/** 从链接中获取活动的PID */
const pid = route.query.pid?.toString() ?? ''
const preview = route.query.preview?.toString() ?? ''
/** 图片地址 */
const imgUrl = ref('')
/** 活动配置数据 */
const dataProfitConfig = ref()

/** 当日、次日、本周、本月投注领取查询 */
const dataPromoDailyBonusBet = ref()

/** 接口返回币种,防止选择的货币没有数据 */
const memberCurrency = ref<CurrencyCode>('701')

/** 可领取的奖励总计 */
let totalBonus = 0
const displayedBonus = ref(0)

/** 当前领取的有效投注 */
const tempTier = ref(0)
const { userInfo } = storeToRefs(useAppStore())

/** 接口: 活动配置 */
const {
  data: detailData,
  runAsync: runAsyncProfitConfig,
} = useRequest(ApiMemberPromoDailyBonusDetail)

const activeCurrency = computed(() => {
  return getCurrencyConfig(currentGlobalCurrencyMap.value?.cur || memberCurrency.value)
})

const currentCurrencyCode = computed(() => {
  return currentGlobalCurrencyMap.value?.cur || memberCurrency.value
})

// 根据模式选择币种ID（用于API调用）
const selectedCurrencyId = computed(() => {
  if (dataProfitConfig.value?.method === 1) {
    return memberCurrency.value
  }
  return currentCurrencyCode.value
})

const selectedCurrencyName = computed(() => {
  if (dataProfitConfig.value?.method === 2) {
    return getCurrencyConfig(currentGlobalCurrencyMap.value?.cur || memberCurrency.value)?.name
  }
  return getCurrencyConfig(memberCurrency.value)?.name
})

/** 接口: 当日、次日、本周、本月投注领取查询 */
const {
  runAsync: runAsyncProfitLevel2,
} = useRequest(ApiMemberPromoDailyBonusBet, {
  onSuccess: (data) => {
    dataPromoDailyBonusBet.value = data
  },
})
/** 接口: 当日、次日、本周、本月投注领取查询 */
const {
  runAsync: runAsyncProfitLevel,
  loading: loadingProfitLevel,
} = useRequest(ApiMemberPromoDailyBonusBet, {
  onSuccess: (data) => {
    if (data?.t) {
      if (data.t === currentCurrencyCode.value)
        dataPromoDailyBonusBet.value = data

      else
        runAsyncProfitLevel2({ pid, currency: selectedCurrencyId.value as CurrencyCode })
    }
    else {
      dataPromoDailyBonusBet.value = data
    }
    totalBonus = 0
    displayedBonus.value = 0
  },
})

/** 接口: 领取奖金 */
const {
  loading: loadingApply,
  runAsync: runAsyncProfitBonusApply,
} = useRequest(ApiMemberPromoDailyBonusClaim)

/** 表格:列，后台配置：梯级模式 */
const tableColumnAll = computed<Column[]>(() => [
  {
    title: t('有效投注'),
    dataIndex: 'valid',
    align: 'center',
    isAmount: true,
    slot: 'valid_bet_amount',
    width: '50%',
  },
  {
    title: dataProfitConfig.value?.bonus_type === 1 ? t('奖励') : t('返现比例'),
    dataIndex: 'bonus',
    align: 'center',
    isAmount: true,
    slot: dataProfitConfig.value?.bonus_type === 1 ? 'bonus_rate' : 'rate',
    width: '50%',
  },
  // {
  //   title: t('状态'),
  //   dataIndex: 'bonus',
  //   align: 'center',
  //   slot: 'receive',
  //   width: '28%',
  // },
])

/** 表格:列，后台配置：VIP模式 */
const tableColumnTop = computed<Column[]>(() => [
  {
    title: t('VIP等级'),
    dataIndex: 'valid',
    align: 'center',
    isAmount: true,
    slot: 'level',
    width: '50%',
  },
  {
    title: t('返现比例'),
    dataIndex: 'bonus',
    align: 'center',
    isAmount: true,
    slot: 'rate',
    width: '50%',
  },
])
// 是否参与活动
const isPartCurrencyId = computed(() => {
  // 监听是否参与活动的货币
  return dataPromoDailyBonusBet.value?.t as CurrencyCode ?? null
})
/** 更新当日、次日、上周、上月的数据 */
const dataProfitLevel = computed(() => {
  const period = dataProfitConfig.value?.period
  switch (period) {
    case 1:
      return dataPromoDailyBonusBet.value?.d[1]
    default:
      return dataPromoDailyBonusBet.value?.d[0]
  }
})
/** 更新当日的数据 */
const dataProfitLevelToday = computed(() => {
  return dataPromoDailyBonusBet.value?.d[1]
})

/** 优惠是否终止 */
const isDiscountEnd = computed(() => {
  if (dataPromoDailyBonusBet.value?.s === '1')
    return false

  else
    return true
})

/** 后台配置是”1:全部领取“还是”2:最高档领取“，启用不同的列 */
const tableColumn = computed(() => {
  return dataProfitConfig.value?.method === 1 ? tableColumnAll.value : tableColumnTop.value
})

const tableDataSource = computed(() => {
  let data = []
  if (dataProfitConfig.value?.method === 2) {
    data = dataProfitConfig.value?.vip_mode ?? []
  }
  else {
    data = dataProfitConfig.value?.currency ?? []
  }
  return data.filter((item: any) => Number(item.bonus_rate || item.bonus || 0) !== 0)
})

/** 最高可获得奖励 */
const maxBonus = computed(() => {
  let _maxBonus = 0

  if (dataProfitConfig.value?.method === 1 && dataProfitConfig.value?.currency) {
    // 根据周期选择对应的有效投注金额
    const period = dataProfitConfig.value?.period
    const validBetAmount = period === 1
      ? Number(dataProfitLevelToday.value?.valid_bet_amount ?? 0)
      : Number(dataProfitLevel.value?.valid_bet_amount ?? 0)

    // 找到有效投注金额达到的最高阶级
    let matchedTier = null
    for (const item of dataProfitConfig.value.currency) {
      if (validBetAmount >= Number(item.valid)) {
        matchedTier = item
      }
      else {
        break
      }
    }

    _maxBonus = matchedTier ? Number.parseFloat(matchedTier.bonus) : 0
  }
  else if (dataProfitConfig.value?.method === 2 && dataProfitConfig.value?.currency) {
    _maxBonus = Number.parseFloat(dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1].bonus)
  }
  return _maxBonus.toFixed(2)
})

/** 当前可领取的等级 */
const currentLevel = computed(() => {
  return dataProfitLevel.value?.valid_bet_amount ?? '0'
})

/** 当日可领取的等级 */
const todayLevel = computed(() => {
  return dataProfitLevelToday.value?.valid_bet_amount ?? '0'
})

// 当前下一级领取奖励水平的数据
const nextLevel = computed(() => {
  const _currentLevel = dataProfitConfig.value?.period === 1 ? currentLevel.value : todayLevel.value
  if (dataProfitConfig.value?.currency) {
    const level = dataProfitConfig.value.currency.find((item: any) => item.valid >= Number(_currentLevel) + 0.01)
    return level
  }
  else {
    return null
  }
})

// 当前记录可领取奖励
const currAvaiLevel = computed(() => {
  if (dataProfitConfig.value?.currency && Number(currentLevel.value) > 0) {
    if (Number(currentLevel.value) >= dataProfitConfig.value.currency[0].valid && Number(currentLevel.value) <= dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1].valid)
      return dataProfitConfig.value.currency.find((item: any) => (Number(currentLevel.value) <= item.valid))

    else if (Number(currentLevel.value) > dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1].valid)
      return dataProfitConfig.value.currency[dataProfitConfig.value.currency.length - 1]
  }
  return null
})

// 距离下级奖励还需多少
const stillNextLevel = computed(() => {
  const _currentLevel = dataProfitConfig.value?.period === 1 ? currentLevel.value : todayLevel.value
  const levelNum = sub(Number(nextLevel.value ? nextLevel.value.valid : 0), Number(_currentLevel || 0))
  return nextLevel.value ? Number.parseFloat(levelNum).toFixed(2) : ''
})

// 当日、次日、本周、本月投注的文案
const periodText = computed(() => {
  const period = dataProfitConfig.value?.period
  switch (period) {
    case 1:
      return t('今日有效投注')
    case 2:
      return t('今日有效投注')
    case 3:
      return t('本周有效投注')
    case 4:
      return t('本月有效投注')
    default:
      return t('今日有效投注')
  }
})

// 次日、上周、上月投注的文案
const lastPeriodText = computed(() => {
  const period = dataProfitConfig.value?.period
  switch (period) {
    case 2:
      return t('昨日有效投注')
    case 3:
      return t('上周有效投注')
    case 4:
      return t('上月有效投注')
    default:
      return ''
  }
})

// 一键领取是否显示
const isShowReceive = computed(() => {
  return dataProfitConfig.value?.period === 1
})

// 审核状态
const isAudit = computed(() => {
  return dataProfitConfig.value?.automatic === 2
})

/** 领取是否可用1:已经领取 0：没有领取 */
const isReceive = computed(() => {
  if (dataPromoDailyBonusBet.value?.v?.length) // 新逻辑
    return true

  if (displayedBonus.value > 0)
    return false

  else if ((isPartCurrencyId.value) && displayedBonus.value === 0)
    return true

  else return undefined
})

// 有可领取金额取可领取金额， 否则取有效投注
const isBetAmountZero = computed(() => {
  const period = dataProfitConfig.value?.period
  const validBetAmount = Number(dataProfitLevel.value?.valid_bet_amount ?? 0)
  // const validBetAmount = period === 1
  //   ? Number(dataProfitLevelToday.value?.valid_bet_amount ?? 0)
  //   : Number(dataProfitLevel.value?.valid_bet_amount ?? 0)
  const amount = Number(validBetAmount)
  return amount === 0
})

function getRateByAmount(data, targetAmount) {
  if (!targetAmount || !data || data.length === 0) {
    return null
  }

  const sorted = [...data].sort((a, b) => +a.valid - +b.valid)

  let matchedTier = null
  for (let i = 0; i < sorted.length; i++) {
    if (+sorted[i].valid <= targetAmount) {
      matchedTier = sorted[i]
    }
    else {
      break
    }
  }

  return matchedTier
}

const currentVipBonusRate = computed(() => {
  const currentVipLevel = userInfo.value?.vip ?? 0

  if (dataProfitConfig.value?.method === 2) {
    const vipConfig = dataProfitConfig.value?.vip_mode?.find((item: any) => Number(item.level) === Number(currentVipLevel))
    return Number(vipConfig?.bonus_rate ?? 0)
  }

  if (dataProfitConfig.value?.bonus_type === 2 && dataProfitConfig.value?.method === 1) {
    const currencyConfig = getRateByAmount(dataProfitConfig.value?.currency, +dataProfitLevel.value?.valid_bet_amount)
    return Number(currencyConfig?.bonus ?? 0)
  }

  return 0
})

const calculatedReceivableAmount = computed(() => {
  if (dataProfitConfig.value?.bonus_type === 1 && dataProfitConfig.value?.method === 1) {
    return maxBonus.value
  }

  const period = dataProfitConfig.value?.period
  const validBetAmount = period === 1
    ? Number(dataProfitLevelToday.value?.valid_bet_amount ?? 0)
    : Number(dataProfitLevel.value?.valid_bet_amount ?? 0)

  const calculatedAmount = validBetAmount * currentVipBonusRate.value / 100
  return calculatedAmount
})

// 当前有效投注占比
function percentNextLevel() {
  const _currentLevel = dataProfitConfig.value?.period === 1 ? currentLevel.value : todayLevel.value
  if (nextLevel.value) {
    if (Number(nextLevel.value.valid))
      return Number(div(Number(_currentLevel || 0), Number(nextLevel.value.valid))) * 100

    else
      return 0
  }
  else {
    return 100
  }
}

/** 当前记录是否已领取 */
function isReceiveCurRecord(record: any) {
  const isvArr = dataPromoDailyBonusBet.value?.v ?? []
  if (isvArr.includes(record.valid))
    return true

  else return false
}
/** 延时显示：计算总奖金 */
function calculateBonus(data: number) {
  setTimeout(() => {
    if (data === 0) {
      totalBonus = 0
      displayedBonus.value = 0
    }
    totalBonus += data
    displayedBonus.value = totalBonus
  }, 0)
}
/** 是否等于当前领取的等级 0: 领取 -1: 已领取 1: 其它 */
function isCurrentLevel(currentLevel: any, record: any, type: number) {
  if (isReceiveCurRecord(record)) {
    return -1
  }
  else if (Number.parseFloat(record.valid) <= Number.parseFloat(currentLevel)) {
    if (dataProfitConfig.value.method === 2) {
      if (Number.parseFloat(currAvaiLevel.value.valid) === Number.parseFloat(record.valid)) {
        calculateBonus(Number.parseFloat(record.bonus))
        return 0
      }
      else {
        const index = dataProfitConfig.value?.currency.findIndex((item: any) => item.valid === Number.parseFloat(currAvaiLevel.value.valid))
        const hightestArr = dataProfitConfig.value?.currency[index]
        if ((record.valid === hightestArr.valid) && (type === 1)) {
          calculateBonus(Number.parseFloat(record.bonus))
          return 0
        }
        else {
          return 1
        }
      }
    }
    else {
      if (type === 1) {
        totalBonus = 0
        if (tempTier.value === record.valid)
          totalBonus -= record.bonus

        else
          calculateBonus(Number.parseFloat(record.bonus))
      }
      return 0
    }
  }
  else {
    return 1
  }
}
// 一键领取, tier: 0: 全部领取 or 领取最高档 ,有效投注金额值：分段领取
function handleReceive(tier: number) {
  if (isLogin.value) {
    if (isDiscountEnd.value) {
      Message.error(t('活动已结束'))
      return
    }
    if (tier)
      tempTier.value = tier
    runAsyncProfitBonusApply({
      pid,
      tier,
      currency: selectedCurrencyId.value as CurrencyCode,
    }).then((data) => {
      if (!data) {
        if (tier)
          tempTier.value = tier

        if (dataProfitConfig.value?.automatic === 2) {
          Message.success(
            h('div', { class: 'flex items-center gap-[4px]' }, [
              h(IconUniRecordConfirm, { class: 'text-white' }),
              h('span', { class: 'whitespace-nowrap' }, t('奖金系统正在审核中')),
            ]),
          )
          runAsyncProfitLevel({ pid, currency: selectedCurrencyId.value as CurrencyCode })
        }
        else {
          currencyStore.initCurrencyList()
        }
        calculateBonus(0)
      }
      else if (data === '操作失败') {
        Message.error(t('领取失败'))
      }
      else {
        console.log('领取事件成功:', data)
        if (isAudit.value) {
          Message.success(
            h('div', { class: 'flex items-center gap-[4px]' }, [
              h(IconUniRecordConfirm, { class: 'text-white' }),
              h('span', { class: 'whitespace-nowrap' }, t('奖金系统正在审核中')),
            ]),
          )
        }
        mqttRefresh()
      }
    })
  }
  else {
    router.push('/login')
  }
}
/** 配置活动图片 */
function setProfitConfig(data: any) {
  if (data)
    imgUrl.value = data.img[currentLang] || ''
}
/** 接口：活动配置数据 */
function runAsyncConfig() {
  return runAsyncProfitConfig({ pid }).then((data) => {
    let tongue = (data as any).lang || '[]'
    try {
      tongue = JSON.parse(tongue)
    }
    catch (e) {

    }

    if (!tongue.includes(getLangForBackend() || '')) {
      Message.error(t('当前语言不支持此活动'))
      goPromo()
    }
    if (data && +data.state !== 1 && !preview) {
      Message.error(t('活动已结束'))
      goPromo()
    }
    else {
      // 使用类型断言，因为实际API返回包含currency_id但类型定义不完整
      memberCurrency.value = (data as any).currency_id || '701'
      setProfitConfig(data)
      dataProfitConfig.value = getCurrencyConfigByData(data)
    }

    if (isLogin.value)
      runAsyncProfitLevel({ pid, currency: selectedCurrencyId.value as CurrencyCode })
  })
}

/** 过滤当前货币和语言的数据 */
function getCurrencyConfigByData(data: any) {
  const _currentCurrency = memberCurrency.value ? memberCurrency.value : activeCurrency.value.cur
  const button = data?.button?.button
  const button_type = data?.button?.button_type
  const redirect = data?.button?.redirect
  const automatic = data?.automatic
  const text = data?.buttonText[currentLang]
  const currencyList = data?.conf.currency
  const currency = data?.conf.currency[_currentCurrency]
  const detail = data?.detail[currentLang]
  const images = data?.img[currentLang]
  const method = data?.conf.method // 1.梯级模式 2.VIP模式
  const bonus_type = data?.conf.bonus_type // （梯级模式下的）1.固定金额  2.比例金额
  const vip_mode = data?.conf.vip_mode ?? []
  const period = data?.conf.period
  const platform_ids = data?.conf.plat_ids
  const rule_type = data?.rule_type
  const tongue = data?.tongue
  return {
    button,
    button_type,
    redirect,
    automatic,
    text,
    currencyList,
    currency,
    detail,
    images,
    method,
    bonus_type,
    vip_mode,
    period,
    platform_ids,
    rule_type,
    tongue,
  }
}
/** 跳转到活动列表页面 */
function goPromo() {
  if (isFlutterApp())
    sendMsgToFlutterApp(SendFlutterAppMessage.ALL_PROMOTION)
  else
    router.replace('/promotions')
}
function mqttRefresh() {
  console.log('领取成功后的mqtt刷新')
  currencyStore.initCurrencyList()
  calculateBonus(0)
  runAsyncProfitLevel({ pid, currency: selectedCurrencyId.value as CurrencyCode })
}

/** 领取事件 */
function handleItemClick(data: any) {
  const valid = data.valid
  if (isReceiveCurRecord(data))
    return

  handleReceive(valid)
}
/** 监听登陆状态 */
watch(isLogin, async (newVal) => {
  if (newVal)
    await application.allSettled([runAsyncConfig()])

  else
    await application.allSettled([runAsyncConfig()])
})

let previousCurrencyId: string | null = null
watchEffect(() => {
  if (dataProfitConfig.value?.method === 2 && isLogin.value) {
    const currentId = selectedCurrencyId.value
    const currentName = selectedCurrencyName.value
    if (previousCurrencyId && previousCurrencyId !== currentId) {
      runAsyncProfitLevel({ pid, currency: currentId as CurrencyCode })
    }
    previousCurrencyId = currentId
  }
})

watchEffect(() => {
  // 使用类型断言，因为实际API返回包含names但类型定义不完整
  let names = (detailData.value as any)?.names || '[]'
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

onBeforeUnmount(() => {
  appEventBus.off(EventBusNames.PROMO_NOTIFY_REFRESH, mqttRefresh)
})

await application.allSettled([runAsyncConfig()])
</script>

<template>
  <div class="betting-rewards-active text-tg-text-lightgrey page-back-cash m-auto  max-w-[650px]">
    <div class="mb-[16px] center" :class="{ ' mb-[16px]': imgUrl }">
      <AfunBaseImage v-if="imgUrl" class="set-radios" :url="imgUrl" is-network />
    </div>
    <div class=" bg-[#213743] mb-[16px] rounded-[4px] px-[10px] py-[5px] font-[600]">
      <div class="flex items-end justify-between mb-[10px]">
        <div class="flex text-[20px] items-center">
          <span class="mr-[10px]">{{ periodText }}:</span>
          <AfunBaseAmount
            class="theme-amount" :amount="dataProfitLevelToday?.valid_bet_amount || '0.00'"
            :currency-type="selectedCurrencyName" style="--afun-base-amount-font-size:20px;--afun-app-currency-icon-size:16px"
          />
        </div>
        <AfunBaseImage class="w-[48px]" url="/m/afun-h5/png/back-cash-currency.png" />
      </div>
      <AfunBaseProgress
        class="mb-[10px]" width="100%" :show-percentage="false" :value="percentNextLevel()"
        :show-info="false" :stroke-width="8" background-color="#1a2c38" bar-color="#1fff20"
      />
      <template v-if="dataProfitConfig.method !== 2">
        <div v-if="nextLevel" class="text-[#b1bad3] font-[600] text-right text-[12px]">
          {{ t('距离下级还需') }}<span class="theme-amount">{{ stillNextLevel }}</span>
        </div>
        <div v-else class="text-[#b1bad3] font-[600] text-right text-[12px]">
          {{ t('已达到最高级') }}
        </div>
      </template>
    </div>
    <div
      v-if="!isShowReceive"
      class="theme-box mb-[16px] flex flex-col gap-[10px] rounded-[4px] p-[12px] text-[12px] font-[600]"
    >
      <div class="flex">
        <span class="flex-shrink-0">{{ lastPeriodText }}：</span>
        <span class="flex-1 flex justify-start">
          <AfunBaseAmount
            class="theme-amount" :amount="dataProfitLevel?.valid_bet_amount || '0.00'"
            :currency-type="selectedCurrencyName"
          />
        </span>
      </div>
      <div class="flex">
        <span class="flex-shrink-0">{{ t('可领取') }}：</span>
        <span class="flex-1 flex justify-start">
          <AfunBaseAmount
            class="theme-amount"
            :amount="calculatedReceivableAmount"
            :currency-type="selectedCurrencyName"
          />
        </span>
      </div>
      <AfunBaseButton
        v-if="isReceive" style="--afun-base-button-primary-background-color:#4D5D6F;--afun-base-button-primary-text-color:#fff"
      >
        {{ t('已领取') }}
      </AfunBaseButton>
      <template v-else>
        <AfunBaseButton
          v-if="dataProfitConfig?.method !== 2"
          :disabled="isReceive ?? true"
          :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
        >
          {{ isReceive ? t('已领取') : t('领取') }}
        </AfunBaseButton>
        <AfunBaseButton
          v-else
          :disabled="isBetAmountZero"
          :bg-style="isBetAmountZero ? 'grey' : 'secondary'"
          :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
        >
          {{ isReceive ? t('已领取') : t('领取') }}
        </AfunBaseButton>
      </template>
    </div>
    <div class="table-container" :class="tableColumn.length > 10 && 'more-table'">
      <AfunBaseTable
        class="table"
        :columns="tableColumn" last-first-padding :data-source="tableDataSource"
      >
        <template #level="{ record }">
          <div v-if="dataProfitConfig?.method === 2" class="flex items-center justify-center">
            <AfunBaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
          </div>
          <div v-else class="flex items-center justify-center">
            {{ record.level }}
          </div>
        </template>
        <template #valid_bet_amount="{ record }">
          <div class="inline-table">
            <AfunBaseAmount
              class="theme-amount" :amount="record.valid" :currency-type="selectedCurrencyName"
              :style="{ color: isCurrentLevel(currentLevel, record, 1) === 0 && dataProfitConfig.method === 2 ? 'var(--green-500)' : '' }"
            />
          </div>
        </template>
        <template #bonus_rate="{ record }">
          <div class="inline-table">
            <AfunBaseAmount
              class="theme-amount"
              :amount="record.bonus"
              :currency-type="selectedCurrencyName"
              :style="{ color: isCurrentLevel(currentLevel, record, 1) === 0 && dataProfitConfig.method === 2 ? 'var(--green-500)' : '' }"
            />
          </div>
        </template>
        <template #rate="{ record }">
          <div class="relative">
            <div v-if="dataProfitConfig?.method === 2" class="inline-table">
              {{ record.bonus_rate > 0 ? `${record.bonus_rate}%` : '-' }}
            </div>
            <div v-else class="inline-table">
              {{ record.bonus > 0 ? `${record.bonus}%` : '-' }}
            </div>
            <div v-if="+userInfo?.vip === +record.level" class="current-level-label absolute left-[50%] top-[-20px] translate-x-[-50%] rounded-[12px] bg-[#f00000] px-[8px] text-[10px] font-semibold">
              <span class="relative z-[10]">{{ t('当前') }}</span>
            </div>
          </div>
        </template>
        <template #receive="{ record }">
          <template v-if="isCurrentLevel(currentLevel, record, 0) === 0">
            <div
              v-if="dataProfitConfig?.method !== 2"
              class="text-[#fff] bg-[#f23038] w-[85px] h-[28px] center rounded-[4px]"
              @click="handleItemClick(record)"
            >
              {{ t('领取') }}
            </div>
            <div
              v-else
              class="text-[#fff] bg-[#f23038] w-[85px] h-[28px] center rounded-[4px]"
              @click="handleItemClick(record)"
            >
              {{ t('领取') }}
            </div>
          </template>
          <div
            v-else-if="isCurrentLevel(currentLevel, record, 0) === -1"
            :style="{ color: '#fff', backgroundColor: dataProfitConfig?.automatic === 2 ? '#F88D22' : '#4D5D6F' }"
            class="text-[#ccc] w-[85px] h-[28px] center rounded-[4px]"
          >
            {{ dataProfitConfig?.automatic === 2 ? t('审核中') : t('已领取') }}
          </div>
          <div v-else>
            -
          </div>
        </template>
      </AfunBaseTable>
    </div>
    <AfunBaseButton v-if="isShowReceive && isReceive" class="mt-[16px] w-[100%]" style="--afun-base-button-primary-background-color:#4D5D6F;--afun-base-button-primary-text-color:#fff">
      {{ t('已领取') }}
    </AfunBaseButton>
    <template v-else-if="isShowReceive && !isReceive">
      <AfunBaseButton
        v-if="dataProfitConfig?.method !== 2"
        class="mt-[16px] w-[100%]"
        :bg-style="isReceive ? 'grey' : 'secondary'" size="md" :disabled="isReceive ?? true"
        :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
      >
        {{ isReceive ? t('已领取') : t('一键领取') }}
      </AfunBaseButton>
      <AfunBaseButton
        v-else
        class="mt-[16px] w-[100%]"
        :bg-style="isBetAmountZero ? 'grey' : 'secondary'" size="md"
        :disabled="isBetAmountZero"
        :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
      >
        {{ isReceive ? t('已领取') : t('一键领取') }}
      </AfunBaseButton>
    </template>
    <AppActivityVenues
      v-if="dataProfitConfig?.platform_ids.length > 0" :title="t('活动场馆')"
      :plat-form-ids="dataProfitConfig?.platform_ids" default-tab="3"
    />
    <div class="theme-text text-[#fff] my-[16px] text-[18px] font-[600]">
      {{ t('活动规则') }}
    </div>
    <div>
      <AfunBaseRichArea v-if="dataProfitConfig?.rule_type === 2" :content="dataProfitConfig?.detail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="selectedCurrencyName" :amount="maxBonus"
        :is-login="isLogin"
        :content="dataProfitConfig?.detail"
      />
    </div>
    <div v-if="dataProfitConfig?.button === 1" class="my-[24px] text-center">
      <AfunBaseButton @click="jumpToUrl({ type: +dataProfitConfig.button_type, jumpUrl: dataProfitConfig.redirect })">
        {{ dataProfitConfig?.text }}
      </AfunBaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-box {
  color: #b1bad3;
  background-color: #213743;
}

.page-back-cash {
  --afun-table-layout: fixed;
  --afun-table-th-padding-x: 8px;
  --afun-table-td-padding-x: 8px;
  --afun-table-th-word-wrap: break-word;
  --afun-table-th-white-space: normal;
}

.set-radios {
  --afun-base-img-style-radius: 12px;
}
.betting-rewards-active {
  --tg-table-odd-background: #213743;
  --tg-table-th-color: #b1bad3;
  --tg-table-td-color: #b1bad3;
  --afun-base-amount-font-size: 14px;
  --afun-app-currency-icon-size: 14px;
  --afun-base-button-font-size: 14px;
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
.betting-rewards-active {
  .table-container {
    max-height: 605px;
    overflow-y: auto;
    position: relative;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .table::-webkit-scrollbar {
    display: none;
  }

  .m-table-wrap {
    overflow-x: visible !important;
  }

  .m-table {
    width: 100%;

    thead {
      .m-tr {
        .m-th {
          position: sticky;
          top: 0;
          background: #1a2c38;
        }
      }
    }

    &.more-table {
      thead {
        .m-tr {
          .m-th {
            z-index: 2;
          }
        }
      }
    }
  }

  .m-table-wrap .m-table .m-tr .m-td {
    overflow: visible !important;
  }
}
</style>

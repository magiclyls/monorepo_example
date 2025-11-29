<script lang="ts" setup>
import type { CurrencyCode } from '~/composables/useCurrencyData'

import { ApiMemberPromoDailyBonusBet, ApiMemberPromoDailyBonusClaim, ApiMemberPromoDailyBonusDetail } from '@tg/apis'
import { computed, ref } from 'vue'

/* defineOptions({
  name: 'KeepAlivePromotionBettingRewards',
}) */
const { t } = useI18n()

const { openNotify } = useNotify()
const router = useLocalRouter()
const appStore = useAppStore()
const { userLanguage, AllLanguages } = storeToRefs(useLanguageStore())
const { jumpToUrl } = useRedirect()
const { isLogin, userInfo } = storeToRefs(useAppStore())
const { openRegisterDialog } = useRegisterDialog()
const currentLang = getCurrentLanguageForBackend()
const route = useRoute()
const { globalPageTitle } = useGlobalStatePageTitle()
const { currentGlobalCurrency } = storeToRefs(appStore)
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
const memberCurrency = ref('701')

/** 可领取的奖励总计 */
let totalBonus = 0
const displayedBonus = ref(0)

/** 当前领取的有效投注 */
const tempTier = ref(0)

/** 接口: 活动配置 */
const {
  data: detailData,
  runAsync: runAsyncProfitConfig,
} = useRequest(ApiMemberPromoDailyBonusDetail)

// 当前货币配置
const activeCurrency = computed(() => {
  return currencyConfig[getCurrencyConfigByCode(detailData.value?.currency_id ?? '701').name]
})

const currentCurrencyCode = computed(() => {
  return currencyConfig[currentGlobalCurrency.value]?.cur || memberCurrency.value
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
    return getCurrencyConfigByCode(currentCurrencyCode.value)?.name
  }
  return getCurrencyConfigByCode(memberCurrency.value)?.name
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
      if (data.t === activeCurrency.value.cur)
        dataPromoDailyBonusBet.value = data

      else
        runAsyncProfitLevel2({ pid, currency: data.t as CurrencyCode })
    }
    else {
      dataPromoDailyBonusBet.value = data
    }
    totalBonus = 0
    displayedBonus.value = 0
  /*   runAsyncProfitConfig({ pid }).then((data) => {
      const currencyKeys = Object.keys(data.conf.currency)
      const _currentCurrency = memberCurrency.value ? memberCurrency.value : activeCurrency.value.cur
      const currency_id = currencyKeys.find((item: any) => item === _currentCurrency)
      let tongue = data.lang || '[]'

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
      memberCurrency.value = data.currency_id
      setProfitConfig(data)
      dataProfitConfig.value = getCurrencyConfigByData(data)
    }) */
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
    title: t('effective_bet'),
    dataIndex: 'valid',
    align: 'center',
    isAmount: true,
    slot: 'valid_bet_amount',
    width: '50%',
  },
  {
    title: dataProfitConfig.value?.bonus_type === 1 ? t('bonus_label') : t('cash_back_ratio'),
    dataIndex: 'bonus',
    align: 'center',
    isAmount: true,
    slot: dataProfitConfig.value?.bonus_type === 1 ? 'bonus_rate' : 'rate',
    width: '50%',
  },
  // {
  //   title: t('status'),
  //   dataIndex: 'bonus',
  //   align: 'center',
  //   slot: 'receive',
  //   width: '28%',
  // },
])

/** 表格:列，后台配置：VIP模式 */
const tableColumnTop = computed<Column[]>(() => [
  {
    title: t('vip_level'),
    dataIndex: 'valid',
    align: 'center',
    isAmount: true,
    slot: 'level',
    width: '50%',
  },
  {
    title: t('cash_back_ratio'),
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
  console.log('1、是否参与活动')
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
      } else {
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
      return t('today_efficiency_betting')
    case 2:
      return t('today_efficiency_betting')
    case 3:
      return t('this_week_efficiency_betting')
    case 4:
      return t('this_month_efficiency_betting')
    default:
      return t('today_efficiency_betting')
  }
})

// 次日、上周、上月投注的文案
const lastPeriodText = computed(() => {
  const period = dataProfitConfig.value?.period
  switch (period) {
    case 2:
      return t('yesterday_efficiency_betting')
    case 3:
      return t('last_week_efficiency_betting')
    case 4:
      return t('last_month_efficiency_betting')
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
    } else {
      break
    }
  }

  return matchedTier
}

// 获取当前用户VIP等级的返奖比例
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

// 计算可领取金额
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

// 活动配置的货币是否存在
function checkCurrencyConfig(currency: CurrencyCode) {
  const currencyKeys = Object.keys(dataProfitConfig.value?.currencyList)
  const currency_id = currencyKeys.find((item: any) => item === currency)
  if (currency_id)
    return true

  else
    return false
}
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
      openNotify({
        icon: 'uni-record-warn',
        title: t('warm_tip'),
        message: t('promotion_has_ended'),
      })
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
          openNotify({
            icon: 'uni-record-confirm',
            title: t('submit_success_label'),
            message: t('bonus_on_the_way'),
          })
          runAsyncProfitLevel({ pid, currency: selectedCurrencyId.value as CurrencyCode })
        }
        else {
          appStore.getBalanceData()
        }
        calculateBonus(0)
      }
      else if (data === '操作失败') {
        openNotify({
          icon: 'uni-record-warn',
          title: t('warm_tip'),
          message: t('fail_bonus'),
        })
      }
      else {
        console.log('领取事件成功:', data)
        if (isAudit.value) {
          openNotify({
            icon: 'uni-record-confirm',
            title: t('submit_success_label'),
            message: t('bonus_on_the_way'),
          })
        }
        mqttRefresh()
      }
    })
  }
  else {
    openRegisterDialog()
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
    const currencyKeys = Object.keys(data.conf.currency)
    const active_Currency = activeCurrency.value.cur
    const language_Currency = currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
    const checkActiveCurrency = currencyKeys.find((item: any) => item === active_Currency)
    const checkLanguageCurrency = currencyKeys.find((item: any) => item === language_Currency)
    let tongue = data.lang || '[]'

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
    if (data && +data.state !== 1 && !preview) {
      openNotify({
        type: 'error',
        code: 'false',
        message: t('promo_end'),
      })
      goPromo()
    }
    else {
      /* if (!checkActiveCurrency) {
        openNotify({
          icon: 'uni-record-warn',
          title: t('warm_tip'),
          message: t('promo_currency_error'),
        })
      } */
      memberCurrency.value = data.currency_id
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
  const method = data?.conf.method
  const bonus_type = data?.conf.bonus_type
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
    router.replace('/promotion')
}
function mqttRefresh() {
  console.log('领取成功后的mqtt刷新')
  appStore.getBalanceData()
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
  let names = detailData.value?.names || '[]'
  try {
    names = JSON.parse(names)
  }
  catch (e) {

  }
  const name = names[userLanguage.value.replace('-', '_') as any]
  if (name)
    globalPageTitle.value = name
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
  <div class="text-tg-text-lightgrey page-back-cash m-auto mt-[16px] max-w-[650px]">
    <div class="mb-[16px] flex items-center justify-center" :class="{ ' mb-[16px]': imgUrl }">
      <BaseImage v-if="imgUrl" class="" :url="imgUrl" is-network />
    </div>
    <div class="theme-bg bg-tg-secondary-grey mb-[16px] rounded-[4px] p-[12px] font-[600]">
      <div class="flex items-center justify-between">
        <div class="text-tg-text-white grid grid-cols-[1fr_auto] gap-x-[16px] text-[20px]">
          <span>{{ periodText }}:</span>
          <span>
            <AppAmount class="theme-amount" :amount="dataProfitLevelToday?.valid_bet_amount || '0.00'" :currency-type="selectedCurrencyName" style="--tg-app-amount-font-size:20px" />
          </span>
        </div>
        <AppImage width="48px" url="/png/promotions/back-cash-currency.png" />
      </div>
      <BaseProgress
        width="100%" :percent="percentNextLevel()" :show-info="false" :stroke-width="6"
        stroke-color="var(--tg-primary-success)"
      />
      <template v-if="dataProfitConfig.method !== 2">
        <div v-if="nextLevel" class="theme-text text-right text-[12px]">
          {{ $t('reach_lower_level_still_need') }}<span class="theme-amount">{{ stillNextLevel }}</span>
        </div>
        <div v-else class="theme-text text-right text-[12px]">
          {{ $t('reached_highest_level') }}
        </div>
      </template>
    </div>
    <div v-if="!isShowReceive" class="theme-box mb-[16px] flex flex-col gap-[10px] rounded-[4px] p-[12px] text-sm font-normal">
      <div class="grid grid-cols-[auto_1fr]">
        <span>{{ lastPeriodText }}：</span>
        <span>
          <AppAmount class="theme-amount" :amount="dataProfitLevel?.valid_bet_amount || '0.00'" :currency-type="selectedCurrencyName" />
        </span>
      </div>
      <div class="grid grid-cols-[auto_1fr]">
        <span>{{ $t('can_receive') }}：</span>
        <span>
          <AppAmount class="theme-amount" :amount="calculatedReceivableAmount" :currency-type="selectedCurrencyName" />
        </span>
      </div>

      <BaseButton
        v-if="isReceive"
        class="w-[100%]" :bg-style="'grey'" size="md" disabled
      >
        {{ $t('received') }}
      </BaseButton>
      <template v-else>
        <BaseButton
          v-if="dataProfitConfig?.method !== 2"
          class="w-[100%]" :bg-style="isReceive ?? true ? 'grey' : 'secondary'" size="md"
          :disabled="isReceive ?? true"
          :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
        >
          {{ isReceive ? $t('received') : $t('Receive') }}
        </BaseButton>
        <BaseButton
          v-else
          class="w-[100%]" :bg-style="isBetAmountZero ? 'grey' : 'secondary'" size="md"
          :disabled="isBetAmountZero"
          :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
        >
          {{ isReceive ? $t('received') : $t('Receive') }}
        </BaseButton>
      </template>
    </div>
    <div class="table-container" :class="tableColumn.length > 10 && 'more-table'">
      <BaseTable
        class="table"
        :columns="tableColumn" last-first-padding :data-source="tableDataSource"
      >
        <template #level="{ record }">
          <div v-if="dataProfitConfig?.method === 2" class="flex items-center justify-center">
            <BaseImage width="40px" :is-network="true" :url="`/images/vip/${record.level}.webp`" />
          </div>
        </template>
        <template #valid_bet_amount="{ record }">
          <div class="inline-table">
            <AppAmount
              class="theme-amount" :amount="record.valid" :currency-type="selectedCurrencyName"
              :style="{ color: isCurrentLevel(currentLevel, record, 1) === 0 && dataProfitConfig.method === 2 ? 'var(--green-500)' : '' }"
            />
          </div>
        </template>
        <template #bonus_rate="{ record }">
          <div class="inline-table">
            <AppAmount
              class="theme-amount" :amount="record.bonus" :currency-type="selectedCurrencyName"
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
              <span class="relative z-[10]">{{ t('current') }}</span>
            </div>
          </div>
        </template>
        <template #receive="{ record }">
          <template v-if="isCurrentLevel(currentLevel, record, 0) === 0">
            <div
              v-if="dataProfitConfig?.method !== 2" class="text-[12px]"
              :class="{ 'theme-receive': isCurrentLevel(currentLevel, record, 0) === 0 }" @click="handleItemClick(record)"
            >
              {{ $t('receive') }}
            </div>
            <div
              v-else
              :class="{ 'theme-receive': isCurrentLevel(currentLevel, record, 0) === 0 }" @click="handleItemClick(record)"
            >
              {{ $t('receive') }}
            </div>
          </template>
          <div v-else>
            {{ isCurrentLevel(currentLevel, record, 0) === -1 ? (dataProfitConfig?.automatic === 2 ? $t('promo_invite_pending') : $t('received')) : "-" }}
          </div>
        </template>
      </BaseTable>
    </div>
    <BaseButton
      v-if="isShowReceive && isReceive"
      class="mt-[16px] w-[100%]" :bg-style="'grey'" size="md" disabled
    >
      {{ $t('received') }}
    </BaseButton>
    <template v-else-if="isShowReceive && !isReceive">
      <BaseButton
        v-if="dataProfitConfig?.method !== 2"
        class="mt-[16px] w-[100%]" :bg-style="isReceive ?? true ? 'grey' : 'secondary'" size="md"
        :disabled="isReceive ?? true"
        :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
      >
        {{ $t('promo_get_it_with_one_click') }}
      </BaseButton>
      <BaseButton
        v-else
        class="mt-[16px] w-[100%]" :bg-style="isBetAmountZero ? 'grey' : 'secondary'" size="md"
        :disabled="isBetAmountZero"
        :loading="loadingApply && loadingProfitLevel" @click="handleReceive(0)"
      >
        {{ $t('promo_get_it_with_one_click') }}
      </BaseButton>
    </template>
    <AppActivityVenues
      v-if="dataProfitConfig?.platform_ids.length > 0"
      :title="$t('venues_activity')"
      :plat-form-ids="dataProfitConfig?.platform_ids"
      default-tab="3"
    />
    <div class="theme-text text-tg-text-white my-[16px] text-[18px] font-[600]">
      {{ $t('event_rules_description') }}
    </div>
    <div class="mb-[24px]">
      <BaseRichArea v-if="dataProfitConfig?.rule_type === 2" :content="dataProfitConfig?.detail ?? ''" />
      <AppPromotionBaseRuleText
        v-else :currency-type="selectedCurrencyName"
        :amount="maxBonus" :content="dataProfitConfig?.detail"
      />
    </div>
    <div v-if="dataProfitConfig?.button === 1" class="my-[24px] text-center">
      <BaseButton
        bg-style="primary" size="md"
        @click="jumpToUrl({ type: +dataProfitConfig.button_type, jumpUrl: dataProfitConfig.redirect })"
      >
        {{ dataProfitConfig?.text }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-box {
  background-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background-color: #f5f5f5;
  }
}
.theme-receive {
  color: #00e701;
  @include webTheme('white') {
    color: #ff9e36;
  }
  @include webTheme('green') {
    color: #f6d14a;
  }
}
.page-back-cash {
  --tg-table-layout: fixed;
  --tg-table-th-padding-x: 8px;
  --tg-table-td-padding-x: 8px;
  --tg-table-th-word-wrap: break-word;
  --tg-table-th-white-space: normal;
  --tg-table-odd-background: #fff;
  --tg-table-even-background: transparent;
  --tg-table-th-background: transparent;

  @include webTheme('green') {
    --green-500: #ffefb0 !important;
  }
  .theme-bg {
    @include webTheme('green') {
      background-color: #076237;
      --tg-primary-success: #fff;
      --tg-base-progress-inner-bg: #00000026;
    }
    @include webTheme('white') {
      background-color: #f5f5f5;
      --tg-primary-success: #f2ca5c;
      --tg-base-progress-inner-bg: #c1c1c1;
    }
  }
}
.table {
  --tg-table-odd-background: #213743;
  @include webTheme('greenblack') {
    --tg-table-odd-background: var(--tg-primary-main);
    --tg-table-even-background: var(--tg-secondary-dark);
  }
  @include webTheme('green') {
    --tg-table-odd-background: #055434;
    --tg-table-even-background: #076237;
  }
  @include webTheme('white') {
    --tg-table-odd-background: #f5f5f5;
  }
}
.theme-amount {
  @include webTheme('greenblack') {
    color: var(--tg-primary-active);
  }
}
.green-text {
  @include webTheme('green') {
    color: #42bc91;
  }
  @include webTheme('white') {
    color: #b3b3b3;
  }
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
  .table-container {
    max-height: 583px;
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

<route lang="yaml">
meta:
  layout: home
</route>

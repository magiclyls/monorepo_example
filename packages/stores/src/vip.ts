import {
  ApiMemberRebateAutomatic,
  ApiMemberVipBonusRecord,
  ApiMemberVipConfig,
  ApiMemberVipDetail,
} from '@tg/apis'
import { getCurrencyConfig, mul, toFixed } from '@tg/utils'
import { getLangForBackend } from '@tg/vue-i18n'
import dayjs from 'dayjs'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import { useRequest } from 'vue-request'
import { useAppStore } from './app'
import { useCurrency } from './currency'

const today = dayjs()

export const useVipStore = defineStore('vip', () => {
  const { isLogin, userInfo } = storeToRefs(useAppStore())
  const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())

  /** 不需要登录💡 */
  // 会员返水领取方式
  const { runAsync: runAsyncRebateAutomatic, data: rebateAutomatic } = useRequest(ApiMemberRebateAutomatic)
  // 会员vip基础配置活动详情
  const { data: vipRuleDetailData, run: runGetVipRuleDetailData } = useRequest(() => ApiMemberVipDetail({ lang: getLangForBackend() }))
  // vip配置
  const { runAsync: runGetVipConfig, data: vipConfigData, loading: getVipConfigLoading } = useRequest(ApiMemberVipConfig, {
    manual: false,
    onSuccess(res) {
      if (res && res.front_show === '1' && !vipRuleDetailData.value)
        runGetVipRuleDetailData()
    },
  })

  /** 需要登录🔴 */
  // 会员vip奖金近90天领取记录 - 没有记录时隐藏tab
  const { runAsync: runGetMemberVipBonusRecord, data: memberVipBonusRecordData } = useRequest(() => ApiMemberVipBonusRecord({
    page: 1,
    page_size: 10,
    start_time: today.subtract(89, 'day').startOf('day').unix(),
    end_time: today.endOf('day').unix(),
    cash_type: '',
  }), { ready: isLogin })

  /** 后台是否配置了返水数据 */
  const isHaveVIPRebateConfig = computed(() => rebateAutomatic.value ? rebateAutomatic.value.gts !== '' : false)

  /** 后台是否开启VIP入口展示 */
  const isVipOpen = computed(() => vipConfigData.value ? vipConfigData.value.front_show === '1' : false)
  /** 后台是否开启VIP晋级奖金 */
  const isVipUpgradeBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.upgrade === '1' : false)
  /** 后台是否开启VIP日奖金 */
  const isVipDayBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.day === '1' : false)
  /** 后台是否开启VIP周奖金 */
  const isVipWeekBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.week === '1' : false)
  /** 后台是否开启VIP月奖金 */
  const isVipMonthBonusOpen = computed(() => vipConfigData.value ? vipConfigData.value.month === '1' : false)
  /** VIP奖金全部关闭 */
  const isAllVipBonusClosed = computed(() => !isVipDayBonusOpen.value && !isVipWeekBonusOpen.value && !isVipMonthBonusOpen.value)
  /** 会员是否有vip奖金领取记录 */
  const isMemberHaveVipBonusRecord = computed(() => {
    if (memberVipBonusRecordData.value)
      return memberVipBonusRecordData.value.d && memberVipBonusRecordData.value.d.length > 0

    return false
  })

  const vip = computed(() => userInfo.value?.vip ?? '0')
  const score = computed(() => userInfo.value?.score ? Number(userInfo.value.score) : 0)
  const vipConfigArray = computed(() => vipConfigData.value ? Object.values(vipConfigData.value.vips).sort((a, b) => +a.level - +b.level) : [])
  const min = computed(() => vipConfigArray.value[0]?.level ?? '0')
  const minLevelConfig = computed(() => vipConfigArray.value[0])
  const max = computed(() => vipConfigArray.value.toReversed()[0]?.level ?? '0')
  const maxLevelConfig = computed(() => vipConfigArray.value.toReversed()[0])
  const prevLevel = computed(() => {
    if (vipConfigData.value)
      return vipConfigData.value.vips[`v${+vip.value - 1}`]
  })
  const currentLevel = computed(() => {
    if (vipConfigData.value)
      return vipConfigData.value.vips[`v${vip.value}`]
  })
  const nextLevel = computed(() => {
    if (vipConfigData.value)
      return vipConfigData.value.vips[`v${+vip.value + 1}`]
  })
  const isMinLevel = computed(() => !(+vip.value > 0))
  const isMaxLevel = computed(() => nextLevel.value === undefined)
  const progress = computed(() => {
    const _score = nextLevel.value?.upgrade ?? 0
    if (nextLevel.value && +_score > 0)
      return mul(+toFixed((+score.value / +_score), 4), 100)
    return 0
  })
  const scoreToNext = computed(() => {
    const _score = nextLevel.value?.upgrade ?? 0
    if (nextLevel.value)
      return +_score - score.value
    else
      return 0
  })
  /** 1积分模式 2币种模式 */
  const vipMode = computed(() => vipConfigData.value && vipConfigData.value.vip_mode)
  /** 是否积分模式 */
  const isVipPointMode = computed(() => vipMode.value === '1')
  /** 是否开启保级 */
  const isKeepLevelOpen = computed(() => vipConfigData.value && vipConfigData.value.keep_level === '1')
  /** 是否有配置保级打码 */
  const isHaveRetainConfig = computed(() => currentLevel.value && +currentLevel.value.retain > 0)
  /** 是否有配置保级充值 */
  const isHaveDepositRetainConfig = computed(() => currentLevel.value && +currentLevel.value.deposit_retain > 0)
  /** 币种模式下的打码币种 */
  const currencyModeCur = computed(() => vipConfigData.value && getCurrencyConfig(vipConfigData.value.currency)?.name)

  // 初始化时调用，如果后台没有配置返水数据则隐藏Tab
  function getRebateTabStatus() {
    const globalCurrencyCode = currentGlobalCurrencyMap.value.cur
    // const currency_id = supportedCur.includes(globalCurrencyCode) ? globalCurrencyCode : '706'
    runAsyncRebateAutomatic(globalCurrencyCode)
  }
  getRebateTabStatus()

  /** 如果字段是否有意义 */
  function isZeroShowOther(val: string) {
    return ['0', '0.00', '', '0.0', 0].includes(val)
  }

  // 监听货币变化重新获取是否隐藏VIP反水Tab
  watch(currentGlobalCurrencyMap, () => {
    getRebateTabStatus()
  })

  return {
    min,
    minLevelConfig,
    max,
    maxLevelConfig,
    prevLevel,
    isMinLevel,
    isMaxLevel,
    progress,
    currentLevel,
    score,
    scoreToNext,
    isHaveVIPRebateConfig,
    isVipOpen,
    isVipUpgradeBonusOpen,
    isVipDayBonusOpen,
    isVipWeekBonusOpen,
    isVipMonthBonusOpen,
    isAllVipBonusClosed,
    isMemberHaveVipBonusRecord,
    vipRuleDetailData,
    rebateAutomatic,
    vipConfigData,
    isVipPointMode,
    isKeepLevelOpen,
    isHaveRetainConfig,
    isHaveDepositRetainConfig,
    currencyModeCur,
    vipConfigArray,
    getVipConfigLoading,
    runAsyncRebateAutomatic,
    runGetMemberVipBonusRecord,
    runGetVipConfig,
    isZeroShowOther,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useVipStore, import.meta.hot))

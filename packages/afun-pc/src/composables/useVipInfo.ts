// const vipIconMap = ['', 'chat-star-1']

export function useVipInfo() {
  const route = useRoute()
  const appStore = useAppStore()

  const { userInfo, vipConfigData, rebateAutomatic } = storeToRefs(appStore)

  const vip = computed(() => userInfo.value?.vip ?? '0')
  // userInfo.value && +userInfo.value >= 0 ? +userInfo.value : 0
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
    return 100
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
  /** 后台是否开启VIP入口展示 */
  const isVipOpen = computed(() => vipConfigData.value ? vipConfigData.value.front_show === '1' : false)
  /** 是否积分模式 */
  const isVipPointMode = computed(() => vipMode.value === '1')
  /** 是否开启保级 */
  const isKeepLevelOpen = computed(() => vipConfigData.value && vipConfigData.value.keep_level === '1')
  /** 是否有配置保级打码 */
  const isHaveRetainConfig = computed(() => currentLevel.value && +currentLevel.value.retain > 0)
  /** 是否有配置保级充值 */
  const isHaveDepositRetainConfig = computed(() => currentLevel.value && +currentLevel.value.deposit_retain > 0)
  /** 币种模式下的打码币种 */
  const currencyModeCur = computed(() => vipConfigData.value && getCurrencyConfigByCode(vipConfigData.value.currency)?.name)
  /** 后台是否配置了返水数据 */
  const isHaveVIPRebateConfig = computed(() => rebateAutomatic.value ? rebateAutomatic.value.gts !== '' : false)
  /** 如果字段是否有意义 */
  function isZeroShowOther(val: string) {
    return ['0', '0.00', '', '0.0', 0].includes(val)
  }

  return {
    vip,
    score,
    scoreToNext,
    prevLevel,
    currentLevel,
    nextLevel,
    isMinLevel,
    isMaxLevel,
    progress,
    min,
    max,
    minLevelConfig,
    maxLevelConfig,
    vipConfigArray,
    isZeroShowOther,
    rebateAutomatic,
    /** 是否积分模式 */
    isVipPointMode,
    /** 是否开启保级 */
    isKeepLevelOpen,
    /** 是否有配置保级打码 */
    isHaveRetainConfig,
    /** 是否有配置保级充值 */
    isHaveDepositRetainConfig,
    /** 币种模式下的打码币种 */
    currencyModeCur,
    /** 后台是否开启VIP入口展示 */
    isVipOpen,
    isHaveVIPRebateConfig
  }
}

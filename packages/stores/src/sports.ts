import type {
  ISportsBetSlipData,
} from '@tg/types'
import {
  ApiMemberPlatformList,
  ApiSportCount,
  ApiSportGetFavoriteList,
  ApiSportsHomePageConfig,
  ApiSportSidebar,
  ApiSportsLogin,
} from '@tg/apis'
import { useBoolean, useList } from '@tg/hooks'
import { EnumLanguage, EnumSportsEventType, EnumSportsOddsType } from '@tg/types'
import {
  application,
  div,
  globalInitMap,
  Local,
  mul,
  numberReg,
  Session,
  SportsCart,
  sportsIconPathFormatBySite,
  STORAGE_SPORTS_CURRENT_PROVIDER,
  STORAGE_SPORTS_LIVE_NAV,
  STORAGE_SPORTS_ODDS_TYPE_KEY,
  sub,
  toFixed,
} from '@tg/utils'
import { getLang, getLangForBackend, i18n } from '@tg/vue-i18n'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRequest } from 'vue-request'
import { useAppStore } from './app'
import { useCurrency } from './currency'

/**
 * 体育赔率类
 */
class SportsOdds {
  /**
   * 换算体育赔率
   * @param {number} odds
   * @returns {number}
   */
  static convert(odds: number, type = EnumSportsOddsType.DECIMAL) {
    switch (type) {
      case EnumSportsOddsType.DECIMAL:
        return this.convertToDecimalOdds(odds)
      case EnumSportsOddsType.FRACTION:
        return this.convertToFractionOdds(odds)
      case EnumSportsOddsType.AMERICAN:
        return this.convertToAmericanOdds(odds)
      case EnumSportsOddsType.INDONESIA:
        return this.convertToIndonesiaOdds(odds)
      case EnumSportsOddsType.MALAYSIA:
        return this.convertToMalaysiaOdds(odds)
      case EnumSportsOddsType.HONGKONG:
        return this.convertToHongKongOdds(odds)
    }
  }

  /**
   * 小数式
   * @param {number} odds
   * @returns {string}
   */
  static convertToDecimalOdds(odds: number) {
    return application.numberToLocaleString(odds, getLang())
  }

  /**
   * 求最大公约数
   * @param {number} a
   * @param {number} b
   * @returns {number}
   */
  static findGCD(a: number, b: number): number {
    if (b === 0)
      return a

    else
      return this.findGCD(b, a % b)
  }

  /**
   * 分数式
   * @param {number} odds
   * @returns {string}
   */
  static convertToFractionOdds(odds: number) {
    const numerator = +mul(+sub(odds, 1), 100)
    const denominator = 100

    const gcd = this.findGCD(numerator, denominator)
    const simplifiedNumerator = numerator / gcd
    const simplifiedDenominator = denominator / gcd

    return `${simplifiedNumerator}/${simplifiedDenominator}`
  }

  /**
   * 美式
   * @param {number} odds
   * @returns {string}
   */
  static convertToAmericanOdds(odds: number) {
    // 当小数式赔率大于等于2时，计算美式正赔
    // 当小数式赔率小于2时，计算美式负赔
    const americanOdds = odds >= 2 ? (mul((+sub(odds, 1)), 100)) : div(100, (+sub(1, odds)))
    const _a = (+americanOdds).toFixed()
    return `${_a}`
  }

  /**
   * 印尼格式(相当于美式赔率除以100)
   * @param {number} odds
   * @returns {string}
   */
  static convertToIndonesiaOdds(odds: number) {
    if (odds >= 2) {
      const americanOdds = odds - 1
      return `+${toFixed(americanOdds, 2)}`
    }
    else {
      const americanOdds = -1 / (odds - 1)
      return `${toFixed(americanOdds, 2)}`
    }
  }

  /**
   * 马来格式
   *
   * 若欧洲赔率<2：马来赔率=欧洲赔率-1
   *
   * 若欧洲赔率≥2：马来赔率= 1 /（1-欧洲赔率）
   */
  static convertToMalaysiaOdds(odds: number) {
    if (odds < 2) {
      // 计算正马来赔率
      const malayOdds = odds - 1
      return `+${toFixed(malayOdds, 2)}`
    }
    else {
      // 计算负马来赔率
      const malayOdds = 1 / (1 - odds)
      return `${toFixed(malayOdds, 2)}`
    }
  }

  /** 香港格式（欧洲赔率-1） */
  static convertToHongKongOdds(odds: number) {
    // 计算香港式赔率
    const hongKongOdds = odds - 1
    return `${toFixed(hongKongOdds, 2)}`
  }
}

export const useSportsStore = defineStore('sports', () => {
  const { t } = i18n.global
  const { isLogin } = storeToRefs(useAppStore())
  const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
  /** 本次是否请求过数据 */
  const { bool: isSportsLogin, setBool: setSportLogin } = useBoolean(false)
  /** 体育场馆登录成功 */
  const { bool: isSportsLoginSusses } = useBoolean(false)
  /** 是否请求体育登录接口 比如在体育路由下面，并且是登录状态 */
  const { bool: isRequestSportsLogin } = useBoolean(false)
  /** 大厅首次加载 */
  const { bool: isLobbyLoadFirst } = useBoolean(true)

  /** 体育赔率展示方式 */
  const sportsOddsType = ref(getSportsOddsType())
  /** 投注单数据 */
  const betSlipData = ref<ISportsBetSlipData[]>([])
  /** 当前场馆ID */
  const currentProvider = ref(Local.get<string>(STORAGE_SPORTS_CURRENT_PROVIDER)?.value ?? '')
  /** 滚球当前球种 */
  const currentLiveNav = ref(-1)
  /** 滚球当前盘口类型 */
  const currentLiveBetType = ref('')
  /** 即将开赛当前球种 */
  const currentUpcomingNav = ref(0)
  /** 收藏当前球种 */
  const currentFavNav = ref(-1)
  /** 收藏当前盘口类型 */
  const currentFavBetType = ref('3@@1')
  /** 大厅当前的赛事类型 */
  const lobbyCurrentEventType = ref(0)
  /** 大厅当前球种 */
  const currentLobbySiNav = ref(-1)
  /** 大厅当前盘口类型 */
  const currentLobbyBetType = ref('')
  /** 虚拟体育当前球种 */
  const currentVSportsNav = ref(-1)
  /** 虚拟体育当前盘口类型 */
  const currentVSportsBetType = ref('')
  /** 购物车 */
  const cart = reactive(new SportsCart(currentGlobalCurrencyMap.value.type))
  /** 体育场馆维护 */
  const isSportsMaintained = ref(globalInitMap.isSportsMaintained)
  /** 当前首页tab */
  const marketType = ref(Session.get<string>(STORAGE_SPORTS_LIVE_NAV)?.value ?? 'all')

  /** 体育计数源 */
  const { data: allSportsCountData, run: runSportsCount } = useRequest(() =>
    ApiSportCount({ ic: 0 }), {
    onSuccess(res) {
      // 统一加载icon
      res.list.forEach((a) => {
        application.loadImage(sportsIconPathFormatBySite(a.spic))
        application.loadImage(sportsIconPathFormatBySite(a.spic, true))
      })

      /** 大厅 */
      if (lobbyCurrentEventType.value === EnumSportsEventType.HOT) {
        // 热门
        const arr = res.list.filter(a => a.ohc > 0)
        if (arr.length > 0) {
          if (currentLobbySiNav.value === -1)
            currentLobbySiNav.value = arr[0].si
          else if (!arr.find(a => a.si === currentLobbySiNav.value))
            currentLobbySiNav.value = arr[0].si
        }
        else {
          currentLobbySiNav.value = 0
        }
      }
      if (lobbyCurrentEventType.value === EnumSportsEventType.TODAY) {
        // 今日
        const arr = res.list.filter(a => a.tc > 0)
        if (arr.length > 0) {
          if (currentLobbySiNav.value === -1)
            currentLobbySiNav.value = arr[0].si
          else if (!arr.find(a => a.si === currentLobbySiNav.value))
            currentLobbySiNav.value = arr[0].si
        }
        else {
          currentLobbySiNav.value = 0
        }
      }
      if (lobbyCurrentEventType.value === EnumSportsEventType.LIVE) {
        // 滚球
        const arr = res.list.filter(a => a.lc > 0 || a.tc > 0)
        if (arr.length > 0) {
          if (currentLobbySiNav.value === -1)
            currentLobbySiNav.value = arr[0].si
          else if (!arr.find(a => a.si === currentLobbySiNav.value))
            currentLobbySiNav.value = arr[0].si
        }
        else {
          currentLobbySiNav.value = 0
        }
      }
      if (lobbyCurrentEventType.value === EnumSportsEventType.EARLY) {
        // 早盘
        const arr = res.list.filter(a => a.ec > 0)
        if (arr.length > 0) {
          if (currentLobbySiNav.value === -1)
            currentLobbySiNav.value = arr[0].si
          else if (!arr.find(a => a.si === currentLobbySiNav.value))
            currentLobbySiNav.value = arr[0].si
        }
        else {
          currentLobbySiNav.value = 0
        }
      }
      if (lobbyCurrentEventType.value === EnumSportsEventType.CHUAN) {
        // 串关
        const arr = res.list.filter(a => a.cc > 0)
        if (arr.length > 0) {
          if (currentLobbySiNav.value === -1)
            currentLobbySiNav.value = arr[0].si
          else if (!arr.find(a => a.si === currentLobbySiNav.value))
            currentLobbySiNav.value = arr[0].si
        }
        else {
          currentLobbySiNav.value = 0
        }
      }
      if (lobbyCurrentEventType.value === EnumSportsEventType.OUTRIGHT) {
        // 冠军
        const arr = res.list.filter(a => a.oc > 0)
        if (arr.length > 0) {
          if (currentLobbySiNav.value === -1)
            currentLobbySiNav.value = arr[0].si
          else if (!arr.find(a => a.si === currentLobbySiNav.value))
            currentLobbySiNav.value = arr[0].si
        }
        else {
          currentLobbySiNav.value = 0
        }
      }

      if (currentLobbyBetType.value === '')
        currentLobbyBetType.value = getSportsBetTypeListBySi(currentLobbySiNav.value)[0].value

      /** 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 一条完美的分割线 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 */

      // 虚拟体育
      const vsArr = res.list.filter(a => a.vsc > 0)
      if (vsArr.length > 0) {
        if (currentVSportsNav.value === -1)
          currentVSportsNav.value = vsArr[0].si

        else if (!vsArr.find(a => a.si === currentVSportsNav.value))
          currentVSportsNav.value = vsArr[0].si
      }
      else {
        currentVSportsNav.value = 1
      }

      if (currentVSportsBetType.value === '')
        currentVSportsBetType.value = getSportsBetTypeListBySi(currentVSportsNav.value)[0].value

      // 滚球
      const liveArr = res.list.filter(a => a.lc > 0)
      if (liveArr.length > 0) {
        if (currentLiveNav.value === -1)
          currentLiveNav.value = liveArr[0].si

        else if (!liveArr.find(a => a.si === currentLiveNav.value))
          currentLiveNav.value = liveArr[0].si
      }
      else {
        currentLiveNav.value = 1
      }

      if (currentLiveBetType.value === '')
        currentLiveBetType.value = getSportsBetTypeListBySi(currentLiveNav.value)[0].value
    },
  })
  const allSportsCount = computed(() => {
    if (allSportsCountData.value) {
      const list = allSportsCountData.value.list
        ? allSportsCountData.value.list.map((a) => {
            return {
              ...a,
              spic: sportsIconPathFormatBySite(a.spic),
            }
          })
        : []
      return {
        c: allSportsCountData.value.c,
        nc: allSportsCountData.value.nc,
        list,
      }
    }
  })

  /** 赛事收藏数据源 */
  const {
    data: sportsFavoriteData,
    run: runGetFavoriteList,
  } = useRequest(ApiSportGetFavoriteList, {
    throttleInterval: 1500,
    onSuccess(res) {
      if (res && res.d) {
        if (currentFavNav.value === -1
          || !res.d.find(a => a.si === currentFavNav.value)
        ) {
          currentFavNav.value = res.d[0].si
          if (currentFavBetType.value === '3@@1')
            currentFavBetType.value = getSportsBetTypeListBySi(currentFavNav.value)[0].value
        }
      }
    },
  })

  /** 体育场馆登录 */
  const { run: runAsyncSportsLogin } = useRequest(() => ApiSportsLogin({ cur: currentGlobalCurrencyMap.value.cur }), {
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    refreshDeps: [currentGlobalCurrencyMap, isLogin],
    refreshDepsAction: () => {
      if (isRequestSportsLogin.value)
        runAsyncSportsLogin()
    },
    onSuccess() {
      isSportsLoginSusses.value = true
      setTimeout(() => {
        runGetFavoriteList({
          si: 0,
          cur: currentGlobalCurrencyMap.value.cur,
        })
      }, 1000)
    },
  })

  /** 侧边栏数据源 */
  const { data: sidebarData, run: runSportsSidebar } = useRequest(ApiSportSidebar, {
    onSuccess() {
      if (isRequestSportsLogin.value)
        runAsyncSportsLogin()
    },
  })

  /** 首页相关设定 */
  const { data: homePageConfigData, runAsync: runAsyncHomeConfig } = useRequest(ApiSportsHomePageConfig, {
    onSuccess(res) {
      if (res.list_filter) {
        lobbyCurrentEventType.value = res.list_filter[0].lfid
        // 统一加载icon
        res.list_filter.forEach((a) => {
          application.loadImage(sportsIconPathFormatBySite(a.icon))
        })
      }
    },
  })
  const homePageConfig = computed(() => {
    if (homePageConfigData.value) {
      return {
        ...homePageConfigData.value,
        list_filter: homePageConfigData.value.list_filter.map((a) => {
          return {
            ...a,
            icon: sportsIconPathFormatBySite(a.icon),
          }
        }),
      }
    }
  })

  /** 获取场馆列表 */
  const {
    run: runSportsProvider,
    data: sportsProviderData,
  } = useList(ApiMemberPlatformList, {
    onSuccess(res) {
      if (res.d && !Local.get<string>(STORAGE_SPORTS_CURRENT_PROVIDER)) {
        currentProvider.value = res.d[0].venue_id
        Local.set(STORAGE_SPORTS_CURRENT_PROVIDER, res.d[0].venue_id)
      }
      runAsyncHomeConfig().then(() => runSportsCount())
      runSportsSidebar()
    },
  })
  runSportsProvider({ game_type: 4 })

  const AllOddsTypes = computed<Array<{
    title: string
    value: EnumSportsOddsType
  }>>(() => Object.values(EnumSportsOddsType).map(m => ({ title: t(m), value: m })))

  /** 场馆列表 */
  const providerList = computed(() => {
    return sportsProviderData.value && sportsProviderData.value.d && !!sportsProviderData.value.d
      ? sportsProviderData.value.d
      : []
  })

  /** 滚球计数 */
  const liveCount = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.reduce((acc, cur) => {
        return acc + cur.lc
      }, 0)
    }
    return 0
  })

  /** 热门导航 */
  const hotEventNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.ohc + a.otc > 0).map((b) => {
        return {
          ...b,
          icon: b.spic,
          count: b.ohc + b.otc,
          useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 今日导航 */
  const todayEventNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.tc > 0).map((b) => {
        return {
          ...b,
          icon: b.spic,
          count: b.tc,
          useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 滚球导航 */
  const sportLiveNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.tc > 0).map((b) => {
        return {
          ...b,
          icon: b.spic,
          count: b.tc,
          useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 早盘导航 */
  const earlyEventNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.ec + a.otc > 0).map((b) => {
        return {
          ...b,
          icon: b.spic,
          count: b.ec + b.otc,
          useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 串关导航 */
  const chuanEventNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.cc + a.otc > 0).map((b) => {
        return {
          ...b,
          icon: b.spic,
          count: b.cc + b.otc,
          useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 冠军导航 */
  const outrightNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.oc + a.otc > 0).map((b) => {
        return {
          ...b,
          icon: b.spic,
          count: b.oc + b.otc,
          useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 虚拟体育导航 */
  const vSportsNavs = computed(() => {
    if (allSportsCount.value) {
      return allSportsCount.value.list.filter(a => a.vsc > 0).map((b) => {
        return {
          ...b,
          icon: b.spic,
          count: b.vsc,
          useCloudImg: true,
        }
      })
    }
    return []
  })

  /** 即将开赛导航 */
  const upcomingNavs = computed(() => {
    if (allSportsCount.value) {
      return [

        { si: 0, sn: t('全部'), icon: 'uni-all', count: allSportsCount.value.nc },
        ...allSportsCount.value.list.filter(a => a.nc > 0).map((b) => {
          return {
            ...b,
            icon: b.spic,
            count: b.nc,
            useCloudImg: true,
          }
        }),
      ]
    }
    return []
  })

  /** 所有球种的si */
  const allSportsSi = computed(() => {
    if (sidebarData.value && sidebarData.value.all)
      return sidebarData.value.all.map(a => a.si)
    return []
  })

  /** 所有球种名称sid对应列表 */
  const allSportsNameList = computed(() => {
    if (sidebarData.value && sidebarData.value.all)
      return sidebarData.value.all
    return []
  })

  /** 赛事类型下拉选单 */
  const sportsEventTypeList = computed(() => {
    if (homePageConfig.value && homePageConfig.value.list_filter) {
      return homePageConfig.value.list_filter.map((a) => {
        return {
          label: a.name,
          value: a.lfid,
          ...a,
        }
      })
    }
    else if (homePageConfig.value && !homePageConfig.value.list_filter) {
      return null
    }
    return []
  })

  // /** 所有球种盘口类型下拉选单 */
  const sportsBetTypeList = computed(() => {
    if (homePageConfig.value && homePageConfig.value.bettype_filter) {
      return homePageConfig.value.bettype_filter.map((a) => {
        return {
          si: a.si,
          btl: a.btl.map((b) => {
            return {
              ...b,
              value: `${b.bt}@@${b.egi}`,
              label: b.btn,
            }
          }),
        }
      })
    }
    return []
  })

  /** 获取球种对应的盘口类型下拉选单 */
  function getSportsBetTypeListBySi(si: number) {
    return sportsBetTypeList.value.find(a => a.si === si)?.btl
      ?? [{ value: '3@@1', label: t('获胜盘') }]
  }

  /** 获取球种对应icon */
  function getSportsIconBySi(si: number) {
    console.log(allSportsNameList.value)
    return sportsIconPathFormatBySite(allSportsNameList.value.find(a => a.si === si)?.spic ?? '')
  }

  /** 切换场馆 */
  function changeProvider(id: string) {
    if (currentProvider.value === id)
      return

    if (numberReg.test(id)) {
      currentProvider.value = id
      Local.set(STORAGE_SPORTS_CURRENT_PROVIDER, id)
    }
  }

  /** 渲染赔率 */
  const renderOdds = (odds: number) => {
    return computed(() => {
      let _type = sportsOddsType.value
      if (getLangForBackend() === EnumLanguage['zh-CN'])
        _type = EnumSportsOddsType.DECIMAL

      return SportsOdds.convert(odds, _type).toString()
    })
  }

  /** 设置当前体育赔率展示方式 */
  function setSportsOddsType(type: EnumSportsOddsType) {
    sportsOddsType.value = type
    Local.set(STORAGE_SPORTS_ODDS_TYPE_KEY, type)
  }

  /** 获取当前体育赔率展示方式 */
  function getSportsOddsType() {
    const value = Local.get<EnumSportsOddsType>(STORAGE_SPORTS_ODDS_TYPE_KEY)?.value
    if (value)
      return value
    else
      return EnumSportsOddsType.DECIMAL
  }

  /** 更新收藏赛事列表 */
  function refreshSportsFavList() {
    runGetFavoriteList({
      si: 0,
      cur: currentGlobalCurrencyMap.value.cur,
    })
  }

  return {
    AllOddsTypes,
    sportsOddsType,
    betSlipData,
    currentProvider,
    providerList,
    allSportsCount,
    sidebarData,
    liveCount,
    currentLiveNav,
    currentLiveBetType,
    currentVSportsNav,
    currentVSportsBetType,
    hotEventNavs,
    todayEventNavs,
    sportLiveNavs,
    earlyEventNavs,
    chuanEventNavs,
    outrightNavs,
    vSportsNavs,
    upcomingNavs,
    currentUpcomingNav,
    sportsFavoriteData,
    allSportsSi,
    allSportsNameList,
    cart,
    currentFavNav,
    currentFavBetType,
    sportsBetTypeList,
    sportsEventTypeList,
    lobbyCurrentEventType,
    currentLobbySiNav,
    currentLobbyBetType,
    isSportsMaintained,
    isSportsLoginSusses,
    isSportsLogin,
    isRequestSportsLogin,
    marketType,
    isLobbyLoadFirst,
    renderOdds,
    setSportsOddsType,
    getSportsOddsType,
    changeProvider,
    refreshSportsFavList,
    runSportsCount,
    getSportsIconBySi,
    getSportsBetTypeListBySi,
    runAsyncSportsLogin,
    setSportLogin,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSportsStore, import.meta.hot))

import type { Menu } from '~/composables/useApiMenuData'
import { ApiMemberPlatformList, ApiSportCount, ApiSportGetFavoriteList, ApiSportsHomePageConfig, ApiSportSidebar, ApiSportsLogin } from '@tg/apis'
import {
  IconSptBallPlate,
  IconSptUserBet,
  IconUniRebatereal,
  IconSptOdds,
  IconSptBasketball
} from '@tg/icons';

export enum EnumSportsPanelType {
  /** 三项投注 */
  THREE = 'THREE',
  /** 标准 */
  STANDARD = 'STANDARD',
}
export enum EnumSportsOddsType {
  /** 小数式 */
  DECIMAL = 'DECIMAL',
  /** 分数式 */
  FRACTION = 'FRACTION',
  /** 美式 */
  AMERICAN = 'AMERICAN',
  /** 印尼格式 */
  INDONESIA = 'INDONESIA',
  /** 香港格式 */
  HONGKONG = 'HONGKONG',
  /** 马来格式 */
  MALAYSIA = 'MALAYSIA',
}
export enum EnumSportsEventType {
  /** 今日赛事 */
  TODAY = 1,
  /** 滚球 */
  LIVE = 2,
  /** 早盘 */
  EARLY = 3,
  /** 串关 */
  CHUAN = 4,
  /** 冠军 */
  OUTRIGHT = 5,
  /** 热门赛事 */
  HOT = 6,
}

/** 投注单数据格式 */
interface IBetSlipData {
  // 测试
  [key: string]: any
}

export const useSportsStore = defineStore('sports', () => {
  const { t } = useI18n()
  const router = useLocalRouter()
  const { isLogin, currentGlobalCurrency, userInfo } = storeToRefs(useAppStore())
  const { userLanguage } = storeToRefs(useLanguageStore())
  /** 体育赔率展示方式 */
  const sportsOddsType = ref(getSportsOddsType())
  /** 投注单数据 */
  const betSlipData = ref<IBetSlipData[]>([])
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
  const cart = reactive(new SportsCart(currentGlobalCurrency.value))
  /** 体育场馆维护 */
  const isSportsMaintained = ref(globalInitMap.isSportsMaintained)
  /** 体育场馆登录成功 */
  const { bool: isSportsLoginSusses } = useBoolean(false)
  /** 本次是否请求过数据 */
  const { bool: isSportsLogin, setBool: setSportLogin } = useBoolean(false)
  const { rebateAutomatic } = useVipInfo()
  const { openRealTimeRebateDialog } = useDialogRealTimeRebate()
  const { openRightSidebar } = useRightSidebar()
  const { closeLeftSidebar } = useLeftSidebar()
  const { isMobile } = storeToRefs(useWindowStore())

  /**
   * 是否请求体育登录接口
   *
   * 比如在体育路由下面，并且是登录状态
   */
  const isRequestSportsLogin = computed(() => {
    // 本次项目是否请求过体育登录接口
    const isSportPath = router.currentRoute.value.path.includes('sports')
    let status = false
    if (isSportsLogin.value)
      status = false

    if (isLogin.value && isSportPath && !isSportsLogin.value) {
      status = true
      setSportLogin(true)
    }
    return status
  })

  /** 体育计数源 */
  const { data: allSportsCount, run: runSportsCount } = useRequest(() =>
    ApiSportCount({ ic: 0 }), {
    onSuccess(res) {
      // 统一加载icon
      res.list.forEach((a) => {
        application.loadImage(a.spic)

          // 绿色、白色、青黑时预加载选中icon
          if (['green', 'white'].includes(globalInitMap.currentTheme)) {
            const temArr = a.spic.split('.')
            temArr[temArr.length - 2] = `${temArr[temArr.length - 2]}_active_${globalInitMap.currentTheme}theme`
            application.loadImage(temArr.join('.'))
          }
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
  const { run: runAsyncSportsLogin } = useRequest(() => ApiSportsLogin({ cur: currencyConfig[currentGlobalCurrency.value].cur }), {
    errorRetryCount: 3,
    errorRetryInterval: 1000,
    refreshDeps: [currentGlobalCurrency, isLogin],
    refreshDepsAction: () => {
      if (isRequestSportsLogin.value)
        runAsyncSportsLogin()
    },
    onSuccess() {
      isSportsLoginSusses.value = true
      runGetFavoriteList({
        si: 0,
        cur: currencyConfig[currentGlobalCurrency.value].cur,
      })
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
  const { data: homePageConfig, runAsync: runAsyncHomeConfig } = useRequest(ApiSportsHomePageConfig, {
    onSuccess(res) {
      if (res.list_filter) {
        lobbyCurrentEventType.value = res.list_filter[0].lfid
        // 统一加载icon
        res.list_filter.forEach((a) => {
          application.loadImage(a.icon)
          application.loadImage(a.icon_hl)
        })
      }
    },
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
    path: string
    icon: Component
    value: EnumSportsOddsType
  }>>(() => Object.values(EnumSportsOddsType).map(m => ({ title: t(m), path: '', icon: () => h("div"), value: m })))

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

  /** 侧边栏菜单 */
  const sportsMenu = computed(() => {
    return [
      {
        title: t('h5_sports_pop_up_menu_live_events'),
        path: `/sports/${SPORTS_PLAT_ID}/live`,
        icon: IconSptBallPlate,
        list: [],
        domId: '',
        fixtureCount: liveCount.value,
      },

      // { title: t('h5_menu_sports_tab_starting_soon'), path: `/sports/${SPORTS_PLAT_ID}/upcoming`, icon: 'spt-timing', list: [], domId: '' },
      // isLogin.value && isMobile.value
      //   ? {
      //       title: t('notification_center'),
      //       path: '',
      //       icon: 'navbar-notice',
      //       list: [],
      //       domId: 'notification',
      //       token: true,
      //       callBack: () => {
      //         openRightSidebar(EnumRightSidebarContent.NOTIFICATION)
      //         setTimeout(() => {
      //           closeLeftSidebar()
      //         }, 300)
      //       },
      //     }
      //   : undefined,
      {
        title: t('sports_left_side_menu_my_bets'),
        path: `/sports/${SPORTS_PLAT_ID}/my-bets?type=sports`,
        icon: IconSptUserBet,
        list: [],
        domId: '',
        token: true,
        sptToken: true,
      },
      isLogin.value && rebateAutomatic.value && +rebateAutomatic.value.automatic === 3 && userInfo.value && +userInfo.value.rebate_state && +userInfo.value.bonus_state === 1
        ? {
          domId: 'realTimeRebateDomId',
          path: '',
          list: [],
          token: true,
          icon: IconUniRebatereal,
          title: t('real_time_rebate'),
          callBack: () => openRealTimeRebateDialog(),
        }
        : undefined,
    ].filter(m => !!m)
  })

  /** 顶级体育项目 */
  const sportHotGames = computed<Menu>(() => {
    if (sidebarData.value && sidebarData.value.menu) {
      const topGamesObj = sidebarData.value.menu.find(a => a.menu_id === 3) ?? { list: [] }

      return topGamesObj?.list?.map((sport) => {
        return {
          title: sport.sn,
          path: '',
          icon: sport.spic,
          useCloudImg: true,
          domId: `sports-hot-game-${sport.si}`,
          list: [

            { title: 'Live & Upcoming', path: `/sports/${SPORTS_PLAT_ID}/${sport.si}?tab=1`, icon: 'spt-ball-plate' },

            { title: 'Outrights', path: `/sports/${SPORTS_PLAT_ID}/${sport.si}?tab=2`, icon: 'spt-timing' },
            ...(sport.list
              ? sport.list.map((league) => {
                  return {
                    title: league.cn,
                    icon: league.cpic,
                    useCloudImg: true,

                    path: `/sports/${SPORTS_PLAT_ID}/${sport.si}/${league.pgid}/${league.ci}?${application.objectToUrlParams({ sn: sport.sn, pgn: league.pgn, cn: league.cn })}`,
                  }
                })
              : []),

            { title: 'View All', path: `/sports/${SPORTS_PLAT_ID}/${sport.si}?tab=3`, icon: 'uni-view-all' },
          ],
        }
      })
    }
    return []
  })

  /** 体育项目 */
  const sportGameList = computed(() => {
    if (sidebarData.value && sidebarData.value.all) {
      const list = sidebarData.value.all.map((item) => {
        return {
          title: item.sn,
          path: `/sports/${SPORTS_PLAT_ID}/${item.si}?nav=${JSON.stringify({ si: item.si, sn: item.sn })}`,
          icon: item.spic,
          useCloudImg: true,
        }
      })
      return [
        {
          title: t('sports_events2'),
          path: '',
          icon: IconSptBasketball,
          list,
          domId: 'sports-game-list',
        },
      ]
    }
    return []
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

        { si: 0, sn: t('finance_other_tab_all'), icon: 'uni-all', count: allSportsCount.value.nc },
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

  const sportOddType = computed<Menu[]>(() => [
    {
      title: `${t('sports_odds_title', { other: 'cược' })}${userLanguage.value === 'zh-CN' ? '：' : ': '}${t(sportsOddsType.value)}`,
      path: '',
      icon: IconSptOdds,
      type: 'radio',
      value: sportsOddsType.value,
      radioChange: (val: EnumSportsOddsType) => setSportsOddsType(val),
      list: AllOddsTypes.value,
      domId: 'sports-odds-type',
    },
  ])

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
      ?? [{ value: '3@@1', label: t('sports_winner_market') }]
  }

  /** 获取球种对应icon */
  function getSportsIconBySi(si: number) {
    console.log(allSportsNameList.value)
    return allSportsNameList.value.find(a => a.si === si)?.spic ?? ''
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
      if (getCurrentLanguageForBackend() === EnumLanguage['zh-CN'])
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
      cur: currencyConfig[currentGlobalCurrency.value].cur,
    })
  }

  watch(router.currentRoute, () => {
    if (isRequestSportsLogin.value)
      runAsyncSportsLogin()
  })

  return {
    AllOddsTypes,
    sportsOddsType,
    sportOddType,
    betSlipData,
    currentProvider,
    providerList,
    allSportsCount,
    sidebarData,
    liveCount,
    sportsMenu,
    sportHotGames,
    sportGameList,
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
    renderOdds,
    setSportsOddsType,
    getSportsOddsType,
    changeProvider,
    refreshSportsFavList,
    runSportsCount,
    getSportsIconBySi,
    getSportsBetTypeListBySi,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useSportsStore, import.meta.hot))

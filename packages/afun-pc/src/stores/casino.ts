import type { Menu } from '~/composables/useApiMenuData'
import { ApiMemberGameCate, ApiMemberGameLobby, ApiMemberGameHotSearchList, ApiMemberPlatformVenueList } from '@tg/apis'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { IconChessGameProvider, IconUniRecGames } from '@tg/icons';

export const useCasinoStore = defineStore('casino', () => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useLocalRouter()
  const isSidebarHasProvider = ref(false)
  const currentCasinoNav = ref('')
  const firstCasinoNav = ref('')
  const sidebarClickTime = ref(0)
  //全局的一行几个排序
  const globleDisplay_num = computed(() => {
    if (globalInitMap.currentTemplate === 6) {
      return 4
    } else {
      return 3
    }
  })

  const { bool: hasBetOrder, setBool: setHasBetOrder } = useBoolean(false)
  const { isMobile } = storeToRefs(useWindowStore())
  const { closeLeftSidebar } = useLeftSidebar()

  // 图片比例
  const imageRatio = computed(() => {
    if (!globalInitMap.allBrandInfo?.base?.gameImgType || globalInitMap.allBrandInfo?.base?.gameImgType === 1) {
      return '68/91'
    }
    else {
      return '1/1'
    }
  })

  // 图片border Url
  const imageBorder = computed(() => {
    if (!globalInitMap.allBrandInfo?.base?.gameImgType || globalInitMap.allBrandInfo?.base?.gameImgType === 1) {
      return '/afun-pc/img/border/border.svg'
    }
    else {
      return '/afun-pc/img/border/border2.svg'
    }
  })

  // 查看全部 Url
  const imageCheckAll = computed(() => {
    if (!globalInitMap.allBrandInfo?.base?.gameImgType || globalInitMap.allBrandInfo?.base?.gameImgType === 1) {
      return '/png/casino/seeAll-en.png'
    }
    else {
      return '/png/casino/seeAll-en2.png'
    }
  })

  // 图片目录
  const imageDirectory = computed(() => {
    if (!globalInitMap.allBrandInfo?.base?.gameImgType || globalInitMap.allBrandInfo?.base?.gameImgType === 1) {
      return 'images'
    }
    else if (globalInitMap.allBrandInfo?.base?.gameImgType === 2) {
      return 'images-ph'
    }
    else if (globalInitMap.allBrandInfo?.base?.gameImgType === 3) {
      return 'images-af'
    }
    else {
      return 'images'
    }
  })

  // 搜索热词
  const searchHotWordList = ref<Array<string>>([])

  // 搜索记录
  const searchRecordList = ref<Array<string>>(Local.get('HOME_SEARCH_RECORD_LIST')?.value as unknown as string[] ?? [])


  /** 游戏提供商数据(PG,EVO,...) */
  const { list: venueList } = useList(ApiMemberPlatformVenueList, {
    manual: false,
  })

  // 游戏详情页 底部 一排 热门游戏 cid: 100 game_type xx
  // 热门游戏 cid: 100 game_type xx
  const { data: cateHotData, runAsync: runGetCateHotData } = useRequest((game_type: string) => ApiMemberGameCate({ cid: '100', game_type, ty: 1 }), {
    manual: true,
  })

  // 大厅总数据接口
  const { data, runAsync: runAsyncGameLobby } = useRequest(ApiMemberGameLobby, {
    manual: false,
    onSuccess(res) {
      if (res.navs && res.navs.length > 0) {
        // 修改大厅的ty
        res.navs.forEach((item, index) => {
          if (item.ty === 1 && item.cid === '1') {
            res.navs[index].ty = -1
            res.navs[index].cid = 'all'
            res.navs[index].platform_id = 'all'
          }
        })

        /** 🔖BETFF站点如果有热门隐藏大厅 */
        if (getEnv().VITE_SITE_NAME === 'btf' && globalInitMap.currentTheme === 'new-default') {
          const hotIndex = res.navs.findIndex(a => a.cid === '17')
          if (hotIndex > -1) {
            const [hotItem] = res.navs.splice(hotIndex, 1)
            res.navs[0] = hotItem
          }
        }

        firstCasinoNav.value = res.navs[0].ty === 1 ? `${res.navs[0].ty}&${res.navs[0].cid}` : `${res.navs[0].ty}&${res.navs[0].platform_id}`
        currentCasinoNav.value = res.navs[0].ty === 1 ? `${res.navs[0].ty}&${res.navs[0].cid}` : `${res.navs[0].ty}&${res.navs[0].platform_id}`
      }

      if (res.sidebars && res.sidebars.find(a => a.cid === '5'))
        isSidebarHasProvider.value = true
    },
  })
  /** 厂商列表 */
  const cateProviderData = computed(() => {
    if (data.value && data.value.venues)
      return data.value.venues
    return {
      id: '',
      name: '',
      icon: '',
      total: 0,
      venue: {
        pc: [],
        h5: [],
      },
    }
  })
  // 横向菜单
  const casinoNav = computed(() => {
    if (data.value) {
      if (data.value.navs && data.value.navs.length) {
        const _navs: {
          ty: number
          cid: string
          platform_id: string
          name: string
          icon: string
          background: string
          useCloudImg: boolean
        }[] = cloneDeep(data.value.navs)

        for (let i = 0; i < _navs.length; i++)
          _navs[i].useCloudImg = true

        return _navs.map((a) => {
          return {
            ...a,
            label: a.name,
            value: a.ty === 1 ? `${a.ty}&${a.cid}` : `${a.ty}&${a.platform_id}`,
          }
        })
      }
      return null
    }
    return []
  })
  // 大厅游戏列表
  const casinoGameList = computed(() => {
    if (data.value && data.value.litems) {
      return data.value.litems.map(a => {
        if (a.cid === '5') {
          return {
            ...toRaw(a),
            title: a.name,
            list: [],
            path: `/group/all-provider?ty=1`,
            useCloudImg: true,
            gameList: a.venue?.h5.map((b, i) => {
              return {
                item_nums: 3,
                list: toRaw(b),
              }
            }),
          }
        } else {
          let gameList: any[] = []
          if (a.ty === 2 || a.ty === 4) {
            a.games && a.games.length > 0 && (gameList = [
              {
                item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[0] ?? 4 : 4,
                list: toRaw(a.games),
              }
            ])
          } else {
            a.nav_games && a.nav_games.length > 0 && (gameList = a.nav_games?.map((b, i) => {
              return {
                item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[i] ?? 4 : 4,
                list: toRaw(b),
              }
            }))
          }
          return {
            ...a,
            title: a.name,
            list: [],
            path: a.cid === '6'
              ? `/casino/group/provider?vid=801&ty=${a.ty}`
              : `/casino/group/category?cid=${a.ty === 1 ? a.cid : a.cid}&ty=${a.ty}`, // platform_id
            useCloudImg: true,
            gameList,
          }
        }
      }).filter(item => item.gameList && item.gameList.length > 0)
    }
    return []
  })

  const casinoGameProvider = computed<Menu>(() => {
    if (data.value && data.value!.navs && data.value!.navs.length && data.value!.navs.filter(n => +n.ty === 1 && n.cid === '5').length) {
      return [{
        title: t('h5_casino_browse_pop_up_menu_game_provider'),
        callBack: () => {
          currentCasinoNav.value = '1&5'
          setTimeout(() => {
            sidebarClickTime.value = new Date().getTime()
            if (route.name !== 'casino-home')
              router.push('/')
            isMobile.value && closeLeftSidebar()
          }, 0)
        },
        icon: IconChessGameProvider,
        list: [],
        domId: '',
      }]
    }
    return [{
      title: t('h5_casino_browse_pop_up_menu_game_provider'),
      path: '/casino/collection/provider',
      icon: IconChessGameProvider,
      list: [],
      domId: '',
    }]
  })

  // 左侧边栏
  const casinoSidebar = computed(() => {
    if (data.value && data.value.sidebars) {
      return data.value.sidebars.filter(b => b.cid !== '5').map((a) => {
        if ((+a.ty === 1 || +a.ty === 5) && data.value!.navs && data.value!.navs.length && data.value!.navs.filter(n => (+n.ty === 1 || +n.ty === 5) && n.cid === a.cid).length) {
          console.log('点击判断 跳转首页 对应 tabs', data.value!.navs, route.name)
          return {
            ...a,
            title: a.name,
            list: [],
            // path: a.cid === '6'
            //   ? `/casino/group/provider?vid=801&ty=${a.ty}`
            //   : `/casino/group/category?cid=${a.ty === 1 ? a.cid : a.platform_id}&ty=${a.ty}`,
            callBack: () => {
              currentCasinoNav.value = `${a.ty}&${a.cid}`
              setTimeout(() => {
                sidebarClickTime.value = new Date().getTime()
                if (route.name !== 'casino-home')
                  router.push('/')
                isMobile.value && closeLeftSidebar()
              }, 0)
            },
            useCloudImg: true,
          }
        }

        return {
          ...a,
          title: a.name,
          list: [],
          path: a.cid === '6'
            ? `/casino/group/provider?vid=801&ty=${a.ty}`
            : `/casino/group/category?cid=${a.ty === 1 ? a.cid : a.cid}&ty=${a.ty}`, // platform_id
          useCloudImg: true,
        }
      })
    }
    return []
  })
  // 推荐游戏
  const casinoRecData = computed(() => {
    if (data.value && data.value.bottoms) {
      const obj = data.value.bottoms[0]
      return {
        ...obj,
        path: '/casino/group/category?cid=100', // ${obj.cid}
        useCloudImg: true,
      }
    }

    return {
      ty: 1,
      total: 0,
      platform_id: '0',
      name: t('casino_games_recommend'),
      icon: IconUniRecGames,
      games: [],
      path: '',
      cid: '',
      useCloudImg: false,
    }
  })

  function getBg(cid: string) {
    if (data.value) {
      const navs = data.value.navs ?? []
      const sidebars = data.value.sidebars ?? []
      const bottoms = data.value.bottoms ?? []
      const litems = data.value.litems ?? []
      const arr = [...navs, ...sidebars, ...bottoms, ...litems]
      const str = arr.find(a => a.cid === cid || a.platform_id === cid)?.background ?? ''
      return str
    }
    return ''
  }
  function getTitleByCid(cid: string, ty?: number) {
    if (cid == '100')
      return t('game_type_rec')

    if (data.value) {
      const navs = data.value.navs ?? []
      const sidebars = data.value.sidebars ?? []
      const items = data.value.litems ?? []
      const bottoms = data.value.bottoms ?? []
      const arr = [...navs, ...sidebars, ...items, ...bottoms]
      const str = arr.find((a) => {
        if (ty)
          return a.cid === cid && a.ty === ty

        return a.cid === cid || a.platform_id === cid
      })?.name ?? ''
      return str
    }
    return ''
  }
  function getTitleByVid(vid: string) {
    if (venueList.value)
      return venueList.value.find(a => a.id === vid || a.venue_id === vid)?.name ?? ''

    return ''
  }

  async function getMemberGameHotSearchList() {
    const data = await ApiMemberGameHotSearchList()
    searchHotWordList.value = data.d ?? []
  }
  
  watch(searchRecordList, (newVal) => {
    Local.set('HOME_SEARCH_RECORD_LIST', newVal)
  }, { deep: true })

  // 手动
  getMemberGameHotSearchList()
  return {
    allPlatformList: venueList,
    casinoNav,
    casinoGameList,
    casinoSidebar,
    casinoGameProvider,
    cateProviderData,
    lobbyBdata: data,
    isSidebarHasProvider,
    casinoRecData,
    currentCasinoNav,
    firstCasinoNav,
    sidebarClickTime,
    hasBetOrder,
    cateHotData,
    imageRatio,
    imageDirectory,
    imageBorder,
    imageCheckAll,
    globleDisplay_num,
    searchHotWordList,
    searchRecordList,
    runAsyncGameLobby,
    getBg,
    getTitleByCid,
    getTitleByVid,
    setHasBetOrder,
    runGetCateHotData,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCasinoStore, import.meta.hot))

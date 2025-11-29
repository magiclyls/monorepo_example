import type { IApiMemberGameLobbyRes, Menu } from '@tg/types'
import { ApiMemberGameHotSearchList, ApiMemberGameLobby, ApiMemberPlatformVenueList } from '@tg/apis'
import { useBoolean } from '@tg/hooks'
import { getBrandInfo, Local } from '@tg/utils'
import { cloneDeep } from 'lodash'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { computed, ref, toRaw, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

export const useCasinoStore = defineStore('casino', () => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const isSidebarHasProvider = ref(false)
  const currentCasinoNav = ref('')
  const firstCasinoNav = ref('')
  const sidebarClickTime = ref(0)

  const { bool: hasBetOrder, setBool: setHasBetOrder } = useBoolean(false)

  // 图片比例
  const imageRatio = computed(() => {
    if (getBrandInfo('base.gameImgType') === 1) {
      return '68/91'
    }
    else {
      return '1/1'
    }
  })
  console.log('imageRatio')
  // 图片border Url
  const imageBorder = computed(() => {
    if (getBrandInfo('base.gameImgType') === 1) {
      return `${import.meta.env.BASE_URL}afun-h5/svg/border.svg`
    }
    else {
      return `${import.meta.env.BASE_URL}afun-h5/svg/border2.svg`
    }
  })

  // 图片目录
  const imageDirectory = computed(() => {
    if (getBrandInfo('base.gameImgType') === 1) {
      return 'images'
    }
    else if (getBrandInfo('base.gameImgType') === 2) {
      return 'images-ph'
    }
    else if (getBrandInfo('base.gameImgType') === 3) {
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

  // 推荐游戏
  const recommendGameList = ref<Record<string, any>>({})

  // 已经打开过的游戏
  const openedGameListData = ref<Record<string, any>>({})

  /** 全部游戏提供商数据 */
  const venueList = ref()
  async function getMemberPlatformVenueList() {
    const res = await ApiMemberPlatformVenueList({ page: 1, page_size: 100, game_type: 0 })
    venueList.value = res.d
  }

  // 大厅总数据接口
  const data = ref<IApiMemberGameLobbyRes>()
  const gameLobbyDateLoading = ref(false)
  async function runAsyncGameLobby() {
    try {
      gameLobbyDateLoading.value = true
      const res = await ApiMemberGameLobby()
      data.value = res
      if (res.navs && res.navs.length > 0) {
        // 修改大厅的ty
        res.navs.forEach((item, index) => {
          if (item.ty === 1 && item.cid === '1') {
            res.navs[index].ty = -1
            res.navs[index].cid = 'all'
            res.navs[index].platform_id = 'all'
          }
        })

        firstCasinoNav.value = res.navs[0].ty === 1 ? `${res.navs[0].ty}&${res.navs[0].cid}` : `${res.navs[0].ty}&${res.navs[0].platform_id}`
        currentCasinoNav.value = res.navs[0].ty === 1 ? `${res.navs[0].ty}&${res.navs[0].cid}` : `${res.navs[0].ty}&${res.navs[0].platform_id}`
      }

      if (res.sidebars && res.sidebars.find(a => a.cid === '5'))
        isSidebarHasProvider.value = true
      gameLobbyDateLoading.value = false
    }
    catch (error) {
      gameLobbyDateLoading.value = false
    }
  }

  /** lobby游戏提供商 */
  const cateProviderData = computed(() => {
    if (data.value && data.value.venues) {
      const a = data.value.venues
      const h5List: Record<string, any>[] = []
      a.venue?.h5.filter(item => item).forEach((b, i) => {
        h5List.push(...b)
      })
      // 去重
      const list = h5List.filter(
        (item, index, self) => index === self.findIndex(t => t.platform_id === item.platform_id),
      )
      let PCList: Record<string, any>[] = []
      if (a.venue?.pc) {
        PCList = a.venue?.pc[0]
      }

      return {
        ...toRaw(a),
        title: a.name,
        list,
        PCList,
        path: '/group/all-provider?ty=1',
        useCloudImg: true,
        gameList: a.venue?.h5.filter(item => item).map((b, i) => {
          return {
            item_nums: 3,
            list: toRaw(b),
          }
        }),
      }
    }
    return {} as any
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
      return data.value.litems.map((a) => {
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
        }
        else {
          let gameList: any[] = []
          if (a.ty === 2 || a.ty === 4) {
            a.games && a.games.length > 0 && (gameList = [
              {
                item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[0] ?? 4 : 4,
                list: toRaw(a.games),
              },
            ])
          }
          else {
            a.nav_games && a.nav_games.length > 0 && (gameList = a.nav_games?.map((b, i) => {
              return {
                item_nums: a.item_nums && a.item_nums.length > 0 ? a.item_nums[i] ?? 4 : 4,
                list: toRaw(b),
              }
            }))
          }
          return {
            ...toRaw(a),
            title: a.name,
            list: [],
            path: `/group/category/${a.cid}?cid=${a.cid}&ty=${a.ty}`,
            useCloudImg: true,
            gameList,
          }
        }
      }).filter(item => item.gameList && item.gameList.length > 0)
    }
    return []
  })

  const casinoGameProvider = computed<Menu>(() => {
    if (data.value && data.value!.navs && data.value!.navs.length && data.value!.navs.filter((n: Record<string, any>) => +n.ty === 1 && n.cid === '5').length) {
      return [{
        title: t('游戏提供商'),
        callBack: () => {
          currentCasinoNav.value = '1&5'
          setTimeout(() => {
            sidebarClickTime.value = new Date().getTime()
            if (route.name !== 'Home')
              router.push('/')
          }, 0)
        },
        icon: 'chess-game-provider',
        list: [],
        domId: '',
      }]
    }
    return [{
      title: t('游戏提供商'),
      path: '',
      icon: 'chess-game-provider',
      list: [],
      domId: '',
    }]
  })

  // 左侧边栏
  const casinoSidebar = computed(() => {
    if (data.value && data.value.sidebars) {
      return data.value.sidebars.filter((b: Record<string, any>) => b.cid !== '5').map((a: Record<string, any>) => {
        if ((+a.ty === 1 || +a.ty === 5) && data.value!.navs && data.value!.navs.length && data.value!.navs.filter((n: Record<string, any>) => (+n.ty === 1 || +n.ty === 5) && n.cid === a.cid).length) {
          return {
            ...a,
            title: a.name,
            list: [],
            // path: a.cid === '6'
            //   ? `/provider?vid=801&ty=${a.ty}`
            //   : `/category?cid=${a.ty === 1 ? a.cid : a.platform_id}&ty=${a.ty}`,
            callBack: () => {
              currentCasinoNav.value = `${a.ty}&${a.cid}`
              setTimeout(() => {
                sidebarClickTime.value = new Date().getTime()
                if (route.name !== 'casino-home')
                  router.push('/')
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
            ? `/group/provider/801?vid=801&ty=${a.ty}`
            : `/group/category/${a.cid}?cid=${a.cid}&ty=${a.ty}`, // platform_id
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
        path: '/category?cid=100', // ${obj.cid}
        useCloudImg: true,
      }
    }

    return {
      ty: 1,
      total: 0,
      platform_id: '0',
      name: t('热门推荐'),
      icon: 'uni-rec-games',
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
    if (cid === '100')
      return t('热门推荐')
    if (ty && ty === 6)
      return 'Hot'
    if (ty && ty === 7)
      return 'New'
    if (data.value) {
      const navs = data.value.navs ?? []
      const sidebars = data.value.sidebars ?? []
      const bottoms = data.value.bottoms ?? []
      const items = data.value.litems ?? []
      // if (data.value.litems && data.value.litems) {
      //   data.value.litems.forEach((item) => {
      //     if (Array.isArray(item.nav_games)) {
      //       item.nav_games.forEach((item2) => {
      //         items.push(...item2 as any)
      //       })
      //     }
      //   })
      // }
      const arr = [...navs, ...sidebars, ...items, ...bottoms]
      const str = arr.find((a) => {
        // if (ty)
        //   return a.cid === cid && a.ty === ty

        return a.cid === cid || a.platform_id === cid
      })?.name ?? ''
      return str
    }
    return ''
  }
  function getTitleByVid(vid: string) {
    if (venueList.value)
      return venueList.value.find((a: Record<string, any>) => a.id === vid || a.venue_id === vid)?.name ?? ''
    return ''
  }

  function getTy(params: any) {
    if (params && params.ty) {
      if (params.ty && +params.ty === 2)
        params.ty = 4
      else if (params.ty && +params.ty === 3)
        params.ty = 2
    }
    return params
  }

  async function getMemberGameHotSearchList() {
    const data = await ApiMemberGameHotSearchList()
    searchHotWordList.value = data.d ?? []
  }

  watch(searchRecordList, (newVal) => {
    Local.set('HOME_SEARCH_RECORD_LIST', newVal)
  }, { deep: true })

  // 手动
  runAsyncGameLobby()
  getMemberPlatformVenueList()
  getMemberGameHotSearchList()
  return {
    venueList,
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
    imageRatio,
    imageDirectory,
    imageBorder,
    gameLobbyDateLoading,
    searchHotWordList,
    searchRecordList,
    recommendGameList,
    openedGameListData,
    runAsyncGameLobby,
    getBg,
    getTitleByCid,
    getTitleByVid,
    setHasBetOrder,
    getTy,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCasinoStore, import.meta.hot))

<script setup lang='ts'>
import { ApiMemberCateState, ApiMemberGameCateGames, ApiMemberGameList, ApiMemberGameRecList, ApiMemberPlatformState } from '@tg/apis'

interface Props {
  gameType: string
  sortType: string
  pids: string
  // 供应商专用，数据来源不一样
  platformOptions?: {
    label: string
    value: string
    count: number
    isChecked: boolean
  }[]
  ty?: string | number
}
defineOptions({
  name: 'AppCasinoGameTypeGameList',
})
const props = defineProps<Props>()
const emit = defineEmits(['loading', 'requestFinish', 'update:platformOptions'])
const route = useRoute()
const { VITE_CASINO_GAME_PAGE_SIZE } = getEnv()
const router = useLocalRouter()
const { t } = useI18n()

const currentType = ref(props.gameType)
const isRec = computed(() => currentType.value === 'rec') // 推荐游戏
const isProvider = computed(() => currentType.value === 'provider') // 供应商
const isCat = computed(() => currentType.value === 'category') // 类别
// 类别游戏数据
const cid = computed(() => isCat.value ? route.query.cid?.toString() ?? '' : '')
const gameTypeReal = ref(route.query.game_type?.toString() ?? '')

// 参数
const pid = computed(() =>
  isProvider.value ? route.query.pid?.toString() : void 0)
const vid = computed(() =>
  isProvider.value ? route.query.vid?.toString() : void 0)

const paramsGame = computed(() =>
  ({
    platform_id: props.pids,
    sort: props.sortType,
    venue_id: vid.value,
  }))
// 场馆游戏
const {
  page: gamePage,
  list: gameList,
  total: gameTotal,
  runAsync: runGameList,
  loading: loadingGame,
  loadMore: loadMoreGame,
} = useList(ApiMemberGameList, {
  onSuccess(res, params) {
    const paramsPids = params[0]?.platform_id ?? ''
    if (res.sums && res.sums.length > 0) {
      const arr = res.sums.map((a) => {
        return {
          label: a.platform_name,
          value: a.platform_id,
          count: a.total,
          isChecked: paramsPids.includes(a.platform_id),
        }
      })
      emit('update:platformOptions', arr)
    }
  },
}, { page_size: VITE_CASINO_GAME_PAGE_SIZE })
// 推荐游戏
const paramsRec = computed(() => ({ sort: props.sortType, platform_id: props.pids }))
const {
  page: recPage,
  list: recList,
  total: recTotal,
  runAsync: runRecList,
  loading: loadingRec,
  loadMore: loadMoreRec,
} = useList(ApiMemberGameRecList, {}, { page_size: VITE_CASINO_GAME_PAGE_SIZE })
// 类别游戏
const paramsCate = computed(() => ({
  cid: cid.value,
  sort: props.sortType,
  venue_id: props.pids,
  game_type: cid.value === '100' ? gameTypeReal.value : undefined,
  ty: route.query.ty as string,
}))
const {
  page: catePage,
  list: cateList,
  total: cateTotal,
  runAsync: runCateGames,
  loading: loadingCate,
  loadMore: loadMoreCate,
} = useList(ApiMemberGameCateGames, {}, { page_size: VITE_CASINO_GAME_PAGE_SIZE })
// 页面数据
const list = computed(() => {
  if (isProvider.value)
    return gameList.value
  else if (isRec.value)
    return recList.value
  else if (isCat.value)
    return cateList.value

  return []
})
const total = computed(() => {
  if (isProvider.value)
    return gameTotal.value
  else if (isRec.value)
    return recTotal.value
  else if (isCat.value)
    return cateTotal.value
  return 0
})
const loading = computed(() => {
  if (isProvider.value)
    return loadingGame.value
  else if (isRec.value)
    return loadingRec.value
  else if (isCat.value)
    return loadingCate.value
  return false
})
const pushData = computed(() => {
  if (isProvider.value)
    return loadMoreGame
  else if (isRec.value)
    return loadMoreRec
  else if (isCat.value)
    return loadMoreCate
  return () => { }
})
// 页码
const page = computed(() => {
  if (isProvider.value)
    return gamePage.value
  else if (isRec.value)
    return recPage.value
  else if (isCat.value)
    return catePage.value
  return 1
})

// 检查场馆是否开启
function checkPlat() {
  return new Promise((resolve, reject) => {
    ApiMemberPlatformState(pid.value || vid.value || '').then((res) => {
      if (res === 1) {
        resolve(res)
      }
      else {
        router.replace('/')
        reject(res)
      }
    }).catch((err) => {
      router.replace('/')
      reject(err)
    })
  })
}

// 检查类别是否开启
function checkCate() {
  return new Promise((resolve, reject) => {
    ApiMemberCateState({ cid: cid.value || '', ty: route.query.ty as string }).then((res) => {
      if (res === 1) {
        resolve(res)
      }
      else {
        router.replace('/')
        reject(res)
      }
    }).catch((err) => {
      router.replace('/')
      reject(err)
    })
  })
}

function init() {
  return new Promise((resolve) => {
    emit('loading')
    // 初始化
    if (isProvider.value) {
      checkPlat().then(() => {
        runGameList(paramsGame.value).finally(() => {
          emit('requestFinish')
          resolve(1)
        })
      })
    }
    else if (isRec.value) {
      runRecList(paramsRec.value).finally(() => {
        emit('requestFinish')
        resolve(1)
      })
    }
    else if (isCat.value) {
      checkCate().then(() => {
        runCateGames({ ...paramsCate.value }).finally(() => {
          emit('requestFinish')
          resolve(1)
        })
      })
    }
  })
}

init()
</script>

<template>
  <div>
    <AppCardList :list="list ?? []" :ty="ty" />
  </div>
  <AppLoadMore
      v-if="page !== 1 || page === 1 && !loading"
      class="center text-[12px] text-[#6D7693] font-[600] leading-[14px] mt-[20px]" :loading="loading"
      :finished="list.length >= total" @load="pushData"
    >
    <AppLoadMoreLoading v-show="loading" />
    <span v-show="!loading">
      {{ list.length === total ? t('no_more') : t('scroll_to_load_more') }}
    </span>
  </AppLoadMore>
</template>

<style lang='scss' scoped>
.theme-btn {
  @include webTheme('green') {
    --tg-base-button-style-bg: #055434;
    --tg-base-button-color: #fff;
  }
}
.load-more {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // gap: var(--tg-spacing-16);

  button {
    width: 184px;
    height: 44px;
    margin-top: var(--tg-spacing-16);
  }
}
</style>

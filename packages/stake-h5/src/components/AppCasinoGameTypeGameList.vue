<script setup lang='ts'>
import { ApiMemberCateState, ApiMemberGameCateGames, ApiMemberGameList, ApiMemberGameRecList, ApiMemberPlatformState } from '@tg/apis'
import { getEnv } from '@tg/utils';

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
const casinoStore = useCasinoStore()
const { globleDisplay_num } = storeToRefs(casinoStore)

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
  list: recList,
  total: recTotal,
  runAsync: runRecList,
  loading: loadingRec,
  loadMore: loadMoreRec,
} = useList(ApiMemberGameRecList, {}, { page_size: VITE_CASINO_GAME_PAGE_SIZE })
// 类别游戏
const paramsCate = computed(() => ({
  cid: cid.value,
  sort: props.sortType as EnumCasinoSortType,
  venue_id: props.pids,
  game_type: cid.value === '100' ? gameTypeReal.value : undefined,
  ty: route.query.ty as string,
}))
const {
  list: cateList,
  total: cateTotal,
  runAsync: runCateGames,
  loading: loadingCate,
  loadMore: loadMoreCate,
  data: cateListData
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
    <AppCardList :list="list ?? []" :ty="ty"  :display-num="globleDisplay_num" />
  </div>
  <div class="load-more mt-[22px] @md:mt-[24px]">
    <AppPercentage :total="total" :percentage="list?.length" />
    <BaseButton
      v-show="list && list?.length < total"
      class="theme-btn" size="md" bg-style="red" :loading="loading"
      @click="pushData"
    >
      <div>
        {{ $t('load_more') }}
      </div>
    </BaseButton>
  </div>
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

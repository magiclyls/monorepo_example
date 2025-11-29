<script setup lang='ts'>
import { ApiMemberGameCateGames, ApiMemberGameList, ApiMemberPlatformState } from '@tg/apis'
import { PhBaseEmpty, PhBaseImage, PhBaseInput, PhBaseLoadMore } from '@tg/bccomponents'
import { useBoolean, useList } from '@tg/hooks'
import { useCasinoStore } from '@tg/stores'
import { application, getEnv } from '@tg/utils'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppLoading from '~/components/AppLoading.vue'

defineOptions({ name: 'ProviderDetail' })
const setTitle = inject('setTitle', (v: string) => {})

const { VITE_CASINO_GAME_PAGE_SIZE } = getEnv()
const casinoStore = useCasinoStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const searchValue = ref('')
// 是否进行了搜索
const { bool: isSearching } = useBoolean(false)

const providerGameData = ref()
// 当前已经选择的场馆id
const nowVenueId = ref('')

// 参数
const ty = computed(() => route.query.ty?.toString() ?? '')
const pid = computed(() => route.query.pid?.toString() ?? '')
const vid = computed(() => route.query.vid?.toString() ?? '')
const title = computed(() => casinoStore.getTitleByVid(vid.value === '0' ? pid.value : vid.value))

const paramsGame = computed(() =>
  ({
    venue_id: vid.value,
  }))

// 供应商游戏
const {
  list: gameList,
  total: gameTotal,
  runAsync: runGameList,
  loading: loadingGame,
  loadMore: loadMoreGame,
  resetPage,
} = useList(ApiMemberGameList, {
  onSuccess(res, params) {
    providerGameData.value = res
    console.log(providerGameData.value.sums, 'catGameData')
  },
}, { page_size: VITE_CASINO_GAME_PAGE_SIZE })

// 供应商搜索参数
const paramsProvider = computed(() => {
  return {
    w: searchValue.value,
    ty: vid.value ? '3' : ty.value,
    cid: vid.value,
  }
})

// 供应商搜索接口
const {
  page: searchPage,
  list: searchGameList,
  run: runSearchCasinoGames,
  total: totalSearchGame,
  loadMore: loadMoreSearchGame,
  loading: loadingSearchGame,
} = useList(ApiMemberGameCateGames, {}, { page_size: VITE_CASINO_GAME_PAGE_SIZE })

function onSearch() {
  if (searchValue.value) {
    if (searchValue.value.length < 3) {
      // return Message.error(t('需要至少3个字符'))
    }

    isSearching.value = true
    runSearchCasinoGames(paramsProvider.value)
  }
  else {
    isSearching.value = false
    resetPage()
    runGameList(paramsGame.value)
  }
}

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

function changeVenueTabs(id: string) {
  if (nowVenueId.value === id) {
    nowVenueId.value = ''
  }
  else {
    nowVenueId.value = id
  }
}

function init() {
  return new Promise((resolve) => {
    checkPlat().then(() => {
      runGameList(paramsGame.value).finally(() => {
        resolve(1)
      })
    })
  })
}

watch(title, (a) => {
  if (a)
    setTitle(a)
}, { immediate: true })

await application.allSettled([init()])
</script>

<template>
  <div>
    <PhBaseInput
      v-model="searchValue" :placeholder="t('搜索游戏名称')" search style="
      --ph-base-input-padding-y:5rem;
      --ph-base-input-border-radius:100rem;
      --ph-base-input-style-placeholder-color:#BEC7DC;
      --ph-base-input-padding-right:10rem;
      --ph-base-input-border-color:#fff;
      " search-icon="uni-search2" @key-enter="onSearch"
    >
      <template #right>
        <div class="text-[#F23038] text-[14rem] font-[500] capitalize h-full flex items-center" @click="onSearch">
          {{ t('搜索') }}
        </div>
      </template>
    </PhBaseInput>
    <!-- <AppGameVenueTabs
      v-if="Number(providerGameData?.sums?.length) > 1" :active="nowVenueId" :list="providerGameData?.sums"
      class="my-[12rem]" @change="changeVenueTabs"
    /> -->
    <template v-if="isSearching">
      <div v-if="searchPage === 1 && loadingSearchGame">
        <AppLoading :height="300" />
      </div>
      <div v-else-if="!loadingSearchGame && !searchGameList.length" class="center mt-[12rem] text-[#6D7693] text-[12rem]">
        <PhBaseEmpty :description="t('未找到结果')">
          <template #icon>
            <PhBaseImage url="/ph-h5/png/uni-table-empty.png" />
          </template>
        </PhBaseEmpty>
      </div>
      <AppCasinoGameList v-else :list="searchGameList" class="mt-[11.75rem]" />
    </template>
    <div v-show="!isSearching">
      <AppCasinoGameList :list="gameList" class="mt-[11.75rem]" />
      <PhBaseLoadMore
        v-if="gameList.length" class="center text-[12rem] text-[#6D7693] font-[500] leading-[14rem] mt-[12rem]"
        :loading="loadingGame"
        :finished="gameList.length >= gameTotal" @load="loadMoreGame"
      >
        {{ loadingGame ? t('加载中') : gameList.length === gameTotal ? t('没有更多了') : t('滚动以加载更多') }}
      </PhBaseLoadMore>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

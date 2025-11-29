<script setup lang="ts">
import { ApiMemberCateState, ApiMemberGameCate, ApiMemberGameCateGames } from '@tg/apis'
import { PhBaseEmpty, PhBaseImage, PhBaseInput, PhBaseLoadMore } from '@tg/bccomponents'
import { useList } from '@tg/hooks'
import { useCasinoStore } from '@tg/stores'
import { EnumCasinoSortType, EnumOriginalLotteryVenue } from '@tg/types'
import { application, getEnv } from '@tg/utils'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute, useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppGameLotteryList from '~/components/AppGameLotteryList.vue'
import AppGameVenueTabs from '~/components/AppGameVenueTabs.vue'
import AppLoading from '~/components/AppLoading.vue'

const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()
const setTitle = inject('setTitle', (v: string) => { })

const casinoStore = useCasinoStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const cid = route.query.cid?.toString() ?? ''
const ty = route.query.ty?.toString() ?? ''
const gameName = route.query.name?.toString() ?? ''
const gameTypeReal = route.query.game_type?.toString() ?? ''
const isLottery = cid === EnumOriginalLotteryVenue.originalLottery

const firstLoadFinshed = ref(false)
// 当前已经选择的场馆id
const nowVenueId = ref('')
const sortType = ref(EnumCasinoSortType.hot)
const searchValue = ref('')

const { data: catGameData, runAsync: runGameCate, loading: gameCateloading } = useRequest(ApiMemberGameCate, {
  onSuccess(data) {
  },
})

const title = computed(() => gameName || casinoStore.getTitleByCid(cid, Number(ty)) || catGameData.value?.name)

// 类别游戏参数
const paramsCate = computed(() => ({
  cid,
  sort: sortType.value,
  venue_id: nowVenueId.value,
  game_type: cid === '100' ? gameTypeReal : '',
  ty,
  w: searchValue.value,
}))

// 类别游戏请求
const {
  page: catePage,
  list: cateList,
  total: cateTotal,
  runAsync: runCateGames,
  loading: loadingCate,
  loadMore: loadMoreCate,
  resetPage,
} = useList(ApiMemberGameCateGames, {}, { page_size: VITE_CASINO_HOME_PAGE_SIZE })

// 检查是否关闭类别
function checkCate() {
  return new Promise((resolve, reject) => {
    if (ty === '7' || ty === '6') {
      resolve(true)
    }
    else {
      ApiMemberCateState({ cid, ty }).then((res) => {
        if (res === 1) {
          resolve(res)
        }
        else {
          reject(res)
          router.replace('/')
        }
      }).catch((err) => {
        reject(err)
        router.replace('/')
      })
    }
  })
}
const gamesList = computed(() => {
  if (cateList.value) {
    return cateList.value
  }
  return []
})

function onSearch() {
  if (searchValue.value && searchValue.value.length < 3) {
    // Message.error(t('需要至少3个字符'))
  }
  else {
    resetPage()
    runCateGames({ ...paramsCate.value })
  }
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
    checkCate().then(() => {
      runCateGames({ ...paramsCate.value })
        .finally(() => {
          firstLoadFinshed.value = true
          resolve(1)
        })
    })
  })
}

watch([nowVenueId], () => {
  resetPage()
  runCateGames({ ...paramsCate.value })
})
watch(title, (a) => {
  if (a)
    setTitle(a)
}, { immediate: true })

await application.allSettled([
  runGameCate({ cid, game_type: cid === '100' ? gameTypeReal : '', ty }),
  init(),
])
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
        <div class="text-[#F23038] text-[14rem] font-[500]  h-full flex items-center" @click="onSearch">
          {{ t('搜索') }}
        </div>
      </template>
    </PhBaseInput>
    <AppGameVenueTabs
      v-if="Number(catGameData?.sums?.length) > 1" :active="nowVenueId" :list="catGameData?.sums"
      class="my-[12rem]" @change="changeVenueTabs"
    />
    <div v-if="catePage === 1 && loadingCate">
      <AppLoading :height="300" />
    </div>
    <div v-else-if="!loadingCate && !gamesList.length" class="center mt-[12rem] text-[#6D7693] text-[12rem] ">
      <PhBaseEmpty :description="t('未找到结果')">
        <template #icon>
          <PhBaseImage url="/ph-h5/png/uni-table-empty.png" />
        </template>
      </PhBaseEmpty>
    </div>
    <AppGameLotteryList v-else-if="isLottery" :list="gamesList" class="mt-[11.75rem]" />
    <AppCasinoGameList v-else :list="gamesList" class="mt-[11.75rem]" />
    <PhBaseLoadMore
      v-if="gamesList.length" class="center text-[12rem] text-[#6D7693] font-[500] leading-[14rem] mt-[12rem]"
      :loading="loadingCate" :finished="gamesList.length >= cateTotal" @load="loadMoreCate"
    >
      {{ loadingCate ? t('加载中') : gamesList.length === cateTotal ? t('没有更多了') : t('滚动以加载更多') }}
    </PhBaseLoadMore>
  </div>
</template>

<style scoped lang="scss"></style>

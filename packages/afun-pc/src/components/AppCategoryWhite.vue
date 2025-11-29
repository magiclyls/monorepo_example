<script setup lang="ts">
import { ApiMemberGameCate, ApiMemberGameCateGames } from '@tg/apis'

const { t } = useI18n()
const { appContentWidth, isMobile, windowHeight } = storeToRefs(useWindowStore())
const casinoStore = useCasinoStore()
const { cateProviderData, lobbyBdata } = storeToRefs(casinoStore)
const route = useRoute()
const router = useRouter()
const { push, back } = useLocalRouter()
const { bool: loading } = useBoolean(false)
const { bool: isFirst } = useBoolean(true)
const { bool: isInputing, setTrue: setInputingTrue, setFalse: setInputingFalse } = useBoolean(false)

let inputTimer: any = null
const groupFilterRef = ref()
const gameListRef = ref()
const currentType = ref('category')
const sortType = ref(EnumCasinoSortType.hot)
const pids = ref('')
const cid = ref(route.query.cid ? route.query.cid?.toString() ?? '0' : '0')
const ty = ref<string>(route.query.ty)
const gameTypeReal = ref(route.query.game_type?.toString() ?? '')
const searchValue = ref('')
const keywordLive = ref(
  Local.get<any[]>(STORAGE_SEARCH_KEYWORDS_LIVE)?.value ?? [],
)

const titles = computed<any>(() => ({ 3: t('page_title_live') }))
const vid = computed(() => route.query.vid?.toString() ?? '0')
/* 修复ios键盘临界值推动 */
const isMiniPhoneHeight = computed(() => isMobile.value && windowHeight.value < 844)

// 类别场馆列表
const {
  data: catGameData,
  run: runGameCate,
} = useRequest(ApiMemberGameCate, {
  onSuccess: () => {
    // scrollToTop()
  },
})
const title = computed(() => {
  const _cid = cid.value
  const _ty = ty.value
  return casinoStore.getTitleByCid(_cid, _ty) || catGameData.value?.name
})
// 类别搜索参数
const paramsCate = computed(() => ({
  w: searchValue.value,
  cid: cid.value,
  sort: sortType.value,
  venue_id: pids.value,
  game_type: cid.value === '100' ? gameTypeReal.value : undefined,
}))
// 类别搜索接口
const {
  list: searchGameList,
  run: runSearchCasinoGames,
  total: totalSearchGame,
  loadMore: loadMoreSearchGame,
  loading: loadingSearchGame,
} = useList(ApiMemberGameCateGames, {
  onSuccess(res, params) {
    if (res.d && res.d.length > 0) {
      const word = params[0].w

      // 去重
      if (keywordLive.value.includes(word))
        keywordLive.value.splice(keywordLive.value.findIndex(t => t === word), 1)

      keywordLive.value.unshift(word)
      keywordLive.value = keywordLive.value.slice(0, 5)
      Local.set(STORAGE_SEARCH_KEYWORDS_LIVE, keywordLive.value)
    }
  },
  onAfter() {
    setInputingFalse()
  },
}, { page_size: 48 })

const platformOptions = computed(() => {
  if (catGameData.value && catGameData.value.sums) {
    return catGameData.value.sums.map((a) => {
      return {
        label: a.platform_name,
        value: a.platform_id,
        count: a.total,
        isChecked: false,
      }
    })
  }
  return []
})
const bannerBg = computed(() => {
  if (cid.value === '100')
    return ''
  if (lobbyBdata.value)
    return casinoStore.getBg(cid.value) || catGameData.value?.background
  return ''
})

function startLoading() {
  loading.value = true
}
function stopLoading() {
  const t = setTimeout(() => {
    isFirst.value = false
    loading.value = false
    clearTimeout(t)
  }, 500)
}
// 游戏提供商选择变化
function onPlatTypeChecked(v: string) {
  pids.value = v
  searchValue.value = ''
}
// 排序变化
function onSortChange(v: any) {
  sortType.value = v
}
// 搜索输入
function onBaseSearchInput() {
  setInputingTrue()
  clearTimeout(inputTimer)
  if (searchValue.value.length < 3) {
    setInputingFalse()
    return
  }
  inputTimer = setTimeout(() => {
    if (searchValue.value.length >= 3) {
      Local.set(STORAGE_CLEAR_LIVE, true)
      runSearchCasinoGames({ ...paramsCate.value, ty: ty.value })
    }
    clearTimeout(inputTimer)
  }, 500)
}
// 近期搜索
function onClickKeyword(k: string) {
  setInputingTrue()
  searchValue.value = k
  runSearchCasinoGames({ ...paramsCate.value, ty: ty.value })
}
function onCloseKeyword(k: string) {
  keywordLive.value.splice(keywordLive.value.findIndex(t => t === k), 1)
  Local.set(STORAGE_SEARCH_KEYWORDS_LIVE, keywordLive.value)
}
function clearKeyword() {
  keywordLive.value.length = 0
  Local.remove(STORAGE_SEARCH_KEYWORDS_LIVE)
}
function intiKeyword() {
  if (!Local.get(STORAGE_CLEAR_LIVE)?.value) {
    const liveList = [
      'Monopoly',
      'Crazy Time',
      'Sweet Bonanza',
      'Money Train',
      'Reactoonz',
    ]
    Local.set(STORAGE_SEARCH_KEYWORDS_LIVE, liveList)
    keywordLive.value = liveList
  }
}

const prefixTitle = computed(() => cid.value && titles.value[cid.value]
  ? titles.value[cid.value]
  : title.value)

usePageTitle({
  prefix: prefixTitle,
})

watch(router.currentRoute, (a, o) => {
  if (a.path === o.path) {
    cid.value = a.query.cid ? route.query.cid?.toString() ?? '0' : '0'
    pids.value = ''
    sortType.value = EnumCasinoSortType.hot
    groupFilterRef.value?.resetPlatformChecked()
  }
})

intiKeyword()
onMounted(() => {
  runGameCate({ cid: cid.value, game_type: cid.value === '100' ? gameTypeReal.value : undefined, ty: ty.value })
})
</script>

<template>
  <div>
    <AppLoading v-if="isFirst" full-screen />
    <section v-show="!isFirst" class="layout-spacing tg-game-type-page">
      <BaseTemplate template="">
        <div class="group-banner-wrap" :class="{ 'less-than-700': appContentWidth <= 700 }">
          <div class="group-banner-bg" />
          <div class="banner-wrap">
            <div class="banner">
              <div class="left">
                <h1>
                  <span>{{ title }}</span>
                </h1>
              </div>
              <div
                class="right center" :style="{
                  '--app-sport-image-error-icon-size': '20px',
                }"
              >
                <AppImage
                  :key="bannerBg"
                  :is-cloud="bannerBg && bannerBg.length ? true : false"
                  style="height: 100%;width: auto;"
                  :url="bannerBg && bannerBg.length ? bannerBg : '/png/casino/group-banner-default.png'"
                  loading="eager"
                  err-icon="uni-game-err"
                />
              </div>
            </div>
          </div>
        </div>
      </BaseTemplate>

      <!-- pc的搜索 -->
      <div v-if="!isMobile" class="mt-[24px]">
        <AppGameSearch :key="currentType + cid + pids" game-type="1" :vid="vid" :cid="cid" />
      </div>
      <div class="mt-[22px] @md:mt-[24px]" :class="{ 'mt-[16px]': isMiniPhoneHeight }">
        <AppGroupFilter
          v-if="!isMobile && platformOptions.length"
          ref="groupFilterRef"
          :game-type="currentType"
          :sort-type="sortType"
          :platform-options="platformOptions"
          :disabled="false"
          @plat-type-checked="onPlatTypeChecked"
          @sort-type-change="onSortChange"
        />
        <!-- H5的搜索 -->
        <div v-if="isMobile">
          <BaseSearch
            v-model="searchValue" class="h-[42px] grow" :clearable="!!searchValue" :place-holder="t('search_game')"
            style="--tg-base-search-border-width:1px;"
            @input="onBaseSearchInput"
          >
            <template v-if="platformOptions.length" #left>
              <AppGroupFilterInSearch
                ref="groupFilterRef"
                :game-type="currentType"
                :sort-type="sortType"
                :platform-options="platformOptions"
                :disabled="false"
                @plat-type-checked="onPlatTypeChecked"
              />
            </template>
          </BaseSearch>
          <!-- <BaseButton v-else bg-style="dark" size="md" round @click="push('/casino/collection/provider')">
            {{ $t('casino_filter_provider_all') }}
          </BaseButton> -->
        </div>
      </div>
      <AppLoading v-if="loading" full-screen />
      <!-- 搜索的游戏列表 -->
      <div v-if="searchValue.length" class="mt-[22px]" :class="{ 'mt-[16px]': isMiniPhoneHeight }">
        <AppCardListSkeleton v-if="isInputing" />
        <template v-else>
          <template v-if="searchGameList && searchGameList?.length && searchValue.length >= 3">
            <AppCardList :list="searchGameList ?? []" />
            <div class="mt-[22px] flex flex-col items-center justify-center gap-[16px] text-center">
              <AppPercentage :total="totalSearchGame" :percentage="searchGameList?.length" />
              <BaseButton
                v-show="searchGameList?.length < totalSearchGame"
                class="h-[44px] w-[184px]" bg-style="primary" size="md" :loading="loadingSearchGame"
                @click="loadMoreSearchGame"
              >
                <div>
                  {{ $t('load_more') }}
                </div>
              </BaseButton>
            </div>
          </template>
          <template v-else>
            <div class="text-tg-text-lightgrey py-[22px] text-center text-[14px] font-semibold">
              <span v-show="searchValue.length < 3">
                {{ t('search_need_at_least_3_word') }}</span>
              <span v-show="searchValue.length >= 3 && !searchGameList.length">{{ t('search_no_result') }}</span>
            </div>
            <div v-if="keywordLive.length" class="flex flex-col gap-[6px]">
              <div class="text-tg-text-lightgrey flex items-center justify-between text-[14px] font-semibold leading-[1.5]">
                <label>{{ t('search_recent') }}</label>
                <BaseButton type="text" size="none" style="--tg-base-button-font-size:14px;" @click="clearKeyword">
                  {{ t('search_clear') }} ({{ keywordLive.length }})
                </BaseButton>
              </div>
              <div class="flex flex-wrap gap-[8px] gap-y-[16px]">
                <BaseTag
                  v-for="text in keywordLive" :key="text" :text="text" @click="onClickKeyword"
                  @close="onCloseKeyword"
                />
              </div>
            </div>
          </template>
        </template>
      </div>
      <!-- 普通的游戏列表 -->
      <div v-show="!searchValue.length" class="mt-[22px] @md:mt-[24px]" :class="{ 'mt-[16px]': isMiniPhoneHeight }">
        <AppCasinoGameTypeGameListWhite
          :key="pids + sortType"
          ref="gameListRef" game-type="category"
          :sort-type="sortType" :pids="pids"
          @request-finish="stopLoading" @loading="startLoading"
        />
      </div>

      <AppCasinoLobbyProviderSlider
        :data="cateProviderData?.venue ?? { h5: [], pc: [] }"
        :title="cateProviderData?.name ?? ''" :icon="cateProviderData?.icon ?? ''"
      />
    </section>
    <!--    <AppBetData mode="casino" /> -->
  </div>
</template>

<style lang="scss" scoped>
</style>

<route lang="yaml">
meta:
  layout: home
</route>

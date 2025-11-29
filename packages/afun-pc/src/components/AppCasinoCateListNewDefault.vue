<script setup lang="ts">
import { ApiMemberGameCate, ApiMemberGameCateGames, ApiMemberGameSearch } from '@tg/apis'

interface Props {
  cid: string
  name: string
  icon: string
  ty: string | number
}
defineOptions({
  name: 'AppCasinoCateList',
})
const props = defineProps<Props>()
const emit = defineEmits(['fetchEnd', 'fetchStart'])

const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()
const { t } = useI18n()
const appStore = useAppStore()
const { theme } = storeToRefs(appStore)
const { push } = useLocalRouter()
// const { isMobile } = storeToRefs(useWindowStore())
const { bool: isInputing, setTrue: setInputingTrue, setFalse: setInputingFalse } = useBoolean(false)
const { openNotify } = useNotify()
const paginationConfig = reactive({
  page: 1,
  page_size: VITE_CASINO_HOME_PAGE_SIZE,
})

let inputTimer: any = null
const searchValue = ref('')
const keywordLive = ref(
  Local.get<any[]>(STORAGE_SEARCH_KEYWORDS_LIVE)?.value ?? [],
)

const params = computed(() => {
  return {
    cid: props.cid,
    ty: props.ty,
  }
})
const memberGameCateGamesParams = computed(() => {
  return {
    ...params.value,
    sort: EnumCasinoSortType.hot,
    ...paginationConfig,
  }
})
const isProvider = computed(() => props.cid === '5')

const notifyThrottle = throttle(() => {
  openNotify({
    type: 'info',
    message: t('no_game_info_tip'),
  })
}, 5 * 1000, { leading: true, trailing: false })

const {
  data,
  runAsync,
  loading,
} = useRequest(ApiMemberGameCate, {
  onSuccess: (res) => {
    console.log('res ============+++++++++++++ ', res)
    judgeGameEmpty(res)
  },
})

const {
  data: moreList,
  runAsync: runMoreMemberGameCateGames,
  loading: moreLoading,
} = useRequest(ApiMemberGameCateGames)

const total = computed(() => {
  return data.value ? data.value.total : 0
})
// 单行数据
const list = computed(() => {
  if (!(data.value && data.value.games && data.value.games.length))
    return []

  const renderList: any = data.value.games

  if (moreList.value?.d && moreList.value.d.length)
    renderList.push(...moreList.value.d)

  return renderList
})
// 多行数据
const litems = computed(() => {
  if (data.value && data.value.litems) {
    return data.value.litems.map((a) => {
      return {
        ...a,
        path: `/casino/group/category?cid=${a.cid}&ty=${a.ty ?? props.ty}`, // props.ty
      }
    })
  }
  return []
})
// 游戏供应商数据 平铺
const providerList = computed(() => {
  if (data.value && data.value.venue && !!data.value.venue.pc)
    return data.value.venue.pc[0]

  return []
})

function _push() {
  if (props.cid === '6')
    push(`/casino/group/provider?vid=801&ty=${props.ty}`)

  else if (props.cid === '5')
    push(`/casino/collection/provider?ty=${props.ty}`)

  else
    push(`/casino/group/category?cid=${props.cid}&ty=${props.ty}`)
}
function goPage(item: any) {
  if (item.maintained === '2')
    return
  push(`/casino/group/provider?vid=${item.id}&ty=${props.ty}`)
}

/** 搜索相关🔍🔍 */
// 娱乐城搜索接口
const {
  list: searchGameList,
  run: runSearchCasinoGames,
  total: totalSearchGame,
  loadMore: loadMoreSearchGame,
  loading: loadingSearchGame,
} = useList(ApiMemberGameSearch, {
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
})
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
      runSearchCasinoGames({ w: searchValue.value })
    }
    clearTimeout(inputTimer)
  }, 500)
}
// 近期搜索
function onClickKeyword(k: string) {
  setInputingTrue()
  searchValue.value = k
  runSearchCasinoGames({ w: searchValue.value })
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
function getNextData() {
  paginationConfig.page++
  runMoreMemberGameCateGames({ ...memberGameCateGamesParams.value })
}

intiKeyword()
runAsync({ ...params.value })

function judgeGameEmpty(res: any) {
  if (props.cid !== '5' && (!searchValue.value || !searchValue.value.length)) {
    if (res.litems && res.litems.length) {
      if (res.litems.filter((rr: any) => rr.nav_games && rr.nav_games.length).length === 0)
        notifyThrottle()
    }
    else {
      if (res.games && res.games.length)
        console.log('mm')
      else
        notifyThrottle()
    }
  }
}

onActivated(() => {
  nextTick(() => {
    ApiMemberGameCate({ ...params.value }).then((res) => {
      console.log('activated res ========++++++++ ', res)
      judgeGameEmpty(res)
    })
  })
})

const showTitle = computed(() => {
  if (isProvider.value || searchValue.value.length)
    return true
  return list.value && list.value.length
})
</script>

<template>
  <AppLoading v-if="loading" full-screen />
  <div v-else class="list-wrap">
    <template v-if="litems.length === 0">
      <div v-show="showTitle" class="mb-[10px] flex items-center justify-between">
        <BaseButton
          type="text" size="none"
          @click="_push"
        >
          <div class="title" style="--app-sport-image-error-icon-size:28px;">
            <AppImage
              v-if="icon" width="28px" class="flex-shrink-0"
              height="28px"
              :url="icon"
              loading="eager"
              is-cloud with-theme
            />
            <span class="whitespace-nowrap">{{ name }}</span>
          </div>
        </BaseButton>
        <div class="right-wrap flex">
          <BaseButton
            v-if="total"
            type="square-line" class="h-[28px]" style="--tg-base-button-color:var(--tg-text-lightgrey);--tg-base-button-padding-x:18px; --tg-base-button-font-size:16px;--tg-base-button-square-line-border-color:var(--tg-border-color-grey-light);"
            @click="_push"
          >
            <span class="theme-all text-[13px]">{{ t('finance_other_tab_all') }}</span>
            <span class="total ml-[5px] text-[13px]">{{ total }}</span>
          </BaseButton>
        </div>
      </div>
      <!-- 平铺 -->
      <AppCardListNewDefault v-if="isProvider" :list="providerList" is-provider>
        <template #default="{ item }">
          <BaseProviderItem
            :url="item.icon"
            :maintained="item.maintained"
            @click="goPage(item)"
          />
        </template>
      </AppCardListNewDefault>

      <!-- 搜索的游戏列表 -->
      <div v-if="searchValue.length">
        <AppCardListSkeleton v-if="isInputing" />
        <template v-else>
          <template v-if="searchGameList && searchGameList?.length && searchValue.length >= 3">
            <AppCardListNewDefault :list="searchGameList ?? []" />
            <div class="mt-[22px] flex flex-col items-center justify-center gap-[16px] text-center">
              <AppPercentage :total="totalSearchGame" :percentage="searchGameList?.length" />
              <BaseButton
                v-show="searchGameList?.length < totalSearchGame"
                class="theme-more h-[44px] w-[184px]" bg-style="primary" size="md" :loading="loadingSearchGame"
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
      <AppCardListNewDefault v-show="!searchValue.length" :list="list" />
      <AppPercentage v-if="list.length" :total="total" :percentage="list?.length" class="mt-[24px]" />
      <div v-show="total > VITE_CASINO_HOME_PAGE_SIZE && !searchValue.length" class="load-more">
        <!-- <BaseButton
          size="md"
          @click="_push"
        >
          {{ t('view_all') }} {{ total }} {{ name }}
        </BaseButton> -->

        <BaseButton
          v-show="list && list?.length < total"
          size="md"
          bg-style="primary"
          :loading="moreLoading"
          class="theme-more"
          @click="getNextData"
        >
          <div>
            {{ $t('load_more') }}
          </div>
        </BaseButton>
      </div>
    </template>
    <!-- 多行样式 -->
    <template v-else-if="litems.length > 0">
      <template
        v-for="item in litems"
        :key="item.name"
      >
        <template v-if="theme === 'greenblack'">
          <AppSliderMultiLineWg
            v-if="item.nav_games && item.nav_games.length"
            :total="item.total"
            :icon="item.icon"
            :title="item.name"
            :data="item.nav_games && item.nav_games.length ? item.nav_games : []"
            :cid="item.cid"
            :ty="item.ty"
            :pid="item.platform_id"
            :path="item.path"
            use-cloud-img
          />
        </template>
        <template v-else>
          <AppSliderMultiLine
            v-if="item.nav_games && item.nav_games.length"
            :total="item.total"
            :icon="item.icon"
            :title="item.name"
            :data="item.nav_games && item.nav_games.length ? item.nav_games : []"
            :cid="item.cid"
            :ty="item.ty"
            :pid="item.platform_id"
            :path="item.path"
            use-cloud-img
          />
        </template>
      </template>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.theme-more {
  @include webTheme('green') {
    --tg-base-button-style-bg: #055434;
  }
}
.theme-all {
  @include webTheme('green') {
    color: #ffffff;
  }
}
.list-wrap {
  margin-top: var(--tg-spacing-10);

  .title {
    font-size: var(--tg-font-size-base);
    color: var(--tg-text-white);
    display: flex;
    align-items: center;
    height: var(--tg-spacing-35);
    @include webTheme('greenblack') {
      color: #fff;
    }

    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }

    span {
      font-size: var(--tg-font-size-md);
      font-weight: var(--tg-font-weight-semibold);
      margin-left: var(--tg-spacing-8);
      line-height: 1.5;
    }
  }
}

.load-more {
  margin-top: var(--tg-spacing-24);
  display: flex;
  justify-content: center;
  text-align: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  button {
    width: 184px;
    height: 44px;
  }
}

.search-icon2 {
  :deep(.app-svg-icon) {
    font-size: 18px !important;
  }
}

.search-icon3 {
  :deep(.app-svg-icon) {
    font-size: 14px !important;
  }
}

.total {
  color: var(--tg-text-green);
  @include webTheme('green') {
    color: var(--tg-text-white);
  }
  @include webTheme('greenblack') {
    color: #28ffbb;
  }
}
</style>

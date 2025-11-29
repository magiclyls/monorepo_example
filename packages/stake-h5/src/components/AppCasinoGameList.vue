<script setup lang="ts">
import { ApiMemberGameList, ApiMemberGameSearch } from '@tg/apis'
import { getEnv } from '@tg/utils';

interface Props {
  platformId: string
  name: string
  icon: string
}
defineOptions({
  name: 'AppCasinoGameList',
})
const props = defineProps<Props>()
const emits = defineEmits(['fetchEnd', 'fetchStart'])
const { isMobile } = storeToRefs(useWindowStore())
const { bool: isInputing, setTrue: setInputingTrue, setFalse: setInputingFalse } = useBoolean(false)

let inputTimer: any = null
const searchValue = ref('')
const keywordLive = ref(
  Local.get<any[]>(STORAGE_SEARCH_KEYWORDS_LIVE)?.value ?? [],
)

// 游戏列表
const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()
const { t } = useI18n()
const { push } = useLocalRouter()

const params = computed(() => {
  return {
    platform_id: props.platformId,
  }
})

const {
  list,
  total,
  loading,
  runAsync,
} = useList(ApiMemberGameList)

function _push() {
  push(`/casino/group/provider?pid=${props.platformId}`)
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

intiKeyword()
runAsync(params.value)
</script>

<template>
  <AppLoading v-if="loading" full-screen />
  <div v-else class="list-wrap">
    <div class="mb-[5px]">
      <BaseButton
        type="text" size="none"
        @click="_push"
      >
        <div class="title">
          <AppImage
            v-if="icon" width="16px" class="flex-shrink-0"
            height="16px"
            :url="icon"
            is-cloud loading="eager"
          />
          <span class="whitespace-nowrap">{{ name }}</span>
        </div>
      </BaseButton>
    </div>
    <BaseSearch
      v-if=" isMobile"
      v-model="searchValue" class="search-icon2 w-ful mb-[15px] h-[34px]" :clearable="!!searchValue" :place-holder="t('search_game')"
      style="--tg-base-search-base-padding-x:6px;" @input="onBaseSearchInput"
    />

    <!-- 搜索的游戏列表 -->
    <div v-if="searchValue.length">
      <AppCardListSkeleton v-if="isInputing" />
      <template v-else>
        <template v-if="searchGameList && searchGameList?.length && searchValue.length >= 3">
          <AppCardList :list="searchGameList ?? []" />
          <div class="mt-[22px] flex flex-col items-center justify-center gap-[16px] text-center">
            <AppPercentage :total="totalSearchGame" :percentage="searchGameList?.length" />
            <BaseButton
              v-show="searchGameList?.length < totalSearchGame"
              class="h-[44px] w-[184px]" bg-style="red" size="md" :loading="loadingSearchGame"
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
    <AppCardList v-show="!searchValue.length" :list="list" />
    <div v-show="total > VITE_CASINO_HOME_PAGE_SIZE && !searchValue.length" class="more">
      <BaseButton
        size="md"
        @click="_push"
      >
        {{ t('view_all') }} {{ total }} {{ name }}
      </BaseButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-wrap {
  margin-top: var(--tg-spacing-10);

  .title {
    font-size: var(--tg-font-size-base);
    color: var(--tg-text-white);
    display: flex;
    align-items: center;
    height: var(--tg-spacing-35);

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

  .more {
    margin-top: var(--tg-spacing-24);
    display: flex;
    justify-content: center;
  }
}

.search-icon2 {
  :deep(.app-svg-icon) {
    font-size: 18px !important;
  }
}
</style>

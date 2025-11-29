<script setup lang='ts'>
import { ApiMemberGameSearch, ApiSportEventSearch } from '@tg/apis'
import { IconUniArrowDown } from '@tg/icons'

defineOptions({
  name: 'AppGlobalSearch',
})
const props = defineProps<{
  autoFocus?: boolean
}>()
const emit = defineEmits(['gameTypeChange', 'close'])
const { isMobile } = storeToRefs(useWindowStore())
const casinoStore = useCasinoStore()
const { searchRecordList: keywordLive, searchHotWordList } = storeToRefs(casinoStore)

const { leftIsExpand, closeLeftSidebar } = useLeftSidebar()
const { t } = useI18n()
const route = useRoute()
const { bool: isPopperShow, setTrue, setFalse } = useBoolean(false)
const {
  bool: isShowOverlay,
  setTrue: showOverlayTrue,
  setFalse: showOverlayFalse,
} = useBoolean(false)
const { bool: isClear, setTrue: setClearTrue } = useBoolean(true)
const {
  bool: isInputing,
  setTrue: setInputingTrue,
  setFalse: setInputingFalse,
} = useBoolean(false)
const initCasino = route.name?.toString().includes('casino')
const initSports = route.name?.toString().includes('sports')
const initOthers = !initCasino && !initSports
const {
  bool: isShowTypeSelect,
  setTrue: showTypeSelect,
  setFalse: hideTypeSelect,
} = useBoolean(!initOthers)

// 搜索栏
const gameType = ref(initCasino ? '1' : initSports ? '2' : '1')
const gameTypeList = [
  { label: t('casino'), value: '1' },
  { label: t('sports'), value: '2' },
]
const searchValue = ref('')
const baseSearchRef = ref()


const keywordSports = ref(
  Local.get<any[]>(STORAGE_SEARCH_KEYWORDS_SPORTS)?.value ?? [],
)

const gameLabel = computed(() => {
  return gameTypeList.find(a => a.value === gameType.value)?.label ?? '-'
})
const goodSearchValue = computed(() => searchValue.value.length >= 3)
const isCasino = computed(() => gameType.value === '1')
const isSports = computed(() => gameType.value === '2')
const keywordList = computed(() => keywordLive.value)
const searchPlaceholder = computed(() => isCasino.value
  ? t('search_game')
  : t('search_events'))
// 娱乐城搜索接口
const {
  list: casinoGames,
  run: runSearchCasinoGames,
} = useList(ApiMemberGameSearch, {
  // debounceInterval: 500,
  onSuccess(res, params) {
    if (res.d && res.d.length > 0) {
      const word = params[0].w
      isClear.value = false

      // 去重
      if (keywordLive.value.includes(word))
        keywordLive.value.splice(keywordLive.value.findIndex(t => t === word), 1)

      keywordLive.value.unshift(word)
      keywordLive.value = keywordLive.value.slice(0, 5)
      Local.set(STORAGE_SEARCH_KEYWORDS_LIVE, keywordLive.value)
    }
    setInputingFalse()
  },
})
// 体育搜索接口
const { data: sportsData, run: runSearchSports } = useRequest(
  () => ApiSportEventSearch({ word: searchValue.value }),
  {
    // debounceInterval: 500,
    onSuccess(res) {
      if (res.list && res.list.length > 0) {
        const word = searchValue.value
        isClear.value = false

        // 去重
        if (keywordLive.value.includes(word))
          keywordLive.value.splice(keywordLive.value.findIndex(t => t === word), 1)

        keywordLive.value.unshift(word)
        keywordLive.value = keywordLive.value.slice(0, 5)
        Local.set(STORAGE_SEARCH_KEYWORDS_SPORTS, keywordLive.value)
      }
      setInputingFalse()
    },
  },
)
// 搜索结果
const resultData = computed(() => {
  if (isClear.value || !goodSearchValue.value)
    return null
  if (isCasino.value)
    return casinoGames.value.length > 0 ? casinoGames.value : null
  if (isSports.value && sportsData.value && sportsData.value.list)
    return sportsData.value.list

  return null
})

let inputTimer: any = null
function onBaseSearchInput() {
  setInputingTrue()
  clearTimeout(inputTimer)
  if (searchValue.value.length < 3) {
    setInputingFalse()
    setClearTrue()
    return
  }
  inputTimer = setTimeout(() => {
    if (isCasino.value && searchValue.value.length >= 3) {
      Local.set(STORAGE_CLEAR_LIVE, true)
      runSearchCasinoGames({ w: searchValue.value })
    }
    else if (isSports.value && searchValue.value.length >= 3) {
      Local.set(STORAGE_CLEAR_SPORTS, true)
      runSearchSports()
    }
    clearTimeout(inputTimer)
  }, 500)
}
function onClickKeyword(k: string) {
  setInputingTrue()
  searchValue.value = k
  if (isCasino.value)
    runSearchCasinoGames({ w: searchValue.value })
  else if (isSports.value)
    runSearchSports()
}
function onCloseKeyword(k: string) {
  if (isCasino.value) {
    keywordLive.value.splice(keywordLive.value.findIndex(t => t === k), 1)
    Local.set(STORAGE_SEARCH_KEYWORDS_LIVE, keywordLive.value)
  }
  else if (isSports.value) {
    keywordSports.value.splice(keywordSports.value.findIndex(t => t === k), 1)
    Local.set(STORAGE_SEARCH_KEYWORDS_SPORTS, keywordSports.value)
  }
}
function selectGameType(v: string) {
  gameType.value = v
  emit('gameTypeChange', v)
}
function clearKeyword() {
  keywordLive.value.length = 0
}
function handleFocus() {
  showOverlayTrue()
  showTypeSelect()
}
// 关闭方法
function emitClose() {
  searchValue.value = ''
  showOverlayFalse()
  initOthers && hideTypeSelect()
  if (!isMobile.value)
    emit('close')
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

  if (!Local.get(STORAGE_CLEAR_SPORTS)?.value) {
    const sportsList = [
      'Liverpool FC',
      'Kansas City Chiefs',
      'Los Angeles Lakers',
      'FC Barcelona',
      'FC Bayern Munich',
    ]
    Local.set(STORAGE_SEARCH_KEYWORDS_SPORTS, sportsList)
    keywordSports.value = sportsList
  }
}

provide('closeSearch', emitClose)
provide('closeSearchH5', closeLeftSidebar)

onMounted(() => {
  if (props.autoFocus)
    baseSearchRef.value.manualFocus()
  useFixedTop('.app-global-search')
})

// intiKeyword()
</script>

<template>
  <div class="app-global-search" :class="{ 'in-pc': !isMobile }">
    <div v-show="!isMobile" class="overlay" @click="emitClose" />
    <BaseSearch
      ref="baseSearchRef"
      v-model.trim="searchValue"
      class="search-input"
      :place-holder="searchPlaceholder"
      :clearable="isShowOverlay || searchValue.length > 0"
      @focus="handleFocus"
      @clear="setClearTrue"
      @close="emitClose"
      @input="onBaseSearchInput"
    >
      <template v-if="isShowTypeSelect" #left>
        <VDropdown
          :distance="6"
          @show="setTrue()" @hide="setFalse"
        >
          <button class="tips">
            <span>{{ gameLabel }}</span>
            <IconUniArrowDown
              :class="{
                'rotate-180': isPopperShow,
              }"
            />
          </button>
          <template #popper="{ hide }">
            <!-- :class="{ 'active-menu': gameType === type.value }" -->
            <a
              v-for="type, i in gameTypeList" :key="i"
              class="popper-option"
              @click="hide();selectGameType(type.value)"
            >
              {{ type.label }}
            </a>
          </template>
        </VDropdown>
      </template>
    </BaseSearch>

    <!-- 搜索功能面板  -->
    <div
      v-show="isShowOverlay || !isMobile"
      class="search-overlay"
      @click.self="showOverlayFalse();initOthers && hideTypeSelect()"
      @touchmove.stop
    >
      <div class="scroll-y warp">
        <div v-if="!resultData && !isInputing" class="no-result">
          <div class="no-result-label">
            <span
              v-show="searchValue.length < 3"
            >{{ t('search_need_at_least_3_word') }}</span>
            <span
              v-show="searchValue.length >= 3"
            >{{ t('search_no_result') }}</span>
          </div>
          <div v-if="keywordList.length" class="recent">
            <div class="title">
              <label>{{ t('search_recent') }}</label>
              <BaseButton
                type="text" style="--tg-base-button-font-size:14px"
                size="none" class="theme-text"
                @click="clearKeyword"
              >
                {{ t('search_clear') }} ({{ keywordList.length }})
              </BaseButton>
            </div>
            <div class="list">
              <BaseTag
                v-for="text in keywordList"
                :key="text"
                class="mb-[8px]"
                :text="text"
                @click="onClickKeyword"
                @close="onCloseKeyword"
              />
            </div>
          </div>
          <div v-if="searchHotWordList.length && isCasino" class="recent hot">
              <div class="title">
                <label>{{ t('search_hot_word') }}</label>
              </div>
              <div class="list">
                <BaseTag
                  v-for="text in searchHotWordList"
                  :key="text" class="mb-[8px]" :text="text" :is-hot-word="true" @click="onClickKeyword"
                 />
              </div>
            </div>
        </div>

        <!-- casino -->
        <AppCardListSkeleton v-if="isInputing && isCasino" />
        <AppCardList
          v-if="isCasino && resultData && !isInputing" :list="resultData"
        />

        <!-- sports -->
        <AppSportsSearchResultSkeleton v-if="isInputing && isSports" />
        <AppSportsSearchResult
          v-if="isSports && resultData && !isInputing" :data="sportsData"
        />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.theme-text {
  @include webTheme('green') {
    --tg-base-button-text-default-color: #fff;
  }
}
.app-global-search {
  margin: var(--tg-spacing-16);
  width: auto;
  font-size: var(--tg-font-size-default);
  @include webTheme('white') {
    --tg-base-search-border-width: 1px;
  }
  @include webTheme('green') {
    --tg-search-icon-color: #5ecea6;
  }
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #{rgba($color: var(--tg-color-blue-rgb), $alpha: 0.7)};
  z-index: 999;
}

.tips {
  display: flex;
  align-items: center;
  color: var(--tg-text-white);
  font-weight: var(--tg-font-weight-semibold);
  // --tg-icon-color: var(--tg-text-white);
  @include webTheme('green') {
    //文字颜色
    color: var(--tg-text-green-main);
  }
  svg {
    font-size: var(--tg-font-size-default);
  }

  span {
    margin-right: var(--tg-spacing-8);
  }

  &:active {
    transform: scale(0.96);
  }

  .rotate-180 {
    transform: rotate(180deg);
  }
}

.popper-option {
  cursor: pointer;
  padding: var(--tg-spacing-button-padding-vertical-xs) var(--tg-spacing-button-padding-horizontal-xs);
  font-size: var(--tg-font-size-default);
  display: block;
  font-weight: var(--tg-font-weight-semibold);

  &.active-menu {
    color: var(--tg-text-blue);
  }

  &:hover {
    // background-color: var(--tg-text-lightgrey);
  }
}

.search-overlay {
  width: 100%;
  height: 100%;
  background-color: var(--tg-secondary-dark);
  color: var(--tg-text-lightgrey);
  position: absolute;
  left: 0;
  top: 72px;
  z-index: 1450;
  @include webTheme('green') {
    color: var(--tg-text-white);
  }

  .warp {
    max-height: 400px;
    padding: var(--tg-spacing-8) var(--tg-spacing-16) var(--tg-spacing-24);
  }

  .no-result {
    display: flex;
    flex-direction: column;
    font-size: var(--tg-font-size-default);
    >*:not(:first-child) {
      margin-top: var(--tg-spacing-16);
    }

    .no-result-label {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: var(--tg-spacing-8);
      font-weight: var(--tg-font-weight-semibold);
      line-height: 1.5;
      @include webTheme('green') {
        color: var(--tg-text-placeholder);
      }
      > *:not(:first-child) {
        margin-top: var(--tg-spacing-8);
      }
    }

    .recent {
      display: flex;
      flex-direction: column;
      >*:not(:first-child) {
        margin-top: var(--tg-spacing-16);
      }
      &.hot {
        margin-top: var(--tg-spacing-8);
      }
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: var(--tg-font-weight-semibold);
        line-height: 1.5;
      }

      .list {
        display: flex;
        flex-wrap: wrap;

        >*:not(:first-child) {
          margin-left: var(--tg-spacing-8);
        }

        @include webTheme('green') {
          --base-tag-bg: #02432d;
          --base-tag-text-color: #5ecea6;
        }
      }
    }
  }

  .result-casino {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px 5px;
  }
}

.in-pc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  max-width: 1200px;
  margin-top: 58px;

  .search-input {
    position: relative;
    z-index: 1450;
  }

  .search-overlay {
    height: auto;
    position: relative;
    border-radius: var(--tg-radius-default);
    top: 10px;
    z-index: 1450;

    .warp {
      padding: var(--tg-spacing-16);
    }
  }
}
</style>

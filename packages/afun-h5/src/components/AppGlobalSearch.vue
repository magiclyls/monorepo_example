<script setup lang='ts'>
import { ApiMemberGameSearch, ApiSportEventSearch } from '@tg/apis'
import { useBoolean, useList } from '@tg/hooks'
import { IconUniArrowDown } from '@tg/icons'
import { useWindowStore } from '@tg/stores'
import { Local, STORAGE_CLEAR_LIVE, STORAGE_CLEAR_SPORTS, STORAGE_SEARCH_KEYWORDS_LIVE, STORAGE_SEARCH_KEYWORDS_SPORTS } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import { useLeftSidebar } from '~/hooks/useLeftSidebar'
import { useFixedTop } from '~/utils/tools'
import AppCardList from './AppCardList.vue'
import AppCardListSkeleton from './AppCardListSkeleton.vue'
import AppSportsSearchResult from './AppSportsSearchResult.vue'
import AppSportsSearchResultSkeleton from './AppSportsSearchResultSkeleton.vue'
import BaseSearch from './BaseSearch.vue'
import BaseTag from './BaseTag.vue'

defineOptions({
  name: 'AppGlobalSearch',
})
const props = defineProps<{
  autoFocus?: boolean
}>()
const emit = defineEmits(['gameTypeChange', 'close'])
const { isMobile } = storeToRefs(useWindowStore())
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
const initCasino = route.path === '/'
const initSports = route.name?.toString().includes('Sports')
const initOthers = !initCasino && !initSports
const {
  bool: isShowTypeSelect,
  setTrue: showTypeSelect,
  setFalse: hideTypeSelect,
} = useBoolean(!initOthers)

// 搜索栏
const gameType = ref(initCasino ? '1' : initSports ? '2' : '1')
const gameTypeList = [
  { label: t('娱乐城'), value: '1' },
  { label: t('体育'), value: '2' },
]
const searchValue = ref('')
const baseSearchRef = ref()
// 近期搜索关键字
const keywordLive = ref(
  Local.get<any[]>(STORAGE_SEARCH_KEYWORDS_LIVE)?.value ?? [],
)
const keywordSports = ref(
  Local.get<any[]>(STORAGE_SEARCH_KEYWORDS_SPORTS)?.value ?? [],
)

const gameLabel = computed(() => {
  return gameTypeList.find(a => a.value === gameType.value)?.label ?? '-'
})
const goodSearchValue = computed(() => searchValue.value.length >= 3)
const isCasino = computed(() => gameType.value === '1')
const isSports = computed(() => gameType.value === '2')
const keywordList = computed(() => {
  if (isCasino.value)
    return keywordLive.value
  else if (isSports.value)
    return keywordSports.value
  return []
})
const searchPlaceholder = computed(() => isCasino.value
  ? t('搜索游戏')
  : t('搜索赛事'))
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
        if (keywordSports.value.includes(word))
          keywordSports.value.splice(keywordSports.value.findIndex(t => t === word), 1)

        keywordSports.value.unshift(word)
        keywordSports.value = keywordSports.value.slice(0, 5)
        Local.set(STORAGE_SEARCH_KEYWORDS_SPORTS, keywordSports.value)
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
  if (isCasino.value) {
    Local.set(STORAGE_CLEAR_LIVE, true)
    keywordLive.value.length = 0
    Local.remove(STORAGE_SEARCH_KEYWORDS_LIVE)
  }
  else if (isSports.value) {
    Local.set(STORAGE_CLEAR_SPORTS, true)
    keywordSports.value.length = 0
    Local.remove(STORAGE_SEARCH_KEYWORDS_SPORTS)
  }
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
              class="text-[#b1bad3]"
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
            >{{ t('搜素需要至少3个字符来进行搜索') }}</span>
            <span
              v-show="searchValue.length >= 3"
            >{{ t('未找到结果') }}</span>
          </div>
          <div v-if="keywordList.length" class="recent">
            <div class="title">
              <label>{{ t('近期搜索') }}</label>
              <div
                class="text-[14px]"
                @click="clearKeyword"
              >
                {{ t('清除搜索') }} ({{ keywordList.length }})
              </div>
            </div>
            <div class="list">
              <BaseTag
                v-for="text in keywordList"
                :key="text"
                class="mb-[8rem]"
                :text="text"
                @click="onClickKeyword"
                @close="onCloseKeyword"
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
.app-global-search {
  margin-bottom: 16rem;
  width: auto;
  font-size: 14px;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(26, 46, 56, 0.7);
  z-index: 999;
}

.tips {
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 600;
  // --tg-icon-color: var(--tg-text-white);

  svg {
    font-size: 14rem;
  }

  span {
    margin-right: 8rem;
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
  padding: 12rem;
  font-size: 14rem;
  display: block;
  font-weight: 600;

  &.active-menu {
    color: #1475e1;
  }

  &:hover {
    // background-color: var(--tg-text-lightgrey);
  }
}

.search-overlay {
  width: 100%;
  height: 100%;
  background-color: #0f212e;
  color: #b1bad3;
  position: absolute;
  left: 0;
  top: 72rem;
  z-index: 1450;
  .warp {
    max-height: 400rem;
    padding: 8rem 16rem 24rem;
  }

  .no-result {
    display: flex;
    flex-direction: column;
    font-size: 14rem;
    > *:not(:first-child) {
      margin-top: 32rem;
    }

    .no-result-label {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 8rem;
      font-weight: 600;
      line-height: 1.5;
      > *:not(:first-child) {
        margin-top: 8rem;
      }
    }

    .recent {
      display: flex;
      flex-direction: column;
      > *:not(:first-child) {
        margin-top: 16rem;
      }

      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        line-height: 1.5;
      }

      .list {
        display: flex;
        flex-wrap: wrap;
        > *:not(:first-child) {
          margin-left: 8rem;
        }
      }
    }
  }

  .result-casino {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10rem 5rem;
  }
}

.in-pc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  margin: 0;
  max-width: 1200rem;
  margin-top: 58rem;

  .search-input {
    position: relative;
    z-index: 1450;
  }

  .search-overlay {
    height: auto;
    position: relative;
    border-radius: 4rem;
    top: 10rem;
    z-index: 1450;

    .warp {
      padding: 16rem;
    }
  }
}
</style>

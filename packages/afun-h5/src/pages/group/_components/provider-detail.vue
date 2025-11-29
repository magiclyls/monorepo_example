<script setup lang="ts">
import { ApiMemberGameCateGames, ApiMemberGameList, ApiMemberPlatformState } from '@tg/apis'
import { AfunBaseCheckbox, AfunBaseEmpty, AfunBaseImage, AfunBaseLoadMore, AfunBasePopup } from '@tg/bccomponents'
import { useList, usePopupEleScroll } from '@tg/hooks'
import { IconCheck2, IconUniClose, IconUniStakeArrowDown } from '@tg/icons'
import { useCasinoStore } from '@tg/stores'
import { EnumCasinoSortType } from '@tg/types'
import { application, getEnv } from '@tg/utils'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppSearchInput from '~/components/AppSearchInput.vue'

const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()
const setTitle = inject('setTitle', (v: string) => { })

const casinoStore = useCasinoStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const { cateProviderData } = storeToRefs(casinoStore)

// 处理ios滚动穿透
const scrollElementRef = ref<HTMLElement | undefined>()
usePopupEleScroll(scrollElementRef)

const sortPopupList = ref([
  {
    name: t('热门'),
    value: EnumCasinoSortType.hot,
  },
  {
    name: 'A-Z',
    value: EnumCasinoSortType.nameA,
  },
  {
    name: 'Z-A',
    value: EnumCasinoSortType.nameZ,
  },
])
const nowSortVal = ref(EnumCasinoSortType.hot)
const isShowSortPopup = ref(false)
const nowSortName = computed(() => sortPopupList.value.find(item => item.value === nowSortVal.value)?.name)

// 当前已经选择的场馆id
const nowVenueId = ref<string[]>([])
const isShowProviderPopup = ref(false)

const firstLoadFinshed = ref(false)
const fakeLoading = ref(false)
const searchValue = ref('')
// 切换loading 数据  开关
const showSearchData = ref(false)

// 参数
const ty = computed(() => route.query.ty?.toString() ?? '')
const pid = computed(() => route.query.pid?.toString() ?? '')
const vid = computed(() => route.query.vid?.toString() ?? '')
const title = computed(() => casinoStore.getTitleByVid(vid.value === '0' ? pid.value : vid.value))

const paramsGame = computed(() => {
  return {
    sort: nowSortVal.value,
    venue_id: vid.value,
    platform_id: nowVenueId.value.join(','),
  }
})

// 供应商游戏
const {
  page: providerPage,
  list: providerGameList,
  total: providerGameTotal,
  runAsync: runGameList,
  loading: providerGameLoading,
  loadMore: loadingProviderGameMoreGame,
  resetPage: providerGameresetPage,
  data: providerData,
} = useList(ApiMemberGameList, {
  onAfter() {
    fakeLoading.value = false
  },
}, { page_size: VITE_CASINO_HOME_PAGE_SIZE })

// 供应商搜索参数
const paramsSeaerch = computed(() => {
  return {
    sort: nowSortVal.value,
    w: searchValue.value,
    ty: vid.value ? '3' : ty.value,
    cid: vid.value,
    venue_id: nowVenueId.value.join(','),
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
  resetPage: searchGameresetPage,
  data: searchData,
} = useList(ApiMemberGameCateGames, {
  onAfter() {
    fakeLoading.value = false
  },
}, { page_size: VITE_CASINO_HOME_PAGE_SIZE })

const loadingCate = computed(() => {
  if (showSearchData.value) {
    return fakeLoading.value || loadingSearchGame.value
  }
  else {
    return fakeLoading.value || providerGameLoading.value
  }
})

const gamesList = computed(() => {
  if (showSearchData.value) {
    return searchGameList.value
  }
  else {
    return providerGameList.value
  }
})

const loadMoreCate = computed(() => {
  if (showSearchData.value) {
    return loadMoreSearchGame
  }
  else {
    return loadingProviderGameMoreGame
  }
})

const cateTotal = computed(() => {
  if (showSearchData.value) {
    return totalSearchGame.value
  }
  else {
    return providerGameTotal.value
  }
})

const catePage = computed(() => {
  if (showSearchData.value) {
    return searchPage.value
  }
  else {
    return providerPage.value
  }
})

// 供应商子平台
const sums = computed(() => {
  return providerData.value?.sums
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

function changeIcon(url: string) {
  if (!url.includes('/images')) {
    url = `/images${url}`
  }
  return url?.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_sidebox.webp`)
}

function providerChange(id: string) {
  router.replace({
    query: {
      vid: id,
    },
  })
  isShowProviderPopup.value = false
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

function onSearch() {
  if (searchValue.value && searchValue.value.length < 3) {
    // Message.error(t('需要至少3个字符'))
  }
  else {
    if (!searchValue.value) {
      showSearchData.value = false
      fakeLoading.value = false
      providerGameresetPage()
      runGameList(paramsGame.value)
    }
    else {
      showSearchData.value = true
      searchGameresetPage()
      runSearchCasinoGames(paramsSeaerch.value)
    }
  }
}

// 定义防抖函数，只创建一次
const debouncedSetLocatList = debounce(() => {
  onSearch()
}, 500, {
  leading: false,
  trailing: true,
})

watch(searchValue, () => {
  if (searchValue.value.length > 2) {
    fakeLoading.value = true
  }
  debouncedSetLocatList()
})

watch([nowSortVal, vid], () => {
  searchGameresetPage()
  providerGameresetPage()
  if (showSearchData.value) {
    runSearchCasinoGames(paramsSeaerch.value)
  }
  else {
    runGameList(paramsGame.value)
  }
})

watch(title, (a) => {
  if (a)
    setTitle(a)
}, { immediate: true })

application.allSettled([
  init(),
]).then(() => firstLoadFinshed.value = true)
</script>

<template>
  <AppLoading v-if="!firstLoadFinshed" :height="200" />
  <div v-else>
    <AppSearchInput v-model="searchValue" @close="searchValue = ''" @keyup.enter="onSearch" />
    <div class="mt-[12px] grid gap-x-[var(--ph-game-gap-x)] gap-y-[var(--ph-game-gap-y)] grid-cols-2">
      <div
        class="flex px-[12px] items-center justify-between bg-[#233846] font-[600] h-[42px] rounded-[4px] cursor-pointer"
        @click="isShowSortPopup = true"
      >
        <div>
          <span class="mr-[4px]">{{ t('排序方式') }}：</span>
          <span>{{ nowSortName }}</span>
        </div>
        <IconUniStakeArrowDown class="text-[#fff] text-[14px]" />
      </div>
      <div
        class="flex px-[12px] items-center justify-between bg-[#233846] font-[600] h-[42px] rounded-[4px] cursor-pointer"
        @click="isShowProviderPopup = true "
      >
        <div class="flex flex-1 overflow-hidden">
          <span class="mr-[4px]">{{ t('供应商') }}：</span>
          <span class="flex-1 truncate">{{ title }}</span>
        </div>
        <IconUniStakeArrowDown class="text-[#fff] text-[14px]" />
      </div>
    </div>
    <div v-if="catePage === 1 && loadingCate">
      <AppLoading :height="200" />
    </div>
    <div v-else-if="!loadingCate && !gamesList.length" class="center mt-[12px] text-[#6D7693] text-[12px] ">
      <AfunBaseEmpty :description="t('暂无数据')">
        <template #icon>
          <AfunBaseImage class="w-[80px]" url="/m/afun-h5/png/uni-table-empty.png" />
        </template>
      </AfunBaseEmpty>
    </div>
    <AppCasinoGameList v-else :list="gamesList" class="mt-[12px]" />
    <AfunBaseLoadMore
      v-if="(catePage !== 1 && gamesList.length) || (catePage === 1 && !loadingCate && gamesList.length)"
      class="center text-[12px] text-[#6D7693] font-[600] leading-[14px] mt-[12px]" :loading="loadingCate"
      :finished="gamesList.length >= cateTotal" @load="loadMoreCate"
    >
      {{ loadingCate ? t('加载中') : gamesList.length === cateTotal ? t('没有更多了') : t('滚动以加载更多') }}
    </AfunBaseLoadMore>
    <AfunBasePopup v-model="isShowSortPopup">
      <div
        class="font-[600] px-[10px] py-[12px] bg-[#1A2C38]  rounded-tl-[8px] rounded-tr-[8px] rounded-bl-0 rounded-br-0"
      >
        <div class="flex items-center justify-between">
          <span>{{ t('请选择') }}</span>
          <IconUniClose class="text-[#B1BAD3] text-[18px] cursor-pointer" @click="isShowSortPopup = false;" />
        </div>
        <div class="mt-[10px]">
          <div
            v-for="item in sortPopupList" :key="item.value"
            class="h-[40px] px-[12px] flex items-center justify-between rounded-[4px]"
            :class="[item.value === nowSortVal && 'bg-[linear-gradient(90deg,#24EE89_0%,#9FE871_100%)]', item.value === nowSortVal && 'text-[#05080A]']"
            @click="isShowSortPopup = false; nowSortVal = item.value"
          >
            <span>{{ item.name }}</span>
            <IconCheck2 v-show="item.value === nowSortVal" />
          </div>
        </div>
      </div>
    </AfunBasePopup>
    <AfunBasePopup v-model="isShowProviderPopup">
      <div
        class="font-[600] px-[10px] py-[12px] bg-[#1A2C38]  rounded-tl-[8px] rounded-tr-[8px] rounded-bl-0 rounded-br-0"
      >
        <div class="flex items-center justify-between">
          <span class="flex-1">{{ t('请选择') }}</span>
          <!-- <span class="center text-[#B1BAD3] mr-[10px] h-[24px] px-[6px] bg-[#2F4553] rounded-[4px]" @click="nowVenueId = [];isShowProviderPopup = false">{{ t('清除全部') }}</span> -->
          <IconUniClose class="text-[#B1BAD3] text-[18px] cursor-pointer" @click="isShowProviderPopup = false;" />
        </div>
        <div ref="scrollElementRef" class="mt-[10px] h-[320px] overflow-scroll hide-scroll-bar">
          <div
            v-for="item in cateProviderData.PCList" :key="item.platform_id"
            class="h-[40px] flex items-center justify-between rounded-[4px]"
            @click="providerChange(item.platform_id)"
          >
            <div class="flex center">
              <AfunBaseCheckbox class="mr-[12px]" style="--afun-base-checkbox-size:24px" :model-value="vid === item.platform_id" />
              <AfunBaseImage class="h-[20px] mr-[8px]" width="auto" is-network :url="changeIcon(item.icon)" />
              <!-- <span>{{ item.platform_id }}</span> -->
            </div>
            <span>{{ `${item.name}` }}</span>
          </div>
        </div>
      </div>
    </AfunBasePopup>
  </div>
</template>

<style scoped lang="scss"></style>

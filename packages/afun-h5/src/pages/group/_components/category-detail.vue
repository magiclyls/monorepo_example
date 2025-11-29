<script setup lang="ts">
import { ApiMemberCateState, ApiMemberGameCateGames } from '@tg/apis'
import { AfunBaseCheckbox, AfunBaseEmpty, AfunBaseImage, AfunBaseLoadMore, AfunBasePopup } from '@tg/bccomponents'
import { useList, usePopupEleScroll } from '@tg/hooks'
import { IconCheck2, IconUniClose, IconUniStakeArrowDown } from '@tg/icons'
import { useCasinoStore } from '@tg/stores'
import { EnumCasinoSortType, EnumOriginalLotteryVenue } from '@tg/types'
import { application, getEnv } from '@tg/utils'
import { debounce } from 'lodash'
import { computed, inject, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppGameLotteryList from '~/components/AppGameLotteryList.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppSearchInput from '~/components/AppSearchInput.vue'

interface ComponentItem {
  cid: string
  name: string
  icon: string
  ty: string | number
  platform_id: string
  // 热门推荐
  isHot?: boolean
}

interface Props {
  // 1:内页  2: 外页
  type?: 1 | 2
  detail?: ComponentItem
}

const props = withDefaults(defineProps<Props>(), {
  type: 1,
})

const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()
const setTitle = inject('setTitle', (v: string) => { })

const casinoStore = useCasinoStore()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const cid = props.detail?.cid ?? route.query.cid?.toString() ?? ''
const ty = props.detail?.ty ?? route.query.ty?.toString() ?? ''
const gameName = props.detail?.name ?? route.query.name?.toString() ?? ''

const gameTypeReal = route.query.game_type?.toString() ?? ''
const isLottery = computed(() => cid === EnumOriginalLotteryVenue.originalLottery)
const isSingleProvider = computed(() => String(ty) === '2' || String(ty) === '4')

// 处理ios滚动穿透
const scrollElementRef = ref<HTMLElement | undefined>()
usePopupEleScroll(scrollElementRef)

const firstLoadFinshed = ref(false)
const isShowSortPopup = ref(false)
const isShowProviderPopup = ref(false)
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
// 仅游戏分类页显示最新游戏
props.type === 2 && sortPopupList.value.push(
  {
    name: t('新游戏'),
    value: EnumCasinoSortType.new,
  },
)

const fakeLoading = ref(false)
// 当前已经选择的分类排序
const nowSortVal = ref(EnumCasinoSortType.hot)
const nowSortName = computed(() => sortPopupList.value.find(item => item.value === nowSortVal.value)?.name)

// 当前已经选择的场馆id
const nowVenueId = ref<string[]>([])
const searchValue = ref('')

// 类别游戏参数
const paramsCate = computed(() => ({
  cid,
  sort: nowSortVal.value,
  venue_id: nowVenueId.value.join(','),
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
  loading: APILoading,
  loadMore: loadMoreCate,
  resetPage,
  data: cateGamesData,
} = useList(ApiMemberGameCateGames, {
  onAfter() {
    fakeLoading.value = false
  },
}, { page_size: VITE_CASINO_HOME_PAGE_SIZE })

const title = computed(() => gameName || casinoStore.getTitleByCid(cid, Number(ty)) || cateGamesData.value?.info?.name)

const loadingCate = computed(() => APILoading.value || fakeLoading.value)

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

const nowproviderName = ref('')
function providerChange(id: string, name: string) {
  if (id === '') {
    nowVenueId.value = []
    nowproviderName.value = ''
  }
  else if (nowVenueId.value.includes(id)) {
    nowVenueId.value = nowVenueId.value.filter(item => item !== id)
    nowproviderName.value = ''
  }
  else {
    nowVenueId.value = [id]
    nowproviderName.value = name
  }
  isShowProviderPopup.value = false
}

function changeIcon(url: string) {
  return url?.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_sidebox.webp`)
}

function init() {
  return new Promise((resolve) => {
    checkCate().then(() => {
      runCateGames({ ...paramsCate.value })
        .finally(() => {
          resolve(1)
        })
    })
  })
}

watch([nowVenueId, nowSortVal], () => {
  resetPage()
  runCateGames({ ...paramsCate.value })
})

watch(title, (a) => {
  if (a)
    setTitle(a)
}, { immediate: true })

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

application.allSettled([
  init(),
]).then(() => firstLoadFinshed.value = true)
</script>

<template>
  <AppLoading v-if="!firstLoadFinshed" :height="200" />
  <div v-else :style="{ 'margin-bottom': type === 1 ? '0' : '0' }">
    <AppSearchInput v-if="type === 1" v-model="searchValue" @close="searchValue = ''" @keyup.enter="onSearch" />
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
        @click="isShowProviderPopup = cateGamesData?.info?.sums ? true : isShowProviderPopup"
      >
        <div class="flex-1 truncate">
          <span class="mr-[4px]">{{ t('供应商') }}：</span>
          <span>{{ nowVenueId.length === 0 ? t('全部') : nowproviderName }}</span>
        </div>
        <IconUniStakeArrowDown class="text-[#fff] text-[14px]" />
      </div>
    </div>
    <div v-if="catePage === 1 && loadingCate">
      <AppLoading :height="200" />
    </div>
    <div v-else-if="!loadingCate && !gamesList.length" class="mt-[60px]">
      <AfunBaseEmpty :description="t('暂无数据')">
        <template #icon>
          <AfunBaseImage class="w-[80px]" url="/m/afun-h5/png/uni-table-empty.png" />
        </template>
      </AfunBaseEmpty>
    </div>
    <AppGameLotteryList v-else-if="isLottery" :list="gamesList" class="mt-[12px]" />
    <AppCasinoGameList v-else :list="gamesList" class="mt-[12px]" :col="type === 2 ? cateGamesData?.info?.display_num : undefined" />
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
          <span
            class="center text-[#B1BAD3] mr-[10px] h-[24px] px-[6px] bg-[#2F4553] rounded-[4px]"
            @click="providerChange('', '');"
          >{{ t('清除全部') }}</span>
          <IconUniClose class="text-[#B1BAD3] text-[18px] cursor-pointer" @click="isShowProviderPopup = false;" />
        </div>
        <div ref="scrollElementRef" class="mt-[10px] h-[320px] overflow-scroll hide-scroll-bar">
          <div
            v-for="item in cateGamesData?.info?.sums" :key="item.platform_id"
            class="h-[40px] flex items-center justify-between rounded-[4px]" @click="providerChange(item.platform_id, item.platform_name)"
          >
            <div class="flex center">
              <AfunBaseCheckbox
                class="mr-[12px]" style="--afun-base-checkbox-size:24px"
                :model-value="nowVenueId.includes(item.platform_id)"
              />
              <AfunBaseImage class="h-[20px]" width="auto" is-network :url="changeIcon(item.icon)" />
              <span v-if="isSingleProvider" class="ml-[12px] text-[#fff]">{{ item.platform_name }}</span>
            </div>
            <span>{{ `${item.total} ${t('款游戏')}` }}</span>
          </div>
        </div>
      </div>
    </AfunBasePopup>
  </div>
</template>

<style scoped lang="scss"></style>

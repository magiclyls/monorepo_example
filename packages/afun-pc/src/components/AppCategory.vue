<script setup lang="ts">
import {ApiMemberGameCateGames } from '@tg/apis'

const { t } = useI18n()
const casinoStore = useCasinoStore()
const { cateProviderData } = storeToRefs(casinoStore)
const route = useRoute()
const router = useRouter()
const { bool: isFirst } = useBoolean(true)
const sortType = ref(EnumCasinoSortType.hot)
const pids = ref('')
const cid = ref(route.query.cid ? route.query.cid?.toString() ?? '0' : '0')
const ty = ref<string>(route.query.ty as string)
const gameTypeReal = ref(route.query.game_type?.toString() ?? '')
const currentType = ref('category')

const sortPopupList = ref([
  {
    label: t('casino_sort_popular'),
    value: EnumCasinoSortType.hot,
  },
  {
    label: 'A-Z',
    value: EnumCasinoSortType.nameA,
  },
  {
    label: 'Z-A',
    value: EnumCasinoSortType.nameZ,
  }
])

// 当前已经选择的场馆id
const nowVenueId = ref<string[]>([])

// 当前已经选择的分类排序
const nowSortVal = ref(EnumCasinoSortType.hot)
const nowSortName = computed(() => sortPopupList.value.find(item => item.value === nowSortVal.value)?.label)
const isSingleProvider = computed(() => String(ty.value) === '2' || String(ty.value) === '4')


const titles = computed<any>(() => ({ 3: t('page_title_live') }))
const vid = computed(() => route.query.vid?.toString() ?? '0')

// 类别搜索参数
const paramsCate = computed(() => ({
  cid: cid.value,
  game_type: cid.value === '100' ? gameTypeReal.value : undefined,
  ty: ty.value,
  sort: nowSortVal.value,
  venue_id: nowVenueId.value.join(','),
}))
// 类别搜索接口
const {
  page: catePage,
  list: searchGameList,
  runAsync: runSearchCasinoGames,
  total: totalSearchGame,
  loadMore: loadMoreSearchGame,
  loading: loadingSearchGame,
  data: cateGamesData,
  resetPage
} = useList(ApiMemberGameCateGames, {}, { page_size: 48 })

const title = computed(() => {
  const _cid = cid.value
  const _ty = ty.value
  return casinoStore.getTitleByCid(_cid, Number(_ty)) || cateGamesData.value?.info?.name
})

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
}

function changeIcon(url: string) {
  return url?.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_sidebox.webp`)
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
  }
})

watch([nowVenueId, nowSortVal], () => {
  resetPage()
  runSearchCasinoGames(paramsCate.value)
})

application.allSettled([runSearchCasinoGames(paramsCate.value)]).then(() => isFirst.value = false)
</script>

<template>
  <div>
    <AppLoading v-if="isFirst" full-screen />
    <section v-show="!isFirst" class="layout-spacing tg-game-type-page">
      <!-- pc的搜索 -->
      <div class="mt-[24px]">
        <AppGameSearch :key="currentType + cid + pids" game-type="1" :vid="vid" :cid="cid" />
      </div>
      <div class="mt-[18px] flex gap-x-[12px]">
        <BaseSelect
        v-model="nowSortVal" class="w-[351px] font-[600]" :distance="12"
        popper :border="false" :options="sortPopupList"
        style="--tg-base-select-popper-style-padding-x:12px;
        --tg-base-select-popper-style-padding-y:12px;
        --tg-base-select-popper-bg-color:#233846;
        --tg-base-select-popper-label-hover-bg-color:#2F4553;">
        <template #label>
          <div
            class="flex items-center justify-between cursor-pointer">
            <div>
              <span class="mr-[4px]">{{ t('order_by') }}：</span>
              <span>{{ nowSortName }}</span>
            </div>
          </div>
        </template>
        <template #popper="{ hide }">
          <div class="w-[351px] flex flex-col bg-[#213743] cursor-pointer px-[10px] py-[12px] text-[14px] hide-scrollbar">
            <div
              v-for="item in sortPopupList" :key="item.value"
              class="w-[331px] text-[#fff] font-[600] h-[40px] px-[12px] flex items-center justify-between rounded-[4px]"
              :class="[item.value === nowSortVal && 'bg-[#2F4553]']"
              @click="hide(); nowSortVal = item.value">
              <span>{{ item.label }}</span>
              <IconCheck2 v-show="item.value === nowSortVal" class="text-[#24EE89] text-[14px]" style="color:#24EE89" />
            </div>
          </div>
        </template>
      </BaseSelect>
      <BaseSelect  class="w-[351px] font-[600]" :distance="12" popper :border="false"
        :options="sortPopupList" style="--tg-base-select-popper-style-padding-x:12px;
        --tg-base-select-popper-style-padding-y:12px;
        --tg-base-select-popper-bg-color:#233846;
        --tg-base-select-popper-label-hover-bg-color:#2F4553">
        <template #label>
          <div  class="flex items-center justify-between cursor-pointer">
            <span class="mr-[4px]">{{ t('provider') }}：</span>
            <span>{{ nowVenueId.length === 0 ? t('finance_other_tab_all') : nowproviderName }}</span>
          </div>
        </template>
        <template #popper="{ hide }">
            <div class="w-[351px] flex flex-col bg-[#213743] px-[10px] py-[12px] text-[14px]  hide-scrollbar">
            <div class="max-h-[480px] overflow-scroll hide-scrollbar">
              <div
                v-for="item in cateGamesData?.info?.sums" :key="item.platform_id"
                class="h-[40px] flex items-center justify-between text-[#fff] font-[600] cursor-pointer hide-scrollbar"
                @click="providerChange(item.platform_id, item.platform_name); hide()">
                <div class="flex items-center">
                  <AppCheckbox
                    class="mr-[12px]" style="--afun-base-checkbox-size:24px"
                    :model-value="nowVenueId.includes(item.platform_id)" />
                  <BaseImage class="h-[20px]" width="auto" is-network :url="changeIcon(item.icon)" />
                  <span v-if="isSingleProvider" class="ml-[12px] text-[#fff]">{{ item.platform_name }}</span>
                </div>
                <span>{{ `${item.total} ${t('games_count')}` }}</span>
              </div>
              <div class="border-t text-[#B1BAD3] text-[16px] font-[600] border-[#2F4553] mt-[12px] h-[40px] flex items-center justify-center cursor-pointer"
              @click="providerChange('', ''); hide()">
                {{ t('clear_all') }}
              </div>
            </div>
          </div>
        </template>
      </BaseSelect>
    </div>
      <AppLoading v-if="loadingSearchGame && catePage === 1" full-screen />
      <!-- 普通的游戏列表 -->
      <div  class="mt-[22px] @md:mt-[24px]" >
        <AppCardList :list="searchGameList ?? []" :ty="ty" />
      </div>
      <AppLoadMore
      v-if="(catePage !== 1) || (catePage === 1 && !loadingSearchGame)"
      class="center text-[12px] text-[#6D7693] font-[600] leading-[14px] mt-[20px]" :loading="loadingSearchGame"
      :finished="searchGameList.length >= totalSearchGame" @load="loadMoreSearchGame"
    >
    <AppLoadMoreLoading v-show="loadingSearchGame" />
    <span v-show="!loadingSearchGame">
      {{ searchGameList.length === totalSearchGame ? t('no_more') : t('scroll_to_load_more') }}
    </span>
    </AppLoadMore>
      <!-- <AppCasinoLobbyProviderSlider
        :data="cateProviderData?.venue ?? { h5: [], pc: [] }"
        :title="cateProviderData?.name ?? ''" :icon="cateProviderData?.icon ?? ''"
      /> -->
    </section>
  </div>
</template>

<style lang="scss" scoped>

</style>

<route lang="yaml">
meta:
  layout: home
</route>

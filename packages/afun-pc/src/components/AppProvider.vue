<script setup lang="ts">
import { ApiMemberGameList, ApiMemberPlatformState } from '@tg/apis'

const { t } = useI18n()
const casinoStore = useCasinoStore()
const { cateProviderData } = storeToRefs(casinoStore)
const route = useRoute()
const router = useRouter()
const { bool: isFirst } = useBoolean(true)
const pids = ref('')
const vid = computed(() => route.query.vid?.toString() ?? '')
const pid = computed(() => route.query.pid?.toString() ?? '')
const cid = ref(route.query.cid ? route.query.cid?.toString() ?? '0' : '0')
const ty = ref<string>(route.query.ty as string)
const currentType = ref('provider')

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

// 类别搜索参数
const paramsCate = computed(() => {
  return {
    sort: nowSortVal.value,
    venue_id: vid.value,
    platform_id: nowVenueId.value.join(','),
  }
})
// 类别搜索接口
const {
  page: catePage,
  list: searchGameList,
  runAsync: runSearchCasinoGames,
  total: totalSearchGame,
  loadMore: loadMoreSearchGame,
  loading: loadingSearchGame,
  resetPage
} = useList(ApiMemberGameList, {}, { page_size: 48 })

const title = computed(() => casinoStore.getTitleByVid(vid.value === '0' ? pid.value : vid.value))



function providerChange(id: string) {
  router.replace({
    query: {
      vid: id,
    },
  })
}

function changeIcon(url?: string) {
  if (!url) {
    return ''
  }
  if (!url.includes('/images')) {
    url = `/images${url}`
  }
  return url?.replace(/([^/]+)\.webp$/, (_: string, name: string) => `${name}_sidebox.webp`)
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

function init() {
  return new Promise((resolve) => {
    checkPlat().then(() => {
      runSearchCasinoGames(paramsCate.value).finally(() => {
        resolve(1)
      })
    })
  })
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

watch([vid, nowSortVal], () => {
  resetPage()
  runSearchCasinoGames(paramsCate.value)
})

application.allSettled([init()]).then(() => isFirst.value = false)
</script>

<template>
  <div>
    <AppLoading v-if="isFirst" full-screen />
    <section v-show="!isFirst" class="layout-spacing tg-game-type-page">
      <!-- pc的搜索 -->
      <div class="mt-[24px]">
        <AppGameSearch :key="currentType + cid + pids" game-type="1" :vid="vid" is-provider />
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
            <span class="flex-1 truncate">{{ title }}</span>
          </div>
        </template>
        <template #popper="{ hide }">
            <div class="w-[351px] flex flex-col bg-[#213743] px-[10px] py-[12px] text-[14px]  hide-scrollbar">
            <div class="max-h-[480px] overflow-scroll hide-scrollbar">
              <div
                v-for="item in cateProviderData?.venue?.pc[0] ?? []" :key="item.platform_id"
                class="h-[40px] flex items-center justify-between text-[#fff] font-[600] cursor-pointer hide-scrollbar"
                @click="providerChange(item.platform_id); hide()">
                <div class="flex items-center">
                  <AppCheckbox
                    class="mr-[12px]" style="--afun-base-checkbox-size:24px"
                    :model-value="vid === item.platform_id" />
                  <BaseImage class="h-[20px]" width="auto" is-network :url="changeIcon(item.icon)" />
                  <span v-if="isSingleProvider" class="ml-[12px] text-[#fff]">{{ item.platform_name }}</span>
                </div>
                <span>{{ `${item.name}` }}</span>
              </div>
            </div>
          </div>
        </template>
      </BaseSelect>
    </div>
      <AppLoading v-if="loadingSearchGame && catePage === 1" full-screen />
      <!-- 普通的游戏列表 -->
      <div  class="mt-[22px] @md:mt-[24px]">
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

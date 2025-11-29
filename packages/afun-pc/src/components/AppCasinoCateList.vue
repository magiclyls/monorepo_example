<script setup lang="ts">
import { ApiMemberGameCateGames } from '@tg/apis'
import {  IconCheck2 } from '@tg/icons'
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
const { push } = useLocalRouter()
const casinoStore = useCasinoStore()

const firstLoadFinshed = ref(false)
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
  },
  {
    label: t('new_games'),
    value: EnumCasinoSortType.new,
  }
])
const isSingleProvider = computed(() => String(props.ty) === '2' || String(props.ty) === '4')
// 当前已经选择的分类排序
const nowSortVal = ref(EnumCasinoSortType.hot)
const nowSortName = computed(() => sortPopupList.value.find(item => item.value === nowSortVal.value)?.label)

// 当前已经选择的场馆id
const nowVenueId = ref<string[]>([])

const isProvider = computed(() => props.cid === '5')

const paramsCate = computed(() => ({
  cid: props.cid,
  sort: nowSortVal.value,
  venue_id: nowVenueId.value.join(','),
  ty: props.ty
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
} = useList(ApiMemberGameCateGames, {}, { page_size: VITE_CASINO_HOME_PAGE_SIZE })

const total = computed(() => cateTotal.value ?? 0)
const list = computed(() => cateList.value)

// 游戏供应商数据 平铺
const providerList = computed(() => {
  return casinoStore.cateProviderData.venue.pc[0]
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

watch([nowVenueId, nowSortVal], () => {
  resetPage()
  runCateGames({ ...paramsCate.value })
})

application.allSettled([runCateGames({ ...paramsCate.value })]).then(() => firstLoadFinshed.value = true)
</script>

<template>
  <AppLoading v-if="!firstLoadFinshed" full-screen />
  <div v-else>
    <div v-if="!isProvider" class="mt-[18px] flex gap-x-[12px]">
      <!-- 全部一样的下拉框从这里复制  -->
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
          <div class="w-[351px] flex flex-col bg-[#213743] cursor-pointer px-[10px] py-[12px] text-[14px]">
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
          <div class="w-[351px] flex flex-col bg-[#213743] px-[10px] py-[12px] text-[14px] hide-scrollbar">
            <div class="max-h-[480px] overflow-scroll hide-scrollbar">
              <div
                v-for="item in cateGamesData?.info?.sums" :key="item.platform_id"
                class="h-[40px] flex items-center justify-between text-[#fff] font-[600] cursor-pointer"
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
    <AppLoading v-if="APILoading && catePage === 1" full-screen />
    <BaseEmpty v-else-if="!APILoading && !list.length && !isProvider" class="mt-[60px]" :description="t('data_empty')" icon="empty-1">
            <template #icon>
              <BaseImage class="w-[100px]" url="/png/icon/empty-1.png" />
            </template>
          </BaseEmpty>
    <div v-else class="list-wrap">
      <div class="mb-[10px] flex items-center justify-between">
        <BaseButton type="text" size="none" @click="_push">
          <div class="title">
            <AppImage v-if="icon" class="icon-img flex-shrink-0" :url="icon" loading="eager" is-cloud with-theme />
            <span class="whitespace-nowrap">{{ name }}</span>
          </div>
        </BaseButton>
        <div class="right-wrap flex">
          <BaseButton v-if="total" type="square-line" class="h-[28px]"
            style="--tg-base-button-color:var(--tg-text-lightgrey);--tg-base-button-padding-x:18px; --tg-base-button-font-size:16px;--tg-base-button-square-line-border-color:var(--tg-border-color-grey-light);"
            @click="_push">
            <span class="theme-all">{{ t('finance_other_tab_all') }}</span>
            <span class="total ml-[5px]">{{ total }}</span>
          </BaseButton>
        </div>
      </div>
      <!-- 平铺 -->
      <AppCardList v-if="isProvider" :list="providerList" is-provider>
        <template #default="{ item }">
          <BaseProviderItem
            :url="item.icon"
            :maintained="item.maintained"
            @click="goPage(item)" />
        </template>
      </AppCardList>


      <!-- 普通的游戏列表 -->
      <AppCardList :list="list" />
      <AppLoadMore
      v-if="(catePage !== 1 && list.length) || (catePage === 1 && !APILoading && list.length)"
      class="center text-[12px] text-[#6D7693] font-[600] leading-[14px] mt-[20px]" :loading="APILoading"
      :finished="list.length >= cateTotal" @load="loadMoreCate"
    >
    <AppLoadMoreLoading v-show="APILoading" />
    <span v-show="!APILoading">
      {{ list.length === cateTotal ? t('no_more') : t('scroll_to_load_more') }}
    </span>
    </AppLoadMore>

    </div>
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
    font-size: 16px;
    color: #ffffff;
  }
}

.list-wrap {
  margin-top: var(--tg-spacing-12);

  .title {
    font-size: var(--tg-font-size-base);
    color: var(--tg-text-white);
    display: flex;
    align-items: center;
    height: var(--tg-spacing-35);
    --app-sport-image-error-icon-size: 28px;

    @include webTheme('green') {
      --app-sport-image-error-icon-size: 28px;
    }

    @include webTheme('new-default') {
      --app-sport-image-error-icon-size: 28px;
    }

    @include webTheme('greenblack') {
      color: #fff;
    }

    &:hover {
      --tg-icon-color: var(--tg-text-white);
    }

    .icon-img {
      width: 28px;
      height: 28px;

      @include webTheme('green') {
        width: 28px;
        height: 28px;
      }

      @include webTheme('new-default') {
        width: 28px;
        height: 28px;
      }
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
    font-size: 16px;
    color: #eca30c;
  }

  @include webTheme('greenblack') {
    color: #28ffbb;
  }
}
</style>

<style>

</style>

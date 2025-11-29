<script setup lang='ts'>
import { ApiMemberGameSearch } from '@tg/apis'
import { AfunBaseEmpty, AfunBaseImage, AfunBaseLoadMore } from '@tg/bccomponents'
import { useList, usePopupEleScroll } from '@tg/hooks'
import { IconCloseIcon } from '@tg/icons'
import { useCasinoStore } from '@tg/stores'
import { getEnv } from '@tg/utils'
import { debounce } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppHeader from '~/components/AppHeader.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppSearchInput from '~/components/AppSearchInput.vue'

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['close', 'update:show'])
const casinoStore = useCasinoStore()
const { searchRecordList, searchHotWordList } = storeToRefs(casinoStore)
const { t } = useI18n()
const route = useRoute()
const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()

interface Props {
  show: boolean
  page: 'home-page' | 'sidebar'
}

// 处理ios滚动穿透
const scrollElementRef = ref<HTMLElement | undefined>()
usePopupEleScroll(scrollElementRef)

const searchValue = ref('')
const fakeLoading = ref(false)

const { list: gameSearchList, runAsync: runGameSearch, loading: APILoading, total, loadMore: loadMoreGame } = useList(ApiMemberGameSearch, {
  onAfter() {
    fakeLoading.value = false
  },
}, { page_size: 100 })

const loading = computed(() => APILoading.value || fakeLoading.value)

const gamesList = computed(() => {
  if (gameSearchList.value) {
    return gameSearchList.value
  }
  return []
})

function onSearch() {
  if (searchValue.value.length < 3) {
    return false
  }
  else {
    runGameSearch({ w: searchValue.value })
  }
}

function clearList(index?: number) {
  if (index === 9999) {
    searchRecordList.value = []
  }
  else {
    searchRecordList.value = searchRecordList.value.filter((_, i) => i !== index)
  }
}

function setLocatList() {
  if (searchRecordList.value.find(item => searchValue.value === item) || searchValue.value.length < 3) {
    return
  }
  searchRecordList.value.unshift(searchValue.value)
}

// 定义防抖函数，只创建一次
const debouncedSetLocatList = debounce(() => {
  onSearch()
  setLocatList()
}, 500, {
  leading: false,
  trailing: true,
})

function close() {
  emit('close', false)
  emit('update:show', false)
  searchValue.value = ''
}

function onFocus() {
  emit('update:show', true)
}

watch(searchValue, () => {
  if (searchValue.value.length > 2) {
    fakeLoading.value = true
  }
  debouncedSetLocatList()
})

watch(route, () => {
  emit('close', true)
  searchValue.value = ''
}, { deep: true })
</script>

<template>
  <div v-if="page === 'sidebar'" class="w-full  font-[600] flex flex-col">
    <div ref="scrollElementRef" class="pb-[16px]  overflow-scroll hide-scroll-bar">
      <AppSearchInput v-model="searchValue" :show-close="show" :style="{ marginBottom: show ? '12px' : '0' }" @onfocus="onFocus" @close="close" />
      <template v-if="show">
        <AppLoading v-if="searchValue.length > 2 && loading" :height="90" />
        <template v-else-if="searchValue.length > 2 && gameSearchList.length">
          <AppCasinoGameList :list="gamesList" />
          <AfunBaseLoadMore
            class="center text-[12px] text-[#B1BAD3] font-[600] leading-[14px] mt-[12px]" :loading="loading"
            :finished="gamesList.length >= total" @load="loadMoreGame"
          >
            {{ loading ? t('加载中') : gamesList.length === total ? t('没有更多了') : t('滚动以加载更多') }}
          </AfunBaseLoadMore>
        </template>
        <AfunBaseEmpty v-else-if="searchValue.length > 2 && !gameSearchList.length" :description="t('未找到结果')" class="mt-[60px]">
          <template #icon>
            <AfunBaseImage class="w-[80px]" url="/afun-h5/png/uni-table-empty.png" />
          </template>
        </AfunBaseEmpty>
        <template v-else>
          <div class="w-full text-[#B1BAD3] text-center text-[12px] mb-[12px]">
            {{ `${t('搜素需要至少3个字符来进行搜索')}` }}
          </div>
          <div v-if="searchRecordList.length" class="w-full px-[12px] mb-[16px]">
            <div class="mb-[12px] text-[12px] flex justify-between">
              <div class="text-[#B1BAD3]">
                {{ t('近期搜索') }}
              </div>
              <div class="text-[#B1BAD3] cursor-pointer" @click="clearList(9999)">
                {{ `${t('清除搜索')}(${searchRecordList.length})` }}
              </div>
            </div>
            <div class="flex flex-wrap">
              <div
                v-for="item, index in searchRecordList" :key="item"
                class="center px-[4px] leading-[20px] mr-[10px] mb-[8px] bg-[#304554] text-[#B1BAD3] font-[600] rounded-[12px]"
              >
                <span class="mr-[4px] text-[14px] cursor-pointer" @click="searchValue = item">{{ item }}</span>
                <IconCloseIcon class="text-[10px] cursor-pointer" @click="clearList(index)" />
              </div>
            </div>
          </div>
          <div v-if="searchHotWordList.length" class="w-full px-[12px]">
            <div class="mb-[12px] text-[12px] flex justify-between">
              <div class="text-[#B1BAD3]">
                {{ t('热门搜索') }}
              </div>
            </div>
            <div class="flex flex-wrap">
              <div
                v-for="item in searchHotWordList" :key="item"
                class="center px-[4px] leading-[20px] mr-[10px] mb-[8px] bg-[#304554] text-[#B1BAD3] font-[600] rounded-[12px]"
              >
                <span class="text-[14px] cursor-pointer" @click="searchValue = item">{{ item }}</span>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
  <div v-else class="w-full h-full bg-[#1A2C38] font-[600] flex flex-col">
    <AppHeader style="position: relative;top: 0;" />
    <div v-if="show" ref="scrollElementRef" class="px-[12px] pt-[8px] pb-[24px] flex-1 overflow-scroll hide-scroll-bar">
      <AppSearchInput v-model="searchValue" auto-focus show-close :style="{ marginBottom: searchValue.length > 2 ? '12px' : '12px' }" @close="close" />
      <AppLoading v-if="searchValue.length > 2 && loading" :height="90" />
      <template v-else-if="searchValue.length > 2 && gameSearchList.length">
        <AppCasinoGameList :list="gamesList" />
        <AfunBaseLoadMore
          class="center text-[12px] text-[#B1BAD3] font-[600] leading-[14px] mt-[12px]" :loading="loading"
          :finished="gamesList.length >= total" @load="loadMoreGame"
        >
          {{ loading ? t('加载中') : gamesList.length === total ? t('没有更多了') : t('滚动以加载更多') }}
        </AfunBaseLoadMore>
      </template>
      <AfunBaseEmpty v-else-if="searchValue.length > 2 && !gameSearchList.length" :description="t('未找到结果')" class="mt-[60px]">
        <template #icon>
          <AfunBaseImage class="w-[80px]" url="/m/afun-h5/png/uni-table-empty.png" />
        </template>
      </AfunBaseEmpty>
      <template v-else>
        <div class="w-full text-[#B1BAD3] text-center text-[12px] mt-[24px] mb-[12px]">
          {{ `${t('搜素需要至少3个字符来进行搜索')}` }}
        </div>
        <div v-if="searchRecordList.length" class="w-full px-[10px] mb-[16px]">
          <div class="mb-[12px] text-[12px] flex justify-between">
            <div class="text-[#B1BAD3] font-[500] leading-[22px]">
              {{ t('近期搜索') }}
            </div>
            <div class="text-[#B1BAD3] cursor-pointer" @click="clearList(9999)">
              {{ `${t('清除搜索')}(${searchRecordList.length})` }}
            </div>
          </div>
          <div class="flex flex-wrap">
            <div
              v-for="item, index in searchRecordList" :key="item"
              class="center px-[4px] leading-[20px] mr-[10px] mb-[8px] bg-[#304554] text-[#B1BAD3] font-[600] rounded-[12px]"
            >
              <span class="mr-[4px] text-[14px] cursor-pointer" @click="searchValue = item">{{ item }}</span>
              <IconCloseIcon class="text-[10px] cursor-pointer" @click="clearList(index)" />
            </div>
          </div>
        </div>
        <div v-if="searchHotWordList.length" class="w-full px-[10px]">
          <div class="mb-[12px] text-[12px] flex justify-between">
            <div class="text-[#B1BAD3] font-[500] leading-[22px]">
              {{ t('热门搜索') }}
            </div>
          </div>
          <div class="flex flex-wrap">
            <div
              v-for="item in searchHotWordList" :key="item"
              class="center px-[4px] leading-[20px] mr-[10px] mb-[8px] bg-[#304554] text-[#B1BAD3] font-[600] rounded-[12px]"
            >
              <span class="text-[14px] cursor-pointer" @click="searchValue = item">{{ item }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

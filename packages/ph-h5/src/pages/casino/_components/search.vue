<script setup lang='ts'>
import { ApiMemberGameSearch } from '@tg/apis'
import { PhBaseEmpty, PhBaseImage } from '@tg/bccomponents'
import PhBaseLoadMore from '@tg/bccomponents/src/ph/PhBaseLoadMore.vue'
import { useList } from '@tg/hooks'
import { IconSearch, IconUniClose2 } from '@tg/icons'
import { getEnv, Local } from '@tg/utils'
import { debounce } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppLoading from '~/components/AppLoading.vue'

const emit = defineEmits(['close'])
const { t } = useI18n()
const route = useRoute()
const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()

const searchValue = ref('')
const searchRecord = ref(Local.get('HOMESEARCH')?.value as unknown as string[] ?? ['Monopoly', 'Crazy Time', 'Sweet Bonanza', 'Sweet Bonanza', 'Reactoonz'])
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
    searchRecord.value = []
  }
  else {
    searchRecord.value = searchRecord.value.filter((_, i) => i !== index)
  }
  Local.set('HOMESEARCH', searchRecord.value)
}

function setLocatList() {
  if (searchRecord.value.find(item => searchValue.value === item) || searchValue.value.length < 3) {
    return
  }
  searchRecord.value.push(searchValue.value)
  Local.set('HOMESEARCH', searchRecord.value)
}

// 定义防抖函数，只创建一次
const debouncedSetLocatList = debounce(() => {
  onSearch()
  setLocatList()
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

function close() {
  emit('close', false)
  searchValue.value = ''
}

watch(route, () => {
  emit('close', true)
  searchValue.value = ''
}, { deep: true })
</script>

<template>
  <div class="w-full h-full bg-[#f6f7f8] px-[10rem] pt-[8rem] pb-[24rem] overflow-scroll hide-scroll-bar">
    <div class="relative flex h-[34rem] bg-[#fff] rounded-[100px]" :style="{ marginBottom: searchValue.length > 2 ? '12rem' : '24rem' }">
      <input
        v-model="searchValue" autocomplete="off" name="search"
        class="rounded-[100px] h-full w-full flex-1 outline-none border border-solid border-transparent focus:border-[#F23038]  pl-[40rem] "
        type="text" :placeholder="t('搜索游戏名称')"
      >
      <div class="absolute left-[10rem] top-[4rem]">
        <IconSearch class="text-[26rem] text-[#9dabc9]" />
      </div>
      <div
        class="absolute right-0 pr-[11rem] center h-full top-[0rem] font-[500] text-[#F23038] cursor-pointer"
        @click="close"
      >
        {{ t('关闭') }}
      </div>
    </div>
    <AppLoading v-if="searchValue.length > 2 && loading" :height="90" />
    <template v-else-if="searchValue.length > 2 && gameSearchList.length">
      <AppCasinoGameList :list="gamesList" />
      <PhBaseLoadMore
        class="center text-[12rem] text-[#6D7693] font-[500] leading-[14rem] mt-[12rem]" :loading="loading"
        :finished="gamesList.length >= total" @load="loadMoreGame"
      >
        {{ loading ? t('加载中') : gamesList.length === total ? t('没有更多了') : t('滚动以加载更多') }}
      </PhBaseLoadMore>
    </template>
    <PhBaseEmpty v-else-if="searchValue.length > 2 && !gameSearchList.length" :description="t('未找到结果')">
      <template #icon>
        <PhBaseImage url="/ph-h5/png/uni-table-empty.png" />
      </template>
    </PhBaseEmpty>
    <template v-else>
      <div class="w-full text-[#6D7693] text-center text-[12rem] mb-[12rem]">
        {{ `${t('搜素需要至少3个字符来进行搜索')}` }}
      </div>
      <div v-if="searchRecord.length" class="w-full px-[12rem]">
        <div class="mb-[12rem] text-[12rem] flex justify-between">
          <div class="text-[#000]">
            {{ t('近期搜索') }}
          </div>
          <div class="text-[#6D7693] cursor-pointer" @click="clearList(9999)">
            {{ `${t('清除搜索')}(${searchRecord.length})` }}
          </div>
        </div>
        <div class="flex flex-wrap">
          <div
            v-for="item, index in searchRecord" :key="item"
            class="center px-[4rem] py-[2rem] mr-[10rem] mb-[8rem] text-[#6D7693]"
          >
            <span class="mr-[4rem] text-[10rem] cursor-pointer" @click="searchValue = item">{{ item }}</span>
            <IconUniClose2 class="text-[8rem] cursor-pointer" @click="clearList(index)" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang='scss' scoped></style>

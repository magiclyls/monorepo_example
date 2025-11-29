<script setup lang='ts'>
import { ApiMemberFavList } from '@tg/apis'
import { useList } from '@tg/hooks'
import { IconLike } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { getEnv } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

const { isLogin } = storeToRefs(useAppStore())
const { t } = useI18n()
const router = useRouter()
const { VITE_CASINO_HOME_PAGE_SIZE } = getEnv()

const { list: gameList, runAsync: runGameSearch, loading } = useList(ApiMemberFavList, {
  ready: isLogin,
}, { page_size: 999 })

const gamesList = computed(() => {
  if (gameList.value) {
    return gameList.value
  }
  return []
})

onMounted(() => {
  runGameSearch()
})
</script>

<template>
  <AppPageLayout :title="t('收藏夹')" style="--ph-page-layout-padding-y:16rem;">
    <AppLoading v-if="loading" />
    <div v-else-if="gamesList.length === 0" class="center">
      <span> {{ t('暂无任何收藏，请使用') }}&nbsp;</span>
      <IconLike class="text-[#F23038]" />
      <span>&nbsp;{{ t('把游戏添加到收藏夹中') }}</span>
    </div>
    <div v-else>
      <AppCasinoGameList :list="gamesList" />
      <div class="bg-[#fff] mt-[14rem] text-[#6D7693] rounded-[6rem] center h-[32rem]" @click="router.push('/')">
        {{ t('所有游戏') }}
      </div>
    </div>
  </AppPageLayout>
</template>

<style lang='scss' scoped>

</style>

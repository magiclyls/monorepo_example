<script setup lang='ts'>
import { ApiMemberGameListHistory } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppLoading from '~/components/AppLoading.vue'
import AppPageLayout from '~/components/AppPageLayout.vue'

const { t } = useI18n()
const router = useRouter()
const { isLogin } = storeToRefs(useAppStore())

const { data: gameList, runAsync: runGameSearch, loading } = useRequest(ApiMemberGameListHistory, {
  ready: isLogin,
})

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
  <AppPageLayout :title="t('近期游戏记录')" style="--ph-page-layout-padding-y:16rem;">
    <AppLoading v-if="loading" />
    <div v-else-if="gamesList.length === 0" class="center">
      {{ t('暂无游戏记录') }}
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

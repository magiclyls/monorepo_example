<script setup lang='ts'>
import type { GameDetails } from '@tg/types'
import { ApiMemberGameCate } from '@tg/apis'
import { useCasinoStore } from '@tg/stores'
import { application } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppCasinoMultiLine from '~/components/AppCasinoMultiLine.vue'

const route = useRoute()
const casinoStore = useCasinoStore()
const { cateProviderData, gameLobbyDateLoading, recommendGameList } = storeToRefs(casinoStore)

const id = ref(route.query.id?.toString() ?? '')
const pn = ref(route.query.pn?.toString() ?? '')
const pid = ref(route.query.pid?.toString() ?? '')
const vid = ref(route.query.vid?.toString() ?? '')
const game_id = ref(route.query.game_id?.toString() ?? '')
const game_type = ref(route.query.type?.toString())
const gameDetails = ref<GameDetails>()
const cateHotData = ref()

const realName = computed(() => gameDetails.value?.name ?? '')
const _api_game_type = computed(() => (vid.value === '309' ? '8' : game_type.value ?? ''))
const paramEmpty = computed(() => !!(id.value || game_id.value))

function initData() {
  return new Promise<void>((resolve) => {
    runGetCateHotData(_api_game_type.value ?? game_type.value)
      .finally(() => {
        // 监听 gameLobbyDateLoading 的变化
        if (gameLobbyDateLoading.value === false) {
          resolve()
          return
        }
        const stop = watch(gameLobbyDateLoading, (val) => {
          if (val === false) {
            stop()
            resolve()
          }
        })
      })
  })
}

// 游戏详情页 底部 一排 热门游戏 cid: 100 game_type xx
// 热门游戏 cid: 100 game_type xx
async function runGetCateHotData(game_type: string) {
  const data = recommendGameList.value[_api_game_type.value]
  if (data) {
    cateHotData.value = data
    return
  }

  const date = await ApiMemberGameCate({ cid: '100', game_type, ty: 1 })
  cateHotData.value = {
    ...date,
    title: date.name,
    path: `/group/category/100?cid=100&ty=1${_api_game_type.value ? `&game_type=${_api_game_type.value}` : ''}`,
    useCloudImg: true,
    gameList: [{ item_nums: 3, list: date.games }],
  }
  recommendGameList.value[_api_game_type.value] = cateHotData.value
}

await application.allSettled([initData()])
</script>

<template>
  <div class="mt-[16px]">
    <AppCasinoMultiLine v-if="cateHotData && cateHotData.gameList && cateHotData.total" :detail="cateHotData" :compress-image="false" />
    <AppCasinoMultiLine v-if="cateProviderData && cateProviderData.gameList && cateProviderData.gameList.length" class="mt-[12px]" :detail="cateProviderData" is-provider />
  </div>
</template>

<style scoped lang="scss">

</style>

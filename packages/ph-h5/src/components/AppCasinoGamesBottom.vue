<script setup lang='ts'>
import type { GameDetails } from '@tg/types'
import { ApiMemberGameCate, ApiMemberGameDetail } from '@tg/apis'
import { useCasinoStore } from '@tg/stores'
import { application } from '@tg/utils'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppCasinoGameList from '~/components/AppCasinoGameList.vue'
import AppCasinoGamesTitle from '~/components/AppCasinoGamesTitle.vue'

const route = useRoute()
const casinoStore = useCasinoStore()
const { t } = useI18n()

const id = ref(route.query.id?.toString() ?? '')
const pn = ref(route.query.pn?.toString() ?? '')
const pid = ref(route.query.pid?.toString() ?? '')
const vid = ref(route.query.vid?.toString() ?? '')
const game_id = ref(route.query.game_id?.toString() ?? '')
const game_type = ref(route.query.type?.toString())
const gameDetails = ref<GameDetails>()
const cateHotData = ref()

const realName = computed(() => gameDetails.value?.name ?? '')
const _api_game_type = computed(() => (vid.value === '309' ? '8' : game_type.value))
const paramEmpty = computed(() => !!(id.value || game_id.value))

const { runAsync: runGetGameDetail } = useRequest(() => ApiMemberGameDetail(id.value, pid.value || vid.value, game_id.value), {
  ready: paramEmpty,
  manual: true,
})

function initData() {
  return new Promise<void>((resolve) => {
    runGetGameDetail().then((res) => {
      gameDetails.value = res

      if (res && res.game_type) {
        if (res.platform_name && res.platform_name.length)
          pn.value = res.platform_name

        game_type.value = res.game_type
        runGetCateHotData(_api_game_type.value ?? game_type.value)
          .finally(() => {
            console.log(cateHotData.value, 'cateHotData')
            resolve()
          })
      }
      else { resolve() }
    }).catch(() => {
      resolve()
    })
  })
}

// 游戏详情页 底部 一排 热门游戏 cid: 100 game_type xx
// 热门游戏 cid: 100 game_type xx
async function runGetCateHotData(game_type: string) {
  const date = await ApiMemberGameCate({ cid: '100', game_type, ty: 1 })
  cateHotData.value = date
}

await application.allSettled([initData()])
</script>

<template>
  <div v-if="cateHotData?.games?.length">
    <AppCasinoGamesTitle :total="cateHotData?.total" :title="t('热门推荐')" :path="`/group/category/100?cid=100&ty=1${_api_game_type ? `&game_type=${_api_game_type}` : ''}`" />
    <AppCasinoGameList :list="cateHotData.games" class="mt-[16rem]" />
  </div>
</template>

<style scoped lang="scss">

</style>

<script setup lang='ts'>
import type { GameDetails } from '@tg/types'
import { ApiMemberGameDetail } from '@tg/apis'
import AppSlider from '~/components/AppSlider.vue'
import AppsliderNewDefault from '~/components/AppSliderNewDefault.vue'
import AppSliderWg from '~/components/AppSliderWg.vue'
import AppSliderWhite from '~/components/AppSliderWhite.vue'

defineOptions({ name: 'AppCasinoGamesBottom' })

const route = useRoute()
const casinoStore = useCasinoStore()
const { isMobile } = storeToRefs(useWindowStore())
const { cateProviderData, casinoRecData, cateHotData } = storeToRefs(casinoStore)

const id = ref(route.query.id?.toString() ?? '')
const pn = ref(route.query.pn?.toString() ?? '')
const pid = ref(route.query.pid?.toString() ?? '')
const vid = ref(route.query.vid?.toString() ?? '')
const game_id = ref(route.query.game_id?.toString() ?? '')
const game_type = ref(route.query.type?.toString())
const appSliderObj: Record<number, any> = {
  5: AppSliderWg,
  4: AppSliderWhite,
  0: AppSlider,
  6: AppsliderNewDefault,
}
const gameDetails = ref<GameDetails>()

const realName = computed(() => gameDetails.value?.name ?? '')
const currentSlider = computed(() => appSliderObj[globalInitMap.currentTemplate] || appSliderObj[0])
const _api_game_type = computed(() => (vid.value === '309' ? '8' : game_type.value))
const paramEmpty = computed(() => {
  return !!(id.value || game_id.value)
})

const { runAsync: runGetGameDetail } = useRequest(() => ApiMemberGameDetail(id.value, pid.value || vid.value, game_id.value), {
  ready: paramEmpty,
  manual: true,
})

// const { list: recGameList } = useList(ApiMemberGameRecList, { manual: false })

function initData() {
  return new Promise<void>((resolve) => {
    runGetGameDetail().then((res) => {
      gameDetails.value = res

      if (res && res.game_type) {
        if (res.platform_name && res.platform_name.length)
          pn.value = res.platform_name

        game_type.value = res.game_type
        casinoStore.runGetCateHotData(_api_game_type.value ?? game_type.value)
          .finally(() => {
            resolve()
          })
      }
      else { resolve() }
    }).catch(() => {
      resolve()
    })
  })
}

await application.allSettled([initData()])
</script>

<template>
  <section class="page-content">
    <!-- <BaseTemplate template="">
      <AppDesc :name="realName" :plat-name="pn" :vid="vid" :game-details="gameDetails" />
    </BaseTemplate> -->

    <div class="home-container margin-auto">
      <div class="content-wrapper">
        <template v-if="cateHotData">
          <component
            :is="currentSlider"
            :icon="cateHotData.icon"
            :title="cateHotData.name"
            :data="cateHotData?.games"
            :path="`/casino/group/category?cid=100&ty=1${_api_game_type ? `&game_type=${_api_game_type}` : ''}`"
            cid="100"
            :ty="casinoRecData.ty"
            use-cloud-img
            :total="cateHotData?.games?.length"
          />
        </template>
        <!-- <template v-if="globalInitMap.currentTemplate == 4">
          <AppCasinoLobbyProviderSliderWhite
            :data="cateProviderData?.venue ?? { h5: [], pc: [] }"
            :title="cateProviderData?.name ?? ''" :icon="cateProviderData?.icon ?? ''"
          />
        </template>
        <template v-else-if="globalInitMap.currentTemplate == 6">
          <AppCasinoLobbyProviderSliderNewDefault
            :data="cateProviderData?.venue ?? { h5: [], pc: [] }"
            :title="cateProviderData?.name ?? ''" :icon="cateProviderData?.icon ?? ''"
          />
        </template>
        <template v-else>
          <AppCasinoLobbyProviderSlider
            :data="cateProviderData?.venue ?? { h5: [], pc: [] }"
            :title="cateProviderData?.name ?? ''" :icon="cateProviderData?.icon ?? ''"
          />
        </template> -->
      </div>
      <!-- <div v-if="!isMobile" class="layout-spacing">
        <AppBetData mode="casino" />
      </div> -->
    </div>
  </section>
</template>

<style lang='scss' scoped>
.content-wrapper {
  margin-bottom: var(--tg-spacing-24);
}
</style>

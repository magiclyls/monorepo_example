<script setup lang='ts'>
import { ApiGameRecycle } from '@tg/apis'

import { usePageTitle } from '~/composables/usePageTitle'
import { getParamsQuery } from '~/utils'

defineOptions({
  name: 'KeepAliveCasinoGames',
})

const { isMobile } = storeToRefs(useWindowStore())
const { isLogin } = storeToRefs(useAppStore())
const route = useRoute()
const { bool: isTheatre, setBool } = useBoolean(false) // 影院模式

const { runAsync: runRecycle } = useRequest(ApiGameRecycle, {
  ready: isLogin,
  debounceInterval: 3000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
})

const id = ref(route.query.id?.toString() ?? '')
const pid = ref(route.query.pid?.toString() ?? '')
const vid = ref(route.query.vid?.toString() ?? '')
const game_id = ref(route.query.game_id?.toString() ?? '')
const appIframeRef = ref()

usePageTitle({
  prefix: getParamsQuery('name'),
})

onBeforeMount(() => {
  runRecycle()
})

onActivated(() => {
  id.value = route.query.id?.toString() ?? ''
  pid.value = route.query.pid?.toString() ?? ''
  vid.value = route.query.vid?.toString() ?? ''
  game_id.value = route.query.game_id?.toString() ?? ''
  runRecycle()
})

onBeforeRouteLeave((to, from) => {
  Local.set('last_game_id', route.query.id)
  if (to.fullPath.includes('casino/mobile-game-frame'))
    console.log('go game')
  else
    runRecycle()
})
</script>

<template>
  <div class="casino-games" :class="{ theatre: isTheatre && !isMobile }">
    <AppCasinoIframe
      :id="id" ref="appIframeRef" :pid="pid || vid"
      :vid="vid"
      :game-id="game_id"
      :is-theatre="isTheatre"
      @change-theatre="setBool"
    />
  </div>
  <AppCasinoGamesBottom />
</template>

<style lang='scss' scoped>
.casino-games {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
}

.theatre {
  padding: 0;
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>

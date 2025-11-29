<script setup lang='ts'>
import { ApiGameRecycle } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { onActivated, onBeforeMount, ref } from 'vue'
import { useRequest } from 'vue-request'
import { onBeforeRouteLeave, useRoute } from 'vue-router'
import AppCasinoGamesBottom from '~/components/AppCasinoGamesBottom.vue'
import AppCasinoIframe from '~/components/AppCasinoIframe.vue'

defineOptions({ name: 'AppCasinoGamePage' })

const { isLogin } = storeToRefs(useAppStore())
const route = useRoute()

const id = ref(route.query.id?.toString() ?? '')
const pid = ref(route.query.pid?.toString() ?? '')
const vid = ref(route.query.vid?.toString() ?? '')
const game_id = ref(route.query.game_id?.toString() ?? '')

const appIframeRef = ref()

const { runAsync: runRecycle } = useRequest(ApiGameRecycle, {
  ready: isLogin,
  debounceInterval: 3000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
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
  if (to.fullPath.includes('/games/mobile-game-frame'))
    console.log('go game')
  else
    runRecycle()
})
</script>

<template>
  <div>
    <AppCasinoIframe
      :id="id" ref="appIframeRef" :pid="pid || vid" :vid="vid" :game-id="game_id"
    />
    <AppCasinoGamesBottom class="mt-[16rem]" />
  </div>
</template>

<style lang='scss' scoped>

</style>

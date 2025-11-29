<script setup lang='ts'>
import { ApiGameRecycle } from '@tg/apis'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount } from 'vue'
import { useRequest } from 'vue-request'
import { useRoute } from 'vue-router'
import AppCasinoGamesBottom from '~/components/AppCasinoGamesBottom.vue'
import AppCasinoIframe from '~/components/AppCasinoIframe.vue'

defineOptions({ name: 'AppCasinoGamePage' })

const { isLogin } = storeToRefs(useAppStore())
const route = useRoute()

const id = computed(() => route.query.id?.toString() ?? '')
const pid = computed(() => route.query.pid?.toString() ?? '')
const vid = computed(() => route.query.vid?.toString() ?? '')
const game_id = computed(() => route.query.game_id?.toString() ?? '')

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
</script>

<template>
  <div class="p-[12px] global-padding-bottom">
    <AppCasinoIframe
      :id="id" :pid="pid || vid" :vid="vid" :game-id="game_id"
    />
    <AppCasinoGamesBottom />
  </div>
</template>

<style lang='scss' scoped>

</style>

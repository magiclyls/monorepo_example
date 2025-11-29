<script setup lang='ts'>
import type { OriginalGameMinesTile } from '@tg/types'
import { ref } from 'vue'
import AppMiniGamePartMinesTile from '~/pages/original-game/mines/AppMiniGamePartMinesTile.vue'

interface Props {
  mines: number[]
  openByPlayerList: number[]
}
defineOptions({
  name: 'AppMiniGamePartMinesGameResultComponents',
})
const props = defineProps<Props>()

const tilesList = ref<OriginalGameMinesTile[]>([
  { position: 0, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 1, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 2, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 3, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 4, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 5, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 6, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 7, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 8, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 9, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 10, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 11, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 12, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 13, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 14, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 15, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 16, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 17, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 18, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 19, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 20, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 21, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 22, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 23, result: '', openByPlayer: false, fetching: false, chosen: false },
  { position: 24, result: '', openByPlayer: false, fetching: false, chosen: false },
])

for (let i = 0; i < tilesList.value.length; i++) {
  if (props.mines.includes(tilesList.value[i].position) && !tilesList.value[i].result)
    tilesList.value[i].result = 'mine'
  else if (!tilesList.value[i].result)
    tilesList.value[i].result = 'gem'

  if (props.openByPlayerList.includes(tilesList.value[i].position))
    tilesList.value[i].openByPlayer = true
}
</script>

<template>
  <div class="w-full text-[14rem]">
    <div
      class="grid grid-cols-5 mx-auto max-w-700 w-[70%] gap-[8rem]"
    >
      <AppMiniGamePartMinesTile
        v-for="tile, i in tilesList" :key="tile.position" :index="i" immediately
        :data="tile" :animate-enabled="false"
      />
    </div>
  </div>
</template>

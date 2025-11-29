<script setup lang='ts'>
import type { OriginalGameKenoTile } from '@tg/types'
import { ref } from 'vue'
import AppMiniGamePartKenoTile from '~/pages/original-game/keno/AppMiniGamePartKenoTile.vue'

interface Props {
  drawnNumbers: number[]
  selectedNumbers: number[]
}
defineOptions({
  name: 'AppMiniGamePartKenoGameResultComponents',
})
const props = defineProps<Props>()

/** 方块数据 */
const tilesList = ref<OriginalGameKenoTile[]>([
  { position: 0, num: 1, chosen: false, result: '' },
  { position: 1, num: 2, chosen: false, result: '' },
  { position: 2, num: 3, chosen: false, result: '' },
  { position: 3, num: 4, chosen: false, result: '' },
  { position: 4, num: 5, chosen: false, result: '' },
  { position: 5, num: 6, chosen: false, result: '' },
  { position: 6, num: 7, chosen: false, result: '' },
  { position: 7, num: 8, chosen: false, result: '' },
  { position: 8, num: 9, chosen: false, result: '' },
  { position: 9, num: 10, chosen: false, result: '' },
  { position: 10, num: 11, chosen: false, result: '' },
  { position: 11, num: 12, chosen: false, result: '' },
  { position: 12, num: 13, chosen: false, result: '' },
  { position: 13, num: 14, chosen: false, result: '' },
  { position: 14, num: 15, chosen: false, result: '' },
  { position: 15, num: 16, chosen: false, result: '' },
  { position: 16, num: 17, chosen: false, result: '' },
  { position: 17, num: 18, chosen: false, result: '' },
  { position: 18, num: 19, chosen: false, result: '' },
  { position: 19, num: 20, chosen: false, result: '' },
  { position: 20, num: 21, chosen: false, result: '' },
  { position: 21, num: 22, chosen: false, result: '' },
  { position: 22, num: 23, chosen: false, result: '' },
  { position: 23, num: 24, chosen: false, result: '' },
  { position: 24, num: 25, chosen: false, result: '' },
  { position: 25, num: 26, chosen: false, result: '' },
  { position: 26, num: 27, chosen: false, result: '' },
  { position: 27, num: 28, chosen: false, result: '' },
  { position: 28, num: 29, chosen: false, result: '' },
  { position: 29, num: 30, chosen: false, result: '' },
  { position: 30, num: 31, chosen: false, result: '' },
  { position: 31, num: 32, chosen: false, result: '' },
  { position: 32, num: 33, chosen: false, result: '' },
  { position: 33, num: 34, chosen: false, result: '' },
  { position: 34, num: 35, chosen: false, result: '' },
  { position: 35, num: 36, chosen: false, result: '' },
  { position: 36, num: 37, chosen: false, result: '' },
  { position: 37, num: 38, chosen: false, result: '' },
  { position: 38, num: 39, chosen: false, result: '' },
  { position: 39, num: 40, chosen: false, result: '' },
])

props.drawnNumbers.forEach(i => tilesList.value[i].result = 'hello world')
props.selectedNumbers.forEach(i => tilesList.value[i].chosen = true)
</script>

<template>
  <div class="mb-[14rem] w-full text-[14rem]">
    <div class="relative grid grid-cols-8 w-full gap-[6rem]">
      <AppMiniGamePartKenoTile v-for="tile in tilesList" :key="tile.num" :data="tile" :animate-enabled="true" />
    </div>
  </div>
</template>

<style lang='scss' scoped>

</style>

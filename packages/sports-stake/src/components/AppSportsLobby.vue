<script setup lang='ts'>
import AppSportsPageFavourites from './AppSportsPageFavourites.vue'
import AppSportsPageLobby from './AppSportsPageLobby.vue'
import AppSportsPageMyBet from './AppSportsPageMyBet.vue'
import AppSportsPageVirtualSports from './AppSportsPageVirtualSports.vue'

defineOptions({
  name: 'AppSportsLobby',
})
defineProps<{ marketType: string }>()
</script>

<template>
  <!-- 大厅 -->
  <AppSportsPageLobby v-if="marketType === 'all'" />
  <!-- 虚拟体育 -->
  <AppSportsPageVirtualSports v-else-if="marketType === 'v-sports'" />
  <!-- 我的投注 -->
  <AppSportsPageMyBet v-else-if="marketType === 'my-bet'" on-page />
  <!-- 收藏夹 -->
  <AppSportsPageFavourites v-else-if="marketType === 'fav'" on-page />
</template>

<style lang='scss' scoped>

</style>

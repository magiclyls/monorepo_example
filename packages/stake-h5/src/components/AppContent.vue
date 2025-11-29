<script lang="ts" setup>
defineOptions({
  name: 'AppContent',
})
const props = defineProps<{ except?: boolean }>()
const route = useRoute()
const routeName = computed(() => route.name?.toString() ?? '')
const { isMobile } = storeToRefs(useWindowStore())
// 是否游戏页面
const isCasinoGames = computed(() => {
  return (routeName.value.includes('casino-games') || routeName.value.includes('casino-original-game') || routeName.value.includes('casino-home-wg')) && !props.except
})
</script>

<template>
  <section
    class="page-content"
    :class="{ 'p-0': isCasinoGames }"
    :style="{
      padding: `${isMobile ? '0 12px' : '0 3vw'}`,
    }"
  >
    <div class="margin-auto" :class="[{ 'home-container': !isCasinoGames }]">
      <slot />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.margin-auto {
  margin: 0 auto;
}
.p-0{
  padding: 0;
}
</style>

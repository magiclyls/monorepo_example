<script setup lang="ts">
defineOptions({
  name: 'AppSportCartToAllEvent',
})
const emits = defineEmits(['receive'])
// 购物车 向 体育所有列表，详情 推送消息
function handle() {
  emits('receive')
}
function send() {
  appEventBus.emit(EventBusNames.CART_TO_SPORTS_BUS)
}

defineExpose({ send })

onMounted(() => {
  appEventBus.on(EventBusNames.SPORTS_TO_CART_BUS, handle)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.SPORTS_TO_CART_BUS, handle)
})
</script>

<template>
  <div class="text-tg-text-white h-[0px] overflow-hidden" />
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppSportAllToCartEvent',
})
const emits = defineEmits(['receive'])

// // 体育所有列表，详情向 购物车 推送消息
function handle() {
  emits('receive')
}
function send() {
  appEventBus.emit(EventBusNames.SPORTS_TO_CART_BUS)
}

defineExpose({ send })

onMounted(() => {
  appEventBus.on(EventBusNames.CART_TO_SPORTS_BUS, handle)
})

onUnmounted(() => {
  appEventBus.off(EventBusNames.CART_TO_SPORTS_BUS, handle)
})
</script>

<template>
  <div class="text-tg-text-white h-[0px] overflow-hidden" />
</template>

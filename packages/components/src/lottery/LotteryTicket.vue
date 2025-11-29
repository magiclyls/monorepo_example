<script setup lang="ts" name="LotteryTicket">
interface Props {
  bgImg: string
  height?: string
  width?: string
}
const props = withDefaults(defineProps<Props>(), {
  height: '100rem',
  width: '100%',
})
</script>

<template>
  <div v-bg-image="bgImg" class="ticket" :style="{ height, width }">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.ticket {
  position: relative;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>

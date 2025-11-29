<script name="LotteryEmpty" setup lang="ts">
import LotteryTicket from './LotteryTicket.vue'

interface Props {
  picClass?: string
  width?: string
  height?: string
}
const props = withDefaults(defineProps<Props>(), {
  picClass: 'w-[150.5rem] h-[140rem]',
  width: '150rem',
  height: '140rem',
})
</script>

<template>
  <div class="empty-bg size-full flex flex-col items-center justify-center">
    <LotteryTicket bg-img="/lottery/png/variable-empty.png" :height="height" :width="width" :class="picClass" />
    <div class="empty-text">
      No Data
    </div>
  </div>
</template>

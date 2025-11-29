<script setup lang='ts'>
import { computed } from 'vue'
import AppCasinoGameItem from '~/components/AppCasinoGameItem.vue'

interface Props {
  list: any[]
  isProvider?: boolean
  col?: number | undefined
}
defineOptions({ name: 'AppCasinoGameList' })
const props = defineProps<Props>()

// 内页固定3个 外页走接口 避免接口传0或者undefined  内页不要传参读默认值
const col = computed(() => props.col || 3)
</script>

<template>
  <div
    class="grid gap-x-[var(--ph-game-gap-x)] gap-y-[var(--ph-game-gap-y)]"
    :style="{ gridTemplateColumns: `repeat(${col}, 1fr)` }"
  >
    <AppCasinoGameItem v-for="item in list" :key="item.name" :data="item" />
  </div>
</template>

<style lang='scss' scoped>

</style>

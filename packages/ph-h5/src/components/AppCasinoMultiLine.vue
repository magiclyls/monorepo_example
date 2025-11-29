<script setup lang="ts">
import type { ICasinoGameItem } from '@tg/types'
import { useScroll } from '@vueuse/core'
import { computed, onActivated, ref, watch } from 'vue'
import AppCasinoGameItem from '~/components/AppCasinoGameItem.vue'
import AppCasinoGamesTitle from '~/components/AppCasinoGamesTitle.vue'

interface ComponentItem {
  cid: string
  name: string
  icon: string
  ty: string | number
  total: number
  platform_id: string
  path: string
  gameList: {
    item_nums: number
    list: ICasinoGameItem[]
  }[]
}

interface Props {
  detail: ComponentItem
}

defineOptions({ name: 'AppCasinoMultiLine' })

const props = defineProps<Props>()

const wrapper = ref()
const { x } = useScroll(wrapper, { behavior: 'smooth' }) // , isScrolling, arrivedState, directions

// 获取最长一行的长度
const maxLineLength = ref(0)

const wrapperWidth = ref(0)

const isPrevAactive = computed(() => {
  if (x.value > 0) {
    return true
  }
  else {
    return false
  }
})

const isNextAactive = computed(() => {
  if (x.value + wrapperWidth.value < maxLineLength.value) {
    return true
  }
  else {
    return false
  }
})

function next() {
  x.value += wrapperWidth.value
}

function prev() {
  const temp = x.value - wrapperWidth.value
  if (temp > 0)
    x.value = temp
  else
    x.value = 0
}

watch(wrapper, () => {
  if (props.detail && wrapper) {
    const arr = props.detail.gameList?.map(item => item.list.length / (item.item_nums || 4))
    if (!arr)
      return
    const max = Math.max(...arr)
    maxLineLength.value = wrapper.value.offsetWidth * max
    wrapperWidth.value = wrapper.value.offsetWidth
  }
})

onActivated(() => {
  x.value = 0
})
</script>

<template>
  <div>
    <AppCasinoGamesTitle class="mb-[6rem]" arrow :is-prev-aactive="isPrevAactive" :is-next-aactive="isNextAactive" :title="detail.name" :total="detail.total" :path="detail?.path" @next="next" @prev="prev" />
    <div ref="wrapper" class="flex flex-col overflow-scroll hide-scroll detail-wrapper">
      <div
        v-for="item, index in detail.gameList" :key="index" class="item-wrapper"
        :class="`cols-${item.item_nums}`"
      >
        <AppCasinoGameItem v-for="game in item.list" :key="game.id" :data="game" class=" max-big" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-wrapper {
  scroll-snap-type: x mandatory; //todo
  scroll-behavior: smooth; /* 平滑滚动（可选） */
}
.item-wrapper {
  display: grid;
  grid-auto-flow: column;
  margin-bottom: var(--ph-game-gap-y);

  &:last-child {
    margin-bottom: 0rem;
  }
  &.cols-2 {
    grid-auto-columns: calc((100% - var(--ph-game-gap-x)) / 2);
    gap: var(--ph-game-gap-x);
  }
  &.cols-3 {
    grid-auto-columns: calc((100% - calc((var(--ph-game-gap-x)) * 2)) / 3);
    gap: var(--ph-game-gap-x);
  }
  &.cols-4 {
    grid-auto-columns: calc((100% - calc((var(--ph-game-gap-x)) * 3)) / 4);
    gap: var(--ph-game-gap-x);
  }
}

.max-big {
  scroll-snap-align: start;
}
</style>

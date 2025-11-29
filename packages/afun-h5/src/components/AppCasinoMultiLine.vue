<script setup lang="ts">
import type { ICasinoGameItem } from '@tg/types'
import { AfunBaseImage } from '@tg/bccomponents'
import { useScroll } from '@vueuse/core'
import { computed, onActivated, onDeactivated, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
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
  isProvider?: boolean
  compressImage?: boolean // 是否压缩图片
}

defineOptions({ name: 'AppCasinoMultiLine' })

const props = withDefaults(defineProps<Props>(), {
  compressImage: true,
})
const router = useRouter()

const wrapper = ref()
const { x } = useScroll(wrapper, { behavior: 'smooth' }) // , isScrolling, arrivedState, directions
const activePage = ref(true)
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

function toProvider(item: any) {
  if (item.maintained === '2')
    return
  router.push(`/group/provider/${item.id}?vid=${item.id}`)
}

watch(wrapper, () => {
  if (props.detail && wrapper) {
    const arr = props.detail.gameList?.map(item => item.list.length / (item.item_nums || 3))
    if (!arr)
      return
    const max = Math.max(...arr)
    maxLineLength.value = wrapper.value.offsetWidth * max
    wrapperWidth.value = wrapper.value.offsetWidth
  }
})

let timer: ReturnType<typeof setTimeout>
onActivated(() => {
  timer = setTimeout(() => {
    activePage.value = true
  }, 1000)
})

onDeactivated(() => {
  timer && clearTimeout(timer)
  activePage.value = false
  x.value = 0
})
</script>

<template>
  <div>
    <AppCasinoGamesTitle
      class="mb-[10px]" arrow :is-prev-aactive="isPrevAactive" :is-next-aactive="isNextAactive" :is-provider="isProvider"
      :title="detail.name" :total="detail.total" :path="detail?.path" :icon="detail.icon" @next="next" @prev="prev"
    />
    <div ref="wrapper" class="flex flex-col overflow-x-scroll overflow-y-hidden hide-scroll detail-wrapper">
      <div
        v-for="item, index in detail.gameList" :key="index" class="item-wrapper"
        :class="`cols-${item.item_nums}`"
      >
        <template v-if="isProvider">
          <AfunBaseImage v-for="game in item.list" :key="game.icon" is-network :url="game.icon" class="max-big  rounded-[8px] overflow-hidden cursor-pointer" @click="toProvider(game)" />
        </template>
        <template v-else>
          <AppCasinoGameItem v-for="game in item.list" v-show="activePage" :key="game.id" :data="game" :compress-image="compressImage" class=" max-big" />
          <AppCasinoGameItem v-for="game in item.list.slice(0, 4)" v-show="!activePage" :key="game.id" :data="game" :compress-image="compressImage" class=" max-big" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-wrapper {
  scroll-snap-type: x mandatory; //todo
  scroll-behavior: smooth;
  /* 平滑滚动（可选） */
}

.item-wrapper {
  display: grid;
  grid-auto-flow: column;
  margin-bottom: var(--ph-game-gap-y);

  &:last-child {
    margin-bottom: 0px;
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

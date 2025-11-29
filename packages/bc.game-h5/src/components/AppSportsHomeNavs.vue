<script setup lang='ts'>
import { BaseIcon } from '@tg/bccomponents'
import { useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

defineOptions({ name: 'AppSportsHomeNavs' })
defineProps<{
  modelValue?: string
}>()
const emit = defineEmits(['update:modelValue'])

const navRef = ref()
const { width } = useWindowSize()

const ballCount = computed(() => {
  const base = 332
  const step = 48

  if (width.value < base)
    return 0

  return 1 + Math.floor((width.value - base) / step)
})

const list1 = computed(() => {
  return [
    { name: 'home', icon: 'sports-home' },
    { name: 'live', icon: 'uni-live' },
    { name: 'fav', icon: 'uni-fav' },
    { name: 'record', icon: 'uni-record' },
  ]
})

function clickHandler(v: string) {
  emit('update:modelValue', v)
}
</script>

<template>
  <div ref="navRef" class="w-full h-[64px] flex items-center justify-between px-[8px] bg-[#323738]">
    <!-- 固定菜单 -->
    <div
      v-for="nav in list1" :key="nav.name"
      class="relative box-content w-[32px] h-[32px] p-[8px] flex items-center justify-center cursor-pointer"
      :class="{ 'active-nav': nav.name === modelValue }" @click="clickHandler(nav.name)"
    >
      <div class="text-[32px] flex items-center justify-center ">
        <BaseIcon :name="nav.icon" />
      </div>
    </div>
    <!-- 分割线 -->
    <div class="w-[6px] flex justify-center">
      <div class="w-[1px] h-[32px] bg-[#b3bec1]" />
    </div>
    <!-- 球种分类 -->
    <div v-for="i, ii in ballCount" :key="i" class="flex">
      <div
        class="relative box-content w-[32px] h-[32px] p-[8px] flex items-center justify-center cursor-pointer"
        @click="clickHandler('football')"
      >
        <div class="text-[32px] flex items-center justify-center">
          <BaseIcon name="sports-football" />
        </div>
      </div>
      <div v-if="ii === ballCount - 1 " class="relative box-content w-[16px] h-[32px] p-[8px] pl-0 flex items-center justify-center cursor-pointer">
        <div class="text-[16px] flex items-center justify-center">
          <BaseIcon name="uni-triangle" />
        </div>
      </div>
    </div>
    <div v-if="ballCount === 0" class="relative box-content w-[16px] h-[32px] p-[8px] pl-0 flex items-center justify-center cursor-pointer">
      <div class="text-[16px] flex items-center justify-center">
        <BaseIcon name="uni-triangle" />
      </div>
    </div>
    <!-- 搜索 -->
    <div
      class="relative box-content w-[32px] h-[32px] p-[8px] flex items-center justify-center cursor-pointer"
      @click="clickHandler('search')"
    >
      <div class="text-[32px] flex items-center justify-center">
        <BaseIcon name="uni-search" />
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.active-nav {
  --tg-base-icon-color: #24ee89;
}
</style>

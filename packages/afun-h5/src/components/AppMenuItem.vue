<script lang="ts" setup>
import type { MenuItem } from '@tg/types'
import { AfunBaseImage } from '@tg/bccomponents'
import { IconArrowRight } from '@tg/icons'
import { useAppStore } from '@tg/stores'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

interface Props {
  menuItem: MenuItem
  type?: 'radio'
  active?: boolean
  firstLevel?: boolean
  value?: string
  isOdds?: boolean
  isOddsSelected?: boolean
  isCurrentPath?: boolean
}
defineOptions({
  name: 'AppMenuItem',
})
const props = withDefaults(defineProps<Props>(), {})
const { showSideMenu, currentPath } = storeToRefs(useAppStore())
const isLogin = ref(true)
// const { isLogin } = storeToRefs(useAppStore())

function onMenuClick(menuItem: MenuItem) {
  menuItem?.callBack?.()
  if (!menuItem.children?.length && !props.isOdds) {
    showSideMenu.value = false
    setTimeout(() => currentPath.value = menuItem.title!)
  }
}

function getIcon(url: string) {
  return url.replace(/(_nav)?\.webp$/, '_sidebar.webp')
}
</script>

<template>
  <button class="transition-colors duration-150 gap-[8px] flex px-[12px] items-center w-full py-[8px] h-[46px] text-[#9DABC8]" :disabled="(menuItem.token && !isLogin) || (menuItem.sptToken && !isLogin)" :class="[menuItem.children?.length && 'border-b border-b-[#F5F5F5] py-[14px]', firstLevel && 'px-0! h-[49px]', isCurrentPath && 'bg-[#F23038] rounded-[8px] text-[#fff]']" @click="onMenuClick(menuItem)">
    <div v-if="menuItem.icon" class="flex center size-[20px]">
      <AfunBaseImage
        v-if="menuItem.useCloudImg"
        :make-image-white="isCurrentPath" :url="menuItem.noneImageReplace ? menuItem.icon : getIcon(menuItem.icon)" is-cloud
        class="icon-img size-[20px]"
      />
      <component :is="menuItem.icon" v-else class="text-[20px]" :class="menuItem.path === '/favourites' && 'text-[#fff]'" />
    </div>
    <span class="text-[14px] line-clamp-1 text-left font-[600] text-[#6D7693]" :class="[firstLevel && 'font-[600] text-[#0D2245]! mt-0!', isOddsSelected && 'text-[#F23038]', isCurrentPath && 'text-[#fff]!']">{{ menuItem.title || menuItem.label }}</span>
    <div class="flex-1" />
    <!-- <div v-if="menuItem.fixtureCount" class="badge-wrap">
      <BaseBadge :count="menuItem.fixtureCount" mode="active" :max="99999" />
    </div> -->
    <span v-if="menuItem.tailTitle" class="text-[14px] mr-[2px] font-[600] mt-[4px] whitespace-nowrap text-[#6D7693]">{{ menuItem.tailTitle }}</span>
    <AfunBaseImage
      v-if="menuItem.hot"
      url="/m/afun-h5/png/menu-hot.png"
      class="w-[44px] h-[19px] shrink-0"
    />
    <div v-if="menuItem.children?.length && !menuItem.hideArrow" class="shrink-0 text-[12px] bg-bg-black-5 rounded-[4px] flex justify-center items-center mt-[4px]">
      <IconArrowRight class="transform transition-transform duration-150" :class="{ 'rotate-90': active }" :style="{ '--color': '#9DABC9' }" />
    </div>
  </button>
</template>

<style scoped lang="scss">
  .disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>

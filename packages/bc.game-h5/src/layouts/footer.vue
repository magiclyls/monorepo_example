<script setup lang="ts">
import { BaseIcon } from '@tg/bccomponents'
import { useLocalRouter } from '@tg/shared-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const router = useLocalRouter()
const route = useRoute()
enum MENU {
  MENU = '/menu',
  SEARCH = '/search',
  CASINO = '/casino',
  SPORTS = '/sports',
  CHAT = '/chat',
}
const isRouteMenu = computed(() => route.path?.includes(MENU.MENU))
const isRouteSearch = computed(() => route.path?.includes(MENU.SEARCH))
const isRouteCasino = computed(() => route.path?.includes(MENU.CASINO))
const isRouteSports = computed(() => route.path?.includes(MENU.SPORTS))
const isChat = false/* computed(() => rightIsExpand.value
  && currentRightSidebarContent.value === EnumRightSidebarContent.CHATROOM,
) */
</script>

<template>
  <div style="height:var(--tg-footer-height)" class="tabbar fixed bottom-0 left-0 w-full bg-layer4 center rounded-t-2xl" @touchstart.stop @touchmove.stop.prevent>
    <button
      :class="{ active: isRouteMenu }"
      class="bar-item button flex h-full flex-1 flex-col items-center justify-center w-1/2 px-1 py-2"
      type="button" @click="router.push(MENU.MENU)"
    >
      <BaseIcon name="menu" />
      <p class="mt-0.5 font-extrabold text-secondary text-xs">
        選單
      </p>
    </button>
    <button
      :class="{ active: isRouteSearch }"
      class="bar-item  button flex h-full flex-1 flex-col items-center justify-center w-1/2 px-1 py-2" type="button"
      @click="router.push(MENU.SEARCH)"
    >
      <BaseIcon name="search-brand" />
      <p class="mt-0.5 font-extrabold text-secondary text-xs">
        探索
      </p>
    </button>
    <button :class="{ active: isRouteCasino }" class="bar-item button flex h-full flex-1 flex-col items-center justify-center w-1/2 px-1 py-2" type="button" @click="router.push(MENU.CASINO)">
      <BaseIcon name="casino" />
      <p class="mt-0.5 font-extrabold text-secondary text-xs">
        賭場
      </p>
    </button>
    <button :class="{ active: isRouteSports }" class="bar-item button flex h-full flex-1 flex-col items-center justify-center w-1/2 px-1 py-2" type="button" @click="router.push(MENU.SPORTS)">
      <BaseIcon name="sports" />
      <p class="mt-0.5 font-extrabold text-secondary text-xs">
        體育
      </p>
    </button>
    <button
      :class="{ active: isChat }" class="bar-item button flex h-full flex-1 flex-col items-center justify-center w-1/2 px-1 py-2" type="button"
      @click="router.push(MENU.CHAT)"
    >
      <BaseIcon name="chat" />
      <p class="mt-0.5 font-extrabold text-secondary text-xs">
        聊天
      </p>
    </button>
  </div>
</template>

<style lang="scss">
.bar-item {
  &.active {
    --tg-base-icon-color: var(--color-brand);
    p {
      color: var(--color-brand);
    }
  }
}
</style>

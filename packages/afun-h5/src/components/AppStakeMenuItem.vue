<script lang="ts" setup>
import type { MenuItem } from '@tg/types'
import { useNotificationState } from '@tg/hooks'
import { useAppStore, useWindowStore } from '@tg/stores'
import { replaceSportsPlatId } from '@tg/utils'
import { getLang } from '@tg/vue-i18n'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '~/stores/menu'
import { useSportsStore } from '~/stores/sports'
import AppImage from './AppImage.vue'
import BaseBadge from './BaseBadge.vue'

interface Props {
  menuItem: MenuItem
  type?: 'radio'
}
defineOptions({
  name: 'AppStakeMenuItem',
})
const props = withDefaults(defineProps<Props>(), {})

const { isLogin } = storeToRefs(useAppStore())
const { sideBigActiveMenu } = storeToRefs(useMenuStore())
const { isSportsLoginSusses } = storeToRefs(useSportsStore())
const { isMobile } = storeToRefs(useWindowStore())
const { showState } = useNotificationState()
const route = useRoute()

const active = computed(() => {
  const { path, promo_id } = props.menuItem
  if (route.path.includes('/sports/')) {
    return sideBigActiveMenu.value
      && props.menuItem.path && props.menuItem.path.length
      && replaceSportsPlatId(sideBigActiveMenu.value.toString())
      === replaceSportsPlatId(props.menuItem.path)
  }
  else if (props.menuItem.fullPath) {
    return route.fullPath.includes(props.menuItem.fullPath)
  }
  else if (route.path.includes('promotions/promotion/customize')) {
    const _path = `/${getLang()}${path}${promo_id ? `?pid=${promo_id}` : ''}`
    return _path === route.fullPath || _path === route.path
  }

  const _path = `/${getLang()}${path}`
  return _path === route.fullPath || _path === route.path
})
</script>

<template>
  <div
    class="tg-app-menu-item" :class="[menuItem.clazz]"
  >
    <div
      class="menu-item" :class="{ isMobile, active, disabled: (menuItem.token && !isLogin) || (menuItem.sptToken && !isSportsLoginSusses) }"
      style="--app-sport-image-error-icon-size:14px;"
    >
      <AppImage
        v-if="menuItem.useCloudImg" style="width: 18px;height: 18px;" :url="menuItem.icon" is-cloud with-theme
        class="icon-img"
      />
      <div v-else-if="menuItem.icon" class="relative flex">
        <component :is="menuItem.icon" class="text-[18px] text-[#B1BAD3]" />
        <div v-if="showState && menuItem.domId === 'notification'" class="bg-tg-primary-success border-tg-primary absolute right-[-2px] top-0 h-[8px] w-[8px] border-[1px] rounded-[50%] border-solid" />
      </div>
      <div class="menu-title">
        {{ menuItem.title }}
      </div>
      <div v-if="menuItem.fixtureCount" class="badge-wrap">
        <BaseBadge :count="menuItem.fixtureCount" mode="active" :max="99999" />
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --app-menu-item-text-color: #fff;
  --app-menu-item-text-active-color: #fff;
  --app-menu-item-active-bg: #2f4553;
  --app-menu-item-icon-active-color: #fff;
  --app-menu-item-icon-brightness: 2;
}
</style>

<style lang="scss" scoped>
.tg-app-menu-item {
  &.has-line {
    border-top: 2px solid #2f4553;
  }

  .menu-item {
    cursor: pointer;
    display: flex;
    white-space: nowrap;
    align-items: center;
    // gap: var(--tg-spacing-8);
    height: 48px;
    padding: 12rem 16rem;
    border-radius: 4rem;
    font-size: 14px;
    font-weight: 600;
    color: var(--app-menu-item-text-color);
    transition: background-color 0.2s;
    width: 100%;
    transform: none !important;
    background-color: transparent;
    overflow: hidden;
    line-height: 21rem;
    &:hover:not(.disabled, .isMobile),
    &.active:not(.disabled) {
      background-color: var(--app-menu-item-active-bg);
      --tg-icon-color: var(--app-menu-item-icon-active-color);
      color: var(--app-menu-item-text-active-color);
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .menu-title {
      flex: 1;
      width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .badge-wrap {
      margin-left: auto;
      --tg-badge-font-size: 12px;
      --tg-badge-padding-x: 6rem;
    }
  }
}
</style>

<style lang="scss" scoped>
// @supports (not (gap: 1px)) {
.tg-app-menu-item {
  .menu-item {
    .menu-title {
      margin-left: 8rem;
      margin-right: 8rem;
    }
  }
}
// }
</style>

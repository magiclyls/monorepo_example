<script lang="ts" setup>
import type { MenuItem } from '~/composables/useApiMenuData'

interface Props {
  menuItem: MenuItem
  type?: 'radio'
}
defineOptions({
  name: 'AppMenuItem',
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
    const _path = `/${getCurrentUrlLanguage()}${path}${promo_id ? `?pid=${promo_id}` : ''}`
    return _path === route.fullPath || _path === route.path
  }

  const _path = `/${getCurrentUrlLanguage()}${path}`
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
        v-if="menuItem.useCloudImg" style="width: 14px;height: 14px;" :url="menuItem.icon" is-cloud with-theme
        class="icon-img"
      />
      <div v-else-if="menuItem.icon" class="relative flex">
        <component :is="menuItem.icon" />
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
  --app-menu-item-text-color: var(--tg-text-white);
  --app-menu-item-text-active-color: var(--tg-text-white);
  --app-menu-item-active-bg: var(--tg-secondary-main);
  --app-menu-item-icon-active-color: var(--tg-text-white);
  --app-menu-item-icon-brightness: 2;
}

[theme="green"] {
  --app-menu-item-text-color: var(--tg-text-white);
  --app-menu-item-text-active-color: #fff;
  --app-menu-item-active-bg: #197B59;
  --app-menu-item-icon-active-color: #fff;
  --app-menu-item-icon-brightness: 1;
}

[theme="greenblack"] {
  --app-menu-item-text-color: var(--tg-text-white);
  --app-menu-item-text-active-color: var(--tg-text-greenblack-main);
  --app-menu-item-active-bg: var(--tg-secondary-main);
  --app-menu-item-icon-active-color: var(--tg-text-greenblack-main);
  --app-menu-item-icon-brightness: 1;
}

[theme="white"] {
  --app-menu-item-active-bg: var(--tg-white-primary-active-bg);
  --app-menu-item-icon-brightness: 0.5;
}
</style>

<style lang="scss" scoped>
.tg-app-menu-item {
  &.has-line {
    border-top: 2px solid var(--tg-secondary-main);
  }

  .menu-item {
    cursor: pointer;
    display: flex;
    white-space: nowrap;
    align-items: center;
    // gap: var(--tg-spacing-8);
    height: 45px;
    padding: var(--tg-spacing-12) var(--tg-spacing-16);
    border-radius: var(--tg-radius-default);
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);
    color: var(--app-menu-item-text-color);
    transition: background-color 0.2s;
    width: 100%;
    transform: none !important;
    background-color: transparent;
    overflow: hidden;
    line-height: var(--tg-spacing-21);
    &:hover:not(.disabled,.isMobile),
    &.active:not(.disabled) {
      background-color: var(--app-menu-item-active-bg);
      --tg-icon-color: var(--app-menu-item-icon-active-color);
      color: var(--app-menu-item-text-active-color);
      .icon-img {
        // filter: brightness(var(--app-menu-item-icon-brightness));
        @include webTheme('green'){
          // filter: brightness(2);
        }
      }

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
      --tg-badge-font-size: var(--tg-font-size-xs);
      --tg-badge-padding-x: var(--tg-spacing-6);
    }
  }
}
</style>

<style lang="scss" scoped>
// @supports (not (gap: 1px)) {
  .tg-app-menu-item {
    .menu-item {
      .menu-title {
        margin-left:  var(--tg-spacing-8);
        margin-right:  var(--tg-spacing-8);
      }
    }
  }
// }
</style>

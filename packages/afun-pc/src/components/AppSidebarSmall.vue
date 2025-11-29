<script lang="ts" setup name="app-sidebar-small">
import { IconUniArrowRight } from '@tg/icons'
import type { MenuItem } from '~/composables/useApiMenuData'

interface Props {
  isSwitching?: boolean
}
defineOptions({
  name: 'AppSidebarSmall',
})
withDefaults(defineProps<Props>(), {})

const route = useRoute()
const { t } = useI18n()
const { isLogin } = storeToRefs(useAppStore())
const { isSidebarHasProvider, casinoGameProvider } = storeToRefs(useCasinoStore())
const { isSportsLoginSusses } = storeToRefs(useSportsStore())
const {
  casinoMenu,
  casinoGameList,
  staticMenu1,
  staticMenu2,
  menuItemClick,
} = useApiMenuData()
const {
  sportOddType,
  sportsMenu,
  sportHotGames,
  sportGameList,
} = storeToRefs(useSportsStore())
const { openLoginDialog } = useLoginDialog()

const isCasino = computed(() => route.name?.toString().includes('casino'))
const isSports = computed(() => route.name?.toString().includes('sports'))
const menuData = computed(() => {
  if (isCasino.value) {
    return [
      casinoMenu,
      casinoGameList,
      casinoGameProvider,
      staticMenu1,
      staticMenu2,
    ]
  }
  else if (isSports.value) {
    return [
      sportsMenu,
      sportHotGames,
      sportGameList,
      sportOddType,
      staticMenu1,
      staticMenu2,
    ]
  }
  return [
    staticMenu1,
    staticMenu2,
  ]
})

function itemClick(item: MenuItem) {
  if ((item.token && !isLogin.value) || (item.sptToken && !isSportsLoginSusses.value)) {
    openLoginDialog()
    return
  }

  menuItemClick(item)
}
</script>

<template>
  <section class="tg-app-sidebar-small">
    <template v-for="menu, idx in menuData" :key="idx">
      <ul v-if="menu.value" v-show="menu.value[0]?.title !== t('casino_provider')
        || (menu.value[0]?.title === t('casino_provider') && isSidebarHasProvider)"
        class="tiny-menu flex-col-center">
        <template v-for="menuitem in menu.value" :key="menuitem.title">
          <li v-if="menuitem" class="flex-col-center tiny-menu-item" :class="{
            active: $route.fullPath === `/${getCurrentUrlLanguage()}${menuitem.path}` || $route.path === `/${getCurrentUrlLanguage()}${menuitem.path}`,
            disabled: (menuitem.sptToken && !isSportsLoginSusses),
          }">
            <VTooltip placement="top">
              <div class="trigger" style="--app-sport-image-error-icon-size:20px;" @click="itemClick(menuitem)">
                <AppImage v-if="menuitem.useCloudImg" style="width: 20px;height: 20px;" :url="menuitem.icon" is-cloud
                  with-theme class="icon-img" />
                <component v-else :is="menuitem.icon" style="font-size: 20px;" />
                <div v-if="menuitem && menuitem.list && menuitem.list.length" class="flex-col-center arrow-right">
                  <IconUniArrowRight />
                </div>
              </div>
              <template #popper>
                <div class="tiny-menu-item-title">
                  {{ menuitem.title }}
                </div>
              </template>
            </VTooltip>
          </li>
        </template>
      </ul>
    </template>
  </section>
</template>

<style>
:root {
  --app-sidebar-small-brightness: 2;
}

[theme="white"] {
  --app-sidebar-small-brightness: 1;
}
</style>

<style lang="scss" scoped>
.flex-col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.tg-app-sidebar-small {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: var(--tg-spacing-12);
  padding-left: var(--tg-spacing-6);
  overflow: hidden;

  .tiny-menu {
    width: 48px;
    border-radius: var(--tg-radius-default);
    background: var(--tg-primary-main);
    padding: 4px 0px;

    @include webTheme('green') {
      background-color: #076237;
    }

    cursor: pointer;

    .tiny-menu-item {
      position: relative;
      font-size: var(--tg-font-size-default);
      width: 40px;
      height: 40px;

      &:hover,
      &.active {
        background: var(--tg-secondary-grey);
        border-radius: var(--tg-radius-default);
        --tg-icon-color: var(--tg-text-white);

        .icon-img {

          // filter: brightness(var(--app-sidebar-small-brightness));
          @include webTheme('green') {
            filter: 2;
          }
        }

        @include webTheme('white') {
          background: transparent;
          --tg-icon-color: #F2CA5C;
        }

        svg {
          @include webTheme('green') {
            --tg-icon-color: #fff;
          }
        }
      }

      &.disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      >.v-popper,
      .trigger {
        width: 100%;
        height: 100%;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        @include webTheme('green') {
          --tg-icon-color: #5ECEA6;
        }
      }

      .arrow-right {
        position: absolute;
        right: 0px;
        font-size: 10px;
        width: 14px;
      }
    }
  }
}
</style>

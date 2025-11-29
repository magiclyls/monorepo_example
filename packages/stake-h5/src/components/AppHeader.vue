<script lang="ts" setup>
import { IconNavbarUser, IconNavbarNotice, IconHeaderNews, IconUniMenu, IconUniSearch } from '@tg/icons'
import { ApiGameRecycle } from '@tg/apis'
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppHeader',
})
const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const { isMobile, appContentWidth } = storeToRefs(useWindowStore())
const { rightIsExpand, currentRightSidebarContent } = useRightSidebar()
const { triggerLeftSidebar } = useLeftSidebar()
const { bool: showSearchBar, setTrue } = useBoolean(false)
const { showState } = useNotificationState()
const logoRef = ref<HTMLElement>()
const logoInitWidth = ref(0)
const { width: logoWidth } = useElementSize(logoRef)
const { logoAndIcoAndLoading } = storeToRefs(useAppStore())
const userMenuStore = useUserMenuStore()
const { userMenu } = storeToRefs(userMenuStore)

// 原始图片宽高
const originalLogo = reactive({
  width: 0,
  height: 0,
})

const newsMenu = computed(() => ([
  // {
  //   id: 1,
  //   icon: 'chess-discuss',
  //   title: t('chat_room'),
  //   name: 'chat-room',
  //   shown: EnumRightSidebarContent.CHATROOM,
  // },
  {

    id: 2,
    icon: 'spt-user-bet',
    title: t('bet_slip'),
    name: 'bet-slip',
    shown: EnumRightSidebarContent.BETTING,
  },
]))

// 选中状态
const getActiveState = computed(() => {
  return (path: string | undefined, name: string) => path
    ? route.path.includes(name)
    : false
})
const getActiveShown = computed(() => {
  return (shown: string) => rightIsExpand.value
    && shown === currentRightSidebarContent.value
})
const isUseSmallLogo = computed(() => {
  return logoWidth.value < calculateWidth(22, originalLogo.width, originalLogo.height) && isLogin.value
})

function onLogoLoaded(w: number) {
  if (logoInitWidth.value === 0)
    logoInitWidth.value = w
}

function calculateWidth(height: number, aspectRatioWidth: number, aspectRatioHeight: number) {
  return height * (aspectRatioWidth / aspectRatioHeight)
}

function getWihteLogoWidth() {
  const { VITE_CASINO_IMG_CLOUD_URL } = getEnv()
  const url = isLogin.value ? logoAndIcoAndLoading.value.after_login : logoAndIcoAndLoading.value.logo_white
  if (!url)
    return

  const img = new Image()
  img.src = `${VITE_CASINO_IMG_CLOUD_URL}/${url}`
  img.onload = () => {
    originalLogo.width = img.width
    originalLogo.height = img.height
  }
}

const { runAsync: runRecycle } = useRequest(ApiGameRecycle, {
  ready: isLogin,
  manual: true,
  debounceInterval: 3000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
})

function logoClick() {
  runRecycle()
}

watch([() => logoAndIcoAndLoading.value, isLogin], () => {
  if (logoAndIcoAndLoading.value.logo_white && logoAndIcoAndLoading.value.after_login)
    getWihteLogoWidth()
}, { immediate: true })
</script>

<template>
  <div
    class="app-header"
    :class="{ 'mobile': isMobile, 'right-expand': rightIsExpand }"
    :style="{ 'grid-template-columns': isLogin ? '1fr auto 1fr' : 'auto auto' }"
    @touchstart.stop @touchmove.stop.prevent
  >
    <div class="flex items-center gap-[15px]">
      <div v-if="isMobile" class="flex-shrink-0" @click="triggerLeftSidebar">
        <IconUniMenu />
      </div>
      <BaseLogo ref="logoRef" class="grow" :use-small="isUseSmallLogo" :is-back="false" :static="false" @load-img="onLogoLoaded" @click="logoClick" />
    </div>

    <AppWallet v-if="isLogin" popper-clazz="app-h-wallet" />
    <div v-if="isLogin" class="header-box">
      <div class="header-right">
        <BaseButton
          v-show="!isMobile"
          type="text"
          class="search-btn"
          @click="setTrue"
        >
          <IconUniSearch />
          <span v-show="appContentWidth > 606">{{ t('header_search') }}</span>
        </BaseButton>
        <VDropdown :distance="6" strategy="fixed">
          <BaseButton type="text">
            <IconNavbarUser />
          </BaseButton>
          <template #popper="{ hide }">
            <div class="dropdown-popper need-pad-y" :class="[isStyle2() ? 'user-menu-style2' : '']">
              <div
                v-for="item of userMenu" :key="item.id" class="menu-item"
                :class="{ 'active-menu': getActiveState(item.path, item.name) }"
                @click=" hide(); userMenuStore.handleClickMenuItem(item)"
              >
                <div class="menu-btn">
                  <component
                    class="icon-size"
                    :style="{
                      '--tg-icon-color':
                        getActiveState(item.path, item.name) ? 'var(--tg-pop-usermenu-item-actvie-color)' : '',
                    }"
                    :is="item.icon" />
                  <span>{{ item.title }}</span>
                </div>
              </div>
            </div>
          </template>
        </VDropdown>
        <BaseButton
          v-if="!isMobile"
          type="text"
          @click="userMenuStore.handleClickMenuItem({ name: 'notification' })"
        >
          <IconNavbarNotice class="icon-size" />
          <div v-show="showState" class="dot-state" />
        </BaseButton>
        <VDropdown :distance="6">
          <BaseButton v-show="!isMobile" type="text">
            <IconHeaderNews class="icon-size" />
          </BaseButton>
          <template #popper="{ hide }">
            <div class="dropdown-popper need-pad-y" :class="[isStyle2() ? 'user-menu-style2' : '']">
              <div
                v-for="item of newsMenu" :key="item.id" class="menu-item"
                :class="{ 'active-menu': getActiveShown(item.shown) }"
                @click="hide(); userMenuStore.handleClickMenuItem(item)"
              >
                <div class="menu-btn">
                  <component class="icon-size" :is="item.icon" />
                  <span>{{ item.title }}</span>
                </div>
              </div>
            </div>
          </template>
        </VDropdown>
      </div>
      <AppGlobalSearch
        v-if="showSearchBar && !isMobile"
        auto-focus @close="() => showSearchBar = false"
      />
    </div>
    <div v-else class="header-login">
      <AppLoginRegisterBtns />
    </div>
  </div>
</template>

<style>
.app-h-wallet {
  --tg-app-select-currency-poptop-width: 207.5px;
}
:root {
  --tg-pop-usermenu-item-actvie-color: var(--tg-popper-active-text-color);
}
</style>

<style lang="scss" scoped>
.app-header {
  display: grid;
  gap: 3%;
  align-items: center;
  position: relative;
  &.mobile.right-expand::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
  }

  .header-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .header-right {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: nowrap;
    --tg-icon-color: var(--tg-text-white);
    @include webTheme('green') {
      --tg-icon-color: var(--tg-svg-default-color);
    }
    span {
      margin-left: 8px;
      font-size: var(--tg-font-size-default);
    }

    .search-btn {
      color: var(--tg-text-white);
      font-size: var(--tg-font-size-default);
      font-weight: var(--tg-font-weight-semibold);
      @include webTheme('green') {
        //不能给白色文字变量换色  只有这里白色换绿色
        color: var(--tg-text-green-sub);
      }
    }
  }
  .header-login {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: var(--tg-text-white);
    text-align: center;
    font-size: var(--tg-font-size-default);
    font-style: normal;
    font-weight: 600;
  }
  .dot-state {
    height: 8px;
    width: 8px;
    background: var(--tg-dot-state-bg);
    border-radius: 50%;
    position: absolute;
    transform: translate(5px, -4px);
    border: 1px solid var(--tg-primary-main);
  }
}

.dropdown-popper {
  --tg-icon-color: var(--tg-popper-color-default);
  color: var(--tg-popper-color-default);
  font-size: var(--tg-font-size-default);
  font-weight: var(--tg-font-weight-semibold);

  .icon-size {
    font-size: var(--tg-font-size-default);
    margin-right: var(--tg-spacing-8);
  }

  .menu-item {
    cursor: pointer;

    &:hover {
      background-color: var(--tg-popper-hover-bg);
    }
    &.active-menu {
      --tg-icon-color: var(--tg-popper-active-text-color);
      color: var(--tg-popper-active-text-color);
      .menu-btn {
        --tg-icon-color: var(--tg-popper-active-text-color);
        color: var(--tg-popper-active-text-color);
      }

      &:hover {
        background: 0 0;
      }
    }
    .menu-btn {
      display: flex;
      align-items: center;
      color: var(--tg-popper-color-default);
      --tg-icon-color: var(--tg-popper-color-default);
      padding: 12px 12px;
      padding-right: 22px;
      transition: color 0.2s ease;
      &:active {
        transform: scale(0.95);
      }
    }
  }
  &.user-menu-style2 {
    .menu-item {
      &.active-menu {
        position: relative;
        background-color: var(--tg-popper-active-bg);
        --tg-icon-color: var(--tg-popper-color-default);
        color: var(--tg-popper-color-default);
        --tg-pop-usermenu-item-actvie-color: var(--tg-popper-color-default);
        .menu-btn {
          --tg-icon-color: var(--tg-popper-color-default);
          color: var(--tg-popper-color-default);
        }

        &:hover {
          background: 0 0;
        }
        &::before {
          content: '';
          position: absolute;
          width: 4px;
          height: 100%;
          background-color: var(--tg-border-blue);
          left: 0;
          top: 0;
        }
      }
    }
  }
}
</style>

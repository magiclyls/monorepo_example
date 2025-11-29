<script lang="ts" setup>
import { IconNavbarUser, IconHeaderBack, IconNavbarNotice, IconUniMenu } from '@tg/icons'
import { ApiGameRecycle } from '@tg/apis'
import { getEnv } from '@tg/utils';

defineOptions({
  name: 'AppHeaderH5',
})
const { t } = useI18n()
const router = useLocalRouter()
const route = useRoute()
const appStore = useAppStore()
const { isLogin, theme } = storeToRefs(appStore)
const { isMobile } = storeToRefs(useWindowStore())
const { rightIsExpand, currentRightSidebarContent } = useRightSidebar()
const { triggerLeftSidebar } = useLeftSidebar()
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

// 监听钱包宽度
const AppWalletRef = ref()
const { width: AppWalletWidth } = useElementSize(AppWalletRef)
const isShowSmallLogo = computed(() => {
  if (AppWalletWidth.value > 200)
    return true
  else
    return false
})
const isFristLevelPage = computed(() => {
  const lastPath = route.path.split('/').slice(-1)[0]
  return lastPath === getSportsPlatId() || lastPath === 'casino'
})

const newsMenu = computed(() => ([
  {
    id: 1,
    icon: 'chess-discuss',
    title: t('chat_room'),
    name: 'chat-room',
    shown: EnumRightSidebarContent.CHATROOM,
  },
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
  return logoWidth.value < Math.floor(calculateWidth(22, originalLogo.width, originalLogo.height)) && isLogin.value
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

function backIfLocal() {
  const backurl = Local.get(STORAGE_BACK_URL)?.value as any
  router.back()
  if (backurl)
    router.replace(backurl)
}

watch([() => logoAndIcoAndLoading.value, isLogin], () => {
  if (logoAndIcoAndLoading.value.logo_white && logoAndIcoAndLoading.value.after_login)
    getWihteLogoWidth()
}, { immediate: true })
</script>

<template>
  <div
    class="app-header"
    :class="{ mobile: isMobile }"
    @touchstart.stop @touchmove.stop.prevent
  >
    <div class="flex grow items-center">
      <BaseLogo v-if="isFristLevelPage" ref="logoRef" :small-logo="isShowSmallLogo" class="grow" :use-small="isUseSmallLogo" :is-back="false" :static="false" @load-img="onLogoLoaded" @click="logoClick" />
      <BaseButton
        v-if="!isFristLevelPage" type="text" size="none" style="padding: 14px 30px 14px 0;"
        @click="backIfLocal"
      >
        <IconHeaderBack
          style="font-size: 18px"
          class="arrow-left"
        />
      </BaseButton>
    </div>
    <AppWallet v-if="isLogin" ref="AppWalletRef" popper-clazz="app-h-wallet" />
    <div class="flex items-center">
      <div v-if="isLogin" class="header-box">
        <div class="header-right">
          <VDropdown :distance="6" strategy="fixed">
            <BaseButton type="text" custom-padding style="--tg-base-button-padding-x: 12px;">
              <IconNavbarUser class="icon-size" />
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
                        color:
                          getActiveState(item.path, item.name) ? 'var(--tg-pop-usermenu-item-actvie-color)'
                          : theme === 'green' ? 'var(--tg-popper-color-default)' : 'inherit',
                      }"
                      :is="item.icon"
                    />
                    <span>{{ item.title }}</span>
                  </div>
                </div>
              </div>
            </template>
          </VDropdown>
          <VDropdown :distance="6">
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
      </div>
      <BaseButton
        v-if="isLogin" type="text" custom-padding style="--tg-base-button-padding-x: 12px;"
        class="theme-navbar-notice" @click="userMenuStore.handleClickMenuItem({ name: 'notification' })"
      >
        <IconNavbarNotice class="icon-size" />
        <div v-show="showState" class="dot-state" />
      </BaseButton>
      <div v-else class="header-login">
        <AppLoginRegisterBtns />
      </div>
      <div class="theme-menu flex-shrink-0" :class="[isLogin ? 'ml-[10px]' : 'ml-[20px]']" @click="triggerLeftSidebar">
        <IconUniMenu />
      </div>
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
.theme-menu,
.theme-navbar-notice {
  @include webTheme('white') {
    --tg-icon-color: #111111;
    --tg-dot-state-bg: #ff0004;
  }
}
.app-header {
  .arrow-left {
    @include webTheme('green') {
      --tg-icon-color: #76f0c5;
    }
  }
  display: flex;
  // gap: 3%;
  align-items: center;
  justify-content: space-between;
  position: relative;
  --tg-icon-color: var(--tg-text-white);
  @include webTheme('green') {
    --tg-icon-color: var(--tg-svg-default-color);
  }
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
    @include webTheme('white') {
      --tg-icon-color: #111111;
    }

    span {
      margin-left: 8px;
      font-size: var(--tg-font-size-default);
    }

    .search-btn {
      color: var(--tg-text-white);
      font-size: var(--tg-font-size-default);
      font-weight: var(--tg-font-weight-semibold);
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
      @include webTheme('white') {
        background-color: #f2ca5c;
      }
    }
    &.active-menu {
      --tg-icon-color: var(--tg-popper-active-text-color);
      color: var(--tg-popper-active-text-color);
      .menu-btn {
        --tg-icon-color: var(--tg-popper-active-text-color);
        color: var(--tg-popper-active-text-color);
        @include webTheme('white') {
          --tg-popper-active-text-color: #f2ca5c;
          color: #f2ca5c;
        }
        @include webTheme('green') {
          --tg-pop-usermenu-item-actvie-color: #5ecea6;
          --tg-icon-color: #5ecea6;
          color: #5ecea6;
        }
      }

      &:hover {
        background: 0 0;
        @include webTheme('white') {
          background: 0 0;
        }
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
      @include webTheme('white') {
        color: #111111;
        --tg-icon-color: #111111;
      }
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

<style lang="scss" scoped>
// @supports (not (gap: 1px)) {
.app-header {
  .app-wallet {
    margin-left: 3%;
    margin-right: 3%;
  }
}
// }
</style>

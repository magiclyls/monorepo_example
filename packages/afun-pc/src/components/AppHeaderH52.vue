<script lang="ts" setup>
import { IconNavbarUser, IconNavbarNotice, IconUniMenu2, IconHeaderBack } from '@tg/icons'
import { ApiGameRecycle } from '@tg/apis'

defineOptions({
  name: 'AppHeaderH52',
})
const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()
const { isLogin, theme } = storeToRefs(appStore)
const { rightIsExpand, currentRightSidebarContent } = useRightSidebar()
const { triggerLeftSidebar } = useLeftSidebar()
const { notificationsCount } = useNotificationState()
const logoRef = ref<HTMLElement>()
const logoInitWidth = ref(0)
const { width: logoWidth } = useElementSize(logoRef)
const { logoAndIcoAndLoading } = storeToRefs(useAppStore())
const userMenuStore = useUserMenuStore()
const { userMenu } = storeToRefs(userMenuStore)
const { back, replace } = useLocalRouter()

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

const countTotal = computed(() => {
  return Number(notificationsCount.value?.notification_count || 0) + Number(notificationsCount.value?.station_count || 0) + Number(notificationsCount.value?.notice_count || 0) + Number(notificationsCount.value?.reward_count || 0)
})
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
const isUseSmallLogo = ref(false)

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
function backIfLocal() {
  const backurl = Local.get(STORAGE_BACK_URL)?.value as any
  back()
  if (backurl)
    replace(backurl)
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

watch([logoWidth], ([w]) => {
  if (w > 20) {
    const r = w < Math.floor(calculateWidth(20, originalLogo.width, originalLogo.height)) && isLogin.value
    isUseSmallLogo.value = r
  }
})
</script>

<template>
  <div
    class="app-header flex items-center justify-between"
    @touchstart.stop @touchmove.stop.prevent
  >
    <div class="flex items-center pr-[10px]">
      <BaseButton
        v-if="$route.meta.homeHeaderBack"
        type="text" size="none" style="padding: 14px 30px 14px 0;"
        @click="backIfLocal"
      >
        <IconHeaderBack
          style="font-size: 18px"
          class="arrow-left"
        />
      </BaseButton>
      <BaseLogo v-else ref="logoRef" :origin-height="20" :small-logo="false" class="grow" :use-small="isUseSmallLogo" :is-back="false" :static="false" @load-img="onLogoLoaded" @click="logoClick" />
    </div>
    <AppWalletH5 v-if="isLogin" ref="AppWalletRef" popper-clazz="app-h-wallet" />
    <div v-if="isLogin" class="flex items-center">
      <div class="header-right flex items-center">
        <VDropdown :distance="6" strategy="fixed">
          <BaseButton type="text" custom-padding style="--tg-base-button-padding-x: 10px;--tg-base-button-padding-y: 10px;">
            <IconNavbarUser class="icon-size"/>
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
      <div class="relative">
        <BaseButton
          type="text" custom-padding style="--tg-base-button-padding-x: 10px;--tg-base-button-padding-y: 10px;"
          class="theme-navbar-notice" @click="userMenuStore.handleClickMenuItem({ name: 'notification' })"
        >
          <IconNavbarNotice class="icon-size" />
        </BaseButton>
        <div v-if="countTotal > 0" class="dot-tip absolute left-[17px] top-[-1px] z-[1]">
          <BaseBadge
            class="state-text" :max="99"
            :count="countTotal" mode="red"
          />
        </div>
      </div>

      <div class="ml-[10px] flex items-center" @click="triggerLeftSidebar">
        <IconUniMenu2 class="theme-logo" />
      </div>
    </div>
    <div v-else class="flex">
      <AppLoginRegisterBtnsH5 />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.arrow-left {
  color: var(--tg-text-white);
  @include webTheme('green') {
    color: #5ecea6;
  }
}
.app-wallet {
  flex: 1;
}
.dot-tip {
  --tg-badge-line-height: 14px;
  --tg-badge-padding-x: 2px;
  --tg-badge-min-width: 19px;
}
.theme-navbar-notice {
  --tg-base-button-font-size: 14px;
  .icon-size {
    --tg-icon-color: var(--tg-text-white);
  }
}
.theme-logo {
  --tg-icon-color: var(--tg-text-white);
  font-size: 16px;
}
.header-right {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  --tg-icon-color: var(--tg-text-white);
  --tg-base-button-font-size: 14px;

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

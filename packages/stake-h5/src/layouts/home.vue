<script lang="ts" setup>
defineOptions({
  name: 'HomeLayout',
})
/**
 * 左侧缩小版 Slider
      固定宽度 >768 显示
      <768 直接隐藏
    左侧放大版 Slider
      <768 全屏显示，高度-header高度和footer高度
      固定宽度 768-1200 显示(定位+蒙层)
      1200以上显示在左侧

    右侧 Slider
      < 768 全屏 - footer高度
      768-1000 显示 320
      1000 以上显示 370

        包含聊天室
        投注单
 */
const windowStore = useWindowStore()
const {
  isLessThanSm,
  isLessThanLg,
  isGreaterThanSm,
  isMobile,
  bodyWidth,
  rightWidth,
  isInterestTreasure,
} = storeToRefs(windowStore)
const { getSuspenseStatus } = useLayoutAnimate({ aniSuspense: true })
const route = useRoute()
const sportsNotify = new SportsNotify(socketClient)
const appStore = useAppStore()
const { mqttIsConnected, isLogin } = storeToRefs(appStore)
const { serviceState } = useService()
const downloadStore = useDownloadStore()
const { isShowPwaHasC } = storeToRefs(downloadStore)
const languageStore = useLanguageStore()
const { userLanguage } = storeToRefs(languageStore)
// 内容区宽度
const homeContainerRef = ref<HTMLElement>()
const { width } = useElementSize(homeContainerRef)
const tgMainContentRef = ref<HTMLElement>()
const { width: tgMainCOntentWidth } = useElementSize(tgMainContentRef)
const { leftIsExpand, isSwitching, switchTo, triggerLeftSidebar } = useLeftSidebar()
const { rightIsExpand, rightContainerIs0, currentRightSidebarContent } = useRightSidebar()
const { keepAliveList } = useKeepAliveStore()
const { isShowFooterState } = useGlobalStateShowFooter()

const showH5Service = ref(true)

// home-overlay 是否显示
const homeOverlayIsShow = computed(() => {
  return leftIsExpand.value && isLessThanLg.value && !isMobile.value
})

const showFooter = computed(() => {
  if (isMobile.value) {
    // console.log('🚸🚸🚸 ~ showFooter ', route.name?.toString())
    return !route.name?.toString().includes('casino-games')
  && !route.name?.toString().includes('casino-original-game')
  && !route.name?.toString().includes('rebate-detail')
  && !route.name?.toString().includes('invite-friends-record')
  && !route.name?.toString().includes('affiliate')
  && !route.name?.toString().includes('vip-receive')
  && !route.name?.toString().includes('vip-day-salary')
  && !route.name?.toString().includes('vip-vip-bonus')
  && !route.name?.toString().includes('vip-club')
  && !route.name?.toString().includes('rebate-center')
  && (route.name?.toString() === 'lang-promotion' && isShowFooterState.value)
  }
  return true
})
const showSportsFloatingBetSlip = computed(() => {
  if (isMobile.value)
    return route.name?.toString().includes('sports') && !route.path?.toString().includes(`/sports/${getSportsPlatId()}/my-bets`)
  return false
})
const isHome = computed(() => route.name === 'casino-home' || route.path === '/')
const showServiceFloat = computed(() => isHome.value && isShowServiceFloatSites())
const isOpenSerivce = computed(() => currentRightSidebarContent.value === EnumRightSidebarContent.SERVICE && isMobile.value)

const headerHeight = computed(() => {
  if (isShowPwaHasC.value && isMobile.value)
    return 106
  else
    return 60
})
const paddingTop = computed(() => {
  if (isFlutterApp())
    return 0
  if (isShowPwaHasC.value && isMobile.value)
    return 106
  else if (isMobile.value && !isFlutterApp())
    return 60
  else
    return 0
})

function suspenseResolved() {
  getSuspenseStatus('suspense-resolved')
  appStore.setIsAppFirstLoadFinish()
}

watch(() => width.value, (newWidth) => {
  windowStore.setAppContentWidth(newWidth)
})

watch(() => tgMainCOntentWidth.value, () => {
  if (homeContainerRef.value)
    windowStore.setAppContentOffsetLeft(getElementLeftOffset(homeContainerRef.value))
})

// 同时监听 route.path和mqttIsConnected
watch(
  [() => route.path, () => mqttIsConnected.value],
  ([newPath, newMqttIsConnected]) => {
    if (newMqttIsConnected) {
      if (newPath.includes('sports')) {
        sportsNotify.startCountdown()
        if (!sportsNotify.isSubscribed)
          sportsNotify.subscribe()
      }
      else {
        sportsNotify.stopCountdown()
        if (sportsNotify.isSubscribed)
          sportsNotify.unsubscribe()
      }
    }
  },
  { immediate: true },
)

const { lockScroll } = useScrollPrevent()

watch(leftIsExpand, (val) => {
  if (val) {
    setTimeout(() => {
      const allScrollyEl = document.querySelectorAll('.big-side.left-sidebar .scroll-y')
      lockScroll(allScrollyEl)
    }, 300)
  }
})

onBeforeUnmount(() => {
  sportsNotify.unsubscribe()
})

onMounted(() => {
  if (leftIsExpand.value) {
    setTimeout(() => {
      const allScrollyEl = document.querySelectorAll('.big-side.left-sidebar .scroll-y')
      lockScroll(allScrollyEl)
    }, 300)
  }
})

onErrorCaptured((err, instance, info) => {
  console.error('发生错误: \n Error', err, '\n', 'Instance: ', instance, '\n', 'Info:', info)
  return false
})
</script>

<template>
  <main
    id="tgOuterWrapMain"
    class="wrap"
    :class="{ 'is-switching': isSwitching, 'not-mobile': !isMobile, 'scroll-y': isMobile && isSafari }"
    :style="{
      '--width': rightWidth,
    }"
  >
    <div v-if="isMobile && isSafari" id="tgTopForScroll" class="h-[0px] w-full" />
    <div v-if="homeOverlayIsShow" class="home-overlay" @click="triggerLeftSidebar" />
    <div
      class="side-bar-outer"
      :style="{
        '--mobile-width': `${bodyWidth}px`,
      }"
    >
      <div v-if="isLessThanLg && isGreaterThanSm" class="small-size-padding" />
      <Transition :name="isMobile ? 'casino-sport-fade-top' : 'bigslide-fade-left'">
        <div
          v-if="leftIsExpand || isSwitching" class="big-side left-sidebar"
          style="--width: var(--tg-sidebar-width-lg)" :style="isMobile ? {
            top: `${headerHeight - 1}px`,
            height: `calc(100% - ${headerHeight - 1}px - var(--tg-footerbar-height) + 1px)`,
          } : {}"
          :class="{
            'fixed-small': isGreaterThanSm,
            'fixed': isLessThanLg,
            'full-screen': isMobile,
          }"
          @touchstart.stop @touchmove.stop
        >
          <AppLeftSidebar :is-switching="isSwitching" :switch-to="switchTo" />
        </div>
      </Transition>

      <Transition name="smallslide-fade-left">
        <div
          v-if="!isMobile && (!leftIsExpand || isSwitching)"
          class="left-sidebar small-side"
          :style="{
            '--width': 'var(--tg-sidebar-width-sm)',
          }" :class="{
            'fixed-small': isGreaterThanSm,
            'fixed': isLessThanLg,
            'full-screen': isMobile,
          }"
        >
          <AppLeftSidebarTiny :is-switching="isSwitching" :switch-to="switchTo" />
        </div>
      </Transition>
    </div>

    <div
      id="TgMainContent"
      ref="tgMainContentRef"
      class="main-content"
      :style="{
        paddingTop: `${paddingTop}px`,
      }"
      :class="{
        'not-mobile': !isMobile,
        'content-top': isMobile,
        'is-flutter-app': isFlutterApp(),
        'is-tpl6': globalInitMap.currentTemplate === 6,
      }"
    >
      <header
        v-if="!isFlutterApp()"
        class="navigation"
        :class="{ 'h5-pos': isMobile }"
        :style="{
          height: `${headerHeight}px`,
          width: globalInitMap.isPcRenderH5 ? 'var(--pc-h5model-width, 100%)' : '100%',
        }"
      >
        <AppContent except>
          <AppPwa
            v-if="isShowPwaHasC && isMobile"
          />
          <template v-if="isMobile">
            <BaseTemplate :template="['green', 'white', 'new-default']">
              <AppHeaderH52 v-show="$route.meta.showHomeHeader && !isInterestTreasure" :style="{ paddingTop: isShowPwaHasC ? '46px' : '' }" />
              <AppHeaderH5InsidePage v-show="!!!$route.meta.showHomeHeader || isInterestTreasure" :style="{ paddingTop: isShowPwaHasC ? '46px' : '' }" />
            </BaseTemplate>
            <BaseTemplate :template="['', 'bcgame', 'greenblack']">
              <AppHeaderH5InsidePage v-if="isInterestTreasure && isLogin" :style="{ paddingTop: isShowPwaHasC ? '46px' : '' }" />
              <AppHeaderH5 v-else :style="{ paddingTop: isShowPwaHasC ? '46px' : '' }" />
            </BaseTemplate>
          </template>
          <AppHeader v-else />
        </AppContent>
      </header>

      <!-- <Transition name="home-slide-fade"> :key="route.path" -->
      <div
        id="main-content-scrollable"
        class="scroll-y scrollable" :class="[{ 'mobile-bottom': isMobile }]"
      >
        <!-- 用于获取内容区宽度 -->
        <AppContent except>
          <div ref="homeContainerRef" class="only-for-get-width" />
        </AppContent>
        <slot>
          <div :data-keepAliveList="JSON.stringify(keepAliveList)">
            <AppContent class="@container">
              <RouterView v-slot="{ Component }">
                <template v-if="Component">
                  <KeepAlive :include="keepAliveList" :max="100">
                    <Suspense timeout="0" @resolve="suspenseResolved">
                      <component :is="Component" :key="route.path" />
                      <template #fallback>
                        <AppLoading full-screen />
                      </template>
                    </Suspense>
                  </KeepAlive>
                </template>
              </RouterView>
            </AppContent>
          </div>
        </slot>

        <footer v-if="showFooter && !isFlutterApp()" class="footer">
          <AppContent except>
            <AppFooter />
          </AppContent>
        </footer>
      </div>
      <!-- </Transition> -->
    </div>
    <Transition :name="isMobile ? 'casino-sport-fade-top' : ''">
      <div
        v-if="rightIsExpand"
        class="app-tg-right-sidebar right-sidebar"
        :class="{
          'width-none': rightContainerIs0,
          'fixed': isLessThanSm,
          'mobile': isMobile,
          'service': isOpenSerivce,
        }"
      >
        <div
          class="scroll-y overscroll-none"
          :style="{
            width: isMobile ? 'var(--pc-h5model-width)' : 'var(--width)',
            marginLeft: isMobile ? 'var(--pc-h5model-left)' : '0',
            height: '100%',
          }"
        >
          <div class="right-scroll-content">
            <template
              v-if="
                currentRightSidebarContent === EnumRightSidebarContent.NOTIFICATION
              "
            >
              <AppNotice />
            </template>
            <template
              v-else-if="
                currentRightSidebarContent === EnumRightSidebarContent.CHATROOM
              "
            >
              <AppChat />
            </template>
            <template
              v-else-if="
                currentRightSidebarContent === EnumRightSidebarContent.BETTING && userLanguage !== 'zh-CN'
              "
            >
              <!-- <AppSportsBetSlipMenu /> -->
              <AppSportRightBet />
            </template>
            <template
              v-else-if="
                currentRightSidebarContent === EnumRightSidebarContent.BETTING
              "
            >
              <AppSportsFloatingBetSlipCh />
            </template>
            <template
              v-else-if="currentRightSidebarContent === EnumRightSidebarContent.CASINOBET
              "
            >
              <AppCasinoBet />
            </template>
            <template
              v-else-if="currentRightSidebarContent === EnumRightSidebarContent.SERVICE && isMobile
              "
            >
              <AppService v-model="showH5Service" />
            </template>
          </div>
        </div>
      </div>
    </Transition>
    <div v-if="isMobile && !isFlutterApp()" class="fixed-foot-container">
      <template v-if="globalInitMap.currentTemplate === 4 || globalInitMap.currentTemplate === 2">
        <AppFooterbarX02 />
      </template>
      <template v-else-if="globalInitMap.currentTemplate === 6 ">
        <AppNewDefaultFootbar />
      </template>
      <template v-else-if="isStyle2()">
        <AppWin6Footbar />
      </template>
      <template v-else-if="isXVSite()">
        <AppFooterbarX02 />
      </template>
      <template v-else>
        <AppFooterbar />
      </template>
    </div>

    <Teleport to="body">
      <AppService v-if="!isMobile" v-model="serviceState" />
      <AppServiceFloatButton v-if="(isMobile ? showServiceFloat : false) || !isMobile" />

      <!-- 体育悬浮球投注单 -->
      <AppSportsFloatingBetSlip v-if="showSportsFloatingBetSlip && userLanguage !== 'zh-CN'" />
      <AppSportsFloatingBetSlipCh v-else-if="showSportsFloatingBetSlip" />
      <!-- <AppCookie /> -->
    </Teleport>
  </main>
</template>

<style scoped lang="scss">
.fixed-foot-container{
  position: fixed;
  bottom: 0;
  left: var(--pc-h5model-left,0);
  width: var(--pc-h5model-width, 100%);
  height: var(--tg-footerbar-height);
  z-index: var(--tg-z-index-30);
}
.only-for-get-width {
  width: 100%;
  position: relative;
  top: var(--tg-header-height-n);
}

.wrap {

  .side-bar-outer {
    position: relative;
    display: flex;
    flex-direction: row;
  }

  .left-sidebar.big-side {
    position: relative;
    z-index: var(--tg-z-index-30);
    will-change: margin-left;
  }

  .left-sidebar.small-side {
    position: relative;
    z-index: var(--tg-z-index-20);
    will-change: margin-left;
  }

  &.is-switching {

    .left-sidebar.small-side {
      margin-left: var(--tg-sidebar-width-sm-n);
    }
  }
}

.wrap {
  width: 100%;
  height: 100%;

  &.not-mobile {
    display: flex;
    overflow: hidden;
  }
}

.home-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #{rgba($color: var(--tg-color-grey-rgb), $alpha: 0.7)};
  z-index: var(--tg-z-index-20);
}

.small-size-padding {
  width: 60px;
}

.left-sidebar {
  width: var(--width);
  background-color: var(--tg-secondary-dark);
  /* @include webTheme('white') {
    background-color: #e8e8e8;
  } */
  // transition: width 0.3s ease-in-out, top .2s ease-in-out;
  z-index: var(--tg-z-index-20);
  height: 100%;
  display: flex;
  flex-direction: column;
  will-change: margin-left;

  &.fixed {
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: var(--pc-h5model-left);
  }

  &.full-screen {
    // H5模式
    width: var(--mobile-width);
    top: calc(var(--tg-header-height) - 1px);
    // padding-bottom: var(--tg-footerbar-height);
    height: calc(100% - var(--tg-header-height) - var(--tg-footerbar-height) + 1px);
  }

  &.fixed-small {
    width: var(--width);
  }
}

.content-top {
  &.is-flutter-app {
    padding-top: 0;
    .mobile-bottom {
      padding-bottom: 0;
    }
  }
}

.main-content {
  &.not-mobile {
    overflow: hidden;
    display: flex;
    flex: 1;
    flex-direction: column;
  }

  &>.navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--tg-primary-main);
    color: var(--tg-text-white);
    font-weight: 600;
    padding-right: var(--tg-scrollbar-size);
    box-shadow: var(--tg-header-shadow);
    z-index: var(--tg-z-index-10);
    @include webTheme('white'){
      padding-right: 0;
    }

    &.h5-pos {
      position: fixed;
      top: -1px;
      left: 50%;
      transform: translateX(-50%);
    }

    &>.group {
      display: flex;
      align-items: center;
      flex-direction: column;
    }
  }
  &.is-tpl6{
    &>.navigation{

    }
  }
  .footer {
    width: 100%;
    background-color: var(--tg-text-grey-deep); // var(--tg-secondary-deepdark);

    @include webTheme('greenblack') {
      background-color: var(--tg-body-bg);
    }
    @include webTheme('white') {
      background-color: var(--tg-primary-main);
    }
    @include webTheme('green') {
      background-color: #055434;
    }
  }
  .mobile-bottom{
    padding-bottom: var(--tg-footerbar-height);
  }
}

.right-sidebar {
  background: var(--tg-secondary-dark);
  transition: width 0.3s;
  overflow: hidden;
  z-index: var(--tg-z-index-30);
  width: var(--width);
  filter: drop-shadow(var(--tg-drop-shadow));

  &.width-none {
    width: 0;
  }

  &.fixed {
    position: fixed;
    width: 100%;
    top: 0;
    bottom: 0;
    right: var(--pc-h5model-left);
    z-index: var(--tg-z-index-30);
  }

  &.full-screen {
    width: var(--mobile-width);
    top: var(--tg-header-height);
    padding-bottom: var(--tg-footerbar-height);
  }

  &.mobile {
    width: var(--pc-h5model-width, 100%);
    padding-bottom: var(--tg-footerbar-height);
  }
}
.right-scroll-content {
  height: calc(100% + 1px);
  @include webTheme('green') {
    --tg-tab-active-text-color: #fff;
  }
}
</style>

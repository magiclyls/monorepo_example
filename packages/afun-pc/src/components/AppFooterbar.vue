<script setup lang="ts">
import { IconTabbarGame, IconTabbarChat, IconUniPromo, IconChessOnlineSupport, IconSptBasketball } from '@tg/icons'
import { ApiGameRecycle } from '@tg/apis'

defineOptions({
  name: 'AppFooterbar',
})
enum Game {
  CASINO = 'casino',
  SPORTS = 'sports',
}
const { t } = useI18n()
const router = useLocalRouter()
const route = useRoute()
const { leftIsExpand, openLeftSidebar, closeLeftSidebar } = useLeftSidebar()
const { isMobile, bodyWidth } = storeToRefs(useWindowStore())
const { sideBigActiveMenu, footerBarCasinoRoute, footerBarSportsRoute, isShowOriginalSport } = storeToRefs(useMenuStore())
const {
  rightIsExpand,
  currentRightSidebarContent,
  openRightSidebar,
  closeRightSidebar,
} = useRightSidebar()
const { isLogin } = storeToRefs(useAppStore())
const { openRegisterDialog } = useRegisterDialog()
const { openService, closeService } = useService()

const gameType = ref(checkGameType())

const isCasino = computed(() => gameType.value === Game.CASINO
  && !rightIsExpand.value && !leftIsExpand.value,
)
const isSports = computed(() => gameType.value === Game.SPORTS
  && !rightIsExpand.value && !leftIsExpand.value,
)
const isRouteCasino = computed(() => route.name?.toString().includes(Game.CASINO))
const isRouteSports = computed(() => route.name?.toString().includes(Game.SPORTS))
const isRouteSportsMyBet = computed(() => route.path?.toString().includes(`/sports/${getSportsPlatId()}/my-bets`))
const isChat = computed(() => rightIsExpand.value
  && currentRightSidebarContent.value === EnumRightSidebarContent.CHATROOM,
)
const isService = computed(() => rightIsExpand.value
  && currentRightSidebarContent.value === EnumRightSidebarContent.SERVICE,
)
const isPromo = computed(() => !rightIsExpand.value && !leftIsExpand.value && route.name?.toString() === 'lang-promotion')

function checkGameType() {
  const isCasino = route.name?.toString().includes(Game.CASINO)
  const isSports = route.name?.toString().includes(Game.SPORTS)
  return isCasino ? Game.CASINO : isSports ? Game.SPORTS : ''
}
function clearGameType() {
  gameType.value = ''
}
function resetGameType() {
  gameType.value = checkGameType()
}
function clearSidebar() {
  setTimeout(() => {
    rightIsExpand.value && closeRightSidebar()
  }, 100)
}
function toggleLeftSidebar() {
  rightIsExpand.value && closeRightSidebar()

  if (leftIsExpand.value) {
    closeLeftSidebar()
    setTimeout(() => {
      resetGameType()
    }, 200)
    Local.set(STORAGE_MENU_LEFT_EXPAND, false)
  }
  else {
    openLeftSidebar()
    clearGameType()
    Local.set(STORAGE_MENU_LEFT_EXPAND, true)
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

function goGame(type: Game) {
  let temp = ''

  setTimeout(() => {
    switch (type) {
      case Game.CASINO:
        if (isRouteCasino.value) {
          setTimeout(() => {
            clearSidebar()
            if (leftIsExpand.value)
              closeLeftSidebar()
          }, 100)
          return resetGameType()
        }
        router.push('/casino')
        gameType.value = Game.CASINO
        sideBigActiveMenu.value = ''
        break
      case Game.SPORTS:
        temp = `/sports/${getSportsPlatId()}`
        if (isRouteSports.value && !isRouteSportsMyBet.value) {
          setTimeout(() => {
            clearSidebar()
            if (leftIsExpand.value)
              closeLeftSidebar()
          }, 100)
          return resetGameType()
        }
        router.push(temp)
        gameType.value = Game.SPORTS
        sideBigActiveMenu.value = ''
        break
      default:
        break
    }
    setTimeout(() => {
      clearSidebar()
    }, 100)
  }, 0)
  runRecycle()
}

function closeRightAndReset() {
  if (rightIsExpand.value) {
    closeRightSidebar()
    setTimeout(() => {
      resetGameType()
    }, 200)
  }
}
function resetRightSidebar() {
  currentRightSidebarContent.value = null
}
function openBar(type: 'bet' | 'bet-slip' | 'chat' | 'service') {
  Local.set(STORAGE_MENU_LEFT_EXPAND, false)
  leftIsExpand.value && closeLeftSidebar()

  switch (type) {
    case 'bet':
      if (rightIsExpand.value) {
        if (currentRightSidebarContent.value === EnumRightSidebarContent.CASINOBET)
          return closeRightAndReset()
        currentRightSidebarContent.value = EnumRightSidebarContent.CASINOBET
        return
      }
      resetRightSidebar()
      openRightSidebar(EnumRightSidebarContent.CASINOBET)
      break
    case 'bet-slip':
      if (!isLogin.value)
        return openRegisterDialog()

      if (rightIsExpand.value) {
        if (currentRightSidebarContent.value === EnumRightSidebarContent.BETTING)
          return closeRightAndReset()
        currentRightSidebarContent.value = EnumRightSidebarContent.BETTING
        return
      }
      resetRightSidebar()
      openRightSidebar(EnumRightSidebarContent.BETTING)
      if (!isLogin.value)
        openRegisterDialog()
      break
    case 'chat':
      if (rightIsExpand.value) {
        if (currentRightSidebarContent.value === EnumRightSidebarContent.CHATROOM)
          return closeRightAndReset()
        currentRightSidebarContent.value = EnumRightSidebarContent.CHATROOM
        return
      }
      resetRightSidebar()
      openRightSidebar(EnumRightSidebarContent.CHATROOM)
      break
    case 'service':
      if (rightIsExpand.value) {
        if (currentRightSidebarContent.value === EnumRightSidebarContent.SERVICE) {
          closeService()
          closeRightAndReset()
          return
        }
        currentRightSidebarContent.value = EnumRightSidebarContent.SERVICE
        openService({ isFootBar: true, needDeal: false })
        return
      }
      openService({ isFootBar: true, needDeal: false })
      resetRightSidebar()
      openRightSidebar(EnumRightSidebarContent.SERVICE)
      break
    default:
      break
  }
  clearGameType()
}
// 优惠
function onPromoClick() {
  closeRightSidebar()
  closeLeftSidebar()
  router.push('/promotion')
}

watch(() => route.path, () => {
  if (isMobile.value) {
    clearSidebar()
    resetGameType()
  }
})
watch(rightIsExpand, (a) => {
  if (isMobile.value && !a) {
    clearSidebar()
    resetGameType()
    lockBodyScroll(false)
  }
})
</script>

<template>
  <div
    class="app-footer-bar"
    :style="{
      width: `${bodyWidth}px`,
    }"
    @touchstart.stop
    @touchmove.stop.prevent
  >
    <div class="bar-item" :class="{ active: isCasino }">
      <BaseButton type="text" size="none" @click="goGame(Game.CASINO)">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconTabbarGame />
          </div>
          <span>{{ t('casino').toLowerCase() }}</span>
        </div>
      </BaseButton>
    </div>
    <!-- 优惠 -->
    <div class="bar-item" :class="{ active: isPromo }">
      <BaseButton type="text" size="none" @click="onPromoClick">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconUniPromo />
          </div>
          <span>{{ t('menu_title_settings_offers') }}</span>
        </div>
      </BaseButton>
    </div>
    <!-- 客服 -->
    <div
      v-show="!isStyle2()"
      id="h5-footbar-kefu" class="bar-item" :class="{ active: isService }" @click="openBar('service')"
    >
      <BaseButton type="text" size="none">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconChessOnlineSupport />
          </div>
          <span>{{ t('service_label') }}</span>
        </div>
      </BaseButton>
    </div>
    <div v-if="isShowOriginalSport" class="bar-item" :class="{ active: isSports && !isRouteSportsMyBet }">
      <BaseButton type="text" size="none" @click="goGame(Game.SPORTS)">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconSptBasketball />
          </div>
          <span>{{ t('sports').toLowerCase() }}</span>
        </div>
      </BaseButton>
    </div>
    <div
      v-else
      id="h5-footbar-kefu" class="bar-item" @click="openBar('service')"
    >
      <BaseButton type="text" size="none">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconTabbarChat />
          </div>
          <span>{{ t('service_label') }}</span>
        </div>
      </BaseButton>
    </div>
    <div class="bar-item" :class="{ active: isChat }">
      <BaseButton type="text" size="none" @click="openBar('chat')">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconTabbarChat />
          </div>
          <span>{{ t('chat_room') }}</span>
        </div>
      </BaseButton>
    </div>
    <div :id="EnumSportEndDomID.H5_CART_END_DOM" class="h5-end-dom" />
  </div>
</template>

<style>
:root {
  --app-footer-bar-bg: var(--tg-secondary-dark);
}
[theme='white'] {
  --app-footer-bar-bg: #ffffff;
}
</style>

<style lang="scss" scoped>
.app-footer-bar {
  --tg-badge-font-size: 10px;
  --tg-badge-min-width: 16px;
  --tg-badge-height: 16px;
  --tg-badge-border-radius: 50%;
  --tg-badge-line-height: 16px;
  --tg-badge-padding-x: 0;
  background: var(--app-footer-bar-bg);
  height: 100%;
  width: 100%;
  padding: 0 var(--tg-spacing-16);
  line-height: 1;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  @include webTheme('white') {
    border-top: 1px solid #e0e0e0;
  }
  .h5-end-dom {
    position: absolute;
    width: 20px;
    left: 50%;
    top: 0;
    transform: translate(-50%, 0);
  }
  .bar-item {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .bar-btn {
      display: flex;
      justify-content: center;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      > *:not(:first-child) {
        margin-top: var(--tg-spacing-4);
      }
      span {
        font-size: var(--tg-font-size-xs);
        color: var(--tg-text-white);
        @include webTheme('green') {
          color: var(--tg-text-green-sub);
        }
        font-weight: var(--tg-font-weight-semibold);
        line-height: 1;
      }
      > span {
        text-transform: capitalize;
      }
      .bar-icon {
        font-size: 20px;
        height: 20px;
      }
    }
  }
  .active {
    position: relative;
    .bar-icon {
      --tg-icon-color: #fff;
      @include webTheme('green') {
        --tg-icon-color: var(--tg-primary-active);
      }
      @include webTheme('greenblack') {
        --tg-icon-color: var(--tg-primary-active);
      }
      @include webTheme('white') {
        --tg-icon-color: #f2ca5c;
      }
    }

    .bar-btn span {
      @include webTheme('green') {
        color: var(--tg-primary-active);
      }
      @include webTheme('greenblack') {
        color: var(--tg-primary-active);
      }
      @include webTheme('white') {
        color: #f2ca5c;
      }
    }
    &:before {
      content: '';
      position: absolute;
      top: 0;
      min-height: var(--tg-border-width-md);
      width: 60%;
      background-color: var(--tg-tab-active-bar);
      @include webTheme('white') {
        background-color: var(--tg-white-primary-active-bg);
      }
    }
  }
}
</style>

<script setup lang="ts">
import { IconUniHome, IconNavbarWallet, IconUniShare, IconSptBasketball, IconTabbarChat, IconUniPromo } from '@tg/icons'
import { ApiGameRecycle, ApiMemberAgencyCheck } from '@tg/apis'

defineOptions({
  name: 'AppNewDefaultFootbar',
})
enum Game {
  CASINO = 'casino',
  SPORTS = 'sports',
}
const { t } = useI18n()
const router = useLocalRouter()
const route = useRoute()
const { leftIsExpand, openLeftSidebar, closeLeftSidebar } = useLeftSidebar()
const { isMobile } = storeToRefs(useWindowStore())
const { sideBigActiveMenu, footerBarCasinoRoute, footerBarSportsRoute, isShowOriginalSport } = storeToRefs(useMenuStore())
const {
  rightIsExpand,
  currentRightSidebarContent,
  openRightSidebar,
  closeRightSidebar,
} = useRightSidebar()
const { isLogin, currentGlobalCurrency } = storeToRefs(useAppStore())
const { openWalletDialog } = useWalletDialog({ activeTab: 'deposit' })
const { openLoginDialog } = useLoginDialog()

// const { userLanguage } = storeToRefs(useLanguageStore())
const { openRegisterDialog } = useRegisterDialog()
const { openService, closeService } = useService()
// const { openActivity } = useActivityMenu()
// const { data: dataPromoList } = useRequest(ApiMemberPromoList, { manual: false })
const { openNotify } = useNotify()

const { runAsync: runAgencyCheck } = useRequest(ApiMemberAgencyCheck, { manual: true })

// const currencyName = computed(() => languageConfig && userLanguage.value ? languageConfig[userLanguage.value]?.currency : '')
// const currencyCode = computed(() => currencyName.value ? currencyConfig[currencyName.value].cur : '706')
const globalCurrencyCode = computed(() => {
  if (isLogin.value)
    return application.isVirtualCurrency(currentGlobalCurrency.value) ? currencyConfig.USDT.cur : currencyConfig[currentGlobalCurrency.value].cur

  return undefined // currencyConfig[languageConfig[getCurrentLanguageForFrontend()].currency].cur
})
// const inviteDate = computed(() => dataPromoList.value ? dataPromoList.value.filter(a => a.ty === 2)[0] : null)

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
const isInvite = computed(() => !rightIsExpand.value && !leftIsExpand.value && route.path?.toString().includes('promotions/promotion/invite'))
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
// 分享
function onShareClickHandler() {
  closeRightSidebar()
  closeLeftSidebar()
  // const data = inviteDate.value
  if (route.fullPath.includes('/promotion/invite'))
    return
  runAgencyCheck({ currency_id: globalCurrencyCode.value }).then((res) => {
    if (res) {
      if (res.tips && +res.tips === 0) {
        // 活动未开始
        openNotify({
          icon: 'chess-gameshow',
          iconColor: '--tg-text-alltheme-green',
          title: t('activity_tip'),
          message: t('activity_not_start'),
        })
      }
      else if (res.tips && +res.tips === 1) {
        // 语言不支持此活动
        openNotify({
          icon: 'uni-record-warn',
          title: t('warm_tip'),
          message: t('lang_not_support_promo'),
        })
      }
      else if (res.pid) {
        router.push(`/promotions/promotion/invite?pid=${res.pid}`)
      }
    }
  })
  // if (data) {
  //   // const { display, display_end_at, display_start_at, end_at, langs, start_at, state } = data
  //   // console.log(display, display_end_at, display_start_at, end_at, langs, start_at, state)
  //   runAgencyCheck({ currency_id: currencyCode.value }).then((res) => {
  //     openActivity(data)
  //   })
  // }
  // else {
  //   if (isLogin.value) {
  //     openNotify({
  //       icon: 'uni-record-warn',
  //       title: t('warm_tip'),
  //       message: t('promo_currency_error'),
  //     })
  //   }
  //   else {
  //     openNotify({
  //       icon: 'uni-record-warn',
  //       title: t('warm_tip'),
  //       message: t('lang_not_support_promo'),
  //     })
  //   }
  // }
}
// 优惠
function onPromoClick() {
  closeRightSidebar()
  closeLeftSidebar()
  router.push('/promotion')
}
function openWalletDialogIfLogin() {
  if (isLogin.value)
    openWalletDialog()
  else
    openLoginDialog()
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
  <div class="app-footer-bar" @touchstart.stop @touchmove.stop.prevent>
    <div class="bar-item" :class="{ active: isCasino }">
      <BaseButton type="text" size="none" @click="goGame(Game.CASINO)">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconUniHome />
          </div>
          <span>{{ t('home').toLowerCase() }}</span>
        </div>
      </BaseButton>
    </div>
    <div class="bar-item">
      <BaseButton type="text" size="none" @click="openWalletDialogIfLogin">
        <div class="bar-btn">
          <div class="bar-icon">
            <IconNavbarWallet />
          </div>
          <span>{{ t('deposit') }}</span>
        </div>
      </BaseButton>
    </div>
    <div
      class="bar-item" :class="{ 'active-invite': isInvite }"
      @click="onShareClickHandler"
    >
      <BaseButton type="text" size="none">
        <div class="bar-btn relative">
          <div class="h-[20px] w-full">
            <div class="absolute left-[50%] top-[-35px] h-[55px] w-[55px] flex translate-x-[-50%] items-center justify-center border-[6px] border-[#0F212E] rounded-[100px] border-solid bg-[var(--tg-sport-btn-hover)] text-[23px]">
              <IconUniShare />
            </div>
          </div>
          <span>{{ t('share') }}</span>
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
    <!-- 用来触发客服浮动按钮,不要删除或者注释 -->
    <div
      id="h5-footbar-kefu" class="h-[0px] w-[0px] overflow-hidden opacity-0" @click="openBar('service')"
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

<style lang="scss">
.active-invite {
  svg {
    color: var(--tg-sub-blue) !important;
  }
  --tg-icon-color: var(--tg-sub-blue) !important;
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
      // gap: var(--tg-spacing-4);
      > *:not(:last-child) {
        margin-bottom: var(--tg-spacing-6);
      }
      span {
        font-size: 13px;
        color: var(--tg-text-white);
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
    --tg-icon-color: #fff;
    position: relative;
    @include webTheme('green') {
      --tg-icon-color: var(--tg-primary-active);
    }
    @include webTheme('greenblack') {
      --tg-icon-color: var(--tg-primary-active);
    }
    @include webTheme('white') {
      --tg-icon-color: var(--tg-primary-active);
    }
    .bar-btn span {
      @include webTheme('green') {
        color: var(--tg-primary-active);
      }
      @include webTheme('greenblack') {
        color: var(--tg-primary-active);
      }
    }
    position: relative;
    &:before {
      content: '';
      position: absolute;
      top: 0;
      min-height: var(--tg-border-width-md);
      width: 60%;
      background-color: var(--tg-tab-active-bar);
    }
  }
}
</style>

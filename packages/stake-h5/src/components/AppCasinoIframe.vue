<script setup lang='ts'>
import type { EnumCurrencyKey } from '@tg/types'
import { ApiGameLunch, ApiMemberAgencyCheck, ApiMemberFavDelete, ApiMemberFavInsert, ApiMemberGameDetail } from '@tg/apis'
import { currencyConfig } from '~/composables/useCurrencyData'
import { IconUniArrowDown, IconUniPlay, IconUniFavorites, IconUniShare, IconUniFullScreen, IconUniTheatreOpen, IconUniTrend } from '@tg/icons'
import { SendFlutterThirdPartyAppMessage } from '@tg/types'
import {  sendMsgToFlutterThirdPartyApp } from '~/utils'

interface Props {
  isTheatre: boolean
  id: string
  pid: string
  gameId: string
  vid?: string
}
defineOptions({
  name: 'AppCasinoIframe',
})
const props = defineProps<Props>()
const emit = defineEmits(['changeTheatre', 'gameDetailsChange'])
const appStore = useAppStore()
const { userInfo, theme } = storeToRefs(appStore)
const { t } = useI18n()
const { push, back } = useLocalRouter()
const { isMobile, appContentWidth, bodyWidth } = storeToRefs(useWindowStore())
const { isLogin, currentGlobalCurrency, isCompleteKYC } = storeToRefs(useAppStore())
const { allPlatformList,imageRatio, imageDirectory } = storeToRefs(useCasinoStore())
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
const { openRegisterDialog } = useRegisterDialog()
const { openNotify } = useNotify()
const { openShareRegisterLinkDialog } = useDialogShareRegisterLink()

const {
  bool: isShowFrameOverlay,
  setTrue: overlayTrue,
  setFalse: overlayFalse,
} = useBoolean(false)
const { bool: isRealMoneyMode, setBool: setRealModeBool } = useBoolean(isLogin.value)
// const { bool: isTrendOpen, toggle: toggleTrendOpen } = useBoolean(false)
// 余额箭头
const {
  bool: isCurrencyOpen1,
  setTrue: setCurrencyOpen1,
  setFalse: setCurrencyClose1,
} = useBoolean(false)
const {
  bool: isCurrencyOpen2,
  setTrue: setCurrencyOpen2,
  setFalse: setCurrencyClose2,
} = useBoolean(false)
const {
  bool: isCurrencyOpen3,
  setTrue: setCurrencyOpen3,
  setFalse: setCurrencyClose3,
} = useBoolean(false)
const {
  bool: isShowIframe,
  setTrue: showIframe,
  setFalse: hideIframe,
} = useBoolean(false)
const {
  bool: isShowIframeDoc,
  setTrue: showIframeDoc,
  setFalse: hideIframeDOc,
} = useBoolean(false)
const { bool: showTestMode } = useBoolean(false)
const { floatingState, toggleFloating } = useFloatingVue()
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()
// const { bool: isShowMobileTopOperation, setTrue: showMobileTopOperation, setFalse: hideMobieTopOperation } = useBoolean(false)

const currentCurrency = ref<EnumCurrencyKey>()
const currencyList = ref<EnumCurrencyKey[]>([])
const gameFrameRef = ref()
const { bool: isFavorite } = useBoolean(false)
const { bool: realModeLoading } = useBoolean(false)
const { bool: testModeLoading } = useBoolean(false)
// const mobileGameFrameRef = ref()
const mobileGameUrl = ref()

const paramEmpty = computed(() => {
  return !!(props.id || props.gameId)
})
const exclude = computed(() => {
  return userInfo.value?.exclude === 1
})
// 游戏数据接口
const {
  data: dataDetail,
  runAsync: runDetail,
} = useRequest(() => {
  return ApiMemberGameDetail(props.id, props.pid, props.gameId)
}, {
  ready: paramEmpty,
  onSuccess(res) {
    if (res.game_type === EnumGlobalGameType.slot)
      showTestMode.value = true

    currencyList.value = res.currencys

    //  如果用户选择过货币，使用之前保存的货币
    const lastCurrency = Local.get<EnumCurrencyKey>(STORAGE_CASINO_GAME_CURRENCY)

    if (lastCurrency && currencyList.value.findIndex(a => a === lastCurrency.value) > -1)
      currentCurrency.value = lastCurrency.value

    else if (currencyList.value.findIndex(a => a === currentGlobalCurrency.value) > -1)
      currentCurrency.value = currencyList.value[currencyList.value.findIndex(a => a === currentGlobalCurrency.value)]

    else
      currentCurrency.value = currencyList.value[0]

    isFavorite.value = +res.is_fav === 1
    overlayTrue()
    emit('gameDetailsChange', res)
  },
})
// 分享相关
const { runAsync: runAgencyCheck } = useRequest(ApiMemberAgencyCheck, { manual: true })
const globalCurrencyCode = computed(() => {
  if (isLogin.value)
    return application.isVirtualCurrency(currentGlobalCurrency.value) ? currencyConfig.USDT.cur : currencyConfig[currentGlobalCurrency.value].cur

  return undefined
})

const id = computed(() => dataDetail.value ? dataDetail.value.id : '')
const pid = computed(() => dataDetail.value ? dataDetail.value.platform_id : '')
const code = computed(() => dataDetail.value ? dataDetail.value.game_id : '')
const currencyCode = computed(() => {
  return currentCurrency.value ? currencyConfig[currentCurrency.value].cur : '0'
})
const bigGameWrapper = computed(() => appContentWidth.value > 930)
const gameProviderName = computed(() => {
  return allPlatformList.value?.find(
    a => a.id === dataDetail.value?.platform_id,
  )?.name ?? '-'
})
// AG平台游戏
// AG   = "104" //AG真人
// AGFish  = "208" //AG捕鱼
// AGSlot       = "312" //AG老虎机(XIN)
// YOPLAY       = "316" //AG老虎机(YOPLAY)
// BBIN = "107" //BBIN真人
// BBINSlot     = "317" //BBIN老虎机
// DG  = "106" 
const isAG = computed(() => (pid.value === '312' || pid.value === '104' || pid.value === '208' || pid.value === '312' || pid.value === '316' || pid.value === '107' || pid.value === '317' || pid.value === '401' || pid.value === '106'))

onMounted(() => {
  if (exclude.value)
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
})

// 启动游戏接口
const {
  run: runLunchGame,
  runAsync: runLunchGameAsync,
  data: gameUrl,
  mutate: mutateGameUrl,
} = useRequest(() => {
  if (exclude.value)
    throw new Error(' ')
  return ApiGameLunch({
    pid: pid.value,
    code: code.value,
    cur: currencyCode.value,
    wcur: getCurrencyConfig(currentGlobalCurrency.value).cur,
  })
}, {
  manual: true,
  throttleInterval: 3000,
  throttleOptions: {
    leading: true,
    trailing: false,
  },
  onBefore() {
    if (isRealMoneyMode.value)
      realModeLoading.value = true

    else
      testModeLoading.value = true
  },
  onSuccess(res) {
    // 判断data开头是不是http
    if (res.toString().startsWith('http')) {
      // H5模式直接打开游戏
      console.log(dataDetail)

      if (isMobile.value) {
        if (isAG.value) {
          setTimeout(() => {
            location.href = res
          }, 100)
        }
        else {
          mobileGameUrl.value = res
          localStorage.setItem('gameUrlLocal', res)
          push('/casino/mobile-game-frame')
          // showIframe()
          // push(`/casino/mobile-game-frame?gameUrl=${encodeURIComponent(res)}`)
        }
        // location.href = res
        setTimeout(() => {
          resetH5Loading()
        }, 1500)
      }
      else {
        if (isAG.value) {
          setTimeout(() => {
            window.open(res, '_blank')
          }, 100)
        }
        else {
          showIframe()
        }
      }
    }
    else {
      if (isMobile.value) {
        handlePgGameStrToLink(res).then((res) => {
          if (isAG.value)
            location.href = res || ''
          else
            mobileGameUrl.value = res
          // showIframe()
          localStorage.setItem('gameUrlLocal', res)
          push('/casino/mobile-game-frame')
          // push(`/casino/mobile-game-frame?gameUrl=${encodeURIComponent(res)}`)
          resetH5Loading()
        })

        // const newPage = window.open(location.origin, 'MyWindowName', 'width=100,height=100') as any
        // if (newPage) {
        //   newPage.document.open()
        //   newPage.document.write(res) // 运行 HTML 代码
        //   newPage.document.close()
        //   resetH5Loading()
        // }
        // return
      }
      else {
        showIframeDoc()
      }
    }
  },
  onError() {
    resetH5Loading()
  },
})
//
function resetH5Loading() {
  realModeLoading.value = false
  testModeLoading.value = false
}
// pc自动启动游戏
function autoLunchOnPc() {
  !isMobile.value && isLogin.value && !isAG.value && runLunchGame()
}
// 重新获取游戏地址是先清空
function clearUrl() {
  hideIframe()
  hideIframeDOc()
  mutateGameUrl('')
}
// 切换路由时重新获取detail
function refreshDetail() {
  clearUrl()
  runDetail().then(() => !isAG.value && autoLunchOnPc())
}
// 选择货币
function onChooseCurrency(v: EnumCurrencyKey) {
  clearUrl()
  currentCurrency.value = v
  Local.set<EnumCurrencyKey>(STORAGE_CASINO_GAME_CURRENCY, v)
  overlayTrue()
  autoLunchOnPc()
}
// 切换试玩真钱模式
function onSwitchRealMoneyMode(v: boolean) {
  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  setRealModeBool(v)
  overlayFalse()
  sendMsgToFlutterThirdPartyApp(SendFlutterThirdPartyAppMessage.ENTERGAME)
  sendMsgToAdjust(SendFlutterThirdPartyAppMessage.ENTERGAME)
  if (isMobile.value || isAG.value) {
    // pg === '301'
    if (props.vid === '301') {
      runLunchGameAsync().then((res) => {
        // 1. 伪装跳转
        history.pushState(null, '', '/virtual.html')
        // 2. 替换整个页面
        document.open()
        document.write(res)
        document.close()

        resetH5Loading()
      })
    }
    else {
      runLunchGame()
    }
  }
}
// 全屏
function onClickFullScreen() {
  gameFrameRef.value.requestFullscreen()
}
// 剧院
function onClickTheatre() {
  emit('changeTheatre', !props.isTheatre)
}

// 添加收藏
const { run: runFavInsert } = useRequest(() => ApiMemberFavInsert(id.value), {
  onSuccess() {
    isFavorite.value = true
  },
})
// 删除收藏
const { run: runFavDelete } = useRequest(() => ApiMemberFavDelete(id.value), {
  onSuccess() {
    isFavorite.value = false
  },
})
function onClickFavorite() {
  if (isFavorite.value)
    return runFavDelete()
  runFavInsert()
}

// 点击判断是否已登陆
function onClickMaybeNotLogin(type: 'fav' | 'share') {
  if (!isLogin.value)
    return openRegisterDialog()

  switch (type) {
    case 'fav':
      onClickFavorite()
      break
    case 'share':
      openShareRegisterLinkDialog()
  }
}

watch(currentGlobalCurrency, (a) => {
  const index = currencyList.value.findIndex(c => c === a)
  if (index > -1) {
    currentCurrency.value = currencyList.value[index]
    onChooseCurrency(currentCurrency.value)
  }
})

/** 处理因缓存而导致游戏会话失效问题 */
const isFirstActivate = ref(true)
onActivated(() => {
  if (isFirstActivate.value) {
    isFirstActivate.value = false
    return
  }
  !isAG.value && autoLunchOnPc()
})

defineExpose({ refreshDetail, dataDetail })
await application.allSettled([runDetail().then(() => !isAG.value && autoLunchOnPc())])
</script>

<template>
  <!-- H5模式 -->
  <template v-if="isMobile">
    <!-- 新内页设计，只有H5版本 -->
    <div class="mobile-iframe-new-stake">
      <div class="top">
        <div class="img-wrap">
          <BaseAspectRatio class="game-ratio" :ratio="imageRatio">
            <div class="img">
              <BaseImage :url="dataDetail?.img" :image-directory="imageDirectory" is-cloud class="overflow-hidden rounded-[8px]" />
            </div>
          </BaseAspectRatio>
        </div>
        <div class="right">
          <div v-if="isLogin" class="flex flex-col items-start">
            <p class="choose-text">
              {{ t('choose_your_balance') }}
            </p>
            <!-- 选择货币 -->
            <div class="currency">
              <span>{{ t('h5_casino_inside_balance') }}</span>
              <VDropdown
                :distance="6" :triggers="[]" :shown="floatingState" :auto-hide="false" placement="bottom"
                @show="setCurrencyOpen1" @hide="setCurrencyClose1"
              >
                <div v-if="currentCurrency" class="current-currency" @click.stop="toggleFloating">
                  <AppCurrencyIcon show-name :currency-type="currentCurrency" />
                  <div class="arrow theme-arrow" :class="{ up: isCurrencyOpen1 }">
                    <IconUniArrowDown />
                  </div>
                </div>
                <template #popper>
                  <div v-if="currencyList.length" class="scroll-y popper popper-mobile">
                    <a
                      v-for="c, i in currencyList" :key="i" class="currency-types popper-option"
                      @click="toggleFloating(); onChooseCurrency(c)"
                    >
                      <div>
                        <AppCurrencyIcon show-name :currency-type="c" />
                      </div>
                    </a>
                  </div>
                </template>
              </VDropdown>
            </div>
          </div>
          <div v-else class="flex flex-col items-start">
            <span class="game-name">
              {{ dataDetail?.name }}
            </span>
            <BaseButton type="text" size="none">
              <span class="game-provider" @click="push(`/casino/group/provider?vid=${vid}`)">
                {{ gameProviderName }}
              </span>
            </BaseButton>
          </div>
          <BaseButton
            v-if="isLogin" :loading="realModeLoading" class="real theme-secondary-btn" size="sm"
            bg-style="secondary" :disabled="exclude" @click="onSwitchRealMoneyMode(true)"
          >
            <div class="icon mr-[8px]">
              <IconUniPlay />
            </div>
            <span>{{ t('casino_inside_start_game_button') }}</span>
          </BaseButton>
          <BaseButton v-else size="sm" class="reg-btn" bg-style="primary" @click="openRegisterDialog">
            <span class="reg-text">{{ t('reg') }}</span>
          </BaseButton>
        </div>
      </div>
      <div class="bottom">
        <!-- 收藏游戏 -->
        <div class="icon-button" :class="{ 'is-isFavorite': isFavorite }" @click="onClickMaybeNotLogin('fav')">
          <IconUniFavorites />
        </div>
        <div class="icon-button" @click="onClickMaybeNotLogin('share')">
          <IconUniShare />
        </div>
      </div>
    </div>
    <div class="info-box">
      <div class="flex flex-col">
        <span class="game-name">{{ dataDetail?.name }}</span>
        <span class="cursor-pointer leading-[20px]" @click="push(`/casino/group/provider?vid=${vid}`)">
          <span class="light-text">{{ gameProviderName }}</span>
        </span>
      </div>
      <div v-if="+(dataDetail?.rtp || 0) > 0" class="flex flex-col">
        <span class="leading-[20px]">RTP</span>
        <span class="light-text leading-[20px]">{{ toFixed(dataDetail?.rtp || 0, 2) }}%</span>
      </div>
    </div>

    <!-- 其他模板 -->
  </template>

  <!-- PC模式 -->
  <div v-else class="app-iframe" :class="{ 't-app-iframe': isTheatre }">
    <div class="game-wrapper" :class="{ 'b-game-wrapper': bigGameWrapper, 't-game-wrapper': isTheatre }">
      <div class="content-wrapper" :class="{ 't-content-wrapper': isTheatre }">
        <div class="content" :class="{ 't-content': isTheatre }">
          <div class="iframe-wrapper" :class="{ 't-iframe-wrapper': isTheatre }">
            <div v-if="isShowFrameOverlay" class="iframe-menu-overlay">
              <div class="content">
                <div class="currency">
                  <span>{{ t('balance') }}</span>
                  <VDropdown :distance="6" @show="setCurrencyOpen2" @hide="setCurrencyClose2">
                    <div v-if="currentCurrency" class="current-currency">
                      <AppCurrencyIcon show-name :currency-type="currentCurrency" />
                      <div class="arrow" :class="{ up: isCurrencyOpen2 }">
                        <IconUniArrowDown />
                      </div>
                    </div>
                    <template #popper="{ hide }">
                      <div v-if="currencyList.length" class="scroll-y popper">
                        <a
                          v-for="c, i in currencyList" :key="i" class="popper-option currency-types"
                          @click="hide(); onChooseCurrency(c)"
                        >
                          <div>
                            <AppCurrencyIcon show-name :currency-type="c" />
                          </div>
                        </a>
                      </div>
                    </template>
                  </VDropdown>
                </div>
                <div class="btns">
                  <BaseButton
                    v-if="isLogin" class="real" size="sm" bg-style="secondary" :disabled="exclude"
                    @click="onSwitchRealMoneyMode(true)"
                  >
                    <div class="icon">
                      <IconUniPlay />
                    </div>
                    <span>{{ t('casino_game_real_money_mode') }}</span>
                  </BaseButton>
                  <BaseButton v-else class="real" size="sm" bg-style="secondary" @click="openRegisterDialog">
                    <div class="icon">
                      <IconUniPlay />
                    </div>
                    <span>{{ t('reg') }}</span>
                  </BaseButton>
                  <BaseButton
                    v-show="showTestMode" class="theme-icon" bg-style="red" size="sm" disabled
                    @click="onSwitchRealMoneyMode(false)"
                  >
                    <div class="icon">
                      <IconUniPlay />
                    </div>
                    <span>{{ t('casino_game_test_mode') }}</span>
                  </BaseButton>
                </div>
              </div>
            </div>
            <iframe v-if="isShowIframe" ref="gameFrameRef" :src="gameUrl" frameborder="0" allowfullscreen />
            <iframe v-if="isShowIframeDoc" ref="gameFrameRef" :srcdoc="gameUrl" frameborder="0" allowfullscreen />
          </div>

          <div class="footer">
            <div class="left">
              <!-- 全屏 -->
              <div class="icon-button" @click="onClickFullScreen">
                <IconUniFullScreen />
              </div>
              <!-- 影院模式 -->
              <VTooltip placement="top">
                <div
                  :style="isTheatre ? '--tg-icon-color:var(--tg-text-white)' : ''" class="icon-button"
                  @click="onClickTheatre"
                >
                  <IconUniTheatreOpen />
                </div>
                <template #popper>
                  <div class="tiny-menu-item-title">
                    {{ isTheatre ? t('casino_game_close_theatre')
                      : t('casino_game_open_theatre') }}
                  </div>
                </template>
              </VTooltip>

              <!-- 实时统计 -->
              <!-- <VTooltip placement="top">
                <div
                  class="icon-button"
                  :class="{ 'trend-open': isTrendOpen }"
                  @click="onClickTrend"
                >
                  <IconUniTrend />
                </div>
                <template #popper>
                  <div class="tiny-menu-item-title">
                    {{ isTrendOpen ? t('casino_game_close_trend')
                      : t('casino_game_open_trend') }}
                  </div>
                </template>
              </VTooltip> -->

              <!-- 收藏游戏 -->
              <VTooltip v-if="isLogin" placement="top">
                <div class="icon-button theme-favor" :class="{ 'is-isFavorite': isFavorite }" @click="onClickFavorite">
                  <IconUniFavorites />
                </div>
                <template #popper>
                  <div class="tiny-menu-item-title">
                    {{ isFavorite
                      ? t('casino_game_remove_favorite')
                      : t('casino_game_add_favorite') }}
                  </div>
                </template>
              </VTooltip>
              <div class="line" />

              <!-- 切换货币 -->
              <VDropdown v-if="isLogin" :distance="6" @show="setCurrencyOpen3" @hide="setCurrencyClose3">
                <div v-if="currentCurrency" class="current-currency">
                  <AppCurrencyIcon show-name :currency-type="currentCurrency" />
                  <div class="arrow" :class="{ up: isCurrencyOpen3 }">
                    <IconUniArrowDown />
                  </div>
                </div>
                <template #popper="{ hide }">
                  <div v-if="currencyList.length" class="scroll-y popper">
                    <a
                      v-for="c, i in currencyList" :key="i" class="popper-option currency-types"
                      @click="hide(); onChooseCurrency(c)"
                    >
                      <div>
                        <AppCurrencyIcon show-name :currency-type="c" />
                      </div>
                    </a>
                  </div>
                </template>
              </VDropdown>
            </div>
            <div class="logo">
              <BaseLogo />
            </div>
            <div class="right">
              <template v-if="showTestMode">
                <span :class="{ active: !isRealMoneyMode }">{{ t('casino_game_test_mode') }}
                </span>
                <BaseSwitch
                  v-model="isRealMoneyMode" class="switch" :disabled="!isLogin"
                  @change="onSwitchRealMoneyMode"
                />
                <span :class="{ active: isRealMoneyMode }">{{ t('casino_game_real_money_mode') }}
                </span>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.theme-secondary-btn {
  @include webTheme('white') {
    --tg-base-button-style-bg: #f2ca5c;
    color: #111111;
  }

  @include webTheme('green') {
    --tg-base-button-style-bg: #f2ca5c;
    color: #055434;
    --tg-icon-color: #055434;
  }
}

.theme-test-btn {
  @include webTheme('white') {
    --tg-base-button-style-bg: #e3e3e3;
    color: #555555;
    --tg-icon-color: #555555;
    --tg-base-button-disabled-opacity: 1;
  }

  @include webTheme('green') {
    --tg-base-button-style-bg: #0e6746;
    color: #5ecea6;
    --tg-icon-color: #5ecea6;
  }
}

.theme-icon {
  @include webTheme('green') {
    --tg-icon-color: #ffffff;
  }
}

.theme-favor {
  @include webTheme('green') {
    --tg-icon-color: #f2ca5c;
  }
}

.theme-arrow {
  @include webTheme('green') {
    --tg-icon-color: #5ecea6;
  }
}

.mobile-game-frame {
  iframe {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100%;
    height: 100vh;
    // height: 100dvh;
    border: none;
    z-index: 99;
  }

  .top-operation {
    --tg-icon-color: white;
    top: 0;
    left: 0;
    color: white;
    z-index: 100;

    .item {
      width: 52px;
      height: 52px;
      border: 1px solid white;
      border-radius: 50px;
    }
  }
}

.mobile-iframe-new-stake {
  width: 100%;

  .top {
    width: 100%;
    padding: 16px 16px 19px;
    background-color: var(--tg-secondary-dark);
    border-radius: 4px 4px 0px 0px;
    color: var(--tg-text-white);
    display: grid;
    grid-gap: var(--tg-spacing-16);
    grid-template-columns: minmax(100px, 40%) auto;

    @include webTheme('white') {
      background: #f5f5f5;
      color: #111111;
      font-weight: 500;
    }

    @include webTheme('green') {
      background-color: #02432d;
      border-bottom: 1px solid #197b59;
    }

    .img-wrap {
      position: relative;

      .img {
        width: 100%;
        height: 100%;
        border-radius: var(--tg-radius-md);
        overflow: hidden;
      }
    }

    .right {
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      justify-content: space-between;

      .game-name {
        font-size: 18px;
        line-height: 25px;
      }

      .game-provider {
        color: var(--tg-text-lightgrey);

        @include webTheme('white') {
          color: #555555;
        }

        @include webTheme('green') {
          color: #3cb389;
        }
      }

      .real {
        --tg-icon-color: var(--tg-text-black);

        @include webTheme('green') {
          --tg-icon-color: #055434;
        }

        &:hover {
          --tg-icon-color: #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.5)};
        }
      }

      .reg-btn {
        @include webTheme('greenblack') {
          --tg-base-button-style-bg: #26ffbe;
        }
      }

      .reg-text {
        @include webTheme('greenblack') {
          color: #05080a;
        }
      }

      .choose-text {
        font-size: 14px;
        line-height: 20px;
        margin-bottom: 17px;
      }

      .currency {
        display: grid;
        align-items: center;
        gap: var(--tg-spacing-8);
        grid-auto-flow: column;
        justify-content: flex-start;
        font-size: 14px;

        span {
          color: var(--tg-text-lightgrey);

          @include webTheme('white') {
            color: #555555;
          }
        }

        .current-currency {
          color: var(--tg-text-white);
          font-weight: var(--tg-font-weight-semibold);
          border-radius: var(--tg-radius-default);
          padding: 3.5px 4px;
          display: flex;
          align-items: center;
          // gap: var(--tg-spacing-8);
          cursor: pointer;

          @include webTheme('white') {
            color: #111111;
          }

          &:hover {
            --tg-icon-color: var(--tg-text-white);

            @include webTheme('green') {
            }
          }

          &:active {
            transform: scale(0.98);
          }

          .arrow {
            margin-left: var(--tg-spacing-8);
            font-size: var(--tg-font-size-default);
            display: flex;
            align-items: center;

            &.up {
              transform: rotate(180deg);
            }
          }
        }
      }
    }
  }

  .bottom {
    border-radius: 0px 0px 4px 4px;
    background: #203441;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;

    @include webTheme('green') {
      background: #055434;
    }

    @include webTheme('white') {
      background: #e8e8e8;
    }

    .icon-button {
      font-size: 18px;
      padding: 10px;

      @include webTheme('white') {
        --tg-icon-color: #555;
      }

      &.is-isFavorite {
        --tg-icon-color: #00e701;

        @include webTheme('white') {
          --tg-icon-color: #f2ca5c;
        }

        @include webTheme('green') {
          --tg-icon-color: #f6d14a;
        }

        @include webTheme('new-default') {
          --tg-icon-color: #00e701;
        }
      }
    }
  }
}

.info-box {
  width: 100%;
  display: flex;
  border-radius: 4px;
  background-color: var(--tg-secondary-dark);
  padding: 0 20px;
  height: 65px;
  margin-top: 13px;
  color: var(--tg-text-lightgrey);
  justify-content: space-between;
  font-size: 14px;
  align-items: center;
  margin-bottom: 15px;
  font-weight: 600;

  @include webTheme('green') {
    background-color: #02432d;
  }

  .game-name {
    line-height: 25px;
    font-size: 18px;
    color: var(--tg-text-white);
  }

  .light-text {
    color: #00e701;

    @include webTheme('green') {
      color: #f6d14a;
    }

    @include webTheme('white') {
      color: #ffaa09;
    }
  }
}

// pc模式
.app-iframe {
  width: 100%;
  max-width: 1200px;
}

.t-app-iframe {
  max-width: 148vh;
}

.game-wrapper {
  margin-top: 3vw;
}

.b-game-wrapper {
  margin-top: var(--tg-spacing-40);
}

.t-game-wrapper {
  margin-top: 0;
  display: contents;
}

.content-wrapper {
  overflow: hidden;
  background: var(--tg-secondary-dark);
  border-radius: var(--tg-radius-md);
}

.t-content-wrapper {
  --header-height: 60px;
  height: calc(100vh - var(--header-height));
}

.content {
  .iframe-wrapper {
    height: 100%;
    max-height: unset;
    position: relative;

    &::before {
      content: '';
      display: block;
      width: 100%;
      padding-top: 56.25%;
    }

    .iframe-menu-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #{rgba($color: var(--tg-color-grey-rgb), $alpha: 0.9)};
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      @include webTheme('green') {
        background: var(--tg-primary-main);
      }

      .content {
        display: flex;
        flex-direction: column;

        .currency {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--tg-text-lightgrey);
          font-size: var(--tg-font-size-default);
          margin-bottom: var(--tg-spacing-8);

          span {
            margin-right: var(--tg-spacing-8);
          }

          .current-currency {
            color: var(--tg-text-white);
            font-weight: var(--tg-font-weight-semibold);
            background-color: var(--tg-secondary-dark);
            border-radius: var(--tg-radius-default);
            padding: var(--tg-spacing-4);
            display: flex;
            align-items: center;
            cursor: pointer;

            div:first-of-type {
              margin-right: var(--tg-spacing-8);
            }

            &:hover {
              background-color: var(--tg-popper-hover-bg);
              --tg-icon-color: var(--tg-text-white);

              @include webTheme('green') {
                background-color: #317459;
                --tg-app-currency-icon-style-color: #076237;
                --tg-icon-color: #5ecea6;
              }
            }

            &:active {
              transform: scale(0.98);
            }

            .arrow {
              font-size: var(--tg-font-size-default);
              display: flex;
              align-items: center;

              // transition: var(--tg-transition);
              &.up {
                transform: rotate(180deg);
              }
            }
          }
        }
      }
    }

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
    }
  }

  .t-iframe-wrapper {
    max-height: calc(100vh - var(--header-height) - 63px);
  }

  .footer {
    height: 63px;
    padding: var(--tg-spacing-8);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    background: var(--tg-secondary-dark);
    color: var(--tg-text-lightgrey);

    .left {
      font-size: var(--tg-font-size-default);
      display: flex;
      align-items: center;
      padding-right: var(--tg-spacing-8);

      .line {
        width: 1px;
        height: 40px;
        background-color: var(--tg-secondary-main);
        margin-right: var(--tg-spacing-16);
      }

      .current-currency {
        color: var(--tg-text-white);
        font-weight: var(--tg-font-weight-semibold);
        background-color: var(--tg-secondary-dark);
        border-radius: var(--tg-radius-default);
        padding: var(--tg-spacing-4);
        display: flex;
        align-items: center;
        cursor: pointer;

        div:first-of-type {
          margin-right: var(--tg-spacing-8);
        }

        &:hover {
          background-color: var(--tg-popper-hover-bg);
          --tg-icon-color: var(--tg-text-white);

          @include webTheme('green') {
            background-color: #317459;
            --tg-app-currency-icon-style-color: #076237;
            --tg-icon-color: #5ecea6;
          }
        }

        &:active {
          transform: scale(0.98);
        }

        .arrow {
          font-size: var(--tg-font-size-default);
          display: flex;
          align-items: center;
          transition: var(--tg-transition);

          &.up {
            transform: rotate(180deg);
            
          }
        }
      }
    }

    .logo {
      font-size: 68px;
    }

    .right {
      display: flex;
      align-items: center;
      font-size: var(--tg-font-size-default);
      padding-right: var(--tg-spacing-24);
      cursor: pointer;
      font-weight: var(--tg-font-weight-semibold);

      &:active {
        transform: scale(0.96);
      }

      .switch {
        margin: 0 var(--tg-spacing-8);
      }

      .active {
        color: var(--tg-text-white);
      }
    }
  }
}

.t-content {
  height: 100%;
}

// 共用
// 图标按钮
.icon-button {
  padding: var(--tg-spacing-button-padding-vertical-sm) var(--tg-spacing-button-padding-horizontal-sm);
  cursor: pointer;
  display: flex;
  align-items: center;

  &:active {
    transform: scale(0.96);
  }
}

.trend-open,
.is-isFavorite {
  --tg-icon-color: var(--tg-text-white);
}

.popper {
  display: flex;
  flex-direction: column;
  max-height: 342px;

  &::-webkit-scrollbar-thumb {
    background: var(--tg-secondary-light);
  }

  .currency-types {
    width: 100%;
    height: 100%;
    font-size: var(--tg-font-size-default);
    font-weight: var(--tg-font-weight-semibold);

    &:active {
      div {
        transform: scale(0.98);
      }
    }

    &:hover {
      background-color: var(--tg-popper-hover-bg);
    }
  }
}

.popper-mobile {
  max-height: 342px;
}

.btns {
  display: flex;
  align-items: center;
  padding: var(--tg-spacing-12);

  button:first-of-type {
    margin-right: var(--tg-spacing-8);
  }

  .icon {
    margin-right: var(--tg-spacing-10);
    display: flex;
    align-items: center;
  }

  .real {
    --tg-icon-color: var(--tg-text-black);

    @include webTheme('green') {
      --tg-icon-color: #055434;
    }

    &:hover {
      --tg-icon-color: #{rgba($color: var(--tg-color-black-rgb), $alpha: 0.5)};
    }
  }
}

.btns-mobile {
  justify-content: space-between;
  padding: 0;
  gap: 0;

  .btn {
    width: 49%;
  }

  .btn:nth-of-type(1) {
    margin-right: 4px;
  }

  .btn:nth-of-type(2) {
    margin-left: 4px;
  }
}

.rtp-style {
  color: var(--tg-text-lightgrey);

  @include webTheme('white') {
    color: #f2ca5c;
  }

  @include webTheme('green') {
    color: #76f0c5;
  }
}
</style>

<script setup lang='ts'>
import type { ICartInfo, ISportListToCartData } from '~/types'

interface Props {
  layout?: 'horizontal' | 'vertical' | 'center' | 'horizontal-center'
  disabled?: boolean
  isNa?: boolean
  title: string
  odds: string
  cartInfo: ICartInfo
  isHandicap?: boolean
  hdp?: string
  horizontalCenterOnPc?: boolean
  lobby?: boolean
}
defineOptions({
  name: 'AppSportsBetButton',
})
const props = withDefaults(defineProps<Props>(), {
  layout: 'vertical',
  lobby: false,
})

const betButton = ref<HTMLElement | null>(null)

const windowStore = useWindowStore()
const sportStore = useSportsStore()
const { t } = useI18n()
const { openRightSidebar, rightIsExpand, currentRightSidebarContent } = useRightSidebar()
const { isMobile } = storeToRefs(windowStore)
const { isCompleteKYC, isLogin } = storeToRefs(useAppStore())
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())
/** KYC弹窗 */
const { openKYCDialog } = useDialogKYCVerify()

const listToCartData = ref<ISportListToCartData>({
  wid: props.cartInfo.wid,
  ov: props.odds,
  os: props.disabled ? 0 : 1,
  mlid: props.cartInfo.mlid,
})
const _disabled = ref(props.disabled || +listToCartData.value.ov === 0)
const isZeroOdd = computed(() => +listToCartData.value.ov === 0)
/** 中文版新设计 */
const isLayoutCenter = computed(() => props.layout === 'center')
/** 箭头-盘口-赔率(结构) */
const isHorizontalCenter = computed(() => props.layout === 'horizontal-center')
/** 中文版弹出层新设计 */
const isHorizontalCenterOnPc = computed(() => props.horizontalCenterOnPc && !isMobile.value)
/** 箭头位置 */
const arrowSide = computed(() => {
  if (isHorizontalCenterOnPc.value)
    return 'right'

  else if (props.layout === 'horizontal' || isLayoutCenter.value || isHorizontalCenter.value)
    return 'left'

  return 'right'
})
/** 箭头定位 */
const arrowStrategy = computed(() => isLayoutCenter.value || isHorizontalCenter.value ? 'absolute' : 'relative')

function clickHandler() {
  if (isZeroOdd.value)
    return

  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value)
    return openKYCDialog()

  if (!rightIsExpand.value && !isMobile.value)
    openRightSidebar(EnumRightSidebarContent.BETTING)

  else if (currentRightSidebarContent.value !== EnumRightSidebarContent.BETTING && !isMobile.value)
    openRightSidebar(EnumRightSidebarContent.BETTING)

  if (sportStore.cart.checkWid(props.cartInfo.wid)) {
    sportStore.cart.remove(props.cartInfo.wid)
  }
  else if (_disabled.value) {
    return ''
  }
  else {
    sportStore.cart.add(props.cartInfo)
    if (isMobile.value)
      mobileDomTransition()

    else
      pcDomTransition()
  }
}

function pcDomTransition() {
  if (document.querySelector('.app-sports-bet-slip')) {
    setTimeout(() => {
      startDomTransition()
    }, 30)
  }
}

function mobileDomTransition() {
  startDomTransition()
}

function startDomTransition() {
  const startDom = betButton.value
  const endDom = isMobile.value ? document.getElementById(EnumSportEndDomID.H5_CART_END_DOM) : document.getElementById(EnumSportEndDomID.PC_CART_END_DOM)
  const sportsBetSlipDom = document.querySelector('.app-sports-bet-slip') as HTMLElement
  let topOffset = '0px'

  if (sportsBetSlipDom)
    topOffset = getStyle(sportsBetSlipDom, 'height')

  if (!startDom || !endDom)
    return

  domTransition(startDom, endDom, {
    topOffset: Number.parseFloat(topOffset),
  })
}

/** 数据改变，向购物车发送数据 */
function listToCartEventEmit() {
  appEventBus.emit(EventBusNames.SPORTS_LIST_TO_CART_BUS, listToCartData.value)
}
/** 处理列表通知发送的数据 */
function eventHandler(_data: ISportListToCartData) {
  if (_data.mlid === props.cartInfo.mlid) {
    listToCartData.value.os = _data.os
    _disabled.value = _data.os === 0
    if (_data.wid === listToCartData.value.wid)
      listToCartData.value.ov = _data.ov
  }
}
/** 监听列表发送的事件 */
function addCartToListEvent() {
  appEventBus.on(EventBusNames.SPORTS_CART_TO_LIST_BUS, eventHandler)
}
/** 移除列表发送的事件 */
function removeCartToListEvent() {
  appEventBus.off(EventBusNames.SPORTS_CART_TO_LIST_BUS, eventHandler)
}

watch(() => props.disabled, (val) => {
  _disabled.value = val
  listToCartData.value.os = val ? 0 : 1
  listToCartEventEmit()
})
watch(() => props.odds, (val) => {
  listToCartData.value.ov = val
  listToCartEventEmit()
})

onMounted(() => {
  addCartToListEvent()
})
onBeforeUnmount(() => {
  removeCartToListEvent()
})
</script>

<template>
  <div
    ref="betButton" class="app-sports-bet-button" :class="{
      'active': sportStore.cart.checkWid(props.cartInfo.wid) && !_disabled && !isZeroOdd,
      'disabled': _disabled || isZeroOdd,
      'is-na': isNa,
      'lobby': lobby,
    }" :title="isTestEnv()
      ? JSON.stringify(cartInfo).replaceAll(',', ',\n').replaceAll('{', '{\n').replaceAll('}', '\n}')
      : ''
    " @click.stop="clickHandler"
  >
    <template v-if="isNa">
      <span class="status">N/A</span>
    </template>
    <!-- <div v-else-if="_disabled" class="content" :class="[layout, { isHorizontalCenterOnPc }]">
      <div class="name">
        {{ title || '-' }}
      </div>
      <span class="status">{{ t('sports_status_timeout') }}</span>
    </div> -->
    <AppSportsOutcomeLocked v-else-if="_disabled || isZeroOdd" size="none" />
    <div v-else class="content" :class="[layout, { isHorizontalCenterOnPc }]">
      <div class="name th-leading-[8px]">
        {{ title || '-' }}
      </div>
      <div class="odds-box">
        <AppSportsOdds
          :style="`--tg-sports-odds-color: ${sportStore.cart.checkWid(props.cartInfo.wid) ? 'var(--tg-text-black)' : ''};
          --tg-sports-odds-font-size:${isLayoutCenter || isHorizontalCenter ? '12px' : ''};
          --tg-sports-odds-arrow-absolute-left:${isHorizontalCenter ? '-27px' : ''}
          `"
          :arrow="arrowSide" :odds="listToCartData.ov || '0.00'" :arrow-position="arrowStrategy"
        />
        <div v-if="isHandicap" class="name">
          {{ hdp }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
:root {
  --sports-bet-button-font-size: var(--tg-font-size-default);
  --sports-bet-button-padding-x: 0.75em;
  --sports-bet-button-padding-y: 0.6em;
  --sports-bet-button-bg: var(--tg-secondary-dark);
}
</style>

<style lang='scss' scoped>
.app-sports-bet-button {
  background: var(--sports-bet-button-bg);
  border-radius: var(--tg-radius-default);
  transition: all .1s;
  width: 100%;
  height: 100%;
  position: relative;
  font-size: var(--sports-bet-button-font-size);
  color: var(--tg-text-white);
  min-width: 0;
  padding: var(--sports-bet-button-padding-y) var(--sports-bet-button-padding-x);
  line-height: 1.5;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  @include webTheme('greenblack') {
    background: var(--tg-primary-main);
  }
  .content {
    display: flex;
    width: 100%;
    height: 100%;

    .name {
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    // 水平
    &.horizontal {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
// 垂直
    &.vertical {
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;

      .odds-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
// 上下居中
    &.center {
      flex-direction: column;
      align-items: center;
      justify-content: center;
      // gap: 2px;
      >* {
        margin-bottom: 2px;
      }
      >:last-child {
        margin-bottom: 0;
      }
      .name,.odds-box{
        height: 16px;
        display: flex;
        align-items: center;
      }
    }
// 水平居中pc
    &.isHorizontalCenterOnPc {
      justify-content: center;
      // gap: 58px;
      >* {
        margin-right: 58px;
      }
      >:last-child {
        margin-right: 0;
      }

      .name {
        width: 100%;
        text-align: right;
      }
      .status{
        text-align: left;
      }

      .odds-box {
        width: 100%;
      }
    }
    // 水平居中 箭头在盘口左边
    &.horizontal-center {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 2px;

      .name, .status {
        flex: none;
      }
    }
  }

  // &:hover {
  //  background: var(--tg-bet-button-deepblue);
  // }

  // &:active {
  //  .content {
  //    transform: scale(0.96);
  //  }
  // }

  &.active {
    background: var(--tg-text-blue);
    box-shadow: var(--tg-box-shadow-lg);
    @include webTheme('white') {
      background: #f2ca5c;
    }
    @include webTheme('green') {
      background: #FFEFB0;
    }
    .name {
      font-weight: var(--tg-font-weight-semibold);
      color: var(--tg-text-black);
    }
  }

  &.disabled {
    .name {
      opacity: 0.2;
      flex: 1;
    }

    .status {
      opacity: 0.4;
      max-width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
      text-align: right;
    }
  }

  &.is-na {
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;

    .status {
      opacity: 0.2;
      white-space: nowrap;
    }
  }
}
</style>

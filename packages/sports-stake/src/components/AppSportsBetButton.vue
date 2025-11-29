<script setup lang='ts'>
import type { ICartInfo, ISportListToCartData } from '@tg/types'
import { useAppStore, useBrandStore, useSportsStore } from '@tg/stores'
import { EnumSportEndDomID, ESportsToMainPageRoutes, EventBusNames } from '@tg/types'
import { appEventBus, domTransition, getStyle, isTestEnv } from '@tg/utils'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppSportsOdds from './AppSportsOdds.vue'
import AppSportsOutcomeLocked from './AppSportsOutcomeLocked.vue'

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

const sportStore = useSportsStore()
const { isCompleteKYC, isLogin } = storeToRefs(useAppStore())
const { isKYCVerifyOpen } = storeToRefs(useBrandStore())

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
/** 箭头位置 */
const arrowSide = computed(() => {
  if (props.layout === 'horizontal' || isLayoutCenter.value || isHorizontalCenter.value)
    return 'left'

  return 'right'
})
/** 箭头定位 */
const arrowStrategy = computed(() => isLayoutCenter.value || isHorizontalCenter.value ? 'absolute' : 'relative')

function clickHandler() {
  if (isZeroOdd.value)
    return

  /** 增加kyc逻辑 */
  if (isLogin.value && isKYCVerifyOpen.value && !isCompleteKYC.value) {
    appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.KYC })
    return
  }

  if (sportStore.cart.checkWid(props.cartInfo.wid)) {
    sportStore.cart.remove(props.cartInfo.wid)
  }
  else if (_disabled.value) {
    return ''
  }
  else {
    sportStore.cart.add(props.cartInfo)
    mobileDomTransition()
  }
}

function mobileDomTransition() {
  startDomTransition()
}

function startDomTransition() {
  const startDom = betButton.value
  const endDom = document.getElementById(EnumSportEndDomID.H5_CART_END_DOM)
  const sportsBetSlipDom = document.querySelector('.app-sports-bet-slip') as HTMLElement
  let topOffset = '0px'

  if (sportsBetSlipDom)
    topOffset = getStyle(sportsBetSlipDom, 'height')

  if (!startDom || !endDom)
    return

  domTransition(startDom, endDom, {
    topOffset: Number.parseFloat(topOffset),
    backgroundColor: 'var(--ss-spt-bet-button-bg1)',
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
    <AppSportsOutcomeLocked v-else-if="_disabled || isZeroOdd" size="none" />
    <div v-else class="content" :class="[layout]">
      <div class="name th-leading-8">
        {{ title || '-' }}
      </div>
      <div class="odds-box">
        <AppSportsOdds
          :style="`--ss-sports-odds-color: ${sportStore.cart.checkWid(props.cartInfo.wid) ? 'var(--ss-spt-bet-button-color1)' : ''};
          --ss-sports-odds-font-size:${isLayoutCenter || isHorizontalCenter ? '12rem' : ''};
          --ss-sports-odds-arrow-absolute-left:${isHorizontalCenter ? '-27rem' : ''}
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
  --sports-bet-button-font-size: 14rem;
  --sports-bet-button-padding-x: 0.75em;
  --sports-bet-button-padding-y: 0.6em;
  --sports-bet-button-bg: #f6f7f8;
  --sports-bet-button-color: #0d2245;
}
</style>

<style lang='scss' scoped>
.app-sports-bet-button {
  background: var(--sports-bet-button-bg);
  border-radius: 4rem;
  transition: all 0.1s;
  width: 100%;
  height: 100%;
  position: relative;
  font-size: var(--sports-bet-button-font-size);
  color: var(--sports-bet-button-color);
  min-width: 0;
  padding: var(--sports-bet-button-padding-y) var(--sports-bet-button-padding-x);
  line-height: 1.5;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
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
      justify-content: space-between;
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
      > * {
        margin-bottom: 2rem;
      }
      > :last-child {
        margin-bottom: 0;
      }
      .name,
      .odds-box {
        height: 16rem;
        display: flex;
        align-items: center;
      }
    }

    // 水平居中 箭头在盘口左边
    &.horizontal-center {
      align-items: center;
      justify-content: center;
      > * {
        margin-right: 2rem;
      }
      > :last-child {
        margin-right: 0;
      }
      .name,
      .status {
        flex: unset;
      }
    }
  }

  &.active {
    background: var(--ss-spt-bet-button-bg1);
    .name {
      font-weight: 600;
      color: var(--ss-spt-bet-button-color2);
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

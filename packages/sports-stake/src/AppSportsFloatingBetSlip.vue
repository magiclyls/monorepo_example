<script setup lang='ts'>
import type { IBetArgs, ISportListToCartData } from '@tg/types'
import BScroll from '@better-scroll/core'
import { ApiSportPlaceBet, ApiSportPlaceBetInfo } from '@tg/apis'
import { BaseImage, SSAppAmount, SSBaseButton, SSBaseCurrencyIcon, SSBaseEmpty, SSBaseInput, SSBaseNumericKeypad, SSBaseSelect, SSBaseTabs } from '@tg/bccomponents'
import { useBoolean, useSelect } from '@tg/hooks'
import { IconNavbarBet, IconNavbarBetMult, IconNavbarUser, IconSptUserBet, IconUniArrowDown1, IconUniStakeArrowDown, IconUniWarningColor } from '@tg/icons'
import { useAppStore, useCurrency, useSportsStore } from '@tg/stores'
import {
  EnumOddsChange,
  EnumsBetSlipBetSlipTabStatus,
  EnumsBetSlipHeadStatus,
  ESportsToMainPageRoutes,
  EventBusNames,
} from '@tg/types'
import { appEventBus, application, formatTitleData, getEnv, getSportMultiPtByLength, Local, mul, STORAGE_SPORTS_BET_ORDER, toFixed } from '@tg/utils'
import { useElementSize } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { useField } from 'vee-validate'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../config/index'
import AppSportCartToAllEvent from './components/AppSportCartToAllEvent.vue'
import AppSportsBetSlip from './components/AppSportsBetSlip.vue'
import AppSportsOdds from './components/AppSportsOdds.vue'

defineOptions({
  name: 'AppSportsFloatingBetSlip',
})
const emit = defineEmits(['changeHeadSelectValue', 'getBetList'])

const chatScrollContent = ref<HTMLElement | null>(null)
const { VITE_SPORT_MULTI_BET_MAX } = getEnv()
const { projectName } = useSportsConfig()

let timer: any = null
const {
  bool: betLoading,
  setTrue: setBetLoadingTrue,
  setFalse: setBetLoadingFalse,
} = useBoolean(false)
const { t } = useI18n()
const appStore = useAppStore()
const sportCartToAllEventRef = ref()
// 获取betInfo接口是否成功
const { bool: fetchBetInfoStatus, setBool: setFetchBetInfoStatus } = useBoolean(true)
const { isLogin } = storeToRefs(appStore)
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
const sportStore = useSportsStore()
const suffixLength = computed(() => currentGlobalCurrencyMap.value.decimal)
const {
  value: duplexInputValue,
  errorMessage: duplexAmountErr,
  resetField: resetDuplexInputValue,
} = useField<number | string>('amount', (value) => {
  if (+value < sportStore.cart.multiMia)
    return t('每次投注至少下注', { amount: application.formatNumDecimal(sportStore.cart.multiMia, suffixLength.value) })
  if (+value > sportStore.cart.multiMaa)
    return t('每次投注最多下注', { amount: application.formatNumDecimal(sportStore.cart.multiMaa, suffixLength.value) })
  return ''
}, { initialValue: application.formatNumDecimal(0, suffixLength.value) })

const { bool: keyboardBool, setBool: setKeyBoardBool } = useBoolean(false)

/** 快捷金额按钮 */
const quickBetAmountBtns = ref<Array<number>>([])
const { bool: showBall } = useBoolean(true)

const {
  runAsync: runGetSportPlaceBetInfo,
} = useRequest(ApiSportPlaceBetInfo, {
  onSuccess(placeBetInfo) {
    setFetchBetInfoStatus(true)

    // 用来调试赔率变化的错误信息的
    // if (placeBetInfo.wsi && placeBetInfo.wsi.length > 0)
    //   placeBetInfo.wsi[0].ov = '0.01'

    sportStore.cart.updateAllData(
      cloneDeep(placeBetInfo),
      (_data) => {
        sendSportsCartToListEvent(_data.osOvIsChangeList)
      },
    )
    quickBetAmountBtns.value = placeBetInfo.qck && placeBetInfo.qck.length > 0 ? placeBetInfo.qck : []
    // 复式的最低投注额
    if (placeBetInfo.bi && placeBetInfo.bi.length > 0 && (!duplexInputValue.value || +duplexInputValue.value === 0))
      duplexInputValue.value = application.formatNumDecimal(placeBetInfo.bi[0].mia, suffixLength.value)

    // 如果当前数据里面有关盘的数据，需要重新过滤掉关盘数据重新请求 betinfo
    const { bi, wsi } = placeBetInfo
    if (
      (bi && bi.length > 0 && bi.some(a => +a.ov === 0))
      || (wsi && wsi.length > 0 && wsi.some(a => +a.os === 0))
      || !bi
    ) {
      runGetSportPlaceBetInfoHandle(true)
    }
  },
  onError() {
    setFetchBetInfoStatus(false)
    closeSetInterval()
  },
})

const betCount = computed(() => {
  return sportStore.cart.count
})
const selectTabsOne = computed(() => [
  {
    label: t('单项投注'),
    value: EnumsBetSlipBetSlipTabStatus.single,
    icon: IconNavbarBet,
  },
  {
    label: t('复式投注'),
    value: EnumsBetSlipBetSlipTabStatus.multi,
    icon: IconNavbarBetMult,
  },
])

const selectTabsTwo = computed(() => [
  { label: t('接受任何赔率'), value: EnumOddsChange.acceptAnyOddsChange },
  { label: t('只接受更高的赔率'), value: EnumOddsChange.acceptHigherOdds },
  /*   { label: t('不接受任何赔率更改'), value: EnumOddsChange.notAcceptAnyOddsChange },  需求STAK-22227 */
])

const {
  selected: betOrderSelectValue,
  list: betOrderData,
} = useSelect(selectTabsOne.value)
initBetOrderTab()

const {
  selected: betOrderFilterValue,
  list: betOrderFilterData,
} = useSelect(selectTabsTwo.value)

let setAmount = (_value: number) => { }
let deleteAmount = () => { }

/** 单式投注 */
const isBetSingle = computed(
  () => betOrderSelectValue.value === EnumsBetSlipBetSlipTabStatus.single,
)
/** 复式投注 */
const isBetMulti = computed(
  () => betOrderSelectValue.value === EnumsBetSlipBetSlipTabStatus.multi,
)
const betBtnText = computed(() => {
  if (sportStore.cart.count === 1)
    return betOrderData.value.find(b => b.value === EnumsBetSlipBetSlipTabStatus.single)?.label ?? '-'

  if (betOrderSelectValue.value === EnumsBetSlipBetSlipTabStatus.multi)
    return t('复式投注')

  if (betOrderSelectValue.value === EnumsBetSlipBetSlipTabStatus.single)
    return t('单项投注')

  return betOrderData.value.find(b => b.value === betOrderSelectValue.value)?.label ?? '-'
})
/** 购物车数据 */
const cartDataList = computed(() => {
  return sportStore.cart.dataList.slice().reverse()
})
/** 所有注单金额相同时的金额 */
const currentQuickBetAmount = computed(() => {
  if (cartDataList.value.length > 0) {
    if (isBetMulti.value)
      return +duplexInputValue.value

    if (cartDataList.value.length === 1)
      return +cartDataList.value[0].amount

    // 如果所有注单金额相同
    const firstAmount = cartDataList.value[0].amount
    if (cartDataList.value.every(a => +a.amount === +firstAmount))
      return +firstAmount

    return -1
  }
  else {
    return -1
  }
})
/** 购物车注单金额错误信息 */
const errorMsgOnCartDataList = computed(() => {
  return cartDataList.value.find(a => a.errorMsg)?.errorMsg ?? ''
})
/** 当前赔率发生变化的注单的个数 */
const numOfCartOvIsChange = computed(() => {
  return cartDataList.value.filter(a => a.ovIsChange).length
})

/** 您的投注额不能超过余额 */
const isBetAmountOverBalance = computed(() => {
  if (isBetSingle.value)
    return +currentGlobalCurrencyMap.value.balance < +sportStore.cart.totalPay

  else return +currentGlobalCurrencyMap.value.balance < Number(duplexInputValue.value)
})
/** 错误信息 */
const errorInfo = computed<{
  /** 是否显示错误提示 */
  bool: boolean
  /** 错误提示信息 */
  errorMess: string
  /** 针对赔率专门返回一个值，用来是否显示接受赔率变化按钮 */
  isShowAcceptOddsBtn?: boolean
  /** 是否需要展示货币icon */
  isShowCurrency?: boolean
}>(() => {
  if (sportStore.cart.count === 0 || !isLogin.value) {
    return {
      bool: false,
      errorMess: '',
    }
  }

  if (sportStore.cart.isSupportCurrency === false) {
    return {
      bool: true,
      errorMess: t('该场馆暂不支持您所选择的币种'),
    }
  }

  // 获取投注信息失败
  if (fetchBetInfoStatus.value === false) {
    return {
      bool: true,
      errorMess: t('获取投注信息失败'),
    }
  }

  // 不接受任何赔率变化
  if (betOrderFilterValue.value === EnumOddsChange.notAcceptAnyOddsChange) {
    // 赔率变化
    if (sportStore.cart.ovIsChange) {
      return {
        bool: true,
        errorMess: t('赔率已变更'),
        isShowAcceptOddsBtn: true,
      }
    }
  }

  if (betOrderFilterValue.value === EnumOddsChange.acceptHigherOdds) {
    // 赔率变化
    if (sportStore.cart.ovIsChange) {
      // 有更低的赔率变化
      if (sportStore.cart.ovIsLower) {
        return {
          bool: true,
          errorMess: t('赔率已变更'),
          isShowAcceptOddsBtn: true,
        }
      }
    }
  }

  // 如果是复式投注，判断是否存在同一赛事的多重投注项
  if (isBetMulti.value) {
    if (sportStore.cart.getExistSameEventIdList.length) {
      return {
        bool: true,
        errorMess: t('同一场赛事的多个投注项不能组合为复式投注'),
      }
    }

    if (
      sportStore.cart.getNotSupportWidList.length
      || sportStore.cart.getExistIcList.length
    ) {
      return {
        bool: true,
        errorMess: t('您有不支持复式投注的投注项'),
      }
    }

    if (sportStore.cart.getOddsLessThanOnePointOneWidList.length) {
      return {
        bool: true,
        errorMess: t('赔率小于1'),
      }
    }

    if (+sportStore.cart.multiMia === 0 && +sportStore.cart.multiMaa === 0) {
      return {
        bool: true,
        errorMess: t('复式投注赔率超过上限'),
      }
    }
  }

  if (sportStore.cart.count > VITE_SPORT_MULTI_BET_MAX) {
    return {
      bool: true,
      errorMess: t('同时最多只能添加', { max: VITE_SPORT_MULTI_BET_MAX }),
    }
  }

  // 您的投注单里不能包含有暂停或已关闭的盘口投注项
  if (sportStore.cart.isExistCloseCaps) {
    return {
      bool: true,
      errorMess: t('您有暂停的投注项'),
    }
  }

  // 余额不足
  if (isBetAmountOverBalance.value) {
    return {
      bool: true,
      errorMess: t('您的投注额不能大于余额'),
    }
  }

  // 投注金额超出限额
  if (errorMsgOnCartDataList.value) {
    return {
      bool: true,
      errorMess: errorMsgOnCartDataList.value,
      isShowCurrency: true,
    }
  }
  if (duplexAmountErr.value && isBetMulti.value) {
    return {
      bool: true,
      errorMess: duplexAmountErr.value,
      isShowCurrency: true,
    }
  }

  // 金额是不是10的倍数
  if (sportStore.cart.isTenMultiple && sportStore.cart.isTenMultipleBool) {
    return {
      bool: true,
      errorMess: t('只支持10的整数倍的投注金额'),
    }
  }

  return {
    bool: false,
    errorMess: '',
  }
})
/** 需要禁用并隐藏placeholder */
const isNeedDisabledAndClearPlaceholder = computed(() => !sportStore.cart.isSupportCurrency || !fetchBetInfoStatus.value)
/** 投注按钮是否禁用 */
const isBetBtnDisabled = computed(() => {
  if (sportStore.cart.count === 0)
    return true

  if (isBetAmountOverBalance.value)
    return true

  if (isBetSingle.value) {
    /**
     * 单式投注
     *判断 sportStore.cart.dataList 中的每一项的amount是否为0
     */
    const isAmountZero = sportStore.cart.dataList.some(item => item.amount <= 0)
    if (isAmountZero)
      return true
  }
  else {
    /**
     * 复式投注
     * 判断 duplexInputValue.value 是否小于等于0
     */
    if (Number(duplexInputValue.value) <= 0)
      return true
  }

  if (errorInfo.value.bool)
    return true
})

/** 复式总赔率 */
const duplexOv = computed(() => {
  if (sportStore.cart.count === 0)
    return '0.00'

  const v = sportStore.cart.dataList.reduce((prev, cur) => {
    return +mul(prev, +cur.ov)
  }, 1)

  return toFixed(v, 2)
})

/** 复式tab下的预计支付额 */
const duplexTotalProfit = computed(() => {
  const _duplexOv = Number(duplexOv.value)
  const val = Number(duplexInputValue.value)
  return mul(_duplexOv, val)
})

const isShowH5Keyboard = computed(() => {
  if (keyboardBool.value)
    return true

  return false
})

/**
 * 投注请求
 * @param list 投注列表
 */
async function fetchBet(list: IBetArgs[]) {
  const promiseList = list.map(item => ApiSportPlaceBet(item))
  const result = await Promise.allSettled(promiseList)
  setBetLoadingFalse()

  const successList = result.filter(item => item.status === 'fulfilled')

  const successWidList = list.filter((item, index) => result[index].status === 'fulfilled').map(item => item.bl[0].bi[0].wid)
  const failWidList = list.filter((item, index) => result[index].status === 'rejected').map(item => item.bl[0].bi[0].wid)

  console.log('successWidList', successWidList)
  console.log('failWidList', failWidList)

  // 单式
  if (isBetSingle.value) {
    list.forEach((item, index) => {
      const wid = item.bl[0].bi[0].wid
      const _result = result[index].status
      sportStore.cart.updateListResult(wid, _result)
    })
  }

  // 复式
  if (isBetMulti.value) {
    const _result = result[0].status
    list[0].bl[0].bi.forEach((item) => {
      const wid = item.wid
      sportStore.cart.updateListResult(wid, _result)
    })
  }

  if (successList.length) {
    betSuccessTip(successWidList)
    emit('getBetList')
  }
}

/**
 * 投注成功提示
 * @param successLength 成功的api数量
 */
function betSuccessTip(widSuccessList: string[]) {
  appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: t('下注成功'), type: 'success' })
}

/**
 * 获取投注信息
 * @param isOnlyUpdateNoCloseCapsData 是否只更新没有关盘的数据
 */
async function runGetSportPlaceBetInfoHandle(isOnlyUpdateNoCloseCapsData = false) {
  if (isLogin.value === false)
    return

  if (sportStore.cart.count === 0)
    return

  if (
    isBetMulti.value
    && (
      sportStore.cart.getExistSameEventIdList.length
      || sportStore.cart.getExistIcList.length
    )
  ) {
    return
  }

  if (sportStore.cart.count > VITE_SPORT_MULTI_BET_MAX)
    return

  const ic: EnumsBetSlipBetSlipTabStatus = sportStore.cart.count === 1
    ? EnumsBetSlipBetSlipTabStatus.single
    : betOrderSelectValue.value

  if (isOnlyUpdateNoCloseCapsData && sportStore.cart.getCloseCapsList.length === sportStore.cart.dataList.length)
    return

  await runGetSportPlaceBetInfo({
    ic,
    bi: isOnlyUpdateNoCloseCapsData ? sportStore.cart.getNotCloseCapsList : sportStore.cart.dataList,
    cur: currentGlobalCurrencyMap.value.cur,
  })
}

/** 单式复式切换 */
function slipTabChange() {
  sportStore.cart.setDefaultBetSlipBetSlipTabStatus(betOrderSelectValue.value)
  if (sportStore.cart.isShowReuse) {
    sportStore.cart.removeAll()
    return
  }
  runGetSportPlaceBetInfoHandle()
}

function startSetInterval() {
  timer && clearInterval(timer)
  timer = setInterval(async () => {
    await runGetSportPlaceBetInfoHandle()
    sportCartToAllEventRef.value?.send()
  }, 1000 * 10)
}

function closeSetInterval() {
  clearInterval(timer)
  timer = null
}

/**
 * 检查投注列表是否存在错误
 *
 * 具体指的是输入框输入错误
 */
async function checkBetListErrorStatus() {
  await new Promise(resolve => setTimeout(resolve, 30))
  return new Promise((resolve, reject) => {
    const checkDomError = document.querySelector('.app-sports-bet-slip-container .check-dom-error')

    if (checkDomError) {
      if (EnumsBetSlipBetSlipTabStatus.single === betOrderSelectValue.value) {
        const parentDom = checkDomError.closest('.app-sports-bet-slip')
        if (parentDom) {
          parentDom.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
          reject(new Error('Bet List Error'))
        }
      }
    }
    else {
      resolve(true)
    }
  })
}

/**
 * 投注方法
 *
 * 组装参数
 */
async function bet() {
  setBetLoadingTrue()
  const checkBetListErrorStatusResult = await checkBetListErrorStatus()
  if (!checkBetListErrorStatusResult)
    return

  await runGetSportPlaceBetInfoHandle()
  await nextTick()

  if (errorInfo.value.bool)
    return setBetLoadingFalse()

  if (
    betOrderSelectValue.value === EnumsBetSlipBetSlipTabStatus.multi
    && sportStore.cart.count > 1
  ) {
    // 复式投注
    const betList = [
      {
        ao: betOrderFilterValue.value,
        bl: [
          {
            pt: getSportMultiPtByLength(sportStore.cart.dataList.length),
            a: Number(duplexInputValue.value),
            bi: sportStore.cart.dataList,
          },
        ],
        cur: currentGlobalCurrencyMap.value.cur,
      },
    ]
    fetchBet(betList)
  }
  else if (
    betOrderSelectValue.value === EnumsBetSlipBetSlipTabStatus.multi
    && sportStore.cart.count === 1
  ) {
    // 选中复试tab，但是只有一条数据，那么就是单式投注
    const betList = sportStore.cart.dataList.map<IBetArgs>(item => ({
      ao: betOrderFilterValue.value,
      bl: [
        {
          pt: item.pt,
          a: Number(duplexInputValue.value),
          bi: [item],
        },
      ],
      cur: currentGlobalCurrencyMap.value.cur,
    }))

    fetchBet(betList)
  }
  else {
    // 单式投注
    const betList = sportStore.cart.dataList.map<IBetArgs>(item => ({
      ao: betOrderFilterValue.value,
      bl: [
        {
          pt: item.pt,
          a: Number(item.amount),
          bi: [item],
        },
      ],
      cur: currentGlobalCurrencyMap.value.cur,
    }))

    fetchBet(betList)
  }
}

/** betinfo接口发送改变通知列表更新数据 */
function sendSportsCartToListEvent(_data: ISportListToCartData[]) {
  if (_data.length === 0)
    return

  console.error('购物车 ov， os发生了变化', _data)

  for (const item of _data)
    appEventBus.emit(EventBusNames.SPORTS_CART_TO_LIST_BUS, item)
}

/** 处理列表通知发送的数据 */
function eventHandler(_data: ISportListToCartData) {
  console.log('收到列表发送的数据', _data)
  sportStore.cart.updateOvOs(_data)
}
/** 监听列表发送的事件 */
function addListToCartEvent() {
  appEventBus.on(EventBusNames.SPORTS_LIST_TO_CART_BUS, eventHandler)
}

/** 移除列表发送的事件 */
function removeListToCartEvent() {
  appEventBus.off(EventBusNames.SPORTS_LIST_TO_CART_BUS, eventHandler)
}

function initBetOrderFilterValue() {
  const v = Local.get<EnumOddsChange>(STORAGE_SPORTS_BET_ORDER)?.value
  if (v)
    betOrderFilterValue.value = v

  else
    betOrderFilterValue.value = EnumOddsChange.acceptAnyOddsChange
}

function setBetOrderFilterValue(v: EnumOddsChange) {
  betOrderFilterValue.value = v
  Local.set(STORAGE_SPORTS_BET_ORDER, v)
}

function initBetOrderTab() {
  betOrderSelectValue.value = sportStore.cart.defaultBetSlipBetSlipTabStatus
}

function noDataGoToBet() {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.SPORTS_HOME })
  setTimeout(() => {
    appEventBus.emit(EventBusNames.SPORTS_LOBBY_RESET, true)
  }, 50)
}

function handleKeyNum(v: number) {
  setAmount(v)
}

function handleKeyOk() {
  closeKeyboard()
}

function handleDelete() {
  deleteAmount()
}

function openKeyboard(
  _setAmount: (value: number) => void,
  _deleteAmount: () => void,
) {
  setKeyBoardBool(true)
  setAmount = _setAmount
  deleteAmount = _deleteAmount
}

function closeKeyboard() {
  setKeyBoardBool(false)
}

function eventReceive() {
  runGetSportPlaceBetInfoHandle()
}

// 点击快捷金额
function onQuickBetAmountClick(num: number) {
  if (isBetMulti.value)
    duplexInputValue.value = application.formatNumDecimal(num, suffixLength.value)

  else
    sportStore.cart.updateAllAmount(num)
}
// 查看我的投注
function checkMyBets() {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.MY_BET })
  setTimeout(() => {
    showBall.value = true
  }, 300)
}
// 重置复式投注金额
function initDuplexInputValue() {
  duplexInputValue.value = application.formatNumDecimal(0, suffixLength.value)
}
// 复式输入框失焦
function onDuplexInputBlur() {
  if (!duplexInputValue.value)
    duplexInputValue.value = application.formatNumDecimal(0, suffixLength.value)
  else
    duplexInputValue.value = application.formatNumDecimal(duplexInputValue.value, suffixLength.value)
}

watch(() => sportStore.cart.count, (val, oVal) => {
  if (val) {
    nextTick(() => {
      if (chatScrollContent.value) {
        // 如果是删除，不需要滚动到底部
        if (oVal && val > oVal) {
          chatScrollContent.value.scrollTop = 0
        }
      }
    })

    if (val > VITE_SPORT_MULTI_BET_MAX)
      return

    const _oVal = oVal ?? 0
    if (val > _oVal)
      emit('changeHeadSelectValue', EnumsBetSlipHeadStatus.betSlip)

    if (!timer) {
      runGetSportPlaceBetInfoHandle()
      startSetInterval()
    }
    else if (val !== oVal && val !== 0) {
      closeSetInterval()
      runGetSportPlaceBetInfoHandle()
      startSetInterval()
    }
  }
  else {
    closeSetInterval()
    sportStore.cart.setOvIsChangeBool(false)
  }
}, {
  immediate: true,
})
watch(currentGlobalCurrencyMap, () => {
  runGetSportPlaceBetInfoHandle()
  resetDuplexInputValue()
})
watch(isLogin, (val) => {
  if (val)
    runGetSportPlaceBetInfoHandle()
})

/** 优化某些手机滚动穿透问题 start */
const betSlipScrollWrapper = ref()
const betSlipScrollContent = ref()
let bsInstance: any
const { height: betSlipScrollWrapperHeight } = useElementSize(betSlipScrollContent)
function initBetterScroll() {
  bsInstance = new BScroll(betSlipScrollWrapper.value, {
    click: true,
    tap: 'tap',
    disableMouse: false,
    disableTouch: false,
  })
}

watch([betCount, betSlipScrollWrapperHeight], () => {
  nextTick(() => {
    bsInstance && bsInstance.refresh()
  })
})
watch(showBall, (a) => {
  if (!a) {
    nextTick(() => {
      initBetterScroll()
    })
  }
  else {
    bsInstance && bsInstance.destroy()
  }
})
/** 优化某些手机滚动穿透问题 end */

onMounted(() => {
  addListToCartEvent()
  initBetOrderFilterValue()
})

onUnmounted(() => {
  closeSetInterval()
  removeListToCartEvent()
  setAmount = null as any
  deleteAmount = null as any
})
</script>

<template>
  <!-- 一个蓝色的球 -->
  <div
    v-if="showBall"
    class="fixed left-[50%] z-10 h-[54rem] w-[54rem] flex translate-x-[-50%] items-center bottom-[83rem] justify-center rounded-[100rem] bg-[var(--ss-spt-floating-bet-slip-bg1)] text-[26rem]"
    @click="showBall = false"
  >
    <IconSptUserBet class="text-[var(--ss-spt-floating-bet-slip-color13)]" />
    <div
      v-show="betCount > 0" :class="betCount < 10 ? 'right-[-5rem]' : 'right-[-13rem]'"
      class="absolute top-0 rounded-[50rem] bg-[var(--ss-spt-floating-bet-slip-bg2)] px-[7rem] text-[12rem] font-semibold leading-[19rem] text-[#fff]"
    >
      {{ betCount }}
    </div>
  </div>
  <!-- 注单浮窗 -->
  <div
    v-else class="overflow-hidden fixed left-[50%] w-full translate-x-[-50%] z-[10]  flex flex-col"
    style="bottom: 65rem;height:calc(571rem - 65rem);max-width: var(--pc-max-width);"
  >
    <!-- 头部 -->
    <div
      class="text-[var(--ss-spt-floating-bet-slip-color13)] theme-float-header h-[50rem] flex flex-shrink-0 items-center justify-between rounded-tl-[6rem] rounded-tr-[6rem] bg-[var(--ss-spt-floating-bet-slip-bg1)] pl-[12rem] text-[16px] font-semibold"
      @click="showBall = true"
    >
      <div class="flex items-center">
        <div class="mr-[8rem] flex items-center text-[18rem]">
          <IconSptUserBet name="spt-user-bet" />
        </div>
        <div class="flex items-center">
          <span>{{ t('投注单') }}</span>
          <div
            v-show="betCount > 0"
            class="ml-[4rem] text-[var(--ss-spt-floating-bet-slip-color14)] rounded-[50rem] bg-[var(--ss-spt-floating-bet-slip-bg3)] px-[7rem] text-[12rem] leading-[19rem]"
          >
            {{ betCount }}
          </div>
        </div>
      </div>
      <div class="flex  items-center px-[12rem] py-[12rem] text-[14rem]">
        <IconUniStakeArrowDown v-if="projectName === 'afun-h5'" />
        <IconUniArrowDown1 v-else />
      </div>
    </div>
    <!-- 注单区域 -->
    <div class="bg-[var(--ss-spt-floating-bet-slip-bg4)] w-full flex grow flex-col overflow-hidden">
      <AppSportCartToAllEvent ref="sportCartToAllEventRef" @receive="eventReceive" />
      <!-- tab -->
      <div class="grid grid-flow-row place-content-stretch">
        <div
          class="grid grid-flow-col place-content-start gap-[8rem] p-[12rem]"
          style="border-bottom: var(--ss-spt-floating-bet-slip-border1);"
        >
          <SSBaseTabs
            v-model="betOrderSelectValue" class="base-tab" :list="betOrderData" :disable-click="betLoading"
            with-icon style="--ss-base-tab-background-color:var(--ss-spt-floating-bet-slip-bg9);" @change="slipTabChange"
          />
        </div>
        <div class="flex items-center justify-between px-[16rem] py-[12rem] leading-[14rem]">
          <SSBaseButton
            v-if="sportStore.cart.isShowReuse" type="text" size="none" @click="sportStore.cart.reuse()"
          >
            {{ t('重新使用投注单') }}
          </SSBaseButton>
          <div v-else class="w-0 flex grow overflow-hidden">
            <SSBaseSelect
              v-model="betOrderFilterValue" class="flex overflow-hidden leading-[1.5]" :project-name="projectName"
              :options="betOrderFilterData" style="
              --ss-base-select-height:20rem;
              --ss-base-select-background-color:transparent;
              --ss-base-select-border-color:transparent;
              --ss-base-select-padding:0;
              --ss-base-select-label-color:var(--ss-spt-floating-bet-slip-color11);
              " @change="setBetOrderFilterValue"
            />
          </div>

          <SSBaseButton
            type="text" class="clear-all" size="none" style="--ss-base-button-text-default-color:var(--ss-spt-floating-bet-slip-color10);"
            :disabled="betLoading" @click="sportStore.cart.removeAll(); initDuplexInputValue()"
          >
            {{ t('全部清除') }}
          </SSBaseButton>
        </div>
      </div>
      <!-- 注单列表 -->
      <div
        ref="betSlipScrollWrapper" class="w-full flex grow flex-col overflow-hidden px-[16rem]"
        :style="{ '-webkit-overflow-scrolling': 'touch', 'paddingBottom': isShowH5Keyboard ? '180rem' : '0' }"
      >
        <div ref="betSlipScrollContent">
          <div class="mb-[4rem] flex flex-col" :class="[]">
            <AppSportsBetSlip
              v-for="item, index in cartDataList" :key="item.wid" v-model="item.amount"
              v-model:error-msg="item.errorMsg" class="flex-shrink-0" :prohibited-operation="betLoading"
              :bet-slip-type="betOrderSelectValue" :cart-info-data="item" :title="formatTitleData(item)" :index="index"
              :cart-data-list="cartDataList" :duplex-ov="duplexOv" :duplex-input-value="duplexInputValue"
              :duplex-total-profit="+duplexTotalProfit" :open-keyboard="openKeyboard" :close-keyboard="closeKeyboard"
              :keyboard-bool="keyboardBool" :fetch-bet-info-status="fetchBetInfoStatus"
              :class="[index < cartDataList.length - 1 ? (isBetMulti ? 'mb-[8rem]' : 'mb-[12rem]') : '']"
              @redirect="showBall = true"
            />
          </div>

          <!-- 无数据 -->
          <div v-if="cartDataList.length === 0" class=" flex flex-col items-center justify-center">
            <SSBaseEmpty>
              <template #icon>
                <BaseImage width="120px" :url="`/${projectName}/png/uni-table-empty.png`" />
              </template>
              <template #description>
                <div class="flex flex-col">
                  <span class="text-[14rem] mb-[2rem] leading-[20rem]  text-[var(--ss-spt-floating-bet-slip-color1)] font-[400]">
                    {{ t('投注单为空') }}
                  </span>
                  <span class="capitalize text-[14rem] leading-[20rem]  text-[var(--ss-spt-floating-bet-slip-color2)] font-[500]" @click="showBall = true">
                    {{ t('立即投注') }}
                  </span>
                </div>
              </template>
            </SSBaseEmpty>
          </div>

          <!-- footer -->
          <div class="grid grid-flow-row gap-y-[12rem] py-[25rem]">
            <template v-if="sportStore.cart.isShowReuse">
              <SSBaseButton size="md" @click="checkMyBets">
                {{ t('查看我的投注') }}
              </SSBaseButton>
            </template>

            <template v-else>
              <!-- 投注单 -->
              <!-- 复式投注额输入框 -->
              <SSBaseInput
                v-show="isBetMulti" v-model="duplexInputValue" class="base-input" type="number"
                :msg="duplexAmountErr" input-mode="decimal" :show-error-msg="false" :msg-after-touched="true"
                :disabled="isNeedDisabledAndClearPlaceholder" @blur="onDuplexInputBlur"
              >
                <template #right-icon>
                  <SSBaseCurrencyIcon :currency-type="currentGlobalCurrencyMap.type" />
                </template>
              </SSBaseInput>
              <div v-if="quickBetAmountBtns.length > 0 && cartDataList.length > 0" class="w-full flex">
                <div
                  v-for="num, ndx in quickBetAmountBtns" :key="num" :class="[
                    currentQuickBetAmount === num
                      ? 'bg-[var(--ss-spt-floating-bet-slip-bg5)] border-[var(--ss-spt-floating-bet-slip-border2)] text-[var(--ss-spt-floating-bet-slip-color3)]'
                      : 'bg-[var(--ss-spt-floating-bet-slip-bg6)] border-[var(--ss-spt-floating-bet-slip-border3)]',
                    ndx > 0 ? 'ml-[10rem]' : '',
                  ]"
                  class="text-[var(--ss-spt-floating-bet-slip-color4)] group  h-[40rem] grow cursor-pointer border-[2rem] rounded-[4rem] border-solid text-center text-[14rem] font-semibold leading-[40rem]"
                  @click="onQuickBetAmountClick(num)"
                >
                  <span class="inline-block select-none group-active:scale-[0.96]">{{ num }}</span>
                </div>
              </div>
              <div class="text-[var(--ss-spt-floating-bet-slip-color5)] flex flex-col text-[14rem] font-semibold">
                <div v-show="isBetMulti" class="flex items-center justify-between leading-[1.5]">
                  <span class="text-[var(--ss-spt-floating-bet-slip-color6)]">{{ t('总赔率') }}</span>
                  <AppSportsOdds :odds="duplexOv" arrow="left" />
                </div>
                <!-- 单式 -->
                <div v-show="isBetSingle" class="flex items-center justify-between leading-[1.5]">
                  <span class="text-[var(--ss-spt-floating-bet-slip-color6)]">{{ t('总投注') }}</span>
                  <SSAppAmount :amount="sportStore.cart.totalAmount" :currency-type="currentGlobalCurrencyMap.type" />
                </div>

                <div class="flex items-center justify-between leading-[1.5]">
                  <span class="text-[var(--ss-spt-floating-bet-slip-color6)]">{{ t('预计盈利') }}</span>
                  <SSAppAmount
                    v-if="betOrderSelectValue === EnumsBetSlipBetSlipTabStatus.single"
                    :amount="sportStore.cart.totalProfit" :currency-type="currentGlobalCurrencyMap.type"
                  />
                  <SSAppAmount
                    v-if="betOrderSelectValue === EnumsBetSlipBetSlipTabStatus.multi"
                    :amount="duplexTotalProfit" :currency-type="currentGlobalCurrencyMap.type"
                  />
                </div>
              </div>
              <div
                v-if="errorInfo.bool"
                class=" border-[var(--ss-spt-floating-bet-slip-border4)] flex items-start border-[2rem] rounded-[6rem] border-dashed p-[12rem] leading-[1.5]"
              >
                <div class="mb-[3rem] ml-[4rem] text-[var(--ss-spt-floating-bet-slip-color7)] mt-[1rem] flex items-center text-[18rem]">
                  <IconUniWarningColor name="uni-warning" />
                </div>
                <span class="text-[var(--ss-spt-floating-bet-slip-color7)] ml-[12rem] inline-flex items-center text-[14rem]">
                  <span class="mr-[3rem]">{{ errorInfo.errorMess }}</span>
                  <SSBaseCurrencyIcon v-if="errorInfo.isShowCurrency" :currency-type="currentGlobalCurrencyMap.type" />
                </span>
              </div>

              <template v-if="!isLogin">
                <div class="flex flex-col">
                  <div
                    class="text-[var(--ss-spt-floating-bet-slip-color8)] mb-[8rem] flex items-center justify-center text-[14rem] font-medium leading-[20rem]"
                  >
                    <IconNavbarUser />
                    <span class="ml-[10rem]">{{ t('请登录后投注') }}</span>
                  </div>
                  <SSBaseButton
                    class="h-[44rem]"
                    size="md" style="--ss-base-button-font-size:16px;--ss-base-button-style-bg:var(--ss-spt-floating-bet-slip-bg8);--ss-base-button-border-color:var(--ss-spt-floating-bet-slip-bg8);--ss-base-button-color:var(--ss-spt-floating-bet-slip-color12);"
                    @click="appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.LOGIN })"
                  >
                    {{ t('登录') }}
                  </SSBaseButton>
                  <div
                    class="text-[var(--ss-spt-floating-bet-slip-color8)] mt-[8rem] flex items-center justify-center text-[14rem] font-medium leading-[20rem]"
                  >
                    <span class="mr-[10rem]">{{ t('您没有账户') }}</span>
                    <SSBaseButton
                      type="text" size="none"
                      @click="appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.REGISTER })"
                    >
                      <span class="text-[var(--ss-spt-floating-bet-slip-color9)]">{{ t('立即加入') }}</span>
                    </SSBaseButton>
                  </div>
                </div>
              </template>

              <template v-else>
                <SSBaseButton
                  v-if="errorInfo.isShowAcceptOddsBtn" size="md"
                  @click="sportStore.cart.setOvIsChangeBool(false)"
                >
                  {{ t('接受新赔率') }}
                </SSBaseButton>
                <SSBaseButton
                  v-else size="md" :disabled="isBetBtnDisabled" :loading="betLoading"
                  style="--ss-base-button-loading-opacity:1;" sports-loading @click="bet"
                >
                  <span class="capitalize">{{ t('立即投注') }}</span>
                </SSBaseButton>
              </template>
            </template>
          </div>
          <!-- 虚拟键盘 -->
          <div v-if="isShowH5Keyboard" class="bg-[var(--ss-spt-floating-bet-slip-bg7)] absolute left-0 w-full" style="height: 180rem;bottom:0;">
            <SSBaseNumericKeypad @key-num="handleKeyNum" @key-ok="handleKeyOk" @key-delete="handleDelete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

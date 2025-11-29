<script setup lang='ts'>
import type { IBetArgs } from '@tg/types'
import type { ISportListToCartData } from '~/types'
import {
  IconSptUserBet,
  IconUniArrowUpBig,
  IconUniWarning,
  IconNavbarUser,
  IconNavbarBet,
  IconNavbarBetMult
} from '@tg/icons'

import BScroll from '@better-scroll/core'
import { ApiSportPlaceBet, ApiSportPlaceBetInfo } from '@tg/apis'
import {
  EnumOddsChange,
  EnumsBetSlipBetSlipTabStatus,
  EnumsBetSlipHeadStatus,
} from '~/utils/enums'
import { getEnv } from '@tg/utils';
import AppSportBetSuccessNotify from './AppSportBetSuccessNotify.vue'

defineOptions({
  name: 'AppSportsFloatingBetSlip',
})
const emit = defineEmits(['changeHeadSelectValue', 'getBetList'])

const chatScrollContent = ref<HTMLElement | null>(null)
const { VITE_SPORT_MULTI_BET_MAX } = getEnv()

let timer: any = null
const {
  bool: betLoading,
  setTrue: setBetLoadingTrue,
  setFalse: setBetLoadingFalse,
} = useBoolean(false)
const { t } = useI18n()
const router = useLocalRouter()
const appStore = useAppStore()
const { userLanguage } = storeToRefs(useLanguageStore())
const { openNotify } = useNotify()
const sportCartToAllEventRef = ref()
// 获取betInfo接口是否成功
const { bool: fetchBetInfoStatus, setBool: setFetchBetInfoStatus } = useBoolean(true)
const {
  currentGlobalCurrency,
  currentGlobalCurrencyBalanceNumber,
  isLogin,
} = storeToRefs(appStore)
const sportStore = useSportsStore()
const suffixLength = computed(() =>
  currencyConfig[currentGlobalCurrency.value].decimal,
)
const {
  value: duplexInputValue,
  errorMessage: duplexAmountErr,
  resetField: resetDuplexInputValue,
} = useField<number | string>('amount', (value) => {
  if (+value < sportStore.cart.multiMia)
    return t('bet_min_tip', { amount: application.formatNumDecimal(sportStore.cart.multiMia, suffixLength.value) })
  if (+value > sportStore.cart.multiMaa)
    return t('bet_max_tip', { amount: application.formatNumDecimal(sportStore.cart.multiMaa, suffixLength.value) })
  return ''
}, { initialValue: application.formatNumDecimal(0, suffixLength.value) })

const { leftIsExpand } = useLeftSidebar()
const { closeRightSidebar, openRightSidebar, rightIsExpand } = useRightSidebar()
const { openRegisterDialog } = useRegisterDialog()
const { openLoginDialog } = useLoginDialog()
const { isMobile } = storeToRefs(useWindowStore())
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
    label: t('sports_single'),
    value: EnumsBetSlipBetSlipTabStatus.single,
    icon: IconNavbarBet,
  },
  {
    label: t('sports_multi_bet'),
    value: EnumsBetSlipBetSlipTabStatus.multi,
    icon: IconNavbarBetMult,
  },
])

const selectTabsTwo = computed(() => [
  { label: t('sports_accept_any_odds'), value: EnumOddsChange.acceptAnyOddsChange },
  { label: t('sports_accept_higher_odds'), value: EnumOddsChange.acceptHigherOdds },
  /*   { label: t('sports_accept_none_odds'), value: EnumOddsChange.notAcceptAnyOddsChange },  需求STAK-22227 */
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
    return t('sports_multi_bet_btn')

  if (betOrderSelectValue.value === EnumsBetSlipBetSlipTabStatus.single)
    return t('sports_single_bet')

  return betOrderData.value.find(b => b.value === betOrderSelectValue.value)?.label ?? '-'
})
/** 购物车数据 */
const cartDataList = computed(() => {
  if (isMobile.value)
    return sportStore.cart.dataList.slice().reverse()

  return sportStore.cart.dataList
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
    return currentGlobalCurrencyBalanceNumber.value < +sportStore.cart.totalPay

  else return currentGlobalCurrencyBalanceNumber.value < Number(duplexInputValue.value)
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
      errorMess: t('plat_not_sup_currency'),
    }
  }

  // 获取投注信息失败
  if (fetchBetInfoStatus.value === false) {
    return {
      bool: true,
      errorMess: t('failed_get_betinfo'),
    }
  }

  // 不接受任何赔率变化
  if (betOrderFilterValue.value === EnumOddsChange.notAcceptAnyOddsChange) {
    // 赔率变化
    if (sportStore.cart.ovIsChange) {
      return {
        bool: true,
        errorMess: t('bet_odd_change'),
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
          errorMess: t('bet_odd_change'),
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
        errorMess: t('cant_form_multiple'),
      }
    }

    if (
      sportStore.cart.getNotSupportWidList.length
      || sportStore.cart.getExistIcList.length
    ) {
      return {
        bool: true,
        errorMess: t('no_sup_multiple'),
      }
    }

    if (sportStore.cart.getOddsLessThanOnePointOneWidList.length) {
      return {
        bool: true,
        errorMess: t('min_odd_bet'),
      }
    }

    if (+sportStore.cart.multiMia === 0 && +sportStore.cart.multiMaa === 0) {
      return {
        bool: true,
        errorMess: t('max_odd'),
      }
    }
  }

  if (sportStore.cart.count > VITE_SPORT_MULTI_BET_MAX) {
    return {
      bool: true,
      errorMess: t('bet_one_max', { max: VITE_SPORT_MULTI_BET_MAX }),
    }
  }

  // TODO: 您的投注单里不能包含有暂停或已关闭的盘口投注项

  if (sportStore.cart.isExistCloseCaps) {
    return {
      bool: true,
      errorMess: t('has_stop_bet'),
    }
  }

  // 余额不足
  if (isBetAmountOverBalance.value) {
    return {
      bool: true,
      errorMess: t('bet_more_than_balance'),
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
      errorMess: t('bet_sup_10x'),
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
  if (isMobile.value && keyboardBool.value)
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
  const message = isBetSingle.value
    ? t('sports_single_bet')
    : (sportStore.cart.count === 1
      ? t('sports_single_bet')
      : t('sports_multi_bet'))
  const amount = isBetSingle.value
    ? sportStore.cart.getAmountByWidList(widSuccessList)
    : Number(duplexInputValue.value)

  const num = isBetSingle.value
    ? widSuccessList.length
    : 1
  openNotify({
    type: 'wallet',
    title: message,
    message: () => h(
      AppSportBetSuccessNotify,
      {
        amount,
        currencyType: currentGlobalCurrency.value,
        isBetSingle: isBetSingle.value || sportStore.cart.count === 1,
        num,
      },
    ),
  })
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
    cur: getCurrencyConfig(currentGlobalCurrency.value).cur,
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
        cur: getCurrencyConfig(currentGlobalCurrency.value).cur,
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
      cur: getCurrencyConfig(currentGlobalCurrency.value).cur,
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
      cur: getCurrencyConfig(currentGlobalCurrency.value).cur,
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

function firstInputFocus() {
  if (isMobile.value)
    return

  if (chatScrollContent.value && chatScrollContent.value?.querySelector('input'))
    chatScrollContent.value?.querySelector('input')?.focus()
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
  if (isMobile.value)
    closeRightSidebar()

  router.push(`/sports/${getSportsPlatId()}`)
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
  openRightSidebar(EnumRightSidebarContent.BETTING)
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
          if (isMobile.value)
            chatScrollContent.value.scrollTop = 0
          else
            chatScrollContent.value.scrollTop = chatScrollContent.value?.scrollHeight ?? 0
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
watch(currentGlobalCurrency, () => {
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
  firstInputFocus()
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
  <div v-if="showBall" style="--tg-icon-color:var(--tg-sport-floating-ball-icon);"
    :class="[rightIsExpand || leftIsExpand ? 'z-[-2]' : '', isStyle2() ? 'bottom-[96px]' : 'bottom-[83px]']"
    class="fixed left-[50%] z-10 h-[54px] w-[54px] flex translate-x-[-50%] items-center justify-center rounded-[100px] bg-[var(--tg-sport-floating-ball-bg)] text-[26px]"
    @click="showBall = false">
    <IconSptUserBet name="spt-user-bet" />
    <div v-show="betCount > 0" :class="betCount < 10 ? 'right-[-5px]' : 'right-[-13px]'"
      class="absolute top-0 rounded-[50px] bg-[#E91134] px-[7px] text-[12px] font-semibold leading-[19px] text-white">
      {{ betCount }}
    </div>
  </div>
  <!-- 注单浮窗 -->
  <div v-else class="overflow-hiddenl app-sports-floating-bet fixed left-0 w-full flex flex-col"
    :class="[rightIsExpand || leftIsExpand ? 'z-[-2]' : 'z-10']"
    style="bottom: var(--tg-footerbar-height);height:calc(571px - var(--tg-footerbar-height)) ;">
    <!-- 头部 -->
    <div
      class="text-tg-text-white theme-float-header h-[50px] flex flex-shrink-0 items-center justify-between rounded-tl-[6px] rounded-tr-[6px] bg-[var(--tg-sport-floating-header-bg)] pl-[12px] text-[16px] font-semibold"
      @click="showBall = true">
      <div class="flex items-center">
        <div class="mr-[8px] flex items-center text-[18px]">
          <IconSptUserBet name="spt-user-bet" />
        </div>
        <div class="flex items-center">
          <span>{{ t('bet_slip') }}</span>
          <div v-show="betCount > 0" class="ml-[4px] rounded-[50px] bg-[#E91134] px-[7px] text-[12px] leading-[19px]">
            {{ betCount }}
          </div>
        </div>
      </div>
      <div class="flex rotate-180 items-center px-[12px] py-[12px] text-[14px]">
        <IconUniArrowUpBig name="uni-arrow-up-big" />
      </div>
    </div>
    <!-- 注单区域 -->
    <div class="bg-tg-secondary-dark w-full flex grow flex-col overflow-hidden">
      <AppSportCartToAllEvent ref="sportCartToAllEventRef" @receive="eventReceive" />
      <!-- tab -->
      <div class="grid grid-flow-row place-content-stretch">
        <div
          class="border-b-tg-secondary-grey grid grid-flow-col place-content-start gap-[8px] border-b-2 border-solid p-[12px]"
          style="--tg-tab-style-wrap-bg-color: var(--tg-primary-main);
                --tg-tab-style-inner-padding-y: var(--tg-spacing-13);
                --tg-tab-style-inner-padding-x: var(--tg-spacing-16);">
          <BaseTab v-model="betOrderSelectValue" class="base-tab" :list="betOrderData" :disable-click="betLoading"
            with-icon @change="slipTabChange" />
        </div>
        <div class="flex items-center justify-between px-[16px] py-[12px] leading-[14px]"
          style="--tg-base-select-popcontent-lineheight: 14px;">
          <BaseButton v-if="sportStore.cart.isShowReuse" type="text" size="none"
            style="--tg-base-button-text-default-color: var(--tg-text-white);" @click="sportStore.cart.reuse()">
            {{ t('reuse_bet') }}
          </BaseButton>
          <div v-else class="w-[0px] flex grow overflow-hidden" style="--tg-base-select-hover-bg-color: var(--tg-secondary-dark);
  --tg-base-select-popper-style-padding-x: 0;
  --tg-base-select-popper-style-padding-y: 0;
  --tg-base-select-popper-label-color: var(--tg-text-lightgrey);">
            <BaseSelect v-model="betOrderFilterValue"
              style="--tg-base-select-popper-bg-color:transparent;--tg-base-select-popper-label-hover-bg-color:transparent;"
              class="flex overflow-hidden leading-[1.5]" :options="betOrderFilterData" popper no-hover
              placement="bottom-start" @select="setBetOrderFilterValue" />
          </div>

          <BaseButton type="text" class="clear-all" size="none"
            style="--tg-base-button-text-default-color: var(--tg-text-white);" :disabled="betLoading"
            @click="sportStore.cart.removeAll(); initDuplexInputValue()">
            {{ t('clear_all') }}
          </BaseButton>
        </div>
      </div>
      <!-- 注单列表 -->
      <div ref="betSlipScrollWrapper" class="w-full flex grow flex-col overflow-hidden px-[16px]"
        :style="{ '-webkit-overflow-scrolling': 'touch', 'paddingBottom': isShowH5Keyboard ? '180px' : '0' }">
        <div ref="betSlipScrollContent">
          <div class="mb-[4px] flex flex-col" :class="[]">
            <AppSportsBetSlip v-for="item, index in cartDataList" :key="item.wid" v-model="item.amount"
              v-model:error-msg="item.errorMsg" class="flex-shrink-0" :prohibited-operation="betLoading"
              :bet-slip-type="betOrderSelectValue" :cart-info-data="item" :title="formatTitleData(item)" :index="index"
              :cart-data-list="cartDataList" :duplex-ov="duplexOv" :duplex-input-value="duplexInputValue"
              :duplex-total-profit="+duplexTotalProfit" :open-keyboard="openKeyboard" :close-keyboard="closeKeyboard"
              :keyboard-bool="keyboardBool" :fetch-bet-info-status="fetchBetInfoStatus"
              :class="[index < cartDataList.length - 1 ? (isBetMulti ? 'mb-[8px]' : 'mb-[12px]') : '']"
              @redirect="showBall = true" />
          </div>

          <!-- 无数据 -->
          <div v-if="cartDataList.length === 0" class="h-[150px] flex flex-col items-center justify-center">
            <BaseEmpty style="--tg-empty-text-padding: 0">
              <template #icon>
                <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_greenblacktheme.png" v-if="appStore.theme === 'greenblack'" />
                <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_greentheme.png" v-else-if="appStore.theme === 'green'" />
                <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip_whitetheme.png" v-else-if="appStore.theme === 'white'" />
                <BaseImage class="w-[112px]" url="/png/icon/uni-empty-betslip.png" v-else />
              </template>

              <template #description>
                <span class="mid-text">{{ t('sports_bet_slip_empty') }}</span>
              </template>
            </BaseEmpty>
          </div>

          <!-- footer -->
          <div class="grid grid-flow-row gap-y-[12px] py-[25px]">
            <template v-if="sportStore.cart.isShowReuse">
              <BaseButton size="md" bg-style="primary" @click="checkMyBets">
                {{ t('view_my_bets') }}
              </BaseButton>
            </template>

            <template v-else>
              <!-- 投注单 -->
              <!-- 复式投注额输入框 -->
              <BaseInput v-show="isBetMulti" v-model="duplexInputValue" class="base-input" type="number"
                :msg="duplexAmountErr" input-mode="decimal" :show-error-msg="false" :msg-after-touched="true"
                :disabled="isNeedDisabledAndClearPlaceholder" @blur="onDuplexInputBlur">
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" />
                </template>
              </BaseInput>
              <div v-if="quickBetAmountBtns.length > 0 && cartDataList.length > 0" class="w-full flex">
                <div v-for="num, ndx in quickBetAmountBtns" :key="num" :class="[
                  currentQuickBetAmount === num ? 'bg-tg-secondary-grey quick-amount border-tg-text-blue' : 'bg-[var(--app-sports-slider-quickAmount-btn-bg2)]',
                  ndx > 0 ? 'ml-[10px]' : '',
                ]"
                  class="text-tg-text-white group border-tg-sport-card-bg h-[40px] grow cursor-pointer border-[2px] rounded-[4px] border-solid text-center text-[14px] font-semibold leading-[40px]"
                  @click="onQuickBetAmountClick(num)">
                  <span class="inline-block select-none group-active:scale-[0.96]">{{ num }}</span>
                </div>
              </div>
              <div class="text-tg-text-white flex flex-col text-[14px] font-semibold">
                <div v-show="isBetMulti" class="flex items-center justify-between leading-[1.5]">
                  <span class="text-tg-text-lightgrey">{{ t('sports_total_odds') }}</span>
                  <AppSportsOdds :odds="duplexOv" arrow="left" />
                </div>
                <!-- 单式 -->
                <div v-show="isBetSingle" class="flex items-center justify-between leading-[1.5]">
                  <span class="text-tg-text-lightgrey">{{ t('sports_total_bet_amount') }}</span>
                  <AppAmount :amount="sportStore.cart.totalAmount" :currency-type="currentGlobalCurrency" />
                </div>

                <div class="flex items-center justify-between leading-[1.5]">
                  <span class="text-tg-text-lightgrey">{{ t('expect_win') }}</span>
                  <AppAmount v-if="betOrderSelectValue === EnumsBetSlipBetSlipTabStatus.single"
                    :amount="sportStore.cart.totalProfit" :currency-type="currentGlobalCurrency" />
                  <AppAmount v-if="betOrderSelectValue === EnumsBetSlipBetSlipTabStatus.multi"
                    :amount="duplexTotalProfit" :currency-type="currentGlobalCurrency" />
                </div>
              </div>
              <div v-if="errorInfo.bool"
                class="bg-tg-secondary-dark border-tg-text-error flex items-start border-[2px] rounded-[6px] border-dashed p-[12px] leading-[1.5]">
                <div class="mb-[3px] ml-[4px] mt-[1px] flex items-center text-[18px]">
                  <IconUniWarning class="error-icon" />
                </div>
                <span class="text-tg-text-error ml-[12px] inline-flex items-center text-[14px]">
                  <span class="mr-[3px]">{{ errorInfo.errorMess }}</span>
                  <AppCurrencyIcon v-if="errorInfo.isShowCurrency" :currency-type="currentGlobalCurrency" />
                </span>
              </div>

              <template v-if="!isLogin">
                <div class="flex flex-col">
                  <div
                    class="text-tg-text-lightgrey mb-[8px] flex items-center justify-center text-[14px] font-medium leading-[20px]">
                    <IconNavbarUser />
                    <span class="ml-[10px]">{{ t('bet_after_login') }}</span>
                  </div>
                  <BaseButton size="md" bg-style="secondary" style="--tg-base-button-font-size:16px;"
                    @click="openLoginDialog">
                    {{ t('login') }}
                  </BaseButton>
                  <div
                    class="text-tg-text-lightgrey mt-[8px] flex items-center justify-center text-[14px] font-medium leading-[20px]">
                    <span class="mr-[10px]">{{ t('you_dont_have_account') }}</span>
                    <BaseButton type="text" size="none" @click="openRegisterDialog">
                      <span class="text-[#fff]">{{ t('join_now') }}</span>
                    </BaseButton>
                  </div>
                </div>
              </template>

              <template v-else>
                <BaseButton v-if="errorInfo.isShowAcceptOddsBtn" size="md" bg-style="primary"
                  @click="sportStore.cart.setOvIsChangeBool(false)">
                  {{ t('accept_odd') }}
                </BaseButton>
                <BaseButton v-else size="md" bg-style="primary" :disabled="isBetBtnDisabled" :loading="betLoading"
                  style="--tg-base-button-loading-opacity:1;" sports-loading @click="bet">
                  <span class="capitalize">{{ t('bet_now') }}</span>
                </BaseButton>
              </template>
            </template>
          </div>
          <!-- 虚拟键盘 -->
          <div v-if="isShowH5Keyboard" class="bg-tg-secondary-dark absolute left-0 w-full"
            style="height: 180px;bottom:0;">
            <BaseNumericKeypad @key-num="handleKeyNum" @key-ok="handleKeyOk" @key-delete="handleDelete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --tg-sport-floating-ball-bg: var(--tg-sub-blue);
  --tg-sport-floating-ball-icon: #fff;
  --tg-sport-floating-header-bg: var(--tg-text-blue);
  --app-sports-slider-quickAmount-btn-bg2: var(--tg-sport-card-bg);
}

[theme='green'] {
  --tg-sport-floating-ball-bg: #42bc91;
  --tg-sport-floating-ball-icon: #fff;
  --tg-sport-floating-header-bg: #177655;
  --app-sports-slider-quickAmount-btn-bg2: #2f7d5e;
}

[theme='greenblack'] {
  --tg-sport-floating-ball-bg: var(--tg-primary-active);
  --tg-sport-floating-ball-icon: #222;
  --tg-sport-floating-header-bg: #454545;
}

[theme='white'] {
  --tg-sport-floating-ball-bg: var(--tg-white-primary-active-bg);
  --tg-sport-floating-ball-icon: #222;
  --tg-sport-floating-header-bg: #f2ca5c;
}
</style>

<style lang="scss" scoped>
.bg-tg-secondary-dark {
  background-color: var(--tg-secondary-dark);
}
.app-sports-floating-bet {
  left: var(--pc-h5model-left, 0);
  width: var(--pc-h5model-width, 100%);

  @include webTheme('green') {
    background-color: #00000080;
  }
}

.theme-float-header {
  --tg-icon-color: #fff;

  @include webTheme('green') {
    --tg-icon-color: #5ecea6;
  }

  @include webTheme('white') {
    --tg-icon-color: #111;
  }
}

.base-tab {
  @include webTheme('white') {
    --tg-tab-style-active-bg: #d8d8d8;
  }
}

.quick-amount {
  @include webTheme('white') {
    background-color: #f7f4e7;
    border: 1px solid #f2ca5c;
  }
}

.base-input {
  @include webTheme('white') {
    --tg-base-input-style-bg: #fff;
  }

  @include webTheme('green') {
    --tg-base-input-style-bg: #02432d;
  }
}
</style>

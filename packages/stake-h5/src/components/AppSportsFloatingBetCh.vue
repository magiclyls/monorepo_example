<script lang="ts" setup>
import type { IBetArgs, IBetReserveArgs } from '@tg/types'
import type { ICartInfoData, ISportListToCartData } from '~/types'
import {
  IconSptUserBook,
  IconSptSub,
  IconSptAdd,
  IconSptChuanQuestion,
  IconSptUserAdd,
  IconNavbarUser
} from '@tg/icons'
import BScroll from '@better-scroll/core'
import { ApiSportPlaceBet, ApiSportPlaceBetInfo, ApiSportPlaceReserve } from '@tg/apis'
import {
  EnumOddsChange,
  EnumsBetSlipBetSlipTabStatus,
} from '~/utils/enums'
import AppSportBetSuccessNotify from './AppSportBetSuccessNotify.vue'
import { getEnv } from '@tg/utils';

const emit = defineEmits(['changeBallshow'])
const { VITE_SPORT_MULTI_BET_MAX } = getEnv()
const { t } = useI18n()
const sportStore = useSportsStore()
const appStore = useAppStore()
const router = useLocalRouter()
const { currentGlobalCurrency, currentGlobalCurrencyBalanceNumber, isLogin, theme } = storeToRefs(appStore)
const { closeRightSidebar, rightIsExpand } = useRightSidebar()
const { isMobile } = storeToRefs(useWindowStore())
const { openNotify } = useNotify()
const { openToast } = useToast()
const { openRegisterDialog } = useRegisterDialog()
const { openLoginDialog } = useLoginDialog()
const { openMultiBetExplainDialog } = useMultiBetExplainDialog()
/** 是否展示单式键盘 */
const { bool: keyboardBool, setBool: setKeyBoardBool } = useBoolean(true)
/** 是否展示复式键盘和快捷 */
const { bool: showMultiInput, setBool: setShowMultiInput } = useBoolean(false)

// 获取betInfo接口是否成功
const { bool: fetchBetInfoStatus, setBool: setFetchBetInfoStatus } = useBoolean(false)
// 下注中
const { bool: betLoading, setBool: setBetLoading } = useBoolean(false)
// 预约按钮
const { bool: appointing, setBool: setAppointing } = useBoolean(false)

let bsInstance: any
let timer: any = null
const inputRef = ref()
const sportCartToAllEventRef = ref()
const chuanInputListWrapper = ref()

// 预约投注的赔率
const appointingOv = ref(0)
const siderProgress = ref(0)
/** 快捷金额按钮数据 从接口获取 */
const quickBetAmountBtns = ref<Array<number | string>>(['', '', '', ''])

const amountInputReadonly = computed(() => {
  if (!isMobile.value)
    return false
  else
    return true
})

const maxHeight = computed(() => {
  if (!isMobile.value)
    return '100%'
  else
    return showMultiInput.value ? 'calc(100vh - 372px)' : '440px'
})
const selectTabsTwo = computed(() => [
  { label: t('sports_accept_any_odds'), value: EnumOddsChange.acceptAnyOddsChange },
  { label: t('sports_accept_higher_odds'), value: EnumOddsChange.acceptHigherOdds },
  /*  { label: t('sports_accept_none_odds'), value: EnumOddsChange.notAcceptAnyOddsChange }, 需求STAK-22227 */
])
const { selected: betOrderFilterValue, list: betOrderFilterData } = useSelect(selectTabsTwo.value)

const suffixLength = computed(() => currentGlobalCurrency.value === 'BTC' ? 5 : 2)
/** 是否串关 */
const isMulti = computed(() => EnumSportsEventType.CHUAN === sportStore.lobbyCurrentEventType)
/** 购物车数据 */
const cartDataList = computed(() => {
  if (isMobile.value)
    return sportStore.cart.dataList.slice().reverse()
  return sportStore.cart.dataList
})

/** 第一个购物车的兼容没数据情况 */
const cartDataListFirst = computed(() => cartDataList.value[0] ?? {}) as ComputedRef<ICartInfoData>
// 串关当前输入框
const currentActiveInpout = ref(-1)
// 串关接口返回的数据
const chuanInputList = ref(getSportMultiDataByLength(cartDataList.value.length))

/** 预约预计盈利金额 */
const appointingProfit = computed(() => +mul(+cartDataListFirst.value.amount, appointingOv.value))

const isClosed = computed(() => cartDataListFirst.value.os === 0)
/** 单式输入框逻辑  切换到不支持货币时不能输入 */
const isDisabled = computed(() => {
  return cartDataListFirst.value.os === 0 || !sportStore.cart.isSupportCurrency || !fetchBetInfoStatus.value
})
/** 单式 */
const placeholder = computed(() => `限额${application.formatNumDecimal(cartDataListFirst.value.mia, suffixLength.value)}-${application.formatNumDecimal(cartDataListFirst.value.maa, suffixLength.value)}`)
/** 复式合计投注 todo算法不对暂时不用 */
const multitotalBet = computed(() => {
  return chuanInputList.value.reduce((pre, cur) => {
    return pre + Number(cur.a)
  }, 0)
})
/** 复式预计盈利金额 */
const multiProfit = computed(() => {
  return chuanInputList.value.reduce((pre, cur) => {
    return pre + Number(mul(+cur.a, +cur.ov))
  }, 0)
})

function setBetOrderFilterValue(v: EnumOddsChange) {
  betOrderFilterValue.value = v
  Local.set(STORAGE_SPORTS_BET_ORDER, v)
}
function eventReceive() {
  rotationRequirements() && runGetSportPlaceBetInfoHandle()
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
/** 预约投注按钮 */
function onAppointing() {
  if (!appointing.value)
    appointingOv.value = +cartDataListFirst.value.ov
  setAppointing(!appointing.value)
}
function changeAppointOv(o: 'add' | 'sub') {
  const step = 0.01
  if (o === 'add')
    appointingOv.value = +add(appointingOv.value, step)
  else if (appointingOv.value !== 0)
    appointingOv.value = +sub(appointingOv.value, step)
}
/** 点击复式输入框 */
function onClickMultiInput(index: number) {
  !showMultiInput.value && bsInstance && bsInstance.scrollTo(0, -9999, 300) // 滚动到底部，300ms过渡时间
  setShowMultiInput(true)
  currentActiveInpout.value = index
}
/** 当前快捷金额 */
const currentQuickBetAmount = computed(() => {
  if (cartDataList.value.length === 1)
    return +cartDataListFirst.value.amount
  else
    return -1
})

/** 点击快捷金额 */
function onQuickBetAmountClick(num: number | string) {
  if (betLoading.value || isClosed.value || num === '')
    return
  const val: any = application.formatNumDecimal(num, suffixLength.value, suffixLength.value)
  if (!isMulti.value)
    cartDataListFirst.value.amount = val
  else if (currentActiveInpout.value !== -1)
    chuanInputList.value[currentActiveInpout.value].a = val
}
/** 键盘相关事件 */
// function handleKeyNum(v: string) {
//   if (betLoading.value || isClosed.value)
//     return
//   const keyVal: any = v
//   if (!isMulti.value) {
//     const oVal = cartDataListFirst.value.amount as any
//     const newVal = `${cartDataListFirst.value.amount}${keyVal}` as any
//     if (!oVal) {
//       cartDataListFirst.value.amount = keyVal
//     }
//     else if (oVal && !oVal.includes('.')) {
//       cartDataListFirst.value.amount = newVal
//     }
//     else if (oVal && oVal.includes('.') && oVal.split('.')[1].length < suffixLength.value) {
//       if (keyVal === '.')
//         return
//       cartDataListFirst.value.amount = newVal
//     }
//   }
//   else {
//     const oVal = chuanInputList.value[currentActiveInpout.value].a
//     const newVal = `${chuanInputList.value[currentActiveInpout.value].a}${keyVal}`
//     if (!oVal) {
//       chuanInputList.value[currentActiveInpout.value].a = keyVal
//     }
//     else if (oVal && !oVal.includes('.')) {
//       chuanInputList.value[currentActiveInpout.value].a = newVal
//     }
//     else if (oVal && oVal.includes('.') && oVal.split('.')[1].length < suffixLength.value) {
//       if (keyVal === '.')
//         return
//       chuanInputList.value[currentActiveInpout.value].a = newVal
//     }
//   }
// }

function handleKeyNum(v: string) {
  if (betLoading.value || isClosed.value)
    return
  const keyVal: any = v
  if (!isMulti.value) {
    const oVal = cartDataListFirst.value.amount as any
    // 滑动开始初始化
    if (keyVal === 'format')
      return cartDataListFirst.value.amount = application.formatNumDecimal(oVal, suffixLength.value, suffixLength.value, false) as any

    let newVal: any = oVal
    if (!oVal) {
      if (keyVal === '.' || keyVal === '0')
        newVal = '0.'
      else if (keyVal !== '0')
        newVal = application.formatNumDecimal(keyVal, suffixLength.value, suffixLength.value)
    }
    else {
      const numbers = Number(oVal.split('.')[0])
      const decimals = Number(oVal.split('.')[1])
      const decimalsString = oVal.split('.')[1]

      if (keyVal === '.') {
        if (decimals > 0)
          return
        else
          newVal = `${numbers}.`
      }
      else {
        if (oVal.includes('.')) {
          if (oVal.split('.')[1].length < suffixLength.value) {
            newVal = `${numbers}.${decimalsString}${keyVal}`
          }
          else if (oVal.split('.')[1].length === suffixLength.value) {
            if (decimals === 0 && numbers > 0)
              newVal = `${numbers}${keyVal}.${decimalsString}`
          }
        }
        else {
          newVal = application.formatNumDecimal(numbers + keyVal, suffixLength.value, suffixLength.value)
        }
      }
    }
    cartDataListFirst.value.amount = newVal
  }
  else {
    const oVal = chuanInputList.value[currentActiveInpout.value].a as any
    // 滑动开始初始化
    if (keyVal === 'format')
      return chuanInputList.value[currentActiveInpout.value].a = application.formatNumDecimal(oVal, suffixLength.value, suffixLength.value) as any
    let newVal: any = oVal
    if (!oVal) {
      if (keyVal === '.' || keyVal === '0')
        newVal = '0.'
      else if (keyVal !== '0')
        newVal = application.formatNumDecimal(keyVal, suffixLength.value, suffixLength.value)
    }
    else {
      const numbers = Number(oVal.split('.')[0])
      const decimals = Number(oVal.split('.')[1])
      const decimalsString = oVal.split('.')[1]

      if (keyVal === '.') {
        if (decimals > 0)
          return
        else
          newVal = `${numbers}.`
      }
      else {
        if (oVal.includes('.')) {
          if (oVal.split('.')[1].length < suffixLength.value) {
            newVal = `${numbers}.${decimalsString}${keyVal}`
          }
          else if (oVal.split('.')[1].length === suffixLength.value) {
            if (decimals === 0 && numbers > 0)
              newVal = `${numbers}${keyVal}.${decimalsString}`
          }
        }
        else {
          newVal = application.formatNumDecimal(numbers + keyVal, suffixLength.value, suffixLength.value)
        }
      }
    }
    chuanInputList.value[currentActiveInpout.value].a = newVal
  }
}
function handleDelete() {
  if (betLoading.value || isClosed.value)
    return
  if (!isMulti.value) {
    if (cartDataListFirst.value.amount === null)
      return
    const length = String(cartDataListFirst.value.amount).length
    cartDataListFirst.value.amount = `${cartDataListFirst.value.amount}`.slice(0, length - 1) as any
  }
  else {
    const length = String(chuanInputList.value[currentActiveInpout.value].a).length
    chuanInputList.value[currentActiveInpout.value].a = `${chuanInputList.value[currentActiveInpout.value].a}`.slice(0, length - 1)
  }
}
function handleMax() {
  if (betLoading.value || isClosed.value)
    return
  const val: any = application.formatNumDecimal(currentGlobalCurrencyBalanceNumber.value, suffixLength.value, suffixLength.value)
  if (!isMulti.value)
    cartDataListFirst.value.amount = val
  else
    chuanInputList.value[currentActiveInpout.value].a = val
}
function handleHide() {
  setKeyBoardBool(false)
  setShowMultiInput(false)
  currentActiveInpout.value = -1
}

/** 切换串关 */
function changeBetCi() {
  sportStore.lobbyCurrentEventType === EnumSportsEventType.CHUAN
    ? sportStore.lobbyCurrentEventType = EnumSportsEventType.TODAY
    : sportStore.lobbyCurrentEventType = EnumSportsEventType.CHUAN
}
/** 错误信息 */
function errorInfo() {
  const obj = {
    bool: true,
    errorMess: '',
    isShowAcceptOddsBtn: false,
    isShowCurrency: false,
  }
  if (sportStore.cart.count === 0 || !isLogin.value) {
    obj.bool = false
    return obj
  }

  if (sportStore.cart.isSupportCurrency === false) {
    obj.errorMess = t('plat_not_sup_currency')
    return obj
  }

  // 如果是复式是否符合获取信息请求
  if (isMulti.value) {
    // 判断是否存在同一赛事的多重投注项
    if (sportStore.cart.getExistSameEventIdList.length) {
      obj.errorMess = t('cant_form_multiple')
      return obj
    }
    // 判断是否存在不支持串关赛事 os===2 || ic===2
    if (
      sportStore.cart.getNotSupportWidList.length || sportStore.cart.getExistIcList.length
    ) {
      obj.errorMess = t('no_sup_multiple')
      return obj
    }

    if (sportStore.cart.getOddsLessThanOnePointOneWidList.length) {
      obj.errorMess = t('min_odd_bet')
      return obj
    }
  }

  if (fetchBetInfoStatus.value === false) {
    obj.errorMess = t('failed_get_betinfo')
    return obj
  }
  // 如果是复式投注，
  if (isMulti.value) {
    const newChuanInputList = chuanInputList.value.filter(item => Number(item.a))
    if (newChuanInputList.length === 0) {
      obj.errorMess = '请输入投注金额'
      return obj
    }
    for (const key in newChuanInputList) {
      let { mia, maa, a } = newChuanInputList[key]
      mia = Number(mia)
      maa = Number(maa)
      a = Number(a)
      if (mia === 0 && maa === 0) {
        obj.errorMess = t('max_odd')
        return obj
      }
      if (a < mia) {
        obj.errorMess = t('bet_min_tip', { amount: application.formatNumDecimal(mia, suffixLength.value) })
        obj.isShowCurrency = true
        return obj
      }
      if (a > maa) {
        obj.errorMess = t('bet_max_tip', { amount: application.formatNumDecimal(maa, suffixLength.value) })
        obj.isShowCurrency = true
        return obj
      }
    }
  }
  // 单式投注
  else {
    const amount = cartDataListFirst.value.amount
    const mia = cartDataListFirst.value.mia
    const maa = cartDataListFirst.value.maa
    if (Number(amount) === 0 || Number.isNaN(Number(amount))) {
      obj.errorMess = '请输入投注金额'
      return obj
    }
    if (amount < mia) {
      obj.errorMess = t('bet_min_tip', { amount: application.formatNumDecimal(mia, suffixLength.value) })
      obj.isShowCurrency = true
      return obj
    }
    if (amount > maa) {
      obj.errorMess = t('bet_max_tip', { amount: application.formatNumDecimal(maa, suffixLength.value) })
      obj.isShowCurrency = true
      return obj
    }
  }

  if (sportStore.cart.count > VITE_SPORT_MULTI_BET_MAX) {
    obj.errorMess = t('bet_one_max', { max: VITE_SPORT_MULTI_BET_MAX })
    return obj
  }

  if (sportStore.cart.isExistCloseCaps) {
    obj.errorMess = t('has_stop_bet')
    return obj
  }

  // 余额不足
  if (currentGlobalCurrencyBalanceNumber.value < +sportStore.cart.totalPay) {
    obj.errorMess = t('bet_more_than_balance')
    return obj
  }

  // 金额是不是10的倍数
  if (sportStore.cart.isTenMultiple && sportStore.cart.isTenMultipleBool) {
    obj.errorMess = t('bet_sup_10x')
    return obj
  }

  // 没有错误
  obj.bool = false
  return obj
}

// 是否符合轮训条件
function rotationRequirements() {
  if (sportStore.cart.count === 0 || !isLogin.value || (isMulti.value && sportStore.cart.count < 2))
    return false

  if (sportStore.cart.isSupportCurrency === false)
    return false

  // 如果是复式投注，
  if (isMulti.value) {
    // 判断是否存在同一赛事的多重投注项
    if (sportStore.cart.getExistSameEventIdList.length)
      return false

    // 判断是否存在不支持串关赛事 os===2 || ic===2
    if (
      sportStore.cart.getNotSupportWidList.length || sportStore.cart.getExistIcList.length
    )
      return false

    if (sportStore.cart.getOddsLessThanOnePointOneWidList.length)
      return false
  }
  return true
}

function startSetInterval() {
  if (!rotationRequirements())
    return
  console.log('开始购物车轮训')
  runGetSportPlaceBetInfoHandle()
  timer = setInterval(() => {
    console.log('购物车倒计时结束')
    sportCartToAllEventRef.value?.send()
    runGetSportPlaceBetInfoHandle()
  }, 1000 * 10)
}
function closeSetInterval() {
  console.error('结束购物车轮训')
  clearInterval(timer)
  timer = null
}
/** 获取注单信息 */
const { runAsync: runGetSportPlaceBetInfo } = useRequest(ApiSportPlaceBetInfo, {
  onSuccess(placeBetInfo) {
    setFetchBetInfoStatus(true)
    sportStore.cart.updateAllData(
      cloneDeep(placeBetInfo),
      (_data) => {
        // 只发送过滤后赔率变化的数组
        sendSportsCartToListEvent(_data.osOvIsChangeList)
      },
      false,
    )
    quickBetAmountBtns.value = placeBetInfo.qck && placeBetInfo.qck.length > 0 ? placeBetInfo.qck : []

    // 如果当前数据里面有关盘的数据，需要重新过滤掉关盘数据重新请求
    const { bi, wsi } = placeBetInfo
    const flag = (bi && bi.length > 0 && bi.some(a => +a.ov === 0))
      || (wsi && wsi.length > 0 && wsi.some(a => +a.os === 0))
      || !bi
    if (flag && isMulti.value) {
      wsi?.forEach((item) => {
        if (item.os === 0)
          sportStore.cart.remove(item.wid)
      })
      runGetSportPlaceBetInfoHandle(true)
    }
    else if (flag && !isMulti.value) {
      runGetSportPlaceBetInfoHandle(true)
    }
    else if (!flag && isMulti.value) {
      chuanInputList.value.forEach((item, index) => {
        const newItem = placeBetInfo.bi?.find(item2 => item2.pt === item.pt)
        if (newItem) {
          chuanInputList.value[index] = { ...chuanInputList.value[index], ...newItem }
          chuanInputList.value[index].mia = application.formatNumDecimal(newItem.mia, suffixLength.value)
          chuanInputList.value[index].maa = application.formatNumDecimal(newItem.maa, suffixLength.value)
        }
      })
    }
  },
  onError() {
    setFetchBetInfoStatus(false)
  },
})
/**
 * 筛选后获取注单信息
 * @param isOnlyUpdateNoCloseCapsData 只更新没有关盘的数据
 */
async function runGetSportPlaceBetInfoHandle(isOnlyUpdateNoCloseCapsData = false) {
  const ic: EnumsBetSlipBetSlipTabStatus = sportStore.cart.count === 1
    ? EnumsBetSlipBetSlipTabStatus.single
    : EnumsBetSlipBetSlipTabStatus.multi
  if (isOnlyUpdateNoCloseCapsData && sportStore.cart.getCloseCapsList.length === sportStore.cart.dataList.length)
    return console.log('全部都是关盘')

  await runGetSportPlaceBetInfo({
    ic,
    bi: isOnlyUpdateNoCloseCapsData ? sportStore.cart.getNotCloseCapsList : sportStore.cart.dataList,
    cur: getCurrencyConfig(currentGlobalCurrency.value).cur,
  })
}

/** betinfo接口发送改变通知列表更新数据 */
function sendSportsCartToListEvent(_data: ISportListToCartData[]) {
  if (_data.length === 0)
    return
  for (const item of _data)
    appEventBus.emit(EventBusNames.SPORTS_CART_TO_LIST_BUS, item)
}

/** 组装参数投注 */
async function startBet() {
  setBetLoading(true)
  // 是否汇率调整应该让后端判断
  // await runGetSportPlaceBetInfoHandle()
  const error = errorInfo()
  if (error.bool) {
    openToast({
      message: error.errorMess,
      currencyIcon: error.isShowCurrency ? currentGlobalCurrency.value : '',
    })
    return setBetLoading(false)
  }
  closeSetInterval()
  // 单式投注
  if (!isMulti.value) {
    if (!appointing.value) {
      const betList = sportStore.cart.dataList.map(item => ({
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
    else {
      // 预约投注
      const betList = sportStore.cart.dataList.map(item => ({
        bi: [item],
        a: Number(item.amount),
        target_odd: String(appointingOv.value),
        cur: getCurrencyConfig(currentGlobalCurrency.value).cur,
      }))
      fetchBet(betList)
    }
  }
  else {
    // 复式投注
    const newChuanInputList = chuanInputList.value.filter(item => Number(item.a))
    const betList = newChuanInputList.map((item) => {
      return {
        ao: betOrderFilterValue.value,
        bl: [
          {
            pt: item.pt,
            a: Number(item.a),
            bi: sportStore.cart.dataList,
          },
        ],
        cur: getCurrencyConfig(currentGlobalCurrency.value).cur,
        title: item.text,
        noNotify: true,
      }
    })
    fetchBet(betList)
  }
}
async function fetchBet(list: IBetArgs[] | IBetReserveArgs[]) {
  if (!isMulti.value) {
    try {
      if (!appointing.value)
        await ApiSportPlaceBet(list[0] as IBetArgs)
      else
        await ApiSportPlaceReserve(list[0] as IBetReserveArgs)

      betSuccessTip()
      cartDataList.value.forEach((item) => {
        const wid = item.wid
        sportStore.cart.updateListResult(wid, 'fulfilled', appointing.value ? appointingOv.value : undefined)
      })
      setBetLoading(false)
    }
    catch (error) {
      cartDataList.value.forEach((item) => {
        const wid = item.wid
        sportStore.cart.updateListResult(wid, 'rejected', appointing.value ? appointingOv.value : undefined)
      })
      setBetLoading(false)
    }
  }
  else {
    const queue: Array<() => Promise<any>> = []
    let index = 0
    let hasSuccess = false
    const errorStr: string[] = []
    list.forEach(item => queue.push(() => ApiSportPlaceBet(item as IBetArgs)))
    handleQueue()
    function handleQueue() {
      queue[index]().then(() => {
        if (!hasSuccess)
          hasSuccess = true

        index++
        if (!queue[index])
          return multiFinishhandler(hasSuccess, errorStr)
        setTimeout(handleQueue, 2000)
      }).catch(() => {
        errorStr.push((list[index] as IBetArgs).title as string)
        index++
        if (!queue[index])
          return multiFinishhandler(hasSuccess, errorStr)
        setTimeout(handleQueue, 2000)
      })
    }
  }
}
function multiFinishhandler(hasSuccess: boolean, errorStr: string[]) {
  !errorStr.length && betSuccessTip()
  errorStr.length && openNotify({
    type: 'error',
    title: '您有失败的串关投注项',
    message: errorStr.join(','),
  })
  cartDataList.value.forEach((item) => {
    const wid = item.wid
    sportStore.cart.updateListResult(wid, hasSuccess ? 'fulfilled' : 'rejected')
  })
  setBetLoading(false)
}
function reuseBetSlip() {
  sportStore.cart.reuse()
  startSetInterval()
}
function betSuccessTip() {
  const message = !isMulti.value ? t('sports_single_bet') : t('sports_multi_bet')
  const amount = !isMulti.value
    ? cartDataListFirst.value.amount
    : multitotalBet.value
  const num = 1
  openNotify({
    type: 'wallet',
    title: message,
    message: () => h(
      AppSportBetSuccessNotify,
      {
        amount,
        currencyType: currentGlobalCurrency.value,
        isBetSingle: !isMulti.value,
        num,
      },
    ),
  })
}
// 查看我的投注
function checkMyBets() {
  closeRightSidebar()
  sportStore.cart.removeAll()
  router.push(`/sports/${getSportsPlatId()}/my-bets?type=sports`)
}
function initBetOrderFilterValue() {
  betOrderFilterValue.value = Local.get<EnumOddsChange>(STORAGE_SPORTS_BET_ORDER)?.value ?? EnumOddsChange.acceptAnyOddsChange
}
// 关闭浮窗
function closeFloating(clearAll: boolean) {
  if (betLoading.value)
    return
  emit('changeBallshow', true)
  closeRightSidebar()
  if (!isMulti.value || clearAll)
    sportStore.cart.removeAll()
}

function noDataGoToBet() {
  if (isMobile.value)
    closeRightSidebar()

  router.push(`/sports/${getSportsPlatId()}`)
  setTimeout(() => {
    appEventBus.emit(EventBusNames.SPORTS_LOBBY_RESET, true)
  }, 50)
}
/** 优化某些手机滚动穿透问题 start */
const betSlipScrollWrapper = ref()
const betSlipScrollContent = ref()
const { height: betSlipScrollWrapperHeight } = useElementSize(betSlipScrollContent)
function initBetterScroll() {
  bsInstance = new BScroll(betSlipScrollWrapper.value, {
    click: true,
    tap: 'tap',
    disableMouse: false,
    disableTouch: false,
  })
  console.log(bsInstance)
}
/** 优化某些手机滚动穿透问题 end */

// 修复slider betting消失无法监听事件bug
watch(betLoading, () => siderProgress.value = 0)

watch([betSlipScrollWrapperHeight, showMultiInput], () => {
  betSlipScrollWrapperHeight.value > 20 && nextTick(() => {
    isMobile.value && bsInstance && bsInstance.refresh()
  })
})

watch([isLogin, currentGlobalCurrency], () => {
  closeSetInterval()
  startSetInterval()
})

watch(() => cartDataList.value.length, () => {
  chuanInputList.value = getSportMultiDataByLength(cartDataList.value.length)
  currentActiveInpout.value = -1
  closeSetInterval()
  startSetInterval()
  console.log(cartDataList, cartDataList)
})

watch([() => cartDataListFirst.value.cn, () => cartDataListFirst.value.bt, () => cartDataListFirst.value.result], () => {
  appointing.value = false
}, { deep: true })

onMounted(() => {
  startSetInterval()
  addListToCartEvent()
  initBetOrderFilterValue()
  isMobile.value && initBetterScroll()
})

onUnmounted(() => {
  closeSetInterval()
  removeListToCartEvent()
})
</script>

<template>
  <div class="app-sports-floating-bet-ch overflow-hiddenl inset-0 flex flex-col" :class="[rightIsExpand ? 'z-[-2]' : 'z-40',
  isMobile ? 'justify-end' : 'justify-start',
  isMobile ? 'fixed' : '']">
    <!-- 头部 -->
    <div
      class="text-tg-text-white shadow-tg-box-shadow-lg h-[45px] flex flex-shrink-0 items-center justify-between rounded-tl-[6px] rounded-tr-[6px] bg-[var(--app-sports-floating-bet-ch-header-bg)] pl-[12px] font-semibold">
      <div
        class="h-[28px] w-[28px] flex items-center justify-center rounded-[6px] bg-[var(--app-sports-floating-bet-ch-header-text-bg)] text-[var(--app-sports-floating-bet-ch-header-text)]">
        <span>{{ isMulti ? '串' : '单' }}</span>
      </div>
      <div class="px-[12px] py-[12px] text-[14px]">
        <BaseButton type="text" size="none" :disabled="betLoading" @click="closeFloating(false)">
          <IconUniClose class="header-close" name="uni-close" />
        </basebutton>
      </div>
    </div>
    <!-- 注单区域 -->
    <div class="w-full flex flex-col overflow-hidden bg-[var(--app-sports-floating-bet-ch-header-content-bg)]">
      <!-- 相互推送消息 -->
      <AppSportCartToAllEvent ref="sportCartToAllEventRef" @receive="eventReceive" />
      <!-- tab -->
      <div class="grid grid-flow-row place-content-stretch">
        <div class="flex items-center justify-between px-[12px] py-[15px] leading-[14px]"
          style="--tg-base-select-popcontent-lineheight: 14px;">
          <BaseButton v-if="sportStore.cart.isShowReuse" type="text" size="none"
            style="--tg-base-button-text-default-color: var(--tg-text-white);" @click="reuseBetSlip">
            {{ t('reuse_bet') }}
          </BaseButton>
          <div v-else class="w-[0px] flex grow overflow-hidden" style="--tg-base-select-hover-bg-color: var(--tg-secondary-dark);
  --tg-base-select-popper-style-padding-x: 0;
  --tg-base-select-popper-style-padding-y: 0;
  --tg-base-select-popper-label-color: var(--tg-text-lightgrey);">
            <BaseSelect v-model="betOrderFilterValue" class="flex overflow-hidden"
              style="--tg-base-select-popper-label-color:var(--tg-text-white);--tg-base-select-popper-bg-color:transparent;--tg-popper-hover-color-default:#5ECEA6;--tg-base-select-popper-label-hover-bg-color:transparent;"
              :options="betOrderFilterData" popper no-hover placement="bottom-start" :disabled="betLoading"
              @select="setBetOrderFilterValue" />
          </div>

          <BaseButton type="text" class="clear-all" size="none"
            style="--tg-base-button-text-default-color: var(--tg-text-white);" :disabled="betLoading"
            @click="closeFloating(true)">
            {{ t('clear_all') }}
          </BaseButton>
        </div>
      </div>
      <!-- 注单列表 -->
      <div v-if="cartDataList.length === 0" class="empty">
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
          <template #default>
            <div style="margin-top: 4px">
              <BaseButton type="text" size="none" style=" --tg-base-button-text-default-color:var(--tg-text-white)"
                @click="noDataGoToBet">
                {{ t('sports_betting_now') }}
              </BaseButton>
            </div>
          </template>
        </BaseEmpty>
      </div>
      <div v-else ref="betSlipScrollWrapper" class="w-full flex grow flex-col overflow-hidden px-[12px]"
        :style="{ '-webkit-overflow-scrolling': 'touch', 'max-height': maxHeight }">
        <div ref="betSlipScrollContent">
          <div class="mb-[12px] flex flex-col gap-[12px]">
            <AppSportsBetSlipCh v-for="item, index in cartDataList" :key="item.wid" :is-multi="isMulti"
              :disabled="betLoading" class="flex-shrink-0" :cart-info-data="item" :index="index"
              :cart-data-list="cartDataList" />
          </div>
          <!-- 单式独有 -->
          <template v-if="!sportStore.cart.isShowReuse && !isMulti">
            <!-- 单式投注输入框 -->
            <div class="flex justify-between" :class="[appointing ? 'mb-[6px]' : 'mb-[12px]']">
              <BaseInput ref="inputRef" :key="currentGlobalCurrency" v-model:model-value="cartDataList[0].amount"
                :readonly="amountInputReadonly" class="base-input mr-[6px] flex-1" style="--tg-base-input-height: 44px;"
                :placeholder="placeholder" type="text" mb0 :show-error-msg="false" input-mode="decimal"
                :disabled="isDisabled || betLoading" :msg-after-touched="true" @click="setKeyBoardBool(true)">
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="currentGlobalCurrency" />
                </template>
              </BaseInput>
              <BaseButton v-if="!isClosed" :disabled="betLoading" bg-style="primary" style="width: 95px; height: 44px;"
                @click="onAppointing">
                <div class="flex items-center">
                  <template v-if="!appointing">
                    <IconSptUserBook name="spt-user-book"
                      style="font-size: 20px;color: var(--app-sports-floating-bet-ch-svg-color)" />
                    <span>预约</span>
                  </template>
                  <template v-else>
                    <span>取消预约</span>
                  </template>
                </div>
              </BaseButton>
            </div>
            <!-- 预约输入框 -->
            <div v-if="!isClosed && appointing"
              class="booking-input mb-[6px] h-[44px] flex select-none items-center justify-between rounded-[4px] px-[10px]">
              <div class="cursor-pointer" @click="changeAppointOv('sub')">
                <IconSptSub name="spt-sub" style="font-size: 20px; color: var(--tg-text-white);" />
              </div>
              <span class="text-tg-text-blue text-18 font-semibold" style="font-family: proxima-nova">@ {{ appointingOv
                }}</span>
              <div class="cursor-pointer" @click="changeAppointOv('add')">
                <IconSptAdd name="spt-add" style="font-size: 20px; color: var(--tg-text-white);" />
              </div>
            </div>
            <!-- 快捷金额 -->
            <div v-if="quickBetAmountBtns.length > 0 || keyboardBool"
              class="rounded-[6px] bg-[var(--app-sports-slider-quickAmount-bg)] p-[4px]">
              <div v-if="quickBetAmountBtns.length > 0 && isLogin"
                class="grid grid-flow-col mb-[8px] w-full gap-x-[5px]">
                <div v-for="num in quickBetAmountBtns" :key="num"
                  :class="[currentQuickBetAmount === num ? 'bg-[var(--app-sports-slider-quickAmount-active-bg)] !border-[var(--app-sports-slider-quickAmount-active-border)]' : 'bg-[var(--app-sports-slider-quickAmount-btn-bg)]']"
                  class="text-tg-text-white group h-[40px] grow cursor-pointer border-[2px] border-[var(--app-sports-slider-quickAmount-border)] rounded-[4px] border-solid text-center text-[14px] font-semibold leading-[40px]"
                  @click="onQuickBetAmountClick(num)">
                  <span class="inline-block select-none group-active:scale-[0.96]">{{ num }}</span>
                </div>
              </div>
              <!-- 虚拟键盘 -->
              <div v-if="keyboardBool" class="left-0 w-full" style="height: 150px;">
                <BaseNumericKeypad type="ch" @key-num="handleKeyNum" @key-max="handleMax" @key-hide="handleHide"
                  @key-delete="handleDelete" />
              </div>
            </div>
          </template>
          <!-- 复式独有 -->
          <div v-if="isMulti" class="flex flex-col gap-[12px]">
            <div v-for="item, index in chuanInputList" ref="chuanInputListWrapper" :key="item.text"
              class="theme-bg-color w--full h-[48px] flex items-center justify-between rounded-[4px] px-[8px] font-semibold">
              <div class="flex items-center justify-between text-[14px]">
                <div class="flex cursor-pointer items-center justify-between"
                  @click="openMultiBetExplainDialog({ type: item.pt })">
                  <IconSptChuanQuestion name="spt-chuan-question" />
                </div>
                <span class="text-tg-text-white ml-[4px]">{{ item.text }}</span>
              </div>
              <div class="flex items-center justify-between text-[14px]">
                <span class="text-tg-text-lightgrey mr-[4px]">{{ item.times }}x</span>
                <BaseInput ref="inputRef" :key="currentGlobalCurrency" v-model:model-value="item.a"
                  class="base-multi-input" :class="{ active: index === currentActiveInpout }"
                  :active="index === currentActiveInpout" :style="{ '--tg-base-input-style-border': 'none' }"
                  :readonly="amountInputReadonly" style="--tg-base-input-height: 32px;width: 174px;"
                  :placeholder="`限额${item.mia}-${item.maa}`" type="text" mb0 :disabled="isDisabled || betLoading"
                  @click="onClickMultiInput(index)" />
              </div>
            </div>
            <div v-if="cartDataList.length < VITE_SPORT_MULTI_BET_MAX"
              class="w--full add-more-macth-wrap bg-tg-secondary-grey h-[48px] flex cursor-pointer items-center justify-center rounded-[4px] font-semibold"
              :class="[!isMobile ? 'mb-[8px]' : '']" @click="closeFloating(false)">
              <IconSptUserAdd class="add-more-macth" :class="{ 'opacity-50': betLoading }" name="spt-user-add"
                style="font-size: 20px" />
              <span :class="{ 'opacity-50': betLoading }" class="add-more-macth ml-[4px] text-[14px]">添加赛事</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 复式独有 快捷金额 -->
      <div v-if="isMulti && showMultiInput" class="px-[12px]">
        <div class="rounded-[6px] bg-[var(--app-sports-slider-quickAmount-bg)] p-[4px]">
          <div v-if="quickBetAmountBtns.length > 0 && isLogin" class="mb-[8px] w-full flex gap-[10px]">
            <div v-for="num in quickBetAmountBtns" :key="num"
              :class="[currentQuickBetAmount === num ? 'bg-[var(--app-sports-slider-quickAmount-active-bg)] !border-[var(--app-sports-slider-quickAmount-active-border)]' : 'bg-[var(--app-sports-slider-quickAmount-btn-bg)]']"
              class="text-tg-text-white group h-[40px] grow cursor-pointer border-[2px] border-[var(--app-sports-slider-quickAmount-border)] rounded-[4px] border-solid text-center text-[14px] font-semibold leading-[40px]"
              @click="onQuickBetAmountClick(num)">
              <span class="inline-block select-none group-active:scale-[0.96]">{{ num }}</span>
            </div>
          </div>
          <!-- 虚拟键盘 -->
          <div class="left-0 w-full" style="height: 150px;">
            <BaseNumericKeypad type="ch" @key-num="handleKeyNum" @key-max="handleMax" @key-hide="handleHide"
              @key-delete="handleDelete" />
          </div>
        </div>
      </div>

      <!-- 投注 -->
      <div v-if="isLogin" class="flex justify-between px-[12px] pb-[17px] pt-[12px]">
        <template v-if="sportStore.cart.isShowReuse">
          <BaseButton size="md" class="w-full" bg-style="primary" @click="checkMyBets">
            {{ t('view_my_bets') }}
          </BaseButton>
        </template>
        <template v-else>
          <AppSportsSlider v-model="siderProgress" class="flex-1" :is-closed="isClosed" :loading="betLoading"
            :disabled="cartDataList.length === 0" :appointing="appointing" :appointing-profit="appointingProfit"
            :profit="sportStore.cart.totalProfit" :multi-profit="multiProfit" :is-multi="isMulti"
            :count="cartDataList.length" :multitotal-bet="multitotalBet" @to-right="startBet"
            @drag-start="handleKeyNum('format')" />
          <!-- 串关切换按钮 -->
          <BaseButton :disabled="betLoading" bg-style="primary"
            style="--tg-base-button-border-radius:50%;margin-left: 12px;width: 48px; height: 48px; padding:0 10px;"
            @click="changeBetCi">
            <div class="flex items-center">
              <IconSptUserBook v-if="!isMulti" name="spt-user-book"
                style="font-size: 14px;color: var(--app-sports-floating-bet-ch-svg-color) " /><span>{{ isMulti ? '单关投注'
                  : '串' }}</span>
            </div>
          </BaseButton>
        </template>
      </div>
      <!-- 未登录 -->
      <div v-else class="flex flex-col gap-[8px] px-[12px] pb-[13px] pt-[12px]">
        <div
          class="theme-text-color flex items-center justify-center gap-[10px] text-[14px] font-medium leading-[20px]">
          <IconNavbarUser name="navbar-user" />
          <span>{{ t('bet_after_login') }}</span>
        </div>
        <BaseButton class="theme-btn-color" size="md" bg-style="secondary" style="--tg-base-button-font-size:16px;"
          @click="openLoginDialog">
          {{ t('login') }}
        </BaseButton>
        <div
          class="theme-text-color flex items-center justify-center gap-[10px] text-[14px] font-medium leading-[20px]">
          <span>{{ t('you_dont_have_account') }}</span>
          <BaseButton type="text" size="none" @click="openRegisterDialog">
            <span class="jion-now">{{ t('join_now') }}</span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
:root {
  --app-sports-floating-bet-ch-header-bg: #1475e1;
  --app-sports-floating-bet-ch-header-text-bg: #fff;
  --app-sports-floating-bet-ch-header-text: var(--tg-text-blue);
  --app-sports-floating-bet-ch-header-content-bg: #0f202e;
  --app-sports-floating-bet-ch-svg-color: #fff;
  --app-sports-slider-quickAmount-bg: #192934;
  --app-sports-slider-quickAmount-btn-bg: var(--tg-sport-card-bg);
  --app-sports-slider-quickAmount-border: #304554;
  --app-sports-slider-quickAmount-active-bg: var(--tg-secondary-grey);
  --app-sports-slider-quickAmount-active-border: var(--tg-text-blue);
  --app-sports-slider-border: transparent;
  --app-sports-slider-active-bg: var(--tg-primary-active);
  --app-sports-slider-text: #fff;
  --app-sports-slider-text-win: #fff;
  --app-sports-slider-iocn1: #1475e1;
  --app-sports-slider-iocn2: 196, 196, 196;
}

[theme='green'] {
  --app-sports-floating-bet-ch-header-bg: #f6d14a;
  --app-sports-floating-bet-ch-header-text-bg: #02432d;
  --app-sports-floating-bet-ch-header-text: #fff;
  --app-sports-floating-bet-ch-header-content-bg: #055434;
  --app-sports-floating-bet-ch-svg-color: #055434;
  --app-sports-slider-quickAmount-bg: #0e6746;
  --app-sports-slider-quickAmount-btn-bg: #055434;
  --app-sports-slider-quickAmount-border: transparent;
  --app-sports-slider-quickAmount-active-bg: #055434;
  --app-sports-slider-quickAmount-active-border: #f6d14a;
  --app-sports-slider-border: transparent;
  --app-sports-slider-active-bg: #f6d14a;
  --app-sports-slider-text: #02432d;
  --app-sports-slider-text-win: #fff;
  --app-sports-slider-iocn1: #055434;
  --app-sports-slider-iocn2: 5, 84, 52;
}

[theme='white'] {
  --app-sports-floating-bet-ch-header-bg: #f2ca5c;
  --app-sports-floating-bet-ch-header-text-bg: #000;
  --app-sports-floating-bet-ch-header-text: #f2ca5c;
  --app-sports-floating-bet-ch-header-content-bg: #fff;
  --app-sports-floating-bet-ch-svg-color: #484848;
  --app-sports-slider-quickAmount-bg: #d8d8d8;
  --app-sports-slider-quickAmount-active-bg: #f7f4e7;
  --app-sports-slider-quickAmount-active-border: #f2ca5c;
  --app-sports-slider-quickAmount-border: transparent;
  --app-sports-slider-active-bg: #f2ca5c;
  --app-sports-slider-text: #484848;
  --app-sports-slider-text-win: #fff;
  --app-sports-slider-iocn1: #111111;
  --app-sports-slider-iocn2: 17, 17, 17;
}
</style>

<style lang="scss" scoped>
.header-close {
  @include webTheme('green') {
    --tg-icon-color: #02432d;
  }
}

.app-sports-floating-bet-ch {
  left: var(--pc-h5model-left, 0);
  top: 0;
  bottom: 0;
  right: 0;
  width: var(--pc-h5model-width, 100%);

  @include webTheme('green') {
    background-color: #00000080;
  }
}

.theme-text-color {
  color: var(--tg-text-lightgrey);

  @include webTheme('green') {
    color: #ffeeb0;
    --tg-icon-color: #ffeeb0;
    --tg-base-button-secondary-bg: #ffeeb0;
  }
}

.theme-btn-color {
  @include webTheme('green') {
    --tg-base-button-secondary-bg: #ffeeb0;
    --tg-text-white: #02432d;
  }
}

.theme-bg-color {
  background-color: var(--tg-secondary-grey);

  @include webTheme('green') {
    background-color: #0e6746;
    --tg-base-input-style-placeholder-color: #3cb389;
  }
}

.jion-now {
  color: #fff;

  @include webTheme('white') {
    color: #111;
  }
}

.base-input {
  --tg-base-input-readonly-bg-color: var(--tg-secondary-dark);

  @include webTheme('white') {
    --tg-base-input-style-background-color: #f5f5f5;
    --tg-base-input-style-border: 1px solid #e3e3e3;
  }

  @include webTheme('green') {
    --tg-base-input-style-bg: #02432d;
    --tg-base-input-readonly-bg-color: #02432d;
    --tg-base-input-style-border: 1px solid #197b59;
  }
}

.base-multi-input {
  --tg-base-input-readonly-bg-color: var(--tg-secondary-dark);

  @include webTheme('white') {
    --tg-base-input-style-background-color: #f5f5f5;
  }

  @include webTheme('green') {
    --tg-base-input-readonly-bg-color: #02432d;
  }

  &.active {
    @include webTheme('green') {
      border: 1px solid #f6d14a;
      border-radius: 4px;
    }

    @include webTheme('white') {
      border: 1px solid #f2ca5c;
      border-radius: 4px;
    }
  }
}

.booking-input {
  border: var(--tg-base-input-style-border);

  @include webTheme('green') {
    background-color: #02432d;
    border: 1px solid #197b59;
  }

  @include webTheme('white') {
    background-color: #f5f5f5;
  }
}

.add-more-macth-wrap {
  @include webTheme('green') {
    background-color: #0e6746;
  }
}

.add-more-macth {
  color: var(--tg-text-blue);

  @include webTheme('green') {
    color: #3cb389;
  }
}
</style>

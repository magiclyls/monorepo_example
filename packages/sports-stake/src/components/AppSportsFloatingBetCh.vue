<script lang="ts" setup>
import type { IBetArgs, IBetReserveArgs, ICartInfoData, ISportListToCartData } from '@tg/types'
import type { ComputedRef } from 'vue'
import BScroll from '@better-scroll/core'
import { ApiSportPlaceBet, ApiSportPlaceBetInfo, ApiSportPlaceReserve } from '@tg/apis'
import {
  BaseImage,
  SSBaseButton,
  SSBaseCurrencyIcon,
  SSBaseDialog,
  SSBaseEmpty,
  SSBaseInput,
  SSBaseNumericKeypad,
  SSBaseSelect,
} from '@tg/bccomponents'
import { useBoolean, useSelect } from '@tg/hooks'
import {
  IconNavbarUser,
  IconSptAdd,
  IconSptChuanQuestion,
  IconSptSub,
  IconSptUserAdd,
  IconSptUserBook,
  IconUniClose,
} from '@tg/icons'
import { useAppStore, useCurrency, useSportsStore } from '@tg/stores'
import {
  EnumOddsChange,
  EnumsBetSlipBetSlipTabStatus,
  EnumSportsEventType,
  ESportsToMainPageRoutes,
  EventBusNames,
} from '@tg/types'
import {
  add,
  appEventBus,
  application,
  getEnv,
  getSportMultiDataByLength,
  Local,
  mul,
  STORAGE_SPORTS_BET_ORDER,
  sub,
} from '@tg/utils'
import { useElementSize } from '@vueuse/core'
import { cloneDeep } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useSportsConfig } from '../../config/index'
import AppMultiBetExplainDialog from './AppMultiBetExplainDialog.vue'
import AppSportCartToAllEvent from './AppSportCartToAllEvent.vue'
import AppSportsBetSlipCh from './AppSportsBetSlipCh.vue'
import AppSportsSlider from './AppSportsSlider'

defineOptions({ name: 'AppSportsFloatingBetCh' })
const emit = defineEmits(['changeBallshow'])

const { VITE_SPORT_MULTI_BET_MAX } = getEnv()
const { t } = useI18n()
const sportStore = useSportsStore()
const { projectName } = useSportsConfig()
const appStore = useAppStore()
const { isLogin } = storeToRefs(appStore)
const { currentGlobalCurrencyMap } = storeToRefs(useCurrency())
// 展示串关详情弹窗
const { bool: showMultiBetExplainDialog } = useBoolean(false)
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
// 当前显示的串关类型
const chuanDialogType = ref(0)

// 预约投注的赔率
const appointingOv = ref(0)
const siderProgress = ref(0)
/** 快捷金额按钮数据 从接口获取 */
const quickBetAmountBtns = ref<Array<number | string>>(['', '', '', ''])

const maxHeight = computed(() => {
  return showMultiInput.value ? 'calc(100vh - 372px)' : '440px'
})
const selectTabsTwo = computed(() => [
  { label: t('接受任何赔率'), value: EnumOddsChange.acceptAnyOddsChange },
  { label: t('只接受更高的赔率'), value: EnumOddsChange.acceptHigherOdds },
  /*  { label: t('不接受任何赔率更改'), value: EnumOddsChange.notAcceptAnyOddsChange }, 需求STAK-22227 */
])
const { selected: betOrderFilterValue, list: betOrderFilterData } = useSelect(selectTabsTwo.value)

const suffixLength = computed(() => currentGlobalCurrencyMap.value.type === 'BTC' ? 5 : 2)
/** 是否串关 */
const isMulti = computed(() => EnumSportsEventType.CHUAN === sportStore.lobbyCurrentEventType)
/** 购物车数据 */
const cartDataList = computed(() => {
  return sportStore.cart.dataList.slice().reverse()
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
    const oVal = chuanInputList.value[currentActiveInpout.value]?.a as any
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
  const val: any = application.formatNumDecimal(+currentGlobalCurrencyMap.value.balance, suffixLength.value, suffixLength.value)
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
    obj.errorMess = t('该场馆暂不支持您所选择的币种')
    return obj
  }

  // 如果是复式是否符合获取信息请求
  if (isMulti.value) {
    // 判断是否存在同一赛事的多重投注项
    if (sportStore.cart.getExistSameEventIdList.length) {
      obj.errorMess = t('同一场赛事的多个投注项不能组合为复式投注')
      return obj
    }
    // 判断是否存在不支持串关赛事 os===2 || ic===2
    if (
      sportStore.cart.getNotSupportWidList.length || sportStore.cart.getExistIcList.length
    ) {
      obj.errorMess = t('您有不支持复式投注的投注项')
      return obj
    }

    if (sportStore.cart.getOddsLessThanOnePointOneWidList.length) {
      obj.errorMess = t('赔率小于1')
      return obj
    }
  }

  if (fetchBetInfoStatus.value === false) {
    obj.errorMess = t('获取投注信息失败')
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
        obj.errorMess = t('复式投注赔率超过上限')
        return obj
      }
      if (a < mia) {
        obj.errorMess = t('每次投注至少下注', { amount: application.formatNumDecimal(mia, suffixLength.value) })
        obj.isShowCurrency = true
        return obj
      }
      if (a > maa) {
        obj.errorMess = t('每次投注最多下注', { amount: application.formatNumDecimal(maa, suffixLength.value) })
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
      obj.errorMess = t('每次投注至少下注', { amount: application.formatNumDecimal(mia, suffixLength.value) })
      obj.isShowCurrency = true
      return obj
    }
    if (amount > maa) {
      obj.errorMess = t('每次投注最多下注', { amount: application.formatNumDecimal(maa, suffixLength.value) })
      obj.isShowCurrency = true
      return obj
    }
  }

  if (sportStore.cart.count > VITE_SPORT_MULTI_BET_MAX) {
    obj.errorMess = t('同时最多只能添加', { max: VITE_SPORT_MULTI_BET_MAX })
    return obj
  }

  if (sportStore.cart.isExistCloseCaps) {
    obj.errorMess = t('您有暂停的投注项')
    return obj
  }

  // 余额不足
  if (+currentGlobalCurrencyMap.value.balance < +sportStore.cart.totalPay) {
    obj.errorMess = t('您的投注额不能大于余额')
    return obj
  }

  // 金额是不是10的倍数
  if (sportStore.cart.isTenMultiple && sportStore.cart.isTenMultipleBool) {
    obj.errorMess = t('只支持10的整数倍的投注金额')
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
    cur: currentGlobalCurrencyMap.value.cur,
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
  const error = errorInfo()

  if (error.bool) {
    appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: error.errorMess, type: 'error' })
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
        cur: currentGlobalCurrencyMap.value.cur,
      }))
      fetchBet(betList)
    }
    else {
      // 预约投注
      const betList = sportStore.cart.dataList.map(item => ({
        bi: [item],
        a: Number(item.amount),
        target_odd: String(appointingOv.value),
        cur: currentGlobalCurrencyMap.value.cur,
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
        cur: currentGlobalCurrencyMap.value.cur,
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
  errorStr.length && appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: t('您有失败的串关投注项'), type: 'error' })
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
  appEventBus.emit(EventBusNames.APP_GLOBAL_MESSAGE, { content: t('下注成功'), type: 'success' })
}
// 查看我的投注
function checkMyBets() {
  sportStore.cart.removeAll()
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.MY_BET })
}
function initBetOrderFilterValue() {
  betOrderFilterValue.value = Local.get<EnumOddsChange>(STORAGE_SPORTS_BET_ORDER)?.value ?? EnumOddsChange.acceptAnyOddsChange
}
// 关闭浮窗
function closeFloating(clearAll: boolean) {
  if (betLoading.value)
    return
  emit('changeBallshow', true)
  if (!isMulti.value || clearAll)
    sportStore.cart.removeAll()
}
// 打开串关详情
function openMultiBetExplainDialog(data: { type: number }) {
  showMultiBetExplainDialog.value = true
  chuanDialogType.value = data.type
}
// 打开登录
function openLogin() {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.LOGIN })
  sportStore.cart.removeAll()
}

function noDataGoToBet() {
  appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.SPORTS_HOME })
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
    bsInstance && bsInstance.refresh()
  })
})

watch([isLogin, currentGlobalCurrencyMap], () => {
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
  initBetterScroll()
})

onUnmounted(() => {
  closeSetInterval()
  removeListToCartEvent()
})
</script>

<template>
  <div class="app-sports-floating-bet-ch inset-0 ">
    <!-- 头部 -->
    <div
      class="text-[var(--ss-spt-floating-bet-ch-color1)]  h-[45rem] flex flex-shrink-0 items-center justify-between rounded-tl-[6rem] rounded-tr-[6rem] bg-[var(--ss-spt-floating-bet-ch-bg1)] pl-[12rem] font-semibold"
    >
      <div class="h-[28rem] w-[28rem] flex items-center justify-center rounded-[6rem] bg-[var(--ss-spt-floating-bet-ch-bg2)] text-[var(--ss-spt-floating-bet-ch-color2)]">
        <span>{{ isMulti ? '串' : '单' }}</span>
      </div>
      <div class="px-[12rem] py-[12rem] text-[14rem]">
        <SSBaseButton type="text" size="none" :disabled="betLoading" @click="closeFloating(false)">
          <IconUniClose class="header-close" style="color:var(--ss-spt-floating-bet-ch-color3);" />
        </SSBaseButton>
      </div>
    </div>
    <!-- 注单区域 -->
    <div class="w-full flex flex-col overflow-hidden bg-[var(--ss-spt-floating-bet-ch-bg3)]">
      <!-- 相互推送消息 -->
      <AppSportCartToAllEvent ref="sportCartToAllEventRef" @receive="eventReceive" />
      <!-- tab -->
      <div class="grid grid-flow-row place-content-stretch">
        <div class="flex items-center justify-between px-[12rem] py-[15rem] leading-[14rem]">
          <SSBaseButton
            v-if="sportStore.cart.isShowReuse" type="text" size="none" @click="reuseBetSlip"
          >
            {{ t('重新使用投注单') }}
          </SSBaseButton>
          <div v-else class="w-0 flex grow overflow-hidden">
            <SSBaseSelect
              v-model="betOrderFilterValue" class="flex overflow-hidden" :options="betOrderFilterData" :project-name="projectName"
              :disabled="betLoading" style="
              --ss-base-select-height:20rem;
              --ss-base-select-background-color:transparent;
              --ss-base-select-border-color:transparent;
              --ss-base-select-label-color:var(--ss-spt-floating-bet-ch-color12);
              --ss-base-select-padding:0;
              " @change="setBetOrderFilterValue"
            />
          </div>

          <SSBaseButton
            type="text" class="clear-all" size="none"
            :disabled="betLoading" style="--ss-base-button-text-default-color:var(--ss-spt-floating-bet-ch-color13);"
            @click="closeFloating(true)"
          >
            {{ t('全部清除') }}
          </SSBaseButton>
        </div>
      </div>
      <!-- 注单列表 -->
      <div v-if="cartDataList.length === 0" class="empty">
        <SSBaseEmpty>
          <template #icon>
            <BaseImage width="120px" :url="`/${projectName}/png/uni-table-empty.png`" />
          </template>
          <template #description>
            <span class="mid-text">{{ t('投注单为空') }}</span>
          </template>
          <template #default>
            <div style="margin-top: 4rem">
              <SSBaseButton
                type="text" size="none"
                @click="noDataGoToBet"
              >
                {{ t('立即开始下注') }}
              </SSBaseButton>
            </div>
          </template>
        </SSBaseEmpty>
      </div>
      <div
        v-else ref="betSlipScrollWrapper" class="w-full flex grow flex-col overflow-hidden px-[12rem]"
        :style="{ '-webkit-overflow-scrolling': 'touch', 'max-height': maxHeight }"
      >
        <div ref="betSlipScrollContent">
          <div class="mb-[12rem] flex flex-col gap-[12rem]">
            <AppSportsBetSlipCh
              v-for="item, index in cartDataList" :key="item.wid" :is-multi="isMulti"
              :disabled="betLoading" class="flex-shrink-0" :cart-info-data="item" :index="index"
              :cart-data-list="cartDataList"
            />
          </div>
          <!-- 单式独有 -->
          <template v-if="!sportStore.cart.isShowReuse && !isMulti">
            <!-- 单式投注输入框 -->
            <div class="flex justify-between" :class="[appointing ? 'mb-[6rem]' : 'mb-[12rem]']">
              <SSBaseInput
                ref="inputRef" :key="currentGlobalCurrencyMap.type"
                v-model:model-value="cartDataList[0].amount" class="base-input mr-[6rem] flex-1"
                style="--ss-base-input-height: 44rem;" :placeholder="placeholder" type="text" mb0
                :show-error-msg="false" input-mode="decimal" :disabled="true"
                :msg-after-touched="true" @click="setKeyBoardBool(true)"
              >
                <template #right-icon>
                  <SSBaseCurrencyIcon :currency-type="currentGlobalCurrencyMap.type" />
                </template>
              </SSBaseInput>
              <SSBaseButton
                v-if="!isClosed" :disabled="betLoading" style="width: 95rem; height: 44rem;"
                @click="onAppointing"
              >
                <div class="flex items-center">
                  <template v-if="!appointing">
                    <IconSptUserBook style="font-size: 20rem;color: var(--ss-spt-floating-bet-ch-color14)" />
                    <span class="ml-[2rem]">预约</span>
                  </template>
                  <template v-else>
                    <span>取消预约</span>
                  </template>
                </div>
              </SSBaseButton>
            </div>
            <!-- 预约输入框 -->
            <div
              v-if="!isClosed && appointing"
              class="booking-input mb-[6rem] h-[44rem] flex select-none items-center justify-between rounded-[4rem] px-[10rem]"
            >
              <div class="cursor-pointer" @click="changeAppointOv('sub')">
                <IconSptSub style="font-size: 20rem; color: var(--ss-spt-floating-bet-ch-color4);" />
              </div>
              <span class="text-[#24EE89] text-[18rem] font-semibold" style="font-family: proxima-nova">@ {{
                appointingOv
              }}</span>
              <div class="cursor-pointer " @click="changeAppointOv('add')">
                <IconSptAdd style="font-size: 20rem; color: var(--ss-spt-floating-bet-ch-color4);" />
              </div>
            </div>
            <!-- 快捷金额 -->
            <div v-if="quickBetAmountBtns.length > 0 || keyboardBool" class="rounded-[6rem] bg-[var(--ss-spt-floating-bet-ch-bg4)] p-[4rem]">
              <div
                v-if="quickBetAmountBtns.length > 0 && isLogin"
                class="grid grid-flow-col mb-[8rem] w-full gap-x-[5rem]"
              >
                <div
                  v-for="num in quickBetAmountBtns" :key="num"
                  :class="[currentQuickBetAmount === num
                    ? 'bg-[var(--ss-spt-floating-bet-ch-bg5)] border-[var(--ss-spt-floating-bet-ch-border1)] text-[var(--ss-spt-floating-bet-ch-color5)]'
                    : 'bg-[var(--ss-spt-floating-bet-ch-bg6)] border-[var(--ss-spt-floating-bet-ch-border2)]']
                  "
                  class="text-[var(--ss-spt-floating-bet-ch-color6)] group h-[40rem] grow cursor-pointer border-[2rem] rounded-[4rem] border-solid text-center text-[14rem] font-semibold leading-[40rem]"
                  @click="onQuickBetAmountClick(num)"
                >
                  <span class="inline-block select-none group-active:scale-[0.96]">{{ num }}</span>
                </div>
              </div>
              <!-- 虚拟键盘 -->
              <div v-if="keyboardBool" class="left-0 w-full" style="height: 150rem;">
                <SSBaseNumericKeypad
                  type="ch" @key-num="handleKeyNum" @key-max="handleMax" @key-hide="handleHide"
                  @key-delete="handleDelete"
                />
              </div>
            </div>
          </template>
          <!-- 复式独有 -->
          <div v-if="isMulti" class="flex flex-col gap-[12rem]">
            <div
              v-for="item, index in chuanInputList" ref="chuanInputListWrapper" :key="item.text"
              class="theme-bg-color w-full h-[48rem] flex items-center justify-between rounded-[4rem] px-[8rem] font-semibold"
            >
              <div class="flex items-center justify-between text-[14rem]">
                <div
                  class="flex cursor-pointer items-center justify-between"
                  @click="openMultiBetExplainDialog({ type: item.pt })"
                >
                  <IconSptChuanQuestion style="color:var(--ss-spt-bet-slip-ch-color16);" />
                </div>
                <span class="text-[var(--ss-spt-floating-bet-ch-color7)] ml-[4rem]">{{ item.text }}</span>
              </div>
              <div class="flex items-center justify-between text-[14rem]">
                <span class="text-[var(--ss-spt-floating-bet-ch-color7)] mr-[4rem]">{{ item.times }}x</span>
                <SSBaseInput
                  ref="inputRef" :key="currentGlobalCurrencyMap.type" v-model:model-value="item.a"
                  class="base-multi-input" :class="{ active: index === currentActiveInpout }"
                  :active="index === currentActiveInpout" :style="{ '--ss-base-input-style-border': 'none' }"
                  :readonly="true" style="--ss-base-input-height: 32rem;width: 174rem;"
                  :placeholder="`限额${item.mia}-${item.maa}`" type="text" mb0 :disabled="isDisabled || betLoading"
                  @click="onClickMultiInput(index)"
                />
              </div>
            </div>
            <div
              v-if="cartDataList.length < VITE_SPORT_MULTI_BET_MAX"
              class="w-full add-more-macth-wrap mb-[8rem] bg-[var(--ss-spt-floating-bet-ch-bg7)] h-[48rem] flex cursor-pointer items-center justify-center rounded-[4rem] font-semibold"
              @click="closeFloating(false)"
            >
              <IconSptUserAdd class="add-more-macth" :class="{ 'opacity-50': betLoading }" style="font-size: 20px" />
              <span :class="{ 'opacity-50': betLoading }" class="add-more-macth ml-[4rem] text-[14rem]">添加赛事</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 复式独有 快捷金额 -->
      <div v-if="isMulti && showMultiInput" class="px-[12rem]">
        <div class="rounded-[6rem] bg-[var(--ss-spt-floating-bet-ch-bg4)] p-[4rem]">
          <div v-if="quickBetAmountBtns.length > 0 && isLogin" class="mb-[8rem] w-full flex gap-[10rem]">
            <div
              v-for="num in quickBetAmountBtns" :key="num"
              :class="[currentQuickBetAmount === num
                ? 'bg-[var(--ss-spt-floating-bet-ch-bg5)] border-[var(--ss-spt-floating-bet-ch-border1)] text-[var(--ss-spt-floating-bet-ch-color5)]'
                : 'bg-[var(--ss-spt-floating-bet-ch-bg6)] border-[var(--ss-spt-floating-bet-ch-border2)]']
              "
              class="text-[var(--ss-spt-floating-bet-ch-color6)] group h-[40rem] grow cursor-pointer border-[2rem] rounded-[4rem] border-solid text-center text-[14rem] font-semibold leading-[40rem]"
              @click="onQuickBetAmountClick(num)"
            >
              <span class="inline-block select-none group-active:scale-[0.96]">{{ num }}</span>
            </div>
          </div>
          <!-- 虚拟键盘 -->
          <div class="left-0 w-full" style="height: 150px;">
            <SSBaseNumericKeypad
              type="ch" @key-num="handleKeyNum" @key-max="handleMax" @key-hide="handleHide"
              @key-delete="handleDelete"
            />
          </div>
        </div>
      </div>

      <!-- 投注 -->
      <div v-if="isLogin" class="flex justify-between px-[12rem] pb-[17rem] pt-[12rem]">
        <template v-if="sportStore.cart.isShowReuse">
          <SSBaseButton size="md" class="w-full" @click="checkMyBets">
            {{ t('查看我的投注') }}
          </SSBaseButton>
        </template>
        <template v-else>
          <AppSportsSlider
            v-model="siderProgress" class="flex-1" :is-closed="isClosed" :loading="betLoading"
            :disabled="cartDataList.length === 0" :appointing="appointing" :appointing-profit="appointingProfit"
            :profit="sportStore.cart.totalProfit" :multi-profit="multiProfit" :is-multi="isMulti"
            :count="cartDataList.length" :multitotal-bet="multitotalBet" @to-right="startBet"
            @drag-start="handleKeyNum('format')"
          />
          <!-- 串关切换按钮 -->
          <SSBaseButton
            :disabled="betLoading"
            style="--ss-base-button-border-radius:50%;margin-left: 12rem;width: 48rem; height: 48rem; padding:0 10rem;"
            @click="changeBetCi"
          >
            <template v-if="isMulti">
              <div class="flex flex-col items-center">
                <span class="whitespace-nowrap">单关</span>
                <span class="whitespace-nowrap">投注</span>
              </div>
            </template>
            <div v-else class="flex items-center">
              <IconSptUserBook style="font-size: 14rem;color:var(--ss-spt-floating-bet-ch-color14)" />
              <span>串</span>
            </div>
          </SSBaseButton>
        </template>
      </div>
      <!-- 未登录 -->
      <div v-else class="flex flex-col gap-[8rem] px-[12rem] pb-[13rem] pt-[12rem]">
        <div
          class="theme-text-color flex items-center justify-center gap-[10rem] text-[14rem] font-medium leading-[20rem]"
        >
          <IconNavbarUser />
          <span>{{ t('请登录后投注') }}</span>
        </div>
        <SSBaseButton class="theme-btn-color" size="sm" style="--ss-base-button-font-size:16px;" @click="openLogin">
          {{ t('登录') }}
        </SSBaseButton>
        <div
          class="theme-text-color flex items-center justify-center gap-[10rem] text-[14rem] font-medium leading-[20rem]"
        >
          <span>{{ t('您没有账户') }}</span>
          <SSBaseButton
            type="text" size="none"
            @click="appEventBus.emit(EventBusNames.SPORTS_TO_MAIN_PAGE_ROUTE, { name: ESportsToMainPageRoutes.REGISTER })"
          >
            <span class="jion-now">{{ t('立即加入') }}</span>
          </SSBaseButton>
        </div>
      </div>
    </div>

    <!-- 串关详情弹窗 -->
    <SSBaseDialog v-if="showMultiBetExplainDialog" v-model="showMultiBetExplainDialog">
      <template #dialog>
        <AppMultiBetExplainDialog :type="chuanDialogType" />
      </template>
    </SSBaseDialog>
  </div>
</template>

<style lang="scss" scoped>
.app-sports-floating-bet-ch {
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--pc-max-width);
  display: flex;
  flex-direction: column;
  justify-content: end;
  overflow: hidden;
  z-index: 40;
}

.theme-text-color {
  color: var(--ss-spt-floating-bet-ch-color8);
}

.theme-bg-color {
  background-color: var(--ss-spt-floating-bet-ch-bg8);
}

.jion-now {
  color: var(--ss-spt-floating-bet-ch-color9);
}

.base-input {
  --ss-base-input-readonly-bg-color: var(--ss-spt-floating-bet-ch-bg9);
}

.base-multi-input {
  --ss-base-input-readonly-bg-color: var(--ss-spt-floating-bet-ch-bg9);
  --ss-base-input-style-placeholder-color: var(--ss-spt-floating-bet-ch-color10);
}

.booking-input {
  border: var(--ss-spt-floating-bet-ch-border3);
}

.add-more-macth {
  color: var(--ss-spt-floating-bet-ch-color11);
}
</style>

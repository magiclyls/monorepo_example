<script setup lang='ts'>
import type { PokerCardProps, PokerRank } from '~/types'
import { IconUniPairRight, IconUniArrowGodown } from '@tg/icons'

import { ApiGameOriginalHilo } from '@tg/apis'
import { GAMES_LIST_ENUM } from 'feie-ui'
import gsap from 'gsap'
import { PokerColors } from '~/utils/enums'

type MyPokerCardProps = PokerCardProps & {
  uid?: number
  multiplier?: string
  betVal: string
  resultIcon?: string
  isWin?: boolean
  /** 是否为第一次进入页面初始化的数据 */
  isInit?: boolean
  rank: PokerRank
  color: PokerColors
}
defineOptions({
  name: 'AppMiniGameMainHilo',
})
const maxSkip = 52
const { t } = useI18n()
const onLoaded = inject('onLoaded', () => { })
const formDisabled = inject('formDisabled', ref(true))
const appStore = useAppStore()
const { currentGlobalCurrency, isLogin, userInfo } = storeToRefs(appStore)
const { appContentWidth } = storeToRefs(useWindowStore())
const { EnumBetType, betTextConfig } = useMiniGameHiloData()
const {
  rate,
  orderCurrencyCode,
  toFixedByLockCurrency,
  getLockCurrencyPrefix,
} = useMiniGameLockCurrency(currencyConfig[currentGlobalCurrency.value].cur)
const {
  runAsync: runAsyncBetHilo,
  // loading: loadingBetHilo,
  data: dataBetHilo,
} = useRequest(ApiGameOriginalHilo, {
  onAfter: () => {
    setTimeout(() => {
      appStore.getBalanceData()
    }, 300)
  },
})
const { openRegisterDialog } = useRegisterDialog()
const { openMiniGameInfoInsertDialog } = useMiniGameInsertDialogMinesGameInfo({ gameType: GAMES_LIST_ENUM.HILO })
const { openMiniGameHotKeysInsertDialog } = useMiniGameInsertDialogHotKeys({ gameType: GAMES_LIST_ENUM.HILO })
const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()
const { play: playGuess } = useMiniGamePublicPlayMp3('/audio/hilo.guess.mp3')
const { play: playGameBet } = useMiniGamePublicPlayMp3('/audio/bet.mp3')
const { play: playCorrect } = useMiniGamePublicPlayMp3('/audio/hilo.correct.mp3')
const { play: hiloWin } = useMiniGamePublicPlayMp3('/audio/mines.win.mp3')

const skipCount = ref(0)

// type EnumBetKey = keyof typeof EnumBetType
type EnumColorKey = keyof typeof PokerColors
/** 大于或等于-higher_equal 大于-higher 小于或等于-lower_equal 小于-lower   等于-equal  跳过-skip  */
// enum EnumBetType { 'higher_equal', 'higher', 'lower_equal', 'lower', 'equal', 'skip' }
/** 牌大小 */
const rankConfig: PokerRank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
/** 花色 */
const colorConfig: EnumColorKey[] = ['HEITAO', 'HONTAO', 'FANGKUAI', 'MEIHUA']
/** 利润率 */
const multiplierConfig: {
  [t: string]: {
    /** 选择 “大于或等于” 的利润 */
    H: number
    /** 选择 “小或等于” 的利润 */
    L: number
  }
} = {
  A: { H: 1.0725, L: 12.87 },
  2: { H: 1.0725, L: 6.435 },
  3: { H: 1.17, L: 4.29 },
  4: { H: 1.28699, L: 3.2175 },
  5: { H: 1.43, L: 2.57399 },
  6: { H: 1.60875, L: 2.145 },
  7: { H: 1.83857, L: 1.83857 },
  8: { H: 2.145, L: 1.60875 },
  9: { H: 2.57399, L: 1.43 },
  10: { H: 3.2175, L: 1.28699 },
  J: { H: 4.29, L: 1.17 },
  Q: { H: 6.435, L: 1.0725 },
  K: { H: 12.87, L: 1.0725 },
}
/** 牌记录 */
const pokerRecord = ref<MyPokerCardProps[]>([])
/** 投注额 投注了会被禁用 */
const amount = ref('0.00')
/** 当前牌Ref */
const currentCardRef = ref()
/** 投注额Ref */
const betAmountRef = ref()
/** 上一张牌Ref */
const prevCardRef = ref()
/** 当前牌 */
const currentCard = ref<MyPokerCardProps>({
  uid: new Date().getTime(),
  faceDown: false,
  multiplier: '',
  betVal: '',
  resultIcon: '',
  isWin: true,
  rank: 'A',
  color: PokerColors.HEITAO,
})
/** 上一张牌 */
const prevCard = ref<MyPokerCardProps | null > (null)
/** 是否投注 ,未投注禁用大于，小于按钮 */
const { bool: isBet, setBool: setIsBet } = useBoolean(false)
/** 是否展示兑现结果弹框， */
const { bool: showBetResult, setBool: setShowBetResult } = useBoolean(false)
/** 是否开启动画 */
const { bool: animateEnabled } = useBoolean(true)
/** 当前订单信息 */
const orderInfo = reactive({
  /** 投注id */
  id: '',
  /** 投注币种 */
  currency: orderCurrencyCode.value,
  /** 赔付乘数 */
  payout_multiplier: '',
  /** 金额倍数 */
  amount_multiplier: '',
  /** 派彩金额 */
  payout: '0.00',
  /** 投注金额 */
  amount: '0',
})

/** 第一个下注按钮 */
const getUpBtn = computed(() => {
  switch (currentCard.value?.rank) {
    case 'A': return betTextConfig[EnumBetType[1]]
    case 'K': return betTextConfig[EnumBetType[4]]
    default: return betTextConfig[EnumBetType[0]]
  }
})
/** 第二个下注按钮 */
const getDownBtn = computed(() => {
  switch (currentCard.value?.rank) {
    case 'A': return betTextConfig[EnumBetType[4]]
    case 'K': return betTextConfig[EnumBetType[3]]
    default: return betTextConfig[EnumBetType[2]]
  }
})
/** 是否h5模式 */
const isH5 = computed(() => {
  return appContentWidth.value < 800
})
/** 计算获胜大于或等于获胜几率 higher_equal */
const getHigherEqualWinning = computed(() => {
  const rank = currentCard.value?.rank ?? ''
  if (rank === 'A')
    return '92.31'
  else
    return (+div((rankConfig.length - rankConfig.indexOf(rank)), rankConfig.length) * 100).toFixed(2)
})
/** 计算获胜小于或等于获胜几率 lower_equal */
const getLowerEqualWinning = computed(() => {
  const rank = currentCard.value?.rank ?? ''
  if (rank === 'K')
    return '92.31'
  else
    return (+div((rankConfig.indexOf(rank) + 1), rankConfig.length) * 100).toFixed(2)
})
/** 总利润乘数 */
const totalProfitScale = computed(() => {
  return pokerRecord.value.slice(-1)[0]?.multiplier ?? '0.00'
})
/** 总利润金额 */
const totalProfitAmount = computed(() => {
  return toFixed(mul(+totalProfitScale.value, +orderInfo.amount), 2) // dataBetHilo.value?.settle_amount ?? '0' //
})
/** 当前展示货币，如果已投注，切换全局货币无效 */
const showCurrency = computed(() => {
  return isBet.value ? getCurrencyConfigByCode(orderInfo.currency).name : currentGlobalCurrency.value
})
/**  选择 “大于或等于” 的利润 百分比 */
const higherProfitRate = computed(() => {
  return toFixed(multiplierConfig[currentCard.value.rank].H, 2)
})
/** 选择 “大于或等于” 的利润 */
const higherProfit = computed(() => { // isBet.value ? +orderInfo.amount : +amount.value
  return toFixed(sub(+mul(+higherProfitRate.value, +amount.value), +amount.value), 2)
})
/** 选择 “小或等于” 的利润 百分比 */
const LowerProfitRate = computed(() => {
  return toFixed(multiplierConfig[currentCard.value.rank].L, 2)
})
/** 选择 “小或等于” 的利润 */
const LowerProfit = computed(() => { // isBet.value ? +orderInfo.amount : +amount.value
  return toFixed(sub(+mul(+LowerProfitRate.value, +amount.value), +amount.value), 2)
})
/** 判断是否可以兑现，至少投注过一次才能兑现 */
const isHonor = computed(() => {
  return isBet.value ? !pokerRecord.value.find(item => ['higher_equal', 'higher', 'lower_equal', 'lower', 'equal'].includes(item.betVal)) : false
})
/** 获取动画秒数 未开启动画返回0s */
const duration = computed(() => {
  return animateEnabled.value ? 0.3 : 0
})
/** 投注货币前缀 */
const currencyPrefix = computed(() => getLockCurrencyPrefix(showCurrency.value))
/** 投注额，转换 */
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+amount.value, +rate.value))))
/** 飞牌最右方向 */
const { bool: direction, setBool: setDirection } = useBoolean(false)

/** 防止快速点击，出错 */
function betThrottle(betType: string, action: 1 | 2 | 3) {
  if (!formDisabled.value)
    bet(betType, action)
}
/** 下注 跳过 */
function bet(betType: string, action: 1 | 2 | 3) {
  formDisabled.value = true
  setShowBetResult(false)
  const _isBet = isBet.value
  if (isBet.value) { // 如果投注了,接口请求下一张牌
    skipCount.value += 1
    playGuess()
    runAsyncBetHilo({
      type: isBet.value ? 2 : 4,
      currency_id: orderInfo.currency,
      amount: amount.value,
      id: orderInfo.id,
      action,
    }).then((data) => {
      if (data.active) {
        const lastRound = data.state.rounds.slice(-1)[0]
        playNextCard(betType, { rank: lastRound.card.rank, color: lastRound.card.suit }, toFixed(Number(lastRound.payout_multiplier), 2), true)
      }
      else {
        if (data.state.rounds) { // 存在历史牌，说明是猜错了，需要展示结果
          orderInfo.amount = '0'
          const lastRound = data.state.rounds.slice(-1)[0]
          playNextCard(betType, { rank: lastRound.card.rank, color: lastRound.card.suit }, toFixed(Number(lastRound.payout_multiplier), 2), true)
          setIsBet(false)
        }
        else { // 未下注，直接跳过
          playNextCard(betType, { rank: data.state.start_card.rank, color: data.state.start_card.suit })
        }
      }
    })
  }
  const _direction = direction.value ? -1 : 1
  setDirection(!direction.value)
  if (pokerRecord.value.length > 1 && !isBet.value) { // 投注猜错了，自动结束了，需要先清理牌记录
    collectCard(() => {
      cardFly(_isBet, _direction, betType)
    })
  }
  else {
    cardFly(_isBet, _direction, betType)
  }
}
/** 牌飞走动画 */
function cardFly(_isBet: boolean, direction: number, betType: string) {
  const rank = _isBet ? currentCard.value?.rank : getRank()
  const color = getColor()
  prevCardRef.value.style.transform = ''
  setTimeout(() => {
    currentCard.value = {
      faceDown: _isBet,
      rank,
      color,
      isWin: true,
      betVal: '',
    }
    setTimeout(() => {
      gsap.fromTo(prevCardRef.value, {
        translateX: 0,
        translateY: 0,
        rotation: 0,
      }, {
        duration: duration.value,
        translateX: `${30 * direction}vw`,
        translateY: '-50vh',
        rotation: direction * -40, // 上面先飞走
        ease: 'power2.in',
        onComplete: () => {
          if (!_isBet)// 如果没有投注了,前端生成下一张牌
            playNextCard(betType, { rank, color })
        },
      })
    })
  }, 55)
}
/** 跳过（下一张牌） */
function playNextCard(betType: string, rankColor?: { rank: PokerRank, color: PokerColors }, multiplier?: string, repeat = true) {
  if (repeat && rankColor) {
    currentCard.value = {
      ...rankColor,
      faceDown: isBet.value,
      multiplier: multiplier ?? '1.00',
      resultIcon: betTextConfig[betType]?.resultIcon, // 第一次进入页面，洗牌之后 betType=''(第一张牌不需要显示resultIcon)
      betVal: isBet.value ? betType : '',
      uid: new Date().getTime(), // 唯一时间
    }
  }
  else { // 上一次投注结束（游戏结束），继续使用当前牌
    currentCard.value.uid = new Date().getTime()// 更新uid
  }
  if (!isBet.value) { // 未投注 清空记录
    pokerRecord.value = []
  }
  // 第一张（起手牌）和 跳过的牌 默认为true   [投注跳过的牌-EnumBetType[5],第一张牌，未投注跳过的牌-'']
  currentCard.value.isWin = [EnumBetType[5], ''].includes(currentCard.value?.betVal) ? true : compareResult()
  pokerRecord.value.push(currentCard.value)
  // 等待页面数据更新完成
  setTimeout(() => {
    insertNextCard(repeat)
  }, 1)
}
/** 插入下一张牌动画 */
function insertNextCard(repeat: boolean) {
  const tl = gsap.timeline({
    onComplete() {
      prevCard.value = currentCard.value
      nextTick(() => {
        if (repeat) // 投注错了，自动结束，直接投注，此时由投注接口回调设置false
          formDisabled.value = false
      })
    },
  })
  nextTick(() => {
    const className = document.getElementsByClassName(`${currentCard.value.color}${currentCard.value.uid}`)[0]
    tl.to(className, {
      duration: duration.value,
      left: 0, // 下面回来
      ease: 'power1.out',
      onComplete: () => {
        className.scrollIntoView({ // 滚到最右边
          block: 'nearest',
          inline: 'end',
        })
        currentCard.value.faceDown = false
      },
    }).to(className.querySelectorAll('.payout-multiplier'), { // document..querySelectorAll('.payout-multiplier')
      duration: duration.value,
      scale: 1,
      delay: duration.value,
      opacity: 1, // 下面倍率显示
      ease: 'back.out(1.5)',
      onStart: () => {
        const { isWin, betVal } = currentCard.value
        const isInit = pokerRecord.value.slice(-2)[0].isInit
        if (isWin && pokerRecord.value.length > 1 && betVal !== EnumBetType[5] && !isInit)
          playCorrect()
      },
    })
  })
}
/** 清空记录 */
function clearRecord() {
  setIsBet(false)
  currentCard.value.betVal = ''
  playNextCard('', undefined, '', false)
}
const { openNotify } = useNotify()
/** 兑现&投注 */
function gameRestart() {
  if (!isLogin.value) { // 未登录打开注册
    openRegisterDialog()
    return
  }
  if (userInfo.value?.exclude === 1) {
    openNotify({ type: 'error', title: t('submit_error'), message: t('exclude_off_notify') })
    return
  }
  formDisabled.value = true // 点击投注或者兑现禁用所有按钮
  skipCount.value = 0
  if (isBet.value) { // 已经投注，兑现，收牌动画
    runAsyncBetHilo({
      type: 3,
      currency_id: orderInfo.currency,
      amount: '0',
      id: orderInfo.id,
    }).then(() => {
      setShowBetResult(true)
      hiloWin()
      setIsBet(false)
      formDisabled.value = false
    })
  }
  else { // 开始投注,建立订单
    betAmountRef.value?.valiAmountBetLimit()
    if (!betAmountRef.value.betAmountError) {
      setShowBetResult(false)
      playGameBet()
      if (pokerRecord.value.length > 1) { // 投注错误，已经自动结算，此时投注需要清理牌库
        if (animateEnabled.value) { // 没有开启动画，不需要收牌效果
          collectCard(() => {
            clearRecord()
            startBet()
          })
        }
        else {
          clearRecord()
          startBet()
        }
      }
      else {
        startBet()
      }
    }
    else {
      formDisabled.value = false
    }
  }
}
/** 投注接口 */
function startBet() {
  runAsyncBetHilo({
    start_card: {
      suit: currentCard.value.color,
      rank: currentCard.value.rank,
    },
    type: 1,
    currency_id: currencyConfig[currentGlobalCurrency.value].cur,
    amount: amount.value,
  }).then((data) => {
    orderInfo.id = data.id
    orderInfo.payout = data.payout
    orderInfo.currency = data.currency
    orderInfo.amount = data.amount
    setIsBet(true)
    formDisabled.value = false
  })
}
/** 收牌 callback动画结束回调 */
function collectCard(callback: () => void) {
  const currentElem = document.getElementsByClassName(`${currentCard.value.color}${currentCard.value.uid}`)[0]
  const width = currentElem.clientWidth
  const tl = gsap.timeline({
    onComplete: callback,
  })
  const elemList = Array.from(currentElem.parentElement?.children ?? [])

  elemList[0]?.scrollIntoView({ // 滚到最左边
    block: 'nearest',
    inline: 'end',
  })
  for (const i in elemList) {
    const elem = elemList[i]
    tl
    //   .to(elem, {
    //   duration: 0.3,
    //   translateX: -i * (width - 30),
    //   ease: 'none',
    // }, 0)
    //   .to(elem, {
    //   duration: 0.2,
    //   translateX: -i * width,
    //   ease: 'none',
    // }, 0.2)
      .to(elem, {
        duration: 0.3,
        translateX: -i * (width + 8),
        ease: 'power1.out',
      }, 0)
  }
  tl.to(elemList, {
    duration: 0.3,
    translateY: currentElem.clientHeight * 1.2,
    ease: 'power1.out',
  }, 0.24)
}
/** 比较真实结果与下注结果 */
function compareResult() {
  const betVal = currentCard.value.betVal
  const result = getRealResult(betVal)
  return betVal === result
}
/** 获取真实结果 */
function getRealResult(betVal: string) {
  // 当前牌
  const rank = currentCard.value.rank
  // 上一张牌 pokerRecord.value.slice(-2,1)
  const _rank = pokerRecord.value.slice(-1)[0].rank
  // 比较两张牌真实大小
  const index = rankConfig.indexOf(rank)
  const _index = rankConfig.indexOf(_rank)
  switch (_rank) {
    case 'K':
      if (index === _index)
        return EnumBetType[4]
      else
        return EnumBetType[3]
    case 'A':
      if (index === _index)
        return EnumBetType[4]
      else
        return EnumBetType[1]
    default:
      if (index > _index)
        return EnumBetType[0]
      else if (index < _index)
        return EnumBetType[2]
      else // 如果是等于 猜>=或<=都对，返回原始结果
        return betVal
  }
}
/** 获取大小 */
function getRank() {
  const index = Math.floor(Math.random() * rankConfig.length)
  return rankConfig[index]
}
/** 获取花色 */
function getColor() {
  const index = Math.floor(Math.random() * colorConfig.length)
  return PokerColors[colorConfig[index]]
}

function initUserHilo() {
  return runAsyncBetHilo({ type: 4, currency_id: '706', amount: '0' }).then((data) => {
    if (data.active) {
      setIsBet(true)
      orderInfo.id = data.id
      orderInfo.payout = data.payout
      orderInfo.currency = data.currency
      orderInfo.amount = data.amount
      amount.value = data.amount
      if (data.state.rounds) { // 如果存在历史牌
        skipCount.value = data.state.rounds.filter(c => c.guess.includes('skip')).length
        const cardList = data.state.rounds
        const lastCard = cardList.pop()
        const arr: MyPokerCardProps[] = [{
          rank: data.state.start_card.rank,
          color: data.state.start_card.suit,
          betVal: '',
          isWin: true,
          isInit: true,
          faceDown: false,
          uid: data.updated_at,
        }]
        for (const item of cardList) {
          const card = item.card
          arr.push({
            rank: card.rank,
            color: card.suit,
            betVal: item.guess,
            faceDown: false,
            resultIcon: betTextConfig[item.guess].resultIcon,
            isWin: true,
            isInit: true,
            multiplier: toFixed(Number(item.payout_multiplier), 2),
            uid: new Date().getDate(),
          })
        }
        pokerRecord.value = arr
        nextTick(() => {
          if (lastCard)
            playNextCard(lastCard.guess, { rank: lastCard.card.rank, color: lastCard.card.suit }, toFixed(Number(lastCard.payout_multiplier), 2))
        })
      }
      else {
        playNextCard('', { rank: data.state.start_card.rank, color: data.state.start_card.suit }, toFixed(Number(data.payout_multiplier), 2))
      }
    }
    else {
      if (pokerRecord.value.length === 0) // 本页登录不用加入新牌
        playNextCard('', { rank: data.state.start_card.rank, color: data.state.start_card.suit })
    }
  })
}

// 快捷键
useKeyboard((k) => {
  if (isHotKeysEnabled.value) {
    if (k === KeyboardKeyEnum.SPACE) {
      !formDisabled.value && !isBet.value && gameRestart()
    }

    else if (k === KeyboardKeyEnum.S) {
      !isBet.value && betAmountRef.value?.double()
    }

    else if (k === KeyboardKeyEnum.A) {
      !isBet.value && betAmountRef.value?.half()
    }

    else if (k === KeyboardKeyEnum.D) {
      !isBet.value && (amount.value = toFixedByLockCurrency('0', getCurrencyConfigByCode(orderInfo.currency).name))
    }
    else if (k === KeyboardKeyEnum.Q) {
      betThrottle(getUpBtn.value.betVal, 1)
    }
    else if (k === KeyboardKeyEnum.W) {
      betThrottle(getDownBtn.value.betVal, 2)
    }
    else if (k === KeyboardKeyEnum.E) {
      betThrottle(EnumBetType[5], 3)
    }
    else if (k === KeyboardKeyEnum.R) {
      if (!formDisabled.value && !isHonor.value)
        gameRestart()
    }
  }
})

watch(() => isLogin.value, (newVal) => {
  if (newVal)
    initUserHilo()
})

watch(currentGlobalCurrency, (a) => {
  if (!isBet.value) {
    orderInfo.currency = currencyConfig[a].cur
    orderCurrencyCode.value = currencyConfig[a].cur
  }
})

onMounted(async () => {
  onLoaded()
  if (!isLogin.value)
    playNextCard('', { rank: getRank(), color: getColor() })

  if (isLogin.value)
    await initUserHilo()
})
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled" :game-type="GAMES_LIST_ENUM.HILO"
    @open-game-info="openMiniGameInfoInsertDialog"
    @open-hot-keys="openMiniGameHotKeysInsertDialog"
  >
    <template #left>
      <div class="flex flex-col gap-[12px]">
        <BaseLabel :style="{ order: isH5 ? '2' : '' }" class="theme-label" :label="$t('hilo_bet_amount')" :right-text="currencyPrefix + betAmountMulRate">
          <AppMiniGamePublicBetAmount
            ref="betAmountRef" v-model="amount" :disabled="formDisabled || isBet"
            :currency="currencyConfig[showCurrency].cur"
          />
        </BaseLabel>
        <template v-if="!isH5">
          <BaseButton class="gameButton" shadow size="lg" :disabled="formDisabled || !isBet" @click="betThrottle(getUpBtn.betVal, 1)">
            <span>{{ getUpBtn.text }}</span>
            <component class="mx-[8px]" style="--tg-icon-color: #ffce00" :is="getUpBtn.betIcon" />
            <span class="gameButton text-tg-secondary-light">{{ getHigherEqualWinning }}%</span>
          </BaseButton>
          <BaseButton class="gameButton" shadow size="lg" :disabled="formDisabled || !isBet" @click="betThrottle(getDownBtn.betVal, 2)">
            <span>{{ getDownBtn.text }}</span>
            <component class="mx-[8px]" style="--tg-icon-color: #7F47FD" :is="getDownBtn.betIcon" />
            <span class="text-tg-secondary-light gameButton">{{ getLowerEqualWinning }}%</span>
          </BaseButton>
          <BaseButton class="gameButton" :disabled="formDisabled || skipCount >= maxSkip" shadow size="md" @click="betThrottle(EnumBetType[5], 3)">
            {{ $t('hilo_jump_over') }}
            <IconUniPairRight class="ml-[8px]" style="--tg-icon-color: var(--tg-text-white)" />
          </BaseButton>
        </template>
        <AppMiniGamePublicBetButton
          :game="GAMES_LIST_ENUM.HILO" :loading="isBet ? formDisabled : false"
          :disabled="formDisabled || isHonor" @bet-btn-click="gameRestart"
        >
          {{ isBet ? t('hilo_cash') : $t('hilo_bet') }}
        </AppMiniGamePublicBetButton>
      </div>
    </template>
    <template #right>
      <div class="game-right flex flex-col items-center" :class="[isH5 ? 'h-auto' : 'min-h-[630px]']">
        <!-- 上，当前牌 -->
        <div class="center w-[100%] flex bg-no-repeat p-[48px]" :class="[isH5 ? 'h5-bg' : 'pc-bg']">
          <div
            v-if="isH5" class="grid mx-[0.5em] gap-[1em]"
            style="--tg-base-button-font-size: var(--tg-font-size-base);--tg-spacing-button-padding-vertical-xs:0;--tg-spacing-button-padding-horizontal-xs:0"
          >
            <BaseButton type="text" :disabled="formDisabled || !isBet" @click="betThrottle(getUpBtn.betVal, 1)">
              <div class="higher leading-[1.5] font-[700]">
                <span>{{ getUpBtn.text }}</span>
                <span>{{ getHigherEqualWinning }}%</span>
              </div>
            </BaseButton>
            <BaseButton type="text" :disabled="formDisabled || !isBet" @click="betThrottle(getDownBtn.betVal, 2)">
              <div class="lower leading-[1.5] font-[700]">
                <span>{{ getDownBtn.text }}</span>
                <span>{{ getLowerEqualWinning }}%</span>
              </div>
            </BaseButton>
          </div>
          <div class="center mx-[0.5em]">
            <div class="relative text-[24px]">
              <div class="relative">
                <AppMiniGamePokerCard
                  v-for="i in 5" :key="i" class="absolute left-0 top-0"
                  :style="{ transform: `translateY(${12 - (2 * i)}%)` }"
                />
              </div>
              <div ref="currentCardRef">
                <AppMiniGamePokerCard
                  :rank="currentCard.rank" :color="currentCard.color"
                  :face-down="currentCard.faceDown" :lose="!currentCard.isWin" :close-duration="0"
                />
              </div>
              <div v-if="prevCard" ref="prevCardRef" class="absolute left-0 top-0 will-change-transform">
                <AppMiniGamePokerCard :rank="prevCard.rank" :color="prevCard.color" :face-down="prevCard.faceDown" />
              </div>
              <div
                class="absolute left-0 top-0 translate-x-[-50%] translate-y-[-50%] @[800px]:right-0 @[800px]:translate-x-[81.25%]"
              >
                <BaseButton shadow size="sm" :disabled="formDisabled || skipCount >= maxSkip" @click="bet(EnumBetType[5], 3)">
                  <IconUniPairRight style="--tg-icon-color: var(--tg-text-white)" />
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <!-- 中，利润 -->
        <div
          class="text-tg-secondary-light middle-profit grid mb-[8px] gap-[16px] rounded-[4px] bg-light1 p-[16px] text-[14px] font-[600] @[800px]:grid-cols-3 md:w-[96.5%]"
        >
          <template v-if="!isH5">
            <BaseLabel :label="$t('hilo_select_greater_than_equal_profit_rate', { rate: higherProfitRate })">
              <BaseInput :model-value="higherProfit" readonly>
                <template #left-icon>
                  <div class="center rotate-[180deg] text-[16px]">
                    <IconUniArrowGodown />
                  </div>
                </template>
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="showCurrency" />
                </template>
              </BaseInput>
            </BaseLabel>
            <BaseLabel :label="$t('hilo_select_ess_than_equal_profit_rate', { rate: LowerProfitRate })">
              <BaseInput :model-value="LowerProfit" readonly>
                <template #left-icon>
                  <div class="center text-[16px]">
                    <IconUniArrowGodown />
                  </div>
                </template>
                <template #right-icon>
                  <AppCurrencyIcon :currency-type="showCurrency" />
                </template>
              </BaseInput>
            </BaseLabel>
          </template>
          <BaseLabel :label="$t('hilo_total_profit_scale', { rate: totalProfitScale })">
            <BaseInput :model-value="totalProfitAmount" readonly>
              <template #right-icon>
                <AppCurrencyIcon :currency-type="showCurrency" />
              </template>
            </BaseInput>
          </BaseLabel>
        </div>
        <!-- 下，牌记录 -->
        <div
          class="scroll-x scroll-contain down-record bg-card mb-[16px] overflow-x-scroll rounded-[0.3em] px-[8px] pb-[24px] pt-[8px] md:w-[96.5%]"
        >
          <div class="flex-row-8 w-full flex items-center text-[16px]" :class="{ 'h5-poker-card': isH5 }">
            <div
              v-for="item, index of pokerRecord" :key="item.uid" class="relative"
              :class="[`${item.color}${item.uid}`, item.isInit ? '' : 'left-[80%]']"
            >
              <div class="h5-w">
                <AppMiniGamePokerCard
                  :class="{ 'opacity-[0.5]': item.betVal === EnumBetType[5] }" class="m-auto"
                  :rank="item.rank" :color="item.color" :face-down="item.faceDown"
                />
                <div
                  v-if="index !== 0"
                  class="center h5-multiplier payout-multiplier bg-tg-text-white absolute left-[-4px] top-[50%] translate-x-[-50%] translate-y-[-50%] rounded-[4px] p-[8px] shadow-[0_0_0_2px_#2a2f3c33]"
                  :class="{ 'scale-[0]': !item.isInit, 'opacity-0': !item.isInit }"
                >
                  <component
                    :style="{ '--tg-icon-color': item.betVal === EnumBetType[5] ? '#ff9d00' : (item.isWin ? '#00e701' : '#E9113C') }"
                    :is="item.resultIcon ?? ''"
                  />
                </div>
                <div
                  class="payout-multiplier bg-win absolute mt-[2px] w-[100%] overflow-hidden text-ellipsis whitespace-nowrap rounded-[2px] px-[2px] py-[4px] text-center text-[14px] font-[600] decoration-[#013e01]"
                  :class="{ 'bg-lose': !item.isWin, 'scale-[0]': (!item.isInit) && (index !== 0), 'opacity-0': (!item.isInit) && (index !== 0) }"
                >
                  {{ index === 0 ? $t('hilo_starting_hand') : (`${item.multiplier}x`) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 兑现结果弹框 -->
      <transition name="fade">
        <div v-if="showBetResult" class="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div
            class="result shadow-tg-box-shadow-lg max-w-[100%] min-w-[150px] border-[3px] rounded-[8px] border-solid text-center text-[14px] font-extrabold"
          >
            <div class="w-full flex flex-col items-center px-[1em] py-[0.75em] text-center">
              <span class="color1 text-[2em] font-bold leading-[1.5]">{{ totalProfitScale }}x</span>
              <div class="split mb-[8px] mt-[4px] h-[3px] w-[30%]" />
              <AppAmount
                show-color :amount="totalProfitAmount"
                :currency-type="getCurrencyConfigByCode(orderInfo.currency).name"
              />
            </div>
          </div>
        </div>
      </transition>
    </template>
  </AppMiniGamePublicLayout>
</template>

<style lang='scss' scoped>
// @keyframes flyRight {
//   100% {
//     transform: rotate(-40deg) translate(50vw, -50vh);
//   }
// }
.theme-label {
  @include webTheme('green') {
    --tg-base-label-title-color: white;
    --tg-text-lightgrey: white;
  }
}
.split {
  background-color: var(--tg-secondary-main);
  @include webTheme('green') {
    background-color: #197b59;
  }
}
.color1 {
  color: var(--tg-text-green);
  @include webTheme('green') {
    color: #ff9724;
  }
}
.result {
  background-color: var(--tg-primary-main);
  border-color: var(--tg-text-green);
  @include webTheme('green') {
    background-color: #055434;
    border-color: #ffefb0;
    --tg-app-amount-green-color: #ff9724;
  }
}
.bg-win {
  background-color: #00e701;
  @include webTheme('white') {
    background-color: #f2ca5c;
  }
  @include webTheme('green') {
    background-color: #f6d14a;
  }
}
.bg-lose {
  background-color: #e9113c;
}
.bg-light1 {
  background-color: var(--tg-secondary-grey);
  @include webTheme('white') {
    background: #e3e3e3;
  }
  @include webTheme('green') {
    background: #076237;
    --tg-base-input-readonly-bg-color: #197b59;
    --tg-base-input-style-background-color: #197b59;
  }
}
.bg-card {
  background-color: #00000040;
  @include webTheme('green') {
    background-color: #055434;
  }
}
.flex-row-8:not(.h5-poker-card) {
  > *:not(:first-child) {
    margin-left: var(--tg-spacing-8);
  }
}

.game-right {
  --bgHi: url(/stake/img/game/game_hilo_bg_hi.svg);
  --bgLo: url(/stake/img/game/game_hilo_bg_lo.svg);
  --bgHiStacked: url(/stake/img/game/game_hilo_bg_hi_stacked.svg);
  --bgLoStacked: url(/stake/img/game/game_hilo_bg_lo_stacked.svg);
  --btn-hi: url(/stake/img/game/game_hilo_button_hi.svg);
  --btn-lo: url(/stake/img/game/game_hilo_button_lo.svg);
  @include webTheme('greenblack') {
    --bgHi: url(/stake/img/game/game_hilo_bg_hi_greentheme.svg);
    --bgLo: url(/stake/img/game/game_hilo_bg_lo_greentheme.svg);
    --bgHiStacked: url(/stake/img/game/game_hilo_bg_hi_stacked_greentheme.svg);
    --bgLoStacked: url(/stake/img/game/game_hilo_bg_lo_stacked_greentheme.svg);
  }
  @include webTheme('green') {
    --bgHi: url(/stake/img/game/game_hilo_bg_hi_greentheme.svg);
    --bgLo: url(/stake/img/game/game_hilo_bg_lo_greentheme.svg);
    --bgHiStacked: url(/stake/img/game/game_hilo_bg_hi_stacked_greentheme.svg);
    --bgLoStacked: url(/stake/img/game/game_hilo_bg_lo_stacked_greentheme.svg);
  }
  @include webTheme('white') {
    background: #e3e3e3;
    --tg-base-button-style-bg: #42bc91;
    --bgHi: url(/stake/img/game/game_hilo_bg_hi_white.svg);
    --bgLo: url(/stake/img/game/game_hilo_bg_lo_white.svg);
    --bgHiStacked: url(/stake/img/game/game_hilo_bg_hi_stacked_white.svg);
    --bgLoStacked: url(/stake/img/game/game_hilo_bg_lo_stacked_white.svg);
  }
  .pc-bg {
    flex: 1;
    background-image: var(--bgHi), var(--bgLo);
    background-position:
      10% center,
      90% center;
    background-size: 10%;
  }
  .h5-bg {
    flex-direction: row-reverse;
    background-image: var(--bgHiStacked), var(--bgLoStacked);
    background-position:
      1em center,
      calc(100% - 1em) center;
    background-size: auto 60%;
    padding: 1em;
  }
  .higher,
  .lower {
    width: 7em;
    height: 7.921401515151515em;
    font-weight: 700;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 8px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  .higher {
    color: #453800;
    padding-top: 2em;
    background-image: var(--btn-hi);
  }
  .lower {
    color: var(--tg-text-white);
    padding-bottom: 2em;
    background-image: var(--btn-lo);
    @include webTheme('white') {
      color: white;
    }
  }
  .h5-poker-card {
    --tg-mini-game-poker-card-width: 2.5em;
    --tg-mini-game-poker-card-height: 4em;
    --tg-mini-game-poker-rank-font-size: 1em;
    // gap: 2px;
    > *:not(:first-child) {
      margin-left: var(--tg-spacing-2);
    }
    .h5-w {
      width: 3.75em;
    }
    .payout-multiplier {
      font-size: var(--tg-font-size-xs);
    }
    .h5-multiplier {
      top: 34%;
      left: -0.05em;
      padding: 6px;
    }
  }
}

@media screen and (max-width: 768px) {
  .middle-profit,
  .down-record {
    width: calc(100% - 2em);
  }
}

.gameButton {
  --tg-base-button-style-bg-hover: #6b6b6b;
  @include webTheme('white') {
    color: #fff;
  }
}
</style>

<script lang="ts" setup>
import type { BlackJackData, EnumCurrencyKey, NpcPokerState, PlayerCardActions, PokerCardProps } from '@tg/types'
import { ApiGameOriginalBlackJack } from '@tg/apis'
import { PhBaseButton, PhBaseDialog, PhBaseLabel } from '@tg/bccomponents'
import { useBoolean } from '@tg/hooks'
import { IconCallcard, IconDoubleit, IconSplitcard, IconStopcall, IconUniArrowLeft, IconUniArrowRight, IconUniGameInfo, IconUniKeyboard } from '@tg/icons'
import { useAppStore, useCurrency } from '@tg/stores'
import { BlackJackActionType, KeyboardKeyEnum, PokerColors } from '@tg/types'
import { application, formatWithSubstring, getCurrencyConfig, mul, toFixed } from '@tg/utils'
import { useElementSize } from '@vueuse/core'
import { GAMES_LIST_ENUM } from 'feie-ui'
import gsap from 'gsap'
import { debounce, sortedUniq } from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, inject, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequest } from 'vue-request'
import { useRouter } from 'vue-router'
import { Message } from '~/utils'
import {
  AppMiniGamePartMinesGameInfo,
  AppMiniGamePartMinesHotKeys,
  AppMiniGamePublicBetAmount,
  AppMiniGamePublicBetButton,
  AppMiniGamePublicLayout,
} from '../_components'
import { useKeyboard, useMiniGameGlobalStateHotKeys, useMiniGameLockCurrency, useMiniGamePublicPlayMp3 } from '../composables'
import { calcHandValue } from '../composables/useBlackJackHand'
import AppMiniGamePokerCard from '../hilo/_comp/AppMiniGamePokerCard.vue'

// 牌局 active true 进行中 false 有结果
// 牌局id identifier: "OSsY5xCdZQRL7XcL5OZI2"
// 开局发牌 deal
// 玩家停叫 stand
// 玩家叫牌 hit
// 玩家输 bust > 21 爆牌
// 玩家赢 blackjack
// 玩家接受保险 insurance
// 玩家不接受保险 noInsurance
// 玩家分牌 split 左边 split full
// A可作1或11点，2-10作该牌之点数，J、Q、K作10点

// type CardStatus = 'none' | 'win' | 'lose' | 'active'

type DealTo = 'player' | 'dealer' | 'player-split'
defineOptions({
  name: 'AppMiniGameMainBlackJack',
})
const onLoaded = inject('onLoaded', () => { })
const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()
const { isLogin, userInfo } = storeToRefs(appStore)
const currencyStore = useCurrency()
const { currentGlobalCurrencyMap, currencyList } = storeToRefs(useCurrency())

const betAmountRef = ref()
const amount = ref('0.00')
const gameData = ref({
  clientSeed: '',
  serverSeed: '',
  nonce: '',
  base_seed: '',
  hash: '',
  gameType: GAMES_LIST_ENUM.BLACKJACK,
})
const {
  orderCurrencyCode: currentCurrencyCode,
  rate,
} = useMiniGameLockCurrency(currentGlobalCurrencyMap.value.cur)

const { data: originData, runAsync: runGetCardData, loading: originLoading } = useRequest(ApiGameOriginalBlackJack, {
  ready: isLogin,
  manual: true,
  debounceInterval: 1000,
  debounceOptions: {
    leading: true,
    trailing: false,
  },
  onSuccess: (res) => {
    if (res && res.currency)
      currentCurrencyCode.value = res.currency
    setTimeout(() => {
      currencyStore.initCurrencyList()
    }, 1000)
  },
  onError: () => {
  },
})

const currentCurrency = computed(() => currentGlobalCurrencyMap.value.name)
const money = computed(() => {
  const index = currencyList.value.findIndex(a => a.type === currentCurrency.value)
  if (index > -1) {
    return Number(currencyList.value[index].balance)
  }
  else {
    return 0
  }
})
// 分牌 加倍 余额判断
const moneyEnough = computed(() => +amount.value * 1 <= +money.value)

const originDealerValue = computed(() => originData.value?.state?.dealer[0].value)
const originPlayerValue = computed(() => originData.value?.state?.player[0].value)
const originPlayerSplitValue = computed(() => originData.value?.state?.player[1]?.value)

// 是否已开局
const isOpenRound = computed(() => originData.value && !!originData.value.id)

const { play: playDeal } = useMiniGamePublicPlayMp3('/audio/blackjack.deal.mp3')
const { play: playBet } = useMiniGamePublicPlayMp3('/audio/blackjack.bet.mp3')
const { play: playMucked } = useMiniGamePublicPlayMp3('/audio/blackjack.mucked.mp3')

const { bool: isGameActive, setBool: setGameActive } = useBoolean(false)
const { bool: animateEnabled } = useBoolean(true)

const { isHotKeysEnabled } = useMiniGameGlobalStateHotKeys()

const showGameInfoDialog = ref(false)
const showHotKeysDialog = ref(false)

const isWin = ref<boolean | undefined>(undefined)
const isLose = ref<boolean | undefined>(undefined)
const isDraw = ref<boolean | undefined>(undefined)
const isWinSplit = ref<boolean | undefined>(undefined)
const isLoseSplit = ref<boolean | undefined>(undefined)
const isDrawSplit = ref<boolean | undefined>(undefined)

/** 投注货币前缀 */
const currencyPrefix = computed(() => currentGlobalCurrencyMap.value.prefix)
/** 投注额，转换 */
const betAmountMulRate = computed(() => formatWithSubstring(toFixed(+mul(+amount.value, +rate.value))))

const gameBlackJackRef = ref()
const { width: WrapWidth } = useElementSize(gameBlackJackRef)

const dealerDeck = ref()
const dealerHandWrapDefault = ref()
const playerHandWrapDefault = ref()
const playerHandWrapSplit = ref()

const splitActiveIndex = ref<0 | 1 | undefined>()

const dealerCards = ref<PokerCardProps[]>([])
const dealerValue = ref<number[]>([0])
const dealerValueStr = computed(() => dealerValue.value.filter(i => i > 0).join(','))
// const dealerStatus = ref<CardStatus>('none')

const playerCards = ref<PokerCardProps[]>([])
const playerValue = ref<number[]>([0])
const playerValueStr = computed(() => playerValue.value.filter(i => i > 0).join(','))

const playerCardsSplit = ref<PokerCardProps[]>([])
const playerSplitValue = ref<number[]>([0])
const playerSplitValueStr = computed(() => playerSplitValue.value.filter(i => i > 0).join(','))

// const playerStatus = ref<CardStatus>('none')

const showInsurance = ref(false)
const showSplit = ref(false)
const allowMultiple = ref(false)

// 正在发一张牌
const isCallingCard = ref(false)
// 是否完成本轮发牌
const isInRounding = ref(false)
// 开局loading
const { bool: openLoading, setBool: setOpenLoading } = useBoolean(false)

const isSplit = computed(() => originData.value && originData.value.state?.player?.length === 2)

const fontSizeGameRoot = computed(() => {
  if (WrapWidth.value > 900)
    return 1
  else if (WrapWidth.value <= 400)
    return 0.5
  else
    return (0.5 + 0.5 * (WrapWidth.value - 400) / (900 - 400)).toFixed(6)
})
const minHeightGameRoot = computed(() => {
  if (WrapWidth.value > 900)
    return 630
  else if (WrapWidth.value <= 400)
    return 280
  else
    return 280 + (630 - 280) * (WrapWidth.value - 400) / (900 - 400)
})

// 完成发牌动作，一次一张，玩家，庄家
async function deckDealCard(to: DealTo, card: PokerCardProps, flip = false, dealDuration = 0.3) {
  if (isCallingCard.value)
    return
  let idx = 0
  if (to === 'dealer') {
    dealerCards.value.push(card)
    idx = dealerCards.value.length - 1
  }
  else if (to === 'player') {
    playerCards.value.push(card)
    idx = playerCards.value.length - 1
  }
  else if (to === 'player-split') {
    playerCardsSplit.value.push(card)
    idx = playerCardsSplit.value.length - 1
  }

  isCallingCard.value = true
  await nextTick()
  const selector = `.content.dealt.${to}-card.card${idx}`
  const { right, bottom } = dealerDeck.value?.getBoundingClientRect()
  let aimRight = 0
  let aimBottom = 0
  if (to === 'dealer') {
    const { right: ddright, bottom: ddbottom } = dealerHandWrapDefault.value?.getBoundingClientRect()
    aimRight = ddright
    aimBottom = ddbottom
  }
  else if (to === 'player') {
    const { right: pdright, bottom: pdbottom } = playerHandWrapDefault.value?.getBoundingClientRect()
    aimRight = pdright
    aimBottom = pdbottom
  }
  else if (to === 'player-split') {
    const { right: pdsright, bottom: pdsbottom } = playerHandWrapSplit.value?.getBoundingClientRect()
    aimRight = pdsright
    aimBottom = pdsbottom
  }
  // 发牌动画
  playDeal()
  await gsap.fromTo(selector, {
    translateX: right - aimRight,
    translateY: bottom - aimBottom,
  }, {
    translateX: 0,
    translateY: 0,
    duration: animateEnabled.value ? dealDuration : 0.001,
  })
  // 翻牌
  if (flip) {
    await new Promise(resolve => setTimeout(() => {
      if (to === 'player')
        playerCards.value[playerCards.value.length - 1].faceDown = false
      else if (to === 'dealer')
        dealerCards.value[dealerCards.value.length - 1].faceDown = false
      else if (to === 'player-split')
        playerCardsSplit.value[playerCardsSplit.value.length - 1].faceDown = false
      resolve(true)
    }, 10))
  }
  // 等待翻牌动作
  await new Promise(resolve => setTimeout(() => {
    resolve(true)
  }, animateEnabled.value && flip ? 300 : 300))
  calcRoundValue(to, card)
  isCallingCard.value = false
  await nextTick()
}

// 接受保险按钮状态 不接受保险按钮状态 叫牌按钮状态 停叫按钮状态
const acceptInsuranceButton = computed(() => isOpenRound.value ? (isGameActive.value ? (isInRounding.value || isCallingCard.value || originLoading.value) : true) : true)
// 停叫
const clickStopCallCard = debounce(() => {
  if (!isLogin.value) {
    router.push('/register')
    return
  }
  if (acceptInsuranceButton.value)
    return
  stopCallCard()
}, 500, { leading: true, trailing: false })

// 拼接发牌数组，遍历发牌
/**
 * @param cards 后端返回的包括 牌局状态 当前扑克牌数据
 */
async function combineRoundCards(cards: BlackJackData, isQueryOrStart?: 'query' | 'start') {
  isInRounding.value = true
  // 获取庄家 玩家 的牌
  const _dealerState = cards.state.dealer[0]
  const _playerState = cards.state.player[0]
  const _playerSplitState = cards.state.player[1] ?? { value: 0, card: [], actions: [] }
  const _dealerCards = _dealerState.card
  const _playerCards = _playerState.card
  const _playerSplitCards = _playerSplitState.card
  const _playerActions = _playerState.actions
  const _playerSplitActions = _playerSplitState.actions
  const maxLen = Math.max(_dealerCards.length, _playerCards.length, _playerSplitCards.length)
  // 遍历玩家，玩家分牌，庄家的牌
  if (isQueryOrStart) {
    for (let i = 0; i < maxLen; i++) {
      if (i < _playerCards.length && i > playerCards.value.length - 1)
        await deckDealCard('player', { rank: _playerCards[i].rank, suit: _playerCards[i].suit, faceDown: true }, true, isQueryOrStart ? 0.22 : 0.3)

      if (i < _playerSplitCards.length && i > playerCardsSplit.value.length - 1)
        await deckDealCard('player-split', { rank: _playerSplitCards[i].rank, suit: _playerSplitCards[i].suit, faceDown: true }, true, isQueryOrStart ? 0.22 : 0.3)
      // 给庄家发牌，需要把最后一张盖住的牌先翻过来，在接着发
      if (i < _dealerCards.length && i === dealerCards.value.length - 1 && !dealerCards.value[i].rank) {
        dealerCards.value[i].rank = _dealerCards[i].rank
        dealerCards.value[i].suit = _dealerCards[i].suit
        dealerCards.value[i].faceDown = false
        // 等待翻牌动作
        await new Promise(resolve => setTimeout(() => {
          resolve(true)
        }, animateEnabled.value ? 300 : 300))
        calcRoundValue('dealer', _dealerCards[i])
        continue
      }

      if (i < _dealerCards.length && i > dealerCards.value.length - 1)
        await deckDealCard('dealer', { rank: _dealerCards[i].rank, suit: _dealerCards[i].suit, faceDown: true }, true, isQueryOrStart ? 0.22 : 0.3)
    }
  }
  else {
    for (let i = 0; i < maxLen; i++) {
      if (i < _playerCards.length && i > playerCards.value.length - 1)
        await deckDealCard('player', { rank: _playerCards[i].rank, suit: _playerCards[i].suit, faceDown: true }, true, isQueryOrStart ? 0.22 : 0.3)

      if (i < _playerSplitCards.length && i > playerCardsSplit.value.length - 1)
        await deckDealCard('player-split', { rank: _playerSplitCards[i].rank, suit: _playerSplitCards[i].suit, faceDown: true }, true, isQueryOrStart ? 0.22 : 0.3)
    }
    for (let i = 0; i < maxLen; i++) {
    // 给庄家发牌，需要把最后一张盖住的牌先翻过来，在接着发
      if (i < _dealerCards.length && i === dealerCards.value.length - 1 && !dealerCards.value[i].rank) {
        dealerCards.value[i].rank = _dealerCards[i].rank
        dealerCards.value[i].suit = _dealerCards[i].suit
        dealerCards.value[i].faceDown = false
        // 等待翻牌动作
        await new Promise(resolve => setTimeout(() => {
          resolve(true)
        }, animateEnabled.value ? 300 : 300))
        calcRoundValue('dealer', _dealerCards[i])
        continue
      }

      if (i < _dealerCards.length && i > dealerCards.value.length - 1)
        await deckDealCard('dealer', { rank: _dealerCards[i].rank, suit: _dealerCards[i].suit, faceDown: true }, true, isQueryOrStart ? 0.22 : 0.3)
    }
  }

  setGameActive(cards.active)
  isInRounding.value = false
  await nextTick()
  if (!isGameActive.value) {
    dealerValue.value = [+_dealerState.value]
    playerValue.value = [+_playerState.value]
    playerSplitValue.value = [+_playerSplitState.value]
  }
  if (isSplit.value) {
    // 第一组 full bust >= 21 double 跳第二组 且第二组 < 21 点
    if (splitActiveIndex.value === 0 && (+_playerState.value >= 21 || groupStateEnd(_playerActions))) { // || (_playerCards.length === 2 && _playerCards[0].rank === 'A' && _playerCards[1].rank === 'A')
      if (+_playerSplitState.value < 21) {
        splitActiveIndex.value = 1
        allowMultiple.value = true
      }
      if (isGameActive.value) {
        if (+_playerSplitState.value >= 21 || groupStateEnd(_playerSplitActions))
          clickStopCallCard()
      }
    }
    else if (splitActiveIndex.value === 1 && (groupStateEnd(_playerSplitActions))) { // || (_playerSplitCards.length === 2 && _playerSplitCards[0].rank === 'A' && _playerSplitCards[1].rank === 'A')
      allowMultiple.value = false
      if (isGameActive.value) {
        if (+_playerSplitState.value >= 21 || groupStateEnd(_playerSplitActions))
          clickStopCallCard()
      }
      else {
        splitActiveIndex.value = undefined
      }
    }
  }
  // 比输赢
  if (!isGameActive.value) {
    // 要先判断是否是平局
    if (isSplit.value) {
      const r = judge(+_dealerState.value, +_playerState.value)
      const r2 = judge(+_dealerState.value, +_playerSplitState.value)
      isDraw.value = r === 0 ? true : undefined // originData.value ? dealerValue.value[0] === playerValue.value[0] && dealerValue.value[0] === playerSplitValue.value[0] : undefined
      isWin.value = r === 1 ? true : undefined // isDraw.value !== true && originData.value ? +originData.value.settle_amount > 0 : undefined
      isLose.value = r === -1 ? true : undefined // isWin.value !== true && isDraw.value !== true && originData.value ? +originData.value.settle_amount <= 0 : undefined
      isDrawSplit.value = r2 === 0 ? true : undefined // originData.value ? dealerValue.value[0] === playerValue.value[0] && dealerValue.value[0] === playerSplitValue.value[0] : undefined
      isWinSplit.value = r2 === 1 ? true : undefined // isDraw.value !== true && originData.value ? +originData.value.settle_amount > 0 : undefined
      isLoseSplit.value = r2 === -1 ? true : undefined // isWin.value !== true && isDraw.value !== true && originData.value ? +originData.value.settle_amount <= 0 : undefined
    }
    else {
      const r = judge(+_dealerState.value, +_playerState.value)
      isDraw.value = r === 0 ? true : undefined // originData.value ? dealerValue.value[0] === playerValue.value[0] : undefined
      isWin.value = r === 1 ? true : undefined //  isDraw.value !== true && originData.value ? +originData.value.settle_amount > 0 : undefined
      isLose.value = r === -1 ? true : undefined // isWin.value !== true && isDraw.value !== true && originData.value ? +originData.value.settle_amount <= 0 : undefined
    }
    splitActiveIndex.value = undefined
    setTimeout(() => {
      currencyStore.initCurrencyList()
    }, 1000)
  }
}

// 判断输赢
function judge(d: number, p: number) {
  if (+p > 21)
    return -1

  if (+p <= 21) {
    if (+p > +d)
      return 1

    if (+p === +d)
      return 0

    if (+p < +d) {
      if (+d > 21)
        return 1
      else
        return -1
    }
  }
}

// 本组牌是否结束
function groupStateEnd(actions: PlayerCardActions[]) {
  return actions.includes('blackjack') || actions.includes('bust') || actions.includes('double') || actions.includes('full') || actions.includes('stand')
}

async function playerCallCard() {
  allowMultiple.value = false
  showSplit.value = false
  const res = await runGetCardData({ order_id: originData.value?.id, type: BlackJackActionType.CALL, currency_id: currentCurrencyCode.value, card_split_index: splitActiveIndex.value })
  combineRoundCards(res)
}

// 清理牌组
function clearCardsGroup(group: PokerCardProps[] = [], selector: string) {
  return group.map((card, idx) => {
    return new Promise((resolve, reject) => {
      gsap.fromTo(`${selector}.card${idx}`, {
        opacity: 1,
        translateX: 0,
        translateY: 0,
        delay: animateEnabled.value ? idx / 10.0 : 0,
        duration: animateEnabled.value ? 0.3 : 0.001,
      }, {
        opacity: 0,
        translateX: '-10%',
        translateY: '10%',
        delay: animateEnabled.value ? idx / 10.0 : 0,
        duration: animateEnabled.value ? 0.3 : 0.001,
      }).then(() => {
        resolve(true)
      }).catch(() => {
        // reject(err)
        resolve(true)
      })
    })
  })
}

// 开局查询是否已存在牌局
async function startQueryBet() {
  return new Promise<BlackJackData | undefined>((resolve, reject) => {
    runGetCardData({ type: BlackJackActionType.QUERY_ORDER, currency_id: currentCurrencyCode.value }).then((res1) => {
      if (res1 && res1.active && res1.id)
        resolve(res1)
      else
        resolve(undefined)
    }).catch(() => {
      resolve(undefined)
    })
  })
}

function initState() {
  splitActiveIndex.value = undefined
  showSplit.value = false
  showInsurance.value = false
  allowMultiple.value = false
  isInRounding.value = false
}

// 点投注：表示清理当前牌桌，并开始下一局的发牌
async function startNextBet(openData?: BlackJackData) {
  if (isGameActive.value)
    return
  dealerValue.value = [0, 0]
  playerValue.value = [0, 0]
  playerSplitValue.value = [0, 0]
  isWin.value = undefined
  isLose.value = undefined
  isDraw.value = undefined
  isWinSplit.value = undefined
  isLoseSplit.value = undefined
  isDrawSplit.value = undefined
  initState()
  isInRounding.value = true
  setGameActive(true)
  setOpenLoading(true)
  await nextTick()
  playBet()
  const clearDealerCards = clearCardsGroup(dealerCards.value, '.content.dealt.dealer-card')
  const clearPlayerCards = clearCardsGroup(playerCards.value, '.content.dealt.player-card')
  const clearPlayerSplitCards = clearCardsGroup(playerCardsSplit.value, '.content.dealt.player-split-card')
  // 请求开局牌组
  const getDealGroupCards = new Promise<BlackJackData>((resolve, reject) => {
    if (openData) {
      resolve(openData)
    }
    else {
      runGetCardData({
        type: BlackJackActionType.CREATE_ORDER,
        currency_id: currentCurrencyCode.value,
        bet_amount: amount.value,
      }).then((res) => {
        resolve(res)
      }).catch(() => {
        setGameActive(false)
        initState()
        setOpenLoading(false)
      })
    }
  })
  playMucked()
  application.allSettled([getDealGroupCards, ...clearDealerCards, ...clearPlayerCards, ...clearPlayerSplitCards]).then(([cards]: any[]) => {
    dealerCards.value = []
    playerCards.value = []
    playerCardsSplit.value = []
    nextTick(() => {
      // 这里 settimeout 可以去掉，牌局间隔
      setTimeout(() => {
        combineRoundCards(cards?.value, openData ? 'query' : 'start').then(() => {
          if (cards?.value.active === true) {
            deckDealCard('dealer', { faceDown: true }, false, 0.22)
            // 庄家面牌为 A
            if (cards?.value.state?.dealer[0]?.card[0]?.rank === 'A') {
              if (cards?.value.state?.player[0].actions.filter((a: PlayerCardActions) => a.includes('nsurance')).length === 0)
                showInsurance.value = true
              if (cards?.value.state?.player[1] && cards?.value.state?.player[1].actions.filter((a: PlayerCardActions) => a.includes('nsurance')).length === 0)
                showInsurance.value = true
            }
            if (cards?.value.state?.player.length === 1 && cards?.value.state?.player[0]?.card.length === 2 && cards?.value.state?.player[0]?.card[0]?.rank === cards?.value.state?.player[0]?.card[1]?.rank && !playerCardsSplit.value.length)
              showSplit.value = true

            if (cards?.value.state?.player.map((p: NpcPokerState) => p.card?.length).reduce((a: number, c: number) => a + c, 0) === 2)
              allowMultiple.value = true

            if (cards?.value.state?.player.length === 2) {
              const actionsSplitOne = cards?.value.state?.player[0].actions
              const valueSplitOne = cards?.value.state?.player[0].value
              const actionsSplitTwo = cards?.value.state?.player[1].actions
              const valueSplitTwo = cards?.value.state?.player[1].value
              if (groupStateEnd(actionsSplitOne) || +valueSplitOne >= 21) {
                splitActiveIndex.value = 1
                if (cards?.value.state?.player[1].card.length <= 2)
                  allowMultiple.value = true
              }
              else {
                splitActiveIndex.value = 0
                if (cards?.value.state?.player[0].card.length <= 2)
                  allowMultiple.value = true
              }

              if (+valueSplitTwo.value >= 21 || groupStateEnd(actionsSplitTwo))
                clickStopCallCard()
            }
          }
          else {
            initState()
          }
          setOpenLoading(false)
        })
      }, 500)
    })
  })
}

/** 玩家停叫，给庄家发牌；如果是分牌，第一组停叫，到第二组，第二组停叫，给庄家发牌 */
async function stopCallCard() {
  const temp = splitActiveIndex.value
  allowMultiple.value = false
  if (splitActiveIndex.value === 0 && originPlayerSplitValue.value && +originPlayerSplitValue.value < 21) {
    splitActiveIndex.value = 1
    allowMultiple.value = true
    return
  }
  else if (splitActiveIndex.value === 0 && originPlayerSplitValue.value && +originPlayerSplitValue.value >= 21) {
    // splitActiveIndex.value = undefined
  }
  else if (splitActiveIndex.value === 1) {
    splitActiveIndex.value = undefined
  }
  const res = await runGetCardData({ order_id: originData.value?.id, type: BlackJackActionType.STOP, currency_id: currentCurrencyCode.value, bet_amount: amount.value, card_split_index: temp })
  combineRoundCards(res)
}

/**
 * 玩家前两张牌相同，可以分牌一次
 * 分牌只在开局第一次发牌后，玩家手上的两张牌相同下可以发
 */
async function playerSplitCard() {
  showSplit.value = false
  await nextTick()
  runGetCardData({ order_id: originData.value?.id, type: BlackJackActionType.SPLIT, currency_id: currentCurrencyCode.value, bet_amount: amount.value }).then((res) => {
    if (res) {
      splitActiveIndex.value = 0
      const ele = playerCards.value.pop()
      playerCardsSplit.value.push(ele as PokerCardProps)
      playerValue.value = [0, 0]
      playerSplitValue.value = [0, 0]
      for (let i = 0; i < playerCards.value.length; i++)
        playerValue.value = calcHandValue((playerCards.value as any)[i], playerValue.value)
      for (let j = 0; j < playerCardsSplit.value.length; j++)
        playerSplitValue.value = calcHandValue((playerCards.value as any)[j], playerSplitValue.value)

      nextTick(() => {
        combineRoundCards(res)
      })
    }
  }).catch(() => {
    showSplit.value = true
    splitActiveIndex.value = undefined
  })
}

// 是否接受保险
function setInsurance(accept: boolean) {
  if (accept) {
    runGetCardData({ order_id: originData.value?.id, type: BlackJackActionType.INSURANCE, currency_id: currentCurrencyCode.value, bet_amount: amount.value }).then((res) => {
      combineRoundCards(res)

      // if (res)
      //   setGameActive(res.active)
    }).then(() => {
      showInsurance.value = false
    }).catch(() => {
      showInsurance.value = true
    })
  }
  else {
    runGetCardData({ order_id: originData.value?.id, type: BlackJackActionType.NO_INSURANCE, currency_id: currentCurrencyCode.value, bet_amount: amount.value }).then((res) => {
      combineRoundCards(res)

      // if (res)
      //   setGameActive(res.active)
    }).then(() => {
      showInsurance.value = false
    }).catch(() => {
      showInsurance.value = true
    })
  }
}

// 开局之后第一步加倍
async function playerMultiplier() {
  allowMultiple.value = false
  runGetCardData({ order_id: originData.value?.id, type: BlackJackActionType.MULTIPLE, currency_id: currentCurrencyCode.value, bet_amount: amount.value, card_split_index: splitActiveIndex.value }).then((res) => {
    combineRoundCards(res)
  }).catch(() => {
    allowMultiple.value = true
  })
}

// 计算当前这张牌发完之后的牌面 value
function calcRoundValue(to: DealTo, card: PokerCardProps) {
  let currentValue = [0, 0]
  switch (to) {
    case 'dealer':
      currentValue = dealerValue.value
      break
    case 'player':
      currentValue = playerValue.value
      break
    case 'player-split':
      currentValue = playerSplitValue.value
      break
  }
  if (currentValue.length === 1)
    currentValue = [...currentValue, ...currentValue]
  const len = currentValue.length
  const temp = [...currentValue]
  if (card.rank === 'A') {
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < len; i++) {
        if (j === 0)
          currentValue[i] += 1
        else if (j === 1)
          currentValue[len + i] = temp[i] + 11
      }
    }
  }
  else if ('J,Q,K'.includes(`${card.rank}`)) {
    for (let i = 0; i < len; i++)
      currentValue[i] += 10
  }
  else if (card.rank && +card.rank >= 2 && +card.rank <= 10) {
    for (let i = 0; i < len; i++)
      currentValue[i] += +card.rank
  }
  switch (to) {
    case 'dealer':
      dealerValue.value = filterRoundValue(currentValue)
      break
    case 'player':
      playerValue.value = filterRoundValue(currentValue)
      break
    case 'player-split':
      playerSplitValue.value = filterRoundValue(currentValue)
      break
  }
}

function filterRoundValue(arr: number[]) {
  const suq = sortedUniq(arr)
  const fuq = suq.filter(i => i <= 21)
  if (fuq.length)
    return fuq.includes(21) ? [21] : fuq
  else
    return [suq[0]]
}

onMounted(() => {
  onLoaded()

  setTimeout(() => {
    if (isLogin.value) {
      startQueryBet().then((res) => {
        if (res && res.active) {
          amount.value = res.state.bet_amount_detail?.bet_amount ?? res.amount
          startNextBet(res)
        }
      })
    }
  }, 0)
})

/**
 * 按钮防重复点击
 */
// 接受保险
const clickAcceptInsurance = debounce(() => {
  if (!isLogin.value) {
    router.push('/register')
    return
  }

  if (acceptInsuranceButton.value || !showInsurance.value)
    return
  setInsurance(true)
}, 500, { leading: true, trailing: false })
// 不接受保险
const clickNoAcceptInsurance = debounce(() => {
  if (!isLogin.value) {
    router.push('/register')
    return
  }

  if (acceptInsuranceButton.value || !showInsurance.value)
    return
  setInsurance(false)
}, 500, { leading: true, trailing: false })
// 叫牌 按钮 / 两张 A 不能叫牌
const callCardButton = computed(() => {
  if (originData.value && originData.value.state?.player?.length) {
    const len = originData.value.state.player.length
    if (len === 1) {
      return acceptInsuranceButton.value // || (originData.value.state.player[0].card[0]?.rank === 'A' && originData.value.state.player[0].card[1]?.rank === 'A')
    }
    else if (len === 2) {
      if (splitActiveIndex.value === 0)
        return acceptInsuranceButton.value // || (originData.value.state.player[0].card[0]?.rank === 'A' && originData.value.state.player[0].card[1]?.rank === 'A')

      else if (splitActiveIndex.value === 1)
        return acceptInsuranceButton.value // || (originData.value.state.player[1].card[0]?.rank === 'A' && originData.value.state.player[1].card[1]?.rank === 'A')
    }
  }
  return acceptInsuranceButton.value
})
// 叫牌
const clickCallCard = debounce(() => {
  if (!isLogin.value) {
    router.push('/register')
    return
  }

  if (callCardButton.value)
    return
  playerCallCard()
}, 500, { leading: true, trailing: false })
// 分牌按钮状态
const splitButton = computed(() => isOpenRound.value ? (!showSplit.value || !moneyEnough.value || (isGameActive.value ? (isInRounding.value || originLoading.value) : true)) : true)
// 分牌
const clickSplitCard = debounce(() => {
  if (!isLogin.value) {
    router.push('/register')
    return
  }

  if (splitButton.value)
    return
  playerSplitCard()
}, 500, { leading: true, trailing: false })
// 加倍按钮状态
const multipleButton = computed(() => isOpenRound.value ? ((isGameActive.value ? (isInRounding.value || isCallingCard.value || originLoading.value) : true) || !allowMultiple.value || !moneyEnough.value) : true)
// 加倍
const clickMultiple = debounce(() => {
  if (!isLogin.value) {
    router.push('/register')
    return
  }

  if (multipleButton.value)
    return
  playerMultiplier()
}, 500, { leading: true, trailing: false })
// 投注按钮状态
const betButton = computed(() => isOpenRound.value ? (isGameActive.value || isInRounding.value || originLoading.value) : originLoading.value)

// 投注
const clickBet = debounce(() => {
  if (!isLogin.value) {
    router.push('/login')
    return
  }
  if (userInfo.value?.exclude === 1) {
    Message.info('排除打开了')
    return
  }

  if (betButton.value)
    return

  betAmountRef.value?.valiAmountBetLimit()
  if (!betAmountRef.value.betAmountError)
    startNextBet()
}, 500, { leading: true, trailing: false })

// 金额框状态
const amountWrapState = computed(() => isOpenRound.value ? isGameActive.value : false)

useKeyboard((k) => {
  if (isHotKeysEnabled.value) {
    switch (k) {
      // 投注
      case KeyboardKeyEnum.SPACE:
        clickBet()
        break
      // 叫牌
      case KeyboardKeyEnum.Q:
        clickCallCard()
        break
      // 停叫
      case KeyboardKeyEnum.W:
        clickStopCallCard()
        break
      // 分牌
      case KeyboardKeyEnum.E:
        clickSplitCard()
        break
      // 加倍
      case KeyboardKeyEnum.R:
        clickMultiple()
        break
      // 接受保险
      case KeyboardKeyEnum.T:
        clickAcceptInsurance()
        break
      // 不接受保险
      case KeyboardKeyEnum.Y:
        clickNoAcceptInsurance()
        break
      // 加倍投注额
      case KeyboardKeyEnum.S:
        if (amountWrapState.value)
          return
        betAmountRef.value?.double()
        break
      // 减半投注额
      case KeyboardKeyEnum.A:
        if (amountWrapState.value)
          return
        betAmountRef.value?.half()
        break
      // 零数投注额
      case KeyboardKeyEnum.D:
        if (amountWrapState.value)
          return
        amount.value = '0'
        break
    }
  }
})

watch(isLogin, (val, old) => {
  if (val && !old) {
    setTimeout(() => {
      startQueryBet().then((res) => {
        if (res && res.active) {
          amount.value = res.state.bet_amount_detail?.bet_amount ?? res.amount
          startNextBet(res)
        }
      })
    }, 0)
  }
})

watch(currentGlobalCurrencyMap, (val) => {
  if (originData.value && originData.value.active !== true && !isGameActive.value)
    currentCurrencyCode.value = currentGlobalCurrencyMap.value.cur
})
</script>

<template>
  <AppMiniGamePublicLayout
    v-model:animate-enabled="animateEnabled"
    :game="GAMES_LIST_ENUM.DICE"
    :game-type="GAMES_LIST_ENUM.BLACKJACK"
    :game-data="gameData"
    @open-game-info="showGameInfoDialog = true"
    @open-hot-keys="showHotKeysDialog = true"
  >
    <template #left>
      <div class="game-blackjack-sidebar flex flex-col">
        <PhBaseLabel class="order-first mb-[12rem]" style="--ph-base-label-color:#6D7693" :label="t('投注额')" :right-text="currencyPrefix + betAmountMulRate">
          <div class="bg-[#ffffff] rounded-[4rem] border border-[#ebebeb] border-solid p-[4rem]">
            <AppMiniGamePublicBetAmount
              ref="betAmountRef"
              v-model="amount" :disabled="amountWrapState"
              :currency="getCurrencyConfig(currentCurrency as EnumCurrencyKey).cur"
            />
          </div>
        </PhBaseLabel>
        <div class="mid-buttons flex-col-12 mb-0 flex flex-col ">
          <div v-if="showInsurance" class="actions insurance grid grid-cols-2 grid-rows-2 gap-x-[8rem] gap-y-[16rem]">
            <div class="desc text-[#000] col-span-full flex items-center justify-center font-[500]">
              {{ t('购买保险？') }}
            </div>
            <PhBaseButton style="--ph-base-button-secondary-background-color:#E5E5E5" type="secondary" :disabled="acceptInsuranceButton" @click="clickAcceptInsurance">
              <div class="call-card relative flex items-center">
                <span>{{ t('接受保险') }}</span>
              </div>
            </PhBaseButton>
            <PhBaseButton style="--ph-base-button-secondary-background-color:#E5E5E5" type="secondary" :disabled="acceptInsuranceButton" @click="clickNoAcceptInsurance">
              <div class="stop-call relative flex items-center">
                <span>{{ t('不买保险') }}</span>
              </div>
            </PhBaseButton>
          </div>
          <div v-else class="actions btns grid grid-cols-2 grid-rows-2 gap-x-[8rem] gap-y-[16rem] ">
            <PhBaseButton style="--ph-base-button-secondary-background-color:#E5E5E5" type="secondary" :disabled="callCardButton" @click="clickCallCard">
              <div class="call-card relative flex items-center">
                <span class="mr-[8rem]">{{ t('叫牌') }}</span>
                <IconCallcard class="text-[#FF9E00]" />
              </div>
            </PhBaseButton>
            <PhBaseButton style="--ph-base-button-secondary-background-color:#E5E5E5" type="secondary" :disabled="acceptInsuranceButton" @click="clickStopCallCard">
              <div class="stop-call relative flex items-center">
                <span class="mr-[8rem]">{{ t('停叫') }}</span>
                <IconStopcall class="text-[#9000FF]" />
              </div>
            </PhBaseButton>
            <PhBaseButton style="--ph-base-button-secondary-background-color:#E5E5E5" type="secondary" :disabled="splitButton" @click="clickSplitCard">
              <div class="split-card relative flex items-center">
                <span class="mr-[8rem]">{{ t('分牌') }}</span>
                <IconSplitcard class="text-[#000]" />
              </div>
            </PhBaseButton>
            <PhBaseButton style="--ph-base-button-secondary-background-color:#E5E5E5" type="secondary" :disabled="multipleButton" @click="clickMultiple">
              <div class="double-it relative flex items-center">
                <span class="mr-[8rem]">{{ t('加倍') }}</span>
                <IconDoubleit class="text-[#000]" />
              </div>
            </PhBaseButton>
          </div>
        </div>
        <div class="bet-button order-first mb-[12rem] w-full @md:order-last">
          <AppMiniGamePublicBetButton class="w-full" :loading="openLoading" :disabled="openLoading || betButton" :game="GAMES_LIST_ENUM.BLACKJACK" @bet-btn-click="clickBet">
            <div class="text-[16px]">
              {{ t('投注') }}
            </div>
          </AppMiniGamePublicBetButton>
        </div>
      </div>
    </template>
    <template #right>
      <div ref="gameBlackJackRef" :style="{ fontSize: `${fontSizeGameRoot}em`, minHeight: `${minHeightGameRoot}px` }">
        <div class="game-blackjack wrap aspect-[10/7] w-full flex grow px-[1em] py-[3em]">
          <div class="dealer absolute right-0 top-0 translate-x-[-50%] translate-y-[-76.6%] text-[1.2em]">
            <div ref="dealerDeck" class="deck relative">
              <AppMiniGamePokerCard v-for="i in 5" :key="i" :animate-enabled="animateEnabled" :style="{ transform: `translate(0, ${(6 - i) * 2}%)` }" rank="A" :color="PokerColors.FANGKUAI" disabled />
            </div>
          </div>
          <div
            class="hands relative grid h-fit min-h-[250rem] w-full content-between bg-[length:40%] bg-center bg-no-repeat @md:h-auto @md:gap-[56px]"
          >
            <div class="dealer w-full flex justify-center">
              <div
                v-if="dealerCards && dealerCards.length"
                ref="dealerHandWrapDefault"
                class="wrap relative mt-[1em] min-h-[7.9em] min-w-[5em] flex items-start text-[1.2em]"
                :class="{ 'duration-[300ms]': animateEnabled }"
                :style="{
                  width: `${5 + 2.5 * (dealerCards.length - 1)}em`,
                  height: `${7.9 + 1 * (dealerCards.length - 1)}em`,
                }"
              >
                <div
                  v-for="card, idx in dealerCards"
                  :key="idx"
                  class="content dealt dealer-card"
                  :class="[`card${idx}`]"
                  :style="{ marginTop: `${idx}em`, marginLeft: idx === 0 ? '0' : '-2.5em' }"
                >
                  <AppMiniGamePokerCard :flip-duration="0.3" :animate-enabled="animateEnabled" :rank="card.rank" :color="card.suit" :face-down="card.faceDown" :win="card.win" :lose="card.lose" :active="card.active" :draw="card.draw" />
                </div>
                <div
                  v-show="dealerValueStr"
                  class="text-[#fff] value none absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-[2rem] py-[1rem] text-center  font-extrabold"
                  :class="{ 'duration-[300ms]': animateEnabled }"
                >
                  {{ dealerValueStr }}
                </div>
              </div>
            </div>
            <div class="player flex flex-row-reverse justify-around">
              <div
                v-if="playerCards && playerCards.length"
                ref="playerHandWrapDefault"
                class="hand-wrap relative flex flex-col items-center justify-center"
                :class="{ 'is-active': splitActiveIndex === 0 }"
              >
                <div
                  class="wrap relative mt-[1em] min-h-[7.9em] min-w-[5em] flex items-start text-[1.2em]"
                  :class="{ 'duration-[300ms]': animateEnabled }"
                  :style="{
                    width: `${5 + 2.5 * (playerCards.length - 1)}em`,
                    height: `${7.9 + 1 * (playerCards.length - 1)}em`,
                  }"
                >
                  <div
                    v-for="card, idx in playerCards"
                    :key="idx"
                    class="content dealt player-card"
                    :class="[`card${idx}`]"
                    :style="{
                      marginTop: `${idx}em`,
                      marginLeft: idx === 0 ? '0' : '-2.5em',
                    }"
                  >
                    <AppMiniGamePokerCard :flip-duration="0.3" :animate-enabled="animateEnabled" :rank="card.rank" :color="card.suit" :face-down="card.faceDown" :win="isWin" :lose="isLose" :draw="isDraw" :active="splitActiveIndex === 0" />
                  </div>
                  <div
                    v-show="playerValueStr"
                    class="value none text-[#fff] absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-[2rem] py-[1rem] text-center  font-extrabold"
                    :class="{ 'duration-[300ms]': animateEnabled, 'draw': isDraw === true, 'win': isWin === true, 'lose': isLose === true, 'active': splitActiveIndex === 0 }"
                  >
                    {{ playerValueStr }}
                  </div>
                  <IconUniArrowRight class="active-right absolute right-full text-[2em]" name="uni-arrow-right" />
                  <IconUniArrowLeft class="active-left absolute left-full text-[2em]" name="uni-arrow-left" />
                </div>
              </div>
              <div
                v-if="playerCardsSplit && playerCardsSplit.length"
                ref="playerHandWrapSplit"
                class="hand-wrap relative flex flex-col items-center justify-center"
                :class="{ 'is-active': splitActiveIndex === 1 }"
              >
                <div
                  class="wrap relative mt-[1em] min-h-[7.9em] min-w-[5em] flex items-start text-[1.2em]"
                  :class="{ 'duration-[300ms]': animateEnabled }"
                  :style="{
                    width: `${5 + 2.5 * (playerCardsSplit.length - 1)}em`,
                    height: `${7.9 + 1 * (playerCardsSplit.length - 1)}em`,
                  }"
                >
                  <div
                    v-for="card, idx in playerCardsSplit"
                    :key="idx"
                    class="content dealt player-split-card"
                    :class="[`card${idx}`]"
                    :style="{ marginTop: `${idx}em`, marginLeft: idx === 0 ? '0' : '-2.5em' }"
                  >
                    <AppMiniGamePokerCard :flip-duration="0.3" :animate-enabled="animateEnabled" :rank="card.rank" :color="card.suit" :face-down="card.faceDown" :win="isWinSplit" :lose="isLoseSplit" :draw="isDrawSplit" :active="splitActiveIndex === 1" />
                  </div>
                  <div
                    v-show="playerSplitValueStr"
                    class="value none text-[#fff] absolute left-full top-0 w-[7ch] translate-x-[-100%] translate-y-[-100%] rounded-full px-[2rem] py-[1rem] text-center  font-extrabold"
                    :class="{ 'duration-[300ms]': animateEnabled, 'draw': isDrawSplit === true, 'win': isWinSplit === true, 'lose': isLoseSplit === true, 'active': splitActiveIndex === 1 }"
                  >
                    {{ playerSplitValueStr }}
                  </div>
                </div>
                <IconUniArrowRight class="active-right absolute right-full text-[2em]" name="uni-arrow-right" />
                <IconUniArrowLeft class="active-left absolute left-full text-[2em]" name="uni-arrow-left" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </AppMiniGamePublicLayout>
  <PhBaseDialog v-model="showGameInfoDialog" :icon="IconUniGameInfo" :title="t('游戏规则')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesGameInfo :game-type="GAMES_LIST_ENUM.BLACKJACK" />
  </PhBaseDialog>
  <PhBaseDialog v-model="showHotKeysDialog" :icon="IconUniKeyboard" :title="t('快捷键')" style="--ph-base-dialog-background-color: #F6F7F8">
    <AppMiniGamePartMinesHotKeys :game-type="GAMES_LIST_ENUM.BLACKJACK" />
  </PhBaseDialog>
</template>

<style lang="scss" scoped>
.bet-button button:disabled:active {
  opacity: 0.6;
}
@keyframes card-leave {
  to {
    opacity: 0;
    transform: translate(-10%, 10%);
  }
}
.active-right,
.active-left {
  color: #1475e1;
}
.game-blackjack-sidebar {
  .actions {
    --tg-icon-color: #fff;
  }
  .call-card {
    --tg-icon-color: #ff9d00;
  }
  .stop-call {
    --tg-icon-color: #9000ff;
  }
}

.game-blackjack {
  .content {
    &.dealt {
      opacity: 1;
    }
    &:not(.dealt) {
      opacity: 0;
    }
    &.mucked {
      animation-name: card-leave;
      animation-duration: var(--muck-transition);
      animation-fill-mode: forwards;
    }
  }
  .dealer {
    .deck {
      & > *:not(:nth-child(1)) {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
  .hands {
    background-image: url(/ph-h5/svg/blackjackbg_white.svg);
    grid-template-rows: repeat(2, max-content);
  }
  .hand-wrap {
    .active-left,
    .active-right {
      display: none;
    }
    &.is-active {
      .active-left,
      .active-right {
        display: block;
      }
    }
  }
  .value {
    box-shadow:
      0 1px 3px 0 #{rgba(0, 0, 0, $alpha: 0.2)},
      0 1px 2px 0 #{rgba(0, 0, 0, $alpha: 0.122)};
    transition-property: background, color, transform, opacity;
    transition-timing-function: ease-out;
    &.none {
      background: #9dabc9;
    }
    &.active {
      background: #4391e7;
      color: #082f5a;
    }
    &.draw {
      background: #ff9d00;
      color: #633d00;
    }
    &.win {
      background: #1fff20;
      color: #004d00;
    }
    &.lose {
      background: #e9113c;
      color: white;
    }
  }
}
.flex-col-12 {
  > *:not(:first-child) {
    margin-top: 12rem;
  }
}
</style>

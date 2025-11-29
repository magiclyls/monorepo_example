import { sortedUniq } from 'lodash'
import type { NpcPokerState, PlayerCardActions, PokerCardItem } from '~/types'

/**
 * 计算点数
 */
export function calcHandValue(card: PokerCardItem, current: number[]) {
  let result = current && current.length ? [...current] : [0, 0]
  if (result.length === 1)
    result = [...result, ...result]
  const len = result.length
  const temp = [...result]
  if (card.rank === 'A') {
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < len; i++) {
        if (j === 0)
          result[i] += 1
        else if (j === 1)
          result[len + i] = temp[i] + 11
      }
    }
  }
  else if ('J,Q,K'.includes(`${card.rank}`)) {
    for (let i = 0; i < len; i++)
      result[i] += 10
  }
  else if (card.rank && +card.rank >= 2 && +card.rank <= 10) {
    for (let i = 0; i < len; i++)
      result[i] += +card.rank
  }
  return filterHandValue(result)
}

/**
 * 过滤点数计算结果
 */
export function filterHandValue(arr: number[]) {
  const suq = sortedUniq(arr)
  const fuq = suq.filter(i => i <= 21)
  if (fuq.length)
    return fuq.includes(21) ? [21] : fuq
  else
    return [suq[0] ?? 0]
}

/**
 * 黑杰克 一手牌状态
 */
export function useBlackJackHand() {
  /** 接口数据 */
  const originState = ref<NpcPokerState>({ actions: [], card: [], value: '' })

  /** 桌面牌 */
  const tableCards = ref<PokerCardItem[]>([])

  /** 桌面点数 */
  const tableValue = ref<number[]>([0])

  /** 桌面牌状态 */
  const tableActions = ref<PlayerCardActions[]>([])

  /** 可叫牌 */

  /** 可分牌 */

  /** 可加倍 */

  /** 可结算 */

  function setOriginState(state: NpcPokerState) {
    originState.value = { ...state }
  }

  return {
    originState,
    setOriginState,
  }
}

/** 玩家 */
class BlackJackPlayer {
  hands: BlackJackHand[] = []
}

/** 一手牌的类 */
class BlackJackHand {
  /** 接口数据 */
  originState: NpcPokerState = { actions: [], card: [], value: '' }

  /** 手牌 */
  handCards: PokerCardItem[] = []

  /** 手牌点数 */
  handValue: number[] = [0]

  /** 手牌状态 */
  handActions: PlayerCardActions[] = []

  // get allowCallCard() {
  //   return this.handActions.includes('')
  // }
}

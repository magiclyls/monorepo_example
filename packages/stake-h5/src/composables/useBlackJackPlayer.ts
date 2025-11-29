import type { NpcPokerState } from '~/types'

/**
 * 黑杰克 玩家状态
 */
export function useBlackJackPlayer(roundStatus: { active: boolean; dealing: boolean; pending: boolean }) {
  /** 接口数据 */
  const originPlayerState = ref<NpcPokerState[]>([{ actions: [], card: [], value: '' }])

  function setOriginState(state: NpcPokerState[]) {
    originPlayerState.value = [...state]
  }

  return {
    originPlayerState,
    setOriginState,
  }
}

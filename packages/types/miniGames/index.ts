/** Mines游戏方块数据 */
export interface OriginalGameMinesTile {
  position: number
  result: string
  openByPlayer: boolean
  fetching: boolean
  chosen: boolean
}

export interface OriginalGameDragonTile {
  result: string
  openByPlayer: boolean
  chosen: boolean
}

/** Keno游戏方块数据 */
export interface OriginalGameKenoTile {
  position: number
  num: number
  chosen: boolean
  result: string
}

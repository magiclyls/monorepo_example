import type { TPat } from '../apis'

export interface IBetObject {
  /** 名称 */
  name: string
  /** 赔率 */
  odds: string
}

/** 列表类型 */
export interface IDataListItem {
  mlid: string
  /** 标题 */
  title: string
  /** 样式 */
  patType: TPat
  /** 样式1数据 */
  patType1BetList: IBetObject[]
  /** 样式2数据 */
  patType2BetMap: Record<string, IBetObject[]>
}

export enum EnumSportsPanelType {
  /** 三项投注 */
  THREE = 'THREE',
  /** 标准 */
  STANDARD = 'STANDARD',
}
export enum EnumSportsOddsType {
  /** 小数式 */
  DECIMAL = 'DECIMAL',
  /** 分数式 */
  FRACTION = 'FRACTION',
  /** 美式 */
  AMERICAN = 'AMERICAN',
  /** 印尼格式 */
  INDONESIA = 'INDONESIA',
  /** 香港格式 */
  HONGKONG = 'HONGKONG',
  /** 马来格式 */
  MALAYSIA = 'MALAYSIA',
}
export enum EnumSportsEventType {
  /** 今日赛事 */
  TODAY = 1,
  /** 滚球 */
  LIVE = 2,
  /** 早盘 */
  EARLY = 3,
  /** 串关 */
  CHUAN = 4,
  /** 冠军 */
  OUTRIGHT = 5,
  /** 热门赛事 */
  HOT = 6,
}

/** 投注单数据格式 */
export interface ISportsBetSlipData {
  // 测试
  [key: string]: any
}

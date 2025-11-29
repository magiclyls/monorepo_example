import type { VNode } from 'vue'
import type { CurrencyCode } from '../currencyData'

export enum EnumLotteryType {
  WIN_GO = 1,
  RACE = 2,
  K3 = 3,
  FIVE_D = 4,
  TRX_WIN_GO = 5,
}
export interface LotteryColumns {
  title: string
  titleStyle?: Record<string, any>
  renderTitle?: (record: Record<string, any>) => VNode
  dataIndex: string
  renderCol?: (record: Record<string, any>, rowIndex: string) => VNode
  colStyle?: Record<string, any>
  colAlign?: 'left' | 'center' | 'right'
}

export interface LotteryApiCpTrendSummary {
  missing: number[]
  agv_missing: number[]
  frequency: number[]
  max_consecutive: number[]
}

export interface LotteryApiCpTrendList {
  issue: string
  result: string
  number: string
  big_small: string
  odd_even: string
  sum: number
  color: string
  block_heigh: number
  block_time: number
  hash_value: string
}

export interface LotteryApiCpTrend {
  d: {
    summary: LotteryApiCpTrendSummary
    list: LotteryApiCpTrendList[]
  }
  t: number
  s: number
}

export interface LotteryApiCpTrend5DHistoryItem {
  issue: string
  result: string
  number: string
  big_small: string
  odd_even: string
  sum: number
  color: string
}

export interface LotteryApiCpTrend5D {
  d: {
    history: LotteryApiCpTrend5DHistoryItem[]
    chart: {
      summary: {
        missing: number[]
        agv_missing: number[]
        frequency: number[]
        max_consecutive: number[]
      }
      list: {
        issue: string
        result: string
        number: string
        big_small: string
        odd_even: string
        sum: number
        color: string
      }[]
    }[]
  }
  t: number
  s: number
}

export interface ILotteryNav {
  lottery_name: string
  lottery_id: number
}

export interface ILotteryOddsItem {
  id: number
  lottery_id: number
  play_id: number
  odds: string
}

export interface ILotteryOddsData {
  issue: {
    id: string
    lottery_id: number
    ty: number
    lottery_name: string
    period: number
    ymd: string
    start_time: number
    end_time: number
    settle_time: number
    balls: string // 看起来是字符串格式的数组，如 "[]"
    result: string // 同上
    state: number
  }
  price: string[]
  odds: ILotteryOddsItem[]
}

export interface LotteryOrderBetItem {
  id: number // 赔率id，例如 10010101
  play_id: number // 玩法 ID，例如 101（指定号码）
  bet_balls: string // 投注号码字符串，如 "[1,2,3]"
  odds: string // 赔率，例如 "9"
  /** 倍数 */
  times: number
  /** 单个金额 */
  price: string
  /** 单个金额 * 倍数 */
  amount: string
}

export interface LotteryOrder {
  lottery_id: number // 彩种 ID，例如 1001（Win Go 30s）
  issue_id: string // 期号，例如 "2025072301293"
  amount: string // 所有bets的总金额
  currency_id: CurrencyCode
  bets: LotteryOrderBetItem[] // 投注项列表
}
export interface LotteryMyBetRecordItem {
  /** 彩票注单id */
  id: string
  /** 站点id */
  site_id: string
  /** 站点前缀 */
  prefix: string
  /** 会员uid */
  uid: string
  /** 会员名 */
  username: string
  /** 顶级代理id */
  top_uid: string
  /** 顶级代理名 */
  top_name: string
  /** 上级代理id */
  parent_uid: string
  /** 上级代理名 */
  parent_name: string
  /** 彩种id */
  lottery_id: number
  /** 彩种周期(s) */
  period: number
  /** 期号 */
  issue_id: number
  /** 玩法id */
  play_id: number
  /** 投注号码 */
  bet_balls: string // 原始是 "[2]" 字符串，可以按需转成 number[]
  /** 开奖号码 */
  balls: string
  /** 中奖玩法 */
  result: string
  /** 币种 */
  currency_id: CurrencyCode
  /** 单注价格 */
  price: string
  /** 倍数 */
  times: number
  /** 投注金额 */
  bet_amount: string
  /** 税率 */
  tax_rate: string
  /** 税收金额 */
  tax_amount: string
  /** 有效投注金额 */
  valid_bet_amount: string
  /** 赔率 */
  odds: string
  /** 预计奖金 */
  estimate_amount: string
  /** 结算奖金 */
  settle_amount: string
  /** 是否测试账号 */
  tester: string
  /** 0未结算 1=结算赢 2=结算输 3=撤单 */
  state: number
  /** 创建时间 */
  created_at: number
  /**  */
  updated_at: number
}

export interface LotteryMyBetRecordResponse {
  d: LotteryMyBetRecordItem[]
  t: number
  s: number
}

export enum LotteryFiveDBetPos {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  SUM = 'sum',
}
export interface LotteryBetItem {
  balls?: number[]
  play_id?: number // 玩法id
  label: string
  parent_label?: string // 4个分类的label
  parent_prefix?: string // 4个分类的
  bg?: string
  odds?: number // 赔率
  even?: boolean // 是否是 偶数
  bg_img?: boolean // 是否用背景图的total
}
export interface LotteryWinLoseSettleData {
  flag: 'Win' | 'Lose'
  lottery_name: string
  issue_id: string
  settle_amount: string
  balls: string
  currency_id: CurrencyCode
}

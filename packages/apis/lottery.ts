import type { ILotteryNav, ILotteryOddsData, LotteryApiCpTrend, LotteryApiCpTrend5D, LotteryMyBetRecordResponse, LotteryOrder } from '@tg/types'
import { httpClient } from './http'

export function ApiCpNav(params: { lottery_id: number }) {
  return httpClient.get<ILotteryNav[]>('/cp/nav', { params })
}
export function ApiCpOdds(params: { lottery_id: number }) {
  return httpClient.get<ILotteryOddsData>('/cp/odds', { params })
}
export function ApiCpBet(data: LotteryOrder) {
  return httpClient.post('/cp/bet', data)
}
export function ApiCpRecord({ page, page_size = 10, lottery_id }: { page: number, page_size?: number, lottery_id: number }) {
  return httpClient.get<LotteryMyBetRecordResponse>('/cp/record', { params: {
    page,
    page_size,
    lottery_id,
  } })
}
export function ApiCpTrend({ page, page_size = 10, lottery_id }: { page: number, page_size?: number, lottery_id: number }) {
  return httpClient.get<LotteryApiCpTrend>('/cp/trend', { params: {
    page,
    page_size,
    lottery_id,
  } })
}

/**
 * 5D彩票的开奖结果
 */
export function ApiCpTrend5D({ page, page_size = 10, lottery_id }: { page: number, page_size?: number, lottery_id: number }) {
  return httpClient.get<LotteryApiCpTrend5D>('/cp/trend', { params: {
    page,
    page_size,
    lottery_id,
  } })
}

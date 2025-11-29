import { httpClient } from './http'

export function ApiMarketDetail(params: { id: number }) {
  return httpClient.get<any>('/member/market/detail', { params })
}

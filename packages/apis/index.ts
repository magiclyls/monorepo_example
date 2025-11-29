import type { IMemberDetail } from './types'
import { httpClient } from './http'

/**
 * 用户登录
 */
export function ApiMemberLogin(
  data: {
    username: string
    password: string
    device_number: string
  },
) {
  return httpClient.post<string>('/member/login', data)
}

/**
 * 会员资料详情
 * @see https://console-docs.apipost.cn/preview/972a64ada7e847ea/c00b1160394a31fb?target_id=a7da5a93-3c50-438f-b0aa-c7c9faada194
 */
export function ApiMemberDetail() {
  return httpClient.get<IMemberDetail>('/member/detail')
}

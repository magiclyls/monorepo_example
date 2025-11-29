import { TIMEZONE } from '@tg/types'
import { decompressZstd, getParamsQuery, getToken, removeToken } from '@tg/utils'
import { HttpClient } from 'feie-ui'

const timeZoneList = [
  { label: '世界 UTC+0', value: TIMEZONE.ETC, time_zone: 'utc', offset: 0 },
  { label: '美东时间 UTC-4', value: TIMEZONE.USA, time_zone: 'en_US', offset: 240 },
  { label: '中国 UTC+8', value: TIMEZONE.CST, time_zone: 'zh_CN', offset: -480 },
  { label: '泰国 UTC+7', value: TIMEZONE.THAILAND, time_zone: 'th_TH', offset: -420 },
  { label: '越南 UTC+7', value: TIMEZONE.VIETNAM, time_zone: 'vi_VN', offset: -420 },
  { label: '巴西 UTC-3', value: TIMEZONE.BRT, time_zone: 'pt_BR', offset: 180 },
  { label: '印度 UTC+5:30', value: TIMEZONE.INDIA, time_zone: 'hi_IN', offset: 330 },
]
const timeOffset = new Date().getTimezoneOffset()
const timeZone = timeZoneList.filter(tz => tz.offset === timeOffset)[0] ?? timeZoneList[0]

/** 传参需要Cbor加密的接口 */
const cborUrlList = [
  '/member/login',
  '/member/reg',
]

export const httpClient = new HttpClient({
  baseURL: '/api',
  timeout: 10000,
  isEncryption: false,
  isSign: true,
  // showConsole: getEnv().MODE !== 'production',
  showConsole: true,
  postCborUrlList: [...cborUrlList],
  requestInterceptors: [
    // 设置token和dn
    async (config: any) => {
      const isAuth = config.method === 'get' ? config.params?.auth : config.data?.auth
      if (isAuth !== false) {
        if (getToken()) {
          config.headers.t = getToken()
        }
      }

      return config
    },
    // 设置全局header
    (config: any) => {
      config.responseType = 'arraybuffer'
      config.headers.d = window.innerWidth <= 768 ? 25 : 24
      config.headers.lang = 'zh_CN'
      config.headers.timets = new Date().getTime()
      config.headers['time-zone'] = timeZone.time_zone
      config.headers['x-id'] = window.performance.now()
      config.headers['x-ts'] = config.headers.timets
      const u = getParamsQuery('u')
      const c = getParamsQuery('c')
      if (c || u) {
        const val = c || u as string
        config.headers['x-c'] = val.replace(/\//g, '')
      }
      if (u !== null && u !== undefined)
        config.headers.u = u.replace(/\//g, '')
      if (c !== null && c !== undefined)
        config.headers.c = c.replace(/\//g, '')
      return config
    },
  ],
  responseInterceptors: [
    (response: any) => decompressZstd(response),
    // 处理后端status为false的情况
    (response: any) => {
      const { status, data } = response.data as IResponse<any>
      // console.log('🦺🦺🦺 ~ data:', response.config.url, data)

      // const responseStatus = response.status
      //
      // let tipMsg = ''
      // if (tip && tip !== '0')
      //   tipMsg = tip

      if (!status) {
        // 如果后端返回token，关闭所有请求，清除token
        if (data === 'token') {
          removeToken()
        }

        // 直接抛出错误，不再执行后续操作
        return Promise.reject(new Error(`{"url":"${response.config.url}发生错误","status":${status},"data":${JSON.stringify(data)}}`))
      }
      return response
    },
  ],
  responseErrorHandle: (error: any) => {
    console.error('error:', error)
  },
})

export default httpClient

export {
  HttpClient,
}

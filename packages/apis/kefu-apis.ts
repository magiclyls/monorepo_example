import { httpClient } from './kefu-http'

interface ConfigParams {
  baseURL?: string
  business_id: string | number
  access_key: string
  from_url: string
  visiter_id?: string
  lang?: string
  username?: string
  sign?: string
}
/**
 * 刷新token
 */
interface TokenParams {
  baseURL: string
}

/**
 * 获取token
 */
export function ApiGetToken(params: ConfigParams) {
  const { baseURL, ...query } = params
  return httpClient.get('/api/hy/visiter/get/config', {
    baseURL,
    // params: { ...query, sign: '73dd2987a628239a63c32a724d0141bd0885482f' },
    params: { ...query },
  })
}

export function ApiRefreshToken(params: TokenParams) {
  return httpClient.get('/api/hy/token/refresh', { baseURL: params.baseURL })
}

/**
 * 判断是否为新对话
 */
export function ApiCheckIsNewQueue(params: TokenParams) {
  return httpClient.get('/api/hy/visiter/check/isNewQueue', { baseURL: params.baseURL })
}

/**
 * 分配客服
 * @param params
 * @returns
 */
export function ApiSendNotice(params: TokenParams) {
  return httpClient.post('/api/hy/visiter/notice', undefined, { baseURL: params.baseURL })
}

/**
 * 发送消息
 * @param params
 * @returns
 */
interface SendMessageParams {
  baseURL: string
  service_id: number
  text?: string
  images?: string[]
  video?: string[]
}

export function ApiSendMessage(params: SendMessageParams) {
  if (
    !params.text
    && (!params.images || params.images.length === 0)
    && (!params.video || params.video.length === 0)
  ) {
    throw new Error('[ApiSendMessage] text、images、video 至少需要其中一項')
  }

  const payload: Record<string, any> = {
    unstr: Math.floor(1_000_000_000 + Math.random() * 9_000_000_000).toString(),
    service_id: params.service_id,
  }

  if (params.text)
    payload.text = params.text
  if (params.images?.length)
    payload.images = params.images
  if (params.video?.length)
    payload.video = params.video

  return httpClient.post('/api/hy/visiter/msg/sendV2', payload, { baseURL: params.baseURL })
}

/**
 * 取当前对话最新10则讯息
 * @param params
 * @returns
 */
export function ApiCheckMessage(params: TokenParams) {
  return httpClient.post('/api/hy/visiter/msg/check', undefined, { baseURL: params.baseURL })
}

/**
 * 前台polling取讯息
 * @param params
 * @returns
 */
export function ApiPollingMessage(params: { baseURL: string, cid: string }) {
  return httpClient.post('/api/hy/visiter/msg/polling', { cid: params.cid }, { baseURL: params.baseURL })
}

/**
 * 取得AWS簽名
 * @param params
 * @returns
 */
export function ApiAwsSign(type: 'video' | 'image', params: TokenParams) {
  return httpClient.get(`/api/hy/aws/sign?type=${type}`, { baseURL: params.baseURL })
}

export function ApiRobotSentence(params: { baseURL: string, sentence: string }) {
  return httpClient.post('/api/hy/robots/sentence', { sentence: params.sentence }, { baseURL: params.baseURL })
}

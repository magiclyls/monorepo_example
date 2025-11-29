import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { ApiAwsSign, ApiCheckIsNewQueue, ApiCheckMessage, ApiGetToken, ApiPollingMessage, ApiRefreshToken, ApiRobotSentence, ApiSendMessage, ApiSendNotice } from '@tg/apis'
import { getKefuToken, getKefuVisiterId, setKefuToken, setKefuTokenExpired, setKefuVisiterId } from '@tg/utils'
import { createGlobalState } from '@vueuse/core'
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useLocale } from '../components/ChatConfigProvider'
import { ChatH5WebSocket } from '../utils/chatH5WebSocket'

interface TokenResponse {
  hyperf_token: string
  hyperf_token_expired: number
  visiter_id: string
  robotWsUrl: string
  wsUrl: string
  wsScheme: string
  channel: string
  logo_url: string
  logo_link: string
  name_show: string
  client_message_bg_color: string
  client_send_bg_color: string
  client_font_color: string
  client_header_bg_color: string
  google_trans_key: string
  lang: string
  adv: string
  is_bot: number
  style: string
  cs: Service[]
}
interface Service {
  service_id: number
  nick_name: string
  avatar: string
}
interface SendMessagePayload {
  text?: string
  images?: string[]
  video?: string | File
}
interface UseChatKefuOptions {
  id?: number
  type?: string
  businessId?: number
  kefuUrl?: string
  url?: string
  autoFetch?: boolean
}
interface EnsureTokenOptions {
  id?: number
  type?: string
  businessId?: number
  kefuUrl?: string
  url?: string
  userName?: string
  lang?: string
  sign?: string
  visiterId?: string
}

interface AwsSignResponse {
  accessKeyId: string
  dir: string
  domain: string
  expire: string
  host: string
  secretAccessKey: string
  sessionToken: string
}

interface NoticeResponse {
  service_id: number
  contents: string[]
  avatar: string
  nick_name: string
}

interface MessageItem {
  cid: number
  service_id: number
  timestamp: number
  state: 'readed' | 'unread'
  direction: 'to_visiter' | 'to_service'
  unstr: string
  type: number
  qid: number
  lang: string
  content?: string
  contents?: string
  avatar?: string
}

type CheckMessageResponse = Record<string, MessageItem>

export const useChatKefuService = createGlobalState((initialOptions: UseChatKefuOptions = {}) => {
  const options = reactive<UseChatKefuOptions>({
    id: initialOptions.id,
    type: initialOptions.type ?? 'h5',
    businessId: initialOptions.businessId,
    kefuUrl: initialOptions.kefuUrl,
    url: initialOptions.url,
    autoFetch: initialOptions.autoFetch ?? false,
  })

  const loading = ref(false)
  const token = ref(getKefuToken())
  const tokenExpired = ref<number | null>(/* httpStateManager.getState().tokenExpired */)
  const hasToken = computed(() => Boolean(token.value))
  const kefuBaseUrl = ref('')
  const { $$t } = useLocale()
  const adv = ref<string>('')
  const messageList = ref<{ name: string, content: string[], role: 'robot' | 'user' | 'date', time: string, cid: string, service_id?: number, avatar?: string }[]>([])
  const wsDisconnectHandlers = new Set<() => void>()
  const wsConnectHandlers = new Set<() => void>()
  const isBot = ref<boolean>(false)
  const isWsConnected = ref<boolean>(false)
  const wsUrl = ref<string>('')
  let serviceList: Service[] = []
  let serviceId: number = 0 // 当前客服id
  let userData: EnsureTokenOptions
  let previousTokenExpiredHandler: (() => void) | undefined
  let cid: string = '0'
  let lastDate: string = ''

  function getService(serviceId: number): Service {
    let service = serviceList.find(item => item.service_id === serviceId)
    if (!service) {
      service = {
        service_id: serviceId,
        nick_name: $$t('客服'),
        avatar: '',
      }
    }
    return service
  }

  function getAdv() {
    return adv.value
  }

  function getIsBot() {
    return isBot.value
  }

  /**
   * @description 是否可以發送消息(以防server延遲還沒有客服或者是本來就沒客服時還發消息)
   * @returns 是否可以發送消息
   */
  function getIsSend() {
    return true
    return isBot.value || (serviceId !== 0 && serviceId !== undefined)
  }

  function connectWs() {
    const ws = new ChatH5WebSocket(wsUrl.value, {
      onDisconnect: notifyWsDisconnectHandlers,
      onConnect: notifyWsConnectHandlers,
    })
    ws.onCustomMessage = (event, data) => {
      console.log('客服消息:', event, data)
    }
    ws.connect()
  }

  function applyToken(result: TokenResponse) {
    setKefuToken(result.hyperf_token)
    setKefuTokenExpired(result.hyperf_token_expired)
    setKefuVisiterId(result.visiter_id)
    token.value = result.hyperf_token
    tokenExpired.value = result.hyperf_token_expired
    wsUrl.value = result.wsUrl
    isBot.value = result.is_bot === 1
    adv.value = result.adv
    if (result.cs)
      serviceList = result.cs // 後端說有些service_id對應不到，就顯示個預設值（為什麼會對應不到我也不知道）
  }

  async function ensureToken(override?: EnsureTokenOptions) {
    loading.value = true
    cid = '0'
    lastDate = ''
    messageList.value = []
    userData = override as EnsureTokenOptions
    try {
      if (!override) {
        throw new Error('override URL is required')
      }

      const url = new URL(override.kefuUrl as string)
      const baseUrl = `${url.origin}`
      kefuBaseUrl.value = baseUrl
      const hashParams = new URLSearchParams(url.hash.split('?')[1] || '')
      const businessId = hashParams.get('business_id')
      const accessKey = hashParams.get('access_key')

      if (!businessId || !accessKey) {
        throw new Error('business_id and access_key are required in URL')
      }
      const response = await ApiGetToken({
        business_id: businessId,
        baseURL: baseUrl,
        access_key: accessKey,
        from_url: baseUrl,
        username: override.userName,
        lang: override.lang?.substring(0, 2) || override.lang,
        sign: override.sign,
        visiter_id: getKefuVisiterId(),
      }) as TokenResponse
      applyToken(response)
      return response
    }
    finally {
      loading.value = false
    }
  }

  async function getRobotSentence(sentence: string) {
    const response = await ApiRobotSentence({ baseURL: kefuBaseUrl.value, sentence }) as { answer: string, lastMessage?: string }

    if (response.lastMessage !== undefined) {
      // 呼叫真人客服
      isBot.value = false
      messageList.value = []
      // await sendNotice()
      sendMessage({ text: response.lastMessage })
    }
    else {
      // 機器人客服
      messageList.value.push({
        name: '',
        content: [response.answer],
        role: 'robot',
        time: formatTimestampToTime('time', Date.now()),
        cid: '0',
      })
      return response
    }
  }

  async function refreshToken() {
    loading.value = true
    try {
      const response = await ApiRefreshToken({ baseURL: kefuBaseUrl.value }) as TokenResponse
      setKefuToken(response.hyperf_token)
      tokenExpired.value = response.hyperf_token_expired
    }
    finally {
      loading.value = false
    }
  }

  async function checkIsNewQueue() {
    const response = await ApiCheckIsNewQueue({ baseURL: kefuBaseUrl.value })
    if (response)
      messageList.value = []
    return response
  }

  async function sendNotice() {
    connectWs()
    const response = await ApiSendNotice({ baseURL: kefuBaseUrl.value }) as NoticeResponse
    serviceId = response.service_id
    const time = formatTimestampToTime('time', Date.now())
    const date = formatTimestampToTime('date', Date.now())
    // 新增日期的部分
    messageList.value.push({
      name: '',
      content: [date],
      role: 'date',
      time,
      cid: '0',
    })
    messageList.value.push({
      name: getService(response.service_id).nick_name,
      avatar: getService(response.service_id).avatar,
      content: response.contents,
      role: 'robot',
      time,
      cid: '0',
      service_id: response.service_id,
    })
    await getPollingMessage()
    return response
  }

  async function sendMessage(payload: SendMessagePayload) {
    if (serviceId === 0 || !serviceId)
      await sendNotice()
    if (serviceId === 0 || !serviceId)
      return
    const imageUrls: string[] = []
    if (payload.images?.length) {
      for (const item of payload.images) {
        const file = await normalizeMediaItem(item, 'image')
        imageUrls.push(await uploadMediaToAws(file, 'image'))
      }
    }

    const videoUrl: string[] = []
    if (payload.video) {
      const videoFile = await normalizeMediaItem(payload.video, 'video')
      videoUrl.push(await uploadMediaToAws(videoFile, 'video'))
    }
    const response = await ApiSendMessage({
      baseURL: kefuBaseUrl.value,
      text: payload.text,
      images: imageUrls.length ? imageUrls : undefined,
      video: videoUrl.length ? videoUrl : undefined,
      service_id: serviceId,
    })

    // 把資料寫到messageList
    if (payload.text || imageUrls.length || videoUrl) {
      const contents: string[] = []
      if (payload.text)
        contents.push(payload.text)
      if (imageUrls.length)
        contents.push(...imageUrls.map(url => `<img src="${url}" alt="chat-image" class="max-w-full" />`))
      if (videoUrl.length)
        contents.push(`<video src="${videoUrl}" controls class="max-w-full"></video>`)
      messageList.value = [
        ...messageList.value,
        {
          name: userData?.userName ?? '',
          content: contents,
          role: 'user',
          time: formatTimestampToTime('time', Date.now()),
          cid: '-1', // 因為沒有cid，所以要從polling寫入
        },
      ]
    }

    return response
  }

  /**
   * @description 格式化時間戳
   * @param type 日期或時間格式
   * @param timestamp 時間戳
   * @returns 格式化字串
   */
  function formatTimestampToTime(type: 'date' | 'time', timestamp: number) {
    if (!timestamp && timestamp !== 0)
      return ''

    const milliseconds = timestamp < 1_000_000_000_000 ? timestamp * 1000 : timestamp
    const date = new Date(milliseconds)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    if (type === 'date') {
      const today = new Date()
      const isSameDay = today.getFullYear() === date.getFullYear()
        && today.getMonth() === date.getMonth()
        && today.getDate() === date.getDate()
      if (isSameDay)
        return $$t('今日')

      const monthNames = [
        $$t('一月'),
        $$t('二月'),
        $$t('三月'),
        $$t('四月'),
        $$t('五月'),
        $$t('六月'),
        $$t('七月'),
        $$t('八月'),
        $$t('九月'),
        $$t('十月'),
        $$t('十一月'),
        $$t('十二月'),
      ]
      const day = date.getDate()
      const monthLabel = monthNames[date.getMonth()]
      const base = `${day} ${monthLabel}`
      if (today.getFullYear() === date.getFullYear())
        return base

      return `${base} ${date.getFullYear()}`
    }
    else {
      return `${hours}:${minutes}`
    }
  }

  async function getPollingMessage() {
    const response = await ApiPollingMessage({ baseURL: kefuBaseUrl.value, cid })
    if (Array.isArray(response)) {
      if (cid === '0' && response.length > 0) {
        messageList.value = []
      }
      for (const item of response) {
        const time = formatTimestampToTime('time', item.timestamp)
        const date = formatTimestampToTime('date', item.timestamp)
        if (date !== lastDate) {
          lastDate = date
          messageList.value.push({
            name: '',
            content: [date],
            role: 'date',
            time,
            cid: '0',
          })
        }
        if (item.direction !== 'to_service') {
          // 客服的對話push
          messageList.value.push({
            name: getService(item.service_id).nick_name,
            avatar: getService(item.service_id).avatar,
            content: item.content === undefined ? item.contents : [item.content],
            role: 'robot',
            time,
            cid: item.cid,
            service_id: item.service_id,
          })
        }
        else {
          // 用戶的對話更新(因為client送出時已經加入messageList，只需更新cid)
          const pendingUserMessage = messageList.value.find(message => message.role === 'user' && message.cid === '-1')
          if (pendingUserMessage) {
            pendingUserMessage.cid = item.cid
          }
          else {
            messageList.value.push({
              name: userData?.userName ?? '',
              content: [item.content],
              role: 'user',
              time,
              cid: item.cid,
            })
          }
        }
      }
      // 更新cid，用於polling
      if (response.length > 0)
        cid = response[response.length - 1].cid
    }
    return response
  }

  async function getCheckMessage() {
    connectWs()
    const response = await ApiCheckMessage({ baseURL: kefuBaseUrl.value }) as CheckMessageResponse
    if (response) {
      messageList.value = []
      lastDate = ''

      for (const item of Object.values(response)) {
        const isServiceMessage = item.direction !== 'to_service'
        const timestamp = item.timestamp ?? Date.now()
        const time = formatTimestampToTime('time', timestamp)
        const date = formatTimestampToTime('date', timestamp)

        if (date && date !== lastDate) {
          lastDate = date
          messageList.value.push({
            name: '',
            content: [date],
            role: 'date',
            time,
            cid: '0',
          })
        }

        if (isServiceMessage) {
          serviceId = item.service_id
        }

        messageList.value.push({
          name: isServiceMessage ? getService(item.service_id).nick_name : userData?.userName ?? '',
          avatar: isServiceMessage ? getService(item.service_id).avatar : '',
          content: [String(item.content ?? item.contents ?? '')],
          role: isServiceMessage ? 'robot' : 'user',
          time,
          cid: String(item.cid),
          service_id: item.service_id,
        })
        cid = String(item.cid)
      }
      if (serviceId === 0) {
        await sendNotice()
      }
    }
    return response
  }

  function getMessageList() {
    return messageList.value
  }

  function registerWsDisconnectHandler(handler: () => void) {
    wsDisconnectHandlers.add(handler)
    return () => {
      wsDisconnectHandlers.delete(handler)
    }
  }

  function registerWsConnectHandler(handler: () => void) {
    wsConnectHandlers.add(handler)
    // 如果 WebSocket 已經連接，立即調用 handler
    if (isWsConnected.value) {
      try {
        handler()
      }
      catch (error) {
        console.error('[useChatKefuService] ws connect handler failed', error)
      }
    }
    return () => {
      wsConnectHandlers.delete(handler)
    }
  }

  function notifyWsDisconnectHandlers() {
    isWsConnected.value = false
    wsDisconnectHandlers.forEach((handler) => {
      try {
        handler()
      }
      catch (error) {
        console.error('[useChatKefuService] ws disconnect handler failed', error)
      }
    })
  }

  function notifyWsConnectHandlers() {
    isWsConnected.value = true
    wsConnectHandlers.forEach((handler) => {
      try {
        handler()
      }
      catch (error) {
        console.error('[useChatKefuService] ws connect handler failed', error)
      }
    })
  }

  async function registerTokenExpiredListener() {
    previousTokenExpiredHandler = window.onTokenExpired
    window.onTokenExpired = async () => {
      try {
        await refreshToken()
      }
      catch (error) {
        console.error('[useChatKefuService] refresh token failed', error)
        token.value = ''
        tokenExpired.value = null
      }
      finally {
        previousTokenExpiredHandler?.()
      }
    }
  }

  function generateRandomKey(prefix = '') {
    let random: string
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
      random = crypto.randomUUID().replace(/-/g, '')
    else
      random = Math.random().toString(36).slice(2) + Date.now().toString(36)

    return `${prefix}${random}`
  }

  async function normalizeMediaItem(item: string | File, type: 'image' | 'video') {
    if (item instanceof File)
      return item

    if (typeof item === 'string') {
      try {
        const response = await fetch(item)
        const blob = await response.blob()
        const mime = blob.type || (type === 'image' ? 'image/png' : 'video/mp4')
        const extension = mime.split('/')[1] ?? (type === 'image' ? 'png' : 'mp4')
        const fileName = `${type}-${Date.now()}.${extension}`
        return new File([blob], fileName, { type: mime })
      }
      catch (error) {
        console.error('[useChatKefuService] normalize media 失敗', error)
        throw new Error('媒體格式無法解析')
      }
    }

    throw new Error('不支援的媒體類型')
  }

  async function uploadMediaToAws(file: File, type: 'image' | 'video') {
    if (!kefuBaseUrl.value)
      throw new Error('[useChatKefuService] 未找到 baseURL,無法上傳檔案')

    const signResponse = await ApiAwsSign(type, { baseURL: kefuBaseUrl.value }) as AwsSignResponse

    if (!signResponse)
      throw new Error('[useChatKefuService] AWS 簽名資料為空')

    const host = signResponse.host
    const match = host.match(/https?:\/\/([\w-]+)\.s3\.([\w-]+)\.amazonaws\.com/i)
    const bucket = match?.[1]
    const region = match?.[2]

    if (!bucket || !region)
      throw new Error('[useChatKefuService] AWS 簽名缺少 bucket 或 region 資訊')

    const dir = signResponse.dir.replace(/^\/+|\/+$/g, '')
    const extension = file.name.split('.').pop() ?? (type === 'image' ? 'png' : 'mp4')
    const key = dir ? `${dir}/${generateRandomKey()}.${extension}` : `${generateRandomKey()}.${extension}`

    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: signResponse.accessKeyId,
        secretAccessKey: signResponse.secretAccessKey,
        sessionToken: signResponse.sessionToken,
      },
    })

    const body = new Uint8Array(await file.arrayBuffer())

    try {
      await s3.send(new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
        ContentType: file.type,
      }))
    }
    catch (error: any) {
      console.error('[AWS S3] 上傳失敗:', {
        error: error.message,
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        bucket,
        key,
        region,
      })
      throw error
    }

    const canonicalUrl = `${signResponse.domain}/${key}`
    return canonicalUrl
  }

  function cleanupTokenExpiredListener() {
    if (previousTokenExpiredHandler) {
      window.onTokenExpired = previousTokenExpiredHandler
    }
    else {
      delete window.onTokenExpired
    }
    previousTokenExpiredHandler = undefined
  }

  function updateOptions(newOptions: UseChatKefuOptions) {
    if (newOptions.id !== undefined)
      options.id = newOptions.id
    if (newOptions.type !== undefined)
      options.type = newOptions.type
    if (newOptions.businessId !== undefined)
      options.businessId = newOptions.businessId
    if (newOptions.kefuUrl !== undefined)
      options.kefuUrl = newOptions.kefuUrl
    if (newOptions.url !== undefined)
      options.url = newOptions.url
    if (newOptions.autoFetch !== undefined)
      options.autoFetch = newOptions.autoFetch
  }

  onMounted(() => {
    registerTokenExpiredListener()
  })

  onBeforeUnmount(() => {
    cleanupTokenExpiredListener()
  })

  return {
    loading,
    token,
    tokenExpired,
    hasToken,
    ensureToken,
    refreshToken,
    updateOptions,
    getPollingMessage,
    getCheckMessage,
    checkIsNewQueue,
    sendNotice,
    sendMessage,
    getMessageList,
    getService,
    registerWsDisconnectHandler,
    registerWsConnectHandler,
    getRobotSentence,
    getIsBot,
    getIsSend,
    getAdv,
  }
})

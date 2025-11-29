interface ChatH5WebSocketOptions {
  onDisconnect?: () => void
  onConnect?: () => void
}

export class ChatH5WebSocket {
  private url: string
  private ws: WebSocket | null = null
  private heartbeatTimer: any
  private activityTimeout: number
  private shouldReconnect: boolean
  private options?: ChatH5WebSocketOptions

  public onCustomMessage?: (event: string, data: any) => void

  constructor(url: string, options?: ChatH5WebSocketOptions) {
    this.url = `wss://${url}`
    this.ws = null
    this.heartbeatTimer = null
    this.activityTimeout = 0
    this.shouldReconnect = true // 会被 idle_refresh/disconnection 强制改为 false
    this.options = options
  }

  connect() {
    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('ChatH5WebSocket 连接成功')
      this.options?.onConnect?.()
    }

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data)
    }

    this.ws.onerror = (err) => {
      console.error('ChatH5WebSocket 错误', err)
    }

    this.ws.onclose = () => {
      console.log('ChatH5WebSocket 关闭')
      this.stopHeartbeat()

      if (this.shouldReconnect) {
        console.log('准备重连...')
        setTimeout(() => this.connect(), 3000)
      }
    }
  }

  // 处理收到的消息
  handleMessage(raw: string) {
    let msg = null

    try {
      msg = JSON.parse(raw)
    }
    catch (e) {
      console.error('解析失败', raw)
      return
    }

    const event = msg.event
    let data: { [k: string]: any } = {}

    // data 是字符串形式，需要再 parse
    if (typeof msg.data === 'string') {
      try {
        data = JSON.parse(msg.data)
      }
      catch (e) {
        data = msg.data
      }
    }
    else {
      data = msg.data
    }

    console.log('收到事件:', event, data)

    switch (event) {
      case 'pusher:connection_established':

        this.activityTimeout = data.activity_timeout
        this.startHeartbeat()
        break

      case 'pusher:pong':
        // 心跳确认，不需要做事
        break

      case 'pusher:idle_refresh':
      case 'pusher:disconnection':

        this.shouldReconnect = false
        this.options?.onDisconnect?.()
        this.close()
        break

      default:
        // 其它客服消息
        this.onCustomMessage?.(event, data)
    }
  }

  // 发送消息
  send(event: string, data = {}) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, data }))
    }
  }

  // 心跳机制
  startHeartbeat() {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      this.send('pusher:ping', {})
    }, this.activityTimeout * 1000)

    console.log('心跳启动，每', this.activityTimeout, '秒发送 ping')
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  close() {
    this.stopHeartbeat()
    if (this.ws) {
      this.ws.close()
    }
  }
}

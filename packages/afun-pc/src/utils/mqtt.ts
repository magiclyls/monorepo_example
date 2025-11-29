import { type MqttClient as TMqttClient } from 'precompiled-mqtt'
import type { MqttCallbackParamType } from './mqttCallback'

/**
 * ws://34.92.35.218:8088
 * user = "rmqtt", password = "www.123.com",
 */

type TMqttProtocol = 'wss' | 'ws' | 'mqtt' | 'mqtts' | 'tcp' | 'ssl' | 'wx' | 'wxs'
type TMqttServer = Array<{
  host: string
  port: number
  protocol?: TMqttProtocol
}>

const mqttMsgCallbacks: {
  [p: string]: ({ topic, message }: MqttCallbackParamType) => void
} = {}

export class SocketClient {
  client: TMqttClient | null = null

  subscribeList: string[] = []

  /** 上一次连接登录状态 */
  lastLoginStatus: boolean | null = null

  #MQTT_SERVER: TMqttServer | null = null

  #log = (message: string, ...rest: any) => {
    console.log(`%c Mqtt ${message}`, 'color: #e10d8a', ...rest)
  }

  constructor(SOCKET_URL_LIST_STRING: string) {
    this.#log('实例化')
    this.generateMQTT_SERVER(SOCKET_URL_LIST_STRING)
  }

  /** 生成 #MQTT_SERVER */
  public generateMQTT_SERVER(SOCKET_URL_LIST_STRING: string) {
    const VITE_SOCKET_URL_LIST_STRING = SOCKET_URL_LIST_STRING

    if (!VITE_SOCKET_URL_LIST_STRING) {
      this.#MQTT_SERVER = null
      return
    }

    const list = VITE_SOCKET_URL_LIST_STRING.split(',')
    const result: TMqttServer = []

    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      const [protocol, host, port] = item.split('|')

      if (!host || !port) {
        this.#log('请在 env文件中 配置连接地址')
        return
      }

      result.push({
        host,
        port: Number(port),
        protocol: protocol as TMqttProtocol,
      })
    }

    this.#MQTT_SERVER = result
  }

  /** 断开重新连接 */
  public endOrConnect() {
    if (this.client != null) {
      this.#log('已经连接, 断开连接中...')
      appEventBus.emit(EventBusNames.MQTT_DISCONNECT_BUS, true)
      const opts: any = null
      this.client.end(true, opts, () => {
        this.connect('断开 重新连接')
      })
    }
  }

  public async connect(msg: string) {
    this.#log('MQTT CONNECT', msg)
    if (this.#MQTT_SERVER) {
      const { userInfo, isLogin } = storeToRefs(useAppStore())

      if (this.lastLoginStatus === null)
        this.lastLoginStatus = isLogin.value

      if (this.lastLoginStatus === isLogin.value) {
        if (this.client != null) {
          this.#log('登录状态相同，且已经连接过，不执行连接', msg)
          return
        }
      }
      else {
        this.lastLoginStatus = isLogin.value
        this.endOrConnect()
        return
      }

      this.#log('连接中...')

      // 随机生成10位的 客户端ID
      const r = Math.random().toString(36).slice(-10)
      // const login_r = Local.get(STORAGE_LOGIN_MQTT_ID)?.value
      const clientId = (isLogin.value && userInfo.value?.uid)
        ? `${userInfo.value?.uid}-${Math.floor(Math.random() * 100)}`
        : `web-random-${r}`
      this.#log('clientId', clientId)

      import('precompiled-mqtt').then((mqtt) => {
        // const { VITE_SOCKET_USERNAME, VITE_SOCKET_PASSWORD } = getEnv()
        this.client = mqtt.connect({
          // username: VITE_SOCKET_USERNAME,
          // password: VITE_SOCKET_PASSWORD,
          keepalive: 20,
          clientId,
          servers: this.#MQTT_SERVER!,
        })
        this.eventHandler()
      })
    }
    else {
      this.#log('请在 env文件中 配置连接地址')
    }
  }

  /**
   * @param subscribeEvent 订阅的频道
   * @param options callback 收到mqtt消息时候的回调函数 successFn 订阅成功的回调函数
   */
  public addSubscribe(subscribeEvent: string, options: { successFn?: () => void; callback: ({ topic, message }: MqttCallbackParamType) => void }) {
    this.#log('开始订阅', subscribeEvent)
    if (this.client != null && subscribeEvent) {
      this.client.subscribe(subscribeEvent, { qos: 2 }, (error, granted) => {
        if (error) {
          this.#log(`订阅失败${subscribeEvent}`, error)
        }
        else {
          this.#log('订阅成功', granted)
          if (options.successFn)
            options.successFn()
          this.subscribeList.push(subscribeEvent)
          if (!mqttMsgCallbacks[subscribeEvent])
            mqttMsgCallbacks[subscribeEvent] = options.callback
        }
      })
    }
  }

  public removeSubscribe(subscribeEvent: string, successFn?: () => void) {
    if (this.client != null && subscribeEvent) {
      this.client.unsubscribe(subscribeEvent, (error: any) => {
        if (error) {
          this.#log('取消订阅失败', error)
        }
        else {
          this.#log(`取消订阅成功 ${subscribeEvent}`)
          const index = this.subscribeList.indexOf(subscribeEvent)
          if (index > -1)
            this.subscribeList.splice(index, 1)

          if (successFn)
            successFn()
          delete mqttMsgCallbacks[subscribeEvent]
        }
      })
    }
  }

  public eventHandler() {
    if (this.client != null) {
      this.client.on('connect', (arg) => {
        this.#log('连接成功', 'Info: ', arg)
        appEventBus.emit(EventBusNames.MQTT_CONNECT_SUCCESS_BUS, true)
      })

      this.client.on('message', (topic, _message, packet) => {
        // const message = CBOR.decode(uint8ArrayToArrayBuffer(_message))
        const message = packet.payload
        if (mqttMsgCallbacks[topic]) {
          const strMsg = message.toString()
          let parsedMsg
          try {
            parsedMsg = JSON.parse(strMsg)
          }
          catch (error) {
            parsedMsg = void 0
            this.#log('收到消息解析失败 -- 返回字符串', strMsg)
          }
          mqttMsgCallbacks[topic]({ topic, message: { origin: strMsg, parsed: parsedMsg } })
        }

        if (!topic.includes('sport/delta') && !topic.includes('crash')) {
          this.#log(`收到消息Topic：${topic}`)
          this.#log(`收到消息Message：${message}`)
          this.#log('收到消息Packet：', packet)
        }
      })

      this.client.on('error', (error) => {
        this.#log(`发生错误：${error}`)
      })

      this.client.on('offline', () => {
        this.#log('离线')
      })

      this.client.on('disconnect', (disconnectInfo) => {
        this.#log('断开连接', disconnectInfo)
        this.client = null
      })

      this.client.on('reconnect', () => {
        this.#log('重新连接')
      })

      this.client.on('end', () => {
        this.#log('连接结束')
        this.client = null
      })

      this.client.on('close', () => {
        this.#log('连接关闭')
        // 连接关闭是会自动重连的
        // this.client = null
      })

      this.client.on('outgoingEmpty', () => {
        this.#log('发送队列为空')
      })

      this.client.on('packetreceive', (packetreceiveInfo) => {
        // this.#log('收到数据包 《《《《《《《《《《《', packetreceiveInfo)
      })

      this.client.on('packetsend', (packetsendInfo) => {
        // this.#log('发送数据包 》》》》》》》》》》》', packetsendInfo)
      })
    }
  }

  /** 关闭mqtt连接 */
  close() {
    if (this.client != null) {
      const opts: any = null
      this.client.end(true, opts)
    }
  }
}

const { VITE_SOCKET_URL_LIST_STRING } = getEnv()
export const socketClient = new SocketClient(VITE_SOCKET_URL_LIST_STRING)
// export const socketClientMini = new SocketClient(VITE_SOCKET_URL_LIST_STRING_MINI)
